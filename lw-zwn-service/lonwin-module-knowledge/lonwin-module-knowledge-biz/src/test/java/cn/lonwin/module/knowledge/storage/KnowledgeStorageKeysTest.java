package cn.lonwin.module.knowledge.storage;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** 对象 key 规范与去重组键的纯逻辑测试，不依赖 Spring 与任何外部服务。 */
class KnowledgeStorageKeysTest {

    @Test
    @DisplayName("同名文件因 fileId 不同生成不同对象 key，绝不互相覆盖")
    void sameNameNeverCollides() {
        String a = KnowledgeStorageKeys.sourceKey(
                KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX, "doc1", "f1", "防洪预案.docx");
        String b = KnowledgeStorageKeys.sourceKey(
                KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX, "doc1", "f2", "防洪预案.docx");

        assertThat(a).isNotEqualTo(b);
        assertThat(a).startsWith("docFiles/knowledge/doc1/source/f1_");
        assertThat(b).startsWith("docFiles/knowledge/doc1/source/f2_");
        assertThat(KnowledgeStorageKeys.viewPath(a)).isEqualTo("/" + a);
        assertThat(KnowledgeStorageKeys.viewPath("/" + a)).isEqualTo("/" + a);
    }

    @Test
    @DisplayName("多级对象 key 生成 /resourceShow/file?path= 角标地址，解码后与裸路径一致")
    void resourceUrlSupportsNestedKey() {
        String key = KnowledgeStorageKeys.sourceKey(
                KnowledgeStorageKeys.DEFAULT_SOURCE_PREFIX, "d1", "f1", "防洪预案.docx");
        String url = KnowledgeStorageKeys.resourceUrl(key);

        assertThat(url).startsWith("/resourceShow/file?path=");
        String decoded = URLDecoder.decode(url.substring("/resourceShow/file?path=".length()),
                StandardCharsets.UTF_8);
        assertThat(decoded).isEqualTo("/" + key);
        assertThat(url).doesNotContain("防洪预案"); // 中文已编码，可直接放进 window.open
    }

    @Test
    @DisplayName("同名 Word/PDF 归一到同一 groupId，但对象 key 仍各自独立")
    void wordAndPdfShareGroup() {
        String wordGroup = KnowledgeStorageKeys.groupKey("防洪预案.docx", "调度");
        String pdfGroup = KnowledgeStorageKeys.groupKey("防洪预案.pdf", "调度");

        assertThat(wordGroup).isEqualTo(pdfGroup).contains("防洪预案").contains("调度");
        String wordKey = KnowledgeStorageKeys.sourceKey("docFiles/knowledge", "d1", "f1", "防洪预案.docx");
        String pdfKey = KnowledgeStorageKeys.sourceKey("docFiles/knowledge", "d1", "f2", "防洪预案.pdf");
        assertThat(wordKey).isNotEqualTo(pdfKey);
    }

    @Test
    @DisplayName("扩展名到来源类型：WORD / PDF / EXCEL / OTHER")
    void sourceTypeMapping() {
        assertThat(KnowledgeStorageKeys.sourceType("a.DOCX")).isEqualTo("WORD");
        assertThat(KnowledgeStorageKeys.sourceType("a.doc")).isEqualTo("WORD");
        assertThat(KnowledgeStorageKeys.sourceType("a.pdf")).isEqualTo("PDF");
        assertThat(KnowledgeStorageKeys.sourceType("a.XLSX")).isEqualTo("EXCEL");
        assertThat(KnowledgeStorageKeys.sourceType("a.csv")).isEqualTo("EXCEL");
        assertThat(KnowledgeStorageKeys.sourceType("a.zip")).isEqualTo("OTHER");
        assertThat(KnowledgeStorageKeys.ext("a.PDF")).isEqualTo("pdf");
    }

    @Test
    @DisplayName("文件名安全化：去路径、去非法字符，保留中文")
    void safeFileName() {
        assertThat(KnowledgeStorageKeys.safeFileName("C:\\docs\\sub/防洪:预案.docx"))
                .isEqualTo("防洪预案.docx");
        assertThat(KnowledgeStorageKeys.safeFileName("../..")).isEqualTo("file");
        assertThat(KnowledgeStorageKeys.safeFileName(null)).isEqualTo("file");
    }

    @Test
    @DisplayName("解析产物 / 分页文本 / 图片 key 都在白名单前缀下")
    void derivedKeysStayInAllowedPrefixes() {
        assertThat(KnowledgeStorageKeys.parsedKey(null, "d1"))
                .isEqualTo("docFiles/knowledge/d1/parsed.json");
        assertThat(KnowledgeStorageKeys.pageKey(null, "d1", 3))
                .isEqualTo("docFiles/knowledge/d1/page/3.txt");
        assertThat(KnowledgeStorageKeys.imageKey(null, "d1", 2))
                .isEqualTo("imgFiles/knowledge/d1/img/2.png");
        assertThat(KnowledgeStorageKeys.sourceKey("/docFiles/knowledge/", "d1", "f1", "a.pdf"))
                .startsWith("docFiles/knowledge/");
    }
}
