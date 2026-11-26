package cn.lonwin.module.agent.preprocess;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import cn.lonwin.module.agent.uicapability.UiCapabilityLocator;

/**
 * 用户问题预处理：在组装模型消息之前，把口语化、带噪声的问题整理成「干净问题 + 结构化解析」。
 *
 * <h3>为什么需要这一层</h3>
 * 用户实际输入很少是标准问法：「麻烦你帮我看看去年河道外许可水量是多少啊，谢谢」、
 * 「２０２６ 年 取水户 有多少？」、「许可水量在系统哪里看？」
 * 这些句子直接丢给模型会带来三类误差：
 * <ul>
 *   <li><b>噪声占 token</b>：礼貌语、重复标点、全角字符挤占上下文，few-shot 里的问法反而被稀释；</li>
 *   <li><b>相对时间歧义</b>：「去年」「前年」要靠模型自己换算，追问时不带年份更容易算错年份；</li>
 *   <li><b>口径漂移</b>：一句话里出现多个指标词时，模型容易抓错主口径（问河道外答成总量）。</li>
 * </ul>
 *
 * <h3>边界：只做「清理 + 标注」，不做「改写」</h3>
 * 不改写业务语义——不把「许可证数量」翻译成「证照总数」，不补全省略的主语，
 * 也不删掉看不懂的词。原因：口径误判比答不出来更危险（见 {@code notFor} 的教训），
 * 而改写是不可审计的。这里只做确定性的字符级清理，外加可解释的结构化标注：
 * <ul>
 *   <li>{@code text}：清理后的问题，用于工具调用、口径拦截、位置检索；</li>
 *   <li>{@code year}：解析出的年份（今年/去年/前年/明年/显式四位年份）；</li>
 *   <li>{@code metrics}：命中的业务口径词（词表由工具声明的 {@code forMetrics} 提供）；</li>
 *   <li>{@code intent}：意图分类（查数 / 找位置 / 页面操作 / 闲聊）。</li>
 * </ul>
 * 清理后的原文也一并保留在 {@link Normalized#original()}，随解析结果一起给模型，
 * 保证「清洗疑似误伤」时模型仍能看到用户原话。
 */
@Component
public class QuestionNormalizer {

    /** 意图：决定模型第一步该干什么（取数 / 定位 / 给操作按钮 / 直接回答） */
    public enum Intent {
        /** 查业务数据：必须先调工具取数 */
        DATA,
        /** 问「在系统哪里」：必须先调 ui.locate */
        LOCATE,
        /** 页面操作：打开弹框、跳转、切换日期等，只能给按钮 */
        OPERATE,
        /** 寒暄、概念解释：不需要工具 */
        CHAT
    }

    /** 预处理结果：原始问题 + 清理后问题 + 结构化解析 */
    public record Normalized(String original, String text, Integer year, List<String> metrics, Intent intent) {

        /** 问题是否被清理过（用于判断要不要把原文也告诉模型） */
        public boolean changed() {
            return !text.equals(original);
        }

        /** 是否有值得告诉模型的解析结果 */
        public boolean hasHints() {
            return changed() || year != null || !metrics.isEmpty();
        }
    }

    /** 零宽字符与 BOM：从网页/文档复制过来时常见，肉眼不可见但会打断关键词匹配 */
    private static final Pattern INVISIBLE = Pattern.compile("[\\u200B-\\u200F\\u2060\\uFEFF]");

    /** 各类空白（含全角空格、不换行空格）统一成一个半角空格 */
    private static final Pattern WHITESPACE = Pattern.compile("[\\s\\u00A0\\u3000]+");

    /**
     * 句首礼貌语/口头语。
     *
     * <p>刻意不收单字「请」「帮」「我」：像「请示流程」「帮助文档」「自我评价指标」这类
     * 以它们开头的业务问题会被误伤，改写成另一个问题比不清理更糟。
     */
    private static final Pattern LEADING_NOISE = Pattern.compile(
            "^(?:请问一下|请问|请教一下|请教|麻烦你|麻烦|劳驾|您好|你好|"
                    + "我想问一下|我想问问|我想问|我想知道|我想了解一下|我想了解|我想看看|我想看一下|"
                    + "想问一下|想问|问一下|了解一下|了解一下情况|"
                    + "帮我看看|帮我查一下|帮我查查|帮我查|帮我|帮忙|"
                    + "请帮我看看|请帮我查一下|请帮我|请帮忙|"
                    + "看一下|看下|看看|查一下|查查)+");

    /** 句尾礼貌语：删掉仍保留句末标点，避免把「是多少？」变成「是多少」 */
    private static final Pattern TRAILING_NOISE = Pattern.compile(
            "(?:谢谢你|谢谢|多谢|感谢|麻烦了|麻烦你|好吗|行吗|可以吗|拜托了|拜托)([。！？!?~]*)$");

