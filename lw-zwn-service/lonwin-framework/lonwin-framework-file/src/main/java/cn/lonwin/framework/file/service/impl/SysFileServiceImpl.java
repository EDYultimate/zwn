/*
 *    Copyright (c) 2018-2025, waterx All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: waterx
 */
package cn.lonwin.framework.file.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import cn.lonwin.common.core.model.vo.Result;
import com.amazonaws.services.s3.model.S3Object;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.lonwin.common.file.core.FileProperties;
import com.lonwin.common.file.core.FileTemplate;
import cn.lonwin.framework.file.entity.SysFile;
import cn.lonwin.framework.file.mapper.SysFileMapper;
import cn.lonwin.framework.file.service.SysFileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 文件管理
 *
 * @author Luckly
 * @date 2019-06-18 17:18:42
 */
@Slf4j
@Service
@AllArgsConstructor
public class SysFileServiceImpl extends ServiceImpl<SysFileMapper, SysFile> implements SysFileService {

	private final FileTemplate fileTemplate;

	private final FileProperties properties;

	/**
	 * 上传文件
	 * @param file 文件流
	 * @param dir 文件夹
	 * @param groupId 分组ID
	 * @param groupType 分组类型
	 * @return
	 */
	@Override
	public Result uploadFile(MultipartFile file, String dir, String groupId, String groupType) {
		String fileName = IdUtil.simpleUUID() + StrUtil.DOT + FileUtil.extName(file.getOriginalFilename());
		Map<String, String> resultMap = new HashMap<>(4);
		resultMap.put("bucketName", properties.getBucketName());
		resultMap.put("fileName", fileName);

		resultMap.put("url", String.format("/admin/sys-file/oss/file?fileName=%s", fileName));

		// 目录由后台自动生成（按日期分目录），忽略前端传入的 dir，避免目录穿越风险
		String autoDir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
		try (InputStream inputStream = file.getInputStream()) {
			fileTemplate.putObject(properties.getBucketName(), autoDir, fileName, inputStream, file.getContentType());
			// 文件管理数据记录,收集管理追踪文件
			fileLog(file, autoDir, fileName, groupId, groupType);
		}
		catch (Exception e) {
			log.error("上传失败", e);
			return Result.fail(e.getLocalizedMessage());
		}
		return Result.success(resultMap);
	}

	/**
	 * 读取文件
	 * @param fileName
	 * @param response
	 */
	@Override
	public void getFile(String fileName, HttpServletResponse response) {
		SysFile sysFile = baseMapper.selectOne(Wrappers.<SysFile>lambdaQuery().eq(SysFile::getFileName, fileName));
		try (S3Object s3Object = fileTemplate.getObject(sysFile.getBucketName(), sysFile.getDir(), fileName)) {
			response.setContentType("application/octet-stream; charset=UTF-8");
			// 文件唯一hash
			response.addHeader("Hash", sysFile.getHash());
			IoUtil.copy(s3Object.getObjectContent(), response.getOutputStream());
		}
		catch (Exception e) {
			log.error("文件读取异常: {}", e.getLocalizedMessage());
		}
	}

	@Override
	public void getFile(Long id, HttpServletResponse response) {

		SysFile sysFile = this.getById(id);
		if (Objects.isNull(sysFile)) {
			return;
		}
		try (S3Object s3Object = fileTemplate.getObject(sysFile.getBucketName(), sysFile.getDir(), sysFile.getFileName())) {
			response.setContentType("application/octet-stream; charset=UTF-8");
			// 文件唯一hash
			response.addHeader("Hash", sysFile.getHash());
			IoUtil.copy(s3Object.getObjectContent(), response.getOutputStream());
		}
		catch (Exception e) {
			log.error("文件读取异常: {}", e.getLocalizedMessage());
		}
	}

	/**
	 * 删除文件
	 * @param id
	 * @return
	 */
	@Override
	@SneakyThrows
	@Transactional(rollbackFor = Exception.class)
	public Boolean deleteFile(Long id) {
		SysFile file = this.getById(id);
		if (Objects.isNull(file)) {
			return Boolean.FALSE;
		}
		fileTemplate.removeObject(properties.getBucketName(), file.getFileName());
		return this.removeById(id);
	}

	/**
	 * 文件管理数据记录，收集管理追踪文件
	 * @param file 上传的文件格式
	 * @param dir 文件夹
	 * @param fileName 文件名
	 * @param groupId 文件组ID
	 * @param groupType 文件组类型
	 */
	@SneakyThrows
	private void fileLog(MultipartFile file, String dir, String fileName, String groupId, String groupType) {
		// 创建SysFile对象并设置相关属性
		SysFile sysFile = new SysFile();
		sysFile.setFileName(fileName);

		// 对原始文件名进行编码转换
//		String originalFilename = new String(
//				Objects.requireNonNull(file.getOriginalFilename()).getBytes(StandardCharsets.ISO_8859_1),
//				StandardCharsets.UTF_8);
		sysFile.setDir(dir);
		sysFile.setOriginal(file.getOriginalFilename());
		sysFile.setFileSize(file.getSize());
		sysFile.setBucketName(properties.getBucketName());
		sysFile.setType(file.getContentType());
		sysFile.setGroupType(groupType);
		sysFile.setGroupId(groupId);

		sysFile.setHash(SecureUtil.md5(file.getInputStream()));
		// 调用save方法保存SysFile对象
		this.save(sysFile);
	}

}