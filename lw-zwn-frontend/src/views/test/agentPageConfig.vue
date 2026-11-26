<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { pageCapabilities } from '@/agent/capabilityRegistry'
import {
  getAgentConfigStatus,
  listUiCapabilityConfigs,
  removeUiCapabilityOverride,
  reportAgentCapabilities,
  restoreAgentConfig,
  saveUiCapabilityOverride
} from '@/api/agent/agentUiCapability'
import type {
  AgentConfigStatus,
  AgentPageCapabilities,
  AgentParamDef,
  UiPageCapabilityConfig
} from '@/api/agent/agentUiCapability'

/**
 * 前端页面能力在线配置页（路由 /knowledge/agentPageConfig）。
 *
 * 与「能力列表配置」（agentConfig.vue，配置后端工具描述）互补：
 * 这里配置的是 src/agent 下各 <pageKey>.ts 声明的页面能力说明
 * （页面标题、高亮元素 / 弹框 / 命令及其参数的 desc），这些内容会进入
 * system prompt 的「页面能力清单」，并决定模型可以下发哪些 UI 事件。
 *
 * 链路：
 *   GET  /api/agent/ui-capabilities/admin   代码默认值 + 当前生效值 + 覆盖标记
 *   PUT  /api/agent/ui-capabilities/admin   保存人工覆盖 → 后端写 AGENT_UI_CAPABILITY.OVERRIDE_JSON
 *   DELETE ...                             恢复本页代码默认
 *   POST /api/agent/config/restore          一键还原（连工具配置一起清空）
 *
 * 关键约定：前端启动 / 每 5 分钟的定时上报只更新代码基线 BASELINE_JSON，
 * 不会冲掉这里的人工修改；点「一键还原」清空人工覆盖后，
 * 再主动把本地 pageCapabilities 全量上报一次，确保读到的就是当前代码里的配置。
 *
 * 为什么用原生 HTML：与同目录两个调试/配置页保持一致，零组件库依赖。
 */

// ==================== 类型 ====================

interface ParamForm {
  name: string
  desc: string
  type?: string
  required?: boolean
  enums?: string[]
}

interface ActionForm {
  target: string
  desc: string
  requiredActUrl: string
  params: ParamForm[]
}

interface CapForm {
  title: string
  anchors: { target: string; desc: string }[]
  dialogs: ActionForm[]
  commands: ActionForm[]
}

type CapItem = { target: string; desc: string; requiredActUrl?: string; params?: AgentParamDef[] }

// ==================== 请求 ====================
// @/utils/request 的响应经 normalize 拦截，业务数据在 res.data。

async function fetchConfigs(): Promise<UiPageCapabilityConfig[]> {
  const res: any = await listUiCapabilityConfigs()
  return (res?.data ?? []) as UiPageCapabilityConfig[]
}

async function fetchStatus(): Promise<AgentConfigStatus | null> {
  const res: any = await getAgentConfigStatus()
  return (res?.data ?? null) as AgentConfigStatus | null
}

/** 保存：整份声明 PUT 给后端，后端按代码基线校正契约字段后落库 */
async function putConfig(page: AgentPageCapabilities, client: string): Promise<string> {
  const res: any = await saveUiCapabilityOverride(page, client)
  return String(res?.message ?? '已生效')
}

async function resetPageConfig(route: string, client: string): Promise<string> {
  const res: any = await removeUiCapabilityOverride(route, client)
  return String(res?.message ?? '已恢复代码默认')
}

// ==================== 状态 ====================

const configs = ref<UiPageCapabilityConfig[]>([])
const current = ref<UiPageCapabilityConfig | null>(null)
const status = ref<AgentConfigStatus | null>(null)
const loading = ref(false)
const saving = ref(false)
/** 当前正在逐行还原的页面路由（= AGENT_UI_CAPABILITY 的一行） */
const resettingRoute = ref('')
const keyword = ref('')
const previewTab = ref<'json' | 'baseline'>('json')

const toast = ref<{ type: 'ok' | 'err' | 'info'; text: string } | null>(null)
let toastTimer: number | undefined
function notify(type: 'ok' | 'err' | 'info', text: string) {
  toast.value = { type, text }
  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }
  toastTimer = window.setTimeout(() => (toast.value = null), 6000)
}

