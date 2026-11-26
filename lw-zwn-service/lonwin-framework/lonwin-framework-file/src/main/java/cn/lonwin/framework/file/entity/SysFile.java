package cn.lonwin.framework.file.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

/**
 * 文件管理
 *
 * @author Luckly
 * @date 2019-06-18 17:18:42
 */
@Data
@Schema(description = "文件")
@EqualsAndHashCode(callSuper = true)
public class SysFile extends Model<SysFile> {

	private static final long serialVersionUID = 1L;

	/**
	 * 编号
	 */
	@TableId(type = IdType.ASSIGN_ID)
	@Schema(description = "文件编号")
	@JsonSerialize(using = ToStringSerializer.class)
	private Long id;

	/**
	 * 文件名
	 */
	@Schema(description = "文件名")
	private String fileName;

	/**
	 * 原文件名
	 */
	@Schema(description = "原始文件名")
	private String original;

	/**
	 * 容器名称
	 */
	@Schema(description = "存储桶名称")
	private String bucketName;

	/***
	 * 文件夹
	 */
	@Schema(description = "文件夹")
	private String dir;

	/**
	 * 文件类型
	 */
	@Schema(description = "文件类型")
	private String type;

	/**
	 * 文件组Id
	 */
	@Schema(description = "文件组Id")
	private String groupId;

	/**
	 * 文件组类型
	 */
	@Schema(description = "文件组类型")
	private String groupType;

	/**
	 * 文件大小
	 */
	@Schema(description = "文件大小")
	private Long fileSize;

	/**
	 * 文件hash
	 */
	@Schema(description = "文件hash")
	private String hash;


	/**
	 * 简介
	 */
	@Schema(description = "简介")
	private String info;

	/**
	 * 来源
	 */
	@Schema(description = "来源")
	private String docSource;


	/**
	 * 发布时间
	 */
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	@Schema(description = "发布时间")
	private Date publishTime;


	/**
	 * 备注
	 */
	@Schema(description = "备注")
	private String nt;


	/**
	 * 上传人
	 */
	@TableField(fill = FieldFill.INSERT)
	@Schema(description = "创建者")
	private String createBy;

	/**
	 * 上传时间
	 */
	@TableField(fill = FieldFill.INSERT)
	@Schema(description = "创建时间")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	private LocalDateTime createTime;

	/**
	 * 更新人
	 */
	@TableField(fill = FieldFill.INSERT)
	@Schema(description = "更新者")
	private String updateBy;

	/**
	 * 更新时间
	 */
	@TableField(fill = FieldFill.UPDATE)
	@Schema(description = "更新时间")
	private LocalDateTime updateTime;

	/**
	 * 删除标识：1-删除，0-正常
	 */
	@TableLogic
	@TableField(fill = FieldFill.INSERT)
	@Schema(description = "删除标记,1:已删除,0:正常")
	private String delFlag = "0";

}