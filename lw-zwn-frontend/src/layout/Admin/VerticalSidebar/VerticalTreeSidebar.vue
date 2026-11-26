<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

import qys from '@/assets/img/layout/menu/vertical_tree/icon/qys.png'
import qys_active from '@/assets/img/layout/menu/vertical_tree/icon/qys_active.png'

import zhengzhao from '@/assets/img/layout/menu/vertical_tree/icon/zhengzhao.png'
import zhengzhao_active from '@/assets/img/layout/menu/vertical_tree/icon/zhengzhao_active.png'

import jihua from '@/assets/img/layout/menu/vertical_tree/icon/jihua.png'
import jihua_active from '@/assets/img/layout/menu/vertical_tree/icon/jihua_active.png'

import tongjibaobiao from '@/assets/img/layout/menu/vertical_tree/icon/tongjibaobiao.png'
import tongjibaobiao_active from '@/assets/img/layout/menu/vertical_tree/icon/tongjibaobiao_active.png'
import zsk from '@/assets/img/layout/menu/vertical_tree/icon/zsk.png'
import zsk_active from '@/assets/img/layout/menu/vertical_tree/icon/zsk_active.png'

// import fp_hh from '@/assets/img/layout/menu/vertical_tree/fp_hh.png'
// import fp_ydh from '@/assets/img/layout/menu/vertical_tree/fp_ydh.png'
// import fp_yl from '@/assets/img/layout/menu/vertical_tree/fp_yl.png'
// import fp_zh from '@/assets/img/layout/menu/vertical_tree/fp_zh.png'
//
// import ds_nian from '@/assets/img/layout/menu/vertical_tree/ds_nian.png'
// import ds_wj from '@/assets/img/layout/menu/vertical_tree/ds_wj.png'
// import ds_yue from '@/assets/img/layout/menu/vertical_tree/ds_yue.png'
// import ds_yzt from '@/assets/img/layout/menu/vertical_tree/ds_yzt.png'
//
// import qys_jg from '@/assets/img/layout/menu/vertical_tree/qys_jg.png'
// import qys_jl from '@/assets/img/layout/menu/vertical_tree/qys_jl.png'
// import qys_tj from '@/assets/img/layout/menu/vertical_tree/qys_tj.png'
// import qys_yzt from '@/assets/img/layout/menu/vertical_tree/qys_yzt.png'
// import qys_zzk from '@/assets/img/layout/menu/vertical_tree/qys_zzk.png'
//
// import dxs_cc from '@/assets/img/layout/menu/vertical_tree/dxs_cc.png'
// import dxs_sk from '@/assets/img/layout/menu/vertical_tree/dxs_sk.png'

// import icon_river_ydh from '@/assets/img/layout/menu/vertical/river_ydh.png'
// import icon_river_ydh_active from '@/assets/img/layout/menu/vertical/river_ydh_active.png'
// import icon_river_fth from '@/assets/img/layout/menu/vertical/river_fth.png'
// import icon_river_lh from '@/assets/img/layout/menu/vertical/river_lh.png'
// import icon_river_nsbd from '@/assets/img/layout/menu/vertical/river_nsbd.png'
// import icon_river_wh from '@/assets/img/layout/menu/vertical/river_wh.png'
// import icon_river_yhrj from '@/assets/img/layout/menu/vertical/river_yhrj.png'
// import icon_river_zh from '@/assets/img/layout/menu/vertical/river_zh.png'
//
// import icon_river from '@/assets/img/layout/menu/vertical/river_btn.png'
// import icon_river_active from '@/assets/img/layout/menu/vertical/river_btn_active.png'
//
// import icon_water_ledger from '@/assets/img/layout/menu/vertical/water_ledger.png'
// import icon_water_ledger_active from '@/assets/img/layout/menu/vertical/water_ledger_active.png'
// import icon_water_plan from '@/assets/img/layout/menu/vertical/water_plan.png'
// import icon_water_plan_active from '@/assets/img/layout/menu/vertical/water_plan_active.png'
// import icon_overload_water from '@/assets/img/layout/menu/vertical/overload_water.png'
// import icon_overload_water_active from '@/assets/img/layout/menu/vertical/overload_water_active.png'
// import icon_illegal_water from '@/assets/img/layout/menu/vertical/illegal_water.png'
// import icon_illegal_water_active from '@/assets/img/layout/menu/vertical/illegal_water_active.png'
//
// /* 取用水模块菜单图（1=选中态，2=普通态） */
// import icon_quyongshui_xingwei from '@/assets/img/layout/menu/vertical/new_quyongshui_xingwei_jianguan2.png'
// import icon_quyongshui_xingwei_active from '@/assets/img/layout/menu/vertical/new_quyongshui_xingwei_jianguan1.png'
// import icon_dianzi_zhengzhao from '@/assets/img/layout/menu/vertical/new_dianzi_zhengzhaoku2.png'
// import icon_dianzi_zhengzhao_active from '@/assets/img/layout/menu/vertical/new_dianzi_zhengzhaoku1.png'
// import icon_jiliang_sheshi from '@/assets/img/layout/menu/vertical/new_jiliang_sheshiku2.png'
// import icon_jiliang_sheshi_active from '@/assets/img/layout/menu/vertical/new_jiliang_sheshiku1.png'
// import icon_yongshui_tongji from '@/assets/img/layout/menu/vertical/new_yongshui_tongjidiaocha2.png'
// import icon_yongshui_tongji_active from '@/assets/img/layout/menu/vertical/new_yongshui_tongjidiaocha1.png'

