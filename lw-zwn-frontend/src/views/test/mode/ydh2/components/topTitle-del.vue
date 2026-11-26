<template>
  <div>
    <div
      style="
        z-index: 5;
        width: 693px;
        height: 244px;
        position: absolute;
        top: 7px;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/leftTop_long.png);
      "
      @click="toHome"
    ></div>
    <div class="left_top_1_i"></div>

    <div
      style="
        z-index: 6;
        width: 325px;
        height: 85px;
        position: absolute;
        top: 15px;
        left: 15px;
        cursor: pointer;
      "
      @click="toHome"
    ></div>

    <div class="logoPartLineDiv" style="width: calc(100% - 1832px)">
      <div class="logoPartLineAnimateDiv" style="width: calc(100% + 70px)"></div>
      <div class="logoPartLineTail" style="width: calc(100% + 75px)"></div>
    </div>

    <div
      style="
        z-index: 5;
        position: absolute;
        left: 40px;
        bottom: 0px;
        height: 174px;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/leftBottomLaShen.png);
        width: calc(50% - 520px);
        background-size: 100% 100%;
      "
    ></div>
    <div
      style="
        z-index: 5;
        position: absolute;
        right: 40px;
        bottom: 0px;
        height: 226px;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/rightBottomLaShen.png);
        width: calc(50% - 520px);
        background-size: 100% 100%;
      "
    ></div>
    <div
      style="
        z-index: 5;
        position: absolute;
        left: 359px;
        top: 44px;
        width: 252px;
        height: 37px;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/title1.png);
      "
    ></div>

    <div class="optionalDiv">
      <div
        v-for="(te, index) in arTemp"
        :key="index"
        :class="[
          'option',
          te.showDiv == true || te.isActived == true ? 'menuActiveStyle' : 'menuStyle'
        ]"
        @mouseenter="te.showDiv = true"
        @mouseleave="te.showDiv = false"
        @click="hitOneMenuSon(te.th, index)"
      >
        <span class="keyNavigation1">{{ te.text }}</span>
        <div
          v-if="te.showDiv"
          class="optionChild"
          :style="'height: ' + (te.sonList ? te.sonList.length : 0) * 40 + 'px'"
        >
          <div
            v-for="(sl, index) in te.sonList"
            :key="index"
            style="width: 120px; height: 30px; padding-top: 7px"
          >
            <div
              style="
                cursor: pointer;
                line-height: 30px;
                margin-left: 7px;
                background-color: #163162;
                border-color: #10a77c;
                border-radius: 15px;
                width: 106px;
                height: 30px;
                color: #fff;
                text-align: center;
              "
              :style="getFontSize(sl.nm)"
              @click="hitOneMenuSon2(te.th, sl.th, sl.nm)"
            >
              {{ sl.nm }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        z-index: 5;
        width: 24px;
        height: 11px;
        position: absolute;
        right: 225px;
        top: 45px;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/littelDotRight.png);
      "
    ></div>
    <div
      style="
        z-index: 5;
        width: 1132px;
        height: 567px;
        position: absolute;
        right: 0;
        top: 0;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/rightTop.png);
      "
    ></div>
    <div
      style="
        z-index: 5;
        width: 40px;
        height: 408px;
        position: absolute;
        left: 0;
        bottom: 0;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/leftBottom.png);
      "
    ></div>
    <div
      style="
        z-index: 5;
        width: 40px;
        height: 460px;
        position: absolute;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/rightBottom.png);
      "
    ></div>
    <div
      style="
        z-index: 5;
        width: 964px;
        height: 65px;
        position: absolute;
        left: calc(50% - 482px);
        bottom: 0;
        pointer-events: none;
        background-image: url(/static/img/waterEcoDeploy/topTitle/centerBottom.png);
      "
    ></div>
    <div
      style="
        z-index: 5;
        width: 200px;
        position: absolute;
        left: calc(50% - 100px);
        bottom: 23px;
        pointer-events: none;
        text-align: center;
      "
      class="keyNavigation2"
    >
      {{ bottomFont }}
    </div>
  </div>
</template>

<script setup>
import c from '@/utils/common/c.js'
import { defineProps } from 'vue'
import store from '@/store/index.js'
import router from '@/router'
import { defineEmits } from 'vue'
import '@/assets/text/text.css'
import env from '@/setting.js'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['goParent', 'goParent2'])
const props = defineProps({
  screenWidth: {
    type: Number,
    required: true
  }
})

