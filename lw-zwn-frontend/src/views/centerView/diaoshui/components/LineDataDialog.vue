<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { queryDsMaxTime } from '@/api/waterdisp'
import RightDailyPanel from './RightDailyPanel.vue'
import StationDetailDialog from './StationDetailDialog.vue'

/**
 * 线路数据弹窗（调水一张图）
 *
 * 由原「右侧日尺度数据面板」改造而来，解决两级信息叠加问题：
 *   - 视图1「日尺度数据」：线路下各分组断面表，点击行进入视图2
 *   - 视图2「站点详情」：inline 模式复用 StationDetailDialog（不再自开弹窗）
 * 两个视图放在同一个 dialog 内，通过 translateX 横向滑动切换（非弹窗堆叠，互不遮挡）。
 *
 * 标题栏（2026-09-15 调整）：原分散在子面板里的信息统一上移到顶栏，居中展示——
 *   - 视图1：线路名称 + 查询日期选择器（日期状态由本组件持有，原在 RightDailyPanel 内）
 *   - 视图2：站点标题「xxx详情信息」
 */
const show = defineModel<boolean>('show', { default: false })

interface Props {
  lineCd?: string
  lineNm?: string
}

// 默认值直接作用于 props；模板按名字访问 lineCd/lineNm，脚本内无需再引用 props
withDefaults(defineProps<Props>(), {
  lineCd: '',
  lineNm: ''
})

type Row = Record<string, any>
type Pane = 'data' | 'detail'
const pane = ref<Pane>('data')

// 视图2 所需的上下文（由视图1 行点击带入）
const activeRow = ref<Row | null>(null)
const activeGroupNm = ref('')

// ==================== 查询日期 ====================
function todayStr() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

const wtTime = ref(todayStr())

/** 默认取库中最新有数据日期（GWAPP.APP_DAY_W_R 全表 MAX(DT)，不按流域过滤），失败退回当天 */
async function initWtTime() {
  try {
    const res: any = await queryDsMaxTime()
    const t = res?.code === 0 && res.data ? String(res.data).substring(0, 10) : ''
    if (t) {
      wtTime.value = t
    }
  } catch (e) {
    console.warn('queryDsMaxTime failed', e)
  }
}
initWtTime()

function onRowClick(payload: { row: Row; groupNm: string }) {
  activeRow.value = payload.row
  activeGroupNm.value = payload.groupNm
  pane.value = 'detail'
}

/** 返回视图1（滑动切回列表） */
function backToData() {
  pane.value = 'data'
}

/** 详情态标题：站点名 + 详情信息（与 StationDetailDialog 原头部文案一致） */
const detailTitle = computed(() =>
  activeRow.value?.STNM ? `${activeRow.value.STNM}详情信息` : '站点详情'
)

// 每次打开都回到列表视图；关闭时清理视图2 上下文，避免下次打开闪现上次的站点
watch(show, (v) => {
  if (v) {
    pane.value = 'data'
  } else {
    activeRow.value = null
    activeGroupNm.value = ''
  }
})
</script>

<template>
  <n-modal v-model:show="show" :auto-focus="false">
    <div class="ldd">
      <!-- 标题栏：左「返回」（仅详情态）/ 中标题 / 右「日期选择器 + 关闭」。
           三列网格 1fr-auto-1fr，中间列两侧等宽，故标题天然整行居中。
           视图1 的查询日期选择器放在右侧、与线路名称分开；视图2 右侧仅关闭 -->
      <div class="ldd-bar">
        <div class="ldd-bar-left">
          <n-button v-if="pane === 'detail'" size="small" secondary @click="backToData">
            ← 返回
          </n-button>
        </div>

        <div class="ldd-bar-center">
          <span class="ldd-title">{{ pane === 'detail' ? detailTitle : lineNm }}</span>
        </div>

        <div class="ldd-bar-right">
          <n-date-picker
            v-if="pane === 'data'"
            v-model:formatted-value="wtTime"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            :clearable="false"
            style="width: 140px"
          />
          <span class="ldd-close" title="关闭" @click="show = false">✕</span>
        </div>
      </div>

      <!-- 滑动视口：轨道宽 200%，详情态左移一半 -->
      <div class="ldd-viewport">
        <div class="ldd-track" :class="{ 'is-detail': pane === 'detail' }">
          <!-- 视图1：日尺度数据（行点击上报，由本弹窗切换到视图2） -->
          <section class="ldd-pane">
            <RightDailyPanel
              :line-cd="lineCd"
              :line-nm="lineNm"
              :wt-time="wtTime"
              suppress-detail
              @row-click="onRowClick"
            />
          </section>

          <!-- 视图2：站点详情（inline 复用，同弹窗内滑动到达） -->
          <section class="ldd-pane">
            <StationDetailDialog
              inline
              :row="activeRow"
              :wt-time="wtTime"
              :line-cd="lineCd"
              :line-nm="lineNm"
              :group-nm="activeGroupNm"
              @close="show = false"
            />
          </section>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style scoped lang="scss">
.ldd {
  width: 1240px;
  max-width: 96vw;
  height: 90vh;
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

/* 标题栏：三列网格，中间列两侧各 1fr 等宽 → 标题整行居中 */
.ldd-bar {
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef1f6;
}

.ldd-bar-left {
  justify-self: start;
  min-width: 0;
}

.ldd-bar-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.ldd-bar-center {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.ldd-title {
  font-size: 16px;
  font-weight: 700;
  color: #163d90;
}

.ldd-close {
  font-size: 18px;
  color: #8a94a6;
  cursor: pointer;
  line-height: 1;
  padding: 4px;

  &:hover {
    color: #333;
  }
}

.ldd-viewport {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 轨道：两个视图各占一半宽度，切换时整体左移 */
.ldd-track {
  display: flex;
  width: 200%;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-detail {
    transform: translateX(-50%);
  }
}

.ldd-pane {
  width: 50%;
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 两个子面板自身已是 height:100%（.right-daily / .sdd-inline），
     这里只放开 min-height，避免弹性布局下被内容压缩导致内部滚动失效 */
  :deep(.right-daily),
  :deep(.sdd-inline) {
    min-height: 0;
  }
}
</style>
