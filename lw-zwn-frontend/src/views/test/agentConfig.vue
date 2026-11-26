<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { getAgentConfigStatus, restoreAgentConfig } from '@/api/agent/agentUiCapability'
import type { AgentConfigStatus } from '@/api/agent/agentUiCapability'
import request from '@/utils/request'

/**
 * Agent 工具元数据在线配置页（路由 /knowledge/agentConfig）。
 *
 * 演示的是「不重启后端，在线改模型看到的工具描述」这条完整链路：
 *   1. GET    /api/agent/tools            拉取全部工具当前生效的元数据（含是否被人工覆盖）
 *   2. GET    /api/agent/tools/{name}     选中工具的详情，作为表单初始值
 *   3. PUT    /api/agent/tools/{name}     保存覆盖项，服务端写入 AGENT_TOOL_META 后立即刷新注册表
 *   4. 重新 GET 详情，展示服务端回传的「已生效值」和 updatedBy / updatedAt
 *
 * 另外三个运维动作：
 *   DELETE /api/agent/tools/{name}  删除覆盖记录，恢复 @AgentTool 注解默认值
 *   POST   /api/agent/tools/refresh 直接改了数据库/文件后热刷新（本页保存不需要点它）
 *   POST   /api/agent/config/restore 一键还原：清空本页与「页面能力配置」页的全部人工修改，
 *                                    运行时回到代码默认值（工具=注解，页面=前端声明）
 *
 * 权限（@RequireActUrl）：查看 /agent/tools，修改 /agent/tools/update，热刷新 /agent/tools/refresh。
 * 当前账号缺权限时接口会报错，页面 catch 里给出明确提示。
 *
 * 为什么用原生 HTML 而不是组件库：与同目录 testAgent.vue 保持一致，调试页零依赖、
 * 不依赖组件按需引入是否注册，复制到任何环境都能直接打开。
 */

const TOOLS_API = '/api/agent/tools'

// ==================== 类型（对齐后端 AgentToolMetaVO / AgentToolMeta） ====================

interface ParamView {
  name: string
  type: string
  description: string
  required: boolean
  enums?: string[]
}

interface ActionView {
  label: string
  route: string
  queryParams?: string[]
}

/** 后端返回的「当前生效」的工具长什么样 */
interface AgentToolMetaVO {
  name: string
  title: string
  description: string
  examples?: string[]
  category?: string
  /** false = 管理端停用了该工具，不注册给模型 */
  enabled: boolean
  /** true = 存在人工覆盖记录（描述来自配置，不是来自注解） */
  overridden: boolean
  permissions?: string[]
  actions?: ActionView[]
  params?: ParamView[]
  updatedBy?: string
  updatedAt?: string
}

/** 编辑表单：只放「允许覆盖」的字段，权限/参数类型等只读 */
interface MetaForm {
  title: string
  description: string
  category: string
  /** 每行一条问法，编辑态用纯文本，提交时再转数组 */
  examplesText: string
  enabled: boolean
  /** 参数名 → 参数说明 */
  paramDescriptions: Record<string, string>
}

// ==================== 接口 ====================
// 注意：@/utils/request 的响应经过 normalize 拦截器，resolve 出来的是
// { code, message, data, page, axiosRes }，业务数据在 res.data，不是 res 本身。

async function listTools(): Promise<AgentToolMetaVO[]> {
  const res: any = await request({ url: TOOLS_API, method: 'GET' })
  return (res?.data ?? []) as AgentToolMetaVO[]
}

async function getTool(name: string): Promise<AgentToolMetaVO> {
  const res: any = await request({
    url: `${TOOLS_API}/${encodeURIComponent(name)}`,
    method: 'GET'
  })
  return res?.data as AgentToolMetaVO
}

/**
 * 保存覆盖项。
 *
 * ⚠️ 关键点：后端 JsonFileAgentToolMetaStore.save() 是 all.put(name, meta) —— 整条替换，
 * 不是字段合并。虽然 Controller 注释说「只传需要改的字段即可」，但那指的是
 * 「未传字段沿用**注解默认值**」，不是「沿用上一次人工改的值」。
 * 所以本页把当前表单里全部生效字段一起回传，避免只改一句描述就把之前覆盖的
 * 标题 / 问法 / 参数说明 / 启停状态冲掉。字段留空则等价于回退到注解默认。
 */
