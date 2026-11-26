<script setup lang="ts">
// ============================================================
// 智能体一 · 水资源论证报告审查（复刻原型 agArgue / awAutoBtn）
// 报告检索与载入 → 全文解析 / 形式审查 / 技术审查 / 红线核查 / 审查结果
// ============================================================
import { computed, ref } from 'vue'
import { KB_DOCS, type KbDoc } from '../../data'

const emit = defineEmits<{ notify: [msg: string] }>()

const reports = KB_DOCS.report
const cur = ref<KbDoc>(reports[0] as KbDoc)
const keyword = ref('')
const tab = ref<'parse' | 'format' | 'tech' | 'redline' | 'result'>('parse')
const parsed = ref(false)
const reviewed = ref(false)
const fileName = ref('')

// 检索报告（名称 / 编制单位 / 业主）
const searchResult = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) {
    return []
  }
  return reports.filter((d) => {
    const hay = [d.name, d.sub, ...d.meta.map((m) => m[1])].join(' ')
    return hay.indexOf(kw) >= 0
  })
})

// 当前报告要素（键 → 值）
function metaOf(d: KbDoc, key: string): string {
  return d.meta.find((m) => m[0] === key)?.[1] ?? ''
}

/* ---------------- 审查项 ---------------- */
interface ChkItem {
  nm: string
  st: 'pass' | 'warn' | 'fail'
  why: string
  rule: string
}

function buildChecks(d: KbDoc): { format: ChkItem[]; tech: ChkItem[]; redline: ChkItem[] } {
  const level = metaOf(d, '工作等级') || '三级'
  const amt = metaOf(d, '论证取水量') || '—'
  const owner = metaOf(d, '业主单位') || '—'
  return {
    format: [
      {
        nm: '报告封面与扉页要素',
        st: 'pass',
        why: '报告名称、编制单位、资质等级、编制日期齐全',
        rule: 'SL/T 525 报告书编制要求 3.1'
      },
      {
        nm: '编制单位资质符合工作等级',
        st: 'pass',
        why: `${level}项目由具备相应资质的单位编制`,
        rule: '建设项目水资源论证管理办法 第7条'
      },
      {
        nm: '报告章节结构完整性',
        st: 'pass',
        why: '总论、水资源状况、取水方案、影响分析、节水评价、结论六章齐全',
        rule: 'SL/T 525 报告书章节要求'
      },
      {
        nm: '附图、附件与计量方案',
        st: 'warn',
        why: '退水口位置图未标注高程基准，建议补充',
        rule: 'SL/T 525 附图表要求 5.4'
      },
      {
        nm: '报告版本与签章',
        st: 'pass',
        why: '上报电子版加盖编制单位公章',
        rule: '取水许可管理办法 第12条'
      }
    ],
    tech: [
      {
        nm: '取水水源可靠性',
        st: 'pass',
        why: '来水量与保证率满足项目取水需求，水源可靠',
        rule: 'SL/T 525 第6章 水源论证'
      },
      {
        nm: '用水合理性（定额对标）',
        st: 'warn',
        why: `论证取水量 ${amt}，建议与同类项目先进值逐项对标复核`,
        rule: '用水定额标准 + 节水评价要求'
      },
      {
        nm: '区域用水总量与分配指标符合性',
        st: 'pass',
        why: '取水量在区域可分配指标范围内',
        rule: '跨省河流水量分配方案 + 用水总量控制指标'
      },
      {
        nm: '退水影响与节水措施',
        st: 'pass',
        why: '退水方案明确，节水措施与计量监测方案可行',
        rule: 'SL/T 525 第8章 影响分析'
      },
      {
        nm: '业主单位与取水口信息一致性',
        st: 'pass',
        why: `业主 ${owner} 与取水口位置描述一致`,
        rule: '取水许可管理办法 第10条'
      }
    ],
    redline: [
      {
        nm: '是否位于禁止取水区域',
        st: 'pass',
        why: '取水口不在禁止取水区、地下水超采区',
        rule: '海委取水审批规则 不予批准情形(一)(二)'
      },
      {
        nm: '是否超出区域用水总量控制指标',
        st: 'pass',
        why: '未突破所在县域用水总量控制指标',
        rule: '海委取水审批规则 不予批准情形(五)'
      },
      {
        nm: '是否影响河道内基本生态水量',
        st: 'pass',
        why: '预留河道内基本生态水量后仍满足取水需求',
        rule: '海委取水审批规则 不予批准情形(七)'
      }
    ]
  }
}

