package cn.lonwin.framework.log.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 操作日志配置，从配置文件 lonwin.log 读取。
 */
@Component
@ConfigurationProperties(prefix = "lonwin.log")
@Data
public class LogProperties {

    /** 是否开启操作日志同步（默认关闭） */
    private boolean enabled = false;
}
