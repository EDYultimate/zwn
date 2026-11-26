<template>
  <div>
    <div style="position: fixed; top: 120px; right: 450px; z-index: 99999">
      <intellect></intellect>
    </div>

    <div style="position: absolute; left: calc(50% - 225px); top: 110px">
      <div class="topDiv" style="">
        <div style="height: 70px; width: 190px">
          <div
            style="float: left; margin-left: 25px; margin-top: 20px; width: 75px"
            class="bigFont"
          >
            山西出境
          </div>
          <div
            v-if="sxSj < sxGoal"
            style="
              float: left;
              margin-left: 25px;
              margin-top: 22px;
              color: red;
              border: 1px solid red;
              border-radius: 10px;
              width: 50px;
            "
            class=""
          >
            未达标
          </div>
          <div
            v-if="sxSj >= sxGoal"
            style="
              float: left;
              margin-left: 25px;
              margin-top: 22px;
              color: green;
              border: 1px solid green;
              border-radius: 10px;
              width: 50px;
            "
            class=""
          >
            已达标
          </div>
          <div
            class="bigNumber"
            style="float: left; width: 90px; margin-left: 20px; margin-top: 15px"
          >
            {{ sxSj }}<span class="smallFont">亿m³</span>
          </div>
          <div
            class="bigFont"
            style="float: left; width: 70px; margin-left: 10px; margin-top: 25px"
          >
            {{ sxGoal }}<span class="smallFont">亿m³</span>
          </div>
        </div>
      </div>
      <div class="topDiv" style="margin-left: 20px">
        <div style="height: 70px; width: 190px">
          <div
            style="float: left; margin-left: 25px; margin-top: 20px; width: 75px"
            class="bigFont"
          >
            河北出境
          </div>
          <div
            v-if="hbSj < hbGoal"
            style="
              float: left;
              margin-left: 25px;
              margin-top: 22px;
              color: red;
              border: 1px solid red;
              border-radius: 10px;
              width: 50px;
            "
            class=""
          >
            未达标
          </div>
          <div
            v-if="hbSj >= hbGoal"
            style="
              float: left;
              margin-left: 25px;
              margin-top: 22px;
              color: green;
              border: 1px solid green;
              border-radius: 10px;
              width: 50px;
            "
            class=""
          >
            已达标
          </div>
          <div
            class="bigNumber"
            style="float: left; width: 90px; margin-left: 20px; margin-top: 15px"
          >
            {{ hbSj }}<span class="smallFont">亿m³</span>
          </div>
          <div
            class="bigFont"
            style="float: left; width: 70px; margin-left: 10px; margin-top: 25px"
          >
            {{ hbGoal }}<span class="smallFont">亿m³</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="sideBar" style="width: 400px;height: 800px;left: 38px;" v-show="leftButton">-->

    <div id="leftDivId" class="out_div_parent_left animate__animated" :style="sideBarHeight">
      <div class="m_container_border_mark_2 m_container_border_mark"></div>
      <div class="sideBar" :style="sideBarHeight" style="width: 400px">
        <div style="width: 400px; height: 800px; background-color: #041331; border-radius: 10px">
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
          <div style="height: 70px; position: relative">
            <div
              style="
                position: absolute;
                border: none;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                height: 55px;
                width: 180px;
                top: 0;
                background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
                background-size: 110% 100%;
              "
            >
              <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 120px"
                >出境水量分析</span
              >
            </div>
            <div
              style="
                position: absolute;
                right: 20px;
                top: 10px;
                width: 110px;
                float: right;
                cursor: pointer;
              "
            >
              <el-date-picker
                v-model="wtYear2"
                type="year"
                value-format="YYYY"
                @change="queryRVAVYearData"
              >
              </el-date-picker>
            </div>
            <span
              style="
                cursor: pointer;
                float: right;
                font-size: 20px;
                width: 30px;
                height: 70px;
                font-weight: bold;
                color: #008df9;
                line-height: 52px;
              "
              @click="showLeftExportDia = true"
            >
              >
            </span>

            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
          </div>
          <div
            style="
              position: relative;
              width: 400px;
              height: 240px;
              background: linear-gradient(
                to top,
                rgba(13, 86, 147, 0.7),
                rgba(1, 15, 41, 0.3),
                rgba(1, 15, 41, 0.3)
              ) !important;
            "
          >
            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
            <div
              style="
                color: #fff;
                height: 38px;
                width: 400px;
                background: linear-gradient(to right, #062e58, transparent);
                text-align: left;
                line-height: 35px;
              "
              class="bigFont"
            >
              <div
                style="
                  background-image: url(/static/img/waterEcoDiversion/buShui/lingxing.png);
                  width: 15px;
                  height: 15px;
                  float: left;
                  margin-top: 10px;
                  margin-left: 10px;
                  margin-right: 10px;
                "
              ></div>
              水文年型
            </div>
            <div style="width: 380px; height: 90px; margin-top: 25px; margin-left: 20px">
              <div
                style="
                  float: left;
                  background-image: url(/static/img/waterEcoDiversion/obtainWater/chuJingPic1.png);
                  width: 55px;
                  height: 57px;
                "
              ></div>
              <div
                style="float: left; width: 40px; margin-left: 5px; margin-top: 10px"
                class="bigFont"
              >
                山西
              </div>
              <div
                style="
                  height: 60px;
                  width: 250px;
                  border-left: #005ed2 1px dashed;
                  float: left;
                  margin-left: 20px;
                "
              >
                <div class="bigFont" style="float: left; width: 120px; height: 30px">天然径流</div>
                <div class="bigFont" style="float: left; width: 120px; height: 30px">水文频率</div>
                <div></div>
                <div class="bigNumber" style="float: left; width: 120px; height: 30px">
                  1.48<span class="smallFont">亿m³</span>
                </div>
                <div class="bigNumber" style="float: left; width: 120px; height: 30px">
                  48<span class="smallFont">%</span>
                </div>
              </div>
            </div>
            <div style="width: 380px; height: 90px; margin-left: 20px">
              <div
                style="
                  float: left;
                  background-image: url(/static/img/waterEcoDiversion/obtainWater/chuJingPic1.png);
                  width: 55px;
                  height: 57px;
                "
              ></div>
              <div
                style="float: left; width: 40px; margin-left: 5px; margin-top: 10px"
                class="bigFont"
              >
                河北
              </div>
              <div
                style="
                  height: 60px;
                  width: 250px;
                  border-left: #005ed2 1px dashed;
                  float: left;
                  margin-left: 20px;
                "
              >
                <div class="bigFont" style="float: left; width: 120px; height: 30px">天然径流</div>
                <div class="bigFont" style="float: left; width: 120px; height: 30px">水文频率</div>
                <div></div>
                <div class="bigNumber" style="float: left; width: 130px; height: 30px">
                  1.38<span class="smallFont">亿m³</span>
                </div>
                <div class="bigNumber" style="float: left; width: 105px; height: 30px">
                  28<span class="smallFont">%</span>
                </div>
              </div>
            </div>
            <div
              style="
                position: relative;
                margin-top: 20px;
                color: #fff;
                height: 38px;
                width: 400px;
                background: linear-gradient(to right, #062e58, transparent);
                text-align: left;
                line-height: 35px;
              "
              class="bigFont"
            >
              <div
                style="
                  background-image: url(/static/img/waterEcoDiversion/buShui/lingxing.png);
                  width: 15px;
                  height: 15px;
                  float: left;
                  margin-top: 10px;
                  margin-left: 10px;
                  margin-right: 10px;
                "
              ></div>
              出境水量完成情况
              <divline :linetp="'lefttoplong'"></divline>
              <divline :linetp="'righttopshort'"></divline>
              <divline :linetp="'leftbottomshort'"></divline>
              <divline :linetp="'rightbottomlong'"></divline>
            </div>
            <div
              style="
                width: 400px;
                height: 180px;
                margin-top: 20px;
                margin-left: 20px;
                position: relative;
              "
            >
              <div class="middleFont" style="position: absolute; width: 150px; height: 20px">
                山西
              </div>
              <div :id="chartLeft1" style="width: 200px; height: 200px; float: left"></div>
              <div
                class="middleFont"
                style="float: left; width: 150px; height: 20px; margin-top: 70px; margin-left: 20px"
              >
                出境<span class="middleNumber">{{ sxSj }}</span
                >亿m³
              </div>
              <div
                class="middleFont"
                style="float: left; width: 150px; height: 20px; margin-top: 20px; margin-left: 20px"
              >
                目标<span class="middleNumber">{{ sxGoal }}</span
                >亿m³
              </div>
            </div>
            <div
              style="
                width: 400px;
                height: 180px;
                margin-top: 20px;
                margin-left: 20px;
                position: relative;
              "
            >
              <div class="middleFont" style="position: absolute; width: 150px; height: 20px">
                河北
              </div>
              <div :id="chartLeft2" style="width: 200px; height: 200px; float: left"></div>
              <div
                class="middleFont"
                style="float: left; width: 150px; height: 20px; margin-top: 70px; margin-left: 20px"
              >
                出境<span class="middleNumber">{{ hbSj }}</span
                >亿m³
              </div>
              <div
                class="middleFont"
                style="float: left; width: 150px; height: 20px; margin-top: 20px; margin-left: 20px"
              >
                目标<span class="middleNumber">{{ hbGoal }}</span
                >亿m³
              </div>
            </div>
          </div>
        </div>
        <div class="m_container_border_mark_5 m_container_border_mark"></div>
      </div>
    </div>

    <div id="rightDivId" class="out_div_parent_right animate__animated" :style="sideBarHeight">
      <div class="m_container_border_mark_2 m_container_border_mark"></div>
      <div class="sideBar" :style="sideBarHeightRight" style="width: 400px">
        <div style="height: 70px; position: relative">
          <div
            style="
              position: absolute;
              border: none;
              font-size: 16px;
              font-weight: bold;
              color: #fff;
              height: 55px;
              width: 180px;
              top: 0;
              background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
              background-size: 120% 100%;
            "
          >
            <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 130px"
              >控制断面监测信息</span
            >
          </div>
          <div
            style="position: absolute; top: 18px; right: 130px; font-weight: bold; color: #0681ff"
          >
            <span>截止</span>
          </div>
          <div
            style="
              position: absolute;
              right: 20px;
              top: 10px;
              width: 110px;
              float: right;
              cursor: pointer;
            "
          >
            <el-date-picker
              v-model="wtTime"
              type="month"
              value-format="YYYY-MM"
              @change="querySzyjgFsfajgDmData"
            >
            </el-date-picker>
          </div>
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
        </div>
        <div style="height: 380px; width: 400px; position: relative">
          <div
            style="
              position: relative;
              color: #fff;
              height: 38px;
              width: 400px;
              background: linear-gradient(to right, #062e58, transparent);
              text-align: left;
              line-height: 35px;
            "
            class="bigFont"
          >
            <div
              style="
                background-image: url(/static/img/waterEcoDiversion/buShui/lingxing.png);
                width: 15px;
                height: 15px;
                float: left;
                margin-top: 10px;
                margin-left: 10px;
                margin-right: 10px;
              "
            ></div>
            山西控制断面
            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
          </div>
          <div style="width: 400px; height: 350px; margin-top: 15px">
            <div
              class="tcTableDiv"
              style="
                position: relative;
                border-top: 1px solid rgb(14, 93, 158);
                position: relative;
                height: 500px;
              "
            >
              <el-table
                border
                :data="listDataTemp"
                height="300px"
                style="width: 100%; text-align: center; z-index: 3"
                :cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column prop="STNM" label="断面"> </el-table-column>
                <!--              <el-table-column-->
                <!--                  prop="q" width="80px"-->
                <!--                  :label="'8时流量\nm'">-->
                <!--              </el-table-column>-->
                <!--              <el-table-column-->
                <!--                  prop="avq" width="85px"-->
                <!--                  :label="'日均流量\nm³/s'"-->
                <!--              >-->
                <!--              </el-table-column>-->
                <el-table-column prop="AVQSUM" :label="'累计过水量 (万m³)'">
                  <template #default="scope">
                    <span>{{ scope.row.AVQSUM.toFixed(2) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
        </div>
        <div style="height: 180px; width: 400px; position: relative">
          <div
            style="
              position: relative;
              color: #fff;
              height: 38px;
              width: 400px;
              background: linear-gradient(to right, #062e58, transparent);
              text-align: left;
              line-height: 35px;
            "
            class="bigFont"
          >
            <div
              style="
                background-image: url(/static/img/waterEcoDiversion/buShui/lingxing.png);
                width: 15px;
                height: 15px;
                float: left;
                margin-top: 10px;
                margin-left: 10px;
                margin-right: 10px;
              "
            ></div>
            河北控制断面
            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
          </div>
          <div style="width: 400px; height: 120px; margin-top: 15px">
            <div
              class="tcTableDiv"
              style="border-top: 1px solid rgb(14, 93, 158); position: relative; height: 100%"
            >
              <el-table
                border
                :data="listDataTemp2"
                style="height: 100%; width: 100%; text-align: center; z-index: 3"
                :cell-style="{ 'text-align': 'center' }"
              >
                <el-table-column prop="STNM" label="断面"> </el-table-column>
                <!--              <el-table-column-->
                <!--                  prop="q" width="80px"-->
                <!--                  :label="'8时流量\nm'">-->
                <!--              </el-table-column>-->
                <!--              <el-table-column-->
                <!--                  prop="avq" width="85px"-->
                <!--                  :label="'日均流量\nm³/s'"-->
                <!--              >-->
                <!--              </el-table-column>-->
                <el-table-column prop="AVQSUM" :label="'累计过水量 (万m³)'">
                  <template #default="scope">
                    <span>{{ scope.row.AVQSUM.toFixed(2) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
        </div>
        <div class="m_container_border_mark_5 m_container_border_mark"></div>
      </div>
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
      " >
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
    <el-dialog
      v-model="showMapExportDia"
      :modal="true"
      style="
        background-color: rgba(0, 12, 31, 0.9);
        height: 700px;
        width: 1223px;
        box-shadow:
          0px 0px 10px 0px rgba(151, 217, 255, 0.6),
          0px 0px 10px 0px #97d9ff;
      "
      :modal-append-to-body="false"
      :append-to-body="true"
      destroy-on-close
      center
    >
      <fenShuiStationDetail :stcd="stcdTemp" style="padding: 0"></fenShuiStationDetail>
    </el-dialog>

    <el-dialog
      v-model="showLeftExportDia"
      class="dia"
      :modal="true"
      style="
        background-color: rgba(0, 12, 31, 0.9);
        height: 700px;
        padding: 0;
        margin-top: 70px;
        width: 1240px;
        box-shadow:
          0px 0px 10px 0px rgba(151, 217, 255, 0.6),
          0px 0px 10px 0px #97d9ff;
      "
      :modal-append-to-body="false"
      :append-to-body="true"
      destroy-on-close
      center
      draggable
    >
      <template #header="{ close, titleId, titleClass }">
        <div style="border-bottom: 1px solid #14386a; height: 20px; width: calc(100% - 40px)">
          <span
            :id="titleId"
            :class="titleClass"
            style="
              color: #fff;
              font-size: 16px;
              position: absolute;
              top: 7px;
              text-align: left;
              left: 25px;
            "
            >出境水量评价分析</span
          >
        </div>
      </template>
      <div style="margin-top: -30px">
        <shuiLiangFenXi></shuiLiangFenXi>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import '@/assets/text/text.css'
import router from '@/router'
import c from '@/utils/common/c.js'
import store from '@/store/index.js'
import * as echarts from 'echarts'
import divline from '@/components/divline'
import { watch, defineEmits } from 'vue'
import mapTool from '@/views/waterEcoDiversion/mapTool/index.vue'
import fenShuiStationDetail from './fenShuiStationDetail'
import shuiLiangFenXi from './shuiLiangFenXi'
import intellect from '@/views/knowledge/components/intellect/index.vue'

const sideBarHeight = c.computed(() => {
  return {
    height: c.screen_height - 120 + 'px'
  }
})

const sideBarHeightRight = c.computed(() => {
  return {
    height: c.screen_height - 280 + 'px'
  }
})
const dontShowList = ref([])
const mapToolPx = ref(430)
const showMapFlag = ref(false)
const LCName = ref('')
const emit = defineEmits(['changeDate'])
const leftButtonPic = c.ref('static/img/waterEcoDiversion/buShui/right-normal.png')
const rightButtonPic = c.ref('static/img/waterEcoDiversion/buShui/left-normal.png')
const rightButton = c.ref(true)
const leftButton = c.ref(true)
const chartLeft1 = c.ref('chartLeft1' + Date.now())
const chartLeft2 = c.ref('chartLeft2' + Date.now())
const wtTime = c.ref('')
const listDataTemp = c.ref([])
const listDataTemp2 = c.ref([])

const showMapExportDia = ref(false)
const showLeftExportDia = ref(false)

const { proxy } = getCurrentInstance()

const stcdTemp = ref('')
c.onMounted(() => {
  fadeAnimate('leftDivId', !leftButton.value, 'left')
  fadeAnimate('rightDivId', !rightButton.value, 'right')
  queryRVAVLatestData()
  queryRVAVYearData()
  window.openDia_st = openDia_st
})

const wtYear2 = ref('2023')
const sxSj = ref(0.0)
const hbSj = ref(0.0)
const sxGoal = ref(1.21)
const hbGoal = ref(3.09)

function queryRVAVYearData() {
  proxy
    .$getWater(
      '/ydr/waterEcoDiversion/rainCondition/queryRVAVYearData',
      // {wtYear:'2021'}
      { wtYear: wtYear2.value }
    )
    .then((response) => {
      let sumD1 = 0.0
      let sumD2 = 0.0
      response.data.data.sxData.forEach((e) => {
        sumD1 = sumD1 + e.NYH + e.SGH + e.HLH
      })
      response.data.data.hbData.forEach((e) => {
        sumD2 = sumD2 + e.HB
      })
      sxSj.value = Number((sumD1 / 10000).toFixed(2))
      hbSj.value = Number((sumD2 / 10000).toFixed(2))
      drawEcharts1(Number((sumD1 / 10000).toFixed(2)), 1.21)
      drawEcharts2(Number((sumD2 / 10000).toFixed(2)), 3.09)
    })
}

function openDia_st(val) {
  stcdTemp.value = val
  setTimeout(() => {
    showMapExportDia.value = true
  }, 100)
}

function queryRVAVLatestData() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/rainCondition/queryRVAVLatestData', {})
    .then((response) => {
      wtTime.value = response.data.data.IDTM
      c.nextTick(() => {
        querySzyjgFsfajgDmData()
      })
    })
}

//水资源监管-分水方案监管-控制断面数据
function querySzyjgFsfajgDmData() {
  const wtYear = wtTime.value.substr(0, 4)
  if (wtTime.value == null || wtTime.value === '') {
    wtTime.value = new Date().Format('yyyy-MM')
  }
  const a = new Date(wtTime.value)
  a.setMonth(a.getMonth() + 1)
  const wtTimeTemp = a.Format('yyyy-MM') + '-02'
  proxy
    .$getWater('/ydr/waterEcoDiversion/rainCondition/queryRVAVData', {
      wtTime: wtTimeTemp,
      wtYear: wtYear
    })
    .then((response) => {
      listDataTemp.value = response.data.data.sxData
      listDataTemp2.value = response.data.data.hbData

      setTimeout(() => {
        emit('changeDate', response.data.data.allData)
      }, 1000)
    })
}

function drawEcharts1(chuJing, muBiao) {
  const pieNumber = ((chuJing / muBiao) * 100).toFixed(0)
  const data = [{ name: '出境', value: pieNumber }]
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartLeft1.value))
  myChart.clear()
  const option = {
    title: [
      // 标题
      {
        text: pieNumber + `%`,
        x: 'center',
        top: '33%',
        textStyle: {
          fontSize: '26',
          color: '#fff',
          foontWeight: '600',
          // 设置字体格式
          fontFamily: 'Microsoft YaHei'
        }
      },
      {
        text: '完成率',
        x: 'center',
        top: '52%',
        textStyle: {
          fontSize: '16',
          color: '#fff',
          foontWeight: '600'
        }
      }
    ],
    polar: {
      radius: ['100%', '60%'],
      center: ['50%', '50%']
    },
    angleAxis: {
      max: 100, //最大刻度
      show: false
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      // 外圈
      {
        name: '出境',
        data: data,
        radius: '100%',
        type: 'bar',
        roundCap: true,
        barWidth: 16,
        showBackground: true,
        backgroundStyle: {
          color: 'transparent'
        },
        coordinateSystem: 'polar',
        // 样式-颜色
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#fcf666' },
              { offset: 0.7, color: '#f1973e' },
              { offset: 1, color: '#ee7e33' }
            ])
          }
        }
      },
      // 内圈
      {
        data: [{ show: false, value: '100' }], //作用不清楚
        name: '灰色内圈', //刻度背景
        type: 'gauge',
        radius: '80%',
        startAngle: '0',
        endAngle: '-359.99',
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[1, '#0d3a79']],
            width: 3,
            opacity: 1 //刻度背景宽度
          }
        },
        splitLine: {
          show: false
        },

        axisLabel: {
          show: false
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        detail: {
          show: 0
        }
      }
    ]
  }

  myChart.setOption(option)
}

