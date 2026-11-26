package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 视频点位在线状态本地记录。
 * <p>
 * 外部数据库（tr_Spd）的在线状态不准确且不允许修改，这里把截图实测结果落到本地 JSON 文件：
 * 定时截图成功即认为该点位「在线」，失败记为「离线」，页面查询列表时优先使用本地结果，
 * 本地没有记录的点位仍回退到数据库原始 STATE。
 * <p>
 * 状态只存在内存，由截图任务在一轮结束后统一刷盘，避免逐点位写文件。
 */
@Slf4j
@Service
public class VideoOnlineStateService {

    /** 状态文件名（位于截图根目录，与按日期分目录的截图互不干扰） */
    public static final String FILE_NAME = "online-status.json";

    private static final DateTimeFormatter DATE_TIME =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final VideoProperties props;

    /** 点位编码（小写）→ 最近一次截图实测状态 */
    private final Map<String, State> states = new ConcurrentHashMap<>();

    private final AtomicBoolean dirty = new AtomicBoolean(false);

    public VideoOnlineStateService(VideoProperties props) {
        this.props = props;
        load();
    }

    /** 单个点位的最近一次截图实测状态 */
    public record State(boolean online, long timestamp, String reason) {

        /** 状态时间（yyyy-MM-dd HH:mm:ss），便于排查 */
        public String timeText() {
            return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault())
                    .format(DATE_TIME);
        }
    }

    /** 记录截图成功（能截到帧说明摄像头在线） */
    public void markOnline(String code) {
        mark(code, true, "截图成功");
    }

    /** 记录截图失败（拉流失败/取帧失败，视为离线） */
    public void markOffline(String code, String reason) {
        mark(code, false, reason == null ? "截图失败" : reason);
    }

    /** 记录点位状态（仅更新内存，等待 {@link #sync()} 落盘） */
    public void mark(String code, boolean online, String reason) {
        if (code == null || code.isBlank()) {
            return;
        }
        states.put(key(code), new State(online, System.currentTimeMillis(), reason));
        dirty.set(true);
    }

    /**
     * 本地实测的在线状态。
     *
     * @return null 表示本地还没有该点位的记录（调用方应回退到数据库状态）
     */
    public Boolean isOnline(String code) {
        State state = get(code);
        return state == null ? null : state.online();
    }

    /** 点位最近一次实测状态，无记录返回 null */
    public State get(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        return states.get(key(code));
    }

    /** 把内存状态写入本地文件（有变化才写） */
    public synchronized void sync() {
        if (!dirty.getAndSet(false)) {
            return;
        }
        Path file = stateFile();
        try {
            Path dir = file.getParent();
            if (dir != null && !Files.isDirectory(dir)) {
                Files.createDirectories(dir);
            }
            JSONObject items = new JSONObject();
            states.forEach((code, state) -> {
                JSONObject item = new JSONObject();
                item.put("online", state.online());
                item.put("time", state.timestamp());
                item.put("timeText", state.timeText());
                item.put("reason", state.reason());
                items.put(code, item);
            });
            JSONObject root = new JSONObject();
            root.put("updatedAt", LocalDateTime.now().format(DATE_TIME));
            root.put("states", items);

            Path tmp = file.resolveSibling(FILE_NAME + ".tmp");
            Files.writeString(tmp, root.toJSONString(), StandardCharsets.UTF_8);
            try {
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING,
                        StandardCopyOption.ATOMIC_MOVE);
            } catch (Exception e) {
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (Exception e) {
            dirty.set(true);
            log.warn("保存本地在线状态文件失败：{} - {}", file, e.getMessage());
        }
    }

    // ==================== 私有方法 ====================

    /** 状态文件路径：{截图根目录}/online-status.json */
    private Path stateFile() {
        return Paths.get(props.getEffectiveSavePath()).toAbsolutePath().normalize()
                .resolve(FILE_NAME);
    }

    /** 启动时加载历史状态，避免重启后页面状态全部回退到数据库 */
    private void load() {
        Path file = stateFile();
        if (!Files.isRegularFile(file)) {
            return;
        }
        try {
            JSONObject root = JSON.parseObject(Files.readString(file, StandardCharsets.UTF_8));
            JSONObject items = root == null ? null : root.getJSONObject("states");
            if (items == null) {
                return;
            }
            for (Map.Entry<String, Object> entry : items.entrySet()) {
                if (!(entry.getValue() instanceof JSONObject item)) {
                    continue;
                }
                Boolean online = item.getBoolean("online");
                if (online == null) {
                    continue;
                }
                Long time = item.getLong("time");
                states.put(key(entry.getKey()),
                        new State(online, time == null ? 0L : time, item.getString("reason")));
            }
            log.info("已加载本地视频在线状态：{} 个点位，文件={}", states.size(), file);
        } catch (Exception e) {
            log.warn("读取本地在线状态文件失败：{} - {}", file, e.getMessage());
        }
    }

    private String key(String code) {
        return code.trim().toLowerCase(Locale.ROOT);
    }
}
