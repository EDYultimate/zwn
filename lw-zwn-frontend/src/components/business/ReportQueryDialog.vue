<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { listReportFiles, type ReportFileItem } from '@/api/waterdisp'

/**
 * 月报查询弹窗（公共组件）
 *
 * 数据源：HWWR.ST_MEDIA_B（与文件管理/月批复附件同一张表）
 * 归档约定：
 *   DOC_TP   模块大类（调水='DS'），由 docTp 传入
 *   LINE_CD  线路，由 lineCd 传入（不传=不限线路）
 *   FILE_CAT 报告周期类型：XB=旬报 / YB=月报 / JB=季报（历史数据该列为空，此时按文件名推断）
 *   YEAR     年份；MON 期内序号（旬 1-36 / 月 1-12 / 季 1-4）
 *
 * 报告识别：FILE_CAT 显式标记，或名称含「月报/旬报/季报」（历史数据兜底）；
 *           其余公文（如"水量调度计划的通知""调度方案的通知"）不会出现在本弹窗。
 *
 * 布局：标题整行居中 → 年份 tab（大年份在左）→ 该年报告列表（周期由小到大：旬报→月报→季报，
 *       同周期按期内序号升序），每行左侧周期标签 + 报告名（过长省略），右侧「预览 / 下载」。
 * 点击报告名等同于预览。
 *
 * 用法：<ReportQueryDialog v-model:show="show" doc-tp="DS" :line-cd="lineCd" />
 */
const show = defineModel<boolean>('show', { default: false })

interface Props {
  /** 弹窗标题 */
  title?: string
  /** 模块大类，对应 ST_MEDIA_B.DOC_TP（调水传 'DS'） */
  docTp?: string
  /** 线路编码，不传=不限线路 */
  lineCd?: string
  /**
   * 自定义数据源：不传则用 listReportFiles（ST_MEDIA_B 报告类过滤，DOC_TP + 线路）。
   * 传入时由调用方自行取数并归一到 ReportFileItem——用于报告归档约定不同的模块
   * （如河湖补水月报 DOC_TP='HBS' / FILE_CAT='ECO'，不在 XB/YB/JB 报告类之内）。
   * 预览/下载仍共用 media 接口（getFile 按 FILE_CD 查询，不限定 DOC_TP）。
   */
  loader?: () => Promise<ReportFileItem[]>
}

const props = withDefaults(defineProps<Props>(), {
  title: '月报查询',
  docTp: 'DS',
  lineCd: ''
})

const loading = ref(false)
const files = ref<ReportFileItem[]>([])
const activeYear = ref('')

// 周期类型 → 排序权重 / 中文标签（周期由小到大：旬报 → 月报 → 季报）
const CAT_WEIGHT: Record<string, number> = { XB: 1, YB: 2, JB: 3 }
const CAT_LABEL: Record<string, string> = { XB: '旬报', YB: '月报', JB: '季报' }

/** 报告周期类型：优先 FILE_CAT 显式标记；历史数据该列为空，则按名称推断（含"旬报/季报"否则按月报） */
function catKeyOf(item: ReportFileItem) {
  const c = (item.fileCat || '').toUpperCase()
  if (c) {
    return c
  }
  const n = item.name || ''
  if (n.includes('旬报')) {
    return 'XB'
  }
  if (n.includes('季报')) {
    return 'JB'
  }
  return 'YB'
}

const catWeight = (item: ReportFileItem) => CAT_WEIGHT[catKeyOf(item)] ?? 2
const catLabel = (item: ReportFileItem) => CAT_LABEL[catKeyOf(item)] ?? '月报'

/** 年份 tab：去重后倒序，大年份在左 */
const years = computed(() => {
  const set = new Set<string>()
  files.value.forEach((f) => {
    if (f.year) {
      set.add(String(f.year))
    }
  })
  return Array.from(set).sort((a, b) => Number(b) - Number(a))
})

/** 当前年份的报告：周期权重升序 → 期内序号升序（均为「小到大」） */
const currentList = computed(() =>
  files.value
    .filter((f) => String(f.year) === activeYear.value)
    .slice()
    .sort((a, b) => {
      const w = catWeight(a) - catWeight(b)
      return w !== 0 ? w : (Number(a.mn) || 0) - (Number(b.mn) || 0)
    })
)

async function load() {
  loading.value = true
  try {
    const list = props.loader
      ? await props.loader()
      : (await listReportFiles({ docTp: props.docTp, lineCd: props.lineCd })).data
    files.value = Array.isArray(list) ? list : []
    // 默认选中最新年份；原选中年份已无数据时回落到最新
    if (!years.value.includes(activeYear.value)) {
      activeYear.value = years.value[0] || ''
    }
  } catch (e) {
    console.warn('listReportFiles failed', e)
    files.value = []
  } finally {
    loading.value = false
  }
}

