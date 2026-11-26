package cn.lonwin.module.knowledge.parser;

import java.util.List;

/**
 * 一次文档解析的统一产物，也是写进 MinIO {@code parsed.json} 的结构。
 *
 * <p>刻意保留 Word 的结构信息而不是压成纯文本：
 * 章节栈用于生成 {@code sectionPath}，表格二维数组用于「表头:值」展开与前端明细渲染，
 * 图片只记对象 key 与所在章节（按约定不生成 caption）。
 *
 * @param docId      逻辑文档 ID
 * @param fileName   原始文件名
 * @param sourceType WORD / PDF / EXCEL / OTHER
 * @param elements   按文档顺序排列的元素
 * @param textHash   所有元素纯文本的 SHA-256，供内容级去重
 * @param needOcr    扫描件 / 文本率过低，需人工或后续 OCR 补处理
 */
public record ParsedDocument(String docId, String fileName, String sourceType,
                             List<Element> elements, String textHash, boolean needOcr) {

    public enum ElementType { HEAD, CATALOG, TEXT, TABLE, PIC }

    /**
     * @param type        元素类型
     * @param sectionPath 章节路径，形如 {@code 第一章 > 1.2 编制依据}
     * @param text        纯文本（表格为「表头:值」展开文本，图片为 [图片] 占位）
     * @param table       表格二维数组，仅 TABLE 非空
     * @param imgKey      图片在 MinIO 的对象 key，仅 PIC 非空
     * @param pageNo      PDF 页码，其它类型为 null
     * @param index       元素在文档中的序号
     */
    public record Element(ElementType type, String sectionPath, String text,
                          List<List<String>> table, String imgKey, Integer pageNo, int index) { }
}
