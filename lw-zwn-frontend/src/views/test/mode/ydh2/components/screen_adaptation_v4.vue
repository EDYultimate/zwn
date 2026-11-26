<template>
  <div :class="{ 'screen-adapter': g.get_obj('display_mode') === 'auto' }" :style="gain_style()">
    <slot></slot>
  </div>
</template>

<script setup>
import store from '@/store/index.js'
import g from '@/utils/common/g.js'
import lodash from 'lodash'

const props = defineProps({
  width: { default: 1920 },
  height: { default: g.system_h() }
})

const transform = ref()

const tr_sw = () => {
  if (g.get_obj('display_mode') === 'auto') {
    const rh = props.height
    store.state.w = (window.innerWidth / window.innerHeight) * rh
    if (store.state.w < props.width) {
      store.state.w = props.width
    }
  } else {
    store.state.w = window.innerWidth * (1 / g.get_obj('main_scale'))
  }
}

const getScale = () => {
  const w = window.innerWidth / store.state.w
  const h = window.innerHeight / props.height
  const m_scale = w < h ? w : h
  store.commit('register_obj', { key: 'm_scale', d: m_scale })
  // g.set_obj("m_scale", m_scale)
  return m_scale
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
    'transform-origin': '0 0',
    transform: `scale(${g.get_obj('main_scale')})`,
    width: store.state.w + 'px',
    height: g.system_h() + 'px'
  }
}

onBeforeMount(() => {
  window.addEventListener('resize', () => {
    tr_sw()
    debounced_setScale()
  })
})

onMounted(() => {
  setScale()
})

watch(
  () => g.get_obj('display_mode'),
  (d) => {
    if (d !== 'auto') {
      store.commit('register_obj', { key: 'm_scale', d: 1 })
      // g.set_obj("m_scale", 1)
    }
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
