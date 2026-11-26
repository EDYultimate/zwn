package cn.lonwin.module.video.model.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 批量下载截图请求：paths 为截图相对路径（相对截图根目录）。
 */
@Data
public class SnapshotDownloadRequest {

    private List<String> paths = new ArrayList<>();
}
