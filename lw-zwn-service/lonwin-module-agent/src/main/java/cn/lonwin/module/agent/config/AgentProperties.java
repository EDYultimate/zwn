package cn.lonwin.module.agent.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 智能问答模块配置，对应 application.yml 中 {@code lonwin.agent.*}。
 *
 * <pre>
 * lonwin:
 *   agent:
 *     qwen:
 *       base-url: http://10.3.34.79/localApi/v1
 *       api-key: mak-xxx
 *       model: qwen3
 * </pre>
 */
@Component
@ConfigurationProperties(prefix = "lonwin.agent")
public class AgentProperties {

    /** 单次提问最多连续调用工具轮数，防止模型死循环（模型自主多轮，默认给足余量） */
    private int maxToolRounds = 8;

    /** 单条回答最多返回的跳转按钮数量 */
    private int maxActions = 3;

    private Qwen qwen = new Qwen();

    private Memory memory = new Memory();

    private Tools tools = new Tools();

    private Knowledge knowledge = new Knowledge();

    private DataScope dataScope = new DataScope();

    private UiCapability uiCapability = new UiCapability();

    private Preprocess preprocess = new Preprocess();

    public int getMaxToolRounds() { return maxToolRounds; }
    public void setMaxToolRounds(int maxToolRounds) { this.maxToolRounds = maxToolRounds; }
    public int getMaxActions() { return maxActions; }
    public void setMaxActions(int maxActions) { this.maxActions = maxActions; }
    public Qwen getQwen() { return qwen; }
    public void setQwen(Qwen qwen) { this.qwen = qwen; }
    public Memory getMemory() { return memory; }
    public void setMemory(Memory memory) { this.memory = memory; }
    public Tools getTools() { return tools; }
    public void setTools(Tools tools) { this.tools = tools; }
    public Knowledge getKnowledge() { return knowledge; }
    public void setKnowledge(Knowledge knowledge) { this.knowledge = knowledge; }
    public DataScope getDataScope() { return dataScope; }
    public void setDataScope(DataScope dataScope) { this.dataScope = dataScope; }
    public UiCapability getUiCapability() { return uiCapability; }
    public void setUiCapability(UiCapability uiCapability) { this.uiCapability = uiCapability; }
    public Preprocess getPreprocess() { return preprocess; }
    public void setPreprocess(Preprocess preprocess) { this.preprocess = preprocess; }

    /**
     * 用户问题预处理配置（对应 {@code lonwin.agent.preprocess.*}）。
     *
     * <p>作用：组装模型消息之前先清理口语噪声、解析相对时间与口径词、标注意图，
     * 见 {@code cn.lonwin.module.agent.preprocess.QuestionNormalizer}。
     * 默认开启；怀疑清洗误伤（把关键限定词剥掉了）时关掉即可回到原始问句，不影响其它链路。
     */
    public static class Preprocess {

        /** 是否启用问题预处理 */
        private boolean enabled = true;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    /**
     * 前端能力声明存储配置（对应 {@code lonwin.agent.ui-capability.*}）。
     *
     * <p>默认落数据库：能力声明只有前端挂载时才会重新上报，只存内存会导致
     * 后端重启后清单为空、前端又不补报，所有跳转按钮静默消失；
     * 落库后还能把「代码默认基线」与「配置页人工修改」分开保存，支持一键还原。
     */
    public static class UiCapability {

        /** 存储方式：db = 达梦数据库（默认，支持在线配置）；file = JSON 文件；memory = 仅内存 */
        private String store = "db";

        /** 声明文件路径，相对路径以进程工作目录为基准 */
        private String file = "./config/agent-ui-capabilities.json";

        public String getStore() { return store; }
        public void setStore(String store) { this.store = store; }
        public String getFile() { return file; }
        public void setFile(String file) { this.file = file; }
    }

    /**
     * 单位数据权限配置（对应 {@code lonwin.agent.data-scope.*}）。
     *
     * <p>默认关闭：当前阶段以功能实现为主，业务方法里不再出现 unitCode 参数；
     * 需要数据隔离时打开开关即可生效，无需改任何业务代码。
     */
    public static class DataScope {

        /** 是否启用单位数据权限。false = 不解析、不注入，查询不做单位过滤 */
        private boolean enabled = false;

