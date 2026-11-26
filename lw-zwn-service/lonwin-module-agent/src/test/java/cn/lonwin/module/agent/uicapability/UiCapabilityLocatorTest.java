package cn.lonwin.module.agent.uicapability;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.agent.model.vo.AgentUiEventVO;

/**
 * 「XX 在系统哪里」的位置检索测试。
 *
 * <p>核心约束：能定位到就给按钮；定位不到必须如实返回无匹配，
 * 绝不能拿名称相近的页面凑数——「点了跳到不相干页面」比「没按钮」更伤可信度。
 */
@DisplayName("页面位置检索")
class UiCapabilityLocatorTest {

    private UiCapabilityService service;
    private UiCapabilityLocator locator;

    @BeforeEach
    void setUp() {
        service = new UiCapabilityService(new InMemoryUiCapabilityStore());
        locator = new UiCapabilityLocator(service);
    }

    @Test
    @DisplayName("问统计数字在哪：命中锚点，给 SPOTLIGHT 定位按钮")
    void locateAnchorForMetric() {
        service.save(List.of(waterPage()), "web", true);

        UiCapabilityLocator.LocateResult result = locator.locate("许可水量在系统哪里看");

        assertThat(result.found()).isTrue();
        assertThat(result.hits().get(0).type()).isEqualTo(AgentUiEventVO.TYPE_SPOTLIGHT);
        assertThat(result.hits().get(0).target()).isEqualTo("tile.xuKeShuiLiang");
        assertThat(result.hits().get(0).label()).contains("许可水量");
    }

    @Test
    @DisplayName("问页面在哪：命中页面标题，给 NAVIGATE 整页跳转")
    void locatePageByTitle() {
        service.save(List.of(waterPage(), videoPage()), "web", true);

        UiCapabilityLocator.LocateResult result = locator.locate("视频监控在系统中的位置");

        assertThat(result.found()).isTrue();
        assertThat(result.hits().get(0).type()).isEqualTo(AgentUiEventVO.TYPE_NAVIGATE);
        assertThat(result.hits().get(0).target()).isEqualTo("/waterUse/qushuijianguan/shipinjiankong");
    }

    @Test
    @DisplayName("命中带必填参数的弹框时降级为跳页：缺参的 DIALOG 会被白名单丢掉")
    void dialogWithRequiredParamFallsBackToNavigate() {
        service.save(List.of(waterPage()), "web", true);

        UiCapabilityLocator.LocateResult result = locator.locate("预警明细在哪个页面");

        assertThat(result.found()).isTrue();
        assertThat(result.hits().get(0).type()).isEqualTo(AgentUiEventVO.TYPE_NAVIGATE);
        assertThat(result.hits().get(0).target()).isEqualTo("/waterUse/qushuijianguan/shuiliangjiankong");
    }

    @Test
    @DisplayName("不给关键词时返回页面导航总览（「提供在系统中的位置」走这条）")
    void locateAllWhenKeywordBlank() {
        service.save(List.of(waterPage(), videoPage()), "web", true);

        UiCapabilityLocator.LocateResult result = locator.locate("");

        assertThat(result.hits()).hasSize(2);
        assertThat(result.hits()).allMatch(hit -> AgentUiEventVO.TYPE_NAVIGATE.equals(hit.type()));
        assertThat(result.missing()).isEmpty();
    }

    @Test
    @DisplayName("能力清单为空时不给任何按钮，让调用方回答「系统无匹配的页面」")
    void noCapabilitiesMeansNoHits() {
        assertThat(locator.locate("许可水量").found()).isFalse();
        assertThat(locator.locate("").found()).isFalse();
    }

    @Test
    @DisplayName("查不到的对象如实列入 missing，不拿相近页面顶替")
    void missingKeywordReported() {
        service.save(List.of(waterPage()), "web", true);

        UiCapabilityLocator.LocateResult result = locator.locate("水费账单");

        assertThat(result.found()).isFalse();
        assertThat(result.missing()).containsExactly("水费账单");
    }

