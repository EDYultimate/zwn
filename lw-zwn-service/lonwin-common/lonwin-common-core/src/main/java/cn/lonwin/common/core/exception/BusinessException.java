package cn.lonwin.common.core.exception;

import cn.lonwin.common.core.constant.ResponseCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BusinessException extends RuntimeException {
    
    private Integer code;
    private String message;
    
    public BusinessException(String message) {
        super(message);
        this.code = ResponseCode.BUSINESS_ERROR.getCode();
        this.message = message;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
    
    public BusinessException(ResponseCode responseCode) {
        super(responseCode.getMessage());
        this.code = responseCode.getCode();
        this.message = responseCode.getMessage();
    }
}