async function updateTool(name: string, payload: Record<string, any>) {
  const res: any = await request({
    url: `${TOOLS_API}/${encodeURIComponent(name)}`,
    method: 'PUT',
    data: payload
  })
  return { vo: res?.data as AgentToolMetaVO, message: String(res?.message ?? '已生效') }
}

async function resetTool(name: string): Promise<string> {
  const res: any = await request({
    url: `${TOOLS_API}/${encodeURIComponent(name)}`,
    method: 'DELETE'
  })
  return String(res?.message ?? '已恢复默认')
}

async function refreshRegistry(): Promise<Record<string, any>> {
  const res: any = await request({ url: `${TOOLS_API}/refresh`, method: 'POST' })
  return (res?.data ?? {}) as Record<string, any>
}

// ==================== 状态 ====================

const tools = ref<AgentToolMetaVO[]>([])
const current = ref<AgentToolMetaVO | null>(null)
const loading = ref(false)
const saving = ref(false)
/** 当前正在逐行还原的工具名（= AGENT_TOOL_META 的一行主键），防止重复点击 */
const resettingName = ref('')
const keyword = ref('')
const filter = ref<'all' | 'overridden' | 'disabled'>('all')
const previewTab = ref<'json' | 'prompt'>('json')
/** 后端配置状态：存储方式、工具/页面两类人工覆盖数量 */
const status = ref<AgentConfigStatus | null>(null)

const emptyForm = (): MetaForm => ({
  title: '',
  description: '',
  category: '',
  examplesText: '',
  enabled: true,
  paramDescriptions: {}
})
const form = ref<MetaForm>(emptyForm())
/** 载入时的快照，用于判断是否有未保存修改 */
const original = ref<MetaForm>(emptyForm())

const toast = ref<{ type: 'ok' | 'err' | 'info'; text: string } | null>(null)
let toastTimer: number | undefined
function notify(type: 'ok' | 'err' | 'info', text: string) {
  toast.value = { type, text }
  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }
  toastTimer = window.setTimeout(() => (toast.value = null), 6000)
}

const dirty = computed(
  () => !!current.value && JSON.stringify(form.value) !== JSON.stringify(original.value)
)

const filteredTools = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return tools.value.filter((t) => {
    if (filter.value === 'overridden' && !t.overridden) {
      return false
    }
    if (filter.value === 'disabled' && t.enabled) {
      return false
    }
    if (!kw) {
      return true
    }
    return (
      t.name.toLowerCase().includes(kw) ||
      (t.title ?? '').toLowerCase().includes(kw) ||
      (t.description ?? '').toLowerCase().includes(kw)
    )
  })
})

const stat = computed(() => ({
  total: tools.value.length,
  enabled: tools.value.filter((t) => t.enabled).length,
  overridden: tools.value.filter((t) => t.overridden).length
}))

/** 筛选项放在 script 里生成，模板表达式就不必写 TS 类型断言 */
const filterOptions = computed<Array<{ key: 'all' | 'overridden' | 'disabled'; label: string }>>(
  () => [
    { key: 'all', label: `全部 ${stat.value.total}` },
    { key: 'overridden', label: `已改 ${stat.value.overridden}` },
    { key: 'disabled', label: `停用 ${stat.value.total - stat.value.enabled}` }
  ]
)

