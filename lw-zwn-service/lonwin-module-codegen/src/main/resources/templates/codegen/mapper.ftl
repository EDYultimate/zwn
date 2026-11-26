package ${table.packageName}.mapper;

import ${table.packageName}.entity.${table.className}Entity;
import ${table.packageName}.model.query.${table.className}Query;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * ${table.tableComment}Mapper - MyBatis Plus方式
 */
@Mapper
public interface ${table.className}Mapper extends BaseMapper<${table.className}Entity> {

    /**
     * 查询列表
     */
    List<${table.className}Entity> selectList(@Param("query") ${table.className}Query query);

    /**
     * 分页查询
     */
    Page<${table.className}Entity> selectListByPage(Page<${table.className}Entity> page, @Param("query") ${table.className}Query query);
}