package cn.lonwin.framework.data.datasource;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * 数据源切换切面
 * <p>
 * 拦截所有 Mapper 接口方法调用，读取方法或类上的 {@link DS} 注解，
 * 在调用前设置数据源 key，调用后清除。
 * <p>
 * 优先级设为最高（Order(1)），确保在事务管理器获取连接前完成数据源切换。
 */
@Slf4j
@Aspect
@Component
@Order(1)
public class DataSourceAspect {

    /**
     * 拦截 cn.lonwin 包下所有 Mapper 接口的任意方法
     */
    @Around("execution(* cn.lonwin..mapper..*.*(..))")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        Class<?> targetClass = point.getTarget().getClass();

        // 方法上的 @DS 优先于类上的 @DS
        DS dsAnnotation = resolveAnnotation(method, targetClass);
        String dsKey = dsAnnotation == null ? null : dsAnnotation.value();

        try {
            if (dsKey != null) {
                DynamicDataSourceContextHolder.set(dsKey);
            }
            return point.proceed();
        } finally {
            DynamicDataSourceContextHolder.clear();
        }
    }

    /**
     * 解析 @DS 注解，方法级优先于类级
     */
    private DS resolveAnnotation(Method method, Class<?> targetClass) {
        // 1. 先查方法上的注解
        DS methodDs = method.getAnnotation(DS.class);
        if (methodDs != null) {
            return methodDs;
        }
        // 2. 再查方法声明所在的 Mapper 接口（可能存在多个接口）
        for (Class<?> iface : targetClass.getInterfaces()) {
            DS ifaceDs = iface.getAnnotation(DS.class);
            if (ifaceDs != null) {
                return ifaceDs;
            }
        }
        return null;
    }
}
