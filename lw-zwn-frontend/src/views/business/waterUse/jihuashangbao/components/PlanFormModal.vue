<script setup lang="ts">
// ============================================================
// 取水计划 新增 / 编辑 / 重新填报 弹框
// 复刻原型 openPwNew：取水单位信息 + 取水许可证信息 + 用途申请量 + 逐月计划
// 样式基准：zhengzhaoguanli/components（LicNewModal）浅色弹框
// ============================================================
import { computed, reactive, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

export interface LicOption {
  cert: string
  owner: string
  org: string
  amt: number
  proj?: string
  area?: string
  outlet?: string
}

export interface PlanRowLike {
  id: string
  year: string
  cert: string
  outlet: string
  owner: string
  org: string
  proj: string
  area: string
  amt: number
  months: number[]
  st: number
  reason: string
}

interface UseAmt {
  agriS: string
  agriG: string
  indusS: string
  indusG: string
  lifeS: string
  lifeG: string
  supS: string
  supG: string
  hydroS: string
  hydroG: string
  otherS: string
  otherG: string
}

interface MonthItem {
  s: string
  g: string
}

const props = defineProps<{ licenses: LicOption[] }>()
const emit = defineEmits<{
  save: [payload: { id: string | null; cert: string; months: number[] }]
}>()

const MONTH_W = [3, 3, 7, 10, 11, 10, 9, 7, 8, 6, 3, 3]

const visible = ref(false)
const editId = ref<string | null>(null)

const form = reactive({
  owner: '',
  legal: '',
  contact: '',
  phone: '',
  addr: '',
  cert: '',
  place: '',
  use: '',
  retire: '无退水',
  src: '',
  term: '',
  amt: '',
  amtS: '',
  amtG: '',
  uses: {
    agriS: '',
    agriG: '',
    indusS: '',
    indusG: '',
    lifeS: '',
    lifeG: '',
    supS: '',
    supG: '',
    hydroS: '',
    hydroG: '',
    otherS: '',
    otherG: ''
  } as UseAmt,
  months: Array.from({ length: 12 }, () => ({ s: '', g: '' })) as MonthItem[]
})

const isEdit = computed(() => !!editId.value)

function fmt(x: number | null | undefined): string {
  return x === null || x === undefined ? '—' : Number(x).toLocaleString()
}

/** 由证号推导稳定的演示联系人信息（与原型 pwUnitDemo 同口径） */
function demoUnit(cert: string, area = '', proj = '') {
  let s = 0
  ;(cert || '').split('').forEach((ch) => (s += ch.charCodeAt(0)))
  const names = ['王建军', '李国强', '张志伟', '赵立新', '陈永刚', '刘洪波', '孙世昌', '马卫东']
  const contacts = ['刘建波', '王海燕', '李晓东', '陈志明', '赵春生', '孙立军']
  return {
    legal: names[s % names.length],
    contact: contacts[s % contacts.length],
    phone: '138' + String((s * 7919) % 100000000).padStart(8, '0'),
    addr: (area || '').replace(/ /g, '') + (proj || '') + '管理站'
  }
}

/** 由项目名称推导水源类型 / 取水用途 */
function licMeta(l: LicOption) {
  const proj = l.proj || ''
  const src = /地下/.test(proj) ? '地下水' : '地表水'
  const use = /发电/.test(proj)
    ? '水力发电'
    : /生活/.test(proj)
      ? '生活用水'
      : /供水/.test(proj)
        ? '城市供水'
        : /工业/.test(proj)
          ? '工业用水'
          : '农业灌溉'
  const my = (l.cert.match(/S(\d{4})/) || [])[1] || '2020'
  const y = +my - 6
  return {
    place: ((l.area || '') + (l.outlet || '')).replace(/ /g, ''),
    use,
    src,
    term: `${y}-07-29 至 ${y + 10}-07-28`,
    amtS: src === '地下水' ? '0' : fmt(l.amt),
    amtG: src === '地下水' ? fmt(l.amt) : '0'
  }
}

function emptyUses(): UseAmt {
  return {
    agriS: '',
    agriG: '',
    indusS: '',
    indusG: '',
    lifeS: '',
    lifeG: '',
    supS: '',
    supG: '',
    hydroS: '',
    hydroG: '',
    otherS: '',
    otherG: ''
  }
}

/** 按许可水量与用途，把申请量填到对应用途栏 */
function usesOf(l: LicOption): UseAmt {
  const u = emptyUses()
  const use = licMeta(l).use
  const keyMap: Record<string, keyof UseAmt> = {
    农业灌溉: 'agriS',
    工业用水: 'indusS',
    生活用水: 'lifeS',
    城市供水: 'supS',
    水力发电: 'hydroS'
  }
  const k = keyMap[use]
  if (k) {
    u[k] = fmt(l.amt)
  }
  return u
}

function applyLic(cert: string) {
  const l = props.licenses.find((x) => x.cert === cert)
  if (!l) {
    return
  }
  const meta = licMeta(l)
  const u = demoUnit(l.cert, l.area, l.proj)
  form.cert = l.cert
  form.owner = l.owner
  form.place = meta.place
  form.use = meta.use
  form.src = meta.src
  form.term = meta.term
  form.amt = fmt(l.amt)
  form.amtS = meta.amtS
  form.amtG = meta.amtG
  form.legal = u.legal
  form.contact = u.contact
  form.phone = u.phone
  form.addr = u.addr
  form.uses = usesOf(l)
}

const total = computed(() => {
  const sum = form.months.reduce((a, m) => a + (Number(m.s) || 0) + (Number(m.g) || 0), 0)
  return Math.round(sum * 10) / 10
})

function amtNum(): number {
  return parseFloat(form.amt.replace(/,/g, '')) || 0
}

/** 按灌溉权重拆分许可水量 */
function splitByWeight(amt: number): number[] {
  const S = MONTH_W.reduce((a, b) => a + b, 0)
  const rows = MONTH_W.map((w) => Math.round((amt * w) / S))
  rows[4] += amt - rows.reduce((a, b) => a + b, 0)
  return rows
}

function fillMonths(rows: number[]) {
  form.months = rows.map((v) => ({ s: String(v), g: '' }))
}

/** 按许可水量均匀分配 */
function evenFill() {
  fillMonths(splitByWeight(amtNum()))
}

/** 参考上一年执行（92%） */
function lastYearFill() {
  fillMonths(splitByWeight(Math.round(amtNum() * 0.92 * 10) / 10))
}

/** 打开弹框（传 row 为编辑 / 重新填报，否则为新增） */
function show(row?: PlanRowLike) {
  editId.value = row ? row.id : null
  form.months = Array.from({ length: 12 }, () => ({ s: '', g: '' }))
  if (row) {
    const l = props.licenses.find((x) => x.cert === row.cert)
    const meta = l
      ? licMeta(l)
      : { place: '—', use: '—', src: '—', term: '—', amtS: '—', amtG: '—' }
    const u = demoUnit(row.cert, row.area, row.proj)
    Object.assign(form, {
      owner: row.owner,
      legal: u.legal,
      contact: u.contact,
      phone: u.phone,
      addr: u.addr,
      cert: row.cert,
      place: meta.place,
      use: meta.use,
      retire: '无退水',
      src: meta.src,
      term: meta.term,
      amt: fmt(row.amt),
      amtS: meta.amtS,
      amtG: meta.amtG,
      uses: l ? usesOf(l) : emptyUses()
    })
    form.months = row.months.map((v) => ({ s: String(v), g: '' }))
  } else {
    Object.assign(form, {
      owner: '',
      legal: '',
      contact: '',
      phone: '',
      addr: '',
      cert: '',
      place: '',
      use: '',
      retire: '无退水',
      src: '',
      term: '',
      amt: '',
      amtS: '',
      amtG: '',
      uses: emptyUses()
    })
    if (props.licenses.length) {
      applyLic(props.licenses[0].cert)
      evenFill()
    }
  }
  visible.value = true
}

function onCertChange() {
  if (!isEdit.value) {
    applyLic(form.cert)
  }
}

function save() {
  const months = form.months.map((m) => Math.round((Number(m.s || 0) + Number(m.g || 0)) * 10) / 10)
  emit('save', { id: editId.value, cert: form.cert, months })
  visible.value = false
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="isEdit ? '编辑取水计划' : '新增取水计划'"
    table-theme="light"
    content-mode="scroll"
    default-padding="14px 26px 6px"
    :style-params="{ width: '1020px', height: '720px' }"
  >
    <!-- 取水单位信息 + 取水许可证信息（两列填报，样式对齐证照新增） -->
    <div class="licform">
      <div class="sect">取水单位信息</div>
      <div class="fitem">
        <span class="lbl">取水单位名称</span>
        <span class="ctl"><input v-model="form.owner" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">法人代表</span>
        <span class="ctl"><input v-model="form.legal" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">联系人</span>
        <span class="ctl"><input v-model="form.contact" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">联系电话</span>
        <span class="ctl"><input v-model="form.phone" type="text" /></span>
      </div>
      <div class="fitem span2">
        <span class="lbl">取水单位地址</span>
        <span class="ctl"><input v-model="form.addr" type="text" /></span>
      </div>

      <div class="sect">取水许可证信息</div>
      <div class="fitem">
        <span class="lbl">证号</span>
        <span class="ctl">
          <select v-if="!isEdit" v-model="form.cert" @change="onCertChange">
            <option v-for="l in licenses" :key="l.cert" :value="l.cert">{{ l.cert }}</option>
          </select>
          <input v-else v-model="form.cert" type="text" readonly />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">取水地点</span>
        <span class="ctl"><input v-model="form.place" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">取水用途</span>
        <span class="ctl"><input v-model="form.use" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">退水地点及退水量</span>
        <span class="ctl"><input v-model="form.retire" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">水源类型</span>
        <span class="ctl"><input v-model="form.src" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">有效期限</span>
        <span class="ctl"><input v-model="form.term" type="text" /></span>
      </div>
      <div class="fitem">
        <span class="lbl">许可水量</span>
        <span class="ctl">
          <input v-model="form.amt" type="text" />
          <span class="unit">万m³/年</span>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">其中：地表水</span>
        <span class="ctl"><input v-model="form.amtS" type="text" /></span>
      </div>
      <div class="fitem"></div>
      <div class="fitem">
        <span class="lbl">其中：地下水</span>
        <span class="ctl"><input v-model="form.amtG" type="text" /></span>
      </div>
    </div>

    <div class="sect">取水用途及年申请取水量</div>
    <table class="pwt">
      <colgroup>
        <col style="width: 100px" />
        <col />
        <col />
        <col style="width: 100px" />
        <col />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td class="lb" rowspan="2">用途</td>
          <td class="lb" colspan="2">申请取水量</td>
          <td class="lb" rowspan="2">用途</td>
          <td class="lb" colspan="2">申请取水量</td>
        </tr>
        <tr>
          <td class="lb">地表水</td>
          <td class="lb">地下水</td>
          <td class="lb">地表水</td>
          <td class="lb">地下水</td>
        </tr>
        <tr>
          <td class="lb">农业</td>
          <td><input v-model="form.uses.agriS" type="text" /></td>
          <td><input v-model="form.uses.agriG" type="text" /></td>
          <td class="lb">供水企业</td>
          <td><input v-model="form.uses.supS" type="text" /></td>
          <td><input v-model="form.uses.supG" type="text" /></td>
        </tr>
        <tr>
          <td class="lb">工业</td>
          <td><input v-model="form.uses.indusS" type="text" /></td>
          <td><input v-model="form.uses.indusG" type="text" /></td>
          <td class="lb">水力发电</td>
          <td><input v-model="form.uses.hydroS" type="text" /></td>
          <td><input v-model="form.uses.hydroG" type="text" /></td>
        </tr>
        <tr>
          <td class="lb">生活</td>
          <td><input v-model="form.uses.lifeS" type="text" /></td>
          <td><input v-model="form.uses.lifeG" type="text" /></td>
          <td class="lb">其他行业</td>
          <td><input v-model="form.uses.otherS" type="text" /></td>
          <td><input v-model="form.uses.otherG" type="text" /></td>
        </tr>
      </tbody>
    </table>

    <div class="sect">申请逐月取水计划</div>
    <table class="pwt">
      <colgroup>
        <col style="width: 76px" />
        <col />
        <col />
        <col style="width: 76px" />
        <col />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td class="lb" rowspan="2">月份</td>
          <td class="lb" colspan="2">申请取水量</td>
          <td class="lb" rowspan="2">月份</td>
          <td class="lb" colspan="2">申请取水量</td>
        </tr>
        <tr>
          <td class="lb">地表水</td>
          <td class="lb">地下水</td>
          <td class="lb">地表水</td>
          <td class="lb">地下水</td>
        </tr>
        <tr v-for="i in 6" :key="i">
          <td class="lb">{{ i }} 月</td>
          <td><input v-model="form.months[i - 1].s" type="number" min="0" step="0.1" /></td>
          <td><input v-model="form.months[i - 1].g" type="number" min="0" step="0.1" /></td>
          <td class="lb">{{ i + 6 }} 月</td>
          <td><input v-model="form.months[i + 5].s" type="number" min="0" step="0.1" /></td>
          <td><input v-model="form.months[i + 5].g" type="number" min="0" step="0.1" /></td>
        </tr>
        <tr class="tot">
          <td colspan="2">全年合计（万m³）</td>
          <td colspan="4">
            <b>{{ total }}</b>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pmtip">
      填报依据：证照信息 · 许可水量 · 上一年度取水计划 · 计量监测 ·
      统计水量；计划合计不应超过许可水量。
      <button class="kbtn" type="button" @click="evenFill">按许可水量均匀分配</button>
      <button class="kbtn" type="button" @click="lastYearFill">参考上年执行</button>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn primary" type="button" @click="save">保 存</button>
        <button class="lcm-btn" type="button" @click="visible = false">取 消</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 表单表格（样式取自公共 lic(form-table)） */
.pwt {
  @include lic.form-table;
}

/* 基础信息：两列填报（左标签 + 右控件，样式取自公共 lic(two-col-form)） */
.licform {
  @include lic.two-col-form;

  margin-bottom: 10px;
}

.sect {
  @include lic.sect-title;

  margin: 6px 0 8px;
}

/* 填报提示行 */
.pmtip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: lic.$font-xs;
  line-height: 1.7;
  color: lic.$c-secondary;
  background: #f4f8fe;
  border-radius: 4px;
}

.kbtn {
  padding: 3px 10px;
  font-family: inherit;
  font-size: lic.$font-sm;
  color: lic.$c-blue;
  cursor: pointer;
  background: #fff;
  border: 1px solid #bcd7f7;
  border-radius: 3px;

  &:hover {
    background: #eaf4ff;
  }
}

/* 底部按钮 */
.lcm-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}

.lcm-btn {
  width: 88px;
  height: 30px;
  font-family: inherit;
  font-size: lic.$font-btn;
  color: #fff;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;
  cursor: pointer;

  &.primary {
    background: linear-gradient(180deg, #4fa0f4, lic.$c-blue-deep);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