/** 与后端 AgentToolMetaService.normalize() 的校验常量保持一致 */
function parseExamples(): string[] {
  return form.value.examplesText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 实时生成的 PUT 请求体：随表单变化，直接看出「改描述改的是哪个字段」 */
const payload = computed<Record<string, any>>(() => {
  if (!current.value) {
    return {}
  }
  const paramDescriptions: Record<string, string> = {}
  Object.entries(form.value.paramDescriptions).forEach(([key, value]) => {
    if (value && value.trim()) {
      paramDescriptions[key] = value.trim()
    }
  })
  return {
    name: current.value.name,
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    category: form.value.category.trim(),
    examples: parseExamples(),
    enabled: form.value.enabled,
    paramDescriptions
  }
})

const jsonPreview = computed(() => JSON.stringify(payload.value, null, 2))

/**
 * 提示词片段预览：格式对齐后端 AgentToolDefinition.toPromptText()。
 * 这里只做本地近似渲染（paramSchema 的完整 JSON 由后端生成），
 * 让用户直观看到 description / examples 改完会变成模型看到的什么样子。
 */
const promptPreview = computed(() => {
  if (!current.value) {
    return ''
  }
  const p = payload.value
  const lines: string[] = []
  lines.push(
    `   - ${current.value.name}（${p.title || current.value.title}）${p.category ? ` [${p.category}]` : ''}`
  )
  lines.push(`     说明：${p.description}`)
  const params = current.value.params ?? []
  lines.push(
    `     参数：${params.length ? params.map((x) => `${x.name}(${x.type}${x.required ? ',必填' : ''})`).join('、') : '无'}`
  )
  if ((p.examples as string[]).length) {
    lines.push(`     问法：${(p.examples as string[]).join('；')}`)
  }
  if (!p.enabled) {
    lines.push(`     ⚠ 本工具已停用，不会出现在提示词里`)
  }
  return lines.join('\n')
})

/** description 是否相对「当前生效值」发生了改动 —— 页面重点提示 */
const descChanged = computed(
  () => !!current.value && form.value.description.trim() !== (current.value.description ?? '')
)

// ==================== 操作 ====================

function fillForm(vo: AgentToolMetaVO) {
  const paramDescriptions: Record<string, string> = {}
  ;(vo.params ?? []).forEach((p) => {
    paramDescriptions[p.name] = p.description ?? ''
  })
  form.value = {
    title: vo.title ?? '',
    description: vo.description ?? '',
    category: vo.category ?? '',
    examplesText: (vo.examples ?? []).join('\n'),
    enabled: !!vo.enabled,
    paramDescriptions
  }
  original.value = JSON.parse(JSON.stringify(form.value))
}

async function loadList(keepSelection = false) {
  loading.value = true
  try {
    tools.value = await listTools()
    if (!tools.value.length) {
      current.value = null
      notify('info', '工具清单为空：请确认 lonwin-start 已启动，且当前账号拥有 /agent/tools 权限')
      return
    }
    const name = keepSelection ? current.value?.name : undefined
    const next = (name && tools.value.find((t) => t.name === name)) || tools.value[0]
    await loadDetail(next.name)
  } catch (e: any) {
    notify('err', `读取工具清单失败：${e?.message ?? e}。请检查后端服务与 /agent/tools 功能权限`)
  } finally {
    loading.value = false
  }
}

async function loadDetail(name: string) {
  try {
    const vo = await getTool(name)
    current.value = vo
    fillForm(vo)
  } catch (e: any) {
    notify('err', `读取工具详情失败：${e?.message ?? e}`)
  }
}

async function selectTool(vo: AgentToolMetaVO) {
  if (current.value?.name === vo.name) {
    return
  }
  if (dirty.value && !window.confirm('当前有未保存的修改，确定要切换工具吗？')) {
    return
  }
  await loadDetail(vo.name)
}

function validate(): string | null {
  const f = form.value
  if (f.title.trim().length > 50) {
    return '中文标题不能超过 50 个字符'
  }
  if (f.description.trim().length > 1000) {
    return '工具描述不能超过 1000 个字符'
  }
  const examples = parseExamples()
  if (examples.length > 10) {
    return '问法示例不能超过 10 条'
  }
  if (examples.some((s) => s.length > 100)) {
    return '单条问法示例不能超过 100 个字符'
  }
  for (const [key, value] of Object.entries(f.paramDescriptions)) {
    if (value.trim().length > 200) {
      return `参数 ${key} 的说明不能超过 200 个字符`
    }
  }
  return null
}

/** 保存 → 服务端立即刷新注册表 → 重新拉详情展示已生效值 */
async function save() {
  if (!current.value || saving.value) {
    return
  }
  const error = validate()
  if (error) {
    notify('err', error)
    return
  }
  const name = current.value.name
  saving.value = true
  try {
    const { vo, message } = await updateTool(name, payload.value)
    // 列表里的摘要、覆盖标记、更新时间都变了，重新拉一次
    tools.value = await listTools()
    if (vo) {
      current.value = vo
      fillForm(vo)
    } else {
      await loadDetail(name)
    }
    notify('ok', `${message}：${name} 的新描述已写入提示词，下一次提问立即生效，无需重启后端`)
  } catch (e: any) {
    notify('err', `保存失败：${e?.message ?? e}。请确认账号拥有 /agent/tools/update 权限`)
  } finally {
    saving.value = false
  }
}

function discard() {
  if (!current.value) {
    return
  }
  fillForm(current.value)
  notify('info', '已还原为服务端当前生效值')
}

function restoreDescription() {
  if (!current.value) {
    return
  }
  form.value.description = current.value.description ?? ''
}

/**
 * 逐行还原：一个细项 = AGENT_TOOL_META 表里的一行（主键 NAME = 工具名）。
 *
 * 删除这一行后，工具立即回到 @AgentTool 注解默认值；
 * 左侧列表每项的「还原本行」与编辑区底部「恢复注解默认」共用这条路径，
 * 与顶部「一键还原」（清空全部行）是互补的两级粒度。
 */
async function resetRow(vo: AgentToolMetaVO) {
  if (saving.value || resettingName.value) {
    return
  }
  if (!vo.overridden) {
    notify('info', `${vo.name} 当前就是代码默认值，AGENT_TOOL_META 中没有这一行，无需还原`)
    return
  }
  // 还原后会重新拉清单与详情；若编辑区还有另一个工具的未保存修改，先让用户确认
  if (
    dirty.value &&
    current.value?.name !== vo.name &&
    !window.confirm('当前有未保存的修改，还原其它工具会丢弃这些修改，确定继续吗？')
  ) {
    return
  }
  if (
    !window.confirm(
      `确定还原「${vo.name}」吗？\n会删除 AGENT_TOOL_META 表中 NAME=${vo.name} 这一行人工配置，运行时回到 @AgentTool 注解默认值，且不可撤销。`
    )
  ) {
    return
  }
  resettingName.value = vo.name
  try {
    const message = await resetTool(vo.name)
    // 重新拉清单 + 当前选中项的详情，表单立刻显示注解默认值
    await loadList(true)
    await loadStatus()
    notify('ok', `${message}：已删除 ${vo.name} 的配置行，回到代码默认值`)
  } catch (e: any) {
    notify('err', `还原失败：${e?.message ?? e}。请确认账号拥有 /agent/tools/update 权限`)
  } finally {
    resettingName.value = ''
  }
}

function resetToAnnotation() {
  if (current.value) {
    void resetRow(current.value)
  }
}

async function hotRefresh() {
  saving.value = true
  try {
    const r = await refreshRegistry()
    await loadList(true)
    notify(
      'ok',
      `热刷新完成：快照版本 v${r.version ?? '-'}，生效工具 ${r.size ?? '-'} 个，覆盖项 ${r.store ?? '-'} 条`
    )
  } catch (e: any) {
    notify('err', `热刷新失败：${e?.message ?? e}。请确认账号拥有 /agent/tools/refresh 权限`)
  } finally {
    saving.value = false
  }
}

async function loadStatus() {
  try {
    const res: any = await getAgentConfigStatus()
    status.value = (res?.data ?? null) as AgentConfigStatus | null
  } catch {
    status.value = null
  }
}

/**
 * 一键还原：清空 AGENT_TOOL_META 的覆盖行与 AGENT_UI_CAPABILITY 的人工覆盖，
 * 两个配置页同时回到代码默认值（本页=@AgentTool 注解，页面能力页=前端 src/agent 声明）。
 * 页面能力配置页点同一个按钮时还会额外重报一次代码声明，保证基线也是最新的。
 */
async function restoreAll() {
  if (saving.value) {
    return
  }
  if (
    !window.confirm(
      '确定一键还原吗？\n工具描述配置与页面能力配置的全部人工修改都会被清空，运行时回到代码默认值，且不可撤销。'
    )
  ) {
    return
  }
  saving.value = true
  try {
    const res: any = await restoreAgentConfig()
    const r = (res?.data ?? {}) as Record<string, any>
    await loadList(true)
    await loadStatus()
    notify(
      'ok',
      `一键还原完成：清除工具配置 ${r.toolOverrides ?? 0} 条、页面能力配置 ${r.uiOverrides ?? 0} 条，已回到代码默认值`
    )
  } catch (e: any) {
    notify('err', `一键还原失败：${e?.message ?? e}。请确认账号拥有 /agent/config/restore 权限`)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadList()
  loadStatus()
})
</script>

<template>
  <div class="agent-config">
    <!-- 顶部：说明 + 全局操作 -->
    <div class="ac-head">
      <div class="ac-head-main">
        <span class="ac-title">Agent 工具描述配置</span>
        <span class="ac-sub">
          改的就是模型提示词里的「说明」，保存后立即生效，下一次提问就用新描述，无需发版重启
        </span>
      </div>
      <div class="ac-head-ops">
        <span v-if="status" class="ac-sub">
          存储：{{ status?.toolStore }} · 工具已改 {{ status?.toolOverrides }} 条 / 页面已改
          {{ status?.uiOverrides }} 条
        </span>
        <button class="ac-btn" :disabled="loading || saving" @click="loadList(true)">
          {{ loading ? '加载中…' : '刷新清单' }}
        </button>
        <button class="ac-btn" :disabled="saving" @click="hotRefresh">热刷新注册表</button>
        <button class="ac-btn is-danger" :disabled="saving" @click="restoreAll">一键还原</button>
      </div>
    </div>

    <div class="ac-guide">
      <span><b>①</b> 左侧选工具</span>
      <span><b>②</b> 改「工具描述」等文案</span>
      <span><b>③</b> 点「保存并生效」，配置写入 AGENT_TOOL_META 的一行</span>
      <span><b>④</b> 重新读取详情，核对「已生效值」与修改人/时间</span>
      <em>
        每个细项 = 数据库里的一行：列表「还原本行」只删该行；顶部「一键还原」清空本页与页面能力配置页的全部人工配置
      </em>
    </div>

    <div v-if="toast" class="ac-toast" :class="`is-${toast.type}`">{{ toast.text }}</div>

    <div class="ac-body">
      <!-- 左：工具清单 -->
      <div class="ac-list">
        <div class="ac-list-head">
          <input v-model="keyword" class="ac-input" placeholder="搜索工具名 / 标题 / 描述" />
          <div class="ac-filters">
            <button
              v-for="f in filterOptions"
              :key="f.key"
              class="ac-chip"
              :class="{ active: filter === f.key }"
              @click="filter = f.key"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div class="ac-items">
          <div
            v-for="t in filteredTools"
            :key="t.name"
            class="ac-item"
            :class="{ active: current?.name === t.name }"
            @click="selectTool(t)"
          >
            <div class="ac-item-top">
              <span class="ac-item-title">{{ t.title || t.name }}</span>
              <span v-if="t.overridden" class="ac-badge is-edit">已改</span>
              <span v-if="!t.enabled" class="ac-badge is-off">停用</span>
            </div>
            <code class="ac-item-name">{{ t.name }}</code>
            <div class="ac-item-desc">{{ t.description || '（无描述）' }}</div>
            <div v-if="t.category" class="ac-item-cat">{{ t.category }}</div>
            <div class="ac-item-row">
              <span v-if="t.overridden" class="ac-db-row">
                DB 有记录 · {{ t.updatedBy || '-' }} {{ t.updatedAt || '' }}
              </span>
              <span v-else class="ac-db-row is-default">代码默认 · 库中无此行</span>
              <button
                class="ac-row-reset"
                :disabled="!t.overridden || !!resettingName || saving"
                :title="t.overridden ? '删除 AGENT_TOOL_META 中 NAME=' + t.name + ' 这一行' : '当前已是代码默认值，数据库中没有这一行'"
                @click.stop="resetRow(t)"
              >
                {{ resettingName === t.name ? '还原中…' : (t.overridden ? '还原本行' : '无需还原') }}
              </button>
            </div>
          </div>
          <div v-if="!filteredTools.length && !loading" class="ac-empty">没有匹配的工具</div>
          <div v-if="loading" class="ac-empty">正在读取工具清单…</div>
        </div>
      </div>

      <!-- 右：编辑器 -->
      <div class="ac-editor">
        <template v-if="current">
          <div class="ac-editor-head">
            <div>
              <span class="ac-editor-title">{{ current.title || current.name }}</span>
              <code class="ac-editor-name">{{ current.name }}</code>
            </div>
            <div class="ac-meta">
              <span :class="current.enabled ? 'ac-state is-on' : 'ac-state is-off'">
                {{ current.enabled ? '已启用' : '已停用' }}
              </span>
              <span :class="current.overridden ? 'ac-state is-edit' : 'ac-state'">
                {{ current.overridden ? '人工覆盖' : '注解默认' }}
              </span>
              <span v-if="current.updatedAt" class="ac-updated">
                {{ current.updatedBy || '-' }} · {{ current.updatedAt }}
              </span>
            </div>
          </div>

          <div class="ac-scroll">
            <!-- 重点：描述 -->
            <section class="ac-section is-primary">
              <div class="ac-label-row">
                <label class="ac-label"
                  >工具描述 description <span class="ac-star">★ 进入模型提示词</span></label
                >
                <span class="ac-counter" :class="{ warn: form.description.length > 1000 }">
                  {{ form.description.length }} / 1000
                </span>
              </div>
              <p class="ac-hint">
                写「什么时候用、返回什么」，而不是「这个工具叫什么」。模型靠这句话决定选不选它。
              </p>
              <textarea
                v-model="form.description"
                class="ac-textarea is-desc"
                rows="6"
                placeholder="例如：查询指定水库某日的蓄水量。用户问『水量多少』『蓄了多少水』时调用……"
              />
              <div v-if="descChanged" class="ac-diff-tip">
                与当前生效值不同，保存后立即替换模型看到的说明
              </div>
              <div class="ac-effective">
                <div class="ac-effective-head">
                  <span>服务端当前生效值（保存前）</span>
                  <button v-if="descChanged" class="ac-link" @click="restoreDescription">
                    还原为此值
                  </button>
                </div>
                <div class="ac-effective-text">{{ current.description || '（无描述）' }}</div>
              </div>
            </section>

            <!-- 其他可覆盖字段 -->
            <section class="ac-section">
              <div class="ac-grid">
                <div class="ac-field">
                  <label class="ac-label">中文标题 title</label>
                  <input v-model="form.title" class="ac-input" placeholder="≤ 50 字" />
                </div>
                <div class="ac-field">
                  <label class="ac-label">业务分类 category</label>
                  <input
                    v-model="form.category"
                    class="ac-input"
                    placeholder="如 水量、许可、预警"
                  />
                </div>
              </div>

              <div class="ac-switch-row">
                <label class="ac-switch">
                  <input v-model="form.enabled" type="checkbox" />
                  <span>启用该工具（关闭后不注册给模型，问答里看不到它）</span>
                </label>
              </div>

              <div class="ac-field">
                <label class="ac-label">
                  问法示例 examples <span class="ac-tip">每行一条，最多 10 条、每条 ≤ 100 字</span>
                </label>
                <textarea
                  v-model="form.examplesText"
                  class="ac-textarea"
                  rows="3"
                  placeholder="今年许可水量是多少&#10;3 号水库今天蓄了多少水"
                />
              </div>

              <div v-if="(current.params || []).length" class="ac-field">
                <label class="ac-label">
                  参数说明 paramDescriptions
                  <span class="ac-tip">只能改说明；类型 / 必填 / 枚举由注解决定，不可改</span>
                </label>
                <div v-for="p in current.params" :key="p.name" class="ac-param">
                  <code>{{ p.name }}</code>
                  <span class="ac-param-type">{{ p.type }}{{ p.required ? ' · 必填' : '' }}</span>
                  <input
                    v-model="form.paramDescriptions[p.name]"
                    class="ac-input"
                    placeholder="参数说明 ≤ 200 字"
                  />
                </div>
              </div>

              <div class="ac-readonly">
                <b>只读（由代码决定）</b>
                <span>功能权限：{{ (current.permissions || []).join('、') || '无' }}</span>
                <span>
                  参数类型：{{
                    (current.params || []).map((p) => `${p.name}:${p.type}`).join('、') || '无参数'
                  }}
                </span>
                <span>跳转按钮：{{ (current.actions || []).length }} 个</span>
              </div>
            </section>

            <!-- 请求体 / 提示词预览 -->
            <section class="ac-section">
              <div class="ac-tabs">
                <button
                  class="ac-tab"
                  :class="{ active: previewTab === 'json' }"
                  @click="previewTab = 'json'"
                >
                  实际发出的请求体
                </button>
                <button
                  class="ac-tab"
                  :class="{ active: previewTab === 'prompt' }"
                  @click="previewTab = 'prompt'"
                >
                  提示词片段预览
                </button>
                <span class="ac-tab-note">PUT {{ TOOLS_API }}/{{ current.name }}</span>
              </div>
              <pre v-if="previewTab === 'json'" class="ac-pre">{{ jsonPreview }}</pre>
              <pre v-else class="ac-pre">{{ promptPreview }}</pre>
              <p class="ac-hint">
                提示词片段按后端 toPromptText() 格式近似渲染，参数 Schema 的完整 JSON 以服务端为准。
              </p>
            </section>
          </div>

          <div class="ac-footer">
            <span v-if="dirty" class="ac-dirty">● 有未保存的修改</span>
            <span v-else class="ac-clean">与服务端当前生效值一致</span>
            <div class="ac-footer-ops">
              <button class="ac-btn" :disabled="saving || !dirty" @click="discard">放弃修改</button>
              <button
                class="ac-btn is-danger"
                :disabled="saving || !!resettingName || !current.overridden"
                @click="resetToAnnotation"
              >
                {{ resettingName === current.name ? '还原中…' : '恢复注解默认' }}
              </button>
              <button class="ac-btn is-primary" :disabled="saving" @click="save">
                {{ saving ? '保存中…' : '保存并生效' }}
              </button>
            </div>
          </div>
        </template>

        <div v-else class="ac-editor-empty">
          工具清单为空。请确认后端已启动，且当前账号已授权 /agent/tools。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.agent-config {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  min-height: 620px;
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
}

.ac-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ac-head-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.ac-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2d3d;
}

