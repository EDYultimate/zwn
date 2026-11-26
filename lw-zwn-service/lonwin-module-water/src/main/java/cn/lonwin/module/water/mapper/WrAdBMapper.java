package cn.lonwin.module.water.mapper;

import cn.lonwin.module.water.entity.WrAdBEntity;
import cn.lonwin.module.water.model.query.WrAdBQuery;
import cn.lonwin.module.water.model.vo.WrAdBVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Collection;
import java.util.List;

/**
 * 行政区划（WR_AD_B）数据访问。
 */
@Mapper
public interface WrAdBMapper extends BaseMapper<WrAdBEntity> {
    /**
     * 列表查询（不分页）。
     */
    List<WrAdBVO> selectAdBList(@Param("query") WrAdBQuery query);

    /**
     * 分页查询。
     */
    Page<WrAdBVO> selectAdBPage(Page<WrAdBVO> page, @Param("query") WrAdBQuery query);

    /**
     * 按行政区划代码查询详情。
     */
    WrAdBVO selectAdBByCd(@Param("adCd") String adCd);

    /**
     * 按行政区划代码查询名称（不存在返回 null）。
     */
    String selectAdNmByCd(@Param("adCd") String adCd);

    /**
     * 按名称模糊查询，limit 限制返回条数（下拉联想用）。
     */
    List<WrAdBVO> selectAdBByName(@Param("adNm") String adNm, @Param("limit") Integer limit);

    /**
     * 批量按代码查询（编码 → 名称批量翻译用）。
     */
    List<WrAdBVO> selectAdBByCds(@Param("adCds") Collection<String> adCds);

    /**
     * 代码是否已存在。
     */
    int countByCd(@Param("adCd") String adCd);

    /**
     * 新增。
     */
    int insertAdB(WrAdBEntity entity);

    /**
     * 编辑（按主键 AD_CD）。
     */
    int updateAdB(WrAdBEntity entity);

    /**
     * 按主键删除。
     */
    int deleteAdBByCd(@Param("adCd") String adCd);
}
