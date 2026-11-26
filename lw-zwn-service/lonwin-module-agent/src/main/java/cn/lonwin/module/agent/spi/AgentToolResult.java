package cn.lonwin.module.agent.spi;

import java.util.List;
import java.util.Map;

import cn.lonwin.module.agent.model.vo.AgentActionVO;
import lombok.Builder;
import lombok.Data;

/**
 * 工具执行结果。
 *
 * <p>包含三部分：
 * <ul>
 *   <li>{@code data}：结构化数据，会以 JSON 形式喂给大模型用于组织回答；</li>
 *   <li>{@code summary}：一句话摘要，模型懒得看 data 时也能直接引用；</li>
 *   <li>{@code actions}：回答下方要展示的跳转按钮（由业务方给出，避免模型编造路由）。</li>
 * </ul>
 */
@Data
@Builder(toBuilder = true)
public class AgentToolResult {

    /** 是否执行成功 */
    private boolean success;

    /** 结构化数据（喂给模型） */
    private Map<String, Object> data;

    /** 一句话摘要（喂给模型） */
    private String summary;

    /** 跳转按钮，可为空 */
    private List<AgentActionVO> actions;

    /** 失败原因，success=false 时使用 */
    private String errorMessage;

    public static AgentToolResult ok(Map<String, Object> data, String summary) {
        return AgentToolResult.builder()
                .success(true)
                .data(data)
                .summary(summary)
                .build();
    }

    public static AgentToolResult ok(Map<String, Object> data, String summary, List<AgentActionVO> actions) {
        return AgentToolResult.builder()
                .success(true)
                .data(data)
                .summary(summary)
                .actions(actions)
                .build();
    }

    public static AgentToolResult fail(String errorMessage) {
        return AgentToolResult.builder()
                .success(false)
                .errorMessage(errorMessage)
                .build();
    }
}