const emptyForm = (): CapForm => ({ title: '', anchors: [], dialogs: [], commands: [] })
const form = ref<CapForm>(emptyForm())
const original = ref<CapForm>(emptyForm())

const dirty = computed(
  () => !!current.value && JSON.stringify(form.value) !== JSON.stringify(original.value)
)

const filteredConfigs = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) {
    return configs.value
  }
  return configs.value.filter(
    (c) =>
      c.route.toLowerCase().includes(kw) ||
      (c.effective?.title ?? c.baseline?.title ?? '').toLowerCase().includes(kw)
  )
})

const stat = computed(() => ({
  total: configs.value.length,
  overridden: configs.value.filter((c) => c.overridden).length
}))

const effective = computed(() => current.value?.effective ?? current.value?.baseline ?? null)

const countOf = (c: UiPageCapabilityConfig): number => {
  const p = c.effective ?? c.baseline
  return (p?.anchors?.length ?? 0) + (p?.dialogs?.length ?? 0) + (p?.commands?.length ?? 0)
}

// ==================== 左侧路由树 ====================

interface RouteTreeDir {
  key: string
  label: string
  path: string
  level: number
  dirs: Map<string, RouteTreeDir>
  leaves: UiPageCapabilityConfig[]
}

/** 拍平后的可渲染节点：目录可折叠，叶子仍对应数据库里的一行 */
interface RouteTreeNode {
  key: string
  kind: 'dir' | 'leaf'
  label: string
  level: number
  path: string
  /** 目录：后代页面数 / 其中被人工改过的行数 */
  count?: number
  changed?: number
  /** 叶子：这一行配置的展示信息 */
  route?: string
  client?: string
  overridden?: boolean
  updatedBy?: string
  updatedAt?: string
  itemCount?: number
  config?: UiPageCapabilityConfig
}

/**
 * 目录显示名：取自 src/router/modules/home.ts 的路由 meta.title，让左侧树与系统导航菜单一致。
 * 未命中的分组回退显示路由段名；新增菜单分组时按需补充即可，不影响树结构。
 */
const ROUTE_DIR_LABELS: Record<string, string> = {
  '/waterUse': '取用水管理',
  '/waterUse/qushuijianguan': '取水监管',
  '/waterUse/tongji': '统计报表',
  '/waterUse/zhengzhao': '证照管理'
}

/** 目录默认展开，只记「被手动收起」的目录；搜索时强制全展开以便定位 */
const collapsedKeys = ref<Set<string>>(new Set())

/**
 * 按 route 的 / 分段构建目录树：最后一段是页面，因此只把前面的段做成目录，
 * 页面作为叶子挂在对应目录下。例如 /waterUse/qushuijianguan/shuiliangjiankong
 * → 取用水管理 / 取水监管 / 页面（取水监管 · 水量监控）。
 */
function buildRouteTree(items: UiPageCapabilityConfig[]): { root: RouteTreeDir; dirKeys: string[] } {
  const dirKeys: string[] = []
  const root: RouteTreeDir = {
    key: 'root',
    label: '',
    path: '',
    level: -1,
    dirs: new Map(),
    leaves: []
  }
  for (const config of items) {
    const segments = (config.route || '').split('/').filter(Boolean)
    let dir = root
    let path = ''
    for (const segment of segments.slice(0, -1)) {
      path += '/' + segment
      let child = dir.dirs.get(segment)
      if (!child) {
        child = {
          key: 'd:' + path,
          label: ROUTE_DIR_LABELS[path] || segment,
          path,
          level: dir.level + 1,
          dirs: new Map(),
          leaves: []
        }
        dir.dirs.set(segment, child)
        dirKeys.push(child.key)
      }
      dir = child
    }
    dir.leaves.push(config)
  }
  return { root, dirKeys }
}

