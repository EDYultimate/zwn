import env from '@/env'
import { getURLWithoutQueryKey } from '@/utils/common'

/**
 * 使用base64编码对 url 字符串进行处理, 主要是处理含有 query 参数的特殊情况(包含 =, /, +)
 * - 使用 - 代替 +
 * - 使用 _ 代替 /
 * - 去掉末尾补位的 =
 * @param str
 * @returns {string}
 */
function base64URLEncode(str: string): string {
  const base64Encoded = window.btoa(str)
  return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// 重定向到权限系统登录地址
export function redirectToLoginURL() {
  window.location.href =
    env.POWER_SYS_CHECK_LOGIN_URL +
    '?account=' +
    base64URLEncode(env.POWER_SYS_ACCOUNT) +
    '&backUrl=' +
    base64URLEncode(getURLWithoutQueryKey('ticket')) // backUrl 实时计算, 使用当前页面地址, 并且要去掉 ?ticket=xx
}

// 重定向到权限系统退出地址, 完成退出权限系统的功能
export function redirectToLogoutURL() {
  debugger
  window.location.href =
    env.POWER_SYS_LOGOUT_URL +
    '?account=' +
    base64URLEncode(env.POWER_SYS_ACCOUNT) +
    '&backUrl=' +
    base64URLEncode(getURLWithoutQueryKey('ticket')) // backUrl 实时计算, 使用当前页面地址, 并且要去掉 ?ticket=xx
}
