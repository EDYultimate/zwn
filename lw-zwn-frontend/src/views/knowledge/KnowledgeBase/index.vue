<script setup lang="ts">
// ============================================================
// 知识管理 · 知识库（全部真实数据，无演示数据）
// 左侧：文档类型树（/knowledge/doc-types，可增删改名）
// 右侧：后端文件分页列表（GET /knowledge/files/page）
//   增 → POST /knowledge/files/uploadBatch（上传弹框，携带 typeId）
//   删 → DELETE /knowledge/files/{fileId}
//   改 → PUT /knowledge/files/{fileId}（重命名，只改展示名与文档标题）
//   查 → GET /knowledge/files/page?typeId=&keyword=&pageNumber=&pageSize=
// 上传成功后自动刷新列表与统计，另提供手动「刷新」
// ============================================================
import { computed, onMounted, reactive, ref } from 'vue'
import ProTable from '@/components/common/ProTable'
import type { VxeGridPropTypes } from 'vxe-pc-ui/types/components/grid'
import type { VxePagerProps } from 'vxe-pc-ui/types/components/pager'
import {
  createDocType,
  deleteDocType,
  getDocTypeTree,
  updateDocType,
  type KnowledgeDocTypeNode
} from '@/api/knowledge/docType'
import {
  deleteKnowledgeFile,
  getKnowledgeFileStats,
  pageKnowledgeFiles,
  purgeUnclassifiedFiles,
  renameKnowledgeFile,
  type KnowledgeFileRow,
  type KnowledgeFileStats
} from '@/api/knowledge/knowledgeFile'
import DocDeleteModal from './components/DocDeleteModal.vue'
import DocRenameModal from './components/DocRenameModal.vue'
import DocTypeModal from './components/DocTypeModal.vue'
import DocUploadModal from './components/DocUploadModal.vue'

// ---------------- 文档类型树（后端维护） ----------------
const treeNodes = ref<KnowledgeDocTypeNode[]>([])
const treeLoading = ref(false)
// 已展开节点 ID（默认全部展开）
const expanded = ref<Set<string>>(new Set())
// 当前选中的类型节点 ID
const curTypeId = ref('')

// ---------------- 文档列表（后端真实数据） ----------------
// 输入框里的关键字
const keyword = ref('')
// 已提交检索的关键字（服务端过滤）
const query = ref('')
const files = ref<KnowledgeFileRow[]>([])
const listLoading = ref(false)
const refreshing = ref(false)
const stats = ref<KnowledgeFileStats | null>(null)
// 是否在看「未归类」历史数据（TYPE_ID 为空，类型树上线前的旧上传）
const unclassifiedView = ref(false)

/** 分页状态：total 由后端分页接口返回，前端只负责翻页 */
const pager = reactive({ pageNumber: 1, pageSize: 20, total: 0 })

const totalDocs = computed(() => stats.value?.docs ?? 0)

interface FlatTypeRow {
  node: KnowledgeDocTypeNode
  depth: number
  hasChildren: boolean
}

const flatNodes = computed<FlatTypeRow[]>(() => {
  const rows: FlatTypeRow[] = []
  const walk = (list: KnowledgeDocTypeNode[], depth: number) => {
    list.forEach((node) => {
      const children = node.children ?? []
      rows.push({ node, depth, hasChildren: children.length > 0 })
      if (children.length && expanded.value.has(node.typeId)) {
        walk(children, depth + 1)
      }
    })
  }
  walk(treeNodes.value, 0)
  return rows
})

const typeMap = computed(() => {
  const map = new Map<string, KnowledgeDocTypeNode>()
  const walk = (list: KnowledgeDocTypeNode[]) => {
    list.forEach((node) => {
      map.set(node.typeId, node)
      walk(node.children ?? [])
    })
  }
  walk(treeNodes.value)
  return map
})

const curType = computed(() => typeMap.value.get(curTypeId.value) ?? null)
// 未归类视图下也视为「已选中某个视图」，但不可上传
const curTypeName = computed(() =>
  unclassifiedView.value ? '未归类（历史数据）' : (curType.value?.typeName ?? '—')
)
const hasSelection = computed(() => unclassifiedView.value || !!curType.value)
const unclassifiedCount = computed(() => stats.value?.unclassified ?? 0)

