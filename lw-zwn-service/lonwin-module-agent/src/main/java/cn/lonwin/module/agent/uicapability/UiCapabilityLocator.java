package cn.lonwin.module.agent.uicapability;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import cn.lonwin.module.agent.model.vo.AgentUiEventVO;
import lombok.RequiredArgsConstructor;

/**
 * 「这个东西在系统里的哪个位置」检索器。
 *
 * <p>为什么单独做一个确定性检索，而不是把页面清单直接丢给模型让它自己找：
 * 能力清单有几十个 target 时，模型经常把键名记错、或者编一个看起来很像的 target，
 * 结果被白名单丢掉、按钮直接消失。这里把「找位置」变成一次字面匹配 + 服务端生成事件，
 * 模型只负责组织语言，target 由服务端给出，从根上避免编造。
 *
 * <p>匹配是字面级（包含关系），不做向量检索——能力声明的 desc 本身就写成
 * 「用户问 XXX 时高亮它」这种句式，字面匹配的命中率已经够用，且零依赖、可解释。
 */
@Component
@RequiredArgsConstructor
public class UiCapabilityLocator {

    /** 常见噪声词：用户/模型会把「许可证数量在哪个页面」整句当关键词，剥离后再匹配一次 */
    private static final List<String> NOISE_WORDS = List.of(
            "在系统中", "在系统", "系统里", "在哪里", "在哪儿", "在哪个页面", "哪个页面", "在哪里看",
            "在哪看", "哪里看", "的位置", "位置", "页面", "怎么查看", "怎么查", "查看", "看一下",
            "有多少", "多少个", "多少", "数量", "总数", "个数", "情况", "信息", "数据", "明细", "功能");

    /** 页面级命中的加权：问「XX 在哪」时优先给整页跳转，而不是只高亮某一行 */
    private static final int PAGE_BONUS = 20;

    /** 单次最多返回的按钮数：再多用户也点不过来，还会把回答撑得很长 */
    private static final int MAX_HITS = 8;

    /** 定位类问句的识别词：命中即认为用户在问「这东西在哪」 */
    private static final List<String> LOCATE_INTENT_WORDS = List.of(
            "位置", "在系统", "在哪", "哪里看", "哪个页面", "哪些页面", "导航");

    /** 从整句里剥出对象时要丢掉的疑问词与虚词（长词在前，避免被单字先拆坏） */
    private static final List<String> QUESTION_WORDS = List.of(
            "在系统中的", "在系统里的", "在系统的", "系统中", "系统里", "系统", "提供",
            "都有哪些", "有哪些", "哪个页面", "哪些页面", "哪里看", "在哪儿", "在哪里", "在哪",
            "页面", "位置", "导航", "告诉我", "我想知道", "请问", "一下", "知道", "告诉",
            "哪个", "哪里", "的", "在", "里", "我", "想", "看", "找", "吗", "呢", "？", "?", "，", ",", "。", "、");

    private final UiCapabilityService uiCapabilityService;

    /** 一条定位结果 */
    public record Hit(String keyword, String type, String target, String route,
                      String pageTitle, String label, String desc) { }

    /** 一次定位的完整结果：命中的条目 + 没找到的关键词 */
    public record LocateResult(List<Hit> hits, List<String> missing) {

        public boolean found() {
            return !hits.isEmpty();
        }
    }

    /**
     * 是否为「在系统中的位置」类提问。
     *
     * <p>模型偶尔不调工具、直接凭能力清单口头指路（甚至编个路由），
     * 服务端用它兜底识别，保证这类问题一定有按钮或明确的「无匹配」答复。
     */
    public static boolean isLocateQuestion(String question) {
        if (!StringUtils.hasText(question)) {
            return false;
        }
        return LOCATE_INTENT_WORDS.stream().anyMatch(question::contains);
    }

    /**
     * 从问句里剥出要定位的对象；剥不干净返回 null（调用方走页面导航总览）。
     *
     * <p>宁可返回 null 走总览，也不要拿一个被剥坏的词去匹配然后回答「找不到」。
     */
    public static String extractKeyword(String question) {
        if (!StringUtils.hasText(question)) {
            return null;
        }
        String text = question;
        for (String noise : QUESTION_WORDS) {
            text = text.replace(noise, "");
        }
        text = text.trim();
        return text.length() >= 2 ? text : null;
    }

    /**
     * 检索关键词对应的页面/元素位置（通用问答，不限模块）。
     *
     * @see #locate(String, String)
     */
    public LocateResult locate(String keywords) {
        return locate(keywords, null);
    }

