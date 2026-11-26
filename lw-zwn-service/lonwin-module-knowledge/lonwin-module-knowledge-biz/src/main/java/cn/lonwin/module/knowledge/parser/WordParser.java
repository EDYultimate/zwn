package cn.lonwin.module.knowledge.parser;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xwpf.usermodel.IBodyElement;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFPicture;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

import cn.lonwin.module.knowledge.parser.ParsedDocument.Element;
import cn.lonwin.module.knowledge.parser.ParsedDocument.ElementType;
import lombok.extern.slf4j.Slf4j;

/**
 * Word 结构化解析（对应 knowledge-platform 的 {@code WordAnalyse} 能力，剥掉 ES/Mongo 依赖）。
 *
 * <p>遍历 {@code XWPFDocument.getBodyElements()} 保留文档顺序：
 * <ul>
 *   <li>标题段落 → HEAD，按「第X章 / 1.2 / 一、」推断层级，维护章节栈生成 sectionPath；</li>
 *   <li>表格 → TABLE，二维数组原样保留，另生成「表头:值」检索文本；</li>
 *   <li>内嵌图片 → PIC，字节交给 ImageSink 落 MinIO，文本只写 [图片] 占位（按约定不做 caption）；</li>
 *   <li>其余段落 → TEXT。</li>
 * </ul>
 *
 * <p>老 {@code .doc} 走 HWPF 退化成纯文本，不伪造不存在的结构。
 */
@Slf4j
public class WordParser implements DocumentParser {

    private static final Pattern NUMBERED = Pattern.compile("^(\\d+(?:\\.\\d+)*)[\\s、.．]+.*");
    private static final Pattern CHAPTER = Pattern.compile("^第[一二三四五六七八九十百零〇\\d]+[章节篇部]\\s*.*");
    private static final Pattern CN_NUMBERED = Pattern.compile("^[一二三四五六七八九十]+[、.．]\\s*.*");
    private static final Pattern CATALOG = Pattern.compile(".*[.．·]{3,}\\s*\\d+\\s*$|.*\\t\\s*\\d+\\s*$");

    @Override
    public String sourceType() {
        return "WORD";
    }

    @Override
    public ParsedDocument parse(byte[] bytes, ParseContext context) throws Exception {
        return "doc".equals(context.extension())
                ? parseLegacyDoc(bytes, context)
                : parseDocx(bytes, context);
    }

    private ParsedDocument parseDocx(byte[] bytes, ParseContext context) throws Exception {
        List<Element> elements = new ArrayList<>();
        List<String> sectionStack = new ArrayList<>();
        int[] pictureIndex = { 0 };
        try (XWPFDocument document = new XWPFDocument(new ByteArrayInputStream(bytes))) {
            for (IBodyElement body : document.getBodyElements()) {
                if (body instanceof XWPFParagraph paragraph) {
                    addParagraph(paragraph, context, sectionStack, elements, pictureIndex);
                } else if (body instanceof XWPFTable table) {
                    addTable(table, sectionStack, elements);
                }
            }
        }
        return new ParsedDocument(context.docId(), context.fileName(), sourceType(),
                elements, DocumentParser.textHash(elements), false);
    }

    private void addParagraph(XWPFParagraph paragraph, ParseContext context,
                              List<String> sectionStack, List<Element> elements, int[] pictureIndex) {
        String text = paragraph.getText();
        String clean = text == null ? "" : text.replace('\u0007', ' ').trim();
        String style = paragraph.getStyle();

        if (!clean.isEmpty()) {
            int level = headingLevel(clean, style);
            if (level > 0) {
                while (sectionStack.size() >= level) {
                    sectionStack.remove(sectionStack.size() - 1);
                }
                sectionStack.add(clean);
            }
            String sectionPath = String.join(" > ", sectionStack);
            ElementType type = level > 0 ? ElementType.HEAD
                    : (CATALOG.matcher(clean).matches() ? ElementType.CATALOG : ElementType.TEXT);
            elements.add(new Element(type, sectionPath, clean, null, null, null, elements.size()));
        }

        for (XWPFRun run : paragraph.getRuns()) {
            for (XWPFPicture picture : run.getEmbeddedPictures()) {
                byte[] data = picture.getPictureData().getData();
                String ext = picture.getPictureData().suggestFileExtension();
                if (ext == null || ext.isBlank()) {
                    ext = "png";
                }
                String imgKey = context.imageSink().save(pictureIndex[0]++, ext, data);
                elements.add(new Element(ElementType.PIC, String.join(" > ", sectionStack),
                        "[图片]", null, imgKey, null, elements.size()));
            }
        }
    }