    /** 句尾语气词（啊/呢/吧…）：同上，标点保留 */
    private static final Pattern TRAILING_MOOD = Pattern.compile("([啊呀呢吧哦噢啦嘛]+)([。！？!?]*)$");

    /** 重复标点：？？？ ！！ 等 */
    private static final Pattern REPEAT_PUNCT = Pattern.compile("([，。！？、；：,.!?;:])\\1+");

    /** 清理后可能残留的首尾标点/分隔符 */
    private static final Pattern EDGE_PUNCT =
            Pattern.compile("^[\\s，、；：,;:。！？!?…]+|[\\s，、；：,;:…]+$");

    /** 显式年份（避免把 53631 这类数字里的四位当成年份） */
    private static final Pattern EXPLICIT_YEAR = Pattern.compile("(?<!\\d)(20\\d{2})(?!\\d)");

    /** 页面操作类意图词 */
    private static final List<String> OPERATE_WORDS = List.of(
            "打开", "跳转", "带我去", "切换", "筛选", "进入", "前往", "弹出", "点开", "定位到", "详情");

    /** 数量类疑问词：出现即说明用户要的是数字，优先级高于「详情/打开」这类操作词 */
    private static final List<String> DATA_WORDS = List.of(
            "多少", "几个", "几套", "几条", "几位", "数量", "统计", "数据", "总数", "合计", "同比", "环比", "占比");

    /**
     * 规范化问题。
     *
     * @param raw              用户原始输入，可为 null
     * @param metricVocabulary 业务口径词表（由工具声明的 {@code forMetrics} 汇总），用于标注命中的口径
     */
    public Normalized normalize(String raw, List<String> metricVocabulary) {
        String original = raw == null ? "" : raw.trim();
        String text = clean(original);
        // 全被清掉（例如整句都是「？？？」）时退回原文：宁可让模型看到噪声，也不要给一个空问题
        if (!StringUtils.hasText(text)) {
            text = original;
        }
        List<String> metrics = matchMetrics(text, metricVocabulary);
        return new Normalized(original, text, resolveYear(text, LocalDate.now()),
                metrics, detectIntent(text, metrics));
    }

    /** 关闭预处理时的直通实现：不做任何清洗，也不产生解析提示 */
    public Normalized identity(String raw) {
        String original = raw == null ? "" : raw.trim();
        return new Normalized(original, original, null, List.of(), Intent.CHAT);
    }

    /**
     * 生成给模型的「问题解析」说明；没有可说的内容时返回 null（不必白占 token）。
     */
    public String brief(Normalized normalized) {
        if (normalized == null || !normalized.hasHints()) {
            return null;
        }
        StringBuilder text = new StringBuilder("以下是系统对本轮用户提问的预处理结果（只做清理与解析，不改变原意）：\n");
        if (normalized.changed()) {
            text.append("- 用户原话：").append(normalized.original()).append('\n');
            text.append("- 规范化后：").append(normalized.text()).append('\n');
        } else {
            text.append("- 用户问题：").append(normalized.text()).append('\n');
        }
        if (normalized.year() != null) {
            text.append("- 识别年份：").append(normalized.year())
                    .append("（调用工具时 year 直接用这个值，不要再自己推算）\n");
        }
        if (!normalized.metrics().isEmpty()) {
            text.append("- 命中的业务口径：").append(String.join("、", normalized.metrics()))
                    .append("（回答只能用这些口径；工具不覆盖就如实说明查不到）\n");
        }
        text.append("- 意图：").append(intentText(normalized.intent())).append('\n');
        text.append("以上仅用于辅助判断，用户问题本身仍以「").append(normalized.text()).append("」为准。");
        return text.toString();
    }

    // ==================== 清理 ====================

    private String clean(String text) {
        String cleaned = INVISIBLE.matcher(text).replaceAll("");
        cleaned = toHalfWidth(cleaned);
        cleaned = WHITESPACE.matcher(cleaned).replaceAll(" ");
        cleaned = trimNoise(cleaned);
        cleaned = REPEAT_PUNCT.matcher(cleaned).replaceAll("$1");
        cleaned = EDGE_PUNCT.matcher(cleaned).replaceAll("");
        return WHITESPACE.matcher(cleaned).replaceAll(" ").trim();
    }

