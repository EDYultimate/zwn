package cn.lonwin.framework.security.token;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import org.springframework.stereotype.Component;

@Component
public class OAuth2TokenParserImpl implements TokenParser {


    @Override
    public LoginUserDTO parse(String token) {
       return null;
    }
}