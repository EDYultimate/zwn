package cn.lonwin.module.video.model.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 截图执行结果（与截图源模块口径一致）。
 */
@Data
public class SnapshotResult {

    /** 点位总数 */
    private int total;

    /** 成功数量 */
    private int success;

    /** 失败数量 */
    private int fail;

    /** 单个点位截图明细 */
    private List<Item> items = new ArrayList<>();

    @Data
    public static class Item {

        public Item() {
        }

        public Item(String code, String name, boolean ok, String file, String message) {
            this.code = code;
            this.name = name;
            this.ok = ok;
            this.file = file;
            this.message = message;
        }

        /** 点位编码 */
        private String code;

        /** 点位名称 */
        private String name;

        /** 是否成功 */
        private boolean ok;

        /** 保存的图片绝对路径 */
        private String file;

        /** 截图列表使用的相对路径（相对截图根目录） */
        private String path;

        /** 失败原因（成功时为空） */
        private String message;
    }
}
