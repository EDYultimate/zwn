import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import homeRoutes from '@/router/modules/home'
import { getMenuPrefix, pushMenus } from '@/api/menuPush'

import type { MenuNodeDTO, MenuPrefixVO, PrefixNodeDTO } from '@/api/menuPush'
import type { RouteRecordRaw } from 'vue-router'

// 前缀类型持久化 key（localStorage，跨会话保留用户选择）
const PREFIX_TYPE_KEY = 'menu-prefix-type'

// 合法的前缀类型：funcPrefix=功能路径 / managePrefix=管理路径 / regionPrefix=区域路径
const VALID_PREFIX_TYPES: (keyof MenuPrefixVO)[] = ['funcPrefix', 'managePrefix', 'regionPrefix']

// 读取持久化的前缀类型（无记录/非法值时默认区域路径）
function loadPrefixType(): keyof MenuPrefixVO {
  const saved = localStorage.getItem(PREFIX_TYPE_KEY) as keyof MenuPrefixVO | null
  return saved && VALID_PREFIX_TYPES.includes(saved) ? saved : 'regionPrefix'
}

// 导航路径前缀 sessionStorage 缓存 key
const PREFIX_CACHE_KEY = 'menu-prefix-cache'

/**
 * 递归展开路由树 -> 后端要求的菜单扁平列表（每条记录带 parentRouteName）
 * 规则：
 *  - hiddenInNavMenu 的路由（及其子级）不推送
 *  - routeName 由完整 path 派生（去首斜杠、/ 转 -），保证唯一且幂等
 *  - 有子级的节点为 MODULE（模块），叶子节点为 MENU（菜单）
 */
function flattenRoutes(
  routes: RouteRecordRaw[],
  parentRouteName?: string,
  parentPath = ''
): MenuNodeDTO[] {
  const list: MenuNodeDTO[] = []
  routes.forEach((item) => {
    if (item.meta?.hiddenInNavMenu) {
      return
    }
    const menuName = item.meta?.title
    if (!menuName) {
      return
    }
    const fullPath = item.path.startsWith('/') ? item.path : `${parentPath}/${item.path}`
    debugger
    const routeName = fullPath.replace(/^\//, '').replace(/\//g, '-')
    list.push({
      routeName,
      parentRouteName,
      menuName,
      routePath: fullPath,
      menuType: item.children?.length ? 'MODULE' : 'MENU',
      sortNum: item.meta?.sort
    })
    if (item.children?.length) {
      list.push(...flattenRoutes(item.children, routeName, fullPath))
    }
  })
  return list
}

/**
 * 系统层根节点：面包屑最外层固定的"水资源管理与调配"
 * 所有 home.ts 顶级模块均挂载到该节点下（parentRouteName='index'）
 */
const SYSTEM_ROOT: MenuNodeDTO = {
  routeName: 'waterIndex',
  parentRouteName: null,
  menuName: '水资源管理与调配',
  routePath: '/waterIndex',
  menuType: 'MODULE',
  sortNum: 1
}

/**
 * 菜单推送 store
 * 1. pushRoutes：把前端路由（home.ts）转成扁平列表推送到权限系统（幂等），由用户主动触发；
 *    推送成功后自动刷新前缀缓存（菜单数据已更新，前缀可能变化）
 * 2. 导航路径前缀：首次点击面包屑按钮时懒加载并缓存到 sessionStorage，再次点击直接用缓存
 */
export const useMenuPushStore = defineStore('menu-push', () => {
  /** 前置菜单是否填充显示（点击面包屑左侧按钮切换，多实例共享） */
  const prefixVisible = ref(false)
  /** 前置菜单加载中（防止重复请求） */
  const prefixLoading = ref(false)
  /** 导航路径前缀（功能/管理/区域三套） */
  const prefix = ref<MenuPrefixVO | null>(null)
  /** 当前选中的前缀类型（系统设置抽屉中切换，localStorage 持久化） */
  const prefixType = ref<keyof MenuPrefixVO>(loadPrefixType())
  /** 当前选中的那套前缀节点 */
  const activePrefixNodes = computed<PrefixNodeDTO[]>(() => prefix.value?.[prefixType.value] ?? [])

  /**
   * 切换前缀类型（系统设置抽屉中三个单选框触发）
   * @param type funcPrefix=功能路径 / managePrefix=管理路径 / regionPrefix=区域路径
   */
  function setPrefixType(type: keyof MenuPrefixVO) {
    if (!VALID_PREFIX_TYPES.includes(type)) {
      return
    }
    prefixType.value = type
    localStorage.setItem(PREFIX_TYPE_KEY, type)
  }

  /**
   * 用户主动触发：推送前端路由菜单到权限系统
   * routeName 幂等：已存在则更新，不存在则插入
   * 推送成功后清空并刷新前缀缓存（菜单数据已更新，前缀可能随之变化）
   */
  async function pushRoutes() {
    // 系统层根节点（水资源管理与调配）+ home.ts 顶级模块（parentRouteName 指向 'index'）
    const menus = [SYSTEM_ROOT, ...flattenRoutes(homeRoutes, SYSTEM_ROOT.routeName)]
    try {
      debugger
      const res = await pushMenus(menus)
      console.log('推送菜单到权限系统完成, menus.size=' + menus.length, res)
      // 推送成功：强制重新获取导航路径前缀并覆盖缓存
      await ensurePrefix(true)
      return res
    } catch (e) {
      console.error('推送菜单到权限系统失败', e)
      throw e
    }
  }

  /**
   * 确保前缀数据可用：
   * 优先取内存 -> sessionStorage 缓存 -> 接口获取并写入缓存
   * @param force true 时跳过缓存强制刷新
   */
  async function ensurePrefix(force = false) {
    if (prefixLoading.value) {
      return
    }
    if (!force) {
      if (prefix.value) {
        return
      }
      const cached = sessionStorage.getItem(PREFIX_CACHE_KEY)
      if (cached) {
        try {
          prefix.value = JSON.parse(cached)
          return
        } catch {
          // 缓存损坏，忽略并重新获取
        }
      }
    }
    prefixLoading.value = true
    try {
      const res = await getMenuPrefix()
      prefix.value = res.data ?? null
      sessionStorage.setItem(PREFIX_CACHE_KEY, JSON.stringify(prefix.value))
    } catch (e) {
      console.error('获取导航路径前缀失败', e)
    } finally {
      prefixLoading.value = false
    }
  }

  /**
   * 切换前置菜单填充显示：
   * 开启时若前缀未加载则先加载（缓存优先）；关闭=保持原本菜单层级路径
   */
  async function togglePrefix() {
    if (!prefixVisible.value) {
      await ensurePrefix()
    }
    prefixVisible.value = !prefixVisible.value
  }

  return {
    prefixVisible,
    prefixLoading,
    prefix,
    prefixType,
    activePrefixNodes,
    setPrefixType,
    pushRoutes,
    togglePrefix
  }
})