    private void addTable(XWPFTable table, List<String> sectionStack, List<Element> elements) {
        List<List<String>> rows = new ArrayList<>();
        for (XWPFTableRow row : table.getRows()) {
            List<String> cells = new ArrayList<>();
            for (XWPFTableCell cell : row.getTableCells()) {
                String value = cell.getText();
                cells.add(value == null ? "" : value.replace('\n', ' ').replace('\u0007', ' ').trim());
            }
            rows.add(cells);
        }
        if (rows.isEmpty()) {
            return;
        }
        elements.add(new Element(ElementType.TABLE, String.join(" > ", sectionStack),
                tableToText(rows), rows, null, null, elements.size()));
    }

    /** 首行作表头，每行展开成「表头:值」；比整表压平更利于向量检索命中 */
    public static String tableToText(List<List<String>> rows) {
        List<String> header = rows.get(0);
        StringBuilder sb = new StringBuilder();
        for (int r = 1; r < rows.size(); r++) {
            List<String> row = rows.get(r);
            for (int c = 0; c < row.size(); c++) {
                String key = c < header.size() && !header.get(c).isBlank()
                        ? header.get(c) : ("列" + (c + 1));
                String value = row.get(c);
                if (value == null || value.isBlank()) {
                    continue;
                }
                if (!sb.isEmpty()) {
                    sb.append("；");
                }
                sb.append(key).append(':').append(value);
            }
            sb.append('\n');
        }
        if (sb.isEmpty()) {
            for (List<String> row : rows) {
                sb.append(String.join(" | ", row)).append('\n');
            }
        }
        return sb.toString().trim();
    }

    /** 0 = 正文；其余为标题层级（1 最粗） */
    static int headingLevel(String text, String style) {
        if (style != null && !style.isBlank()) {
            String lower = style.toLowerCase(java.util.Locale.ROOT);
            if (lower.contains("heading") || lower.contains("标题") || lower.contains("toc")) {
                return 1;
            }
        }
        if (CHAPTER.matcher(text).matches()) {
            return 1;
        }
        Matcher numbered = NUMBERED.matcher(text);
        if (numbered.matches()) {
            int dots = numbered.group(1).split("\\.").length;
            return Math.min(dots, 6);
        }
        if (CN_NUMBERED.matcher(text).matches()) {
            return 2;
        }
        // 短且无句读的独立行，常见为無编号小标题
        if (text.length() <= 24 && !text.matches(".*[。；，,;:]$")) {
            return 0;
        }
        return 0;
    }

    private ParsedDocument parseLegacyDoc(byte[] bytes, ParseContext context) throws Exception {
        List<Element> elements = new ArrayList<>();
        try (HWPFDocument document = new HWPFDocument(new ByteArrayInputStream(bytes));
             WordExtractor extractor = new WordExtractor(document)) {
            for (String line : extractor.getParagraphText()) {
                String clean = line == null ? "" : line.replace('\r', ' ').replace('\n', ' ').trim();
                if (!clean.isEmpty()) {
                    elements.add(new Element(ElementType.TEXT, "", clean, null, null, null,
                            elements.size()));
                }
            }
        }
        log.debug("[kb-parse] .doc 退化为纯文本：{} 个元素", elements.size());
        return new ParsedDocument(context.docId(), context.fileName(), sourceType(),
                elements, DocumentParser.textHash(elements), false);
    }
}
