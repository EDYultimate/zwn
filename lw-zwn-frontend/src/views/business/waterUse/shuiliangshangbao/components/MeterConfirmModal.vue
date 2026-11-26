<script setup lang="ts">
// ============================================================
// 月度水量确认单弹框（复刻原型 openPwMeterConfirm / pwCfmDocHtml）
// 预览确认单，支持打印与导出 Word（.doc）
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { confirmDocData, fmt } from '../meterShared'

const visible = ref(false)
const docId = ref('')
const docMonth = ref('')

/** 确认单数据（读取共享状态，随填报实时变化） */
const data = computed(() => confirmDocData(docId.value, docMonth.value))

/** 打开弹框 */
function show(id: string, month: string) {
  docId.value = id
  docMonth.value = month
  visible.value = true
}

/** 确认单正文（同时用于页面预览、打印、导出 Word） */
const docHtml = computed(() => {
  const d = data.value
  if (!d) {
    return ''
  }
  const row = (k: string, v: string) => `<tr><td class="k">${k}</td><td>${v}</td></tr>`
  return `
    <div class="cfm-title">${d.year}年${d.month}月取水量确认单</div>
    <div class="cfm-sect">一、取水工程情况</div>
    <table class="cfm-table">
      ${row('取水口名称', d.outlet)}
      ${row('取水权人', d.owner)}
      ${row('年许可取水量（万m³）', fmt(d.amt))}
    </table>
    <div class="cfm-sect">二、月度取水量（单位：万m³）</div>
    <table class="cfm-table">
      <tr><td class="k">项目</td><td class="c th">月度取水量</td></tr>
      ${row('许可取水量', fmt(d.man))}
      ${row('生态补水量', fmt(d.eco))}
      ${row('应急取水量', fmt(d.emg))}
      ${row('水权交易量', fmt(d.trade))}
    </table>
    <div class="cfm-sect">三、年度累计取水量（万m³）</div>
    <table class="cfm-table">
      ${row(`许可取水量（1-${d.month}月累计）`, fmt(d.c1))}
      ${row('生态补水量', fmt(d.c2))}
      ${row('应急取水量', fmt(d.c3))}
      ${row('水权交易量', fmt(d.c4))}
    </table>
    <div class="cfm-sect">四、双方确认</div>
    <table class="cfm-table">
      ${row('取水户确认', '经办人（盖章）：　　　　　　　日期：　　　　年　　月　　日')}
      ${row('监管单位确认', '核对人（盖章）：　　　　　　　日期：　　　　年　　月　　日')}
    </table>
    <div class="cfm-note">注：许可取水量按人工填报（上报）水量计；生态补水量、应急取水量、水权交易量按《水量确认单》填报数据计，未填报按 0 计。</div>
  `
})

/** 打印 / 导出共用的文档样式（预览用下方非 scoped 样式，导出时内联） */
const DOC_CSS = `
html,body{margin:0;padding:0}
.cfm-doc{padding:26px 36px 30px;font-family:'仿宋','FangSong','宋体','SimSun',serif;color:#111;background:#fff}
.cfm-title{font-family:'宋体','SimSun',serif;font-size:21px;font-weight:700;letter-spacing:2px;text-align:center;padding-bottom:8px}
.cfm-sect{margin:14px 0 8px;font-size:14.5px;font-weight:700}
.cfm-table{width:100%;border-collapse:collapse}
.cfm-table td{padding:7px 12px;font-size:13.5px;text-align:left;border:1px solid #333}
.cfm-table td.k{width:230px;font-weight:700}
.cfm-table td.c{text-align:center}
.cfm-table td.th{font-weight:700}
.cfm-note{margin-top:12px;font-size:12px;color:#666}
`

/** 组装可独立打开的完整 HTML */
function buildDocHtml(title: string): string {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${title}</title><style>@page{size:A4;margin:2cm}body{font-family:'仿宋','FangSong','宋体','SimSun',serif;color:#000}${DOC_CSS}</style></head><body><div class="cfm-doc">${docHtml.value}</div></body></html>`
}

/** 打印确认单 */
function printDoc() {
  if (!data.value) {
    return
  }
  const frame = document.createElement('iframe')
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
  document.body.appendChild(frame)
  const doc = frame.contentWindow?.document
  if (!doc) {
    frame.remove()
    return
  }
  doc.open()
  doc.write(buildDocHtml(`${data.value.year}年${data.value.month}月取水量确认单`))
  doc.close()
  window.setTimeout(() => {
    frame.contentWindow?.focus()
    frame.contentWindow?.print()
  }, 150)
  window.setTimeout(() => frame.remove(), 5000)
}

/** 导出 Word（.doc） */
function exportWord() {
  if (!data.value) {
    return
  }
  const title = `${data.value.year}年${data.value.month}月取水量确认单`
  const blob = new Blob(['\uFEFF' + buildDocHtml(title)], { type: 'application/msword' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${title}.doc`
  document.body.appendChild(a)
  a.click()
  window.setTimeout(() => {
    URL.revokeObjectURL(a.href)
    a.remove()
  }, 800)
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="data ? `月度水量确认单（${data.year}年${data.month}月）` : '月度水量确认单'"
    table-theme="light"
    content-mode="scroll"
    default-padding="0"
    :style-params="{ width: '880px' }"
  >
    <div class="cfm-wrap">
      <!-- 确认单正文由本地数据拼装（非用户输入），打印 / 导出复用同一段 HTML -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="cfm-doc" v-html="docHtml"></div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn primary" type="button" @click="printDoc">打 印</button>
        <button class="lcm-btn primary" type="button" @click="exportWord">导出Word</button>
        <button class="lcm-btn" type="button" @click="visible = false">关 闭</button>
      </div>
    </template>
  </pro-modal>
</template>

<style lang="scss">
/* 预览用样式：弹框内容 teleport 到 body，故不加 scoped，统一挂在 .cfm-doc 下 */
.cfm-wrap {
  padding: 10px 16px 14px;
  background: #eef4fb;
}

.cfm-doc {
  max-width: 760px;
  padding: 26px 36px 30px;
  margin: 0 auto;
  font-family: '仿宋', 'FangSong', '宋体', 'SimSun', serif;
  color: #111;
  background: #fff;
}

.cfm-title {
  padding-bottom: 8px;
  font-family: '宋体', 'SimSun', serif;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
}

.cfm-sect {
  margin: 14px 0 8px;
  font-size: 14.5px;
  font-weight: 700;
}

.cfm-table {
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 7px 12px;
    font-size: 13.5px;
    text-align: left;
    border: 1px solid #333;

    &.k {
      width: 230px;
      font-weight: 700;
    }

    &.c {
      text-align: center;
    }

    &.th {
      font-weight: 700;
    }
  }
}

.cfm-note {
  margin-top: 12px;
  font-size: 12px;
  color: #666;
}
</style>

<style scoped lang="scss">
/* 底部按钮（与证照管理弹框统一） */
.lcm-foot {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 10px;
}

.lcm-btn {
  height: 30px;
  padding: 0 20px;
  font-family: inherit;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: #a9bdd6;
  border: none;
  border-radius: 15px;

  &.primary {
    background: linear-gradient(180deg, #4fa0f4, #1f6fd6);
  }

  &:hover {
    filter: brightness(1.06);
  }
}
</style>
