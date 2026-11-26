<template>
  <div style="">
    <div style="position: fixed; top: 120px; right: 480px; z-index: 99999">
      <intellect></intellect>
    </div>
    <div id="leftDivId" class="out_div_parent_left animate__animated" :style="sideBarHeight">
      <div class="m_container_border_mark_2 m_container_border_mark"></div>
      <div class="sideBar" :style="sideBarHeightLeft" style="width: 440px">
        <div style="width: 440px; height: 265px; border-radius: 10px; position: relative">
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
          <div style="height: 55px; position: relative">
            <div
              style="
                position: absolute;
                border: none;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                height: 55px;
                width: 170px;
                top: 0;
                background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
                background-size: 100% 100%;
              "
            >
              <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 120px"
                >水资源量</span
              >
            </div>
            <el-date-picker
              v-model="wtYear"
              size="small"
              type="year"
              placeholder="选择年份"
              value-format="YYYY"
              style="float: right; width: 90px; margin-top: 12px; margin-right: 10px"
              @change="changeYear"
            >
            </el-date-picker>
          </div>
          <div
            style="
              margin-top: 10px;
              height: 200px;
              width: 440px;
              background: linear-gradient(
                to top,
                rgba(1, 15, 41, 0.9),
                rgba(1, 15, 41, 0.7),
                rgba(1, 15, 41, 0.5),
                rgba(1, 15, 41, 0)
              ) !important;
            "
          >
            <div style="height: 100px; width: 440px">
              <div
                style="
                  position: relative;
                  float: left;
                  margin-left: 10px;
                  margin-top: 15px;
                  width: 205px;
                  height: 79px;
                  background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png);
                "
              >
                <div
                  style="
                    width: 67px;
                    height: 72px;
                    position: absolute;
                    left: 10px;
                    top: 5px;
                    background-image: url(/static/img/waterEcoDiversion/waterSupervision/地表水资源量.png);
                  "
                ></div>
                <div style="width: 150px; height: 52px; position: absolute; left: 90px; top: 15px">
                  <span class="bigNumber">{{ diBiaoSum }}</span
                  ><span class="smallFont2">亿m³</span><br />
                  <span class="smallFont2">地表水资源量</span>
                </div>
              </div>
              <div
                style="
                  position: relative;
                  float: left;
                  margin-left: 10px;
                  margin-top: 15px;
                  width: 205px;
                  height: 79px;
                  background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png);
                "
              >
                <div
                  style="
                    width: 67px;
                    height: 72px;
                    position: absolute;
                    left: 10px;
                    top: 5px;
                    background-image: url(/static/img/waterEcoDiversion/waterSupervision/地下水资源量.png);
                  "
                ></div>
                <div style="width: 150px; height: 52px; position: absolute; left: 90px; top: 15px">
                  <span class="bigNumber">{{ diXiaSum }}</span
                  ><span class="smallFont2">亿m³</span><br />
                  <span class="smallFont2">地下水资源量</span>
                </div>
              </div>
            </div>

            <div
              style="
                position: relative;
                float: left;
                margin-left: 10px;
                margin-top: 5px;
                width: 205px;
                height: 79px;
                background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png);
              "
            >
              <div
                style="
                  width: 67px;
                  height: 72px;
                  position: absolute;
                  left: 10px;
                  top: 5px;
                  background-image: url(/static/img/waterEcoDiversion/waterSupervision/降雨量.png);
                "
              ></div>
              <div style="width: 150px; height: 60px; position: absolute; left: 90px; top: 7px">
                <span class="bigNumber">{{ jiangShuiSum }}</span
                ><span class="smallFont2">mm</span><br />
                <span class="smallFont2">降雨量</span><br />
                <span class="smallFont2">比去年</span
                ><span class="smallFont">{{ (jiangShuiDB > 0 ? '+' : '') + jiangShuiDB }}%</span>
              </div>
            </div>
            <!--          <div style="position: relative;float: left;margin-left: 10px;margin-top: 15px;width: 205px;height: 79px;background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png)">-->
            <!--            <div style="width: 67px;height: 72px;position: absolute;left: 10px;top: 5px;background-image: url(/static/img/waterEcoDiversion/waterSupervision/蓄变量.png)"></div>-->
            <!--            <div style="width: 350px;height: 60px;position: absolute;left: 90px;top: 7px">-->
            <!--              <span class="bigNumber">0.98</span><span class="smallFont2">亿m³</span><br>-->
            <!--              <span class="smallFont2">蓄变量</span><br>-->
            <!--              <span class="smallFont2">比去年</span><span class="smallFont">+30%</span>-->
            <!--            </div>-->
            <!--          </div>-->
            <div
              style="
                position: relative;
                float: left;
                margin-left: 10px;
                margin-top: 5px;
                width: 205px;
                height: 79px;
                background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png);
              "
            >
              <div
                style="
                  width: 67px;
                  height: 72px;
                  position: absolute;
                  left: 10px;
                  top: 5px;
                  background-image: url(/static/img/waterEcoDiversion/waterSupervision/蓄水量.png);
                "
              ></div>
              <div style="width: 150px; height: 60px; position: absolute; left: 90px; top: 7px">
                <span class="bigNumber">{{ xuShuiSum }}</span
                ><span class="smallFont2">亿m³</span><br />
                <span class="smallFont2">蓄水量</span><br />
                <span class="smallFont2">比去年</span
                ><span class="smallFont">{{ (xuShuiDB > 0 ? '+' : '') + xuShuiDB }}%</span>
              </div>
            </div>
            <!--          <div style="position: relative;float: left;margin-left: 10px;margin-top: 15px;width: 205px;height: 79px;background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png)">-->
            <!--            <div style="width: 67px;height: 72px;position: absolute;left: 10px;top: 5px;background-image: url(/static/img/waterEcoDiversion/waterSupervision/浅层水位.png)"></div>-->
            <!--            <div style="width: 350px;height: 52px;position: absolute;left: 90px;top: 15px">-->
            <!--              <span class="bigNumber">↑2.08</span><span class="smallFont2">m(最大)</span><br>-->
            <!--              <span class="smallFont2">浅层水位</span>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </div>
        <div
          style="
            margin-top: 25px;
            width: 440px;
            height: 380px;
            border-radius: 10px;
            position: relative;
          "
        >
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
          <div style="height: 55px; position: relative">
            <div
              style="
                position: absolute;
                border: none;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                height: 55px;
                width: 170px;
                top: 0;
                background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
                background-size: 100% 100%;
              "
            >
              <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 120px"
                >水资源承载力</span
              >
            </div>
          </div>
          <div
            style="
              height: 320px;
              width: 440px;
              background: linear-gradient(
                to top,
                rgba(1, 15, 41, 0.9),
                rgba(1, 15, 41, 0.7),
                rgba(1, 15, 41, 0.5),
                rgba(1, 15, 41, 0)
              ) !important;
            "
          >
            <!--<div style="position: relative;float: left;margin-left: 10px;margin-top: 15px;width: 205px;height: 79px;background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png)">-->
            <!--<div style="width: 39px;height: 48px;position: absolute;left: 10px;top: 15px;background-image: url(/static/img/waterEcoDiversion/waterSupervision/开发利用程度.png)"></div>-->
            <!--<div style="position: absolute;left: 70px;top: 20px;width: 1px;height: 40px;border-left: #005ed2 1px dashed"></div>-->
            <!--<div style="width: 150px;height: 52px;position: absolute;left: 90px;top: 15px">-->
            <!--<span class="bigNumber">-%</span><br>-->
            <!--<span class="smallFont2">开发利用程度</span>-->
            <!--</div>-->
            <!--</div>-->
            <div
              style="
                position: relative;
                float: left;
                margin-left: 10px;
                margin-top: 15px;
                width: 205px;
                height: 79px;
                background-image: url(/static/img/waterEcoDiversion/waterSupervision/水资源承载力-背景框.png);
              "
            >
              <div
                style="
                  width: 39px;
                  height: 48px;
                  position: absolute;
                  left: 10px;
                  top: 15px;
                  background-image: url(/static/img/waterEcoDiversion/waterSupervision/超载区比例.png);
                "
              ></div>
              <div
                style="
                  position: absolute;
                  left: 70px;
                  top: 20px;
                  width: 1px;
                  height: 40px;
                  border-left: #005ed2 1px dashed;
                "
              ></div>
              <div style="width: 150px; height: 52px; position: absolute; left: 90px; top: 15px">
                <span class="bigNumber" style="color: #fca133">{{ chaoZaiRate }}%</span><br />
                <span class="smallFont2">超载区比例</span>
              </div>
            </div>
            <div
              :id="chartLeft1"
              style="width: 380px; height: 280px; position: absolute; left: 10px; top: 120px"
            ></div>
          </div>
        </div>
        <div class="m_container_border_mark_5 m_container_border_mark"></div>
      </div>
    </div>

    <div id="rightDivId" class="out_div_parent_right animate__animated" :style="sideBarHeight">
      <div class="m_container_border_mark_2 m_container_border_mark"></div>
      <div class="sideBar" :style="sideBarHeight" style="width: 400px">
        <div style="width: 400px; height: 560px; border-radius: 10px; position: relative">
          <div style="height: 60px; position: relative">
            <div
              style="
                position: absolute;
                border: none;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                height: 55px;
                width: 170px;
                top: 0;
                background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
                background-size: 100% 100%;
              "
            >
              <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 120px"
                >供用水量</span
              >
            </div>
          </div>
          <div
            style="
              float: left;
              width: 209px;
              height: 34px;
              background-image: url(/static/img/waterEcoDiversion/ecoWater/page0/buShuiDia/titleBkg1.png);
            "
          >
            <span
              style="
                font-size: 14px;
                color: #fff;
                font-weight: bold;
                line-height: 35px;
                margin-left: 15px;
              "
              >供水统计</span
            >
          </div>
          <div
            style="
              position: relative;
              margin-top: 30px;
              height: 220px;
              width: 400px;
              background: linear-gradient(
                to top,
                rgba(1, 15, 41, 0.9),
                rgba(1, 15, 41, 0.7),
                rgba(1, 15, 41, 0.5),
                rgba(1, 15, 41, 0)
              ) !important;
            "
          >
            <div :id="chartRight2" style="width: 380px; height: 220px; margin-left: 10px"></div>
            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
          </div>
          <div
            style="
              float: left;
              width: 209px;
              height: 34px;
              background-image: url(/static/img/waterEcoDiversion/ecoWater/page0/buShuiDia/titleBkg1.png);
            "
          >
            <span
              style="
                font-size: 14px;
                color: #fff;
                font-weight: bold;
                line-height: 35px;
                margin-left: 15px;
              "
              >用水统计</span
            >
          </div>
          <div
            style="
              position: relative;
              margin-top: 30px;
              height: 430px;
              width: 400px;
              background: linear-gradient(
                to top,
                rgba(1, 15, 41, 0.9),
                rgba(1, 15, 41, 0.7),
                rgba(1, 15, 41, 0.5),
                rgba(1, 15, 41, 0)
              ) !important;
            "
          >
            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
            <div :id="chartRight1" style="width: 380px; height: 220px; margin-left: 10px"></div>
            <div :id="chartRight3" style="width: 380px; height: 210px; margin-left: 10px"></div>
          </div>
          <div class="m_container_border_mark_5 m_container_border_mark"></div>
        </div>
      </div>
    </div>

    <!--<div style="position: absolute;left: calc(50% - 320px);top: 120px;height: 120px;width: 645px;background-color: rgba(3,22,48,0.7);border: 1px #008DF9 solid;border-radius: 10px">-->
    <div
      style="
        position: absolute;
        left: calc(50% - 320px);
        top: 120px;
        height: 120px;
        width: 480px;
        background-color: rgba(3, 22, 48, 0.7);
        border: 1px #008df9 solid;
        border-radius: 10px;
      "
    >
      <div style="float: left; height: 120px; width: 159px; border-right: 1px #008df9 dashed">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 30px"
          class="bigFont"
        >
          水资源总量
        </div>
        <div style="margin-left: 20px" class="bigNumber">
          {{ szyzl }}<span class="smallFont">亿m³</span>
        </div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比上年<span style="color: #00f098; font-weight: bold"
            >{{ (szyzlDb > 0 ? '+' : '') + szyzlDb }}%</span
          >
        </div>
      </div>
      <div style="float: left; height: 120px; width: 159px; border-right: 1px #008df9 dashed">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 30px"
          class="bigFont"
        >
          供水总量
        </div>
        <div style="margin-left: 20px" class="bigNumber">
          {{ gsl }}<span class="smallFont">亿m³</span>
        </div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比上年<span style="color: #00f098; font-weight: bold"
            >{{ (gslDb > 0 ? '+' : '') + gslDb }}%</span
          >
        </div>
      </div>
      <!--<div style="float: left;height: 120px;width: 159px;border-right: 1px #008DF9 dashed;">-->
      <div style="float: left; height: 120px; width: 159px">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 30px"
          class="bigFont"
        >
          用水总量
        </div>
        <div style="margin-left: 20px" class="bigNumber">
          {{ yongShuiSum }}<span class="smallFont">亿m³</span>
        </div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比上年<span style="color: #00f098; font-weight: bold"
            >{{ (yongShuiDb > 0 ? '+' : '') + yongShuiDb }}%</span
          >
        </div>
      </div>
      <!--<div style="float: left;height: 120px;width: 155px;">-->
      <!--<div style="margin-left: 20px;margin-top: 20px;width: 120px;height: 30px" class="bigFont">开发利用率</div>-->
      <!--<div style="margin-left: 20px;" class="bigNumber">-<span class="smallFont">%</span></div>-->
      <!--<div style="margin-left: 20px;margin-top: 5px" class="smallFont">比去年<span style="color: #00F098;font-weight: bold">-</span></div>-->
      <!--</div>-->
    </div>
    <div
      class="buttonSide"
      :style="'background-image: url(' + leftButtonPic + ')'"
      @mouseenter="changeButton('left1')"
      @mouseleave="changeButton('left0')"
      @click="
        clickButton1()
        changeButton('left1')
      "
    >
      >
    </div>
    <div
      class="buttonSide"
      :style="'background-image: url(' + rightButtonPic + ')'"
      style="right: 0px"
      @mouseenter="changeButton('right1')"
      @mouseleave="changeButton('right0')"
      @click="
        clickButton2()
        changeButton('right1')
      "
    >
      >
    </div>
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

