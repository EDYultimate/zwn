package cn.lonwin.module.agent.uicapability;

import java.util.List;
import java.util.Optional;

/**
 * 前端能力声明的存储接口。
 *
 * <p>当前实现为内存缓存（{@link InMemoryUiCapabilityStore}）；后续迁移数据库时
 * 新增一个实现类（如 {@code DbUiCapabilityStore}）替换 Bean 即可，
 * {@link UiCapabilityService} 与上层接口零改动——这也是本接口刻意保持「纯数据读写」的原因：
 * 不掺杂校验、提示词渲染等业务逻辑，保证存储层可替换。
 */
public interface UiCapabilityStore {

    /**
     * 合并某上报方上报的页面声明：<b>按 route 覆盖</b>，其它已存在的页面保持不动。
     *
     * <p>不能用「整体替换」：前端每个页面挂载时会单页上报，
     * 整体替换会让后访问的页面冲掉前面所有页面（表现为缓存里只剩最后一个页面）。
     */
    void merge(String client, List<UiPageCapability> capabilities);

    /** 整体替换某上报方的全部页面声明（全量上报场景：一次提交所有页面） */
    void replaceAll(String client, List<UiPageCapability> capabilities);

    /** 清空某上报方的声明（前端下线/版本回退时用） */
    void clear(String client);

    /** 查询某上报方的全部页面声明 */
    List<UiPageCapability> findByClient(String client);

    /** 查询全部上报方的页面声明（提示词渲染与 target 检索用） */
    List<UiPageCapability> findAll();

    /** 按路由查询页面声明 */
    Optional<UiPageCapability> findByRoute(String route);
}
