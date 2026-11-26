package cn.lonwin.module.knowledge.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.index.KnowledgeIndexService;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;

/**
 * 文件读 / 删 / 改名契约测试。
 *
 * <p>锁死两条底线：
 * <ul>
 *   <li>列表按 typeId 过滤、按入库时间倒序，并带回原文地址；</li>
 *   <li>删除必须同时清 MinIO 对象与达梦元数据；Qdrant 不可用只跳过向量清理，
 *       绝不因此保留元数据。</li>
 * </ul>
 */
class KnowledgeFileServiceTest {

    private static KnowledgeFileEntity file(String fileId, String docId, String name,
                                            LocalDateTime createTime) {
        KnowledgeFileEntity entity = new KnowledgeFileEntity();
        entity.setFileId(fileId);
        entity.setDocId(docId);
        entity.setFileName(name);
        entity.setFileExt("pdf");
        entity.setFileSize(2048L);
        entity.setBucket("yqbucket");
        entity.setObjectKey("docFiles/knowledge/" + docId + "/source/" + fileId + "_" + name);
        entity.setParseStatus("INDEXED");
        entity.setIndexed(1);
        entity.setChunkCount(5);
        entity.setCreateTime(createTime);
        return entity;
    }

    private static KnowledgeDocEntity doc(String docId, String typeId, String title) {
        KnowledgeDocEntity entity = new KnowledgeDocEntity();
        entity.setDocId(docId);
        entity.setTypeId(typeId);
        entity.setTitle(title);
        entity.setStatus("READY");
        return entity;
    }

    private static class Fixture {
        final KnowledgeFileStore store = mock(KnowledgeFileStore.class);
        final KnowledgeFileMapper fileMapper = mock(KnowledgeFileMapper.class);
        final KnowledgeDocMapper docMapper = mock(KnowledgeDocMapper.class);
        final KnowledgeIndexService indexService = mock(KnowledgeIndexService.class);
        final KnowledgeProperties properties = new KnowledgeProperties();
        final KnowledgeFileService service;

        Fixture(KnowledgeDocEntity... docs) {
            when(docMapper.selectList(any())).thenReturn(List.of(docs));
            service = new KnowledgeFileService(fileMapper, docMapper, store, properties);
            ReflectionTestUtils.setField(service, "indexService", indexService);
        }

        Fixture withFiles(KnowledgeFileEntity... files) {
            when(fileMapper.selectList(any())).thenReturn(List.of(files));
            return this;
        }
    }

    @Test
    @DisplayName("列表：按 typeId 查文档、按入库时间倒序、带原文地址与关键字过滤")
    void listFiltersByTypeAndKeyword() {
        KnowledgeDocEntity d1 = doc("doc-1", "type-a", "2026 年水量分配方案");
        KnowledgeDocEntity d2 = doc("doc-2", "type-b", "无关文档");
        Fixture fx = new Fixture(d1, d2).withFiles(
                file("f-old", "doc-1", "a-old.pdf", LocalDateTime.of(2026, 1, 1, 8, 0)),
                file("f-new", "doc-2", "b-new.pdf", LocalDateTime.of(2026, 3, 1, 8, 0)));

        List<Map<String, Object>> rows = fx.service.list(null, null, null, false);

        assertThat(rows).hasSize(2);
        // 全库列表按入库时间倒序，最新在前
        assertThat(rows.get(0).get("fileId")).isEqualTo("f-new");
        assertThat(rows.get(1).get("createTime")).isEqualTo("2026-01-01 08:00:00");
        assertThat(rows.get(0).get("resourceUrl")).asString()
                .startsWith("/resourceShow/file?path=");

        // 关键字命中文档标题也能查到对应文件
        List<Map<String, Object>> hit = fx.service.list(null, "水量分配", null, false);
        assertThat(hit).hasSize(1);
        assertThat(hit.get(0).get("docId")).isEqualTo("doc-1");
        assertThat(hit.get(0).get("title")).isEqualTo("2026 年水量分配方案");
    }