const checks = computed(() => buildChecks(cur.value))
const allChecks = computed(() => [
  ...checks.value.format,
  ...checks.value.tech,
  ...checks.value.redline
])
const cnt = computed(() => ({
  format: checks.value.format.filter((c) => c.st !== 'pass').length,
  tech: checks.value.tech.filter((c) => c.st !== 'pass').length,
  redline: checks.value.redline.filter((c) => c.st !== 'pass').length,
  fail: allChecks.value.filter((c) => c.st === 'fail').length,
  warn: allChecks.value.filter((c) => c.st === 'warn').length,
  pass: allChecks.value.filter((c) => c.st === 'pass').length
}))

/* ---------------- 交互 ---------------- */
function pick(d: KbDoc) {
  cur.value = d
  keyword.value = ''
  tab.value = 'parse'
  parsed.value = false
  reviewed.value = false
  fileName.value = ''
  emit('notify', `已载入《${d.name}》`)
}

function doParse() {
  parsed.value = true
  tab.value = 'parse'
  emit('notify', '全文解析完成')
}

function doReview() {
  reviewed.value = true
  tab.value = 'result'
  emit('notify', `自动审查完成：通过 ${cnt.value.pass} 项，待完善 ${cnt.value.warn} 项`)
}

function reset() {
  tab.value = 'parse'
  parsed.value = false
  reviewed.value = false
  fileName.value = ''
  emit('notify', '已重置审查状态')
}

// 上传报告（演示：仅记录文件名）
function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) {
    return
  }
  fileName.value = f.name
  emit('notify', `已上传《${f.name}》，可点击全文解析`)
}

// 下载审查意见
function downloadOpinion() {
  if (!reviewed.value) {
    emit('notify', '请先执行自动审查')
    return
  }
  const lines = [
    `水资源论证报告审查意见`,
    '',
    `报告名称：${cur.value.name}`,
    `报告编号：${metaOf(cur.value, '报告编号') || '—'}`,
    `编制单位：${metaOf(cur.value, '编制单位') || '—'}`,
    `业主单位：${metaOf(cur.value, '业主单位') || '—'}`,
    `工作等级：${metaOf(cur.value, '工作等级') || '—'}`,
    `论证取水量：${metaOf(cur.value, '论证取水量') || '—'}`,
    '',
    `审查结论：通过 ${cnt.value.pass} 项，待完善 ${cnt.value.warn} 项，不予通过 ${cnt.value.fail} 项`,
    '',
    ...allChecks.value.map(
      (c, i) =>
        `${i + 1}. ${c.nm}：${c.st === 'pass' ? '通过' : c.st === 'warn' ? '待完善' : '不通过'}｜${c.why}（依据：${c.rule}）`
    )
  ]
  const a = document.createElement('a')
  a.href = URL.createObjectURL(
    new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8' })
  )
  a.download = '水资源论证报告审查意见.txt'
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  emit('notify', '审查意见已开始下载')
}

// 归档知识库
function archive() {
  emit('notify', `《${cur.value.name}》及审查意见已归档到知识库`)
}

const ST_TEXT = { pass: '通过', warn: '待完善', fail: '不通过' }
</script>

