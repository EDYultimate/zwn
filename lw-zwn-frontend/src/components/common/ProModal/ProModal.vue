<template>
  <n-config-provider :theme="theme" :theme-overrides="configThemeOverrides">
    <n-modal
      ref="proModal"
      :class="modalThemeClass"
      :style="styleParams"
      preset="card"
      size="small"
      :title="props.title"
      :header-style="headerStyle"
      :content-style="modalContentStyle"
      :close-on-esc="props.closeOnEsc"
      :auto-focus="props.autoFocus"
      v-bind="$attrs"
      @after-leave="afterLeave"
      @after-enter="afterEnter"
    >
      <template #header>
        <slot v-if="$slots['header-main']" name="header-main" />
      </template>
      <template #header-extra>
        <slot v-if="$slots['header-extra-container']" name="header-extra-container" />
        <!-- 标题右侧时间选择（可选，由调用方传参开启；multiple 场景仍可用 header-extra-container 插槽自定义） -->
        <n-date-picker
          v-if="props.showTimePicker"
          :formatted-value="props.timePickerValue"
          :type="props.timePickerType"
          size="small"
          :style="{ width: props.timePickerWidth }"
          :value-format="timeFormatResolved"
          :clearable="props.timePickerClearable"
          :placeholder="props.timePickerPlaceholder"
          :is-date-disabled="props.timePickerDisabled"
          @update:formatted-value="onTimePickerChange"
        />
        <n-button
          v-if="props.isFullScreen"
          size="small"
          quaternary
          :text-color="headerFgColor"
          @click="fullScreen"
        >
          <template #icon>
            <n-icon :component="ResizeOutline" :color="headerFgColor" />
          </template>
        </n-button>
      </template>
      <template #default>
        <div ref="contentRef" style="height: 100%">
          <n-scrollbar
            v-if="props.contentMode === 'scroll'"
            style="height: 100%"
            :content-style="{ minHeight: '100%' }"
          >
            <div :style="{ padding: props.defaultPadding }">
              <slot name="default"></slot>
            </div>
          </n-scrollbar>
          <div
            v-else
            :style="{ padding: props.defaultPadding, height: '100%', boxSizing: 'border-box' }"
          >
            <slot name="default"></slot>
          </div>
        </div>
      </template>
      <template v-if="$slots.action" #action>
        <slot name="action"></slot>
      </template>
    </n-modal>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ResizeOutline } from '@vicons/ionicons5'
import type { CSSProperties } from 'vue'
import { ModalProps } from 'naive-ui'
import useConfig from '@/config/theme/useConfig'

/** 弹框主题类型：blue 深蓝大屏 / light 白色浅色 */
export type ProModalTheme = 'light' | 'blue'

