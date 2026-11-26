<template>
  <div class="app-container" :style="bgImgPath">
    <div style="">
      <mapTool
        v-if="showMapFlag"
        class="toolDiv"
        :style="'right: ' + mapToolPx + 'px'"
        :dont-show="dontShowList"
        :LCName="LCName"
      ></mapTool>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import c from '@/utils/common/c.js'
import secens from '@/views/waterEcoDiversion/ecoWater/hooks/secens.js'
import mapTool from '@/views/waterEcoDiversion/mapTool/index.vue'

const dontShowList = ref([])
const mapToolPx = ref(430)
const showMapFlag = ref(true)
const LCName = ref('')
const twoMenuActiveStyle = c.ref('0') // 选中页样式
const twoNavShow = c.ref(true)

const screenWideFlag = c.ref()
const { left_tabs_active, mode } = secens()
c.onMounted(() => {
  if (c.screen_width < c.wide_screen_width) {
    screenWideFlag.value = false
  } else {
    screenWideFlag.value = true
  }
  // initScreenAdapter();
})
const bgImgPath = c.ref()
function initScreenAdapter() {
  if (!screenWideFlag.value) {
    bgImgPath.value =
      "background-image: url('/static/img/waterEcoDiversion/waterSupervision/tmp_bg3_slfpjk.jpg');"
  } else {
    bgImgPath.value =
      "background-image: url('/static/img/waterEcoDiversion/waterSupervision/tmp_bg3_slfpjk_w.jpg');"
  }
}
// function setPage(v) {
//   switch (v) {
//     case '0':
//       twoMenuActiveStyle.value = '0';
//       if (!screenWideFlag.value) {
//         bgImgPath.value = "background-image: url('/static/img/waterEcoDiversion/waterSupervision/tmp_bg3_zygkh.jpg');"
//       } else {
//         bgImgPath.value = "background-image: url('/static/img/waterEcoDiversion/waterSupervision/tmp_bg3_zygkh_w.jpg');"
//       }
//       break;
//     case '3':
//       twoMenuActiveStyle.value = '3';
//       if (!screenWideFlag.value) {
//         bgImgPath.value = "background-image: url('/static/img/waterEcoDiversion/waterSupervision/tmp_bg3_slfpjk.jpg');"
//       } else {
//         bgImgPath.value = "background-image: url('/static/img/waterEcoDiversion/waterSupervision/tmp_bg3_slfpjk_w.jpg');"
//       }
//       break;
//   }
// }

function toPic_tmp() {
  // let pic_lyswh2 = router.resolve({
  //     path: '/pic_lyswh_tmp1'
  // });
  // window.open(pic_lyswh2.href, '_blank');

  router.push('/pic_lyswh_tmp1')
}

const bottomDivLeft = c.computed(() => {
  return { left: (c.screen_width - 500) / 2 + 'px' }
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
.toolDiv {
  width: 50px;
  height: 400px;
  position: absolute;
  margin-top: 170px;
  right: 40px;
}
</style>
