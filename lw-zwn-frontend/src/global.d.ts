export {}

declare global {
  interface Window {
    $message: import('naive-ui').MessageApi
    $dialog: import('naive-ui').DialogApi
    $notification: import('naive-ui').NotificationApi
    $loadingBar: import('naive-ui').LoadingBarApi
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare module 'element-resize-detector'
}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    //同级排序号
    sort?: number
    //是否在导航菜单中隐藏
    hiddenInNavMenu?: boolean
    //是否显示垂直导航栏
    verticalIsShow?: boolean
    //是否用卡片模式，即边距和圆角
    cardMode?: boolean
    //是否用地图底板
    mapIsShow?: boolean
    //gis2 常驻地图模块名（路由切换只调 changeModule，不重载 iframe；缺省 'daping'）
    mapModule?: string
    //（废弃）旧样例地图独立应用 URL，仅为兼容历史页面保留
    mapUrl?: string
    //是否隐藏菜单面包屑
    isHideMenuCrumb?: boolean
    //顶部标题图（CenterLayout 顶部 banner 覆盖；缺省用默认 title_logo_panel4.png）
    headerLogo?: string
  }
}
