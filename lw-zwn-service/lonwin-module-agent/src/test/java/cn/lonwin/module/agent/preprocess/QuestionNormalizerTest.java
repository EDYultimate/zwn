package cn.lonwin.module.agent.preprocess;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * 问题预处理测试。
 *
 * <p>锁定三件事：
 * <ol>
 *   <li><b>清理</b>：口语、全角字符、重复标点被剥掉，句子的业务内容一字不改；</li>
 *   <li><b>解析</b>：相对时间换成明确年份，命中口径与意图标注出来；</li>
 *   <li><b>不误伤</b>：以「请/帮/我」开头的正常业务问题不能被当成礼貌语砍掉。</li>
 * </ol>
 */
@DisplayName("用户问题预处理")
class QuestionNormalizerTest {

    private final QuestionNormalizer normalizer = new QuestionNormalizer();

    /** 与 AgentToolApi 的 forMetrics 同构（真实运行期由注册表汇总，这里写死便于断言） */
    private static final List<String> VOCAB = List.of(
            "许可水量", "总许可水量", "河道外", "河道内",
            "取水户", "取水口", "证照", "预警数量", "调水量", "水位");

    @Test
    @DisplayName("全角数字、多余空白、重复问号：清理干净且年份可解析")
    void cleansFullWidthAndSpaces() {
        QuestionNormalizer.Normalized result = normalizer.normalize("　请问 ２０２６ 年许可水量是多少？？", VOCAB);

        assertThat(result.text()).doesNotContain("请问").doesNotContain("２０２６");
        assertThat(result.text()).contains("2026").endsWith("？");
        assertThat(result.year()).isEqualTo(2026);
        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.DATA);
        assertThat(result.changed()).isTrue();
    }

    @Test
    @DisplayName("礼貌语 + 语气词 + 结尾致谢：全部剥掉，业务限定词保留")
    void stripsPoliteWords() {
        QuestionNormalizer.Normalized result =
                normalizer.normalize("麻烦你帮我看看去年河道外许可水量是多少啊，谢谢", VOCAB);

        assertThat(result.text()).isEqualTo("去年河道外许可水量是多少");
        assertThat(result.year()).isEqualTo(LocalDate.now().getYear() - 1);
        assertThat(result.metrics()).contains("河道外", "许可水量");
        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.DATA);
    }

    @Test
    @DisplayName("「在系统哪里看」优先判为定位意图，不能因为句子里有「多少」就当成查数")
    void locateIntentWinsOverData() {
        QuestionNormalizer.Normalized result = normalizer.normalize("许可证数量在系统哪个页面看", VOCAB);

        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.LOCATE);
        assertThat(result.metrics()).doesNotContain("证照").doesNotContain("许可水量");
    }

    @Test
    @DisplayName("「带我去/打开」判为页面操作意图")
    void operateIntent() {
        QuestionNormalizer.Normalized result = normalizer.normalize("带我去视频监控页面", VOCAB);

        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.OPERATE);
    }

    @Test
    @DisplayName("以「请/帮」开头的正常业务问题不能被误删：「请示流程是什么」保持原样")
    void doesNotBreakBusinessWords() {
        assertThat(normalizer.normalize("请示流程是什么", VOCAB).text()).isEqualTo("请示流程是什么");
        assertThat(normalizer.normalize("帮助文档在哪", VOCAB).text()).isEqualTo("帮助文档在哪");
    }

    @Test
    @DisplayName("未接入的口径不会被标注：计划用水不在词表里，只保留意图")
    void unsupportedMetricNotMarked() {
        QuestionNormalizer.Normalized result = normalizer.normalize("2026年度计划用水是多少", VOCAB);

        assertThat(result.metrics()).isEmpty();
        assertThat(result.year()).isEqualTo(2026);
        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.DATA);
    }

    @Test
    @DisplayName("全角日期分隔符也转半角：否则 yyyy-MM-dd 解析必然失配")
    void normalizesFullWidthDate() {
        QuestionNormalizer.Normalized result = normalizer.normalize("　２０２６－０９－０３ 的预警数据呢？", VOCAB);

        assertThat(result.text()).contains("2026-09-03");
        assertThat(result.year()).isEqualTo(2026);
        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.DATA);
    }

    @Test
    @DisplayName("没有「多少」但在问指标（去年调水量）也判为查数意图")
    void metricImpliesDataIntent() {
        QuestionNormalizer.Normalized result = normalizer.normalize("帮我查一下去年调水量", VOCAB);

        assertThat(result.text()).isEqualTo("去年调水量");
        assertThat(result.year()).isEqualTo(LocalDate.now().getYear() - 1);
        assertThat(result.metrics()).containsExactly("调水量");
        assertThat(result.intent()).isEqualTo(QuestionNormalizer.Intent.DATA);
    }

    @Test
    @DisplayName("整句都是噪声时退回原文，不能给模型一个空问题")
    void fallsBackToOriginalWhenEverythingCleaned() {
        QuestionNormalizer.Normalized result = normalizer.normalize("？？？", VOCAB);

        assertThat(result.text()).isEqualTo("？？？");
        assertThat(result.hasHints()).isFalse();
    }

    @Test
    @DisplayName("解析说明只包含实际有的信息，且保留原话供模型对照")
    void briefContainsParsedHints() {
        String brief = normalizer.brief(normalizer.normalize("请问今年许可水量是多少", VOCAB));

        assertThat(brief)
                .contains("用户原话：请问今年许可水量是多少")
                .contains("规范化后：今年许可水量是多少")
                .contains("识别年份：" + LocalDate.now().getYear())
                .contains("命中的业务口径：许可水量")
                .contains("意图：查业务数据");
    }

    @Test
    @DisplayName("关闭预处理时直通：不改文本、不产生解析提示")
    void identityWhenDisabled() {
        QuestionNormalizer.Normalized result = normalizer.identity("  请问今年许可水量是多少  ");

        assertThat(result.text()).isEqualTo("请问今年许可水量是多少");
        assertThat(result.hasHints()).isFalse();
        assertThat(normalizer.brief(result)).isNull();
    }
}
