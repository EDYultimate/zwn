package cn.lonwin.module.knowledge.retrieve;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.api.KnowledgeException;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import lombok.extern.slf4j.Slf4j;

/**
 * BGE-M3 推理服务客户端（独立 Python 进程，见 lonwin-module-agent/knowledge/embedding-service）。
 *
 * <p>一次 {@code POST /encode} 同时拿到 dense 向量与 sparse 词法权重，
 * 正好对应 Qdrant 里同一个 point 的两个命名向量。
 *
 * <p>两个 RestTemplate：在线查询用短超时（不能拖慢问答），
 * 批量入库用长超时（16 条 512 token 编码可能几十秒），互不干扰。
 *
 * <p>本类是<b>普通对象</b>，由 {@code KnowledgeConfiguration} / 索引服务显式创建，
 * 避免与外部同名类型冲突，也方便单元测试直接替换成 mock。
 */
@Slf4j
public class BgeM3Client {

    private final KnowledgeProperties config;
    private final RestTemplate queryRestTemplate;
    private final RestTemplate indexRestTemplate;
    private final ObjectMapper objectMapper;

    public BgeM3Client(KnowledgeProperties config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;
        int connect = Math.max(1, config.getConnectTimeoutSeconds());
        this.queryRestTemplate = new RestTemplate(factory(connect,
                Math.max(1, config.getReadTimeoutSeconds())));
        this.indexRestTemplate = new RestTemplate(factory(connect,
                Math.max(60, config.getIndex().getEncodeTimeoutSeconds())));
    }

    /** 把查询文本编码成 dense + sparse 两路向量 */
    public QueryVector encode(String text) {
        List<QueryVector> result = doEncode(List.of(text), queryRestTemplate);
        if (result.isEmpty()) {
            throw new KnowledgeException("BGE-M3 /encode 未返回 results[0]");
        }
        return result.get(0);
    }

    /** 批量编码，供上传即入库链路使用；返回顺序与输入一致 */
    public List<QueryVector> encodeBatch(List<String> texts) {
        if (texts == null || texts.isEmpty()) {
            return List.of();
        }
        return doEncode(texts, indexRestTemplate);
    }

    private List<QueryVector> doEncode(List<String> texts, RestTemplate restTemplate) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (StringUtils.hasText(config.getEmbedApiKey())) {
            // 与 Qdrant 共用同样的 `api-key` 头名称，运维只记一个密钥
            headers.set("api-key", config.getEmbedApiKey());
        }
        Map<String, Object> body = Map.of("texts", texts);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    trimTrailingSlash(config.getEmbedUrl()) + "/encode",
                    new HttpEntity<>(body, headers), String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode results = root.path("results");
            if (!results.isArray() || results.size() != texts.size()) {
                throw new KnowledgeException("BGE-M3 返回编码条数与输入不一致：期望 "
                        + texts.size() + " 实际 " + results.size());
            }
            String embedderId = root.path("embedderId").asText("");
            if (!config.getEmbedderId().isBlank() && !config.getEmbedderId().equals(embedderId)) {
                log.warn("[kb] embedderId 不一致：服务={} 配置={}，如已更换模型请重灌向量库",
                        embedderId, config.getEmbedderId());
            }
            List<QueryVector> vectors = new ArrayList<>(results.size());
            for (JsonNode node : results) {
                List<Double> dense = objectMapper.convertValue(node.path("dense"),
                        new TypeReference<List<Double>>() { });
                List<Integer> indices = objectMapper.convertValue(node.path("indices"),
                        new TypeReference<List<Integer>>() { });
                List<Double> values = objectMapper.convertValue(node.path("values"),
                        new TypeReference<List<Double>>() { });
                if (dense == null || dense.isEmpty()) {
                    throw new KnowledgeException("BGE-M3 返回的 dense 向量为空");
                }
                if (indices == null || values == null || indices.size() != values.size()) {
                    throw new KnowledgeException("BGE-M3 返回的 sparse 向量 indices/values 不匹配");
                }
                vectors.add(new QueryVector(dense, indices, values, dense.size(), embedderId));
            }
            return vectors;
        } catch (KnowledgeException e) {
            throw e;
        } catch (Exception e) {
            throw new KnowledgeException("BGE-M3 推理服务不可用（" + config.getEmbedUrl() + "）："
                    + e.getMessage(), e);
        }
    }

    private static SimpleClientHttpRequestFactory factory(int connectSeconds, int readSeconds) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(connectSeconds));
        factory.setReadTimeout(Duration.ofSeconds(readSeconds));
        return factory;
    }

    private static String trimTrailingSlash(String url) {
        return url != null && url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    /** 查询/入库向量：dense 与 sparse 必须来自同一次编码，才能对上 Qdrant 的命名向量 */
    public record QueryVector(List<Double> dense, List<Integer> indices, List<Double> values,
                              int dimension, String embedderId) { }
}
