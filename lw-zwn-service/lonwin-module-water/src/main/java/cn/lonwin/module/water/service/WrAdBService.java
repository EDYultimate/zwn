package cn.lonwin.module.water.service;

import cn.lonwin.common.core.utils.Assert;
import cn.lonwin.module.water.convert.WrAdBConvert;
import cn.lonwin.module.water.entity.WrAdBEntity;
import cn.lonwin.module.water.mapper.WrAdBMapper;
import cn.lonwin.module.water.model.dto.WrAdBDTO;
import cn.lonwin.module.water.model.query.WrAdBQuery;
import cn.lonwin.module.water.model.vo.WrAdBVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * 行政区划（WR_AD_B）业务处理。
 * 该表是编码表，除管理页的增删改查外，还对外提供「编码查名称」「名称模糊查编码」等翻译能力。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WrAdBService {

    /** 默认启用标记 */
    private static final String DEFAULT_ISUSE = "1";

    /** 名称联想默认返回条数 */
    private static final int DEFAULT_SEARCH_LIMIT = 20;

    private final WrAdBMapper wrAdBMapper;
    private final WrAdBConvert wrAdBConvert;

    // ==================== 查询 ====================

    /**
     * 列表查询（不分页）。
     */
    public List<WrAdBVO> list(WrAdBQuery query) {
        return wrAdBMapper.selectAdBList(query == null ? new WrAdBQuery() : query);
    }

    /**
     * 分页查询。
     */
    public Page<WrAdBVO> findListByPage(Page<WrAdBVO> page, WrAdBQuery query) {
        return wrAdBMapper.selectAdBPage(page, query == null ? new WrAdBQuery() : query);
    }

    /**
     * 按行政区划代码查询详情。
     */
    public WrAdBVO detail(String adCd) {
        if (!hasText(adCd)) {
            return null;
        }
        return wrAdBMapper.selectAdBByCd(adCd.trim());
    }

    /**
     * 按行政区划代码查询名称，不存在返回 null。
     */
    public String nameByCd(String adCd) {
        if (!hasText(adCd)) {
            return null;
        }
        return wrAdBMapper.selectAdNmByCd(adCd.trim());
    }

    /**
     * 批量：行政区划代码 → 名称（列表批量翻译行政区名称用）。
     */
    public Map<String, String> nameMapByCds(Collection<String> adCds) {
        List<String> cds = normalizeCds(adCds);
        if (cds.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<String, String> result = new LinkedHashMap<>();
        for (WrAdBVO vo : wrAdBMapper.selectAdBByCds(cds)) {
            if (vo != null && hasText(vo.getAdCd())) {
                result.put(vo.getAdCd(), hasText(vo.getAdNm()) ? vo.getAdNm() : vo.getAdCd());
            }
        }
        return result;
    }

    /**
     * 按名称 / 简称模糊查询（默认返回 20 条，用于下拉联想）。
     */
    public List<WrAdBVO> searchByName(String keyword) {
        return searchByName(keyword, DEFAULT_SEARCH_LIMIT);
    }

    /**
     * 按名称 / 简称模糊查询，limit 控制返回条数。
     */
    public List<WrAdBVO> searchByName(String keyword, Integer limit) {
        if (!hasText(keyword)) {
            return Collections.emptyList();
        }
        int size = (limit == null || limit <= 0) ? DEFAULT_SEARCH_LIMIT : limit;
        return wrAdBMapper.selectAdBByName(keyword.trim(), size);
    }

    /**
     * 编码是否已存在。
     */
    public boolean exists(String adCd) {
        if (!hasText(adCd)) {
            return false;
        }
        return wrAdBMapper.countByCd(adCd.trim()) > 0;
    }

    // ==================== 新增 / 编辑 / 删除 ====================

    /**
     * 新增行政区划。
     */
    public WrAdBVO save(WrAdBDTO dto) {
        Assert.notNull(dto, "参数不能为空");
        WrAdBEntity entity = wrAdBConvert.dtoToEntity(dto);
        entity.setAdCd(trim(entity.getAdCd()));
        entity.setAdNm(trim(entity.getAdNm()));
        Assert.notEmpty(entity.getAdCd(), "行政区划代码不能为空");
        Assert.notEmpty(entity.getAdNm(), "行政区划名称不能为空");
        Assert.isFalse(exists(entity.getAdCd()), "行政区划代码已存在：" + entity.getAdCd());
        if (!hasText(entity.getIsuse())) {
            entity.setIsuse(DEFAULT_ISUSE);
        }
        wrAdBMapper.insertAdB(entity);
        log.info("新增行政区划成功：{} {}", entity.getAdCd(), entity.getAdNm());
        return detail(entity.getAdCd());
    }

    /**
     * 编辑行政区划（按代码，仅更新非空字段）。
     */
    public WrAdBVO update(WrAdBDTO dto) {
        Assert.notNull(dto, "参数不能为空");
        Assert.notEmpty(dto.getAdCd(), "行政区划代码不能为空");
        String adCd = dto.getAdCd().trim();
        WrAdBEntity entity = new WrAdBEntity();
        wrAdBConvert.mergeDtoToEntity(dto, entity);
        entity.setAdCd(adCd);
        entity.setAdNm(trim(entity.getAdNm()));
        int rows = wrAdBMapper.updateAdB(entity);
        if (rows == 0) {
            return null;
        }
        log.info("编辑行政区划成功：{}", adCd);
        return detail(adCd);
    }

    /**
     * 删除行政区划。
     */
    public boolean delete(String adCd) {
        if (!hasText(adCd)) {
            return false;
        }
        int rows = wrAdBMapper.deleteAdBByCd(adCd.trim());
        log.info("删除行政区划：{}，影响 {} 行", adCd, rows);
        return rows > 0;
    }

    // ==================== 工具方法 ====================

    private static boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }

    private static String trim(String text) {
        return text == null ? null : text.trim();
    }

    /**
     * 去重并剔除空值（供外部批量翻译时预处理）。
     */
    public static List<String> normalizeCds(Collection<String> adCds) {
        if (adCds == null) {
            return Collections.emptyList();
        }
        return adCds.stream()
                .filter(Objects::nonNull)
                .filter(WrAdBService::hasText)
                .map(String::trim)
                .distinct()
                .toList();
    }
}
