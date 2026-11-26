<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 统计明细表弹窗（公共组件）
 *
 * 用途：页面上的统计数值点击后，弹窗内以表格**逐条展示与该统计相符的明细数据**
 *      （调用方负责传入/加载与该统计同一口径的行数据，保证「明细条数 = 统计值」）。
 *
 * 形态：固定宽高、标题整行居中、表格固定最大高度（**表头固定、内容区滚动**）、底部分页。
 *
 * 用法：
 * ```ts
 * const dlg = ref({ show: false, title: '', rows: [], loading: false })
 * async function openDetail() {
 *   dlg.value = { ...dlg.value, show: true, title: '超许可许可证明细', loading: true }
 *   const res = await getCertLibList({ isExLimit: true })
 *   dlg.value.rows = res.data || []
 *   dlg.value.loading = false
 * }
 * ```
 * ```html
 * <StatDetailDialog v-model:show="dlg.show" :title="dlg.title" :rows="dlg.rows"
 *                   :loading="dlg.loading" :columns="CERT_COLUMNS" />
 * ```
 */
const show = defineModel<boolean>('show', { default: false })

interface Props {
  /** 弹窗标题 */
  title?: string
  /** 表格列（可来自后端 columns：{title,key,width}） */
  columns?: any[]
  /** 明细行（条数应与被点击的统计值一致；预警类同证多行属正常） */
  rows?: Record<string, any>[]
  /** 加载中 */
  loading?: boolean
  /** 每页条数 */
  pageSize?: number
  /** 表格内容区最大高度（表头随之固定） */
  tableMaxHeight?: number
  /**
   * 计数文案覆盖（可选）。默认显示「共 {行数} 条」；
   * 行数与统计口径不一致时（如取水计划预警一个证占「计划/实际」两行）由调用方传入更准确的描述。
   */
  totalText?: string
  /**
   * 单位说明（可选，展示在右上角小字）。
   * 表格列很多时不方便在每列表头都写单位，改由这里统一说明一次；
   * 传入后请让列标题不再带单位（如「许可水量」而非「许可水量(万m³)」）。
   */
  unitText?: string
  /**
   * 序号列的行分组数（默认 1 = 一行一个序号）。
   * 取水计划预警一个证占「计划 / 实际」两行，传 2 时两行共用一个序号，
   * 序号列同样按 rowSpan 纵向合并，与基础信息列保持一致。
   */
  rowGroupSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '数据明细',
  columns: () => [],
  rows: () => [],
  loading: false,
  pageSize: 10,
  tableMaxHeight: 420,
  totalText: '',
  unitText: '',
  rowGroupSize: 1
})

/**
 * 弹窗宽度上限：列很多时不再无限加宽（过宽会挤占屏幕），
 * 超出部分交给表格横向滚动；配合前端给靠前列加 fixed:'left' 实现「基础信息不随滚动」。
 */
const MAX_WIDTH = 1280

/** 序号列 key（内部使用，不与后端字段冲突） */
const INDEX_KEY = '__rowIndex'

/**
 * 行 key：同一证可能有多条明细（如取水计划预警按月展开），用证号/ID 作 key 会重复导致渲染异常，
 * 故按行对象身份分配稳定唯一 id。
 */
const ridMap = new WeakMap<object, number>()
let ridSeq = 0
function rowKey(row: any) {
  if (row === null || typeof row !== 'object') {
    return String(row)
  }
  if (!ridMap.has(row)) {
    ridMap.set(row, ++ridSeq)
  }
  return ridMap.get(row) as number
}

const page = ref(1)

/**
 * 每页行数：按表格可用高度实测得出（见 measureTableHeight），
 * 目的是一屏放满真实数据——固定 pageSize 时行数不足一屏会在表格底部留下空白。
 * 未测得前回退到调用方传入的 pageSize。
 */
const autoPageSize = ref(0)
const pageSize = computed(() => autoPageSize.value || props.pageSize)

const pageCount = computed(() => Math.max(1, Math.ceil((props.rows?.length || 0) / pageSize.value)))

/** 前端分页（数据量有限，一次取全后在弹窗内分页） */
const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return (props.rows || []).slice(start, start + pageSize.value)
})

/**
 * 实际渲染的列 = 序号列 + 调用方传入的列。
 * 序号按全局行号（跨页连续）；rowGroupSize>1 时同组的若干行共用一个序号并纵向合并
 * （取水计划预警一个证占「计划/实际」两行，序号只出现一次）。
 */
const tableColumns = computed(() => {
  const g = Math.max(1, props.rowGroupSize)
  const offset = (page.value - 1) * pageSize.value
  const indexCol: Record<string, any> = {
    title: '序号',
    key: INDEX_KEY,
    width: 66,
    align: 'center',
    fixed: 'left'
  }
  if (g === 1) {
    indexCol.render = (_row: any, rowIndex: number) => String(offset + rowIndex + 1)
  } else {
    indexCol.rowSpan = (_row: any, rowIndex: number) => (rowIndex % g === 0 ? g : 0)
    indexCol.render = (_row: any, rowIndex: number) =>
      String(offset / g + Math.floor(rowIndex / g) + 1)
  }
  return [indexCol, ...props.columns]
})

/** 列宽合计：列宽由后端下发，合计后交给表格横向滚动，避免窄列被压缩 */
const columnTotalWidth = computed(() =>
  tableColumns.value.reduce((sum, c) => sum + (Number(c?.width) || 120), 0)
)

/**
 * 弹窗宽度：常规明细（约 8 列）保持 1080px；列多时加宽到刚好容纳，
 * 但不超过 MAX_WIDTH —— 再宽的部分由表格横向滚动承担（靠前列已固定）。
 */
