package cn.lonwin.module.knowledge.index;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import cn.lonwin.module.knowledge.config.KnowledgeProperties;
import cn.lonwin.module.knowledge.parser.ParsedDocument;
import cn.lonwin.module.knowledge.parser.ParsedDocument.Element;
import cn.lonwin.module.knowledge.parser.ParsedDocument.ElementType;
import cn.lonwin.module.knowledge.parser.WordParser;

/**
 * 结构化元素 → 检索单元。
 *
 * <p>三条精度策略在这里落地：
 * <ul>
 *   <li><b>上下文头前置</b>：每个片段的 embedText 带文件名 / 章节路径 / 元素类型；</li>
 *   <li><b>表格双表示</b>：二维数组留在 parsed.json 给明细渲染，检索文本用「表头:值」展开；</li>
 *   <li><b>表格独立成块</b>：不与正文混切，按固定行数分块进 kp_tables，避免表头丢失。</li>
 * </ul>
 *
 * <p>point ID 由内容决定，重复上传 / 重试 / 重建都不会产生重复点。
 */
public class KnowledgeChunker {

    /**
     * @param docId           逻辑文档 ID
     * @param groupId         同名文件去重组
     * @param canonicalDocId  组内主版本，无则为空
     * @param fileName        原始文件名
     * @param title           展示标题
     * @param filePath        前端可点开的原文地址（/resourceShow/file?path=...）
     * @param sourceType      WORD / PDF / EXCEL / OTHER
     */
    public record ChunkContext(String docId, String groupId, String canonicalDocId,
                               String fileName, String title, String filePath,
                               String sourceType) { }

    private final KnowledgeProperties properties;

    public KnowledgeChunker(KnowledgeProperties properties) {
        this.properties = properties;
    }

    public List<KnowledgeChunk> chunk(ParsedDocument document, ChunkContext context) {
        KnowledgeProperties.Index cfg = properties.getIndex();
        List<KnowledgeChunk> chunks = new ArrayList<>();
        StringBuilder buffer = new StringBuilder();
        String currentSection = "";
        Integer currentPage = null;
        ElementType currentType = ElementType.TEXT;

        for (Element element : document.elements()) {
            if (element.type() == ElementType.TABLE) {
                flush(buffer, currentSection, currentPage, currentType, context, chunks);
                buffer.setLength(0);
                addTableChunks(element, context, chunks);
                continue;
            }
            String text = element.text();
            if (text == null || text.isBlank()) {
                continue;
            }
            if (buffer.isEmpty()) {
                currentSection = element.sectionPath() == null ? "" : element.sectionPath();
                currentPage = element.pageNo();
                currentType = element.type();
            }
            if (text.length() > cfg.getHardMax()) {
                flush(buffer, currentSection, currentPage, currentType, context, chunks);
                buffer.setLength(0);
                for (String piece : splitLong(text, cfg.getHardMax())) {
                    buffer.append(piece);
                    flush(buffer, currentSection, currentPage, currentType, context, chunks);
                    buffer.setLength(0);
                }
                continue;
            }
            if (!buffer.isEmpty()) {
                buffer.append('\n');
            }
            buffer.append(text);
            if (buffer.length() >= cfg.getChunkMax()) {
                flush(buffer, currentSection, currentPage, currentType, context, chunks);
                buffer.setLength(0);
            }
        }
        flush(buffer, currentSection, currentPage, currentType, context, chunks);
        return chunks;
    }

