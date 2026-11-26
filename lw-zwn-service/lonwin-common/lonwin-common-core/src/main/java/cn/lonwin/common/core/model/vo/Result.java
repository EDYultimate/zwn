package cn.lonwin.common.core.model.vo;

import cn.lonwin.common.core.constant.ResponseCode;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.UUID;

/**
 * 统一API响应结果
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> implements Serializable {
    
    /** 状态码 */
    private Integer code;
    
    /** 消息 */
    private String message;
    
    /** 数据 */
    private T data;
    
    /** 时间戳 */
    private Long timestamp;
    
    /** 请求ID（用于日志追踪） */
    private String requestId;
    
    /** 版本号 */
    private String version = "v1.0";
    
    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
        this.requestId = generateRequestId();
    }
    
    /**
     * 成功响应
     */
    public static <T> Result<T> success() {
        return success(null);
    }
    
    public static <T> Result<T> success(T data) {
        return new Result<>(ResponseCode.SUCCESS.getCode(), 
                           ResponseCode.SUCCESS.getMessage(), 
                           data);
    }
    
    /**
     * 成功响应（自定义消息）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(ResponseCode.SUCCESS.getCode(), message, data);
    }
    
    /**
     * 失败响应
     */
    public static <T> Result<T> fail() {
        return fail(ResponseCode.BUSINESS_ERROR);
    }
    
    public static <T> Result<T> fail(String message) {
        return new Result<>(ResponseCode.BUSINESS_ERROR.getCode(), message, null);
    }
    
    public static <T> Result<T> fail(Integer code, String message) {
        return new Result<>(code, message, null);
    }
    
    public static <T> Result<T> fail(ResponseCode responseCode) {
        return new Result<>(responseCode.getCode(), 
                           responseCode.getMessage(), 
                           null);
    }
    
    public static <T> Result<T> fail(ResponseCode responseCode, String message) {
        return new Result<>(responseCode.getCode(), message, null);
    }
    
    /**
     * 生成请求ID
     */
    private String generateRequestId() {
        return "req_" + System.currentTimeMillis() + "_" + 
               UUID.randomUUID().toString().substring(0, 8);
    }
}