.ac-sub {
  font-size: 12px;
  color: #8492a6;
}

.ac-head-ops,
.ac-footer-ops {
  display: flex;
  gap: 8px;
}

.ac-guide {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 8px 12px;
  font-size: 12px;
  color: #475669;
  background: #eaf2ff;
  border: 1px solid #d5e5ff;
  border-radius: 6px;

  b {
    margin-right: 4px;
    color: #2b8dff;
  }

  em {
    margin-left: auto;
    font-style: normal;
    color: #8492a6;
  }
}

.ac-toast {
  margin-bottom: 10px;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;

  &.is-ok {
    color: #1d7a4d;
    background: #e6f7ee;
    border: 1px solid #b7e6cd;
  }

  &.is-err {
    color: #b42318;
    background: #fdeceb;
    border: 1px solid #f5c2bd;
  }

  &.is-info {
    color: #475669;
    background: #eef2f8;
    border: 1px solid #d8e0ec;
  }
}

.ac-body {
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;
}

.ac-list {
  display: flex;
  flex-direction: column;
  width: 310px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  overflow: hidden;
}

.ac-list-head {
  padding: 10px;
  border-bottom: 1px solid #eef1f6;
}

.ac-filters {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.ac-chip {
  padding: 3px 10px;
  font-size: 12px;
  color: #607086;
  cursor: pointer;
  background: #f4f6fa;
  border: 1px solid transparent;
  border-radius: 12px;

  &.active {
    color: #2b8dff;
    background: #eaf2ff;
    border-color: #b9d6ff;
  }
}

.ac-items {
  flex: 1;
  overflow-y: auto;
}

.ac-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f1f4f9;

  &:hover {
    background: #f7faff;
  }

  &.active {
    background: #eaf2ff;
    box-shadow: inset 3px 0 0 #2b8dff;
  }
}

