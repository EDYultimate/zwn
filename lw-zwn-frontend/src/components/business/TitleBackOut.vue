<script setup lang="ts">
interface Props {
  // 标题内容
  content?: string
  // 是否显示中间虚线
  isLine?: boolean
  // 是否显示点击按钮
  isClickBtn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  isLine: true,
  isClickBtn: false
})

//可以抛出点击事件
const emit = defineEmits(['btnClick'])

function btnClick() {
  emit('btnClick')
}

import arrow_no from '@/assets/img/layout/menu/arrow_no.png'
import arrow_active from '@/assets/img/layout/menu/arrow_active.png'

// 标题文字左侧的小图标
import titlePre from '@/assets/img/business/title/con_title_pre.png'
</script>

<template>
  <div class="title-back">
    <!-- 标题条：图1（左端帽）+ 图2（随文字长度左右拉伸的中段）+ 图3（右侧渐隐尾）共同组成标题文字的背景 -->
    <div class="con-title-bar">
      <div class="title-content">
        <img class="title-pre" :src="titlePre" alt="" />
        <span>{{ props.content }}</span>
      </div>
    </div>

    <!--    <div class="center-back">-->
    <!--      <slot name="center" />-->
    <!--    </div>-->

    <!--虚线-->
    <div class="title-back-line"></div>

    <div class="more">
      <slot />
    </div>

    <img
      v-if="props.isClickBtn"
      class="title-right-jian"
      src="@/assets/img/business/title/title_right_jian.png"
      alt=""
      @click="btnClick"
    />
  </div>
</template>

<style scoped lang="scss">
.title-back {
  position: relative;
  display: flex;
  align-items: center;
}

/* 标题条占位容器：占满整行用于定位，实际背景由内部 title-content 三段包裹文字 */
.con-title-bar {
  position: relative;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* 标题文字背景条：宽度随文字内容自适应
   三张图叠放在文字下方共同组成背景：
   - 图1（27px）：左端帽，贴左
   - 图2（3px 拉伸条）：中段，从 27px 起拉伸至右端 122px 之前，文字越长拉伸越多
   - 图3（122px）：右侧渐隐尾，贴右（通过右侧 padding 延伸到文字末端之后） */
.title-content {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0 60px 4px 6px;
  background-image:
    url('@/assets/img/business/title/con_title_1.png'),
    url('@/assets/img/business/title/con_title_3.png'),
    url('@/assets/img/business/title/con_title_2.png');
  background-repeat: no-repeat;
  background-position:
    left bottom,
    right bottom,
    27px bottom;
  /* 图2 宽度拉伸、高度固定为原始 28px（auto 会按宽高比等比放大导致垂直拉伸） */
  background-size:
    27px auto,
    122px auto,
    calc(100% - 149px) 28px;
  font-size: 1.1rem;
  font-weight: bold;

  letter-spacing: 2px;
  color: #f6f6f6;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.6);

  span {
    transform: skewX(-10deg);
  }
}

/* 标题文字左侧的小图标 */
.title-pre {
  flex-shrink: 0;
  width: 24px;
  height: 20px;
  margin-right: 4px;
}

.center-back {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.title-back-line {
  flex: 1;
  //margin-left: -1px;
  //margin-bottom: 4px;
  //height: 2px;
  //background: linear-gradient(90deg, rgba(138, 190, 253, 0.6), rgba(24, 144, 255, 0));
  /* 边缘轻微模糊，线条过渡更柔和 */
  //filter: blur(0.5px);

  background: url('@/assets/img/business/title/con_title_4.png');

  -webkit-mask-image: linear-gradient(to right, #000, transparent);
  mask-image: linear-gradient(to right, #000, transparent);
  //background-repeat: no-repeat;

  background-size: 100% 28px;
  background-position: bottom;
  /* 拉伸到与 .title-content 相同的高度 */
  align-self: stretch;
}

.more {
  position: relative;
  z-index: 2;
}

/* 箭头按钮：悬浮高亮（提亮 + 蓝色光晕） */
.title-right-jian {
  transition: filter 0.2s;
  padding: 5px 0;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    filter: brightness(1.4) drop-shadow(0 0 4px rgba(77, 132, 196, 0.9));
  }
}
</style>
