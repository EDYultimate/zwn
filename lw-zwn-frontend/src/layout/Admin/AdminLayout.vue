<script setup lang="ts">
// import AiAssistant from '@/components/AiAssistant/AiAssistant.vue'
import HeaderNavbar from '@/layout/Admin/HeaderNavbar/HeaderNavbar.vue'
import MenuCrumb from '@/components/business/MenuCrumb.vue'

import AdminBottomLayout from './AdminBottomLayout.vue'
</script>

<template>
  <n-layout class="system-background">
    <!--    <img src="@/assets/img/layout/logo/title_logo_fill.png" class="header-logo-fill" alt="" />-->
    <img src="@/assets/img/layout/logo/title_logo.png" class="header-logo" alt="" />
    <img src="@/assets/img/layout/logo/title_context.png" class="header-context" alt="" />
    <!-- 底部条纹装饰：左图 + 中间渐变拉伸 + 右图镜像（仿 layout-sample footer 三段式结构） -->
    <div class="bottom-footer">
      <div class="footer-left"></div>
      <div class="footer-center"></div>
      <div class="footer-right"></div>
    </div>
    <!--    <img src="@/assets/img/layout/logo/title_logo2.png" class="header-logo" alt="" />-->
    <HeaderNavbar />
    <!--    <n-modal-provider> -->
    <!--      <router-view /> -->
    <!--    </n-modal-provider> -->
    <AdminBottomLayout />
    <!--    <AiAssistant /> -->
    <!--    <n-modal-provider>
      <router-view />
    </n-modal-provider> -->
  </n-layout>
</template>

<style scoped>
.system-background {
  width: 100%;
  height: 100%;
  background-color: #0e2662;
}

.header-logo {
  position: fixed;
  left: 0px;
  top: -2px;
  z-index: 1;
  pointer-events: none;
}

.header-context {
  position: fixed;
  left: 70px;
  top: 18px;
  z-index: 1;
  pointer-events: none;
}

/* 底部三段式条纹：左右为科技线条图，中间 1px 渐变横向平铺拉伸（仿 layout-sample .fhsy .bottom .footer） */
.bottom-footer {
  position: fixed;
  left: 0;
  bottom: 1px;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 31px;
  pointer-events: none;
}
.footer-left,
.footer-right {
  width: 825px;
  background: url('@/assets/img/layout/logo/bottom_side.png') no-repeat;
  background-size: 100% 100%;
}
.footer-center {
  flex: 1;
  min-width: 0;
  background: url('@/assets/img/layout/logo/bottom_center.png') repeat-x;
  background-size: 100% 100%;
}
.footer-right {
  transform: rotateY(180deg);
}

.header-logo-fill {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
  display: none;
}

@media (min-width: 1921px) {
  .header-logo-fill {
    display: block;
    width: calc(100% - 1920px);
    height: 171px;
  }
}
</style>
