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

package cn.lonwin.framework.file.service;

import cn.lonwin.common.core.model.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

import cn.lonwin.framework.file.entity.SysFile;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件管理
 *
 * @author Luckly
 * @date 2019-06-18 17:18:42
 */
public interface SysFileService extends IService<SysFile> {

	/**
	 * 上传文件
	 * @param file 文件流
	 * @param dir 文件夹
	 * @param groupId 分组ID
	 * @param groupType 分组类型
	 * @return
	 */
	Result uploadFile(MultipartFile file, String dir, String groupId, String groupType);

	/**
	 * 读取文件
	 * @param fileName 文件名称
	 * @param response 输出流
	 */
	void getFile(String fileName, HttpServletResponse response);

	/**
	 * 读取文件
	 * @param id 文件ID
	 * @param response 输出流
	 */
	void getFile(Long id, HttpServletResponse response);


	/**
	 * 删除文件
	 * @param id
	 * @return
	 */
	Boolean deleteFile(Long id);


}
