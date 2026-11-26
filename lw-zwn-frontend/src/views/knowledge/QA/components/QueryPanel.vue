<script setup lang="ts">
// ============================================================
// 智能体二 · 取水许可信息管理（复刻原型 agQuery / qRun / qChips / qNew）
// 自然语言查询电子证照 → 结果表 / 按河流统计 / 导出 CSV / 新增登记
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { LIC_CERTS, type LicCertRow } from '../../data'

const emit = defineEmits<{ notify: [msg: string] }>()

/* ---------------- 查询状态 ---------------- */
const ipt = ref('')
const queried = ref(false)
const groupMode = ref(false)
const rows = ref<LicCertRow[]>(LIC_CERTS.map((c) => ({ ...c })))
const result = ref<LicCertRow[]>([])
const cond = ref('')

// 快捷查询（原型 qChips）
const CHIPS = ['有效许可证', '岳城局的许可证', '许可水量超过1000万m³的许可证', '按河流统计许可水量']

/* ---------------- 自然语言筛选 ---------------- */
function runQuery(text?: string) {
  const q = (text ?? ipt.value).trim()
  if (!q) {
    emit('notify', '请输入查询条件')
    return
  }
  ipt.value = q

  const county = rows.value
    .map((c) => c.county)
    .filter((c) => q.includes(c))
    .sort((a, b) => b.length - a.length)[0]
  const area = [...new Set(rows.value.map((c) => c.area))]
    .filter((c) => q.includes(c.replace(/市$/, '')))
    .sort((a, b) => b.length - a.length)[0]
  const org = [...new Set(rows.value.map((c) => c.org))]
    .sort((x, y) => y.length - x.length)
    .find((o) => q.includes(o))
  const river = [...new Set(rows.value.map((c) => c.river))]
    .sort((x, y) => y.length - x.length)
    .find((r) => q.includes(r))
  const status = /注销/.test(q) ? '注销' : /有效/.test(q) ? '有效' : ''
  const soon = /临近|即将到期|快到期/.test(q)
  const m = q.match(/(\d+(?:\.\d+)?)\s*万/i)
  const th = m ? parseFloat(m[1]) : null
  const over = /超过|大于|以上|高出/.test(q)
  const under = /低于|小于|不足/.test(q)

  groupMode.value = /按河流统计|河流统计/.test(q)
  queried.value = true

  if (groupMode.value) {
    return
  }

  result.value = rows.value.filter((c) => {
    if (county && c.county !== county) {
      return false
    }
    if (!county && area && c.area !== area) {
      return false
    }
    if (org && c.org !== org) {
      return false
    }
    if (river && c.river !== river) {
      return false
    }
    if (status && c.status !== status) {
      return false
    }
    if (soon && !c.exp) {
      return false
    }
    if (th !== null && over && !(c.amt > th)) {
      return false
    }
    if (th !== null && under && !(c.amt < th)) {
      return false
    }
    return true
  })

  const parts: string[] = []
  if (county) {
    const c = rows.value.find((x) => x.county === county)
    parts.push(`${c?.prov ?? ''} ${c?.area ?? ''} ${county}`)
  } else if (area) {
    parts.push(area)
  }
  if (org) {
    parts.push(`监管单位 ${org}`)
  }
  if (river) {
    parts.push(`所属河流 ${river}`)
  }
  if (status) {
    parts.push(`状态 ${status}`)
  }
  if (soon) {
    parts.push('临近到期')
  }
  if (th !== null) {
    parts.push(`许可水量 ${over ? '超过' : under ? '低于' : '约'} ${th} 万m³`)
  }
  cond.value = parts.join(' · ')
}

// 按河流聚合
const riverGroups = computed(() => {
  const map = new Map<string, { cnt: number; amt: number; valid: number }>()
  rows.value.forEach((c) => {
    const g = map.get(c.river) ?? { cnt: 0, amt: 0, valid: 0 }
    g.cnt += 1
    g.amt += c.amt
    if (c.status === '有效') {
      g.valid += 1
    }
    map.set(c.river, g)
  })
  return [...map.entries()].map(([river, g]) => ({ river, ...g }))
})

