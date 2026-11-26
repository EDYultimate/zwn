package cn.lonwin.framework.security.token;

import cn.lonwin.common.core.constant.AuthModeEnum;
import cn.lonwin.framework.security.token.jwt.JwtTokenParserImpl;
import cn.lonwin.framework.security.token.powers.PowersTokenParserImpl;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class TokenParserSelector {
    private final Map<AuthModeEnum, TokenParser> parserMap = new EnumMap<>(AuthModeEnum.class);

    public TokenParserSelector(
            JwtTokenParserImpl xindunJwtParser,
            PowersTokenParserImpl internalTokenParser,
            OAuth2TokenParserImpl oauth2TokenParser) {

        parserMap.put(AuthModeEnum.JWT, xindunJwtParser);
        parserMap.put(AuthModeEnum.POWERS, internalTokenParser);
        parserMap.put(AuthModeEnum.OAUTH2, oauth2TokenParser);
        parserMap.put(AuthModeEnum.NONE, oauth2TokenParser);
    }

    public TokenParser select(AuthModeEnum mode) {
        return parserMap.get(mode);
    }
}