package cn.lonwin.module.agent.feignclient;

import java.math.BigDecimal;

import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolContract;
import cn.lonwin.module.agent.annotation.AgentToolParam;
import cn.lonwin.module.agent.annotation.AgentToolReturn;
import cn.lonwin.module.agent.spi.AgentToolResult;

/**
 * 取水许可（电子证照）的<b>接口能力清单</b>。
 *
 * <h3>清单来源</h3>
 * 由 {@code lonwin-module-water} 的 {@code EcCertController}（{@code /ecCert}）整理而来，
 * 是它在智能体侧「模型可调用」的投影。
 *
 * <h3>接口 → 工具映射（4 个工具）</h3>
 * <pre>
 * 工具名             覆盖的 REST 接口                              数据表
 * -----------------  --------------------------------------------  -------------------------------------
 * water.cert.list    GET  /ecCert/list、/ecCert/page               WR_WPC_SUP_B + EC_BASE_INFO_WR（只读）
 * water.cert.detail  GET  /ecCert/detail、/intakes、/summary        WR_WPC_SUP_B + EC_B_WATER_ENG（只读）
 * water.cert.save    POST /ecCert/add、/ecCert/update               WR_WPC_SUP_B（唯一可写表）
 * water.cert.delete  POST /ecCert/delete                            WR_WPC_SUP_B（唯一可写表）
 * </pre>
 *
 * <h3>为什么没有统计工具</h3>
 * 统计问法无限（各河流水量、各监管单位张数、占比、排名……），按口径定制的统计接口
 * 永远覆盖不全，换个问法就查不到。统计一律走「列表工具取全量明细 +
 * {@code agent.result.stat} 通用聚合」：口径由模型定，数值由服务端精确计算。
 *
 * <h3>怎么加一个新能力</h3>
 * <ol>
 *   <li>在本接口加一个方法 + {@link AgentTool} 注解（功能 / 入参 / 返回字段三段式声明）；</li>
 *   <li>在 {@code feignclient.impl.WaterCertToolApiImpl} 里实现它，需要什么 Service 就加到构造参数上。</li>
 * </ol>
 * 注册、参数校验、权限过滤由框架统一处理。
 *
 * <h3>数据接入</h3>
 * 实现类直连 water 模块的 {@link cn.lonwin.module.water.service.EcCertService}（同 JVM 调用，非 HTTP），
 * 因此这里给出的数字与 {@code /ecCert} 页面完全同源同口径。
 */
@AgentToolContract
public interface WaterCertToolApi {

    // ==================== 一、取水许可电子证照（/ecCert） ====================

