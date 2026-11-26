package cn.lonwin.module.agent.uicapability;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cn.lonwin.module.agent.model.vo.AgentUiEventVO;

/**
 * 能力声明上报语义测试。
 *
 * <p>核心回归：前端每个页面挂载时会<b>单页</b>上报，
 * 若后端按「整体替换」处理，后访问的页面会把前面的页面冲掉，
 * 表现为缓存里永远只剩最后一个页面，模型随之看不到其它页面、按钮大量消失。
 */
@DisplayName("能力声明上报语义")
class UiCapabilityServiceTest {

    private final UiCapabilityService service =
            new UiCapabilityService(new InMemoryUiCapabilityStore());

    @Test
    @DisplayName("单页依次上报：互不覆盖")
    void incrementalUploadKeepsOtherPages() {
        service.save(List.of(page("/waterUse/shuiliangjiankong", "水量监控", "tile.xuKeShuiLiang")), "web");
        service.save(List.of(page("/waterUse/shipinjiankong", "视频监控", "tile.sheXiangTou")), "web");

        assertThat(service.all()).extracting(UiPageCapability::getRoute)
                .containsExactlyInAnyOrder("/waterUse/shuiliangjiankong", "/waterUse/shipinjiankong");
    }

    @Test
    @DisplayName("同一页面重复上报按 route 覆盖，不产生重复项")
    void samePageOverwritten() {
        service.save(List.of(page("/a", "页面A", "anchor.old")), "web");
        service.save(List.of(page("/a", "页面A", "anchor.new")), "web");

        assertThat(service.all()).hasSize(1);
        assertThat(service.all().get(0).getAnchors()).extracting(UiPageCapability.Anchor::getTarget)
                .containsExactly("anchor.new");
    }

    @Test
    @DisplayName("全量上报：未出现的页面视为下线")
    void fullUploadReplacesAll() {
        service.save(List.of(page("/a", "页面A", "anchor.a")), "web");
        service.save(List.of(page("/b", "页面B", "anchor.b")), "web");
        service.save(List.of(page("/b", "页面B", "anchor.b")), "web", true);

        assertThat(service.all()).extracting(UiPageCapability::getRoute).containsExactly("/b");
    }

