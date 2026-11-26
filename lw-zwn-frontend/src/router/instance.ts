import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

interface IModuleType {
  default: Array<RouteRecordRaw> | RouteRecordRaw
}
const modules = import.meta.glob<IModuleType>('./modules/**/*.ts', { eager: true })
const routeModuleList: RouteRecordRaw[] = Object.keys(modules).reduce(
  (list: RouteRecordRaw[], key) => {
    const mod = modules[key].default ?? {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    return [...list, ...modList]
  },
  []
)

// 根路由排序
const sortRoute = (a: any, b: any) => {
  return (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0)
}
routeModuleList.sort(sortRoute)
console.log('routeModuleList:', routeModuleList)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routeModuleList,
    {
      component: () => import('@/components/sentinel/404.vue'),
      path: '/404',
      name: '404',
      meta: { title: '404', hiddenInNavMenu: true }
    }
    // {
    //   path: '/:w+',
    //   name: 'bottom',
    //   meta: { title: '404' },
    //   redirect: '/404'
    // }
  ]
})

export default router
