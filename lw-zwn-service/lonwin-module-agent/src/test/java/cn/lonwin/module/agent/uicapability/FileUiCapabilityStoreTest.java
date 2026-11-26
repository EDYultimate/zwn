package cn.lonwin.module.agent.uicapability;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.lonwin.module.agent.config.AgentProperties;

/**
 * 能力声明持久化测试。
 *
 * <p>锁定行为：后端重启后能力清单不能凭空消失。
 * 只存内存时，重启会让清单变空，而前端那边还记着「已上报过」不会补报，
 * 表现为模型认为系统没有这些页面、所有跳转/高亮按钮全部消失。
 */
@DisplayName("能力声明文件存储")
class FileUiCapabilityStoreTest {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("写入后重启（新建实例）仍能恢复声明")
    void survivesRestart() {
        Path file = tempDir.resolve("agent-ui-capabilities.json");
        FileUiCapabilityStore first = newStore(file);
        first.load();
        first.replaceAll("web", List.of(page("/waterUse/shuiliangjiankong", "水量监控", "tile.xuKeShuiLiang")));

        assertThat(file).exists();

        FileUiCapabilityStore restarted = newStore(file);
        restarted.load();

        assertThat(restarted.findAll()).hasSize(1);
        assertThat(restarted.findByRoute("/waterUse/shuiliangjiankong")).isPresent();
        assertThat(restarted.findAll().get(0).getAnchors())
                .extracting(UiPageCapability.Anchor::getTarget)
                .containsExactly("tile.xuKeShuiLiang");
    }

    @Test
    @DisplayName("清空后重启保持为空，不会把下线的页面复活")
    void clearIsPersisted() {
        Path file = tempDir.resolve("agent-ui-capabilities.json");
        FileUiCapabilityStore first = newStore(file);
        first.load();
        first.replaceAll("web", List.of(page("/a", "页面A", "anchor.a")));
        first.clear("web");

        FileUiCapabilityStore restarted = newStore(file);
        restarted.load();

        assertThat(restarted.findAll()).isEmpty();
    }

    @Test
    @DisplayName("文件损坏时按空清单启动，不阻塞应用")
    void brokenFileDoesNotFailStartup() throws Exception {
        Path file = tempDir.resolve("agent-ui-capabilities.json");
        java.nio.file.Files.writeString(file, "{ this is not json");

        FileUiCapabilityStore store = newStore(file);
        store.load();

        assertThat(store.findAll()).isEmpty();
    }

    // ==================== 测试装配 ====================

    private FileUiCapabilityStore newStore(Path file) {
        AgentProperties properties = new AgentProperties();
        properties.getUiCapability().setStore("file");
        properties.getUiCapability().setFile(file.toString());
        return new FileUiCapabilityStore(new ObjectMapper(), properties);
    }

    private UiPageCapability page(String route, String title, String anchorTarget) {
        UiPageCapability page = new UiPageCapability();
        page.setRoute(route);
        page.setTitle(title);
        page.setVersion("1");
        UiPageCapability.Anchor anchor = new UiPageCapability.Anchor();
        anchor.setTarget(anchorTarget);
        anchor.setDesc("测试锚点");
        page.setAnchors(List.of(anchor));
        return page;
    }
}
