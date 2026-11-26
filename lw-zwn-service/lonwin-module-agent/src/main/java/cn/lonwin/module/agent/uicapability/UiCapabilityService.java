package cn.lonwin.module.agent.uicapability;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.model.vo.AgentUiEventVO;
import cn.lonwin.module.agent.model.vo.UiCapabilityConfigVO;
import cn.lonwin.module.agent.service.AgentConfigAuditService;
import cn.lonwin.module.agent.support.ActUrlAuthority;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

/**
 * 能力声明的业务门面：上报校验、target 索引、事件白名单校验、提示词渲染。
 *
 * <p>设计要点：
 * <ul>
 *   <li><b>target 全局索引</b>：上报后重建「target → 归属声明」的不可变快照（volatile 整体替换），
 *       事件校验 O(1)；跨页面重名 target 先到先得并告警，避免模型指令落到错误页面；</li>
 *   <li><b>事件白名单</b>：模型输出的 UI 事件必须通过 {@link #validate} 才会下发——
 *       target 不存在、参数缺失、枚举越界、未知参数一律丢弃并告警，
 *       这是「模型只做选择题不做填空题」防幻觉防注入的关键一道闸；</li>
 *   <li><b>提示词渲染</b>：能力清单转成模型可读的文本段，随 system prompt 下发。</li>
 * </ul>
 */
@Slf4j
@Service
public class UiCapabilityService {

    /**
     * 页面清单进 prompt 的字符上限。
     *
     * <p>清单由前端上报，页数与锚点数不受后端控制；一旦上千行，光这一节就能把
     * 单次请求顶到模型上下文上限（平台 32000 token）。超过就整页跳过并提示改用
     * {@code ui.locate} 检索——定位是服务端匹配，不依赖模型记住整份清单。
     */
    private static final int PROMPT_MAX_CHARS = 12000;

    /**
     * 页面动作的引用编号区间：正文里的 {@code [[1]]}~{@code [[9]]} 指向 {@code refs[].id}。
     *
     * <p>10 是故意留出的编号空隙，11 起才是知识库依据的 {@code kbRefs[].cite}，
     * 两边共用同一套 {@code [[n]]} 编号空间，前端按区间分派点击行为。
     * 越界的编号必须在白名单这一层拦掉：落在 10 或 11 段落的页面动作，前端既不会跳页面
     * 也不会打开文档，用户点上去就是死角标；而 {@code alignCitations} 只按编号是否存在
     * 判断标记有效性，越界编号会被它当成合法引用保留下来，从这里漏过去就再也拦不住了。
     */
    private static final int CITE_MIN = 1;

    private static final int CITE_MAX = 9;

    private final UiCapabilityStore store;

    /**
     * 功能权限判定（可为 null：单元测试与内部调用不注入）。
     *
     * <p>能力声明是「系统有哪些页面」，但用户能用的是「我能进哪些页面」——两者不是一回事。
     * 不过滤的直接后果是：模型会把没权限的页面写进提示词、把点不动的按钮下发给用户，
     * 用户点击后被路由守卫拦住，看起来像「智能体给错了链接」。
     */
    private final ActUrlAuthority actUrlAuthority;

    /** target → 归属声明（不可变快照） */
    private volatile Map<String, TargetRef> targetIndex = Map.of();

    /** 最近一次写入时间（毫秒），仅用于指纹接口的排查展示 */
    private volatile long updatedAt = 0L;

    /** 单元测试/内部调用用：不做权限过滤 */
    public UiCapabilityService(UiCapabilityStore store) {
        this(store, null);
    }

    @Autowired
    public UiCapabilityService(UiCapabilityStore store, ActUrlAuthority actUrlAuthority) {
        this.store = store;
        this.actUrlAuthority = actUrlAuthority;
    }

    /**
     * 启动时用存储里的存量声明重建 target 索引。
     *
     * <p>不能省：{@code targetIndex} 只在 save/clear 时重建，而 {@link UiCapabilityStore}
     * 会在启动时从文件恢复清单。两者一错位就会出现「提示词里有清单、事件校验却全是未注册」——
     * 模型照着清单给的 target 被逐个丢弃，回答里写着「点击下方按钮」却没有按钮（真实踩过的坑）。
     */
    @PostConstruct
    void init() {
        rebuildIndex();
        if (targetIndex.isEmpty()) {
            log.info("[agent] 启动时无页面能力声明，等待前端上报");
        } else {
            log.info("[agent] 已按存量声明重建索引：{} 个页面、{} 个可引导 target",
                    all().size(), targetIndex.size());
        }
    }