import DivBackIn from '@/components/business/DivBackIn.vue'
import SidebarMenuNode from './SidebarMenuNode.vue'

const route = useRoute()
const lv1Menu = computed(() => route.matched[0])
const lv2MenuListRef = ref<RouteRecordRaw[]>([])

// 按 meta.sort 升序排序；无 sort 属性的项排在有 sort 的项之后，并保持路由文件中的原始顺序
const sortBySort = (menuList: RouteRecordRaw[]): RouteRecordRaw[] => {
  return menuList
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const sortA = a.item.meta?.sort as number | undefined
      const sortB = b.item.meta?.sort as number | undefined
      // 两者都有 sort 时按数值升序；否则保持原始顺序（无 sort 视为排在最后）
      if (sortA !== undefined && sortB !== undefined) {
        return sortA - sortB
      }
      if (sortA !== undefined) {
        return -1
      }
      if (sortB !== undefined) {
        return 1
      }
      return a.index - b.index
    })
    .map(({ item }) => item)
}

// 获取可见子菜单：过滤掉 hiddenInNavMenu 的菜单项（如重构后保留的老 URL 入口），并按 sort 排序
const getVisibleChildren = (item: { children?: RouteRecordRaw[] }): RouteRecordRaw[] => {
  const children = item.children ?? []
  return sortBySort(children.filter((child) => child.meta?.hiddenInNavMenu !== true))
}

// 判断菜单是否选中：使用 startsWith 前缀匹配，让后代菜单选中时其各级父菜单均保持选中效果
const isActive = (fullPath: string) =>
  route.path === fullPath || route.path.startsWith(`${fullPath}/`)

const getIcon = (iconName: string, fullPath: string) => {
  if (isActive(fullPath) && iconList[`${iconName}_active` as keyof typeof iconList]) {
    return iconList[`${iconName}_active` as keyof typeof iconList]
  }
  return iconList[iconName as keyof typeof iconList]
}

