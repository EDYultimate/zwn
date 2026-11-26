<script setup lang="ts">
import { computed, useSlots, Comment, Fragment, Text } from 'vue'

interface Props {
  // 宽度
  width?: string
  // 高度，无参数时，默认自适应高度
  height?: string
  // 是否加载动画
  isLoading?: boolean
  // 是否插槽为空时 提示暂无数据
  isEmpty?: boolean
  // 容器背景色
  background?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '',
  isLoading: false,
  isEmpty: true,
  // 仿 layout-sample con-div（lh-dark）：半透明深蓝底，可通过 background prop 覆盖
  background: ''
})

const slots = useSlots()

// 判断单个 vnode 是否为"空"：注释节点、空文本、children 全为空的 Fragment 均视为空
function isEmptyVnode(vnode: any): boolean {
  if (vnode == null || vnode === false) {
    return true
  }
  if (vnode.type === Comment) {
    return true
  }
  if (vnode.type === Text) {
    return String(vnode.children ?? '').trim() === ''
  }
  if (vnode.type === Fragment) {
    const children = vnode.children || []
    return !Array.isArray(children) || children.every((c: any) => isEmptyVnode(c))
  }
  return false
}

// 判断 default slot 是否有实际内容
// - 过滤 v-if=false 产生的注释节点
// - 处理 v-for 为空列表时产生的空 Fragment
const hasContent = computed(() => {
  // 如果 isEmpty 为 false，则直接返回 true
  if (!props.isEmpty) {
    return true
  }

  if (!slots.default) {
    return false
  }
  return slots.default().some((vnode) => !isEmptyVnode(vnode))
})
</script>

<template>
  <div
    class="content-div"
    :style="{ width: props.width, height: props.height, background: props.background }"
  >
    <n-spin :show="props.isLoading">
      <slot v-if="hasContent" />
      <div v-else>
        <n-empty description="暂无数据"></n-empty>
      </div>
    </n-spin>
  </div>
</template>

<style scoped lang="scss">
/* 仿 layout-sample .con-div（lh-dark 主题）：半透明深蓝底 + 1px 淡蓝边框 + 30px 内发光，直角无圆角 */
.content-div {
  display: inline-block;
  padding: 10px;
  position: relative;
  box-sizing: border-box;
  background: rgba(17, 40, 114, 0.6); /* 默认背景色，可通过 background prop 覆盖（内联样式优先） */
  border: 1px solid rgba(98, 176, 255, 0.4);
  box-shadow: 0 0 30px 30px rgba(54, 99, 161, 0.2) inset;

  ///* 顶边高亮标记（仿 .m_container_border_top 的 mark_1/2/3：左 20px、左 25px 起 10px、右 10px，#00c0ff） */
  //&::before {
  //  content: '';
  //  position: absolute;
  //  top: -1px;
  //  left: 0;
  //  width: 100%;
  //  height: 2px;
  //  pointer-events: none;
  //  background: linear-gradient(
  //    90deg,
  //    #00c0ff 0 20px,
  //    transparent 20px 25px,
  //    #00c0ff 25px 35px,
  //    transparent 35px calc(100% - 10px),
  //    #00c0ff calc(100% - 10px) 100%
  //  );
  //}
  //
  ///* 底边高亮标记（仿 .m_container_border_bottom 的 mark_4/5/6：左 10px、右 35px 起 10px、右 20px，#00c0ff） */
  //&::after {
  //  content: '';
  //  position: absolute;
  //  bottom: -1px;
  //  left: 0;
  //  width: 100%;
  //  height: 2px;
  //  pointer-events: none;
  //  background: linear-gradient(
  //    90deg,
  //    #00c0ff 0 10px,
  //    transparent 10px calc(100% - 35px),
  //    #00c0ff calc(100% - 35px) calc(100% - 25px),
  //    transparent calc(100% - 25px) calc(100% - 20px),
  //    #00c0ff calc(100% - 20px) 100%
  //  );
  //}

  /* 内容区上浮到标记之上，确保按钮可点 */
  > * {
    position: relative;
    z-index: 2;
  }
}
</style>
