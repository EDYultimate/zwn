package cn.lonwin.framework.data.config;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * MyBatis Plus 字段自动填充处理器
 * <p>
 * 配合实体类上的 @TableField(fill = FieldFill.INSERT / FieldFill.UPDATE) 注解，
 * 在 insert / update 时自动填充 createTime、updateTime、createBy、updateBy。
 */
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

	@Override
	public void insertFill(MetaObject metaObject) {
		LocalDateTime now = LocalDateTime.now();
		this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, now);
		this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, now);
		this.strictInsertFill(metaObject, "createBy", String.class, currentUserName());
		this.strictInsertFill(metaObject, "updateBy", String.class, currentUserName());
	}

	@Override
	public void updateFill(MetaObject metaObject) {
		this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
		this.strictUpdateFill(metaObject, "updateBy", String.class, currentUserName());
	}

	/**
	 * 获取当前登录用户名，未登录或上下文为空时返回 null（由 strictFill 判断是否填充）
	 */
	private String currentUserName() {
		LoginUserDTO user = UserContext.get();
		return user == null ? null : user.getUserName();
	}

}