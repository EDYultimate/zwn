<script setup lang="ts">
// ============================================================
// 生成建议 · 取水计划建议表弹框（文档式，支持下载 Word / 打印）
// 复刻原型 openPwSugg，浅色弹框样式
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import type { PlanRowLike } from './PlanFormModal.vue'

const visible = ref(false)
const row = ref<PlanRowLike | null>(null)
const docRef = ref<HTMLDivElement | null>(null)

const MONTH_W = [3, 3, 7, 10, 11, 10, 9, 7, 8, 6, 3, 3]

function fmt(x: number | null | undefined): string {
  return x === null || x === undefined ? '—' : Number(x).toLocaleString()
}

function show(r: PlanRowLike) {
  row.value = r
  visible.value = true
}

/** 演示用联系人信息（由证号推导，保证同一证号结果稳定） */
const unit = computed(() => {
  const cert = row.value?.cert || ''
  let s = 0
  cert.split('').forEach((ch) => (s += ch.charCodeAt(0)))
  const names = ['王建军', '李国强', '张志伟', '赵立新', '陈永刚', '刘洪波', '孙世昌', '马卫东']
  const contacts = ['刘建波', '王海燕', '李晓东', '陈志明', '赵春生', '孙立军']
  return {
    legal: names[s % names.length],
    contact: contacts[s % contacts.length],
    phone: '138' + String((s * 7919) % 100000000).padStart(8, '0'),
    addr: (row.value?.area || '').replace(/ /g, '') + (row.value?.proj || '') + '管理站'
  }
})

const licMeta = computed(() => {
  const r = row.value
  const proj = r?.proj || ''
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
  const amt = r?.amt || 0
  return {
    place: ((r?.area || '') + (r?.outlet || '')).replace(/ /g, ''),
    use,
    src,
    amtS: src === '地下水' ? '0' : fmt(amt),
    amtG: src === '地下水' ? fmt(amt) : '0'
  }
})

/** 建议逐月计划：按灌溉权重拆分后，地表/地下各半 */
const monthPairs = computed(() => {
  const amt = row.value?.amt || 0
  const S = MONTH_W.reduce((a, b) => a + b, 0)
  const rows = MONTH_W.map((w) => Math.round((amt * w) / S))
  rows[4] += amt - rows.reduce((a, b) => a + b, 0)
  return rows.map((v) => {
    const s = Math.round((v / 2) * 10) / 10
    return [s, Math.round((v - s) * 10) / 10]
  })
})

const totals = computed(() => {
  const s = Math.round(monthPairs.value.reduce((a, m) => a + m[0], 0) * 10) / 10
  const g = Math.round(monthPairs.value.reduce((a, m) => a + m[1], 0) * 10) / 10
  return { s, g, all: Math.round((s + g) * 10) / 10 }
})

/** 用途申请量：按取水用途落一栏 */
const useRows = computed(() => {
  const meta = licMeta.value
  const amt = fmt(row.value?.amt || 0)
  const pick = (name: string) =>
    meta.use === name
      ? { s: meta.src === '地下水' ? '' : amt, g: meta.src === '地下水' ? amt : '' }
      : { s: '', g: '' }
  return [
    { l1: '农业', v1: pick('农业灌溉'), l2: '供水企业', v2: pick('城市供水') },
    { l1: '工业', v1: pick('工业用水'), l2: '水力发电', v2: pick('水力发电') },
    { l1: '生活', v1: pick('生活用水'), l2: '其他行业', v2: { s: '', g: '' } }
  ]
})

const today = '2026 年 09 月 03 日'

