package cn.lonwin.module.agent.feignclient.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.feignclient.AgentToolApi;
import cn.lonwin.module.agent.model.vo.KbRefVO;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.tool.AgentResultPager;
import cn.lonwin.module.agent.tool.AgentToolContext;
import cn.lonwin.module.agent.uicapability.UiCapabilityLocator;
import cn.lonwin.module.knowledge.api.KnowledgeException;
import cn.lonwin.module.knowledge.api.KnowledgeGateway;
import cn.lonwin.module.knowledge.api.KnowledgeHit;
import lombok.RequiredArgsConstructor;

/**
 * {@link AgentToolApi} 的实现：页面定位 + 知识检索。
 *
 * <p>由 {@code AgentToolContractRegistrar} 按命名约定注册，无需 {@code @Component}。
 *
 * <p>知识侧网关用<b>可选字段注入</b>而非构造参数：关闭知识通道时容器里可能没有
 * {@code KnowledgeGateway} Bean，构造注入会让整个契约失效；字段注入拿到 null
 * 即可优雅降级（返回「知识库未接入」而不是启动失败）。
 */
@RequiredArgsConstructor
public class AgentToolApiImpl implements AgentToolApi {

    /** 知识引用编号起点：1~9 留给页面动作，11 起留给文档依据，共用编号空间互不冲突 */
    public static final int KB_CITE_BASE = 11;

    private final UiCapabilityLocator uiCapabilityLocator;
    private final AgentResultPager resultPager;

    @Autowired(required = false)
    private KnowledgeGateway knowledgeGateway;

    @Autowired(required = false)
    private AgentProperties properties;

    @Override
    public AgentToolResult locateUi(AgentToolContext ctx, String keyword) {
        // 检索范围按会话模块收窄：指定智能体只见本模块与公共页面，防止从检索通道泄漏其他模块的引导事件
        String module = ctx == null ? null : ctx.getModule();
        UiCapabilityLocator.LocateResult result = uiCapabilityLocator.locate(keyword, module);
        if (!result.found()) {
            // 失败文案会原样进模型上下文：必须明确「系统无匹配」，模型才不会拿别的页面凑数
            return AgentToolResult.fail(keyword == null || keyword.isBlank()
                    ? "系统中没有可导航的页面（前端页面能力清单为空）"
                    : "系统中没有匹配「" + keyword + "」的页面或功能");
        }
        Map<String, Object> data = new LinkedHashMap<>(uiCapabilityLocator.toData(result));
        data.put("source", "api");
        data.put("tool", "ui.locate");
        return AgentToolResult.ok(data, uiCapabilityLocator.toSummary(result));
    }

    /**
     * 知识侧工具：把向量检索结果包装成「带编号的原文片段」喂给模型。
     *
     * <p>{@code kbRefs} 放在 data 里供编排层提取到 {@code AgentChatVO}，
     * 编排层序列化观察结果时会把它剔除，避免同一份定位信息在 prompt 里重复占 token。
     */
    @Override
    public AgentToolResult searchKnowledge(String query, Integer topK, String docType, String section) {
        if (knowledgeGateway == null) {
            return AgentToolResult.fail("知识库未接入（lonwin.agent.knowledge.enabled=false）。"
                    + "请如实说明当前无法查询文档依据；若问题涉及业务数据请改用对应的数据工具。");
        }
        int defaultTopK = properties == null ? 5 : properties.getKnowledge().getTopK();
        int k = topK == null || topK < 1 ? defaultTopK : Math.min(topK, 10);
        try {
            List<KnowledgeHit> hits = knowledgeGateway.search(query, k, blankToNull(docType), blankToNull(section));
            if (hits.isEmpty()) {
                return AgentToolResult.fail("知识库中未检索到与「" + query + "」相关的原文片段。"
                        + "请如实说明未检索到，不要用其它内容顶替作答，也不要编造条文或数字。");
            }

            int maxChars = properties == null ? 900 : properties.getKnowledge().getMaxTextChars();
            List<Map<String, Object>> matches = new ArrayList<>();
            List<KbRefVO> refs = new ArrayList<>();
            for (int i = 0; i < hits.size(); i++) {
                int cite = KB_CITE_BASE + i;
                KnowledgeHit hit = hits.get(i);
                String text = clip(hit.text(), maxChars);

                Map<String, Object> match = new LinkedHashMap<>();
                match.put("n", cite);
                match.put("file", hit.fileName());
                match.put("section", hit.displaySource());
                match.put("text", text);
                matches.add(match);

                refs.add(KbRefVO.builder()
                        .cite(cite)
                        .chunkId(hit.chunkId())
                        .collection(hit.collection())
                        .docId(hit.docId())
                        .docType(hit.docType())
                        .title(hit.title())
                        .fileName(hit.fileName())
                        .filePath(hit.filePath())
                        .sectionPath(hit.sectionPath())
                        .pageNo(hit.pageNo())
                        .elemType(hit.elemType())
                        .snippet(clip(hit.text(), 160))
                        .score(hit.score())
                        .embedderId(hit.embedderId())
                        .build());
            }

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("source", "kb");
            data.put("tool", "kb.search");
            data.put("query", query);
            data.put("count", hits.size());
            data.put("matches", matches);
            data.put("kbRefs", refs);
            return AgentToolResult.ok(data,
                    "已从知识库检索到 " + hits.size() + " 个原文片段，编号从 [" + KB_CITE_BASE + "] 开始");
        } catch (KnowledgeException e) {
            if (properties == null || properties.getKnowledge().isDegradeOnError()) {
                return AgentToolResult.fail("知识库暂不可用（" + e.getMessage() + "）。"
                        + "请如实说明当前无法查询文档依据；若问题涉及实时业务数据请改用对应的数据工具，"
                        + "不要编造条文或数字。");
            }
            throw e;
        }
    }

