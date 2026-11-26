package cn.lonwin.framework.security.adapter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import cn.lonwin.common.core.model.dto.LoginUserDTO;
import java.util.Collection;
import java.util.stream.Collectors;

public class AuthorityAdapter {
    public static Collection<? extends GrantedAuthority> toAuthorities(LoginUserDTO user) {
        return user.getAllPermissionCodes()
                   .stream()
                   .map(SimpleGrantedAuthority::new)
                   .collect(Collectors.toList());
    }
}