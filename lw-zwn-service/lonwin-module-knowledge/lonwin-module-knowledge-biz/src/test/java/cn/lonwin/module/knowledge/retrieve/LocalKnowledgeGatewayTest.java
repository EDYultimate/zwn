package cn.lonwin.module.knowledge.retrieve;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.knowledge.api.KnowledgeException;
import cn.lonwin.module.knowledge.api.KnowledgeHit;
import cn.lonwin.module.knowledge.api.KnowledgeQuery;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;

/** 查询层：跨集合 RRF、filter 下推、组内折叠、全失败降级。 */
class LocalKnowledgeGatewayTest {

    private static final BgeM3Client.QueryVector VECTOR =
            new BgeM3Client.QueryVector(List.of(0.1), List.of(7), List.of(1.0), 1, "bge-m3@2026-11");

    private static KnowledgeHit hit(String id, String collection, String groupId, String sourceType) {
        return new KnowledgeHit(id, collection, "doc-1", "防洪", "预案标题", "预案.DOCX",
                "/docFiles/预案.DOCX", "1.1 编制目的", "TEXT", "原文内容", 1.0,
                "bge-m3@2026-11", groupId, null, null, sourceType);
    }

    private static class Fixture {
        final BgeM3Client bge = mock(BgeM3Client.class);
        final QdrantClient qdrant = mock(QdrantClient.class);
        final KnowledgeProperties properties = new KnowledgeProperties();
        final LocalKnowledgeGateway gateway;

        Fixture() {
            when(bge.encode(anyString())).thenReturn(VECTOR);
            // 兜底：避免未 stub 的集合返回 null 导致 NPE
            when(qdrant.hybrid(anyString(), any(), anyInt(), any())).thenReturn(List.of());
            gateway = new LocalKnowledgeGateway(bge, qdrant, properties);
        }
    }

    @Test
    @DisplayName("空问题直接返回空，不触发嵌入编码")
    void blankQueryShortCircuits() {
        Fixture f = new Fixture();

        assertThat(f.gateway.search("  ", 5, null, null)).isEmpty();
        verifyNoInteractions(f.bge, f.qdrant);
    }

    @Test
    @DisplayName("三集合分别 Hybrid/RRF，跨集合按名次重算 1/(60+rank)，topK 截断")
    void multiCollectionRrfAndTopK() {
        Fixture f = new Fixture();
        when(f.qdrant.hybrid(eq("kp_chunks"), any(), anyInt(), any()))
                .thenReturn(List.of(hit("c1", "kp_chunks", null, "WORD"),
                        hit("c2", "kp_chunks", null, "WORD")));
        when(f.qdrant.hybrid(eq("kp_tables"), any(), anyInt(), any()))
                .thenReturn(List.of(hit("t1", "kp_tables", null, "EXCEL")));
        when(f.qdrant.hybrid(eq("kp_docs"), any(), anyInt(), any()))
                .thenReturn(List.of(hit("d1", "kp_docs", null, "PDF")));

        List<KnowledgeHit> hits = f.gateway.search("编制目的是什么", 2, null, null);

        assertThat(hits).hasSize(2);
        assertThat(hits.get(0).score()).isEqualTo(1.0 / 61);
        assertThat(hits.get(1).score()).isEqualTo(1.0 / 61);
        assertThat(hits.get(0).displaySource()).isNotBlank();
    }

    @Test
    @DisplayName("groupId / sourceType 下推到 Qdrant prefetch filter，不下推权限条件")
    void filtersArePushedDown() {
        Fixture f = new Fixture();
        when(f.qdrant.hybrid(anyString(), any(), anyInt(), any()))
                .thenReturn(List.of(hit("c1", "kp_chunks", "g1", "WORD")));

        f.gateway.search(new KnowledgeQuery("取水许可", 5, null, null, "g1", "WORD", false));

        verify(f.qdrant).hybrid(eq("kp_chunks"), any(), anyInt(),
                eq(Map.of("groupId", "g1", "sourceType", "WORD")));
    }

    @Test
    @DisplayName("组内折叠：同组只留最高分 + 一条异源补位；无 groupId 的老数据完全不折叠")
    void foldByGroupKeepsPrimaryAndOneComplement() {
        Fixture f = new Fixture();
        f.properties.getRetrieval().setFoldByGroup(true);
        when(f.qdrant.hybrid(eq("kp_chunks"), any(), anyInt(), any())).thenReturn(List.of(
                hit("w1", "kp_chunks", "g1", "WORD"),
                hit("p1", "kp_chunks", "g1", "PDF"),
                hit("w2", "kp_chunks", "g1", "WORD"),
                hit("old1", "kp_chunks", null, "WORD"),
                hit("old2", "kp_chunks", null, "WORD")));

        List<KnowledgeHit> hits = f.gateway.search("防洪预案", 10, null, null);

        assertThat(hits).extracting(KnowledgeHit::chunkId)
                .containsExactly("w1", "p1", "old1", "old2")
                .doesNotContain("w2");
    }

    @Test
    @DisplayName("fold-by-group 默认关闭：存量数据不会被误压成一条")
    void foldingDisabledByDefault() {
        Fixture f = new Fixture();
        assertThat(f.properties.getRetrieval().isFoldByGroup()).isFalse();
        when(f.qdrant.hybrid(eq("kp_chunks"), any(), anyInt(), any())).thenReturn(List.of(
                hit("w1", "kp_chunks", null, "WORD"),
                hit("w2", "kp_chunks", null, "WORD"),
                hit("w3", "kp_chunks", null, "WORD")));

        assertThat(f.gateway.search("防洪预案", 10, null, null)).hasSize(3);
    }

    @Test
    @DisplayName("全部集合失败：抛 KnowledgeException，由工具层决定降级")
    void allCollectionsFailedThrows() {
        Fixture f = new Fixture();
        when(f.qdrant.hybrid(anyString(), any(), anyInt(), any()))
                .thenThrow(new KnowledgeException("Qdrant 不可用"));

        assertThatThrownBy(() -> f.gateway.search("编制目的", 5, null, null))
                .isInstanceOf(KnowledgeException.class)
                .hasMessageContaining("全部集合");
    }
}
