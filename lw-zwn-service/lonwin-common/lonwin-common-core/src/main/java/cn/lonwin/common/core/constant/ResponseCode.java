package cn.lonwin.common.core.constant;

import lombok.Getter;

/**
 * 响应码枚举
 */
@Getter
public enum ResponseCode {
    // ========== 成功状态码 ==========
    SUCCESS(0, "操作成功"),
    
    // ========== 客户端错误 1000-1999 ==========
    BAD_REQUEST(1000, "请求参数错误"),

    // ========== 业务逻辑错误 2000-2999 ==========
    BUSINESS_ERROR(2000, "业务处理失败"),

    // ========== 系统错误 5000-5999 ==========
    SYSTEM_ERROR(5000, "系统内部错误");

    private final Integer code;
    private final String message;
    
    ResponseCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}