const uploadRef = ref<InstanceType<typeof DocUploadModal>>()
const deleteRef = ref<InstanceType<typeof DocDeleteModal>>()
const renameRef = ref<InstanceType<typeof DocRenameModal>>()
const typeModalRef = ref<InstanceType<typeof DocTypeModal>>()

const deleteRow = ref<KnowledgeFileRow | null>(null)

// 顶级轻提示
const toastMsg = ref('')
let toastTimer: number | undefined
function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 2200)
}

function errText(e: unknown): string {
  const err = e as { message?: string; response?: { data?: { message?: string } } }
  return err?.message || err?.response?.data?.message || '操作失败，请稍后重试'
}

/** 节点下文档数（含子节点），直接取后端 docCount */
function nodeTotal(node: KnowledgeDocTypeNode): number {
  const own = node.docCount ?? 0
  return (node.children ?? []).reduce((sum, child) => sum + nodeTotal(child), own)
}

/** 树行缩进（层级越深越靠右） */
function rowStyle(row: FlatTypeRow): Record<string, string> {
  return { paddingLeft: `${10 + row.depth * 16}px` }
}

/** 展开 / 收起节点 */
function toggleNode(node: KnowledgeDocTypeNode) {
  if (!node.children?.length) {
    return
  }
  const next = new Set(expanded.value)
  if (next.has(node.typeId)) {
    next.delete(node.typeId)
  } else {
    next.add(node.typeId)
  }
  expanded.value = next
}

/** 拉取类型树；selectId 用于新增 / 改名后保持选中 */
async function loadTree(selectId?: string) {
  treeLoading.value = true
  try {
    const res = await getDocTypeTree()
    treeNodes.value = res.data ?? []
    const expandIds: string[] = []
    const collect = (list: KnowledgeDocTypeNode[]) => {
      list.forEach((node) => {
        if (node.children?.length) {
          expandIds.push(node.typeId)
          collect(node.children)
        }
      })
    }
    collect(treeNodes.value)
    // 仅首次加载时全部展开，之后保留用户的展开 / 收起状态
    if (!expanded.value.size) {
      expanded.value = new Set(expandIds)
    }
    const target = selectId || curTypeId.value
    curTypeId.value = target && typeMap.value.has(target) ? target : ''
  } finally {
    treeLoading.value = false
  }
}

/** 知识库总量（后端统计） */
async function loadStats() {
  try {
    const res = await getKnowledgeFileStats()
    stats.value = res.data ?? null
  } catch {
    stats.value = null
  }
}

/** 当前类型（或未归类视图）下的真实文档分页列表（关键字、分页均走服务端） */
async function loadFiles() {
  if (!unclassifiedView.value && !curTypeId.value) {
    files.value = []
    pager.total = 0
    return
  }
  listLoading.value = true
  try {
    const res = await pageKnowledgeFiles({
      typeId: unclassifiedView.value ? undefined : curTypeId.value,
      unclassified: unclassifiedView.value || undefined,
      keyword: query.value || undefined,
      pageNumber: pager.pageNumber,
      pageSize: pager.pageSize
    })
    files.value = res.data?.records ?? []
    pager.total = Number(res.data?.total ?? 0)
    // 删除末页最后一条后当前页会变空，回退一页重新拉取
    if (!files.value.length && pager.total > 0 && pager.pageNumber > 1) {
      pager.pageNumber -= 1
      await loadFiles()
    }
  } catch (e) {
    files.value = []
    pager.total = 0
    window.$message?.error(errText(e))
  } finally {
    listLoading.value = false
  }
}

/** 分页器翻页 / 改每页条数：ProTable 只抛出分页事件，数据由页面重新请求 */
function handlePageChange(p: VxePagerProps) {
  pager.pageNumber = Number(p.currentPage ?? 1)
  pager.pageSize = Number(p.pageSize ?? pager.pageSize)
  loadFiles()
}

/**
 * 刷新列表 + 统计 + 类型树文档数。
 * 三个请求互相独立，用 allSettled：类型树接口异常时不能连列表刷新一起中断。
 */
