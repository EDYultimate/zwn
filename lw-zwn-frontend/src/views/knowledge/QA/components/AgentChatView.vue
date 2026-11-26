<script setup lang="ts">
// ============================================================
// 智能问答会话面板（与 /knowledge/testQA 同一套问答效果）
// 流式逐字 + 表格骨架 + 来源角标 + 「点击后才执行」的页面动作按钮
// 通用问答与各业务智能体共用本组件，各自持有独立会话
// ============================================================
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AgentCiteButton from '@/components/common/Agent/AgentCiteButton.vue'
import AgentStreamSlot from '@/components/common/Agent/AgentStreamSlot.vue'
import { useAgentChat } from '../useAgentChat'

const props = withDefaults(
  defineProps<{
    /** 会话标识：不同 key 各自保留记录（路由切换 / 刷新后仍在） */
    chatKey: string
    /**
     * 业务模块标识：发问时透传后端，按模块裁剪工具清单（如取水证模块传 water-cert）。
     * 不传 = 通用问答，后端注入全量工具。
     */
    module?: string
    /** 开场白段落 */
    welcome?: string[]
    /** 开场白下方的数据来源说明 */
    welcomeSource?: string
    /** 输入框占位文案 */
    placeholder?: string
    /** 快捷问题 */
    chips?: string[]
  }>(),
  {
    welcome: () => [],
    welcomeSource: '',
    placeholder: '输入问题，回车发送',
    chips: () => []
  }
)

const msgsEl = ref<HTMLElement | null>(null)

/** 是否跟随最新消息：用户手动往上翻后置 false，滚回底部自动恢复 */
const followBottom = ref(true)
/** 距底部多少像素内仍视为「贴在底部」，避免 1px 误差让跟随失效 */
const BOTTOM_GAP = 32

let resizeObserver: ResizeObserver | null = null

function onMsgsScroll() {
  const el = msgsEl.value
  if (!el) {
    return
  }
  followBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_GAP
}

