<template>
  <div :class="{ 'screen-adapter': g.get_obj('display_mode') === 'auto' }" :style="gain_style()">
    <slot></slot>
  </div>
</template>

<script setup>
import store from '@/store/index.js'
import g from '@/utils/common/g.js'
// import c from "@/common/c.js"
import lodash from 'lodash'

import c from '@/utils/common/c.js'

const props = defineProps({
  width: { default: 1920 },
  height: { default: g.system_h() }
})

const transform = c.ref()

const tr_sw = () => {
  // debugger
  if (g.get_obj('display_mode') === 'auto') {
    // debugger
    const rh = props.height
    store.state.w = (window.innerWidth / window.innerHeight) * rh
    // console.log("store.state.wstore.state.w ",store.state.w)
    // console.log("store.state.wsprops.width ",props.width)

    if (store.state.w < props.width) {
      store.state.w = props.width //最小就是1920
    }
  } else {
    store.state.w = window.innerWidth
  }
}

const getScale = () => {
  const w = window.innerWidth / store.state.w
  const h = window.innerHeight / props.height
  return w < h ? w : h
}

const setScale = () => {
  transform.value = 'scale(' + getScale() + ') translate(-50%, -50%)'
}

const debounced_setScale = lodash.debounce(setScale, 1000)

const gain_style = () => {
  if (g.get_obj('display_mode') === 'auto') {
    return {
      width: store.state.w + 'px',
      height: props.height + 'px',
      transform: transform.value
    }
  }
  return {
    width: store.state.w + 'px',
    height: g.system_h() + 'px'
  }
}

c.onBeforeMount(() => {
  window.addEventListener('resize', () => {
    tr_sw()
    debounced_setScale()
  })
})

c.onMounted(() => {
  setScale()
})

c.watch(
  () => g.get_obj('display_mode'),
  (d) => {
    tr_sw()
    debounced_setScale()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.screen-adapter {
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transition: 0.3s;
}
</style>