async function refreshAll() {
  await Promise.allSettled([loadTree(curTypeId.value), loadStats(), loadFiles()])
}

/** 手动刷新 */
async function refresh() {
  if (!hasSelection.value) {
    toast('请先在左侧选择文档类型')
    return
  }
  refreshing.value = true
  try {
    await Promise.allSettled([loadTree(curTypeId.value), loadStats(), loadFiles()])
    toast(`已刷新「${curTypeName.value}」文档列表`)
  } finally {
    refreshing.value = false
  }
}

/** 选中类型节点：清空关键词并加载该类型文档 */
function selectNode(typeId: string) {
  if (typeId === curTypeId.value && !unclassifiedView.value) {
    return
  }
  unclassifiedView.value = false
  curTypeId.value = typeId
  keyword.value = ''
  query.value = ''
  pager.pageNumber = 1
  loadFiles()
}

/** 选中「未归类」视图：看类型树上线前的历史数据 */
function selectUnclassified() {
  if (unclassifiedView.value) {
    return
  }
  unclassifiedView.value = true
  curTypeId.value = ''
  keyword.value = ''
  query.value = ''
  pager.pageNumber = 1
  loadFiles()
}

/** 检索（服务端按文件名 / 文档标题过滤），换关键词后回到第一页 */
function search() {
  if (!hasSelection.value) {
    toast('请先在左侧选择文档类型')
    return
  }
  query.value = keyword.value.trim()
  pager.pageNumber = 1
  loadFiles()
}

// ---------------- 类型节点增删改（后端维护） ----------------
interface DocTypeModalPayload {
  mode: 'create' | 'rename'
  parentId?: string | null
  typeId?: string
  name: string
}

function openCreateRoot() {
  typeModalRef.value?.show({ mode: 'create', title: '新增文档类型', parentName: '根节点' })
}

function openCreateChild(node: KnowledgeDocTypeNode) {
  typeModalRef.value?.show({
    mode: 'create',
    title: `在「${node.typeName}」下新增类型`,
    parentId: node.typeId,
    parentName: node.typeName
  })
}

function openRenameType(node: KnowledgeDocTypeNode) {
  typeModalRef.value?.show({
    mode: 'rename',
    title: '重命名文档类型',
    typeId: node.typeId,
    name: node.typeName
  })
}

/** 新增 / 重命名类型节点 */
async function submitType(payload: DocTypeModalPayload) {
  try {
    if (payload.mode === 'create') {
      const res = await createDocType({
        parentId: payload.parentId ?? null,
        typeName: payload.name
      })
      if (payload.parentId) {
        expanded.value = new Set([...expanded.value, payload.parentId])
      }
      await loadTree(res.data?.typeId)
      toast(`已新增文档类型「${payload.name}」`)
    } else if (payload.typeId) {
      await updateDocType(payload.typeId, { typeName: payload.name })
      await loadTree(payload.typeId)
      toast(`已重命名为「${payload.name}」`)
    }
  } catch (e) {
    window.$message?.error(errText(e))
  }
}

/** 删除类型节点（有子节点或已挂文档时后端拒绝） */
function removeNode(node: KnowledgeDocTypeNode) {
  window.$dialog?.warning({
    title: '删除文档类型',
    content: `确认删除「${node.typeName}」？存在子节点或该类型下已挂文档时将不允许删除。`,
    positiveText: '删 除',
    negativeText: '取 消',
    onPositiveClick: async () => {
      try {
        await deleteDocType(node.typeId)
        if (node.typeId === curTypeId.value) {
          curTypeId.value = ''
          files.value = []
          pager.total = 0
        }
        await Promise.all([loadTree(), loadStats()])
        toast(`已删除文档类型「${node.typeName}」`)
      } catch (e) {
        window.$message?.error(errText(e))
      }
    }
  })
}

// ---------------- 文档增删改查 ----------------
/** 上传入口：必须先选中类型节点，文档挂在所选类型上 */
function openUpload() {
  if (unclassifiedView.value) {
    toast('「未归类」是历史数据视图，请先选择左侧文档类型再上传')
    return
  }
  if (!curType.value) {
    toast('请先在左侧选择一个文档类型')
    return
  }
  uploadRef.value?.show({ typeId: curType.value.typeId, typeName: curTypeName.value })
}