<script setup>
import router from '@/router'
import c from '@/utils/common/c.js'
import * as echarts from 'echarts'
import divline from '@/components/divline'
import store from '@/store/index.js'
import { watch, defineEmits } from 'vue'
import mapTool from '@/views/waterEcoDiversion/mapTool/index.vue'
import intellect from '@/views/knowledge/components/intellect/index.vue'

const sideBarHeightLeft = c.computed(() => {
  return {
    height: c.screen_height - 246 + 'px'
  }
})
const sideBarHeight = c.computed(() => {
  return {
    height: c.screen_height - 160 + 'px'
  }
})
const dontShowList = ref([])
const mapToolPx = ref(430)
const showMapFlag = ref(true)
const LCName = ref('shuiziyuanjianguan')
const emit = defineEmits(['changeDate'])

const fileList = c.ref([
  { fileName: '2022年度最严格制度考核报告', fileUrl: '' },
  { fileName: '2021年度最严格制度考核报告', fileUrl: '' },
  { fileName: '2020年度最严格制度考核报告', fileUrl: '' }
])
const chartLeft1 = c.ref('chartLeft1' + Date.now())
const chartLeft2 = c.ref('chartLeft2' + Date.now())
const chartRight1 = c.ref('chartRight1' + Date.now())
const chartRight2 = c.ref('chartRight2' + Date.now())
const chartRight3 = c.ref('chartRight3' + Date.now())
const screenWideFlag = c.ref()
const leftButtonPic = c.ref('static/img/waterEcoDiversion/buShui/right-normal.png')
const rightButtonPic = c.ref('static/img/waterEcoDiversion/buShui/left-normal.png')
const rightButton = c.ref(true)
const leftButton = c.ref(true)
const wtYear = c.ref('2022')
const { proxy } = getCurrentInstance()
c.onMounted(() => {
  fadeAnimate('leftDivId', !leftButton.value, 'left')
  fadeAnimate('rightDivId', !rightButton.value, 'right')
  if (c.screen_width < c.wide_screen_width) {
    screenWideFlag.value = false
  } else {
    screenWideFlag.value = true
  }

  drawEcharts3(
    [55, 60, 70, 80, 55],
    [60, 70, 80, 90, 60],
    ['北京市', '天津市', '河北省', '山西省', '内蒙古']
  )
  setTimeout(() => {
    queryChengZaiLi()
  }, 1000)
  queryWMA_WRR_CC()

  queryGongShui()
  queryYongShui()
  queryTopBarData()
  queryTopLeftInfo()
})

