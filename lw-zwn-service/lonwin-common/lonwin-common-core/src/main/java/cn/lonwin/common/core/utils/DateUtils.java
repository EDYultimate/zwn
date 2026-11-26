package cn.lonwin.common.core.utils;

import lombok.extern.slf4j.Slf4j;
import java.time.*;
import java.time.format.DateTimeFormatter;

@Slf4j
public class DateUtils {
    
    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";
    
    /**
     * 获取当前日期字符串
     */
    public static String getCurrentDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT));
    }
    
    /**
     * 获取当前日期时间字符串
     */
    public static String getCurrentDateTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(DEFAULT_DATETIME_FORMAT));
    }
    
    /**
     * 日期转字符串
     */
    public static String format(LocalDateTime dateTime, String pattern) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern(pattern));
    }
    
    /**
     * 字符串转日期
     */
    public static LocalDateTime parse(String dateStr, String pattern) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern(pattern));
    }
    
    /**
     * 转换为字符串格式的日期
     */
    public static String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return format(dateTime, DEFAULT_DATETIME_FORMAT);
    }
}