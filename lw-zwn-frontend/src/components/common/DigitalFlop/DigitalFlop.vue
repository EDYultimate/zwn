<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  /** 数值（支持小数/字符串） */
  value?: number | string
  /** 小数位（自动补齐、翻牌插值精度） */
  decimals?: number
  /** 数字块尺寸(px) */
  size?: number
  /** 数字颜色 */
  color?: string
  /** 数字块背景（块高>宽，纵向渐变） */
  bg?: string
  /** 千分位分隔 */
  thousands?: boolean
  /** 动画时长 ms，0 关闭 */
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  decimals: 0,
  size: 26,
  color: '#1e79ff',
  bg: 'linear-gradient(180deg, rgb(233,241,255) 0%, rgb(213,230,255) 100%)',
  thousands: true,
  duration: 1000
})

const sizePx = computed(() => `${props.size}px`)
const subSize = computed(() => `${Math.floor(props.size * 0.7)}px`)
const colorRGB = computed(() => {
  const m = props.color.match(/#([0-9a-fA-F]{6})/)
  if (!m) {
    return props.color
  }
  const n = parseInt(m[1], 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
})
/** 逗号颜色：完整 rgba 字符串（Sass 编译期不解析 rgba()，故在 JS 拼好直接 v-bind） */
const commaColor = computed(() => `rgba(${colorRGB.value}, 0.8)`)

/** 统一数值→固定小数字符串 */
function toFixedStr(v: number | string, dec: number) {
  const n = typeof v === 'string' ? (isNaN(Number(v)) ? 0 : Number(v)) : v
  return Number(n).toFixed(dec)
}

/** 按小数位补齐/截断 */
function padDec(src: string, dec: number) {
  const idx = src.indexOf('.')
  const intPart = idx >= 0 ? src.slice(0, idx) : src
  let decPart = idx >= 0 ? src.slice(idx + 1) : ''
  if (dec <= 0) {
    return intPart
  }
  while (decPart.length < dec) {
    decPart += '0'
  }
  return intPart + '.' + decPart.slice(0, dec)
}

/** 千分位 */
function withThousands(src: string) {
  const idx = src.indexOf('.')
  const intPart = idx >= 0 ? src.slice(0, idx) : src
  return idx >= 0
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + src.slice(idx)
    : intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function frameText(v: number | string) {
  let s = toFixedStr(v, props.decimals)
  s = padDec(s, props.decimals)
  return props.thousands ? withThousands(s) : s
}

const display = ref('0')
const chars = computed(() => display.value.split(''))
let rafId = 0

function animate() {
  display.value = frameText(props.value)
  const target = Number(toFixedStr(props.value, props.decimals))
  const from = Number(toFixedStr(props.value, props.decimals)) // 占位，真实起点由上一次快照得到
  void from
  if (props.duration <= 0) {
    return
  }
  const base = Number(display.value.replace(/,/g, ''))
  const start = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / props.duration)
    const cur = (target - base) * ease(t) + base
    let s = cur.toFixed(props.decimals)
    s = padDec(s, props.decimals)
    display.value = props.thousands ? withThousands(s) : s
    if (t < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      display.value = frameText(props.value)
    }
  }
  rafId = requestAnimationFrame(step)
}

watch(
  () => props.value,
  () => animate()
)
onMounted(() => animate())
onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <div class="df">
    <template v-for="(ch, i) in chars" :key="i">
      <span v-if="ch === ','" class="df__comma">{{ ch }}</span>
      <span v-else-if="ch === '.'" class="df__dot">{{ ch }}</span>
      <span v-else class="df__cell">{{ ch }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.df {
  display: inline-flex;
  align-items: center;
  line-height: 1;

  &__cell {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: v-bind(sizePx);
    min-width: v-bind(sizePx);
    margin-right: 3px;
    padding: 0 4px;
    border-radius: 4px;
    background: v-bind(bg);
    border: 1px solid rgba(30, 121, 255, 0.35);
    font-family:
      DIN Alternate,
      Bahnschrift,
      Consolas,
      'Microsoft YaHei',
      sans-serif;
    font-weight: 600;
    font-size: v-bind(subSize);
    color: v-bind(color);
    letter-spacing: 1px;
    box-shadow: inset 0 0 6px rgba(30, 121, 255, 0.12);

    &:last-of-type {
      margin-right: 0px;
    }
  }

  &__dot {
    color: v-bind(color);
    font-weight: 600;
    font-size: v-bind(subSize);
    margin: 0 2px;
  }

  &__comma {
    color: v-bind(commaColor);
    font-weight: 600;
    font-size: v-bind(subSize);
    margin-right: 3px;
  }
}
</style>
