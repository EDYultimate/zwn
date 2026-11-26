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
import cn.lonwin.module.agent.feignclient.WaterCertToolApi;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.water.model.dto.EcCertDTO;
import cn.lonwin.module.water.model.query.EcCertQuery;
import cn.lonwin.module.water.model.vo.EcCertVO;
import cn.lonwin.module.water.model.vo.EcIntakeVO;
import cn.lonwin.module.water.service.EcCertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * {@link WaterCertToolApi} 的实现：只做「工具参数 → water 查询对象」的搬运与「VO → Map」的序列化。
 *
 * <p>实现放在 impl 子包而不是写进契约接口：契约文件保持「模型能用哪些能力」的可读清单，
 * 实现类负责取数与映射，两者用命名约定关联（{@code feignclient.impl.<契约名>Impl}），
 * 由 {@code AgentToolContractRegistrar} 自动注册，无需 @Component。
 *
 * <p>依赖一律构造注入：需要新 Service 时加构造参数即可，不改变注册方式。
 */
@Slf4j
@RequiredArgsConstructor
public class WaterCertToolApiImpl implements WaterCertToolApi {


    private final EcCertService ecCertService;
    private final ObjectMapper objectMapper;

    // ==================== 证照 ====================

    @Override
    public AgentToolResult listCerts(String wpcCd, String cert, String owner, String code, String river, String area,
                                     String org, String inpos, String srcs, String amtRange, String issued,
                                     Boolean expOnly, String fields) {
        EcCertQuery query = new EcCertQuery();
        query.setWpcCd(trim(wpcCd));
        query.setCert(trim(cert));
        query.setOwner(trim(owner));
        // 组织机构代码 / 水源类型 / 许可水量区间 / 发证状态：与证照管理页筛选框一一对应
        query.setCode(trim(code));
        query.setSrcs(new ArrayList<>(splitCodes(srcs)));
        query.setAmtRange(filterValue(amtRange));
        query.setIssued(filterValue(issued));
        query.setRiver(trim(river));
        // 行政区一律优先按编码查：纯数字即行政区划代码（6 位县级及以上，可只给前 4 位市级），
        // 编码不会因行政区更名而失效，也不会把同名县区串到一起
        String areaValue = trim(area);
        if (areaValue != null && areaValue.matches("\\d{2,12}")) {
            query.setAdCd(areaValue);
        } else {
            query.setArea(areaValue);
        }
        query.setOrg(trim(org));
        query.setInpos(inpos(inpos));
        // expOnly 语义是「仅看临期」：只有 true 才过滤，false / 不传不能落成 false 条件
        query.setExpOnly(Boolean.TRUE.equals(expOnly) ? Boolean.TRUE : null);

        // 全量查询：明细完整，行数多时分片投喂由框架统一处理，统计由 agent.result.stat 精确计算
        List<EcCertVO> records = ecCertService.list(query);
        int count = records == null ? 0 : records.size();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("total", count);
        data.put("count", count);
        List<Map<String, Object>> rows = toCertRows(records);
        data.put("rows", rows);

        // 按需取列（fields 投影）：模型只拿回答所需的列，列越少单片能装的行越多。
        // 实际生效列与非法列名都回显，模型不会把「列被省略」误读成「数据为空」。
        if (StringUtils.hasText(fields) && count > 0) {
            Set<String> wanted = splitCodes(fields);
            List<String> valid = new ArrayList<>();
            List<String> unknown = new ArrayList<>();
            for (String field : wanted) {
                if (rows.get(0).containsKey(field)) {
                    valid.add(field);
                } else {
                    unknown.add(field);
                }
            }
            if (!valid.isEmpty()) {
                data.put("rows", projectFields(rows, valid));
                data.put("fieldsApplied", String.join(",", valid));
            }
            if (!unknown.isEmpty()) {
                data.put("fieldsUnknown", String.join(",", unknown));
            }
        }
        return AgentToolResult.ok(data, null);
    }

    @Override
    public AgentToolResult certDetail(String wpcCd) {
        String code = trim(wpcCd);
        if (code == null) {
            return AgentToolResult.fail("缺少必填参数 wpcCd（取水许可编码）");
        }
        EcCertVO cert = ecCertService.detail(code);
        if (cert == null) {
            return AgentToolResult.fail("未找到取水许可编码为 " + code + " 的证照，请确认编码是否正确"
                    + "（可先用证照列表工具按取水权人或河流查到编码）");
        }

        List<EcIntakeVO> intakes = cert.getPts();
        if (intakes == null || intakes.isEmpty()) {
            // 详情未带取水口明细时补一次 /ecCert/intakes 的查询，保证「取水口在哪」能答
            intakes = ecCertService.intakes(code, null);
        }

        Map<String, Object> certMap = toMap(cert);
        // 取水口明细单独作为 intakes 返回，cert 里不再重复带一份；nos 与 intakes[].no 完全重复，一并去掉
        certMap.remove("pts");
        certMap.remove("nos");

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("cert", certMap);
        data.put("intakes", toMaps(intakes));
        data.put("summary", ecCertService.summary(code));
        return AgentToolResult.ok(data, null);
    }

