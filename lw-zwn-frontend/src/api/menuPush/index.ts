import request from '@/utils/request'

/** 菜单推送节点（对应后端 MenuNodeDTO：扁平列表，后端按 parentRouteName 还原树形） */
export interface MenuNodeDTO {
  /** 路由 name（唯一幂等 key：DB 已存在则更新，不存在则按 routeName 插入） */
  routeName: string
  /** 父路由 name，顶级菜单为空；可指向 DB 已有但不在本次请求中的菜单 */
  parentRouteName?: string
  /** 菜单名称（路由 meta.title） */
  menuName: string
  /** 完整路由 path（如 /waterUse/qushuijianguan/shuiliangjiankong） */
  routePath?: string
  /** 菜单类型：MODULE-模块 / MENU-菜单 */
  menuType?: 'MODULE' | 'MENU'
  /** 同级排序号 */
  sortNum?: number
}

/** 导航路径前缀节点（对应后端 PrefixNodeDTO） */
export interface PrefixNodeDTO {
  /** 层级 */
  level?: number
  /** 名称 */
  name: string
  /** 跳转地址（可为空，为空则不可跳转） */
  url?: string
}

/** 导航路径前缀（对应后端 MenuPrefixVO：功能/管理/区域 三套） */
export interface MenuPrefixVO {
  /** 功能路径前缀（如：数字孪生海河 -> 数字孪生工程） */
  funcPrefix?: PrefixNodeDTO[]
  /** 管理路径前缀（如：海委 -> 海河下游局） */
  managePrefix?: PrefixNodeDTO[]
  /** 区域路径前缀（如：海河流域 -> 海河下游 -> 海河闸） */
  regionPrefix?: PrefixNodeDTO[]
}

/** 推送菜单（扁平列表）到权限系统（经后端转发外部菜单系统）；空数组=清空所有相关菜单 */
export function pushMenus(menus: MenuNodeDTO[]) {
  return request({
    url: '/api/menu-push/trigger',
    method: 'POST',
    data: menus
  })
}

/** 获取本系统导航路径前缀（功能/管理/区域） */
export function getMenuPrefix() {
  return request({
    url: '/api/menu-push/prefix',
    method: 'POST'
  })
}
