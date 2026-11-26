package cn.lonwin.module.knowledge.controller;

import cn.lonwin.module.knowledge.config.ResourceViewProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.context.properties.source.MapConfigurationPropertySource;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 文件查看端点的纯逻辑回归：路径白名单 / 穿越防护 / 对象 key 兼容 / 配置绑定。
 * 不启动 Spring 容器，也不需要真实 MinIO。
 */
class ResourceViewControllerTest {

    private static final List<String> ALLOWED = List.of("docFiles", "imgFiles");

    @Test
    @DisplayName("Qdrant payload 里的 /docFiles/日期/文件名 能拼成不带前导斜杠的对象 key")
    void safeKeyBuildsObjectKey() {
        assertThat(ResourceViewController.safeKey(
                "docFiles", ALLOWED, "2025-07-16", "2e56fc7b3fcd45b1bda41dcc3bd89643.DOCX"))
                .isEqualTo("docFiles/2025-07-16/2e56fc7b3fcd45b1bda41dcc3bd89643.DOCX");
        assertThat(ResourceViewController.safeKey("imgFiles", ALLOWED, "2025-07-16", "图 1.png"))
                .isEqualTo("imgFiles/2025-07-16/图 1.png");
    }

    @Test
    @DisplayName("白名单之外的前缀一律拒绝，避免把整个 bucket 暴露出去")
    void safeKeyRejectsUnknownPrefix() {
        assertThatThrownBy(() -> ResourceViewController.safeKey("etc", ALLOWED, "passwd"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("白名单");
        assertThatThrownBy(() -> ResourceViewController.safeKey(null, ALLOWED, "a"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("路径穿越、反斜杠、控制字符、空段全部拒绝")
    void safeKeyRejectsTraversal() {
        String[] bad = { "..", "../secret", "a/../b", "a\\b", "a:b", "a\nb", "", "." };
        for (String segment : bad) {
            assertThatThrownBy(() -> ResourceViewController.safeKey(
                    "docFiles", ALLOWED, "2025-07-16", segment))
                    .as("非法路径段: [%s]", segment)
                    .isInstanceOf(IllegalArgumentException.class);
        }
        assertThatThrownBy(() -> ResourceViewController.safeKey("docFiles", ALLOWED))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("对象 key 兼容开关：开启时先不带斜杠再带斜杠，关闭时只试一种")
    void keyCandidates() {
        assertThat(ResourceViewController.keyCandidates("docFiles/a.docx", true))
                .containsExactly("docFiles/a.docx", "/docFiles/a.docx");
        assertThat(ResourceViewController.keyCandidates("docFiles/a.docx", false))
                .containsExactly("docFiles/a.docx");
    }

    @Test
    @DisplayName("file.view 的 kebab-case 配置能正确绑定，默认值符合约定")
    void viewPropertiesBinding() {
        Map<String, Object> source = Map.of(
                "file.view.enabled", "true",
                "file.view.bucket", "yqbucket",
                "file.view.allowed-prefixes[0]", "docFiles",
                "file.view.allowed-prefixes[1]", "imgFiles",
                "file.view.inline-extensions[0]", "pdf",
                "file.view.try-leading-slash-key", "false",
                "file.view.max-object-bytes", "1048576");
        ResourceViewProperties props = new Binder(new MapConfigurationPropertySource(source))
                .bind("file.view", Bindable.of(ResourceViewProperties.class))
                .orElseGet(ResourceViewProperties::new);

        assertThat(props.isEnabled()).isTrue();
        assertThat(props.getBucket()).isEqualTo("yqbucket");
        assertThat(props.getAllowedPrefixes()).containsExactly("docFiles", "imgFiles");
        assertThat(props.getInlineExtensions()).containsExactly("pdf");
        assertThat(props.isTryLeadingSlashKey()).isFalse();
        assertThat(props.getMaxObjectBytes()).isEqualTo(1048576L);

        ResourceViewProperties defaults = new ResourceViewProperties();
        assertThat(defaults.isEnabled()).isTrue();
        assertThat(defaults.getBucket()).isEmpty();
        assertThat(defaults.getAllowedPrefixes()).containsExactly("docFiles", "imgFiles");
        assertThat(defaults.isTryLeadingSlashKey()).isTrue();
        assertThat(defaults.getMaxObjectBytes()).isZero();
    }
}
