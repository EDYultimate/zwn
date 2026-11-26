package cn.lonwin.module.video.mapper;

import cn.lonwin.framework.data.datasource.DS;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 本地视频点位台账（tr_Spd）。
 * <p>
 * Mapper 由 framework-data 的 @MapperScan("cn.lonwin") 统一扫描。
 * 使用 Map 接收，兼容不同数据库 / 不同版本表里列名大小写及扩展列不一致的情况。
 */
@Mapper
@DS("weihe")
public interface VideoPointMapper {

    /**
     * 按监管单位查询视频点位；manageDept 为空时不过滤。
     */
    List<Map<String, Object>> selectZwnPointList(@Param("manageDept") String manageDept);
}