const iconList = {
  // import qys from '@/assets/img/layout/menu/vertical_tree/icon/qys.png'
  // import zhengzhao from '@/assets/img/layout/menu/vertical_tree/icon/zhengzhao.png'
  // import jihua from '@/assets/img/layout/menu/vertical_tree/icon/jihua.png'
  // import tongjibaobiao from '@/assets/img/layout/menu/vertical_tree/icon/tongjibaobiao.png'
  // import zsk from '@/assets/img/layout/menu/vertical_tree/icon/zsk.png'
  qys,
  qys_active,
  zhengzhao,
  zhengzhao_active,
  jihua,
  jihua_active,
  tongjibaobiao,
  tongjibaobiao_active,
  zsk,
  zsk_active
  // czl_gb,
  // fp_hh,
  // fp_zh,
  // fp_yl,
  // fp_ydh,
  // ds_nian,
  // ds_wj,
  // ds_yue,
  // ds_yzt,
  // qys_jg,
  // qys_zzk,
  // qys_jl,
  // qys_tj,
  // qys_yzt,
  // dxs_cc,
  // dxs_sk
  // icon_river_ydh,
  // icon_river_ydh_active,
  // icon_river_fth,
  // icon_river_lh,
  // icon_river_nsbd,
  // icon_river_wh,
  // icon_river_yhrj,
  // icon_river_zh,
  // icon_water_ledger,
  // icon_water_ledger_active,
  // icon_water_plan,
  // icon_water_plan_active,
  // icon_overload_water,
  // icon_overload_water_active,
  // icon_illegal_water,
  // icon_illegal_water_active,
  // icon_river,
  // icon_river_active,
  // icon_quyongshui_xingwei,
  // icon_quyongshui_xingwei_active,
  // icon_dianzi_zhengzhao,
  // icon_dianzi_zhengzhao_active,
  // icon_jiliang_sheshi,
  // icon_jiliang_sheshi_active,
  // icon_yongshui_tongji,
  // icon_yongshui_tongji_active
}

// 分组展开状态（手风琴模式）：key=父级路径，value=该层级下处于展开状态的分组完整路径，
// 同一层级（同一父级下）同一时刻仅一个分组展开，其余闭合
const expandedMap = ref<Record<string, string>>({})

// 切换分组展开/收起：展开某一分组时，同层级其他分组自动闭合
const toggleGroup = (parentPath: string, groupFullPath: string) => {
  if (expandedMap.value[parentPath] === groupFullPath) {
    delete expandedMap.value[parentPath]
  } else {
    expandedMap.value[parentPath] = groupFullPath
  }
}

// 路由变化时，沿选中路由的祖先链路逐层展开分组，同层级其他分组保持闭合
const syncExpandedToRoute = () => {
  const map: Record<string, string> = {}
  let parentPath = lv1Menu.value?.path ?? ''
  let levelList = lv2MenuListRef.value
  while (levelList.length > 0) {
    // 在当前层级中找到选中链路命中的菜单项
    const hit = levelList.find((item) => isActive(`${parentPath}/${item.path}`))
    if (!hit) {
      break
    }
    const hitFullPath = `${parentPath}/${hit.path}`
    const children = getVisibleChildren(hit)
    if (children.length === 0) {
      break
    }
    // 命中的是分组：记录展开状态，继续向下层寻找
    map[parentPath] = hitFullPath
    parentPath = hitFullPath
    levelList = children
  }
  expandedMap.value = map
}

watch(
  () => route.fullPath,
  () => {
    if (lv1Menu.value?.children) {
      lv2MenuListRef.value = getVisibleChildren(lv1Menu.value)
    }
    syncExpandedToRoute()
  },
  { immediate: true, deep: true }
)

// 向菜单树节点组件注入共享状态与方法
provide('verticalTreeMenu', {
  expandedMap,
  toggleGroup,
  isActive,
  getIcon,
  getVisibleChildren
})

interface Props {
  // 是否为地图侧边栏
  isMap?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isMap: false
})
</script>

<template>
  <n-layout-sider
    v-if="lv2MenuListRef.length > 0"
    :collapsed-width="0"
    content-class="slider-content"
    trigger-class="trigger-position"
    :width="225"
    :native-scrollbar="false"
    style="background: transparent"
  >
    <div class="slider-layout-container">
      <!-- 树形菜单：渲染二级及以下所有层级，由 SidebarMenuNode 递归实现 -->
      <SidebarMenuNode
        v-for="lv2MenuItem in lv2MenuListRef"
        :key="lv2MenuItem.path"
        :item="lv2MenuItem"
        :parent-path="lv1Menu.path"
        is-root
      />
    </div>
  </n-layout-sider>
</template>

<style lang="scss" scoped>
:deep(.slider-content) {
  padding: 12px 8px 12px 12px;
  background: transparent;
  box-sizing: border-box;
  height: 100%;
  min-height: 100%;
}
.slider-layout-container {
  position: relative;
  //background: #fff;
  border-radius: 10px;
  padding: 6px 6px 10px;

  width: 100%;
  height: auto;
  min-height: 100%;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.map_sider {
  margin-top: 30px;
}
</style>