    @Test
    @DisplayName("列表：类型下没有文档时直接返回空，不查文件表")
    void listReturnsEmptyWithoutDocs() {
        Fixture fx = new Fixture();

        assertThat(fx.service.list("type-empty", null, null, false)).isEmpty();
        verify(fx.fileMapper, never()).selectList(any());
    }

    @Test
    @DisplayName("删除最后一个文件：连带删文档、清向量、删 MinIO 对象")
    void deleteLastFileRemovesDocAndObject() {
        KnowledgeFileEntity f = file("f-1", "doc-1", "报告.pdf", LocalDateTime.now());
        Fixture fx = new Fixture(doc("doc-1", "type-a", "报告"));
        when(fx.fileMapper.selectById("f-1")).thenReturn(f);
        when(fx.fileMapper.selectCount(any())).thenReturn(0L);
        when(fx.indexService.delete("doc-1")).thenReturn(1);

        Map<String, Object> result = fx.service.delete("f-1");

        verify(fx.fileMapper).deleteById("f-1");
        verify(fx.docMapper).deleteById("doc-1");
        verify(fx.store).removeObject(f.getObjectKey());
        verify(fx.indexService).delete("doc-1");
        assertThat(result.get("docRemoved")).isEqualTo(true);
        assertThat(result.get("vectorCleared")).isEqualTo(true);
        assertThat(result.get("remainFiles")).isEqualTo(0L);
    }

    @Test
    @DisplayName("删除非最后一个文件：保留文档，不动向量")
    void deleteKeepingDoc() {
        KnowledgeFileEntity f = file("f-2", "doc-1", "附件.pdf", LocalDateTime.now());
        f.setIndexed(0);
        Fixture fx = new Fixture(doc("doc-1", "type-a", "报告"));
        when(fx.fileMapper.selectById("f-2")).thenReturn(f);
        when(fx.fileMapper.selectCount(any())).thenReturn(1L);

        Map<String, Object> result = fx.service.delete("f-2");

        verify(fx.docMapper, never()).deleteById(anyString());
        verify(fx.indexService, never()).delete(anyString());
        verify(fx.store).removeObject(f.getObjectKey());
        assertThat(result.get("docRemoved")).isEqualTo(false);
        assertThat(result.get("remainFiles")).isEqualTo(1L);
    }

    @Test
    @DisplayName("Qdrant 未启动：向量清理失败不阻断元数据与对象删除")
    void deleteToleratesVectorOutage() {
        KnowledgeFileEntity f = file("f-3", "doc-3", "报告.pdf", LocalDateTime.now());
        Fixture fx = new Fixture(doc("doc-3", "type-a", "报告"));
        when(fx.fileMapper.selectById("f-3")).thenReturn(f);
        when(fx.fileMapper.selectCount(any())).thenReturn(0L);
        when(fx.indexService.delete("doc-3")).thenThrow(new IllegalStateException("Connection refused"));

        Map<String, Object> result = fx.service.delete("f-3");

        verify(fx.fileMapper).deleteById("f-3");
        verify(fx.docMapper).deleteById("doc-3");
        verify(fx.store).removeObject(f.getObjectKey());
        assertThat(result.get("vectorCleared")).isEqualTo(false);
        assertThat(result.get("warning")).asString().contains("Qdrant");
    }