.ac-item-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ac-item-title {
  font-size: 13px;
  font-weight: bold;
  color: #1f2d3d;
}

.ac-item-name {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: #8492a6;
  font-family: Consolas, Monaco, monospace;
}

.ac-item-desc {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #607086;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ac-item-cat {
  margin-top: 4px;
  font-size: 11px;
  color: #a0aec0;
}

/* 每个细项对应数据库里的一行：显示该行是否存在 + 单独还原按钮 */
.ac-item-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.ac-db-row {
  flex: 1;
  min-width: 0;
  font-size: 11px;
  color: #b26a00;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &.is-default {
    color: #a0aec0;
  }
}

.ac-row-reset {
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 11px;
  color: #b42318;
  cursor: pointer;
  background: #fff;
  border: 1px solid #f0c4bf;
  border-radius: 4px;

  &:hover:not(:disabled) {
    color: #fff;
    background: #b42318;
    border-color: #b42318;
  }

  &:disabled {
    color: #a0aec0;
    cursor: not-allowed;
    background: #f7f8fa;
    border-color: #e6ebf2;
  }
}

.ac-badge {
  padding: 1px 6px;
  font-size: 11px;
  border-radius: 3px;

  &.is-edit {
    color: #b26a00;
    background: #fff2d9;
  }

  &.is-off {
    color: #98a1ad;
    background: #eef1f5;
  }
}