/** 递归统计目录下的页面总数与人工覆盖数，显示在目录节点右侧 */
function countTree(dir: RouteTreeDir): { total: number; changed: number } {
  let total = dir.leaves.length
  let changed = dir.leaves.filter((c) => c.overridden).length
  for (const child of dir.dirs.values()) {
    const sub = countTree(child)
    total += sub.total
    changed += sub.changed
  }
  return { total, changed }
}

const treeNodes = computed<RouteTreeNode[]>(() => {
  const { root } = buildRouteTree(filteredConfigs.value)
  const searching = !!keyword.value.trim()
  const result: RouteTreeNode[] = []
  const walk = (dir: RouteTreeDir) => {
    const dirs = [...dir.dirs.values()].sort((a, b) => a.label.localeCompare(b.label))
    for (const child of dirs) {
      const sub = countTree(child)
      result.push({
        key: child.key,
        kind: 'dir',
        label: child.label,
        path: child.path,
        level: child.level,
        count: sub.total,
        changed: sub.changed
      })
      if (searching || !collapsedKeys.value.has(child.key)) {
        walk(child)
      }
    }
    const leaves = [...dir.leaves].sort((a, b) => a.route.localeCompare(b.route))
    for (const config of leaves) {
      result.push({
        key: 'l:' + config.client + '|' + config.route,
        kind: 'leaf',
        label: config.effective?.title || config.baseline?.title || config.route,
        level: dir.level + 1,
        path: config.route,
        route: config.route,
        client: config.client,
        overridden: config.overridden,
        updatedBy: config.updatedBy,
        updatedAt: config.updatedAt,
        itemCount: countOf(config),
        config
      })
    }
  }
  walk(root)
  return result
})

function isExpanded(key: string): boolean {
  return !!keyword.value.trim() || !collapsedKeys.value.has(key)
}

function toggleDir(key: string) {
  const next = new Set(collapsedKeys.value)
  if (isExpanded(key)) {
    next.add(key)
  } else {
    next.delete(key)
  }
  collapsedKeys.value = next
}

function expandAll() {
  collapsedKeys.value = new Set()
}

function collapseAll() {
  const { dirKeys } = buildRouteTree(filteredConfigs.value)
  collapsedKeys.value = new Set(dirKeys)
}

function onLeafClick(node: RouteTreeNode) {
  if (node.config) {
    void selectConfig(node.config)
  }
}

function onLeafReset(node: RouteTreeNode) {
  if (node.config) {
    void resetRow(node.config)
  }
}

/** 实际发出的 PUT 请求体：契约字段原样带回，后端会强制以代码基线为准 */
const payload = computed<AgentPageCapabilities>(() => ({
  route: current.value?.route ?? '',
  title: form.value.title.trim(),
  requiredActUrl: effective.value?.requiredActUrl ?? '',
  version: effective.value?.version ?? '',
  anchors: form.value.anchors.map((a) => ({ target: a.target, desc: a.desc.trim() })),
  dialogs: form.value.dialogs.map((d) => ({
    target: d.target,
    desc: d.desc.trim(),
    requiredActUrl: d.requiredActUrl,
    params: d.params.map((p) => ({ name: p.name, desc: p.desc.trim() }))
  })),
  commands: form.value.commands.map((d) => ({
    target: d.target,
    desc: d.desc.trim(),
    requiredActUrl: d.requiredActUrl,
    params: d.params.map((p) => ({ name: p.name, desc: p.desc.trim() }))
  }))
}))

const jsonPreview = computed(() => JSON.stringify(payload.value, null, 2))
const baselinePreview = computed(() => JSON.stringify(current.value?.baseline ?? null, null, 2))

// ==================== 表单 ====================

function toParams(params?: AgentParamDef[]): ParamForm[] {
  return (params ?? []).map((p) => ({
    name: p.name,
    desc: p.desc ?? '',
    type: p.type,
    required: p.required,
    enums: p.enums
  }))
}

function toActions(items?: CapItem[]): ActionForm[] {
  return (items ?? []).map((item) => ({
    target: item.target,
    desc: item.desc ?? '',
    requiredActUrl: item.requiredActUrl ?? '',
    params: toParams(item.params)
  }))
}

