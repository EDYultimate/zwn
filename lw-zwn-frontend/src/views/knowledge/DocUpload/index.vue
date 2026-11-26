<script setup lang="ts">
// ============================================================
// 知识管理 · 文档上传
// 批量选择 Word / PDF / Excel / 图片 → POST /knowledge/files/uploadBatch
// 后端：写 MinIO → 落达梦元数据 → 异步解析切片 → 写 Qdrant
// 本页负责校验、进度、逐文件结果与解析状态刷新，不重复实现任何解析逻辑。
// ============================================================
import { computed, onMounted, ref } from 'vue'

import {
  getKnowledgeFileDetail,
  getKnowledgeStorageConfig,
  uploadKnowledgeFiles,
  type KnowledgeStorageConfig,
  type KnowledgeUploadItem
} from '@/api/knowledge/knowledgeFile'
import { getDocTypeTree, type KnowledgeDocTypeNode } from '@/api/knowledge/docType'

type QueueStatus = 'waiting' | 'uploading' | 'success' | 'failed'

interface QueueItem {
  uid: string
  file: File
  status: QueueStatus
  message: string
  result?: KnowledgeUploadItem
}

const ACCEPT_EXTS = [
  'doc',
  'docx',
  'pdf',
  'xls',
  'xlsx',
  'csv',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'bmp',
  'webp',
  'tif',
  'tiff'
]
const ACCEPT_ATTR = ACCEPT_EXTS.map((e) => `.${e}`).join(',')
const WORD_EXTS = ['doc', 'docx']
const EXCEL_EXTS = ['xls', 'xlsx', 'csv']
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tif', 'tiff']

// 与后端 spring.servlet.multipart 保持一致：单文件 100MB、单次请求 200MB
const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_TOTAL_SIZE = 200 * 1024 * 1024
const DEFAULT_MAX_BATCH = 50

const STATUS_TEXT: Record<QueueStatus, string> = {
  waiting: '待上传',
  uploading: '上传中',
  success: '已入库',
  failed: '失败'
}

// 文档类型（树节点）：必选，文档挂在所选类型上
const docTypeId = ref('')
const typeTree = ref<KnowledgeDocTypeNode[]>([])
const bizDir = ref('')
const queue = ref<QueueItem[]>([])
const config = ref<KnowledgeStorageConfig | null>(null)
const uploading = ref(false)
const refreshing = ref(false)
const dragging = ref(false)
const percent = ref(0)
const toastMsg = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

let seq = 0
let toastTimer: number | undefined

const maxBatchSize = computed(() => Math.max(1, config.value?.maxBatchSize ?? DEFAULT_MAX_BATCH))
/** 类型树拍平为下拉选项，用全角空格体现层级 */
const typeOptions = computed(() => {
  const rows: Array<{ typeId: string; text: string }> = []
  const walk = (list: KnowledgeDocTypeNode[], depth: number) => {
    list.forEach((node) => {
      rows.push({ typeId: node.typeId, text: `${'　'.repeat(depth)}${node.typeName}` })
      walk(node.children ?? [], depth + 1)
    })
  }
  walk(typeTree.value, 0)
  return rows
})
const curTypeName = computed(
  () => typeOptions.value.find((o) => o.typeId === docTypeId.value)?.text.trim() ?? ''
)
const enabled = computed(() => config.value?.enabled !== false)
const canUpload = computed(() => enabled.value && !uploading.value)
const waitingItems = computed(() => queue.value.filter((i) => i.status === 'waiting'))
const waitingSize = computed(() => waitingItems.value.reduce((sum, i) => sum + i.file.size, 0))
const totalSize = computed(() => queue.value.reduce((sum, i) => sum + i.file.size, 0))
const successCount = computed(() => queue.value.filter((i) => i.status === 'success').length)
const failedCount = computed(() => queue.value.filter((i) => i.status === 'failed').length)
const warningCount = computed(() => queue.value.filter((i) => i.result?.warning).length)

