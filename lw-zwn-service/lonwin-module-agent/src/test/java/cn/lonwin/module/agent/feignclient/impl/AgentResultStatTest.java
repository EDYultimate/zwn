package cn.lonwin.module.agent.feignclient.impl;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.agent.spi.AgentToolResult;
import cn.lonwin.module.agent.tool.AgentResultPager;
import cn.lonwin.module.agent.tool.AgentToolContext;

/**
 * 通用聚合工具 {@code agent.result.stat} 的行为验证。
 *
 * <p>这是「一个工具覆盖所有统计问法」的落地：口径由模型定（分组字段 / 聚合字段 / 算法），
 * 数值由 Java 在缓存的全量明细上精确计算。测试关注三类边界：
 * 分组保持首次出现顺序、非数值行不参与数值聚合但计入计数、跨会话游标被拒绝。
 */
@DisplayName("agent.result.stat 通用聚合")
class AgentResultStatTest {

    private AgentResultPager pager;
    private AgentToolApiImpl impl;

    @BeforeEach
    void setUp() {
        pager = new AgentResultPager(new ObjectMapper());
        impl = new AgentToolApiImpl(null, pager);
    }

    private static Map<String, Object> row(String river, String org, Object amt, Object src) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("river", river);
        row.put("org", org);
        row.put("amt", amt);
        row.put("src", src);
        return row;
    }

    /** 登记 25 行明细（> 一片 20 行），返回游标：聚合永远基于全量，不看分片 */
    private String register(String sessionId, List<Map<String, Object>> rows) {
        return pager.register(sessionId, "water.cert.list", rows);
    }

    private static AgentToolContext ctx(String sessionId) {
        return AgentToolContext.builder().sessionId(sessionId).build();
    }

    @Test
    @DisplayName("分组求和：按河流分组，数值精确合计，分组保持首次出现顺序")
    void groupByRiverSumsPrecisely() {
        List<Map<String, Object>> rows = List.of(
                row("漳河", "岳城局", 100.5, "地表水"),
                row("卫河", "卫河局", 200, "地表水"),
                row("漳河", "邯郸局", 300.25, "地下水"),
                row("漳河", "邯郸局", 0.25, "地下水"));
        String cursor = register("s1", new ArrayList<>(rows));

        AgentToolResult result = impl.statResult(ctx("s1"), cursor, "river", "amt", "sum");

        assertThat(result.isSuccess()).isTrue();
        List<Map<String, Object>> groups = castList(result.getData().get("groups"));
        assertThat(groups).extracting(g -> g.get("key")).containsExactly("漳河", "卫河");
        // 100.5 + 300.25 + 0.25 = 401（BigDecimal 去尾零后是整数串）
        assertThat(groups.get(0)).containsEntry("count", 3).containsEntry("amtSum", "401");
        assertThat(groups.get(1)).containsEntry("count", 1).containsEntry("amtSum", "200");
        assertThat(result.getData()).containsEntry("total", 4);
    }

    @Test
    @DisplayName("总体统计：count/sum/avg/max/min 一次算全；非数值行计入 count 不参与数值聚合")
    void overallAggregatesAllMetrics() {
        List<Map<String, Object>> rows = List.of(
                row("漳河", "岳城局", 100, "地表水"),
                row("卫河", "卫河局", 200, "地表水"),
                row("卫河", "卫河局", "未登记", "地表水"));
        String cursor = register("s1", new ArrayList<>(rows));

        AgentToolResult result = impl.statResult(ctx("s1"), cursor, null, "amt", "sum,count,avg,max,min");

        assertThat(result.isSuccess()).isTrue();
        Map<String, Object> overall = cast(result.getData().get("overall"));
        assertThat(overall).containsEntry("count", 3)
                .containsEntry("amtSum", "300")
                .containsEntry("amtCount", 2)
                .containsEntry("amtAvg", "150")
                .containsEntry("amtMax", "200")
                .containsEntry("amtMin", "100")
                .containsEntry("numericCount", 2);
        assertThat(result.getData()).containsEntry("total", 3);
    }

    @Test
    @DisplayName("只计数：metric 不传时数行数，适合「一共多少条」")
    void countOnlyWhenMetricMissing() {
        List<Map<String, Object>> rows = List.of(
                row("漳河", "岳城局", 100, "地表水"),
                row("卫河", "卫河局", 200, "地表水"));
        String cursor = register("s1", new ArrayList<>(rows));

        AgentToolResult result = impl.statResult(ctx("s1"), cursor, null, null, null);

        assertThat(result.isSuccess()).isTrue();
        Map<String, Object> overall = cast(result.getData().get("overall"));
        assertThat(overall).containsEntry("count", 2);
    }

    @Test
    @DisplayName("字段名错误：返回可读错误并列出可用字段，模型可据此改参重试")
    void unknownMetricFailsWithReadableError() {
        String cursor = register("s1", new ArrayList<>(List.of(row("漳河", "岳城局", 100, "地表水"))));

        AgentToolResult result = impl.statResult(ctx("s1"), cursor, null, "notExist", "sum");

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).contains("notExist").contains("river").contains("amt");
    }

    @Test
    @DisplayName("会话隔离：别的会话拿游标取不到数据")
    void cursorIsSessionScoped() {
        String cursor = register("s1", new ArrayList<>(List.of(row("漳河", "岳城局", 100, "地表水"))));

        AgentToolResult result = impl.statResult(ctx("s2"), cursor, null, "amt", "sum");

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.getErrorMessage()).contains("失效");
    }

    @Test
    @DisplayName("全量数据：明细被分片投喂（25 行）时，聚合基于全部 25 行")
    void aggregationCoversAllRowsBeyondFirstSlice() {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (int i = 0; i < 25; i++) {
            rows.add(row("漳河", "岳城局", 10, "地表水"));
        }
        String cursor = register("s1", rows);

        AgentToolResult result = impl.statResult(ctx("s1"), cursor, "river", "amt", "sum");

        assertThat(result.isSuccess()).isTrue();
        List<Map<String, Object>> groups = castList(result.getData().get("groups"));
        // 一片只有 20 行：聚合必须是 25 行的总和，不受分片影响
        assertThat(groups.get(0)).containsEntry("count", 25).containsEntry("amtSum", "250");
    }

    // ==================== 断言辅助 ====================

    @SuppressWarnings("unchecked")
    private static Map<String, Object> cast(Object value) {
        return (Map<String, Object>) value;
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> castList(Object value) {
        return (List<Map<String, Object>>) value;
    }
}