function download() {
  const el = docRef.value
  if (!el || !row.value) {
    return
  }
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${row.value.year}年度取水计划建议表</title>
<style>@page{size:A4;margin:2cm}body{font-family:"SimSun","宋体",serif;color:#000}
table{width:100%;border-collapse:collapse}td,th{border:1px solid #000;padding:4px 6px;font-size:12px}
.lb{background:#f2f2f2;white-space:nowrap}.sect{text-align:center;font-weight:700}
.sg-title{text-align:center;font-size:18px;font-weight:700;margin:6px 0}
.sg-sub{text-align:center;font-size:12px;margin-bottom:8px}
.sg-meta{display:flex;justify-content:space-between;font-size:12px;margin:8px 0}
.stamp{height:70px;text-align:center;vertical-align:bottom;color:#555}</style></head>
<body>${el.innerHTML}</body></html>`
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${row.value.year}年度取水计划建议表.doc`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    URL.revokeObjectURL(a.href)
    a.remove()
  }, 800)
}

function print() {
  const el = docRef.value
  if (!el) {
    return
  }
  const f = document.createElement('iframe')
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'
  document.body.appendChild(f)
  const d = f.contentWindow?.document
  if (!d) {
    return
  }
  d.open()
  d.write(`<html><head><meta charset="utf-8"><style>@page{size:A4;margin:14mm 12mm}
body{font-family:"SimSun","宋体",serif;color:#000}
table{width:100%;border-collapse:collapse}td,th{border:1px solid #000;padding:4px 6px;font-size:12px}
.lb{background:#f2f2f2;white-space:nowrap}.sect{text-align:center;font-weight:700}
.sg-title{text-align:center;font-size:18px;font-weight:700;margin:6px 0}
.sg-sub{text-align:center;font-size:12px;margin-bottom:8px}
.sg-meta{display:flex;justify-content:space-between;font-size:12px;margin:8px 0}
.stamp{height:70px;text-align:center;vertical-align:bottom;color:#555}</style></head>
<body>${el.outerHTML}</body></html>`)
  d.close()
  setTimeout(() => {
    f.contentWindow?.focus()
    f.contentWindow?.print()
  }, 150)
  setTimeout(() => f.remove(), 5000)
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="取水计划建议表"
    table-theme="light"
    content-mode="scroll"
    default-padding="12px 24px 6px"
    :style-params="{ width: '1000px', height: '720px' }"
  >
    <div ref="docRef" class="sg-doc">
      <div class="sg-title">{{ row?.year }} 年度取水计划建议表</div>
      <div class="sg-sub">（取水户申报填写，水量单位：万 m³）</div>
      <div class="sg-meta">
        <span>取水单位填报人：{{ unit.contact }}</span>
        <span>填报日期：{{ today }}</span>
      </div>

      <table class="sgt">
        <colgroup>
          <col style="width: 26px" />
          <col style="width: 110px" />
          <col />
          <col style="width: 70px" />
          <col />
          <col style="width: 84px" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td class="lb" colspan="2">取水单位名称</td>
            <td colspan="5">{{ row?.owner }}</td>
          </tr>
          <tr>
            <td class="lb" colspan="2">法人代表</td>
            <td>{{ unit.legal }}</td>
            <td class="lb">联系人</td>
            <td>{{ unit.contact }}</td>
            <td class="lb">联系电话</td>
            <td>{{ unit.phone }}</td>
          </tr>
          <tr>
            <td class="lb" colspan="2">取水单位地址</td>
            <td colspan="5">{{ unit.addr }}</td>
          </tr>
          <tr>
            <td class="side" rowspan="5">取水许可证<br />信　息</td>
            <td class="lb">证号</td>
            <td>{{ row?.cert }}</td>
            <td class="lb">取水地点</td>
            <td colspan="3">{{ licMeta.place }}</td>
          </tr>
          <tr>
            <td class="lb">取水用途</td>
            <td>{{ licMeta.use }}</td>
            <td class="lb">退水地点及退水量</td>
            <td colspan="3">无退水</td>
          </tr>
          <tr>
            <td class="lb">水源类型</td>
            <td>{{ licMeta.src }}</td>
            <td class="lb">有效期限</td>
            <td colspan="3">2021.12.19-2026.12.18</td>
          </tr>
          <tr>
            <td class="lb">许可水量</td>
            <td>{{ fmt(row?.amt) }}</td>
            <td class="lb">其中：地表水</td>
            <td colspan="3">{{ licMeta.amtS }}</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td class="lb">其中：地下水</td>
            <td colspan="3">{{ licMeta.amtG }}</td>
          </tr>

          <tr>
            <td colspan="7" class="sect">取水用途及年申请取水量</td>
          </tr>
          <tr>
            <td class="lb" rowspan="2" colspan="2">用途</td>
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
          <tr v-for="u in useRows" :key="u.l1">
            <td colspan="2" class="lb">{{ u.l1 }}</td>
            <td>{{ u.v1.s }}</td>
            <td>{{ u.v1.g }}</td>
            <td class="lb">{{ u.l2 }}</td>
            <td>{{ u.v2.s }}</td>
            <td>{{ u.v2.g }}</td>
          </tr>

          <tr>
            <td colspan="7" class="sect">申请逐月取水计划</td>
          </tr>
          <tr>
            <td class="lb" rowspan="2" colspan="2">月份</td>
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
            <td colspan="2" class="lb">{{ i }} 月</td>
            <td>{{ monthPairs[i - 1][0] }}</td>
            <td>{{ monthPairs[i - 1][1] }}</td>
            <td class="lb">{{ i + 6 }} 月</td>
            <td>{{ monthPairs[i + 5][0] }}</td>
            <td>{{ monthPairs[i + 5][1] }}</td>
          </tr>
          <tr>
            <td colspan="3" class="lb">全年合计</td>
            <td colspan="4">{{ fmt(totals.all) }}</td>
          </tr>
          <tr>
            <td class="lb lbwrap" colspan="2">海委直属管理局审核意见</td>
            <td colspan="5" class="stamp">（单位盖章）<br /><br />年　　月　　日</td>
          </tr>
          <tr>
            <td class="lb lbwrap" colspan="2">管理机关核定<br />意　见</td>
            <td colspan="5" class="stamp">（单位盖章）<br /><br />年　　月　　日</td>
          </tr>
          <tr>
            <td class="lb" colspan="2">备注</td>
            <td colspan="5" class="remark"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn primary" type="button" @click="download">下 载</button>
        <button class="lcm-btn primary" type="button" @click="print">打 印</button>
        <button class="lcm-btn" type="button" @click="visible = false">关 闭</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
@use '@/assets/style/lic-modal-common.scss' as lic;

/* 文档式建议表 */
.sg-doc {
  font-family: 'SimSun', '宋体', serif;
  color: #000;
}

.sg-title {
  margin: 4px 0 2px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.sg-sub {
  margin-bottom: 8px;
  font-size: lic.$font-sm;
  color: lic.$c-secondary;
  text-align: center;
}

.sg-meta {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: lic.$font-sm;
  color: lic.$c-text;
}

/* 文档式建议表（样式取自公共 lic(sheet-table)） */
.sgt {
  @include lic.sheet-table;
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
