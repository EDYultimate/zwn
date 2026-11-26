package cn.lonwin.framework.security.token;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.utils.UUIDUtils;
import cn.lonwin.framework.security.token.jwt.JwtProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 不需要登录的内容，设置默认值给用户。
 */
@Component
public class NoneTokenParserImpl implements TokenParser {
    private final JwtProperties autoconfig;

    public NoneTokenParserImpl(JwtProperties autoconfig) {
        this.autoconfig = autoconfig;
    }
    @Override
    public LoginUserDTO parse(String token) {
            return LoginUserDTO.builder()
                .userId(UUIDUtils.generateUUID())
                .userCode("testUserCode")
                .userName("testUserName")
                .sort(0)
                .roles(List.of())
                .permissions(List.of())
                .tokenType("NONE")
                .build();
    }
}