interface BasicModalProps extends /* @vue-ignore */ ModalProps {
  title: string
  closeOnEsc?: boolean
  isFullScreen?: boolean
  contentMode?: 'scroll' | 'fill'
  defaultPadding?: string
  styleParams?: CSSProperties
  autoFocus?: boolean
  headerTextColor?: string
  headerBackgroundColor?: string
  /* ==================== 弹框主题 ==================== */
  /** 弹框主题：blue 深蓝大屏）/ light 白色浅色主题（默认 */
  tableTheme?: ProModalTheme
  /* ==================== 标题右侧时间选择（可选功能，默认关闭） ==================== */
  /** 是否在标题右侧显示时间选择器 */
  showTimePicker?: boolean
  /** 时间类型：date 日 / month 月 / year 年（默认 date） */
  timePickerType?: 'date' | 'month' | 'year'
  /** 当前值（v-model:time-picker-value，formatted-value 语义） */
  timePickerValue?: string | null
  /** 值格式（默认按类型推导：date→yyyy-MM-dd / month→yyyy-MM / year→yyyy） */
  timePickerFormat?: string
  /** 选择器宽度（默认 120px） */
  timePickerWidth?: string
  /** 占位文案（默认「选择时间」） */
  timePickerPlaceholder?: string
  /** 是否可清空（默认 false，与项目弹窗既有用法一致） */
  timePickerClearable?: boolean
  /** 禁用日期判断（如限制可选范围；月报弹窗用它禁用超过最新一期的月份） */
  timePickerDisabled?: (timestamp: number) => boolean
}
const { theme } = useConfig()
const emit = defineEmits([
  'fullScreenCallBack',
  'closeModal',
  'openModal',
  'update:timePickerValue',
  'timePickerChange'
])
const props = withDefaults(defineProps<BasicModalProps>(), {
  title: '',
  closeOnEsc: false,
  isFullScreen: false,
  contentMode: 'scroll',
  defaultPadding: '16px 20px',
  autoFocus: false,
  styleParams: () => ({ width: '600px', height: 'auto' }),
  // 弹框主题默认深蓝大屏（存量用法不变） blue ；传 light 使用白色浅色主题
  tableTheme: 'light',
  // 表头配色默认为空 → 使用组件内置主题风格
  // 传入自定义颜色时：仅传背景色会按明暗自动配文字色，也可同时传 headerTextColor 强制指定
  headerBackgroundColor: '',
  headerTextColor: '',
  showTimePicker: false,
  timePickerType: 'date',
  timePickerValue: null,
  timePickerFormat: '',
  timePickerWidth: '120px',
  timePickerPlaceholder: '选择时间',
  timePickerClearable: false,
  timePickerDisabled: undefined
})

/** 值格式：未显式指定时按类型推导 */
const timeFormatResolved = computed(
  () =>
    props.timePickerFormat ||
    ({ date: 'yyyy-MM-dd', month: 'yyyy-MM', year: 'yyyy' }[props.timePickerType] ?? 'yyyy-MM-dd')
)

/** 时间选择变化：同步 v-model 并抛出 change（调用方处理跳转/查询等副作用） */
function onTimePickerChange(val: string | null) {
  emit('update:timePickerValue', val)
  emit('timePickerChange', val)
}

const proModal = ref()
const contentRef = ref<HTMLElement>()
const styleParams = reactive<CSSProperties>(props.styleParams)
const styleParamsOrigin = ref<CSSProperties | null>(null)
const fullScreenMode = ref(false)

/* ==================== 弹框主题（blue 深蓝大屏 / light 白色浅色） ==================== */
/** 是否深蓝大屏主题（tableTheme='light' 时为白色浅色主题） */
const isBlueTheme = computed(() => props.tableTheme !== 'light')

/** 弹框卡片主题类（浅色主题追加 pro-modal--light，配合全局样式区分） */
const modalThemeClass = computed(() => ['pro-modal', isBlueTheme.value ? '' : 'pro-modal--light'])

/** 各主题默认表头配色：深蓝主题透明表头透出卡片深蓝渐变 + 浅蓝标题；浅色主题浅蓝渐变表头 + 深蓝标题 */
const THEME_DEFAULTS = {
  blue: { bg: 'transparent', bgSolid: '#0f2e64', fg: '#4AD3FF' },
  light: {
    bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
    bgSolid: '#eef6ff',
    fg: '#1f3b63'
  }
}
const themeDefault = computed(() => THEME_DEFAULTS[props.tableTheme === 'light' ? 'light' : 'blue'])

