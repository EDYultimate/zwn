<script setup lang="ts">
import { Tabler3DCubeSphere } from '@vicons/tabler'
import { onMounted, onUnmounted, ref } from 'vue'

import ProModal from '@/components/common/ProModal/ProModal.vue'
import RealTime from '@/layout/components/RealTime.vue'
import { useDisplayMode } from '@/store/modules/displayMode'
// import mousetrap from 'mousetrap'
const goToAdminPage = () => {
  window.open('/section')
  // window.open(
  //   'http://10.3.34.202:9998/workbench?redirect=true&ticket=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.ZXlKNmFYQWlPaUpFUlVZaUxDSmhiR2NpT2lKa2FYSWlMQ0psYm1NaU9pSkJNVEk0UTBKRExVaFRNalUySWl3aVkzUjVJam9pU2xkVUlpd2lkSGx3SWpvaVNsZFVJbjAuLjYtV0p5SHpPMnRhckZkMk5wQklwWWcuWldNcUhjUGRoQ2JkbzJFLTMwdF9KT0pfcF9xbEo3WGtCemtlTHZoeVpNcUhQbTdJa001WVBxWGxreUtlZUU3UEhuVU94WHNZRGVGZnlkbXRBRHB2dTBuQlhYd2NadTRXLW8wY2VPUW9YZkl3aUxMdlZBai1RMUQzU0tuNVlWOW5icjNnVGx2dXdoYmZ1Q3k2bm5STk9JdVJPTkNYTkd3Qkp6N3h0bE5wWkVSQzA4S2UxTWpFUDUwVXVXOVBUV1RkZnRVSTQwYW5CbXMtbXctd1VZU3RESkdPUUQzellSSi10YmJFYlJhMGYwQWVBdk1OZFgwbXIxRkpDbVo4cVJJNHk0MExCb080U1pyWUtray1obnBkTEN2SDBzb1RTN09NVS03RDBiRm82MHVvVHd5VFF3WHZOUUZMc0FNVThYcm9KSkVUMnlRdUxkTFowdGFaWVlCSTI1Yzhya01lcEhRelE3VjhXWFJWczgzQnZmbVMyeGdmbTJscGFpUHVKa0FWSWQxZTlvb3ZzWm96VFZucUdyUkR1Z244ejdocUk1VWFrbEdfbWFqZTZ6RWU1OWE2b3JTZ291VWlyMEkyazF0N3NYN3ZaTTBpN1JDU1NBRW5PTkMxdVk3RGlWampuUTJneUdqRUJ1RHVnRHBaYVoyR3VGLVA3ckhOLXdQUTJyQUdNNmxodEVQUjRfZmtzTUlIdk1FY3RkN18yTXJSU3NQZ3VsYi1MazJQQVNQX1ljQ2VsUDJVX1RoQmxOUEpycE9LY1loMkpFaE9lcG4yZGdGRUk3V0hzbm1XbzZ3WnFsb0xnQmJ1TWdpSTVGVUpfMzhlV1U4bDJYaXlFQlh1Y2dBNmZrMGVrTG11WDgxZmQwU1ZnNXhaQVg3ZnpQVmJUSEp4VTFhZ3JLT3JPY3FFWl9JZzdXZlRRVlZPb3AwVTlINDNJajZMOWctYmZFNzdWZzVDUGpic2Z3MjBVUGZXUjlrTTlIcEI1dm9VcnlRRHREcHFfRTJZdHZzZkFMa0tvOXBHSjRmLXg0WEdjVmpWSVl4UW5tUXRVOFVodlF1S29QaGU4MGctOWNNV3E0Q0dqcEdWTXVnX0l0MW8yaThFaVZzWllFT0ZxMWFoNTR3dF82RDZ5MlhuYncudVNSdGdrb080SjNWNHJFd2x6TnJKdw.Z2AUO6sC6GD79tKC5E4-huyRGI6foSld50_dq-lKTcFkWallRldAi36bNVNLaXRLTYV0NZP1uwLm3u1YPbqbbA'
  // )
}
const dialogVisible = ref(false)
const { state } = useDisplayMode()
/* const keyHandlerBind = () => {
  mousetrap.bind(['ctrl+alt+s', 'command+option+s'], () => {
    dialogVisible.value = !dialogVisible.value
  })
  mousetrap.bind(['ctrl+alt+a', 'command+option+a'], (event) => {
    event.preventDefault()
    if (state.mode !== 'auto') {
      window.$message.info('自动模式', { showIcon: false })
      state.mode = 'auto'
    }
  })
  mousetrap.bind(['ctrl+alt+f', 'command+option+f'], () => {
    if (state.mode !== 'freedom') {
      window.$message.info('手动模式', { showIcon: false })
      state.mode = 'freedom'
    }
  })
  mousetrap.bind(['ctrl+alt+8', 'command+option+8'], () => {
    if (state.mode !== 'freedom' || state.scale < 2.6) {
      window.$message.info('8楼会商室手动模式', { showIcon: false })
      state.mode = 'freedom'
      state.scale = 2.6
    }
  })
} */
onMounted(() => {
  // document.addEventListener('keydown', handlerKeydown)
  // keyHandlerBind()
})
onUnmounted(() => {
  // mousetrap.reset()
  // document.removeEventListener('keydown', handlerKeydown)
})
</script>