.ac-empty,
.ac-editor-empty {
  padding: 24px 12px;
  font-size: 13px;
  color: #98a1ad;
  text-align: center;
}

.ac-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  overflow: hidden;
}

.ac-editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #eef1f6;
}

.ac-editor-title {
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #1f2d3d;
}

.ac-editor-name {
  font-size: 12px;
  color: #8492a6;
  font-family: Consolas, Monaco, monospace;
}

.ac-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ac-state {
  padding: 2px 8px;
  font-size: 11px;
  color: #607086;
  background: #f1f4f9;
  border-radius: 3px;

  &.is-on {
    color: #1d7a4d;
    background: #e6f7ee;
  }

  &.is-off {
    color: #b42318;
    background: #fdeceb;
  }

  &.is-edit {
    color: #b26a00;
    background: #fff2d9;
  }
}

.ac-updated {
  font-size: 11px;
  color: #a0aec0;
}

.ac-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

.ac-section {
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid #eef1f6;
  border-radius: 8px;

  &.is-primary {
    border-color: #b9d6ff;
    background: #f8fbff;
  }
}

.ac-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ac-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: bold;
  color: #33445c;
}

.ac-star {
  margin-left: 8px;
  font-size: 11px;
  font-weight: normal;
  color: #2b8dff;
}

