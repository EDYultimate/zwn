package cn.lonwin.module.knowledge.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;

/**
 * 上传入库契约测试：核心是锁死用户那条硬约束——
 * <b>所有上传文件都写 MinIO，不管是否同名、是否同 hash；去重只做标记。</b>
 */
class KnowledgeUploadServiceTest {

    private static MultipartFile file(String name) {
        return new MockMultipartFile("file", name, "application/octet-stream",
                ("内容-" + name).getBytes(StandardCharsets.UTF_8));
    }

    private static class Fixture {
        final KnowledgeFileStore store = mock(KnowledgeFileStore.class);
        final KnowledgeFileMapper fileMapper = mock(KnowledgeFileMapper.class);
        final KnowledgeDocMapper docMapper = mock(KnowledgeDocMapper.class);
        final KnowledgeProperties properties = new KnowledgeProperties();
        final KnowledgeUploadService service;

        Fixture() {
            when(fileMapper.selectCount(any())).thenReturn(0L);
            when(docMapper.insert(any(KnowledgeDocEntity.class))).thenReturn(1);
            when(fileMapper.insert(any(KnowledgeFileEntity.class))).thenReturn(1);
            doAnswer(inv -> {
                MultipartFile uploaded = inv.getArgument(0);
                String docId = inv.getArgument(1);
                String fileId = inv.getArgument(2);
                String key = KnowledgeStorageKeys.sourceKey(
                        KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX, docId, fileId,
                        uploaded.getOriginalFilename());
                return new KnowledgeFileStore.StoredObject("yqbucket", key, "/" + key,
                        dynamicHash() + "-" + uploaded.getOriginalFilename(),
                        uploaded.getSize(), "application/octet-stream");
            }).when(store).store(any(), anyString(), anyString());
            service = new KnowledgeUploadService(store, fileMapper, docMapper, properties);
        }

        /** 默认每次上传 hash 不同；需要同 hash 时由测试覆写 store.store */
        String dynamicHash() {
            return "hash-" + System.nanoTime();
        }
    }

    @Test
    @DisplayName("同名文件上传两次：两次都写 MinIO，两个对象 key 不同，元数据各写一行")
    void sameNameUploadedTwiceBothStored() {
        Fixture f = new Fixture();

        KnowledgeUploadVO first = f.service.upload(file("防洪预案.docx"), "调度");
        KnowledgeUploadVO second = f.service.upload(file("防洪预案.docx"), "调度");

        verify(f.store, times(2)).store(any(), anyString(), anyString());
        assertThat(first.getObjectKey()).isNotBlank().isNotEqualTo(second.getObjectKey());
        assertThat(first.getViewPath()).startsWith("/docFiles/knowledge/");
        assertThat(second.getViewPath()).startsWith("/docFiles/knowledge/");
        assertThat(first.getResourceUrl()).startsWith("/resourceShow/file?path=");
        assertThat(second.getResourceUrl()).startsWith("/resourceShow/file?path=");
        assertThat(first.isMetaPersisted()).isTrue();
        assertThat(second.isMetaPersisted()).isTrue();
        verify(f.fileMapper, times(2)).insert(any(KnowledgeFileEntity.class));
        verify(f.docMapper, times(2)).insert(any(KnowledgeDocEntity.class));
    }

