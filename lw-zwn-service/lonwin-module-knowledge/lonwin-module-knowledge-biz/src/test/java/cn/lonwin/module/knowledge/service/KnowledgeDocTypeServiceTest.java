package cn.lonwin.module.knowledge.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeDocTypeEntity;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocTypeMapper;

/**
 * 类型树文档数统计契约测试。
 *
 * <p>回归背景：此前用 {@code QueryWrapper.select("TYPE_ID")} 走 BaseMapper，
 * 达梦下返回含 null 元素的列表导致 NPE 被 catch 吞掉，类型树 docCount 恒为 0
 * （上传后左侧树数字不刷新）。现改为聚合查询 + 全量兜底，这里锁死这两条路径。
 */
class KnowledgeDocTypeServiceTest {

    private final KnowledgeDocTypeMapper typeMapper = mock(KnowledgeDocTypeMapper.class);
    private final KnowledgeDocMapper docMapper = mock(KnowledgeDocMapper.class);
    private final KnowledgeDocTypeService service = new KnowledgeDocTypeService(typeMapper, docMapper);

    private static KnowledgeDocTypeEntity type(String typeId, String parentId, String name) {
        KnowledgeDocTypeEntity entity = new KnowledgeDocTypeEntity();
        entity.setTypeId(typeId);
        entity.setParentId(parentId);
        entity.setTypeName(name);
        entity.setSortNo(1);
        return entity;
    }

    private static KnowledgeDocEntity doc(String typeId) {
        KnowledgeDocEntity entity = new KnowledgeDocEntity();
        entity.setTypeId(typeId);
        return entity;
    }

    @Test
    @DisplayName("树计数：按类型聚合结果填到对应节点，父节点不吞子节点计数")
    void treeFillsDocCountFromAggregate() {
        when(typeMapper.selectList(any())).thenReturn(List.of(
                type("KT_A", null, "取水"),
                type("KT_A1", "KT_A", "地表水")));
        when(docMapper.countGroupByTypeId()).thenReturn(List.of(
                Map.of("TYPE_ID", "KT_A", "CNT", 2L),
                Map.of("TYPE_ID", "KT_A1", "CNT", "3")));

        List<KnowledgeDocTypeVO> roots = service.tree();

        assertThat(roots).hasSize(1);
        KnowledgeDocTypeVO parent = roots.get(0);
        assertThat(parent.getDocCount()).isEqualTo(2L);
        assertThat(parent.getChildren()).hasSize(1);
        // 字符串计数也要能解析（不同驱动 COUNT 返回类型不一致）
        assertThat(parent.getChildren().get(0).getDocCount()).isEqualTo(3L);
    }

    @Test
    @DisplayName("树计数：聚合查询失败时退回全量实体分组，且容忍 null 元素")
    void treeFallsBackToFullSelect() {
        when(typeMapper.selectList(any())).thenReturn(List.of(type("KT_A", null, "取水")));
        when(docMapper.countGroupByTypeId()).thenThrow(new IllegalStateException("bad sql"));
        when(docMapper.selectList(any())).thenReturn(Arrays.asList(
                doc("KT_A"), doc("KT_A"), null, doc(null)));

        List<KnowledgeDocTypeVO> roots = service.tree();

        assertThat(roots).hasSize(1);
        assertThat(roots.get(0).getDocCount()).isEqualTo(2L);
    }

    @Test
    @DisplayName("树计数：聚合返回 null 行 / 空类型时跳过，不抛异常")
    void treeSkipsNullRowsAndBlankTypes() {
        when(typeMapper.selectList(any())).thenReturn(List.of(type("KT_A", null, "取水")));
        Map<String, Object> blank = new LinkedHashMap<>();
        blank.put("TYPE_ID", "  ");
        blank.put("CNT", 5L);
        when(docMapper.countGroupByTypeId()).thenReturn(Arrays.asList(null, blank));

        List<KnowledgeDocTypeVO> roots = service.tree();

        assertThat(roots.get(0).getDocCount()).isEqualTo(0L);
    }

    @Test
    @DisplayName("树计数：聚合结果缺计数字段时退回全量实体分组，不把结果当 0")
    void treeFallsBackWhenAggregateShapeUnexpected() {
        when(typeMapper.selectList(any())).thenReturn(List.of(type("KT_A", null, "取水")));
        Map<String, Object> noCount = new LinkedHashMap<>();
        noCount.put("TYPE_ID", "KT_A");
        when(docMapper.countGroupByTypeId()).thenReturn(List.of(noCount));
        when(docMapper.selectList(any())).thenReturn(List.of(doc("KT_A"), doc("KT_A")));

        List<KnowledgeDocTypeVO> roots = service.tree();

        assertThat(roots.get(0).getDocCount()).isEqualTo(2L);
    }
}
