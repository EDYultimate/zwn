package cn.lonwin.framework.log.service;

import cn.lonwin.common.core.utils.StringUtils;
import cn.lonwin.framework.log.entity.LogEntity;
import cn.lonwin.framework.security.token.powers.PowerSysUtil;
import cn.lonwin.framework.security.token.powers.PowersProperties;
import com.alibaba.fastjson2.JSONObject;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 操作日志异步同步服务，把操作日志推送到权限系统。
 * 使用守护线程的调度线程池异步执行，不阻塞业务请求。
 */
@Component
public class LogSyncService {

    private static final Logger log = LoggerFactory.getLogger(LogSyncService.class);

    /** 异步同步延迟（毫秒） */
    private static final long SYNC_DELAY_MILLIS = 10;

    /** 同步接口路径 */
    private static final String SYNC_LOG_PATH = "syncLog";

    private final PowersProperties powersProperties;

    /** 日志同步专用调度线程池（守护线程，不阻碍应用关闭） */
    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(
            2, new CustomizableThreadFactory("log-sync-"));

    public LogSyncService(PowersProperties powersProperties) {
        this.powersProperties = powersProperties;
    }

    /**
     * 异步同步操作日志到权限系统。
     *
     * @param operLog 操作日志信息
     */
    public void syncLogAsync(LogEntity operLog) {
        executor.schedule(() -> {
            try {
                doSync(operLog);
            } catch (Exception e) {
                log.error("操作日志同步异常: {}", e.getMessage());
            }
        }, SYNC_DELAY_MILLIS, TimeUnit.MILLISECONDS);
    }

    /**
     * 同步操作日志到权限系统，接口与登录鉴权使用同一套账号体系。
     */
    private void doSync(LogEntity operLog) {
        String url = StringUtils.stripEnd(powersProperties.getSyncLogUrl(), "/") + "/" + SYNC_LOG_PATH;
        Map<String, Object> param = new HashMap<>();
        param.put("account", powersProperties.getAccount());
        param.put("data", operLog);

        String result = PowerSysUtil.getResultPost(url, new JSONObject(param), null);
        if (StringUtils.isEmpty(result)) {
            log.warn("操作日志同步失败（无返回结果）：{}", operLog.getName());
        }
    }

    /**
     * 应用关闭时释放线程池。
     */
    @PreDestroy
    public void shutdown() {
        executor.shutdown();
    }
}