function drawEcharts2(chuJing2, muBiao2) {
  const pieNumber = ((chuJing2 / muBiao2) * 100).toFixed(0)
  const data = [{ name: '出境', value: pieNumber }]
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartLeft2.value))
  myChart.clear()
  const option = {
    title: [
      // 标题
      {
        text: pieNumber + `%`,
        x: 'center',
        top: '33%',
        textStyle: {
          fontSize: '26',
          color: '#fff',
          foontWeight: '600',
          // 设置字体格式
          fontFamily: 'Microsoft YaHei'
        }
      },
      {
        text: '完成率',
        x: 'center',
        top: '52%',
        textStyle: {
          fontSize: '16',
          color: '#fff',
          foontWeight: '600'
        }
      }
    ],
    polar: {
      radius: ['100%', '60%'],
      center: ['50%', '50%']
    },
    angleAxis: {
      max: 100, //最大刻度
      show: false
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      // 外圈
      {
        name: '出境',
        data: data,
        radius: '100%',
        type: 'bar',
        roundCap: true,
        barWidth: 16,
        showBackground: true,
        backgroundStyle: {
          color: 'transparent'
        },
        coordinateSystem: 'polar',
        // 样式-颜色
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0fedf0' },
              { offset: 0.7, color: '#0893f0' },
              { offset: 1, color: '#075eab' }
            ])
          }
        }
      },
      // 内圈
      {
        data: [{ show: false, value: '100' }], //作用不清楚
        name: '灰色内圈', //刻度背景
        type: 'gauge',
        radius: '80%',
        startAngle: '0',
        endAngle: '-359.99',
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[1, '#0d3a79']],
            width: 3,
            opacity: 1 //刻度背景宽度
          }
        },
        splitLine: {
          show: false
        },

        axisLabel: {
          show: false
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        detail: {
          show: 0
        }
      }
    ]
  }

  myChart.setOption(option)
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
}

