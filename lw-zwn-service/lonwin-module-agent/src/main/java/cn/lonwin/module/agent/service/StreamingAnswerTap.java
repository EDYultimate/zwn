package cn.lonwin.module.agent.service;

/**
 * 把「模型流式吐出的原始文本」变成「可以直接给用户看的逐字增量」。
 *
 * <p>一轮模型输出可能是三种东西之一：
 * <ol>
 *   <li>工具调用 —— 原生 function calling 下工具轮没有 content 增量，天然不会进本类；
 *       遗留的 {@code {"tool":...}} 文本形态仍会被整轮吞掉（兼容）；</li>
 *   <li>约定的最终回答 {@code {"answer":"...","refs":[...]}} —— 只把 answer 字段的值逐字发出去，
 *       花括号、引号、refs 数组、转义符都不能漏到界面上；</li>
 *   <li>不守规矩的纯文本 —— 直接逐字发，服务端把原文当作答案完整保留，done 事件再用规范结果覆盖预览。</li>
 * </ol>
 *
 * <p>工具轮不产出 delta，上游仍是流式读取的，编排层会另外发 stage 进度事件。
 *
 * <p>这里做的是**字符串级**抽取，不是 JSON 解析：模型输出还没结束，整段不是合法 JSON，
 * 用 ObjectMapper 必然失败。换行、引号、Unicode 等转义都要等序列补齐后再解析，
 * 半个转义序列不提前发，避免用户看到反斜杠闪一下。
 */
final class StreamingAnswerTap {

    private enum Mode { UNDECIDED, TOOL, FINAL_JSON, FINAL_TEXT }

    private static final String ANSWER_KEY = "\"answer\"";

    /**
     * 前后端约定的「补充内容开始」标记（前端 src/agent/answerSlots.ts 同名常量）。
     *
     * <p>{@code <<DETAILS_START>>} —— answer 已写完，后面的增量是 refs/details 的 JSON，
     * 前端据此停止把 delta 当正文，只进入等待态；<br>
     * {@code <<DETAILS_START:table>>} —— details 里确实出现了表格字段，前端铺表格骨架。
     *
     * <p>不直接发中文阶段文案，是因为前端无法从文案判断「到底有没有表格」，
     * 会在纯文字回答上先摆一张表格骨架再收起。
     */
    private static final String DETAILS_START_MARKER = "<<DETAILS_START";
    private static final String DETAILS_START = DETAILS_START_MARKER + ">>";
    private static final String DETAILS_START_TABLE = DETAILS_START_MARKER + ":table>>";

    private final AgentStreamSink sink;
    private final StringBuilder raw = new StringBuilder();
    private Mode mode = Mode.UNDECIDED;
    /** FINAL_TEXT 已发出的字符数 */
    private int emittedTextLength = 0;
    /** FINAL_JSON 上一次抽出的 answer 前缀 */
    private String lastAnswer = "";
    /** 本轮 extractAnswer 是否遇到了 answer 字符串的闭合引号 */
    private boolean answerClosed = false;
    /** answer 值的起始下标（含），与 {@link #answerEnd} 一起圈出正文值的区间 */
    private int answerStart = -1;
    /** answer 闭合引号的下标（之后的内容才是 refs/details），-1 表示还没闭合 */
    private int answerEnd = -1;
    /** 「后面还有补充内容」标记只发一次 */
    private boolean supplementNotified = false;
    /** 「补充内容里有表格」标记只发一次 */
    private boolean tableNotified = false;

    StreamingAnswerTap(AgentStreamSink sink) {
        this.sink = sink;
    }

    void accept(String delta) {
        if (delta == null || delta.isEmpty()) {
            return;
        }
        raw.append(delta);
        if (mode == Mode.UNDECIDED) {
            classify();
        }
        switch (mode) {
            case FINAL_TEXT -> emitPlain();
            case FINAL_JSON -> emitJsonAnswer();
            default -> { /* UNDECIDED / TOOL：不向用户展示 */ }
        }
    }

    /** 本轮模型完整原文，交给编排层继续做工具指令解析 / 最终回答解析 */
    String rawText() {
        return raw.toString();
    }

    /**
     * 已从 answer 字段解析出的正文前缀。
     *
     * <p>额外用途：模型输出被 max_tokens 截断、整段不是合法 JSON 时，编排层用本方法
     * 抢救出已经生成的正文，避免把半截 JSON 源码直接展示给用户。
     */
    String answerText() {
        return lastAnswer;
    }

    private void classify() {
        String text = raw.toString();
        int start = prefixLength(text);
        if (start >= text.length()) {
            return; // 只有空白，或 ``` 围栏还没输完，继续等
        }
        if (text.charAt(start) != '{') {
            mode = Mode.FINAL_TEXT;
            return;
        }
        int firstQuote = text.indexOf('"', start);
        if (firstQuote < 0) {
            return;
        }
        int keyEnd = text.indexOf('"', firstQuote + 1);
        if (keyEnd < 0) {
            return; // key 还没输完
        }
        String key = text.substring(firstQuote + 1, keyEnd);
        // 除 tool 外一律按最终回答处理：模型偶尔把 refs 写在 answer 前面，也要能抽到正文
        mode = "tool".equals(key) ? Mode.TOOL : Mode.FINAL_JSON;
    }

