<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuPushStore } from '@/store/modules/menuPush'

import type { PrefixNodeDTO } from '@/api/menuPush'

const route = useRoute()
const router = useRouter()
const menuPushStore = useMenuPushStore()

// 获取面包屑列表，过滤掉隐藏的菜单项
const breadcrumbList = computed(() => {
  return route.matched.filter((item) => !item.meta?.hiddenInNavMenu && item.meta?.title)
})

// 前置菜单节点（环境变量指定的某一套：功能/管理/区域）
const prefixNodes = computed(() => menuPushStore.activePrefixNodes)

// 点击左侧按钮：切换前置菜单填充显示；缓存有前缀数据直接用，无则调接口获取并缓存；
// 再次点击关闭填充，保持原本的菜单层级路径
function handlePrefixBtnClick() {
  menuPushStore.togglePrefix()
}

// 点击前置菜单节点：根据 url 跳转（外部链接新窗口打开，站内路径走路由跳转；url 为空不可点击）
function handlePrefixNodeClick(node: PrefixNodeDTO) {
  if (!node.url) {
    return
  }
  if (/^https?:\/\//i.test(node.url)) {
    window.open(node.url)
  } else if (node.url !== route.path) {
    router.push(node.url)
  }
}

// 点击面包屑跳转到对应菜单（父级路由若有 redirect 会自动重定向到默认子页面）
function handleCrumbClick(path: string) {
  if (path && path !== route.path) {
    router.push(path)
  }
}

interface Props {
  // 是否为地图面包屑
  isMap?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isMap: true
})
</script>

<template>
  <div class="menu-crumb-container" :class="{ 'is-map': isMap }">
    <div class="crumb-content">
      <!-- 文字区域 -->

      <!-- 前置菜单开关按钮：开启后面包屑填充指定的那套前缀菜单（首次开启自动加载，缓存优先） -->
      <div class="crumb-text-btn" @click="handlePrefixBtnClick">
        <img v-if="menuPushStore.prefixVisible" src="@/assets/img/layout/menu/icon/ext_pre1.png" />
        <img v-else src="@/assets/img/layout/menu/icon/ext_pre2.png" />
      </div>

      <div class="crumb-text">
        <!-- 前置菜单（环境变量指定的某一套：功能/管理/区域，点击按 url 跳转） -->
        <template v-if="menuPushStore.prefixVisible && prefixNodes.length">
          <template v-for="(node, index) in prefixNodes" :key="`prefix-${index}`">
            <span
              class="crumb-item"
              :class="{ 'crumb-item-link': !!node.url }"
              @click="handlePrefixNodeClick(node)"
            >
              {{ node.name }}
            </span>
            <span class="crumb-separator">></span>
          </template>
        </template>
        <!-- 固定首页层：点击进入 "/" 路由 -->
        <span class="crumb-item crumb-item-link" @click="handleCrumbClick('/')">
          水资源管理与调配全景
        </span>
        <span class="crumb-separator">></span>
        <template v-for="(item, index) in breadcrumbList" :key="item.path">
          <span
            class="crumb-item"
            :class="{ 'crumb-item-link': index < breadcrumbList.length - 1 }"
            @click="handleCrumbClick(item.path)"
          >
            {{ item.meta?.title }}
          </span>
          <span v-if="index < breadcrumbList.length - 1" class="crumb-separator">></span>
        </template>
      </div>
      <!-- 右侧渐变尾巴：颜色从文字区背景色渐变到透明 -->
      <div class="crumb-tail"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-crumb-container {
  .crumb-content {
    display: inline-flex;
    align-items: stretch;

    .crumb-text-btn {
      display: flex;
      margin-right: 20px;
      cursor: pointer;
    }

    .crumb-text {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px 0 0 8px;

      .crumb-item {
        /* 完整展示每一层菜单标题，不截断 */
        white-space: nowrap;

        /* 可点击的父级面包屑：手型光标 */
        &.crumb-item-link {
          cursor: pointer;
          transition: color 0.2s;

          /* 地图模式默认：白色文字发光高亮 */
          &:hover {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
          }
        }
      }

      .crumb-separator {
        margin: 0 2px;
        user-select: none;
      }
    }

    /* 右侧附加渐变尾巴 */
    .crumb-tail {
      width: 200px;
    }
  }

  /* 非地图模式（默认）：浅灰蓝背景 + 灰蓝文字 */
  .crumb-content .crumb-text {
    background: linear-gradient(90deg, #e9eff7 0%, rgba(233, 239, 247, 0.85) 100%);
    color: #8094b5;

    .crumb-separator {
      color: #8094b5;
    }

    /* 悬停：灰蓝文字变深蓝，浅底上对比明显 */
    .crumb-item.crumb-item-link:hover {
      color: #2b5c9e;
      text-shadow: none;
    }
  }

  .crumb-content .crumb-tail {
    background: linear-gradient(90deg, rgba(233, 239, 247, 0.85) 0%, rgba(233, 239, 247, 0) 100%);
  }

  /* 地图模式：淡蓝色背景 + 白色文字 */
  &.is-map .crumb-content .crumb-text {
    background: linear-gradient(90deg, #81b4e0 0%, rgba(129, 180, 224, 0.85) 100%);
    color: #ffffff;

    .crumb-separator {
      color: #ffffff;
    }

    /* 悬停：白色文字发光高亮（保留之前的样式） */
    .crumb-item.crumb-item-link:hover {
      color: #ffffff;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
    }
  }

  &.is-map .crumb-content .crumb-tail {
    background: linear-gradient(90deg, rgba(129, 180, 224, 0.85) 0%, rgba(129, 180, 224, 0) 100%);
  }
}
</style>
