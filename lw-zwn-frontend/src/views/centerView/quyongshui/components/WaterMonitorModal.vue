<script setup lang="ts">
import { ref } from 'vue'
import { waterMonitorInfo } from '@/api/quyongshui'
import LicenseDetailModal from './LicenseDetailModal.vue'

/**
 * 取水量监测信息弹窗（取用水一张图 · 地图框选联动）
 *
 * 打开时按地图框选命中的证书号列表（certCodes，可附带 stcds 设施编码兜底映射）
 * + 日期区间（默认结束=今天、开始=30天前）查询取水证基础信息、区间累计取水量（月表覆盖月份整月累计）
 * 与年累计取水量（区间结束日期所在年份），末行区间水量合计；每行"详情"按钮打开许可证详情弹窗。
 */

interface MonitorRow {
  FIR_CERT_NUM_CODE: string
  WAT_RIG_OWNER: string
  INTAKING_TYPE: string
  INT_LOC_DIV: string
  WAT_SOU_DES_CODE: string
  WAT_USAGE_DES: string
  WATER_TOTAL: number
  YEAR_WATER_TOTAL: number
}

const visible = ref(false)
const loading = ref(false)
const rows = ref<MonitorRow[]>([])

const certList = ref<string[]>([])
const stcdStr = ref('')

// 日期区间（formatted-value 字符串数组 ['yyyy-MM-dd','yyyy-MM-dd']），默认 [今天-30天, 今天]
const dateRange = ref<[string, string] | null>(null)

function fmtDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function defaultRange(): [string, string] {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return [fmtDate(start), fmtDate(end)]
}

function open(opts: { certCodes: string[]; stcds?: string }) {
  certList.value = opts.certCodes || []
  stcdStr.value = opts.stcds || ''
  dateRange.value = defaultRange()
  visible.value = true
  load()
}

defineExpose({ open })

async function load() {
  if (!dateRange.value || dateRange.value.length !== 2) {
    return
  }
  loading.value = true
  try {
    const res = await waterMonitorInfo({
      certCodes: certList.value.join(','),
      stcds: stcdStr.value || undefined,
      startDate: dateRange.value[0],
      endDate: dateRange.value[1]
    })
    rows.value = res.code === 0 && Array.isArray(res.data) ? res.data : []
    if (rows.value.length === 0) {
      window.$message?.warning?.('未查询到取水证数据，请调整圈选范围或日期区间')
    }
  } catch (e) {
    console.warn('waterMonitorInfo failed', e)
    rows.value = []
    window.$message?.error?.('查询取水量监测信息失败')
  } finally {
    loading.value = false
  }
}

function onRangeChange(val: [string, string] | null) {
  dateRange.value = val
  if (val && val.length === 2) {
    load()
  }
}

function show(v: unknown) {
  return v === undefined || v === null || v === '' ? '-' : String(v)
}

function fmtWater(v: unknown) {
  const n = Number(v)
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

// 合计按分位四舍五入，避免 JS 浮点累加误差（如 27201.180000000004）
const totalWater = () => {
  const s = rows.value.reduce((acc, r) => acc + (Number(r.WATER_TOTAL) || 0), 0)
  return Math.round(s * 100) / 100
}

const totalYearWater = () => {
  const s = rows.value.reduce((acc, r) => acc + (Number(r.YEAR_WATER_TOTAL) || 0), 0)
  return Math.round(s * 100) / 100
}

// ==================== 许可证详情弹窗（参考旧项目电子证照库详情） ====================
const detailModalRef = ref<InstanceType<typeof LicenseDetailModal>>()

function showDetail(row: MonitorRow) {
  // 年累计取水量按区间结束日期所在年份统计，详情"年度取水量"同口径
  const year = Number((dateRange.value?.[1] || '').substring(0, 4)) || undefined
  detailModalRef.value?.open(row.FIR_CERT_NUM_CODE, year)
}
</script>

<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="取水量监测信息"
    style="width: 1120px"
    :mask-closable="false"
  >
    <div class="wm-head">
      <div class="wm-range">
        <span>日期区间：</span>
        <n-date-picker
          v-model:formatted-value="dateRange"
          type="daterange"
          size="small"
          value-format="yyyy-MM-dd"
          :clearable="false"
          style="width: 240px"
          @update:formatted-value="onRangeChange"
        />
      </div>
      <span class="wm-tip">
        区间水量=所选区间覆盖月份的整月合计；年累计=区间结束日期所在年份合计（万m³）
      </span>
    </div>

    <div class="wm-table-wrap">
      <n-table size="small" :single-line="false" striped>
        <thead>
          <tr>
            <th style="width: 44px">序号</th>
            <th>取用水户名称</th>
            <th style="width: 100px">取水类型</th>
            <th style="width: 80px">行政区</th>
            <th style="width: 90px">水源类型</th>
            <th>取水用途</th>
            <th style="width: 120px">区间取水量(万m³)</th>
            <th style="width: 130px">年累计取水量(万m³)</th>
            <th style="width: 70px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="9" class="wm-center">加载中...</td>
          </tr>
          <tr v-else-if="rows.length === 0">
            <td colspan="9" class="wm-center">暂无数据</td>
          </tr>
          <template v-else>
            <tr v-for="(r, i) in rows" :key="r.FIR_CERT_NUM_CODE">
              <td class="wm-center">{{ i + 1 }}</td>
              <td>
                <div>{{ show(r.WAT_RIG_OWNER) }}</div>
                <div class="wm-cert">{{ show(r.FIR_CERT_NUM_CODE) }}</div>
              </td>
              <td class="wm-center">{{ show(r.INTAKING_TYPE) }}</td>
              <td class="wm-center">{{ show(r.INT_LOC_DIV) }}</td>
              <td class="wm-center">{{ show(r.WAT_SOU_DES_CODE) }}</td>
              <td>{{ show(r.WAT_USAGE_DES) }}</td>
              <td class="wm-num">{{ fmtWater(r.WATER_TOTAL) }}</td>
              <td class="wm-num">{{ fmtWater(r.YEAR_WATER_TOTAL) }}</td>
              <td class="wm-center">
                <n-button size="tiny" type="primary" secondary @click="showDetail(r)">
                  详情
                </n-button>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="rows.length > 0">
          <tr>
            <td colspan="6" class="wm-total-label">合计</td>
            <td class="wm-num wm-total">{{ totalWater().toFixed(2) }}</td>
            <td class="wm-num wm-total">{{ totalYearWater().toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </n-table>
    </div>

    <template #footer>
      <div class="wm-footer">
        <span class="wm-count">共 {{ rows.length }} 个取水证</span>
      </div>
    </template>

    <!-- 许可证详情弹窗（详情按钮 → 证照基础信息 + 年度取水量） -->
    <LicenseDetailModal ref="detailModalRef" />
  </n-modal>
</template>

<style scoped lang="scss">
.wm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;

  .wm-range {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .wm-tip {
    font-size: 12px;
    color: #999;
  }
}

.wm-table-wrap {
  max-height: 55vh;
  overflow: auto;
}

.wm-center {
  text-align: center;
}

.wm-cert {
  font-size: 12px;
  color: #999;
}

.wm-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.wm-total-label {
  text-align: right;
  font-weight: 700;
  color: #1e79ff;
}

.wm-total {
  font-weight: 700;
  color: #1e79ff;
}

.wm-footer {
  display: flex;
  align-items: center;

  .wm-count {
    font-size: 12px;
    color: #999;
  }
}
</style>
