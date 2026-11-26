package cn.lonwin.module.knowledge.parser;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.ByteArrayOutputStream;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.knowledge.parser.DocumentParser.ParseContext;
import cn.lonwin.module.knowledge.parser.ParsedDocument.Element;
import cn.lonwin.module.knowledge.parser.ParsedDocument.ElementType;

/** 用内存生成的 Word / Excel / PDF 字节验证解析产物，不依赖任何外部文件。 */
class DocumentParserTest {

    private static ParseContext context(String fileName, String ext) {
        return new ParseContext("doc-1", fileName, "group-1",
                "docFiles/knowledge/doc-1/source/f1_" + fileName, ext,
                (index, extension, bytes) -> "imgFiles/knowledge/doc-1/img/" + index + "." + extension);
    }

    @Test
    @DisplayName("Word 保留章节路径与表格二维结构")
    void wordKeepsSectionPathAndTable() throws Exception {
        byte[] bytes;
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            XWPFParagraph h1 = document.createParagraph();
            h1.setStyle("Heading1");
            h1.createRun().setText("第一章 总则");
            XWPFParagraph p1 = document.createParagraph();
            p1.createRun().setText("本预案适用于取水许可管理。");
            XWPFParagraph h2 = document.createParagraph();
            h2.createRun().setText("1.2 编制依据");
            XWPFTable table = document.createTable(2, 2);
            table.getRow(0).getCell(0).setText("项目");
            table.getRow(0).getCell(1).setText("数值");
            table.getRow(1).getCell(0).setText("许可水量");
            table.getRow(1).getCell(1).setText("100 万立方米");
            document.write(out);
            bytes = out.toByteArray();
        }

        ParsedDocument parsed = new WordParser().parse(bytes, context("防洪预案.docx", "docx"));

        assertThat(parsed.sourceType()).isEqualTo("WORD");
        assertThat(parsed.needOcr()).isFalse();
        assertThat(parsed.elements()).anySatisfy(element -> {
            assertThat(element.type()).isEqualTo(ElementType.HEAD);
            assertThat(element.sectionPath()).contains("第一章 总则");
        });
        Element table = parsed.elements().stream()
                .filter(e -> e.type() == ElementType.TABLE).findFirst().orElseThrow();
        assertThat(table.sectionPath()).isEqualTo("第一章 总则 > 1.2 编制依据");
        assertThat(table.table()).containsExactly(
                java.util.List.of("项目", "数值"),
                java.util.List.of("许可水量", "100 万立方米"));
        assertThat(table.text()).contains("项目:许可水量").contains("数值:100 万立方米");
        assertThat(parsed.textHash()).hasSize(64);
    }

    @Test
    @DisplayName("Excel 每个 sheet 一个 TABLE，sectionPath 用 sheet 名")
    void excelKeepsSheetAsSection() throws Exception {
        byte[] bytes;
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            var sheet = workbook.createSheet("取水许可");
            var header = sheet.createRow(0);
            header.createCell(0).setCellValue("年份");
            header.createCell(1).setCellValue("水量");
            var row = sheet.createRow(1);
            row.createCell(0).setCellValue(2025);
            row.createCell(1).setCellValue("100");
            workbook.write(out);
            bytes = out.toByteArray();
        }

        ParsedDocument parsed = new ExcelParser().parse(bytes, context("取水台账.xlsx", "xlsx"));

        assertThat(parsed.sourceType()).isEqualTo("EXCEL");
        assertThat(parsed.elements()).hasSize(1);
        Element table = parsed.elements().get(0);
        assertThat(table.type()).isEqualTo(ElementType.TABLE);
        assertThat(table.sectionPath()).isEqualTo("取水许可");
        assertThat(table.table().get(1)).containsExactly("2025", "100");
        assertThat(table.text()).contains("年份:2025");
    }

    @Test
    @DisplayName("PDF 按页抽取文本，页码写进元素")
    void pdfKeepsPageNumber() throws Exception {
        byte[] bytes;
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream stream = new PDPageContentStream(document, page)) {
                stream.beginText();
                stream.setFont(PDType1Font.HELVETICA, 12);
                stream.newLineAtOffset(50, 700);
                stream.showText("Knowledge base page one text for parser test");
                stream.endText();
            }
            document.save(out);
            bytes = out.toByteArray();
        }

        ParsedDocument parsed = new PdfParser().parse(bytes, context("手册.pdf", "pdf"));

        assertThat(parsed.sourceType()).isEqualTo("PDF");
        assertThat(parsed.needOcr()).isFalse();
        assertThat(parsed.elements()).hasSize(1);
        assertThat(parsed.elements().get(0).pageNo()).isEqualTo(1);
        assertThat(parsed.elements().get(0).text()).contains("Knowledge base");
    }
}
