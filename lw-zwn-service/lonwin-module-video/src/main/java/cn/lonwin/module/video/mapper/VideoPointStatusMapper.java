package cn.lonwin.module.video.mapper;

import cn.lonwin.module.video.entity.VideoPointStatusEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 视频点位信息与在线状态（主库 HWWR）。
 * <p>
 * 不写 @DS，走默认 master 数据源；WEIHE 台账一律通过 {@link VideoPointMapper} 只读。
 */
@Mapper
public interface VideoPointStatusMapper extends BaseMapper<VideoPointStatusEntity> {
}
