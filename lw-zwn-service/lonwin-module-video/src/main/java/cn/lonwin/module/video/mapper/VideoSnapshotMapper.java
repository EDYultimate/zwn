package cn.lonwin.module.video.mapper;

import cn.lonwin.module.video.entity.VideoSnapshotEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 抓拍记录（主库 HWWR）。不写 @DS，走默认 master 数据源。
 */
@Mapper
public interface VideoSnapshotMapper extends BaseMapper<VideoSnapshotEntity> {
}