const dialogWidth = computed(() => {
  const needed = columnTotalWidth.value + 80 // 左右内边距 + 余量
  return `min(${Math.max(needed, 1080)}px, ${MAX_WIDTH}px, 96vw)`
})

/**
 * 表格高度：不再用固定 max-height（会与弹窗实际留给表格的高度不一致，底部留白）。
 * 这里按容器实测高度扣掉「容器内边距 + 表头高度」后设置表体 max-height，
 * 弹窗尺寸变化时由 ResizeObserver 自动重算。
 */
const bodyRef = ref<HTMLElement | null>(null)
const tableMaxH = ref(props.tableMaxHeight)
let bodyObserver: ResizeObserver | null = null

function measureTableHeight() {
  const el = bodyRef.value
  if (!el) {
    return
  }
  // n-data-table 的 max-height 作用于表体，表头单独占高，需一并扣除，否则表格会溢出容器
  const head = el.querySelector('.n-data-table-base-table-header') as HTMLElement | null
  const headH = head ? head.getBoundingClientRect().height : 44
  const paddingTop = 10 // .sdd-body 的 padding-top
  const available = el.clientHeight - paddingTop - headH
  if (available <= 0) {
    return
  }
  tableMaxH.value = Math.max(120, available)

  // 顺带按可用高度算每页行数：一屏放满真实数据，避免行数不足时表格底部留白
  const tr = el.querySelector('.n-data-table-tbody .n-data-table-tr') as HTMLElement | null
  const rowH = tr ? tr.getBoundingClientRect().height : 47
  const group = Math.max(1, props.rowGroupSize)
  let n = Math.max(group, Math.floor(available / Math.max(24, rowH)))
  n = Math.max(group, Math.floor(n / group) * group) // 行组（如「计划/实际」两行）不被拆断
  // 每页至少 10 行（用户要求：明细弹窗 10 行/页；可用高度偏小时由表体内部滚动承担）
  n = Math.max(n, Math.max(group, Math.floor(10 / group) * group))
  autoPageSize.value = n
}

onMounted(() => {
  bodyObserver = new ResizeObserver(() => measureTableHeight())
  if (bodyRef.value) {
    bodyObserver.observe(bodyRef.value)
  }
  measureTableHeight()
})

onBeforeUnmount(() => {
  bodyObserver?.disconnect()
  bodyObserver = null
})

// 每次打开回到第 1 页；行数变化（换统计项）时也复位
watch(show, (v) => {
  if (v) {
    page.value = 1
    // 弹窗刚显示时容器尺寸才可测
    nextTick(() => measureTableHeight())
  }
})

// 数据/加载态变化后表头才真正渲染，重新量一次（否则首测取不到表头高度）
watch([() => props.rows, () => props.loading, () => props.columns], () =>
  nextTick(() => measureTableHeight())
)
watch(
  () => props.rows,
  () => {
    page.value = 1
  }
)
</script>

<template>
  <n-modal v-model:show="show" :auto-focus="false">
    <div class="sdd" :style="{ width: dialogWidth }">
      <!-- 标题栏：三列网格，标题整行居中 -->
      <div class="sdd-bar">
        <div class="sdd-bar-left" />
        <div class="sdd-bar-center">
          <span class="sdd-title">{{ title }}</span>
          <span class="sdd-count">{{ totalText || `共 ${rows.length} 条` }}</span>
        </div>
        <div class="sdd-bar-right">
          <span v-if="unitText" class="sdd-unit">{{ unitText }}</span>
          <span class="sdd-close" title="关闭" @click="show = false">✕</span>
        </div>
      </div>

      <!-- 表格：高度按容器实测设置（表头固定、内容区滚动），避免与弹窗预留高度不一致产生留白 -->
      <div ref="bodyRef" class="sdd-body">
        <n-data-table
          :columns="tableColumns"
          :data="pageRows"
          :loading="loading"
          size="small"
          :bordered="true"
          :single-line="false"
          :max-height="tableMaxH"
          :row-key="rowKey"
          :scroll-x="columnTotalWidth"
        >
          <template #empty>
            <n-empty description="暂无明细数据" size="small" />
          </template>
        </n-data-table>
      </div>

      <!-- 分页 -->
      <div class="sdd-foot">
        <n-pagination
          v-model:page="page"
          :page-count="pageCount"
          :page-size="pageSize"
          :page-slot="7"
        />
      </div>
    </div>
  </n-modal>
</template>

<style scoped lang="scss">
.sdd {
  /* 宽度由 dialogWidth 按列宽自适应注入（常规 1080px，透视类可加宽到 96vw） */
  max-width: 96vw;
  height: 640px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  padding: 14px 20px 16px;
  box-shadow: 0 8px 40px rgba(30, 60, 120, 0.25);
  font-family: 'Source Han Sans CN', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
}

.sdd-bar {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef1f6;
}

.sdd-bar-left {
  justify-self: start;
}

.sdd-bar-center {
  display: flex;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
}

.sdd-title {
  font-size: 16px;
  font-weight: 700;
  color: #163d90;
}

.sdd-count {
  font-size: 12px;
  color: #8a94a6;
}

.sdd-bar-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 单位说明：右上角小字（列多时不在每列表头重复写单位） */
.sdd-unit {
  font-size: 12px;
  color: #8a94a6;
}

.sdd-close {
  font-size: 18px;
  color: #8a94a6;
  cursor: pointer;
  line-height: 1;
  padding: 4px;

  &:hover {
    color: #333;
  }
}

/* 表格区占满剩余高度；max-height 交给 n-data-table，表头自动固定 */
.sdd-body {
  flex: 1;
  min-height: 0;
  padding: 10px 0 0;
}

.sdd-foot {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #eef1f6;
}
</style>
