package cn.lonwin.module.agent.tool;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.stereotype.Component;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.spi.AgentToolProvider;
import cn.lonwin.module.agent.tool.meta.AgentToolMetaService;
import lombok.extern.slf4j.Slf4j;

/**
 * 工具注册表：把「注解工具 + SPI 工具」变成可对外服务的不可变快照。
 *
 * <h3>为什么是快照 + 整体替换，而不是增量修改</h3>
 * 工具定义是模型提示词的一部分，多线程同时读写一份可变 Map 会出现「一半新一半旧」的提示词，
 * 模型行为将变得不可复现。这里每次变更都构建一个完整的新快照再原子替换，读侧无锁、行为一致。
 *
 * <h3>刷新时机</h3>
 * <ul>
 *   <li>启动：构造期构建（注解写错直接启动失败）；</li>
 *   <li>运行期：管理端改了工具描述/启停后调用 {@link #refresh()}，<b>无需重启</b>，
 *       下一次提问即生效（提示词是按快照拼接的）。</li>
 * </ul>
 *
 * <h3>新增工具不需要改本类</h3>
 * 工具来源有两处，注册表只负责合并覆盖、去重、限额与提示词渲染：
 * <ol>
 *   <li><b>能力清单</b>：{@code feignclient} 包下带
 *       {@link cn.lonwin.module.agent.annotation.AgentToolContract} 的接口 +
 *       {@code feignclient.impl} 下按约定命名的实现类，由 {@link AgentToolContractRegistrar}
 *       自动注册。新增一个业务域 = 加契约文件 + 实现文件，<b>本类与其它代码零改动</b>；</li>
 *   <li><b>SPI</b>：{@link AgentToolProvider}，从容器收集（历史扩展方式）。</li>
 * </ol>
 */
@Slf4j
@Component
public class AgentToolRegistry {

    /** 知识侧通道在工具契约里的唯一工具名，通道开关据此过滤 */
    public static final String KNOWLEDGE_TOOL = "kb.search";

    private final AgentToolContracts toolContracts;
    private final ListableBeanFactory beanFactory;
    private final List<AgentToolProvider> legacyProviders;
    private final AgentToolDefinitionFactory factory;
    private final AgentToolMetaService metaService;
    private final AgentProperties properties;

    /** 快照版本号，仅用于日志与排查「改动是否生效」 */
    private final AtomicInteger versionSeq = new AtomicInteger();

    private volatile Snapshot snapshot;

    public AgentToolRegistry(AgentToolContracts toolContracts,
                             ListableBeanFactory beanFactory,
                             List<AgentToolProvider> legacyProviders,
                             AgentToolDefinitionFactory factory,
                             AgentToolMetaService metaService,
                             AgentProperties properties) {
        this.toolContracts = toolContracts;
        this.beanFactory = beanFactory;
        this.legacyProviders = legacyProviders;
        this.factory = factory;
        this.metaService = metaService;
        this.properties = properties;
        this.snapshot = build();
        log.info("[agent] 工具注册完成 v{}，通道[工具侧={}, 知识侧={}]，共 {} 个：{}",
                snapshot.version(), properties.getTools().isEnabled(),
                properties.getKnowledge().isEnabled(), snapshot.tools().size(), snapshot.tools().keySet());
    }

    /**
     * 重建并原子替换快照（工具描述、示例、参数说明、启停状态变更后调用）。
     *
     * @return 新快照
     * @throws IllegalStateException 校验失败（重名、超上限）时抛出，旧快照继续可用
     */
    public synchronized Snapshot refresh() {
        Snapshot previous = this.snapshot;
        Snapshot current = build();
        this.snapshot = current;
        log.info("[agent] 工具注册表已刷新 v{} → v{}，共 {} 个：{}",
                previous.version(), current.version(), current.tools().size(), current.tools().keySet());
        return current;
    }

