<script setup lang="ts">
import { ref } from 'vue'

import switchL from '@/assets/img/layout/common/switch_l.png'
import switchR from '@/assets/img/layout/common/switch_r.png'

interface Props {
  width?: string
  height?: string
  padding?: string
  bottom?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '',
  height: '',
  padding: '',
  bottom: '20px'
})
</script>

<template>
  <div class="pointer-auto" style="position: relative">
    <div
      class="bottom-container"
      :style="{
        width: props.width,
        height: props.height,
        bottom: props.bottom
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.bottom-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
}
</style>
