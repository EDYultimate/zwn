<script setup lang="ts">
// ============================================================
// 日报查询弹框（与知识库日报面板的「历史日报查询」弹框内容一致）
// 年份页签 + 月份筛选 + 归档列表，支持下载归档日报
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { DR_DATA, DR_MON, RPT_DAY_ARCH } from '@/views/knowledge/QA/reportData'

const visible = ref(false)
const year = ref('2025')
const month = ref('')

const HIST_YEARS = ['2022', '2023', '2024', '2025', '2026']

const allItems = computed(() => RPT_DAY_ARCH[year.value] ?? [])
const items = computed(() =>
  allItems.value.filter((it) => !month.value || it[0].slice(5, 7) === month.value)
)

/** 数值格式化：千分位、最多两位小数 */
function n(v: number | null | undefined): string {
  if (v === null || v === undefined) {
    return '—'
  }
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

/** 下载归档日报（演示：按归档日期生成 TXT） */
function downloadArch(it: [string, number]) {
  const text =
    '\uFEFF' +
    [
      `漳卫南局重点取水口取水日报（${it[0]}）`,
      `（第${it[1]}期）`,
      '水资源管理与保护处编制',
      '',
      '一、取水基本情况（单位：万m³）',
      '序号\t取水口名称\t当日取水量\t月计划\t月累计\t年度许可\t年度累计\t监管单位',
      ...DR_DATA.map((x, i) =>
        [
          i + 1,
          x.name,
          x.day === null ? '未上报' : n(x.day),
          n(x.plan),
          x.mon === null ? '—' : n(x.mon),
          n(x.year),
          x.ytot === null ? '—' : n(x.ytot),
          x.org
        ].join('\t')
      ),
      '',
      '二、水资源监控运行情况',
      '序号\t取水口名称\t计量、视频情况\t整改进展情况\t监管单位\t备注',
      ...DR_MON.map((x, i) => [i + 1, x.name, x.st, x.prog, x.org, x.note].join('\t'))
    ].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  a.download = `漳卫南局重点取水口取水日报（${it[0]}）.doc`
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

/** 打开弹框：默认 2025 年、全部月份 */
function show() {
  year.value = '2025'
  month.value = ''
  visible.value = true
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="日报查询"
    table-theme="light"
    content-mode="fill"
    default-padding="14px 26px 6px"
    :style-params="{ width: '680px' }"
  >
    <!-- 年份页签 -->
    <div class="qry-tabs">
      <div
        v-for="y in HIST_YEARS"
        :key="y"
        class="qry-tab"
        :class="{ on: year === y }"
        @click="year = y"
      >
        {{ y }}年
      </div>
    </div>

    <!-- 月份筛选 -->
    <div class="qry-filter">
      <span>筛选条件</span>
      <select v-model="month">
        <option value="">全部月份</option>
        <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ m }}月</option>
      </select>
      <span class="cnt">共 {{ items.length }} 份 / 归档 {{ allItems.length }} 份</span>
    </div>

    <!-- 归档列表 -->
    <div class="qry-list">
      <div v-if="!items.length" class="qry-empty">该筛选条件下暂无归档日报</div>
      <div v-for="(it, i) in items" :key="it[0]" class="qry-item">
        <span class="no">{{ i + 1 }}.</span>
        <span class="nm">漳卫南局重点取水口取水日报（{{ it[0] }}）.doc</span>
        <button class="dl" type="button" @click="downloadArch(it)">下载</button>
      </div>
    </div>
  </pro-modal>
</template>

<style scoped lang="scss">
/* ===== 历史查询（年份页签 / 筛选 / 列表） ===== */
.qry-tabs {
  display: flex;
  gap: 28px;
  margin-top: 4px;
  border-bottom: 1px solid #e3edf9;
}

.qry-tab {
  position: relative;
  padding: 4px 2px 10px;
  font-size: 14.5px;
  color: #5a7ba6;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #1f7ae0;
  }

  &.on {
    font-weight: 600;
    color: #1f7ae0;

    &::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 2px;
      content: '';
      background: linear-gradient(90deg, #3f97f2, #1f6fd6);
    }
  }
}

.qry-filter {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0 4px;
  font-size: 13px;
  color: #5a7ba6;

  select {
    height: 30px;
    padding: 0 8px;
    font-family: inherit;
    font-size: 13px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
  }

  .cnt {
    margin-left: auto;
    color: #8aa3c4;
  }
}

.qry-list {
  max-height: 320px;
  overflow-y: auto;
}

.qry-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  font-size: 13px;
  color: #2a3f5c;
  border-bottom: 1px dashed #e8f0f9;

  &:hover {
    background: #f7fbff;
  }

  .no {
    flex: none;
    width: 22px;
    color: #8aa3c4;
    text-align: right;
  }

  .nm {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dl {
    flex: none;
    padding: 0;
    font-family: inherit;
    font-size: 13px;
    color: #1f7ae0;
    cursor: pointer;
    background: none;
    border: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.qry-empty {
  padding: 34px 0;
  font-size: 13.5px;
  color: #8aa3c4;
  text-align: center;
}
</style>
