<template>
  <div
    class="backViewOutClass"
    :style="{
      background:
        'linear-gradient(' +
        (bgDirection ? +'to right' : 'to left') +
        ', rgba(18, 47, 96, 0.1), rgba(18, 47, 96, 0.9))'
    }"
  >
    <borderline :linetp="'leftbottomshort'"></borderline>
    <borderline :linetp="'rightbottomlong'"></borderline>
    <borderline :linetp="'lefttoplong'"></borderline>
    <borderline :linetp="'righttopshort'"></borderline>

    <!--<div
      v-if="dong"
      class="m_container_border_mark_2 m_container_border_mark"
    ></div>-->

    <slot></slot>

    <!--<div
      v-if="dong"
      class="m_container_border_mark_5 m_container_border_mark"
    ></div>-->
  </div>
</template>
<script setup>
import borderline from '@/views/waterEcoDeploy/layout/components/borderline.vue'
const props = defineProps({
  //四个内边距，上右下左
  tPadding: {
    type: Array,
    default: [0, 0, 0, 0],
    required: false
  },
  //四个外边距，上右下左
  tMargin: {
    type: Array,
    default: [0, 0, 0, 0],
    required: false
  },

  //上下的进度动画是否显示
  dong: {
    type: Array,
    default: true,
    required: false
  },
  //上下的进度动画是否显示
  bgDirection: {
    type: Object,
    default: true,
    required: false
  }
})

const padTop = computed({
  get() {
    return props.tPadding[0] + 'px'
  }
})
const padRight = computed({
  get() {
    return props.tPadding[1] + 'px'
  }
})
const padBottom = computed({
  get() {
    return props.tPadding[2] + 'px'
  }
})
const padLeft = computed({
  get() {
    return props.tPadding[3] + 'px'
  }
})

const marTop = computed({
  get() {
    return props.tMargin[0] + 'px'
  }
})
const marRight = computed({
  get() {
    return props.tMargin[1] + 'px'
  }
})
const marBottom = computed({
  get() {
    return props.tMargin[2] + 'px'
  }
})
const marLeft = computed({
  get() {
    return props.tMargin[3] + 'px'
  }
})
</script>
<style lang="scss" scoped>
.backViewOutClass {
  padding: v-bind(padTop) v-bind(padRight) v-bind(padBottom) v-bind(padLeft);
  margin: v-bind(marTop) v-bind(marRight) v-bind(marBottom) v-bind(marLeft);

  background: linear-gradient(to right, rgba(18, 47, 96, 0.1), rgba(18, 47, 96, 0.9));
  /*border: 1px solid #1978c0;*/

  position: relative;

  .m_container_border_mark {
    background-color: #00c0ff;
    width: 20px;
    height: 1px;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    left: 50%;
  }
  .m_container_border_mark_2 {
    top: 0px;
    animation: anim_m_container_border_mark_2 3s infinite;
  }

  .m_container_border_mark_5 {
    bottom: 0px;
    animation: anim_m_container_border_mark_2 3s infinite;
  }

  @keyframes anim_m_container_border_mark_2 {
    0% {
      width: 10px;
      // transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1); /* 初始状态，水平垂直居中，不缩放 */
      // opacity: 1;
      // filter: blur(0);
    }
    100% {
      width: 100%;
      // transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1); /* 移动到左侧，并垂直居中，水平不缩放，垂直缩放到很小 */
      // opacity: 1;
      // filter: blur(0);
    }
  }
}
</style>
