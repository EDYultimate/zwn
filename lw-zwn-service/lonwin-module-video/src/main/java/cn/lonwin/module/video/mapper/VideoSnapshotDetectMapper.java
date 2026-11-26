package cn.lonwin.module.video.mapper;

import cn.lonwin.module.video.entity.VideoSnapshotDetectEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 异常图片识别要素表（主库 HWWR）。不写 @DS，走默认 master 数据源。
 */
@Mapper
public interface VideoSnapshotDetectMapper extends BaseMapper<VideoSnapshotDetectEntity> {
}
