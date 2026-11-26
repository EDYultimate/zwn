package cn.lonwin.module.agent.tool;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具结果「分片投喂」缓存。
 *
 * <h3>解决什么问题</h3>
 * 列表类工具（{@code rows}）一旦全量返回，很容易上万字符，超过模型单次上下文预算；
 * 之前的做法是在工具里写死「只查前 20 条」或在编排层直接截断字符串，两种做法都会
 * <b>把数据割裂</b>——模型只看到一部分，却不知道还有多少，于是拿这部分去求和，合计就错了。
 *
 * <p>这里换一种方式：
 * <ul>
 *   <li>工具<b>全量查询</b>，不再截断；</li>
 *   <li>编排层把全量明细登记到本缓存，<b>只把第一片</b>塞进模型上下文；</li>
 *   <li>上下文里同时给出 {@code rowsTotal / rowsCursor / hasMore}，模型需要更多明细时
 *       调用通用工具 {@code agent.result.more(cursor, page)} 按片续取。</li>
 * </ul>
 * 数据始终是完整的，只是「分批给模型」；模型内存没有上限，上下文才有上限。
 *
 * <h3>为什么按「行数 + 字符」双阈值切片</h3>
 * 只按行数切，字段多、文本长时单片仍可能超预算；只按字符切，字段极短的宽表又会切得过碎。
 * 两者取小，保证每片既不会超过观测预算，行数也可预期。
 *
 * <p>缓存是会话无关的（只按 cursor 取），30 分钟未使用自动清理，避免长跑进程内存泄漏。
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AgentResultPager {

    /** 每片最多行数：与观测预算配合，20 行左右通常落在 2~3k 字符 */
    public static final int SLICE_ROWS = 20;

    /** 每片字符预算：给 summary / 包裹字段留出余量（观测总预算 4000 字符） */
    private static final int SLICE_CHARS = 2500;

    /** 单个结果最多缓存行数：异常大的结果（如全表导出）在登记处兜住，避免内存爆掉 */
    private static final int MAX_ROWS = 5000;

    /** 缓存有效期：30 分钟 */
    private static final long TTL_MS = 30 * 60 * 1000L;

    private final ObjectMapper objectMapper;

    private final Map<String, CachedResult> cache = new ConcurrentHashMap<>();

    /**
     * 登记一次全量结果，返回分片游标。
     *
     * @return 游标；rows 为空时返回 null（调用方按「没有明细」处理，不要生成空游标）
     */
    public String register(String sessionId, String toolName, List<Map<String, Object>> rows) {
        if (rows == null || rows.isEmpty()) {
            return null;
        }
        List<Map<String, Object>> safe = rows.size() > MAX_ROWS
                ? new ArrayList<>(rows.subList(0, MAX_ROWS))
                : new ArrayList<>(rows);
        String cursor = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        cache.put(cursor, new CachedResult(sessionId, toolName, safe, System.currentTimeMillis()));
        evictExpired();
        return cursor;
    }

    /**
     * 按游标取全量明细（用于服务端精确聚合）。
     *
     * <p>带会话校验：游标登记时记录了 sessionId，别的会话拿着游标取不到数据，
     * 防止跨会话串数据；sessionId 为 null（测试环境）时跳过校验。
     *
     * @return 全量明细；游标不存在、已过期或会话不符返回 null
     */
    public List<Map<String, Object>> rows(String sessionId, String cursor) {
        CachedResult cached = cursor == null ? null : cache.get(cursor);
        if (cached == null) {
            return null;
        }
        if (System.currentTimeMillis() - cached.createdAt > TTL_MS) {
            cache.remove(cursor);
            return null;
        }
        if (sessionId != null && cached.sessionId != null && !sessionId.equals(cached.sessionId)) {
            return null;
        }
        return cached.rows;
    }

    /**
     * 按游标取第 {@code pageNo} 片（页码从 1 开始）。
     *
     * @return 分片；游标不存在或已过期返回 null（调用方提示重新查询）
     */
    public Slice slice(String cursor, int pageNo) {
        CachedResult cached = cursor == null ? null : cache.get(cursor);
        if (cached == null) {
            return null;
        }
        if (System.currentTimeMillis() - cached.createdAt > TTL_MS) {
            cache.remove(cursor);
            return null;
        }
        List<Map<String, Object>> rows = cached.rows;
        int total = rows.size();
        int from = 0;
        int end = 0;
        int safePage = Math.max(1, pageNo);
        for (int p = 1; p <= safePage; p++) {
            end = nextEnd(rows, from);
            if (p < safePage) {
                from = end;
                if (from >= total) {
                    break;
                }
            }
        }
        if (from >= total) {
            Slice empty = new Slice();
            empty.setCursor(cursor);
            empty.setPage(safePage);
            empty.setTotal(total);
            empty.setHasMore(false);
            empty.setRows(List.of());
            return empty;
        }
        Slice slice = new Slice();
        slice.setCursor(cursor);
        slice.setPage(safePage);
        slice.setTotal(total);
        slice.setRows(new ArrayList<>(rows.subList(from, Math.min(end, total))));
        slice.setHasMore(end < total);
        return slice;
    }

    /** 从 from 开始，按「行数上限 + 字符预算」计算这一片的结束下标（至少前进一行） */
    private int nextEnd(List<Map<String, Object>> rows, int from) {
        int end = from;
        int chars = 0;
        int size = rows.size();
        while (end < size && end - from < SLICE_ROWS) {
            int len = length(rows.get(end));
            if (end > from && chars + len > SLICE_CHARS) {
                break;
            }
            chars += len;
            end++;
        }
        return end > from ? end : Math.min(from + 1, size);
    }

    private int length(Map<String, Object> row) {
        try {
            return objectMapper.writeValueAsString(row).length();
        } catch (Exception e) {
            // 序列化失败按固定长度估算，不能因为它让整次问答失败
            return 120;
        }
    }

    private void evictExpired() {
        long now = System.currentTimeMillis();
        cache.entrySet().removeIf(entry -> now - entry.getValue().createdAt > TTL_MS);
    }

    /** 一片结果 */
    @Data
    public static class Slice {
        private String cursor;
        private int page;
        private int total;
        private boolean hasMore;
        private List<Map<String, Object>> rows;
    }

    private static final class CachedResult {
        private final String sessionId;
        private final String toolName;
        private final List<Map<String, Object>> rows;
        private final long createdAt;

        private CachedResult(String sessionId, String toolName, List<Map<String, Object>> rows, long createdAt) {
            this.sessionId = sessionId;
            this.toolName = toolName;
            this.rows = rows;
            this.createdAt = createdAt;
        }
    }
}