function changeYear() {
  setTimeout(() => {
    queryChengZaiLi()
  }, 1000)
  queryWMA_WRR_CC()
  queryGongShui()
  queryYongShui()
  queryTopBarData()
  queryTopLeftInfo()
}

const diBiaoSum = c.ref(0)
const diXiaSum = c.ref(0)
const jiangShuiSum = c.ref(0)
const jiangShuiDB = c.ref(0)
const xuShuiSum = c.ref(0)
const xuShuiDB = c.ref(0)
function queryTopLeftInfo() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/waterSupervision/queryTopLeftInfo', { year: wtYear.value })
    .then((response) => {
      if (response.data.code === 200) {
        diBiaoSum.value = response.data.data.DIBIAO
        diXiaSum.value = response.data.data.DIXIA
        jiangShuiSum.value = response.data.data.JIANGYU
        jiangShuiDB.value = response.data.data.JIANGYUDB
        xuShuiSum.value = response.data.data.XUSHUI
        xuShuiDB.value = response.data.data.XUSHUIDB
      }
    })
}

const yongShuiSum = c.ref(0)
const yongShuiDb = c.ref(0)
function queryYongShui() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/waterSupervision/queryYongShui', { wtYear: wtYear.value })
    .then((response) => {
      if (response.data.code === 200) {
        const year1 = response.data.data[0]
        const year2 = response.data.data[1]

        yongShuiSum.value = (
          year1.NONGYESUM +
          year1.GONGYESUM +
          year1.SHENGHUOSUM +
          year1.SHENGTAISUM
        ).toFixed(2)
        yongShuiDb.value = (
          (year1.NONGYESUM +
            year1.GONGYESUM +
            year1.SHENGHUOSUM +
            year1.SHENGTAISUM -
            year2.NONGYESUM +
            year2.GONGYESUM +
            year2.SHENGHUOSUM +
            year2.SHENGTAISUM) /
            year1.NONGYESUM +
          year1.GONGYESUM +
          year1.SHENGHUOSUM +
          year1.SHENGTAISUM
        ).toFixed(1)

        drawEcharts1(response.data.data[0])
      }
    })
}

