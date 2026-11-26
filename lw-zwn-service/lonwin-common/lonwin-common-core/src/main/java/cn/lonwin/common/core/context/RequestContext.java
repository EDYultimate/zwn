package cn.lonwin.common.core.context;

import com.alibaba.ttl.TransmittableThreadLocal;
import lombok.experimental.UtilityClass;

/**
 * 请求上下文
 */
@UtilityClass
public class RequestContext {
    
    private static final TransmittableThreadLocal<String> USER_ID = new TransmittableThreadLocal<>();
    private static final TransmittableThreadLocal<String> USERNAME = new TransmittableThreadLocal<>();
    private static final TransmittableThreadLocal<String> TENANT_ID = new TransmittableThreadLocal<>();
    private static final TransmittableThreadLocal<String> TRACE_ID = new TransmittableThreadLocal<>();
    
    public static String getUserId() {
        return USER_ID.get();
    }
    
    public static void setUserId(String userId) {
        USER_ID.set(userId);
    }
    
    public static String getUsername() {
        return USERNAME.get();
    }
    
    public static void setUsername(String username) {
        USERNAME.set(username);
    }
    
    public static String getTenantId() {
        return TENANT_ID.get();
    }
    
    public static void setTenantId(String tenantId) {
        TENANT_ID.set(tenantId);
    }
    
    public static String getTraceId() {
        return TRACE_ID.get();
    }
    
    public static void setTraceId(String traceId) {
        TRACE_ID.set(traceId);
    }
    
    public static void clear() {
        USER_ID.remove();
        USERNAME.remove();
        TENANT_ID.remove();
        TRACE_ID.remove();
    }
}