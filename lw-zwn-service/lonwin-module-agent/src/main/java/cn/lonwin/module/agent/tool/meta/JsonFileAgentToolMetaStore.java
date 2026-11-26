package cn.lonwin.module.agent.tool.meta;

import java.io.IOException;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.config.AgentProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 基于 JSON 文件的元数据存储（默认实现）。
 *
 * <p>选它而不是直接上数据库的原因：智能问答模块只依赖 common / framework，
 * 不引入 Mapper 与建表脚本就能落地「运行期可改描述」；内网单机部署时运维也能直接看文件、
 * 用 Git 管理变更。等平台有配置中心或确实需要多人协同审计，再换实现即可（见 {@link AgentToolMetaStore}）。
 *
 * <p>写入采用「临时文件 + 原子替换」，避免进程被杀时留下半个 JSON 把配置弄坏。
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "lonwin.agent.tools", name = "meta-store",
        havingValue = "file")
public class JsonFileAgentToolMetaStore implements AgentToolMetaStore {

    private final AgentProperties properties;
    private final ObjectMapper objectMapper;

    @Override
    public synchronized Map<String, AgentToolMeta> loadAll() {
        Path file = path();
        if (!Files.exists(file)) {
            return Map.of();
        }
        try {
            List<AgentToolMeta> list = objectMapper.readValue(Files.readAllBytes(file),
                    new TypeReference<List<AgentToolMeta>>() { });
            Map<String, AgentToolMeta> result = new LinkedHashMap<>();
            for (AgentToolMeta meta : list) {
                if (meta != null && StringUtils.hasText(meta.getName())) {
                    result.put(meta.getName().trim(), meta);
                }
            }
            return result;
        } catch (IOException e) {
            // 配置写坏不能拖垮应用启动：按「无覆盖」处理并留下明确错误日志
            log.error("[agent-tool] 工具元数据文件解析失败，本次按注解默认值运行，请修复：{}", file, e);
            return Map.of();
        }
    }

    @Override
    public synchronized void save(AgentToolMeta meta) {
        Map<String, AgentToolMeta> all = new LinkedHashMap<>(loadAll());
        all.put(meta.getName(), meta);
        writeAll(all.values());
        log.info("[agent-tool] 工具元数据已保存：{} → {}", meta.getName(), path());
    }

    @Override
    public synchronized boolean remove(String name) {
        Map<String, AgentToolMeta> all = new LinkedHashMap<>(loadAll());
        if (all.remove(name) == null) {
            return false;
        }
        writeAll(all.values());
        log.info("[agent-tool] 工具元数据已删除（恢复注解默认值）：{}", name);
        return true;
    }

    @Override
    public String location() {
        return path().toString();
    }

    private Path path() {
        return Paths.get(properties.getTools().getMetaFile()).toAbsolutePath().normalize();
    }

    /** 按工具名排序后整体重写，保证文件 diff 稳定、便于人工评审 */
    private void writeAll(java.util.Collection<AgentToolMeta> metas) {
        Path file = path();
        List<AgentToolMeta> sorted = new ArrayList<>(metas);
        sorted.sort(Comparator.comparing(AgentToolMeta::getName));
        try {
            Path dir = file.getParent();
            if (dir != null) {
                Files.createDirectories(dir);
            }
            Path tmp = Files.createTempFile(dir, "agent-tool-meta", ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(tmp.toFile(), sorted);
            try {
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException e) {
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new BusinessException(500, "工具元数据写入失败：" + e.getMessage());
        }
    }
}
