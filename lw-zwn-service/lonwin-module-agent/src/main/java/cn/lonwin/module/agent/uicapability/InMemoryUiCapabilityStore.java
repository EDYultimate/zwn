package cn.lonwin.module.agent.uicapability;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * 能力声明的内存缓存实现（{@code lonwin.agent.ui-capability.store=memory} 时启用）。
 *
 * <p>结构：{@code client → (route → 声明)}，两层都是 ConcurrentHashMap，
 * 写走整体替换（replaceAll 幂等），读无锁。迁移数据库时按接口语义落表即可：
 * client / route / version 天然是唯一键与乐观锁字段。
 *
 * <p>注意：本实现重启即清空，而前端只在页面挂载时上报，
 * 生产/开发默认走 {@link FileUiCapabilityStore}。
 */
@Component
@ConditionalOnProperty(prefix = "lonwin.agent.ui-capability", name = "store", havingValue = "memory")
public class InMemoryUiCapabilityStore implements UiCapabilityStore {

    /** client → (route → 声明) */
    private final Map<String, Map<String, UiPageCapability>> cache = new ConcurrentHashMap<>();

    @Override
    public void merge(String client, List<UiPageCapability> capabilities) {
        Map<String, UiPageCapability> byRoute =
                cache.computeIfAbsent(client, key -> new ConcurrentHashMap<>());
        for (UiPageCapability capability : capabilities) {
            byRoute.put(capability.getRoute(), capability);
        }
    }

    @Override
    public void replaceAll(String client, List<UiPageCapability> capabilities) {
        Map<String, UiPageCapability> byRoute = new ConcurrentHashMap<>();
        for (UiPageCapability capability : capabilities) {
            byRoute.put(capability.getRoute(), capability);
        }
        cache.put(client, byRoute);
    }

    @Override
    public void clear(String client) {
        cache.remove(client);
    }

    @Override
    public List<UiPageCapability> findByClient(String client) {
        Map<String, UiPageCapability> byRoute = cache.get(client);
        return byRoute == null ? List.of() : List.copyOf(byRoute.values());
    }

    @Override
    public List<UiPageCapability> findAll() {
        List<UiPageCapability> all = new ArrayList<>();
        cache.values().forEach(byRoute -> all.addAll(byRoute.values()));
        return all;
    }

    @Override
    public Optional<UiPageCapability> findByRoute(String route) {
        return cache.values().stream()
                .map(byRoute -> byRoute.get(route))
                .filter(java.util.Objects::nonNull)
                .findFirst();
    }
}