/** 批量清理未归类历史数据（先二次确认） */
function purgeUnclassified() {
  const count = pager.total
  if (!count) {
    toast('当前没有可清理的未归类数据')
    return
  }
  window.$dialog?.warning({
    title: '清理未归类数据',
    content: `将删除 ${count} 条未归类文档的元数据、MinIO 原件与向量，操作不可恢复，确认继续？`,
    positiveText: '清 理',
    negativeText: '取 消',
    onPositiveClick: async () => {
      try {
        const res = await purgeUnclassifiedFiles()
        const data = res.data ?? {}
        const warnings = data.warnings ?? []
        await Promise.allSettled([loadStats(), loadTree(curTypeId.value), loadFiles()])
        // 全部清理干净后退出未归类视图，避免停在空列表上
        if (!unclassifiedCount.value) {
          unclassifiedView.value = false
          files.value = []
          pager.total = 0
        }
        if (warnings.length) {
          window.$message?.warning(`已清理 ${data.files ?? 0} 个文件，${warnings.length} 条失败`)
        } else {
          window.$message?.success(
            `已清理未归类数据：文件 ${data.files ?? 0} 个、文档 ${data.docs ?? 0} 个`
          )
        }
        toast('未归类数据已清理')
      } catch (e) {
        window.$message?.error(errText(e))
      }
    }
  })
}

/** 上传成功：刷新真实列表、统计与树上的文档数 */
async function handleUploaded() {
  await refreshAll()
  toast('文档已入库，列表已刷新')
}

/** 重命名入口 */
function openRename(row: KnowledgeFileRow) {
  if (!row.fileId) {
    return
  }
  renameRef.value?.show({ fileId: row.fileId, fileName: row.fileName })
}

/** 提交重命名 */
async function submitRename(payload: { fileId: string; fileName: string }) {
  try {
    await renameKnowledgeFile(payload.fileId, payload.fileName)
    await Promise.all([loadFiles(), loadTree(curTypeId.value)])
    toast(`已重命名为「${payload.fileName}」`)
  } catch (e) {
    window.$message?.error(errText(e))
  }
}

/** 删除入口 */
function openDelete(row: KnowledgeFileRow) {
  if (!row.fileId) {
    return
  }
  deleteRow.value = row
  deleteRef.value?.show()
}

/** 确认删除：后端删 MinIO 对象 + 达梦元数据 */
async function confirmDelete() {
  const row = deleteRow.value
  deleteRow.value = null
  if (!row?.fileId) {
    return
  }
  try {
    const res = await deleteKnowledgeFile(row.fileId)
    const warning = (res.data as { warning?: string } | undefined)?.warning
    if (warning) {
      window.$message?.warning(warning)
    }
    await refreshAll()
    toast(`已删除《${row.fileName || row.title || '文档'}》`)
  } catch (e) {
    window.$message?.error(errText(e))
  }
}