    @Test
    @DisplayName("fileHash 相同也照样保存：只标 IS_DUPLICATE=1 / ATTACHMENT，且跳过阶段 2 切片")
    void sameHashStillStoredButMarkedAsAttachment() {
        Fixture f = new Fixture();
        doAnswer(inv -> {
            MultipartFile uploaded = inv.getArgument(0);
            String docId = inv.getArgument(1);
            String fileId = inv.getArgument(2);
            String key = KnowledgeStorageKeys.sourceKey(
                    KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX, docId, fileId,
                    uploaded.getOriginalFilename());
            return new KnowledgeFileStore.StoredObject("yqbucket", key, "/" + key,
                    "SAME-HASH", uploaded.getSize(), "application/octet-stream");
        }).when(f.store).store(any(), anyString(), anyString());
        // 第一次：hash 0 / group 0；第二次：hash 命中 1
        when(f.fileMapper.selectCount(any())).thenReturn(0L, 0L, 1L);

        KnowledgeUploadVO first = f.service.upload(file("A.docx"), null);
        KnowledgeUploadVO second = f.service.upload(file("A.docx"), null);

        verify(f.store, times(2)).store(any(), anyString(), anyString());
        assertThat(first.getDedupDecision()).isEqualTo("CANONICAL");
        assertThat(second.getDedupDecision()).isEqualTo("ATTACHMENT");
        assertThat(second.getIsDuplicate()).isEqualTo(1);
        assertThat(second.getParseStatus()).isEqualTo("SKIPPED_DUP");
        assertThat(second.getObjectKey()).isNotBlank().isNotEqualTo(first.getObjectKey());
        assertThat(second.getIndexed()).isZero();
    }

    @Test
    @DisplayName("同名但内容不同：一律 INDEPENDENT，绝不按文件名硬合并")
    void sameGroupDifferentHashIsIndependent() {
        Fixture f = new Fixture();
        // 第一次：hash 0 / group 0；第二次：hash 0 / group 命中 1
        when(f.fileMapper.selectCount(any())).thenReturn(0L, 0L, 0L, 1L);

        KnowledgeUploadVO word = f.service.upload(file("台账.docx"), null);
        KnowledgeUploadVO excel = f.service.upload(file("台账.xlsx"), null);

        assertThat(word.getDedupDecision()).isEqualTo("CANONICAL");
        assertThat(excel.getDedupDecision()).isEqualTo("INDEPENDENT");
        assertThat(excel.getSourceType()).isEqualTo("EXCEL");
        assertThat(excel.getGroupId()).isEqualTo(word.getGroupId());
        assertThat(excel.getDocId()).isNotEqualTo(word.getDocId());
        assertThat(excel.getObjectKey()).isNotBlank().isNotEqualTo(word.getObjectKey());
    }

    @Test
    @DisplayName("达梦表未建：文件仍已写入 MinIO，返回 metaPersisted=false 与建表提示")
    void dbFailureDoesNotRollbackStoredFile() {
        Fixture f = new Fixture();
        when(f.docMapper.insert(any(KnowledgeDocEntity.class)))
                .thenThrow(new RuntimeException("table or view does not exist"));

        KnowledgeUploadVO vo = f.service.upload(file("无表.docx"), null);

        verify(f.store, times(1)).store(any(), anyString(), anyString());
        assertThat(vo.getObjectKey()).isNotBlank();
        assertThat(vo.isMetaPersisted()).isFalse();
        assertThat(vo.getWarning()).contains("knowledge_schema.sql");
        assertThat(vo.getError()).isNull();
    }

    @Test
    @DisplayName("批量：单个文件失败不影响其它文件继续入库")
    void batchContinuesOnSingleFailure() {
        Fixture f = new Fixture();
        doAnswer(inv -> {
            MultipartFile uploaded = inv.getArgument(0);
            String docId = inv.getArgument(1);
            String fileId = inv.getArgument(2);
            String key = KnowledgeStorageKeys.sourceKey(
                    KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX, docId, fileId,
                    uploaded.getOriginalFilename());
            if ("bad.pdf".equals(uploaded.getOriginalFilename())) {
                throw new IllegalStateException("MinIO 连接中断");
            }
            return new KnowledgeFileStore.StoredObject("yqbucket", key, "/" + key,
                    "h-" + fileId, uploaded.getSize(), "application/octet-stream");
        }).when(f.store).store(any(), anyString(), anyString());

        List<KnowledgeUploadVO> rows = f.service.uploadBatch(
                List.of(file("good.docx"), file("bad.pdf"), file("also-good.xlsx")), null);

        assertThat(rows).hasSize(3);
        assertThat(rows.get(0).getObjectKey()).isNotBlank();
        assertThat(rows.get(1).getError()).contains("入库失败");
        assertThat(rows.get(2).getObjectKey()).isNotBlank();
        verify(f.store, times(3)).store(any(), anyString(), anyString());
    }
}
