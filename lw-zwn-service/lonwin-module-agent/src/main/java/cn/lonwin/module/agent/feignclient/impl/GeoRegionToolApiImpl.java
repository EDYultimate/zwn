package cn.lonwin.module.agent.feignclient.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.feignclient.GeoRegionToolApi;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.water.model.dto.WrAdBDTO;
import cn.lonwin.module.water.model.query.WrAdBQuery;
import cn.lonwin.module.water.model.vo.WrAdBVO;
import cn.lonwin.module.water.service.WrAdBService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * {@link GeoRegionToolApi} 的实现：只做「工具参数 → WrAdB 查询对象」的搬运与「VO → Map」的序列化。
 *
 * <p>按 {@code AgentToolContractRegistrar} 的命名约定放在 {@code feignclient.impl} 下、
 * 类名为「契约名 + Impl」，不需要 {@code @Component}，由注册器统一注册为 Spring Bean。
 *
 * <p>依赖一律构造注入：行政区能力只依赖 {@link WrAdBService} 与 JSON 序列化器，
 * 不依赖任何业务模块，保证它作为公共能力可被所有问答复用。
 */
@Slf4j
@RequiredArgsConstructor
public class GeoRegionToolApiImpl implements GeoRegionToolApi {

    /** 批量翻译一次最多处理的编码个数 */
    private static final int MAX_TRANSLATE_CODES = 50;

    private final WrAdBService wrAdBService;
    private final ObjectMapper objectMapper;

    // ==================== 查询 / 翻译 ====================

    @Override
    public AgentToolResult listRegions(String adCd, String adNm, String isuse) {
        WrAdBQuery query = new WrAdBQuery();
        query.setAdCd(trim(adCd));
        query.setAdNm(trim(adNm));
        query.setIsuse(trim(isuse));

        // 全量查询（不再按 20 条硬截断）：明细完整，分片投喂由框架的 AgentResultPager 统一处理
        List<WrAdBVO> records = wrAdBService.list(query);
        int count = records == null ? 0 : records.size();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("total", count);
        data.put("count", count);
        data.put("rows", toMaps(records));
        return AgentToolResult.ok(data, null);
    }

    @Override
    public AgentToolResult regionDetail(String adCd) {
        String code = trim(adCd);
        if (code == null) {
            return AgentToolResult.fail("缺少必填参数 adCd（行政区划代码）");
        }
        WrAdBVO region = wrAdBService.detail(code);
        if (region == null) {
            return AgentToolResult.fail("未找到行政区划代码 " + code + "，请确认代码是否正确");
        }
        return AgentToolResult.ok(toMap(region), null);
    }

    @Override
    public AgentToolResult regionNames(String adCds) {
        Set<String> codes = splitCodes(adCds);
        if (codes.isEmpty()) {
            return AgentToolResult.fail("行政区划代码不能为空");
        }
        List<String> targets = new ArrayList<>(codes);
        boolean truncated = targets.size() > MAX_TRANSLATE_CODES;
        if (truncated) {
            targets = new ArrayList<>(targets.subList(0, MAX_TRANSLATE_CODES));
        }

        Map<String, String> names = wrAdBService.nameMapByCds(targets);
        List<String> missing = new ArrayList<>();
        for (String code : targets) {
            if (!names.containsKey(code)) {
                missing.add(code);
            }
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("count", names.size());
        data.put("names", names);
        data.put("missing", missing);
        if (truncated) {
            // 明确告知被截断，模型才不会以为剩下的代码"查不到"
            data.put("truncated", true);
            data.put("inputCount", codes.size());
        }
        return AgentToolResult.ok(data, null);
    }

    // ==================== 维护 ====================

    @Override
    public AgentToolResult saveRegion(String mode, String adCd, String adNm, String adShnm, BigDecimal adA,
                                      String nt, String isuse) {
        boolean update = "update".equalsIgnoreCase(mode == null ? "" : mode.trim());
        String code = trim(adCd);
        if (code == null) {
            return AgentToolResult.fail("缺少必填参数 adCd（行政区划代码）");
        }
        if (!update && !StringUtils.hasText(adNm)) {
            return AgentToolResult.fail("新增行政区划必须提供行政区划名称 adNm");
        }

        WrAdBDTO dto = new WrAdBDTO();
        dto.setAdCd(code);
        dto.setAdNm(trim(adNm));
        dto.setAdShnm(trim(adShnm));
        dto.setAdA(adA);
        dto.setNt(trim(nt));
        dto.setIsuse(trim(isuse));

        if (update) {
            WrAdBVO saved = wrAdBService.update(dto);
            log.info("[agent] 行政区划编辑 adCd={}，结果={}", code, saved != null);
            if (saved == null) {
                return AgentToolResult.fail("保存失败：行政区划 " + code + " 不存在，无法编辑");
            }
            return AgentToolResult.ok(savedRegion("update", saved), null);
        }
        if (wrAdBService.exists(code)) {
            throw new BusinessException("行政区划代码已存在：" + code);
        }
        WrAdBVO saved = wrAdBService.save(dto);
        log.info("[agent] 行政区划新增 adCd={}，结果={}", code, saved != null);
        if (saved == null) {
            return AgentToolResult.fail("行政区划保存失败：服务端未返回保存结果");
        }
        return AgentToolResult.ok(savedRegion("add", saved), null);
    }

    @Override
    public AgentToolResult deleteRegion(String adCd) {
        String code = trim(adCd);
        if (code == null) {
            return AgentToolResult.fail("缺少必填参数 adCd（行政区划代码）");
        }
        boolean deleted = wrAdBService.delete(code);
        log.info("[agent] 行政区划删除 adCd={}，结果={}", code, deleted);
        if (!deleted) {
            return AgentToolResult.fail("删除失败：未找到行政区划代码 " + code);
        }
        return AgentToolResult.ok(echo("adCd", code), null);
    }

    // ==================== 内部：序列化与参数整理 ====================

    private Map<String, Object> savedRegion(String mode, WrAdBVO region) {
        Map<String, Object> regionMap = toMap(region);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("mode", mode);
        data.put("adCd", regionMap.get("adCd"));
        data.put("adNm", regionMap.get("adNm"));
        data.put("saved", regionMap);
        return data;
    }

    private Map<String, Object> echo(String key, String value) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put(key, value);
        return data;
    }

    /** VO → Map：复用 JSON 序列化规则（{@code @JsonIgnore} 的字典码值不会漏给模型） */
    private Map<String, Object> toMap(Object source) {
        if (source == null) {
            return new LinkedHashMap<>();
        }
        return objectMapper.convertValue(source, new TypeReference<Map<String, Object>>() {
        });
    }

    private List<Map<String, Object>> toMaps(List<?> sources) {
        List<Map<String, Object>> rows = new ArrayList<>();
        if (sources == null) {
            return rows;
        }
        for (Object source : sources) {
            if (source != null) {
                rows.add(toMap(source));
            }
        }
        return rows;
    }

    private static Set<String> splitCodes(String adCds) {
        Set<String> codes = new LinkedHashSet<>();
        if (!StringUtils.hasText(adCds)) {
            return codes;
        }
        for (String part : adCds.split("[,，、;；\\s]+")) {
            if (StringUtils.hasText(part)) {
                codes.add(part.trim());
            }
        }
        return codes;
    }

    private static String trim(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
