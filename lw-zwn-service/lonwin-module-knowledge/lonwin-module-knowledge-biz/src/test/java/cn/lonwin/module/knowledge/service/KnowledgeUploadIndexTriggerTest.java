package cn.lonwin.module.knowledge.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeFileEntity;
import cn.lonwin.module.knowledge.index.KnowledgeIndexService;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeFileMapper;
import cn.lonwin.module.knowledge.storage.KnowledgeFileStore;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;

/** 上传即入库的触发契约：文件先无条件落 MinIO，随后立即触发 Qdrant 写入。 */
class KnowledgeUploadIndexTriggerTest {

    private static MultipartFile file(String name) {
        return new MockMultipartFile("file", name, "application/octet-stream",
                ("内容-" + name).getBytes(StandardCharsets.UTF_8));
    }

    private static class Fixture {
        final KnowledgeProperties properties = new KnowledgeProperties();
        final KnowledgeIndexService indexService = mock(KnowledgeIndexService.class);
        final KnowledgeFileMapper fileMapper = mock(KnowledgeFileMapper.class);
        final KnowledgeUploadService service;

        Fixture() {
            KnowledgeFileStore store = mock(KnowledgeFileStore.class);
            KnowledgeDocMapper docMapper = mock(KnowledgeDocMapper.class);
            when(fileMapper.selectCount(any())).thenReturn(0L);
            when(docMapper.insert(any(KnowledgeDocEntity.class))).thenReturn(1);
            when(fileMapper.insert(any(KnowledgeFileEntity.class))).thenReturn(1);
            doAnswer(inv -> {
                MultipartFile uploaded = inv.getArgument(0);
                String key = KnowledgeStorageKeys.sourceKey(
                        KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX,
                        inv.getArgument(1), inv.getArgument(2), uploaded.getOriginalFilename());
                return new KnowledgeFileStore.StoredObject("yqbucket", key, "/" + key,
                        "hash-" + System.nanoTime(), uploaded.getSize(), "application/octet-stream");
            }).when(store).store(any(), anyString(), anyString());
            service = new KnowledgeUploadService(store, fileMapper, docMapper, properties);
            ReflectionTestUtils.setField(service, "indexService", indexService);
        }
    }

    @Test
    @DisplayName("默认异步：上传成功即投递索引任务，不占用上传请求线程")
    void uploadTriggersAsyncIndex() {
        Fixture f = new Fixture();

        KnowledgeUploadVO vo = f.service.upload(file("防洪预案.docx"), null);

        assertThat(vo.getIndexMode()).isEqualTo("async");
        verify(f.indexService).indexAsync(vo.getFileId());
        verify(f.indexService, never()).index(anyString());
    }

    @Test
    @DisplayName("index.sync=true：上传请求内同步完成索引")
    void syncModeIndexesInRequestThread() {
        Fixture f = new Fixture();
        f.properties.getIndex().setSync(true);

        KnowledgeUploadVO vo = f.service.upload(file("防洪预案.pdf"), null);

        assertThat(vo.getIndexMode()).isEqualTo("sync");
        verify(f.indexService).index(vo.getFileId());
        verify(f.indexService, never()).indexAsync(anyString());
    }

    @Test
    @DisplayName("同源附件只存 MinIO，不触发切片入库")
    void duplicateAttachmentSkipsIndexTrigger() {
        Fixture f = new Fixture();
        // 同 hash 已存在 → ATTACHMENT / SKIPPED_DUP；doReturn 避免覆写 stub 时触发旧 stub
        org.mockito.Mockito.doReturn(1L).when(f.fileMapper).selectCount(any());

        KnowledgeUploadVO vo = f.service.upload(file("防洪预案.docx"), null);

        assertThat(vo.getDedupDecision()).isEqualTo("ATTACHMENT");
        assertThat(vo.getIndexMode()).isEqualTo("skipped-duplicate");
        verify(f.indexService, never()).indexAsync(anyString());
        verify(f.indexService, never()).index(anyString());
    }

    @Test
    @DisplayName("索引触发异常不影响上传结果：文件仍已写入 MinIO")
    void indexTriggerFailureDoesNotBreakUpload() {
        Fixture f = new Fixture();
        doThrow(new IllegalStateException("线程池已满")).when(f.indexService).indexAsync(anyString());

        KnowledgeUploadVO vo = f.service.upload(file("手册.pdf"), null);

        assertThat(vo.getObjectKey()).isNotBlank();
        assertThat(vo.isMetaPersisted()).isTrue();
        assertThat(vo.getIndexMode()).isEqualTo("trigger-failed");
    }

    @Test
    @DisplayName("关闭 index.enabled：上传照常成功，只是不写 Qdrant")
    void disabledIndexStillStoresFile() {
        Fixture f = new Fixture();
        f.properties.getIndex().setEnabled(false);

        KnowledgeUploadVO vo = f.service.upload(file("手册.pdf"), null);

        assertThat(vo.getObjectKey()).isNotBlank();
        assertThat(vo.getIndexMode()).isEqualTo("disabled");
        verify(f.indexService, never()).indexAsync(anyString());
    }
}
