package cn.lonwin.framework.data.datasource;

/**
 * 数据源上下文持有者
 * <p>
 * 通过 ThreadLocal 保存当前线程选择的数据源 key。
 * 由 {@link DataSourceAspect} 在 Mapper 方法调用前设置，调用后清除。
 */
public final class DynamicDataSourceContextHolder {

    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

    private DynamicDataSourceContextHolder() {
    }

    /**
     * 设置当前线程的数据源 key
     */
    public static void set(String ds) {
        CONTEXT.set(ds);
    }

    /**
     * 获取当前线程的数据源 key，未设置时返回 null
     */
    public static String get() {
        return CONTEXT.get();
    }

    /**
     * 清除当前线程的数据源 key
     */
    public static void clear() {
        CONTEXT.remove();
    }
}
