<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { nextTick, onMounted, ref } from 'vue'

const dateRef = ref<string>('')
const timeAndWeekRef = ref<string>('')
const realTimeAnimationFrame = () => {
  const now = Date.now()
  dateRef.value = useDateFormat(now, 'YYYY/MM/DD ').value
  const time = useDateFormat(now, 'HH:mm:ss')
  const week = Number(useDateFormat(now, 'd').value)
  const weekArray = ['日', '一', '二', '三', '四', '五', '六']
  timeAndWeekRef.value = `${time.value} 星期${weekArray[week]}`
  // timeAndWeekRef.value = ` 星期${weekArray[week]}`
  requestAnimationFrame(realTimeAnimationFrame)
}
onMounted(() => {
  nextTick(() => {
    realTimeAnimationFrame()
  })
})
</script>

<template>
  <!--  <div class="real-time-container">
    <div>{{ dateRef }}</div>
    <div>{{ timeAndWeekRef }}</div>
  </div> -->
  <div class="real-time-container">
    <div>{{ dateRef }} {{ timeAndWeekRef }}</div>
  </div>
</template>

<style lang="scss" scoped>
.real-time-container {
  display: flex;
  flex-direction: column;
  color: #fff;
  //font-size: 12px;
  //font-size: 14px;
  font-size: 1rem;
  text-align-last: justify;
}
</style>
