package cn.lonwin.common.core.constant;

/**
 * 登录方式/授权方式的类型
 */
public enum AuthModeEnum {
    JWT,            // 海委芯盾登录
    POWERS,         // 内部的权限系统登录
    OAUTH2,          // Oauth2.0登录
    NONE ,           // 无授权方式
}