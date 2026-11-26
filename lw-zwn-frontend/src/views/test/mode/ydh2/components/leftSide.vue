<template>
  <div class="leftSideContainer">
    <!-- 左侧边框 -->
    <div
      class="buttonSide"
      :style="
        'background-image: url(' +
        leftButtonPic +
        ');' +
        'top:' +
        ((g.system_h() - 560) / 2 - 30 + 'px')
      "
      @mouseenter="changeButton('left1')"
      @mouseleave="changeButton('left0')"
      @click="
        changeButton('left1')
        switchSideDiv()
      "
    ></div>
    <div id="leftDivId" class="leftDiv animate__animated">
      <!--      <div class="m_container_border_mark_2 m_container_border_mark"></div>-->
      <slot></slot>
      <!--      <div class="m_container_border_mark_5 m_container_border_mark"></div>-->
    </div>
  </div>
</template>
<script setup>
// import store from "@/store/index.js";
// import intellect from "@/views/knowledge/components/intellect/index.vue";
// import { ElMessage } from "element-plus";
// import divline from "@/components/divline";
import g from '@/utils/common/g.js'

const { proxy } = getCurrentInstance()

const leftButton = ref(false)
const rightButton = ref(false)

proxy.$nextTick(() => {
  switchSideDiv()
})

const leftButtonPic = ref('static/img/waterEcoDeploy/topTitleNew/side_left_n.png')
const rightButtonPic = ref('static/img/waterEcoDeploy/topTitleNew/side_right_n.png')

function changeButton(name) {
  if (name === 'left1') {
    if (!leftButton.value) {
      leftButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_right_c.png'
    } else {
      leftButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_left_c.png'
    }
  } else if (name === 'left0') {
    if (!leftButton.value) {
      leftButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_right_n.png'
    } else {
      leftButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_left_n.png'
    }
  } else if (name === 'right1') {
    if (!rightButton.value) {
      rightButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_left_c.png'
    } else {
      rightButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_right_c.png'
    }
  } else if (name === 'right0') {
    if (!rightButton.value) {
      rightButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_left_n.png'
    } else {
      rightButtonPic.value = 'static/img/waterEcoDeploy/topTitleNew/side_right_n.png'
    }
  }
}

function switchSideDiv() {
  fadeAnimate('leftDivId', leftButton.value, 'left')
}

function fadeAnimate(divId, buttonState, direction) {
  if (direction == 'left') {
    if (buttonState) {
      document.getElementById(divId).classList.remove('animate__fadeInLeft')
      document.getElementById(divId).classList.add('animate__fadeOutLeft')
    } else {
      document.getElementById(divId).classList.remove('animate__fadeOutLeft')
      document.getElementById(divId).classList.add('animate__fadeInLeft')
    }
  } else if (direction == 'right') {
    if (buttonState) {
      document.getElementById(divId).classList.remove('animate__fadeInRight')
      document.getElementById(divId).classList.add('animate__fadeOutRight')
    } else {
      document.getElementById(divId).classList.remove('animate__fadeOutRight')
      document.getElementById(divId).classList.add('animate__fadeInRight')
    }
  }

  leftButton.value = !leftButton.value
}
</script>
<style lang="scss" scoped>
.leftSideContainer {
  .buttonSide {
    position: fixed;
    z-index: 2;
    top: 100px;
    width: 33px;
    left: 0;
    cursor: pointer;
    height: 560px;
    background-size: 100% 100%;
  }
  .leftDiv {
    position: absolute;
    left: 35px;

    overflow: hidden;
    &:hover {
      overflow-x: hidden;
      overflow-y: scroll;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #90939950 !important;
    }
  }
  .rightDiv {
    position: absolute;
    right: 0;
    overflow: hidden;
    &:hover {
      overflow-x: hidden;
      overflow-y: auto;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #90939950 !important;
    }
  }

  .m_container_border_mark {
    background-color: #00c0ff;
    width: 10px;
    height: 2px;
    position: absolute;
    left: calc((100% - 100px) / 2);
  }
  .m_container_border_mark_2 {
    top: 0px;
    animation: anim_m_container_border_mark_2 3s infinite;
  }

  .m_container_border_mark_5 {
    bottom: 0px;
    animation: anim_m_container_border_mark_2 3s infinite;
  }

  @keyframes anim_m_container_border_mark_2 {
    0% {
      width: 10px;
      left: calc((100% - 20px) / 2);
      opacity: 1;
      filter: blur(0);
    }
    100% {
      width: 100%;
      left: 0;
      opacity: 1;
      filter: blur(1px);
    }
  }

  .animate__fadeInLeft {
    -webkit-animation-name: fadeInLeft;
    animation-name: fadeInLeft;
  }
  .animate__fadeOutLeft {
    -webkit-animation-name: fadeOutLeft;
    animation-name: fadeOutLeft;
  }
  .animate__animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-duration: var(--animate-duration);
    animation-duration: var(--animate-duration);
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  @keyframes fadeInLeft {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }

    100% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translateZ(0);
    }
  }
  @keyframes fadeOutLeft {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
  }
}
</style>
