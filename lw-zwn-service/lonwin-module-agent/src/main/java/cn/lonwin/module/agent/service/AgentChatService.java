package cn.lonwin.module.agent.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.module.agent.client.ModelReply;
import cn.lonwin.module.agent.client.QwenClient;
import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.datascope.DataScope;
import cn.lonwin.module.agent.datascope.DataScopeContext;
import cn.lonwin.module.agent.model.dto.AgentChatDTO;
import cn.lonwin.module.agent.model.vo.AgentActionVO;
import cn.lonwin.module.agent.model.vo.AgentAnswerDetailVO;
import cn.lonwin.module.agent.model.vo.AgentChatVO;
import cn.lonwin.module.agent.model.vo.AgentMessageVO;
import cn.lonwin.module.agent.model.vo.AgentUiEventVO;
import cn.lonwin.module.agent.model.vo.KbRefVO;
import cn.lonwin.module.agent.preprocess.QuestionNormalizer;
import cn.lonwin.module.agent.spi.AgentFacade;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.support.AgentToolPermissionChecker;
import cn.lonwin.module.agent.tool.AgentResultPager;
import cn.lonwin.module.agent.tool.AgentToolContext;
import cn.lonwin.module.agent.tool.AgentToolDefinition;
import cn.lonwin.module.agent.tool.AgentToolRegistry;
import cn.lonwin.module.agent.uicapability.UiCapabilityLocator;
import cn.lonwin.module.agent.uicapability.UiCapabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 智能问答编排层：模型自主多轮工具调用（原生 function calling）。
 *
 * <p>职责边界：只负责「组装上下文 → 转发模型与工具之间的往返 → 组织回答」，
 * 不替模型做决策。调哪个工具、调几轮、何时停止，全部由模型结合任务自主判断；
 * 服务端只保留四道安全闸：工具权限校验、输入预算闸、页面事件白名单、
 * 零证据防线（数据类问题不调工具就给数字时强制取数，仍不调则如实说明）。
 *
 * <p>一轮问答的消息序列：
 * <pre>
 * system(角色纪律 + 任务锚说明) + 裁剪后历史 + user(本轮问题)
 *      ↓ 循环（上限 maxToolRounds）
 * assistant.tool_calls  ← 模型自主发起
 * tool(结果 + 【当前任务】锚) × N
 *      ↓ 模型不再调工具 = 最终回答
 * </pre>
 *
 * <p>任务锚定：每条工具结果末尾附「【当前任务】{规范化后的用户问题}」，
 * 多轮取数时模型始终能看到初始问题，防止中途跑偏、答非所问。
 *
 * <p>数据权限：入口方法标注 {@link DataScope}，由切面统一建立单位上下文。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AgentChatService implements AgentFacade {

    private static final String ROLE_USER = "user";
    private static final String ROLE_ASSISTANT = "assistant";
    private static final String ROLE_SYSTEM = "system";
    private static final String ROLE_TOOL = "tool";

    /** 页面位置检索工具：命中结果由服务端生成事件，模型漏输出时用它兜底 */
    private static final String TOOL_UI_LOCATE = "ui.locate";

    /** 知识侧工具名：结果里带 kbRefs，需要与 UI 事件分开收集 */
    private static final String TOOL_KB_SEARCH = AgentToolRegistry.KNOWLEDGE_TOOL;

    /**
     * 知识引用编号起点：1~9 是页面动作（refs[].id），11 起是文档依据（kbRefs[].cite）。
     * 两者共用同一个 [[n]] 编号空间，由 alignCitations 一起校验，前端按编号分派点击行为。
     */
    private static final int KB_CITE_BASE = 11;

    /** 正文里的行内引用标记：[[1]]、[[12]]，编号对应 refs[].id 或 kbRefs[].cite */
    private static final Pattern CITE_MARKER = Pattern.compile("\\[\\[(\\d{1,2})]]");

    // ==================== 输入预算 ====================
    // 平台按「字符数 / 1.6」估算 token，且把「输入 + max_tokens」与模型窗口 32000 比较；
    // 只要超了就直接 40005，一次问答都拿不到。因此发送前必须先本地收口。

    /** 预留给估算误差与上游额外包装的 token */
    private static final int INPUT_TOKEN_MARGIN = 512;

    /** 历史消息进 prompt 的总字符预算：一条详细回答就上千字，只按条数限制挡不住 */
    private static final int HISTORY_MAX_CHARS = 5000;

    /** 单条历史回答的最大字符数：只保留结论开头，细节让模型重新查 */
    private static final int HISTORY_MESSAGE_MAX_CHARS = 800;

    /** 能力清单缺失时的固定答复：由前端自动同步后重试，不打扰用户理解业务 */
    private static final String STALE_ANSWER = "页面引导能力正在加载，请稍后重试一次。";

    /** 数据类问法的字面标记：用于识别「既要数字、又要位置」的混合问题 */
    private static final Pattern DATA_QUESTION = Pattern.compile(
            "多少|几个|几多|总量|合计|总共|累计|分别|同比|环比|排名|有哪些|是多少|统计|数值|明细数据");

    /** 答案里出现数字：配合数据类问法判断「这条回答是不是给出了量化结论」 */
    private static final Pattern DIGIT = Pattern.compile("\\d");

    /**
     * 零证据防线的强约束话术：模型对着数据类问题不调工具就直接报数字时，用它纠正一轮。
     *
     * <p>为什么必须有这道闸：提示词里已经写了「数字只能来自本轮工具返回」，
     * 但那是**软约束**——模型完全可以无视它，把记忆或猜测当作事实输出，
     * 而日志里只留下「一次模型调用、零次工具调用」，事后无从判断数字来自哪里。
     * 软约束无法验证是否被违反，等于没有约束；这里把它变成可执行的硬校验。
     */
    private static final String FORCE_EVIDENCE_PROMPT = """
            【系统校验】你上一条回答没有调用任何工具，但本问题在问具体数值 / 统计。
            服务端不会把未经接口核实的数字展示给用户，因此这条回答已被拦下。
            请立即调用只读查询工具取数：先按条件查列表拿到明细，再基于明细给出结论。
            如果现有工具确实查不到用户问的口径，就直接说明「当前系统未接入该数据」，
            不要估算、不要用相近口径顶替、不要凭记忆作答。
            """;

    /** 强制取数后模型仍然不调工具时的兜底回答：宁可答不出，也不能把编的数字交付出去 */
    private static final String NO_EVIDENCE_ANSWER = """
            本次未能从业务系统取到数据，因此无法给出该统计值。
            为避免展示未经接口核实的数字，这条回答已被系统拦截。
            请稍后重试；如果多次出现，可缩小查询范围（例如指定河流、监管单位或时间段）后再提问。
            """;

    /** 结构化明细的限额：模型偶尔会吐出几十行甚至带大段文本的表格，先在这里收口 */
    private static final int MAX_DETAIL_BLOCKS = 4;
    private static final int MAX_DETAIL_ROWS = 30;
    private static final int MAX_DETAIL_COLS = 8;
    private static final int MAX_DETAIL_POINTS = 12;
    private static final int MAX_CELL_CHARS = 200;
    private static final int MAX_NOTE_CHARS = 300;

    /** 无按钮可下发时需要抹掉的引导话术，按长度降序（长短语先删，避免留下残句） */
    private static final List<String> BUTTON_HINTS = List.of(
            "您可以点击下方按钮高亮查看该数据。",
            "点击下方按钮即可查看逐条记录。",
            "点击下方按钮即可打开弹框。",
            "点击下方按钮即可查看明细。",
            "点击下方按钮即可查看",
            "点击下方按钮查看该数据。",
            "点击下方按钮查看详情。",
            "点击下方按钮查看",
            "点击下方按钮打开",
            "点击下方按钮高亮",
            "点击上方按钮查看",
            "点击右侧按钮查看",
            "点击下方按钮",
            "点击上方按钮",
            "点击按钮查看",
            "点击按钮即可",
            "点击按钮");

    private final QwenClient qwenClient;
    private final AgentToolRegistry toolRegistry;
    private final ConversationMemoryService memoryService;
    private final AgentToolPermissionChecker permissionChecker;
    private final AgentProperties properties;
    private final ObjectMapper objectMapper;
    private final UiCapabilityService uiCapabilityService;
    private final UiCapabilityLocator uiCapabilityLocator;
    private final QuestionNormalizer questionNormalizer;

    /**
     * 明细分片缓存：字段注入而非构造参数——{@code @RequiredArgsConstructor} 的签名被多处单测显式装配，
     * 新增构造参数会让既有测试全部编译失败。测试环境为 null 时自动退化为不分片。
     */
    @Autowired(required = false)
    private AgentResultPager resultPager;

    @Override
    @DataScope
    public AgentChatVO chat(AgentChatDTO dto) {
        return runChat(dto, AgentStreamSink.NOOP);
    }

    /**
     * 流式提问：把「阶段进度 / 逐字增量 / 最终权威结果」推给 {@code sink}。
     *
     * <p>与 {@link #chat(AgentChatDTO)} 共用同一份 {@code runChat} 逻辑，
     * 工具选择、白名单校验、兜底、引用对账完全一致，只是多了一个事件出口，
     * 不会出现「流式接口和同步接口答得不一样」这种最难排查的问题。
     */
    @DataScope
    public void chatStream(AgentChatDTO dto, AgentStreamSink sink) {
        runChat(dto, sink == null ? AgentStreamSink.NOOP : sink);
    }

    private AgentChatVO runChat(AgentChatDTO dto, AgentStreamSink sink) {
        long startTime = System.currentTimeMillis();
        LoginUserDTO user = UserContext.get();
        String sessionId = resolveSessionId(dto.getSessionId(), user);

        // 0. 问题预处理：清理口语噪声 + 解析年份/意图。
        // 清理后的问题同时是「任务锚」：每轮工具结果都会带上它，防止多轮取数后跑偏。
        QuestionNormalizer.Normalized prepared = prepare(dto.getQuestion());
        String question = prepared.text();

        // 0.2 能力清单门禁（前置）：清单为空 + 本轮问的是「位置 / 页面操作」时直接返回。
        // 这类问题没有清单就必然给不出任何按钮：先把模型跑一遍、再回来告诉前端「清单是空的」，
        // 等于白花一次调用与一轮延迟。放在这里短路，前端收到 capabilitiesStale 后同步并重试一次即可。
        if (uiCapabilityService.all().isEmpty() && needCapabilities(prepared)) {
            log.info("[agent] 能力清单为空，问题需要页面引导，先让前端同步：{}", question);
            memoryService.append(sessionId, ROLE_USER, question);
            memoryService.append(sessionId, ROLE_ASSISTANT, STALE_ANSWER);
            AgentChatVO vo = AgentChatVO.builder()
                    .sessionId(sessionId)
                    .answer(STALE_ANSWER)
                    .events(List.of())
                    .kbRefs(List.of())
                    .details(List.of())
                    .usedTools(List.of())
                    .costMs(System.currentTimeMillis() - startTime)
                    .capabilitiesStale(true)
                    .build();
            sink.done(vo);
            return vo;
        }

        // 清单缺失是否真的让本轮答案受损：只有纯定位 / 页面操作问题才算。
        // 数据问答少几个按钮是允许的，不必让前端补报后重问一次、把已经拿到的详细答案丢掉。
        boolean capabilitiesStale = uiCapabilityService.all().isEmpty() && needCapabilities(prepared);

        // 0.1 未配置大模型密钥：直接给出可诊断的提示，不做任何脚本兜底
        if (!StringUtils.hasText(properties.getQwen().getApiKey())) {
            sink.stage("正在生成回答…");
            AgentChatVO vo = AgentChatVO.builder()
                    .sessionId(sessionId)
                    .answer("当前未配置大模型密钥（lonwin.agent.qwen.api-key），无法生成回答。"
                            + "请在配置项中补齐密钥后重试。")
                    .events(List.of())
                    .kbRefs(List.of())
                    .details(List.of())
                    .usedTools(List.of())
                    .costMs(System.currentTimeMillis() - startTime)
                    .capabilitiesStale(capabilitiesStale)
                    .build();
            sink.done(vo);
            return vo;
        }

        // 1. 组装消息：规则（含本轮问题解析） + 历史 + 本次问题
        // 注意：解析结果必须并进第一条 system —— 上游对「system 必须在开头」是硬校验，
        // 再插一条 system 会直接 400（实测 System message must be at the beginning）。
        String systemPrompt = buildSystemPrompt(dto.getModule());
        String brief = brief(prepared);
        if (StringUtils.hasText(brief)) {
            systemPrompt = systemPrompt + "\n\n" + brief;
        }
        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(message(ROLE_SYSTEM, systemPrompt));
        messages.addAll(trimHistory(memoryService.history(sessionId)));
        // system 与历史之间的分界：发送前裁剪只允许动这一段的尾巴，绝不越过它删掉本轮问题
        int historyEnd = messages.size();
        messages.add(message(ROLE_USER, question));

        // 原生工具清单：随请求体的 tools 数组下发，不再拼进 system 提示词
        List<Map<String, Object>> tools = toolRegistry.openAiTools(dto.getModule());
        // 排查第一现场：工具到底有没有发出去、发了哪几个。缺了这行，
        // 「模型编数字」和「工具有没有下发给模型」永远无法从日志区分。
        log.info("[agent] 模块={}，注册表共 {} 个工具，本轮下发 {} 个：{}",
                dto.getModule(), toolRegistry.size(), tools.size(), toolNames(tools));
        if (tools.isEmpty()) {
            log.warn("[agent] 本轮工具清单为空（注册表 {} 个）：模型没有任何取数能力，数据类问题只能凭记忆作答。"
                    + "排查顺序：① tools.enabled 是否被环境变量覆盖；"
                    + "② 管理端是否把工具停用（看启动日志「已被管理端停用」）；"
                    + "③ 工具的 module 与前端传的 module 是否一致",
                    toolRegistry.size());
        }

        List<AgentActionVO> actions = new ArrayList<>();
        List<String> usedTools = new ArrayList<>();
        // 本轮命中的知识库片段：由 kb.search 的工具结果回传，最终写进 AgentChatVO.kbRefs。
        List<KbRefVO> kbRefs = new ArrayList<>();
        String answer = null;
        // 定位工具的命中事件：模型经常只写文字、忘了输出 events，
        // 由服务端用匹配结果兜底，保证「问位置」一定有按钮（或明确说无匹配）
        List<AgentUiEventVO> locateEvents = List.of();
        // 问句带统计类字面标记：这种问题零证据防线大概率会拦（模型不调工具就给数字），
        // 第一轮正文先扣住不发，避免编造的数字逐字上屏后又被 done 推翻（见 askModel 的 holdAnswer）
        boolean dataQuestion = !tools.isEmpty() && DATA_QUESTION.matcher(question).find();

        // 2. 工具循环：模型自主决定调什么、调几轮；不再调工具即为最终回答
        for (int round = 0; round < properties.getMaxToolRounds(); round++) {
            ModelReply reply = askModel(messages, tools, historyEnd, sink, round,
                    dataQuestion && usedTools.isEmpty());
            if (!reply.hasToolCalls()) {
                // 零证据防线：本轮之前一次工具都没调过，问题在问数值，答案里也确实出现了数字
                // → 这个数字没有任何接口依据，必须逼模型真查一次，而不是把编的值交付给用户
                if (usedTools.isEmpty() && !tools.isEmpty() && needsEvidence(question, reply.content())) {
                    log.warn("[agent] 模型未调用任何工具就直接给出了数字（问题={}，答案前 80 字={}），"
                            + "已拦下并按 required 强制取数重问一次", question, abbreviate(reply.content(), 80));
                    reply = forceEvidence(messages, dto.getModule(), historyEnd, round);
                    if (!reply.hasToolCalls()) {
                        log.error("[agent] 强制取数后模型仍未调用任何工具，判定本轮无数据来源，"
                                + "改为如实说明，不输出任何数字");
                        answer = NO_EVIDENCE_ANSWER;
                        break;
                    }
                } else {
                    answer = reply.content();
                    break;
                }
            }

            // 先落 assistant.tool_calls（原生协议要求：tool 消息必须紧跟对应的 tool_calls）
            messages.add(assistantToolCallMessage(reply.toolCalls()));

            for (ModelReply.ToolRequest call : reply.toolCalls()) {
                Map<String, Object> args = parseArguments(call);
                if (args == null) {
                    messages.add(toolMessage(call.id(), "工具 " + call.name()
                            + " 的 arguments 不是合法 JSON 对象，请修正后重新发起调用。"));
                    continue;
                }
                usedTools.add(call.name());
                sink.stage(TOOL_KB_SEARCH.equals(call.name())
                        ? "正在检索知识库文档…"
                        : "正在查询「" + call.name() + "」相关数据…");
                AgentToolResult result = executeTool(call.name(), args, sessionId, user, dto.getModule());
                mergeActions(actions, result.getActions());
                if (TOOL_UI_LOCATE.equals(call.name())) {
                    locateEvents = eventsFromToolResult(result);
                }
                if (TOOL_KB_SEARCH.equals(call.name())) {
                    // 每次知识检索都从 11 重新编号，先清空上一轮，避免编号重复导致角标错指
                    kbRefs.clear();
                    collectKbRefs(result, kbRefs);
                }
                // 工具结果带任务锚：多轮往返中模型始终看得到初始问题
                messages.add(toolMessage(call.id(),
                        buildToolObservation(result, call.name(), sessionId, question)));
            }
        }

        // 3. 工具轮次用尽仍无最终答案时，收起工具强制让模型基于已有信息作答
        if (!StringUtils.hasText(answer)) {
            answer = askModel(messages, List.of(), historyEnd, sink, properties.getMaxToolRounds(), false).content();
        }

        // 4. 解析最终回答中的 UI 引导事件（模型按约定输出 {"answer":..., "refs":[...]}）
        // 模型没按 JSON 输出时，整段原文就是答案，直接保留：页面按钮是附加功能，
        // 不值得为了拿到 refs 再调一次模型（既增加等待，也可能把已经写好的详细答案改写短）。
        // 缺的按钮由下面 4.2~4.3 的服务端兜底按需补上。
        ParsedFinal parsed = parseFinalAnswer(answer);
        if (!parsed.json()) {
            log.info("[agent] 回答非约定 JSON，按原文完整保留（不追加格式纠正调用）");
        }
        UiCapabilityService.Validation validation = uiCapabilityService.validateWithReasons(parsed.events(),
                dto.getModule());
        List<AgentUiEventVO> events = validation.events();
        String finalAnswer = parsed.answer();

        // 4.1 事件纠正：refs 被白名单拒掉时，把逐条拒绝原因回给模型补一次。
        // 纠正只补 refs，正文一律沿用 parsed.answer()——正文是交付物，
        // 为了几个按钮重写一遍，可能把刚核对过的数字改掉、把详细回答压缩成一句话。
        if (!validation.rejects().isEmpty()) {
            events = correctRefs(messages, historyEnd, events, validation.rejects(), finalAnswer, dto.getModule());
        }

        // 4.2 定位问题兜底：模型给了文字但没给按钮时，用服务端匹配结果补上
        if (events.isEmpty() && !locateEvents.isEmpty()) {
            events = uiCapabilityService.validateWithReasons(locateEvents, dto.getModule()).events();
            log.info("[agent] 模型未输出定位事件，已用服务端匹配结果补 {} 个按钮", events.size());
        }
        // 4.3 定位意图的硬兜底：模型既没调 ui.locate 也没给按钮时，服务端自己做一次检索。
        if (events.isEmpty() && locateEvents.isEmpty()
                && !uiCapabilityService.all().isEmpty()
                && UiCapabilityLocator.isLocateQuestion(question)) {
            String keyword = UiCapabilityLocator.extractKeyword(question);
            UiCapabilityLocator.LocateResult located = uiCapabilityLocator.locate(keyword, dto.getModule());
            List<AgentUiEventVO> locatedEvents = uiCapabilityService
                    .validateWithReasons(uiCapabilityLocator.toEvents(located), dto.getModule()).events();
            if (!locatedEvents.isEmpty()) {
                events = locatedEvents;
                log.info("[agent] 模型未调用位置检索，已由服务端补 {} 个位置按钮：{}", events.size(), keyword);
            } else {
                // 清单非空却找不到对应页面：只补一句提示，绝不覆盖模型已经写好的答案。
                log.info("[agent] 位置检索无匹配，答案原文保留：{}", question);
                String hint = keyword == null
                        ? "（补充：当前页面能力清单中未登记可点击的跳转入口，以上为文字说明。）"
                        : "（补充：页面能力清单中未登记「" + keyword + "」的跳转入口，以上为文字说明，请以系统菜单为准。）";
                if (!finalAnswer.contains("未登记") && !finalAnswer.contains("没有匹配")) {
                    finalAnswer = finalAnswer + "\n" + hint;
                }
            }
        }

        // 4.4 还是没有按钮却在回答里写了「点击下方按钮」：只删这句引导短语。
        // 说了有按钮却没有会让人以为界面坏了，但删的时候不能碰答案里的任何数据。
        if (events.isEmpty()) {
            String cleaned = stripButtonMention(finalAnswer);
            if (!cleaned.equals(finalAnswer)) {
                log.info("[agent] 回答里提到按钮但无按钮可下发，已删除该表述");
                finalAnswer = cleaned;
            }
        }

        // 4.5 引用对账：只保留有合法事件指向的 [[n]] 标记。
        finalAnswer = alignCitations(finalAnswer, events, kbRefs);

        // 5. 写入会话记忆（中间的工具往返不进长期记忆，细节让模型重新查）
        memoryService.append(sessionId, ROLE_USER, question);
        memoryService.append(sessionId, ROLE_ASSISTANT, finalAnswer);

        AgentChatVO vo = AgentChatVO.builder()
                .sessionId(sessionId)
                .answer(finalAnswer)
                .actions(actions)
                .events(events)
                .kbRefs(kbRefs)
                .details(parsed.details())
                .usedTools(usedTools)
                .costMs(System.currentTimeMillis() - startTime)
                .capabilitiesStale(capabilitiesStale)
                .build();
        // 权威结果：前端应以它覆盖逐字预览。
        sink.done(vo);
        return vo;
    }

    /**
     * 调一轮模型（原生 function calling）。
     *
     * <p>工具轮的回复只有 tool_calls、没有 content，流式下自然不会向前端推任何字；
     * 最终回答轮只有 content，由 {@link StreamingAnswerTap} 从约定 JSON 里
     * 逐字抽取 {@code answer} 字段推给前端。
     *
     * @param holdAnswer 本轮正文先扣住不发（stage 照常）：用于数据类问题尚无任何
     *                   工具证据时——模型此刻直接吐的多半是凭记忆编的数字，
     *                   逐字上屏后又被 done 推翻（流式说 10 个、最终 12 张），
     *                   不如从头就不让它出现。防线放行时由 done 权威结果覆盖展示。
     */
    private ModelReply askModel(List<Map<String, Object>> messages, List<Map<String, Object>> tools,
                                int historyEnd, AgentStreamSink sink, int round, boolean holdAnswer) {
        ensureWithinBudget(messages, historyEnd, round);
        // 没有事件出口（同步接口 / Demo / 单元测试）时流式毫无收益：上游吐得再快也没人接，
        // 只会多一层 SSE 解析。保持原来的阻塞调用，同步接口的行为与历史完全一致。
        if (sink == AgentStreamSink.NOOP || !properties.getQwen().isStreamEnabled()) {
            return qwenClient.chat(messages, tools);
        }
        sink.stage(round == 0 ? "正在理解问题…" : "正在结合数据整理回答…");
        AgentStreamSink tapSink = holdAnswer ? suppressingDelta(sink) : sink;
        StreamingAnswerTap tap = new StreamingAnswerTap(tapSink);
        return qwenClient.chatStream(messages, tools, tap::accept, tapSink::heartbeat);
    }

    /** 扣住 delta 的出口包装：stage / heartbeat 照常透传，正文增量被丢弃（见 askModel 的 holdAnswer） */
    private static AgentStreamSink suppressingDelta(AgentStreamSink sink) {
        return new AgentStreamSink() {
            @Override
            public void stage(String text) {
                sink.stage(text);
            }

            @Override
            public void delta(String text) {
                // 故意丢弃
            }

            @Override
            public void heartbeat() {
                sink.heartbeat();
            }
        };
    }

    /**
     * 本轮回答是否需要「数字必须有接口依据」的硬校验。
     *
     * <p>三个条件同时成立才触发，尽量不误伤概念题：
     * <ol>
     *   <li>问题带统计类字面标记（多少 / 合计 / 总共 / 排名…）；</li>
     *   <li>答案里出现了阿拉伯数字——没有数字就没有可编造的量化结论；</li>
     *   <li>本轮一次工具都没调过（由调用方保证）。</li>
     * </ol>
     */
    private boolean needsEvidence(String question, String content) {
        if (!StringUtils.hasText(question) || !StringUtils.hasText(content)) {
            return false;
        }
        return DATA_QUESTION.matcher(question).find() && DIGIT.matcher(content).find();
    }

    /**
     * 强制取数：追加一条强约束消息，并以 {@code tool_choice=required} 重新提问。
     *
     * <p>两处刻意为之：
     * <ul>
     *   <li><b>只开放只读工具</b>：required 会逼模型必须选一个工具，写操作绝不能出现在这个候选集里；</li>
     *   <li><b>不走流式</b>：上一次的错误回答已经逐字推给前端了，再推一遍会让用户先看到一段
     *       互相矛盾的文字。这一轮只取结果，最终由 {@code done} 的权威结果覆盖。</li>
     * </ul>
     *
     * <p>边界：本方法每次问答最多调用一次（只在 {@code usedTools} 为空、即首次模型调用时触发），
     * 因此最坏情况是 maxToolRounds + 1 次模型调用，不会形成循环。
     */
    private ModelReply forceEvidence(List<Map<String, Object>> messages, String module,
                                     int historyEnd, int round) {
        messages.add(message(ROLE_USER, FORCE_EVIDENCE_PROMPT));
        List<Map<String, Object>> readOnly = toolRegistry.readOnlyTools(module);
        ensureWithinBudget(messages, historyEnd, round);
        try {
            return qwenClient.chat(messages, readOnly, "required");
        } catch (BusinessException e) {
            // 个别 OpenAI 兼容网关不认 tool_choice=required（实测内网 qwen3 网关支持）。
            // 这里不能把异常抛出去：用户本来是「答案有个错数字」，不该变成「整个问答报错」。
            // 直接按「没取到证据」处理，走下面的如实说明分支，既不重试也不输出数字。
            log.warn("[agent] 强制取数调用失败，按无证据处理：{}", e.getMessage());
            return ModelReply.text("");
        }
    }

    /** 从 OpenAI tools 数组里取出工具名，仅用于日志 */
    private List<String> toolNames(List<Map<String, Object>> tools) {
        List<String> names = new ArrayList<>(tools.size());
        for (Map<String, Object> tool : tools) {
            Object function = tool.get("function");
            if (function instanceof Map<?, ?> fn && fn.get("name") != null) {
                names.add(String.valueOf(fn.get("name")));
            }
        }
        return names;
    }

    /** 日志用短文本：压平换行，避免把整段回答写进一行日志 */
    private String abbreviate(String text, int max) {
        if (!StringUtils.hasText(text)) {
            return "";
        }
        String flat = text.replaceAll("\\s+", " ").trim();
        return flat.length() <= max ? flat : flat.substring(0, max) + "…";
    }

    /**
     * 会话历史按「字符预算」裁剪。
     *
     * <p>只按条数限制挡不住体积：一条详细回答就上千字，十条历史足以把输入撑到 3 万 token
     * 以上（平台按 字符/1.6 估算）。这里从最新往旧保留，单条过长的回答只留开头——
     * 结论还在，细节让模型重新查。
     */
    private List<Map<String, Object>> trimHistory(List<AgentMessageVO> history) {
        if (history == null || history.isEmpty()) {
            return List.of();
        }
        List<Map<String, Object>> kept = new ArrayList<>();
        int used = 0;
        for (int i = history.size() - 1; i >= 0; i--) {
            AgentMessageVO item = history.get(i);
            String content = item.getContent() == null ? "" : item.getContent();
            if (content.length() > HISTORY_MESSAGE_MAX_CHARS) {
                content = content.substring(0, HISTORY_MESSAGE_MAX_CHARS) + "…（历史回答已截断，细节请重新查询）";
            }
            if (used + content.length() > HISTORY_MAX_CHARS) {
                break;
            }
            used += content.length();
            kept.add(0, message(item.getRole(), content));
        }
        if (kept.size() < history.size()) {
            log.info("[agent] 历史消息裁剪：{} → {} 条（{} 字）", history.size(), kept.size(), used);
        }
        return kept;
    }

    /**
     * 发送前的输入预算闸。
     *
     * <p>平台把「输入 + max_tokens」与模型窗口（默认 32000）比较，超了直接 40005，用户一条回答都拿不到。
     * 本地用同一套估算（字符/1.6）先算一遍，超预算时按「最旧的历史 → 最早的工具回合」顺序裁剪，
     * 当前问题与最新一轮观测始终保留；裁完仍超说明系统提示词或单条观测本身过大，
     * 此时给出可读的错误，而不是把 40005 原样抛给用户。
     */
    private void ensureWithinBudget(List<Map<String, Object>> messages, int historyEnd, int round) {
        AgentProperties.Qwen qwen = properties.getQwen();
        double ratio = qwen.getCharsPerToken() <= 0 ? 1.6 : qwen.getCharsPerToken();
        int budgetTokens = Math.max(1000,
                qwen.getContextTokens() - qwen.getMaxTokens() - INPUT_TOKEN_MARGIN);
        int budgetChars = (int) (budgetTokens * ratio);

        int before = chars(messages);
        int beforeTokens = tokens(before, ratio);
        if (before <= budgetChars) {
            log.debug("[agent] 第 {} 轮输入约 {} token（{} 字），预算 {} token",
                    round, beforeTokens, before, budgetTokens);
            return;
        }
        log.warn("[agent] 第 {} 轮输入约 {} token（{} 字）超过预算 {} token，开始裁剪",
                round, beforeTokens, before, budgetTokens);

        // 1) 先丢历史：只动 system 之后、当前问题之前的消息，绝不越过 historyEnd
        int end = historyEnd;
        while (chars(messages) > budgetChars && end > 1 && messages.size() > end) {
            messages.remove(1);
            end--;
        }

        // 2) 再丢最早的工具回合（assistant.tool_calls + 其后连续的 tool 消息），至少留最新一回合
        while (chars(messages) > budgetChars && messages.size() > end + 2) {
            messages.remove(end + 1);
            while (messages.size() > end + 1
                    && ROLE_TOOL.equals(messages.get(end + 1).get("role"))) {
                messages.remove(end + 1);
            }
        }

        int after = chars(messages);
        log.info("[agent] 裁剪后输入约 {} token（{} 字）", tokens(after, ratio), after);
        if (after > budgetChars) {
            throw new BusinessException("本轮上下文过长（约 " + tokens(after, ratio) + " token，上限 "
                    + budgetTokens + "），请开启新会话，或把问题拆成更小的几次提问。");
        }
    }

    /** 消息总字符数：与平台一致按字符估算 token；assistant.tool_calls 的 arguments 一并计入 */
    private int chars(List<Map<String, Object>> messages) {
        int total = 0;
        for (Map<String, Object> message : messages) {
            Object content = message.get("content");
            if (content != null) {
                total += content.toString().length();
            }
            Object toolCalls = message.get("tool_calls");
            if (toolCalls instanceof List<?> calls) {
                for (Object call : calls) {
                    if (call instanceof Map<?, ?> callMap) {
                        Object function = callMap.get("function");
                        if (function instanceof Map<?, ?> functionMap) {
                            Object arguments = functionMap.get("arguments");
                            if (arguments != null) {
                                total += arguments.toString().length();
                            }
                        }
                    }
                }
            }
        }
        return total;
    }

    private int tokens(int chars, double ratio) {
        return (int) Math.ceil(chars / ratio);
    }

    @Override
    @DataScope
    public String ask(String sessionId, String question) {
        AgentChatDTO dto = new AgentChatDTO();
        dto.setSessionId(sessionId);
        dto.setQuestion(question);
        return chat(dto).getAnswer();
    }

    /** 清空指定会话的记忆 */
    public void reset(String sessionId) {
        memoryService.clear(sessionId);
    }

    /** 查询会话历史 */
    public List<AgentMessageVO> history(String sessionId) {
        return memoryService.history(sessionId);
    }

    // ==================== 内部实现 ====================

    /** 问题预处理（开关关闭时直通原文） */
    private QuestionNormalizer.Normalized prepare(String raw) {
        if (!properties.getPreprocess().isEnabled()) {
            return questionNormalizer.identity(raw);
        }
        QuestionNormalizer.Normalized prepared = questionNormalizer.normalize(raw, List.of());
        if (prepared.changed() || prepared.year() != null) {
            // 排查用：模型答偏时先看这行，确认是「问题被清理坏了」还是「年份识别错了」
            log.info("[agent] 问题预处理：{} -> 「{}」，year={}，intent={}",
                    prepared.original(), prepared.text(), prepared.year(), prepared.intent());
        }
        return prepared;
    }

    /** 预处理解析说明：开关关闭时不生成，避免提示词里出现「未清理」的矛盾描述 */
    private String brief(QuestionNormalizer.Normalized prepared) {
        if (!properties.getPreprocess().isEnabled()) {
            return null;
        }
        return questionNormalizer.brief(prepared);
    }

    /**
     * 本轮问题是否「完全没有清单就无法作答」。
     *
     * <p>门禁要尽量窄：页面按钮是附加功能，缺清单最多是少几个入口，不该把整个问答挡掉。
     * 纯数据问答、「既要数字又要位置」的混合问题都照常取数作答，答案主体不受影响。
     */
    private boolean needCapabilities(QuestionNormalizer.Normalized prepared) {
        if (prepared == null) {
            return false;
        }
        // 「XX 是多少，在哪看」这类混合问题，意图可能被判成 LOCATE，
        // 但答案主体是数据；放行后服务端仍会在末尾补一句「暂无跳转入口」。
        if (DATA_QUESTION.matcher(prepared.text()).find()) {
            return false;
        }
        if (prepared.intent() == QuestionNormalizer.Intent.LOCATE
                || prepared.intent() == QuestionNormalizer.Intent.OPERATE) {
            return true;
        }
        // 预处理开关关闭时 intent 恒为 CHAT，这里退回字面判定，避免门禁被配置副作用关掉
        return UiCapabilityLocator.isLocateQuestion(prepared.text());
    }

    /**
     * 执行工具：权限校验 → 调用工具 → 记录耗时。
     *
     * <p>单位数据权限不在这里解析：它由 {@code @DataScope} 切面在 {@link #chat} 入口统一准备，
     * 工具/网关内部按需读取 {@code DataScopeContext}。
     *
     * <p>口径判断交给模型：工具查不到用户要的口径时，模型从参数校验失败与返回数据
     * 的字段说明里能得出「查不到」，并如实告知用户——服务端不再做字面口径拦截。
     *
     * <p>工具内部（参数校验、业务异常）已统一转成失败结果，
     * 这里不再兜异常处理，保证「一次查询失败」只会让模型换一句话解释，不会让整个问答 500。
     */
    private AgentToolResult executeTool(String toolName, Map<String, Object> args,
                                        String sessionId, LoginUserDTO user, String module) {
        AgentToolDefinition tool = toolRegistry.find(toolName).orElse(null);
        if (tool == null) {
            log.warn("模型调用了未注册的工具: {}，已注册: {}", toolName, toolRegistry.all().stream()
                    .map(AgentToolDefinition::getName).toList());
            return AgentToolResult.fail("不存在名为 " + toolName + " 的工具，请直接用已有信息回答或说明无法查询");
        }

        // 工具级权限：防止模型绕过前端按钮直接调用受限能力
        if (!permissionChecker.allows(tool)) {
            return AgentToolResult.fail("当前用户没有使用「" + tool.getTitle() + "」的权限，请如实说明无法查询");
        }

        AgentToolContext context = AgentToolContext.builder()
                .sessionId(sessionId)
                .userCode(user == null ? null : user.getUserCode())
                .userName(user == null ? null : user.getUserName())
                .module(module)
                .build();

        long start = System.currentTimeMillis();
        AgentToolResult result = tool.execute(context, args);
        log.info("[agent] 工具 {} 执行完成, unitCode={}, cost={}ms, success={}",
                toolName, DataScopeContext.unitCode(), System.currentTimeMillis() - start, result.isSuccess());
        return result;
    }

    /**
     * 把工具结果转成回给模型的 tool 消息内容。
     *
     * <p>结构就三块：来源标记（api=实时数据 / kb=文档片段，裁决规则见系统提示词）、
     * 工具返回的结构化数据、任务锚。数据有多大给多大——预算闸（ensureWithinBudget）
     * 负责整体收口，超窗时从最旧的工具回合开始裁，而不是在单条观测里拦腰截断
     * JSON（半截 JSON 模型读不懂，比超窗更糟）。
     */
    private String buildToolObservation(AgentToolResult result, String toolName, String sessionId, String question) {
        if (!result.isSuccess()) {
            return "工具执行失败：" + result.getErrorMessage()
                    + "\n请用中文向用户说明无法查询的原因。不要编造数据，"
                    + "也不要用名称相近的其他口径数据顶替。";
        }
        Map<String, Object> data = result.getData() == null ? Map.of() : result.getData();
        String source = String.valueOf(data.getOrDefault("source", "api"));
        Map<String, Object> forModel = new LinkedHashMap<>(data);
        forModel.remove("kbRefs");
        // 明细分片投喂：全量 rows 暂存内存，只把第一片塞进上下文，其余由 agent.result.more 续取
        applyRowSlicing(forModel, sessionId, toolName);

        String dataJson;
        try {
            dataJson = objectMapper.writeValueAsString(forModel);
        } catch (Exception e) {
            dataJson = String.valueOf(forModel);
        }

        StringBuilder observation = new StringBuilder()
                .append("【工具结果 · tool=").append(toolName).append(" · source=").append(source).append("】\n")
                .append(dataJson);
        if ("kb".equals(source)) {
            observation.append("\n（知识库文档片段：matches[].n 是片段编号，引用某片段时在结论后紧跟 [[n]]；"
                    + "只依据这些片段作答，不编造条文；实时数值以 source=api 的结果为准。）");
        }
        if (Boolean.TRUE.equals(forModel.get("rowsPaged"))) {
            observation.append("\n（明细已分片：rows 只是第一片，共 ").append(forModel.get("rowsTotal"))
                    .append(" 条；需要更多明细时调用 agent.result.more（cursor 取 rowsCursor，page 从 2 开始）；")
                    .append("不要把第一片当全部，也不要用它求和——统计请基于完整明细后再计算。）");
        }
        // 任务锚：多轮往返中模型始终看得到初始问题，防止跑偏
        observation.append("\n【当前任务】").append(question);
        return observation.toString();
    }

    /**
     * 结果分片：把 rows 全量登记到内存缓存，只把第一片留在上下文里。
     *
     * <p>数据全量留在 {@link AgentResultPager}，上下文只给第一片 + 游标 + 总量，
     * 模型需要更多时调用 {@code agent.result.more} 续取——数据不丢，上下文不炸。
     *
     * <p>只对「行数超过一片」的列表生效；标量、单对象、已分片的结果不会二次分片
     * （续取片本身 ≤ 一片，不会被再次登记）。
     */
    @SuppressWarnings("unchecked")
    private void applyRowSlicing(Map<String, Object> forModel, String sessionId, String toolName) {
        if (resultPager == null) {
            return;
        }
        Object rows = forModel.get("rows");
        if (!(rows instanceof List<?> list) || list.size() <= AgentResultPager.SLICE_ROWS) {
            return;
        }
        List<Map<String, Object>> allRows = new ArrayList<>(list.size());
        for (Object item : list) {
            if (item instanceof Map<?, ?> map) {
                allRows.add((Map<String, Object>) map);
            }
        }
        if (allRows.isEmpty()) {
            return;
        }
        String cursor = resultPager.register(sessionId, toolName, allRows);
        if (cursor == null) {
            return;
        }
        AgentResultPager.Slice first = resultPager.slice(cursor, 1);
        int firstCount = first == null || first.getRows() == null ? 0 : first.getRows().size();
        forModel.put("rows", first == null ? List.of() : first.getRows());
        forModel.put("rowsPaged", true);
        forModel.put("rowsCursor", cursor);
        forModel.put("rowsTotal", allRows.size());
        forModel.put("rowsFirstCount", firstCount);
        forModel.put("hasMore", first != null && first.isHasMore());
        forModel.put("rowsNote", "明细共 " + allRows.size() + " 条，本次只投喂前 " + firstCount
                + " 条；需要更多明细时调用 agent.result.more（cursor=" + cursor + "，page=2 起）；"
                + "统计必须基于全部明细，分片未取完前不要给出合计");
    }

    /** 从 kb.search 的工具结果里提取知识引用（编号已在工具层分配好） */
    private void collectKbRefs(AgentToolResult result, List<KbRefVO> target) {
        if (result == null || !result.isSuccess() || result.getData() == null) {
            return;
        }
        Object raw = result.getData().get("kbRefs");
        if (!(raw instanceof List<?> list) || list.isEmpty()) {
            return;
        }
        for (Object item : list) {
            try {
                KbRefVO ref = objectMapper.convertValue(item, KbRefVO.class);
                if (ref != null && ref.getCite() != null) {
                    target.add(ref);
                }
            } catch (Exception e) {
                log.debug("[agent] 知识引用转换失败，已忽略：{}", item);
            }
        }
        log.info("[agent] 本轮收集到 {} 条知识库引用", target.size());
    }

    /**
     * 从工具结果里取「服务端生成的 UI 事件」（{@code ui.locate} 的 data.events）。
     *
     * <p>只用于兜底：模型正常按约定输出 events 时不走这里。
     */
    private List<AgentUiEventVO> eventsFromToolResult(AgentToolResult result) {
        if (result == null || !result.isSuccess() || result.getData() == null) {
            return List.of();
        }
        Object raw = result.getData().get("events");
        if (!(raw instanceof List<?> list) || list.isEmpty()) {
            return List.of();
        }
        List<AgentUiEventVO> events = new ArrayList<>();
        for (Object item : list) {
            try {
                AgentUiEventVO event = objectMapper.convertValue(item, AgentUiEventVO.class);
                if (StringUtils.hasText(event.getType()) && StringUtils.hasText(event.getTarget())) {
                    events.add(event);
                }
            } catch (Exception e) {
                log.debug("定位事件转换失败，已忽略：{}", item);
            }
        }
        return events;
    }

    /**
     * 删掉「点击下方按钮…」这类引导短语（只在确实没有按钮可下发时调用）。
     *
     * <p>按短语删而不是按分句删：详细答案里数字和引导常常在同一句
     * （「许可水量 24436 万m³，您可以点击下方按钮查看」），整句或整分句丢掉会把答案本体一起删掉。
     * 宁可留下半句不通顺的引导，也不能损失任何一个数据。
     */
    private String stripButtonMention(String answer) {
        if (!StringUtils.hasText(answer) || !answer.contains("按钮")) {
            return answer;
        }
        String cleaned = answer;
        for (String hint : BUTTON_HINTS) {
            cleaned = cleaned.replace(hint, "");
        }
        cleaned = cleaned.replaceAll("[ \\t]*\\n[ \\t]*\\n([ \\t]*\\n)+", "\n\n")
                .replaceAll("[，,；;、\\s]+$", "").trim();
        return cleaned.isEmpty() ? answer : cleaned;
    }

    /**
     * 引用对账：把正文里的 {@code [[n]]} 标记与最终下发的事件对齐。
     *
     * <p>只保留「有对应合法事件」的编号。事件被白名单丢掉、或者模型编了个没有 ref 的编号时，
     * 正文里就会留下死角标——点上去什么都不发生，比没有角标更像故障。
     * 与其让前端猜，不如在这里一次性清掉，保证「有标记 ⇔ 有动作」。
     *
     * @return 清理后的正文（若清理后为空则保留原文，避免把回答清空）
     */
    private String alignCitations(String answer, List<AgentUiEventVO> events, List<KbRefVO> kbRefs) {
        if (!StringUtils.hasText(answer)) {
            return answer;
        }
        // 两类引用共用一个编号空间：1~9 页面动作，11 起文档依据。
        Set<Integer> live = new LinkedHashSet<>();
        if (events != null) {
            for (AgentUiEventVO event : events) {
                if (event.getCite() != null) {
                    live.add(event.getCite());
                }
            }
        }
        if (kbRefs != null) {
            for (KbRefVO ref : kbRefs) {
                if (ref.getCite() != null) {
                    live.add(ref.getCite());
                }
            }
        }
        Matcher matcher = CITE_MARKER.matcher(answer);
        StringBuilder text = new StringBuilder();
        int dropped = 0;
        while (matcher.find()) {
            int id;
            try {
                id = Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException e) {
                id = -1;
            }
            if (live.contains(id)) {
                matcher.appendReplacement(text, Matcher.quoteReplacement("[[" + id + "]]"));
            } else {
                matcher.appendReplacement(text, "");
                dropped++;
            }
        }
        matcher.appendTail(text);
        if (dropped == 0) {
            return answer;
        }
        String cleaned = text.toString().replaceAll("[ \\t]{2,}", " ").trim();
        if (!StringUtils.hasText(cleaned)) {
            return answer;
        }
        log.info("[agent] 已清理 {} 处无对应动作的引用标记", dropped);
        return cleaned;
    }

    /** 合并跳转按钮：按「路由+文案」去重，并限制数量 */
    private void mergeActions(List<AgentActionVO> target, List<AgentActionVO> source) {
        if (source == null || source.isEmpty()) {
            return;
        }
        for (AgentActionVO action : source) {
            boolean duplicated = target.stream().anyMatch(exists ->
                    StringUtils.hasText(exists.getRoutePath())
                            && exists.getRoutePath().equals(action.getRoutePath())
                            && StringUtils.hasText(exists.getLabel())
                            && exists.getLabel().equals(action.getLabel()));
            if (!duplicated && target.size() < properties.getMaxActions()) {
                target.add(action);
            }
        }
    }

    /**
     * 解析模型发起的工具调用
     */
    private Map<String, Object> parseArguments(ModelReply.ToolRequest call) {
        try {
            JsonNode node = objectMapper.readTree(call.arguments());
            if (node.isObject()) {
                return objectMapper.convertValue(node, new TypeReference<Map<String, Object>>() { });
            }
        } catch (Exception e) {
            log.warn("[agent] 工具 {} 的 arguments 解析失败：{}", call.name(), call.arguments());
        }
        return null;
    }

    /** assistant.tool_calls 消息：原生协议要求 tool 消息必须紧跟对应 id */
    private Map<String, Object> assistantToolCallMessage(List<ModelReply.ToolRequest> calls) {
        List<Map<String, Object>> toolCalls = new ArrayList<>();
        for (ModelReply.ToolRequest call : calls) {
            Map<String, Object> function = new LinkedHashMap<>();
            function.put("name", call.name());
            function.put("arguments", call.arguments());
            Map<String, Object> toolCall = new LinkedHashMap<>();
            toolCall.put("id", call.id());
            toolCall.put("type", "function");
            toolCall.put("function", function);
            toolCalls.add(toolCall);
        }
        Map<String, Object> message = new LinkedHashMap<>();
        message.put("role", ROLE_ASSISTANT);
        message.put("content", "");
        message.put("tool_calls", toolCalls);
        return message;
    }

    /** tool 消息：把工具结果回传给模型，tool_call_id 对应 assistant.tool_calls[].id */
    private Map<String, Object> toolMessage(String toolCallId, String content) {
        Map<String, Object> message = new LinkedHashMap<>();
        message.put("role", ROLE_TOOL);
        message.put("tool_call_id", toolCallId);
        message.put("content", content);
        return message;
    }

    /**
     * 解析最终回答：模型按约定输出 {"answer": "...", "refs": [...]}。
     *
     * <p>容忍 ```json 围栏和多嘴的前后缀说明；完全取不到 JSON 时按纯文本原样保留，
     * 并把 {@code json=false} 交回调用方（页面引导是附加功能，不再为此追一次模型）。
     * 输出被截断成半截 JSON 时，先尝试抢救已经生成的 answer 正文。
     */
    private ParsedFinal parseFinalAnswer(String reply) {
        if (!StringUtils.hasText(reply)) {
            return new ParsedFinal("", List.of(), false, List.of());
        }
        String trimmed = reply.trim();
        String json = extractJsonObject(trimmed);
        if (json == null) {
            // 半截 JSON（缺右花括号）通常是被 max_tokens 截断，先抢救已生成的正文
            if (trimmed.startsWith("{") && trimmed.contains("\"answer\"")) {
                return recoverTruncatedAnswer(trimmed);
            }
            return new ParsedFinal(trimmed, List.of(), false, List.of());
        }
        try {
            JsonNode node = objectMapper.readTree(json);
            String text = node.path("answer").asText("");
            if (!StringUtils.hasText(text)) {
                return new ParsedFinal(trimmed, List.of(), false, List.of());
            }
            // refs 是当前约定（带行内引用编号），events 是旧约定（无编号）。
            List<AgentUiEventVO> events = parseRefs(node.path("refs"));
            if (events.isEmpty()) {
                events = parseEvents(node.path("events"));
            }
            return new ParsedFinal(text, events, true, parseDetails(node.path("details")));
        } catch (Exception e) {
            log.debug("最终回答非合法 JSON，尝试按截断处理");
            return recoverTruncatedAnswer(trimmed);
        }
    }

    /** 解析 refs：{id, type, target, label, args}，id 即正文里的 [[n]] 标记编号 */
    private List<AgentUiEventVO> parseRefs(JsonNode refsNode) {
        if (refsNode == null || !refsNode.isArray()) {
            return List.of();
        }
        List<AgentUiEventVO> refs = new ArrayList<>();
        for (JsonNode refNode : refsNode) {
            String type = refNode.path("type").asText("");
            String target = refNode.path("target").asText("");
            if (!StringUtils.hasText(type) || !StringUtils.hasText(target)) {
                continue;
            }
            // 逐字段取值而不是 convertValue：refs 里的 id 不是 VO 字段，
            // 在严格 ObjectMapper（测试环境）下整条会被判为未知属性而丢弃。
            Map<String, Object> args = null;
            JsonNode argsNode = refNode.path("args");
            if (argsNode.isObject()) {
                args = objectMapper.convertValue(argsNode, new TypeReference<Map<String, Object>>() { });
            }
            refs.add(AgentUiEventVO.builder()
                    .type(type)
                    .target(target)
                    .label(refNode.path("label").asText(null))
                    .args(args)
                    .cite(refNode.path("id").isNumber() ? refNode.path("id").asInt() : null)
                    .build());
        }
        return refs;
    }

    /**
     * 事件纠正：把「refs 为什么被拒」回给模型，让它在本次问答内补一次可用按钮。
     *
     * <p>三点刻意为之：
     * <ul>
     *   <li><b>只取 refs</b>：纠正轮即使顺手重写了 answer 也一律丢掉。正文已经定稿，
     *       重写只会带来「数字变了 / 详细回答被压缩」的风险；</li>
     *   <li><b>不走流式</b>：这一段只该产出 JSON，推到前端会让用户先看到一屏花括号；</li>
     *   <li><b>整体替换而非追加</b>：模型被要求输出完整 refs 列表，沿用它的编号才能保证
     *       正文里的 {@code [[n]]} 与事件一一对应；追加会出现两个 {@code [[1]]} 指向不同动作。</li>
     * </ul>
     *
     * <p>任何异常都退回原有事件：纠正是锦上添花，不能因此把一次正常回答变成失败。
     */
    private List<AgentUiEventVO> correctRefs(List<Map<String, Object>> messages, int historyEnd,
                                             List<AgentUiEventVO> events, List<String> rejects, String answer,
                                             String module) {
        try {
            List<Map<String, Object>> retry = new ArrayList<>(messages);
            retry.add(message(ROLE_ASSISTANT, answer));
            retry.add(message(ROLE_USER, """
                    你上一轮输出的 refs 中有条目被服务端校验拒绝：
                    %s
                    请只输出 JSON：{"refs":[...]}，不要重复 answer 正文，也不要解释。
                    refs 每项仍为 {id, type, target, label, args}：target 必须取自页面能力清单已列出的值，
                    id 只能是 1~9，参数必须符合清单标注的必填与枚举。
                    没有可用按钮就输出 {"refs":[]}。
                    """.formatted(String.join("\n", rejects))));
            ensureWithinBudget(retry, historyEnd, properties.getMaxToolRounds());
            String reply = qwenClient.chat(retry);
            String json = extractJsonObject(reply == null ? "" : reply.trim());
            if (json == null) {
                log.info("[agent] 事件纠正未返回 JSON，保留原有 {} 个按钮", events.size());
                return events;
            }
            List<AgentUiEventVO> corrected = uiCapabilityService.validateWithReasons(
                    parseRefs(objectMapper.readTree(json).path("refs")), module).events();
            if (corrected.isEmpty()) {
                log.info("[agent] 事件纠正未产出可用按钮，保留原有 {} 个", events.size());
                return events;
            }
            log.info("[agent] 事件纠正：拒绝 {} 条，替换为 {} 个可用按钮", rejects.size(), corrected.size());
            return corrected;
        } catch (Exception e) {
            log.warn("[agent] 事件纠正失败，保留原有事件：{}", e.getMessage());
            return events;
        }
    }

    /** 解析旧的 events 数组（兼容用，无引用编号） */
    private List<AgentUiEventVO> parseEvents(JsonNode eventsNode) {
        if (eventsNode == null || !eventsNode.isArray()) {
            return List.of();
        }
        List<AgentUiEventVO> events = new ArrayList<>();
        for (JsonNode eventNode : eventsNode) {
            AgentUiEventVO event = objectMapper.convertValue(eventNode, AgentUiEventVO.class);
            if (StringUtils.hasText(event.getType()) && StringUtils.hasText(event.getTarget())) {
                events.add(event);
            }
        }
        return events;
    }

    /**
     * 解析 {@code details} 明细块，并做一次服务端清洗。
     *
     * <p>为什么必须清洗：模型对表格结构的稳定性远差于对正文的稳定性，常见畸形包括
     * 行列数不齐、把整段说明塞进一个单元格、一次吐几十行、单元格里带 Markdown。
     */
    private List<AgentAnswerDetailVO> parseDetails(JsonNode detailsNode) {
        if (detailsNode == null || !detailsNode.isArray() || detailsNode.isEmpty()) {
            return List.of();
        }
        List<AgentAnswerDetailVO> details = new ArrayList<>();
        for (JsonNode block : detailsNode) {
            if (!block.isObject()) {
                continue;
            }
            List<String> head = stringList(block.path("head"), MAX_DETAIL_COLS);
            List<List<String>> rows = new ArrayList<>();
            JsonNode rowsNode = block.path("rows");
            if (rowsNode.isArray()) {
                for (JsonNode rowNode : rowsNode) {
                    if (rows.size() >= MAX_DETAIL_ROWS) {
                        break;
                    }
                    List<String> row = stringList(rowNode, MAX_DETAIL_COLS);
                    if (row.isEmpty()) {
                        continue;
                    }
                    if (!head.isEmpty()) {
                        while (row.size() < head.size()) {
                            row.add("");
                        }
                        if (row.size() > head.size()) {
                            row = new ArrayList<>(row.subList(0, head.size()));
                        }
                    }
                    rows.add(row);
                }
            }
            // 模型给了行却漏了表头：补一组占位列名，并把各行补齐到同一列数
            if (head.isEmpty() && !rows.isEmpty()) {
                int cols = rows.stream().mapToInt(List::size).max().orElse(1);
                head = new ArrayList<>();
                for (int i = 0; i < cols; i++) {
                    head.add("列" + (i + 1));
                }
                for (List<String> row : rows) {
                    while (row.size() < cols) {
                        row.add("");
                    }
                }
            }
            List<String> points = stringList(block.path("points"), MAX_DETAIL_POINTS);
            List<Integer> num = new ArrayList<>();
            JsonNode numNode = block.path("num");
            if (numNode.isArray()) {
                for (JsonNode n : numNode) {
                    if (num.size() < MAX_DETAIL_COLS && n.isNumber() && n.canConvertToInt()
                            && n.asInt() >= 0 && n.asInt() < MAX_DETAIL_COLS) {
                        num.add(n.asInt());
                    }
                }
            }
            String title = clip(block.path("title").asText(""), MAX_CELL_CHARS);
            String note = clip(block.path("note").asText(""), MAX_NOTE_CHARS);
            // 只有标题、既没表格也没要点的块没有渲染价值；也别让空块占掉块数名额
            if (head.isEmpty() && points.isEmpty()) {
                continue;
            }
            if (details.size() >= MAX_DETAIL_BLOCKS) {
                break;
            }
            details.add(AgentAnswerDetailVO.builder()
                    .title(StringUtils.hasText(title) ? title : null)
                    .head(head.isEmpty() ? null : head)
                    .rows(rows.isEmpty() ? null : rows)
                    .points(points.isEmpty() ? null : points)
                    .num(num.isEmpty() ? null : num)
                    .note(StringUtils.hasText(note) ? note : null)
                    .build());
        }
        return details;
    }

    /** 把 JSON 数组转成字符串列表；非文本节点退化成 JSON 文本，避免抛异常打断整轮回答 */
    private List<String> stringList(JsonNode node, int limit) {
        List<String> out = new ArrayList<>();
        if (node == null || !node.isArray()) {
            return out;
        }
        for (JsonNode item : node) {
            if (out.size() >= limit) {
                break;
            }
            out.add(clip(item.isValueNode() ? item.asText("") : item.toString(), MAX_CELL_CHARS));
        }
        return out;
    }

    private String clip(String text, int max) {
        if (text == null) {
            return "";
        }
        // 明细单元格不渲染角标，也不渲染 Markdown：把这两类残留符号清掉
        text = CITE_MARKER.matcher(text).replaceAll("").replace("**", "").replace("`", "");
        return text.length() <= max ? text : text.substring(0, max) + "…";
    }

    /** 取出回复里的 JSON 对象：剥掉代码块围栏与前后说明文字 */
    private String extractJsonObject(String reply) {
        int start = reply.indexOf('{');
        int end = reply.lastIndexOf('}');
        if (start < 0 || end <= start) {
            return null;
        }
        return reply.substring(start, end + 1);
    }

    /**
     * 从被截断的半截 JSON 里抢救 answer 正文。
     *
     * <p>答案变长后，输出撞上 max_tokens 的概率上升：这时整段没有收尾的 {@code }}，
     * ObjectMapper 必然解析失败，若直接把原文当用户答案，界面上会出现一坨 JSON 源码。
     * 复用流式增量解析器的字符串级抽取，把已经生成的 answer 前缀取回来（转义也一并还原）。
     * 抢救不出内容就退回原文，绝不丢掉用户本该看到的文字。
     */
    private ParsedFinal recoverTruncatedAnswer(String raw) {
        try {
            StreamingAnswerTap tap = new StreamingAnswerTap(AgentStreamSink.NOOP);
            tap.accept(raw);
            String text = tap.answerText();
            if (StringUtils.hasText(text)) {
                log.warn("[agent] 模型输出疑似被截断，已抢救 answer 字段 {} 字", text.length());
                return new ParsedFinal(text, List.of(), true, List.of());
            }
        } catch (Exception e) {
            log.debug("[agent] 截断回答抢救失败，沿用原文");
        }
        return new ParsedFinal(raw, List.of(), false, List.of());
    }

    /** 模型最终回答：正文 + UI 事件 + 是否约定 JSON（false 表示按原文降级） + 结构化明细 */
    private record ParsedFinal(String answer, List<AgentUiEventVO> events, boolean json,
                               List<AgentAnswerDetailVO> details) { }

    /**
     * 系统提示词模板：角色纪律与页面事件协议。
     *
     * <p>工具清单不再进提示词——原生 function calling 下它随请求体的 {@code tools}
     * 数组下发（含参数 JSON Schema 与返回字段说明），这里只保留使用纪律。
     * 页面能力清单（refs.target 白名单）仍由前端声明自动生成，新增页面不需要改这里。
     *
     * <p>占位符：%1$s 今天 / %2$d 最大工具轮数 / %3$s 工具清单状态说明 /
     * %4$d 今年 / %5$d 去年 / %6$s 页面能力清单 / %7$s 数据来源与引用规则（按通道开关动态生成）/
     * %8$s 会话模式说明（业务智能体会话注入，通用问答为空）。
     */
    private static final String SYSTEM_TEMPLATE = """
            你是水利业务数据查询助手，服务于取水监管系统，今天是%1$s。
            %8$s
            ## 一、角色与边界
            回答业务数据、解释概念、指出内容在系统哪个页面或位置。
            数字只能来自本轮工具返回，不凭记忆编造；页面动作只能写进 refs 由用户点击执行，
            你无法自己跳转、开弹框或高亮。答案正文是交付物，refs 与角标只是可选项，
            不得为凑引用压缩答案；refs 给空数组是正常输出。

            ## 二、工具使用纪律
            1. 需要实时数据、统计、明细、文档依据时发起工具调用；调哪个工具、调几轮由你自主决定，
               数据足够回答就立即停止调用并作答。单次提问最多 %2$d 轮工具往返。
            2. 工具参数按各工具的参数说明填写；required 必须给值，enum 只能取列举值。
               缺少必填参数且无法从对话历史确定时，先向用户追问，禁止猜值、禁止编数据。
            3. 工具结果以 tool 消息回传，末尾带【当前任务】：整个多轮过程始终对准该任务作答，
               拿到新数据后仍要回过头回答用户的原始问题，不要只解释最新一步的数据。
            4. 工具返回错误（失败 / 无权限 / 参数不合法）时如实向用户说明原因，
               不编数字、不换相近口径顶替、不换工具碰运气。
            5. 问「在哪看 / 哪个页面 / 位置」→ 调 ui.locate，禁止凭能力清单口头指路；
               问制度 / 条文 / 依据 → 调 kb.search（工具清单里有才可用，未接入时不要凭记忆编条文）。
            6. 寒暄、概念解释 → 直接作答，不调工具。
            工具清单状态：%3$s。

            ## 三、答案质量（优先级最高）
            **作答粒度：先对准问题，再决定展开多少（本条优先于下文所有「详细」要求）**
            - 只问总量（多少 / 合计 / 总共 / 累计）→ 只给总量、口径、单位与时间范围；最多补一句
              「如需按河流或监管单位拆分可以继续问」，不要主动附分组数据。
            - 问「分别 / 各…多少 / 排名 / 分布」→ 只展开被问到的那一个维度，不捎带另一个维度。
            - 一次回答 details 最多 1 块（用户明确要多维度对比时才 2 块），表格不超过 10 行；
              用户没问占比就不加占比列，没问明细就不逐条列记录。
            - 工具结果里出现多个维度时，未被问到的维度一律不列：多列不等于更专业，只会把结论淹没。
            1. 第一句直接给结论，不复述问题，不以「根据查询 / 好的」开头。
            2. answer 正文给「结论 + 关键数字 + 口径 / 时间范围 / 单位 / 来源（结果里有才写）+ 异常提醒」，
               本身就要是一段能独立读懂的完整回答；逐项数值与多条记录放到 details（格式见第四节），
               **正文和 details 不要重复罗列同一批数字**。可基于真实值算占比、同比、极值，算不出就不写；
               数据缺失或被条数截断要写明缺哪部分，不用别的数字补位。
            3. details 用来承载「多个数值 / 多条记录 / 构成拆分 / 对比」，让长答案变成表格而不是一大段编号文本：
               - 有并列数据时优先给表格（head + rows），一列一个字段；表头写清单位，如「许可水量(万m³)」。
               - 表格装不下的口径解释、注意事项放 points，表下限定说明放 note。
               - 结果里有多个对象时逐条列出，不要合并成「等 N 条」；确实放不下就写清总条数与未展开范围。
               - 单元格要么是查到的事实，要么写「片段未包含」；不要用「包含在目录中」「详见原文」
                 这类占位词把表格填满 —— 一行占位等于告诉用户「我知道这里该有内容，但我不给你」。
               - 单元格是纯文本：不要 Markdown、不要 [[n]] 角标、不要塞整段话（超长会被截断）。
            4. 口径严格对应：许可水量 ≠ 计划用水 ≠ 实际用水量，调水量 ≠ 用水量，水位 ≠ 水量。
               工具返回字段不是用户问的口径就当作查不到 → 直说「当前系统暂未接入「XXX」的数据，无法查询」，
               说明现有可查口径及区别，refs 给 []。禁止换算、类比、用最像的数字顶替；答错口径比答不出严重。
            5. 工具失败如实说明原因，不编数字、不换工具碰运气。**不要写「数据已按当前登录单位过滤」
               「已按权限过滤」这类说明句**——权限过滤是系统默认行为，用户不需要被告知；
               只在结果里出现具体单位或范围时才点明。不推断其他单位、不说「全国 / 全省」。
               口径说明只写与数字本身有关的内容（单位、批复量 / 计划量 / 实际用水量的区别），
               不写权限、系统行为、数据来源之类的套话。
            6. 「今年」=%4$d 年，「去年」=%5$d 年；追问未给年份时结合对话历史推断并在答案里点明。
            7. 正文纯文本分段（换行、1. 2. 3. 或 -），不用 Markdown 标题/表格/加粗；明细已在 details 里，
               不必在正文再编号列一遍。不写「点击下方按钮」等空话，不写「已为您打开 / 已跳转 / 已高亮」等完成语气。
            8. 具体到「能据此办事」的程度：问「有哪些 / 构成 / 包含什么 / 怎么规定」时，
               每一项都要给实质信息（名称 + 涉及范围、职责、措施、数量、时限中至少一项）。
               严禁用「包含在目录中」「详见原文」「同上」「内容较多」这类零信息占位凑行 ——
               那不是回答，只是把目录抄了一遍。
            9. 片段只覆盖目录 / 标题时，明确写「检索到的片段只包含目录，未包含该项的具体内容」，
               并指出可查看原文的哪一部分；宁可少列一项，也不要让用户以为已经答全。
               文档里没有的内容一律不补（不猜章节号、不假设常见做法）。

            ## 四、输出格式（字段顺序固定：answer 第一）
            最终回答必须且只能是一个 JSON 对象：
            {"answer":"给用户看的完整中文正文", "refs":[{"id":1,"type":"SPOTLIGHT","target":"能力清单里的键","label":"动宾短语","args":{}}], "details":[{"title":"分项明细","head":["口径","水量(万m³)"],"rows":[["河道外","24436"],["河道内","24436"]],"num":[1],"note":"表下注释（可选）"}]}
            - **answer 必须排第一个字段**，refs 第二，details 最后。前端流式逐字展示 answer，
              把它放后面会让用户多等一整段表格生成完才看到第一个字。
            - answer：完整可读的中文正文，可含换行分段，是回答的主体。
            - refs：可选的页面引导，找不到合适 target 时给 []。
            - details：可选的结构化明细，没有并列数据时给 []，绝不为了填它编造数据。最多 4 块，
              每块最多 30 行 8 列；一个块可以只有表格（head + rows）、只有要点（points），或两者都有：
              {"title":"口径说明","points":["许可水量是取水许可批复量","与年度用水计划不同"]}
              title 是小节标题，note 是表下注释，num 是数值列索引（从 0 开始，前端右对齐加粗）。
            - 正文提到可定位的数字或对象时紧跟 [[n]]，n 对应 refs 里的 id，从 1 连续编号；一问多答时每个数各带标记。
              角标只写在正文，不要写进 details 的单元格。
            - target 只能取第五节页面能力清单里的键，不编造键名或路由；最多 3 条，每条都要有动宾短语 label。
            - 类型：数字/元素 → SPOTLIGHT；弹框 → DIALOG；筛选/搜索/切日期 → COMMAND；整页 → NAVIGATE。
              同一数字优先 SPOTLIGHT；DIALOG / COMMAND 的必填参数要全且落在枚举内，否则该条会被丢弃。
            - 多步操作给多条 ref，由用户逐个点，不假设自动连续执行。

            ## 五、页面能力清单（refs.target 只能取这里的键）
            %6$s

            ## 六、数据来源与引用规则（由当前通道开关动态生成）
            %7$s
            """;

    private String buildSystemPrompt(String module) {
        LocalDate today = LocalDate.now();
        String toolHint = toolRegistry.isEmpty()
                ? "当前没有可用工具，遇到需要数据的问题请如实说明无法查询"
                : "可用工具已随请求下发，参数与返回字段见各工具定义";
        String capabilities = uiCapabilityService.describeForPrompt(module);
        return SYSTEM_TEMPLATE.formatted(
                todayText(today),
                properties.getMaxToolRounds(),
                toolHint,
                today.getYear(),
                today.getYear() - 1,
                capabilities == null ? "（页面能力清单暂不可用，refs 给空数组）" : capabilities,
                sourcePolicySection(),
                sessionModeSection(module));
    }

    /**
     * 会话模式说明：业务智能体会话（module 非空）注入职责边界声明，通用问答为空串。
     *
     * <p>工具与页面清单已按 module 裁剪，这段话让模型知道「为什么清单里没有别的」：
     * 超出模块范围的问题应如实说明并引导用户使用通用问答，而不是拿模块内的能力硬答。
     */
    private String sessionModeSection(String module) {
        if (!StringUtils.hasText(module)) {
            return "";
        }
        return "\n本次为业务智能体会话（module=" + module + "）：只围绕本业务模块回答与引导，"
                + "本轮可用的工具与页面均已按模块裁剪，清单之外的工具/页面不可用也不可编造。"
                + "用户的问题超出本模块业务范围时，如实说明「该问题超出本智能体的业务范围，"
                + "建议使用通用问答」，不要用模块内相近的数据或页面顶替作答。\n";
    }

    /**
     * 第六节「数据来源与引用规则」按两个通道开关动态生成。
     *
     * <p>融合发生在编排层，而提示词必须如实反映当前<b>实际接入</b>了哪些通道：
     * 知识侧关闭时绝不能让模型去找 kb.search 或引用不存在的文档条文；
     * 两侧都开时才给出冲突裁决规则。这段文本进的是第一条 system 消息，
     * 不额外插 system（上游对「system 必须在开头」是硬校验）。
     */
    private String sourcePolicySection() {
        boolean toolsOn = properties.getTools().isEnabled();
        boolean knowledgeOn = properties.getKnowledge().isEnabled();
        if (!toolsOn && !knowledgeOn) {
            return "本轮未接入任何外部数据通道：不要调用工具，也不要给出业务数字或引用文档条文。"
                    + "只回答概念、寒暄与一般性说明，不确定就如实说明。";
        }
        StringBuilder section = new StringBuilder();
        if (toolsOn && knowledgeOn) {
            section.append("本轮同时接入两条独立通道，工具结果开头带 source 标记：\n")
                    .append("- source=api：业务接口实时数据，带查询时间，是数值 / 状态 / 统计的唯一权威来源。\n")
                    .append("- source=kb：知识库文档原文片段，带文件名与章节路径，用于制度、流程、条文、")
                    .append("编制目的、职责分工、历史记载与口径解释。\n")
                    .append("冲突裁决（必须遵守）：\n")
                    .append("1. 数值、状态、统计以 api 为准，文档不得覆盖；文档只用来解释口径、定义与依据。\n")
                    .append("2. 制度、流程、条文、操作步骤以 kb 为准，接口可补当前值。\n")
                    .append("3. 两者冲突时在答案里显式并列：「实时数据 X（接口，查询时间 …），")
                    .append("文档记载 Y（《…》第…章，可能滞后）」，禁止静默挑一个，也不许自行调和。\n")
                    .append("4. 任一通道无结果，如实说明该来源未查到，不许拿另一通道的内容顶替作答。\n")
                    .append("5. 复合问题可先后调数据工具与 kb.search；两路结果分别按各自编号引用，")
                    .append("每个事实性结论都要能追溯到具体来源。\n");
        } else if (knowledgeOn) {
            section.append("本轮只接入知识库通道（工具侧未接入）：所有事实性内容只能来自 kb.search 返回的原文片段，")
                    .append("引用时写明文件名与章节，片段不足就如实说明未检索到。\n")
                    .append("用户问实时业务数值时要明确说明当前未接入数据接口，不要用文档里的历史数字冒充实时值。\n");
        } else {
            section.append("本轮只接入业务数据接口（知识侧未接入）：所有事实性结论只能来自工具返回。\n")
                    .append("不要引用制度条文、章节号或文档出处，不要声称「根据文档 / 依据某条」，")
                    .append("也不要凭记忆补写规定；用户问制度依据时如实说明当前未接入知识库。\n");
        }
        section.append("引用编号统一：页面动作（refs[].id）用 [[1]]~[[9]]；");
        if (knowledgeOn) {
            section.append("文档依据用 [[").append(KB_CITE_BASE)
                    .append("]] 起，n 必须取工具返回 matches[].n 的实际值；");
        }
        section.append("没有对应来源的编号不要写，服务端会清理死链角标。\n")
                .append("答案正文仍是交付物：不要为了凑引用压缩内容，没有合适引用就给空 refs。");
        return section.toString();
    }

    private String todayText(LocalDate date) {
        return date.getYear() + "年" + date.getMonthValue() + "月" + date.getDayOfMonth() + "日";
    }

    /** 会话 ID 缺省时按用户生成，保证同一用户默认共用一个上下文 */
    private String resolveSessionId(String sessionId, LoginUserDTO user) {
        if (StringUtils.hasText(sessionId)) {
            return sessionId.trim();
        }
        String userCode = user == null || !StringUtils.hasText(user.getUserCode())
                ? "anonymous" : user.getUserCode();
        return userCode + "-default";
    }

    private Map<String, Object> message(String role, String content) {
        return Map.of("role", role, "content", content);
    }
}
