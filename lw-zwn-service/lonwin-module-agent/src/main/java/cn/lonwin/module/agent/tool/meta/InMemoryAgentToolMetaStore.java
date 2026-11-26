package cn.lonwin.module.agent.tool.meta;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 内存版元数据存储：{@code lonwin.agent.tools.meta-store=memory} 时启用。
 *
 * <p>适用场景：容器只读文件系统、演示环境、单元测试。
 * 代价是重启后恢复为注解默认值——需要持久化就用默认的 file 实现。
 */
@Slf4j
@Component
@ConditionalOnProperty(prefix = "lonwin.agent.tools", name = "meta-store", havingValue = "memory")
public class InMemoryAgentToolMetaStore implements AgentToolMetaStore {

    private final Map<String, AgentToolMeta> store = new ConcurrentHashMap<>();

    @Override
    public Map<String, AgentToolMeta> loadAll() {
        return Map.copyOf(store);
    }

    @Override
    public void save(AgentToolMeta meta) {
        store.put(meta.getName(), meta);
        log.info("[agent-tool] 工具元数据已保存（仅内存，重启失效）：{}", meta.getName());
    }

    @Override
    public boolean remove(String name) {
        return store.remove(name) != null;
    }

    @Override
    public String location() {
        return "memory";
    }
}