const szyzl = c.ref(0)
const szyzlDb = c.ref(0)
const gsl = c.ref(0)
const gslDb = c.ref(0)
function queryTopBarData() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/waterSupervision/queryTopBarData', { year: wtYear.value })
    .then((response) => {
      if (response.data.code === 200) {
        szyzl.value = response.data.data.SZYZL
        szyzlDb.value = response.data.data.SZYZLDB
        gsl.value = response.data.data.GSL
        gslDb.value = response.data.data.GSLDB
      }
    })
}

function queryGongShui() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/waterSupervision/queryGongShui', { year: wtYear.value })
    .then((response) => {
      if (response.data.code === 200) {
        drawEcharts2(response.data.data)
      }
    })
}

function queryChengZaiLi() {
  proxy.$getWater('/ydr/waterEcoDiversion/waterSupervision/queryChengZaiLi').then((response) => {
    if (response.data.code === 200) {
      emit('changeDate', response.data.data)
    }
  })
}

const dataList1 = c.ref()
const chaoZaiRate = c.ref()
function queryWMA_WRR_CC() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/waterSupervision/queryWMA_WRR_CC', { year: wtYear.value })
    .then((response) => {
      if (response.data.code === 200) {
        //--1非超载区 2临界区 3超载区 4严重超载区
        drawEcharts0(response.data.data)
      }
    })
}

