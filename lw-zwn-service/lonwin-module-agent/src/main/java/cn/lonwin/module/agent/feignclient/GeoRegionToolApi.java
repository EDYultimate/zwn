package cn.lonwin.module.agent.feignclient;

import java.math.BigDecimal;

import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolContract;
import cn.lonwin.module.agent.annotation.AgentToolParam;
import cn.lonwin.module.agent.annotation.AgentToolReturn;
import cn.lonwin.module.agent.spi.AgentToolResult;

/**
 * 【业务能力】行政区划（WR_AD_B）的名称 ↔ 编码互转与维护契约。
 *
 * <h3>module 归属（2026-11-17 智能体能力约定调整）</h3>
 * <ul>
 *   <li>本契约声明 {@code module = "geo-region"}：<b>仅通用问答（module 为空）可见</b>，
 *       不再对任何指定智能体可见；</li>
 *   <li>指定智能体（如取水许可 water-cert）需要按行政区筛选时，直接把中文地名传给
 *       业务工具的 area 参数（如 {@code water.cert.list} 已支持「编码未知时传中文名称」回退），
 *       不依赖本契约做名称转码；</li>
 *   <li>若未来某个智能体确需区划转码能力，把它的 module 加进对应智能体的会话范围即可
 *       （或按 {@link AgentTool#module()} 留空改为全局公共工具，需重新评估能力边界）。</li>
 * </ul>
 *
 * <h3>标准用法：名称转编码，再喂给业务工具</h3>
 * 通用问答里，业务数据接口（如 {@code water.cert.*}）的行政区参数只认编码，而用户说的是中文名：
 * <ol>
 *   <li>先用 {@code geo.region.list}（按名称模糊）拿到 {@code adCd}；</li>
 *   <li>再把 {@code adCd} 作为 {@code area} 参数传给对应的数据工具；</li>
 *   <li>回答里出现裸编码时，用 {@code geo.region.detail} / {@code geo.region.translate} 转回中文名。</li>
 * </ol>
 */
@AgentToolContract
public interface GeoRegionToolApi {

    /** 行政区划业务域的模块键：仅通用问答可见，指定智能体不注入 */
    String GEO_REGION_MODULE = "geo-region";

    /**
     * 对应 {@code GET /wrAdB/list}、{@code /wrAdB/page}、{@code /wrAdB/search}。
     *
     * <p>三个接口的差别只在「是否分页 / 是否只返回联想条数」，对模型来说是同一件事：
     * 按代码前缀或名称找行政区划，并把中文名称翻译成编码。
     */
    @AgentTool(
            name = "geo.region.list",
            title = "行政区划查询（名称 → 编码）",
            category = "common",
            module = GEO_REGION_MODULE,
            unitScoped = false,
            description = "按代码前缀或名称模糊查询县级及以上行政区划（WR_AD_B）。"
                    + "用户问题里出现行政区名称、而数据接口只认编码时，先用本工具把名称转成 adCd，"
                    + "再把 adCd 作为 area 参数传给业务数据工具。全量返回；行数较多时框架只投喂第一片"
                    + "并给出 rowsCursor，更多明细用 agent.result.more 续取。")
    @AgentToolReturn(field = "rows", description = "行政区划列表，每行字段见下")
    @AgentToolReturn(field = "adCd", description = "行政区划代码（传给业务工具的 area 参数用这个）")
    @AgentToolReturn(field = "adNm", description = "行政区划名称")
    @AgentToolReturn(field = "adShnm", description = "行政区划简称")
    @AgentToolReturn(field = "adA", description = "面积（平方公里）")
    @AgentToolReturn(field = "isuse", description = "是否启用：1 启用 / 0 停用")
    @AgentToolReturn(field = "ts", description = "更新时间")
    @AgentToolReturn(field = "nt", description = "备注")
    @AgentToolReturn(field = "rowsPaged", description = "true 表示明细已分片：rows 只是第一片，共 rowsTotal 条")
    AgentToolResult listRegions(
            @AgentToolParam(description = "行政区划代码，前缀匹配（传 1304 可查该市下辖各区县），精确查询请用行政区划详情工具",
                    example = "1304") String adCd,
            @AgentToolParam(description = "行政区划名称或简称关键字，模糊匹配；用户说中文地名时优先用它",
                    example = "邯郸") String adNm,
            @AgentToolParam(description = "启用状态：1 启用 / 0 停用；不确定时不要传",
                    enums = {"1", "0"}, example = "1") String isuse);

