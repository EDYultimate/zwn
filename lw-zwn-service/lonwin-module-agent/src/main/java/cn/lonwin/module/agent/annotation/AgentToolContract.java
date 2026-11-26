package cn.lonwin.module.agent.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 标记一个接口是「智能体能力清单」，实现类按命名约定放在 {@code feignclient.impl} 包下。
 *
 * <h3>目录约定</h3>
 * <pre>
 * feignclient/
 *   WaterCertToolApi.java          ← 契约：模型能用哪些能力（只有注解 + 方法签名）
 *   impl/
 *     WaterCertToolApiImpl.java    ← 实现：参数搬运 + 取数映射（依赖构造注入）
 * </pre>
 * 契约文件保持「一眼看清智能体能做什么」，实现文件专心写取数，两者用类名约定关联：
 * {@code feignclient.impl.<契约名>Impl}。
 *
 * <pre>{@code
 * @AgentToolContract
 * public interface WaterCertToolApi {
 *     @AgentTool(name = "water.cert.detail", ...)
 *     AgentToolResult certDetail(@AgentToolParam(...) String wpcCd);
 * }
 *
 * // feignclient/impl/WaterCertToolApiImpl.java
 * @RequiredArgsConstructor
 * public class WaterCertToolApiImpl implements WaterCertToolApi {
 *     private final EcCertService ecCertService;
 *     public AgentToolResult certDetail(String wpcCd) { ... }
 * }
 * }</pre>
 *
 * <h3>框架替你做了什么</h3>
 * <ul>
 *   <li>启动时扫描 {@code cn.lonwin.module.agent.feignclient} 下带本注解的接口；</li>
 *   <li>按约定找到 {@code impl} 包里的实现类并注册成 Spring Bean（构造注入照常可用，无需 @Component）；</li>
 *   <li>解析方法上的 {@link AgentTool}，生成参数 Schema、提示词、权限与口径校验；</li>
 *   <li>执行时统一补 {@code source/tool/queriedAt} 标记。</li>
 * </ul>
 *
 * <p>新增一份业务能力清单：新增 1 个契约文件 + 1 个 impl 文件，注册表、{@code tool} 包、其它契约都不用动。
 *
 * <p>约束（启动期 fail-fast 校验）：
 * <ul>
 *   <li>接口必须放在 {@code cn.lonwin.module.agent.feignclient} 包下（不要放 impl 子包）；</li>
 *   <li>实现类必须是 {@code feignclient.impl.<契约名>Impl}，并 implements 该契约（可用 {@link #impl()} 改名）；</li>
 *   <li>契约之间不要相互继承，否则父接口的工具方法会被重复注册。</li>
 * </ul>
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AgentToolContract {

    /**
     * 实现类的类名，默认 {@code <契约名>Impl}。
     *
     * <p>只在确实需要换实现（比如灰度实现）时才改；
     * 常规情况留空即可，保证「一个业务域一种写法」。
     */
    String impl() default "";
}
