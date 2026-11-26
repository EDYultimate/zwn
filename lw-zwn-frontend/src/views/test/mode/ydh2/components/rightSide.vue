<template>
  <div class="rightSideContainer">
    <mapTool
      v-if="props.mapToolShow"
      id="mapDivId"
      class="toolDiv"
      :dont-show="myDontShow"
      :LCName="props.LCName"
      :new-search-list="props.newSearchList"
      :search-type="props.searchType"
    ></mapTool>
    <div id="rightDivId" class="rightDiv animate__animated">
      <slot></slot>
    </div>
    <!-- 右侧边框 -->
    <div
      class="buttonSide"
      :style="
        'background-image: url(' +
        rightButtonPic +
        ');' +
        'top:' +
        ((g.system_h() - 560) / 2 - 30 + 'px')
      "
      @mouseenter="changeButton('right1')"
      @mouseleave="changeButton('right0')"
      @click="
        changeButton('right1')
        switchSideDiv()
      "
    ></div>
  </div>
</template>
<script setup>
// import store from "@/store/index.js";
// import intellect from "@/views/knowledge/components/intellect/index.vue";
// import { ElMessage } from "element-plus";
// import divline from "@/components/divline";
import g from '@/utils/common/g.js'

import mapTool from '@/views/waterEcoDeploy/layout/mapTool/index.vue'

const { proxy } = getCurrentInstance()

const leftButton = ref(false)
const rightButton = ref(false)

const myDontShow = ref(props.dontShow)

const props = defineProps({
  mapToolShow: {
    type: Boolean,
    required: true
  },
  dontShow: {
    type: Object,
    required: false
  },
  LCName: {
    type: String,
    required: false
  },
  newSearchList: {
    type: Object,
    required: false
  },
  searchType: {
    type: String,
    required: false
  }
})

onMounted(() => {
  proxy.$nextTick(() => {
    switchSideDiv()

    tietie()
  })
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
  fadeAnimate('rightDivId', rightButton.value)
}

const chaPx = 50
function fadeAnimate(divId, buttonState) {
  // let elementContentWidth = document.getElementById(divId).offsetWidth;

  if (buttonState) {
    document.getElementById(divId).classList.remove('animate__fadeInRight')
    document.getElementById(divId).classList.add('animate__fadeOutRight')

    // if (document.getElementById("mapDivId")) {
    //   document.getElementById("mapDivId").style.right = chaPx + "px";
    // }
  } else {
    document.getElementById(divId).classList.remove('animate__fadeOutRight')
    document.getElementById(divId).classList.add('animate__fadeInRight')

    // if (document.getElementById("mapDivId")) {
    //   document.getElementById("mapDivId").style.right =
    //     elementContentWidth + chaPx + "px";
    // }
  }

  rightButton.value = !rightButton.value
}

//定时器
let mapToolInter

watch(
  () => props.mapToolShow,
  (d) => {
    if (d) {
      tietie()
    } else {
      clearInterval(mapToolInter)
    }
  },
  { deep: true }
)
watch(
  () => props.dontShow,
  (d) => {
    myDontShow.value = d
  },
  { deep: true }
)

watch(
  () => g.get_obj('modetp'),
  (d) => {
    if (d === '3d') {
      if ('/waterEcoDeploy/jcgz' === g.activePath.path) {
        if (rightButton.value) {
          switchSideDiv()
        }
      }
    }
  },
  { deep: true, immediate: true }
)

//让地图图层紧贴控制图层
function tietie() {
  if (!props.mapToolShow) {
    return
  }

  mapToolInter = setInterval(() => {
    const buttonState = rightButton.value
    const elementContentWidth = document.getElementById('rightDivId').offsetWidth
    if (buttonState) {
      if (document.getElementById('mapDivId')) {
        document.getElementById('mapDivId').style.right = elementContentWidth + chaPx + 'px'
      }
    } else if (document.getElementById('mapDivId')) {
      document.getElementById('mapDivId').style.right = chaPx + 'px'
    }
    // console.log("aaa");
  }, 100)
}

//刷新地图工具栏的位置
function refreDistance() {
  // if (rightButton.value) {
  //   document.getElementById("rightDivId").classList.remove("animate__animated");
  //   document.getElementById("rightDivId").classList.add("animateStop");
  //   if (document.getElementById("mapDivId")) {
  //     document.getElementById("mapDivId").style.transition = "right 0s ease 0s";
  //   }
  //
  //   fadeAnimate("rightDivId", rightButton.value);
  //
  //   proxy.$nextTick(() => {
  //     setTimeout(() => {
  //       document
  //         .getElementById("rightDivId")
  //         .classList.add("animate__animated");
  //       if (document.getElementById("mapDivId")) {
  //         document.getElementById("mapDivId").style.transition =
  //           "right 1s ease 0s";
  //       }
  //       fadeAnimate("rightDivId", rightButton.value);
  //     }, 130);
  //   });
  // }
}

//关闭页面时销毁
onBeforeUnmount(() => {
  //销毁循环任务
  clearInterval(mapToolInter)
})

defineExpose({
  refreDistance
})
</script>
<style lang="scss" scoped>
.rightSideContainer {
  position: absolute;
  right: 0;

  .buttonSide {
    position: fixed;
    z-index: 2;
    top: 0;
    width: 33px;
    right: 0px;
    cursor: pointer;
    height: 560px;
    background-size: 100% 100%;
  }

  .rightDiv {
    position: absolute;
    right: 35px;
  }

  // .animate__fadeInRight {
  //   -webkit-animation-name: fadeInRight;
  //   animation-name: fadeInRight;
  // }
  // .animate__fadeOutRight {
  //   -webkit-animation-name: fadeOutRight;
  //   animation-name: fadeOutRight;
  // }
  // .animate__fadeMapInRight {
  //   -webkit-animation-name: fadeMapInRight;
  //   animation-name: fadeMapInRight;
  // }
  // .animate__fadeMapInOutRight {
  //   -webkit-animation-name: fadeOutRight;
  //   animation-name: fadeOutRight;
  // }
  // .animate__animated {
  //   -webkit-animation-duration: 1s;
  //   animation-duration: 1s;
  //   -webkit-animation-duration: var(--animate-duration);
  //   animation-duration: var(--animate-duration);
  //   -webkit-animation-fill-mode: both;
  //   animation-fill-mode: both;

  //   animation-timing-function: ease;
  // }

  // @keyframes fadeInRight {
  //   0% {
  //     opacity: 0;
  //     -webkit-transform: translate3d(100%, 0, 0);
  //     transform: translate3d(100%, 0, 0);
  //   }
  //   100% {
  //     opacity: 1;
  //     -webkit-transform: translate3d(0, 0, 0);
  //     transform: translateZ(0);
  //   }
  // }
  // @keyframes fadeOutRight {
  //   0% {
  //     opacity: 1;
  //   }

  //   100% {
  //     opacity: 0;
  //     -webkit-transform: translate3d(100%, 0, 0);
  //     transform: translate3d(100%, 0, 0);
  //   }
  // }

  .toolDiv {
    // width: 50px;
    // height: 400px;
    position: absolute;
    // margin-top: 70px;
    right: 50px;

    transition: right 1s ease 0s;
  }

  .animateStop {
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
}
</style>
