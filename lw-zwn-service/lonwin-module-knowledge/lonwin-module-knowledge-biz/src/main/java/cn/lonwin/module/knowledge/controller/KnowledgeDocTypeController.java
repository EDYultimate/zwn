package cn.lonwin.module.knowledge.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.knowledge.service.KnowledgeDocTypeRequest;
import cn.lonwin.module.knowledge.service.KnowledgeDocTypeService;
import cn.lonwin.module.knowledge.service.KnowledgeDocTypeVO;
import lombok.RequiredArgsConstructor;

/**
 * 文档类型（业务类型）树维护端点。
 *
 * <p>对应知识库页面左侧结构树：
 * <ul>
 *   <li>{@code GET    /knowledge/doc-types/tree}  整棵树；</li>
 *   <li>{@code POST   /knowledge/doc-types}       新增节点（parentId 为空即根节点）；</li>
 *   <li>{@code PUT    /knowledge/doc-types/{id}}  改名 / 改备注；</li>
 *   <li>{@code DELETE /knowledge/doc-types/{id}}  删除节点（有子节点或挂文档时拒绝）。</li>
 * </ul>
 *
 * <p>上传文档时 {@code typeId} 必填，文档挂在所选类型节点上。
 */
@RestController
@RequestMapping("/knowledge/doc-types")
@RequiredArgsConstructor
public class KnowledgeDocTypeController {

    private final KnowledgeDocTypeService docTypeService;

    /** 类型树（含每个节点的文档数） */
    @GetMapping("/tree")
    public Result<List<KnowledgeDocTypeVO>> tree() {
        return Result.success(docTypeService.tree());
    }

    /** 新增类型节点 */
    @PostMapping
    public Result<KnowledgeDocTypeVO> create(@RequestBody(required = false) KnowledgeDocTypeRequest request) {
        return Result.success(docTypeService.create(request));
    }

    /** 修改类型名称 / 备注 */
    @PutMapping("/{typeId}")
    public Result<KnowledgeDocTypeVO> update(@PathVariable String typeId,
                                             @RequestBody(required = false) KnowledgeDocTypeRequest request) {
        return Result.success(docTypeService.update(typeId, request));
    }

    /** 删除类型节点 */
    @DeleteMapping("/{typeId}")
    public Result<Void> delete(@PathVariable String typeId) {
        docTypeService.delete(typeId);
        return Result.success();
    }
}
