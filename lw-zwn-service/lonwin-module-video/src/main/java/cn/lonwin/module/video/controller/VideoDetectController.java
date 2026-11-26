package cn.lonwin.module.video.controller;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.video.model.vo.DetectAnalyzeVO;
import cn.lonwin.module.video.service.VideoSnapshotAnalyzeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 图片智能识别接口（手动触发，不依赖定时截图任务）。
 */
@RestController
@RequestMapping("/video/detect")
@RequiredArgsConstructor
public class VideoDetectController {

    private final VideoSnapshotAnalyzeService analyzeService;

    /**
     * 单独分析图片：按视频站编码或抓拍日期，识别已有的抓拍图片。
     * <p>
     * 参数（code / date 至少传一个，同时传则取交集）：
     * <ul>
     *   <li>code：视频站编码，如 f238887d5e4041e59083309031a0ce4a</li>
     *   <li>date：抓拍日期 yyyy-MM-dd，留空且只传 code 时默认当天</li>
     *   <li>group：分组 timed / abnormal / water，留空为全部</li>
     *   <li>limit：最多识别条数，默认 50，传 0 表示不限制</li>
     * </ul>
     * 示例：{@code POST /video/detect/analyze?code=xxx} 或
     * {@code GET /video/detect/analyze?date=2026-11-24&group=timed&limit=20}
     *
     * @return 识别汇总（总数 / 成功 / 异常 / 失败 + 每张明细）
     */
    @RequestMapping(value = "/analyze", method = {RequestMethod.GET, RequestMethod.POST})
    public Result<DetectAnalyzeVO> analyze(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String group,
            @RequestParam(required = false, defaultValue = "50") int limit) {
        try {
            int max = limit <= 0 ? 0 : Math.min(limit, 500);
            return Result.success(analyzeService.analyze(code, date, group, max));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return Result.fail(e.getMessage());
        }
    }
}
