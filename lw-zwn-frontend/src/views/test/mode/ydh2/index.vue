<template>
  <div class="jcgzContainer">
    <div style="position: fixed; top: 120px; right: 550px; z-index: 99999">
      <intellect></intellect>
    </div>

    <div style="position: fixed; left: calc(50% - 225px); top: 110px; display: flex">
      <div class="topDiv" style="margin-left: 20px">
        <div style="height: 70px; width: 210px">
          <div class="keylabel1" style="float: left; margin-top: 17px; margin-left: 25px">
            山西出境
          </div>
          <div
            v-if="sxSj < sxGoal"
            style="
              font-size: 16px;
              float: left;
              margin-left: 25px;
              margin-top: 20px;
              color: red;
              border: 1px solid red;
              border-radius: 10px;
              width: 60px;
            "
            class=""
          >
            未达标
          </div>
          <div
            v-if="sxSj >= sxGoal"
            style="
              font-size: 16px;
              float: left;
              margin-left: 25px;
              margin-top: 20px;
              color: #00a600;
              border: 1px solid green;
              border-radius: 10px;
              width: 60px;
            "
            class=""
          >
            已达标
          </div>
          <div class="keyValue1" style="float: left; margin-left: 20px">
            {{ sxSj }}<span class="keylabel2">亿m³</span>
          </div>
          <div class="keylabel1" style="float: left; margin-left: 10px; line-height: 38px">
            {{ sxGoal }}<span class="keylabel2">亿m³</span>
          </div>
        </div>
      </div>
      <div class="topDiv" style="margin-left: 20px">
        <div style="height: 70px; width: 210px">
          <div class="keylabel1" style="float: left; margin-top: 17px; margin-left: 25px">
            河北出境
          </div>
          <div
            v-if="hbSj < hbGoal"
            style="
              font-size: 16px;
              float: left;
              margin-left: 25px;
              margin-top: 20px;
              color: red;
              border: 1px solid red;
              border-radius: 10px;
              width: 60px;
            "
            class=""
          >
            未达标
          </div>
          <div
            v-if="hbSj >= hbGoal"
            style="
              font-size: 16px;
              float: left;
              margin-left: 25px;
              margin-top: 20px;
              color: green;
              border: 1px solid green;
              border-radius: 10px;
              width: 60px;
            "
            class=""
          >
            已达标
          </div>
          <div class="keyValue1" style="float: left; margin-left: 20px">
            {{ hbSj }}<span class="keylabel2">亿m³</span>
          </div>
          <div class="keylabel1" style="float: left; margin-left: 10px; line-height: 38px">
            {{ hbGoal }}<span class="keylabel2">亿m³</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="sideBar" style="width: 400px;height: 800px;left: 38px;" v-show="leftButton">-->

    <leftSide ref="leftSideRef" style="margin-top: 20px">
      <el-scrollbar :max-height="g.system_h() - 140 + 'px'">
        <backViewOut :t-padding="[8, 5, 8, 5]">
          <title-item-word
            style="width: 466px"
            context="出境水量分析"
            @btn-click="showLeftExportDia = true"
          >
            <el-date-picker
              v-model="wtYear2"
              type="year"
              class="commonDatePickerDiv"
              value-format="YYYY"
              style="width: 120px; height: 27px; position: relative; left: 65px"
              @change="queryRVAVYearData"
            >
            </el-date-picker>
          </title-item-word>
          <backViewIn style="margin-top: 20px">
            <div class="tag1 keylabel1">水文年型</div>
            <div style="width: 100%; height: 90px; margin-top: 25px; margin-left: 20px">
              <div
                style="
                  float: left;
                  background-image: url(/static/img/waterEcoDiversion/obtainWater/chuJingPic1.png);
                  width: 55px;
                  height: 57px;
                "
              ></div>
              <div
                style="float: left; width: 40px; margin-left: 15px; margin-top: 10px"
                class="keylabel1"
              >
                山西
              </div>
              <div
                style="
                  height: 60px;
                  width: calc(100% - 150px);
                  border-left: #005ed2 1px dashed;
                  float: left;
                  margin-left: 20px;
                "
              >
                <div
                  class="keylabel1"
                  style="margin-left: 20px; float: left; width: 120px; height: 30px"
                >
                  天然径流
                </div>
                <div class="keylabel1" style="float: left; width: 120px; height: 30px">
                  水文频率
                </div>
                <div></div>
                <div
                  class="keyValue1"
                  style="margin-left: 20px; float: left; width: 120px; height: 30px"
                >
                  1.48<span class="keyUnits1">亿m³</span>
                </div>
                <div class="keyValue1" style="float: left; width: 120px; height: 30px">
                  48<span class="keyUnits1">%</span>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: 90px; margin-left: 20px">
              <div
                style="
                  float: left;
                  background-image: url(/static/img/waterEcoDiversion/obtainWater/chuJingPic1.png);
                  width: 55px;
                  height: 57px;
                "
              ></div>
              <div
                style="float: left; width: 40px; margin-left: 15px; margin-top: 10px"
                class="keylabel1"
              >
                河北
              </div>
              <div
                style="
                  height: 60px;
                  width: calc(100% - 150px);
                  border-left: #005ed2 1px dashed;
                  float: left;
                  margin-left: 20px;
                "
              >
                <div
                  class="keylabel1"
                  style="margin-left: 20px; float: left; width: 120px; height: 30px"
                >
                  天然径流
                </div>
                <div class="keylabel1" style="float: left; width: 120px; height: 30px">
                  水文频率
                </div>
                <div></div>
                <div
                  class="keyValue1"
                  style="margin-left: 20px; float: left; width: 120px; height: 30px"
                >
                  1.38<span class="keyUnits1">亿m³</span>
                </div>
                <div class="keyValue1" style="float: left; width: 120px; height: 30px">
                  28<span class="keyUnits1">%</span>
                </div>
              </div>
            </div>
          </backViewIn>
          <backViewIn style="margin-top: 20px">
            <div style="position: relative; width: 100%; height: 480px">
              <div class="tag1 keylabel1">出境水量完成情况</div>
              <div
                style="
                  width: 400px;
                  height: 180px;
                  margin-top: 20px;
                  margin-left: 20px;
                  position: relative;
                "
              >
                <div class="keylabel1" style="position: absolute; width: 150px; height: 20px">
                  山西
                </div>
                <div
                  :id="chartLeft1"
                  style="width: 200px; height: 200px; float: left; margin-left: 30px"
                ></div>
                <div
                  class="keylabel1"
                  style="
                    float: left;
                    width: 150px;
                    height: 20px;
                    margin-top: 70px;
                    margin-left: 20px;
                  "
                >
                  出境<span class="keyValue3">{{ sxSj }}</span
                  >亿m³
                </div>
                <div
                  class="keylabel1"
                  style="
                    float: left;
                    width: 150px;
                    height: 20px;
                    margin-top: 20px;
                    margin-left: 20px;
                  "
                >
                  目标<span class="keyValue3">{{ sxGoal }}</span
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
                <div class="keylabel1" style="position: absolute; width: 150px; height: 20px">
                  河北
                </div>
                <div
                  :id="chartLeft2"
                  style="width: 200px; height: 200px; float: left; margin-left: 30px"
                ></div>
                <div
                  class="keylabel1"
                  style="
                    float: left;
                    width: 150px;
                    height: 20px;
                    margin-top: 70px;
                    margin-left: 20px;
                  "
                >
                  出境<span class="keyValue3">{{ hbSj }}</span
                  >亿m³
                </div>
                <div
                  class="keylabel1"
                  style="
                    float: left;
                    width: 150px;
                    height: 20px;
                    margin-top: 20px;
                    margin-left: 20px;
                  "
                >
                  目标<span class="keyValue3">{{ hbGoal }}</span
                  >亿m³
                </div>
              </div>
            </div>
          </backViewIn>
        </backViewOut>
      </el-scrollbar>
    </leftSide>
    <rightSide
      ref="rightSideRef"
      style="margin-top: 20px"
      :map-tool-show="true"
      :dont-show="[4, 5, 6, 7, 8]"
    >
      <el-scrollbar :max-height="g.system_h() - 140 + 'px'">
        <backViewOut :t-padding="[8, 5, 8, 5]">
          <title-item-word
            style="width: 466px"
            context="实时监测数据"
            :is-click-btn="false"
            @btn-click=""
          >
            <div
              class="keylabel4_c"
              style="float: left; position: relative; right: 30px; top: 4px; color: #ffffff"
            >
              截止
            </div>
            <el-date-picker
              v-model="wtTime"
              placeholder="请选择"
              class="commonDatePickerDiv"
              style="float: left; width: 130px; height: 27px; position: relative; right: 10px"
              type="month"
              value-format="YYYY-MM"
              @change="querySzyjgFsfajgDmData"
            />
          </title-item-word>
          <backViewIn style="margin-top: 20px">
            <div style="height: 500px; width: 100%; position: relative">
              <div class="tag2 keylabel1">山西控制断面</div>
              <div class="myRightTable" style="margin-top: 20px; margin-left: 20px; height: 220px">
                <el-table
                  border
                  border
                  :data="listDataTemp"
                  height="210px"
                  style="width: 100%; text-align: center; z-index: 3"
                  :cell-style="{ 'text-align': 'center' }"
                >
                  <el-table-column prop="STNM" label="断面"> </el-table-column>
                  <el-table-column prop="AVQSUM" :label="'累计过水量 (万m³)'">
                    <template #default="scope">
                      <span>{{ scope.row.AVQSUM.toFixed(2) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="tag2 keylabel1">河北控制断面</div>
              <div class="myRightTable" style="margin-top: 20px; margin-left: 20px; height: 150px">
                <el-table
                  border
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
          </backViewIn>
        </backViewOut>
      </el-scrollbar>
    </rightSide>

    <div style="">
      <mapTool
        v-if="showMapFlag"
        class="toolDiv"
        :style="'right: ' + mapToolPx + 'px'"
        :dont-show="dontShowList"
        :LCName="LCName"
      ></mapTool>
    </div>
    <adaptionView>
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
    </adaptionView>

    <adaptionView>
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
    </adaptionView>
  </div>
</template>

<script setup>
import '@/assets/text/text.css'
import router from '@/router'
import c from '@/utils/common/c.js'
import store from '@/store/index.js'
import * as echarts from 'echarts'
import { watch, defineEmits } from 'vue'
import mapTool from '/mapTool/index.vue'
import fenShuiStationDetail from '/waterSupervision/fenShuiStationDetail'
import shuiLiangFenXi from '/waterSupervision/shuiLiangFenXi'
import intellect from '@/views/knowledge/components/intellect/index.vue'
import g from '@/utils/common/g.js'
import leftSide from '/components/leftSide.vue'
import rightSide from '/components/rightSide.vue'
import backViewOut from '/components/backViewOut.vue'
import backViewIn from '/components/backViewIn'
import titleItemWord from '/components/titleItemWord'
import adaptionView from '/components/adaptionView.vue'
import mapControl from '/mapControl/control.js'
import { get2DMapSource } from '/mapControl/ctrl2dFunction'

mapControl('2d_17')

const rightSideRef = ref()
const leftSideRef = ref()

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
  // window.addEventListener('message', handleMessageFsfakh);//注册消息监听，用于GIS向页面传递值
  queryRVAVLatestData()
  queryRVAVYearData()
  window.openDia_st = openDia_st
})