    /**
     * 检索关键词对应的页面/元素位置（带模块约束）。
     *
     * @param keywords 用户关心的名词，多个用顿号/逗号分隔；
     *                 <b>为空时返回页面导航总览</b>（每个页面一个跳转），
     *                 用于「提供在系统中的位置」这类不带具体对象的提问
     * @param module   业务模块（智能体键）：非空时只在「本模块 + 公共页面」里检索。
     *                 指定智能体调 ui.locate 时必须传，否则会检索出其他模块的页面并生成
     *                 引导事件——提示词清单裁剪得再好也会从这里漏出去。通用问答传 null。
     */
    public LocateResult locate(String keywords, String module) {
        List<String> terms = splitTerms(keywords);
        if (terms.isEmpty()) {
            return locateAll(module);
        }
        List<Hit> hits = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        for (String term : terms) {
            Hit hit = bestHit(term, module);
            if (hit == null) {
                missing.add(term);
            } else {
                hits.add(hit);
            }
        }
        return new LocateResult(hits, missing);
    }

    /** 页面导航总览：不指定对象时，把可见页面逐个列出来（只列当前用户有权限且属于该模块范围的） */
    public LocateResult locateAll(String module) {
        List<Hit> hits = new ArrayList<>();
        for (UiPageCapability page : uiCapabilityService.scopedVisible(module)) {
            if (hits.size() >= MAX_HITS) {
                break;
            }
            hits.add(new Hit(page.getTitle(), AgentUiEventVO.TYPE_NAVIGATE, page.getRoute(), page.getRoute(),
                    page.getTitle(), "前往「" + page.getTitle() + "」", page.getTitle()));
        }
        return new LocateResult(hits, List.of());
    }

    /**
     * 把命中结果转成 UI 事件（NAVIGATE / SPOTLIGHT / DIALOG / COMMAND）。
     *
     * <p>带必填参数的弹框或命令<b>降级为页面跳转</b>：缺参数的事件会被白名单校验丢掉，
     * 用户点了没反应比少一个按钮更糟。
     */
    public List<AgentUiEventVO> toEvents(LocateResult result) {
        List<AgentUiEventVO> events = new ArrayList<>();
        for (Hit hit : result.hits()) {
            events.add(AgentUiEventVO.builder()
                    .type(hit.type())
                    .target(hit.target())
                    .label(hit.label())
                    .build());
        }
        return events;
    }