function drawEcharts0(dataTemp) {
  const color = [
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#ff7e39' },
      { offset: 0, color: '#fff364' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#6978f4' },
      { offset: 0, color: '#8f69f4' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#00e2ff' },
      { offset: 0, color: '#00a5ff' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#fffa55' },
      { offset: 0, color: '#05e894' }
    ])
  ]
  // let data = [
  //   {name: '4', value1: 9},
  //   {name: '3', value1: 7},
  //   {name: '2', value1: 6},
  //   {name: '1', value1: 4},
  // ];
  let sum = 0
  const data = []
  let chaoZaiNum = 0
  //--1 非超载区 2 临界区 3 超载区 4 严重超载区
  dataTemp.forEach((e, i) => {
    data.push({})
    sum += e.NUM
    let name = ''
    if (e.CC_WA === '1') {
      name = '非超载区'
    } else if (e.CC_WA === '2') {
      name = '临界区'
    } else if (e.CC_WA === '3') {
      name = '超载区'
      chaoZaiNum += e.NUM
    } else if (e.CC_WA === '4') {
      name = '严重超载区'
      chaoZaiNum += e.NUM
    }
    data[i].name = name
    data[i].value = e.NUM
  })
  chaoZaiRate.value = ((chaoZaiNum / sum) * 100).toFixed(0)
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartLeft1.value))
  myChart.clear()
  const option = {
    // 标题设置
    title: [
      {
        text: sum,
        x: '20%',
        y: '35%',
        textStyle: {
          fontSize: 25,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '总数',
        x: '20%',
        y: '48%',
        textStyle: {
          fontSize: 15,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      }
    ],
    // 提示
    // tooltip: {
    //   trigger: 'item',
    //   formatter: "{b} : {c} ({d}%)"
    // },
    color: color,
    // 图例
    legend: {
      orient: 'vertical',
      x: '50%',
      y: 'center',
      // 设置图例形状
      icon: 'circle',
      itemWidth: 14, // 设置宽度
      itemHeight: 14, // 设置高度
      textStyle: {
        color: '#8e96ad',
        fontSize: 14,
        lineHeight: 24,
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'bold',
            width: 60
          },
          value: {
            width: 20,
            fontSize: 14,
            fontWeight: 'bold',
            padding: [0, 0, 0, 25]
          }
        }
      },
      formatter: function (params) {
        let legendIndex = 0
        data.forEach(function (v, i) {
          if (v.name == params) {
            legendIndex = i
          }
        })
        return (
          '{name|' +
          params +
          '}{value|' +
          ((data[legendIndex].value / sum) * 100).toFixed(0) +
          '%}{value|' +
          data[legendIndex].value +
          '个}'
        )
      }
    },
    series: [
      {
        type: 'pie',
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: false
            }
          }
        },
        radius: ['40%', '60%'],
        // 设置饼状图在画布中的位置
        center: ['25%', '50%'],
        data: data
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
function drawEcharts1(data1) {
  const color = [
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#ff7e39' },
      { offset: 0, color: '#fff364' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#6978f4' },
      { offset: 0, color: '#8f69f4' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#00e2ff' },
      { offset: 0, color: '#00a5ff' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#fffa55' },
      { offset: 0, color: '#05e894' }
    ])
  ]
  const data = [
    { name: '工业', value: data1.GONGYESUM },
    { name: '农业', value: data1.NONGYESUM },
    { name: '生活', value: data1.SHENGHUOSUM },
    { name: '生态', value: data1.SHENGTAISUM }
  ]
  let sum = 0
  data.forEach((e, i) => {
    sum += e.value
  })
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartRight1.value))
  myChart.clear()
  const option = {
    // 标题设置
    title: [
      {
        text: sum,
        x: '16%',
        y: '32%',
        textStyle: {
          fontSize: 22,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '亿m³',
        x: '20%',
        y: '42%',
        textStyle: {
          fontSize: 12,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '总量',
        x: '19%',
        y: '54%',
        textStyle: {
          fontSize: 20,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      }
    ],
    // 提示
    // tooltip: {
    //   trigger: 'item',
    //   formatter: "{b} : {c} ({d}%)"
    // },
    color: color,
    // 图例
    legend: {
      orient: 'vertical',
      x: '50%',
      y: 'center',
      // 设置图例形状
      icon: 'circle',
      itemWidth: 14, // 设置宽度
      itemHeight: 14, // 设置高度
      textStyle: {
        color: '#8e96ad',
        fontSize: 14,
        lineHeight: 24,
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'bold'
          },
          value: {
            fontSize: 14,
            fontWeight: 'bold',
            padding: [0, 0, 0, 15]
          }
        }
      },
      formatter: function (params) {
        let legendIndex = 0
        data.forEach(function (v, i) {
          if (v.name == params) {
            legendIndex = i
          }
        })
        return (
          '{name|' +
          params +
          '}{value|' +
          ((data[legendIndex].value / sum) * 100).toFixed(0) +
          '%}{value|' +
          data[legendIndex].value +
          '亿m³}'
        )
      }
    },
    series: [
      {
        type: 'pie',
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: false
            }
          }
        },
        radius: ['45%', '65%'],
        // 设置饼状图在画布中的位置
        center: ['25%', '50%'],
        data: data
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
const gongShuiAll = c.ref(0)
function drawEcharts2(data1) {
  const color = [
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#6978f4' },
      { offset: 0, color: '#8f69f4' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#00e2ff' },
      { offset: 0, color: '#00a5ff' }
    ]),
    new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      { offset: 1, color: '#fffa55' },
      { offset: 0, color: '#05e894' }
    ])
  ]
  const data = [
    { name: '地表水', value: data1[0].DIBIAOSUM },
    { name: '地下水', value: data1[0].DIXIASUM },
    { name: '其他', value: data1[0].QITASUM }
  ]
  let sum = 0
  data.forEach((e, i) => {
    sum += e.value
  })
  gongShuiAll.value = sum
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartRight2.value))
  myChart.clear()
  const option = {
    // 标题设置
    title: [
      {
        text: sum.toFixed(2),
        x: '16%',
        y: '32%',
        textStyle: {
          fontSize: 22,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '亿m³',
        x: '20%',
        y: '42%',
        textStyle: {
          fontSize: 12,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '总量',
        x: '19%',
        y: '54%',
        textStyle: {
          fontSize: 18,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      }
    ],
    // 提示
    // tooltip: {
    //   trigger: 'item',
    //   formatter: "{b} : {c} ({d}%)"
    // },
    color: color,
    // 图例
    legend: {
      orient: 'vertical',
      x: '48%',
      y: 'center',
      // 设置图例形状
      icon: 'circle',
      itemWidth: 14, // 设置宽度
      itemHeight: 14, // 设置高度
      textStyle: {
        color: '#8e96ad',
        fontSize: 14,
        lineHeight: 24,
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'bold',
            width: 40
          },
          value: {
            fontSize: 14,
            fontWeight: 'bold',
            padding: [0, 0, 0, 15]
          }
        }
      },
      formatter: function (params) {
        let legendIndex = 0
        data.forEach(function (v, i) {
          if (v.name == params) {
            legendIndex = i
          }
        })
        return (
          '{name|' +
          params +
          '}{value|' +
          ((data[legendIndex].value / sum) * 100).toFixed(0) +
          '%}{value|' +
          data[legendIndex].value +
          '亿m³}'
        )
      }
    },
    series: [
      {
        type: 'pie',
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: false
            }
          }
        },
        radius: ['45%', '65%'],
        // 设置饼状图在画布中的位置
        center: ['25%', '50%'],
        data: data
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
function drawEcharts3(data1, data2, tm) {
  const chartDom = document.getElementById(chartRight3.value)
  const myChart = echarts.init(chartDom)

  let option
  option = {
    xAxis: {
      show: true,
      type: 'category',
      data: tm,
      axisLabel: {
        color: '#fff'
      }
    },
    legend: {
      data: ['用水量', '指标'],
      right: '5%',
      itemGap: 20,
      icon: 'rect',
      itemHeight: 11,
      itemWidth: 11,
      align: 'auto', // 图例标记和文本的对齐
      textStyle: {
        color: '#fff'
      }
    },
    yAxis: [
      {
        name: '单位：万m³',
        nameTextStyle: {
          color: '#fff',
          padding: [0, 0, 0, 0]
        },
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          show: true
        },
        splitArea: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '用水量',
        data: data1,
        yAxisIndex: 0,
        barWidth: 20,
        type: 'bar',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#0290fc' }, // 设置颜色渐变
            { offset: 1, color: '#4fb8b6' }
          ]
        }
      },
      {
        name: '指标',
        data: data2,
        yAxisIndex: 0,
        barWidth: 20,
        type: 'bar',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#35f16c' }, // 设置颜色渐变
            { offset: 1, color: '#b7fd74' }
          ]
        }
      }
    ],
    grid: {
      top: 40,
      bottom: 40,
      right: 20,
      left: 40
    }
  }

  option && myChart.setOption(option)
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
}
function clickButton1() {
  fadeAnimate('leftDivId', leftButton.value, 'left')

  leftButton.value = !leftButton.value
  c.nextTick(() => {})
}
function clickButton2() {
  fadeAnimate('rightDivId', rightButton.value, 'right')

  if (rightButton.value) {
    mapToolPx.value = 20
  } else {
    mapToolPx.value = 430
  }
  rightButton.value = !rightButton.value
  c.nextTick(() => {})
}
function changeButton(name) {
  if (name === 'left1') {
    if (leftButton.value) {
      leftButtonPic.value = 'static/img/waterEcoDiversion/buShui/right-mouseOn.png'
    } else {
      leftButtonPic.value = 'static/img/waterEcoDiversion/buShui/left-mouseOn.png'
    }
  } else if (name === 'left0') {
    if (leftButton.value) {
      leftButtonPic.value = 'static/img/waterEcoDiversion/buShui/right-normal.png'
    } else {
      leftButtonPic.value = 'static/img/waterEcoDiversion/buShui/left-normal.png'
    }
  } else if (name === 'right1') {
    if (rightButton.value) {
      rightButtonPic.value = 'static/img/waterEcoDiversion/buShui/left-mouseOn.png'
    } else {
      rightButtonPic.value = 'static/img/waterEcoDiversion/buShui/right-mouseOn.png'
    }
  } else if (name === 'right0') {
    if (rightButton.value) {
      rightButtonPic.value = 'static/img/waterEcoDiversion/buShui/left-normal.png'
    } else {
      rightButtonPic.value = 'static/img/waterEcoDiversion/buShui/right-normal.png'
    }
  }
}
</script>
<style scoped>
.out_div_parent_right {
  /*border: 1px solid red;*/
  position: fixed;
  top: 120px;
  z-index: 3;
  float: right;
  right: 38px;
  width: 400px;
}
.out_div_parent_left {
  /*border: 1px solid red;*/
  position: absolute;
  top: 130px;
  z-index: 3;
  float: left;
  left: 40px;
  width: 440px;
}
.m_container_border_mark {
  background-color: #00c0ff;
}
.m_container_border_mark_2 {
  width: 10px;
  height: 2px;
  position: absolute;
  left: calc((100% - 25px) / 2);
  top: -1px;
  animation: anim_m_container_border_mark_2 3s infinite;
}

