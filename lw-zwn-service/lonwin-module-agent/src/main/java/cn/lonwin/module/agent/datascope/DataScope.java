package cn.lonwin.module.agent.datascope;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 数据权限切面标记：标注在「一次业务调用的入口」上，由 {@link DataScopeAspect} 统一准备单位上下文。
 *
 * <p>为什么不用方法参数传递单位：单位是「当前登录人」的隐含属性，不是业务查询的入参。
 * 把它写进方法签名会有三个代价：
 * <ol>
 *   <li>每个查询方法都要多一个参数，业务接口被权限概念污染；</li>
 *   <li>调用链上每一层都要透传，漏传一处就静默查全量数据（比报错更危险）；</li>
 *   <li>接口无法直接映射为 GET 查询（Feign / Controller 复用时参数对不上）。</li>
 * </ol>
 *
 * <p>标注位置建议：
 * <ul>
 *   <li>智能问答：{@code AgentChatService#chat}（一次提问 = 一个数据范围）；</li>
 *   <li>普通业务：Controller 方法或 Service 入口方法，任意层级均可，越靠外越好；</li>
 *   <li>可标注在类上，表示该类所有 public 方法都生效。</li>
 * </ul>
 *
 * <p>方法内部按需读取 {@link DataScopeContext#unitCode()} 即可；组件未开启时返回 {@code null}，
 * 业务代码无需判断开关，天然退化为「不按单位过滤」。
 */
@Documented
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface DataScope {
}
