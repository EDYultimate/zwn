package cn.lonwin.common.core.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Lonwin开发部署运维一体化平台")
                        .description("基于Spring Boot 3.x的快速开发平台")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Lonwin Team")
                                .email("support@lonwin.com")));
    }
}