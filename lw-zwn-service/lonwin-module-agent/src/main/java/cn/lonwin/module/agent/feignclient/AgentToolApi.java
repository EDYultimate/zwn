package cn.lonwin.module.agent.feignclient;

import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolContract;
import cn.lonwin.module.agent.annotation.AgentToolParam;
import cn.lonwin.module.agent.annotation.AgentToolReturn;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.tool.AgentToolContext;

/**
 * 【平台能力】页面定位、知识检索与结果数据处理的工具契约（与具体业务模块无关）。
 *
 * <h3>目录约定</h3>
 * <pre>
 * feignclient/AgentToolApi.java          ← 契约（本文件）
 * feignclient/impl/AgentToolApiImpl.java ← 实现
 * </pre>
 *
 * <h3>业务能力放哪里</h3>
 * 不要往本文件加业务接口。业务能力请新建一个 {@code @AgentToolContract} 契约
 * + {@code feignclient.impl} 下的实现（参考 {@link WaterCertToolApi}），
 * 注册表会自动发现，本文件与 {@code tool} 包都不用动。
 *
 * <h3>能力清单三段式</h3>
 * <ul>
 *   <li>{@code @AgentTool.description}：接口功能与边界；</li>
 *   <li>{@code @AgentToolParam}：入参（名 / 类型 / 说明 / 枚举），映射为 JSON Schema；</li>
 *   <li>{@code @AgentToolReturn}：返回字段逐条含义，拼进 function description。</li>
 * </ul>
 * 何时调用由模型结合任务自主判断。
 *
 * <h3>方法签名约定</h3>
 * <ul>
 *   <li>只声明业务参数；不出现 unitCode / deptCode 这类权限参数——由数据权限切面统一处理；</li>
 *   <li>参数一律是扁平的可序列化类型（String / Integer / Boolean / BigDecimal）；</li>
 *   <li>确实需要会话或用户信息时，把 {@link AgentToolContext} 作为第一个参数（框架注入，模型不可见）。</li>
 * </ul>
 */
@AgentToolContract
public interface AgentToolApi {

    @AgentTool(
            name = "ui.locate",
            title = "页面位置检索",
            category = "common",
            unitScoped = false,
            description = "在系统已上报的前端页面能力中检索某个功能、数据或弹框「在哪个页面、页面上的什么位置」。"
                    + "用户问「XX 在系统哪里看」「XX 在哪个页面」时使用；"
                    + "用户只问「系统里有哪些页面」而不指定对象时，不传 keyword，返回页面导航总览。"
                    + "检索范围自动限定为当前智能体可见的页面（业务智能体会话只见本模块与公共页面，"
                    + "通用问答见全部）。"
                    + "查不到时会明确返回无匹配，此时必须如实告知用户「系统中没有匹配的页面」，"
                    + "禁止编造页面地址或功能。")
    @AgentToolReturn(field = "matched", description = "是否命中页面能力")
    @AgentToolReturn(field = "events", description = "命中的页面事件列表：type=NAVIGATE/SPOTLIGHT/DIALOG/COMMAND，"
            + "target 是页面能力键（写进回答的 refs），label 是可读名称，args 是事件参数")
    AgentToolResult locateUi(
            AgentToolContext ctx,
            @AgentToolParam(description = "要定位的内容，取用户关心的名词，多个用顿号或逗号分隔。"
                    + "用户没指定具体对象（如「提供在系统中的位置」）时不要传，服务端返回页面导航总览",
                    example = "许可水量、预警明细、视频监控") String keyword);

    /**
     * 知识侧通道的唯一入口：把向量库检索注册成普通工具。
     *
     * <p>模型在多轮编排里自主决定要不要查文档，复合问题可在同一轮先后调用
     * 数据工具与知识工具，权限、流式、结果合并、引用对账全部复用既有链路。
     *
     * <p>是否注册由 {@code lonwin.agent.knowledge.enabled} 控制；
     * 关闭时 {@code AgentToolRegistry} 不会把它放进工具清单，模型看不到也调不到。
     */
    @AgentTool(
            name = "kb.search",
            title = "知识库文档检索",
            category = "knowledge",
            unitScoped = false,
            description = "在已入库的制度、预案、办法、图书与表格文档中检索原文片段。"
                    + "用于「规定是什么」「依据哪一条」「编制目的」「职责分工」「文档里怎么写的」"
                    + "以及需要引用原文出处的表格数据；也可与数据工具一起调用，用文档解释口径与依据。"
                    + "注意：这里给的是文档记载（可能滞后），实时业务数字必须用数据工具查。")
    @AgentToolReturn(field = "matches", description = "命中的原文片段列表：n 是片段编号（引用时用 [[n]]），"
            + "docType 是文档类型，file 是文件名，path 是章节路径，content 是原文")
    AgentToolResult searchKnowledge(
            @AgentToolParam(description = "检索问题或核心名词，尽量保留用户原话中的专业表述，不要自行改写",
                    required = true, example = "防洪抢险组织机构职责") String query,
            @AgentToolParam(description = "需要返回的原文片段数，1~10；问题较宽泛时取大值",
                    example = "5", min = 1, max = 10) Integer topK,
            @AgentToolParam(description = "文档类型筛选，如「预案」「制度」；不确定时不要传",
                    example = "预案") String docType,
            @AgentToolParam(description = "章节关键词筛选，如「总则」「组织机构」；不确定时不要传",
                    example = "总则") String section);

