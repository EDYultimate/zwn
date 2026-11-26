<script setup lang="ts">
import { computed } from 'vue'

/**
 * 正文行内引用角标（两个问答页共用）。
 *
 * <p>以前是一个 15px 的蓝色小圆点 + 数字、上标对齐，看起来就是脚注编号，
 * 用户不知道可以点。这里改成带箭头图标的实体按钮：蓝底描边 + 投影、
 * hover 抬升并浮出「点击前往：xxx」、active 按下、focus-visible 焦点环，
 * 同时用 <button> + aria-label 保证键盘可操作、读屏能读懂。
 *
 * <p>pending 是流式期间 refs 还没随 done 帧到达的占位，明确不可点击。
 * 本组件只负责「看起来能点」和把点击抛出去，跳转 / 高亮 / 打开原文逻辑全在父组件。
 *
 * <p>variant 区分两类引用：ui = 页面动作（蓝色实体按钮 · 箭头），
 * kb = 文档依据（青色小序号上标，跳转入口统一收在回答底部的来源清单里）。
 * 编号空间共用，但颜色与形态让用户一眼看出「点了是跳页面还是看原文」。
 */
const props = withDefaults(
  defineProps<{
    /** 引用编号，与正文 [[n]] 对应 */
    cite?: number
    /** 完整动作文案，如「点击前往：高亮许可水量」 */
    tip?: string
    /** 流式期间事件未到位：渲染成等待占位，不可点击 */
    pending?: boolean
    /** ui = 页面动作（默认） / kb = 知识库文档依据 */
    variant?: 'ui' | 'kb'
  }>(),
  { cite: 0, tip: '点击前往对应位置', pending: false, variant: 'ui' }
)

const emit = defineEmits<{ activate: [] }>()

const tipText = computed(() => props.tip || '点击前往对应位置')
</script>

<template>
  <button
    v-if="!pending"
    type="button"
    class="ac-cite"
    :class="{ 'is-kb': variant === 'kb' }"
    :aria-label="tipText"
    :data-tip="tipText"
    @click="emit('activate')"
  >
    <span class="ac-num">{{ cite }}</span
    ><svg v-if="variant !== 'kb'" class="ac-ico" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path
        d="M3.2 8.8 8.8 3.2M4.7 3.2h4.1v4.1"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
  </button>
  <span v-else class="ac-cite is-pending" title="内容生成中" aria-hidden="true">·</span>
</template>

<style scoped lang="scss">
.ac-cite {
  position: relative;
  display: inline-flex;
  box-sizing: border-box;
  gap: 3px;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  height: 21px;
  padding: 0 6px;
  margin: 0 3px;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  /* 两个问答气泡都是 pre-wrap，组件内部必须还原，否则模板缩进会变成可见空格 */
  white-space: nowrap;
  vertical-align: baseline;
  cursor: pointer;
  background: linear-gradient(180deg, #419af7, #1f7ae0);
  border: 1px solid #1f7ae0;
  border-radius: 11px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 2px 5px rgba(31, 122, 224, 0.28);
  transform: translateY(-1px);
  transition:
    background 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;

  &:hover {
    background: linear-gradient(180deg, #2b86ea, #14559c);
    border-color: #14559c;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.3) inset,
      0 4px 10px rgba(31, 122, 224, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 1px 2px rgba(31, 122, 224, 0.3);
    transform: translateY(0) scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid #8ec5ff;
    outline-offset: 2px;
  }

  /* 知识库文档角标：只留一个青色小序号，像一个真正的脚注上标。
     以前这里是青底白字的实体按钮 + 文档图标，一份文档被引用四五次时，
     正文里就挂满一模一样的「查看原文」按钮，把回答本身淹掉了。
     真正的跳转入口统一收在回答底部的来源清单里（一份文档只出现一次）。 */
  &.is-kb {
    gap: 0;
    min-width: 15px;
    height: 15px;
    padding: 0 4px;
    margin: 0 2px 0 1px;
    font-size: 10.5px;
    font-weight: 700;
    color: #0b6b58;
    background: #e8f5f1;
    border: 1px solid #a9dccf;
    border-radius: 4px;
    box-shadow: none;
    transform: translateY(-3px);

    &:hover {
      color: #064e40;
      background: #cdece3;
      border-color: #7ac9b6;
      box-shadow: 0 2px 6px rgba(15, 143, 119, 0.22);
      transform: translateY(-4px);
    }

    &:active {
      box-shadow: none;
      transform: translateY(-3px) scale(0.94);
    }

    &:focus-visible {
      outline: 2px solid #8fdcca;
      outline-offset: 2px;
    }
  }

  /* refs 还没到：虚线呼吸占位，明确是「还没好」而不是死角标 */
  &.is-pending {
    min-width: 15px;
    height: 15px;
    padding: 0 4px;
    font-size: 11px;
    color: #7d97b8;
    cursor: default;
    background: #eaf2fc;
    border: 1px dashed #b9d2f0;
    box-shadow: none;
    animation: ac-pulse 1.4s ease-in-out infinite;
    transform: none;

    &:hover {
      background: #eaf2fc;
      box-shadow: none;
      transform: none;
    }
  }
}

.ac-num {
  font-variant-numeric: tabular-nums;
}

.ac-ico {
  flex: none;
  width: 10px;
  height: 10px;
}

/* 悬浮说明：absolute 浮层，不挤压正文排版，也不会造成布局跳动。
   文案走 data-tip + CSS content，而不是塞一个 <span>：以前那个 span 虽然 opacity:0，
   但它始终在 DOM 里，用户框选复制回答时会把「点击查看原文：《…》· 第 3 页」
   一起复制出来，读起来像正文。伪元素的内容不参与选区，显示效果不变。 */
.ac-cite::after {
  position: absolute;
  bottom: calc(100% + 7px);
  left: 50%;
  z-index: 20;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  white-space: nowrap;
  pointer-events: none;
  content: attr(data-tip);
  background: rgba(23, 51, 88, 0.94);
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(16, 45, 82, 0.25);
  opacity: 0;
  transform: translate(-50%, 3px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.ac-cite:hover::after,
.ac-cite:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* 知识角标是上标小方块，浮层再往上抬会被上一行挡住，这里单独压一下偏移 */
.ac-cite.is-kb::after {
  bottom: calc(100% + 2px);
}

@keyframes ac-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ac-cite,
  .ac-cite::after {
    transition: none;
  }
  .ac-cite.is-pending {
    animation: none;
  }
}
</style>
