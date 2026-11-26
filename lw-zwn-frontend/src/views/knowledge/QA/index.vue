<script setup lang="ts">
// ============================================================
// 知识管理 · 智能问答（复刻原型 kbAskView / agHome / agChat）
// 首页：问答置顶 + 推荐问题 + 4 张智能体卡片
// 工作区：通用问答 + 论证审查 / 取水许可查询 / 日报 / 通报智能体
// 问答能力统一由 AgentChatView 承接（与 /knowledge/testQA 同一套接口与效果）
// ============================================================
import { computed, nextTick, ref } from 'vue'
import { QA_AGENTS, QA_CHIPS, type QaAgentCard } from '../data'
import AgentChatView from './components/AgentChatView.vue'
import ArguePanel from './components/ArguePanel.vue'
import ReportPanel from './components/ReportPanel.vue'

type ViewKey = 'home' | 'chat' | 'argue' | 'query' | 'daily' | 'bulletin'
const view = ref<ViewKey>('home')

const TITLES: Record<ViewKey, string> = {
  home: '',
  chat: '智能问答',
  argue: '水资源论证报告审查智能体',
  query: '取水许可信息管理智能体',
  daily: '重点取水口日报智能体',
  bulletin: '水资源信息通报智能体'
}
const workTitle = computed(() => TITLES[view.value])

/* ---------------- 两个问答会话（各自独立上下文） ---------------- */

const chatRef = ref<InstanceType<typeof AgentChatView>>()
const queryRef = ref<InstanceType<typeof AgentChatView>>()

// 通用问答
const CHAT_WELCOME = [
  '你好，我是漳卫南运河管理局水资源智能问答助手。',
  '可以直接问我任何问题——用水定额、跨省水量分配、取水许可、灌区、区县用水总量、论证报告、水情与预警、系统使用等。',
  '如需对某个业务做深度办理（项目合规审查、证照台账筛选统计、日报自动编制），可返回问答首页选择业务智能体；我也会在回答里给出跳转入口。'
]
const CHAT_WELCOME_SOURCE =
  '数据支撑：知识条目 1,269 份 · 取水许可电子证照库 · 跨省水量分配数据 · 用水定额标准库'
const CHAT_PLACEHOLDER =
  '输入任何问题，例如：河北省农业灌溉用水定额是多少／河南今年分到多少水量／馆陶县有哪些取水许可／怎么办理取水许可'

// 取水许可信息管理智能体（后端 water.cert.* 业务工具 + AgentToolApi 公共能力
// （ui.locate / kb.search / agent.result.more / agent.result.stat）+ 证照管理页能力）
const QUERY_WELCOME = [
  '我是取水许可信息管理智能体，可以直接问取水许可证台账、许可水量与取水口统计、某张证的详情等问题。',
  '可用筛选条件与「证照管理」页面的筛选框一一对应：许可证编号、取水权人、组织机构代码、所属河流、行政区、监管单位、河道内外、水源类型、许可水量区间（<100 / 100-1000 / >1000 万m³）、发证状态（已发证 / 准予未发）、是否临近过期（≤60 天）。',
  '需要改动数据时，我会把「打开证照管理页面 / 新增 / 编辑 / 删除」列成按钮，必须由你点击后才会执行。'
]
const QUERY_CHIPS = [
  '一共有多少张取水许可证',
  '许可水量总共多少',
  '各河流的许可水量分别是多少',
  '岳城局的许可证有哪些',
  '准予未发的证照有哪些',
  '许可水量超过1000万m³的许可证有哪些',
  '临近过期的许可证有哪些',
  '打开证照管理页面'
]
const QUERY_PLACEHOLDER =
  '用自然语言提问，例如：准予未发的证照有哪些／地表水的许可证有哪些／许可水量超过1000万m³的证有哪些'

/* ---------------- 首页 ---------------- */
const portalIpt = ref('')

// 进入指定工作区（复刻原型 agTab）
function openTab(key: string) {
  const k = key as ViewKey
  if (!TITLES[k] || k === 'home') {
    view.value = 'home'
    return
  }
  view.value = k
  // 进入问答视图后定位到最后一条消息：容器隐藏期间量不到高度，只能等显示后再滚
  nextTick(() => {
    if (k === 'chat') {
      chatRef.value?.toBottom()
    } else if (k === 'query') {
      queryRef.value?.toBottom()
    }
  })
}

