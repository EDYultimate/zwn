package cn.lonwin.module.system.file.controller;

import cn.lonwin.common.core.model.vo.Result;
import cn.lonwin.framework.file.entity.SysFile;
import cn.lonwin.framework.file.service.SysFileService;
import cn.lonwin.framework.security.token.powers.RSAEncryptUtil;
import cn.lonwin.module.system.file.config.OpenFileProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 外部系统文件访问接口（open API）
 * <p>
 * 鉴权方式与菜单推送（apiKey + timestamp + sign）保持同一套体系：
 * 1. 外部系统用本系统发放的 RSA 公钥对 timestamp（毫秒）加密，生成 sign
 * 2. 携带 apiKey / timestamp / sign 三个参数请求本接口（query 或 header 均可）
 * 3. 本系统用私钥解密 sign，与 timestamp 比对，并校验时间窗防重放
 * <p>
 * 路径前缀 /api/open/** 在 SecurityConfig 中 permitAll，鉴权由本接口自行完成
 *
 * @author lonwin
 */
@Slf4j
@RestController
@RequestMapping("/api/open/file")
@RequiredArgsConstructor
@Tag(name = "外部文件访问", description = "供外部系统访问文件元数据/下载文件（apiKey 验签）")
public class OpenFileController {

	private final SysFileService sysFileService;

	private final OpenFileProperties properties;

	/**
	 * 获取文件元数据（不含文件流）
	 * @param id 文件编号
	 * @return 文件名/原始文件名/大小/类型/hash 等
	 */
	@Operation(summary = "获取文件元数据", description = "外部系统验签后获取文件元数据")
	@GetMapping("/info/{id}")
	public Result<Map<String, Object>> info(@PathVariable Long id,
											@RequestParam("apiKey") String apiKey,
											@RequestParam("timestamp") long timestamp,
											@RequestParam("sign") String sign) {
		if (!verify(apiKey, timestamp, sign)) {
			return Result.fail("验签失败或接口未开放");
		}
		SysFile file = sysFileService.getById(id);
		if (Objects.isNull(file)) {
			return Result.fail("文件不存在");
		}
		Map<String, Object> data = new LinkedHashMap<>(8);
		data.put("id", file.getId());
		data.put("fileName", file.getFileName());
		data.put("original", file.getOriginal());
		data.put("type", file.getType());
		data.put("fileSize", file.getFileSize());
		data.put("hash", file.getHash());
		return Result.success(data);
	}

	/**
	 * 下载文件流
	 * @param id 文件编号
	 */
	@Operation(summary = "下载文件", description = "外部系统验签后下载文件流")
	@GetMapping("/{id}")
	public void download(@PathVariable Long id,
						 @RequestParam("apiKey") String apiKey,
						 @RequestParam("timestamp") long timestamp,
						 @RequestParam("sign") String sign,
						 HttpServletResponse response) {
		if (!verify(apiKey, timestamp, sign)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}
		sysFileService.getFile(id, response);
	}

	/**
	 * 验签：开关 + apiKey 比对 + 时间窗 + RSA 解密比对
	 * @return true 验签通过
	 */
	private boolean verify(String apiKey, long timestamp, String sign) {
		if (!properties.isEnabled()) {
			log.warn("外部文件接口未开放，拒绝访问");
			return false;
		}
		if (!properties.getApiKey().equals(apiKey)) {
			log.warn("外部文件接口 apiKey 不匹配，拒绝访问");
			return false;
		}
		// 时间窗校验，防重放
		long now = System.currentTimeMillis();
		if (Math.abs(now - timestamp) > properties.getTimestampValidMillis()) {
			log.warn("外部文件接口时间戳过期, timestamp={}, now={}", timestamp, now);
			return false;
		}
		try {
			// 私钥解密 sign，应与 timestamp 一致
			String decrypted = RSAEncryptUtil.decrypt(sign,
					Base64.decodeBase64(properties.getApiSecret().getBytes(StandardCharsets.UTF_8)));
			return String.valueOf(timestamp).equals(decrypted);
		}
		catch (Exception e) {
			log.error("外部文件接口验签异常", e);
			return false;
		}
	}

}
