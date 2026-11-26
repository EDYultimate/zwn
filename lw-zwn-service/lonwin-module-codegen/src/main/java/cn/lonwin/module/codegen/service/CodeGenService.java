package cn.lonwin.module.codegen.service;

import cn.lonwin.module.codegen.model.GenerateConfig;
import cn.lonwin.module.codegen.model.TableInfo;
import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * 代码生成服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CodeGenService {

    private final DbMetaService dbMetaService;
    private final Configuration freemarkerConfig;

    /**
     * 生成代码
     */
    public void generate(GenerateConfig config) {
        // 获取表信息
        TableInfo tableInfo = dbMetaService.getTableInfo(config.getTableName());

        // 设置生成信息
        tableInfo.setModuleName(config.getModuleName());
        tableInfo.setFunctionName(config.getFunctionName());
        tableInfo.setAuthor(config.getAuthor());
        tableInfo.setClassName(dbMetaService.tableToClassName(config.getTableName(), config.getTablePrefix()));
        tableInfo.setClassNameLower(firstLower(tableInfo.getClassName()));
        tableInfo.setPackageName(config.getPackagePrefix() + "." + config.getModuleName());
        tableInfo.setBaseRequestMapping("/api/" + config.getModuleName() + "/" + firstLower(tableInfo.getClassName()));

        // 构建输出路径
        String basePath = config.getOutputPath();
        if (basePath == null || basePath.isEmpty()) {
            basePath = System.getProperty("user.dir") + "/generated-code/" + config.getModuleName();
        }

        String javaPath = basePath + "/src/main/java/" + tableInfo.getPackageName().replace(".", "/");
        String resourcesPath = basePath + "/src/main/resources";

        Map<String, Object> dataModel = new HashMap<>();
        dataModel.put("table", tableInfo);
        dataModel.put("config", config);

        try {
            // 生成 Entity
            if (Boolean.TRUE.equals(config.getGenEntity())) {
                generateFile(dataModel, "entity.ftl", javaPath + "/entity/", tableInfo.getClassName() + "Entity.java");
            }

            // 生成 DTO
            if (Boolean.TRUE.equals(config.getGenDto())) {
                generateFile(dataModel, "dto.ftl", javaPath + "/model/dto/", tableInfo.getClassName() + "DTO.java");
            }

            // 生成 VO
            if (Boolean.TRUE.equals(config.getGenVo())) {
                generateFile(dataModel, "vo.ftl", javaPath + "/model/vo/", tableInfo.getClassName() + "VO.java");
            }

            // 生成 Query
            if (Boolean.TRUE.equals(config.getGenQuery())) {
                generateFile(dataModel, "query.ftl", javaPath + "/model/query/", tableInfo.getClassName() + "Query.java");
            }

            // 生成 Mapper（MyBatis-Plus模式）
            if (Boolean.TRUE.equals(config.getGenMapper()) && config.useMybatis()) {
                generateFile(dataModel, "mapper.ftl", javaPath + "/mapper/", tableInfo.getClassName() + "Mapper.java");
            }

            // 生成 Repository（JPA模式）
            if (Boolean.TRUE.equals(config.getGenRepository()) && config.useJpa()) {
                generateFile(dataModel, "repository.ftl", javaPath + "/repository/", tableInfo.getClassName() + "Repository.java");
            }

            // 生成 Service
            if (Boolean.TRUE.equals(config.getGenService())) {
                generateFile(dataModel, "service.ftl", javaPath + "/service/", tableInfo.getClassName() + "Service.java");
            }

            // 生成 Controller
            if (Boolean.TRUE.equals(config.getGenController())) {
                generateFile(dataModel, "controller.ftl", javaPath + "/controller/", tableInfo.getClassName() + "Controller.java");
            }

            // 生成 Convert
            if (Boolean.TRUE.equals(config.getGenConvert())) {
                generateFile(dataModel, "convert.ftl", javaPath + "/convert/", tableInfo.getClassName() + "Convert.java");
            }

            // 生成 Mapper XML（MyBatis-Plus模式）
            if (Boolean.TRUE.equals(config.getGenXml()) && config.useMybatis()) {
                generateFile(dataModel, "mapper_xml.ftl", resourcesPath + "/mapper/", tableInfo.getClassName() + "Mapper.xml");
            }

            log.info("代码生成完成，ORM模式: {}，输出路径: {}", config.getOrmMode(), basePath);

        } catch (Exception e) {
            log.error("代码生成失败", e);
            throw new RuntimeException("代码生成失败", e);
        }
    }

    /**
     * 生成单个文件
     */
    private void generateFile(Map<String, Object> dataModel, String templateName, String outputDir, String fileName) throws Exception {
        Template template = freemarkerConfig.getTemplate(templateName);

        File dir = new File(outputDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        File outputFile = new File(dir, fileName);
        try (Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputFile), StandardCharsets.UTF_8))) {
            template.process(dataModel, writer);
        }

        log.info("生成文件: {}", outputFile.getAbsolutePath());
    }

    /**
     * 首字母小写
     */
    private String firstLower(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return Character.toLowerCase(str.charAt(0)) + str.substring(1);
    }
}