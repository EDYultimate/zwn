package cn.lonwin.module.agent.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.utils.UUIDUtils;
import cn.lonwin.module.agent.entity.AgentConfigLogEntity;
import cn.lonwin.module.agent.mapper.AgentConfigLogMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 配置变更流水：页面上的每一次保存 / 恢复默认 / 一键还原都写一条 AGENT_CONFIG_LOG。
 *
 * <p>「每次修改都落库」有两层含义，这里都覆盖：
 * <ol>
 *   <li>配置本身立即写入 AGENT_TOOL_META / AGENT_UI_CAPABILITY（由两个 DbStore 完成，写入失败直接报错）；</li>
 *   <li>变更动作本身留痕，便于追溯「谁在什么时候把哪条描述改成了什么」。</li>
 * </ol>
 *
 * <p>数据访问按 lonwin-module-water 的风格：Service 注入 Mapper，SQL 在
 * resources/mapper/AgentConfigLogMapper.xml。流水是辅助信息，写入失败只告警，
 * 绝不阻断配置保存主流程。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AgentConfigAuditService {

    private final AgentConfigLogMapper configLogMapper;
    private final ObjectMapper objectMapper;

    /**
     * @param type    TOOL / UI / RESTORE
     * @param key     工具名 / 页面路由 / ALL
     * @param action  UPDATE / RESET / OVERRIDE / REMOVE / RESTORE
     * @param payload 本次写入的完整内容（可空）
     */
    public void record(String type, String key, String action, Object payload) {
        try {
            AgentConfigLogEntity entity = new AgentConfigLogEntity();
            entity.setId(UUIDUtils.generateUUID());
            entity.setCfgType(type);
            entity.setCfgKey(key);
            entity.setAction(action);
            entity.setPayload(payload == null ? "" : objectMapper.writeValueAsString(payload));
            entity.setOperator(currentUser());
            configLogMapper.insertLog(entity);
        } catch (Exception e) {
            log.warn("[agent-config] 变更流水写入失败（不影响本次配置保存）：{}", e.getMessage());
        }
    }

    /** 当前操作人：开发态 auth.mode=none 时是模拟用户，取不到则记 system */
    public static String currentUser() {
        LoginUserDTO user = UserContext.get();
        return user != null && StringUtils.hasText(user.getUserCode()) ? user.getUserCode() : "system";
    }
}