function stickToBottom() {
  const el = msgsEl.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

const chat = useAgentChat({
  key: props.chatKey,
  module: props.module,
  welcome: props.welcome,
  welcomeSource: props.welcomeSource,
  // force=true 只用于用户自己发问；其余情况（流式逐字）在用户上翻历史时不打扰
  scrollTo: (force?: boolean) => {
    if (force) {
      followBottom.value = true
    }
    if (!followBottom.value) {
      return
    }
    stickToBottom()
  }
})

// 首次进入：直接定位到最后一条消息
onMounted(() => {
  nextTick(stickToBottom)
  const el = msgsEl.value
  if (!el || typeof ResizeObserver === 'undefined') {
    return
  }
  // 容器从隐藏变可见、窗口缩放时保持贴底；内容变高不会改变自身尺寸，因此不会每帧强制滚动
  resizeObserver = new ResizeObserver(() => {
    if (followBottom.value) {
      stickToBottom()
    }
  })
  resizeObserver.observe(el)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

const {
  messages,
  typing,
  streaming,
  input,
  send,
  retryAnswer,
  runEvent,
  clearChat,
  buttonText,
  hasCite,
  answerSegments,
  sourcesOf,
  sourceWhere,
  hrefOf,
  openKbCitation,
  showSlot,
  slotState,
  slotCompact,
  slotShowStatus,
  slotShowRetry,
  refChip,
  refChipClass,
  citeActionLabel,
  kbCiteActionLabel,
  uncitedEvents,
  TABLE_LOADING_TEXT
} = chat

defineExpose({
  /** 供父页面从首页输入框 / 推荐问题直接发起提问 */
  ask: (q: string) => chat.send(q),
  /** 切问答视图时由页面调用：强制回到底部并恢复跟随（容器隐藏期间量不到高度） */
  toBottom: () => {
    followBottom.value = true
    nextTick(stickToBottom)
  }
})
</script>

<template>
  <div class="acv">
    <div ref="msgsEl" class="cg-msgs" @scroll="onMsgsScroll">
      <div v-for="(m, i) in messages" :key="i" class="cg-row" :class="{ u: m.role === 'u' }">
        <div class="cg-av" :class="m.role">{{ m.role === 'u' ? '我' : 'AI' }}</div>
        <div class="cg-bub">
          <template v-if="m.role === 'u'">{{ m.text }}</template>
          <template v-else>
            <div v-if="hasCite(m)" class="cg-cite-hint">
              <span class="cg-cite-hint-ico">↗</span
              >文中角标可点击：蓝色前往对应数据或页面，青色为来源序号（见回答末尾的来源清单）
            </div>
            <!-- 正文逐字流式输出；未完成的表格片段已剥离，交给下方表格槽位承接。
                 片段必须全部内联在同一个 <p> 里：一个片段一个 <p> 时，
                 引用角标一出现，正文和后面的句号就会被拆成上下三行 -->
            <p class="cg-line">
              <template v-for="(seg, si) in answerSegments(m)" :key="'s' + i + '-' + si">
                <AgentCiteButton v-if="seg.pendingCite" pending />
                <AgentCiteButton
                  v-else-if="seg.cite"
                  :cite="seg.cite.cite"
                  :tip="citeActionLabel(seg.cite)"
                  @activate="runEvent(seg.cite!)"
                />
                <AgentCiteButton
                  v-else-if="seg.kbRef"
                  variant="kb"
                  :cite="seg.kbNo"
                  :tip="kbCiteActionLabel(seg.kbRef)"
                  @activate="openKbCitation(seg.kbRef!)"
                />
                <span
                  v-else-if="seg.slot && refChip(seg.slot, m)"
                  class="cg-slot-ref"
                  :class="refChipClass(seg.slot, m)"
                  >{{ refChip(seg.slot, m) }}</span
                >
                <span v-else>{{ seg.text }}</span>
              </template>
            </p>

            <!-- 结构化明细槽位：骨架按加载态展开，done 后原地淡入真实表格 -->
            <AgentStreamSlot
              v-if="showSlot(m, 'table')"
              kind="table"
              :state="slotState(m, 'table')"
              :compact="slotCompact(m, 'table')"
              :show-status="slotShowStatus(m, 'table')"
              :show-retry="slotShowRetry(m, 'table')"
              :hint="m.slots?.hint"
              :loading-text="TABLE_LOADING_TEXT"
              :error-text="m.slots?.error"
              @retry="retryAnswer(m)"
            >
              <div v-for="(d, di) in m.details" :key="'d' + di" class="cg-detail">
                <div v-if="d.title" class="cg-detail-hd">{{ d.title }}</div>
                <table v-if="d.head.length" class="cg-tbl">
                  <thead>
                    <tr>
                      <th v-for="(h, hi) in d.head" :key="'h' + hi">{{ h }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(r, ri) in d.rows" :key="'r' + ri">
                      <td v-for="(c, ci) in r" :key="'c' + ci" :class="{ n: d.num.includes(ci) }">
                        {{ c }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <ul v-if="d.points.length">
                  <li v-for="(pt, pi) in d.points" :key="'pt' + pi">{{ pt }}</li>
                </ul>
                <div v-if="d.note" class="cg-src">{{ d.note }}</div>
              </div>
            </AgentStreamSlot>

            <div v-if="m.note" class="cg-src">{{ m.note }}</div>

            <!-- 页面动作槽位：正文提到入口才展开骨架，done 后淡入按钮 -->
            <AgentStreamSlot
              v-if="showSlot(m, 'actions')"
              kind="actions"
              :state="slotState(m, 'actions')"
              :compact="slotCompact(m, 'actions')"
              :show-status="slotShowStatus(m, 'actions')"
              :show-retry="slotShowRetry(m, 'actions')"
              :hint="m.slots?.hint"
              :error-text="m.slots?.error"
              @retry="retryAnswer(m)"
            >
              <div v-if="uncitedEvents(m.text, m.buttons).length" class="cg-acts">
                <span
                  v-for="(ev, j) in uncitedEvents(m.text, m.buttons)"
                  :key="j"
                  class="cg-act"
                  @click="runEvent(ev)"
                >
                  {{ buttonText(ev) }}
                </span>
              </div>
            </AgentStreamSlot>

            <!-- 来源清单：一份文档一行，序号与正文青色角标一致 -->
            <div v-if="sourcesOf(m).length" class="cg-sources">
              <div class="cg-sources-hd">来源</div>
              <div v-for="s in sourcesOf(m)" :key="s.no" class="cg-source">
                <span class="no">{{ s.no }}</span>
                <div class="txt">
                  <a
                    v-if="hrefOf(s.ref)"
                    class="t"
                    :href="hrefOf(s.ref)"
                    target="_blank"
                    rel="noopener noreferrer"
                    >《{{ s.ref.fileName || s.ref.title || '原文' }}》</a
                  >
                  <span v-else class="t is-off" @click="openKbCitation(s.ref)"
                    >《{{ s.ref.fileName || s.ref.title || '原文' }}》</span
                  >
                  <span v-if="sourceWhere(s)" class="w">{{ sourceWhere(s) }}</span>
                  <span v-if="s.times > 1" class="times">正文引用 {{ s.times }} 处</span>
                  <a
                    v-if="hrefOf(s.ref)"
                    class="addr"
                    :href="hrefOf(s.ref)"
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="hrefOf(s.ref)"
                    >{{ s.ref.filePath }}</a
                  >
                  <span v-else class="addr is-off">索引未记录原文地址</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 流式时已有占位气泡承接等待态，这里不再叠加三个点 -->
      <div v-if="typing && !streaming" class="cg-row a">
        <div class="cg-av a">AI</div>
        <div class="cg-bub">
          <div class="cg-typing"><i></i><i></i><i></i></div>
        </div>
      </div>
    </div>

    <div v-if="chips.length" class="cg-chips">
      <span class="cl">快捷提问：</span>
      <span v-for="c in chips" :key="c" class="cg-chip" @click="send(c)">{{ c }}</span>
    </div>

    <div class="cg-bar">
      <input v-model="input" :placeholder="placeholder" @keydown.enter="send()" />
      <button class="ag-run" type="button" @click="send()">发 送</button>
      <button class="ag-btn ghost" type="button" @click="clearChat">清 空</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.acv {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

/* ===== 消息区 ===== */
.cg-msgs {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  padding: 16px 18px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fbfdff;
  border: 1px solid #e3edf9;
  border-radius: 8px;
}
.cg-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &.u {
    flex-direction: row-reverse;
  }
}
.cg-av {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  border-radius: 50%;

  &.a {
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  }
  &.u {
    background: #8199b8;
  }
}
.cg-bub {
  box-sizing: border-box;
  max-width: 88%;
  min-width: 0;
  padding: 11px 15px;
  font-size: 14px;
  line-height: 1.95;
  color: #22436f;
  background: #fff;
  border: 1px solid #dbe7f6;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.06);
  word-break: break-word;

  p {
    margin: 0 0 6px;
    white-space: pre-wrap;
  }
  p:last-child {
    margin-bottom: 0;
  }

  .cg-row.u & {
    color: #fff;
    background: linear-gradient(180deg, #3f97f2, #1f6fd6);
    border-color: #1f6fd6;
    box-shadow: none;
  }
}

/* ===== 结构化明细 ===== */
.cg-detail {
  margin: 10px 0 2px;

  .cg-detail-hd {
    margin-bottom: 5px;
    font-size: 13.5px;
    font-weight: 700;
    color: #1a3f6b;
  }
  ul {
    margin: 6px 0 0;
    padding-left: 19px;
    font-size: 13px;
  }
}
.cg-tbl {
  width: 100%;
  margin: 7px 0 2px;
  font-size: 13px;
  line-height: 1.65;
  border-spacing: 0;
  border-collapse: separate;
  border: 1px solid #dbe7f6;
  border-radius: 4px;
  overflow: hidden;

  th,
  td {
    padding: 5px 9px;
    text-align: left;
    border-bottom: 1px solid #eef3fa;
  }
  th {
    font-weight: 600;
    color: #20517e;
    white-space: nowrap;
    background: #eef5fd;
  }
  td.n {
    font-weight: 700;
    color: #1a4f86;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
}
.cg-src {
  padding-top: 7px;
  margin-top: 9px;
  font-size: 12.5px;
  line-height: 1.75;
  color: #8aa3c4;
  border-top: 1px dashed #e8f0f9;
}

/* ===== 动作按钮 ===== */
.cg-acts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 9px;
}
.cg-act {
  padding: 4px 13px;
  font-size: 13px;
  color: #1f7ae0;
  cursor: pointer;
  background: #eef5fd;
  border: 1px solid #c9dcf2;
  border-radius: 13px;
  transition: all 0.15s;

  &:hover {
    color: #fff;
    background: #1f7ae0;
    border-color: #1f7ae0;
  }
}

/* ===== 引用提示 / 来源清单 ===== */
.cg-slot-ref {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 0 7px;
  margin: 0 3px;
  font-size: 11.5px;
  line-height: 1.7;
  color: #4a7bb3;
  white-space: nowrap;
  vertical-align: baseline;
  background: #eef5fd;
  border: 1px solid #d3e3f6;
  border-radius: 9px;

  &.is-waiting {
    color: #7d97b8;
    background: #f4f8fd;
    border-style: dashed;
    animation: cg-slot-pulse 1.6s ease-in-out infinite;
  }

  &.is-error {
    color: #b4651c;
    background: #fff5e9;
    border-color: #f0cda1;
  }
}
@keyframes cg-slot-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

.cg-bub :deep(.as-content) .cg-detail:first-child {
  margin-top: 0;
}
.cg-bub :deep(.as-content) .cg-acts {
  margin-top: 0;
}

.cg-cite-hint {
  display: flex;
  gap: 5px;
  align-items: center;
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #5a7ba6;
  white-space: normal;
  animation: cg-hint-in 0.25s ease both;
}
@keyframes cg-hint-in {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.cg-cite-hint-ico {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #1f7ae0;
  border-radius: 50%;
}

.cg-sources {
  margin: 12px 0 0;
  padding: 9px 11px;
  background: #f7fafc;
  border: 1px solid #e6eef7;
  border-radius: 8px;
}
.cg-sources-hd {
  margin-bottom: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #7d93ad;
  letter-spacing: 0.5px;
}
.cg-source {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  padding: 4px 0;
  font-size: 12.5px;
  line-height: 1.6;

  & + .cg-source {
    border-top: 1px dashed #e9f0f8;
  }

  .no {
    flex: none;
    min-width: 15px;
    height: 15px;
    margin-top: 2px;
    padding: 0 4px;
    font-size: 10.5px;
    font-weight: 700;
    line-height: 15px;
    color: #0b6b58;
    text-align: center;
    background: #e8f5f1;
    border: 1px solid #a9dccf;
    border-radius: 4px;
  }

  .txt {
    min-width: 0;
    white-space: normal;
  }

  .t {
    padding: 0;
    font: inherit;
    color: #1668b8;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: 0;

    &:hover {
      text-decoration: underline;
    }

    &.is-off {
      color: #6b7f95;
      cursor: default;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .w {
    margin-left: 6px;
    color: #5f7794;
  }

  .times {
    margin-left: 6px;
    color: #93a7bd;
  }

  .addr {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    line-height: 1.5;
    color: #7a94b4;
    overflow-wrap: anywhere;
    text-decoration: none;

    &:hover {
      color: #1668b8;
      text-decoration: underline;
    }

    &.is-off {
      color: #a8b8ca;
      cursor: default;

      &:hover {
        text-decoration: none;
      }
    }
  }
}

/* ===== 正在输入 ===== */
.cg-typing {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 20px;

  i {
    width: 6px;
    height: 6px;
    background: #9cc3ef;
    border-radius: 50%;
    animation: cgDot 1s infinite ease-in-out;
  }
  i:nth-child(2) {
    animation-delay: 0.15s;
  }
  i:nth-child(3) {
    animation-delay: 0.3s;
  }
}
@keyframes cgDot {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

/* ===== 快捷提问 ===== */
.cg-chips {
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
.cg-chip {
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

/* ===== 输入区 ===== */
.cg-bar {
  display: flex;
  flex: none;
  gap: 10px;
  align-items: center;
  width: 100%;

  input {
    flex: 1;
    height: 44px;
    padding: 0 15px;
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
}
.ag-run {
  flex: none;
  height: 44px;
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
  height: 44px;
  padding: 0 16px;
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

    &:hover {
      color: #1f7ae0;
      background: #f2f8ff;
      border-color: #7db4ee;
    }
  }
}
</style>