    private Snapshot build() {
        List<AgentToolDefinition> baseline = new ArrayList<>();

        // 能力清单：@AgentToolContract 契约 + feignclient.impl 下的实现。
        // 新增业务域能力时只加这两个文件，本类与其它代码都不用动。
        List<AgentToolContracts.Contract> contracts =
                toolContracts == null ? List.of() : toolContracts.all();
        for (AgentToolContracts.Contract contract : contracts) {
            Object bean = beanFactory.getBean(contract.beanName());
            baseline.addAll(factory.build(contract.apiInterface(), bean));
        }

        legacyProviders.forEach(provider -> baseline.add(factory.fromProvider(provider)));

        // 双通道开关：过滤放在最前面，被关闭的通道既不进提示词清单，也无法被 find() 命中。
        // 这样「只有工具侧接口」时把 knowledge.enabled 置 false 即可，
        // 即使 BGE-M3 / Qdrant 没启动，模型也看不到 kb.search，不会尝试调用它。
        boolean toolsOn = properties.getTools().isEnabled();
        boolean knowledgeOn = properties.getKnowledge().isEnabled();
        baseline.removeIf(definition -> !channelEnabled(definition.getName(), toolsOn, knowledgeOn));

        // 按工具名排序：getMethods() 顺序由 JVM 决定，排序后提示词在不同环境/重启间保持一致，
        // 便于对比模型效果，也便于提示词缓存命中
        baseline.sort(Comparator.comparing(AgentToolDefinition::getName));

        Set<String> baselineNames = new LinkedHashSet<>();
        Map<String, AgentToolDefinition> baselineTools = new LinkedHashMap<>();
        for (AgentToolDefinition definition : baseline) {
            if (!baselineNames.add(definition.getName())) {
                throw new IllegalStateException("工具名重复：" + definition.getName() + "（注解工具与 SPI 工具不能同名）");
            }
            baselineTools.put(definition.getName(), definition);
        }

        // 应用管理端覆盖（文案 / 参数说明 / 启停）
        List<AgentToolDefinition> effective = metaService.apply(baseline);

        Map<String, AgentToolDefinition> registered = new LinkedHashMap<>();
        effective.forEach(definition -> registered.put(definition.getName(), definition));

        int maxTools = properties.getTools().getMaxTools();
        if (maxTools > 0 && registered.size() > maxTools) {
            // 工具过多会稀释模型注意力、撑大提示词；宁可启动失败，也不要线上悄悄变笨
            throw new IllegalStateException("已注册工具 " + registered.size() + " 个，超过上限 lonwin.agent.tools.max-tools="
                    + maxTools + "，请清理低价值工具或调大上限");
        }

        StringBuilder prompt = new StringBuilder();
        List<Map<String, Object>> openAiTools = new ArrayList<>();
        for (AgentToolDefinition definition : registered.values()) {
            prompt.append(definition.toPromptText());
            openAiTools.add(definition.toOpenAiTool());
        }

        return new Snapshot(Collections.unmodifiableMap(registered), Collections.unmodifiableMap(baselineTools),
                Collections.unmodifiableSet(baselineNames), prompt.toString(),
                Collections.unmodifiableList(openAiTools), versionSeq.incrementAndGet());
    }

    /**
     * 工具属于哪条通道：只有 {@code kb.search} 归知识侧，其余（业务数据接口与 ui.locate）归工具侧。
     * 将来若新增知识侧工具，在此按 category 或名称前缀扩展即可，编排层不用改。
     */
    private static boolean channelEnabled(String toolName, boolean toolsOn, boolean knowledgeOn) {
        return KNOWLEDGE_TOOL.equals(toolName) ? knowledgeOn : toolsOn;
    }

    public Optional<AgentToolDefinition> find(String toolName) {
        return Optional.ofNullable(snapshot.tools().get(toolName));
    }

    public Collection<AgentToolDefinition> all() {
        return snapshot.tools().values();
    }

    /** 代码里声明过的全部工具名（含被管理端停用的），用于管理接口校验 */
    public Set<String> baselineNames() {
        return snapshot.baselineNames();
    }