function backHome() {
  view.value = 'home'
}

// 首页提问（回车 / 点击箭头）：进入通用问答并直接发问
function portalAsk() {
  const q = portalIpt.value.trim()
  portalIpt.value = ''
  openTab('chat')
  if (q) {
    chatRef.value?.ask(q)
  }
}

// 推荐问题
function pickChip(q: string) {
  openTab('chat')
  chatRef.value?.ask(q)
}

// 智能体卡片
function openAgent(c: QaAgentCard) {
  openTab(c.key)
}

/* ---------------- 轻提示 ---------------- */
const toastMsg = ref('')
let toastTimer: number | undefined
function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}
</script>

<template>
  <div class="qa-page">
    <!-- ==================== 首页 ==================== -->
    <div v-show="view === 'home'" class="qa-home">
      <div class="ag-hero">
        <div class="ag-hero-t"><b>智能问答</b>助手</div>
        <div class="ag-hero-s">直接提问，每个数都带出处</div>
        <div class="ag-chips">
          <span class="cl">为你推荐：</span>
          <span v-for="c in QA_CHIPS" :key="c" class="ag-chip" @click="pickChip(c)">{{ c }}</span>
        </div>
        <div class="ag-hero-bar">
          <input
            v-model="portalIpt"
            placeholder="请自然提问，例如：河北省农业灌溉用水定额是多少 / 河南今年分到多少水量 / 怎么办理取水许可"
            @keydown.enter="portalAsk"
          />
          <button class="ag-hero-go" type="button" title="进入智能问答" @click="portalAsk">
            ➤
          </button>
        </div>
      </div>

      <div class="ag-agents">
        <div class="ag-agents-hd">
          智能体 <span class="n">全部 {{ QA_AGENTS.length }}</span>
          <span class="h">点击卡片进入工作区</span>
        </div>
        <div class="ag-cards">
          <div v-for="c in QA_AGENTS" :key="c.key" class="ag-acard" @click="openAgent(c)">
            <div class="hd">
              <span class="ic">{{ c.ic }}</span
              >{{ c.nmm }}<span class="tag">{{ c.tag }}</span>
            </div>
            <div class="asub">{{ c.sub }}</div>
            <div class="d">{{ c.desc }}</div>
            <div class="tags">
              <span v-for="t in c.tags" :key="t">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 工作区 ==================== -->
    <div v-show="view !== 'home'" class="qa-work">
      <div class="ag-work-hd">
        <button class="ag-btn ghost" type="button" @click="backHome">← 返回问答</button>
        <span class="ag-work-t">{{ workTitle }}</span>
      </div>

      <!-- 通用问答：与 testQA 同一套问答接口 / 流式效果 -->
      <agent-chat-view
        v-show="view === 'chat'"
        ref="chatRef"
        chat-key="qa.general"
        :welcome="CHAT_WELCOME"
        :welcome-source="CHAT_WELCOME_SOURCE"
        :placeholder="CHAT_PLACEHOLDER"
      />

      <!-- 取水许可信息管理智能体：同一套问答能力，工具走 water.cert.* + AgentToolApi 公共能力
           （ui.locate / kb.search / agent.result.more / agent.result.stat，geo.region.* 已限定为通用问答）。
           通过 module 与后端能力清单对应，发问时只给模型本模块工具与页面，避免全量能力干扰选型 -->
      <agent-chat-view
        v-show="view === 'query'"
        ref="queryRef"
        chat-key="qa.cert"
        module="water-cert"
        :welcome="QUERY_WELCOME"
        :placeholder="QUERY_PLACEHOLDER"
        :chips="QUERY_CHIPS"
      />

      <!-- 智能体工作面板 -->
      <argue-panel v-if="view === 'argue'" @notify="toast" />
      <report-panel v-if="view === 'daily'" mode="daily" @notify="toast" />
      <report-panel v-if="view === 'bulletin'" mode="bulletin" @notify="toast" />
    </div>

    <!-- 轻提示 -->
    <div v-if="toastMsg" class="qa-toast">{{ toastMsg }}</div>
  </div>