    /**
     * 上报校验并保存，返回保存的页面数。
     *
     * @param full true = 全量上报（整体替换该上报方的全部页面，可下线下掉的页面）；
     *             false = 增量上报（只覆盖本次出现的 route，其它页面保留）
     */
    public synchronized int save(List<UiPageCapability> capabilities, String client, boolean full) {
        if (capabilities == null) {
            capabilities = List.of();
        }
        for (UiPageCapability capability : capabilities) {
            if (!StringUtils.hasText(capability.getRoute())) {
                throw new IllegalArgumentException("能力声明缺少 route");
            }
            if (!StringUtils.hasText(capability.getTitle())) {
                capability.setTitle(capability.getRoute());
            }
            if (!StringUtils.hasText(capability.getClient())) {
                capability.setClient(client);
            }
        }
        String clientKey = StringUtils.hasText(client) ? client : "web";
        if (full) {
            store.replaceAll(clientKey, capabilities);
        } else {
            store.merge(clientKey, capabilities);
        }
        rebuildIndex();
        updatedAt = System.currentTimeMillis();
        log.info("[agent] 已接收能力声明：client={}，本次 {} 个页面（{}），当前共 {} 个页面、{} 个可引导 target",
                clientKey, capabilities.size(), full ? "全量" : "增量",
                store.findAll().size(), targetIndex.size());
        return capabilities.size();
    }

    /** 增量上报：只覆盖本次出现的 route */
    public int save(List<UiPageCapability> capabilities, String client) {
        return save(capabilities, client, false);
    }

    /** 全量能力声明（含当前用户无权限的页面，仅用于同步/指纹/运维排查） */
    public List<UiPageCapability> all() {
        return store.findAll();
    }

    /**
     * 当前用户可见的能力声明：按 {@code requiredActUrl} 与 actList 求交集。
     *
     * <p>提示词渲染、位置检索、事件校验三处<b>必须</b>统一用它，
     * 否则会出现「提示词里没有这个页面、检索却命中、校验又放行」的错位。
     *
     * <p>无法判定权限时（非 POWERS 模式 / 取不到 token / 未注入判定器）返回全集，
     * 详见 {@link ActUrlAuthority#canFilter()}。
     */
    public List<UiPageCapability> allVisible() {
        List<UiPageCapability> pages = all();
        if (!filterEnabled() || pages.isEmpty()) {
            return pages;
        }
        List<UiPageCapability> visible = new ArrayList<>(pages.size());
        for (UiPageCapability page : pages) {
            if (visible(page)) {
                visible.add(page);
            }
        }
        return visible;
    }

    /** 某页面当前用户是否可用 */
    public boolean visible(UiPageCapability page) {
        return page != null && permitted(page.getRequiredActUrl());
    }

    /** 当前是否在做权限过滤（关掉时提示词与校验都退化为全量） */
    public boolean filterEnabled() {
        return actUrlAuthority != null && actUrlAuthority.canFilter();
    }

    private boolean permitted(String requiredActUrl) {
        if (!StringUtils.hasText(requiredActUrl)) {
            return true;
        }
        if (!filterEnabled()) {
            return true;
        }
        return actUrlAuthority.ownsAny(requiredActUrl);
    }

    /** 弹框/命令自身没写权限时继承页面权限，避免「页面有权限、里面按钮没登记」被误放行 */
    private String resolveActUrl(String itemActUrl, UiPageCapability page) {
        return StringUtils.hasText(itemActUrl) ? itemActUrl : page.getRequiredActUrl();
    }

    /** 清空某上报方（版本回退 / 页面下线） */
    public synchronized void clear(String client) {
        store.clear(client);
        rebuildIndex();
        updatedAt = System.currentTimeMillis();
        log.info("[agent] 已清空能力声明：client={}", client);
    }

    // ==================== 在线配置（配置页 / 一键还原） ====================

    /**
     * 非 db 存储没有「代码基线 + 人工覆盖」两层结构，配置页必须给出明确提示，
     * 不能出现「点了保存提示成功、下次同步又被代码冲掉」的假象。
     */
    private UiCapabilityAdminStore admin() {
        if (store instanceof UiCapabilityAdminStore adminStore) {
            return adminStore;
        }
        throw new BusinessException(500,
                "当前能力声明存储不支持在线配置，请将 lonwin.agent.ui-capability.store 设为 db");
    }

