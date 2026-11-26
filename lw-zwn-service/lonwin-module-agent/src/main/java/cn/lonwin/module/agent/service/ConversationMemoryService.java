package cn.lonwin.module.agent.service;

import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

import org.springframework.stereotype.Service;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.model.vo.AgentMessageVO;
import lombok.RequiredArgsConstructor;

/**
 * 会话记忆（多轮对话的基础）。
 *
 * <p>当前为内存实现，服务重启即清空。若需持久化，另写一个实现并替换本类注入即可，
 * 上层 {@link AgentChatService} 只依赖本类的方法签名。
 */
@Service
@RequiredArgsConstructor
public class ConversationMemoryService {

    private final AgentProperties properties;

    /** sessionId -> 该会话最近若干条消息 */
    private final Map<String, Deque<AgentMessageVO>> store = new ConcurrentHashMap<>();

    /** 读取会话历史（副本，避免外部修改内部状态） */
    public List<AgentMessageVO> history(String sessionId) {
        Deque<AgentMessageVO> deque = store.get(sessionId);
        return deque == null ? new ArrayList<>() : new ArrayList<>(deque);
    }

    /** 追加一条消息，超出上限时丢弃最早的消息 */
    public void append(String sessionId, String role, String content) {
        Deque<AgentMessageVO> deque = store.computeIfAbsent(sessionId, key -> new ConcurrentLinkedDeque<>());
        deque.addLast(AgentMessageVO.builder()
                .role(role)
                .content(content)
                .timestamp(System.currentTimeMillis())
                .build());

        int maxMessages = Math.max(2, properties.getMemory().getMaxMessages());
        while (deque.size() > maxMessages) {
            deque.pollFirst();
        }
    }

    public void clear(String sessionId) {
        store.remove(sessionId);
    }

    /** 转成模型接口所需的 messages 结构 */
    public List<Map<String, Object>> toModelMessages(List<AgentMessageVO> history) {
        List<Map<String, Object>> messages = new ArrayList<>(history.size());
        history.forEach(item -> messages.add(Map.of(
                "role", item.getRole(),
                "content", item.getContent())));
        return messages;
    }
}