        /**
         * 严格模式：解析不到用户单位时是否直接拒绝（403）。
         * false = 只告警并放行（功能优先）；true = 拒绝，避免"查不出数据但不知道为什么"。
         */
        private boolean strict = false;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public boolean isStrict() { return strict; }
        public void setStrict(boolean strict) { this.strict = strict; }
    }

    /**
     * 工具侧（业务数据接口 + 页面能力）接入配置。
     *
     * <p>{@code enabled} 与 {@code knowledge.enabled} 是两个独立的通道开关：
     * 只部署工具侧时把 {@code knowledge.enabled} 置 false 即可，
     * 编排层会自动去掉知识库工具与提示词里的知识章节，不会因向量服务未启动而报错。
     */
    public static class Tools {

        /** 是否接入工具侧通道。false = 不注册任何业务/页面工具，只保留知识侧与纯概念问答 */
        private boolean enabled = true;

        /** 工具侧数据接口权限（轻量门面），见 {@code AgentToolAccessPolicy} */
        private Permission permission = new Permission();

        /**
         * 工具数量上限，0 表示不限制。
         * 工具越多提示词越长、模型越容易选错，超过上限直接启动失败，强制做工具治理。
         */
        private int maxTools = 60;

        /**
         * 工具元数据（标题/描述/示例/启用状态）的存储方式：
         * <ul>
         *   <li>{@code db}：达梦数据库 AGENT_TOOL_META，页面每次修改立即落库（默认）；</li>
         *   <li>{@code file}：JSON 文件，旧实现，单机调试用；</li>
         *   <li>{@code memory}：只存内存，重启还原为注解默认值（只读部署用）。</li>
         * </ul>
         */
        private String metaStore = "db";

        /** 元数据文件路径（相对路径以进程工作目录为基准） */
        private String metaFile = "./config/agent-tool-meta.json";

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public Permission getPermission() { return permission; }
        public void setPermission(Permission permission) { this.permission = permission; }
        public int getMaxTools() { return maxTools; }
        public void setMaxTools(int maxTools) { this.maxTools = maxTools; }
        public String getMetaStore() { return metaStore; }
        public void setMetaStore(String metaStore) { this.metaStore = metaStore; }
        public String getMetaFile() { return metaFile; }
        public void setMetaFile(String metaFile) { this.metaFile = metaFile; }
    }

    /**
     * 工具侧权限开关（对应 {@code lonwin.agent.tools.permission.*}）。
     *
     * <p>现阶段以问答功能为主，权限只保留一个抽象接口 {@code AgentToolAccessPolicy}：
     * <ul>
     *   <li>{@code enabled=false}（默认）：门面直接放行，连策略接口都不调用，零开销；</li>
     *   <li>{@code enabled=true}：走策略接口，默认实现委托原有的 ActUrl 功能权限校验，
     *       未来换规则只需提供一个自己的 Bean，无需改编排层。</li>
     * </ul>
     * 单位数据权限仍由 {@code data-scope.enabled} 独立控制，两者互不干扰。
     */
    public static class Permission {

        /** 是否启用工具侧权限校验。false = 一键关闭，全部放行 */
        private boolean enabled = false;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }

    /**
     * 知识侧通道在编排层的开关（对应 {@code lonwin.agent.knowledge.*}）。
     *
     * <p><b>模块边界</b>：agent 只决定「是否读知识库、读多少、失败怎么降级」。
     * Qdrant / BGE-M3 / MinIO 的连接参数、集合名、解析与入库策略全部由
     * {@code lonwin-module-knowledge} 的 {@code KnowledgeProperties} 持有，
     * 本类刻意不保留任何连接字段，避免两个模块重复定义同一份配置。
     */
    public static class Knowledge {

        /** 是否接入知识侧通道。只有工具侧接口时置 false */
        private boolean enabled = true;

        /** 服务不可用时是否降级为「暂不可用」而不是抛异常中断整轮问答 */
        private boolean degradeOnError = true;

        /** 最终送进大模型上下文的片段数（跨集合合并后截断） */
        private int topK = 8;