function fillForm(vo: UiPageCapabilityConfig) {
  const src = vo.effective ?? vo.baseline
  form.value = {
    title: src?.title ?? '',
    anchors: (src?.anchors ?? []).map((a) => ({ target: a.target, desc: a.desc ?? '' })),
    dialogs: toActions(src?.dialogs ?? []),
    commands: toActions(src?.commands ?? [])
  }
  original.value = JSON.parse(JSON.stringify(form.value))
}

// ==================== 操作 ====================

async function loadList(keepSelection = false) {
  loading.value = true
  try {
    configs.value = await fetchConfigs()
    if (!configs.value.length) {
      current.value = null
      notify(
        'info',
        '后端还没有页面能力基线：先打开一次系统让前端上报，或点「一键还原」重新上报代码声明'
      )
      return
    }
    const route = keepSelection ? current.value?.route : undefined
    const next = (route && configs.value.find((c) => c.route === route)) || configs.value[0]
    current.value = next
    fillForm(next)
  } catch (e: any) {
    notify('err', `读取页面能力配置失败：${e?.message ?? e}。请确认后端已执行 sql/agent_config.sql`)
  } finally {
    loading.value = false
  }
}

async function loadStatus() {
  try {
    status.value = await fetchStatus()
  } catch {
    status.value = null
  }
}

async function selectConfig(vo: UiPageCapabilityConfig) {
  if (current.value?.route === vo.route) {
    return
  }
  if (dirty.value && !window.confirm('当前有未保存的修改，确定要切换页面吗？')) {
    return
  }
  current.value = vo
  fillForm(vo)
}

function discard() {
  if (!current.value) {
    return
  }
  fillForm(current.value)
  notify('info', '已还原为服务端当前生效值')
}

async function save() {
  if (!current.value || saving.value) {
    return
  }
  if (!form.value.title.trim()) {
    notify('err', '页面标题不能为空')
    return
  }
  saving.value = true
  try {
    const message = await putConfig(payload.value, current.value.client)
    await loadList(true)
    await loadStatus()
    notify('ok', `${message}：${current.value?.route} 的说明已写入数据库，下一次提问立即生效`)
  } catch (e: any) {
    notify('err', `保存失败：${e?.message ?? e}。请确认账号拥有 /agent/ui-capabilities/update 权限`)
  } finally {
    saving.value = false
  }
}

/**
 * 逐行还原：一个细项 = AGENT_UI_CAPABILITY 表里的一行（CLIENT + ROUTE）。
 * 只清空该行的 OVERRIDE_JSON，代码基线 BASELINE_JSON 原样保留，运行时回到前端代码默认声明。
 * 列表每项的「还原本行」与编辑区底部「恢复本页代码默认」共用这条路径。
 */
async function resetRow(vo: UiPageCapabilityConfig) {
  if (saving.value || resettingRoute.value) {
    return
  }
  if (!vo.overridden) {
    notify('info', `${vo.route} 当前就是代码默认声明，该行没有人工覆盖，无需还原`)
    return
  }
  // 还原后会重新拉清单与详情；若编辑区还有另一个页面的未保存修改，先让用户确认
  if (
    dirty.value &&
    current.value?.route !== vo.route &&
    !window.confirm('当前有未保存的修改，还原其它页面会丢弃这些修改，确定继续吗？')
  ) {
    return
  }
  if (
    !window.confirm(
      `确定还原「${vo.route}」吗？\n会清空 AGENT_UI_CAPABILITY 表中这一行的人工覆盖（OVERRIDE_JSON），运行时回到前端代码默认声明，且不可撤销。`
    )
  ) {
    return
  }
  resettingRoute.value = vo.route
  try {
    const message = await resetPageConfig(vo.route, vo.client)
    await loadList(true)
    await loadStatus()
    notify('ok', `${message}：${vo.route} 已回到代码默认`)
  } catch (e: any) {
    notify('err', `还原失败：${e?.message ?? e}`)
  } finally {
    resettingRoute.value = ''
  }
}

function resetPage() {
  if (current.value) {
    void resetRow(current.value)
  }
}