<template>
  <div class="argue">
    <!-- 报告检索 -->
    <div class="aw-search">
      <input
        v-model="keyword"
        placeholder="搜索审查报告：输入报告名称 / 编制单位 / 业主单位关键词，查看并可载入审查报告信息"
        @keydown.enter="searchResult[0] && pick(searchResult[0])"
      />
      <button class="aw-btn" type="button" @click="searchResult[0] && pick(searchResult[0])">
        🔍 搜索报告
      </button>
    </div>
    <div v-if="searchResult.length" class="aw-sres">
      <div class="sres-hd">检索到 {{ searchResult.length }} 份报告：</div>
      <div v-for="d in searchResult" :key="d.name" class="sres-item" @click="pick(d)">
        <b>{{ d.name }}</b>
        <span>{{ d.sub }}</span>
      </div>
    </div>

    <!-- 报告头 -->
    <div class="aw-rhead">
      <div class="aw-rh-top">
        <div class="rh-main">
          <h2>
            {{ cur.name }}
            <span class="aw-tag">{{ reviewed ? '已审查' : '待审查' }}</span>
          </h2>
          <div class="rh-sub">
            报告编号 {{ metaOf(cur, '报告编号') || '—' }} · 编制单位：{{
              metaOf(cur, '编制单位') || cur.sub
            }}
          </div>
          <div v-if="fileName" class="rh-file">已上传：{{ fileName }}</div>
        </div>
        <div class="aw-rh-btns">
          <label class="aw-btn">
            📎 上传报告
            <input type="file" accept=".pdf,.doc,.docx" @change="onFile" />
          </label>
          <button class="aw-btn" type="button" @click="doParse">📑 全文解析</button>
          <button class="aw-btn pri" type="button" @click="doReview">⚡ 自动审查</button>
          <button class="aw-btn" type="button" @click="downloadOpinion">下载意见</button>
          <button class="aw-btn" type="button" @click="archive">归档知识库</button>
          <button class="aw-btn ghost" type="button" @click="reset">重 置</button>
        </div>
      </div>
      <div class="aw-mgrid">
        <div v-for="m in cur.meta" :key="m[0]" class="mg">
          <span>{{ m[0] }}</span>
          <b>{{ m[1] }}</b>
        </div>
      </div>
    </div>

    <!-- 页签 -->
    <div class="aw-tabs">
      <div class="aw-tab" :class="{ on: tab === 'parse' }" @click="tab = 'parse'">全文解析</div>
      <div class="aw-tab" :class="{ on: tab === 'format' }" @click="tab = 'format'">
        形式审查 <span class="aw-badge">{{ cnt.format }}</span>
      </div>
      <div class="aw-tab" :class="{ on: tab === 'tech' }" @click="tab = 'tech'">
        技术内容审查 <span class="aw-badge">{{ cnt.tech }}</span>
      </div>
      <div class="aw-tab" :class="{ on: tab === 'redline' }" @click="tab = 'redline'">
        审批红线核查 <span class="aw-badge">{{ cnt.redline }}</span>
      </div>
      <div class="aw-tab" :class="{ on: tab === 'result' }" @click="tab = 'result'">审查结果</div>
    </div>

    <!-- 全文解析 -->
    <div v-if="tab === 'parse'" class="aw-pane">
      <div class="aw-ptitle"><span class="dot"></span>全文解析（报告书结构化解析结果）</div>
      <div class="aw-pdesc">
        系统对送审报告书进行全文结构化解析，抽取章节结构、图表附件与关键要素，并自动关联到审查项。点击顶部「📑
        全文解析」执行。
      </div>
      <div v-if="!parsed" class="aw-banner idle">尚未解析，请点击顶部「📑 全文解析」。</div>
      <div v-else class="parse-body">
        <div class="parse-sec">
          <b>关键要素</b>
          <div class="parse-grid">
            <span v-for="m in cur.meta" :key="m[0]"
              >{{ m[0] }}：<em>{{ m[1] }}</em></span
            >
          </div>
        </div>
        <div class="parse-sec">
          <b>章节结构</b>
          <ol>
            <li>总论（项目概况 / 编制依据）</li>
            <li>水资源状况及开发利用分析</li>
            <li>取水方案与水源可靠性论证</li>
            <li>用水合理性分析与节水评价</li>
            <li>取水影响与退水影响分析</li>
            <li>水资源保护措施与计量监测方案</li>
            <li>结论与建议</li>
          </ol>
        </div>
        <div class="parse-sec">
          <b>报告说明</b>
          <p v-for="(d, i) in cur.desc" :key="i">{{ d }}</p>
        </div>
      </div>
    </div>

    <!-- 形式 / 技术 / 红线 -->
    <div v-else-if="tab !== 'result'" class="aw-pane">
      <div class="aw-ptitle">
        <span class="dot" :class="{ red: tab === 'redline' }"></span>
        {{
          tab === 'format'
            ? '一、形式审查'
            : tab === 'tech'
              ? '二、技术内容审查（实质审查）'
              : '三、审批红线核查（不予批准情形）'
        }}
      </div>
      <div class="aw-pdesc">
        {{
          tab === 'format'
            ? '依据《建设项目水资源论证导则》（SL/T 525）及水利部报告书编制要求，系统按内置规则对每个细项自动核定。'
            : tab === 'tech'
              ? '依据《海委取水审批规则》与取水许可制度，对取水合法性、可靠性、合理性及影响进行实质性审查。'
              : '依据《海委取水审批规则》「不予批准的取水许可申请」逐条自动排查，触发任一条即应不予批准。'
        }}
      </div>
      <table class="aw-tbl">
        <thead>
          <tr>
            <th style="width: 46px">序号</th>
            <th>审查项</th>
            <th style="width: 80px">结果</th>
            <th>说明</th>
            <th style="width: 280px">规则依据</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(c, i) in tab === 'format'
              ? checks.format
              : tab === 'tech'
                ? checks.tech
                : checks.redline"
            :key="c.nm"
          >
            <td class="c">{{ i + 1 }}</td>
            <td>{{ c.nm }}</td>
            <td>
              <span class="stx" :class="c.st">{{ ST_TEXT[c.st] }}</span>
            </td>
            <td class="why">{{ c.why }}</td>
            <td class="rule">{{ c.rule }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 审查结果 -->
    <div v-else class="aw-pane">
      <div class="aw-ptitle"><span class="dot"></span>四、自动审查结果（内置海委规则引擎）</div>
      <div class="aw-pdesc">
        点击顶部「⚡
        自动审查」后，系统依据内置《海委取水审批规则》与导则逐条判定，此处列出全部判定结果，未通过项附问题原因与规则依据。
      </div>
      <div v-if="!reviewed" class="aw-banner idle">
        尚未运行自动审查，请点击顶部「⚡ 自动审查」。
      </div>
      <template v-else>
        <div class="aw-banner" :class="cnt.fail ? 'r-fail' : cnt.warn ? 'r-fix' : 'r-pass'">
          {{
            cnt.fail
              ? '存在不予批准情形，建议退回补正'
              : cnt.warn
                ? '基本可行，需按意见补充完善后复审'
                : '审查通过，取退水方案可行'
          }}
          <span class="sub"
            >通过 {{ cnt.pass }} 项 · 待完善 {{ cnt.warn }} 项 · 不通过 {{ cnt.fail }} 项</span
          >
        </div>
        <table class="aw-tbl">
          <thead>
            <tr>
              <th style="width: 46px">序号</th>
              <th>审查项</th>
              <th style="width: 80px">结果</th>
              <th>问题原因</th>
              <th style="width: 280px">规则依据</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in allChecks" :key="c.nm">
              <td class="c">{{ i + 1 }}</td>
              <td>{{ c.nm }}</td>
              <td>
                <span class="stx" :class="c.st">{{ ST_TEXT[c.st] }}</span>
              </td>
              <td class="why">{{ c.why }}</td>
              <td class="rule">{{ c.rule }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.argue {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow: auto;
  padding-right: 2px;
}

/* 检索 */
.aw-search {
  display: flex;
  flex: none;
  gap: 10px;
}
.aw-search input {
  flex: 1;
  height: 40px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 14px;
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
.aw-btn {
  display: inline-flex;
  flex: none;
  gap: 4px;
  align-items: center;
  height: 36px;
  padding: 0 15px;
  font-family: inherit;
  font-size: 13.5px;
  color: #1f7ae0;
  white-space: nowrap;
  cursor: pointer;
  background: #eef5fd;
  border: 1px solid #c9dcf2;
  border-radius: 5px;

  input {
    display: none;
  }
  &:hover {
    color: #fff;
    background: #1f7ae0;
  }
  &.pri {
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
    border-color: #1f6fd6;
  }
  &.ghost {
    color: #5a7ba6;
    background: #fff;
  }
}

/* 检索结果 */
.aw-sres {
  flex: none;
  padding: 8px 12px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
}
.sres-hd {
  margin-bottom: 5px;
  color: #8aa3c4;
}
.sres-item {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 5px;

  b {
    color: #1a3f6b;
  }
  span {
    margin-left: 10px;
    color: #8aa3c4;
  }
  &:hover {
    background: #f2f8ff;
  }
}

/* 报告头 */
.aw-rhead {
  flex: none;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.07);
}
.aw-rh-top {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.rh-main {
  min-width: 0;

  h2 {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 700;
    color: #1a3f6b;
  }
}
.rh-sub {
  font-size: 12.5px;
  color: #8aa3c4;
}
.rh-file {
  margin-top: 4px;
  font-size: 12.5px;
  color: #149a5b;
}
.aw-tag {
  padding: 1px 9px;
  font-size: 11.5px;
  font-weight: 400;
  color: #c0741b;
  background: #fff7e6;
  border: 1px solid #f0d9a8;
  border-radius: 9px;
}
.aw-rh-btns {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: flex-end;
}
.aw-mgrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px 14px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #e8f0f9;
}
.mg {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  font-size: 12.5px;

  span {
    color: #8aa3c4;
  }
  b {
    overflow: hidden;
    font-weight: 600;
    color: #2a5c94;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* 页签 */
.aw-tabs {
  display: flex;
  flex: none;
  gap: 4px;
  padding: 4px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
}
.aw-tab {
  display: flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  height: 34px;
  font-size: 13.5px;
  color: #4f6f96;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #f2f8ff;
  }
  &.on {
    font-weight: 700;
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  }
  &.on .aw-badge {
    color: #1f6fd6;
    background: #fff;
  }
}
.aw-badge {
  min-width: 18px;
  padding: 0 5px;
  font-size: 11.5px;
  line-height: 16px;
  color: #1f7ae0;
  text-align: center;
  background: #e8f1fd;
  border: 1px solid #bcd7f7;
  border-radius: 9px;
}

/* 内容面板 */
.aw-pane {
  flex: none;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.07);
}
.aw-ptitle {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14.5px;
  font-weight: 700;
  color: #1f4f86;
}
.dot {
  width: 7px;
  height: 7px;
  background: #1f7ae0;
  border-radius: 50%;

  &.red {
    background: #d33b3b;
  }
}
.aw-pdesc {
  margin: 6px 0 10px;
  font-size: 12.5px;
  line-height: 1.7;
  color: #8aa3c4;
}
.aw-banner {
  padding: 10px 14px;
  font-size: 13.5px;
  line-height: 1.8;
  border-radius: 6px;

  .sub {
    display: block;
    font-size: 12.5px;
    opacity: 0.85;
  }
  &.idle {
    color: #8aa3c4;
    background: #f7fbff;
    border: 1px dashed #d5e4f5;
  }
  &.r-pass {
    color: #12865a;
    background: #f1fcf7;
    border: 1px solid #a9e5c9;
  }
  &.r-fix {
    color: #a9701a;
    background: #fffaf0;
    border: 1px solid #f0d9a8;
  }
  &.r-fail {
    color: #c0392b;
    background: #fff6f5;
    border: 1px solid #f0b8b1;
  }
}

/* 解析结果 */
.parse-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.parse-sec {
  font-size: 13px;
  color: #2a3f5c;

  b {
    display: block;
    margin-bottom: 6px;
    color: #1a3f6b;
  }
  p {
    margin: 0 0 5px;
    line-height: 1.8;
    color: #4f6f96;
  }
  ol {
    margin: 0;
    padding-left: 20px;
    line-height: 1.9;
    color: #4f6f96;
  }
}
.parse-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 16px;
  font-size: 12.5px;
  color: #8aa3c4;

  em {
    font-style: normal;
    color: #2a5c94;
  }
}

/* 审查表 */
.aw-tbl {
  width: 100%;
  font-size: 13px;
  border-spacing: 0;
  border-collapse: separate;
  border: 1px solid #e3edf9;
  border-radius: 6px;
  overflow: hidden;

  th {
    padding: 8px 10px;
    font-size: 13px;
    font-weight: 600;
    color: #20517e;
    text-align: left;
    white-space: nowrap;
    background: #e2eefb;
    border-bottom: 1px solid #cfe0f3;
  }
  td {
    padding: 8px 10px;
    line-height: 1.65;
    color: #2a3f5c;
    vertical-align: top;
    border-bottom: 1px solid #eef3fa;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  .c {
    color: #8aa3c4;
    text-align: center;
  }
  .why {
    color: #4f6f96;
  }
  .rule {
    font-size: 12.5px;
    color: #8aa3c4;
  }
}
.stx {
  display: inline-block;
  padding: 1px 8px;
  font-size: 12px;
  border-radius: 3px;

  &.pass {
    color: #149a5b;
    background: #f1fcf7;
    border: 1px solid #39b98a;
  }
  &.warn {
    color: #c0741b;
    background: #fff7e6;
    border: 1px solid #f0d9a8;
  }
  &.fail {
    color: #e2564a;
    background: #fff6f5;
    border: 1px solid #f08a80;
  }
}
</style>
