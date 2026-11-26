<script setup lang="ts">
// ============================================================
// 知识库 · 上传文档弹框（纯真实接口，无演示数据）
//   POST /knowledge/files/uploadBatch，必须携带左侧树所选 typeId
//   后端顺序：文件写 MinIO → 元数据立即落达梦 → 异步解析切片写 Qdrant
//   Qdrant / BGE-M3 未启动时只把解析状态标 FAILED，不影响上传与元数据入库
// 上传成功后 emit('uploaded')，由页面刷新真实列表与统计
// ============================================================
import { computed, onMounted, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import {
  getKnowledgeStorageConfig,
  uploadKnowledgeFiles,
  type KnowledgeStorageConfig,
  type KnowledgeUploadItem
} from '@/api/knowledge/knowledgeFile'

type QueueStatus = 'waiting' | 'uploading' | 'success' | 'failed'

interface QueueItem {
  uid: string
  file: File
  status: QueueStatus
  message: string
  result?: KnowledgeUploadItem
}

const emit = defineEmits<{ uploaded: [] }>()

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

/** 索引模式文案：Qdrant / BGE-M3 未启动时后端跳过向量化，只标失败 */
const INDEX_TEXT: Record<string, string> = {
  sync: '向量已同步写入 Qdrant',
  async: '向量后台异步写入',
  disabled: '向量入库已关闭，跳过 Qdrant',
  'skipped-duplicate': '同源重复文件，跳过切片',
  'meta-missing': '元数据未入库，跳过向量写入',
  'trigger-failed': '向量写入触发失败，待定时任务补偿'
}

const visible = ref(false)
const typeId = ref('')
const typeName = ref('')
const queue = ref<QueueItem[]>([])
const uploading = ref(false)
const percent = ref(0)
const dragging = ref(false)
const config = ref<KnowledgeStorageConfig | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

let seq = 0

const storageEnabled = computed(() => config.value?.enabled !== false)
const maxBatchSize = computed(() => Math.max(1, config.value?.maxBatchSize ?? DEFAULT_MAX_BATCH))
const canPick = computed(() => storageEnabled.value && !uploading.value)
const waitingItems = computed(() => queue.value.filter((i) => i.status === 'waiting'))
const waitingSize = computed(() => waitingItems.value.reduce((sum, i) => sum + i.file.size, 0))
const successCount = computed(() => queue.value.filter((i) => i.status === 'success').length)
const failedCount = computed(() => queue.value.filter((i) => i.status === 'failed').length)

function formatSize(bytes: number): string {
  if (!bytes) {
    return '0 B'
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.ceil(bytes / 1024))} KB`
}

function extOf(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase()
}

function errText(e: unknown): string {
  const err = e as { message?: string; response?: { data?: { message?: string } } }
  return err?.message || err?.response?.data?.message || '上传失败，请检查服务是否可用'
}

/** 入库信息：解析状态 + 索引模式 + 切片数 */
function detailText(item: QueueItem): string {
  const row = item.result
  if (!row) {
    return '—'
  }
  const parts = [
    row.parseStatus ?? '',
    row.indexMode ? (INDEX_TEXT[row.indexMode] ?? row.indexMode) : ''
  ].filter(Boolean)
  if (row.isDuplicate === 1) {
    parts.push('同源重复')
  }
  return parts.length ? parts.join(' · ') : '—'
}

/**
 * 打开弹框：typeId 必填（文档挂在所选类型节点上），typeName 仅用于展示。
 */
function show(options: { typeId?: string; typeName?: string }) {
  typeId.value = options?.typeId ?? ''
  typeName.value = options?.typeName ?? ''
  queue.value = []
  percent.value = 0
  uploading.value = false
  visible.value = true
}
defineExpose({ show })

function toast(msg: string) {
  window.$message?.warning(msg)
}

/** 校验并加入待上传队列（默认上限 50 个、单文件 100MB、单次总大小 200MB） */
function addFiles(list: FileList | File[] | null | undefined) {
  if (!list || uploading.value) {
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
  if (!canPick.value) {
    return
  }
  if (!typeId.value) {
    toast('请先在左侧选择一个文档类型')
    return
  }
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  addFiles(input.files)
  input.value = ''
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (canPick.value) {
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

/** 打开 MinIO 原文 */
function openOriginal(item: QueueItem) {
  const url = item.result?.resourceUrl
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
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
  if (!uploading.value) {
    queue.value = queue.value.filter((i) => i.status === 'waiting')
  }
}

/** 开始上传：一次请求携带全部待上传文件与 typeId，后端逐文件返回结果 */
async function submit() {
  if (!typeId.value) {
    toast('请先在左侧选择一个文档类型')
    return
  }
  const batch = [...waitingItems.value]
  if (!batch.length) {
    toast('请先选择需要上传的文件')
    return
  }

  uploading.value = true
  percent.value = 0
  batch.forEach((item) => (item.status = 'uploading'))

  const formData = new FormData()
  batch.forEach((item) => formData.append('files', item.file))
  formData.append('typeId', typeId.value)

  let ok = 0
  try {
    const res = await uploadKnowledgeFiles(formData, (p) => (percent.value = p))
    const rows = Array.isArray(res.data) ? res.data : []
    batch.forEach((item, index) => {
      const row = rows[index]
      if (!row || row.error || !row.objectKey) {
        item.status = 'failed'
        item.message = row?.error || '后端未返回该文件的入库结果'
        return
      }
      item.status = 'success'
      item.result = row
      item.message = row.warning || ''
      ok++
    })
    percent.value = 100
    window.$message?.success(`本次上传完成：成功 ${ok} 个，失败 ${batch.length - ok} 个`)
  } catch (e) {
    const message = errText(e)
    batch.forEach((item) => {
      item.status = 'failed'
      item.message = message
    })
    window.$message?.error(`上传失败：${message}`)
  } finally {
    uploading.value = false
  }

  // 只要有文件入库就让页面刷新真实列表
  if (ok > 0) {
    emit('uploaded')
  }
}

onMounted(async () => {
  try {
    const res = await getKnowledgeStorageConfig()
    config.value = res.data
  } catch {
    // 配置端点不可用时不阻塞上传，按默认放行
    config.value = null
  }
})
</script>

<template>
  <pro-modal
    v-model:show="visible"
    :title="`上传文档${typeName ? ` · ${typeName}` : ''}`"
    table-theme="light"
    content-mode="scroll"
    default-padding="4px 24px 6px"
    :style-params="{ width: '880px', height: '70vh' }"
  >
    <div class="up-page">
      <!-- 目标类型 -->
      <div class="up-target">
        <span class="lb">目标文档类型</span>
        <b>{{ typeName || '未选择' }}</b>
        <span class="tip">
          文件写入 MinIO 后元数据立即登记到达梦；Qdrant / BGE-M3 未启动时跳过向量化，不影响上传。
        </span>
      </div>

      <div v-if="!storageEnabled" class="up-warn">
        知识库上传入口已关闭（storage.enabled=false），请联系运维开启后再上传。
      </div>

      <!-- 选择文件 -->
      <div
        class="dropzone"
        :class="{ dragging, disabled: !canPick }"
        @click="pick"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <div class="drop-icon">↑</div>
        <div class="drop-title">拖拽文件到此处，或点击选择</div>
        <div class="drop-sub">
          支持 Word / PDF / Excel / 图片，单文件 ≤ 100MB、单次 ≤ 200MB、最多
          {{ maxBatchSize }} 个
        </div>
      </div>
      <input
        ref="fileInput"
        class="file-input"
        type="file"
        multiple
        :accept="ACCEPT_ATTR"
        @change="onFileChange"
      />

      <!-- 上传进度 -->
      <div v-if="uploading || percent > 0" class="progress-wrap">
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: `${percent}%` }"></div>
        </div>
        <span class="progress-text">{{ uploading ? `上传中 ${percent}%` : '上传完成' }}</span>
      </div>

      <!-- 队列 -->
      <div v-if="!queue.length" class="up-empty">暂无文件，先拖拽或选择需要上传的文档</div>
      <div v-else class="table-wrap">
        <table class="up-table">
          <thead>
            <tr>
              <th>文件名</th>
              <th style="width: 92px">大小</th>
              <th style="width: 86px">状态</th>
              <th>入库信息</th>
              <th style="width: 96px">原文</th>
              <th style="width: 64px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in queue" :key="item.uid">
              <td class="name-cell" :title="item.file.name">{{ item.file.name }}</td>
              <td>{{ formatSize(item.file.size) }}</td>
              <td>
                <span class="state" :class="item.status">{{ STATUS_TEXT[item.status] }}</span>
              </td>
              <td class="info-cell">
                <span v-if="item.message" :class="{ 'text-bad': item.status === 'failed' }">
                  {{ item.message }}
                </span>
                <span v-else>{{ detailText(item) }}</span>
              </td>
              <td>
                <a
                  v-if="item.result?.resourceUrl"
                  href="javascript:void(0)"
                  @click="openOriginal(item)"
                >
                  查看原文
                </a>
                <span v-else>—</span>
              </td>
              <td>
                <button
                  v-if="item.status === 'waiting'"
                  class="link-btn"
                  type="button"
                  @click="removeItem(item)"
                >
                  移除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #action>
      <div class="up-foot">
        <button class="up-btn" type="button" :disabled="uploading" @click="clearDone">
          清除已完成
        </button>
        <button class="up-btn" type="button" :disabled="uploading" @click="visible = false">
          关 闭
        </button>
        <button
          class="up-btn primary"
          type="button"
          :disabled="uploading || !waitingItems.length || !typeId"
          :title="typeId ? '' : '请先在左侧选择文档类型'"
          @click="submit"
        >
          {{
            uploading
              ? '上传中…'
              : `开始上传${waitingItems.length ? `（${waitingItems.length}）` : ''}`
          }}
        </button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
$primary: #2f80ed;
$text: #1c3a63;
$muted: #7a8ba5;
$border: #dce7f5;

.up-page {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0 8px;
  font-size: 13px;
  color: $text;
}

.up-target {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
  padding: 8px 12px;
  background: #f6faff;
  border: 1px solid $border;
  border-radius: 6px;

  .lb {
    font-size: 12px;
    color: $muted;
  }

  b {
    color: $primary;
  }

  .tip {
    font-size: 12px;
    line-height: 1.6;
    color: $muted;
  }
}

.up-warn {
  padding: 8px 12px;
  font-size: 12px;
  color: #a1400c;
  background: #fff3e8;
  border: 1px solid #f7c9a3;
  border-radius: 6px;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 132px;
  cursor: pointer;
  background: #f8fbff;
  border: 1.5px dashed #a8c8f0;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover,
  &.dragging {
    background: #eef6ff;
    border-color: $primary;
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
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
  font-size: 20px;
  color: $primary;
  background: #e4f0ff;
  border-radius: 50%;
}

.drop-title {
  font-size: 13.5px;
  font-weight: 600;
}

.drop-sub {
  margin-top: 5px;
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

.up-empty {
  padding: 26px 0;
  font-size: 12.5px;
  color: $muted;
  text-align: center;
  background: #fafcff;
  border: 1px dashed $border;
  border-radius: 8px;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid $border;
  border-radius: 8px;
}

.up-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px 10px;
    font-size: 12.5px;
    text-align: left;
    border-bottom: 1px solid #edf2f9;
  }

  th {
    font-weight: 600;
    color: #5a7191;
    white-space: nowrap;
    background: #f7faff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  a {
    color: $primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.name-cell {
  max-width: 240px;
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

.link-btn {
  padding: 0;
  font-family: inherit;
  font-size: 12.5px;
  color: #d94a4a;
  cursor: pointer;
  background: none;
  border: 0;
}

.up-foot {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 8px 0 10px;
}

.up-btn {
  min-width: 96px;
  height: 30px;
  padding: 0 16px;
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

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