function toast(msg: string) {
  toastMsg.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toastMsg.value = ''), 3500)
}

function extOf(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase()
}

function formatSize(bytes: number): string {
  if (!bytes) {
    return '0 B'
  }
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index++
  }
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`
}

function errText(e: unknown): string {
  const err = e as { message?: string; response?: { data?: { message?: string } } }
  return err?.message || err?.response?.data?.message || '网络异常，请检查服务是否可用'
}

function typeInfo(item: QueueItem): { text: string; cls: string } {
  const ext = extOf(item.file.name)
  if (WORD_EXTS.includes(ext)) {
    return { text: 'Word', cls: 'word' }
  }
  if (ext === 'pdf') {
    return { text: 'PDF', cls: 'pdf' }
  }
  if (EXCEL_EXTS.includes(ext)) {
    return { text: 'Excel', cls: 'excel' }
  }
  if (IMAGE_EXTS.includes(ext)) {
    return { text: '图片', cls: 'image' }
  }
  return { text: ext.toUpperCase() || '文件', cls: 'other' }
}

function detailText(item: QueueItem): string {
  const row = item.result
  if (!row) {
    return '—'
  }
  const parts = [row.parseStatus, row.indexMode, row.dedupDecision].filter(Boolean) as string[]
  if (row.isDuplicate === 1) {
    parts.push('重复附件')
  }
  return parts.length ? parts.join(' · ') : '—'
}

function addFiles(list: FileList | File[] | null | undefined) {
  if (!canUpload.value || !list) {
    return
  }
  const incoming = Array.from(list)
  if (!incoming.length) {
    return
  }

  let rejected = 0
  let addedSize = 0
  let slots = maxBatchSize.value - waitingItems.value.length

  for (const file of incoming) {
    const ext = extOf(file.name)
    const tooLarge = file.size === 0 || file.size > MAX_FILE_SIZE
    const overTotal = waitingSize.value + addedSize + file.size > MAX_TOTAL_SIZE
    if (!ACCEPT_EXTS.includes(ext) || tooLarge || overTotal || slots <= 0) {
      rejected++
      continue
    }
    queue.value.push({ uid: `kb-${++seq}`, file, status: 'waiting', message: '' })
    addedSize += file.size
    slots--
  }

  if (rejected) {
    toast(
      `已忽略 ${rejected} 个文件：仅支持 Word / PDF / Excel / 图片，单文件 ≤100MB、单次总大小 ≤200MB、最多 ${maxBatchSize.value} 个`
    )
  }
}

function pick() {
  if (canUpload.value) {
    fileInput.value?.click()
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  addFiles(input.files)
  // 允许再次选择同一个文件
  input.value = ''
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (canUpload.value) {
    dragging.value = true
  }
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  addFiles(e.dataTransfer?.files)
}

function removeItem(item: QueueItem) {
  if (item.status !== 'waiting') {
    return
  }
  const index = queue.value.indexOf(item)
  if (index >= 0) {
    queue.value.splice(index, 1)
  }
}

function clearDone() {
  queue.value = queue.value.filter((i) => i.status === 'waiting')
}

function clearAll() {
  if (!uploading.value) {
    queue.value = []
  }
}

async function submit() {
  if (!docTypeId.value) {
    toast('请先选择文档类型（文档必须挂在类型节点上）')
    return
  }
  const batch = [...waitingItems.value]
  if (!batch.length) {
    toast('请先添加待上传文件')
    return
  }

  uploading.value = true
  percent.value = 0
  batch.forEach((item) => (item.status = 'uploading'))

  const formData = new FormData()
  batch.forEach((item) => formData.append('files', item.file))
  formData.append('typeId', docTypeId.value)
  const dir = bizDir.value.trim()
  if (dir) {
    formData.append('bizDir', dir)
  }

  let ok = 0
  let bad = 0
  try {
    const res = await uploadKnowledgeFiles(formData, (p) => (percent.value = p))
    const rows = Array.isArray(res.data) ? res.data : []
    // 后端按请求顺序逐文件返回一条结果，可按索引对应
    batch.forEach((item, index) => {
      const row = rows[index]
      if (!row || row.error || !row.objectKey) {
        item.status = 'failed'
        item.message = row?.error || '后端未返回该文件的入库结果'
        bad++
      } else {
        item.status = 'success'
        item.result = row
        item.message = row.warning || ''
        ok++
      }
    })
    percent.value = 100
    toast(`本次上传完成：成功 ${ok} 个，失败 ${bad} 个`)
  } catch (e) {
    const message = errText(e)
    batch.forEach((item) => {
      item.status = 'failed'
      item.message = message
    })
    toast(`上传失败：${message}`)
  } finally {
    uploading.value = false
  }
}

/** 异步索引不会随上传响应一起完成，用 /knowledge/files/{fileId} 手动刷新状态 */
async function refreshStatus() {
  const targets = queue.value.filter(
    (item) => item.status === 'success' && item.result?.fileId
  ) as Array<QueueItem & { result: KnowledgeUploadItem & { fileId: string } }>
  if (!targets.length) {
    toast('暂无已入库文件可刷新')
    return
  }

  refreshing.value = true
  try {
    const settled = await Promise.allSettled(
      targets.map((item) => getKnowledgeFileDetail(item.result.fileId))
    )
    let updated = 0
    settled.forEach((one, index) => {
      if (one.status === 'fulfilled' && one.value.data) {
        targets[index].result = { ...targets[index].result, ...one.value.data }
        updated++
      }
    })
    toast(updated ? `已刷新 ${updated} 个文件的解析状态` : '解析状态刷新失败')
  } finally {
    refreshing.value = false
  }
}

function openOriginal(item: QueueItem) {
  const url = item.result?.resourceUrl
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/** 拉取文档类型树（上传必须先选类型） */
async function loadDocTypes() {
  try {
    const res = await getDocTypeTree()
    typeTree.value = res.data ?? []
  } catch {
    // 类型树拉取失败时置空，上传按钮会因未选类型而禁用
    typeTree.value = []
  }
}

onMounted(async () => {
  loadDocTypes()
  try {
    const res = await getKnowledgeStorageConfig()
    config.value = res.data
  } catch {
    // 配置端点不可用时按默认值放行，不阻塞上传；config 保持 null
    config.value = null
  }
})
</script>

<template>
  <div class="upload-page">
    <header class="page-head">
      <div class="head-text">
        <h2>文档上传</h2>
        <p>批量上传 Word / PDF / Excel / 图片，写入对象存储后自动解析、切片并入库到知识向量库。</p>
      </div>
      <div class="head-stat">
        <span>待上传</span>
        <b>{{ waitingItems.length }}</b>
        <span>个 · {{ formatSize(totalSize) }}</span>
      </div>
    </header>

    <section v-if="!enabled" class="alert">
      知识库上传入口已关闭（storage.enabled=false），请联系运维开启后再上传。
    </section>

    <section class="panel config-panel">
      <div class="panel-title">上传设置</div>
      <div class="config-row">
        <label class="field">
          <span class="field-label">文档类型（必选）</span>
          <select v-model="docTypeId">
            <option value="">请选择文档类型</option>
            <option v-for="o in typeOptions" :key="o.typeId" :value="o.typeId">
              {{ o.text }}
            </option>
          </select>
        </label>
        <label class="field">
          <span class="field-label">业务目录（可选）</span>
          <input
            v-model="bizDir"
            type="text"
            maxlength="64"
            placeholder="例如 dam-safety，仅用于同名文件分组去重"
          />
        </label>
        <div class="config-tags">
          <span class="cfg">存储桶：{{ config?.bucket || '默认桶' }}</span>
          <span class="cfg">路径前缀：{{ config?.sourcePrefix || 'docFiles/knowledge' }}</span>
          <span class="cfg">单次上限：{{ maxBatchSize }} 个</span>
        </div>
      </div>
      <p class="hint">
        文档必须挂在文档类型上：未选择类型时无法上传（类型树在「知识库」页面维护）。当前类型：{{
          curTypeName || '未选择'
        }}。
      </p>
      <p class="hint">
        支持 .doc / .docx / .pdf / .xls / .xlsx / .csv / .png / .jpg / .jpeg / .gif / .bmp / .webp /
        .tif / .tiff；单文件 ≤ 100MB，单次请求总大小 ≤ 200MB。
      </p>
    </section>

    <div class="upload-grid">
      <section class="panel">
        <div class="panel-title">选择文件</div>
        <div
          class="dropzone"
          :class="{ dragging, disabled: !canUpload }"
          @click="pick"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <div class="drop-icon">↑</div>
          <div class="drop-title">拖拽文件到此处，或点击选择</div>
          <div class="drop-sub">支持一次选择多个文件，同名文件也会各自独立保存</div>
        </div>
        <input
          ref="fileInput"
          class="file-input"
          type="file"
          multiple
          :accept="ACCEPT_ATTR"
          @change="onFileChange"
        />

        <div v-if="uploading || percent > 0" class="progress-wrap">
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: `${percent}%` }"></div>
          </div>
          <span class="progress-text">{{ uploading ? `上传中 ${percent}%` : '上传完成' }}</span>
        </div>

        <div class="toolbar">
          <button
            class="btn primary"
            type="button"
            :disabled="!canUpload || !waitingItems.length || !docTypeId"
            :title="docTypeId ? '' : '请先选择文档类型'"
            @click="submit"
          >
            {{
              uploading
                ? '上传中…'
                : `开始上传${waitingItems.length ? `（${waitingItems.length}）` : ''}`
            }}
          </button>
          <button
            class="btn"
            type="button"
            :disabled="uploading || !queue.length"
            @click="clearDone"
          >
            清除已完成
          </button>
          <button
            class="btn"
            type="button"
            :disabled="uploading || !queue.length"
            @click="clearAll"
          >
            清空列表
          </button>
          <button
            class="btn ghost"
            type="button"
            :disabled="refreshing || !successCount"
            @click="refreshStatus"
          >
            {{ refreshing ? '刷新中…' : '刷新解析状态' }}
          </button>
        </div>
      </section>

      <section class="panel flow-panel">
        <div class="panel-title">入库流程</div>
        <ol class="flow">
          <li><b>01</b><span>文件写入 MinIO，同名 / 同内容也各自独立保存</span></li>
          <li><b>02</b><span>元数据落达梦，生成 fileId / docId / 去重组</span></li>
          <li><b>03</b><span>按 Word / PDF / Excel 结构化解析，回写 parsed.json</span></li>
          <li><b>04</b><span>切片后经 BGE-M3 编码，写入 Qdrant 向量库</span></li>
          <li><b>05</b><span>回填解析状态，失败仅标记 FAILED 不删原文件</span></li>
        </ol>
        <p class="flow-note">
          默认异步入库：上传响应返回后解析仍在后台进行，点击「刷新解析状态」查看最新进度。
          图片与扫描件当前仅原样存档并登记元数据，文本抽取需后续接入 OCR。
        </p>
      </section>
    </div>

    <section class="panel">
      <div class="panel-title">
        文件列表 <span class="count">共 {{ queue.length }} 个</span>
      </div>
      <div class="stat-row">
        <div class="stat">
          <span>已入库</span><b class="ok">{{ successCount }}</b>
        </div>
        <div class="stat">
          <span>失败</span><b class="bad">{{ failedCount }}</b>
        </div>
        <div class="stat">
          <span>告警</span><b class="warn">{{ warningCount }}</b>
        </div>
      </div>

      <div v-if="!queue.length" class="empty">暂无文件，先拖拽或选择需要上传的文档</div>
      <div v-else class="table-wrap">
        <table class="file-table">
          <thead>
            <tr>
              <th>文件名</th>
              <th>大小</th>
              <th>类型</th>
              <th>状态</th>
              <th>入库信息</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in queue" :key="item.uid">
              <td class="name-cell" :title="item.file.name">{{ item.file.name }}</td>
              <td>{{ formatSize(item.file.size) }}</td>
              <td>
                <span class="tag" :class="typeInfo(item).cls">{{ typeInfo(item).text }}</span>
              </td>
              <td>
                <span class="state" :class="item.status">{{ STATUS_TEXT[item.status] }}</span>
              </td>
              <td class="info-cell">
                <span v-if="item.message" :class="{ 'text-bad': item.status === 'failed' }">
                  {{ item.message }}
                </span>
                <span v-else>{{ detailText(item) }}</span>
              </td>
              <td class="op-cell">
                <a
                  v-if="item.result?.resourceUrl"
                  href="javascript:void(0)"
                  @click="openOriginal(item)"
                >
                  查看原文
                </a>
                <button
                  v-if="item.status === 'waiting'"
                  type="button"
                  class="link-btn"
                  @click="removeItem(item)"
                >
                  移除
                </button>
                <span v-if="item.status !== 'waiting' && !item.result?.resourceUrl">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
  </div>
</template>

<style scoped lang="scss">
$primary: #2f80ed;
$text: #1c3a63;
$muted: #7a8ba5;
$border: #dce7f5;

.upload-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
  padding: 6px;
  font-size: 13px;
  color: $text;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 22px;
  color: #fff;
  background: linear-gradient(120deg, #1e5fc0 0%, #2f80ed 58%, #49a6f7 100%);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(31, 96, 190, 0.18);

  h2 {
    margin: 0 0 6px;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.86);
  }
}

.head-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 16px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 20px;

  b {
    font-size: 22px;
    font-weight: 800;
  }
}

.alert {
  padding: 10px 14px;
  color: #a1400c;
  background: #fff3e8;
  border: 1px solid #f7c9a3;
  border-radius: 8px;
}

.panel {
  padding: 14px 18px 16px;
  background: #fff;
  border: 1px solid $border;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(31, 76, 140, 0.05);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;

  &::before {
    width: 3px;
    height: 14px;
    content: '';
    background: $primary;
    border-radius: 2px;
  }

  .count {
    font-size: 12px;
    font-weight: 400;
    color: $muted;
  }
}

.config-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 300px;

  .field-label {
    font-size: 12px;
    color: $muted;
  }

  input,
  select {
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    padding: 0 12px;
    font-family: inherit;
    font-size: 13px;
    color: $text;
    background: #fbfdff;
    border: 1px solid $border;
    border-radius: 6px;
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.12);
    }
  }
}

.config-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 3px;
}

.cfg {
  padding: 5px 10px;
  font-size: 12px;
  color: #2e629e;
  background: #edf5ff;
  border: 1px solid #cfdef4;
  border-radius: 14px;
}

.hint {
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: $muted;
}

.upload-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 12px;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 168px;
  cursor: pointer;
  background: #f8fbff;
  border: 1.5px dashed #a8c8f0;
  border-radius: 10px;
  transition: all 0.2s;

  &:hover,
  &.dragging {
    background: #eef6ff;
    border-color: $primary;
    box-shadow: inset 0 0 0 3px rgba(47, 128, 237, 0.08);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
}

.drop-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: 10px;
  font-size: 24px;
  color: $primary;
  background: #e4f0ff;
  border-radius: 50%;
}

.drop-title {
  font-size: 14px;
  font-weight: 600;
}

.drop-sub {
  margin-top: 6px;
  font-size: 12px;
  color: $muted;
}

.file-input {
  display: none;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.progress-track {
  flex: 1;
  height: 8px;
  overflow: hidden;
  background: #e9f0fa;
  border-radius: 6px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f80ed, #57b6f8);
  border-radius: 6px;
  transition: width 0.2s;
}

.progress-text {
  min-width: 84px;
  font-size: 12px;
  color: $muted;
  text-align: right;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.btn {
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  color: $text;
  cursor: pointer;
  background: #fff;
  border: 1px solid $border;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: $primary;
    border-color: $primary;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.primary {
    color: #fff;
    background: $primary;
    border-color: $primary;

    &:hover:not(:disabled) {
      color: #fff;
      background: #1f6fd8;
    }
  }

  &.ghost {
    margin-left: auto;
    color: $primary;
    background: #f2f8ff;
    border-color: #c8dffa;
  }
}

.flow {
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 7px 0;
    font-size: 12px;
    line-height: 1.6;
    border-bottom: 1px dashed #e8eef7;

    &:last-child {
      border-bottom: 0;
    }

    b {
      flex: none;
      width: 24px;
      height: 20px;
      font-size: 11px;
      line-height: 20px;
      color: $primary;
      text-align: center;
      background: #eaf3ff;
      border-radius: 4px;
    }
  }
}

.flow-note {
  margin: 10px 0 0;
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.7;
  color: #6b5a2a;
  background: #fffaf0;
  border: 1px solid #f3e2bd;
  border-radius: 6px;
}

.stat-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 7px 14px;
  font-size: 12px;
  color: $muted;
  background: #f6f9fe;
  border: 1px solid $border;
  border-radius: 16px;

  b {
    font-size: 16px;

    &.ok {
      color: #1a9a63;
    }

    &.bad {
      color: #d94a4a;
    }

    &.warn {
      color: #d98b16;
    }
  }
}

.empty {
  padding: 34px 0;
  font-size: 13px;
  color: $muted;
  text-align: center;
  background: #fafcff;
  border: 1px dashed $border;
  border-radius: 8px;
}

.table-wrap {
  overflow-x: auto;
}

.file-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 9px 10px;
    font-size: 12px;
    text-align: left;
    border-bottom: 1px solid #edf2f9;
  }

  th {
    font-weight: 600;
    color: #5a7191;
    white-space: nowrap;
    background: #f7faff;
  }

  tbody tr:hover {
    background: #fafcff;
  }
}

.name-cell {
  max-width: 260px;
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-cell {
  max-width: 320px;
  color: #5a7191;
  word-break: break-all;
}

.text-bad {
  color: #d94a4a;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 4px;

  &.word {
    color: #2255a8;
    background: #e8f0ff;
  }

  &.pdf {
    color: #b23b3b;
    background: #ffecec;
  }

  &.excel {
    color: #167a53;
    background: #e4f7ee;
  }

  &.image {
    color: #8a5a13;
    background: #fff2dc;
  }

  &.other {
    color: #5a7191;
    background: #eef2f8;
  }
}

.state {
  font-weight: 600;

  &.waiting {
    color: #5a7191;
  }

  &.uploading {
    color: $primary;
  }

  &.success {
    color: #1a9a63;
  }

  &.failed {
    color: #d94a4a;
  }
}

.op-cell {
  white-space: nowrap;

  a {
    margin-right: 10px;
    color: $primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.link-btn {
  padding: 0;
  font-size: 12px;
  color: #d94a4a;
  cursor: pointer;
  background: none;
  border: 0;
}

.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  z-index: 3000;
  padding: 10px 20px;
  font-size: 13px;
  color: #fff;
  background: rgba(28, 58, 99, 0.92);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  transform: translateX(-50%);
}

@media (max-width: 1100px) {
  .upload-grid {
    grid-template-columns: 1fr;
  }

  .head-stat {
    display: none;
  }
}
</style>
