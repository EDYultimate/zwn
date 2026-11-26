package cn.lonwin.module.knowledge.parser;

import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import cn.lonwin.module.knowledge.parser.ParsedDocument.Element;
import cn.lonwin.module.knowledge.parser.ParsedDocument.ElementType;
import lombok.extern.slf4j.Slf4j;

/**
 * PDF 解析：沿用 knowledge-platform {@code DocServiceImpl} 的 PDFBox 纯文本思路，
 * 但改成<b>按页</b>抽取并保留换行，页号写进元素的 {@code pageNo}，
 * 供 Qdrant payload 定位引用与后续 small-to-big 回取。
 *
 * <p>扫描件几乎抽不出文字时标 {@code needOcr=true}，不往向量库塞空片段。
 */
@Slf4j
public class PdfParser implements DocumentParser {

    /** 平均每页可打印字符低于该值即判为疑似扫描件 */
    private static final int MIN_CHARS_PER_PAGE = 20;

    @Override
    public String sourceType() {
        return "PDF";
    }

    @Override
    public ParsedDocument parse(byte[] bytes, ParseContext context) throws Exception {
        List<Element> elements = new ArrayList<>();
        int totalChars = 0;
        try (PDDocument document = PDDocument.load(bytes)) {
            int pages = document.getNumberOfPages();
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            for (int page = 1; page <= pages; page++) {
                stripper.setStartPage(page);
                stripper.setEndPage(page);
                String text = stripper.getText(document);
                String clean = text == null ? "" : text.replace('\r', '\n').trim();
                totalChars += clean.length();
                if (!clean.isEmpty()) {
                    elements.add(new Element(ElementType.TEXT, "第 " + page + " 页", clean,
                            null, null, page, elements.size()));
                }
            }
            boolean needOcr = pages > 0
                    && (elements.isEmpty() || totalChars / pages < MIN_CHARS_PER_PAGE);
            if (needOcr) {
                log.warn("[kb-parse] PDF 疑似扫描件，跳过索引: {} pages={} chars={}",
                        context.fileName(), pages, totalChars);
            }
            return new ParsedDocument(context.docId(), context.fileName(), sourceType(),
                    elements, DocumentParser.textHash(elements), needOcr);
        }
    }
}