// 结果汇总
const totalAmt = computed(() => result.value.reduce((s, c) => s + c.amt, 0))

/* ---------------- 清空 ---------------- */
function clearAll() {
  ipt.value = ''
  queried.value = false
  groupMode.value = false
  result.value = []
  cond.value = ''
}

/* ---------------- 导出 CSV ---------------- */
function exportCsv() {
  const list = result.value
  if (!list.length) {
    emit('notify', '暂无查询结果可导出')
    return
  }
  const head = [
    '取水口编号',
    '许可证编号',
    '取水权人',
    '省份',
    '行政区',
    '区县',
    '监管单位',
    '所属河流',
    '许可水量(万m³)',
    '状态'
  ]
  const body = list.map((c) =>
    [c.no, c.cert, c.owner, c.prov, c.area, c.county, c.org, c.river, c.amt, c.status]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  )
  const csv = '\uFEFF' + [head.join(','), ...body].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = '取水许可查询结果.csv'
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  emit('notify', `已导出 ${list.length} 条查询结果`)
}

/* ---------------- 新增许可证弹框 ---------------- */
const addVisible = ref(false)
const form = ref({
  cert: '',
  owner: '',
  prov: '河北省',
  area: '邯郸市',
  county: '',
  org: '岳城局',
  river: '漳河',
  amt: '',
  status: '有效' as '有效' | '注销'
})

function openAdd() {
  form.value = {
    cert: '',
    owner: '',
    prov: '河北省',
    area: '邯郸市',
    county: '',
    org: '岳城局',
    river: '漳河',
    amt: '',
    status: '有效'
  }
  addVisible.value = true
}

// 保存新增（复刻原型 qNew 登记流程）
function saveAdd() {
  const f = form.value
  if (!f.cert.trim() || !f.owner.trim() || !f.county.trim() || !f.amt) {
    window.$message?.warning('请填写许可证编号、取水权人、区县与许可水量')
    return
  }
  rows.value.unshift({
    no: `P${(rows.value.length + 101).toString()}`,
    cert: f.cert.trim(),
    owner: f.owner.trim(),
    prov: f.prov,
    area: f.area,
    county: f.county.trim(),
    org: f.org,
    river: f.river,
    amt: +f.amt || 0,
    status: f.status
  })
  addVisible.value = false
  emit('notify', `许可证 ${f.cert} 已登记`)

  // 登记后若已查询过，刷新结果
  if (queried.value && ipt.value) {
    runQuery(ipt.value)
  }
}

const ORG_OPTIONS = ['岳城局', '卫河局', '德州局', '聊城局', '邢衡局', '沧州局', '水闸局']
const RIVER_OPTIONS = ['漳河', '卫河', '卫运河', '南运河', '漳卫新河', '滦河', '减河']
</script>

