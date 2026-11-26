<template>
  <div class="backViewInClass">
    <slot></slot>
  </div>
</template>
<script setup>
import borderline from '@/views/modelPlatForm/components/borderline'
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
.backViewInClass {
  padding: v-bind(padTop) v-bind(padRight) v-bind(padBottom) v-bind(padLeft);
  margin: v-bind(marTop) v-bind(marRight) v-bind(marBottom) v-bind(marLeft);

  background-color: rgba(11, 37, 77, 0.5);
  border-radius: 8px;
  border: 1px solid #1978c0;
}
</style>
