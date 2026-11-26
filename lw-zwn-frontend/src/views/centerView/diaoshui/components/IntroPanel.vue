<script setup lang="ts">
import type { BasinIntro } from './basinIntro'

interface Props {
  // 流域简介数据（旧项目迁移的静态内容）；无则显示空提示
  data?: BasinIntro | null
  // 线路名称
  lineNm?: string
}

withDefaults(defineProps<Props>(), {
  data: null,
  lineNm: ''
})
</script>

<template>
  <div class="intro-panel">
    <template v-if="data">
      <div class="intro-card">
        <p class="intro-text">{{ data.intro }}</p>
      </div>
      <div v-for="(tb, i) in data.tables" :key="i" class="intro-card">
        <div class="table-head">
          <div class="table-title">{{ tb.title }}</div>
          <div v-if="tb.unit" class="table-unit">{{ tb.unit }}</div>
        </div>
        <n-table :bordered="true" :single-line="false" size="small">
          <thead>
            <tr>
              <th v-for="h in tb.headers" :key="h">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in tb.rows" :key="ri">
              <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
            </tr>
          </tbody>
        </n-table>
        <div v-if="tb.note" class="table-note">{{ tb.note }}</div>
      </div>
    </template>
    <div v-else class="intro-empty">暂无{{ lineNm }}流域简介</div>
  </div>
</template>

<style scoped lang="scss">
.intro-panel {
  width: 100%;
}

.intro-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 12px;
  background: #fff;
}

.intro-text {
  font-size: 13px;
  color: #444;
  line-height: 1.8;
  text-indent: 2em;
  margin: 0;
  white-space: pre-line;
  word-break: break-all;
}

.table-head {
  margin-bottom: 8px;

  .table-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .table-unit {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
}

:deep(.n-table th) {
  font-size: 12px;
  color: #1756c2;
  font-weight: bold;
  text-align: center;
  padding: 5px 4px;
}

:deep(.n-table td) {
  font-size: 12px;
  text-align: center;
  padding: 5px 4px;
}

.table-note {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  margin-top: 6px;
}

.intro-empty {
  font-size: 13px;
  color: #999;
  padding: 12px 0;
  text-align: center;
}
</style>