    /** 代码里声明过的全部原始定义（含被停用的），仅供管理接口展示「停用后长什么样」 */
    public Map<String, AgentToolDefinition> baselineTools() {
        return snapshot.baseline();
    }

    public boolean isEmpty() {
        return snapshot.tools().isEmpty();
    }

    public int size() {
        return snapshot.tools().size();
    }

    public int version() {
        return snapshot.version();
    }

    /** 生成提示词里的工具清单（已预渲染，避免每次提问重复拼接） */
    public String describeAll() {
        return snapshot.promptText();
    }

    /**
     * 按业务模块生成 OpenAI 原生工具清单：只包含该模块的工具 + 全局工具
     * （{@code module} 为空的工具），作为请求体的 {@code tools} 数组下发。
     *
     * <p>这是「前端模块 ↔ 后端能力对应」的核心：某个模块的智能体发起问答时，
     * 只给它本模块的工具，避免全量工具稀释模型注意力。
     * 找不到任何本模块工具时退回全量，保证模型不会因为裁剪而彻底无工具可用。
     */
    public List<Map<String, Object>> openAiTools(String module) {
        return filteredTools(module, false);
    }

    /**
     * 只读工具子集：用于「零证据防线」下的强制取数（{@code tool_choice=required}）。
     *
     * <p>强制调用会逼模型必须选一个工具，若把写操作（新增 / 删除）一起放进去，
     * 模型完全可能为了满足约束去挑一个写接口——这是必须在源头掐掉的风险。
     * 因此强制轮只开放 {@code readOnly=true} 的工具。
     *
     * @return 只读工具；该模块没有只读工具时退回全部（宁可放弃强制，也不能给出非法约束）
     */
    public List<Map<String, Object>> readOnlyTools(String module) {
        List<Map<String, Object>> readOnly = filteredTools(module, true);
        return readOnly.isEmpty() ? openAiTools(module) : readOnly;
    }

    /**
     * 按模块（可选只读）过滤出 OpenAI 工具数组。
     *
     * <p>清单为空必须喊出来：空清单意味着模型本轮没有任何取数能力，
     * 面对「许可水量总共多少」只能凭记忆编一个数字，而日志里不留痕迹时极难排查。
     */
    private List<Map<String, Object>> filteredTools(String module, boolean readOnlyOnly) {
        List<Map<String, Object>> tools = new ArrayList<>();
        boolean matched = false;
        for (AgentToolDefinition definition : snapshot.tools().values()) {
            if (readOnlyOnly && !definition.isReadOnly()) {
                continue;
            }
            String m = definition.getModule();
            if (module == null || module.isBlank() || m == null || m.isBlank() || module.equals(m)) {
                tools.add(definition.toOpenAiTool());
                matched = true;
            }
        }
        if (!matched) {
            log.warn("[agent] 模块 {} 没有匹配的工具（只读={}，注册表共 {} 个）："
                    + "模型本轮无法取数，数据类问题只能凭记忆作答。"
                    + "请检查 tools.enabled、管理端是否停用、module 是否与前端一致",
                    module, readOnlyOnly, snapshot.tools().size());
            // 不退回全量：退回等于把其他模块的工具泄漏给指定智能体，
            // 与「按智能体约定能力范围」直接冲突；宁可本轮无工具，让编排层的
            // 零证据防线拦住编造的数字。
            return List.of();
        }
        return List.copyOf(tools);
    }

    /**
     * 注册表快照：不可变，可安全地被请求线程读取。
     *
     * @param tools         生效工具（已应用覆盖、已过滤停用）
     * @param baseline      注解/SPI 生成的原始定义（含被停用的工具）
     * @param baselineNames 代码中声明的全部工具名（含停用）
     * @param promptText    预渲染的人读文本（管理端与日志）
     * @param openAiTools   预渲染的 OpenAI tools 数组（请求体直接使用）
     * @param version       版本号
     */
    public record Snapshot(Map<String, AgentToolDefinition> tools, Map<String, AgentToolDefinition> baseline,
                           Set<String> baselineNames, String promptText,
                           List<Map<String, Object>> openAiTools, int version) {
    }
}
