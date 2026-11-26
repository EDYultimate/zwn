package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import cn.lonwin.module.video.entity.VideoSnapshotDetectEntity;
import cn.lonwin.module.video.model.dto.CapturedSnapshot;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

/**
 * 异常图片智能识别服务（对接 YOLO 多模型检测服务）。
 * <p>
 * 流程：
 * <ol>
 *   <li>把截取的图片以 base64 调 {@code POST /api/v1/detect}，按配置的 model_ids 做目标检测；</li>
 *   <li>解析 class_counts / detections，命中 {@code lonwin.spjk.detect-abnormal-labels}
 *       （默认 person / bicycle / car / truck / boat）即判定为「异常抓拍」；</li>
 *   <li>异常图片再调 {@code POST /api/v1/annotate} 生成标注图，与截图存到同一位置；</li>
 *   <li>识别详情写入 VIDEO_SNAPSHOT_DETECT（异常图片识别要素表）。</li>
 * </ol>
 * 检测服务不可用时只告警，不影响截图主流程。
 */
@Slf4j
@Service
public class VideoDetectService {

    /** 目标检测接口 */
    private static final String PATH_DETECT = "/api/v1/detect";

    /** 标注渲染接口 */
    private static final String PATH_ANNOTATE = "/api/v1/annotate";

    /** 标注图线宽与字号（像素） */
    private static final int ANNOTATE_LINE_WIDTH = 2;

    private static final int ANNOTATE_FONT_SIZE = 32;

    private static final int SUMMARY_MAX_LENGTH = 1000;

    private static final int LABELS_MAX_LENGTH = 500;

    private static final int ERROR_MAX_LENGTH = 1000;

    /** 日志中拼接响应体片段的长度 */
    private static final int RESPONSE_SNIPPET_MAX_LENGTH = 300;

    private final VideoProperties props;

    private final VideoDetectRecordService recordService;

    private final HttpClient httpClient;

