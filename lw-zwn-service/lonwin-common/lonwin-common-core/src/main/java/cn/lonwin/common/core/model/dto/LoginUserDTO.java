package cn.lonwin.common.core.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 登录用户信息。
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginUserDTO{
    private String userId;
    private String userCode;
    private String userName;
    private String deptCode;
    private String deptName;
    private String phone;
    private String idCard;
    private Integer sort;
    private String token;
    private List<String> roles;
    private List<String> permissions;
    private String tokenType;
    private Map<String, Object> attrs = new HashMap<>();

    /**
     * 获取所有权限标识（角色 + 权限）
     * 供权限框架使用
     */
    public List<String> getAllPermissionCodes() {
        List<String> result = new java.util.ArrayList<>();
        if (roles != null) {
            roles.forEach(r -> result.add("ROLE_" + r));
        }
        if (permissions != null) {
            result.addAll(permissions);
        }
        return result;
    }
}