    @Override
    public AgentToolResult moreResult(AgentToolContext ctx, String cursor, Integer page) {
        if (cursor == null || cursor.isBlank()) {
            return AgentToolResult.fail("缺少分片游标 cursor（取自上一结果的 rowsCursor）");
        }
        String sessionId = ctx == null ? null : ctx.getSessionId();
        // 先校验游标归属（会话隔离 + TTL），再取片：防止别的会话拿着游标串数据
        if (resultPager.rows(sessionId, cursor.trim()) == null) {
            return AgentToolResult.fail("分片游标已失效（可能超过 30 分钟、服务已重启或属于其他会话），"
                    + "请重新执行原查询获取最新明细");
        }
        int pageNo = (page == null || page < 1) ? 2 : page;
        AgentResultPager.Slice slice = resultPager.slice(cursor.trim(), pageNo);
        if (slice == null) {
            return AgentToolResult.fail("分片游标已失效（可能超过 30 分钟或服务已重启），"
                    + "请重新执行原查询获取最新明细");
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("source", "api");
        data.put("tool", "agent.result.more");
        data.put("cursor", cursor.trim());
        data.put("page", slice.getPage());
        data.put("total", slice.getTotal());
        data.put("count", slice.getRows().size());
        data.put("hasMore", slice.isHasMore());
        data.put("rows", slice.getRows());
        return AgentToolResult.ok(data, "已取回第 " + slice.getPage() + " 片明细（共 " + slice.getTotal()
                + " 条，本片 " + slice.getRows().size() + " 条）");
    }

    /**
     * 通用聚合：在全量缓存明细上由 Java 精确计算，模型只决定「怎么算」。
     *
     * <p>口径由模型定（groupBy 哪个字段、聚合哪个 metric、用什么算法），
     * 数值由服务端算——LLM 逐行心算不可靠，这里是统计类问答的准确率底线。
     */
    @Override
    public AgentToolResult statResult(AgentToolContext ctx, String cursor, String groupBy,
                                      String metric, String aggs) {
        if (cursor == null || cursor.isBlank()) {
            return AgentToolResult.fail("缺少数据游标 cursor（取自列表工具结果的 rowsCursor）");
        }
        String sessionId = ctx == null ? null : ctx.getSessionId();
        List<Map<String, Object>> rows = resultPager.rows(sessionId, cursor.trim());
        if (rows == null) {
            return AgentToolResult.fail("数据游标已失效（可能超过 30 分钟、服务已重启或属于其他会话），"
                    + "请重新执行原查询后再统计");
        }

        // 聚合算法：默认 sum；未指定 metric 时只做计数
        List<String> operations = parseAggs(aggs);
        boolean countOnly = metric == null || metric.isBlank();
        if (!countOnly && !fieldExists(rows, metric.trim())) {
            return AgentToolResult.fail("字段 " + metric + " 不在明细数据里，可用字段："
                    + fieldNames(rows) + "；请改用正确字段名重新统计");
        }
        String metricName = countOnly ? null : metric.trim();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("source", "api");
        data.put("tool", "agent.result.stat");
        data.put("cursor", cursor.trim());
        data.put("total", rows.size());
        data.put("metric", metricName);
        data.put("aggs", operations);

        if (groupBy == null || groupBy.isBlank()) {
            data.put("overall", aggregate(rows, metricName, operations));
            return AgentToolResult.ok(data, "已对 " + rows.size() + " 条明细完成统计");
        }

        String groupField = groupBy.trim();
        if (!fieldExists(rows, groupField)) {
            return AgentToolResult.fail("分组字段 " + groupField + " 不在明细数据里，可用字段："
                    + fieldNames(rows) + "；请改用正确字段名重新统计");
        }
        // 分组保持首次出现顺序：分组数量通常很小，排序交给模型（或下一轮按排序问再取）
        Map<String, List<Map<String, Object>>> groups = new LinkedHashMap<>();
        for (Map<String, Object> row : rows) {
            Object key = row.get(groupField);
            String groupKey = key == null ? "（空）" : String.valueOf(key);
            groups.computeIfAbsent(groupKey, k -> new ArrayList<>()).add(row);
        }
        List<Map<String, Object>> groupRows = new ArrayList<>(groups.size());
        for (Map.Entry<String, List<Map<String, Object>>> entry : groups.entrySet()) {
            Map<String, Object> group = new LinkedHashMap<>();
            group.put("key", entry.getKey());
            group.put("count", entry.getValue().size());
            Map<String, Object> stats = aggregate(entry.getValue(), metricName, operations);
            group.putAll(stats);
            groupRows.add(group);
        }
        data.put("groupBy", groupField);
        data.put("groupCount", groupRows.size());
        data.put("groups", groupRows);
        return AgentToolResult.ok(data, "已按 " + groupField + " 分为 " + groupRows.size()
                + " 组完成统计（共 " + rows.size() + " 条明细）");
    }

    /** 解析聚合算法清单；非法值按默认 sum 处理 */
    private static List<String> parseAggs(String aggs) {
        List<String> operations = new ArrayList<>();
        if (aggs != null && !aggs.isBlank()) {
            for (String item : aggs.split("[,，、\\s]+")) {
                String op = item.trim().toLowerCase();
                if (List.of("sum", "count", "avg", "max", "min").contains(op) && !operations.contains(op)) {
                    operations.add(op);
                }
            }
        }
        if (operations.isEmpty()) {
            operations.add("sum");
        }
        return operations;
    }

    /** 在一批行上执行聚合：返回 {count, <metric><Agg>...}；非数值行计入 count 但不参与数值聚合 */
    private static Map<String, Object> aggregate(List<Map<String, Object>> rows, String metric,
                                                 List<String> operations) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("count", rows.size());
        if (metric == null) {
            return out;
        }
        List<BigDecimal> values = new ArrayList<>(rows.size());
        for (Map<String, Object> row : rows) {
            BigDecimal value = numeric(row.get(metric));
            if (value != null) {
                values.add(value);
            }
        }
        if (values.isEmpty()) {
            // 字段存在但都不是数值：返回空标记而不是报错，模型据此向用户说明口径
            for (String op : operations) {
                out.put(metric + capitalize(op), null);
            }
            out.put("numericCount", 0);
            return out;
        }
        for (String op : operations) {
            String key = metric + capitalize(op);
            switch (op) {
                case "count" -> out.put(key, values.size());
                case "avg" -> out.put(key, avg(values));
                default -> {
                    BigDecimal result = fold(values, op);
                    if (result != null) {
                        out.put(key, result.stripTrailingZeros().toPlainString());
                    }
                }
            }
        }
        out.put("numericCount", values.size());
        return out;
    }