    @Test
    @DisplayName("文件不存在：404 业务异常")
    void deleteMissingFile() {
        Fixture fx = new Fixture();

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> fx.service.delete("nope"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("文件不存在");
    }

    @Test
    @DisplayName("重命名：只改展示名与文档标题，不移动 MinIO 对象")
    void renameUpdatesNameAndTitle() {
        KnowledgeFileEntity f = file("f-4", "doc-4", "旧名字.pdf", LocalDateTime.now());
        Fixture fx = new Fixture(doc("doc-4", "type-a", "旧名字"));
        when(fx.fileMapper.selectById("f-4")).thenReturn(f);
        when(fx.docMapper.selectById("doc-4")).thenReturn(doc("doc-4", "type-a", "新名字"));

        Map<String, Object> result = fx.service.rename("f-4", new KnowledgeFileRenameRequest("新名字.pdf"));

        verify(fx.fileMapper).updateById(any(KnowledgeFileEntity.class));
        verify(fx.docMapper).updateById(any(KnowledgeDocEntity.class));
        verify(fx.store, never()).removeObject(anyString());
        verify(fx.store, never()).putBytes(anyString(), any(), anyString());
        assertThat(result.get("title")).isEqualTo("新名字");
    }

    @Test
    @DisplayName("重命名：空文件名拒绝")
    void renameRejectsBlank() {
        KnowledgeFileEntity f = file("f-5", "doc-5", "a.pdf", LocalDateTime.now());
        Fixture fx = new Fixture(doc("doc-5", "type-a", "a"));
        when(fx.fileMapper.selectById("f-5")).thenReturn(f);

        org.assertj.core.api.Assertions.assertThatThrownBy(
                        () -> fx.service.rename("f-5", new KnowledgeFileRenameRequest("  ")))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("文件名不能为空");
        verify(fx.fileMapper, never()).updateById(any(KnowledgeFileEntity.class));
    }

    @Test
    @DisplayName("统计：返回文档数 / 文件数 / 已索引文件数 / 未归类文档数")
    void statsCounts() {
        Fixture fx = new Fixture();
        when(fx.docMapper.selectCount(any())).thenReturn(3L, 1L);
        when(fx.fileMapper.selectCount(any())).thenReturn(4L, 2L);

        Map<String, Object> stats = fx.service.stats();

        assertThat(stats.get("docs")).isEqualTo(3L);
        assertThat(stats.get("files")).isEqualTo(4L);
        assertThat(stats.get("indexedFiles")).isEqualTo(2L);
        assertThat(stats.get("unclassified")).isEqualTo(1L);
    }

    @Test
    @DisplayName("未归类视图：只查 TYPE_ID 为空的文档")
    void listUnclassified() {
        KnowledgeDocEntity orphan = doc("doc-x", null, "历史导入");
        Fixture fx = new Fixture(orphan).withFiles(
                file("f-x", "doc-x", "old.pdf", LocalDateTime.of(2026, 11, 12, 15, 34)));

        List<Map<String, Object>> rows = fx.service.list(null, null, null, true);

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).get("fileName")).isEqualTo("old.pdf");
        assertThat(rows.get(0).get("typeId")).isNull();
    }

    @Test
    @DisplayName("清理未归类：逐文件删对象与元数据，最后兜底删空文档")
    void purgeUnclassified() {
        KnowledgeDocEntity withFile = doc("doc-x", null, "历史导入");
        KnowledgeDocEntity emptyDoc = doc("doc-y", null, "空文档");
        Fixture fx = new Fixture(withFile, emptyDoc).withFiles(
                file("f-x", "doc-x", "old.pdf", LocalDateTime.of(2026, 11, 12, 15, 34)));
        when(fx.fileMapper.selectById("f-x"))
                .thenReturn(file("f-x", "doc-x", "old.pdf", LocalDateTime.now()));
        // delete 内部：该文档下只剩这一个文件
        when(fx.fileMapper.selectCount(any())).thenReturn(0L);
        when(fx.indexService.delete("doc-x")).thenReturn(1);
        // 兜底阶段：doc-x 已随文件删除，doc-y 是历史空文档
        when(fx.docMapper.selectById("doc-x")).thenReturn(null);
        when(fx.docMapper.selectById("doc-y")).thenReturn(emptyDoc);

        Map<String, Object> result = fx.service.purgeUnclassified();

        assertThat(result.get("files")).isEqualTo(1);
        assertThat(result.get("docs")).isEqualTo(1);
        verify(fx.fileMapper).deleteById("f-x");
        verify(fx.docMapper).deleteById("doc-x");
        verify(fx.docMapper).deleteById("doc-y");
        verify(fx.store).removeObject("docFiles/knowledge/doc-x/source/f-x_old.pdf");
    }
}