.ac-tip {
  margin-left: 8px;
  font-size: 11px;
  font-weight: normal;
  color: #a0aec0;
}

.ac-counter {
  font-size: 12px;
  color: #a0aec0;

  &.warn {
    color: #b42318;
  }
}

.ac-hint {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.6;
  color: #8492a6;
}

.ac-input,
.ac-textarea {
  width: 100%;
  padding: 7px 10px;
  font-size: 13px;
  color: #1f2d3d;
  background: #fff;
  border: 1px solid #d3dce6;
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #2b8dff;
  }
}

.ac-textarea {
  resize: vertical;
  line-height: 1.6;
  font-family: inherit;

  &.is-desc {
    min-height: 120px;
    font-size: 13px;
  }
}

.ac-diff-tip {
  margin-top: 6px;
  font-size: 12px;
  color: #b26a00;
}

.ac-effective {
  margin-top: 10px;
  padding: 8px 10px;
  background: #f1f4f9;
  border-radius: 5px;
}

.ac-effective-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #8492a6;
}

.ac-link {
  padding: 0;
  font-size: 11px;
  color: #2b8dff;
  cursor: pointer;
  background: none;
  border: none;
}

.ac-effective-text {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: #607086;
  white-space: pre-wrap;
  word-break: break-word;
}

