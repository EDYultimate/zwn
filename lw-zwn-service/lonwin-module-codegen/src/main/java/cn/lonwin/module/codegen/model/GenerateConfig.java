package cn.lonwin.module.codegen.model;

import lombok.Data;

/**
 * 代码生成配置
 */
@Data
public class GenerateConfig {

    /**
     * 作者
     */
    private String author = "codegen";

    /**
     * 模块名
     */
    private String moduleName;

    /**
     * 包名前缀
     */
    private String packagePrefix = "cn.lonwin.module";

    /**
     * 表名
     */
    private String tableName;

    /**
     * 表前缀（生成时会去掉）
     */
    private String tablePrefix = "";

    /**
     * 功能名
     */
    private String functionName;

    /**
     * ORM模式：MYBATIS(只用MyBatis-Plus)、JPA(只用JPA)、BOTH(两者都有)
     */
    private String ormMode = "BOTH";

    /**
     * 是否生成Controller
     */
    private Boolean genController = true;

    /**
     * 是否生成Service
     */
    private Boolean genService = true;

    /**
     * 是否生成Entity
     */
    private Boolean genEntity = true;

    /**
     * 是否生成Mapper
     */
    private Boolean genMapper = true;

    /**
     * 是否生成Repository
     */
    private Boolean genRepository = true;

    /**
     * 是否生成DTO
     */
    private Boolean genDto = true;

    /**
     * 是否生成VO
     */
    private Boolean genVo = true;

    /**
     * 是否生成Query
     */
    private Boolean genQuery = true;

    /**
     * 是否生成Convert
     */
    private Boolean genConvert = true;

    /**
     * 是否生成Mapper XML
     */
    private Boolean genXml = true;

    /**
     * 输出路径
     */
    private String outputPath;

    /**
     * 是否使用MyBatis-Plus
     */
    public boolean useMybatis() {
        return "MYBATIS".equalsIgnoreCase(ormMode) || "BOTH".equalsIgnoreCase(ormMode);
    }

    /**
     * 是否使用JPA
     */
    public boolean useJpa() {
        return "JPA".equalsIgnoreCase(ormMode) || "BOTH".equalsIgnoreCase(ormMode);
    }
}