<template>
  <div class="header-navbar">
    <div class="header-navbar-container">
      <div style="position: absolute; left: 20px">
        <RealTime v-if="false" />
      </div>
      <!--      <div class="logo-container"> -->
      <!--        <img -->
      <!--          src="@/assets/img/11.png" -->
      <!--          alt="logo" -->
      <!--        > -->
      <!--        <span>海委安全生产一张图</span> -->
      <!--      </div> -->
      <div v-if="true" style="position: absolute; right: 20px; display: flex; align-items: center">
        <div class="go-system" @click="goToAdminPage">
          <n-icon :size="18" :component="Tabler3DCubeSphere" /><span>进入现地管理平台</span>
        </div>
        <div v-if="false" class="setting" @click="dialogVisible = !dialogVisible" />
      </div>
    </div>
    <ProModal v-model:show="dialogVisible" title="设置" content-mode="scroll">
      <div style="font-weight: bolder; letter-spacing: 0.05em; padding-top: 20px">
        <n-grid x-gap="12" :cols="12">
          <n-gi :span="5">
            <n-radio-group v-model:value="state.mode" name="radiogroup">
              <n-space>
                <n-radio key="auto" value="auto"> 自适应模式 </n-radio>
                <n-radio key="freedom" value="freedom"> 会商模式 </n-radio>
              </n-space>
            </n-radio-group>
          </n-gi>
          <n-gi :span="6">
            <n-slider
              v-model:value="state.scale"
              :min="1"
              :tooltip="false"
              :max="2.8"
              :step="0.1"
              :marks="{ 1: '1倍', 2: '高分屏/宽屏', 2.6: '超宽最佳', 2.8: '' }"
              style="transform: translateY(-0.45em)"
            />
          </n-gi>
          <n-gi>
            <div :style="{ color: state.scale >= 2.6 ? '#073976' : '#333' }">
              {{ state.scale }}
            </div>
          </n-gi>
        </n-grid>
      </div>
    </ProModal>
  </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'FZZDHJT';
  // src: url('@/assets/font/FZZDHJT.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.header-navbar {
  width: 100%;
  height: 112px;
  // background: url('@/assets/img/09.png') no-repeat center center;
}
.header-navbar-container {
  position: relative;
  //width: 1920px;
  width: 100%;
  height: 68px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}
.logo-container {
  position: absolute;
  font-size: 32px;
  color: #fff;
  display: flex;
  align-items: center;
  letter-spacing: 0.15em;
  line-height: 68px;
  img {
    width: 54px;
    height: 54px;
  }
  span {
    padding: 0 10px;
    font-family: 'FZZDHJT', serif;
  }
}
.setting {
  pointer-events: all;
  width: 23px;
  height: 23px;
  // background: url('@/assets/img/05.png') no-repeat center center;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 15px;
  &:hover {
    transition: all 0.3s;
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.8);
  }
}
.go-system {
  pointer-events: all;
  background: #245db4;
  color: #fff;
  padding: 3px 9px;
  border-radius: 6px;
  letter-spacing: 0.02rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    padding-left: 6px;
    user-select: none;
  }
  &:hover {
    transition: all 0.3s;
    filter: brightness(1.2);
  }
  &:active {
    filter: brightness(0.8);
  }
}
</style>
