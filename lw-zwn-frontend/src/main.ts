import { createApp } from 'vue'
import 'normalize.css/normalize.css'
import '@/assets/style/main.scss'
import { startCapabilitySync } from '@/agent/capabilitySync'
import { installAgentPages } from '@/agent/page/install'
import DatePicker from '@/components/common/DatePicker/index.vue'
import AppProvider from '@/components/common/AppProvider/AppProvider.vue'
import router from '@/router'
import { useTable } from '@/plugins/vxeTable'
import { setupStore } from '@/store'
import {
  SearchOutline,
  ResizeOutline,
  AddOutline,
  AddCircleOutline,
  ReloadOutline
} from '@vicons/ionicons5'

/*
 * @desc 等待路由加载完毕再进行内容挂载
 * @author HanJiaLin
 * */
async function bootstrap() {
  const app = createApp(AppProvider)
  setupStore(app)
  useTable(app)
  app.use(router)
  await router.isReady()
  //这里新建自定义指令 伪代码
  /*
   *   app.directive('permission', permission)
   * */

  const ionicons = { SearchOutline, ResizeOutline, AddOutline, AddCircleOutline, ReloadOutline }
  for (const [key, component] of Object.entries(ionicons)) {
    app.component(key, component)
  }

  // 全局注册日期选择器组件，所有 .vue 文件可直接使用 <DatePicker />
  app.component('DatePicker', DatePicker)

  // 页面能力插件必须在 mount 之前安装：业务页在 setup 里 expose 上下文时会发 enter 事件，
  // 装晚了首屏页面会丢掉这次接线（刷新后按钮无效，再切一次页才恢复）。
  installAgentPages()

  app.mount('#app')

  // 应用启动即全量同步页面能力声明，之后再按指纹做低频校验（见 src/agent/capabilitySync.ts）。
  // 放在 mount 之后：此时 Pinia 已激活、首屏路由已就绪，用户直接进问答页也能拿到完整页面清单。
  startCapabilitySync()
}

void bootstrap()
