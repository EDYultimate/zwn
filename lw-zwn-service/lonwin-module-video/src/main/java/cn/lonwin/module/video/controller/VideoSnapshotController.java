package cn.lonwin.module.video.controller;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.video.model.dto.SnapshotDownloadRequest;
import cn.lonwin.module.video.model.vo.SnapshotUploadVO;
import cn.lonwin.module.video.model.vo.SnapshotVO;
import cn.lonwin.module.video.service.VideoSnapshotService;
import cn.lonwin.module.video.service.VideoSnapshotStorageService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 定时截图图片接口：抓拍列表、图片预览、单张 / 批量下载、图片上传到 MinIO。
 */
@RestController
@RequestMapping("/video/snapshots")
@RequiredArgsConstructor
public class VideoSnapshotController {

    private final VideoSnapshotService snapshotService;

    private final VideoSnapshotStorageService storageService;

    /**
     * 抓拍列表。支持按日期、点位、分组（timed / abnormal / water / all）过滤。
     */
    @GetMapping
    public Result<List<SnapshotVO>> list(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String group,
            @RequestParam(required = false, defaultValue = "200") int limit) {
        int max = Math.min(Math.max(limit, 1), 500);
        try {
            return Result.success(snapshotService.list(date, code, group, max));
        } catch (IllegalArgumentException e) {
            return Result.fail(e.getMessage());
        }
    }

    /**
     * 图片预览（浏览器 img 标签直连，无需鉴权头）。
     * <p>
     * path 为抓拍记录里的 FILE_PATH：local 模式是相对截图根目录路径，minio 模式是对象 key，
     * 两种存储都由服务端自动识别。
     */
    @GetMapping("/image")
    public void image(@RequestParam("path") String path, HttpServletResponse response)
            throws IOException {
        try {
            snapshotService.writeImage(path, false, response);
        } catch (Exception e) {
            writeError(response, e.getMessage());
        }
    }

    /**
     * 单张图片下载。
     */
    @GetMapping("/download")
    public void downloadOne(@RequestParam("path") String path, HttpServletResponse response)
            throws IOException {
        try {
            snapshotService.writeImage(path, true, response);
        } catch (Exception e) {
            writeError(response, e.getMessage());
        }
    }

    /**
     * 勾选多张图片打包下载（页面「下载」按钮）。
     */
    @PostMapping("/download")
    public void downloadZip(@RequestBody(required = false) SnapshotDownloadRequest body,
                            HttpServletResponse response) throws IOException {
        if (body == null || body.getPaths() == null || body.getPaths().isEmpty()) {
            writeError(response, "没有可下载的截图文件");
            return;
        }
        snapshotService.writeZip(body.getPaths(), response);
    }

    /**
     * 保存图片到对象存储（MinIO）的接口。
     * <p>
     * storage 可选 minio / local，缺省跟随 {@code lonwin.spjk.snapshot-storage}；
     * 返回的 path + url 与抓拍图片一致，可直接用于预览 / 下载。
     */
    @PostMapping("/upload")
    public Result<SnapshotUploadVO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String storage) {
        try {
            VideoSnapshotStorageService.StoredSnapshot stored = storageService.storeUpload(file, storage);
            SnapshotUploadVO vo = new SnapshotUploadVO();
            vo.setStorageType(stored.storageType());
            vo.setPath(stored.path());
            vo.setUrl(stored.url());
            vo.setFileName(stored.fileName());
            vo.setSize(stored.size());
            return Result.success(vo);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return Result.fail(e.getMessage());
        } catch (Exception e) {
            return Result.fail("保存图片失败：" + e.getMessage());
        }
    }

    private void writeError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.setContentType("text/plain;charset=UTF-8");
        response.getWriter().write(message == null ? "文件不存在" : message);
    }
}
