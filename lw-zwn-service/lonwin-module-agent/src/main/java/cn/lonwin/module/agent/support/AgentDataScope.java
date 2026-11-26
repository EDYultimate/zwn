package cn.lonwin.module.agent.support;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import cn.lonwin.common.core.context.UserContext;
import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import lombok.extern.slf4j.Slf4j;

/**
 * 单位（组织）数据权限解析。
 *
 * <p>项目现有权限体系只下发登录用户与功能权限，没有框架级的数据权限，因此这里补上「单位」这一维。
 * 解析结果不再作为方法参数层层传递，而是由 {@code DataScopeAspect} 放入
 * {@code DataScopeContext}，业务代码按需读取。
 *
 * <p>取值优先级：
 * <ol>
 *   <li>{@link LoginUserDTO#getDeptCode()}（权限系统填充时首选）；</li>
 *   <li>{@code LoginUserDTO.attrs} 中的 unitCode / deptCode / orgCode（不同权限系统字段名不一，做兼容）；</li>
 *   <li>都取不到时：{@link #resolveUnitCodeOrNull()} 返回 {@code null}（非严格模式放行），
 *       {@link #resolveUnitCode()} 抛 403 并提示去权限系统补配置。</li>
 * </ol>
 */
@Slf4j
@Component
public class AgentDataScope {

    /** attrs 中可能的单位字段名，按顺序尝试 */
    private static final String[] UNIT_CODE_KEYS = {"unitCode", "deptCode", "orgCode"};

    /**
     * 解析当前用户的单位编码，取不到时返回 {@code null}（不抛异常）。
     *
     * @return 单位编码，未登录或单位信息缺失时为 {@code null}
     */
    public String resolveUnitCodeOrNull() {
        LoginUserDTO user = UserContext.get();
        if (user == null) {
            return null;
        }
        if (StringUtils.hasText(user.getDeptCode())) {
            return user.getDeptCode().trim();
        }
        if (user.getAttrs() != null) {
            for (String key : UNIT_CODE_KEYS) {
                Object value = user.getAttrs().get(key);
                if (value != null && StringUtils.hasText(value.toString())) {
                    return value.toString().trim();
                }
            }
        }
        log.debug("用户 {} 未能解析出单位编码，attrs={}", user.getUserCode(), user.getAttrs());
        return null;
    }

    /**
     * 解析当前用户的单位编码（严格版）。
     *
     * @return 单位编码（非空）
     * @throws BusinessException 未登录或单位信息缺失时抛出
     */
    public String resolveUnitCode() {
        LoginUserDTO user = UserContext.get();
        if (user == null) {
            throw new BusinessException(401, "未获取到登录用户信息");
        }
        String unitCode = resolveUnitCodeOrNull();
        if (unitCode != null) {
            return unitCode;
        }
        log.warn("用户 {} 未能解析出单位编码，attrs={}", user.getUserCode(), user.getAttrs());
        throw new BusinessException(403,
                "未获取到当前用户的单位信息（deptCode），请在权限系统中配置所属单位后重试");
    }
}
