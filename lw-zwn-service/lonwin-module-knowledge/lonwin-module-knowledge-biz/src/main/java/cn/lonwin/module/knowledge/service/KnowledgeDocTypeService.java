package cn.lonwin.module.knowledge.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.utils.UUIDUtils;
import cn.lonwin.module.knowledge.entity.KnowledgeDocEntity;
import cn.lonwin.module.knowledge.entity.KnowledgeDocTypeEntity;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocMapper;
import cn.lonwin.module.knowledge.mapper.KnowledgeDocTypeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 文档类型（业务类型）树维护。
 *
 * <p>这是知识库左侧结构树的服务端实现：文档必须挂在一个类型节点上，
 * 因此这里同时承担「上传前校验类型存在」的职责。
 *
 * <h3>删除约束</h3>
 * <ul>
 *   <li>存在子节点 → 拒绝删除，避免整棵子树被误删；</li>
 *   <li>节点下已挂文档 → 拒绝删除，避免产生孤儿文档。</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeDocTypeService {

    private static final int NAME_MAX_LENGTH = 64;

    private final KnowledgeDocTypeMapper typeMapper;
    private final KnowledgeDocMapper docMapper;

    /** 整棵类型树，按 SORT_NO、TYPE_NAME 升序 */
    public List<KnowledgeDocTypeVO> tree() {
        List<KnowledgeDocTypeEntity> all = listAll();
        Map<String, Long> counts = countDocsByType();
        Map<String, KnowledgeDocTypeVO> nodes = new LinkedHashMap<>();
        for (KnowledgeDocTypeEntity entity : all) {
            nodes.put(entity.getTypeId(), toVO(entity, counts));
        }
        List<KnowledgeDocTypeVO> roots = new ArrayList<>();
        for (KnowledgeDocTypeEntity entity : all) {
            KnowledgeDocTypeVO vo = nodes.get(entity.getTypeId());
            String parentId = entity.getParentId();
            if (parentId == null || parentId.isBlank()) {
                roots.add(vo);
                continue;
            }
            KnowledgeDocTypeVO parent = nodes.get(parentId);
            // 父节点数据异常（被手工删除等）时按根节点兜底，避免节点在树上消失
            if (parent == null) {
                roots.add(vo);
            } else {
                parent.getChildren().add(vo);
            }
        }
        return roots;
    }

    /** 校验类型存在，不存在直接抛业务异常；上传入口与后续业务都走这里 */
    public KnowledgeDocTypeEntity require(String typeId) {
        if (typeId == null || typeId.isBlank()) {
            throw new BusinessException(400, "请先选择文档类型（typeId 不能为空）");
        }
        KnowledgeDocTypeEntity entity;
        try {
            entity = typeMapper.selectById(typeId);
        } catch (Exception e) {
            log.warn("[kb-type] 文档类型表不可用：{}", e.getMessage());
            throw new BusinessException(500,
                    "文档类型表不可用，请先执行 sql/knowledge_schema.sql 建表（SYS_KNOWLEDGE_DOC_TYPE）");
        }
        if (entity == null) {
            throw new BusinessException(404, "文档类型不存在：" + typeId);
        }
        return entity;
    }

    /** 新增节点：parentId 为空即根节点 */
    public KnowledgeDocTypeVO create(KnowledgeDocTypeRequest request) {
        if (request == null) {
            throw new BusinessException(400, "请求体不能为空");
        }
        String name = requireName(request.typeName());
        String parentId = normalizeId(request.parentId());
        if (parentId != null) {
            require(parentId);
        }
        ensureNameUnique(parentId, name, null);

        KnowledgeDocTypeEntity entity = new KnowledgeDocTypeEntity();
        entity.setTypeId(UUIDUtils.generateUUID());
        entity.setParentId(parentId);
        entity.setTypeName(name);
        entity.setTypeCode(normalizeId(request.typeCode()));
        entity.setSortNo(request.sortNo() != null ? request.sortNo() : nextSortNo(parentId));
        entity.setRemark(request.remark());
        typeMapper.insert(entity);
        return toVO(typeMapper.selectById(entity.getTypeId()), Map.of());
    }

    /** 修改节点名称 / 备注（parentId、typeCode、sortNo 不支持通过此接口变更） */
    public KnowledgeDocTypeVO update(String typeId, KnowledgeDocTypeRequest request) {
        KnowledgeDocTypeEntity existing = require(typeId);
        if (request == null) {
            throw new BusinessException(400, "请求体不能为空");
        }
        String name = requireName(request.typeName());
        ensureNameUnique(existing.getParentId(), name, typeId);

        KnowledgeDocTypeEntity update = new KnowledgeDocTypeEntity();
        update.setTypeId(typeId);
        update.setTypeName(name);
        update.setRemark(request.remark());
        typeMapper.updateById(update);
        return toVO(typeMapper.selectById(typeId), countDocsByType());
    }

    /** 删除节点：有子节点或已挂文档都不允许删 */
    public void delete(String typeId) {
        require(typeId);
        long children = typeMapper.selectCount(new QueryWrapper<KnowledgeDocTypeEntity>()
                .eq("PARENT_ID", typeId));
        if (children > 0) {
            throw new BusinessException(400, "该类型下存在 " + children + " 个子节点，请先删除子节点");
        }
        long docs = countDocuments(typeId);
        if (docs > 0) {
            throw new BusinessException(400, "该类型下存在 " + docs + " 个文档，请先迁移或删除文档");
        }
        typeMapper.deleteById(typeId);
    }

    // ------------------------------------------------------------------ 内部实现

    private List<KnowledgeDocTypeEntity> listAll() {
        try {
            return typeMapper.selectList(new QueryWrapper<KnowledgeDocTypeEntity>()
                    .orderByAsc("SORT_NO")
                    .orderByAsc("TYPE_NAME"));
        } catch (Exception e) {
            log.warn("[kb-type] 文档类型表不可用：{}", e.getMessage());
            throw new BusinessException(500,
                    "文档类型表不可用，请先执行 sql/knowledge_schema.sql 建表（SYS_KNOWLEDGE_DOC_TYPE）");
        }
    }

    private String requireName(String raw) {
        String name = raw == null ? "" : raw.trim();
        if (name.isEmpty()) {
            throw new BusinessException(400, "文档类型名称不能为空");
        }
        if (name.length() > NAME_MAX_LENGTH) {
            throw new BusinessException(400, "文档类型名称不能超过 " + NAME_MAX_LENGTH + " 个字");
        }
        return name;
    }

    private void ensureNameUnique(String parentId, String name, String excludeId) {
        QueryWrapper<KnowledgeDocTypeEntity> wrapper = new QueryWrapper<KnowledgeDocTypeEntity>()
                .eq("TYPE_NAME", name);
        if (parentId == null) {
            wrapper.isNull("PARENT_ID");
        } else {
            wrapper.eq("PARENT_ID", parentId);
        }
        if (excludeId != null) {
            wrapper.ne("TYPE_ID", excludeId);
        }
        if (typeMapper.selectCount(wrapper) > 0) {
            throw new BusinessException(400, "同级下已存在同名类型：" + name);
        }
    }

    private int nextSortNo(String parentId) {
        QueryWrapper<KnowledgeDocTypeEntity> wrapper = new QueryWrapper<>();
        if (parentId == null) {
            wrapper.isNull("PARENT_ID");
        } else {
            wrapper.eq("PARENT_ID", parentId);
        }
        return typeMapper.selectCount(wrapper).intValue() + 1;
    }

    private long countDocuments(String typeId) {
        try {
            return docMapper.selectCount(new QueryWrapper<KnowledgeDocEntity>().eq("TYPE_ID", typeId));
        } catch (Exception e) {
            // 表或列缺失时无法统计，按 0 处理（不阻塞运维清理类型树）
            log.warn("[kb-type] 统计类型下文档数失败（可能是 SYS_KNOWLEDGE_DOC.TYPE_ID 未升级）：{}",
                    e.getMessage());
            return 0L;
        }
    }

    private Map<String, Long> countDocsByType() {
        try {
            // 聚合统计：达梦下「BaseMapper 只 select 部分列」会返回 null 元素，
            // 曾导致这里 NPE、类型树计数恒为 0，故改为专用聚合查询
            Map<String, Long> counts = readAggregates();
            if (counts != null) {
                return counts;
            }
        } catch (Exception e) {
            log.warn("[kb-type] 聚合统计各类型文档数失败，改用全量分组统计：{}", e.getMessage());
        }
        return countDocsFromEntities();
    }

    /**
     * 读取聚合结果；结果结构不可识别（缺 TYPE_ID 或 CNT 字段）时返回 null 触发兜底，
     * 避免「返回 0 行 / 字段名不符」被误当成真实的 0 条。
     */
    private Map<String, Long> readAggregates() {
        Map<String, Long> counts = new HashMap<>();
        for (Map<String, Object> row : docMapper.countGroupByTypeId()) {
            if (row == null) {
                continue;
            }
            String typeId = fieldText(row, "TYPE_ID");
            if (typeId == null || typeId.isBlank()) {
                continue;
            }
            Long count = fieldCount(row, "CNT");
            if (count == null) {
                log.warn("[kb-type] 聚合结果缺少计数字段 CNT，列名：{}", row.keySet());
                return null;
            }
            counts.merge(typeId, count, Long::sum);
        }
        return counts;
    }

    /** 兜底：取全量实体在内存分组（字段完整，不受部分列 select 影响） */
    private Map<String, Long> countDocsFromEntities() {
        Map<String, Long> counts = new HashMap<>();
        try {
            for (KnowledgeDocEntity doc : docMapper.selectList(null)) {
                if (doc == null || doc.getTypeId() == null || doc.getTypeId().isBlank()) {
                    continue;
                }
                counts.merge(doc.getTypeId(), 1L, Long::sum);
            }
        } catch (Exception e) {
            log.warn("[kb-type] 统计各类型文档数失败（可能是 SYS_KNOWLEDGE_DOC.TYPE_ID 未升级），按 0 返回：{}",
                    e.getMessage());
        }
        return counts;
    }

    /** 从聚合结果里取字符串字段，兼容达梦返回大写列名 / 驼峰列名 */
    private static String fieldText(Map<String, Object> row, String name) {
        Object value = fieldValue(row, name);
        return value == null ? null : value.toString().trim();
    }

    /** 从聚合结果里取计数字段，取不到返回 null（由调用方兜底） */
    private static Long fieldCount(Map<String, Object> row, String name) {
        Object value = fieldValue(row, name);
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value == null) {
            return null;
        }
        try {
            return Long.parseLong(value.toString().trim());
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private static Object fieldValue(Map<String, Object> row, String name) {
        if (row.containsKey(name)) {
            return row.get(name);
        }
        for (Map.Entry<String, Object> entry : row.entrySet()) {
            if (entry.getKey() != null && entry.getKey().equalsIgnoreCase(name)) {
                return entry.getValue();
            }
        }
        return null;
    }

    private static String normalizeId(String raw) {
        if (raw == null) {
            return null;
        }
        String value = raw.trim();
        return value.isEmpty() ? null : value;
    }

    private static KnowledgeDocTypeVO toVO(KnowledgeDocTypeEntity entity, Map<String, Long> counts) {
        KnowledgeDocTypeVO vo = new KnowledgeDocTypeVO();
        vo.setTypeId(entity.getTypeId());
        vo.setParentId(entity.getParentId());
        vo.setTypeName(entity.getTypeName());
        vo.setTypeCode(entity.getTypeCode());
        vo.setSortNo(entity.getSortNo());
        vo.setRemark(entity.getRemark());
        vo.setDocCount(counts.getOrDefault(entity.getTypeId(), 0L));
        return vo;
    }
}
