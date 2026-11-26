<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

interface Props {
  // 当前菜单项（路由记录）
  item: RouteRecordRaw
  // 父级完整路径，用于拼接当前菜单的完整路径
  parentPath: string
  // 是否为二级菜单根节点（根级菜单无论有无子菜单均使用父菜单按钮样式）
  isRoot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isRoot: false
})

// 由 VerticalTreeSidebar 注入的树形菜单共享状态与方法
const menuApi = inject<{
  // 分组展开状态（手风琴模式）：key=父级路径，value=该层级下展开的分组完整路径
  expandedMap: Ref<Record<string, string>>
  // 切换分组展开/收起（展开时同层级其他分组自动闭合）
  toggleGroup: (parentPath: string, groupFullPath: string) => void
  // 判断菜单是否选中（自身或后代路由命中均视为选中，父菜单保持选中效果）
  isActive: (fullPath: string) => boolean
  // 获取菜单图标（选中时返回选中态图标）
  getIcon: (iconName: string, fullPath: string) => string
  // 获取可见子菜单（过滤隐藏项并按 sort 排序）
  getVisibleChildren: (item: { children?: RouteRecordRaw[] }) => RouteRecordRaw[]
}>('verticalTreeMenu')!

// 当前菜单项完整路径
const fullPath = computed(() => `${props.parentPath}/${props.item.path}`)

// 可见子菜单
const children = computed(() => menuApi.getVisibleChildren(props.item))
// 是否为分组节点（含子菜单，点击标题展开/收起）
const isGroup = computed(() => children.value.length > 0)
// 选中状态：自身或后代路由命中（父菜单选中时背景淡蓝）
const active = computed(() => menuApi.isActive(fullPath.value))
// 展开状态：同层级（同一父级下）同一时刻仅一个分组展开
const expanded = computed(() => menuApi.expandedMap.value[props.parentPath] === fullPath.value)

// 切换分组展开/收起
const toggle = () => menuApi.toggleGroup(props.parentPath, fullPath.value)

const router = useRouter()

// 获取当前分组下第一个叶子菜单的完整路径（子级若仍为分组则递归向下找）
const getFirstLeafPath = (): string | null => {
  let currentParentPath = fullPath.value
  let levelList = children.value
  while (levelList.length > 0) {
    // getVisibleChildren 已按 sort 排序，取第一个可见子菜单
    const first = levelList[0]
    const firstPath = `${currentParentPath}/${first.path}`
    const firstChildren = menuApi.getVisibleChildren(first)
    if (firstChildren.length === 0) {
      return firstPath
    }
    currentParentPath = firstPath
    levelList = firstChildren
  }
  return null
}

// 点击分组标题：
// - 已展开：收起分组（保持原有手风琴收起行为）
// - 未展开：展开分组；若当前无任何后代菜单选中，则默认选中第一个叶子菜单，
//   否则保留原本选中的子菜单状态
const handleGroupClick = () => {
  if (expanded.value) {
    toggle()
    return
  }
  toggle()
  // active 为 true 说明该分组下有选中的后代菜单，保留其选中状态
  if (active.value) {
    return
  }
  const firstLeafPath = getFirstLeafPath()
  if (firstLeafPath) {
    router.push(firstLeafPath)
  }
}
</script>

<template>
  <div v-if="isGroup || isRoot" class="menu-node">
    <div
      class="group-header"
      :class="{ 'is-active': active }"
      @click="isGroup ? handleGroupClick() : router.push(fullPath)"
    >
      <img
        v-if="item.meta?.icon"
        class="node-icon"
        :src="menuApi.getIcon(item.meta?.icon as string, fullPath)"
        alt=""
      />

      <div class="node-title">
        <span>{{ item.meta?.title }}</span>

        <!--        background-image: url('@/assets/img/layout/menu/vertical_tree/tree_menu_title_right.png');-->

        <!--        <img-->
        <!--          class="expand-arrow"-->
        <!--          src="@/assets/img/layout/menu/vertical_tree/tree_menu_title_right.png"-->
        <!--        />-->
      </div>
      <!--      <span v-if="isGroup" class="expand-arrow" :class="{ 'is-open': expanded }"></span>-->
    </div>
    <!-- 子菜单（递归渲染二级以下所有层级） -->
    <div v-if="isGroup" v-show="expanded" class="sub-menu">
      <SidebarMenuNode
        v-for="child in children"
        :key="child.path"
        :item="child"
        :parent-path="fullPath"
      />
    </div>
  </div>

  <router-link v-else :to="{ path: fullPath }" class="menu-node">
    <div class="leaf-row" :class="{ 'is-active': active }">
      <n-ellipsis>
        <span class="node-title">{{ item.meta?.title }}</span>
      </n-ellipsis>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.menu-node {
  width: 100%;
  display: block;
  /* 相邻菜单节点之间的间距 */
  margin-bottom: 4px;
  /* router-link 渲染为 a 标签，去除默认下划线 */
  text-decoration: none;
  /* 禁止选中菜单文字，避免点击时出现文字被选中的效果 */
  user-select: none;
}

/* 标题文字（分组行 / 叶子行通用） */
.node-title {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  position: relative;

  text-overflow: ellipsis;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 20, 60, 0.4);
}

/* ==================== 分组标题行（仿 layout-sample m-silder-p：深蓝圆角按钮，选中亮蓝箭头按钮） ==================== */
.group-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1px;
  box-sizing: border-box;
  width: 200px;
  height: 54px;
  margin: 6px auto 2px;
  cursor: pointer;
  transition: filter 0.2s;

  .node-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;

    background-size: 100% 100%;
    padding: 13px 40px 13px 10px;
    min-width: 130px;
  }

  &:hover {
    filter: brightness(1.2);
  }

  // 选中（或后代选中）时：切换为高亮箭头按钮背景图
  &.is-active {
    .node-title {
      background-image:
        url('@/assets/img/layout/menu/vertical_tree/tree_menu_title_con.png'),
        url('@/assets/img/layout/menu/vertical_tree/tree_menu_title_right.png');
      background-repeat: no-repeat;
      background-position:
        left bottom,
        right bottom;
      /* 图2 宽度拉伸、高度固定为原始 28px（auto 会按宽高比等比放大导致垂直拉伸） */
      background-size:
        calc(100% - 30px) 100%,
        30px 100%;
    }
  }
}

/* ==================== 叶子行（仿 layout-sample m-silder-c：渐变蓝条，选中亮蓝条） ==================== */
.leaf-row {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 20px;
  //justify-content: center;
  box-sizing: border-box;
  height: 36px;
  margin: 3px auto 4px 23px;
  background: url('@/assets/img/layout/menu/vertical_tree/silder_c.png') no-repeat;
  background-size: 100% 100%;
  font-size: 14px;
  cursor: pointer;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.2);
  }

  // 选中：切换为高亮渐变条背景图
  &.is-active {
    background-image: url('@/assets/img/layout/menu/vertical_tree/silder_c_active.png');

    .node-title {
      font-weight: 600;
    }
  }
}

/* ==================== 子菜单容器（缩进 + 左侧层级引导竖线） ==================== */
.sub-menu {
  position: relative;
  box-sizing: border-box;
  padding: 2px 0 4px 12px;
  margin-top: 6px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;

  // 通体半透明竖线（层级引导线，仿 sample 菜单左侧连接线）
  &::before {
    content: '';
    position: absolute;
    top: 0px;
    left: 20px;
    width: 5px;
    height: 100%;
    background: url('@/assets/img/layout/menu/vertical_tree/left_shu_tiao.png');
    background-repeat: repeat-y;
  }
}
</style>
