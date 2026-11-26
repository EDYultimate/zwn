package ${table.packageName}.convert;

import ${table.packageName}.entity.${table.className}Entity;
import ${table.packageName}.model.dto.${table.className}DTO;
import ${table.packageName}.model.vo.${table.className}VO;
import org.mapstruct.Mapper;
import java.util.List;

/**
 * ${table.tableComment}对象转换器
 */
@Mapper(componentModel = "spring")
public interface ${table.className}Convert {

    ${table.className}Entity dtoToEntity(${table.className}DTO dto);

    ${table.className}DTO entityToDto(${table.className}Entity entity);

    ${table.className}VO entityToVo(${table.className}Entity entity);

    List<${table.className}VO> entitiesToVos(List<${table.className}Entity> entities);
}