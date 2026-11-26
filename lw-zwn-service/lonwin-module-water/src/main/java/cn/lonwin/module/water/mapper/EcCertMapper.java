package cn.lonwin.module.water.mapper;

import cn.lonwin.module.water.entity.EcWpcSupEntity;
import cn.lonwin.module.water.model.query.EcCertQuery;
import cn.lonwin.module.water.model.vo.EcCertVO;
import cn.lonwin.module.water.model.vo.EcGroupVO;
import cn.lonwin.module.water.model.vo.EcIntakeVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 证照管理 Mapper，SQL 见 resources/mapper/EcBaseInfoWr.xml
 */
@Mapper
public interface EcCertMapper extends BaseMapper<EcWpcSupEntity> {

    /** 根据条件查询取水许可电子证照基本信息列表 */
    List<EcCertVO> selectEcBaseInfoList(@Param("query") EcCertQuery query);

    /** 分页查询（MyBatis-Plus 分页插件自动改写） */
    Page<EcCertVO> selectEcBaseInfoPage(Page<EcCertVO> page, @Param("query") EcCertQuery query);

    /** 根据取水许可证编码获取证照基本信息（主表，扩展信息由 Service 补充） */
    EcCertVO selectEcBaseInfoByWpcCd(@Param("wpcCd") String wpcCd);

    /** 按一批取水许可编码批量取只读扩展信息 */
    List<EcCertVO> selectEcBaseInfoByWpcCds(@Param("wpcCds") List<String> wpcCds);

    /** 按一批证照 ID 批量取取水口 */
    List<EcIntakeVO> selectWaterIntakeByEcIds(@Param("ecIds") List<String> ecIds);

    /** 证件数 / 许可水量 / 取水口数 */
    Map<String, Object> selectEcBaseInfoCount(@Param("wpcCd") String wpcCd);

    /** 获取取水口列表（wpcCd 为空时查全部） */
    List<EcIntakeVO> selectWaterIntakeList(@Param("wpcCd") String wpcCd);

    /** 根据证照 id 获取取水口详情 */
    List<EcIntakeVO> selectWaterIntakeByEcId(@Param("ecBaseInfoId") String ecBaseInfoId);

    /** 以所属河流为分组查询许可水量总和 */
    List<EcGroupVO> selectRiverPermitQty();

    /** 以监管单位为分组查询取水许可证的个数 */
    List<EcGroupVO> selectSupManCertCount();

    /** 以所属河流为分组查询取水口的个数 */
    List<EcGroupVO> selectRiverIntakeCount();

    /** 新增取水许可证信息 */
    int insertEcWpcSup(EcWpcSupEntity entity);

    /** 编辑取水许可证信息 */
    int updateEcWpcSup(EcWpcSupEntity entity);

    /** 删除取水许可证信息（仅删除可写的监管主表记录） */
    int deleteEcWpcSup(@Param("wpcCd") String wpcCd);

    /** 取水许可编码是否存在 */
    int countByWpcCd(@Param("wpcCd") String wpcCd);
}
