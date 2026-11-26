package cn.lonwin.module.knowledge.index;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.parser.ParsedDocument;
import cn.lonwin.module.knowledge.parser.ParsedDocument.Element;
import cn.lonwin.module.knowledge.parser.ParsedDocument.ElementType;
import cn.lonwin.module.knowledge.storage.KnowledgeStorageKeys;

class KnowledgeChunkerTest {

    private final KnowledgeProperties properties = new KnowledgeProperties();
    private final KnowledgeChunker chunker = new KnowledgeChunker(properties);

    private static final String OBJECT_KEY =
            "docFiles/knowledge/doc-1/source/f-1_防洪预案.docx";

    private static KnowledgeChunker.ChunkContext context() {
        return new KnowledgeChunker.ChunkContext("doc-1", "防洪预案", "doc-1",
                "防洪预案.docx", "防洪预案",
                KnowledgeStorageKeys.resourceUrl(OBJECT_KEY), "WORD");
    }

    @Test
    @DisplayName("上下文头前置：embedText 带文件名 / 章节 / 类型，text 保持纯正文")
    void contextHeaderIsPrependedToEmbedTextOnly() {
        ParsedDocument doc = new ParsedDocument("doc-1", "防洪预案.docx", "WORD",
                List.of(new Element(ElementType.HEAD, "第一章 总则", "第一章 总则", null, null, null, 0),
                        new Element(ElementType.TEXT, "第一章 总则", "本预案适用于取水许可管理。",
                                null, null, null, 1)),
                "hash", false);

        List<KnowledgeChunk> chunks = chunker.chunk(doc, context());

        assertThat(chunks).isNotEmpty();
        KnowledgeChunk first = chunks.get(0);
        assertThat(first.embedText()).contains("【文件】防洪预案.docx")
                .contains("【章节】第一章 总则").contains("【类型】");
        assertThat(first.text()).doesNotContain("【文件】");
        assertThat(first.collection()).isEqualTo("kp_chunks");
    }

    @Test
    @DisplayName("表格独立成块进 kp_tables，并生成「表头:值」检索文本")
    void tableBecomesItsOwnPointWithKeyValueText() {
        List<List<String>> table = List.of(
                List.of("项目", "数值"),
                List.of("许可水量", "100 万立方米"),
                List.of("有效期", "2026 年"));
        ParsedDocument doc = new ParsedDocument("doc-1", "a.xlsx", "EXCEL",
                List.of(new Element(ElementType.TABLE, "Sheet1", "ignored", table, null, null, 0)),
                "hash", false);

        List<KnowledgeChunk> chunks = chunker.chunk(doc, context());

        assertThat(chunks).hasSize(1);
        KnowledgeChunk chunk = chunks.get(0);
        assertThat(chunk.collection()).isEqualTo("kp_tables");
        assertThat(chunk.payload().get("elemType")).isEqualTo("TABLE");
        assertThat(chunk.text()).contains("项目:许可水量").contains("数值:100 万立方米");
    }

    @Test
    @DisplayName("payload 对齐检索侧：filePath 必须是可点开的多级 resourceUrl")
    void payloadCarriesViewableFilePath() {
        ParsedDocument doc = new ParsedDocument("doc-1", "a.pdf", "PDF",
                List.of(new Element(ElementType.TEXT, "第 1 页", "正文内容", null, null, 1, 0)),
                "hash", false);

        KnowledgeChunk chunk = chunker.chunk(doc, context()).get(0);

        assertThat(chunk.payload().get("filePath")).isEqualTo(
                KnowledgeStorageKeys.resourceUrl(OBJECT_KEY));
        assertThat((String) chunk.payload().get("filePath"))
                .startsWith("/resourceShow/file?path=");
        assertThat(chunk.payload().get("docId")).isEqualTo("doc-1");
        assertThat(chunk.payload().get("pageNo")).isEqualTo(1);
        assertThat(chunk.payload().get("groupId")).isEqualTo("防洪预案");
        assertThat(chunk.payload().get("enabled")).isEqualTo(true);
    }

    @Test
    @DisplayName("确定性 ID：同一份文档重复切片 ID 不变，重建不会翻倍")
    void idsAreDeterministic() {
        ParsedDocument doc = new ParsedDocument("doc-1", "a.pdf", "PDF",
                List.of(new Element(ElementType.TEXT, "第 1 页", "稳定内容", null, null, 1, 0)),
                "hash", false);

        List<KnowledgeChunk> first = chunker.chunk(doc, context());
        List<KnowledgeChunk> second = chunker.chunk(doc, context());

        assertThat(first.get(0).id()).isEqualTo(second.get(0).id())
                // Qdrant 只接受 unsigned integer 或 UUID，普通字符串会被 400 拒绝
                .matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
    }

    @Test
    @DisplayName("超长段落按句读切分，每段不超过 hardMax")
    void longTextIsSplitWithinHardMax() {
        String sentence = "这是一句用于测试切分逻辑的较长文本。".repeat(80);
        List<String> pieces = KnowledgeChunker.splitLong(sentence, 200);

        assertThat(pieces).hasSizeGreaterThan(1);
        assertThat(pieces).allSatisfy(piece -> assertThat(piece.length()).isLessThanOrEqualTo(200));
    }
}
