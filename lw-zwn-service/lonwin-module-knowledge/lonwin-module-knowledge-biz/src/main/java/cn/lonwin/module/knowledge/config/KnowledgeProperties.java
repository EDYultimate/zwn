package cn.lonwin.module.knowledge.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 知识模块配置。
 *
 * <p><b>前缀暂时沿用 {@code lonwin.agent.knowledge}</b>：现有部署已在该段配好
 * Qdrant / BGE-M3 地址，阶段 1 只搬查询层，不该逼运维同步改两份配置。
 * agent 的 {@code AgentProperties.Knowledge} 与本类绑定同一前缀，各取所需字段
 * （ConfigurationProperties 默认忽略未知字段），互不冲突：
 * <ul>
 *   <li>agent 读 enabled / top-k / max-text-chars / degrade-on-error 做编排与降级；</li>
 *   <li>本类读连接参数、集合名、mode 以及 storage/retrieval 子段做检索与入库。</li>
 * </ul>
 * 阶段 4 若要彻底解耦，可把本类前缀换成 {@code lonwin.knowledge} 并把配置整段搬过去，
 * 编排层只需保留一个 enabled 开关。
 */
@ConfigurationProperties(prefix = "lonwin.agent.knowledge")
public class KnowledgeProperties {

    /** 历史兼容字段：实现已唯一，保留只为旧配置不报错，不再参与条件装配。 */
    private String mode = "local";

    /** 是否接入知识侧通道；与 agent 编排层共用同一个开关 */
    private boolean enabled = true;

    /** 服务不可用时是否降级为「暂不可用」而不是抛异常中断整轮问答 */
    private boolean degradeOnError = true;

    /** BGE-M3 推理服务地址（独立 Python 进程，见 lonwin-module-agent/knowledge/embedding-service） */
    private String embedUrl = "http://127.0.0.1:8000";

    /** BGE-M3 API key，可选；本地开发态为空。服务侧设了 BGE_API_KEY 则必填。 */
    private String embedApiKey = "";

    /** Qdrant REST 地址 */
    private String qdrantUrl = "http://127.0.0.1:6333";

    /** Qdrant API key，可选；本地开发态为空 */
    private String qdrantApiKey = "";

    /** 片段级 / 表格级 / 文档级集合名（入库脚本与在线检索必须一致） */
    private String collectionChunks = "kp_chunks";
    private String collectionTables = "kp_tables";
    private String collectionDocs = "kp_docs";

    /** 命名向量名，与建集合脚本一致 */
    private String denseVector = "dense";
    private String sparseVector = "sparse";

    /** 每路 prefetch 的候选数，必须 ≥ topK */
    private int prefetchLimit = 20;

    /** 最终送进大模型上下文的片段数（跨集合合并后截断） */
    private int topK = 8;

    /** 单个片段进 prompt 的最大字符数，防止撑爆上下文 */
    private int maxTextChars = 900;

    /** 入库时写入 payload 的嵌入模型标识，用于发现「换模型未重灌」 */
    private String embedderId = "bge-m3@2026-11";

    private int connectTimeoutSeconds = 3;
    private int readTimeoutSeconds = 10;

    private Storage storage = new Storage();
    private Retrieval retrieval = new Retrieval();
    private Index index = new Index();

    /**
     * MinIO 存储配置。
     *
     * <p>所有上传文件<b>一律写入 MinIO</b>，同名、同 fileHash、判定为重复附件也一样写：
     * 去重只决定「是否切片入 Qdrant」，绝不跳过对象写入，也不删已上传对象。
     * key 前缀沿用 docFiles / imgFiles，可直接复用 lonwin-framework-file 的
     * {@code /docFiles/**}、{@code /imgFiles/**} 与 {@code /resourceShow/file} 查看链路。
     */
    public static class Storage {

        /** 是否启用上传入库入口 */
        private boolean enabled = true;

        /** 留空则跟随 file.bucketName（当前为 yqbucket） */
        private String bucket = "";

        /** 原文件与解析产物的对象前缀，必须落在 file.view.allowed-prefixes 白名单内 */
        private String sourcePrefix = "docFiles/knowledge";

