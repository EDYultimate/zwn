package cn.lonwin.common.core.utils;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.constant.ResponseCode;

public class Assert {
    
    public static void isTrue(boolean expression, String message) {
        if (!expression) {
            throw new BusinessException(ResponseCode.BAD_REQUEST.getCode(), message);
        }
    }
    
    public static void isFalse(boolean expression, String message) {
        isTrue(!expression, message);
    }
    
    public static void notNull(Object object, String message) {
        isTrue(object != null, message);
    }
    
    public static void notEmpty(String str, String message) {
        isTrue(str != null && !str.trim().isEmpty(), message);
    }
}