package cn.lonwin.module.agent.uicapability;

import java.io.IOException;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.agent.config.AgentProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 能力声明的文件持久化实现（默认实现）。
 *
 * <p>为什么默认用文件而不是纯内存：能力声明是<b>前端页面的静态配置</b>，
 * 只有前端挂载时才会重新上报。若只存内存，后端一重启清单就为空，
 * 而前端那侧还记着「已上报过」，于是不会补报——模型随之认为「系统没有这些页面」，
 * 所有跳转/高亮按钮全部消失。持久化到文件后重启即可恢复，不依赖前端是否刷过页面。
 *
 * <p>结构与内存实现一致：{@code client → (route → 声明)}，
 * 写操作整体替换 + 落盘（临时文件 + 原子移动，避免半截文件）。
 * 迁移数据库时替换为 Db 实现即可，上层零改动。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "lonwin.agent.ui-capability", name = "store",
        havingValue = "file")
public class FileUiCapabilityStore implements UiCapabilityStore {

    private static final TypeReference<Map<String, List<UiPageCapability>>> FILE_TYPE =
            new TypeReference<>() { };

    private final ObjectMapper objectMapper;
    private final AgentProperties properties;

    /** client → (route → 声明) */
    private final Map<String, Map<String, UiPageCapability>> cache = new ConcurrentHashMap<>();

    private Path file;

    @PostConstruct
    void load() {
        String configured = properties.getUiCapability().getFile();
        if (!StringUtils.hasText(configured)) {
            log.info("[agent] 未配置能力声明文件路径，能力声明仅保存在内存");
            return;
        }
        this.file = Paths.get(configured).toAbsolutePath().normalize();
        if (!Files.exists(file)) {
            log.info("[agent] 能力声明文件不存在，首次启动不加载：{}", file);
            return;
        }
        try {
            Map<String, List<UiPageCapability>> loaded =
                    objectMapper.readValue(file.toFile(), FILE_TYPE);
            loaded.forEach((client, pages) -> {
                Map<String, UiPageCapability> byRoute = new ConcurrentHashMap<>();
                pages.forEach(page -> {
                    if (StringUtils.hasText(page.getRoute())) {
                        byRoute.put(page.getRoute(), page);
                    }
                });
                if (!byRoute.isEmpty()) {
                    cache.put(client, byRoute);
                }
            });
            log.info("[agent] 已从文件恢复能力声明：{} 个上报方，{} 个页面",
                    cache.size(), cache.values().stream().mapToInt(Map::size).sum());
        } catch (Exception e) {
            // 文件损坏不应阻塞启动：清空缓存等前端重新上报
            log.warn("[agent] 能力声明文件解析失败，本次按空清单启动：{}（{}）", file, e.getMessage());
        }
    }

    @Override
    public synchronized void merge(String client, List<UiPageCapability> capabilities) {
        Map<String, UiPageCapability> byRoute =
                cache.computeIfAbsent(client, key -> new ConcurrentHashMap<>());
        for (UiPageCapability capability : capabilities) {
            byRoute.put(capability.getRoute(), capability);
        }
        persist();
    }

    @Override
    public synchronized void replaceAll(String client, List<UiPageCapability> capabilities) {
        Map<String, UiPageCapability> byRoute = new ConcurrentHashMap<>();
        for (UiPageCapability capability : capabilities) {
            byRoute.put(capability.getRoute(), capability);
        }
        cache.put(client, byRoute);
        persist();
    }

    @Override
    public synchronized void clear(String client) {
        cache.remove(client);
        persist();
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

    /** 落盘失败只告警：能力声明是辅助信息，不能因为它让上报接口失败 */
    private void persist() {
        if (file == null) {
            return;
        }
        Map<String, List<UiPageCapability>> snapshot = new LinkedHashMap<>();
        cache.forEach((client, byRoute) -> snapshot.put(client, List.copyOf(byRoute.values())));
        try {
            if (file.getParent() != null) {
                Files.createDirectories(file.getParent());
            }
            Path tmp = file.resolveSibling(file.getFileName() + ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(tmp.toFile(), snapshot);
            try {
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException e) {
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            log.warn("[agent] 能力声明落盘失败：{}（{}）", file, e.getMessage());
        }
    }
}