        /** 单个片段进 prompt 的最大字符数，防止撑爆上下文 */
        private int maxTextChars = 900;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public boolean isDegradeOnError() { return degradeOnError; }
        public void setDegradeOnError(boolean degradeOnError) { this.degradeOnError = degradeOnError; }
        public int getTopK() { return topK; }
        public void setTopK(int topK) { this.topK = topK; }
        public int getMaxTextChars() { return maxTextChars; }
        public void setMaxTextChars(int maxTextChars) { this.maxTextChars = maxTextChars; }
    }

    /** 大模型接口配置 */
    public static class Qwen {

        /** 接口前缀，需包含 /v1 */
        private String baseUrl = "http://10.3.34.79/localApi/v1";

        /** 密钥（与出口 IP 绑定，勿提交仓库） */
        private String apiKey = "";

        private String model = "qwen3";

        /**
         * 单次输出上限。答案要求「尽可能详细」（结论 + 逐项明细 + 口径 + 分段），
         * 1024 容易把 JSON 截断在 answer 中途，宁可给足；上游报 40005（超上下文）时再下调。
         */
        private int maxTokens = 2048;

        /**
         * 模型上下文窗口（输入 + 输出）。qwen3 平台为 32000，超限会直接报
         * 40005「请求超出模型上下文长度」，所以本地按它做输入预算。
         */
        private int contextTokens = 32000;

        /**
         * 平台估算 token 的换算比例：{@code 字符数 / 1.6}。
         * 本地预算必须用同一公式，才能和上游的 40005 判定对齐。
         */
        private double charsPerToken = 1.6;

        /** 数据问答建议 0.2，越低越稳定 */
        private double temperature = 0.2;

        private int connectTimeoutSeconds = 10;

        private int readTimeoutSeconds = 120;

        /** 是否保留 qwen3 思考过程，默认关闭（省 token、响应快） */
        private boolean thinkingEnabled = false;

        /**
         * 是否启用流式（SSE）调用。开启后最终回答逐字推给前端，首字可见时间从
         * 「整轮模型生成 + 工具调用」缩短到「模型吐出第一个字」；工具轮仍发进度事件。
         * 关闭则整条链路退回 {@code chat()} 阻塞式，便于排查或对接不支持 SSE 的网关。
         */
        private boolean streamEnabled = true;

        /** 流式调用遇到 5xx 平台故障时的最大重试次数（4xx 一律不重试） */
        private int streamMaxRetries = 3;

        public boolean isStreamEnabled() { return streamEnabled; }
        public void setStreamEnabled(boolean streamEnabled) { this.streamEnabled = streamEnabled; }
        public int getStreamMaxRetries() { return streamMaxRetries; }
        public void setStreamMaxRetries(int streamMaxRetries) { this.streamMaxRetries = streamMaxRetries; }

        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public int getMaxTokens() { return maxTokens; }
        public void setMaxTokens(int maxTokens) { this.maxTokens = maxTokens; }
        public int getContextTokens() { return contextTokens; }
        public void setContextTokens(int contextTokens) { this.contextTokens = contextTokens; }
        public double getCharsPerToken() { return charsPerToken; }
        public void setCharsPerToken(double charsPerToken) { this.charsPerToken = charsPerToken; }
        public double getTemperature() { return temperature; }
        public void setTemperature(double temperature) { this.temperature = temperature; }
        public int getConnectTimeoutSeconds() { return connectTimeoutSeconds; }
        public void setConnectTimeoutSeconds(int v) { this.connectTimeoutSeconds = v; }
        public int getReadTimeoutSeconds() { return readTimeoutSeconds; }
        public void setReadTimeoutSeconds(int readTimeoutSeconds) { this.readTimeoutSeconds = readTimeoutSeconds; }
        public boolean isThinkingEnabled() { return thinkingEnabled; }
        public void setThinkingEnabled(boolean thinkingEnabled) { this.thinkingEnabled = thinkingEnabled; }
    }

    /** 会话记忆配置 */
    public static class Memory {

        /** 每个会话最多保留的消息条数（一问一答为 2 条），防止撑爆模型上下文 */
        private int maxMessages = 20;

        public int getMaxMessages() { return maxMessages; }
        public void setMaxMessages(int maxMessages) { this.maxMessages = maxMessages; }
    }
}
