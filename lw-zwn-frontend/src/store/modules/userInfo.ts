import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import router from '@/router/instance'
import { redirectToLoginURL, redirectToLogoutURL } from '@/utils/auth'
import request, { requestWithoutReqInterceptors } from '@/utils/request'
import Toast from '@/utils/toast'

interface UserInfo {
  // 以下不需要在 storage 中持久化
  isLogin: boolean
  myRouter: string[]
  /** 功能权限 URL 列表（权限系统 actList 下发，用于按钮级显隐控制） */
  myPermission: string[]
  username: string

  // 以下需要在 storage 中持久化
  // 通过 pinia 使用插件在 sessionStorage 中持久化,可在多个tab中共享登录态
  token: string | null
}

interface LoginInfo {
  // 以下需要在 storage 中持久化
  // 登录失败后重试次数,避免服务端异常无限重复跳转 芯盾->权限系统->前端
  retryCountOfLogin: number
}

function flatTreeToList(routesTree: any, list: string[] = []) {
  if (!Array.isArray(routesTree)) {
    console.error('[flatTreeToList] 入参异常, routesTree:', routesTree)
    throw new Error('[flatTreeToList] 入参异常')
  }

  routesTree.forEach((route: any) => {
    list.push(route.path || route.PATH)
    if (Array.isArray(route.children)) {
      flatTreeToList(route.children, list)
    }
  })

  return list
}

export const userInfoStore = defineStore(
  'user-info',
  () => {
    const userInfoState = reactive<UserInfo>({
      isLogin: false,
      myRouter: [],
      myPermission: [],
      username: '管理员',
      token: null
    })
    const loginState = reactive<LoginInfo>({
      retryCountOfLogin: 0
    })

    // 定义更新方法
    function login(info: Partial<UserInfo>) {
      Object.assign(userInfoState, info)
    }
    const level1Routing = computed(() => {
      const authedRoutes = userInfoState.myRouter
      // console.log('level1Routing:', traverse(router.options.routes))
      return traverse(router.options.routes, '')

      function traverse(routes: readonly RouteRecordRaw[], parentPath: string): RouteRecordRaw[] {
        return routes
          .filter((r) => {
            // 拼接完整路径：父路径 + 当前路径
            const fullPath = r.path.startsWith('/') ? r.path : parentPath + '/' + r.path
            const hasAuth = authedRoutes.includes(fullPath)
            const visible = r.meta?.hiddenInNavMenu ? false : true
            return visible
          })
          .map((r) => {
            const newRoute = { ...r } // 关键：克隆对象，避免修改全局路由配置
            // 拼接完整路径用于子路由递归
            const currentFullPath = r.path.startsWith('/') ? r.path : parentPath + '/' + r.path
            if (Array.isArray(r.children)) {
              newRoute.children = traverse(r.children, currentFullPath)
            }
            return newRoute
          })
      }
    })

    function clearUserInfo() {
      userInfoState.isLogin = false
      userInfoState.myRouter = []
      userInfoState.myPermission = []
      userInfoState.username = ''
      userInfoState.token = null
    }

    let isExecutingLogout = false
    function logout() {
      if (!isExecutingLogout) {
        // 退出操作仅执行1次
        isExecutingLogout = true
        // TODO: 调用业务系统的退出接口, 退出 [业务后端], 业务后端会删除缓存的token及对应的session用户信息
        request.post('/logout').finally(() => {
          clearUserInfo()
          redirectToLogoutURL()
        })
      }
    }

    /**
     * 调用业务系统后端登录接口完成登录, 可检查 token 是否有效
     * @param token
     * @return boolean
     */
    function checkIsTokenValidAndLogin(token: string) {
      return requestWithoutReqInterceptors
        .post('/mock/system/user/isLogin_powerSys', {}, { headers: { token } })
        .then((response) => {
          // response.code 含义：
          // 200-成功
          // 601-权限系统token错误；
          // 602-权限系统集成账号account错误；
          // 603-业务系统服务端ip与权限系统配置ip不一致；
          // 604-权限系统token过期；
          // 605-权限系统缓存过期；
          // 606-芯盾认证失败；
          if (
            response.data !== null &&
            response.data !== undefined &&
            String(response.data.code) === '200'
          ) {
            // 1.1 token 有效, 已完成业务系统登录，更新登录用户信息状态管理器
            const { myRouter = [], ...others } = response.data.data
            // 路由信息，用默认的
            const flattedRoutes = flatTreeToList(myRouter) // 权限系统返回的是树状, 当前项目前端需要的是拍平的数组结构
            console.log('[pinia:userInfo] others userinfo:', others)
            console.log('[pinia:userInfo] flattedRoutes:', flattedRoutes)
            // TODO: 完成登录后存储前端有权限的路由的操作

            login({ ...others, myRouter: flattedRoutes, isLogin: true, token })
            loginState.retryCountOfLogin = 0
            return true
          }
          // 1.2 其他权限系统已处理的异常情况
          console.error('[pinia:userInfo] axios 登录接口[/isLogin_powerSys] error:', response.data)
          Toast.error(
            `登录失败，接口调用异常: [${response.data.code}]` + (response.data.message ?? '')
          )
          // 防止接口调用失败，然后进行死循环, 清除前端存储的鉴权信息
          clearUserInfo()

          if (String(response.data.code) === '605') {
            // 缓存已过期，请重新登录
            loginState.retryCountOfLogin += 1
            if (loginState.retryCountOfLogin <= 5) {
              // 避免无限重复跳转
              setTimeout(redirectToLoginURL, 1000)
            }
          }
          return false
        })
        .catch((err) => {
          // 2 登录接口异常
          console.error('[pinia:userInfo] axios 登录接口[/isLogin_powerSys] error:', err)
          // 清除前端存储的鉴权信息
          clearUserInfo()
          Toast.error('登录失败，服务端异常')
          // throw err
          return false
        })
    }

    /**
     * 检查当前登录用户是否有菜单权限
     * @param to
     * @param next
     */
    function checkHasRouteAuth(to: RouteLocationNormalized, next: NavigationGuardNext) {
      const authedRoutePathList = userInfoState.myRouter
      if (Array.isArray(authedRoutePathList)) {
        if (to.path === '/' || authedRoutePathList.includes(to.path)) {
          next()
        } else {
          next('/404')
        }
      } else {
        next('/404')
      }
    }

    return {
      state: userInfoState,
      loginState,
      level1Routing,
      setUserInfo: login,
      clearUserInfo,
      logout,
      checkIsTokenValidAndLogin,
      checkHasRouteAuth
    }
  },
  {
    persist: {
      // 只需要持久化这两项即可
      pick: ['state.token', 'loginState'],
      key: 'user-info',
      storage: sessionStorage
    }
  }
)
