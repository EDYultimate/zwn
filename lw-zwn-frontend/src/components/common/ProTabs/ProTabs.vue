<script setup lang="ts" generic="K extends string">
// ============================================================
// 详情弹框页签切换（胶囊按钮组）
// 样式与功能统一取自 PlanCertModal 的「取水许可证信息 / 水量分析」切换
// 用法：
//   <pro-tabs v-model="tab" :items="tabs" />
//   <pro-tabs :model-value="cat" :items="tabs" @change="onChange" />
// badge 可选，用于页签右侧数量角标
// ============================================================

interface TabItem {
  key: K
  /** 不传则直接显示 key */
  label?: string
  badge?: string | number
}

const props = defineProps<{
  items: readonly TabItem[]
  modelValue: K
}>()

const emit = defineEmits<{
  'update:modelValue': [key: K]
  change: [key: K]
}>()

function select(item: TabItem) {
  if (item.key === props.modelValue) {
    return
  }
  emit('update:modelValue', item.key)
  emit('change', item.key)
}
</script>

<template>
  <div class="pro-tabs" role="tablist">
    <span
      v-for="item in items"
      :key="item.key"
      class="pro-tab"
      role="tab"
      :class="{ on: item.key === modelValue }"
      :aria-selected="item.key === modelValue"
      @click="select(item)"
    >
      <span class="txt">{{ item.label ?? item.key }}</span>
      <i v-if="item.badge !== undefined && item.badge !== ''" class="badge">{{ item.badge }}</i>
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

.pro-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pro-tab {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 18px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: lic.$c-text;
  letter-spacing: 1px;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 18px;
  transition:
    color 0.15s,
    background-color 0.15s,
    border-color 0.15s;

  &:hover {
    color: lic.$c-blue;
    border-color: lic.$c-blue-border;
  }

  &.on,
  &.on:hover {
    color: #fff;
    background-color: #418deb;
    border-color: transparent;
  }

  .badge {
    padding: 0 6px;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px;
    color: lic.$c-blue-deep;
    background: #e8f2fe;
    border-radius: 9px;
  }

  &.on .badge {
    color: #fff;
    background: rgba(255, 255, 255, 0.24);
  }
}
</style>
