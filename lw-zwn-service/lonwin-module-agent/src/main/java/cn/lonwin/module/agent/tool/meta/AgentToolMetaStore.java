package cn.lonwin.module.agent.tool.meta;

import java.util.Map;

/**
 * 工具元数据存储（SPI）。
 *
 * <p>存储方式可以换，合并逻辑不能换——这是把它抽成接口的唯一原因：
 * <ul>
 *   <li>{@code db}：达梦数据库 AGENT_TOOL_META（entity + Mapper + XML，默认实现，
 *       在线配置每次修改即落库）；</li>
 *   <li>{@code file}：JSON 文件，单机调试用；</li>
 *   <li>{@code memory}：纯内存，重启即还原，适合只读环境或单元测试。</li>
 * </ul>
 * 只要再实现本接口并注册为 Bean，注册表、管理接口、提示词生成全部零改动。
 *
 * <p>实现必须是线程安全的：管理接口写入与请求线程读取可能并发。
 */
public interface AgentToolMetaStore {

    /**
     * 读取全部覆盖项。
     *
     * @return 工具名 → 覆盖项；无配置时返回空 Map，不返回 null
     */
    Map<String, AgentToolMeta> loadAll();

    /** 新增或更新一条覆盖项 */
    void save(AgentToolMeta meta);

    /**
     * 删除一条覆盖项（恢复为注解默认值）。
     *
     * @return 是否确实删除了一条已存在的记录
     */
    boolean remove(String name);

    /**
     * 清空全部覆盖项（一键还原用），返回被清除的条数。
     *
     * <p>默认逐条删除，保证文件 / 内存实现也能用；数据库实现可覆盖为单条 DELETE，
     * 避免 N+1 次查询与写日志。
     */
    default int clearAll() {
        int count = 0;
        for (String name : loadAll().keySet().stream().toList()) {
            if (remove(name)) {
                count++;
            }
        }
        return count;
    }

    /** 存储位置描述，用于日志与健康检查，例如文件绝对路径 */
    String location();
}