    /** 给模型读的结构化结果（含 events，便于模型原样引用，也供服务端兜底） */
    public Map<String, Object> toData(LocateResult result) {
        List<Map<String, Object>> matches = new ArrayList<>();
        for (Hit hit : result.hits()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("keyword", hit.keyword());
            item.put("type", hit.type());
            item.put("target", hit.target());
            item.put("route", hit.route());
            item.put("pageTitle", hit.pageTitle());
            item.put("label", hit.label());
            item.put("desc", hit.desc());
            matches.add(item);
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("count", result.hits().size());
        data.put("matches", matches);
        data.put("missing", result.missing());
        data.put("events", toEvents(result).stream().map(this::eventMap).toList());
        return data;
    }

    /** 一句话摘要：让模型不必解析 JSON 也能写对回答 */
    public String toSummary(LocateResult result) {
        List<String> parts = new ArrayList<>();
        for (Hit hit : result.hits()) {
            String where = AgentUiEventVO.TYPE_NAVIGATE.equals(hit.type())
                    ? "在页面「" + hit.pageTitle() + "」（" + hit.route() + "）"
                    : "在页面「" + hit.pageTitle() + "」（" + hit.route() + "）的 " + hit.target() + " 位置";
            parts.add("「" + hit.keyword() + "」" + where);
        }
        String found = String.join("；", parts);
        if (result.missing().isEmpty()) {
            return found;
        }
        String miss = "「" + String.join("、", result.missing()) + "」未找到匹配的页面或功能";
        return found.isEmpty() ? miss : found + "；" + miss;
    }

    // ==================== 匹配实现 ====================

    /** 单个关键词取最高分命中；同分时保留先出现的（即页面声明顺序） */
    private Hit bestHit(String keyword, String module) {
        String term = normalize(keyword);
        if (term.length() < 2) {
            return null;
        }
        Hit best = null;
        int bestScore = 0;
        // 只在「当前用户可见且属于该模块范围」的页面里检索：命中无权限或其他模块的页面
        // 会生成点不动/不该引导的按钮，且这类事件会被白名单丢掉，
        // 等于白检索一次还让回答少了按钮
        for (UiPageCapability page : uiCapabilityService.scopedVisible(module)) {
            // 1. 页面本身（标题包含关键词 → 直接给整页跳转）
            // 注意：只有标题真的命中才加页面加权，否则任何关键词都会命中第一个页面
            int titleScore = score(term, page.getTitle());
            if (titleScore > 0) {
                int pageScore = titleScore + PAGE_BONUS;
                if (pageScore > bestScore) {
                    bestScore = pageScore;
                    best = new Hit(keyword, AgentUiEventVO.TYPE_NAVIGATE, page.getRoute(), page.getRoute(),
                            page.getTitle(), "前往「" + page.getTitle() + "」", page.getTitle());
                }
            }
            // 2. 弹框（有必填参数时降级为跳页）
            for (UiPageCapability.Dialog dialog : safe(page.getDialogs())) {
                int scoreValue = score(term, dialog.getDesc()) + targetScore(term, dialog.getTarget());
                if (scoreValue > bestScore) {
                    bestScore = scoreValue;
                    best = dialogHit(keyword, page, dialog);
                }
            }
            // 3. 命令（同上）
            for (UiPageCapability.Command command : safe(page.getCommands())) {
                int scoreValue = score(term, command.getDesc()) + targetScore(term, command.getTarget());
                if (scoreValue > bestScore) {
                    bestScore = scoreValue;
                    best = commandHit(keyword, page, command);
                }
            }
            // 4. 锚点 → 高亮
            for (UiPageCapability.Anchor anchor : safe(page.getAnchors())) {
                int scoreValue = score(term, anchor.getDesc()) + targetScore(term, anchor.getTarget());
                if (scoreValue > bestScore) {
                    bestScore = scoreValue;
                    best = new Hit(keyword, AgentUiEventVO.TYPE_SPOTLIGHT, anchor.getTarget(), page.getRoute(),
                            page.getTitle(), "定位「" + shortName(anchor.getDesc(), anchor.getTarget()) + "」",
                            anchor.getDesc());
                }
            }
        }
        return best;
    }

    private Hit dialogHit(String keyword, UiPageCapability page, UiPageCapability.Dialog dialog) {
        String label = "打开" + shortName(dialog.getDesc(), dialog.getTarget());
        if (hasRequiredParam(dialog.getParams())) {
            // 缺必填参数的事件会被白名单丢弃，降级成「跳到该页」
            return new Hit(keyword, AgentUiEventVO.TYPE_NAVIGATE, page.getRoute(), page.getRoute(),
                    page.getTitle(), "前往「" + page.getTitle() + "」", dialog.getDesc());
        }
        return new Hit(keyword, AgentUiEventVO.TYPE_DIALOG, dialog.getTarget(), page.getRoute(),
                page.getTitle(), label, dialog.getDesc());
    }

    private Hit commandHit(String keyword, UiPageCapability page, UiPageCapability.Command command) {
        if (hasRequiredParam(command.getParams())) {
            return new Hit(keyword, AgentUiEventVO.TYPE_NAVIGATE, page.getRoute(), page.getRoute(),
                    page.getTitle(), "前往「" + page.getTitle() + "」", command.getDesc());
        }
        return new Hit(keyword, AgentUiEventVO.TYPE_COMMAND, command.getTarget(), page.getRoute(),
                page.getTitle(), shortName(command.getDesc(), command.getTarget()), command.getDesc());
    }

    /** 文本包含关键词的得分；关键词整句过长时按比例摊平，避免「XX 在哪个页面」这类句子拿高分 */
    private int score(String keyword, String text) {
        if (!StringUtils.hasText(text) || !StringUtils.hasText(keyword)) {
            return 0;
        }
        if (text.contains(keyword)) {
            return 60 + Math.min(keyword.length() * 4, 30);
        }
        // 反向包含：关键词是「许可证数量在哪个页面」，text 是「证照总数」这类短词时匹配不上，
        // 由 normalize 剥离噪声后再试一次（见 bestHit 的调用链）
        if (keyword.contains(text) && text.length() >= 2) {
            return 50;
        }
        return 0;
    }

    /** target 键本身命中的加权（用户可能直接说英文键或半截键名） */
    private int targetScore(String keyword, String target) {
        if (!StringUtils.hasText(target)) {
            return 0;
        }
        if (target.equalsIgnoreCase(keyword)) {
            return 40;
        }
        return target.toLowerCase().contains(keyword.toLowerCase()) ? 20 : 0;
    }

    /** 剥离噪声词，避免整句当关键词导致匹配不上 */
    private String normalize(String keyword) {
        String text = keyword == null ? "" : keyword.trim();
        for (String noise : NOISE_WORDS) {
            text = text.replace(noise, "");
        }
        return text.trim();
    }

    private List<String> splitTerms(String keywords) {
        List<String> terms = new ArrayList<>();
        if (!StringUtils.hasText(keywords)) {
            return terms;
        }
        for (String raw : keywords.split("[、,，;；/\\s]+")) {
            String term = normalize(raw);
            if (term.length() >= 2) {
                terms.add(raw.trim());
            }
        }
        return terms;
    }

    /** 从 desc 里取一个短名：优先「」内的内容，否则截断 */
    private String shortName(String desc, String fallback) {
        if (StringUtils.hasText(desc)) {
            int start = desc.indexOf('「');
            int end = desc.indexOf('」', start + 1);
            if (start >= 0 && end > start) {
                return desc.substring(start + 1, end);
            }
            return desc.length() > 10 ? desc.substring(0, 10) : desc;
        }
        return fallback;
    }

    private boolean hasRequiredParam(List<UiPageCapability.Param> params) {
        return safe(params).stream().anyMatch(p -> Boolean.TRUE.equals(p.getRequired()));
    }

    private <T> List<T> safe(List<T> list) {
        return list == null ? List.of() : list;
    }

    private Map<String, Object> eventMap(AgentUiEventVO event) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("type", event.getType());
        item.put("target", event.getTarget());
        item.put("label", event.getLabel());
        return item;
    }
}