    /**
     * 明细分片续取：配合 {@code AgentResultPager}，让模型在「全量取数、分片投喂」下按需拿后续明细。
     *
     * <p>列表类工具不再截断数据，但一次把几百行塞进上下文会超预算，
     * 编排层因此只投喂第一片，并在结果里给出 {@code rowsPaged/rowsCursor/rowsTotal/hasMore}。
     * 模型需要更多明细时调用本工具续取——数据始终完整，只是分批给。
     *
     * <p>注意：本工具只用于明细<b>展示</b>；统计（合计 / 分组 / 排名）一律改用
     * {@code agent.result.stat} 在服务端精确计算，不要对分片逐条累加。
     */
    @AgentTool(
            name = "agent.result.more",
            title = "明细分片续取",
            category = "common",
            unitScoped = false,
            description = "当某个查询工具的结果里出现 rowsPaged=true 时，说明明细被分片投喂，rows 只给了第一片。"
                    + "本工具按 cursor 取后续片：cursor 取自上一结果的 rowsCursor，page 从 2 开始。"
                    + "仅在用户明确需要「更多明细 / 剩下还有哪些」时调用；"
                    + "要做合计、分组、排名等统计时改用 agent.result.stat，禁止累加明细分片。")
    @AgentToolReturn(field = "rows", description = "本片明细（字段与原工具返回一致）")
    @AgentToolReturn(field = "page", description = "本片段码")
    @AgentToolReturn(field = "total", description = "全量明细总条数")
    @AgentToolReturn(field = "hasMore", description = "是否还有后续片")
    AgentToolResult moreResult(
            AgentToolContext ctx,
            @AgentToolParam(description = "分片游标，取自上一工具结果的 rowsCursor", required = true,
                    example = "a1b2c3d4e5f6") String cursor,
            @AgentToolParam(description = "页码，从 1 开始；续取时从 2 开始（第 1 片已在上一结果里）",
                    example = "2", min = 1, max = 1000) Integer page);

    /**
     * 通用数据聚合：<b>一个工具覆盖所有统计问法</b>。
     *
     * <p>为什么不提供按口径定制的统计接口：问法无限（各河流水量、各监管单位张数、
     * 地下水占比、水量排名……），每个口径一个接口永远覆盖不全，换个问法就查不到。
     * 这里把「怎么算」交给模型（按哪个字段分组、聚合哪个字段、用什么算法），
     * 「算」由服务端在缓存的全量明细上用 Java 精确完成——口径灵活、数值精确、上下文不超窗。
     *
     * <p>典型用法：先用列表工具查出全量明细（rows 被分片投喂时拿 rowsCursor），
     * 再用本工具做统计。模型不碰逐行累加——LLM 心算不可靠，是准确率的头号敌人。
     */
    @AgentTool(
            name = "agent.result.stat",
            title = "明细数据聚合统计",
            category = "common",
            unitScoped = false,
            description = "对某次查询的全量明细做精确统计：计数、求和、平均、最大最小、分组聚合、占比与排名的基础数据。"
                    + "cursor 取自列表工具结果里的 rowsCursor（rowsPaged=true 时会出现）。"
                    + "用法：不传 groupBy 只算总体；传 groupBy 按该字段分组统计；"
                    + "metric 指定要聚合的数值字段，不传时只做计数（count）。"
                    + "问「一共多少条 / 合计多少 / 各 XX 分别多少 / 平均 / 最大 / 排名 / 占比」时，"
                    + "查完明细后用本工具取数，再组织回答；禁止自己对明细逐行心算。")
    @AgentToolReturn(field = "groups", description = "分组统计结果（传 groupBy 时返回）：每组 {key=分组值, count=条数, "
            + "以及按 metric+aggs 计算出的字段，如 amtSum=许可水量合计、amtAvg=平均}")
    @AgentToolReturn(field = "total", description = "参与统计的全量行数")
    @AgentToolReturn(field = "overall", description = "总体统计（不传 groupBy 时返回）：count=行数，"
            + "以及按 metric+aggs 计算出的字段")
    AgentToolResult statResult(
            AgentToolContext ctx,
            @AgentToolParam(description = "数据游标，取自列表工具结果里的 rowsCursor", required = true,
                    example = "a1b2c3d4e5f6") String cursor,
            @AgentToolParam(description = "分组字段名（原工具返回 rows 里的字段，如 river / org / src）；"
                    + "不传表示只算总体", example = "river") String groupBy,
            @AgentToolParam(description = "要聚合的数值字段名（如 amt）；不传表示只做计数",
                    example = "amt") String metric,
            @AgentToolParam(description = "聚合算法，多个用逗号分隔：sum 求和 / count 计数 / avg 平均 / "
                    + "max 最大 / min 最小；不传时默认 sum",
                    enums = {"sum", "count", "avg", "max", "min", "sum,count,avg,max,min"},
                    example = "sum") String aggs);
}
