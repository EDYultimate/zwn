<script setup lang="ts">
interface Props {
  // 标题文本
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: ''
})
</script>

<template>
  <div class="panel-title">
    <span class="panel-title-text">{{ title }}</span>
    <span v-if="$slots.extra" class="panel-title-extra"><slot name="extra" /></span>
  </div>
</template>

<style scoped lang="scss">
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0 2px 8px;
  margin-bottom: 6px;
  border-left: 3px solid #1766db;
}

.panel-title-text {
  font-size: 15px;
  font-weight: 700;
  color: #333;
}

.panel-title-extra {
  font-size: 12px;
  color: #666;
}
</style>
