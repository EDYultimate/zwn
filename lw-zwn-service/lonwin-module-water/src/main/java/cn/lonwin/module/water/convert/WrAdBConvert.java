package cn.lonwin.module.water.convert;

import cn.lonwin.module.water.entity.WrAdBEntity;
import cn.lonwin.module.water.model.dto.WrAdBDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

/**
 * 行政区划 DTO <-> Entity 转换。
 */
@Mapper(componentModel = "spring")
public interface WrAdBConvert {
    /**
     * DTO 转 Entity（用于新增）。
     */
    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    WrAdBEntity dtoToEntity(WrAdBDTO dto);

    /**
     * 把 DTO 中非空字段合并进已有 Entity（用于编辑）。
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mergeDtoToEntity(WrAdBDTO dto, @MappingTarget WrAdBEntity entity);
}
