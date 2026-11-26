package cn.lonwin.framework.security.token;

import cn.lonwin.common.core.model.dto.LoginUserDTO;

public interface TokenParser {
    LoginUserDTO parse(String token);
}