    /** 配置页列表：代码默认值、当前生效值、是否被人工改过 */
    public List<UiCapabilityConfigVO> configs() {
        return admin().rows().stream()
                .sorted(Comparator.comparing(UiCapabilityRow::route))
                .map(row -> UiCapabilityConfigVO.builder()
                        .client(row.client())
                        .route(row.route())
                        .baseline(row.baseline())
                        .effective(row.effective())
                        .overridden(row.overridden())
                        .updatedBy(row.updatedBy())
                        .updatedAt(row.updatedAt())
                        .build())
                .toList();
    }

    /**
     * 保存配置页的人工修改（立即落库、立即重建提示词与事件白名单索引）。
     *
     * <p>只允许改「给模型看的文案」：route / version / 权限 URL / target / 参数类型等契约字段
     * 一律以代码基线为准，防止配置出「提示词里有、页面上点不动」的按钮。
     */
    public synchronized UiCapabilityConfigVO saveOverride(UiPageCapability page, String client) {
        if (page == null || !StringUtils.hasText(page.getRoute())) {
            throw new BusinessException(400, "能力声明缺少 route");
        }
        String clientKey = StringUtils.hasText(client) ? client : "web";
        UiCapabilityAdminStore adminStore = admin();
        UiCapabilityRow existing = adminStore.row(clientKey, page.getRoute());
        UiPageCapability baseline = existing == null ? null : existing.baseline();
        if (baseline == null) {
            throw new BusinessException(400,
                    "代码中尚未声明该页面（请先在前端打开一次系统，让能力声明完成上报）：" + page.getRoute());
        }
        UiPageCapability normalized = normalizeOverride(page, baseline, clientKey);
        adminStore.saveOverride(clientKey, normalized, AgentConfigAuditService.currentUser());
        // 提示词清单和事件白名单用的都是 all()（生效值），改完必须重建索引
        rebuildIndex();
        updatedAt = System.currentTimeMillis();
        log.info("[agent] 页面能力人工配置已生效：{}（client={}）", page.getRoute(), clientKey);
        return configs().stream()
                .filter(vo -> clientKey.equals(vo.getClient()) && page.getRoute().equals(vo.getRoute()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(500, "配置保存后读取失败：" + page.getRoute()));
    }

    /** 恢复单个页面为代码默认 */
    public synchronized boolean removeOverride(String client, String route) {
        boolean removed = admin().removeOverride(StringUtils.hasText(client) ? client : "web", route);
        if (removed) {
            rebuildIndex();
            updatedAt = System.currentTimeMillis();
        }
        return removed;
    }

    /** 一键还原：清空全部页面的人工配置，运行时回到代码默认声明 */
    public synchronized int clearOverrides() {
        int count = admin().clearOverrides();
        rebuildIndex();
        updatedAt = System.currentTimeMillis();
        log.info("[agent] 一键还原完成：{} 个页面的人工能力配置已清除", count);
        return count;
    }

    /** 代码默认声明（已落库的 BASELINE_JSON），供配置页对照与还原后核对 */
    public List<UiPageCapability> baseline(String client) {
        return admin().baseline(StringUtils.hasText(client) ? client : "web");
    }

    /**
     * 以代码基线为骨架合成人工配置：只把允许编辑的文案覆盖进去。
     * target 集合必须与代码一致——业务页 exposeAgentContext / data-anchor 是按代码里的
     * target 注册的，允许页面增删改 target 就等于允许配置出点不动的按钮。
     */
    private UiPageCapability normalizeOverride(UiPageCapability page, UiPageCapability baseline,
                                               String client) {
        assertSameTargets("高亮元素",
                targets(baseline.getAnchors(), UiPageCapability.Anchor::getTarget),
                targets(page.getAnchors(), UiPageCapability.Anchor::getTarget));
        assertSameTargets("弹框",
                targets(baseline.getDialogs(), UiPageCapability.Dialog::getTarget),
                targets(page.getDialogs(), UiPageCapability.Dialog::getTarget));
        assertSameTargets("命令",
                targets(baseline.getCommands(), UiPageCapability.Command::getTarget),
                targets(page.getCommands(), UiPageCapability.Command::getTarget));

        UiPageCapability result = new UiPageCapability();
        result.setClient(client);
        result.setModule(baseline.getModule());
        result.setRoute(baseline.getRoute());
        result.setVersion(baseline.getVersion());
        result.setTitle(StringUtils.hasText(page.getTitle()) ? page.getTitle().trim() : baseline.getTitle());
        // 权限 URL 属于审批过的契约，不允许在页面上改（与工具元数据「权限只读」一致）
        result.setRequiredActUrl(baseline.getRequiredActUrl());
        result.setAnchors(copyAnchors(baseline, page));
        result.setDialogs(copyDialogs(baseline, page));
        result.setCommands(copyCommands(baseline, page));
        return result;
    }

    private <T> Set<String> targets(List<T> items, Function<T, String> extractor) {
        Set<String> result = new LinkedHashSet<>();
        if (items != null) {
            items.forEach(item -> result.add(String.valueOf(extractor.apply(item))));
        }
        return result;
    }

    private void assertSameTargets(String label, Set<String> baseline, Set<String> incoming) {
        if (!baseline.equals(incoming)) {
            throw new BusinessException(400, label
                    + " 的 target 必须与代码声明一致（不能新增 / 删除 / 改名）：代码="
                    + baseline + "，页面=" + incoming);
        }
    }

    private List<UiPageCapability.Anchor> copyAnchors(UiPageCapability baseline, UiPageCapability page) {
        Map<String, String> descByTarget = new LinkedHashMap<>();
        if (page.getAnchors() != null) {
            page.getAnchors().forEach(item -> descByTarget.put(item.getTarget(), item.getDesc()));
        }
        List<UiPageCapability.Anchor> result = new ArrayList<>();
        if (baseline.getAnchors() != null) {
            for (UiPageCapability.Anchor item : baseline.getAnchors()) {
                UiPageCapability.Anchor copy = new UiPageCapability.Anchor();
                copy.setTarget(item.getTarget());
                copy.setDesc(StringUtils.hasText(descByTarget.get(item.getTarget()))
                        ? descByTarget.get(item.getTarget()).trim() : item.getDesc());
                result.add(copy);
            }
        }
        return result;
    }

    private List<UiPageCapability.Dialog> copyDialogs(UiPageCapability baseline, UiPageCapability page) {
        Map<String, UiPageCapability.Dialog> byTarget = new LinkedHashMap<>();
        if (page.getDialogs() != null) {
            page.getDialogs().forEach(item -> byTarget.put(item.getTarget(), item));
        }
        List<UiPageCapability.Dialog> result = new ArrayList<>();
        if (baseline.getDialogs() != null) {
            for (UiPageCapability.Dialog item : baseline.getDialogs()) {
                UiPageCapability.Dialog incoming = byTarget.get(item.getTarget());
                UiPageCapability.Dialog copy = new UiPageCapability.Dialog();
                copy.setTarget(item.getTarget());
                copy.setDesc(incoming != null && StringUtils.hasText(incoming.getDesc())
                        ? incoming.getDesc().trim() : item.getDesc());
                copy.setRequiredActUrl(item.getRequiredActUrl());
                copy.setParams(copyParams(item.getParams(), incoming == null ? null : incoming.getParams()));
                result.add(copy);
            }
        }
        return result;
    }

    private List<UiPageCapability.Command> copyCommands(UiPageCapability baseline, UiPageCapability page) {
        Map<String, UiPageCapability.Command> byTarget = new LinkedHashMap<>();
        if (page.getCommands() != null) {
            page.getCommands().forEach(item -> byTarget.put(item.getTarget(), item));
        }
        List<UiPageCapability.Command> result = new ArrayList<>();
        if (baseline.getCommands() != null) {
            for (UiPageCapability.Command item : baseline.getCommands()) {
                UiPageCapability.Command incoming = byTarget.get(item.getTarget());
                UiPageCapability.Command copy = new UiPageCapability.Command();
                copy.setTarget(item.getTarget());
                copy.setDesc(incoming != null && StringUtils.hasText(incoming.getDesc())
                        ? incoming.getDesc().trim() : item.getDesc());
                copy.setRequiredActUrl(item.getRequiredActUrl());
                copy.setParams(copyParams(item.getParams(), incoming == null ? null : incoming.getParams()));
                result.add(copy);
            }
        }
        return result;
    }

    /** 参数只覆盖 desc；name / type / required / enums 由代码决定，避免校验与实现脱节 */
    private List<UiPageCapability.Param> copyParams(List<UiPageCapability.Param> baselineParams,
                                                    List<UiPageCapability.Param> pageParams) {
        Map<String, String> descByName = new LinkedHashMap<>();
        if (pageParams != null) {
            pageParams.forEach(item -> descByName.put(item.getName(), item.getDesc()));
        }
        List<UiPageCapability.Param> result = new ArrayList<>();
        if (baselineParams != null) {
            for (UiPageCapability.Param item : baselineParams) {
                UiPageCapability.Param copy = new UiPageCapability.Param();
                copy.setName(item.getName());
                copy.setDesc(StringUtils.hasText(descByName.get(item.getName()))
                        ? descByName.get(item.getName()).trim() : item.getDesc());
                copy.setRequired(item.getRequired());
                copy.setType(item.getType());
                copy.setEnums(item.getEnums());
                result.add(copy);
            }
        }
        return result;
    }

    // ==================== 指纹（前端增量同步用） ====================

    /**
     * 能力清单指纹：前端用它判断「本地声明」与「服务端缓存」是否一致。
     *
     * <p>存在的意义是让「定时同步」变得便宜——没有指纹时，定时同步只能盲目重发全量声明，
     * 多标签页 + 多用户的场景下会产生大量无意义的写（每次都会重建索引、落盘）。
     * 有了指纹，定时任务发一个几十字节的 GET，内容一致就直接跳过。
     */
    public record Fingerprint(String client, int pageCount, String digest, long updatedAt) { }

    /** 查询某上报方（缺省全部）的当前指纹 */
    public Fingerprint fingerprint(String client) {
        List<UiPageCapability> pages = StringUtils.hasText(client) ? store.findByClient(client) : store.findAll();
        return new Fingerprint(client, pages == null ? 0 : pages.size(), digest(pages), updatedAt);
    }

    /**
     * 摘要算法：{@code route@version} 按 route 升序用换行拼接后取 FNV-1a（32 位，十六进制）。
     *
     * <p>刻意不用 SHA-256：前端要能同步计算，而 {@code crypto.subtle} 只在安全上下文（https/localhost）可用，
     * 内网 http 部署会直接不可用。FNV-1a 十几行、两端结果一致，用途只是「内容有没有变」的比对，
     * 不需要抗碰撞强度。
     */
    public static String digest(List<UiPageCapability> pages) {
        if (pages == null || pages.isEmpty()) {
            return "0";
        }
        List<UiPageCapability> sorted = new ArrayList<>(pages);
        // 与前端保持一致的排序：按 route 的 UTF-16 code unit 升序（路由均为 ASCII）
        sorted.sort((a, b) -> String.valueOf(a.getRoute()).compareTo(String.valueOf(b.getRoute())));
        StringBuilder text = new StringBuilder();
        for (UiPageCapability page : sorted) {
            text.append(page.getRoute()).append('@').append(page.getVersion()).append('\n');
        }
        int hash = 0x811c9dc5;
        for (int i = 0; i < text.length(); i++) {
            hash ^= text.charAt(i);
            hash *= 0x01000193;
        }
        return String.format("%08x", hash);
    }

    /**
     * 校验并过滤模型输出的 UI 事件：白名单 + 权限 + 参数契约三重校验，非法事件丢弃并告警。
     *
     * <p>不带 module 的重载等价于通用问答（不做模块校验），兼容既有调用方；
     * 业务智能体会话必须用 {@link #validateWithReasons(List, String)}，否则模型
     * 编造的其他模块页面事件会漏进下发列表。
     *
     * @return 通过校验的事件（顺序保持）
     */
    public List<AgentUiEventVO> validate(List<AgentUiEventVO> events) {
        return validateWithReasons(events, null).events();
    }

    /**
     * 带拒绝原因的校验：供编排层把「为什么被丢掉」回给模型做一次纠正。
     *
     * <p>只有「丢弃」没有「说明」时，模型不知道 target 不存在还是参数错了，
     * 下一轮往往原样再犯；把原因带回去，纠正成功率明显高。
     */
    public Validation validateWithReasons(List<AgentUiEventVO> events) {
        return validateWithReasons(events, null);
    }

    /**
     * 带模块约束的校验：在白名单 + 权限 + 参数契约之上，再校验事件指向的页面
     * 是否属于「当前智能体可见的页面范围」（module 匹配或页面 module 为空）。
     *
     * <p>这是 module 裁剪闭环的最后一道闸：提示词清单、ui.locate 检索都已按
     * module 收窄，但模型仍可能凭历史记忆编出其他模块的 target——不在这里拦，
     * 指定智能体就会把用户引导到它不该管的页面。
     */
    public Validation validateWithReasons(List<AgentUiEventVO> events, String module) {
        if (events == null || events.isEmpty()) {
            return new Validation(List.of(), List.of());
        }
        List<AgentUiEventVO> valid = new ArrayList<>();
        List<String> rejects = new ArrayList<>();
        for (AgentUiEventVO event : events) {
            String error = check(event, module);
            if (error != null) {
                log.warn("[agent] 丢弃非法 UI 事件：{}（{}）", event, error);
                rejects.add(event.getType() + ":" + event.getTarget() + " → " + error);
                continue;
            }
            valid.add(event);
        }
        return new Validation(valid, rejects);
    }

    /** 校验结果：通过的事件 + 被拒绝的原因（逐条） */
    public record Validation(List<AgentUiEventVO> events, List<String> rejects) { }

    /**
     * 生成 system prompt 中的「页面能力清单」段落。
     *
     * @param module 业务模块标识：非空时只保留「该模块 + 公共（module 为空）」的页面，
     *               与工具清单的 {@code openAiTools(module)} 保持同一条裁剪规则。
     *               该模块没有任何页面声明时<b>不退回全量</b>——退回等于把其他智能体
     *               的页面泄漏给指定智能体，与「按智能体约定页面范围」直接冲突；
     *               此时返回明确的「本模块无页面能力」提示段。
     */
    public String describeForPrompt(String module) {
        List<UiPageCapability> capabilities = allVisible();
        if (capabilities.isEmpty()) {
            if (!all().isEmpty()) {
                // 清单有内容、但当前账号一个页面都进不去：这是权限问题，不能说「正在加载」
                return """
                        （当前账号没有可引导的页面功能权限，无法提供跳转/高亮按钮。
                        此时 events 必须为空数组；用户要求跳转页面或打开弹框时，
                        如实说明「当前账号没有该功能的访问权限，请联系管理员配置」，不要编造页面地址。）
                        """.trim();
            }
            // 措辞很关键：这里只是「后端还没收到清单」，不代表系统没有这些页面。
            // 说成「系统未接入 XX 页面」会让用户以为功能被砍了，实际只是前端没上报。
            return """
                    （本次未收到前端页面能力清单，暂时无法提供跳转/高亮按钮。
                    此时 events 必须为空数组；用户要求跳转页面或打开弹框时，
                    回答「页面引导能力正在加载，请稍后重试」，不要声称系统没有该页面，也不要编造页面地址。）
                    """.trim();
        }
        if (StringUtils.hasText(module)) {
            capabilities = scopedVisible(capabilities, module);
            if (capabilities.isEmpty()) {
                return """
                        （本业务模块暂未登记可引导的前端页面，无法提供跳转/高亮按钮。
                        此时 events 必须为空数组；用户要求跳转页面或打开弹框时，
                        如实说明「该智能体暂未接入页面引导能力」，不要引导到其他业务的页面，也不要编造页面地址。）
                        """.trim();
            }
        }
        StringBuilder text = new StringBuilder();
        int skipped = 0;
        for (UiPageCapability capability : capabilities) {
            // 按页粒度截断：宁可少列几页，也不要把整次问答顶到上下文上限
            if (text.length() >= PROMPT_MAX_CHARS) {
                skipped++;
                continue;
            }
            text.append("【页面 ").append(capability.getRoute())
                    .append("（").append(capability.getTitle()).append("）】\n");
            for (UiPageCapability.Dialog dialog : capability.getDialogs()) {
                if (!permitted(resolveActUrl(dialog.getRequiredActUrl(), capability))) {
                    continue;
                }
                text.append("- 打开弹框 ").append(dialog.getTarget()).append("：").append(dialog.getDesc());
                text.append(paramText(dialog.getParams())).append('\n');
            }
            for (UiPageCapability.Command command : capability.getCommands()) {
                if (!permitted(resolveActUrl(command.getRequiredActUrl(), capability))) {
                    continue;
                }
                text.append("- 触发命令 ").append(command.getTarget()).append("：").append(command.getDesc());
                text.append(paramText(command.getParams())).append('\n');
            }
            for (UiPageCapability.Anchor anchor : capability.getAnchors()) {
                text.append("- 高亮元素 ").append(anchor.getTarget()).append("：").append(anchor.getDesc()).append('\n');
            }
        }
        if (skipped > 0) {
            text.append("（另有 ").append(skipped).append(" 个页面因清单过长未列出。")
                    .append("用户问到这些页面时调用 ui.locate 工具检索，不要凭猜测给出路由或 target。）\n");
        }
        return text.toString();
    }

    // ==================== 内部实现 ====================

    /**
     * module 裁剪的唯一规则：请求 module 为空（通用问答）→ 全可见；
     * 页面 module 为空（公共页面）→ 任何智能体可见；否则必须相等。
     *
     * <p>提示词渲染（{@link #describeForPrompt}）、位置检索（{@code UiCapabilityLocator}）、
     * 事件白名单（{@link #check}）三处必须走同一条规则，任何一处单独放宽都会
     * 造成「清单里没有、检索却命中、校验又放行」的错位。
     */
    static boolean moduleVisible(String pageModule, String module) {
        if (!StringUtils.hasText(module) || !StringUtils.hasText(pageModule)) {
            return true;
        }
        return module.equals(pageModule);
    }

    /** 按模块过滤可见页面（保持原顺序），供检索与提示词渲染共用 */
    public List<UiPageCapability> scopedVisible(String module) {
        return scopedVisible(allVisible(), module);
    }

    private List<UiPageCapability> scopedVisible(List<UiPageCapability> pages, String module) {
        if (!StringUtils.hasText(module)) {
            return pages;
        }
        List<UiPageCapability> scoped = new ArrayList<>(pages.size());
        for (UiPageCapability page : pages) {
            if (moduleVisible(page.getModule(), module)) {
                scoped.add(page);
            }
        }
        return scoped;
    }

    /** 事件校验：返回 null 表示通过，否则返回拒绝原因；module 非空时追加模块一致性校验 */
    private String check(AgentUiEventVO event, String module) {
        if (event == null || !StringUtils.hasText(event.getType()) || !StringUtils.hasText(event.getTarget())) {
            return "缺少 type 或 target";
        }
        // 编号越界不拦，正文角标就会指向前端分派不到的空档：这里必须比「target 是否存在」更早判定，
        // 越界的条目即便 target 合法也不能下发
        if (event.getCite() != null && (event.getCite() < CITE_MIN || event.getCite() > CITE_MAX)) {
            return "引用编号越界：页面动作只能用 " + CITE_MIN + "~" + CITE_MAX;
        }
        TargetRef ref = targetIndex.get(event.getTarget());

        switch (event.getType()) {
            case AgentUiEventVO.TYPE_NAVIGATE -> {
                // NAVIGATE 的 target 就是页面路由本身
                UiPageCapability page = store.findByRoute(event.getTarget()).orElse(null);
                if (page == null) {
                    return "路由未在能力声明中注册";
                }
                if (!visible(page)) {
                    return "当前用户无权访问该页面";
                }
                if (!moduleVisible(page.getModule(), module)) {
                    return "页面不属于当前智能体的模块范围（" + module + "）";
                }
                return null;
            }
            case AgentUiEventVO.TYPE_SPOTLIGHT -> {
                if (ref == null || !"anchor".equals(ref.kind())) {
                    return "高亮 target 未注册";
                }
                if (!permitted(ref.requiredActUrl())) {
                    return "当前用户无权访问该页面";
                }
                if (!moduleVisible(ref.capability().getModule(), module)) {
                    return "元素不属于当前智能体的模块范围（" + module + "）";
                }
                return null;
            }
            case AgentUiEventVO.TYPE_DIALOG, AgentUiEventVO.TYPE_COMMAND -> {
                if (ref == null) {
                    return "target 未注册";
                }
                if (AgentUiEventVO.TYPE_DIALOG.equals(event.getType()) && !"dialog".equals(ref.kind())) {
                    return "target 不是弹框";
                }
                if (AgentUiEventVO.TYPE_COMMAND.equals(event.getType()) && !"command".equals(ref.kind())) {
                    return "target 不是命令";
                }
                if (!permitted(ref.requiredActUrl())) {
                    return "当前用户无权使用该操作";
                }
                if (!moduleVisible(ref.capability().getModule(), module)) {
                    return "操作不属于当前智能体的模块范围（" + module + "）";
                }
                return checkParams(ref, event.getArgs());
            }
            default -> {
                return "未知事件类型：" + event.getType();
            }
        }
    }

    /** 参数契约校验：必填齐全、无未知键、枚举越界拦截 */
    private String checkParams(TargetRef ref, Map<String, Object> args) {
        List<UiPageCapability.Param> params = ref.params();
        Map<String, UiPageCapability.Param> byName = new LinkedHashMap<>();
        params.forEach(p -> byName.put(p.getName(), p));

        if (args != null) {
            for (String key : args.keySet()) {
                if (!byName.containsKey(key)) {
                    return "未知参数：" + key;
                }
            }
        }
        for (UiPageCapability.Param param : params) {
            Object value = args == null ? null : args.get(param.getName());
            boolean required = Boolean.TRUE.equals(param.getRequired());
            if (value == null || !StringUtils.hasText(String.valueOf(value))) {
                if (required) {
                    return "缺少必填参数：" + param.getName();
                }
                continue;
            }
            if (param.getEnums() != null && !param.getEnums().isEmpty()
                    && !param.getEnums().contains(String.valueOf(value))) {
                return "参数 " + param.getName() + " 只能取 " + param.getEnums() + " 之一";
            }
        }
        return null;
    }

    private String paramText(List<UiPageCapability.Param> params) {
        if (params == null || params.isEmpty()) {
            return "";
        }
        StringBuilder text = new StringBuilder(" 参数: ");
        List<String> parts = new ArrayList<>();
        for (UiPageCapability.Param param : params) {
            StringBuilder part = new StringBuilder(param.getName());
            if (Boolean.TRUE.equals(param.getRequired())) {
                part.append("(必填");
            } else {
                part.append("(选填");
            }
            if (param.getEnums() != null && !param.getEnums().isEmpty()) {
                part.append(", 只能取: ").append(String.join("|", param.getEnums()));
            }
            part.append(")");
            // 参数说明必须带上：枚举改成码值后，只写「只能取 1|0」模型无法把「已发证」映射到 1，
            // 语义只能由前端上报的 desc 提供（如「1=已发证，0=准予未发」）
            if (StringUtils.hasText(param.getDesc())) {
                part.append("：").append(param.getDesc());
            }
            parts.add(part.toString());
        }
        text.append(String.join(", ", parts));
        return text.toString();
    }

    /** 重建 target 索引（save/clear 后调用） */
    private void rebuildIndex() {
        Map<String, TargetRef> index = new LinkedHashMap<>();
        for (UiPageCapability capability : all()) {
            for (UiPageCapability.Anchor anchor : capability.getAnchors()) {
                indexIfAbsent(index, anchor.getTarget(),
                        new TargetRef(capability, "anchor", List.of(), capability.getRequiredActUrl()));
            }
            for (UiPageCapability.Dialog dialog : capability.getDialogs()) {
                indexIfAbsent(index, dialog.getTarget(), new TargetRef(capability, "dialog",
                        dialog.getParams() == null ? List.of() : dialog.getParams(),
                        resolveActUrl(dialog.getRequiredActUrl(), capability)));
            }
            for (UiPageCapability.Command command : capability.getCommands()) {
                indexIfAbsent(index, command.getTarget(), new TargetRef(capability, "command",
                        command.getParams() == null ? List.of() : command.getParams(),
                        resolveActUrl(command.getRequiredActUrl(), capability)));
            }
        }
        this.targetIndex = Map.copyOf(index);
    }

    /** 重名 target 先到先得：后上报的页面告警（两页共用同名弹框属于设计问题，应改名） */
    private void indexIfAbsent(Map<String, TargetRef> index, String target, TargetRef ref) {
        TargetRef previous = index.putIfAbsent(target, ref);
        if (previous != null && previous.capability() != ref.capability()) {
            log.warn("[agent] 能力 target 重名：{} 同时属于 {} 与 {}，保留先上报者",
                    target, previous.capability().getRoute(), ref.capability().getRoute());
        }
    }

    /** target 归属信息 */
    private record TargetRef(UiPageCapability capability, String kind, List<UiPageCapability.Param> params,
                             String requiredActUrl) { }

    /** 供事件校验外部复用（预留） */
    public Optional<UiPageCapability> findByRoute(String route) {
        return store.findByRoute(route);
    }
}
