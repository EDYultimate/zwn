import Qs from 'qs'

import env from '@/env'
import router from '@/router/instance'
import { userInfoStore } from '@/store/modules/userInfo'
import { redirectToLoginURL } from '@/utils/auth'
import { getURLWithoutQueryKey } from '@/utils/common'
// 导航守卫

const AUTH_WHITE_LIST_URL = ['/404']

// 导航守卫
// 使用 myRouter.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  const store = userInfoStore()
  console.log(`debug from:${from.path} to: ${to.path}`)
  // 路由跳转时启动顶部加载条
  window.$loadingBar?.start()
  if (to.path === '/' || to.path !== from.path) {
    // 登录状态
    if (AUTH_WHITE_LIST_URL.includes(to.path)) {
      next()
    } else {
      const isLogin = store.state.isLogin
      console.log('登录状态：' + isLogin)
      if (isLogin) {
        store.checkHasRouteAuth(to, next)
      } else if (env.USE_POWER_SYS) {
        // 接入权限管理系统
        // 1. 检查 url 中是否有 token
        // 如果用户访问 /?, 经过重定向后, 地址会变成 /?&ticket=xxx, 需要将 &去掉
        let search = location.search
        search = search.replace('?&', '?')
        const query = Qs.parse(search, { ignoreQueryPrefix: true })
        if (query !== undefined && query.ticket !== undefined && query.ticket !== '') {
          //  1.1 url 中有 token, 优先使用该 token
          //
          //  对应情况1: 1.2.1 从权限系统登录后跳转回来
          //  对应情况2: 业务系统session过期, 接口返回401, 从权限系统登录后跳转回来
          //

          // 不刷新的情况下清除地址栏 url query 中的 ticket=xxx, 避免地址内因为包含 ticket 看起来太长, 遮住了前端路由
          const pathWithoutTicket = getURLWithoutQueryKey('ticket').replace(location.origin, '')

          setTimeout(() => {
            window.history.replaceState(null, document.title, pathWithoutTicket)
          }, 500)

          const { ticket: token } = query
          store.checkIsTokenValidAndLogin(token).then((isLoginSucceed) => {
            isLoginSucceed && store.checkHasRouteAuth(to, next)
          })
        } else {
          // 1.2 url 中没有 token, 检查是否有缓存过 token(从内存/sessionStorage中获取)
          const token = store.state.token
          if (token === null) {
            // 1.2.1 缓存中也没有 token, 需要登录 (对应首次登录的情况)
            redirectToLoginURL()
          } else {
            // 1.2.2 缓存中有 token, 需要校验 token 是否有效, 完成登录(对应已登录后打开新Tab页的情况)
            store.checkIsTokenValidAndLogin(token).then((isLoginSucceed) => {
              isLoginSucceed && store.checkHasRouteAuth(to, next)
            })
          }
        }
      } else {
        // 未启用前端鉴权, 直接放行
        next()
        // store.checkIsTokenValidAndLogin('MOCK-TOKEN').then((isLoginSucceed) => {
        //   isLoginSucceed && store.checkHasRouteAuth(to, next)
        // })
      }
    }
  }
})

router.afterEach((to) => {
  // 页面加载完成，结束加载条
  window.$loadingBar?.finish()
  if (typeof to.meta?.title === 'string') {
    document.title = to.meta.title
  }
  // 表格字体 UI 标准：按页面类型给 body 打标（与布局 MapArea/MainArea 的互斥渲染逻辑一致，
  // meta.mapIsShow === true 为地图页，否则为非地图页），供全局表格样式区分（见 main.scss）
  document.body.classList.toggle('page-map', to.meta.mapIsShow === true)
  document.body.classList.toggle('page-main', to.meta.mapIsShow !== true)
})

// 路由报错时也要结束加载条，避免一直卡在加载状态
router.onError(() => {
  window.$loadingBar?.error()
})

export default router
