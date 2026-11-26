<script setup lang="ts">
import FooterBar from '@/layout/BigScreen/FooterBar/FooterBar.vue'
import HeaderNavbar from '@/layout/BigScreen/HeaderNavbar/HeaderNavbar.vue'
import MainArea from '@/layout/BigScreen/Main/MainArea.vue'
</script>

<template>
  <div style="width: 100%; height: 100%; position: relative" class="default-slot">
    <div style="width: 100%; height: 100%; position: absolute; z-index: 3; pointer-events: none">
      <HeaderNavbar />
      <MainArea />
      <FooterBar />
    </div>
    <div class="shadow-container" />
    <!--    <div style="position: absolute; width: 100%; height: 100%; z-index: 1"> -->
    <!--      <TwoBitGisMapComponent /> -->
    <!--    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.default-slot {
  height: 100%;
  // 下面这种写法是为了保证在不同分辨率下，内容区域的宽度保持合适的尺寸
  // 如果设置100%,非全屏模式下两边边栏很贴左右屏幕边缘, 边栏顶宽情况下,会和中间区域有很大空隙,不美观
  width: 98%;
  position: relative;
  min-width: 1920px;
  //max-width: 2048px;
}
.shadow-container {
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 1080px;
  // background: url('@/assets/img/08.png') no-repeat center center;
  background-size: 100% 100%;
  z-index: 2;
  user-select: none;
}
</style>
