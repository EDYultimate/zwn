package cn.lonwin.module.water.convert;

import cn.lonwin.module.water.entity.SysTest2Entity;
import cn.lonwin.module.water.model.dto.SysTest2DTO;
import cn.lonwin.module.water.model.vo.SysTest2VO;
import org.mapstruct.Mapper;
import java.util.List;

/**
 * SYS_TEST2对象转换器
 */
@Mapper(componentModel = "spring")
public interface SysTest2Convert {

    SysTest2Entity dtoToEntity(SysTest2DTO dto);

    SysTest2DTO entityToDto(SysTest2Entity entity);

    SysTest2VO entityToVo(SysTest2Entity entity);

    List<SysTest2VO> entitiesToVos(List<SysTest2Entity> entities);
}