/**
 * 一键还原：清空两个配置页的全部人工修改 → 重新把本地代码声明全量上报为基线 → 刷新。
 * 这样「读取代码中的配置」不依赖后端是否还记得上一次发布时的声明。
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
    await reportAgentCapabilities({ client: 'web', full: true, pages: pageCapabilities })
    await loadList(true)
    await loadStatus()
    notify(
      'ok',
      `一键还原完成：清除工具配置 ${r.toolOverrides ?? 0} 条、页面能力配置 ${r.uiOverrides ?? 0} 条，已重新读取前端代码声明`
    )
  } catch (e: any) {
    notify('err', `一键还原失败：${e?.message ?? e}`)
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
  <div class="page-config">
    <div class="pc-head">
      <div class="pc-head-main">
        <span class="pc-title">页面能力配置</span>
        <span class="pc-sub">
          改的是模型提示词里的「页面能力清单」，保存后立即落库生效；target / 权限等契约由代码决定
        </span>
      </div>
      <div class="pc-head-ops">
        <span v-if="status" class="pc-store">
          存储：工具 {{ status?.toolStore }} / 页面 {{ status?.uiStore }} · 已改
          {{ (status?.toolOverrides ?? 0) + (status?.uiOverrides ?? 0) }} 条
        </span>
        <button class="pc-btn" :disabled="loading || saving" @click="loadList(true)">
          {{ loading ? '加载中…' : '刷新清单' }}
        </button>
        <button class="pc-btn is-danger" :disabled="saving" @click="restoreAll">一键还原</button>
      </div>
    </div>

    <div class="pc-guide">
      <span><b>①</b> 左侧选页面</span>
      <span><b>②</b> 改标题与各能力项的说明</span>
      <span><b>③</b> 点「保存并落库」，改动写入 AGENT_UI_CAPABILITY.OVERRIDE_JSON</span>
      <em>
        每个细项 = 数据库里的一行：列表「还原本行」只清空该行的 OVERRIDE_JSON；顶部「一键还原」清空两类配置的全部人工修改
      </em>
    </div>

    <div v-if="toast" class="pc-toast" :class="`is-${toast.type}`">{{ toast.text }}</div>

    <div class="pc-body">
      <!-- 左：按路由分层的能力清单树（目录可折叠，叶子 = 数据库里的一行） -->
      <div class="pc-list">
        <div class="pc-list-head">
          <input v-model="keyword" class="pc-input" placeholder="搜索路由 / 页面标题" />
          <div class="pc-list-stat">
            共 {{ stat.total }} 页 · 人工改过 {{ stat.overridden }} 页
          </div>
          <div class="pc-tree-ops">
            <button class="pc-link" @click="expandAll">全部展开</button>
            <button class="pc-link" @click="collapseAll">全部收起</button>
            <span v-if="keyword.trim()" class="pc-tree-tip">搜索时自动展开</span>
          </div>
        </div>
        <div class="pc-items">
          <template v-for="node in treeNodes" :key="node.key">
            <div
              v-if="node.kind === 'dir'"
              class="pc-dir"
              :style="{ paddingLeft: 10 + node.level * 14 + 'px' }"
              :title="node.path"
              @click="toggleDir(node.key)"
            >
              <span class="pc-dir-arrow">{{ isExpanded(node.key) ? '▾' : '▸' }}</span>
              <span class="pc-dir-label">{{ node.label }}</span>
              <span class="pc-dir-count">{{ node.count }} 页</span>
              <span v-if="node.changed" class="pc-dir-changed">改 {{ node.changed }}</span>
            </div>
            <div
              v-else
              class="pc-item"
              :class="{ active: current?.route === node.route && current?.client === node.client }"
              :style="{ paddingLeft: 10 + node.level * 14 + 'px' }"
              @click="onLeafClick(node)"
            >
              <div class="pc-item-top">
                <span class="pc-item-title">{{ node.label }}</span>
                <span v-if="node.overridden" class="pc-badge is-edit">已改</span>
                <span v-else class="pc-badge">代码默认</span>
              </div>
              <code class="pc-item-route">{{ node.route }}</code>
              <div class="pc-item-count">{{ node.itemCount }} 个能力项 · {{ node.client }}</div>
              <div class="pc-item-row">
                <span v-if="node.overridden" class="pc-db-row">
                  DB 有覆盖 · {{ node.updatedBy || '-' }} {{ node.updatedAt || '' }}
                </span>
                <span v-else class="pc-db-row is-default">代码默认 · 无覆盖</span>
                <button
                  class="pc-row-reset"
                  :disabled="!node.overridden || !!resettingRoute || saving"
                  :title="node.overridden ? '清空 AGENT_UI_CAPABILITY 中该行的 OVERRIDE_JSON' : '当前已是代码默认声明，该行没有人工覆盖'"
                  @click.stop="onLeafReset(node)"
                >
                  {{ resettingRoute === node.route ? '还原中…' : (node.overridden ? '还原本行' : '无需还原') }}
                </button>
              </div>
            </div>
          </template>
          <div v-if="!treeNodes.length && !loading" class="pc-empty">没有匹配的页面</div>
          <div v-if="loading" class="pc-empty">正在读取配置…</div>
        </div>
      </div>

      <!-- 右：编辑器 -->
      <div class="pc-editor">
        <template v-if="current">
          <div class="pc-editor-head">
            <div>
              <span class="pc-editor-title">{{ current.effective?.title || current.baseline?.title }}</span>
              <code class="pc-editor-route">{{ current.route }}</code>
            </div>
            <div class="pc-meta">
              <span :class="current.overridden ? 'pc-state is-edit' : 'pc-state'">
                {{ current.overridden ? '人工覆盖' : '代码默认' }}
              </span>
              <span v-if="current.updatedAt" class="pc-updated">
                {{ current.updatedBy || '-' }} · {{ current.updatedAt }}
              </span>
            </div>
          </div>

          <div class="pc-scroll">
            <section class="pc-section">
              <div class="pc-grid">
                <div class="pc-field">
                  <label class="pc-label">页面标题 title <span class="pc-star">★ 进入提示词</span></label>
                  <input v-model="form.title" class="pc-input" placeholder="给模型看的页面名" />
                </div>
                <div class="pc-field">
                  <label class="pc-label">权限 URL / 版本（只读，代码决定）</label>
                  <div class="pc-readonly-inline">
                    <code>{{ effective?.requiredActUrl || '（无）' }}</code>
                    <code>v{{ effective?.version || '-' }}</code>
                    <code>client={{ current.client }}</code>
                  </div>
                </div>
              </div>
            </section>

            <section class="pc-section">
              <div class="pc-section-head">
                <b>高亮元素 anchors</b>
                <span>{{ form.anchors.length }} 项 · 改 desc 会影响模型何时建议高亮</span>
              </div>
              <div v-for="a in form.anchors" :key="a.target" class="pc-cap-row">
                <code class="pc-target">{{ a.target }}</code>
                <input v-model="a.desc" class="pc-input" placeholder="这是什么 / 什么场景下建议高亮" />
              </div>
              <div v-if="!form.anchors.length" class="pc-none">该页面没有声明高亮元素</div>
            </section>

            <section class="pc-section">
              <div class="pc-section-head">
                <b>弹框 dialogs</b>
                <span>{{ form.dialogs.length }} 项 · 改 desc / 参数说明会影响模型选不选它</span>
              </div>
              <div v-for="item in form.dialogs" :key="item.target" class="pc-cap-card">
                <div class="pc-cap-row">
                  <code class="pc-target">{{ item.target }}</code>
                  <input v-model="item.desc" class="pc-input" placeholder="给模型看的说明" />
                </div>
                <div v-if="item.params.length" class="pc-params">
                  <div v-for="p in item.params" :key="p.name" class="pc-param">
                    <code>{{ p.name }}</code>
                    <span class="pc-param-meta">
                      {{ p.type || 'string' }}{{ p.required ? ' · 必填' : '' }}
                    </span>
                    <input v-model="p.desc" class="pc-input" placeholder="参数说明" />
                  </div>
                </div>
              </div>
              <div v-if="!form.dialogs.length" class="pc-none">该页面没有声明弹框</div>
            </section>

            <section class="pc-section">
              <div class="pc-section-head">
                <b>命令 commands</b>
                <span>{{ form.commands.length }} 项 · 改 desc / 参数说明会影响模型选不选它</span>
              </div>
              <div v-for="item in form.commands" :key="item.target" class="pc-cap-card">
                <div class="pc-cap-row">
                  <code class="pc-target">{{ item.target }}</code>
                  <input v-model="item.desc" class="pc-input" placeholder="给模型看的说明" />
                </div>
                <div v-if="item.params.length" class="pc-params">
                  <div v-for="p in item.params" :key="p.name" class="pc-param">
                    <code>{{ p.name }}</code>
                    <span class="pc-param-meta">
                      {{ p.type || 'string' }}{{ p.required ? ' · 必填' : '' }}
                    </span>
                    <input v-model="p.desc" class="pc-input" placeholder="参数说明" />
                  </div>
                </div>
              </div>
              <div v-if="!form.commands.length" class="pc-none">该页面没有声明命令</div>
            </section>

            <section class="pc-section">
              <div class="pc-tabs">
                <button
                  class="pc-tab"
                  :class="{ active: previewTab === 'json' }"
                  @click="previewTab = 'json'"
                >
                  实际发出的请求体
                </button>
                <button
                  class="pc-tab"
                  :class="{ active: previewTab === 'baseline' }"
                  @click="previewTab = 'baseline'"
                >
                  代码默认（还原对照）
                </button>
                <span class="pc-tab-note">PUT /api/agent/ui-capabilities/admin</span>
              </div>
              <pre class="pc-pre">{{ previewTab === 'json' ? jsonPreview : baselinePreview }}</pre>
              <p class="pc-hint">
                target / 参数类型 / 权限 URL 由代码声明决定，只读；后端保存时会以代码基线强制校正。
              </p>
            </section>
          </div>

          <div class="pc-footer">
            <span v-if="dirty" class="pc-dirty">● 有未保存的修改</span>
            <span v-else class="pc-clean">与服务端当前生效值一致</span>
            <div class="pc-footer-ops">
              <button class="pc-btn" :disabled="saving || !dirty" @click="discard">放弃修改</button>
              <button
                class="pc-btn is-danger"
                :disabled="saving || !!resettingRoute || !current.overridden"
                @click="resetPage"
              >
                {{ resettingRoute === current.route ? '还原中…' : '恢复本页代码默认' }}
              </button>
              <button class="pc-btn is-primary" :disabled="saving" @click="save">
                {{ saving ? '保存中…' : '保存并落库' }}
              </button>
            </div>
          </div>
        </template>

        <div v-else class="pc-editor-empty">
          暂无页面能力声明。请确认后端已启动并执行 sql/agent_config.sql，然后点「刷新清单」或「一键还原」重新上报代码声明。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-config {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  min-height: 620px;
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
}

.pc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.pc-head-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.pc-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2d3d;
}

.pc-sub,
.pc-store {
  font-size: 12px;
  color: #8492a6;
}

.pc-head-ops,
.pc-footer-ops {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pc-guide {
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

.pc-toast {
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

.pc-body {
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;
}

.pc-list {
  display: flex;
  flex-direction: column;
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  overflow: hidden;
}

.pc-list-head {
  padding: 10px;
  border-bottom: 1px solid #eef1f6;
}

.pc-list-stat {
  margin-top: 8px;
  font-size: 12px;
  color: #8492a6;
}

/* 路由树操作条 */
.pc-tree-ops {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.pc-link {
  padding: 0;
  font-size: 11px;
  color: #2b8dff;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    text-decoration: underline;
  }
}

