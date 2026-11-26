package cn.lonwin.module.codegen.config;

import freemarker.template.Configuration;
import freemarker.template.TemplateExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

/**
 * Freemarker模板配置
 */
@Component
public class FreemarkerConfig {

    @Bean
    public Configuration freemarkerConfiguration() throws IOException {
        Configuration cfg = new Configuration(Configuration.VERSION_2_3_31);

        // 从classpath加载模板
        cfg.setClassLoaderForTemplateLoading(
                getClass().getClassLoader(),
                "templates/codegen"
        );

        cfg.setDefaultEncoding("UTF-8");
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        cfg.setLogTemplateExceptions(false);
        cfg.setWrapUncheckedExceptions(true);

        return cfg;
    }
}