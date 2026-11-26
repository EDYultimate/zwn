
package cn.lonwin.framework.data.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis Plus配置
 * 支持达梦数据库
 */
@Configuration
public class MyBatisPlusConfig {

    /**
     * 分页插件配置
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页插件 - 使用达梦数据库类型
        PaginationInnerInterceptor paginationInterceptor = new PaginationInnerInterceptor(DbType.DM);
        // 设置最大单页限制数量，默认 500 条，-1 不受限制
        paginationInterceptor.setMaxLimit(500L);
        // 溢出总页数后是否进行处理（默认不处理）
        paginationInterceptor.setOverflow(false);

        interceptor.addInnerInterceptor(paginationInterceptor);

        return interceptor;
    }

}