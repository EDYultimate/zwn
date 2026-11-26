<script setup lang="ts">
// 折线图 / 表格 切换按钮（chart=折线图，table=表格；0=未选中，1=选中）
import chart0 from '@/assets/img/diaoshui/chart0.png'
import chart1 from '@/assets/img/diaoshui/chart1.png'
import table0 from '@/assets/img/diaoshui/table0.png'
import table1 from '@/assets/img/diaoshui/table1.png'

const mode = defineModel<'chart' | 'table'>({ default: 'chart' })
</script>

<template>
  <div class="ct-toggle">
    <div
      class="ct-btn"
      :class="{ active: mode === 'chart' }"
      title="折线图"
      @click="mode = 'chart'"
    >
      <img :src="mode === 'chart' ? chart1 : chart0" alt="折线图" />
    </div>
    <div class="ct-btn" :class="{ active: mode === 'table' }" title="表格" @click="mode = 'table'">
      <img :src="mode === 'table' ? table1 : table0" alt="表格" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ct-toggle {
  display: inline-flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
  flex-shrink: 0;
}

.ct-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  transition: background-color 0.15s;

  & + .ct-btn {
    border-left: 1px solid #dcdfe6;
  }

  &:hover {
    background: #eef2f8;
  }

  &.active {
    background: #e2edff;
  }

  img {
    width: 16px;
    height: 16px;
    display: block;
  }
}
</style>
