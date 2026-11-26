package cn.lonwin.framework.log.aspectj;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.utils.StringUtils;
import cn.lonwin.common.core.utils.UUIDUtils;
import cn.lonwin.framework.log.annotation.Log;
import cn.lonwin.framework.log.config.LogProperties;
import cn.lonwin.framework.log.entity.LogEntity;
import cn.lonwin.framework.log.service.LogSyncService;
import cn.lonwin.framework.log.util.MySimplePropertyPreFilter;
import cn.lonwin.framework.security.token.powers.PowersProperties;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.io.File;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志切面，拦截@Log注解标记的方法，
 * 根据注解内容、请求内容、返回内容封装日志对象，异步同步到权限系统。
 */
@Aspect
@Component
public class LogAspect {

    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);

    /** 排除敏感属性字段 */
    public static final String[] EXCLUDE_PROPERTIES = {"password", "oldPassword", "newPassword", "confirmPassword"};

    private final LogProperties logProperties;
    private final PowersProperties powersProperties;
    private final LogSyncService logSyncService;

    public LogAspect(LogProperties logProperties,
                     PowersProperties powersProperties,
                     LogSyncService logSyncService) {
        this.logProperties = logProperties;
        this.powersProperties = powersProperties;
        this.logSyncService = logSyncService;
    }

    /**
     * 操作日志切入点：@Log注解标记的方法
     */
    @Pointcut("@annotation(cn.lonwin.framework.log.annotation.Log)")
    public void logPointCut() {
    }

    /**
     * 处理完请求后执行
     *
     * @param joinPoint  切点
     * @param jsonResult 返回结果
     */
    @AfterReturning(pointcut = "logPointCut()", returning = "jsonResult")
    public void doAfterReturning(JoinPoint joinPoint, Object jsonResult) {
        handleLog(joinPoint, null, jsonResult);
    }

    /**
     * 拦截异常操作
     *
     * @param joinPoint 切点
     * @param e         异常
     */
    @AfterThrowing(value = "logPointCut()", throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint, Exception e) {
        handleLog(joinPoint, e, null);
    }

    /**
     * 处理注解的内容，根据注解内容、请求内容、返回内容封装日志对象，调用异步同步。
     *
     * @param joinPoint  切点
     * @param e          异常
     * @param jsonResult 返回结果
     */
    protected void handleLog(final JoinPoint joinPoint, final Exception e, Object jsonResult) {
        // 未开启日志同步则跳过
        if (!logProperties.isEnabled()) {
            return;
        }

        try {
            // 获得注解
            Log controllerLog = getAnnotationLog(joinPoint);
            if (controllerLog == null) {
                return;
            }

            // 从请求上下文获取HttpServletRequest（非请求线程调用时跳过）
            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
            if (requestAttributes == null) {
                return;
            }
            HttpServletRequest request = (HttpServletRequest) requestAttributes
                    .resolveReference(RequestAttributes.REFERENCE_REQUEST);
            if (request == null) {
                return;
            }

            // OPTIONS预检请求不记录日志
            String requestMethod = request.getMethod();
            if ("OPTIONS".equalsIgnoreCase(requestMethod)) {
                return;
            }

            // 获取当前登录用户
            LoginUserDTO loginUser = UserContext.get();

            // *========封装日志=========*//
            LogEntity operLog = new LogEntity();
            operLog.setId(UUIDUtils.generateUUID());
            operLog.setName(controllerLog.title());
            operLog.setModelName(controllerLog.model());
            operLog.setType(controllerLog.businessType().toString());
            operLog.setAccount(powersProperties.getAccount());
            operLog.setSysName(powersProperties.getAccountName());

            // 设置方法名称
            String className = joinPoint.getTarget().getClass().getName();
            String methodName = joinPoint.getSignature().getName();
            operLog.setMethod(className + "." + methodName + "()");
            operLog.setRequestMethod(requestMethod);

            if (loginUser != null) {
                operLog.setOperName(loginUser.getUserName());
                operLog.setUsername(loginUser.getUserCode());
            }
            operLog.setOperUrl(request.getRequestURI());
            operLog.setIp(getRealClientIp(request));

            // 根据注解判断，是否保存请求参数
            if (controllerLog.isSaveRequestData()) {
                Map<String, String[]> mutableParamMap = new HashMap<>(request.getParameterMap());

                // multipart/form-data请求额外记录文件名
                if (isMultipartContent(request)) {
                    List<String> fileNames = new ArrayList<>();
                    Collection<Part> parts = request.getParts();
                    for (Part part : parts) {
                        // 只处理文件类型的part
                        if (part.getContentType() != null) {
                            fileNames.add(getFileName(part));
                        }
                    }
                    if (!fileNames.isEmpty()) {
                        mutableParamMap.put("fileNames", fileNames.toArray(new String[0]));
                    }
                }

                if (StringUtils.isNotEmpty(mutableParamMap)) {
                    // 过滤敏感属性
                    MySimplePropertyPreFilter filter = new MySimplePropertyPreFilter(EXCLUDE_PROPERTIES);
                    String params = JSON.toJSONString(mutableParamMap, filter, JSONWriter.Feature.WriteMapNullValue);
                    operLog.setOperParam(StringUtils.substring(params, 0, 2000));
                }
            }

            // 返回参数
            if (jsonResult != null) {
                operLog.setJsonResult(StringUtils.substring(JSON.toJSONString(jsonResult), 0, 2000));
            }
            operLog.setStatus(LogEntity.STATUS_SUCCESS);
            if (e != null) {
                operLog.setStatus(LogEntity.STATUS_FAIL);
                operLog.setErrorMsg(StringUtils.substring(e.getMessage(), 0, 2000));
            }
            operLog.setTm(new Date());

            // 异步同步到权限系统
            logSyncService.syncLogAsync(operLog);
        } catch (Exception exp) {
            // 记录本地异常日志
            log.error("操作日志记录异常: {}", exp.getMessage());
        }
    }

    /**
     * 是否存在注解，如果存在就获取
     */
    private Log getAnnotationLog(JoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        return method != null ? method.getAnnotation(Log.class) : null;
    }

    /**
     * 判断请求是否为multipart/form-data类型
     */
    private boolean isMultipartContent(HttpServletRequest request) {
        String contentType = request.getContentType();
        return contentType != null && contentType.toLowerCase().startsWith("multipart/");
    }

    /**
     * 解析Part的文件名（兼容不同浏览器）
     * Content-Disposition格式：form-data; name="file"; filename="test.txt"
     */
    private String getFileName(Part part) {
        String contentDisposition = part.getHeader("Content-Disposition");
        String[] items = contentDisposition.split(";");
        for (String item : items) {
            if (item.trim().startsWith("filename")) {
                String fileName = item.substring(item.indexOf("=") + 1).trim().replace("\"", "");
                // 处理Windows路径（比如IE返回C:\xxx\test.txt，只取文件名）
                return fileName.substring(fileName.lastIndexOf(File.separator) + 1);
            }
        }
        return "unknown_file";
    }

    /**
     * 获取客户端真实IP，依次从X-Real-IP、X-Forwarded-For请求头解析，最后降级getRemoteAddr()
     */
    public static String getRealClientIp(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }
        // 1. 先从X-Real-IP请求头获取
        String realIp = request.getHeader("X-Real-IP");
        if (StringUtils.isNotEmpty(realIp) && !"unknown".equalsIgnoreCase(realIp)) {
            return realIp;
        }
        // 2. 再从X-Forwarded-For请求头获取（多个IP时取第一个）
        realIp = request.getHeader("X-Forwarded-For");
        if (StringUtils.isNotEmpty(realIp) && !"unknown".equalsIgnoreCase(realIp)) {
            // X-Forwarded-For格式：clientIp, proxy1Ip, proxy2Ip
            int index = realIp.indexOf(",");
            return index > 0 ? realIp.substring(0, index) : realIp;
        }
        // 3. 最后降级使用getRemoteAddr()
        return request.getRemoteAddr();
    }
}
