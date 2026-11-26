<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

import icon_river_ydh from '@/assets/img/layout/menu/vertical/river_ydh.png'
import icon_river_ydh_active from '@/assets/img/layout/menu/vertical/river_ydh_active.png'
import icon_river_fth from '@/assets/img/layout/menu/vertical/river_fth.png'
import icon_river_lh from '@/assets/img/layout/menu/vertical/river_lh.png'
import icon_river_nsbd from '@/assets/img/layout/menu/vertical/river_nsbd.png'
import icon_river_wh from '@/assets/img/layout/menu/vertical/river_wh.png'
import icon_river_yhrj from '@/assets/img/layout/menu/vertical/river_yhrj.png'
import icon_river_zh from '@/assets/img/layout/menu/vertical/river_zh.png'

import icon_river from '@/assets/img/layout/menu/vertical/river_btn.png'
import icon_river_active from '@/assets/img/layout/menu/vertical/river_btn_active.png'

import icon_water_ledger from '@/assets/img/layout/menu/vertical/water_ledger.png'
import icon_water_ledger_active from '@/assets/img/layout/menu/vertical/water_ledger_active.png'
import icon_water_plan from '@/assets/img/layout/menu/vertical/water_plan.png'
import icon_water_plan_active from '@/assets/img/layout/menu/vertical/water_plan_active.png'
import icon_overload_water from '@/assets/img/layout/menu/vertical/overload_water.png'
import icon_overload_water_active from '@/assets/img/layout/menu/vertical/overload_water_active.png'
import icon_illegal_water from '@/assets/img/layout/menu/vertical/illegal_water.png'
import icon_illegal_water_active from '@/assets/img/layout/menu/vertical/illegal_water_active.png'

const route = useRoute()
const lv1Menu = computed(() => route.matched[1])
const lv2MenuListRef = ref<RouteRecordRaw[]>([])

watch(
  () => route.fullPath,
  () => {
    if (lv1Menu.value?.children) {
      lv2MenuListRef.value = lv1Menu.value.children
    }
  },
  { immediate: true, deep: true }
)

const getIcon = (iconName: string, path: string) => {
  const fullPath = `${lv1Menu.value?.path}/${path}`
  // 使用 startsWith 判断，让三级菜单选中时对应的二级菜单仍保持选中状态
  const isActive = route.path === fullPath || route.path.startsWith(`${fullPath}/`)
  if (isActive && iconList[`${iconName}_active` as keyof typeof iconList]) {
    return iconList[`${iconName}_active` as keyof typeof iconList]
  }
  return iconList[iconName as keyof typeof iconList]
}

const iconList = {
  icon_river_ydh,
  icon_river_ydh_active,
  icon_river_fth,
  icon_river_lh,
  icon_river_nsbd,
  icon_river_wh,
  icon_river_yhrj,
  icon_river_zh,
  icon_water_ledger,
  icon_water_ledger_active,
  icon_water_plan,
  icon_water_plan_active,
  icon_overload_water,
  icon_overload_water_active,
  icon_illegal_water,
  icon_illegal_water_active,
  icon_river,
  icon_river_active
}
</script>

<template>
  <!--  是否显示折叠条-->
  <!--  show-trigger="bar"-->
  <n-layout-sider
    v-if="lv2MenuListRef.length > 0"
    :collapsed-width="0"
    width="auto"
    content-class="slider-content"
    trigger-class="trigger-position"
    :native-scrollbar="false"
    style="background: transparent"
  >
    <div class="slider-layout-container">
      <div v-for="lv2MenuItem in lv2MenuListRef" :key="lv2MenuItem.path">
        <router-link
          :to="{ path: `${lv1Menu.path}/${(lv2MenuItem as RouteRecordRaw).path}` }"
          class="router-link-three-normal"
        >
          <div class="menu-item">
            <img
              :src="getIcon(lv2MenuItem.meta?.icon as string, (lv2MenuItem as RouteRecordRaw).path)"
              alt=""
            />
            <div v-if="!(lv2MenuItem as RouteRecordRaw).meta?.hideName" class="menu-text">
              <span
                :class="{
                  'menu-text-small':
                    ((lv2MenuItem as RouteRecordRaw).meta?.title as string)?.length > 8
                }"
                >{{ (lv2MenuItem as RouteRecordRaw).meta?.title }}</span
              >
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </n-layout-sider>
</template>

<style lang="scss" scoped>
:deep(.slider-content) {
  background: transparent;
  box-sizing: border-box;
  height: 100%;
  min-height: 100%;
}
.slider-layout-container {
  position: relative;
  background: transparent;
  border-radius: 10px;
  padding: 5px 0 15px;

  width: 100%;
  height: auto;
  min-height: 100%;

  color: #fff;
  box-sizing: border-box;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.router-link-three-normal {
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: left;
  //width: 220px;
  //height: 60px;
  margin: 2px 0;

  //font-family: SourceHanSansCN-Regular;
  //font-family: 'Noto Sans SC', 'Source Han Sans CN', sans-serif;
  font-weight: 700; /* Bold粗体 */

  font-size: 18px;
  letter-spacing: 1px;
  border-radius: 8px;
  color: #373737;
  transition: all 0.3s;

  img:first-child {
    width: 103px;
    height: 108px;
  }
}
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .menu-text {
    color: #163c7c;
    font-size: 14px;
    position: absolute;
    top: 69px;
    max-width: 64px;
    text-align: center;
    margin-left: 2px;
    .menu-text-small {
      font-size: 11px;
    }
  }
}
.router-link-three-normal.router-link-active {
  //background-color: #daf0f8;
  //font-weight: bold;
  //transition: all 0.3s;
  //span {
  //  background: #3a78de;
  //  -webkit-background-clip: text;
  //  background-clip: text;
  //  -webkit-text-fill-color: transparent;
  //  color: transparent;
  //}
  //
  //img.icon-right {
  //  display: block;
  //}
}
</style>