    private void emitPlain() {
        String text = raw.toString();
        // 模型偶尔会输出「前置说明 + {"answer":"…"}」：开头不是 { 时被判为纯文本，
        // 但 JSON 源码绝不能当正文推给用户。一旦出现 answer 键（且前面有花括号），
        // 立即切换为 JSON 抽取，前缀说明保留、后续只推 answer。
        int answerKey = text.indexOf(ANSWER_KEY);
        if (answerKey >= 0 && text.lastIndexOf('{', answerKey) >= 0) {
            mode = Mode.FINAL_JSON;
            emitJsonAnswer();
            return;
        }
        String visible = text.substring(Math.min(prefixLength(text), text.length()));
        // 安全边界：把「可能是 JSON / 围栏开头」的末尾先扣住不发。
        // "answer" 键没写完整之前上层还没切换到 JSON 抽取，这里曾把
        // ```json / {"a 逐字推给用户——已发出的内容收不回，只能预防性截断；
        // 嫌疑解除（证明是普通文本）后，扣住的字符随下一帧补发，逐字体验不受影响。
        int safeEnd = safeTextEnd(visible);
        if (safeEnd > emittedTextLength) {
            sink.delta(visible.substring(emittedTextLength, safeEnd));
            emittedTextLength = safeEnd;
        }
    }

    /**
     * 纯文本模式下的安全发送边界：末尾「还没定论的 JSON / 围栏开头」扣住不发。
     *
     * <p>两类嫌疑：
     * <ul>
     *   <li>行首反引号围栏 —— {@code ```json} 正在逐字生成，或已生成完、
     *       紧跟着的内容是 / 将是 JSON。只查行首（行内代码 {@code `xxx`} 不受影响），
     *       且要扫过所有未发送的行：围栏行写完（出现行尾换行）后它就不是「最后一行」了，
     *       只看末尾会把它整段放出去；</li>
     *   <li>最后一个 '{' —— 之后是空的或以 '"' 开头（JSON 对象的 key），
     *       按约定最终会带出 "answer" 等键，等键名写完由上层切到 JSON 抽取；
     *       '{' 后是汉字 / 字母 / '}' 则视为普通文本立即放行。</li>
     * </ul>
     */
    private int safeTextEnd(String visible) {
        int end = visible.length();
        int from = Math.min(emittedTextLength, visible.length());
        int fence = backtickFenceStart(visible, from);
        if (fence >= from) {
            int lineEnd = visible.indexOf('\n', fence);
            if (lineEnd < 0) {
                end = Math.min(end, fence); // 围栏行还没写完
            } else {
                int after = lineEnd + 1;
                while (after < visible.length() && Character.isWhitespace(visible.charAt(after))) {
                    after++;
                }
                if (after >= visible.length() || visible.charAt(after) == '{') {
                    end = Math.min(end, fence); // 围栏后是 / 将是 JSON，整段扣住
                }
                // 围栏后是普通文字：视为正文里的代码块展示，放行
            }
        }
        int brace = visible.lastIndexOf('{');
        if (brace >= from && brace < end && undecidedJsonObject(visible, brace + 1)) {
            end = brace;
        }
        return end;
    }

    /** 从 from 所在行起，第一个以反引号开头的行首位置；没有则返回 -1 */
    private int backtickFenceStart(String text, int from) {
        if (text.isEmpty()) {
            return -1;
        }
        int lineStart = text.lastIndexOf('\n', Math.min(from, text.length() - 1)) + 1;
        while (lineStart < text.length()) {
            if (text.charAt(lineStart) == '`') {
                return lineStart;
            }
            int next = text.indexOf('\n', lineStart);
            if (next < 0) {
                return -1;
            }
            lineStart = next + 1;
        }
        return -1;
    }

    /** '{' 之后是否是「还没定论的 JSON 对象开头」 */
    private boolean undecidedJsonObject(String text, int from) {
        int i = skipWhitespace(text, from);
        if (i >= text.length()) {
            return true; // '{' 后还没内容，等下一片
        }
        return text.charAt(i) == '"';
    }

    private void emitJsonAnswer() {
        String answer = extractAnswer(raw.toString());
        if (answer.length() > lastAnswer.length()) {
            sink.delta(answer.substring(lastAnswer.length()));
            lastAnswer = answer;
        }
        // answer 是契约里的第一个字段，它一写完，后面剩下的就是 refs / details。
        // 此刻按前后端约定的标记通知前端：先停正文，确认有表格再铺骨架。
        if (answerClosed) {
            notifySupplementContent(raw.toString());
        }
    }