        /** 抽出的图片对象前缀 */
        private String imagePrefix = "imgFiles/knowledge";

        /** 单次上传文件数上限（批量接口） */
        private int maxBatchSize = 50;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public String getBucket() { return bucket; }
        public void setBucket(String bucket) { this.bucket = bucket; }
        public String getSourcePrefix() { return sourcePrefix; }
        public void setSourcePrefix(String sourcePrefix) { this.sourcePrefix = sourcePrefix; }
        public String getImagePrefix() { return imagePrefix; }
        public void setImagePrefix(String imagePrefix) { this.imagePrefix = imagePrefix; }
        public int getMaxBatchSize() { return maxBatchSize; }
        public void setMaxBatchSize(int maxBatchSize) { this.maxBatchSize = maxBatchSize; }
    }

    /** 检索侧策略（阶段 3 的组内折叠与 filter 下推在这里留开关） */
    public static class Retrieval {

        /** 跨集合按秩融合的 RRF 常数 */
        private int rrfK = 60;

        /**
         * RRF 之后按 groupId 折叠同名 PDF/Word/Excel，只保留每组最高分。
         * 阶段 1 默认关闭：存量 867 条 payload 没有 groupId，打开会把同一文档的
         * 多个 chunk 误压成一条。阶段 2 新数据带上 groupId 后再置 true；
         * 实现里也只对 groupId 非空的命中折叠，双保险。
         */
        private boolean foldByGroup = false;

        /** 组内折叠后是否补一条异源命中（避免同组多版本完全丢失互补信息） */
        private boolean keepCrossSourceComplement = true;

        /** 单个集合 prefetch 上限硬保护，避免配置把 Qdrant 打爆 */
        private int maxPrefetch = 50;

        public int getRrfK() { return rrfK; }
        public void setRrfK(int rrfK) { this.rrfK = rrfK; }
        public boolean isFoldByGroup() { return foldByGroup; }
        public void setFoldByGroup(boolean foldByGroup) { this.foldByGroup = foldByGroup; }
        public boolean isKeepCrossSourceComplement() { return keepCrossSourceComplement; }
        public void setKeepCrossSourceComplement(boolean v) { this.keepCrossSourceComplement = v; }
        public int getMaxPrefetch() { return maxPrefetch; }
        public void setMaxPrefetch(int maxPrefetch) { this.maxPrefetch = maxPrefetch; }
    }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public boolean isDegradeOnError() { return degradeOnError; }
    public void setDegradeOnError(boolean v) { this.degradeOnError = v; }
    public String getEmbedUrl() { return embedUrl; }
    public void setEmbedUrl(String v) { this.embedUrl = v; }
    public String getEmbedApiKey() { return embedApiKey; }
    public void setEmbedApiKey(String v) { this.embedApiKey = v; }
    public String getQdrantUrl() { return qdrantUrl; }
    public void setQdrantUrl(String v) { this.qdrantUrl = v; }
    public String getQdrantApiKey() { return qdrantApiKey; }
    public void setQdrantApiKey(String v) { this.qdrantApiKey = v; }
    public String getCollectionChunks() { return collectionChunks; }
    public void setCollectionChunks(String v) { this.collectionChunks = v; }
    public String getCollectionTables() { return collectionTables; }
    public void setCollectionTables(String v) { this.collectionTables = v; }
    public String getCollectionDocs() { return collectionDocs; }
    public void setCollectionDocs(String v) { this.collectionDocs = v; }
    public String getDenseVector() { return denseVector; }
    public void setDenseVector(String v) { this.denseVector = v; }
    public String getSparseVector() { return sparseVector; }
    public void setSparseVector(String v) { this.sparseVector = v; }
    public int getPrefetchLimit() { return prefetchLimit; }
    public void setPrefetchLimit(int v) { this.prefetchLimit = v; }
    public int getTopK() { return topK; }
    public void setTopK(int v) { this.topK = v; }
    public int getMaxTextChars() { return maxTextChars; }
    public void setMaxTextChars(int v) { this.maxTextChars = v; }
    public String getEmbedderId() { return embedderId; }
    public void setEmbedderId(String v) { this.embedderId = v; }
    public int getConnectTimeoutSeconds() { return connectTimeoutSeconds; }
    public void setConnectTimeoutSeconds(int v) { this.connectTimeoutSeconds = v; }
    public int getReadTimeoutSeconds() { return readTimeoutSeconds; }
    public void setReadTimeoutSeconds(int v) { this.readTimeoutSeconds = v; }
    public Storage getStorage() { return storage; }
    public void setStorage(Storage storage) {
        this.storage = storage == null ? new Storage() : storage;
    }
    public Retrieval getRetrieval() { return retrieval; }
    public void setRetrieval(Retrieval retrieval) {
        this.retrieval = retrieval == null ? new Retrieval() : retrieval;
    }
    public Index getIndex() { return index; }
    public void setIndex(Index index) {
        this.index = index == null ? new Index() : index;
    }

