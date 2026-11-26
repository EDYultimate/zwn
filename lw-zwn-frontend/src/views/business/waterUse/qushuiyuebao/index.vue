<script setup lang="ts">
import { ref, computed } from 'vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import RptBlQueryModal from './components/RptBlQueryModal.vue'
import { exposeAgentContext } from '@/agent/page'
// 类型专用导入：编译后擦除，业务页不产生对能力声明的运行时依赖
import type { QushuiyuebaoPageContract } from './qushuiyuebao'

/* ================= 取水月报（浅色整页视图） ================= */

// 页签类型
type TabKey = 'river' | 'prov' | 'sec' | 'store' | 'lic'

// 页签定义（与原型 #rptMonTabs 一致）
const monTabs: { key: TabKey; label: string }[] = [
  { key: 'river', label: '取水情况统计（按河流分类）' },
  { key: 'prov', label: '取水情况统计（按省份分类）' },
  { key: 'sec', label: '重要断面过流情况' },
  { key: 'store', label: '岳城水库蓄水供水和调度情况' },
  { key: 'lic', label: '直管枢纽水闸蓄水和调度情况' }
]

// 当前页签
const activeTab = ref<TabKey>('river')
// 统计月份（默认 2025-12）
const month = ref('2025-12')

/* ---------- 本地 mock 数据（保留原型原数值文案） ---------- */

// 按河流分类：取水工程数量 / 当月取水的取水工程数量 / 当月取水量（万m³）
const rptRiver = [
  { name: '岳城水库及以下漳河', total: 6, used: 3, vol: 1811.86 },
  { name: '卫河', total: 120, used: 18, vol: 511.58 },
  { name: '共产主义渠', total: 1, used: 0, vol: 0 },
  { name: '卫运河', total: 45, used: 2, vol: 52.36 },
  { name: '减河', total: 18, used: 0, vol: 0 },
  { name: '岔河', total: 27, used: 0, vol: 0 },
  { name: '漳卫新河', total: 60, used: 1, vol: 55.51 },
  { name: '南运河', total: 7, used: 0, vol: 0 }
]

// 按省份分类
const rptProv = [
  { name: '河北省', total: 115, used: 5, vol: 1749.02 },
  { name: '山东省', total: 74, used: 2, vol: 137.06 },
  { name: '河南省', total: 95, used: 17, vol: 545.23 }
]

// 重要断面过流情况：月均流量（m³/s）/ 月总过水量（万m³）
const rptSec = [
  {
    stnm: '观台',
    river: '漳河',
    loc: '河北省磁县',
    org: '邯郸水文勘测研究中心',
    flow: 24.93,
    vol: 6677.25
  },
  {
    stnm: '刘庄',
    river: '共产主义渠',
    loc: '河南省浚县新镇镇刘庄',
    org: '鹤壁水文水资源测报分中心',
    flow: 7.99,
    vol: 2140.04
  },
  {
    stnm: '淇门',
    river: '卫河',
    loc: '河南省浚县新镇镇李庄',
    org: '鹤壁水文水资源测报分中心',
    flow: 31.31,
    vol: 8386.07
  },
  {
    stnm: '元村集',
    river: '卫河',
    loc: '河南省南乐县元村镇元村',
    org: '濮阳水文水资源测报分中心',
    flow: 38.82,
    vol: 10397.55
  },
  {
    stnm: '南陶',
    river: '卫运河',
    loc: '山东省冠县东古城镇东陶村',
    org: '聊城市水文中心',
    flow: 45.1,
    vol: 12079.58
  },
  {
    stnm: '临清',
    river: '卫运河',
    loc: '山东省临清市健康街',
    org: '聊城市水文中心',
    flow: 52.7,
    vol: 14115.17
  },
  {
    stnm: '四女寺枢纽南进洪闸',
    river: '减河',
    loc: '山东省武城县四女寺镇',
    org: '德州市水文中心',
    flow: 35.01,
    vol: 9378.0
  },
  {
    stnm: '四女寺枢纽北进洪闸',
    river: '岔河',
    loc: '山东省武城县四女寺镇',
    org: '德州市水文中心',
    flow: 9.15,
    vol: 2451.0
  },
  {
    stnm: '四女寺枢纽节制闸',
    river: '南运河',
    loc: '山东省武城县四女寺镇',
    org: '德州市水文中心',
    flow: 0,
    vol: 0
  },
  {
    stnm: '辛集闸',
    river: '漳卫新河',
    loc: '山东省无棣县小泊头镇',
    org: '海委漳卫南局',
    flow: 29.53,
    vol: 7910.0
  }
]