// 打开时拉取；线路变化且弹窗开着时也刷新
watch(show, (v) => {
  if (v) {
    load()
  }
})
watch(
  () => props.lineCd,
  () => {
    if (show.value) {
      load()
    }
  }
)
// 换数据源（loader）时若弹窗开着，重新拉取
watch(
  () => props.loader,
  () => {
    if (show.value) {
      load()
    }
  }
)

// ==================== 预览 / 下载（复用调水文件接口；仅 pdf 支持预览） ====================
function previewUrl(fileCd: string) {
  return `/api/waterdisp/media/preview?fileCd=${encodeURIComponent(fileCd)}`
}
function downloadUrl(fileCd: string) {
  return `/api/waterdisp/media/download?fileCd=${encodeURIComponent(fileCd)}`
}

function canPreview(item: ReportFileItem) {
  return (item.fileExt || '').toLowerCase() === 'pdf'
}

function onPreview(item: ReportFileItem) {
  if (!canPreview(item)) {
    window.$message?.info('该文件类型不支持预览，请下载后查看')
    return
  }
  window.open(previewUrl(item.fileCd), '_blank')
}

/** 下载：用临时 <a> 触发，避免像 window.location.href 那样在 404 时把整个页面导航走 */
function onDownload(item: ReportFileItem) {
  const a = document.createElement('a')
  a.href = downloadUrl(item.fileCd)
  a.download = item.fileName || item.name || ''
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<template>
  <n-modal v-model:show="show" :auto-focus="false">
    <div class="rq">
      <!-- 标题栏：三列网格 1fr-auto-1fr，中间标题整行居中 -->
      <div class="rq-bar">
        <div class="rq-bar-left" />
        <div class="rq-bar-center">
          <span class="rq-title">{{ title }}</span>
        </div>
        <div class="rq-bar-right">
          <span class="rq-close" title="关闭" @click="show = false">✕</span>
        </div>
      </div>

      <!-- 年份 tab：大年份在左 -->
      <div v-if="years.length" class="rq-years">
        <button
          v-for="y in years"
          :key="y"
          class="rq-year"
          :class="{ 'is-active': y === activeYear }"
          @click="activeYear = y"
        >
          {{ y }}年
        </button>
      </div>

      <!-- 报告列表 -->
      <n-spin :show="loading" class="rq-spin">
        <div class="rq-list">
          <n-empty v-if="currentList.length === 0" size="small" description="暂无可下载的报告" />
          <div v-for="item in currentList" :key="item.fileCd" class="rq-item">
            <span class="rq-cat">{{ catLabel(item) }}</span>
            <span class="rq-name" :title="item.name" @click="onPreview(item)">
              {{ item.name }}
            </span>
            <span class="rq-actions">
              <n-button size="tiny" secondary @click="onPreview(item)">预览</n-button>
              <n-button size="tiny" type="primary" @click="onDownload(item)">下载</n-button>
            </span>
          </div>
        </div>
      </n-spin>
    </div>
  </n-modal>
</template>

<style scoped lang="scss">
.rq {
  width: 760px;
  max-width: 94vw;
  max-height: 76vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  padding: 14px 20px 18px;
  box-shadow: 0 8px 40px rgba(30, 60, 120, 0.25);
  font-family: 'Source Han Sans CN', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
}

/* 标题栏 */
.rq-bar {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef1f6;
}

.rq-bar-left {
  justify-self: start;
}

.rq-bar-center {
  white-space: nowrap;
}

.rq-title {
  font-size: 16px;
  font-weight: 700;
  color: #163d90;
}

.rq-bar-right {
  justify-self: end;
}

.rq-close {
  font-size: 18px;
  color: #8a94a6;
  cursor: pointer;
  line-height: 1;
  padding: 4px;

  &:hover {
    color: #333;
  }
}

/* 年份 tab */
.rq-years {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0 10px;
}

.rq-year {
  height: 28px;
  padding: 0 14px;
  border: 1px solid rgba(77, 140, 220, 0.45);
  border-radius: 14px;
  background: #f5f9ff;
  color: #0f378c;
  font-size: 13px;
  cursor: pointer;
  transition:
    background-color 0.18s,
    border-color 0.18s,
    color 0.18s;

  &:hover {
    border-color: #1766db;
  }

  &.is-active {
    background: #1766db;
    border-color: #1766db;
    color: #fff;
    font-weight: 600;
  }
}

/* 报告列表 */
.rq-spin {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

:deep(.n-spin-container),
:deep(.n-spin-content) {
  min-height: 100%;
}

.rq-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 0;
}

.rq-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e8eef7;
  border-radius: 6px;
  background: #fafcff;
  transition: background-color 0.18s;

  &:hover {
    background: #f0f7ff;
  }
}

/* 周期标签：旬报 / 月报 / 季报 */
.rq-cat {
  flex-shrink: 0;
  min-width: 40px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(23, 102, 219, 0.1);
  color: #1766db;
  font-size: 12px;
  text-align: center;
}

/* 报告名：过长省略 */
.rq-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #1f2f4a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: #1766db;
    text-decoration: underline;
  }
}

.rq-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
