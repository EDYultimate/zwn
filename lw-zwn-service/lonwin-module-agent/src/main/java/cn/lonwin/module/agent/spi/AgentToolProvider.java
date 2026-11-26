package cn.lonwin.module.agent.spi;

/**
 * 智能问答「工具」扩展点（SPI，兼容保留）。
 *
 * <p><b>新工具请优先使用注解方式</b>：在 {@code cn.lonwin.module.agent.feignclient.AgentToolApi}
 * 上加一个方法即可，参数能生成结构化 Schema、可做启动期校验，也不会有"一个工具一个类"的样板代码。
 *
 * <p>本接口保留的原因：当某个业务模块希望完全自治（自己决定工具实现、不经过中央契约）时，
 * 实现本接口并注册为 Spring Bean 仍然会被自动收集；它没有结构化参数（提示词里只有一句描述），
 * 属于过渡方案。
 *
 * <p>依赖方向仍是「业务模块 -> agent 模块」，agent 模块不依赖任何业务模块，因此不会产生循环依赖。
 *
 * <p>实现约定：
 * <ol>
 *   <li>{@link #toolName()} 全局唯一，不能与注解工具重名（重名会导致启动失败）；</li>
 *   <li>{@link #description()} 用一句中文说明「什么场景下用、参数是什么」，它会直接进入模型的提示词；</li>
 *   <li>{@link #execute} 内如需按单位过滤，用 {@code request.getUnitCode()}
 *       （由数据权限切面注入，关闭开关时为 {@code null}）；</li>
 *   <li>需要页面跳转时，通过 {@link AgentToolResult#getActions()} 返回按钮，路由由业务方给出。</li>
 * </ol>
 */
public interface AgentToolProvider {

    /** 工具名（模型输出指令时会用到，需唯一） */
    String toolName();

    /** 工具说明，例如：查某年全年调水量。参数: year(年份) */
    String description();

    /** 执行查询 */
    AgentToolResult execute(AgentToolRequest request);
}