function isLightColor(color: string): boolean {
  let r: number, g: number, b: number
  if (color.startsWith('#')) {
    const c = color.replace('#', '')
    const hex =
      c.length === 3
        ? c
            .split('')
            .map((ch) => ch + ch)
            .join('')
        : c
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  } else if (color.startsWith('rgb')) {
    const match = color.match(/[\d.]+/g)
    if (!match || match.length < 3) {
      return false
    }
    r = parseInt(match[0])
    g = parseInt(match[1])
    b = parseInt(match[2])
  } else {
    return false
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.7
}

/** 实际表头背景（自定义色 or 主题默认） */
const headerBg = computed(() => props.headerBackgroundColor || themeDefault.value.bg)
/** 用于明暗判断的纯色 */
const headerBgSolid = computed(() => props.headerBackgroundColor || themeDefault.value.bgSolid)

/** 表头前景色：显式指定优先；默认主题固定标题色；自定义背景按明暗自动配深蓝/白色 */
const headerFgColor = computed(() => {
  if (props.headerTextColor) {
    return props.headerTextColor
  }
  if (!props.headerBackgroundColor) {
    return themeDefault.value.fg
  }
  return isLightColor(headerBgSolid.value) ? '#1f3b63' : '#fff'
})

/** 表头是否为浅色底（决定关闭按钮悬停用蓝调还是白色） */
const lightHeader = computed(() => isLightColor(headerBgSolid.value))

const headerStyle = computed<CSSProperties>(() => ({
  background: headerBg.value,
  borderBottom: isBlueTheme.value
    ? '1px solid rgba(80, 170, 255, 0.22)'
    : '1px solid rgba(0, 0, 0, 0.08)',
  // 浅色主题卡片有 10px 圆角，表头跟随
  // borderRadius: isBlueTheme.value ? undefined : '10px 10px 0 0',
  padding: '15px 20px',
  letterSpacing: '0.02em',
  fontSize: '18px',
  fontWeight: 600
}))

// 通过 n-config-provider 的 theme-overrides 向下注入 Card 主题变量
// Vue 的 provide/inject 跟随虚拟 DOM 树，teleport 不影响
const configThemeOverrides = computed(() => {
  // 卡片差异化配置：深蓝主题为半透明深蓝卡底 + 蓝描边；浅色主题为白色 10px 圆角卡片
  const cardOverride = isBlueTheme.value
    ? {
        color: 'rgba(17, 40, 114, 0.6)',
        borderColor: 'rgba(98, 176, 255, 0.4)',
        closeIconColorHover: '#a8d4ff',
        closeIconColorPressed: '#7fc0ff',
        closeColorHover: 'rgba(255, 255, 255, 0.15)',
        closeColorPressed: 'rgba(255, 255, 255, 0.15)'
      }
    : {
        borderRadius: '0',
        closeIconColorHover: '#377aec',
        closeIconColorPressed: '#2b62c4',
        closeColorHover: 'rgba(55, 122, 236, 0.10)',
        closeColorPressed: 'rgba(55, 122, 236, 0.18)'
      }
  return {
    Card: {
      titleFontSize: '18px',
      titleFontWeight: '600',
      titleTextColor: headerFgColor.value,
      closeIconColor: headerFgColor.value,
      ...cardOverride
    },
    // 深蓝底上的默认按钮（如「关闭」）：浅色实底 + 深蓝文字，保证醒目（仅深蓝主题需要）
    // 注意：naive-ui 通过内联 style 注入 --n-* 变量，样式表覆盖无效，必须走主题
    ...(isBlueTheme.value
      ? {
          Button: {
            color: '#e8f1ff',
            colorHover: '#ffffff',
            colorPressed: '#cfe2ff',
            colorFocus: '#e8f1ff',
            textColor: '#12336e',
            textColorHover: '#0b224e',
            textColorPressed: '#0b224e',
            textColorFocus: '#12336e',
            border: '1px solid rgba(98, 176, 255, 0.65)',
            borderHover: '1px solid #62b0ff',
            borderPressed: '1px solid #4a9aef',
            borderFocus: '1px solid #62b0ff'
          }
        }
      : {})
  }
})

const slots = useSlots()
const headerPlusAction = ref<number>(0)
const justHeader = ref<number>(0)

const contentHeight = computed(() => {
  if (styleParams.height === 'auto') {
    if (props.contentMode === 'scroll') {
      return `calc(100vh - ${headerPlusAction.value}px)`
    }
    return 'auto'
  }
  if (slots.action) {
    return `calc(${styleParams.height} - ${headerPlusAction.value}px)`
  }
  return `calc(${styleParams.height} - ${justHeader.value}px)`
})

const modalContentStyle = computed<CSSProperties>(() => ({
  height: contentHeight.value,
  overflow: 'hidden',
  padding: '0'
}))

const fullScreen = () => {
  if (proModal.value) {
    emit('fullScreenCallBack')
    if (fullScreenMode.value) {
      if (styleParamsOrigin.value) {
        Object.assign(styleParams, styleParamsOrigin.value)
      }
      fullScreenMode.value = false
    } else {
      styleParamsOrigin.value = { ...styleParams }
      Object.assign(styleParams, { width: '100vw', height: '100vh' })
      fullScreenMode.value = true
    }
  }
}

const afterEnter = () => {
  if (!styleParamsOrigin.value) {
    styleParamsOrigin.value = { ...styleParams }
  }
  const cardEl = contentRef.value?.closest('.n-card') as HTMLElement | null
  if (cardEl) {
    const headerElement = cardEl.querySelector('.n-card-header') as HTMLElement | null
    const actionElement = cardEl.querySelector('.n-card__action') as HTMLElement | null
    const headerHeight = headerElement?.offsetHeight || 0
    const actionHeight = actionElement?.offsetHeight || 0
    headerPlusAction.value = headerHeight + actionHeight
    justHeader.value = headerHeight
  }
  emit('openModal')
}

const afterLeave = () => {
  if (styleParamsOrigin.value) {
    Object.assign(styleParams, styleParamsOrigin.value)
  }
  fullScreenMode.value = false
  emit('closeModal')
}
</script>

<style lang="scss">
/**
 * ProModal 公共美化样式
 * 注意：n-modal 的内容会传送（teleport）到 body 下，scoped 样式无法作用到，
 * 因此这里必须用全局样式，并通过 .pro-modal 类严格限定作用范围（该类挂在弹框卡片上）。
 * 主题区分：深蓝主题（默认）/ 浅色主题（追加 .pro-modal--light 类）。
 */
.pro-modal.n-card {
  /* 标题左侧蓝色装饰条（系统统一的标识样式，两种主题通用） */
  .n-card-header__main {
    display: inline-flex;
    align-items: center;
    color: #121212;

    &::before {
      content: '▶';
      //width: 4px;
      //height: 10px;
      font-size: 0.8rem;
      margin-right: 10px;
      color: #55a3e0;
    }
  }
}

/* ==================== 深蓝大屏主题（默认，table-theme="blue"） ==================== */
.pro-modal.n-card:not(.pro-modal--light) {
  /* 深蓝半透明卡片底（#112872 60%）+ 蓝色描边（#62b0ff 40%）+ 光晕投影 */
  background: rgba(17, 40, 114, 0.78) !important;
  border: 1px solid rgba(98, 176, 255, 0.4);
  box-shadow: 0 0 30px rgba(40, 120, 255, 0.45);

  /* 底部操作栏：透出卡片半透明深蓝底（与弹框背景统一），仅保留顶部分隔线 */
  .n-card__action {
    background: transparent;
    border-top: 1px solid rgba(80, 170, 255, 0.22);
  }
}

/* ==================== 白色浅色主题（table-theme="light"） ==================== */
.pro-modal.pro-modal--light.n-card {
  /* 柔和蓝调投影，与系统页面卡片阴影一致 */
  box-shadow: 0 12px 40px rgba(15, 74, 145, 0.22);

  /* 底部操作栏：浅底 + 分隔线，与表头呼应 */
  .n-card__action {
    background: #f7fafd;
    border-top: 1px solid rgba(55, 122, 236, 0.12);
  }
}
</style>
