package cn.lonwin.module.agent.feignclient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.feignclient.impl.AgentToolApiImpl;
import cn.lonwin.module.agent.model.vo.AgentUiEventVO;
import cn.lonwin.module.agent.model.vo.KbRefVO;
import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.tool.AgentResultPager;
import cn.lonwin.module.agent.tool.AgentToolContext;
import cn.lonwin.module.agent.uicapability.UiCapabilityLocator;
import cn.lonwin.module.knowledge.api.KnowledgeException;
import cn.lonwin.module.knowledge.api.KnowledgeGateway;
import cn.lonwin.module.knowledge.api.KnowledgeHit;

/**
 * kb.search 工具契约：来源标记、引用编号、知识侧关闭/异常时的降级。
 *
 * <p>知识网关是可选字段注入，测试用 ReflectionTestUtils 模拟 Spring 的
 * {@code @Autowired(required=false)}，验证 knowledge.enabled=false 时不会 NPE。
 */
class KnowledgeToolTest {

    private static KnowledgeHit hit(String id) {
        return new KnowledgeHit(id, "kp_chunks", "doc-1", "防洪", "预案标题",
                "预案.DOCX", "/files/预案.DOCX", "1.1 编制目的", "TEXT",
                "为保证水库工程安全，特制定本方案。", 0.016, "bge-m3@2026-11");
    }

    private static class Fixture {
        final AgentProperties properties = new AgentProperties();
        final AgentToolApiImpl impl = new AgentToolApiImpl(mock(UiCapabilityLocator.class), mock(AgentResultPager.class));

        Fixture() {
            ReflectionTestUtils.setField(impl, "properties", properties);
        }

        Fixture withGateway(KnowledgeGateway gateway) {
            ReflectionTestUtils.setField(impl, "knowledgeGateway", gateway);
            return this;
        }
    }

    @Test
    @DisplayName("知识侧未接入（网关 Bean 不存在）：返回明确失败观察结果，不抛异常")
    void knowledgeDisabledReturnsFriendlyFailure() {
        Fixture f = new Fixture();

        AgentToolResult result = f.impl.searchKnowledge("编制目的是什么", null, null, null);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).contains("知识库未接入", "knowledge.enabled=false");
    }

    @Test
    @DisplayName("命中片段：source=kb，matches[].n 与 kbRefs[].cite 从 11 起编号")
    void hitsProduceNumberedCitations() {
        Fixture f = new Fixture();
        KnowledgeGateway gateway = mock(KnowledgeGateway.class);
        when(gateway.search(anyString(), anyInt(), any(), any()))
                .thenReturn(List.of(hit("c1"), hit("c2")));
        f.withGateway(gateway);

        AgentToolResult result = f.impl.searchKnowledge("编制目的是什么", 2, null, null);
        Map<String, Object> data = result.getData();

        assertThat(result.isSuccess()).isTrue();
        assertThat(data).containsEntry("source", "kb").containsEntry("tool", "kb.search");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> matches = (List<Map<String, Object>>) data.get("matches");
        assertThat(matches).extracting(m -> m.get("n")).containsExactly(11, 12);
        assertThat(matches.get(0)).containsEntry("file", "预案.DOCX")
                .containsEntry("section", "1.1 编制目的");

        @SuppressWarnings("unchecked")
        List<KbRefVO> refs = (List<KbRefVO>) data.get("kbRefs");
        assertThat(refs).extracting(KbRefVO::getCite).containsExactly(11, 12);
        assertThat(refs.get(0).getFilePath()).isEqualTo("/files/预案.DOCX");
    }

    @Test
    @DisplayName("无命中：明确要求模型不要拿别的内容顶替，不生成任何引用")
    void noHitProducesNoCitations() {
        Fixture f = new Fixture();
        KnowledgeGateway gateway = mock(KnowledgeGateway.class);
        when(gateway.search(anyString(), anyInt(), any(), any())).thenReturn(List.of());
        f.withGateway(gateway);

        AgentToolResult result = f.impl.searchKnowledge("西湖门票价格", null, null, null);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).contains("未检索到", "不要编造");
        assertThat(result.getData()).isNull();
    }

    @Test
    @DisplayName("知识服务异常 + degrade-on-error=true：降级成「知识库暂不可用」")
    void degradesWhenKnowledgeServiceFails() {
        Fixture f = new Fixture();
        KnowledgeGateway gateway = mock(KnowledgeGateway.class);
        when(gateway.search(anyString(), anyInt(), any(), any()))
                .thenThrow(new KnowledgeException("Qdrant 连接超时"));
        f.withGateway(gateway);

        AgentToolResult result = f.impl.searchKnowledge("编制目的是什么", null, null, null);

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).contains("知识库暂不可用", "Qdrant 连接超时");
    }

    @Test
    @DisplayName("degrade-on-error=false：异常按约定显式抛出，交给流式 error 帧")
    void rethrowsWhenDegradeDisabled() {
        Fixture f = new Fixture();
        f.properties.getKnowledge().setDegradeOnError(false);
        KnowledgeGateway gateway = mock(KnowledgeGateway.class);
        when(gateway.search(anyString(), anyInt(), any(), any()))
                .thenThrow(new KnowledgeException("Qdrant 连接超时"));
        f.withGateway(gateway);

        assertThatThrownBy(() -> f.impl.searchKnowledge("编制目的是什么", null, null, null))
                .isInstanceOf(KnowledgeException.class);
    }

    @Test
    @DisplayName("页面定位结果统一带 source=api 与 tool=ui.locate，与知识侧分区")
    void locateIsTaggedWithApiSource() {
        UiCapabilityLocator locator = mock(UiCapabilityLocator.class);
        UiCapabilityLocator.Hit hit = new UiCapabilityLocator.Hit("许可水量", AgentUiEventVO.TYPE_NAVIGATE,
                "/water/permit", "/water/permit", "取水许可", "前往「取水许可」", "取水许可");
        UiCapabilityLocator.LocateResult located =
                new UiCapabilityLocator.LocateResult(List.of(hit), List.of());
        when(locator.locate("许可水量", null)).thenReturn(located);
        when(locator.toData(located)).thenReturn(new LinkedHashMap<>(Map.of("matches", List.of())));
        when(locator.toSummary(located)).thenReturn("在页面「取水许可」");

        AgentToolResult result = new AgentToolApiImpl(locator, mock(AgentResultPager.class))
                .locateUi(AgentToolContext.builder().build(), "许可水量");

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.getData()).containsEntry("source", "api").containsEntry("tool", "ui.locate");
    }

    @Test
    @DisplayName("页面定位无命中：明确告知系统无匹配，不编造页面")
    void locateWithoutMatchFailsExplicitly() {
        UiCapabilityLocator locator = mock(UiCapabilityLocator.class);
        when(locator.locate("西湖门票", null))
                .thenReturn(new UiCapabilityLocator.LocateResult(List.of(), List.of("西湖门票")));

        AgentToolResult result = new AgentToolApiImpl(locator, mock(AgentResultPager.class))
                .locateUi(AgentToolContext.builder().build(), "西湖门票");

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).contains("没有匹配", "西湖门票");
    }
}
