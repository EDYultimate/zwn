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

package cn.lonwin.framework.file.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import cn.lonwin.framework.file.entity.SysFile;
import org.apache.ibatis.annotations.Mapper;

/**
 * 文件管理
 *
 * @author Luckly
 * @date 2019-06-18 17:18:42
 */
@Mapper
public interface SysFileMapper extends BaseMapper<SysFile> {

}