<template>
  <div class="ag-panel">
    <!-- 查询栏 -->
    <div class="ag-qbar">
      <input
        v-model="ipt"
        placeholder="用自然语言查询，例如：有效许可证有多少份／岳城局的许可证／许可水量超过1000万m³的许可证／按河流统计许可水量"
        @keydown.enter="runQuery()"
      />
      <button class="ag-run" type="button" @click="runQuery()">查 询</button>
      <button class="ag-btn ghost" type="button" @click="openAdd">＋ 新建</button>
    </div>

    <!-- 快捷查询 -->
    <div class="ag-chips">
      <span class="cl">快捷查询：</span>
      <span v-for="c in CHIPS" :key="c" class="ag-chip" @click="runQuery(c)">{{ c }}</span>
    </div>

    <div class="ag-card grow">
      <div class="ag-card-hd">
        查询结果
        <span class="ag-hint">
          支持按取水权人／证号／河流／行政区／监管单位／状态／水量阈值查询与统计；点击「＋
          新建」可登记新增许可证
        </span>
      </div>

      <!-- 未查询 -->
      <div v-if="!queried" class="ag-empty">输入查询条件，或点选上方快捷查询</div>

      <!-- 按河流统计 -->
      <div v-else-if="groupMode" class="qres-wrap">
        <table class="q-tbl">
          <thead>
            <tr>
              <th>所属河流</th>
              <th>许可证数</th>
              <th>有效数</th>
              <th>许可水量合计（万m³）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in riverGroups" :key="g.river">
              <td>{{ g.river }}</td>
              <td class="n">{{ g.cnt }}</td>
              <td class="n">{{ g.valid }}</td>
              <td class="n">{{ g.amt.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 明细结果 -->
      <template v-else>
        <div class="q-sum">
          <span
            >命中 <b>{{ result.length }}</b> 份</span
          >
          <span
            >许可水量合计 <b>{{ totalAmt.toLocaleString() }}</b> 万m³</span
          >
          <span v-if="cond" class="q-cond"
            >条件：<b>{{ cond }}</b></span
          >
        </div>
        <div v-if="result.length" class="qres-wrap">
          <table class="q-tbl">
            <thead>
              <tr>
                <th>编号</th>
                <th>许可证编号</th>
                <th>取水权人</th>
                <th>行政区</th>
                <th>监管单位</th>
                <th>所属河流</th>
                <th>许可水量（万m³）</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in result" :key="c.cert + c.no">
                <td>{{ c.no }}</td>
                <td>{{ c.cert }}</td>
                <td class="nm">{{ c.owner }}</td>
                <td>{{ c.area }} {{ c.county }}</td>
                <td>{{ c.org }}</td>
                <td>{{ c.river }}</td>
                <td class="n">{{ c.amt.toLocaleString() }}</td>
                <td>
                  <span class="st" :class="{ off: c.status === '注销' }">{{ c.status }}</span>
                  <span v-if="c.exp" class="ex">临近到期</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="ag-empty">未检索到匹配的许可证，请调整查询条件</div>
      </template>
    </div>

    <!-- 结果操作 -->
    <div v-if="queried && !groupMode" class="ag-actions">
      <button class="ag-btn" type="button" @click="exportCsv">导出查询结果（CSV）</button>
      <button class="ag-btn ghost" type="button" @click="clearAll">清 空</button>
    </div>

    <!-- 新增许可证 -->
    <pro-modal
      v-model:show="addVisible"
      title="登记新增取水许可证"
      table-theme="light"
      content-mode="fill"
      default-padding="14px 26px 6px"
      :style-params="{ width: '640px' }"
    >
      <div class="add-form">
        <label class="fld"
          ><span>许可证编号</span><input v-model="form.cert" placeholder="如 A130402S2026-0001"
        /></label>
        <label class="fld"
          ><span>取水权人</span><input v-model="form.owner" placeholder="取水单位名称"
        /></label>
        <label class="fld">
          <span>省份</span>
          <select v-model="form.prov">
            <option>河北省</option>
            <option>河南省</option>
            <option>山东省</option>
          </select>
        </label>
        <label class="fld"
          ><span>行政区</span><input v-model="form.area" placeholder="如 邯郸市"
        /></label>
        <label class="fld"
          ><span>区县</span><input v-model="form.county" placeholder="如 馆陶县"
        /></label>
        <label class="fld">
          <span>监管单位</span>
          <select v-model="form.org">
            <option v-for="o in ORG_OPTIONS" :key="o">{{ o }}</option>
          </select>
        </label>
        <label class="fld">
          <span>所属河流</span>
          <select v-model="form.river">
            <option v-for="r in RIVER_OPTIONS" :key="r">{{ r }}</option>
          </select>
        </label>
        <label class="fld"
          ><span>许可水量（万m³）</span
          ><input v-model="form.amt" type="number" placeholder="如 1410.87"
        /></label>
        <label class="fld">
          <span>状态</span>
          <select v-model="form.status">
            <option>有效</option>
            <option>注销</option>
          </select>
        </label>
      </div>
      <template #action>
        <div class="lcm-foot">
          <button class="lcm-btn" type="button" @click="addVisible = false">取 消</button>
          <button class="lcm-btn primary" type="button" @click="saveAdd">确 定</button>
        </div>
      </template>
    </pro-modal>
  </div>
</template>

<style scoped lang="scss">
/* ===== 智能体通用骨架（复刻原型 ag-panel / ag-qbar / ag-chips） ===== */
.ag-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}
.ag-qbar {
  display: flex;
  flex: none;
  gap: 10px;
  align-items: center;
}
.ag-qbar input {
  flex: 1;
  height: 42px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 14.5px;
  color: #24466f;
  background: #fff;
  border: 1px solid #7db4ee;
  border-radius: 6px;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.18);
  }
  &::placeholder {
    color: #93aacb;
  }
}
.ag-run {
  flex: none;
  height: 42px;
  padding: 0 26px;
  font-family: inherit;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 5px;

  &:hover {
    filter: brightness(1.07);
  }
}
.ag-btn {
  flex: none;
  height: 38px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 13.5px;
  color: #1f7ae0;
  cursor: pointer;
  background: #eef5fd;
  border: 1px solid #c9dcf2;
  border-radius: 5px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
  }
  &.ghost {
    color: #5a7ba6;
    background: #fff;
    border-color: #c9dcf2;

    &:hover {
      color: #1f7ae0;
      background: #f2f8ff;
    }
  }
}
.ag-chips {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;

  .cl {
    font-size: 12.5px;
    color: #8aa3c4;
  }
}
.ag-chip {
  padding: 4px 11px;
  font-size: 12.5px;
  color: #1f7ae0;
  cursor: pointer;
  background: #eef5fd;
  border: 1px solid #c9dcf2;
  border-radius: 12px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
    border-color: #1f7ae0;
  }
}
.ag-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  padding: 12px 14px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.07);
}
.ag-card-hd {
  display: flex;
  flex: none;
  gap: 10px;
  align-items: center;
  padding-bottom: 8px;
  font-size: 14.5px;
  font-weight: 700;
  color: #1f4f86;
  border-bottom: 1px solid #e8f0f9;

  .ag-hint {
    margin-left: auto;
    font-size: 12.5px;
    font-weight: 400;
    color: #8aa3c4;
  }
}
.ag-empty {
  padding: 50px 0;
  font-size: 14px;
  color: #8aa3c4;
  text-align: center;
}
.ag-actions {
  display: flex;
  flex: none;
  gap: 8px;
}