const wtYear2 = ref(new Date().getFullYear() + '')
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

      get2DMapSource('kaohepinggu').then((source) => {
        source.change('fenshuifangan', response.data.data.allData)
      })
      // setTimeout(() => {
      //   gisevent.value.source.change('fenshuifangan',response.data.data.allData);
      // }, 1000)
    })
}
//
// const gisevent = ref()
// function handleMessageFsfakh(event){
//   if(event.data.type === 'kaohepinggu') {
//     gisevent.value = event;
//   }
// }

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

function changeModels(param) {
  activeOption.value = param
  //刷新一下地图工具栏的位置,由于右侧框的宽度可能改变了
  rightSideRef.value.refreDistance()

  //在当前路由记录一下当前点击的是哪个，方便页面跳转返回后继续默认选中
  const rp = route.path + '?item=' + param
  router.replace(rp)
}
</script>

<style lang="scss" scoped>
.jcgzContainer {
  z-index: 2;
  position: absolute;
  width: 100%;
  top: 100px;

  .leftDiv {
    position: absolute;
    left: 32px;

    // padding-top: calc(50vh - 355px);
  }
  .rightDiv {
  }
}
.topDiv {
  width: 210px;
  height: 86px;
  text-align: center;
  background-image: linear-gradient(rgba(6, 38, 80, 0.6), rgba(6, 38, 80, 0.6));
  background-blend-mode: normal, normal;
  border-radius: 43px;
  border: solid 1px #62b0ff;
}

.tag1 {
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: center;
  margin-top: 15px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('/static/img/waterEcoDeploy/viewelement/khpg/stllkh/tag_q.png');
}
.tag2 {
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: center;
  margin-top: 15px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('/static/img/waterEcoDeploy/viewelement/khpg/stllkh/tag_s.png');
}
.myRightTable {
  width: 420px;
  /**el-table*/

  :deep(.el-table th) {
    background: linear-gradient(to top, #0e5d9e, #041533) !important;
    height: 60px;
    color: #fff;
    font-weight: normal;
    text-align: center;
  }

  /*body背景*/
  :deep(.el-table tr) {
    height: 50px;
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
      rgba(12, 82, 141, 0.5),
      rgba(1, 15, 41, 0.4),
      rgba(1, 15, 41, 0.4),
      rgba(1, 15, 41, 0.4),
      rgba(1, 15, 41, 0.4),
      rgba(1, 15, 41, 0.4)
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
}
</style>