    /**
     * 对应 {@code GET /wrAdB/detail} 与 {@code GET /wrAdB/name}。
     */
    @AgentTool(
            name = "geo.region.detail",
            title = "行政区划详情（编码 → 名称）",
            category = "common",
            module = GEO_REGION_MODULE,
            unitScoped = false,
            description = "按行政区划代码精确查询一条行政区划，也用于「这个代码对应哪个行政区」。"
                    + "回答里出现裸编码需要转成中文名时也用它。返回字段与「行政区划查询」的 rows 相同，单条对象。")
    @AgentToolReturn(field = "adCd", description = "行政区划代码")
    @AgentToolReturn(field = "adNm", description = "行政区划名称")
    @AgentToolReturn(field = "adShnm", description = "行政区划简称")
    @AgentToolReturn(field = "adA", description = "面积（平方公里）")
    @AgentToolReturn(field = "isuse", description = "是否启用：1 启用 / 0 停用")
    @AgentToolReturn(field = "ts", description = "更新时间")
    @AgentToolReturn(field = "nt", description = "备注")
    AgentToolResult regionDetail(
            @AgentToolParam(description = "行政区划代码，精确匹配，如 130400", required = true,
                    example = "130400") String adCd);

    /**
     * 对应 {@code GET /wrAdB/names}。
     *
     * <p>参数用「逗号分隔的一串代码」而不是数组：模型拼数组容易多一层嵌套，
     * 而这里本来就是人读的批量翻译场景。
     */
    @AgentTool(
            name = "geo.region.translate",
            title = "行政区划批量翻译（编码 → 名称）",
            category = "common",
            module = GEO_REGION_MODULE,
            unitScoped = false,
            description = "把一批行政区划代码批量翻译成名称，一次最多 50 个。"
                    + "回答里出现多个行政区代码、需要统一转成中文名，或多个代码想核对分别是什么地方时使用。")
    @AgentToolReturn(field = "names", description = "翻译结果：{行政区划代码: 名称}")
    @AgentToolReturn(field = "missing", description = "表里查不到的代码列表")
    @AgentToolReturn(field = "count", description = "成功翻译的条数")
    @AgentToolReturn(field = "truncated", description = "true 表示输入超过 50 个被截断，inputCount 是原始个数")
    AgentToolResult regionNames(
            @AgentToolParam(description = "行政区划代码，多个用逗号分隔，最多 50 个", required = true,
                    example = "130400,130500,131100") String adCds);

    @AgentTool(
            name = "geo.region.save",
            title = "新增 / 编辑行政区划",
            category = "common",
            module = GEO_REGION_MODULE,
            unitScoped = false,
            readOnly = false,
            description = "新增或编辑行政区划（WR_AD_B）。mode=add 时 adCd 与 adNm 必填且代码不能重复；"
                    + "mode=update 时 adCd 必填，仅更新本次传入的字段。"
                    + "该表被多个业务按行政区代码引用，改动前必须向用户复述代码与名称并取得确认。")
    @AgentToolReturn(field = "mode", description = "本次操作类型：add 新增 / update 编辑")
    @AgentToolReturn(field = "saved", description = "保存后的行政区划（字段同详情工具）")
    AgentToolResult saveRegion(
            @AgentToolParam(description = "操作类型：add 新增 / update 编辑", required = true,
                    enums = {"add", "update"}, example = "add") String mode,
            @AgentToolParam(description = "行政区划代码，6 位（新增与编辑都必填，编辑时作为主键）",
                    required = true, example = "130481") String adCd,
            @AgentToolParam(description = "行政区划名称，新增时必填", example = "武安市") String adNm,
            @AgentToolParam(description = "行政区划简称", example = "武安") String adShnm,
            @AgentToolParam(description = "行政区划面积（平方公里）", example = "1806") BigDecimal adA,
            @AgentToolParam(description = "备注", example = "县级市") String nt,
            @AgentToolParam(description = "是否启用：1 启用 / 0 停用，新增不传默认启用",
                    enums = {"1", "0"}, example = "1") String isuse);

    @AgentTool(
            name = "geo.region.delete",
            title = "删除行政区划",
            category = "common",
            module = GEO_REGION_MODULE,
            unitScoped = false,
            readOnly = false,
            description = "按代码删除一条行政区划（WR_AD_B）。不可恢复，且多个业务的行政区字段可能引用该代码；"
                    + "调用前必须让用户确认代码与名称，用户没有明确要求删除时禁止调用。")
    @AgentToolReturn(field = "adCd", description = "已删除的行政区划代码")
    AgentToolResult deleteRegion(
            @AgentToolParam(description = "行政区划代码，要删除的那一条", required = true,
                    example = "130481") String adCd);
}
