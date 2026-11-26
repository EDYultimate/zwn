<template>
  <div class="app-container">
    <div class="pageItemDiv">
      <page3 v-if="c.ecoPageActive === '3'" @change-date="reciveSonData($event)"></page3>
      <page1 v-if="c.ecoPageActive === '1'" @change-date="reciveSonData($event)"></page1>
      <page2 v-if="c.ecoPageActive === '2'" @change-date="reciveSonData($event)"></page2>
      <page0 v-if="c.ecoPageActive === '0'" @change-date="reciveSonData($event)"></page0>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import c from '@/utils/common/c.js'
import page3 from './shuiLiangFenPei'
import page1 from './page1'
import page2 from './page2'
import page0 from './page0'
import secens from '@/views/waterEcoDiversion/ecoWater/hooks/secens.js'

const { left_tabs_active, mode } = secens()
const gisevent = c.ref()
function handleMessageGis(event) {
  if (event.data.type === 'shuiziyuanjianguan') {
    gisevent.value = event
  }
}
const dataListgis = c.ref()
function reciveSonData(list) {
  //接收子页面传来的数据，给地图
  debugger
  dataListgis.value = list
  // this.$nextTick(() => {
  //     this.setGisData(this.gisevent);
  // });
  setTimeout(() => {
    setGisData(gisevent.value)
  }, 500)
}
function setGisData(event) {
  mode.value = '2d'
  left_tabs_active.value = '17'
  switch (c.ecoPageActive) {
    case '0':
      event.source.change('zuiyanzhidu', dataListgis.value)
      break
    case '1':
      event.source.change('gangxingyueshu', dataListgis.value)
      break
    case '2':
      event.source.change('yongshuizongliang', dataListgis.value)
      break
    case '3':
      event.source.change('shuijianguan', dataListgis.value)
      break
  }
}

const screenWideFlag = c.ref()
c.onMounted(() => {
  if (c.screen_width < c.wide_screen_width) {
    screenWideFlag.value = false
  } else {
    screenWideFlag.value = true
  }
  window.addEventListener('message', handleMessageGis) //注册消息监听，用于GIS向页面传递值
  setTimeout(() => {
    mode.value = '2d'
    left_tabs_active.value = 17
  }, 1000)
})
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  width: 100%;
  z-index: 1;
  //height: 100vh;
  /*background-image: url("/static/img/waterEcoDiversion/waterSupervision/tmp_bg3.jpg");*/
  /*background-image: url("/static/img/waterCulture/water_calture_bg_cover.png"),url("/static/img/waterCulture/water_calture_bg.png");*/
  /*background-position: -10px 0px, 0px 0px;*/
  background-size: 100% 100%;
}

.bottomDiv {
  height: 60px;
  width: 500px;
  position: fixed;
  bottom: 65px;
  /* background-color: red; */
  display: inline-flex;
}

.twoMenuStyle {
  height: 58px;
  width: 125px;
  font-size: 16px;
  color: #ffffff;
  font-family: MicrosoftYaHei;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
}

.twoActive {
  background-image: url('/static/img/waterEcoDiversion/ecoWater/page0/two_nav_bg_selected.png');
}

.twoUnActive {
  background-image: url('/static/img/waterEcoDiversion/ecoWater/page0/two_nav_bg_normal.png');
}
</style>
