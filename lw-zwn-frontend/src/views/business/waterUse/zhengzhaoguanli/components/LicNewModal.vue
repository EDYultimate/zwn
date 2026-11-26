<script setup lang="ts">
// ============================================================
// 新增取水许可证弹框（复刻原型 openLicNew 分栏表单）
// 字段：基本信息（证号 / 状态 / 有效期 / 水量 / 项目 / 权人 / 取水口明细）+ 行政区划与监管
// ============================================================
import { computed, reactive, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'

/* ---------------- 下拉选项（取自原型） ---------------- */

const ORGS = ref(['岳城局', '卫河局', '邯郸局', '聊城局', '邢衡局', '德州局', '沧州局', '水闸局'])
const RIVERS = ref([
  '岳城水库',
  '卫河',
  '共渠',
  '卫运河',
  '漳河',
  '南运河',
  '减河',
  '岔河',
  '漳卫新河'
])
const REACHES = ref([
  '岳城水库',
  '岳城水库-徐万仓',
  '淇门-元村',
  '元村-徐万仓',
  '元村-南陶',
  '南陶-临清',
  '临清-四女寺',
  '徐万仓-四女寺',
  '四女寺-第三店',
  '四女寺-辛集'
])
const USES = ref([
  '农业灌溉',
  '农业灌溉和工业用水',
  '生活用水',
  '工业和城市生活',
  '生态用水',
  '生态和环境用水',
  '河道内生产用水-水力发电',
  '发电'
])
const ENGS = ref(['渠道', '管道', '水电站', '水泵', '自流闸'])
const WTYPES = ref(['地表水', '地下水'])
const ITYPES = ref(['自备水源', '河道内生产'])
const ISSUED_OPTIONS = ['已发证', '准予未发']
const YES_NO = ['是', '否']

// 省 → 市 → 县 三级行政区数据
const AREA_DATA = reactive<Record<string, Record<string, string[]>>>({
  河北省: {
    邯郸市: ['磁县', '魏县', '大名县', '馆陶县', '临漳县'],
    邢台市: ['临西县', '清河县'],
    衡水市: ['故城县', '景县'],
    沧州市: ['吴桥县', '东光县', '盐山县', '海兴县', '南皮县']
  },
  河南省: {
    安阳市: ['滑县', '汤阴县', '内黄县'],
    鹤壁市: ['浚县'],
    濮阳市: ['清丰县', '南乐县']
  },
  山东省: {
    聊城市: ['冠县', '临清市'],
    德州市: ['夏津县', '武城县', '德城区', '宁津县', '庆云县', '乐陵市'],
    滨州市: ['无棣县']
  }
})

/**
 * 后端返回的真实值可能不在原型下拉选项中，编辑回填时动态补齐，
 * 避免 select 因值不在 options 中而被重置为空或改成第一项。
 */
function ensureOption(opts: { value: string[] }, val?: string) {
  if (val && !opts.value.includes(val)) {
    opts.value = [...opts.value, val]
  }
}

/** 编辑回填时补齐省 / 市 / 县，避免行政区被重置为默认项 */
function ensureArea(prov?: string, city?: string, county?: string) {
  if (!prov) {
    return
  }
  if (!AREA_DATA[prov]) {
    AREA_DATA[prov] = {}
  }
  if (city && !AREA_DATA[prov][city]) {
    AREA_DATA[prov][city] = []
  }
  if (city && county && !AREA_DATA[prov][city].includes(county)) {
    AREA_DATA[prov][city].push(county)
  }
}

// 地级市行政区划代码（用于生成许可证编号）
const CITY_CODE: Record<string, string> = {
  邯郸市: '130400',
  邢台市: '130500',
  衡水市: '131100',
  沧州市: '130900',
  安阳市: '410500',
  鹤壁市: '410600',
  濮阳市: '410900',
  聊城市: '371500',
  德州市: '371400',
  滨州市: '371600'
}

/** 从候选值中取第一个存在于下拉选项里的值 */
function firstExisting(values: Array<string | undefined>, options: string[]) {
  for (const v of values) {
    if (v && options.includes(v)) {
      return v
    }
  }
  return ''
}

/** 行政区划代码前 4 位 → 地级市名称（与 CITY_CODE 对应） */
function cityByAdCd(adCd?: string) {
  if (!adCd || adCd.length < 4) {
    return ''
  }
  const prefix = adCd.substring(0, 4)
  return Object.keys(CITY_CODE).find((name) => CITY_CODE[name].startsWith(prefix)) || ''
}

/* ---------------- 表单状态 ---------------- */

interface LicPoint {
  no: string // 取水口编号
  pos: string // 取水口位置
  eng: string // 取水工程（设施）类型
}

interface LicForm {
  cert: string
  issued: string
  from: string
  to: string
  amt: string
  proj: string
  owner: string
  code: string
  points: LicPoint[]
  river: string
  reach: string
  wtype: string
  itype: string
  use: string
  org: string
  prov: string
  city: string
  county: string
  focus: string
  big: string
  small: string
}

/** yyyy-MM-dd（偏移年数，用于有效期默认值） */
function dateStr(offsetYears = 0) {
  const d = new Date()
  d.setFullYear(d.getFullYear() + offsetYears)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

// 证号流水号（保存一次自增，与原型一致）
const seq = ref(1)
const padSeq = () => String(seq.value).padStart(4, '0')

const visible = ref(false)

// 编辑模式：传入待编辑记录则为「编辑取水许可证」，否则「新增」
const editRec = ref<any>(null)
const isEdit = computed(() => !!editRec.value)

const emit = defineEmits<{ saved: [record: any, meta?: { isEdit: boolean; oldCert: string }] }>()

const form = reactive<LicForm>(createForm())

/**
 * 字段锁定：编辑「已发证」的许可证时，仅「许可证状态 / 取水许可证编号 / 行政区划与监管」可改，
 * 其余字段禁用；新建（或状态改为准予未发）时全部可编辑。
 */
const locked = computed(() => isEdit.value && form.issued === '已发证')

/** 由已有记录回填表单（编辑模式） */
function fillFromRecord(c: any) {
  ensureOption(ORGS, c.org)
  ensureOption(RIVERS, c.river)
  ensureOption(REACHES, c.reach)
  ensureOption(USES, c.use)
  ensureOption(WTYPES, c.src)
  ensureOption(ITYPES, c.itype)
  ensureOption(ENGS, c.eng)
  const rawPts: any[] = c.pts || []
  rawPts.forEach((p) => ensureOption(ENGS, p.eng))
  ensureArea(c.prov, c.city, c.county)
  const points: LicPoint[] = c.pts?.length
    ? c.pts.map((p: any) => ({ no: p.no || '', pos: p.pos || '', eng: p.eng || ENGS.value[0] }))
    : ((c.nos?.length ? c.nos : [c.no]) as string[]).map((n) => ({
        no: n,
        pos: c.inposTxt || '',
        eng: c.eng || ENGS.value[0]
      }))
  const prov = c.prov && AREA_DATA[c.prov] ? c.prov : '河北省'
  const cities = Object.keys(AREA_DATA[prov])
  // 行政区优先按 AD_CD 前四位反推地级市，其次用后端返回的 city / 行政区名称
  const city = firstExisting([c.city, cityByAdCd(c.adCd), c.area], cities) || cities[0]
  const counties = AREA_DATA[prov][city] || []
  const county = firstExisting([c.county, c.adNm, c.area], counties) || counties[0] || ''
  Object.assign(form, {
    cert: c.cert || '',
    issued: c.issued || '已发证',
    from: c.from || dateStr(0),
    to: c.to || dateStr(5),
    amt: c.amt != null ? String(c.amt) : '',
    proj: c.proj || '',
    owner: c.owner || '',
    code: c.code || '',
    points,
    river: c.river || '',
    reach: c.reach || '',
    wtype: c.src || '',
    itype: c.itype || '',
    use: c.use || '',
    org: c.org || ORGS.value[0],
    prov,
    city,
    county,
    focus: c.focus || '否',
    big: c.big || '否',
    small: c.small || '否'
  })
}

/** 生成初始表单（默认省份河北省 / 邯郸市 / 磁县，取水口一条示例） */
function createForm(): LicForm {
  return {
    cert: `A${CITY_CODE['邯郸市']}S2026-${padSeq()}`,
    issued: '已发证',
    from: dateStr(0),
    to: dateStr(5),
    amt: '',
    proj: '',
    owner: '',
    code: '',
    points: [{ no: '岳城局-01-1', pos: '民有渠渠首', eng: ENGS.value[0] }],
    river: '',
    reach: '',
    wtype: '',
    itype: '',
    use: '',
    org: '',
    prov: '河北省',
    city: '邯郸市',
    county: '磁县',
    focus: '否',
    big: '否',
    small: '否'
  }
}

/* ---------------- 行政区联动 ---------------- */

const cityOptions = computed(() => Object.keys(AREA_DATA[form.prov] || {}))
const countyOptions = computed(() => AREA_DATA[form.prov]?.[form.city] || [])

/* ---------------- n-select 选项 ---------------- */

/** 字符串数组 → n-select 选项（首项为「请选择」，值为空串） */
const toOptions = (list: string[]) => [
  { label: '请选择', value: '' },
  ...list.map((v) => ({ label: v, value: v }))
]

/** 字符串数组 → n-select 选项（无空项） */
const toPlainOptions = (list: string[]) => list.map((v) => ({ label: v, value: v }))

const riverOptions = computed(() => toOptions(RIVERS.value))
const reachOptions = computed(() => toOptions(REACHES.value))
const wtypeOptions = computed(() => toOptions(WTYPES.value))
const itypeOptions = computed(() => toOptions(ITYPES.value))
const useOptions = computed(() => toOptions(USES.value))
const orgOptions = computed(() => toPlainOptions(ORGS.value))
const engOptions = computed(() => toPlainOptions(ENGS.value))
const provOptions = computed(() => toPlainOptions(Object.keys(AREA_DATA)))
const citySelectOptions = computed(() => toPlainOptions(cityOptions.value))
const countySelectOptions = computed(() => toPlainOptions(countyOptions.value))

/** 省份下拉：先写回表单值再联动下级 */
function onProvSelect(v: string | number | null) {
  form.prov = String(v ?? '')
  onProvChange()
}

/** 城市下拉：先写回表单值再联动下级 */
function onCitySelect(v: string | number | null) {
  form.city = String(v ?? '')
  onCityChange()
}

/** 切换省份：城市重置为该省第一个，并联动县与证号（编辑模式不改证号） */
function onProvChange() {
  form.city = cityOptions.value[0] || ''
  form.county = countyOptions.value[0] || ''
  if (!isEdit.value) {
    updateCert()
  }
}

/** 切换城市：县重置为该市第一个，并联动证号（编辑模式不改证号） */
function onCityChange() {
  form.county = countyOptions.value[0] || ''
  if (!isEdit.value) {
    updateCert()
  }
}

/** 证号按城市代码自动生成：A{行政区划代码}S2026-{流水号} */
function updateCert() {
  form.cert = `A${CITY_CODE[form.city] || '000000'}S2026-${padSeq()}`
}

/* ---------------- 取水口明细增删 ---------------- */

/** 追加一个取水口（编号按最后一行尾号 +1 推测） */
function addPoint() {
  const last = form.points.length ? form.points[form.points.length - 1].no.trim() : ''
  const m = last.match(/^(.*?)(\d+)$/)
  const no = m ? m[1] + String(Number(m[2]) + 1).padStart(m[2].length, '0') : ''
  form.points.push({ no, pos: '', eng: ENGS.value[0] })
}

/** 删除指定取水口（至少保留一行） */
function removePoint(index: number) {
  form.points.splice(index, 1)
  if (!form.points.length) {
    form.points.push({ no: '', pos: '', eng: ENGS.value[0] })
  }
}

/* ---------------- 打开 / 重置 / 保存 ---------------- */

/** 打开弹框：传记录 → 编辑模式（回填原值）；不传 → 新增 */
function show(record?: any) {
  editRec.value = record || null
  if (record) {
    fillFromRecord(record)
  } else {
    Object.assign(form, createForm())
  }
  visible.value = true
}

function onReset() {
  if (editRec.value) {
    fillFromRecord(editRec.value)
    window.$message?.info('已恢复原值')
  } else {
    Object.assign(form, createForm())
    window.$message?.info('已重置')
  }
}

/** 保存：校验必填项后抛出 saved 事件，父组件负责追加列表 */
function onSave() {
  const points = form.points
    .map((p) => ({ no: p.no.trim(), pos: p.pos.trim(), eng: p.eng }))
    .filter((p) => p.no || p.pos)
  const nos = points.map((p) => p.no).filter(Boolean)

  if (!nos.length) {
    window.$message?.warning('请至少填写一个取水口编号')
    return
  }
  if (!form.cert.trim()) {
    window.$message?.warning('请填写取水许可证编号')
    return
  }
  if (!form.proj.trim()) {
    window.$message?.warning('请填写取水项目名称')
    return
  }
  if (!form.owner.trim()) {
    window.$message?.warning('请填写取水权人')
    return
  }
  if (!form.amt || Number.isNaN(Number(form.amt))) {
    window.$message?.warning('请填写正确的许可水量')
    return
  }

  emit(
    'saved',
    {
      no: nos[0],
      nos,
      pts: points,
      cert: form.cert.trim(),
      owner: form.owner.trim(),
      code: form.code.trim(),
      proj: form.proj.trim(),
      river: form.river || '卫河',
      amt: Number(form.amt),
      use: form.use || '农业灌溉',
      biz: isEdit.value ? editRec.value.biz || '变更' : '新办',
      src: form.wtype || '地表水',
      org: form.org,
      // 行政区：编码写入 WR_WPC_SUP_B.AD_CD，名称由后端联查 WR_AD_B.AD_NM 得到
      adCd: CITY_CODE[form.city] || '',
      area: form.city,
      inpos: form.itype === '河道内生产' ? '河道内' : '河道外',
      status: isEdit.value ? editRec.value.status || '有效' : '有效',
      issued: form.issued,
      exp: isEdit.value ? !!editRec.value.exp : false,
      // 以下扩展字段供详情弹框展示
      focus: form.focus,
      big: form.big,
      small: form.small,
      reach: form.reach,
      itype: form.itype,
      prov: form.prov,
      city: form.city,
      county: form.county,
      from: form.from,
      to: form.to,
      inposTxt: points[0]?.pos || '',
      eng: points[0]?.eng || ''
    },
    { isEdit: isEdit.value, oldCert: editRec.value?.cert || '' }
  )
  if (!isEdit.value) {
    seq.value++
  }
  visible.value = false
  // window.$message?.success(isEdit.value ? '取水许可证已更新' : '新增取水许可证已保存')
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="isEdit ? '编辑取水许可证' : '新增取水许可证'"
    table-theme="light"
    content-mode="scroll"
    default-padding="14px 26px 6px"
    :style-params="{ width: '880px', height: '640px' }"
  >
    <div class="licform">
      <p v-if="locked" class="lock-tip">
        该许可证状态为「已发证」，仅可修改许可证状态、取水许可证编号及行政区划与监管信息
      </p>
      <div class="sect">基本信息</div>
      <div class="fitem">
        <span class="lbl">许可证状态</span>
        <span class="ctl">
          <n-radio-group v-model:value="form.issued" class="lcm-cks">
            <n-radio v-for="o in ISSUED_OPTIONS" :key="o" :value="o">{{ o }}</n-radio>
          </n-radio-group>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl req">取水许可证编号</span>
        <span class="ctl"><n-input v-model:value="form.cert" /></span>
      </div>

      <div class="fitem span2">
        <span class="lbl">有效期</span>
        <span class="ctl">
          <span class="vrange">
            <DatePicker
              v-model="form.from"
              type="date"
              size="small"
              width="152px"
              :clearable="false"
              :disabled="locked"
            />
            <span>~</span>
            <DatePicker
              v-model="form.to"
              type="date"
              size="small"
              width="152px"
              :clearable="false"
              :disabled="locked"
            />
          </span>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl req">许可水量</span>
        <span class="ctl">
          <n-input
            v-model:value="form.amt"
            placeholder="0"
            :input-props="{ inputmode: 'decimal' }"
            :disabled="locked"
          />
          <span class="unit">万m³/年</span>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl req">取水项目名称</span>
        <span class="ctl">
          <n-input v-model:value="form.proj" placeholder="如 潘庄引黄闸" :disabled="locked" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl req">取水权人</span>
        <span class="ctl">
          <n-input v-model:value="form.owner" placeholder="取水单位全称" :disabled="locked" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">组织机构代码</span>
        <span class="ctl">
          <n-input
            v-model:value="form.code"
            placeholder="统一社会信用代码"
            :disabled="locked"
          />
        </span>
      </div>

      <!-- 取水口信息：一证多口可增删 -->
      <div class="fitem span2 top">
        <span class="lbl req">取水口信息<i>一证多口点「＋」增删</i></span>
        <span class="ctl">
          <span class="ntable">
            <span class="nhead">
              <i class="c1">取水口编号</i>
              <i class="c2">取水口位置</i>
              <i class="c3">取水工程（设施）类型</i>
              <i class="c4"></i>
            </span>
            <span v-for="(p, i) in form.points" :key="i" class="nrow">
              <n-input
                v-model:value="p.no"
                class="ncno"
                placeholder="如 岳城局-01-2"
                :disabled="locked"
              />
              <n-input
                v-model:value="p.pos"
                class="ncpos"
                placeholder="如 卫河右岸012+800"
                :disabled="locked"
              />
              <n-select
                v-model:value="p.eng"
                class="nceng"
                :options="engOptions"
                :disabled="locked"
              />
              <span class="nbtns">
                <button
                  class="nbtn add"
                  type="button"
                  title="新增一个取水口"
                  :disabled="locked"
                  @click="addPoint"
                >
                  ＋
                </button>
                <button
                  class="nbtn del"
                  type="button"
                  title="删除该取水口"
                  :disabled="locked"
                  @click="removePoint(i)"
                >
                  －
                </button>
              </span>
            </span>
          </span>
        </span>
      </div>

      <div class="fitem">
        <span class="lbl">所属河流</span>
        <span class="ctl">
          <n-select v-model:value="form.river" :options="riverOptions" :disabled="locked" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">所在河段</span>
        <span class="ctl">
          <n-select v-model:value="form.reach" :options="reachOptions" :disabled="locked" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">水源类型</span>
        <span class="ctl">
          <n-select v-model:value="form.wtype" :options="wtypeOptions" :disabled="locked" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">取水类型</span>
        <span class="ctl">
          <n-select v-model:value="form.itype" :options="itypeOptions" :disabled="locked" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">取水用途</span>
        <span class="ctl">
          <n-select v-model:value="form.use" :options="useOptions" :disabled="locked" />
        </span>
      </div>

      <div class="sect">行政区划与监管</div>

      <div class="fitem">
        <span class="lbl">监管单位</span>
        <span class="ctl">
          <n-select v-model:value="form.org" :options="orgOptions" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">行政区划</span>
        <span class="ctl">
          <n-select
            :value="form.prov"
            :options="provOptions"
            @update:value="onProvSelect"
          />
          <n-select
            :value="form.city"
            :options="citySelectOptions"
            @update:value="onCitySelect"
          />
          <n-select v-model:value="form.county" :options="countySelectOptions" />
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">是否重点监管取水口</span>
        <span class="ctl">
          <n-radio-group v-model:value="form.focus" class="lcm-cks">
            <n-radio v-for="o in YES_NO" :key="o" :value="o">{{ o }}</n-radio>
          </n-radio-group>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">是否大中型灌区</span>
        <span class="ctl">
          <n-radio-group v-model:value="form.big" class="lcm-cks">
            <n-radio v-for="o in YES_NO" :key="o" :value="o">{{ o }}</n-radio>
          </n-radio-group>
        </span>
      </div>
      <div class="fitem">
        <span class="lbl">是否典型小型灌区</span>
        <span class="ctl">
          <n-radio-group v-model:value="form.small" class="lcm-cks">
            <n-radio v-for="o in YES_NO" :key="o" :value="o">{{ o }}</n-radio>
          </n-radio-group>
        </span>
      </div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn" type="button" @click="onReset">重 置</button>
        <button class="lcm-btn primary" type="button" @click="onSave">保 存</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;
@use '@/assets/style/water-filter.scss' as wf;

/* ================= 分栏表单（复刻原型 licform） ================= */
.licform {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px 42px;

  /* 已发证的编辑态提示：说明哪些字段被锁定 */
  .lock-tip {
    grid-column: 1/-1;
    margin: 0 0 2px;
    padding: 5px 10px;
    font-size: lic.$font-xs;
    line-height: 1.5;
    color: #a06a00;
    background: #fff8e8;
    border: 1px solid #ffe1b0;
    border-radius: 3px;
  }

  .sect {
    @include lic.sect-title;

    grid-column: 1/-1;
    margin: 6px 0 1px;

    &:first-child {
      margin-top: 0;
    }
  }

  .fitem {
    display: flex;
    align-items: center;
    min-width: 0;
    margin-bottom: 10px;

    &.span2 {
      grid-column: 1/-1;
    }

    &.top {
      align-items: flex-start;

      > .lbl {
        padding-top: 6px;
      }
    }

    > .lbl {
      flex: none;
      width: 145px;
      padding-right: 10px;
      color: lic.$c-text;
      text-align: left;
      font-size: lic.$font-title;

      &.req::before {
        content: '*';
        margin-right: 2px;
        color: lic.$c-req;
      }

      /* 字段下方的说明文字 */
      i {
        display: block;
        margin-top: 1px;
        font-size: lic.$font-hint;
        font-style: normal;
        font-weight: 400;
        color: lic.$c-muted;
      }
    }

    .ctl {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    /* Naive UI 输入框：与下拉框保持同一套外观（28px 高 / 3px 圆角 / 同色边框） */
    :deep(.n-input) {
      @include wf.ninput(28px, lic.$font-title, lic.$c-border, lic.$c-text, lic.$c-focus);
    }

    /* Naive UI 下拉框：与输入框同一套外观；同一行多个下拉时等分宽度 */
    :deep(.n-select) {
      flex: 1;
      min-width: 0;
      width: 100%;

      .n-base-selection {
        @include wf.nselect(28px, lic.$font-title, lic.$c-border, lic.$c-text, lic.$c-focus);
      }
    }

    .unit {
      flex: none;
      font-size: lic.$font-xs;
      color: lic.$c-secondary;
    }
  }
}

/* 单选组（Naive UI n-radio） */
.lcm-cks {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  font-size: lic.$font-sm;
  color: lic.$c-text;

  :deep(.n-radio) {
    --n-font-size: #{lic.$font-sm} !important;
    --n-radio-size: 14px !important;
    --n-label-padding: 0 0 0 6px !important;
    --n-text-color: #{lic.$c-text} !important;
    --n-color-active: #{lic.$c-blue} !important;
    --n-dot-color-active: #fff !important;
    cursor: pointer;
  }
}

/* ================= 取水口明细表 ================= */
.ntable {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  .nhead,
  .nrow {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nhead i {
    font-size: lic.$font-head;
    font-style: normal;
    color: lic.$c-head;

    &.c1 {
      flex: none;
      width: 170px;
    }

    &.c2 {
      flex: 1;
    }

    &.c3 {
      flex: none;
      width: 150px;
    }

    &.c4 {
      flex: none;
      width: 58px;
    }
  }

  .nrow :deep(.n-input.ncno) {
    flex: none;
    width: 170px;
  }

  .nrow :deep(.n-input.ncpos) {
    flex: 1;
    width: auto;
    min-width: 0;
  }

  .nrow :deep(.n-select.nceng) {
    flex: none;
    width: 150px;
  }
}

.nbtns {
  display: flex;
  flex: none;
  gap: 6px;
  width: 58px;
}

.nbtn {
  flex: none;
  width: 26px;
  height: 28px;
  padding: 0;
  font-family: inherit;
  font-size: 15px;
  line-height: 1;
  color: lic.$c-blue;
  background: #fff;
  border: 1px solid lic.$c-blue-border;
  border-radius: 3px;
  cursor: pointer;

  &.del {
    color: lic.$c-req;
    border-color: #f0bdb8;
  }

  &:hover {
    background: #eaf4ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* 有效期区间 */
.vrange {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: lic.$font-xs;
  color: lic.$c-secondary;
}

/* ================= 底部按钮（原型样式） ================= */
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