function clickButton2() {
  fadeAnimate('rightDivId', rightButton.value, 'right')

  if (rightButton.value) {
    mapToolPx.value = 20
  } else {
    mapToolPx.value = 430
  }
  rightButton.value = !rightButton.value
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

<style lang="scss" scoped>
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
  width: 400px;
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
  width: 160px;
  text-align: center;
}

.bigNumber {
  color: #00f098;
  font-size: 28px;
  font-weight: bold;
  width: 160px;
  text-align: center;
}

.smallFont {
  margin-top: 10px;
  color: #0087ef;
  font-size: 12px;
}

.middleFont {
  color: #fff;
  font-size: 18px;
}

.middleNumber {
  color: #00f098;
  font-size: 18px;
  font-weight: bold;
  margin-left: 20px;
}

.topDivSty1 {
  height: 55px;
  margin-top: 10px;
  width: 160px;
  float: left;
}

.processBk {
  position: absolute;
  width: 47px;
  height: 20px;
  border: 1px solid #1b4c94;
  top: 18px;
}

:deep(.el-progress-bar__inner) {
  background-color: unset;
  background-image: linear-gradient(to right, #0791ef, #26f193);
}

.topDiv {
  text-align: center;
  box-shadow: 0 0 15px #23487d;
  border-radius: 10px;
  background: linear-gradient(to right, #33333303 0%, #042e6e 100%);
  width: 215px;
  height: 100px;
  border: 1px solid #23487d;
  float: left;
}

:deep(.el-table th) {
  background: linear-gradient(to top, rgba(12, 82, 141, 0.9), rgba(1, 15, 41, 0.8)) !important;
  height: 70px;
  color: #fff;
  font-weight: normal;
  text-align: center;
}

/*body背景*/
:deep(.el-table tr) {
  height: 55px;
  background-color: transparent;
  /*background-color: rgba(1, 15, 41, 0.8);*/
  color: #fff;
  font-size: 15px;
  text-align: center;
  font-weight: bold;
}

:deep(.el-table tbody) {
  background: linear-gradient(
    to top,
    rgba(12, 82, 141, 0.9),
    rgba(1, 15, 41, 0.8),
    rgba(1, 15, 41, 0.8),
    rgba(1, 15, 41, 0.8),
    rgba(1, 15, 41, 0.8),
    rgba(1, 15, 41, 0.8)
  ) !important;
  color: #fff;
}

:deep(.el-table__body-wrapper),
:deep(.el-table),
:deep(.el-table__expanded-cell) {
  background-color: transparent;
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-right: none;
}

:deep(.el-table__inner-wrapper::before) {
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  z-index: 3;
}

:deep(.el-table__border-left-patch) {
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  z-index: 0;
}

:deep(.el-table--border .el-table__inner-wrapper::after) {
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  z-index: 0;
}

:deep(.el-table td),
:deep(.el-table th.is-leaf) {
  border-left: 1px solid #103469;
  border-bottom: 1px solid #103469;
}

:deep(.el-table--border::after) {
  width: 0;
  background-color: #010f29;
}

:deep(.el-table::before) {
  height: 0;
}

:deep(.el-table__header) {
  background-color: rgba(1, 15, 41, 0.8);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover td) {
  background-color: rgba(1, 15, 41, 0.8);
  color: #1b66e0;
}

:deep(.el-table__body tr.hover-row.current-row td),
:deep(.el-table__body tr.hover-row.el-table__row--striped.current-row td),
:deep(.el-table__body tr.hover-row.el-table__row--striped td),
:deep(.el-table__body tr.hover-row td) {
  background-color: rgba(1, 15, 41, 0.8);
  color: #1b66e0;
}

:deep(.el-table__fixed-right::before),
:deep(.el-table__fixed::before) {
  background-color: transparent;
}

/*日期控件样式重定义*/
:deep(.el-input__wrapper) {
  background-color: transparent;
  border: none;
  box-shadow: none;
  color: #fff;
  cursor: pointer;
}

:deep(.el-date-editor.el-input),
:deep(.el-date-editor.el-input__inner) {
  width: 100px;
}

:deep(.el-input__icon) {
  line-height: 21px;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 16px 0 0 16px;
  cursor: pointer;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 16px 16px 0;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: #183f90;
  box-shadow: none;
}

:deep(.el-radio-button__inner) {
  background-color: #00000099;
  color: #fff;
  cursor: pointer;
}

:deep(.el-input__inner) {
  height: 25px;
  border-radius: 15px;
  color: #008df9;
  font-size: 12px;
  background-color: transparent;
  border: 1px solid #145090;
}

:deep(.el-icon-time:before) {
  content: '';
}

:deep(.el-input--prefix .el-input__inner) {
  padding-left: 0;
}

:deep(.el-input--suffix .el-input__inner) {
  padding-left: 0;
  text-align: center;
  cursor: pointer;
}

:deep(.el-input__icon) {
  display: none;
}

:deep(.el-input--suffix .el-input__inner) {
  padding-right: 0;
}

:deep(.el-radio) {
  margin-right: 20px;
  margin-top: 15px;
}

/*日期控件结束*/
.toolDiv {
  width: 50px;
  height: 400px;
  position: absolute;
  margin-top: 170px;
  right: 40px;
}
</style>
