package cn.lonwin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Lonwin开发部署运维一体化平台 - 启动类
 */
@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
@EntityScan(basePackages = {
        "cn.lonwin.**.entity",
        "cn.lonwin.**.model.entity"
})
@ComponentScan({
        "cn.lonwin",
        "cn.lonwin.framework"
})
public class LonwinApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(LonwinApplication.class, args);

        // 打印启动成功信息
        printStartupInfo();
    }

    /**
     * 支持外部Tomcat部署
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(LonwinApplication.class);
    }

    /**
     * 打印启动信息
     */
    private static void printStartupInfo() {
        String banner = """
            
            =================================================================
             _                    _             __    _                     
            | |                  (_)           / _|  (_)                    
            | |     ___   ___ ___ _  ___  _ __| |_ __ _ _ __   ___  ___     
            | |    / _ \\ / __/ __| |/ _ \\| '__|  _/ _` | '_ \\ / _ \\/ __|    
            | |___| (_) | (_| (__| | (_) | |  | || (_| | | | |  __/\\__ \\    
            |______\\___/ \\___\\___|_|\\___/|_|  |_| \\__,_|_| |_|\\___||___/    
                                                                            
            =================================================================
            应用启动成功!
            时间: %s
            端口: 8080
            环境: %s
            文档: http://localhost:8080/swagger-ui.html
            健康检查: http://localhost:8080/actuator/health
            =================================================================
            """;

        String timestamp = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String profile = System.getProperty("spring.profiles.active", "dev");

        System.out.println(String.format(banner, timestamp, profile));
    }
}