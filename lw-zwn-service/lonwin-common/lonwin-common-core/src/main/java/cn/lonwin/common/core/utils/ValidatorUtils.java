package cn.lonwin.common.core.utils;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.common.core.constant.ResponseCode;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Set;
import java.util.stream.Collectors;

public class ValidatorUtils {
    
    private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();
    
    /**
     * 验证对象
     */
    public static String validate(Object object) {
        Set<ConstraintViolation<Object>> violations = VALIDATOR.validate(object);
        if (violations.isEmpty()) {
            return null;
        }
        return violations.stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining("; "));
    }
    
    /**
     * 验证对象并抛出异常
     */
    public static void validateAndThrow(Object object) {
        String errorMsg = validate(object);
        if (errorMsg != null) {
            throw new BusinessException(ResponseCode.BAD_REQUEST.getCode(), "参数验证失败: " + errorMsg);
        }
    }
}