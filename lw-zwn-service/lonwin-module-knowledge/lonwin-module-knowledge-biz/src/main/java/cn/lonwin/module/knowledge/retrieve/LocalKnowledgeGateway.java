package cn.lonwin.module.knowledge.retrieve;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.util.StringUtils;

import cn.lonwin.module.knowledge.api.KnowledgeException;
import cn.lonwin.module.knowledge.api.KnowledgeGateway;
import cn.lonwin.module.knowledge.api.KnowledgeHit;
import cn.lonwin.module.knowledge.api.KnowledgeQuery;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import lombok.extern.slf4j.Slf4j;

/**
 * 知识模块内的检索实现（阶段 1 默认）：BGE-M3 编码 → 多集合 Hybrid/RRF →
 * 跨集合按秩融合 → 组内折叠 → topK。
 *
 * <h3>为什么要再做一次跨集合融合</h3>
 * RRF 是 Qdrant <b>单个请求内部</b>把 dense/sparse 两路排名合成一个榜单；
 * 不同集合各发一次请求，彼此的分数不可比。因此这里按「片段在本集合内的名次」
 * 再算一次标准 RRF 分 {@code 1/(k+rank)}，键是 {@code collection#chunkId}。
 *
 * <h3>检索策略</h3>
 * <ul>
 *   <li>位于独立模块，agent 通过纯契约接口调用，同 JVM 内无 HTTP；</li>
 *   <li>{@code groupId / sourceType} 下推到 Qdrant prefetch filter；</li>
 *   <li>可选组内折叠：同名 PDF/Word/Excel 只留最高分 + 一条异源补位；</li>
 *   <li>payload 新增 groupId / canonicalDocId / pageNo / sourceType 解析。</li>
 * </ul>
 *
 * <h3>不做的事</h3>
 * 不查 Mongo/ES/达梦正文（payload 已冗余原文与位置）、不做权限过滤（当前设计）、
 * 不把工具描述混进向量召回（工具是可执行动作，走工具注册表）。
 */
@Slf4j
public class LocalKnowledgeGateway implements KnowledgeGateway {

    private final BgeM3Client bgeM3Client;
    private final QdrantClient qdrantClient;
    private final KnowledgeProperties config;

    public LocalKnowledgeGateway(BgeM3Client bgeM3Client, QdrantClient qdrantClient,
                                 KnowledgeProperties config) {
        this.bgeM3Client = bgeM3Client;
        this.qdrantClient = qdrantClient;
        this.config = config;
    }

    @Override
    public List<KnowledgeHit> search(String query, int topK, String docType, String section) {
        return search(KnowledgeQuery.of(query, topK, docType, section));
    }

    @Override
    public List<KnowledgeHit> search(KnowledgeQuery request) {
        if (request == null || !StringUtils.hasText(request.query())) {
            return List.of();
        }
        String query = request.query().trim();
        int k = Math.min(Math.max(request.topK(), 1), 20);
        int rrfK = Math.max(1, config.getRetrieval().getRrfK());
        BgeM3Client.QueryVector vector = bgeM3Client.encode(query);
        int perCollection = Math.min(Math.max(k, config.getPrefetchLimit()),
                Math.max(1, config.getRetrieval().getMaxPrefetch()));
        Map<String, Object> filters = filters(request);

        List<String> collections = List.of(
                config.getCollectionChunks(), config.getCollectionTables(), config.getCollectionDocs());
        Map<String, KnowledgeHit> unique = new LinkedHashMap<>();
        Map<String, Double> fusedScores = new HashMap<>();
        int failures = 0;

        for (String collection : collections) {
            List<KnowledgeHit> part;
            try {
                part = qdrantClient.hybrid(collection, vector, perCollection, filters);
            } catch (KnowledgeException e) {
                failures++;
                log.warn("[kb] 集合 {} 检索失败：{}", collection, e.getMessage());
                continue;
            }
            for (int rank = 0; rank < part.size(); rank++) {
                KnowledgeHit hit = part.get(rank);
                if (!matches(hit, request.docType(), request.section())) {
                    continue;
                }
                String key = collection + "#" + hit.chunkId();
                fusedScores.merge(key, 1.0 / (rrfK + rank + 1), Double::sum);
                unique.putIfAbsent(key, hit);
            }
        }

        if (failures == collections.size()) {
            throw new KnowledgeException("Qdrant 全部集合检索失败，知识库暂不可用");
        }

        List<KnowledgeHit> merged = new ArrayList<>();
        for (Map.Entry<String, KnowledgeHit> entry : unique.entrySet()) {
            merged.add(entry.getValue().withScore(fusedScores.getOrDefault(entry.getKey(), 0.0)));
        }
        merged.sort(Comparator.comparingDouble(KnowledgeHit::score).reversed());

        boolean fold = config.getRetrieval().isFoldByGroup() || request.foldByGroup();
        List<KnowledgeHit> folded = foldByGroup(merged, fold,
                config.getRetrieval().isKeepCrossSourceComplement());
        List<KnowledgeHit> result = folded.size() > k ? new ArrayList<>(folded.subList(0, k)) : folded;
        log.info("[kb] 检索完成 query={}, 候选={}, 折叠后={}, 返回={}, 失败集合={}",
                abbreviate(query), unique.size(), folded.size(), result.size(), failures);
        return result;
    }