    /**
     * 对应 {@code GET /ecCert/list} 与 {@code GET /ecCert/page}。
     *
     * <p>一条记录 = 一张取水许可证；{@code issued} 区分已发证与准予未发。
     * 全量返回不截断；行数多时框架分片投喂并给出 rowsCursor，
     * 统计用 {@code agent.result.stat}（传 cursor），看剩余明细用 {@code agent.result.more}。
     */
    @AgentTool(
            name = "water.cert.list",
            module = "water-cert",
            title = "证照列表查询",
            category = "water",
            unitScoped = false,
            description = "按条件查询取水许可证（电子证照）列表。数据同时覆盖 WR_WPC_SUP_B（发证台账，含准予未发的证）"
                    + "与 EC_BASE_INFO_WR（外部只读，仅已发证），因此「已发证」和「准予未发」的证都能查到。"
                    + "检索条件与「证照管理」页面筛选框一一对应，用户提到的条件都要落到对应参数，"
                    + "不要先全量拉取再自行过滤。行数多时结果会分片并给出 rowsCursor："
                    + "统计用 agent.result.stat，看剩余明细用 agent.result.more。"
                    + "证照状态与业务类型不支持作为入参筛选，需要判断时先缩小其它条件，"
                    + "再按返回行的 status / biz 字段自行判断。")
    @AgentToolReturn(field = "rows", description = "证照明细列表，每行字段见下")
    @AgentToolReturn(field = "wpcCd", description = "取水许可编码（主键），查详情/修改/删除都用它")
    @AgentToolReturn(field = "cert", description = "许可证编号，形如 取水(冀海)字[2026]第00001号")
    @AgentToolReturn(field = "owner", description = "取水权人（持证单位或个人）名称")
    @AgentToolReturn(field = "proj", description = "取水项目名称")
    @AgentToolReturn(field = "river", description = "所属河流 / 湖库名称")
    @AgentToolReturn(field = "amt", description = "许可水量，单位万m³/年")
    @AgentToolReturn(field = "use", description = "取水用途，如 城镇生活用水 / 工业用水 / 农业用水")
    @AgentToolReturn(field = "src", description = "水源类型：地表水 / 地下水 / 其他")
    @AgentToolReturn(field = "org", description = "监管单位名称")
    @AgentToolReturn(field = "area", description = "行政区名称")
    @AgentToolReturn(field = "inpos", description = "河道内 / 河道外取水")
    @AgentToolReturn(field = "status", description = "证照状态：有效/无效/注销/吊销/撤销")
    @AgentToolReturn(field = "issued", description = "发证状态：已发证 / 准予未发")
    @AgentToolReturn(field = "exp", description = "是否临近过期（有效期剩余不足 60 天）")
    @AgentToolReturn(field = "from", description = "有效期起")
    @AgentToolReturn(field = "to", description = "有效期止")
    @AgentToolReturn(field = "reach", description = "所在河段")
    @AgentToolReturn(field = "biz", description = "业务类型：新办/变更/延续/注销")
    @AgentToolReturn(field = "rowsPaged", description = "true 表示明细已分片：rows 只是第一片，共 rowsTotal 条，"
            + "游标为 rowsCursor")
    AgentToolResult listCerts(
            @AgentToolParam(description = "取水许可编码，精确匹配；已知编码时优先传它",
                    example = "WPC1304000001") String wpcCd,
            @AgentToolParam(description = "取水许可证编号，模糊匹配，形如 取水(冀海)字[2026]第00001号",
                    example = "取水(冀海)字[2026]第00001号") String cert,
            @AgentToolParam(description = "取水权人（持证单位或个人）名称，模糊匹配", example = "邯郸市供水") String owner,
            @AgentToolParam(description = "取水权人的组织机构代码 / 统一社会信用代码，模糊匹配",
                    example = "91130400MA0A1B2C3D") String code,
            @AgentToolParam(description = "所属河流 / 湖库名称，模糊匹配", example = "漳河") String river,
            @AgentToolParam(description = "行政区：可传 6 位县级及以上代码（如 130400 邯郸市，前 4 位 1304 覆盖该市下所有县区），"
                    + "也可直接传中文名称（如 馆陶县 / 邯郸）；用户说的是地名时直接传地名即可，不要因不知道编码而不查询",
                    example = "130400") String area,
            @AgentToolParam(description = "监管单位名称，精确匹配。一级局：漳卫南局；其下属二级局：岳城局、卫河局、邯郸局、"
                    + "聊城局、邢衡局、德州局、沧州局、水闸局。问「漳卫南局」总量时注意数据可能登记在二级局上",
                    example = "岳城局") String org,
            @AgentToolParam(description = "河道内外：1=河道内取水（如水力发电），0=河道外取水；不传表示不限",
                    enums = {"1", "0"}, example = "0") String inpos,
            @AgentToolParam(description = "水源类型，多个用逗号分隔：1=地表水，2=地下水，3=其他；不传表示不限",
                    example = "1,2") String srcs,
            @AgentToolParam(description = "许可水量区间（万m³/年）：lt100 小于100 / 100-1000 介于 100 与 1000 / "
                    + "gt1000 大于1000；不确定时不要传",
                    enums = {"lt100", "100-1000", "gt1000"}, example = "gt1000") String amtRange,
            @AgentToolParam(description = "发证状态：1=已发证，0=准予未发（空值同 0）。"
                    + "用户问「准予未发/还没发证的」传 0，问「已发证」传 1；不确定时不要传",
                    enums = {"1", "0"}, example = "0") String issued,
            @AgentToolParam(description = "是否只看临近过期（有效期剩余不足 60 天）的证，不传表示不限制",
                    example = "true") Boolean expOnly,
            @AgentToolParam(description = "按需取列：只返回回答所需的字段，逗号分隔（如 river,amt）；"
                    + "不传返回全部字段。列越少单片能装的行越多", example = "river,amt") String fields);

    /**
     * 对应 {@code GET /ecCert/detail} + {@code GET /ecCert/intakes} + {@code GET /ecCert/summary}。
     *
     * <p>三接口本就服务于同一个弹框，合并后一次调用即可回答「这张证有几个取水口、许可多少水」。
     */
    @AgentTool(
            name = "water.cert.detail",
            module = "water-cert",
            title = "证照详情与取水口",
            category = "water",
            unitScoped = false,
            description = "按取水许可编码查询一张证的完整详情：证照基本信息 + 取水口明细 + 单证汇总。"
                    + "用户已给出取水许可编码、问「这张证的取水口在哪」「这张证许可多少水」时使用；"
                    + "一次只能查一张证，要比对多张证请先用证照列表工具。"
                    + "注意 wpcCd 是取水许可编码，不是许可证编号（编号先用列表工具查到编码）。")
    @AgentToolReturn(field = "cert", description = "证照基本信息：列表工具全部字段之外，另带 code=组织机构代码、"
            + "adCd/adNm=行政区划、prov/city/county=省/市/县、addr=取水口位置、eng=取水工程类型、"
            + "itype=取水类型、focus=是否重点监管取水口、big=是否大中型灌区、small=是否典型小型灌区")
    @AgentToolReturn(field = "intakes", description = "取水口明细列表（来自 EC_B_WATER_ENG）：no=取水口编号、"
            + "name=取水口名称、pos=取水口位置、eng=取水工程（设施）类型、src=水源类型")
    @AgentToolReturn(field = "summary", description = "单证汇总：certCount=证件数、permitQty=许可水量（万m³/年）、"
            + "intakeCount=取水口数")
    AgentToolResult certDetail(
            @AgentToolParam(description = "取水许可编码（WR_WPC_SUP_B.WPC_CD），注意不是许可证编号",
                    required = true, example = "WPC1304000001") String wpcCd);