// 直管枢纽水闸：蓄水量（万m³）/ 调整次数
const rptStore = [
  { name: '祝官屯枢纽', vol: 587.5, times: 6 },
  { name: '四女寺枢纽', vol: 706.8, times: 6 },
  { name: '袁桥拦河蓄水闸', vol: 150.0, times: 0 },
  { name: '吴桥拦河蓄水闸', vol: 300.8, times: 5 },
  { name: '王营盘拦河蓄水闸', vol: 720.0, times: 12 },
  { name: '罗寨拦河蓄水闸', vol: 130.0, times: 0 },
  { name: '庆云拦河蓄水闸', vol: 637.0, times: 9 },
  { name: '辛集挡潮蓄水闸', vol: 808.0, times: 11 }
]

// 岳城水库蓄水、供水和调度情况
const rptYc = {
  wl: 147.12, // 水位（m）
  cap: 61700, // 库容（万m³）
  inflow: 23.91, // 月平均入库流量（m³/s）
  inVol: 6404.76, // 月入库水量（万m³）
  out: { jh: 337.73, minq: 957.68, ry: 96.69, zn: 419.76, river: 7992.9, sum: 9804.76 },
  desc: '2026 年 1 月 1 日岳城水库月初蓄水量为 61700 万 m³，2025 年 12 月份岳城水库总供水量为 1811.86 万 m³，安阳管道供水 96.69 万 m³，漳南渠道供水 419.76 万 m³，安阳工业供水 0 万 m³，邯郸管道供水 337.73 万 m³，民有渠供水 939.58 万 m³，邯郸工业供水 18.10 万 m³，向漳河下泄 7992.9 万 m³。',
  dispatch: '12 月民有渠共动闸 7 次，漳南渠共动闸 2 次，向漳河水资源调度 3 次。'
}

/* ---------- 展示逻辑 ---------- */

// 数字格式化：千分位 + 最大 d 位小数
function fmt(x: number, d = 2) {
  return Number(x).toLocaleString('zh-CN', { maximumFractionDigits: d })
}

// 取水情况统计合计行（河流 / 省份共用）
function rowSum(rows: { total: number; used: number; vol: number }[]) {
  return {
    total: rows.reduce((a, r) => a + r.total, 0),
    used: rows.reduce((a, r) => a + r.used, 0),
    vol: fmt(
      rows.reduce((a, r) => a + r.vol, 0),
      2
    )
  }
}
const riverSum = rowSum(rptRiver)
const provSum = rowSum(rptProv)

// 直管枢纽水闸：枢纽（前 2 处）与水闸分组
const hubStore = rptStore.slice(0, 2)
const gateStore = rptStore.slice(2)
// 直管枢纽水闸数值合计
function storeSum(arr: typeof rptStore, key: 'vol' | 'times') {
  return arr.reduce((a, r) => a + r[key], 0)
}
const storeTimesAll = storeSum(rptStore, 'times')

// 标题：取水管理月报（2025年12月）
const titleText = computed(() => `取水管理月报（${month.value.replace('-', '年')}月）`)
// 脚注中的月份文案，如「12月」
const mLab = computed(() => `${Number(month.value.slice(5))}月`)
// 表内日期文案，如「2025 年 12 月」
const dateCn = computed(() => `${month.value.slice(0, 4)} 年 ${Number(month.value.slice(5))} 月`)

// 表格数字格式化（千分位，最大 2 位小数）
function numText(v: number) {
  return fmt(v)
}

/* ---------- 列表数据表（ProTable）列定义与合计行 ---------- */

/** 取水情况统计（按河流 / 按省份）列 */
function statColumns(nameTitle: string): VxeGridPropTypes.Columns {
  return [
    { type: 'seq', title: '序号', width: 60, align: 'center' },
    { field: 'name', title: nameTitle, minWidth: 160, align: 'left' },
    { field: 'total', title: '取水工程数量', minWidth: 120, align: 'center' },
    { field: 'used', title: '当月取水的取水工程数量', minWidth: 170, align: 'center' },
    {
      field: 'vol',
      title: '当月取水量（万m³）',
      minWidth: 140,
      align: 'center',
      formatter: ({ cellValue }: any) => numText(Number(cellValue))
    }
  ]
}

const riverColumns = statColumns('所属河流')
const provColumns = statColumns('所属省份')

