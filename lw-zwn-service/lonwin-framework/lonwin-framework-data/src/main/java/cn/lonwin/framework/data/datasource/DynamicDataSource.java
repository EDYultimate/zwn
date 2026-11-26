package cn.lonwin.framework.data.datasource;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * 动态路由数据源
 * <p>
 * 基于 {@link AbstractRoutingDataSource}，根据 {@link DynamicDataSourceContextHolder}
 * 中保存的 key 路由到对应的数据源。未指定时走默认数据源（主数据源）。
 */
public class DynamicDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return DynamicDataSourceContextHolder.get();
    }
}