.pc-tree-tip {
  margin-left: auto;
  font-size: 11px;
  color: #a0aec0;
}

/* 目录节点：按路由段分层，可折叠；缩进由内联 padding-left 控制 */
.pc-dir {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 7px;
  padding-right: 10px;
  padding-bottom: 7px;
  font-size: 12px;
  color: #475669;
  cursor: pointer;
  background: #f8fafc;
  border-bottom: 1px solid #eef1f6;
  border-left: 3px solid transparent;

  &:hover {
    background: #eef4ff;
    border-left-color: #9ec5ff;
  }
}

.pc-dir-arrow {
  width: 12px;
  flex-shrink: 0;
  font-size: 11px;
  color: #8492a6;
}

.pc-dir-label {
  font-weight: bold;
  color: #33445c;
  word-break: break-all;
}

.pc-dir-count {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 11px;
  color: #a0aec0;
}

.pc-dir-changed {
  flex-shrink: 0;
  padding: 1px 5px;
  font-size: 10px;
  color: #b26a00;
  background: #fff2d9;
  border-radius: 3px;
}

.pc-items {
  flex: 1;
  overflow-y: auto;
}

.pc-item {
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

.pc-item-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pc-item-title {
  font-size: 13px;
  font-weight: bold;
  color: #1f2d3d;
}

.pc-item-route {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  color: #8492a6;
  font-family: Consolas, Monaco, monospace;
  word-break: break-all;
}

.pc-item-count {
  margin-top: 4px;
  font-size: 11px;
  color: #a0aec0;
}

/* 每个细项对应数据库里的一行：显示该行是否有人工覆盖 + 单独还原按钮 */
.pc-item-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.pc-db-row {
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

.pc-row-reset {
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

.pc-badge {
  padding: 1px 6px;
  font-size: 11px;
  color: #8492a6;
  background: #f1f4f9;
  border-radius: 3px;

  &.is-edit {
    color: #b26a00;
    background: #fff2d9;
  }
}

.pc-empty,
.pc-editor-empty,
.pc-none {
  padding: 18px 12px;
  font-size: 12px;
  color: #98a1ad;
  text-align: center;
}

.pc-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  overflow: hidden;
}

.pc-editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #eef1f6;
}

.pc-editor-title {
  margin-right: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #1f2d3d;
}

.pc-editor-route {
  font-size: 12px;
  color: #8492a6;
  font-family: Consolas, Monaco, monospace;
}

.pc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pc-state {
  padding: 2px 8px;
  font-size: 11px;
  color: #607086;
  background: #f1f4f9;
  border-radius: 3px;

  &.is-edit {
    color: #b26a00;
    background: #fff2d9;
  }
}

.pc-updated {
  font-size: 11px;
  color: #a0aec0;
}

.pc-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

.pc-section {
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid #eef1f6;
  border-radius: 8px;
}

.pc-section-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #33445c;

  span {
    font-size: 11px;
    color: #a0aec0;
  }
}

