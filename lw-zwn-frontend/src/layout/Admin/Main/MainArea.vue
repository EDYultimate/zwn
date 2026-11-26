<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { useResetObjectReactive } from '@/hooks/core/useResetObjectReactive'
import SkewButton from '@/components/business/SkewButton.vue'

const route = useRoute()
const router = useRouter()
const padding = ref<string>('14px 14px 14px 24px')
const [cardStyle, reSetCardStyle] = useResetObjectReactive({
  // boxShadow: '0 0 12px #dfdfdf',
  // borderRadius: '6px'
  /* 仅保留顶部 padding，左右/底部由内部元素自行留白，
     使滚动容器贴满卡片内部，滚动条出现在卡片内边缘而非 padding 内 */
  // padding: '15px 0 0 0',
  // background: '#fff'
})

// 三级菜单：取当前匹配的二级路由的 children（过滤 hiddenInNavMenu，如重构后保留的老 URL 子树）
const lv2Menu = computed(() => route.matched[1])
const lv3MenuList = computed<RouteRecordRaw[]>(() => {
  return ((lv2Menu.value?.children as RouteRecordRaw[]) || []).filter(
    (item) => item.meta?.hiddenInNavMenu !== true
  )
})

// 当前激活的三级菜单完整路径
const muActiveCode = ref('')

watch(
  () => route.fullPath,
  () => {
    if (route.matched[2]) {
      muActiveCode.value = route.matched[2].path
    } else if (lv3MenuList.value.length > 0 && lv2Menu.value) {
      muActiveCode.value = `${lv2Menu.value.path}/${lv3MenuList.value[0].path}`
    } else {
      muActiveCode.value = ''
    }
  },
  { immediate: true }
)

function handleMenuClick(child: RouteRecordRaw) {
  const fullPath = `${lv2Menu.value?.path}/${child.path}`
  router.push(fullPath)
}

watch(
  () => route.fullPath,
  (newRoutePath, oldRoutePath) => {
    if (newRoutePath !== oldRoutePath) {
      if (route.meta.verticalIsShow !== false) {
        padding.value = '12px 12px 12px 0px'
      } else {
        padding.value = '12px'
      }
      if (route.meta.cardMode !== false) {
        reSetCardStyle()
      } else {
        cardStyle.background = 'transparent'
        cardStyle.boxShadow = '0 0 0 transparent'
        cardStyle.borderRadius = 'none'
        // cardStyle.padding = 'none'
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <n-layout-content class="out_class" :content-style="{ padding, background: 'transparent' }">
    <div class="layout-card-container" :style="cardStyle">
      <div
        style="background: #fff; border-radius: inherit; width: 100%; height: 100%; padding: 8px"
      >
        <!--        <MenuCrumb :is-map="false" style="margin: 0 10px 2px" />-->
        <div
          :class="{
            'level3-body': lv3MenuList && lv3MenuList.length > 0,
            'level2-body': !lv3MenuList || lv3MenuList.length === 0
          }"
          style="overflow: auto; position: relative"
        >
          <router-view class="router-view-container" />
        </div>
      </div>

      <!--  智能助手    -->
    </div>
  </n-layout-content>
</template>

<style lang="scss" scoped>
.layout-card-container {
  width: 100%;
  height: 100%;
  /*box-shadow: 0 0 12px #dfdfdf;
  border-radius: 6px;*/
  overflow: hidden;
  box-sizing: border-box;

  //box-shadow: 0px 0px 10px 2px rgba(71, 151, 228, 0.28);
  border-radius: 0px;
  padding: 10px;
  background: rgb(50, 79, 145);
}
.breadcrumb-container {
  width: 18px;
  height: 18px;
  // background: url('@/assets/img/08.png') no-repeat;
  margin-right: 8px;
}
:deep(.n-breadcrumb-item__link) {
  color: #454545 !important;
}
.divider-container {
  width: 100%;
  height: 3px;
  border-width: 1px 9px 1px 9px;
  border-style: solid;
  // border-image-source: url('@/assets/img/09.png');
  border-image-slice: 1 9 1 9 fill;
  border-image-repeat: stretch;
  box-sizing: border-box;
  margin-top: 5px;
}
.router-view-container {
  width: 100%;
  height: calc(100% - 0px);
  //padding-top: 10px;
  box-sizing: border-box;
  /* 左右/底部留白由内容区自行提供，滚动条得以贴卡片内边缘 */
  padding: 10px 10px 10px 10px;
}
.n-layout {
  background-color: transparent;
}
.menu--item-level3 {
  display: flex;
  margin-bottom: 10px;
}
.level3-body {
  width: 100%;
  height: calc(100% - 40px);
  position: relative;
}
.level2-body {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