/** 重要断面过流情况列 */
const secColumns: VxeGridPropTypes.Columns = [
  { type: 'seq', title: '序号', width: 60, align: 'center' },
  { field: 'stnm', title: '站名', minWidth: 140, align: 'left' },
  { field: 'river', title: '所在河流', minWidth: 110, align: 'center' },
  { field: 'loc', title: '断面地点', minWidth: 200, align: 'left', showOverflow: 'tooltip' },
  { field: 'org', title: '管理单位', minWidth: 180, align: 'left', showOverflow: 'tooltip' },
  {
    field: 'flow',
    title: '月均流量（m³/s）',
    minWidth: 130,
    align: 'center',
    formatter: ({ cellValue }: any) => numText(Number(cellValue))
  },
  {
    field: 'vol',
    title: '月总过水量（万m³）',
    minWidth: 150,
    align: 'center',
    formatter: ({ cellValue }: any) => numText(Number(cellValue))
  }
]

/** 合计行配置（序号列留空，名称列显示「合计」，数值列求和） */
const statGridOptions = (sum: { total: number; used: number; vol: string }) =>
  ({
    showFooter: true,
    footerMethod: ({ columns }: any) => {
      const cells = columns.map((column: any, i: number) => {
        if (i === 0) {
          return ''
        }
        if (i === 1) {
          return '合计'
        }
        if (i === 2) {
          return sum.total
        }
        if (i === 3) {
          return sum.used
        }
        return sum.vol
      })
      return [cells]
    }
  }) as Record<string, any>

const riverGridOptions = statGridOptions(riverSum)
const provGridOptions = statGridOptions(provSum)

// 通报查询弹框
const blQueryRef = ref<InstanceType<typeof RptBlQueryModal>>()

/** 打开「通报查询」弹框 */
function openQuery() {
  blQueryRef.value?.show()
}

// 智能体接入：只暴露能力；声明在同目录 qushuiyuebao.ts，事件注册由公共层自动完成
// 方法名由同目录能力文件的契约类型（satisfies）在编译期校验
exposeAgentContext({
  showBlQuery: () => blQueryRef.value?.show(),
  setMonth: (value: string) => {
    if (/^\d{4}-\d{2}$/.test(value)) {
      month.value = value
    }
  },
  switchTab: (key: string) => {
    if (monTabs.some((t) => t.key === key)) {
      activeTab.value = key as TabKey
    }
  }
} satisfies QushuiyuebaoPageContract)
</script>