    private void addTableChunks(Element element, ChunkContext context, List<KnowledgeChunk> chunks) {
        List<List<String>> table = element.table();
        if (table == null || table.isEmpty()) {
            return;
        }
        KnowledgeProperties.Index cfg = properties.getIndex();
        int rowsPerPoint = Math.max(1, cfg.getTableRowsPerPoint());
        List<String> header = table.get(0);
        for (int start = 1; start < table.size(); start += rowsPerPoint) {
            int end = Math.min(table.size(), start + rowsPerPoint);
            List<List<String>> part = new ArrayList<>();
            part.add(header);
            part.addAll(table.subList(start, end));
            String text = WordParser.tableToText(part);
            if (!text.isBlank()) {
                chunks.add(build(properties.getCollectionTables(), text, "TABLE",
                        element.sectionPath(), element.pageNo(), context, chunks.size()));
            }
        }
        if (table.size() == 1) {
            chunks.add(build(properties.getCollectionTables(), WordParser.tableToText(table), "TABLE",
                    element.sectionPath(), element.pageNo(), context, chunks.size()));
        }
    }

    private void flush(StringBuilder buffer, String section, Integer pageNo, ElementType type,
                       ChunkContext context, List<KnowledgeChunk> chunks) {
        if (buffer.isEmpty() || buffer.toString().isBlank()) {
            return;
        }
        chunks.add(build(properties.getCollectionChunks(), buffer.toString().trim(),
                type.name(), section, pageNo, context, chunks.size()));
    }

    private KnowledgeChunk build(String collection, String text, String elemType,
                                 String sectionPath, Integer pageNo,
                                 ChunkContext context, int seq) {
        String section = sectionPath == null ? "" : sectionPath;
        String embedText = properties.getIndex().isContextHeader()
                ? "【文件】" + nullToEmpty(context.fileName())
                + "【章节】" + section
                + "【类型】" + elemType + "\n" + text
                : text;
        String textHash = sha256(text).substring(0, 16);
        // Qdrant 的 point ID 只接受 unsigned integer 或标准 UUID，普通字符串会 400。
        // nameUUIDFromBytes 是确定性的 name-based UUID，重复上传/重建覆盖同一点。
        String id = UUID.nameUUIDFromBytes(
                (context.docId() + "|" + collection + "|" + seq + "|" + textHash)
                        .getBytes(StandardCharsets.UTF_8)).toString();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("docId", context.docId());
        payload.put("docType", "UPLOAD");
        payload.put("title", nullToEmpty(context.title()));
        payload.put("fileName", nullToEmpty(context.fileName()));
        payload.put("filePath", nullToEmpty(context.filePath()));
        payload.put("sectionPath", section);
        payload.put("elemType", elemType);
        payload.put("text", text);
        payload.put("embedderId", properties.getEmbedderId());
        payload.put("groupId", nullToEmpty(context.groupId()));
        payload.put("canonicalDocId", nullToEmpty(context.canonicalDocId()));
        payload.put("sourceType", nullToEmpty(context.sourceType()));
        payload.put("chunkVersion", "kb-java-v1");
        payload.put("chunkIndex", seq);
        payload.put("textHash", textHash);
        payload.put("enabled", true);
        if (pageNo != null) {
            payload.put("pageNo", pageNo);
        }
        return new KnowledgeChunk(id, collection, text, embedText, payload);
    }

    /** 超长文本先按句读切，仍超长再硬切，避免把一个段落丢进一个点 */
    static List<String> splitLong(String text, int max) {
        List<String> pieces = new ArrayList<>();
        String[] sentences = text.split("(?<=[。；！？\\n;!?])");
        StringBuilder current = new StringBuilder();
        for (String sentence : sentences) {
            if (sentence.isEmpty()) {
                continue;
            }
            if (current.length() + sentence.length() > max && !current.isEmpty()) {
                pieces.add(current.toString());
                current.setLength(0);
            }
            if (sentence.length() > max) {
                for (int i = 0; i < sentence.length(); i += max) {
                    pieces.add(sentence.substring(i, Math.min(sentence.length(), i + max)));
                }
            } else {
                current.append(sentence);
            }
        }
        if (!current.isEmpty()) {
            pieces.add(current.toString());
        }
        return pieces;
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private static String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("JVM 不支持 SHA-256", e);
        }
    }
}
