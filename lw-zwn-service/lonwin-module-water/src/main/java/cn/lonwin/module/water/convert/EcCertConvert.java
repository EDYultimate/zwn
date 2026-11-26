package cn.lonwin.module.water.convert;

import cn.lonwin.module.water.entity.EcWpcSupEntity;
import cn.lonwin.module.water.model.dto.EcCertDTO;
import cn.lonwin.module.water.model.vo.EcCertVO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * 证照管理对象转换器。
 * DTO / Entity / VO 的字段命名体系不同，这里只自动映射同名属性，
 * 其余业务字段由 EcCertService 显式处理，故忽略未映射属性的警告。
 */
@Mapper(componentModel = "spring")
public interface EcCertConvert {

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    EcWpcSupEntity dtoToEntity(EcCertDTO dto);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    EcCertDTO entityToDto(EcWpcSupEntity entity);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    EcCertVO entityToVo(EcWpcSupEntity entity);

    List<EcCertVO> entitiesToVos(List<EcWpcSupEntity> entities);
}