/* ===== 结果区 ===== */
.q-sum {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #5a7ba6;

  b {
    color: #1f7ae0;
  }
  .q-cond {
    color: #8aa3c4;

    b {
      color: #2a5c94;
    }
  }
}
.qres-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 1px solid #e3edf9;
  border-radius: 6px;
}
table.q-tbl {
  width: 100%;
  font-size: 13px;
  border-spacing: 0;
  border-collapse: separate;
}
.q-tbl th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 9px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #20517e;
  text-align: center;
  white-space: nowrap;
  background: #e2eefb;
  border-bottom: 1px solid #cfe0f3;
}
.q-tbl td {
  padding: 9px 10px;
  color: #2a3f5c;
  white-space: nowrap;
  border-bottom: 1px solid #eef3fa;
}
.q-tbl tbody tr:hover td {
  background: #f6fbff;
}
.q-tbl .nm {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.q-tbl .n {
  font-weight: 700;
  color: #1a4f86;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.st {
  display: inline-block;
  padding: 1px 7px;
  font-size: 12px;
  color: #149a5b;
  background: #f1fcf7;
  border: 1px solid #39b98a;
  border-radius: 3px;

  &.off {
    color: #8aa3c4;
    background: #f4f7fb;
    border-color: #c9d8ea;
  }
}
.ex {
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 11.5px;
  color: #c0741b;
  background: #fff7e6;
  border: 1px solid #f0d9a8;
  border-radius: 3px;
}

/* ===== 新增表单 ===== */
.add-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 18px;
  padding: 6px 0 2px;
}
.fld {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  color: #5a7ba6;

  input,
  select {
    box-sizing: border-box;
    height: 32px;
    padding: 0 9px;
    font-family: inherit;
    font-size: 13.5px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 2px rgba(63, 151, 242, 0.18);
    }
  }
}
.lcm-foot {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 4px 0 0;
}
.lcm-btn {
  height: 30px;
  padding: 0 20px;
  font-family: inherit;
  font-size: 13px;
  color: #1f7ae0;
  cursor: pointer;
  background: #f2f8ff;
  border: 1px solid #9cc3ef;
  border-radius: 4px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
  }
  &.primary {
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
    border-color: #1f6fd6;
  }
}
</style>
