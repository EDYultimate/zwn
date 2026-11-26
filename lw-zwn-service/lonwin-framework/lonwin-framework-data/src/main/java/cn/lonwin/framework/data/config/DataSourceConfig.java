package cn.lonwin.framework.data.config;

import cn.lonwin.framework.data.datasource.DynamicDataSource;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusProperties;
import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 数据源配置（通用多数据源，自动扫描注册）。
 * <p>
 * yml 中 {@code spring.datasource.{name}} 下的每个节点都是一个数据源，
 * 其中 {@code master} 固定作为默认主库，其余按名称注册为副库。
 * <br>
 * 新增数据源无需改 Java，只需在 yml 添加节点，Mapper 上用 {@code @DS("name")} 切换。
 *
 * <pre>
 * spring:
 *   datasource:
 *     master:       # 默认主库
 *       url: ...
 *       hikari: { ... }
 *     ydh:          # 副库，@DS("ydh")
 *       url: ...
 *       hikari: { ... }
 *     a:            # 任意新增库，@DS("a")
 *       url: ...
 * </pre>
 */
@Configuration
@EnableTransactionManagement
@MapperScan(basePackages = "cn.lonwin", annotationClass = Mapper.class, sqlSessionFactoryRef = "sqlSessionFactory")
public class DataSourceConfig implements org.springframework.context.EnvironmentAware {

    /** 默认主库 key（@DS 注解不写时走此库） */
    public static final String DEFAULT_DATASOURCE = "master";

    /** yml 中数据源根前缀 */
    public static final String DATASOURCE_PREFIX = "spring.datasource";

    /** Spring Boot / 连接池内置保留 key，不作为数据源名 */
    private static final Set<String> RESERVED_KEYS = Set.of(
            "hikari", "druid", "dbcp2", "tomcat",
            "url", "username", "password",
            "driver-class-name", "driver-class",
            "generate-unique-name", "type", "name",
            "schema", "data", "initialize", "initialization-mode",
            "platform", "continue-on-error", "separator", "jndi-name"
    );

    private ConfigurableEnvironment environment;

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = (ConfigurableEnvironment) environment;
    }

    /**
     * 动态路由数据源：从 yml 自动扫描所有 spring.datasource.{name} 注册。
     * master 作为默认数据源；未配置 master 时取第一个作为默认。
     */
    @Primary
    @Bean("dataSource")
    public DynamicDataSource dataSource() {
        List<String> names = discoverDataSourceNames();
        if (names.isEmpty()) {
            throw new IllegalStateException("未发现任何数据源配置，请在 spring.datasource.* 下配置数据源");
        }

        Map<Object, Object> targets = new LinkedHashMap<>();
        DataSource defaultDs = null;
        for (String name : names) {
            HikariDataSource ds = buildDataSource(name);
            targets.put(name, ds);
            if (DEFAULT_DATASOURCE.equals(name)) {
                defaultDs = ds;
            }
        }
        if (defaultDs == null) {
            defaultDs = (DataSource) targets.values().iterator().next();
        }

        DynamicDataSource ds = new DynamicDataSource();
        ds.setDefaultTargetDataSource(defaultDs);
        ds.setTargetDataSources(targets);
        return ds;
    }

    /**
     * 唯一的 SqlSessionFactory，绑定到动态数据源。
     * 加载 classpath*:mapper/ 下所有 XML（含子目录）。
     */
    @Bean("sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource,
                                               MybatisPlusProperties mybatisPlusProperties) throws Exception {
        MybatisSqlSessionFactoryBean factory = new MybatisSqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        factory.setMapperLocations(new PathMatchingResourcePatternResolver()
                .getResources("classpath*:mapper/**/*.xml"));
        MybatisConfiguration configuration = new MybatisConfiguration();
        configuration.setMapUnderscoreToCamelCase(true);
        factory.setConfiguration(configuration);
        factory.setGlobalConfig(mybatisPlusProperties.getGlobalConfig());
        return factory.getObject();
    }

    // ==================== 内部方法 ====================

    /**
     * 扫描 Environment 中所有 spring.datasource.{name}.xxx 属性，
     * 提取一级 key 作为数据源名（排除 Spring Boot 保留字段）。
     */
    private List<String> discoverDataSourceNames() {
        Set<String> names = new LinkedHashSet<>();
        String prefix = DATASOURCE_PREFIX + ".";
        for (PropertySource<?> ps : environment.getPropertySources()) {
            if (!(ps instanceof EnumerablePropertySource)) {
                continue;
            }
            for (String prop : ((EnumerablePropertySource<?>) ps).getPropertyNames()) {
                if (!prop.startsWith(prefix)) {
                    continue;
                }
                String sub = prop.substring(prefix.length());
                int dot = sub.indexOf('.');
                String name = dot > 0 ? sub.substring(0, dot) : sub;
                if (!name.isEmpty() && !RESERVED_KEYS.contains(name)) {
                    names.add(name);
                }
            }
        }
        return new ArrayList<>(names);
    }

    /**
     * 根据数据源名称构建 HikariDataSource：
     * <ol>
     *   <li>用 {@link DataSourceProperties} 绑定基础属性（url→jdbcUrl 等转换）</li>
     *   <li>用 Binder 将 {prefix}.hikari.* 连接池参数绑定到已创建的实例</li>
     * </ol>
     */
    private HikariDataSource buildDataSource(String name) {
        String prefix = DATASOURCE_PREFIX + "." + name;
        DataSourceProperties props = Binder.get(environment)
                .bind(prefix, DataSourceProperties.class)
                .orElseThrow(() -> new IllegalStateException("数据源配置绑定失败: " + name));
        HikariDataSource ds = props.initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
        // 将 hikari 子节点参数（pool-name/maximum-pool-size 等）绑定到已创建的实例
        Binder.get(environment).bind(prefix + ".hikari", Bindable.ofInstance(ds));
        return ds;
    }
}