    private static BigDecimal fold(List<BigDecimal> values, String op) {
        BigDecimal acc = null;
        for (BigDecimal value : values) {
            if (acc == null) {
                acc = value;
            } else if ("sum".equals(op)) {
                acc = acc.add(value);
            } else if ("max".equals(op)) {
                acc = acc.max(value);
            } else if ("min".equals(op)) {
                acc = acc.min(value);
            }
        }
        return acc;
    }

    private static String avg(List<BigDecimal> values) {
        BigDecimal sum = fold(values, "sum");
        if (sum == null) {
            return null;
        }
        return sum.divide(BigDecimal.valueOf(values.size()), 4, java.math.RoundingMode.HALF_UP)
                .stripTrailingZeros().toPlainString();
    }

    private static BigDecimal numeric(Object value) {
        if (value instanceof Number number) {
            return new BigDecimal(number.toString());
        }
        if (value instanceof String text && !text.isBlank()) {
            try {
                return new BigDecimal(text.trim());
            } catch (NumberFormatException ignored) {
                // 非数值字符串不参与数值聚合
            }
        }
        return null;
    }

    private static boolean fieldExists(List<Map<String, Object>> rows, String field) {
        return rows.stream().anyMatch(row -> row.containsKey(field));
    }

    private static List<String> fieldNames(List<Map<String, Object>> rows) {
        return rows.isEmpty() ? List.of() : List.copyOf(rows.get(0).keySet());
    }

    private static String capitalize(String text) {
        return text.isEmpty() ? text : Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static String clip(String text, int max) {
        if (text == null) {
            return "";
        }
        return text.length() <= max ? text : text.substring(0, max) + "…（片段已截断）";
    }
}
