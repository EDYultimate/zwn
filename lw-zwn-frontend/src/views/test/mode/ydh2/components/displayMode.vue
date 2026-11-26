<template>
  <div class="displayModeContainer">
    <el-form label-width="120px">
      <el-form-item label="显示模式">
        <el-radio-group v-model="display_mode" @change="btnClick">
          <el-radio label="auto" size="large">自适应</el-radio>
          <el-radio label="consultation" size="large">会商</el-radio>
        </el-radio-group>
        <el-slider
          v-show="display_mode !== 'auto'"
          v-model="m_main_scale"
          :step="1"
          show-stops
          style="margin: auto; width: calc(100% - 250px); margin-left: 50px"
          :format-tooltip="formatTooltip"
          size="small"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import store from '@/store/index.js'
import c from '@/utils/common/c.js'
const { proxy } = getCurrentInstance()
import g from '@/utils/common/g.js'

const display_mode = ref()

const main_scale = ref()
const m_main_scale = ref()
const main_scale_list = ref([])

for (let i = 0; i <= 100; i++) {
  main_scale_list.value.push((1 + (i / 50).toFixed(3) * 1).toFixed(3) * 1)
}

function formatTooltip(index) {
  return main_scale_list.value[index]
}

watch(
  () => m_main_scale.value,
  (d) => {
    if (d !== undefined) {
      main_scale.value = main_scale_list.value[d]
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => main_scale.value,
  (d) => {
    if (d !== undefined) {
      store.commit('register_obj', { key: 'main_scale', d: d })
      sessionStorage.setItem('scale', d)
      if (display_mode.value !== 'auto') {
        store.state.w = window.innerWidth * (1 / d)
      }
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  display_mode.value = g.get_obj('display_mode')
  main_scale.value = g.get_obj('main_scale')

  if (main_scale.value) {
    for (let i = 0; i <= 100; i++) {
      const obj = main_scale_list.value[i]

      if (obj == main_scale.value) {
        m_main_scale.value = i
        break
      }
    }
  }
})

//可以抛出点击事件
const emit = defineEmits(['btnClick'])

function btnClick() {
  emit('btnClick')
}

watch(
  () => display_mode.value,
  (d) => {
    if (d !== undefined) {
      store.commit('register_obj', { key: 'display_mode', d: d })
      sessionStorage.setItem('display', d)
    }
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss" scoped>
.displayModeContainer {
  // position: fixed;
  // // left: 0;
  // top: 110px;
  // color: #fff;

  :deep(.el-form-item) {
    display: flex;
    align-items: center;

    .el-form-item__label {
      font-size: 16px;
      color: #ccc;
      margin-right: 10px;
    }
  }
}
</style>
