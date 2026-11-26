<script setup lang="ts">
/**
 * 日期选择器（基于 naive-ui NDatePicker 二次封装，API 对齐 element-plus DatePicker）
 *
 * - 默认中文环境、周一为一周第一天、选中即生效（datetime 隐藏确认按钮）
 * - v-model 按 type 自动返回格式化字符串：
 *     year→'yyyy'、month→'yyyy-MM'、date→'yyyy-MM-dd'、datetime→'yyyy-MM-dd HH:mm'
 * - 未声明的 naive-ui 原生属性（如 default-value）可通过 attrs 透传覆盖默认行为
 */
import { computed, useAttrs } from 'vue'
import type { GlobalThemeOverrides } from 'naive-ui'

defineOptions({ name: 'DatePicker', inheritAttrs: false })

/** 日期选择器主题类型：blue 深色大屏 / light 浅色白底 */
export type DatePickerTheme = 'light' | 'blue'

// ── 深色主题（tableTheme='blue' 默认）：深蓝底 + 浅蓝边框 + 白字 + 胶囊圆角 ──
const DEFAULT_THEME: GlobalThemeOverrides = {
  common: {
    primaryColor: '#4d84c4',
    primaryColorHover: '#6f9fd4',
    primaryColorPressed: '#3d6fa8'
  },
  Input: {
    color: 'rgba(38, 64, 123, 0.85)',
    colorFocus: 'rgba(13, 56, 118, 0.95)',
    border: '1px solid #4d84c4',
    borderHover: '1px solid #6f9fd4',
    borderFocus: '1px solid #6f9fd4',
    boxShadowFocus: 'none',
    boxShadowHover: 'none',
    textColor: '#ffffff',
    placeholderColor: 'rgba(255, 255, 255, 0.45)',
    iconColor: '#cfe3ff',
    iconColorDisabled: 'rgba(207, 227, 255, 0.4)',
    caretColor: '#ffffff',
    borderRadius: '16px',
    // small 尺寸高度收窄为 26px（naive 默认 28px）
    heightSmall: '26px'
  }
}

type DatePickerType = 'date' | 'datetime' | 'month' | 'year' | 'yearrange' | 'week'
type NaiveDateType = 'date' | 'datetime' | 'month' | 'year' | 'yearrange'

const props = withDefaults(
  defineProps<{
    /** 选择器类型，对齐 el-date-picker 的 type；week 降级为 date（naive-ui 不支持） */
    type?: DatePickerType
    /** 输入框尺寸，默认 default（映射到 naive-ui medium） */
    size?: 'small' | 'medium' | 'default' | 'large'
    /** 是否禁用 */
    disabled?: boolean
    /** 是否只读 */
    readonly?: boolean
    /** 是否显示清空按钮，默认 true */
    clearable?: boolean
    /** 占位文案 */
    placeholder?: string
    /** 输入框显示格式，不指定则按 type 默认 */
    format?: string
    /** 绑定值格式，不指定则按 type 默认返回字符串 */
    valueFormat?: string
    /** 返回 true 的日期不可选 */
    disabledDate?: (date: Date) => boolean
    /** 快捷选项，对齐 el-date-picker shortcuts（value 为 Date 或 () => Date） */
    shortcuts?: { text: string; value: Date | (() => Date) }[]
    /** 可选最小日期 */
    minDate?: Date | string | number
    /** 可选最大日期 */
    maxDate?: Date | string | number
    /** naive-ui 面板底部按钮（clear/now/confirm），传 null 隐藏全部（含"此刻"） */
    actions?: Array<'clear' | 'now' | 'confirm'> | null
    /** 输入框宽度（px），默认 130 */
    width?: number | string
    /** 主题：blue 深色大屏（默认）/ light 浅色白底（日历面板同步为浅色） */
    tableTheme?: DatePickerTheme
    /** naive-ui 主题定制，与默认深蓝主题浅合并（同名项覆盖），不传则用默认主题 */
    themeOverrides?: GlobalThemeOverrides
  }>(),
  {
    type: 'date',
    size: 'default',
    disabled: false,
    readonly: false,
    clearable: true,
    placeholder: '请选择日期',
    format: undefined,
    valueFormat: undefined,
    disabledDate: undefined,
    shortcuts: undefined,
    minDate: undefined,
    maxDate: undefined,
    width: 130,
    tableTheme: 'light',
    themeOverrides: undefined
  }
)

const modelValue = defineModel<any>({ default: null })
const attrs = useAttrs()

// ── 主题合并：浅色主题直接用 naive-ui 默认样式；深色主题与调用方 themeOverrides 按两级浅合并，同名项以调用方为准 ──
const mergedTheme = computed<GlobalThemeOverrides>(() => {
  // light 浅色主题：不注入深色变量，输入框与日历面板均为 naive-ui 默认白底
  if (props.tableTheme === 'light') {
    return (props.themeOverrides ?? {}) as GlobalThemeOverrides
  }
  if (!props.themeOverrides) {
    return DEFAULT_THEME
  }
  const merged: Record<string, Record<string, unknown>> = { ...DEFAULT_THEME }
  for (const key of Object.keys(props.themeOverrides)) {
    merged[key] = { ...merged[key], ...(props.themeOverrides as Record<string, any>)[key] }
  }
  return merged as GlobalThemeOverrides
})

