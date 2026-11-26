const POWER_SYS_BASE_URL = import.meta.env.VITE_POWER_SYS_BASE_URL as string

const env = {
  USE_POWER_SYS: false, // 启用权限管理系统鉴权
  IS_DEV: import.meta.env.DEV,
  IS_PRODUCTION: !import.meta.env.DEV,
  APP_TITLE: import.meta.env.VITE_APP_TITLE as string,
  // API_BASE_URL: import.meta.env.VITE_BASE_URL as string,
  API_BASE_URL: '', // 走相对路径，开发环境由 vite 代理（/api 前缀）转发至 VITE_BASE_URL，生产环境由 nginx 代理
  POWER_SYS_BASE_URL,
  POWER_SYS_ACCOUNT: import.meta.env.VITE_POWER_SYS_ACCOUNT as string,
  POWER_SYS_CHECK_LOGIN_URL: `${POWER_SYS_BASE_URL}/sysfront/cas/loginCheck`,
  POWER_SYS_LOGOUT_URL: `${POWER_SYS_BASE_URL}/sysfront/cas/logout`
}

export default env