<template>
  <!-- 取水月报 · 浅色整页视图（对应原型 #rptMonView） -->
  <div class="rpt-mon-page">
    <div class="report-card">
      <!-- 页头：标题 + 操作按钮 -->
      <div class="card-head">
        <h4 class="card-title" data-anchor="report-title">
          {{ titleText }}
          <small>数据源：漳卫南运河水资源信息通报 2025年第12期（总第84期）</small>
        </h4>
        <div class="head-btns">
          <button class="btn-main" type="button">一键生成</button>
          <button class="btn-ghost" type="button">导出</button>
          <button class="btn-ghost" type="button" @click="openQuery">通报查询</button>
        </div>
      </div>

      <!-- 月份筛选 -->
      <div class="filter-row" data-anchor="month-filter">
        <label class="filter-label">
          时间
          <DatePicker v-model="month" type="month" size="small" width="150px" :clearable="false" />
        </label>
      </div>

      <!-- 页签区 -->
      <div class="mon-tabs">
        <div
          v-for="t in monTabs"
          :key="t.key"
          class="mon-tab"
          :class="{ on: activeTab === t.key }"
          @click="activeTab = t.key"
        >
          {{ t.label }}
        </div>
      </div>

      <!-- 内容区：数据多时表格区内部滚动（约可见 8 行，表头吸顶） -->
      <div class="table-wrap pt-table-wrap" data-anchor="stat-table">
        <!-- 一、按河流分类 -->
        <template v-if="activeTab === 'river'">
          <pro-table
            :columns="riverColumns"
            :data="rptRiver"
            :grid-options="riverGridOptions"
            :is-pagination="false"
            height="100%"
          />
          <div class="tbl-note">注：当月取水量不含漳岳水电站发电量 3480 万m³。</div>
        </template>

        <!-- 二、按省份分类 -->
        <template v-else-if="activeTab === 'prov'">
          <pro-table
            :columns="provColumns"
            :data="rptProv"
            :grid-options="provGridOptions"
            :is-pagination="false"
            height="100%"
          />
        </template>

        <!-- 三、重要断面过流情况 -->
        <template v-else-if="activeTab === 'sec'">
          <pro-table :columns="secColumns" :data="rptSec" :is-pagination="false" height="100%" />
        </template>

        <!-- 四、岳城水库蓄水供水和调度情况 -->
        <template v-else-if="activeTab === 'store'">
          <div class="tbl-title">岳城水库蓄水、供水和调度情况统计表</div>
          <div class="tbl-date">{{ dateCn }}</div>
          <table class="ptbl">
            <thead>
              <tr>
                <th rowspan="2">水位<br />（m）</th>
                <th rowspan="2">库容<br />（万m³）</th>
                <th rowspan="2">月平均<br />入库流量<br />（m³/s）</th>
                <th rowspan="2">月入库水量<br />（万m³）</th>
                <th colspan="6">月出库水量（万m³）</th>
              </tr>
              <tr>
                <th>引岳济邯<br />管道</th>
                <th>民有渠<br />（含工业用水）</th>
                <th>引岳入安<br />管道</th>
                <th>漳南渠</th>
                <th>漳河河道</th>
                <th>合计</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="m">{{ fmt(rptYc.wl) }}</td>
                <td class="m">{{ fmt(rptYc.cap, 0) }}</td>
                <td class="m">{{ fmt(rptYc.inflow) }}</td>
                <td class="m">{{ fmt(rptYc.inVol) }}</td>
                <td class="m">{{ fmt(rptYc.out.jh) }}</td>
                <td class="m">{{ fmt(rptYc.out.minq) }}</td>
                <td class="m">{{ fmt(rptYc.out.ry) }}</td>
                <td class="m">{{ fmt(rptYc.out.zn) }}</td>
                <td class="m">{{ fmt(rptYc.out.river, 1) }}</td>
                <td class="m">{{ fmt(rptYc.out.sum) }}</td>
              </tr>
              <tr>
                <td class="own desc-label">蓄水、供水<br />情况说明</td>
                <td colspan="9" class="desc-cell">{{ rptYc.desc }}</td>
              </tr>
              <tr>
                <td class="own desc-label">调度情况</td>
                <td colspan="9" class="desc-cell">{{ rptYc.dispatch }}</td>
              </tr>
            </tbody>
          </table>
          <div class="tbl-note">注：水位、库容为 2026 年 1 月 1 日 8 时数据</div>
        </template>

        <!-- 五、直管枢纽水闸蓄水和调度情况 -->
        <template v-else>
          <div class="tbl-title">直管枢纽水闸蓄水和调度情况统计表</div>
          <div class="tbl-date">{{ dateCn }}</div>
          <table class="ptbl lic-tbl">
            <thead>
              <tr>
                <th>直管枢纽水闸名称</th>
                <th>蓄水量（万m³）</th>
                <th>调整次数</th>
              </tr>
            </thead>
            <tbody>
              <!-- 枢纽分组 -->
              <tr>
                <td :rowspan="hubStore.length" class="group-cell">枢纽</td>
                <td class="own">{{ hubStore[0].name }}</td>
                <td class="m">{{ fmt(hubStore[0].vol, 1) }}</td>
                <td class="m">{{ hubStore[0].times }}</td>
              </tr>
              <tr v-for="r in hubStore.slice(1)" :key="r.name">
                <td class="own">{{ r.name }}</td>
                <td class="m">{{ fmt(r.vol, 1) }}</td>
                <td class="m">{{ r.times }}</td>
              </tr>
              <tr class="sum-row">
                <td></td>
                <td class="own">小计</td>
                <td class="m">{{ fmt(storeSum(hubStore, 'vol'), 1) }}</td>
                <td class="m">{{ storeSum(hubStore, 'times') }}</td>
              </tr>
              <!-- 水闸分组 -->
              <tr>
                <td :rowspan="gateStore.length" class="group-cell">水闸</td>
                <td class="own">{{ gateStore[0].name }}</td>
                <td class="m">{{ fmt(gateStore[0].vol, 1) }}</td>
                <td class="m">{{ gateStore[0].times }}</td>
              </tr>
              <tr v-for="r in gateStore.slice(1)" :key="r.name">
                <td class="own">{{ r.name }}</td>
                <td class="m">{{ fmt(r.vol, 1) }}</td>
                <td class="m">{{ r.times }}</td>
              </tr>
              <tr class="sum-row">
                <td></td>
                <td class="own">小计</td>
                <td class="m">{{ fmt(storeSum(gateStore, 'vol'), 1) }}</td>
                <td class="m">{{ storeSum(gateStore, 'times') }}</td>
              </tr>
              <tr class="sum-row total-row">
                <td colspan="2">合计</td>
                <td class="m">{{ fmt(storeSum(rptStore, 'vol'), 1) }}</td>
                <td class="m">{{ storeTimesAll }}</td>
              </tr>
            </tbody>
          </table>
          <div class="tbl-note">注：蓄水量为 2026 年 1 月 1 日 8 时数据</div>
        </template>
      </div>

      <!-- 脚注（对应原型 #rptMonFoot） -->
      <div class="foot-note" data-anchor="report-foot-note">
        <template v-if="activeTab === 'river'">
          {{ mLab }}共有 <b>24</b> 处取水工程取水 <b>2431.31</b> 万m³
          ；其中邯郸市引岳济邯管道和民有渠 <b>1295.41</b> 万m³ ，安阳市引岳入安管道和漳南渠
          <b>516.45</b> 万m³ ，其余 21 处 <b>619.45</b> 万m³
        </template>
        <template v-else-if="activeTab === 'prov'">
          河北省取水量占比 <b>71.9%</b> ，以岳城水库及以下漳河沿线为主 ；河南省取水工程数量最多（95
          处）
        </template>
        <template v-else-if="activeTab === 'sec'">
          卫运河临清站月总过水量最大 <b>14115.17</b> 万m³ ；四女寺枢纽节制闸当月未过水
        </template>
        <template v-else-if="activeTab === 'store'">
          岳城水库 {{ mLab }}总供水量 <b>1811.86</b> 万m³ ，向漳河下泄 <b>7992.9</b> 万m³
          ；月初蓄水量 <b>61700</b> 万m³
        </template>
        <template v-else>
          直管枢纽水闸合计蓄水 <b>4040.1</b> 万m³ 、调整 <b>{{ storeTimesAll }}</b> 次
          ；其中辛集挡潮蓄水闸蓄水最多（808.0 万m³）
        </template>
      </div>
    </div>

    <!-- 通报查询弹框 -->
    <rpt-bl-query-modal ref="blQueryRef" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/style/water-filter.scss' as wf;