    @Test
    @DisplayName("多个关键词部分命中：命中的给按钮，没命中的进 missing")
    void partialMatch() {
        service.save(List.of(waterPage(), videoPage()), "web", true);

        UiCapabilityLocator.LocateResult result = locator.locate("视频监控、水费账单");

        assertThat(result.hits()).hasSize(1);
        assertThat(result.missing()).containsExactly("水费账单");
        assertThat(locator.toSummary(result)).contains("未找到匹配");
    }

    @Test
    @DisplayName("生成的事件能通过白名单校验（target 必须是真实存在的键）")
    void generatedEventsPassValidation() {
        service.save(List.of(waterPage(), videoPage()), "web", true);

        List<AgentUiEventVO> events = locator.toEvents(locator.locate("许可水量"));

        assertThat(service.validate(events)).hasSize(1);
    }

    @Test
    @DisplayName("指定模块的检索只见本模块页面：其他模块的页面命中不了")
    void moduleScopedLocateHidesOtherModules() {
        UiPageCapability cert = waterPage();
        cert.setModule("water-cert");
        UiPageCapability video = videoPage();
        video.setModule("water-video");
        service.save(List.of(cert, video), "web", true);

        // 水证智能体问「视频监控在哪」：不在其模块范围内，必须如实无匹配
        assertThat(locator.locate("视频监控", "water-cert").found()).isFalse();
        // 通用问答不受限
        assertThat(locator.locate("视频监控", null).found()).isTrue();
        // 本模块页面仍可命中
        assertThat(locator.locate("许可水量", "water-cert").found()).isTrue();
    }

    @Test
    @DisplayName("module 为空的公共页面对任何智能体可见")
    void moduleScopedLocateKeepsCommonPages() {
        UiPageCapability cert = waterPage();
        cert.setModule("water-cert");
        UiPageCapability video = videoPage();
        service.save(List.of(cert, video), "web", true);

        assertThat(locator.locate("视频监控", "water-cert").found()).isTrue();
        assertThat(locator.locate("视频监控", "water-cert").hits().get(0).type())
                .isEqualTo(AgentUiEventVO.TYPE_NAVIGATE);
    }

    @Test
    @DisplayName("模块导航总览同样按模块裁剪：不传关键词时只列本模块与公共页面")
    void moduleScopedLocateAllFiltersPages() {
        UiPageCapability cert = waterPage();
        cert.setModule("water-cert");
        UiPageCapability video = videoPage();
        video.setModule("water-video");
        service.save(List.of(cert, video), "web", true);

        assertThat(locator.locate("", "water-cert").hits()).hasSize(1);
        assertThat(locator.locate("", null).hits()).hasSize(2);
    }

    // ==================== 测试数据 ====================

    private UiPageCapability waterPage() {
        UiPageCapability page = new UiPageCapability();
        page.setRoute("/waterUse/qushuijianguan/shuiliangjiankong");
        page.setTitle("取水监管 · 水量监控");
        page.setVersion("1");

        UiPageCapability.Anchor anchor = new UiPageCapability.Anchor();
        anchor.setTarget("tile.xuKeShuiLiang");
        anchor.setDesc("「许可水量」总数字（万m³）。用户问总许可水量时，高亮它");
        page.setAnchors(List.of(anchor));

        UiPageCapability.Dialog dialog = new UiPageCapability.Dialog();
        dialog.setTarget("warnDetailModal");
        dialog.setDesc("预警明细弹框：按类别和日期展示逐条预警记录");
        UiPageCapability.Param category = new UiPageCapability.Param();
        category.setName("category");
        category.setDesc("预警类别");
        category.setRequired(true);
        dialog.setParams(List.of(category));
        page.setDialogs(List.of(dialog));
        return page;
    }

    private UiPageCapability videoPage() {
        UiPageCapability page = new UiPageCapability();
        page.setRoute("/waterUse/qushuijianguan/shipinjiankong");
        page.setTitle("视频监控");
        page.setVersion("1");

        UiPageCapability.Anchor anchor = new UiPageCapability.Anchor();
        anchor.setTarget("tile.sheXiangTou");
        anchor.setDesc("「摄像头」统计数字。用户问有多少摄像头时，高亮它");
        page.setAnchors(List.of(anchor));
        return page;
    }
}
