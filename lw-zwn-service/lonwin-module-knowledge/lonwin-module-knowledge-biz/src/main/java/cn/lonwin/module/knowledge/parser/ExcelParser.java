package cn.lonwin.module.knowledge.parser;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import cn.lonwin.module.knowledge.parser.ParsedDocument.Element;
import cn.lonwin.module.knowledge.parser.ParsedDocument.ElementType;

/**
 * Excel / CSV 解析：每个 sheet（或 CSV 整体）产出一个 TABLE 元素，
 * 保留行列二维结构，sectionPath 用 sheet 名；检索文本走 WordParser 的「表头:值」展开。
 *
 * <p>对应 knowledge-platform 的 {@code ExcleAnalyse}，但不写 Mongo/ES。
 */
public class ExcelParser implements DocumentParser {

    @Override
    public String sourceType() {
        return "EXCEL";
    }

    @Override
    public ParsedDocument parse(byte[] bytes, ParseContext context) throws Exception {
        List<Element> elements = new ArrayList<>();
        if ("csv".equals(context.extension())) {
            parseCsv(bytes, elements);
        } else {
            parseWorkbook(bytes, elements);
        }
        return new ParsedDocument(context.docId(), context.fileName(), sourceType(),
                elements, DocumentParser.textHash(elements), false);
    }

    private void parseWorkbook(byte[] bytes, List<Element> elements) throws Exception {
        DataFormatter formatter = new DataFormatter();
        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(bytes))) {
            for (int s = 0; s < workbook.getNumberOfSheets(); s++) {
                Sheet sheet = workbook.getSheetAt(s);
                List<List<String>> rows = new ArrayList<>();
                for (int r = 0; r <= sheet.getLastRowNum(); r++) {
                    Row row = sheet.getRow(r);
                    if (row == null) {
                        continue;
                    }
                    List<String> cells = new ArrayList<>();
                    boolean hasValue = false;
                    for (int c = 0; c < row.getLastCellNum(); c++) {
                        Cell cell = row.getCell(c);
                        String value = cell == null ? "" : formatter.formatCellValue(cell).trim();
                        cells.add(value);
                        hasValue = hasValue || !value.isEmpty();
                    }
                    if (hasValue) {
                        rows.add(cells);
                    }
                }
                if (!rows.isEmpty()) {
                    elements.add(new Element(ElementType.TABLE, sheet.getSheetName(),
                            WordParser.tableToText(rows), rows, null, null, elements.size()));
                }
            }
        }
    }

    private void parseCsv(byte[] bytes, List<Element> elements) throws Exception {
        List<List<String>> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ByteArrayInputStream(bytes), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",", -1);
                List<String> cells = new ArrayList<>();
                for (String part : parts) {
                    cells.add(part.trim().replaceAll("^\"|\"$", ""));
                }
                rows.add(cells);
            }
        }
        if (!rows.isEmpty()) {
            elements.add(new Element(ElementType.TABLE, "",
                    WordParser.tableToText(rows), rows, null, null, elements.size()));
        }
    }
}
