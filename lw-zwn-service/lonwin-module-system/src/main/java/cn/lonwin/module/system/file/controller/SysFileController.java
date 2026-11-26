package cn.lonwin.module.system.file.controller;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.StrUtil;
import cn.lonwin.common.core.model.vo.Result;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import cn.lonwin.framework.file.entity.SysFile;
import cn.lonwin.framework.file.service.SysFileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件管理
 * 接口层归属 system 模块；文件上传/存储核心能力由 lonwin-framework-file 提供
 *
 * @author Luckly
 * @date 2019-06-18 17:18:42
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ossFile")
@Tag(description = "ossFile", name = "文件管理")
@SecurityRequirement(name = HttpHeaders.AUTHORIZATION)
public class SysFileController {

	private final SysFileService sysFileService;

	/**
	 * 分页查询
	 * @param page 分页对象
	 * @param sysFile 文件管理
	 * @return
	 */
	@Operation(summary = "分页查询", description = "分页查询")
	@GetMapping("/page")
	public Result getSysFilePage(@ParameterObject Page page, @ParameterObject SysFile sysFile) {
		LambdaQueryWrapper<SysFile> wrapper = Wrappers.<SysFile>lambdaQuery()
				.eq(StrUtil.isNotBlank(sysFile.getType()), SysFile::getType, sysFile.getType())
				.eq(StrUtil.isNotBlank(sysFile.getGroupId()), SysFile::getGroupId, sysFile.getGroupId())
				.eq(StrUtil.isNotBlank(sysFile.getGroupType()), SysFile::getGroupType, sysFile.getGroupType())
				.like(StrUtil.isNotBlank(sysFile.getOriginal()), SysFile::getOriginal, sysFile.getOriginal());
		return Result.success(sysFileService.page(page, wrapper));
	}

	/**
	 * 列表查询
	 * @param sysFile 文件管理
	 * @return
	 */
	@Operation(summary = "列表查询", description = "列表查询")
	@GetMapping("/list")
	public Result getSysFileList(@ParameterObject SysFile sysFile) {
		LambdaQueryWrapper<SysFile> wrapper = Wrappers.<SysFile>lambdaQuery()
				.eq(StrUtil.isNotBlank(sysFile.getType()), SysFile::getType, sysFile.getType())
				.eq(StrUtil.isNotBlank(sysFile.getGroupId()), SysFile::getGroupId, sysFile.getGroupId())
				.eq(StrUtil.isNotBlank(sysFile.getGroupType()), SysFile::getGroupType, sysFile.getGroupType())
				.like(StrUtil.isNotBlank(sysFile.getOriginal()), SysFile::getOriginal, sysFile.getOriginal());
		return Result.success(sysFileService.list(wrapper));
	}

	/**
	 * 通过id删除文件管理
	 * @param ids id 列表
	 * @return R
	 */
	@Operation(summary = "通过id删除文件管理", description = "通过id删除文件管理")
	@DeleteMapping
	public Result removeById(@RequestBody Long[] ids) {
		for (Long id : ids) {
			sysFileService.deleteFile(id);
		}
		return Result.success();
	}

	@PutMapping("/rename")
	public Result rename(@RequestBody SysFile sysFile) {
		return Result.success(sysFileService.updateById(sysFile));
	}

	/**
	 * 上传文件 文件名采用uuid,避免原始文件名中带"-"符号导致下载的时候解析出现异常
	 * <p>
	 * 文件存放目录由后台按日期自动生成（yyyy/MM/dd），前端无需也无法指定。
	 * @param file 资源
	 * @return R(/ admin / bucketName / filename)
	 */
	@Operation(summary = "上传文件", description = "上传文件")
	@PostMapping(value = "/upload")
	public Result upload(@RequestPart("file") MultipartFile file,
						 @RequestParam(value = "groupId", required = false) String groupId,
						 @RequestParam(value = "groupType", required = false) String groupType) {
		return sysFileService.uploadFile(file, null, groupId, groupType);
	}

	/**
	 * 获取文件
	 * @param fileName 文件空间/名称
	 * @param response
	 * @return
	 */
	@Operation(summary = "通过文件名获取文件", description = "通过文件名获取文件")
	@GetMapping("/oss/file")
	public void file(String fileName, HttpServletResponse response) {
		sysFileService.getFile(fileName, response);
	}

	/**
	 * 获取文件
	 * @param id 文件id
	 * @param response
	 * @return
	 */
	@Operation(summary = "通过id获取文件", description = "通过id获取文件")
	@GetMapping("/{id}")
	public void getFile(@PathVariable Long id, HttpServletResponse response) {
		sysFileService.getFile(id, response);
	}

	/**
	 * 获取本地（resources）文件
	 * @param fileName 文件名称
	 * @param response 本地文件
	 */
	@SneakyThrows
	@GetMapping("/local/file/{fileName}")
	public void localFile(@PathVariable String fileName, HttpServletResponse response) {
		ClassPathResource resource = new ClassPathResource("file/" + fileName);
		response.setContentType("application/octet-stream; charset=UTF-8");
		IoUtil.copy(resource.getInputStream(), response.getOutputStream());
	}

}
