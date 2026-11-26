<script setup lang="ts">
import arrow_active from '@/assets/img/layout/menu/arrow_active.png'
import arrow_no from '@/assets/img/layout/menu/arrow_no.png'

interface Props {
  // 标题内容
  content: string
  // 是否显示点击按钮
  isClickBtn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  isClickBtn: false
})

import { ref } from 'vue'
const isHover = ref(false)

//可以抛出点击事件
const emit = defineEmits(['btnClick'])

function btnClick() {
  emit('btnClick')
}
</script>

<template>
  <div class="container">
    <div>
      <img src="@/assets/img/business/title/title_icon_pre.png" alt="" />

      <div class="title-content">
        {{ props.content }}
      </div>

      <img
        v-if="props.isClickBtn"
        style="cursor: pointer; margin-left: 15px"
        :src="isHover ? arrow_active : arrow_no"
        alt=""
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        @click="btnClick"
      />
    </div>

    <div class="center-div">
      <slot name="center" />
    </div>

    <div class="more">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 8px;
  justify-content: space-between;
  margin-bottom: 6px;

  > div {
    display: flex;
    align-items: center;
  }
}

.title-content {
  display: inline;
  margin-left: 8px;
  min-width: 80px;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #fcfbfc;
  transform: skewX(-10deg);
}

.xie-div-back {
  padding: 4px 3px;
  z-index: 2;
  border-image-source: url('@/assets/img/business/title_back.png');
  width: fit-content;
  border-width: 0px 21px 0px 22px;
  border-style: solid;
  border-color: transparent;
  border-image-slice: 0 26 0 28 fill;
  border-image-repeat: stretch;
  text-align: center;
  transition: all 0.3s;
  position: relative;
}

.title-back-line {
  flex: 1;
  margin-left: -7px;
  height: 1px;
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.5), rgba(24, 144, 255, 0));
}
</style>