    public VideoDetectService(VideoProperties props, VideoDetectRecordService recordService) {
        this.props = props;
        this.recordService = recordService;
        // 必须固定 HTTP/1.1：JDK HttpClient 默认 HTTP/2，对明文 http:// 会先发 h2c 升级请求，
        // 检测服务（FastAPI/uvicorn）不认升级头，请求体收不到，固定返回 422
        // {"detail":[{"type":"missing","loc":["body"],"msg":"Field required","input":null}]}
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(props.getConnectTimeoutSeconds()))
                .build();
    }

    /**
     * 识别结果：识别记录 + 已保存的标注图（正常或无图时为 null）。
     * <p>
     * 调用方拿 {@link #annotated()} 另存一条「异常抓拍」抓拍记录，
     * 原始定时抓拍保持 group=timed 不变，页面因此同时有定时拍摄和异常抓拍两张图。
     */
    public record DetectOutcome(VideoSnapshotDetectEntity record,
                                VideoSnapshotStorageService.StoredSnapshot annotated) {
    }

    /**
     * 对一张截图做目标检测，异常时生成标注图，并把识别详情落库。
     *
     * @return 识别结果；未开启识别、图片为空或检测服务不可用时返回 null
     */
    public DetectOutcome analyze(CapturedSnapshot captured) {
        if (!props.isDetectEnabled() || captured == null
                || captured.image() == null || captured.image().length == 0) {
            return null;
        }
        JSONObject resp;
        try {
            resp = post(PATH_DETECT, buildDetectBody(captured));
        } catch (Exception e) {
            log.warn("异常图片识别失败：{}({}) - {}",
                    captured.pointName(), captured.pointCode(), e.getMessage());
            return null;
        }
        if (resp == null || !Boolean.TRUE.equals(resp.getBoolean("success"))) {
            log.warn("异常图片识别返回失败：{}({}) - {}", captured.pointName(), captured.pointCode(),
                    resp == null ? "检测接口无响应" : errorText(resp));
            return null;
        }
        VideoSnapshotDetectEntity entity = newEntity(captured);
        fillResult(entity, resp);
        VideoSnapshotStorageService.StoredSnapshot annotated = null;
        if (Integer.valueOf(1).equals(entity.getIsAbnormal())) {
            annotated = renderAnnotated(captured, resp.getJSONArray("detections"), entity);
        }
        recordService.save(entity);
        return new DetectOutcome(entity, annotated);
    }

    // ==================== 私有方法 ====================

    /** 组装 /api/v1/detect 请求体 */
    private JSONObject buildDetectBody(CapturedSnapshot captured) {
        JSONObject body = new JSONObject();
        body.put("image", imageNode(captured));
        body.put("confidence_threshold", props.getDetectConfidenceThreshold());
        body.put("max_detections", props.getDetectMaxDetections());
        if (props.getDetectTargetClasses() != null && !props.getDetectTargetClasses().isEmpty()) {
            body.put("target_classes", props.getDetectTargetClasses());
        }
        if (props.getDetectModelIds() != null && !props.getDetectModelIds().isEmpty()) {
            body.put("model_ids", props.getDetectModelIds());
        }
        return body;
    }

    private JSONObject imageNode(CapturedSnapshot captured) {
        JSONObject image = new JSONObject();
        image.put("image_base64", Base64.getEncoder().encodeToString(captured.image()));
        image.put("image_format", imageFormat(captured.imageFormat()));
        return image;
    }

    /** 把检测返回填充到识别记录 */
    private void fillResult(VideoSnapshotDetectEntity entity, JSONObject resp) {
        entity.setDetectSuccess(1);
        entity.setImageWidth(resp.getInteger("image_width"));
        entity.setImageHeight(resp.getInteger("image_height"));
        entity.setTotalCount(resp.getInteger("total_count"));
        entity.setSummary(truncate(resp.getString("summary"), SUMMARY_MAX_LENGTH));
        entity.setInferenceTimeMs(resp.getDouble("inference_time_ms"));

        JSONArray models = resp.getJSONArray("models_used");
        if (models != null && !models.isEmpty()) {
            entity.setModelsUsed(String.join(",", models.toJavaList(String.class)));
        }
        JSONObject classCounts = resp.getJSONObject("class_counts");
        if (classCounts != null) {
            entity.setClassCounts(classCounts.toJSONString());
        }
        JSONArray detections = resp.getJSONArray("detections");
        if (detections != null) {
            entity.setDetectDetail(detections.toJSONString());
        }

        List<String> hits = matchAbnormalLabels(classCounts, detections);
        entity.setIsAbnormal(hits.isEmpty() ? 0 : 1);
        entity.setAbnormalLabels(truncate(String.join(",", hits), LABELS_MAX_LENGTH));
    }

    /** 命中异常类别（class_counts 优先，缺失时回退 detections 明细） */
    private List<String> matchAbnormalLabels(JSONObject classCounts, JSONArray detections) {
        Set<String> wanted = new LinkedHashSet<>();
        if (props.getDetectAbnormalLabels() != null) {
            for (String label : props.getDetectAbnormalLabels()) {
                if (label != null && !label.isBlank()) {
                    wanted.add(label.trim().toLowerCase(Locale.ROOT));
                }
            }
        }
        List<String> hits = new ArrayList<>();
        if (wanted.isEmpty()) {
            return hits;
        }
        if (classCounts != null) {
            for (String label : classCounts.keySet()) {
                if (label != null && wanted.contains(label.trim().toLowerCase(Locale.ROOT))
                        && !hits.contains(label)) {
                    hits.add(label);
                }
            }
        }
        if (hits.isEmpty() && detections != null) {
            for (int i = 0; i < detections.size(); i++) {
                JSONObject detection = detections.getJSONObject(i);
                String label = detection == null ? null : detection.getString("label");
                if (label != null && wanted.contains(label.trim().toLowerCase(Locale.ROOT))
                        && !hits.contains(label)) {
                    hits.add(label);
                }
            }
        }
        return hits;
    }

    /**
     * 调用 /api/v1/annotate 生成标注图并保存（失败只告警）。
     *
     * @return 已保存的标注图；未开启标注 / 渲染失败时返回 null
     */
    private VideoSnapshotStorageService.StoredSnapshot renderAnnotated(
            CapturedSnapshot captured, JSONArray detections, VideoSnapshotDetectEntity entity) {
        if (!props.isDetectAnnotate() || detections == null || detections.isEmpty()) {
            return null;
        }
        try {
            JSONObject body = new JSONObject();
            body.put("image", imageNode(captured));
            body.put("detections", detections);
            JSONObject style = new JSONObject();
            style.put("line_width", ANNOTATE_LINE_WIDTH);
            style.put("font_size", ANNOTATE_FONT_SIZE);
            style.put("show_confidence", true);
            body.put("style", style);

            JSONObject resp = post(PATH_ANNOTATE, body);
            if (resp == null || !Boolean.TRUE.equals(resp.getBoolean("success"))) {
                log.warn("标注图生成失败：{}({}) - {}", captured.pointName(), captured.pointCode(),
                        resp == null ? "标注接口无响应" : errorText(resp));
                return null;
            }
            String base64 = resp.getString("annotated_image_base64");
            if (base64 == null || base64.isBlank()) {
                log.warn("标注接口未返回图片：{}({})", captured.pointName(), captured.pointCode());
                return null;
            }
            byte[] data = Base64.getDecoder().decode(base64);
            VideoSnapshotStorageService.StoredSnapshot stored =
                    recordService.storeAnnotated(captured, data);
            entity.setAnnotatedPath(stored.path());
            entity.setAnnotatedUrl(stored.url());
            return stored;
        } catch (Exception e) {
            log.warn("标注图保存失败：{}({}) - {}",
                    captured.pointName(), captured.pointCode(), e.getMessage());
            entity.setErrorMsg(truncate("标注图生成失败：" + e.getMessage(), ERROR_MAX_LENGTH));
            return null;
        }
    }

    private VideoSnapshotDetectEntity newEntity(CapturedSnapshot captured) {
        VideoSnapshotDetectEntity entity = new VideoSnapshotDetectEntity();
        entity.setId(UUID.randomUUID().toString().replace("-", ""));
        entity.setSnapshotId(captured.snapshotId());
        entity.setPointCode(captured.pointCode());
        entity.setPointName(captured.pointName());
        entity.setGroupCode(captured.group());
        entity.setCaptureDate(captured.day());
        entity.setCaptureTime(captured.captureTime() == null
                ? LocalDateTime.now() : captured.captureTime());
        entity.setDetectSuccess(0);
        entity.setIsAbnormal(0);
        entity.setCreateTime(LocalDateTime.now());
        return entity;
    }

    /** 检测服务 JSON 请求：非 2xx 直接把状态码与响应体抛给调用方，便于定位问题 */
    private JSONObject post(String path, JSONObject body) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl() + path))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(props.getDetectTimeoutSeconds()))
                .POST(HttpRequest.BodyPublishers.ofString(body.toJSONString(),
                        StandardCharsets.UTF_8))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            String text = response.body();
            int status = response.statusCode();
            if (status < 200 || status >= 300) {
                throw new IllegalStateException("目标检测接口返回 HTTP " + status + "："
                        + truncate(text, RESPONSE_SNIPPET_MAX_LENGTH));
            }
            JSONObject json = JSON.parseObject(text);
            if (json == null) {
                throw new IllegalStateException("目标检测接口返回内容不是 JSON："
                        + truncate(text, RESPONSE_SNIPPET_MAX_LENGTH));
            }
            return json;
        } catch (HttpTimeoutException e) {
            throw new IllegalStateException("目标检测接口请求超时：" + path, e);
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("目标检测接口请求失败：" + path
                    + " - " + e.getMessage(), e);
        }
    }

    /** 失败原因：FastAPI 校验错误放在 detail，业务错误放在 message */
    private String errorText(JSONObject resp) {
        String message = resp.getString("message");
        if (message == null || message.isBlank()) {
            message = resp.getString("detail");
        }
        return message == null || message.isBlank()
                ? truncate(resp.toJSONString(), RESPONSE_SNIPPET_MAX_LENGTH) : message;
    }

    private String baseUrl() {
        String base = props.getDetectBaseUrl() == null ? "" : props.getDetectBaseUrl().trim();
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base;
    }

    private String imageFormat(String format) {
        return format == null || format.isBlank() ? "jpg" : format.trim().toLowerCase(Locale.ROOT);
    }

    private String truncate(String value, int max) {
        if (value == null) {
            return null;
        }
        return value.length() <= max ? value : value.substring(0, max);
    }
}
