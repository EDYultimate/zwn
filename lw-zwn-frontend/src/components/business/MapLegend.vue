<script lang="ts">
// 通用图例项定义（导出供外部组件引用类型）
export interface LegendItem {
  /** 图例名称 */
  label: string
  /** 图例颜色（未配置 icon 时显示色块） */
  color?: string
  /** 图标地址（URL / data URI，配置后显示图标代替色块） */
  icon?: string
  /** 关联的地图图层名（勾选后随 legend-change 事件传出，供父组件控制地图） */
  layer?: string
  /** 初始是否勾选，默认 false */
  checked?: boolean
  /** 是否可交互（显示多选框联动地图），默认 true；false 时仅作纯展示 */
  interactive?: boolean
}
</script>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 图例项：名称、颜色、关联图层、是否可交互均由外部传入 */
    items: LegendItem[]
    /** 面板标题 */
    title?: string
    /** 距视口右侧偏移（右侧面板出现时可向左避让） */
    right?: string
    /** 距视口底部偏移 */
    bottom?: string
  }>(),
  {
    items: () => [],
    title: '图层/图例',
    right: '30px',
    bottom: '25px'
  }
)

const emit = defineEmits<{
  /**
   * 勾选状态变化
   * @param layers 当前勾选项对应的图层名数组（未配置 layer 的项被过滤）
   * @param checkedItems 当前勾选的完整图例项数组
   */
  (e: 'legendChange', layers: string[], checkedItems: LegendItem[]): void
  /** 单项勾选/取消（item 为原始图例项，checked 为最新状态） */
  (e: 'change', item: LegendItem, checked: boolean): void
}>()

// 内部维护勾选状态（拷贝外部数据，避免直接改动父组件状态）
const innerItems = reactive<LegendItem[]>(
  props.items.map((it) => ({ ...it, checked: !!it.checked }))
)

// 外部 items 变化时重新同步（勾选状态按外部定义重置）
watch(
  () => props.items,
  (val) => {
    innerItems.splice(0, innerItems.length, ...val.map((it) => ({ ...it, checked: !!it.checked })))
  },
  { deep: true }
)

function handleLegendChange(item: LegendItem) {
  emit('change', item, !!item.checked)
  const checkedItems = innerItems.filter((i) => i.checked)
  emit(
    'legendChange',
    checkedItems.map((i) => i.layer).filter((l): l is string => !!l),
    checkedItems
  )
}
</script>

<template>
  <div class="legend-container" :style="{ right, bottom }">
    <template v-if="title">
      <div class="legend-title">{{ title }}</div>
      <div class="divider"></div>
    </template>
    <div class="legend-section">
      <div v-for="item in innerItems" :key="item.label" class="legend-item">
        <label :class="{ 'legend-label--static': item.interactive === false }">
          <input
            v-if="item.interactive !== false"
            v-model="item.checked"
            type="checkbox"
            @change="handleLegendChange(item)"
          />
          <img v-if="item.icon" :src="item.icon" alt="" class="legend-icon" />
          <span v-else class="color-box" :style="{ backgroundColor: item.color }"></span>
          {{ item.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ==================== 系统面板风格（对齐 DivBackIn：浅色底 + 渐变描边 + 蓝色光晕） ==================== */
.legend-container {
  position: fixed;
  bottom: 30px;
  min-width: 130px;
  padding: 10px 14px;
  background: #f5f7facc;
  border-radius: 13px;
  box-shadow: 0px 0px 10px 2px rgba(41, 107, 175, 0.28);
  z-index: 10;
  box-sizing: border-box;
  overflow: hidden; /* 让伪元素渐变层被圆角裁剪 */
  transition: right 0.3s ease;

  /* 渐变边框：用伪元素叠加实现，规避 border-image 与 border-radius 互斥（同 DivBackIn） */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 3px;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(211, 233, 255, 1), rgba(255, 255, 255, 0));
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; /* 镂空内部，只保留边框区域 */
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
  }

  /* 内容区上浮到伪元素之上 */
  > * {
    position: relative;
    z-index: 2;
  }
}

.legend-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f378c;
  //padding-bottom: 6px;
  margin-bottom: 0;
}

.legend-section {
  margin: 8px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 6px 0;
  font-size: 13px;
  color: #3c3f46;
  white-space: nowrap;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  /* 勾选/悬停反馈 */
  label:hover {
    color: #0f378c;
  }
}

/* 图标（URL / data URI，代替色块展示） */
.legend-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 3px; /* 与色块同款圆角，保持视觉一致 */
}

/* 纯展示项（interactive=false）：无多选框，去掉手型 */
.legend-label--static {
  cursor: default !important;
}

/* 颜色标签：统一方块样式（两页面一致） */
.color-box {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08); /* 浅底上浅色块加描边保证可见 */
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.5), rgba(24, 144, 255, 0));
  margin: 6px 0 8px;
}

input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border: 1px solid #c2d7f5;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
  margin-right: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: #4db6ff;
  }

  &:checked {
    background: #1e79ff;
    border-color: #1e79ff;
  }

  &:checked::before {
    content: '✓';
    position: absolute;
    left: 2px;
    top: -1px;
    color: #fff;
    font-size: 12px;
  }
}
</style>
