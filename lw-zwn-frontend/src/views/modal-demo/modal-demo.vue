<script setup lang="ts">
import BusinessModalDemo from '@/views/modal-demo/components/business-modal-demo.vue'
const busModelDemoRef = shallowRef()
const openModel = () => {
  busModelDemoRef.value.show()
}
</script>
<template>
  <div>
    <n-button @click="openModel">测试复合弹窗</n-button>
    <business-modal-demo ref="busModelDemoRef" />
  </div>
</template>

<style lang="scss" scoped></style>