    @Override
    public AgentToolResult saveCert(String mode, String wpcCd, String cert, String owner, String proj,
                                    BigDecimal amt, String river, String adCd, String addr, String use,
                                    String wtype, String code) {
        boolean update = "update".equalsIgnoreCase(mode == null ? "" : mode.trim());
        if (update && !StringUtils.hasText(wpcCd)) {
            return AgentToolResult.fail("编辑证照必须提供取水许可编码 wpcCd");
        }
        if (!update && !(StringUtils.hasText(cert) && StringUtils.hasText(owner) && StringUtils.hasText(proj))) {
            return AgentToolResult.fail("新增证照必须提供许可证编号 cert、取水权人 owner、取水项目名称 proj");
        }

        EcCertDTO dto = new EcCertDTO();
        dto.setWpcCd(trim(wpcCd));
        dto.setCert(trim(cert));
        dto.setOwner(trim(owner));
        dto.setProj(trim(proj));
        dto.setAmt(amt);
        dto.setRiver(trim(river));
        dto.setAdCd(trim(adCd));
        dto.setAddr(trim(addr));
        dto.setUse(trim(use));
        dto.setWtype(trim(wtype));
        dto.setCode(trim(code));

        EcCertVO saved;
        if (update) {
            saved = ecCertService.update(dto);
            log.info("[agent] 证照编辑 wpcCd={}，结果={}", dto.getWpcCd(), saved != null);
            if (saved == null) {
                return AgentToolResult.fail("证照不存在，无法编辑：" + wpcCd + "（可先用证照列表工具确认编码）");
            }
            return AgentToolResult.ok(savedCert("update", saved), null);
        }
        if (ecCertService.exists(dto.getWpcCd())) {
            throw new BusinessException("取水许可编码已存在：" + dto.getWpcCd());
        }
        // 新增走「台账登记」入口：发证状态默认准予未发，正式发证仍在证照系统内完成，
        // 避免智能体登记的数据被当成已发证台账
        dto.setIssued("准予未发");
        saved = ecCertService.save(dto);
        log.info("[agent] 证照新增 wpcCd={}，结果={}", dto.getWpcCd(), saved != null);
        if (saved == null) {
            return AgentToolResult.fail("证照保存失败：服务端未返回保存结果");
        }
        return AgentToolResult.ok(savedCert("add", saved), null);
    }

    @Override
    public AgentToolResult deleteCert(String wpcCd) {
        String code = trim(wpcCd);
        if (code == null) {
            return AgentToolResult.fail("缺少必填参数 wpcCd（取水许可编码）");
        }
        boolean deleted = ecCertService.delete(code);
        log.info("[agent] 证照删除 wpcCd={}，结果={}", code, deleted);
        if (!deleted) {
            return AgentToolResult.fail("删除失败：未找到取水许可编码为 " + code + " 的证照");
        }
        return AgentToolResult.ok(echo("wpcCd", code), null);
    }

    /** 按列投影：只保留指定字段，顺序与声明一致；调用方保证 valid 都存在于行里 */
    private static List<Map<String, Object>> projectFields(List<Map<String, Object>> rows, List<String> valid) {
        List<Map<String, Object>> projected = new ArrayList<>(rows.size());
        for (Map<String, Object> row : rows) {
            Map<String, Object> out = new LinkedHashMap<>();
            for (String field : valid) {
                out.put(field, row.get(field));
            }
            projected.add(out);
        }
        return projected;
    }

    // ==================== 内部：序列化与参数整理 ====================

    /** 保存结果：mode + saved（去掉重复的取水口明细），摘要模板据此渲染 */
    private Map<String, Object> savedCert(String mode, EcCertVO cert) {
        Map<String, Object> certMap = toMap(cert);
        certMap.remove("pts");
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("mode", mode);
        data.put("wpcCd", certMap.get("wpcCd"));
        data.put("saved", certMap);
        return data;
    }

    private Map<String, Object> echo(String key, String value) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put(key, value);
        return data;
    }

    /**
     * 证照列表的精简投影：只保留回答「有哪些许可证」真正要用的字段。
     *
     * <p>不做投影而直接序列化 {@link EcCertVO} 会连 {@code pts}（取水口明细）和 {@code nos} 一起带出，
     * 每个取水口 7 个字段、每行还带两份重复编号，一次 50 行能灌进上万 token，
     * 正好把平台的 TPM 额度打满。明细（取水口、工程类型、位置、组织机构代码）让模型改用
     * {@code water.cert.detail} 按 {@code wpcCd} 单条查，既省额度也更准。
     */
    private List<Map<String, Object>> toCertRows(List<EcCertVO> records) {
        List<Map<String, Object>> rows = new ArrayList<>();
        if (records == null) {
            return rows;
        }
        for (EcCertVO cert : records) {
            if (cert == null) {
                continue;
            }
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("wpcCd", cert.getWpcCd());
            row.put("cert", cert.getCert());
            row.put("owner", cert.getOwner());
            row.put("proj", cert.getProj());
            row.put("river", cert.getRiver());
            row.put("amt", cert.getAmt());
            row.put("use", cert.getUse());
            row.put("src", cert.getSrc());
            row.put("org", cert.getOrg());
            row.put("area", cert.getArea());
            row.put("inpos", cert.getInpos());
            row.put("status", cert.getStatus());
            row.put("issued", cert.getIssued());
            row.put("exp", cert.getExp());
            row.put("from", cert.getFrom());
            row.put("to", cert.getTo());
            row.put("reach", cert.getReach());
            row.put("biz", cert.getBiz());
            rows.add(row);
        }
        return rows;
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

    /** 工具入参里的「全部」/ 空值等价于不筛选（与页面筛选框的「全部」语义一致） */
    private static String filterValue(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String text = value.trim();
        return "全部".equals(text) ? null : text;
    }

    /** water 侧 EcCertQuery.inpos 用「河道内 / 河道外」过滤，「全部」等价于不传 */
    private static String inpos(String value) {
        return filterValue(value);
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