@use '@/assets/style/lic-modal-common.scss' as lic;
/* ===== 页面根容器：占满内容区的浅色背景 ===== */
.rpt-mon-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  //padding: 16px;
  //background: #eef3f8;
  overflow: hidden;
}

/* ===== 白底卡片 ===== */
.report-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 12px 16px;
  color: #1c3a63;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 8%);
}

/* 页头 */
.card-head {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #1f7ae0;

  small {
    margin-left: 8px;
    font-size: 12.5px;
    font-weight: 400;
    color: #5a7ba6;
  }
}

.head-btns {
  display: flex;
  gap: 10px;
}

.btn-main {
  padding: 5px 16px;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.08);
  }
}

.btn-ghost {
  padding: 5px 16px;
  font-size: 13px;
  color: #1f7ae0;
  white-space: nowrap;
  cursor: pointer;
  background: #f2f8ff;
  border: 1px solid #8fc0f2;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.05);
  }
}

/* 月份筛选行 */
.filter-row {
  @include wf.row;

  flex: none;
  margin-top: 11px;
}

.filter-label {
  @include wf.field;
}

/* 页签（胶囊按钮组） */
.mon-tabs {
  display: flex;
  flex: none;
  gap: 3px;
  align-self: flex-start;
  margin-top: 12px;
  padding: 3px;
  background: #eef4fb;
  border: 1px solid #c9dcf2;
  border-radius: 20px;
}

.mon-tab {
  padding: 5px 20px;
  font-size: 13px;
  color: #41577a;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 20px;

  &:hover {
    color: #1f7ae0;
  }

  &.on {
    font-weight: 600;
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  }
}

/* 表格容器：占满卡片剩余高度，数据多时容器内滚动 */
.table-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  margin-top: 10px;

  &.pt-table-wrap {
    overflow: auto;
  }

  /* vxe 表格：占满容器剩余高度，表体在表格内滚动 */
  .pro-table {
    flex: 1 1 0;
    min-height: 0;
  }

  /* 原生统计表 / 标题 / 日期 / 备注：按内容高度排列，不参与拉伸 */
  > .ptbl,
  .tbl-title,
  .tbl-date,
  .tbl-note {
    flex: none;
  }
}

/* 表格 */
.ptbl {
  @include lic.doc-table;
}

/* 直管枢纽水闸表：分组列与合计行 */
.lic-tbl {
  max-width: 820px;
  margin: 0 auto;
}

/* 统计表标题与日期 */
.tbl-title {
  @include lic.doc-title;
}

.tbl-date {
  @include lic.doc-date;
}

/* 表格下方备注 */
.tbl-note {
  @include lic.doc-note;
}

/* 脚注 */
.foot-note {
  flex: none;
  margin-top: 10px;
  font-size: 13px;
  color: #33507a;

  b {
    font-weight: 700;
    color: #1f7ae0;
  }
}
</style>
