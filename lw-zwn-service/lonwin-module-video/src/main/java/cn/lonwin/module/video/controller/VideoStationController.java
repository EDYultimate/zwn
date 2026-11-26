package cn.lonwin.module.video.controller;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.module.video.model.vo.VideoPlayVO;
import cn.lonwin.module.video.model.vo.VideoStationDetailVO;
import cn.lonwin.module.video.model.vo.VideoStationVO;
import cn.lonwin.module.video.service.VideoStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 视频监控页接口：点位列表、点位基本信息、视频播放地址、监管单位选项。
 */
@RestController
@RequestMapping("/video/stations")
@RequiredArgsConstructor
public class VideoStationController {

    private final VideoStationService stationService;

    /**
     * 监控点位列表。date 为查询日期（yyyy-MM-dd），其余参数与页面筛选项一致。
     */
    @GetMapping
    public Result<List<VideoStationVO>> list(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String org,
            @RequestParam(required = false) String status) {
        return Result.success(stationService.listStations(date, keyword, org, status));
    }

    /**
     * 监管单位下拉选项（前端自行补「全部」）。
     */
    @GetMapping("/orgs")
    public Result<List<String>> orgs() {
        return Result.success(stationService.listOrgs());
    }

    /**
     * 点位基本信息（视频详情弹框左侧信息区）。
     */
    @GetMapping("/{code}")
    public Result<VideoStationDetailVO> detail(
            @PathVariable("code") String code,
            @RequestParam(required = false) String date) {
        VideoStationDetailVO detail = stationService.getDetail(code, date);
        return detail == null
                ? Result.<VideoStationDetailVO>fail("未找到视频点位：" + code)
                : Result.success(detail);
    }

    /**
     * 视频播放地址（HLS）+ 最新抓拍降级画面。
     */
    @GetMapping("/{code}/play")
    public Result<VideoPlayVO> play(
            @PathVariable("code") String code,
            @RequestParam(required = false) String date) {
        return Result.success(stationService.getPlay(code, date));
    }
}
