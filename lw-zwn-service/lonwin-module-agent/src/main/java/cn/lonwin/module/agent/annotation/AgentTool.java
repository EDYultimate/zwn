package cn.lonwin.module.agent.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 把一个方法声明为「大模型可调用的工具」。
 *
 * <p>标注在能力清单接口的方法上（{@code cn.lonwin.module.agent.feignclient} 包下，
 * 接口需标注 {@link AgentToolContract}），启动时由框架扫描并自动注册。
 *
 * <p>注解只保留「模型选型必需」的元数据（功能、入参、返回字段），
 * 以 OpenAI 原生 function calling 的 {@code tools[]} 数组下发给模型：
 * <ul>
 *   <li>{@link #description()}：接口功能与边界；</li>
 *   <li>{@code @AgentToolParam}：入参名 / 类型 / 说明 / 枚举（映射为 parameters JSON Schema）；</li>
 *   <li>{@code @AgentToolReturn}：返回数据逐字段含义（拼进 function description）。</li>
 * </ul>
 *
 * <p>「什么时候调用」由模型结合任务自主判断，不再用问法示例、口径词表
 * （forMetrics/notFor）在服务端替模型做路由或拦截。
 *
 * <pre>{@code
 * @AgentTool(name = "water.cert.list", title = "证照列表查询",
 *            description = "按条件查询取水许可证列表")
 * @AgentToolReturn(field = "wpcCd", description = "取水许可编码（主键）")
 * AgentToolResult listCerts(@AgentToolParam(description = "取水权人名称", example = "邯郸市供水") String owner);
 * }</pre>
 * @author admin
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AgentTool {

    /**
     * 工具名，全局唯一。建议「领域.对象.动作」三段式，如 {@code water.transfer.annual}。
     * 模型发起工具调用时会原样使用该名字。
     */
    String name();

    /** 中文短名，用于日志与提示词里的一行摘要 */
    String title();

    /**
     * 工具说明：<b>什么场景下用、返回什么</b>。
     * 这句话直接决定模型选不选这个工具，写得越具体越准。
     */
    String description();

    /** 业务分类，仅用于提示词分组与运维排查，如 water / system / common */
    String category() default "common";

    /**
     * 所属业务模块标识（如 {@code water-cert}）。
     *
     * <p>用于「按当前前端模块裁剪工具清单」：某个模块的智能体发起问答时，
     * 只给模型该模块的工具 + 本字段为空的全局工具，避免把全量工具塞进提示词导致模型选错。
     *
     * <ul>
     *   <li><b>留空</b> = 全局工具（如 {@code ui.locate}、{@code kb.search}），任何模块都可见；</li>
     *   <li><b>非空</b> = 只属于该业务模块的工具，仅当本次问答的模块与其一致时进入提示词。</li>
     * </ul>
     *
     * 与前端 QA 工作区绑定的模块标识保持一致即可；新增业务模块时，契约为工具声明该值，
     * 前端工作区用同一值发问，无需改动编排层。
     */
    String module() default "";

    /**
     * 该工具的数据是否按「单位（组织）」隔离。
     *
     * <p>它只影响两件事：提示词里标注「按本单位数据」、跳转按钮是否携带 unitCode。
     * 真正的过滤由数据权限切面统一完成（读 {@code DataScopeContext.unitCode()}），
     * 因此这里写错不会造成越权，但会让模型对数据范围的表述失准。
     * 制度问答这类与单位无关的工具设为 false。
     */
    boolean unitScoped() default true;

    /**
     * 使用该工具所需的功能权限 actUrl（与权限系统 actList 中的 URL 对应）。
     * 为空表示只受登录态保护；非空时在 POWERS 模式下做后端强校验。
     */
    String[] permissions() default {};

    /**
     * 是否只读。默认 true；写操作工具必须显式声明 false，
     * 便于运维一眼识别风险工具（当前框架不自动执行写操作，但会标记并告警）。
     */
    boolean readOnly() default true;
}