    /**
     * 对应 {@code POST /ecCert/add} 与 {@code POST /ecCert/update}。
     *
     * <p>写操作必须显式标注 {@code readOnly = false}，运维在日志里一眼能看出风险工具。
     */
    @AgentTool(
            name = "water.cert.save",
            module = "water-cert",
            title = "新增 / 编辑证照",
            category = "water",
            unitScoped = false,
            readOnly = false,
            description = "新增或编辑取水许可证。只写 WR_WPC_SUP_B；EC_BASE_INFO_WR 与 EC_B_WATER_ENG 是外部只读表，"
                    + "有效期、发证状态、取水口等信息不会因此改动。"
                    + "mode=add 时 cert（许可证编号）、owner（取水权人）、proj（取水项目）必填，编码缺省沿用许可证编号；"
                    + "mode=update 时 wpcCd 必填，仅更新本次传入的字段。"
                    + "写操作前必须把要写入的编码与关键字段复述给用户并获得明确确认；用户没有明确要求新增/修改时禁止调用。")
    @AgentToolReturn(field = "mode", description = "本次操作类型：add 新增 / update 编辑")
    @AgentToolReturn(field = "wpcCd", description = "受影响的取水许可编码")
    @AgentToolReturn(field = "saved", description = "保存后的完整证照信息（字段同列表工具）")
    AgentToolResult saveCert(
            @AgentToolParam(description = "操作类型：add 新增 / update 编辑", required = true,
                    enums = {"add", "update"}, example = "add") String mode,
            @AgentToolParam(description = "取水许可编码（主键），mode=update 时必填；新增时不传则由服务端生成",
                    example = "WPC1304000001") String wpcCd,
            @AgentToolParam(description = "取水许可证编号，形如 取水(冀海)字[2026]第00001号；mode=add 时必填",
                    example = "取水(冀海)字[2026]第00001号") String cert,
            @AgentToolParam(description = "取水权人（持证单位或个人）名称；mode=add 时必填",
                    example = "邯郸市供水有限责任公司") String owner,
            @AgentToolParam(description = "取水项目名称；mode=add 时必填", example = "邯郸市城区供水工程") String proj,
            @AgentToolParam(description = "许可水量，单位万m³/年", example = "1200") BigDecimal amt,
            @AgentToolParam(description = "所属河流 / 湖库名称", example = "漳河") String river,
            @AgentToolParam(description = "行政区划代码，如 130400", example = "130400") String adCd,
            @AgentToolParam(description = "取水口位置（含省市县乡及方向信息）",
                    example = "河北省邯郸市磁县岳城镇东 500 米漳河南岸") String addr,
            @AgentToolParam(description = "取水用途，如 城镇生活用水 / 工业用水 / 农业用水 / 生态用水 / 水力发电",
                    example = "城镇生活用水") String use,
            @AgentToolParam(description = "水源类型，如 地表水 / 地下水 / 其他", example = "地表水") String wtype,
            @AgentToolParam(description = "取水权人的组织机构代码或统一社会信用代码", example = "91130400MA0A1B2C3D") String code);

    /**
     * 对应 {@code POST /ecCert/delete}。
     *
     * <p>不可恢复，且只删主表：外部只读表中的证照仍在，删除后列表会退化为「准予未发」语义。
     */
    @AgentTool(
            name = "water.cert.delete",
            module = "water-cert",
            title = "删除证照",
            category = "water",
            unitScoped = false,
            readOnly = false,
            description = "按取水许可编码删除一条取水许可证，仅删 WR_WPC_SUP_B，外部只读表不动。"
                    + "属于不可恢复操作：调用前必须让用户确认取水许可编码与取水权人，并在回答中说明「将删除哪条证」；"
                    + "用户没有明确要求删除时禁止调用。")
    @AgentToolReturn(field = "wpcCd", description = "已删除的取水许可编码")
    AgentToolResult deleteCert(
            @AgentToolParam(description = "取水许可编码（WR_WPC_SUP_B.WPC_CD），要删除的那一条",
                    required = true, example = "WPC1304000001") String wpcCd);

}