    /**
     * 按约定标记通知前端「补充内容开始了 / 里面有表格」。
     *
     * <p>只有确实存在补充字段时才发 {@code <<DETAILS_START>>}：
     * {@code {"answer":"..."} } 这种没有补充内容的回答，前端不该出现任何等待态。
     * details 里的表格字段（{@code "head"}）出现在后续帧时，再补发
     * {@code <<DETAILS_START:table>>}，前端此时才铺表格骨架。
     *
     * <p>模型偶尔不守字段顺序，把 refs / details 写在 answer 前面：answer 闭合后
     * 尾巴只剩 {@code }}，只看尾巴会漏发标记（前端没有表格骨架，done 帧突然砸出表格）。
     * 因此补充字段在全文里找，只要落在 answer 字符串值之外都算数。
     */
    private void notifySupplementContent(String text) {
        if (answerEnd < 0) {
            return;
        }
        String tail = text.substring(answerEnd + 1).replaceFirst("^[\\s,]+", "");
        boolean hasSupplement = (!tail.isEmpty() && !tail.startsWith("}"))
                || keyOutsideAnswer(text, "\"refs\"")
                || keyOutsideAnswer(text, "\"details\"");
        boolean hasTable = keyOutsideAnswer(text, "\"head\"");
        if (!supplementNotified && (hasSupplement || hasTable)) {
            supplementNotified = true;
            sink.stage(DETAILS_START);
        }
        if (supplementNotified && !tableNotified && hasTable) {
            tableNotified = true;
            sink.stage(DETAILS_START_TABLE);
        }
    }

    /** JSON 键是否出现在 answer 字符串值之外（值区间内出现的只是正文文字，不算结构） */
    private boolean keyOutsideAnswer(String text, String jsonKey) {
        int from = prefixLength(text);
        while (true) {
            int at = text.indexOf(jsonKey, from);
            if (at < 0) {
                return false;
            }
            if (answerStart < 0 || at < answerStart || at > answerEnd) {
                return true;
            }
            from = at + jsonKey.length();
        }
    }

    /** 从不完整的 JSON 里抽取 answer 字符串已经可以确定的前缀 */
    private String extractAnswer(String text) {
        answerClosed = false;
        answerStart = -1;
        answerEnd = -1;
        int start = prefixLength(text);
        int key = text.indexOf(ANSWER_KEY, start);
        if (key < 0) {
            return "";
        }
        int colon = text.indexOf(':', key + ANSWER_KEY.length());
        if (colon < 0) {
            return "";
        }
        int quote = skipWhitespace(text, colon + 1);
        if (quote >= text.length() || text.charAt(quote) != '"') {
            return "";
        }
        answerStart = quote + 1;
        StringBuilder out = new StringBuilder();
        for (int i = quote + 1; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == '"') {
                answerClosed = true;
                answerEnd = i; // 记录位置：之后才是 refs/details，用于判断有没有表格
                return out.toString(); // answer 字符串结束
            }
            if (c != '\\') {
                out.append(c);
                continue;
            }
            if (i + 1 >= text.length()) {
                return out.toString(); // 半个转义，等下一个字
            }
            char escaped = text.charAt(++i);
            switch (escaped) {
                case 'n' -> out.append('\n');
                case 'r' -> out.append('\r');
                case 't' -> out.append('\t');
                case 'b' -> out.append('\b');
                case 'f' -> out.append('\f');
                case '"' -> out.append('"');
                case '\\' -> out.append('\\');
                case '/' -> out.append('/');
                case 'u' -> {
                    if (i + 4 >= text.length()) {
                        return out.toString(); // Unicode 转义的 4 位十六进制还没到齐
                    }
                    String hex = text.substring(i + 1, i + 5);
                    try {
                        out.append((char) Integer.parseInt(hex, 16));
                    } catch (NumberFormatException e) {
                        out.append("\\u").append(hex);
                    }
                    i += 4;
                }
                default -> out.append(escaped);
            }
        }
        return out.toString();
    }

    /** 跳过开头的空白，以及未闭合的 ``` / ```json 代码围栏 */
    private int prefixLength(String text) {
        int i = 0;
        while (i < text.length() && Character.isWhitespace(text.charAt(i))) {
            i++;
        }
        if (i < text.length() && text.charAt(i) == '`') {
            // 围栏可能只到了一两个反引号，此时不能把它当成「非 JSON 的纯文本」
            if (!text.startsWith("```", i)) {
                return text.length();
            }
            int newline = text.indexOf('\n', i);
            if (newline < 0) {
                return text.length();
            }
            i = newline + 1;
            while (i < text.length() && Character.isWhitespace(text.charAt(i))) {
                i++;
            }
        }
        return i;
    }

    private int skipWhitespace(String text, int from) {
        int i = from;
        while (i < text.length() && Character.isWhitespace(text.charAt(i))) {
            i++;
        }
        return i;
    }
}
