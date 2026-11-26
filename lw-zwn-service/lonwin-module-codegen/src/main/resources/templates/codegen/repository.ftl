package ${table.packageName}.repository;

import ${table.packageName}.entity.${table.className}Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * ${table.tableComment}Repository - JPA方式
 */
public interface ${table.className}Repository extends JpaRepository<${table.className}Entity, ${table.primaryKey.javaType}>,
        JpaSpecificationExecutor<${table.className}Entity> {

}