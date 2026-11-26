package cn.lonwin.module.knowledge.controller;

import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.lonwin.common.file.core.FileProperties;
import com.lonwin.common.file.oss.OssProperties;
import com.lonwin.common.file.oss.service.OssTemplate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

import java.io.InputStream;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 真实 MinIO 连通性冒烟：默认不执行（CI / 无 MinIO 环境不会挂），
 * 需要时显式打开：
 *
 * <pre>
 * MINIO_SMOKE=true mvn -pl lonwin-framework/lonwin-framework-file -am \
 *   test -Dtest=MinioSmokeTest
 * </pre>
 *
 * <p>验证三件事：凭据可用、bucket 里确实有知识库原文、对象 key 的真实写法
 * （带不带前导斜杠），后者决定 {@link ResourceViewController#keyCandidates} 的兼容策略。
 */
@EnabledIfEnvironmentVariable(named = "MINIO_SMOKE", matches = "true")
class MinioSmokeTest {

    private static final String BUCKET = "yqbucket";

    @Test
    void readsRealKnowledgeDocument() throws Exception {
        FileProperties fileProperties = new FileProperties();
        fileProperties.setBucketName(BUCKET);

        OssProperties oss = new OssProperties();
        oss.setEndpoint(env("MINIO_ENDPOINT", "http://127.0.0.1:9000"));
        oss.setAccessKey(env("MINIO_ACCESS_KEY", "minioadmin"));
        oss.setSecretKey(env("MINIO_SECRET_KEY", "Lonwin6_minio_20241214"));
        oss.setRegion("us-east-1");
        oss.setPathStyleAccess(true);
        fileProperties.setOss(oss);

        OssTemplate template = new OssTemplate(fileProperties);
        template.afterPropertiesSet();

        List<S3ObjectSummary> summaries = template.getAllObjectsByPrefix(BUCKET, "docFiles/", true);
        assertThat(summaries).as("yqbucket 下应有 docFiles 对象").isNotEmpty();

        String key = summaries.get(0).getKey();
        System.out.println("[minio-smoke] 对象总数=" + summaries.size() + "，首个 key=" + key);
        assertThat(key).doesNotContain("..");

        try (S3Object object = template.getObject(BUCKET, key);
             InputStream in = object.getObjectContent()) {
            assertThat(in).isNotNull();
            // 读完整流，避免 SDK 因提前关闭而打印 "Not all bytes were read" 告警
            byte[] bytes = in.readAllBytes();
            assertThat(bytes.length).isEqualTo(summaries.get(0).getSize());
            System.out.println("[minio-smoke] 成功读取 " + bytes.length + " 字节，key=" + key);
        }
    }

    private static String env(String name, String fallback) {
        String value = System.getenv(name);
        return (value == null || value.isBlank()) ? fallback : value;
    }
}