// ---------------- 展示辅助 ----------------
function formatSize(bytes?: number): string {
  if (!bytes) {
    return '—'
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.ceil(bytes / 1024))} KB`
}

/** 文档格式标签 */
function formatLabel(row: KnowledgeFileRow): string {
  const ext = (row.fileExt || '').toUpperCase()
  if (ext) {
    return ext
  }
  const map: Record<string, string> = { WORD: 'DOC', PDF: 'PDF', EXCEL: 'XLS', OTHER: '文件' }
  return map[row.sourceType ?? ''] ?? '文件'
}

/** 简要信息：原始文件名 + 解析 / 切片状态 */
function infoText(row: KnowledgeFileRow): string {
  const parts = [row.fileName ?? '']
  const status = [row.parseStatus ?? '', row.indexed === 1 ? `${row.chunkCount ?? 0} 切片` : '']
    .filter(Boolean)
    .join(' · ')
  if (status) {
    parts.push(status)
  }
  return parts.filter(Boolean).join(' · ') || '—'
}

/** 表格列：文档名称 / 简要信息 / 格式 / 大小 / 入库时间 / 操作 */
const columns: VxeGridPropTypes.Columns = [
  { field: 'title', title: '文档名称', minWidth: 240, slots: { default: 'docName' } },
  { field: 'fileName', title: '简要信息', minWidth: 260, slots: { default: 'docInfo' } },
  { field: 'fileExt', title: '格式', width: 90, align: 'center', slots: { default: 'docFmt' } },
  {
    field: 'size',
    title: '大小',
    width: 100,
    align: 'center',
    formatter: ({ row }: any) => formatSize(row.size)
  },
  { field: 'createTime', title: '入库时间', width: 170, align: 'center' },
  { title: '操作', width: 340, align: 'center', slots: { default: 'docOps' } }
]

/** 空态文案：按「未选类型 / 有检索词 / 未归类视图 / 普通空目录」区分 */
const emptyText = computed(() => {
  if (!hasSelection.value) {
    return '请在左侧选择一个文档类型后查看 / 上传文档'
  }
  if (query.value) {
    return `「${curTypeName.value}」下未检索到匹配「${query.value}」的文档，请更换关键词`
  }
  if (unclassifiedView.value) {
    return '没有未归类历史数据，无需清理'
  }
  return `「${curTypeName.value}」分类下暂无文档，可点「＋ 上传」添加`
})

/** 原文地址：按需追加 inline / download 参数 */
function fileUrl(row: KnowledgeFileRow, mode: 'inline' | 'download'): string {
  const base = row.resourceUrl ?? ''
  return `${base}${base.includes('?') ? '&' : '?'}${mode}=true`
}

/** 在线预览：直接打开后端原文（PDF / 图片浏览器内预览） */
function preview(row: KnowledgeFileRow) {
  if (!row.resourceUrl) {
    toast('该文件没有可用的原文地址')
    return
  }
  window.open(fileUrl(row, 'inline'), '_blank', 'noopener,noreferrer')
}

/** 下载：走后端原文地址的 download 模式 */
function download(row: KnowledgeFileRow) {
  if (!row.resourceUrl) {
    toast('该文件没有可用的原文地址')
    return
  }
  window.open(fileUrl(row, 'download'), '_blank', 'noopener,noreferrer')
  toast(`《${row.fileName || row.title}》已开始下载`)
}

onMounted(async () => {
  try {
    await Promise.all([loadTree(), loadStats()])
    if (curTypeId.value) {
      await loadFiles()
    }
  } catch (e) {
    window.$message?.error(errText(e))
  }
})
</script>

<template>
  <!-- 知识管理 · 知识库（左侧类型树 + 右侧真实文档列表） -->
  <div class="kb-page">
    <!-- 顶部统计 -->
    <div class="kb-top">
      <div class="kb-stat">
        已加入知识条目 <b>{{ totalDocs.toLocaleString() }}</b> 份
        <span v-if="stats" class="sub">
          文件 {{ stats.files ?? 0 }} 个 · 已索引 {{ stats.indexedFiles ?? 0 }} 个
          <template v-if="unclassifiedCount"> · 未归类 {{ unclassifiedCount }} 个</template>
        </span>
      </div>
    </div>

    <div class="kb-body">
      <!-- 左侧文档类型树（后端维护，可新增 / 改名 / 删除节点） -->
      <div class="kb-tree">
        <div class="kb-tree-hd">
          <span class="ttl">文档类型</span>
          <button class="tadd" type="button" title="新增根类型" @click="openCreateRoot">
            ＋ 新增
          </button>
        </div>

        <div v-if="treeLoading" class="kb-tree-empty">加载中…</div>
        <div v-else-if="!treeNodes.length" class="kb-tree-empty">
          暂无文档类型，点「＋ 新增」创建
        </div>
        <template v-else>
          <div
            v-for="row in flatNodes"
            :key="row.node.typeId"
            class="kb-tree-row"
            :class="[
              row.depth === 0 ? 'kb-tree-top' : 'kb-tree-sub',
              { on: curTypeId === row.node.typeId }
            ]"
            :style="rowStyle(row)"
            @click="selectNode(row.node.typeId)"
          >
            <span
              class="caret"
              :class="{ dn: expanded.has(row.node.typeId) }"
              @click.stop="toggleNode(row.node)"
              >{{ row.hasChildren ? '▸' : '' }}</span
            >
            <span class="tnm">{{ row.node.typeName }}</span>
            <span class="n">{{ nodeTotal(row.node) }}</span>
            <span class="acts">
              <button
                class="act"
                type="button"
                title="新增子类型"
                @click.stop="openCreateChild(row.node)"
              >
                ＋
              </button>
              <button
                class="act"
                type="button"
                title="重命名"
                @click.stop="openRenameType(row.node)"
              >
                ✎
              </button>
              <button
                class="act del"
                type="button"
                title="删除该节点"
                @click.stop="removeNode(row.node)"
              >
                －
              </button>
            </span>
          </div>
        </template>

        <!-- 未归类历史数据：类型树上线前的旧上传，TYPE_ID 为空，只能在这里查看 / 清理 -->
        <div
          v-if="unclassifiedCount"
          class="kb-tree-row kb-tree-top kb-tree-unc"
          :class="{ on: unclassifiedView }"
          title="历史上没有挂文档类型的数据，可查看后清理"
          @click="selectUnclassified"
        >
          <span class="caret"></span>
          <span class="tnm">未归类（历史数据）</span>
          <span class="n">{{ unclassifiedCount }}</span>
        </div>
      </div>

      <!-- 右侧检索与真实文档列表 -->
      <div class="kb-main">
        <div class="kb-search">
          <input v-model="keyword" placeholder="请输入文档名称或关键词" @keydown.enter="search" />
          <button class="lbtn" type="button" @click="search">检 索</button>
          <button
            class="kb-refresh"
            type="button"
            :disabled="refreshing || !hasSelection"
            title="重新拉取列表与统计"
            @click="refresh"
          >
            {{ refreshing ? '刷新中…' : '↻ 刷新' }}
          </button>
          <button
            v-if="unclassifiedView"
            class="kb-clean"
            type="button"
            :disabled="!pager.total"
            title="删除所有未归类文档的元数据、MinIO 原件与向量"
            @click="purgeUnclassified"
          >
            清理未归类
          </button>
          <button
            class="kb-add"
            type="button"
            :disabled="!curType"
            :title="
              unclassifiedView
                ? '未归类是历史数据视图，请先选择左侧文档类型'
                : curType
                  ? `上传到「${curTypeName}」`
                  : '请先选择文档类型'
            "
            @click="openUpload"
          >
            ＋ 上传
          </button>
        </div>

        <div class="kb-res">
          <div v-if="hasSelection" class="kbres-hd">
            共 <b>{{ pager.total }}</b> 份文档<template v-if="query">
              · 检索词「<b>{{ query }}</b
              >」</template
            >
            <span class="cur"
              >当前业务：<b>{{ curTypeName }}</b></span
            >
          </div>

          <!-- 文档列表：统一使用 ProTable，分页走服务端 -->
          <div class="kbres-wrap">
            <pro-table
              :columns="columns"
              :data="files"
              :loading="listLoading"
              :pager="pager"
              :is-pagination="true"
              :row-config="{ keyField: 'fileId', isHover: true }"
              height="100%"
              @page-change="handlePageChange"
            >
              <template #docName="{ row }">
                <span class="nm">{{ row.title || row.fileName || '—' }}</span>
              </template>
              <template #docInfo="{ row }">{{ infoText(row) }}</template>
              <template #docFmt="{ row }">
                <span class="fmt">{{ formatLabel(row) }}</span>
              </template>
              <template #docOps="{ row }">
                <div class="ops">
                  <button class="lact" type="button" @click="preview(row)">在线预览</button>
                  <button class="lact edt" type="button" @click="download(row)">下载</button>
                  <button class="lact" type="button" @click="openRename(row)">重命名</button>
                  <button class="lact del" type="button" @click="openDelete(row)">删除</button>
                </div>
              </template>
              <!-- 空态文案按视图区分（ProTable 的 #empty 会覆盖 emptyText） -->
              <template #empty>
                <div class="kbempty">{{ emptyText }}</div>
              </template>
            </pro-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传 / 重命名 / 删除 / 类型维护 -->
    <doc-upload-modal ref="uploadRef" @uploaded="handleUploaded" />
    <doc-rename-modal ref="renameRef" @submit="submitRename" />
    <doc-type-modal ref="typeModalRef" @submit="submitType" />
    <doc-delete-modal
      ref="deleteRef"
      :doc-name="deleteRow?.fileName || deleteRow?.title || ''"
      :biz-name="curTypeName"
      @confirm="confirmDelete"
    />

    <!-- 轻提示 -->
    <div v-if="toastMsg" class="kb-toast">{{ toastMsg }}</div>
  </div>
</template>

<style scoped lang="scss">
/* ===== 页面根容器 ===== */
.kb-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100%;
  padding: 5px;
  font-size: 13px;
  color: #1c3a63;
}

/* ===== 顶部统计条 ===== */
.kb-top {
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;
}
.kb-stat {
  padding: 6px 17px;
  font-size: 14px;
  color: #1f7ae0;
  white-space: nowrap;
  background: #e8f1fd;
  border: 1px solid #bcd7f7;
  border-radius: 14px;

  b {
    font-weight: 800;
  }

  .sub {
    margin-left: 6px;
    font-size: 12.5px;
    color: #7d95b5;
  }
}

/* ===== 主体：树 + 内容 ===== */
.kb-body {
  display: flex;
  flex: 1;
  gap: 14px;
  min-height: 0;
}

/* 左侧分类树 */
.kb-tree {
  flex: none;
  box-sizing: border-box;
  width: 268px;
  padding: 8px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d5e4f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(30, 90, 170, 0.06);
}
.kb-tree-top,
.kb-tree-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 10px;
  font-size: 13.5px;
  color: #2a3f5c;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
}
.kb-tree-top {
  font-weight: 600;
  color: #1a3f6b;
}
.kb-tree-top:hover,
.kb-tree-sub:hover {
  background: #f2f8ff;
}
.kb-tree .caret {
  display: inline-block;
  flex: none;
  width: 14px;
  font-size: 11px;
  color: #8aa3c4;
  text-align: center;
  transition: transform 0.15s;
}
.kb-tree .caret.dn {
  transform: rotate(90deg);
}
.kb-tree-top .n,
.kb-tree-sub .n {
  margin-left: auto;
  font-size: 12.5px;
  color: #a3b8d2;
  font-variant-numeric: tabular-nums;
}
.kb-tree-sub {
  padding-left: 30px;
  color: #4f6f96;
}
.kb-tree-sub.on,
.kb-tree-top.on {
  font-weight: 700;
  color: #1f7ae0;
  background: #e8f1fd;
}
.kb-tree-sub.on .n,
.kb-tree-top.on .n {
  color: #1f7ae0;
}

/* 未归类（历史数据）入口：与类型节点区分开，用虚线分隔 */
.kb-tree-unc {
  margin-top: 6px;
  color: #b3541e;
  border-top: 1px dashed #e6eef8;
  border-radius: 0 0 6px 6px;

  .n {
    color: #b3541e;
  }

  &:hover {
    background: #fff8f2;
  }

  &.on {
    color: #b3541e;
    background: #fff3e8;

    .n {
      color: #b3541e;
    }
  }
}

/* 树头部：标题 + 新增根类型 */
.kb-tree-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 6px 6px;
  margin-bottom: 4px;
  border-bottom: 1px solid #e6eef8;

  .ttl {
    font-size: 13px;
    font-weight: 700;
    color: #20517e;
  }

  .tadd {
    padding: 2px 9px;
    font-family: inherit;
    font-size: 12.5px;
    color: #1f7ae0;
    cursor: pointer;
    background: #f2f8ff;
    border: 1px solid #9cc3ef;
    border-radius: 11px;

    &:hover {
      color: #fff;
      background: #1f7ae0;
    }
  }
}

.kb-tree-empty {
  padding: 26px 8px;
  font-size: 12.5px;
  line-height: 1.7;
  color: #8aa3c4;
  text-align: center;
}

/* 树行：名称可截断，操作按钮悬停出现 */
.kb-tree-row {
  position: relative;

  .tnm {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .n {
    margin-left: 4px;
  }

  .acts {
    display: none;
    flex: none;
    gap: 2px;
    align-items: center;
    margin-left: 2px;
  }

  &:hover .acts {
    display: flex;
  }

  .act {
    width: 18px;
    height: 18px;
    padding: 0;
    font-family: inherit;
    font-size: 12px;
    line-height: 1;
    color: #1f7ae0;
    cursor: pointer;
    background: #fff;
    border: 1px solid #a9c9ea;
    border-radius: 3px;

    &:hover {
      color: #fff;
      background: #1f7ae0;
      border-color: #1f7ae0;
    }

    &.del {
      color: #e2564a;
      border-color: #f08a80;

      &:hover {
        color: #fff;
        background: #e2564a;
        border-color: #e2564a;
      }
    }
  }
}

/* 右侧内容 */
.kb-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

/* 检索行 */
.kb-search {
  display: flex;
  flex: none;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}
.kb-search input {
  flex: 1;
  height: 40px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 15px;
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
.lbtn {
  height: 40px;
  padding: 0 28px;
  font-family: inherit;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #4fa0f4, #1f6fd6);
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.06);
  }
}
.kb-refresh {
  height: 40px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 14px;
  color: #1f7ae0;
  white-space: nowrap;
  cursor: pointer;
  background: #f2f8ff;
  border: 1px solid #9cc3ef;
  border-radius: 3px;

  &:hover {
    background: #e3f0ff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
}
/* 未归类视图的批量清理按钮（危险操作，橙色） */
.kb-clean {
  height: 40px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 14px;
  color: #b3541e;
  white-space: nowrap;
  cursor: pointer;
  background: #fff5ee;
  border: 1px solid #f3b98d;
  border-radius: 3px;

  &:hover {
    color: #fff;
    background: #e2762b;
    border-color: #e2762b;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
}
.kb-add {
  height: 40px;
  padding: 0 28px;
  font-family: inherit;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(180deg, #1fbfa0, #0f9e86);
  border: none;
  border-radius: 3px;

  &:hover {
    filter: brightness(1.08);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    filter: none;
  }
}

/* 结果区 */
.kb-res {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  margin-top: 12px;
}
.kbres-hd {
  flex: none;
  padding: 0 2px 8px;
  font-size: 13.5px;
  color: #7d95b5;

  b {
    color: #1f7ae0;
  }
}
.kbres-hd .cur {
  margin-left: 12px;
  color: #a3b8d2;
}

/* 文档列表：容器只负责边框与高度，滚动 / 表头 / 分页器由 ProTable 内部处理 */
.kbres-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dbe7f6;
  border-radius: 8px;
}
/* 单元格插槽内容样式（插槽在父级编译，类名可直接生效） */
.nm {
  font-weight: 600;
  line-height: 1.6;
  color: #17456f;
  word-break: break-all;
}
.fmt {
  display: inline-block;
  padding: 1px 7px;
  font-size: 12.5px;
  font-weight: 700;
  color: #1f7ae0;
  background: #eef5fd;
  border: 1px solid #c9dcf2;
  border-radius: 4px;
}
.ops {
  display: flex;
  flex-flow: row nowrap;
  gap: 6px;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.lact {
  flex: none;
  padding: 2px 11px;
  font-family: inherit;
  font-size: 13.5px;
  color: #1f7ae0;
  cursor: pointer;
  background: #f4f9ff;
  border: 1px solid #9cc3ef;
  border-radius: 4px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
  }
  &.edt {
    color: #149a5b;
    background: #f1fcf7;
    border-color: #39b98a;

    &:hover {
      color: #fff;
      background: #1f9e6e;
    }
  }
  &.del {
    color: #e2564a;
    background: #fff6f5;
    border-color: #f08a80;

    &:hover {
      color: #fff;
      background: #e2564a;
    }
  }
}

/* 空态 */
.kbempty {
  flex: 1;
  padding: 60px 0;
  font-size: 14.5px;
  color: #8aa3c4;
  text-align: center;
}

/* 轻提示 */
.kb-toast {
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
