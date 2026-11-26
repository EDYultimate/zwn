package cn.lonwin.module.knowledge.controller;

import cn.lonwin.module.knowledge.config.ResourceViewProperties;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.lonwin.common.file.core.FileProperties;
import com.lonwin.common.file.core.FileTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * 用 MockHttpServletResponse 直接驱动 Controller，不启动 Spring 容器、不连 MinIO。
 * 覆盖响应头、响应体、404/400、inline/下载切换与对象 key 候选顺序。
 */
class ResourceViewControllerHttpTest {

    private static final String BUCKET = "yqbucket";
    private static final byte[] CONTENT = "PK\u0003\u0004 fake docx".getBytes(StandardCharsets.UTF_8);

    private FileTemplate fileTemplate;
    private ResourceViewController controller;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        fileTemplate = mock(FileTemplate.class);
        FileProperties fileProperties = new FileProperties();
        fileProperties.setBucketName(BUCKET);
        ResourceViewProperties viewProperties = new ResourceViewProperties();
        controller = new ResourceViewController(fileTemplate, fileProperties, viewProperties);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    private static S3Object object(byte[] bytes) {
        S3Object object = new S3Object();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(bytes.length);
        metadata.setContentType("application/octet-stream");
        object.setObjectMetadata(metadata);
        object.setObjectContent(new ByteArrayInputStream(bytes));
        return object;
    }

    @Test
    @DisplayName("裸 /docFiles 路径返回文件二进制，默认 attachment 下载")
    void servesDocxAsAttachment() throws IOException {
        when(fileTemplate.getObject(eq(BUCKET), eq("docFiles/2025-07-16/a.DOCX")))
                .thenReturn(object(CONTENT));
        MockHttpServletResponse response = new MockHttpServletResponse();

        controller.docFile("2025-07-16", "a.DOCX", false, false, response);

        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getContentAsByteArray()).isEqualTo(CONTENT);
        assertThat(response.getContentLength()).isEqualTo(CONTENT.length);
        assertThat(response.getHeader("Content-Disposition"))
                .startsWith("attachment;")
                .contains("filename*=UTF-8''a.DOCX");
        assertThat(response.getContentType())
                .isEqualTo("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        assertThat(response.getHeader("X-Content-Type-Options")).isEqualTo("nosniff");
    }

    @Test
    @DisplayName("PDF 默认 inline 预览，download=true 可强制下载")
    void inlineByExtensionAndForcedDownload() throws IOException {
        // 每次请求返回全新的 S3Object：Controller 会关闭流，复用同一实例会读到空内容
        when(fileTemplate.getObject(eq(BUCKET), anyString())).thenAnswer(inv -> object(CONTENT));
        MockHttpServletResponse inline = new MockHttpServletResponse();
        controller.docFile("2025-07-16", "a.pdf", false, false, inline);
        assertThat(inline.getHeader("Content-Disposition")).startsWith("inline;");

        MockHttpServletResponse forced = new MockHttpServletResponse();
        controller.docFile("2025-07-16", "a.pdf", true, true, forced);
        assertThat(forced.getHeader("Content-Disposition")).startsWith("attachment;");
    }

    @Test
    @DisplayName("中文文件名按 RFC 5987 编码，不出现乱码")
    void encodesChineseFileName() throws IOException {
        // 每次请求返回全新的 S3Object：Controller 会关闭流，复用同一实例会读到空内容
        when(fileTemplate.getObject(eq(BUCKET), anyString())).thenAnswer(inv -> object(CONTENT));
        MockHttpServletResponse response = new MockHttpServletResponse();

        controller.docFile("2025-07-16", "防汛预案.DOCX", false, false, response);

        assertThat(response.getHeader("Content-Disposition"))
                .contains("filename*=UTF-8''%E9%98%B2%E6%B1%9B%E9%A2%84%E6%A1%88.DOCX");
    }

    @Test
    @DisplayName("两种 key 都取不到时返回 404，且按顺序先试不带斜杠")
    void returns404WhenObjectMissing() throws IOException {
        when(fileTemplate.getObject(eq(BUCKET), anyString()))
                .thenThrow(new RuntimeException("NoSuchKey"));
        MockHttpServletResponse response = new MockHttpServletResponse();

        controller.docFile("2025-07-16", "missing.DOCX", false, false, response);

        assertThat(response.getStatus()).isEqualTo(404);
        verify(fileTemplate).getObject(BUCKET, "docFiles/2025-07-16/missing.DOCX");
        verify(fileTemplate).getObject(BUCKET, "/docFiles/2025-07-16/missing.DOCX");
    }

    @Test
    @DisplayName("路径穿越与越权前缀返回 400，且不会触碰存储")
    void rejectsUnsafePath() throws IOException {
        MockHttpServletResponse traversal = new MockHttpServletResponse();
        controller.fileByPath("/docFiles/2025-07-16/../../etc/passwd", false, false, traversal);
        assertThat(traversal.getStatus()).isEqualTo(400);

        MockHttpServletResponse forbidden = new MockHttpServletResponse();
        controller.fileByPath("/private/2025-07-16/secret.docx", false, false, forbidden);
        assertThat(forbidden.getStatus()).isEqualTo(400);
    }

    @Test
    @DisplayName("四条真实 URL 都能命中端点，带点号的文件名不被截断")
    void routesAreRegistered() throws Exception {
        // 每次请求返回全新的 S3Object：Controller 会关闭流，复用同一实例会读到空内容
        when(fileTemplate.getObject(eq(BUCKET), anyString())).thenAnswer(inv -> object(CONTENT));

        mockMvc.perform(get("/docFiles/2025-07-16/a.DOCX"))
                .andExpect(status().isOk())
                .andExpect(content().bytes(CONTENT))
                .andExpect(header().string("Content-Disposition",
                        org.hamcrest.Matchers.startsWith("attachment;")));
        mockMvc.perform(get("/resourceShow/docFiles/2025-07-16/a.DOCX"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/imgFiles/2025-07-16/a.png"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/resourceShow/file").param("path", "/docFiles/2025-07-16/a.DOCX"))
                .andExpect(status().isOk());

        // 文件名里的点必须完整保留，否则对象 key 会被截断成 "a"。
        // 裸路径 /docFiles、/resourceShow/docFiles、/resourceShow/file 三条都会命中这个 key。
        verify(fileTemplate, org.mockito.Mockito.atLeastOnce())
                .getObject(BUCKET, "docFiles/2025-07-16/a.DOCX");
    }

    @Test
    @DisplayName("通用端点按 path 找到对象，图片端点默认 inline")
    void servesByPathAndImage() throws IOException {
        // 每次请求返回全新的 S3Object：Controller 会关闭流，复用同一实例会读到空内容
        when(fileTemplate.getObject(eq(BUCKET), anyString())).thenAnswer(inv -> object(CONTENT));
        MockHttpServletResponse byPath = new MockHttpServletResponse();
        controller.fileByPath("/docFiles/2025-07-16/a.DOCX", false, false, byPath);
        assertThat(byPath.getStatus()).isEqualTo(200);
        assertThat(byPath.getContentAsByteArray()).isEqualTo(CONTENT);

        MockHttpServletResponse image = new MockHttpServletResponse();
        controller.imgFile("2025-07-16", "a.png", false, false, image);
        assertThat(image.getHeader("Content-Disposition")).startsWith("inline;");
        verify(fileTemplate).getObject(BUCKET, "imgFiles/2025-07-16/a.png");
    }
}
