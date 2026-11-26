package cn.lonwin.module.knowledge.retrieve;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.api.KnowledgeException;
import cn.lonwin.module.knowledge.api.KnowledgeHit;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import lombok.extern.slf4j.Slf4j;

/**
 * Qdrant REST 客户端：一次请求内完成 dense + sparse 两路 prefetch 与 RRF 融合。
 *
 * <p>没有引入 qdrant-java-client：项目已有 spring-web 的 RestTemplate，
 * 一个 POST + 一段 JSON 解析即可，避免为一个查询接口增加依赖与版本耦合。
 *
 * <p><b>filter 下推</b>：{@code groupId / sourceType} 等业务筛选会写进每个 prefetch 的
 * {@code filter.must}，在 Qdrant 层过滤而不是召回后再筛。知识侧按约定不做权限过滤，
 * 因此这里永远不生成与用户单位/密级相关的条件；老数据缺少这些 payload 字段时
 * 调用方不传 filter，行为与阶段 1 之前完全一致。
 */
@Slf4j
public class QdrantClient {

    private final KnowledgeProperties config;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public QdrantClient(KnowledgeProperties config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(Math.max(1, config.getConnectTimeoutSeconds())));
        factory.setReadTimeout(Duration.ofSeconds(Math.max(1, config.getReadTimeoutSeconds())));
        this.restTemplate = new RestTemplate(factory);
    }

    /** 兼容入口：无 filter 下推 */
    public List<KnowledgeHit> hybrid(String collection, BgeM3Client.QueryVector vector, int limit) {
        return hybrid(collection, vector, limit, Map.of());
    }

    /**
     * 混合检索单个集合。
     *
     * @param collection kp_chunks / kp_tables / kp_docs
     * @param vector     同一次 BGE-M3 编码得到的 dense + sparse
     * @param limit      该集合返回的候选数
     * @param filters    形如 groupId / sourceType 的精确匹配条件，空 Map 表示不下推
     */
    public List<KnowledgeHit> hybrid(String collection, BgeM3Client.QueryVector vector,
                                     int limit, Map<String, Object> filters) {
        int prefetch = Math.min(Math.max(config.getPrefetchLimit(), limit),
                Math.max(1, config.getRetrieval().getMaxPrefetch()));
        Map<String, Object> sparse = new LinkedHashMap<>();
        sparse.put("indices", vector.indices());
        sparse.put("values", vector.values());

        Map<String, Object> denseBranch = new LinkedHashMap<>();
        denseBranch.put("query", vector.dense());
        denseBranch.put("using", config.getDenseVector());
        denseBranch.put("limit", prefetch);
        Map<String, Object> sparseBranch = new LinkedHashMap<>();
        sparseBranch.put("query", sparse);
        sparseBranch.put("using", config.getSparseVector());
        sparseBranch.put("limit", prefetch);

        Map<String, Object> filter = buildFilter(filters);
        if (filter != null) {
            // 两路 prefetch 都要带同样的 filter，否则 RRF 会把被过滤掉的候选从另一路放回来
            denseBranch.put("filter", filter);
            sparseBranch.put("filter", filter);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("prefetch", List.of(denseBranch, sparseBranch));
        body.put("query", Map.of("rrf", Map.of()));
        body.put("limit", limit);
        body.put("with_payload", true);

        HttpHeaders headers = headers();

        String url = trimTrailingSlash(config.getQdrantUrl())
                + "/collections/" + collection + "/points/query";
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, new HttpEntity<>(body, headers), String.class);
            JsonNode points = objectMapper.readTree(response.getBody()).path("result").path("points");
            List<KnowledgeHit> hits = new ArrayList<>();
            if (points.isArray()) {
                for (JsonNode point : points) {
                    hits.add(toHit(collection, point));
                }
            }
            return hits;
        } catch (Exception e) {
            throw new KnowledgeException("Qdrant 检索失败（" + collection + "）：" + e.getMessage(), e);
        }
    }

    /**
     * 批量写入检索单元。ID 由调用方用内容哈希生成，重复调用是覆盖式幂等。
     *
     * @param points 每项形如 {@code {id, vector:{dense:[...], sparse:{indices,values}}, payload:{...}}}
     */
    public int upsert(String collection, List<Map<String, Object>> points) {
        if (points == null || points.isEmpty()) {
            return 0;
        }
        String url = trimTrailingSlash(config.getQdrantUrl())
                + "/collections/" + collection + "/points?wait=true";
        try {
            restTemplate.exchange(url, org.springframework.http.HttpMethod.PUT,
                    new HttpEntity<>(Map.of("points", points), headers()), String.class);
            return points.size();
        } catch (Exception e) {
            throw new KnowledgeException("Qdrant 写入失败（" + collection + "）：" + e.getMessage(), e);
        }
    }

    /** 按 docId 删除该文档在指定集合里的全部点，用于重建索引 */
    public void deleteByDocId(String collection, String docId) {
        String url = trimTrailingSlash(config.getQdrantUrl())
                + "/collections/" + collection + "/points/delete?wait=true";
        Map<String, Object> body = Map.of("filter", Map.of("must",
                List.of(Map.of("key", "docId", "match", Map.of("value", docId)))));
        try {
            restTemplate.exchange(url, org.springframework.http.HttpMethod.POST,
                    new HttpEntity<>(body, headers()), String.class);
        } catch (Exception e) {
            throw new KnowledgeException("Qdrant 删除失败（" + collection + "/" + docId + "）："
                    + e.getMessage(), e);
        }
    }

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (StringUtils.hasText(config.getQdrantApiKey())) {
            headers.set("api-key", config.getQdrantApiKey());
        }
        return headers;
    }

    /** 构造 Qdrant filter.must；空条件返回 null（不下推，兼容无该字段的存量数据） */
    static Map<String, Object> buildFilter(Map<String, Object> filters) {
        if (filters == null || filters.isEmpty()) {
            return null;
        }
        List<Map<String, Object>> must = new ArrayList<>();
        for (Map.Entry<String, Object> entry : filters.entrySet()) {
            Object value = entry.getValue();
            if (value == null || (value instanceof String s && s.isBlank())) {
                continue;
            }
            must.add(Map.of("key", entry.getKey(), "match", Map.of("value", value)));
        }
        return must.isEmpty() ? null : Map.of("must", must);
    }

    private KnowledgeHit toHit(String collection, JsonNode point) {
        JsonNode payload = point.path("payload");
        return new KnowledgeHit(
                point.path("id").asText(""),
                collection,
                text(payload, "docId"),
                text(payload, "docType"),
                text(payload, "title"),
                text(payload, "fileName"),
                text(payload, "filePath"),
                text(payload, "sectionPath"),
                text(payload, "elemType"),
                text(payload, "text"),
                point.path("score").asDouble(0.0),
                text(payload, "embedderId"),
                text(payload, "groupId"),
                text(payload, "canonicalDocId"),
                pageNo(payload),
                text(payload, "sourceType"));
    }

    private static Integer pageNo(JsonNode payload) {
        JsonNode node = payload.path("pageNo");
        if (node.isNumber()) {
            return node.asInt();
        }
        if (node.isTextual() && !node.asText().isBlank()) {
            try {
                return Integer.parseInt(node.asText().trim());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private static String text(JsonNode payload, String field) {
        return payload.path(field).asText("");
    }

    private static String trimTrailingSlash(String url) {
        return url != null && url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
