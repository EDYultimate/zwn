package cn.lonwin.module.knowledge.index;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.retrieve.BgeM3Client;
import cn.lonwin.module.knowledge.retrieve.QdrantClient;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;

@SuppressWarnings({ "rawtypes", "unchecked" })
class KnowledgeIndexServiceTest {

    private static final String FILE_ID = "f1";
    private static final String OBJECT_KEY = "docFiles/knowledge/d1/source/f1_test.txt";

    private KnowledgeFileStore fileStore;
    private KnowledgeFileMapper fileMapper;
    private KnowledgeDocMapper docMapper;
    private BgeM3Client bge;
    private QdrantClient qdrant;
    private KnowledgeIndexService service;
    private KnowledgeFileEntity entity;

    @BeforeEach
    void setUp() {
        fileStore = mock(KnowledgeFileStore.class);
        fileMapper = mock(KnowledgeFileMapper.class);
        docMapper = mock(KnowledgeDocMapper.class);
        bge = mock(BgeM3Client.class);
        qdrant = mock(QdrantClient.class);
        KnowledgeProperties properties = new KnowledgeProperties();
        service = new KnowledgeIndexService(fileStore, fileMapper, docMapper, properties,
                new ObjectMapper(), bge, qdrant);

        entity = new KnowledgeFileEntity();
        entity.setFileId(FILE_ID);
        entity.setDocId("d1");
        entity.setGroupId("g1");
        entity.setFileName("test.txt");
        entity.setSourceType("OTHER");
        entity.setObjectKey(OBJECT_KEY);
        entity.setParseStatus("PENDING");

        when(fileMapper.selectById(FILE_ID)).thenReturn(entity);
        when(fileMapper.update(any(KnowledgeFileEntity.class), any())).thenReturn(1);
        when(docMapper.update(any(KnowledgeDocEntity.class), any())).thenReturn(1);
        when(fileStore.loadBytes(OBJECT_KEY)).thenReturn("这是一段用于入库测试的正文内容。"
                .repeat(20).getBytes(StandardCharsets.UTF_8));
        when(bge.encodeBatch(anyList())).thenAnswer(inv -> {
            List<String> texts = inv.getArgument(0);
            return texts.stream().map(t -> new BgeM3Client.QueryVector(
                    List.of(0.1d, 0.2d), List.of(1, 2), List.of(0.5d, 0.6d),
                    2, "bge-m3@2026-11")).toList();
        });
        when(qdrant.upsert(anyString(), anyList()))
                .thenAnswer(inv -> ((List<?>) inv.getArgument(1)).size());
    }

    @Test
    @DisplayName("上传即入库：解析 → 编码 → Qdrant upsert，payload 的 filePath 可点开原文")
    void indexWritesPointsToQdrant() {
        KnowledgeIndexService.IndexResult result = service.index(FILE_ID);

        assertThat(result.success()).isTrue();
        assertThat(result.chunkCount()).isGreaterThan(0);
        verify(fileStore).loadBytes(OBJECT_KEY);
        verify(fileStore).putBytes(anyString(), any(byte[].class), anyString());
        verify(bge).encodeBatch(anyList());

        ArgumentCaptor<List> captor = ArgumentCaptor.forClass(List.class);
        verify(qdrant, atLeastOnce()).upsert(anyString(), captor.capture());
        List<Map<String, Object>> points = captor.getValue();
        assertThat(points).isNotEmpty();
        Map<String, Object> point = points.get(0);
        assertThat((String) point.get("id"))
                .matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
        assertThat((Map<String, Object>) point.get("vector"))
                .containsKeys("dense", "sparse");
        Map<String, Object> payload = (Map<String, Object>) point.get("payload");
        assertThat(payload.get("filePath"))
                .isEqualTo(KnowledgeStorageKeys.resourceUrl(OBJECT_KEY));
        assertThat(payload.get("docId")).isEqualTo("d1");
        assertThat(payload.get("enabled")).isEqualTo(true);
    }

    @Test
    @DisplayName("同源附件只存 MinIO 不切片：SKIPPED_DUP 不触碰 Qdrant")
    void duplicateAttachmentSkipsIndexing() {
        entity.setParseStatus("SKIPPED_DUP");

        KnowledgeIndexService.IndexResult result = service.index(FILE_ID);

        assertThat(result.skipped()).isTrue();
        verify(qdrant, never()).upsert(anyString(), anyList());
        verify(fileStore, never()).loadBytes(anyString());
    }

    @Test
    @DisplayName("解析失败写回 FAILED，不影响文件已存 MinIO 的事实")
    void failureMarksFileFailedAndKeepsFile() {
        when(fileStore.loadBytes(OBJECT_KEY)).thenThrow(new IllegalStateException("MinIO 连接中断"));

        KnowledgeIndexService.IndexResult result = service.index(FILE_ID);

        assertThat(result.success()).isFalse();
        assertThat(result.message()).contains("MinIO 连接中断");
        verify(qdrant, never()).upsert(anyString(), anyList());
        // claim 一次 + markFailed 一次
        verify(fileMapper, atLeastOnce()).update(any(KnowledgeFileEntity.class), any());
    }

    @Test
    @DisplayName("重复索引 / 重建使用确定性 ID，不会在 Qdrant 里产生重复点")
    void repeatedIndexIsIdempotent() {
        service.index(FILE_ID);
        service.index(FILE_ID);

        ArgumentCaptor<List> captor = ArgumentCaptor.forClass(List.class);
        verify(qdrant, atLeastOnce()).upsert(anyString(), captor.capture());
        List<List> batches = captor.getAllValues();
        assertThat(batches.size()).isGreaterThanOrEqualTo(2);
        Map firstPoint = (Map) batches.get(0).get(0);
        Map secondPoint = (Map) batches.get(1).get(0);
        assertThat(firstPoint.get("id")).isEqualTo(secondPoint.get("id"));
    }

    @Test
    @DisplayName("关闭 index.enabled 时上传仍成功，只是不写 Qdrant")
    void disabledIndexSkipsEverything() {
        KnowledgeProperties properties = new KnowledgeProperties();
        properties.getIndex().setEnabled(false);
        KnowledgeIndexService disabled = new KnowledgeIndexService(fileStore, fileMapper, docMapper,
                properties, new ObjectMapper(), bge, qdrant);

        KnowledgeIndexService.IndexResult result = disabled.index(FILE_ID);

        assertThat(result.skipped()).isTrue();
        verify(qdrant, never()).upsert(anyString(), anyList());
        verify(fileStore, never()).loadBytes(anyString());
    }
}