function toHome() {
  window.location.href = env.requestUrl_portal_skip
}

const activeOptin = ref('1')
const bottomFont = ref('监测感知')

const tabs = [
  {
    title: '感知',
    type: '0'
  },
  {
    title: '预报',
    type: '0'
    // title: "预报", type: "1", children: [
    //     { title: "降雨", path: "/home/yb" },
    //     { title: "预报洪水", path: "/home/ybhs" },
    // ]
  },
  {
    title: '预警',
    type: '1',
    children: [
      { title: '预警监视', path: '/home/yj' },
      { title: '预警发布', path: '/home/yjfb' }
    ]
  },
  {
    title: '预演',
    type: '1',
    children: [
      { title: '预报调度预演', path: '/home/yy' },
      { title: '历史洪水复盘', path: '/home/lshsfp' },
      { title: '预演方案对比', path: '/home/yydb' }
    ]
  },
  {
    title: '预案',
    type: '1',
    children: [
      { title: '预演方案', path: '/home/ya/yyfa' },
      { title: '应急响应', path: '/home/ya/yjxy' },
      { title: '明传电报', path: '/home/ya/mcdb' },
      { title: '防汛组织', path: '/home/ya/fxzz' },
      { title: '文档资料', path: '/home/ya/wdzl' }
    ]
  },
  {
    title: '会商',
    type: '1',
    children: [
      { title: '会商辅助', path: '/home/hs/hsfz' },
      { title: '会商管理', path: '/home/hs/hsgl' }
    ]
  }
]

const arTemp = c.ref([
  {
    th: '1',
    text: '监测感知',
    showDiv: true,
    isActived: true,
    sonList: [
      //   { th: "1", nm: "年度调度", url: "123" },
      //   { th: "0", nm: "实时调度", url: "123" },
      //   // ,{'th':'3','nm':'调度监管','url':'123'}
      //   { th: "2", nm: "效果评估", url: "123" },
    ]
  },
  {
    th: '2',
    text: '水量调度',
    showDiv: false,
    isActived: false
    // 'sonList':[{'th':'0','nm':'取用水监管','url':'123'},{'th':'1','nm':'证照管理','url':'123'},{'th':'2','nm':'用水统计','url':'123'}]
  },
  {
    th: '3',
    text: '考核评估',
    showDiv: false,
    isActived: false
    // sonList: [
    //   { th: "0", nm: "最严格制度考核", url: "123" },
    //   { th: "1", nm: "刚性约束监管", url: "123" },
    //   // ,{'th':'2','nm':'用水总量控制','url':'123'}
    //   { th: "3", nm: "分水方案监管", url: "123" },
    // ],
  },
  {
    th: '4',
    text: '监督管理',
    showDiv: false,
    isActived: false
    // sonList: [
    //   { th: "0", nm: "生态流量监管", url: "123" },
    //   { th: "1", nm: "饮用水源地保护", url: "123" },
    //   // {'th':'2','nm':'国控断面管理','url':'123'},
    //   { th: "3", nm: "地表水水质动态", url: "123" },
    // ],
  }
])

// console.log(".store.state.w ", store.state.w);
// console.log(".m_w ", m_w());
// console.log(".changedWidth ", store.state.w - 182 - m_w());
// console.log(".screenWidth--window.innerWidth ", props.screenWidth);

function m_w() {
  let w = store.state.w - 1920
  if (w > 100) {
    w = 100
  }
  return w
}

const changedWidthBottom = c.ref(
  'width: calc(' +
    props.screenWidth / 2 +
    'px - 482px - 40px);background-size: calc(' +
    props.screenWidth / 2 +
    'px - 482px - 40px)  100%'
)
const oneMenuActiveStyle = c.ref('4') // 选中页样式
const oneMenuActiveStyleLog = c.ref('4') // 选中页样式-记录
function oneEnter(val) {
  // 一级菜单-鼠标移入
  oneMenuActiveStyleLog.value = oneMenuActiveStyle
  oneMenuActiveStyle.value = val

  switch (val) {
    case '4':
      document.getElementById('sslgl_div').style.display = 'inline-block'
  }
}

