package cn.lonwin.module.agent.datascope;

import java.util.function.Supplier;

import org.springframework.util.StringUtils;

/**
 * 数据权限上下文：当前请求（线程）内「我是谁、我属于哪个单位」的唯一读取入口。
 *
 * <p>使用方式（业务代码只依赖这一个类）：
 * <pre>{@code
 * Map<String, Object> annualTransfer(int year) {
 *     String unitCode = DataScopeContext.unitCode();   // 未开启/非请求线程 → null
 *     ...
 * }
 * }</pre>
 *
 * <p><b>惰性解析</b>：切面只登记「怎么取」，不立刻取。这样回答制度类问题（不查业务数据）时
 * 不会因为权限系统没配单位编码而被 403 拦住——只有真正读取单位的那一刻才校验。
 *
 * <p><b>线程边界</b>：ThreadLocal 不会自动跨线程传递。异步/线程池中需要单位时，
 * 用 {@link #runWith(Scope, Supplier)} 显式携带（调用方从当前线程取 {@link #current()} 即可）。
 * 刻意不注册 {@code TransmittableThreadLocal}，避免隐式传播带来的越权风险。
 */
public final class DataScopeContext {

    private static final ThreadLocal<Scope> HOLDER = new ThreadLocal<>();

    private DataScopeContext() {
    }

    /** 当前线程的数据范围，未开启时为 {@code null} */
    public static Scope current() {
        return HOLDER.get();
    }

    /** 数据权限是否生效（开关开启且处于切面范围内） */
    public static boolean active() {
        return HOLDER.get() != null;
    }

    /**
     * 当前单位编码。
     *
     * @return 未开启、非请求线程或解析不到时返回 {@code null}；严格模式下解析不到会抛 403
     */
    public static String unitCode() {
        Scope scope = HOLDER.get();
        return scope == null ? null : scope.unitCode();
    }

    /** 当前登录用户工号，未开启/非请求线程时返回 {@code null} */
    public static String userCode() {
        Scope scope = HOLDER.get();
        return scope == null ? null : scope.userCode();
    }

    /**
     * 在指定数据范围下执行（用于异步线程、线程池任务）。
     *
     * <pre>{@code
     * DataScopeContext.Scope scope = DataScopeContext.current();
     * executor.submit(() -> DataScopeContext.runWith(scope, this::query));
     * }</pre>
     */
    public static <T> T runWith(Scope scope, Supplier<T> action) {
        Scope previous = HOLDER.get();
        HOLDER.set(scope);
        try {
            return action.get();
        } finally {
            restore(previous);
        }
    }

    /**
     * 手工构造一个数据范围（异步线程、单元测试用）。
     *
     * <p>正常请求请勿直接调用，走 {@link DataScope} 切面即可，避免绕过开关。
     */
    public static Scope of(String userCode, String unitCode) {
        Scope scope = new Scope(userCode, () -> unitCode);
        scope.resolved = true;
        scope.unitCode = unitCode;
        return scope;
    }

    /** 开启一个数据范围，返回原范围（由调用方在 finally 中 {@link #restore(Scope)}） */
    static Scope open(String userCode, Supplier<String> unitCodeSupplier) {
        Scope previous = HOLDER.get();
        HOLDER.set(new Scope(userCode, unitCodeSupplier));
        return previous;
    }

    static void restore(Scope previous) {
        if (previous == null) {
            HOLDER.remove();
        } else {
            HOLDER.set(previous);
        }
    }

    /**
     * 一次调用的数据范围。
     *
     * <p>单位编码按需解析且只解析一次：解析失败（严格模式）会直接抛出，由全局异常处理器转成 403。
     */
    public static final class Scope {

        private final String userCode;
        private final Supplier<String> unitCodeSupplier;
        private String unitCode;
        private boolean resolved;

        private Scope(String userCode, Supplier<String> unitCodeSupplier) {
            this.userCode = userCode;
            this.unitCodeSupplier = unitCodeSupplier;
        }

        /** 无单位限制的范围（开关关闭时用于保持调用语义一致） */
        static Scope unscoped(String userCode) {
            Scope scope = new Scope(userCode, () -> null);
            scope.resolved = true;
            return scope;
        }

        public String userCode() {
            return userCode;
        }

        public String unitCode() {
            if (!resolved) {
                String value = unitCodeSupplier.get();
                unitCode = StringUtils.hasText(value) ? value.trim() : null;
                resolved = true;
            }
            return unitCode;
        }
    }
}