    /** 依次剥掉句首礼貌语与句尾礼貌语/语气词，剥完再收拾一次残留标点 */
    private String trimNoise(String text) {
        String cleaned = text;
        for (int i = 0; i < 3; i++) {
            String before = cleaned;
            cleaned = LEADING_NOISE.matcher(cleaned).replaceFirst("");
            cleaned = TRAILING_NOISE.matcher(cleaned).replaceFirst("$1");
            cleaned = TRAILING_MOOD.matcher(cleaned).replaceFirst("$2");
            cleaned = EDGE_PUNCT.matcher(cleaned).replaceAll("");
            cleaned = cleaned.trim();
            if (cleaned.equals(before)) {
                break;
            }
        }
        return cleaned;
    }

    /**
     * 全角数字/字母/常见分隔符转半角。
     *
     * <p>不只是「好看」：日期里的全角连字符（２０２６－０９－０３）会让
     * {@code yyyy-MM-dd} 的解析与匹配全部失配，工具参数就传不进去。
     */
    private String toHalfWidth(String text) {
        char[] chars = text.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            if (c >= '\uFF10' && c <= '\uFF19') {
                chars[i] = (char) (c - '\uFF10' + '0');
            } else if (c >= '\uFF21' && c <= '\uFF3A') {
                chars[i] = (char) (c - '\uFF21' + 'A');
            } else if (c >= '\uFF41' && c <= '\uFF5A') {
                chars[i] = (char) (c - '\uFF41' + 'a');
            } else {
                chars[i] = switch (c) {
                    case '\uFF0D', '\u2010', '\u2011', '\u2012', '\u2013', '\u2014' -> '-';
                    case '\uFF0F' -> '/';
                    case '\uFF1A' -> ':';
                    case '\uFF0E' -> '.';
                    case '\uFF0B' -> '+';
                    default -> c;
                };
            }
        }
        return new String(chars);
    }

    // ==================== 解析 ====================

    /**
     * 解析年份。
     *
     * <p>顺序很关键：「前年」必须先于「去年」判断（子串互不含，但都含「年」），
     * 显式年份优先于相对词——用户既然写了 2025，就不该被同一句里的「去年」覆盖。
     */
    private Integer resolveYear(String text, LocalDate today) {
        Matcher explicit = EXPLICIT_YEAR.matcher(text);
        if (explicit.find()) {
            return Integer.valueOf(explicit.group(1));
        }
        if (text.contains("前年")) {
            return today.getYear() - 2;
        }
        if (text.contains("去年") || text.contains("上年") || text.contains("上一年")) {
            return today.getYear() - 1;
        }
        if (text.contains("明年")) {
            return today.getYear() + 1;
        }
        if (text.contains("今年") || text.contains("本年") || text.contains("当年") || text.contains("这年")) {
            return today.getYear();
        }
        return null;
    }

    /** 命中问句的口径词。长词优先入列，保证「总许可水量」不会被当成「许可水量」的重复 */
    private List<String> matchMetrics(String text, List<String> vocabulary) {
        if (!StringUtils.hasText(text) || vocabulary == null || vocabulary.isEmpty()) {
            return List.of();
        }
        List<String> hits = new ArrayList<>();
        for (String metric : vocabulary) {
            if (StringUtils.hasText(metric) && text.contains(metric) && !hits.contains(metric)) {
                hits.add(metric);
            }
        }
        hits.sort((a, b) -> b.length() - a.length());
        return List.copyOf(hits);
    }

    /**
     * 意图识别，顺序即优先级：
     * <ol>
     *   <li>定位优先：问「在哪」的句子里经常也带「多少」（「有多少个页面能看许可水量」），先判定位；</li>
     *   <li>数量疑问词：要的是数字，哪怕句子里同时出现「详情/打开」；</li>
     *   <li>操作动词：打开弹框、切页、筛选；</li>
     *   <li>命中业务口径：说明在问某个指标，即使没有「多少」（「去年调水量」）；</li>
     *   <li>其余按普通对话处理。</li>
     * </ol>
     */
    private Intent detectIntent(String text, List<String> metrics) {
        if (!StringUtils.hasText(text)) {
            return Intent.CHAT;
        }
        if (UiCapabilityLocator.isLocateQuestion(text)) {
            return Intent.LOCATE;
        }
        if (DATA_WORDS.stream().anyMatch(text::contains)) {
            return Intent.DATA;
        }
        if (OPERATE_WORDS.stream().anyMatch(text::contains)) {
            return Intent.OPERATE;
        }
        if (!metrics.isEmpty()) {
            return Intent.DATA;
        }
        return Intent.CHAT;
    }

    private String intentText(Intent intent) {
        return switch (intent) {
            case DATA -> "查业务数据（必须先调工具取数，再作答）";
            case LOCATE -> "找系统位置（必须先调 ui.locate，再按返回结果给按钮）";
            case OPERATE -> "页面操作（只能给可点击事件，不能声称已执行）";
            case CHAT -> "普通对话（不需要工具）";
        };
    }
}