.ac-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.ac-field {
  margin-bottom: 12px;
}

.ac-switch-row {
  margin-bottom: 12px;
}

.ac-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475669;
  cursor: pointer;
}

.ac-param {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  code {
    min-width: 96px;
    font-size: 12px;
    color: #2b8dff;
    font-family: Consolas, Monaco, monospace;
  }

  .ac-input {
    flex: 1;
  }
}

.ac-param-type {
  min-width: 84px;
  font-size: 11px;
  color: #a0aec0;
}

.ac-readonly {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding: 8px 10px;
  font-size: 11px;
  color: #8492a6;
  background: #f8fafc;
  border-radius: 5px;

  b {
    color: #607086;
  }
}

.ac-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ac-tab {
  padding: 4px 12px;
  font-size: 12px;
  color: #607086;
  cursor: pointer;
  background: #f4f6fa;
  border: 1px solid transparent;
  border-radius: 5px;

  &.active {
    color: #2b8dff;
    background: #eaf2ff;
    border-color: #b9d6ff;
  }
}

.ac-tab-note {
  margin-left: auto;
  font-size: 11px;
  color: #a0aec0;
  font-family: Consolas, Monaco, monospace;
}

.ac-pre {
  margin: 0;
  padding: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #33445c;
  white-space: pre-wrap;
  word-break: break-word;
  background: #f8fafc;
  border: 1px solid #eef1f6;
  border-radius: 5px;
  font-family: Consolas, Monaco, monospace;
}

.ac-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-top: 1px solid #eef1f6;
}

.ac-dirty {
  font-size: 12px;
  color: #b26a00;
}

.ac-clean {
  font-size: 12px;
  color: #a0aec0;
}

.ac-btn {
  padding: 6px 14px;
  font-size: 12px;
  color: #475669;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d3dce6;
  border-radius: 5px;

  &:hover:not(:disabled) {
    color: #2b8dff;
    border-color: #2b8dff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.is-primary {
    color: #fff;
    background: #2b8dff;
    border-color: #2b8dff;

    &:hover:not(:disabled) {
      color: #fff;
      background: #0b6bd0;
    }
  }

  &.is-danger {
    color: #b42318;
    border-color: #f0c4bf;
  }
}
</style>
