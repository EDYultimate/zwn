import type { RouteRecordRaw } from 'vue-router'

import AdminLayout from '@/layout/Admin/AdminLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    redirect: '/waterUse',
    meta: { title: '首页', sort: 1, hiddenInNavMenu: true },
    children: []
  },
  {
    path: '/waterUse',
    component: AdminLayout,
    redirect: '/waterUse/qushuijianguan',
    meta: { title: '取用水管理', sort: 2 },
    children: [
      {
        path: 'qushuijianguan',
        redirect: '/waterUse/qushuijianguan/shuiliangjiankong',
        meta: {
          // 原型「取用水管理」一级菜单名为「取水监管」
          title: '取水监管',
          sort: 1,
          icon: 'qys'
        },
        children: [
          {
            // name = agent 的 pageKey（稳定身份）：改 path / 菜单标题不影响能力声明
            name: 'shuiliangjiankong',
            path: 'shuiliangjiankong',
            // 原型「水量监控」右侧数据面板复刻页
            component: () => import('@/views/business/waterUse/shuiliangjiankong/index.vue'),
            meta: {
              title: '水量监控',
              sort: 1,
              mapIsShow: true
            }
          },
          {
            // name = agent 的 pageKey（稳定身份）：改 path / 菜单标题不影响能力声明
            name: 'shipinjiankong',
            path: 'shipinjiankong',
            // 原型「视频监控」右侧数据面板复刻页
            component: () => import('@/views/business/waterUse/shipinjiankong/index.vue'),
            meta: {
              title: '视频监控',
              sort: 2,
              mapIsShow: true,
              // gis2 常驻地图模块：路由只需配置模块名，切换页面不重载 iframe
              mapModule: 'shipinjiankong'
            }
          },
          {
            path: 'qushuixuncha',
            // 原型「取水巡查」右侧数据面板复刻页
            component: () => import('@/views/business/waterUse/qushuixuncha/index.vue'),
            meta: {
              // 原型子菜单名为「取水巡查」
              title: '取水巡查',
              sort: 3,
              mapIsShow: true
            }
          }
        ]
      },
      {
        // name = agent 的 pageKey（稳定身份）：改 path / 菜单标题不影响能力声明
        name: 'zhengzhaoguanli',
        path: 'zhengzhao',
        // 原型「证照管理」整页浅色视图复刻页
        component: () => import('@/views/business/waterUse/zhengzhaoguanli/index.vue'),
        meta: {
          title: '证照管理',
          sort: 2,
          icon: 'zhengzhao'
        }
      },
      {
        path: 'jihuayongshui',
        redirect: '/jihuayongshui/jihuashangbao',
        meta: {
          title: '计划用水管理',
          sort: 3,
          icon: 'jihua'
        },
        children: [
          {
            path: 'jihuashangbao',
            // 原型「计划上报」整页浅色视图复刻页
            component: () => import('@/views/business/waterUse/jihuashangbao/index.vue'),
            meta: { title: '计划上报', sort: 1 }
          },
          {
            path: 'jihuashenhe',
            // 原型「计划审核」整页浅色视图复刻页
            component: () => import('@/views/business/waterUse/jihuashenhe/index.vue'),
            meta: { title: '计划审核', sort: 2 }
          }
        ]
      },
      {
        // 原型「水量复核」菜单：水量上报 / 水量审核
        path: 'shuiliangfuchu',
        redirect: '/waterUse/shuiliangfuchu/shuiliangshangbao',
        meta: {
          title: '水量复核',
          sort: 4,
          icon: 'jihua'
        },
        children: [
          {
            path: 'shuiliangshangbao',
            // 原型「水量复核 · 水量上报」整页浅色视图复刻页
            component: () => import('@/views/business/waterUse/shuiliangshangbao/index.vue'),
            meta: { title: '水量上报', sort: 1 }
          },
          {
            path: 'shuiliangshenhe',
            // 原型「水量复核 · 水量审核」整页浅色视图复刻页
            component: () => import('@/views/business/waterUse/shuiliangshenhe/index.vue'),
            meta: { title: '水量审核', sort: 2 }
          }
        ]
      },
      {
        path: 'tongji',
        redirect: '/tongji/qushuiribao',
        meta: {
          title: '统计报表',
          sort: 5,
          icon: 'tongjibaobiao'
        },
        children: [
          {
            path: 'qushuiribao',
            // 原型「取水日报」整页浅色视图复刻页
            component: () => import('@/views/business/waterUse/qushuiribao/index.vue'),
            meta: { title: '取水日报', sort: 1 }
          },
          {
            // name = agent 的 pageKey（稳定身份）：改 path / 菜单标题不影响能力声明
            name: 'qushuiyuebao',
            path: 'qushuiyuebao',
            // 原型「取水月报」整页浅色视图复刻页
            component: () => import('@/views/business/waterUse/qushuiyuebao/index.vue'),
            meta: { title: '取水月报', sort: 2 }
          }
        ]
      }
    ]
  },
  {
    path: '/waterAssign',
    component: AdminLayout,
    redirect: '/waterAssign/haihe',
    meta: { title: '调度管理', sort: 3 },
    children: [
      {
        path: 'haihe',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: '调度总览',
          sort: 1,
          icon: 'fp_hh',
          mapIsShow: true
        }
      },
      {
        path: 'zhanghe',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: '调度四预',
          sort: 2,
          icon: 'fp_zh',
          mapIsShow: true
        }
      },
      {
        path: 'yinluan',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: '日常业务管理',
          sort: 3,
          icon: 'fp_yl',
          mapIsShow: true
        }
      }
    ]
  },
  {
    path: '/waterAdjust',
    component: AdminLayout,
    // 默认进入原型「生态流量管理」的第一个菜单：生态流量监管
    redirect: '/waterAdjust/ecoQManage',
    meta: { title: '生态流量管理', sort: 4 },
    children: [
      // ==================== 原型「生态流量管理」菜单：生态流量监管 / 考核断面管理 ====================
      // 占位页暂用 引滦工程水量分配 页面 + 引滦地图模块，后续替换为对应业务页面
      {
        path: 'ecoQManage',
        component: () => import('@/views/business/waterAdjust/ecoQManage/index.vue'),
        meta: {
          title: '生态流量监管',
          sort: 1,
          icon: 'qys',
          mapIsShow: true
        }
      },
      {
        path: 'kaoheduanmian',
        component: () => import('@/views/business/waterAdjust/ASM_Manage/index.vue'),
        meta: {
          title: '考核断面管理',
          sort: 2,
          icon: 'zhengzhao',
          mapIsShow: false
        }
      }
    ]
  },

  {
    path: '/lakeSupply',
    component: AdminLayout,
    redirect: '/lakeSupply/overview',
    meta: { title: '水资源保护', sort: 5 },
    children: [
      {
        path: 'overview',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: '水质监测',
          sort: 1,
          icon: 'fp_hh',
          mapIsShow: true
        }
      },
      {
        path: 'zhanghe',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: '饮用水源地保护',
          sort: 2,
          icon: 'fp_zh',
          mapIsShow: true
        }
      }
    ]
  },
  {
    path: '/ecoFlow',
    component: AdminLayout,
    redirect: '/ecoFlow/monitor',
    meta: { title: '节约用水', sort: 6 },
    children: [
      {
        path: 'monitor',
        component: () => import('@/views/test/index.vue'),
        meta: {
          title: '生态流量监管',
          sort: 0,
          icon: 'icon_river',
          verticalIsShow: false,
          mapIsShow: true
        }
      }
    ]
  },
  {
    // 原型顶部一级导航为「知识管理」，左侧菜单：知识管理（智能问答 / 知识管理）
    path: '/knowledge',
    component: AdminLayout,
    redirect: '/knowledge/QA',
    meta: { title: '知识管理', sort: 7 },
    children: [
      {
        path: 'QA',
        // 智能问答：首页问答 + 智能体工作区
        component: () => import('@/views/knowledge/QA/index.vue'),
        meta: { title: '智能问答', sort: 1, icon: 'zhengzhao' }
      },
      {
        path: 'base',
        // 知识库：分类树 + 检索 + 文档上传 / 预览 / 下载 / 删除
        component: () => import('@/views/knowledge/KnowledgeBase/index.vue'),
        meta: { title: '知识库', sort: 2, icon: 'tongjibaobiao' }
      },
      {
        path: 'testQA',
        // 知识库：分类树 + 检索 + 文档上传 / 预览 / 下载 / 删除
        component: () => import('@/views/test/testAgent.vue'),
        meta: { title: '问答Agent', sort: 3, icon: 'tongjibaobiao' }
      },
      {
        path: 'agentConfig',
        // 知识库：分类树 + 检索 + 文档上传 / 预览 / 下载 / 删除
        component: () => import('@/views/test/agentConfig.vue'),
        meta: { title: '能力列表配置', sort: 4, icon: 'tongjibaobiao' }
      },
      {
        path: 'agentPageConfig',
        // 页面能力配置：编辑各页面对智能体开放的能力说明，改动落库并支持一键还原
        component: () => import('@/views/test/agentPageConfig.vue'),
        meta: { title: '页面能力配置', sort: 5, icon: 'tongjibaobiao' }
      },
      {
        path: 'upload',
        // 文档上传：批量上传 Word / PDF / Excel / 图片，走 /knowledge/files/uploadBatch 入库
        component: () => import('@/views/knowledge/DocUpload/index.vue'),
        meta: { title: '文档上传', sort: 6, icon: 'zsk' }
      }
    ]
  }
]

export default routes