function oneLeave(val) {
  // 一级菜单-鼠标移出
  oneMenuActiveStyle.value = oneMenuActiveStyleLog
  switch (val) {
    case '4':
      document.getElementById('sslgl_div').style.display = 'none'
  }
}

function getFontSize(val) {
  return val.length > 5 ? 'font-size: 14px' : 'font-size: 16px'
}

function getColorFunc(val1, val2) {
  return val1 || val2 ? '#04355c' : '#176097'
}

selectMenuCss() //设置菜单选中
//设置选中的菜单样式
function selectMenuCss() {
  const rp = router.currentRoute.value.path
  let val = 1

  if (rp === '/waterEcoDeploy/jcgz') {
    val = 1
  } else if (rp === '/waterEcoDeploy/sldd') {
    val = 2
  } else if (rp === '/waterEcoDeploy/khpg') {
    val = 3
  } else if (rp === '/waterEcoDeploy/jdgl') {
    val = 4
  }
  hitOneMenuSon(val, val - 1)
}

function hitOneMenuSon(val, index) {
  arTemp.value.forEach((e, i) =>
    i == index
      ? ((e.isActived = true), (e.showDiv = true), (bottomFont.value = e.text))
      : ((e.isActived = false), (e.showDiv = false))
  )

  switchMenu(index + 1)
}

function switchMenu(val) {
  if (val === 1) {
    router.replace('/waterEcoDeploy/jcgz')
  } else if (val === 2) {
    router.replace('/waterEcoDeploy/sldd')
  } else if (val === 3) {
    router.replace('/waterEcoDeploy/khpg')
  } else if (val === 4) {
    router.replace('/waterEcoDeploy/jdgl')
  }
}

function hitOneMenuSon2(index, val, nm) {
  // arTemp._rawValue.forEach((e, i) =>
  //   i == index - 1 ? (e.isActived = true) : (e.isActived = false)
  // );
  // bottomFont.value = nm;
  // emit("goParent2", { fstMenu: index, secMenu: val, secMenuNm: nm });
}
</script>

<style lang="scss" scoped>
.left_top_1_i {
  width: 227px;
  height: 37px;
  background: url('/static/img/waterEcoDeploy/topTitle/left_top_1_i.png');
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 83px;
  animation: anim_left_top_1_i 10s infinite;
  z-index: 999;
}

@keyframes anim_left_top_1_i {
  0% {
    left: 0;
    opacity: 1;
  }
  100% {
    left: 365px;
    opacity: 0.4;
  }
}

.logoPartLineDiv {
  z-index: 5;
  position: absolute;
  left: 693px;
  top: 45px;
  height: 9px;
  pointer-events: none;
  background-image: url('/static/img/waterEcoDeploy/topTitle/lashen_line.png');
  background-position: right -20px center;
}
.logoPartLineAnimateDiv {
  margin-top: -5px;
  z-index: 5;
  position: absolute;
  height: 9px;
  background-image: url('/static/img/waterEcoDeploy/topTitle/laShen.png');
  background-repeat: no-repeat;
  background-position: right;
}
.logoPartLineTail {
  margin-top: -2px;
  z-index: 5;
  position: absolute;
  height: 20px;
  // right: 0;
  background-image: url('/static/img/waterEcoDeploy/topTitle/laShen_tail.png');
  background-repeat: no-repeat;
  background-position: right;
}

.optionalDiv {
  position: absolute;
  z-index: 5;
  right: 270px;
  top: 36px;
  color: rgb(255, 255, 255);
  display: flex;
  width: 780px;
  justify-content: space-between;
  align-items: center;

  .option {
    padding: 3px;
    width: 21.5%;
    cursor: pointer;
    text-align: center;
  }

  .optionChild {
    box-shadow: 0 0 20px 2px #176097;
    background-color: rgba(1, 17, 44, 0.9);
    // width: 120px;
    height: 170px;
    cursor: pointer;
    margin-top: 0;
    border-radius: 5px;
  }

  .menuStyle {
    background: #04355c;
    border: 1px solid #14598e;
  }

  .menuActiveStyle {
    box-shadow: rgb(23, 96, 151) 0px 0px 5px 2px;
    background: #010f29;
    border: 1px solid #14598e;
  }

  .fengexian {
    border-top: 2px solid #14598e;
    height: 0;
    opacity: 0.7;
    width: 50px;
  }
}
</style>
