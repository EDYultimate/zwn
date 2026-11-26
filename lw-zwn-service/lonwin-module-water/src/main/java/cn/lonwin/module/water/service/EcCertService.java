package cn.lonwin.module.water.service;

import cn.lonwin.module.water.convert.EcCertConvert;
import cn.lonwin.module.water.entity.EcWpcSupEntity;
import cn.lonwin.module.water.mapper.EcCertMapper;
import cn.lonwin.module.water.model.dto.EcCertDTO;
import cn.lonwin.module.water.model.dto.EcIntakeDTO;
import cn.lonwin.module.water.model.query.EcCertQuery;
import cn.lonwin.module.water.model.vo.EcCertStatVO;
import cn.lonwin.module.water.model.vo.EcCertVO;
import cn.lonwin.module.water.model.vo.EcGroupVO;
import cn.lonwin.module.water.model.vo.EcIntakeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 证照管理服务：WR_WPC_SUP_B（可写） + EC_BASE_INFO_WR / EC_B_WATER_ENG（外部只读）。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EcCertService {

    private final EcCertMapper ecCertMapper;
    private final EcCertConvert ecCertConvert;

    /** IN 分批大小，规避 Oracle / 达梦 IN 列表 1000 项上限 */
    private static final int IN_BATCH_SIZE = 500;

    /** 地级市行政区划代码（与前端 LicNewModal 的 CITY_CODE 保持一致） */
    private static final Map<String, String> CITY_CODE = new HashMap<>();

    /** 行政区划代码前四位 → 城市名 */
    private static final Map<String, String> CITY_NAME = new HashMap<>();

    static {
        CITY_CODE.put("邯郸市", "130400");
        CITY_CODE.put("邢台市", "130500");
        CITY_CODE.put("衡水市", "131100");
        CITY_CODE.put("沧州市", "130900");
        CITY_CODE.put("安阳市", "410500");
        CITY_CODE.put("鹤壁市", "410600");
        CITY_CODE.put("濮阳市", "410900");
        CITY_CODE.put("聊城市", "371500");
        CITY_CODE.put("德州市", "371400");
        CITY_CODE.put("滨州市", "371600");
        CITY_CODE.forEach((name, code) -> CITY_NAME.put(code.substring(0, 4), name));
    }

    // ==================== 查询 ====================

    /** 根据条件查询证照列表（主表单表查询 + 按本批编码批量补充只读数据） */
    public List<EcCertVO> list(EcCertQuery query) {
        long start = System.currentTimeMillis();
        prepare(query);
        List<EcCertVO> rows = ecCertMapper.selectEcBaseInfoList(query);
        if (rows == null) {
            rows = new ArrayList<>();
        }
        enrich(rows);
        log.info("ecCert/list cost={}ms rows={}", System.currentTimeMillis() - start, rows.size());
        return rows;
    }

    /** MyBatis-Plus 分页查询 */
    public Page<EcCertVO> findListByPage(Page<EcCertVO> page, EcCertQuery query) {
        prepare(query);
        Page<EcCertVO> result = ecCertMapper.selectEcBaseInfoPage(page, query);
        enrich(result.getRecords());
        return result;
    }

    /** 根据取水许可编码获取证照详情 */
    public EcCertVO detail(String wpcCd) {
        if (!hasText(wpcCd)) {
            return null;
        }
        EcCertVO vo = ecCertMapper.selectEcBaseInfoByWpcCd(wpcCd);
        if (vo == null) {
            return null;
        }
        enrich(Collections.singletonList(vo));
        return vo;
    }

    /** 取水口列表（必须带条件，避免无条件全表扫描） */
    public List<EcIntakeVO> intakes(String wpcCd, String ecBaseInfoId) {
        if (hasText(ecBaseInfoId)) {
            return safe(ecCertMapper.selectWaterIntakeByEcId(ecBaseInfoId));
        }
        if (!hasText(wpcCd)) {
            return new ArrayList<>();
        }
        return safe(ecCertMapper.selectWaterIntakeList(wpcCd));
    }

    /** 证件数 / 许可水量 / 取水口数 */
    public Map<String, Object> summary(String wpcCd) {
        Map<String, Object> row = ecCertMapper.selectEcBaseInfoCount(wpcCd);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("certCount", number(row, "CERT_CNT"));
        result.put("permitQty", decimal(row, "PERMIT_QTY"));
        result.put("intakeCount", number(row, "INTAKE_CNT"));
        return result;
    }

    /** 统计横条 + 脚注：汇总数 + 三组分组统计 */
    public EcCertStatVO stat() {
        long start = System.currentTimeMillis();
        EcCertStatVO stat = new EcCertStatVO();
        Map<String, Object> row = ecCertMapper.selectEcBaseInfoCount(null);
        stat.setCertCount(number(row, "CERT_CNT"));
        stat.setPermitQty(decimal(row, "PERMIT_QTY"));
        stat.setIntakeCount(number(row, "INTAKE_CNT"));
        stat.setRiverQty(safeGroup(ecCertMapper.selectRiverPermitQty()));
        stat.setOrgCount(safeGroup(ecCertMapper.selectSupManCertCount()));
        stat.setRiverIntake(safeGroup(ecCertMapper.selectRiverIntakeCount()));
        log.info("ecCert/stat cost={}ms", System.currentTimeMillis() - start);
        return stat;
    }

    /** 以所属河流为分组查询许可水量总和 */
    public List<EcGroupVO> riverPermitQty() {
        return safeGroup(ecCertMapper.selectRiverPermitQty());
    }

    /** 以监管单位为分组查询取水许可证的个数 */
    public List<EcGroupVO> supManCertCount() {
        return safeGroup(ecCertMapper.selectSupManCertCount());
    }

    /** 以所属河流为分组查询取水口的个数 */
    public List<EcGroupVO> riverIntakeCount() {
        return safeGroup(ecCertMapper.selectRiverIntakeCount());
    }

    // ==================== 新增 / 编辑 / 删除 ====================

    public boolean exists(String wpcCd) {
        return hasText(wpcCd) && ecCertMapper.countByWpcCd(wpcCd) > 0;
    }

    /** 新增取水许可证（只写 WR_WPC_SUP_B） */
    public EcCertVO save(EcCertDTO dto) {
        EcWpcSupEntity entity = ecCertConvert.dtoToEntity(dto);
        applyForm(entity, dto);
        String wpcCd = hasText(dto.getWpcCd()) ? dto.getWpcCd() : dto.getCert();
        if (!hasText(wpcCd)) {
            wpcCd = "WPC" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        }
        entity.setWpcCd(wpcCd);
        ecCertMapper.insertEcWpcSup(entity);
        return mergeFormEcho(detail(wpcCd), dto, wpcCd);
    }

    /** 编辑取水许可证（按取水许可编码更新 WR_WPC_SUP_B） */
    public EcCertVO update(EcCertDTO dto) {
        if (!hasText(dto.getWpcCd()) || !exists(dto.getWpcCd())) {
            return null;
        }
        EcWpcSupEntity entity = ecCertConvert.dtoToEntity(dto);
        applyForm(entity, dto);
        ecCertMapper.updateEcWpcSup(entity);
        return mergeFormEcho(detail(dto.getWpcCd()), dto, dto.getWpcCd());
    }

    /** 删除取水许可证（外部只读表不动） */
    public boolean delete(String wpcCd) {
        if (!hasText(wpcCd)) {
            return false;
        }
        return ecCertMapper.deleteEcWpcSup(wpcCd) > 0;
    }

    // ==================== 内部处理 ====================

    /** 前端筛选项 → 数据库码值：前端按码值传参，旧调用方（含智能体工具）传中文时在入口统一翻译 */
    private void prepare(EcCertQuery query) {
        if (query == null) {
            return;
        }
        List<String> codes = new ArrayList<>();
        if (query.getSrcs() != null) {
            for (String src : query.getSrcs()) {
                String code = toSrcCode(src);
                if (!codes.contains(code)) {
                    codes.add(code);
                }
            }
        }
        query.setSrcCodes(codes);
        // 发证状态 / 河道内外：码值直传，中文同义词在此收口，避免前端与工具各写一套映射
        query.setIssued(binaryCode(query.getIssued(), "已发证", "准予未发"));
        query.setInpos(binaryCode(query.getInpos(), "河道内", "河道外"));
        if ("<100".equals(query.getAmtRange())) {
            query.setAmtRange("lt100");
        } else if (">1000".equals(query.getAmtRange())) {
            query.setAmtRange("gt1000");
        }
    }

    /**
     * 二值字段归一化：1 / 0 码值原样保留，中文按「正向词 → 1、反向词 → 0」翻译。
     *
     * <p>空值与「全部」返回 null，表示不落筛选条件；无法识别的取值也返回 null 并告警——
     * 比把它原样拼进 SQL 更安全（原样拼必然查空，用户会以为「没有数据」而不是「条件写错了」）。
     */
    private static String binaryCode(String value, String one, String zero) {
        if (!hasText(value)) {
            return null;
        }
        String text = value.trim();
        if ("全部".equals(text)) {
            return null;
        }
        if ("1".equals(text) || "0".equals(text)) {
            return text;
        }
        if (text.contains(one)) {
            return "1";
        }
        if (text.contains(zero)) {
            return "0";
        }
        log.warn("无法识别的筛选取值：{}（期望 {} / {} 或 1 / 0），已忽略该条件", text, one, zero);
        return null;
    }

    /**
     * 只为「本次结果集」补充只读表数据：
     * 1. 按本批 WPC_CD 批量 IN 查 EC_BASE_INFO_WR（不再全表 GROUP BY）
     * 2. 按本批 EC_BASE_INFO_WR.ID 批量 IN 查 EC_B_WATER_ENG（不再全表 JOIN）
     * 3. 内存中合并，最后统一做字典翻译
     */
    private void enrich(List<EcCertVO> rows) {
        if (rows == null || rows.isEmpty()) {
            return;
        }
        List<String> cds = rows.stream()
                .map(EcCertVO::getWpcCd)
                .filter(EcCertService::hasText)
                .distinct()
                .collect(Collectors.toList());
        List<EcCertVO> extRows = loadExtRows(cds);

        Map<String, EcCertVO> firstByCd = new HashMap<>();
        Map<String, String> cdByEcId = new HashMap<>();
        for (EcCertVO ext : extRows) {
            if (!hasText(ext.getWpcCd())) {
                continue;
            }
            firstByCd.putIfAbsent(ext.getWpcCd(), ext);
            if (hasText(ext.getEcId())) {
                cdByEcId.put(ext.getEcId(), ext.getWpcCd());
            }
        }

        Map<String, List<EcIntakeVO>> intakeMap = loadIntakeMap(cdByEcId);
        for (EcCertVO vo : rows) {
            EcCertVO ext = firstByCd.get(vo.getWpcCd());
            if (ext != null) {
                copyExt(vo, ext);
            }
            decorate(vo, intakeMap);
        }
    }

    /** 分批 IN 查只读证照信息 */
    private List<EcCertVO> loadExtRows(List<String> cds) {
        List<EcCertVO> result = new ArrayList<>();
        for (List<String> batch : partition(cds, IN_BATCH_SIZE)) {
            result.addAll(safe(ecCertMapper.selectEcBaseInfoByWpcCds(batch)));
        }
        return result;
    }

    /** 按本批证照 ID 分批查取水口，并按取水许可编码分组 */
    private Map<String, List<EcIntakeVO>> loadIntakeMap(Map<String, String> cdByEcId) {
        Map<String, List<EcIntakeVO>> result = new HashMap<>();
        if (cdByEcId.isEmpty()) {
            return result;
        }
        for (List<String> batch : partition(new ArrayList<>(cdByEcId.keySet()), IN_BATCH_SIZE)) {
            for (EcIntakeVO intake : safe(ecCertMapper.selectWaterIntakeByEcIds(batch))) {
                // 本查询按 EC_BASE_INFO_WR.ID 过滤，分组键统一以该 ID 对应的许可编码为准
                String cd = cdByEcId.get(intake.getEcId());
                if (!hasText(cd)) {
                    continue;
                }
                intake.setWpcCd(cd);
                result.computeIfAbsent(cd, k -> new ArrayList<>()).add(intake);
            }
        }
        return result;
    }

    /** 只复制只读表字段，避免覆盖主表已有的值 */
    private static void copyExt(EcCertVO target, EcCertVO ext) {
        target.setEcId(ext.getEcId());
        target.setCertNumCode(ext.getCertNumCode());
        target.setBizCode(ext.getBizCode());
        target.setOverallState(ext.getOverallState());
        target.setIsValid(ext.getIsValid());
        target.setIsPer(ext.getIsPer());
        target.setDataStatus(ext.getDataStatus());
        target.setRiverInner(ext.getRiverInner());
        target.setWatUsageDes(ext.getWatUsageDes());
        target.setWatSouDes(ext.getWatSouDes());
        target.setIntakingType(ext.getIntakingType());
        target.setIntLocationFull(ext.getIntLocationFull());
        target.setIntLocDivCode(ext.getIntLocDivCode());
        target.setValPerFrom(ext.getValPerFrom());
        target.setValPerTo(ext.getValPerTo());
        target.setExpFlag(ext.getExpFlag());
    }

    /** 列表切分，规避 IN 列表长度限制 */
    private static <T> List<List<T>> partition(List<T> list, int size) {
        List<List<T>> result = new ArrayList<>();
        for (int i = 0; i < list.size(); i += size) {
            result.add(new ArrayList<>(list.subList(i, Math.min(i + size, list.size()))));
        }
        return result;
    }

    /** 数据库原始值 → 前端展示值 + 取水口明细 */
    private void decorate(EcCertVO vo, Map<String, List<EcIntakeVO>> intakeMap) {
        if (vo == null) {
            return;
        }
        List<EcIntakeVO> pts = intakeMap.getOrDefault(vo.getWpcCd(), Collections.emptyList());
        vo.setPts(pts);
        List<String> nos = pts.stream()
                .map(EcIntakeVO::getNo)
                .filter(EcCertService::hasText)
                .collect(Collectors.toList());
        vo.setNos(nos);
        vo.setNo(nos.isEmpty() ? firstText(vo.getCert(), vo.getWpcCd()) : nos.get(0));

        vo.setAmt(vo.getAmt() == null ? BigDecimal.ZERO : vo.getAmt());
        vo.setUse(firstText(vo.getWatUsageDes(), useName(vo.getWuseTp())));
        vo.setSrc(firstText(vo.getWatSouDes(), srcName(vo.getWsrcTp())));
        vo.setBiz(bizName(vo.getBizCode(), vo.getOverallState()));
        vo.setStatus(statusName(vo));
        vo.setIssued("1".equals(vo.getStt()) ? "已发证" : "准予未发");
        vo.setExp("1".equals(vo.getExpFlag()));
        vo.setFrom(vo.getValPerFrom());
        vo.setTo(vo.getValPerTo());
        vo.setItype(firstText(vo.getIntakingType(), vo.getIntkTp()));
        vo.setEng(engName(vo.getWdeTp()));
        vo.setInpos("1".equals(vo.getRiverInner()) ? "河道内" : "河道外");
        vo.setFocus(yesNoName(vo.getIsKeyWde()));
        vo.setBig(yesNoName(vo.getIsLmIrr()));
        vo.setSmall(yesNoName(vo.getIsTypSmlIrr()));
        vo.setOrg(firstText(vo.getOrg(), vo.getSupManCd()));
        // 行政区：以 WR_WPC_SUP_B.AD_CD 联查 WR_AD_B.AD_NM 的名称优先，缺失时退回其他地址字段
        vo.setArea(firstText(vo.getAdNm(), vo.getIntLocationFull(), vo.getAddr(), vo.getAdCd()));
        vo.setCity(cityName(vo.getAdCd(), vo.getIntLocDivCode()));
        vo.setProv(provName(vo.getAdCd(), vo.getIntLocDivCode()));
        vo.setAddr(firstText(vo.getAddr(), vo.getIntLocationFull()));
    }

    /** 表单字段 → WR_WPC_SUP_B 可写列 */
    private void applyForm(EcWpcSupEntity entity, EcCertDTO dto) {
        entity.setWpcNo(dto.getCert());
        entity.setWurNm(dto.getOwner());
        entity.setOrgCd(dto.getCode());
        entity.setPrjNm(dto.getProj());
        entity.setRvNm(dto.getRiver());
        entity.setRvSec(dto.getReach());
        entity.setPerQty(dto.getAmt());
        entity.setSupManNm(dto.getOrg());
        entity.setIntkTp(dto.getItype());
        entity.setWuseTp(toUseCode(dto.getUse()));
        entity.setWsrcTp(hasText(dto.getWtype()) ? toSrcCode(dto.getWtype()) : null);

        List<EcIntakeDTO> points = dto.getPoints();
        String firstPos = dto.getAddr();
        String firstEng = null;
        if (points != null && !points.isEmpty()) {
            EcIntakeDTO first = points.get(0);
            firstPos = firstText(first.getPos(), dto.getAddr());
            firstEng = first.getEng();
        }
        entity.setAddr(firstPos);
        entity.setWdeTp(hasText(firstEng) ? toEngCode(firstEng) : null);

        entity.setStt("准予未发".equals(dto.getIssued()) ? "0" : "1");
        entity.setIsKeyWde(yesNoCode(dto.getFocus()));
        entity.setIsLmIrr(yesNoCode(dto.getBig()));
        entity.setIsTypSmlIrr(yesNoCode(dto.getSmall()));
        entity.setAdCd(resolveAdCd(dto));
    }

    /**
     * 有效期 / 业务类型 / 取水口明细等属于外部只读表，无法写入 WR_WPC_SUP_B。
     * 保存后把这些表单值回显给前端，保证本次会话内详情弹框完整。
     */
    private EcCertVO mergeFormEcho(EcCertVO vo, EcCertDTO dto, String wpcCd) {
        EcCertVO result = vo;
        if (result == null) {
            result = new EcCertVO();
            result.setWpcCd(wpcCd);
        }
        if (hasText(dto.getFrom())) {
            result.setFrom(dto.getFrom());
        }
        if (hasText(dto.getTo())) {
            result.setTo(dto.getTo());
        }
        if (hasText(dto.getProv())) {
            result.setProv(dto.getProv());
        }
        if (hasText(dto.getCity())) {
            result.setCity(dto.getCity());
        }
        if (hasText(dto.getCounty())) {
            result.setCounty(dto.getCounty());
        }
        if (hasText(dto.getBiz())) {
            result.setBiz(dto.getBiz());
        }
        if (hasText(dto.getStatus())) {
            result.setStatus(dto.getStatus());
        }
        if (hasText(dto.getInpos())) {
            result.setInpos(dto.getInpos());
        }
        if (dto.getExp() != null) {
            result.setExp(dto.getExp());
        }
        if (dto.getPoints() != null && !dto.getPoints().isEmpty()) {
            List<EcIntakeVO> pts = new ArrayList<>();
            List<String> nos = new ArrayList<>();
            for (EcIntakeDTO p : dto.getPoints()) {
                if (!hasText(p.getNo())) {
                    continue;
                }
                EcIntakeVO item = new EcIntakeVO();
                item.setNo(p.getNo());
                item.setPos(p.getPos());
                item.setEng(p.getEng());
                item.setWpcCd(wpcCd);
                item.setEcId(result.getEcId());
                pts.add(item);
                nos.add(p.getNo());
            }
            if (!pts.isEmpty()) {
                result.setPts(pts);
                result.setNos(nos);
                result.setNo(nos.get(0));
                result.setAddr(pts.get(0).getPos());
                result.setEng(pts.get(0).getEng());
            }
        }
        return result;
    }

    // ==================== 字典 ====================

    private static String useName(String code) {
        if (code == null) {
            return "其他";
        }
        switch (code) {
            case "1": return "城镇生活用水";
            case "2": return "工业用水";
            case "3": return "农业用水";
            case "4": return "生态用水";
            case "6": return "河道内生产用水-水力发电";
            default: return "其他";
        }
    }

    private static String srcName(String code) {
        if ("1".equals(code)) {
            return "地表水";
        }
        if ("2".equals(code)) {
            return "地下水";
        }
        return "其他";
    }

    private static String engName(String code) {
        if (code == null) {
            return "其他人工设施";
        }
        switch (code) {
            case "1": return "水闸";
            case "2": return "泵站";
            case "3": return "水井";
            case "4": return "渠道";
            case "5": return "水库";
            case "6": return "虹吸管";
            case "8": return "水电站";
            default: return "其他人工设施";
        }
    }

    private static String bizName(String code, String overallState) {
        if (hasText(overallState)) {
            switch (overallState) {
                case "1": return "新办";
                case "2": return "变更";
                case "3": return "延续";
                case "4": return "注销";
                case "5": return "吊销";
                case "6": return "撤销";
                case "7": return "过期";
                default: break;
            }
        }
        if ("002".equals(code)) {
            return "变更";
        }
        if ("003".equals(code)) {
            return "延续";
        }
        if ("004".equals(code)) {
            return "注销";
        }
        return "新办";
    }

    private static String statusName(EcCertVO vo) {
        String overall = vo.getOverallState();
        if ("4".equals(overall) || "004".equals(vo.getBizCode())) {
            return "注销";
        }
        if ("5".equals(overall)) {
            return "吊销";
        }
        if ("6".equals(overall)) {
            return "撤销";
        }
        if ("7".equals(overall)) {
            return "过期";
        }
        if ("0".equals(vo.getIsValid())) {
            return "无效";
        }
        return "有效";
    }

    private static String toUseCode(String text) {
        if (!hasText(text)) {
            return "5";
        }
        if (text.contains("水力发电") || text.contains("河道内")) {
            return "6";
        }
        if (text.contains("农业") || text.contains("灌溉")) {
            return "3";
        }
        if (text.contains("工业")) {
            return "2";
        }
        if (text.contains("生活")) {
            return "1";
        }
        if (text.contains("生态")) {
            return "4";
        }
        return "5";
    }

    private static String toSrcCode(String text) {
        if (text == null) {
            return "3";
        }
        String value = text.trim();
        // 前端已改传码值：1 地表水 / 2 地下水 / 3 其他，原样保留；
        // 只有源系统文本值（如「地表水（矿泉水）」）才需要按关键字翻译
        if ("1".equals(value) || "2".equals(value) || "3".equals(value)) {
            return value;
        }
        if (value.contains("地表")) {
            return "1";
        }
        if (value.contains("地下")) {
            return "2";
        }
        return "3";
    }

    private static String toEngCode(String text) {
        if (!hasText(text)) {
            return "7";
        }
        if (text.contains("水电站")) {
            return "8";
        }
        if (text.contains("泵")) {
            return "2";
        }
        if (text.contains("闸")) {
            return "1";
        }
        if (text.contains("渠道")) {
            return "4";
        }
        if (text.contains("水库")) {
            return "5";
        }
        if (text.contains("井")) {
            return "3";
        }
        if (text.contains("管道") || text.contains("虹吸")) {
            return "6";
        }
        return "7";
    }

    private static String yesNoName(String code) {
        return "1".equals(code) ? "是" : "否";
    }

    private static String yesNoCode(String text) {
        return "是".equals(text) ? "1" : "0";
    }

    private static String resolveAdCd(EcCertDTO dto) {
        if (hasText(dto.getAdCd())) {
            return dto.getAdCd();
        }
        return CITY_CODE.get(dto.getCity());
    }

    private static String cityName(String adCd, String divCd) {
        String code = firstText(adCd, divCd);
        if (hasText(code) && code.length() >= 4) {
            return CITY_NAME.get(code.substring(0, 4));
        }
        return null;
    }

    /** 行政区划编码前两位 → 省份（与前端 AREA_DATA 的三个省一致） */
    private static String provName(String... codes) {
        if (codes != null) {
            for (String code : codes) {
                if (!hasText(code) || code.length() < 2) {
                    continue;
                }
                switch (code.substring(0, 2)) {
                    case "13": return "河北省";
                    case "41": return "河南省";
                    case "37": return "山东省";
                    default: break;
                }
            }
        }
        return null;
    }

    // ==================== 工具 ====================

    private static boolean hasText(String text) {
        return text != null && !text.trim().isEmpty();
    }

    private static String firstText(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (hasText(value)) {
                return value;
            }
        }
        return null;
    }

    private static <T> List<T> safe(List<T> list) {
        return list == null ? new ArrayList<>() : list;
    }

    private static List<EcGroupVO> safeGroup(List<EcGroupVO> list) {
        return safe(list);
    }

    /** 达梦 / Oracle 返回的 Map key 为大写，这里做大小写不兼容读取 */
    private static Object pick(Map<String, Object> map, String key) {
        if (map == null) {
            return null;
        }
        Object value = map.get(key);
        if (value != null) {
            return value;
        }
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (entry.getKey() != null && entry.getKey().equalsIgnoreCase(key)) {
                return entry.getValue();
            }
        }
        return null;
    }

    private static long number(Map<String, Object> map, String key) {
        Object value = pick(map, key);
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        if (value != null) {
            try {
                return Long.parseLong(value.toString());
            } catch (NumberFormatException ignored) {
                return 0L;
            }
        }
        return 0L;
    }

    private static BigDecimal decimal(Map<String, Object> map, String key) {
        Object value = pick(map, key);
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        if (value != null) {
            try {
                return new BigDecimal(value.toString());
            } catch (NumberFormatException ignored) {
                return BigDecimal.ZERO;
            }
        }
        return BigDecimal.ZERO;
    }
}