.m_container_border_mark_5 {
  width: 10px;
  height: 2px;
  position: absolute;
  left: calc((100% - 25px) / 2);
  /*bottom: -1px;*/
  /*margin-top: 10px;*/
  animation: anim_m_container_border_mark_2 3s infinite;
}

.m_container_border_mark_5_right {
  width: 10px;
  height: 2px;
  position: absolute;
  left: calc((100% - 25px) / 2);
  /*bottom: -1px;*/
  /*margin-top: 10px;*/
  animation: anim_m_container_border_mark_2 3s infinite;
}

@keyframes anim_m_container_border_mark_2 {
  0% {
    width: 10px;
    left: calc((100% - 25px) / 2);
    opacity: 1;
    filter: blur(0);
  }
  100% {
    width: 355px;
    left: calc((100% - 355px) / 2);
    opacity: 1;
    filter: blur(1px);
  }
}

.buttonSide {
  position: absolute;
  z-index: 3;
  top: 222px;
  width: 40px;
  height: 560px;
}
.sideBar {
  background-color: #031334;
  opacity: 0.8;
  position: absolute;
  z-index: 2;
  /*top: 100px;*/
  overflow: hidden;
  &:hover {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #90939950 !important;
  }
}
.bigFont {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}
.bigNumber {
  color: #00f098;
  font-size: 26px;
  font-weight: bold;
}
.smallFont {
  color: #6fbdff;
  font-size: 14px;
}
.smallFont2 {
  color: lightgrey;
  font-size: 12px;
}

/*日期控件*/
:deep(.el-input__wrapper) {
  border-radius: 15px;
  height: 25px;
  background-color: transparent;
  border: 1px solid #1b4c93 !important;
  box-shadow: none;
}
:deep(.el-input__inner) {
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.toolDiv {
  width: 50px;
  height: 400px;
  position: absolute;
  margin-top: 170px;
  right: 40px;
}
</style>