// ── type → naive-ui type + 默认格式 配置表（一份表替代两份 switch） ──
const TYPE_CONFIG: Record<DatePickerType, { naiveType: NaiveDateType; format: string }> = {
  date: { naiveType: 'date', format: 'yyyy-MM-dd' },
  datetime: { naiveType: 'datetime', format: 'yyyy-MM-dd HH:mm' },
  month: { naiveType: 'month', format: 'yyyy-MM' },
  year: { naiveType: 'year', format: 'yyyy' },
  yearrange: { naiveType: 'yearrange', format: 'yyyy' },
  // naive-ui 不支持 week，降级为 date
  week: { naiveType: 'date', format: 'yyyy-MM-dd' }
}

const config = computed(() => TYPE_CONFIG[props.type] ?? TYPE_CONFIG.date)
const naiveType = computed(() => config.value.naiveType)
const valueFormat = computed(() => props.valueFormat ?? config.value.format)
const formatStr = computed(() => props.format ?? config.value.format)

// ── size 映射：el-date-picker → naive-ui（naive-ui 仅 small/medium/large） ──
const SIZE_MAP: Record<NonNullable<typeof props.size>, 'small' | 'medium' | 'large'> = {
  small: 'small',
  medium: 'medium',
  default: 'medium',
  large: 'large'
}
const naiveSize = computed(() => SIZE_MAP[props.size] ?? 'medium')

// ── actions：优先使用调用方透传值；datetime 默认置 null 隐藏确认按钮，其余类型走默认 ──
const actions = computed<null | undefined | Array<'clear' | 'now' | 'confirm'>>(() => {
  if (props.actions !== undefined) {
    return props.actions
  }
  return naiveType.value === 'datetime' ? null : undefined
})

// ── update-value-on-close：仅 datetime/month/quarter 需要 ──
// year 类型点击即 doUpdate=true 提交并 doClose 关闭；若再开启此项，
// 关闭时 handlePanelConfirm 会用 stale 的 pendingValue 覆盖刚选的值（naive-ui 交互 bug）。
// date 类型点击即提交，此项对其无效（type!=='date' 短路），但保持 false 更语义清晰。
const updateValueOnClose = computed(() => naiveType.value !== 'year' && naiveType.value !== 'date')

// ── minDate/maxDate/disabledDate → naive-ui is-date-disabled（基于时间戳） ──
function toTimestamp(v?: Date | string | number): number | null {
  if (v == null || v === '') {
    return null
  }
  if (v instanceof Date) {
    return v.getTime()
  }
  const t = typeof v === 'number' ? v : Date.parse(v)
  return Number.isNaN(t) ? null : t
}

const isDateDisabled = computed(() => {
  const min = toTimestamp(props.minDate)
  const max = toTimestamp(props.maxDate)
  const userFn = props.disabledDate
  return (ts: number) =>
    (min !== null && ts < min) ||
    (max !== null && ts > max) ||
    (userFn ? userFn(new Date(ts)) : false)
})

// ── shortcuts：element 风格数组 → naive-ui 对象映射 { text: () => 时间戳 } ──
// naive-ui 面板用 Object.keys(shortcuts) 渲染，必须传对象而非数组
const naiveShortcuts = computed(() => {
  if (!props.shortcuts?.length) {
    return undefined
  }
  const map: Record<string, number | (() => number)> = {}
  for (const s of props.shortcuts) {
    map[s.text] = () => (typeof s.value === 'function' ? s.value() : s.value).getTime()
  }
  return map
})

// ── 容器宽度 ──
const wrapStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

// ── 空值归一：'' / undefined / null → null，避免 naive-ui 抛 Invalid time value ──
const formattedModelValue = computed<any>({
  get: () => (modelValue.value == null || modelValue.value === '' ? null : modelValue.value),
  set: (v) => {
    modelValue.value = v
  }
})
</script>

<template>
  <div class="dp-wrap" :style="wrapStyle">
    <!-- abstract 不渲染额外节点；局部 config-provider 使 themeOverrides 只作用于当前选择器 -->
    <n-config-provider abstract :theme-overrides="mergedTheme">
      <n-date-picker
        v-model:formatted-value="formattedModelValue"
        v-bind="attrs"
        :type="naiveType"
        :size="naiveSize"
        :value-format="valueFormat"
        :format="formatStr"
        :clearable="clearable"
        :disabled="disabled"
        :input-readonly="readonly"
        :placeholder="placeholder"
        :is-date-disabled="isDateDisabled"
        :shortcuts="naiveShortcuts"
        :actions="actions"
        :first-day-of-week="1"
        :update-value-on-close="updateValueOnClose"
        style="width: 100%"
      />
    </n-config-provider>
  </div>
</template>

<style scoped lang="scss">
.dp-wrap {
  display: inline-block;
}
</style>