</template>

<style scoped lang="scss">
/* ===== 页面根容器 ===== */
.qa-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  padding: 5px;
  font-size: 13px;
  color: #1c3a63;
}

/* ==================== 首页 ==================== */
.qa-home {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
}
.ag-hero {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 14px 8px 2px;
}
.ag-hero-t {
  font-size: 22px;
  font-weight: 800;
  color: #123c6b;
  letter-spacing: 1px;

  b {
    color: #1f7ae0;
  }
}
.ag-hero-s {
  margin-top: -4px;
  font-size: 13px;
  color: #8aa3c4;
}
.ag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: center;
  max-width: 1020px;

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
  transition: 0.15s;

  &:hover {
    color: #fff;
    background: #1f7ae0;
    border-color: #1f7ae0;
  }
}
.ag-hero-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  width: min(880px, 100%);
  padding: 5px 5px 5px 20px;
  background: #fff;
  border: 1px solid #bcd7f7;
  border-radius: 26px;
  box-shadow: 0 3px 14px rgba(30, 90, 170, 0.08);

  input {
    flex: 1;
    min-width: 0;
    height: 38px;
    font-family: inherit;
    font-size: 14.5px;
    color: #24466f;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
      color: #93aacb;
    }
  }
}
.ag-hero-go {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(180deg, #3f97f2, #1f6fd6);
  border: none;
  border-radius: 50%;

  &:hover {
    filter: brightness(1.08);
  }
}

/* 智能体卡片 */
.ag-agents {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 9px;
}
.ag-agents-hd {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
  color: #1a3f6b;

  .n {
    padding: 2px 11px;
    font-size: 12.5px;
    font-weight: 600;
    color: #1f7ae0;
    background: #e8f1fd;
    border: 1px solid #bcd7f7;
    border-radius: 12px;
  }
  .h {
    margin-left: auto;
    font-size: 12px;
    font-weight: 400;
    color: #a3b8d2;
  }
}
.ag-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.ag-acard {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 13px 15px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.07);
  transition: all 0.15s;

  &:hover {
    border-color: #7db4ee;
    box-shadow: 0 5px 18px rgba(30, 90, 170, 0.14);
    transform: translateY(-2px);
  }
  .hd {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14.5px;
    font-weight: 700;
    color: #1a3f6b;
  }
  .hd .ic {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 27px;
    height: 27px;
    font-size: 15px;
    background: #e8f1fd;
    border-radius: 6px;
  }
  .hd .tag {
    flex: none;
    padding: 1px 9px;
    margin-left: auto;
    font-size: 11.5px;
    font-weight: 400;
    color: #8aa3c4;
    background: #f1f6fc;
    border: 1px solid #d9e7f7;
    border-radius: 9px;
  }
  .asub {
    margin-top: -3px;
    font-size: 12px;
    color: #8aa3c4;
  }
  .d {
    font-size: 12.8px;
    line-height: 1.75;
    color: #4f6f96;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    span {
      padding: 1px 8px;
      font-size: 11.5px;
      color: #1f7ae0;
      background: #eef5fd;
      border: 1px solid #c9dcf2;
      border-radius: 3px;
    }
  }
}

/* ==================== 工作区 ==================== */
.qa-work {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}
.ag-work-hd {
  display: flex;
  flex: none;
  gap: 12px;
  align-items: center;
}
.ag-work-t {
  font-size: 15.5px;
  font-weight: 700;
  color: #1a3f6b;
}
.ag-btn {
  flex: none;
  height: 34px;
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

/* ==================== 轻提示 ==================== */
.qa-toast {
  position: fixed;
  top: 26px;
  left: 50%;
  z-index: 3000;
  padding: 8px 24px;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  background: rgba(20, 80, 180, 0.94);
  border: 1px solid rgba(120, 200, 255, 0.55);
  border-radius: 18px;
  box-shadow: 0 0 20px rgba(60, 150, 255, 0.55);
  transform: translateX(-50%);
}
</style>