.pc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pc-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: bold;
  color: #33445c;
}

.pc-star {
  margin-left: 6px;
  font-size: 11px;
  font-weight: normal;
  color: #2b8dff;
}

.pc-input {
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

.pc-readonly-inline {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 10px;
  font-size: 11px;
  color: #8492a6;
  background: #f8fafc;
  border-radius: 5px;
  font-family: Consolas, Monaco, monospace;
}

.pc-cap-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pc-target {
  min-width: 180px;
  max-width: 180px;
  font-size: 12px;
  color: #2b8dff;
  font-family: Consolas, Monaco, monospace;
  word-break: break-all;
}

.pc-cap-card {
  margin-bottom: 10px;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #eef1f6;
  border-radius: 6px;
}

.pc-params {
  margin-top: 8px;
  padding-left: 8px;
  border-left: 2px solid #d5e5ff;
}

.pc-param {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  code {
    min-width: 90px;
    font-size: 12px;
    color: #607086;
    font-family: Consolas, Monaco, monospace;
  }

  .pc-input {
    flex: 1;
  }
}

.pc-param-meta {
  min-width: 92px;
  font-size: 11px;
  color: #a0aec0;
}

.pc-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pc-tab {
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

.pc-tab-note {
  margin-left: auto;
  font-size: 11px;
  color: #a0aec0;
  font-family: Consolas, Monaco, monospace;
}

.pc-pre {
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

.pc-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #8492a6;
}

.pc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-top: 1px solid #eef1f6;
}

.pc-dirty {
  font-size: 12px;
  color: #b26a00;
}

.pc-clean {
  font-size: 12px;
  color: #a0aec0;
}

.pc-btn {
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