    @Test
    @DisplayName("缺少 route 直接拒绝，避免脏数据进缓存")
    void routeRequired() {
        UiPageCapability broken = new UiPageCapability();
        broken.setTitle("没有路由");

        assertThatThrownBy(() -> service.save(List.of(broken), "web"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("route");
    }

    // ==================== 指纹（前端增量同步） ====================

    @Test
    @DisplayName("指纹与前端本地算法一致：单页 /a@1 的摘要固定为 8cb49488")
    void digestMatchesFrontendAlgorithm() {
        // 该期望值由前端 localCapabilityDigest 的同一份 FNV-1a 实现算出（node 验算），
        // 两端算法一旦各自漂移，指纹永远对不上，会退化成每次同步都全量重发。
        assertThat(UiCapabilityService.digest(List.of(page("/a", "页面A", "anchor.a"))))
                .isEqualTo("8cb49488");
        assertThat(UiCapabilityService.digest(List.of(
                page("/a", "页面A", "anchor.a"),
                page("/b", "页面B", "anchor.b"))))
                .isEqualTo("5f4b5320");
    }

    @Test
    @DisplayName("指纹与顺序无关，version 变化才改变指纹")
    void digestIgnoresOrderButFollowsVersion() {
        UiPageCapability a = page("/a", "页面A", "anchor.a");
        UiPageCapability b = page("/b", "页面B", "anchor.b");

        assertThat(UiCapabilityService.digest(List.of(a, b)))
                .isEqualTo(UiCapabilityService.digest(List.of(b, a)));

        b.setVersion("2");
        assertThat(UiCapabilityService.digest(List.of(a, b))).isNotEqualTo("5f4b5320");
    }

    @Test
    @DisplayName("后端缓存被清空后指纹回到 0，前端据此识别需要补报")
    void fingerprintDetectsEmptyCache() {
        service.save(List.of(page("/a", "页面A", "anchor.a")), "web", true);
        assertThat(service.fingerprint("web").digest()).isNotEqualTo("0");
        assertThat(service.fingerprint("web").pageCount()).isEqualTo(1);

        service.clear("web");
        assertThat(service.fingerprint("web").digest()).isEqualTo("0");
        assertThat(service.fingerprint("web").pageCount()).isZero();
    }

    @Test
    @DisplayName("指纹按 client 隔离：别的端上报不影响本端 digest")
    void fingerprintIsolatedByClient() {
        service.save(List.of(page("/a", "页面A", "anchor.a")), "web", true);
        service.save(List.of(page("/x", "大屏页", "tile.x")), "bigscreen", true);

        assertThat(service.fingerprint("web").digest())
                .isEqualTo(UiCapabilityService.digest(List.of(page("/a", "页面A", "anchor.a"))));
        assertThat(service.fingerprint("bigscreen").pageCount()).isEqualTo(1);
    }

    // ==================== 重启后的事件校验 ====================

    @Test
    @DisplayName("重启后按存量声明重建索引：文件里恢复的 target 必须能通过事件校验")
    void validateWorksAfterRestart() {
        // 模拟重启：store 里已有落盘的声明（FileUiCapabilityStore 启动时加载），
        // 但新的 UiCapabilityService 实例还没被 save 过 → 索引只能由 init 建立。
        InMemoryUiCapabilityStore store = new InMemoryUiCapabilityStore();
        new UiCapabilityService(store).save(List.of(page("/a", "页面A", "tile.xuKeShuiLiang")), "web", true);

        UiCapabilityService restarted = new UiCapabilityService(store);
        restarted.init();

        AgentUiEventVO event = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT)
                .target("tile.xuKeShuiLiang")
                .label("高亮许可水量")
                .build();
        // 不重建索引时这里会返回空（模型给的 target 被判「未注册」丢弃），
        // 表现就是回答里写着「点击下方按钮」却没有按钮
        assertThat(restarted.validate(List.of(event))).hasSize(1);
    }

    @Test
    @DisplayName("引用编号越界：1~9 放行，10 与 11 段落的页面动作一律拒绝")
    void citeOutsideRangeRejected() {
        // 编号空间：1~9 是页面动作，10 是留出来的空隙，11 起给 kbRefs。
        // 越界条目如果放行，正文角标会指向前端分派不到的空档（点上去没有任何反应），
        // 而 alignCitations 只按编号是否存在判断有效性，漏过去就再也拦不住。
        service.save(List.of(page("/a", "页面A", "tile.x")), "web", true);

        AgentUiEventVO first = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT).target("tile.x").cite(1).build();
        AgentUiEventVO last = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT).target("tile.x").cite(9).build();
        AgentUiEventVO gap = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT).target("tile.x").cite(10).build();
        AgentUiEventVO kbZone = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT).target("tile.x").cite(11).build();

        UiCapabilityService.Validation validation =
                service.validateWithReasons(List.of(first, last, gap, kbZone));

        assertThat(validation.events()).extracting(AgentUiEventVO::getCite).containsExactly(1, 9);
        assertThat(validation.rejects()).hasSize(2).allMatch(reason -> reason.contains("引用编号越界"));
    }

    // ==================== 按智能体（module）裁剪 ====================

    @Test
    @DisplayName("事件白名单校验 module：其他模块的页面/元素事件被拒，本模块与公共页面放行")
    void validateRejectsEventsOutsideModule() {
        UiPageCapability certPage = page("/waterUse/zhengzhao", "证照管理", "tile.certCount");
        certPage.setModule("water-cert");
        UiPageCapability videoPage = page("/waterUse/shipinjiankong", "视频监控", "tile.sheXiangTou");
        videoPage.setModule("water-video");
        UiPageCapability commonPage = page("/home", "系统首页", "tile.todo");
        service.save(List.of(certPage, videoPage, commonPage), "web", true);

        AgentUiEventVO otherModuleSpotlight = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT).target("tile.sheXiangTou").build();
        AgentUiEventVO otherModuleNavigate = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_NAVIGATE).target("/waterUse/shipinjiankong").build();
        AgentUiEventVO ownModuleSpotlight = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_SPOTLIGHT).target("tile.certCount").build();
        AgentUiEventVO commonNavigate = AgentUiEventVO.builder()
                .type(AgentUiEventVO.TYPE_NAVIGATE).target("/home").build();

        // 模型编造其他模块的事件：即使 target 真实存在，也不允许下发给 water-cert 智能体
        UiCapabilityService.Validation validation = service.validateWithReasons(
                List.of(otherModuleSpotlight, otherModuleNavigate, ownModuleSpotlight, commonNavigate), "water-cert");

        assertThat(validation.events()).extracting(AgentUiEventVO::getTarget)
                .containsExactly("tile.certCount", "/home");
        assertThat(validation.rejects()).hasSize(2).allMatch(reason -> reason.contains("模块范围"));

        // 通用问答（module 为空）不做模块校验，全部放行
        assertThat(service.validateWithReasons(
                List.of(otherModuleSpotlight, otherModuleNavigate), null).events()).hasSize(2);
    }

    @Test
    @DisplayName("提示词清单按 module 裁剪：本模块页面 + 公共页面，无匹配不退回全量")
    void describeForPromptScopedByModule() {
        UiPageCapability certPage = page("/waterUse/zhengzhao", "证照管理", "tile.certCount");
        certPage.setModule("water-cert");
        UiPageCapability videoPage = page("/waterUse/shipinjiankong", "视频监控", "tile.sheXiangTou");
        videoPage.setModule("water-video");
        UiPageCapability commonPage = page("/home", "系统首页", "tile.todo");
        service.save(List.of(certPage, videoPage, commonPage), "web", true);

        String scoped = service.describeForPrompt("water-cert");
        assertThat(scoped).contains("证照管理").contains("系统首页").doesNotContain("视频监控");

        // 通用问答看到全部页面
        assertThat(service.describeForPrompt(null)).contains("证照管理").contains("视频监控");

        // 没有任何页面声明该 module：业务页面全部裁掉、不退回全量，公共页面仍可见
        String noMatch = service.describeForPrompt("no-such-module");
        assertThat(noMatch).doesNotContain("证照管理").doesNotContain("视频监控").contains("系统首页");

        // 场景收窄到「全部页面都带 module 且无一匹配」：返回明确的「本模块无页面能力」提示段
        service.save(List.of(certPage, videoPage), "web", true);
        String empty = service.describeForPrompt("no-such-module");
        assertThat(empty).contains("暂未登记").doesNotContain("证照管理").doesNotContain("视频监控");
    }

    private UiPageCapability page(String route, String title, String anchorTarget) {
        UiPageCapability page = new UiPageCapability();
        page.setRoute(route);
        page.setTitle(title);
        page.setVersion("1");
        UiPageCapability.Anchor anchor = new UiPageCapability.Anchor();
        anchor.setTarget(anchorTarget);
        anchor.setDesc("测试锚点");
        page.setAnchors(List.of(anchor));
        return page;
    }
}