    /** 只下推精确匹配维度；docType/section 是模糊关键词，仍留应用层筛选 */
    private static Map<String, Object> filters(KnowledgeQuery request) {
        Map<String, Object> filters = new LinkedHashMap<>();
        if (StringUtils.hasText(request.groupId())) {
            filters.put("groupId", request.groupId().trim());
        }
        if (StringUtils.hasText(request.sourceType())) {
            filters.put("sourceType", request.sourceType().trim());
        }
        return filters;
    }

    /** docType / section 只是业务筛选，不是权限条件；不生成权限类 query_filter */
    private static boolean matches(KnowledgeHit hit, String docType, String section) {
        if (StringUtils.hasText(docType)
                && !contains(hit.docType(), docType)
                && !contains(hit.title(), docType)
                && !contains(hit.fileName(), docType)) {
            return false;
        }
        return !StringUtils.hasText(section) || contains(hit.sectionPath(), section);
    }

    /**
     * 同名 PDF/Word/Excel 的检索级折叠。
     *
     * <p><b>只折叠 groupId 非空的命中</b>：存量 payload 没有 groupId，
     * 若按 foldKey() 全量折叠会把同一文档的多个 chunk 压成一条，召回断崖式下降。
     * 打开开关后每组保留最高分，再按配置补一条不同 sourceType 的命中，
     * 避免 Word 里缺的图片页/附表信息被完全丢掉。
     */
    static List<KnowledgeHit> foldByGroup(List<KnowledgeHit> sorted, boolean enabled,
                                          boolean keepComplement) {
        if (!enabled || sorted.size() < 2) {
            return sorted;
        }
        Map<String, KnowledgeHit> primary = new HashMap<>();
        Map<String, Set<String>> seenSources = new HashMap<>();
        Map<String, Boolean> complementUsed = new HashMap<>();
        List<KnowledgeHit> result = new ArrayList<>();
        for (KnowledgeHit hit : sorted) {
            if (!StringUtils.hasText(hit.groupId())) {
                result.add(hit);
                continue;
            }
            String group = hit.groupId();
            if (!primary.containsKey(group)) {
                primary.put(group, hit);
                seenSources.computeIfAbsent(group, g -> new HashSet<>()).add(sourceOf(hit));
                result.add(hit);
                continue;
            }
            if (keepComplement && !Boolean.TRUE.equals(complementUsed.get(group))
                    && !seenSources.getOrDefault(group, Set.of()).contains(sourceOf(hit))) {
                seenSources.computeIfAbsent(group, g -> new HashSet<>()).add(sourceOf(hit));
                complementUsed.put(group, Boolean.TRUE);
                result.add(hit);
            }
        }
        return result;
    }

    private static String sourceOf(KnowledgeHit hit) {
        return StringUtils.hasText(hit.sourceType())
                ? hit.sourceType() : (hit.collection() == null ? "" : hit.collection());
    }

    private static boolean contains(String source, String keyword) {
        return source != null && source.contains(keyword);
    }

    private static String abbreviate(String text) {
        return text.length() <= 40 ? text : text.substring(0, 40) + "…";
    }
}