    /**
     * 上传即入库的解析 / 切片 / 编码策略。
     *
     * <p>默认异步：上传请求线程只投递任务，BGE-M3 编码与 Qdrant upsert 在独立线程池执行；
     * 置 {@code sync=true} 则在上传请求内同步完成（便于验收，但会拉长接口 RT）。
     */
    public static class Index {

        /** 是否启用「上传即写 Qdrant」；关闭时文件仍无条件存 MinIO */
        private boolean enabled = true;

        /** true = 上传请求内同步索引；false = 独立线程池异步索引（默认） */
        private boolean sync = false;

        /** BGE-M3 单次 /encode 的文本条数 */
        private int batchSize = 16;

        /** 片段目标长度与硬上限（字符） */
        private int chunkMin = 300;
        private int chunkMax = 500;
        private int hardMax = 600;

        /** 每个表格 point 的数据行数（表头会重复带上） */
        private int tableRowsPerPoint = 15;

        /** 是否在 embedText 前置【文件】【章节】【类型】上下文头 */
        private boolean contextHeader = true;

        /** 批量编码的读超时（秒），明显长于在线查询 */
        private int encodeTimeoutSeconds = 600;

        /** 定时兜底：扫描 PENDING / FAILED，补偿进程重启或外部依赖抖动丢掉的任务 */
        private boolean scanEnabled = true;
        private long scanIntervalMs = 30_000L;
        private int maxScanBatch = 20;

        /** 索引线程池 */
        private int corePoolSize = 2;
        private int queueCapacity = 200;

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean v) { enabled = v; }
        public boolean isSync() { return sync; }
        public void setSync(boolean v) { sync = v; }
        public int getBatchSize() { return batchSize; }
        public void setBatchSize(int v) { batchSize = v; }
        public int getChunkMin() { return chunkMin; }
        public void setChunkMin(int v) { chunkMin = v; }
        public int getChunkMax() { return chunkMax; }
        public void setChunkMax(int v) { chunkMax = v; }
        public int getHardMax() { return hardMax; }
        public void setHardMax(int v) { hardMax = v; }
        public int getTableRowsPerPoint() { return tableRowsPerPoint; }
        public void setTableRowsPerPoint(int v) { tableRowsPerPoint = v; }
        public boolean isContextHeader() { return contextHeader; }
        public void setContextHeader(boolean v) { contextHeader = v; }
        public int getEncodeTimeoutSeconds() { return encodeTimeoutSeconds; }
        public void setEncodeTimeoutSeconds(int v) { encodeTimeoutSeconds = v; }
        public boolean isScanEnabled() { return scanEnabled; }
        public void setScanEnabled(boolean v) { scanEnabled = v; }
        public long getScanIntervalMs() { return scanIntervalMs; }
        public void setScanIntervalMs(long v) { scanIntervalMs = v; }
        public int getMaxScanBatch() { return maxScanBatch; }
        public void setMaxScanBatch(int v) { maxScanBatch = v; }
        public int getCorePoolSize() { return corePoolSize; }
        public void setCorePoolSize(int v) { corePoolSize = v; }
        public int getQueueCapacity() { return queueCapacity; }
        public void setQueueCapacity(int v) { queueCapacity = v; }
    }
}
