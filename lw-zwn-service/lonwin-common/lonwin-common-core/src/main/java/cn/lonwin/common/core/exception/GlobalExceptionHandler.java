package cn.lonwin.common.core.exception;

import cn.lonwin.common.core.constant.ResponseCode;
import cn.lonwin.common.core.model.vo.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e, HttpServletRequest request) {
        log.error("业务异常: {}, URL: {}", e.getMessage(), request.getRequestURI(), e);
        return Result.fail(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        String errorMsg = e.getBindingResult().getFieldErrors().stream()
            .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
            .collect(Collectors.joining("; "));
        log.error("参数验证异常: {}, URL: {}", errorMsg, request.getRequestURI());
        return Result.fail(ResponseCode.BAD_REQUEST.getCode(), errorMsg);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e, HttpServletRequest request) {
        String errorMsg = e.getConstraintViolations().stream()
            .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
            .collect(Collectors.joining("; "));
        log.error("参数验证异常: {}, URL: {}", errorMsg, request.getRequestURI());
        return Result.fail(ResponseCode.BAD_REQUEST.getCode(), errorMsg);
    }
    
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e, HttpServletRequest request) {
        log.error("系统异常: {}, URL: {}", e.getMessage(), request.getRequestURI(), e);
        return Result.fail(ResponseCode.SYSTEM_ERROR);
    }
}