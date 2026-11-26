package cn.lonwin.module.video.service;

import cn.lonwin.module.video.config.VideoProperties;
import cn.lonwin.module.video.mapper.VideoPointMapper;
import cn.lonwin.module.video.model.dto.VideoPoint;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * 本地视频点位台账（tr_Spd）读取与字段映射。
 * <p>
 * 不同环境 tr_Spd 表列并不完全一致，这里用「候选列名 + 大小写不敏感」的方式取值：
 * 有扩展列（管理单位、桩号、河流、地址等）就直接展示真实数据，没有则留空，
 * 由平台接口的基础字段兜底，避免因为表结构差异导致接口整体不可用。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VideoPointService {

    private final VideoPointMapper videoPointMapper;

    private final VideoProperties props;

    /**
     * 查询本地台账中的视频点位。表不存在 / 数据源异常时抛出，由上层决定是否降级到平台接口。
     */
    public List<VideoPoint> getDbPoints() {
        List<Map<String, Object>> rows = videoPointMapper.selectZwnPointList(props.getManageDept());
        List<VideoPoint> points = new ArrayList<>();
        if (rows == null) {
            return points;
        }
        for (Map<String, Object> row : rows) {
            VideoPoint point = new VideoPoint();
            point.setCode(pick(row, "CODE", "SPDCODE", "SPD_CODE", "VSW_CD"));
            point.setName(pick(row, "NAME", "SPDNAME", "SPD_NAME"));
            point.setSite(pick(row, "SITE", "SITENAME", "SITE_NAME"));
            point.setState(pick(row, "STATE", "STATUS", "ONLINE_STATE"));
            point.setXAxis(pick(row, "XAXIS", "X_AXIS", "LONGITUDE", "LON", "JD"));
            point.setYAxis(pick(row, "YAXIS", "Y_AXIS", "LATITUDE", "LAT", "WD"));

            // 管理单位名称：TR_DEPT.DEPTNAME（SQL 中别名为 DEPT_NAME）
            String deptName = pick(row, "DEPT_NAME", "DEPTNAME");
            String manageDeptCode = pick(row, "MANAGEDEPT", "MANAGE_DEPT",
                    "REGULATORY_ORG", "REGUNIT", "ORG", "DEPT");
            String org = manageDeptCode;
            if (org != null && props.getOrgMapping() != null) {
                String mapped = props.getOrgMapping().get(org);
                if (mapped != null && !mapped.isBlank()) {
                    org = mapped;
                } else if (deptName != null) {
                    // 未配置映射时直接用部门名称，避免页面出现 dept_xxx 编码
                    org = deptName;
                }
            }
            if (org == null) {
                org = deptName;
            }
            point.setOrg(org);
            point.setManageUnit(deptName != null ? deptName
                    : pick(row, "MANAGEUNIT", "MANAGE_UNIT", "MGMTUNIT", "MG"));
            point.setStakeNo(pick(row, "ZH", "STAKENO", "STAKE_NO", "PILENO", "PILE_NO"));
            // 河流名称：DICT_SPJK.KEYNAME（SQL 中别名为 RIVERID_NAME）
            point.setRiver(pick(row, "RIVERID_NAME", "RIVERNAME", "RIVER_NAME", "RIVER"));
            point.setSetupBasis(pick(row, "BASIS", "SETUP_BASIS", "SETBASIS", "REASON", "SETUPBASIS"));
            point.setAddress(pick(row, "ADDR", "ADDRESS", "LOCATION", "SITE"));
            point.setWaterTime(pick(row, "WTIME", "WATER_TIME", "INTAKE_TIME"));
            point.setWaterAmount(pick(row, "WAMT", "WATER_AMOUNT", "INTAKE_AMOUNT"));

            String mainFlag = pick(row, "ISMAIN", "IS_MAIN", "ISKEY", "IS_KEY", "KEYPOINT", "MAIN");
            boolean main = mainFlag != null && ("1".equals(mainFlag)
                    || "Y".equalsIgnoreCase(mainFlag) || "YES".equalsIgnoreCase(mainFlag)
                    || "TRUE".equalsIgnoreCase(mainFlag) || "是".equals(mainFlag));
            if (!main && point.getCode() != null && props.getMainPointCodes() != null) {
                main = props.getMainPointCodes().contains(point.getCode());
            }
            point.setMain(main);

            if (point.getCode() != null && !point.getCode().isBlank()) {
                if (point.getName() == null || point.getName().isBlank()) {
                    point.setName(point.getCode());
                }
                points.add(point);
            }
        }
        return points;
    }

    /**
     * 从数据库行 Map 中按候选列名取值（键大小写不敏感）。
     */
    public static String pick(Map<String, Object> row, String... keys) {
        if (row == null) {
            return null;
        }
        for (String key : keys) {
            Object value = row.get(key);
            if (value == null) {
                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    String column = entry.getKey();
                    if (column != null && column.equalsIgnoreCase(key)) {
                        value = entry.getValue();
                        break;
                    }
                }
            }
            if (value != null) {
                String text = value.toString().trim();
                if (!text.isEmpty()) {
                    return text;
                }
            }
        }
        return null;
    }

    /**
     * 平台原始 STATE 是否为离线。
     */
    public static boolean isOffline(String state) {
        if (state == null || state.isBlank()) {
            return false;
        }
        String value = state.trim().toLowerCase(Locale.ROOT);
        return "0".equals(value) || "off".equals(value) || "offline".equals(value)
                || "false".equals(value) || value.contains("离线") || value.contains("故障")
                || value.contains("不在线");
    }
}
