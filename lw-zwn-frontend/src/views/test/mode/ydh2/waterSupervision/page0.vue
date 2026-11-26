<template>
  <div style="">
    <div id="leftDivId" class="out_div_parent_left animate__animated" :style="sideBarHeight">
      <div class="m_container_border_mark_2 m_container_border_mark"></div>
      <div class="sideBar" :style="sideBarHeight" style="width: 400px">
        <div style="width: 400px; height: 400px; border-radius: 10px; position: relative">
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
                >用水总量控制</span
              >
            </div>
            <el-date-picker
              v-model="page0Year"
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
              height: 320px;
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
            <div :id="chartLeft1" style="width: 380px; height: 300px; margin-left: 10px"></div>
          </div>
        </div>
        <div
          style="
            margin-top: 25px;
            width: 400px;
            height: 350px;
            border-radius: 10px;
            position: relative;
          "
        >
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
                >水质达标率</span
              >
            </div>
          </div>
          <div
            style="
              height: 280px;
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
            <div :id="chartLeft2" style="width: 380px; height: 280px; margin-left: 10px"></div>
          </div>
        </div>
        <div class="m_container_border_mark_5 m_container_border_mark"></div>
      </div>
    </div>

    <div id="rightDivId" class="out_div_parent_right animate__animated" :style="sideBarHeight">
      <div class="m_container_border_mark_2 m_container_border_mark"></div>
      <div class="sideBar" :style="sideBarHeight" style="width: 400px; right: 38px">
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
                width: 180px;
                top: 0;
                background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
                background-size: 110% 100%;
              "
            >
              <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 120px"
                >用水效率控制</span
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
              >万元工业增加值用水量增幅</span
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
            <div :id="chartRight1" style="width: 380px; height: 220px; margin-left: 10px"></div>
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
              >农田灌溉水利用系数</span
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
            <divline :linetp="'leftbottomshort'"></divline>
            <divline :linetp="'rightbottomlong'"></divline>
            <div :id="chartRight2" style="width: 380px; height: 220px; margin-left: 10px"></div>
          </div>
        </div>
        <div
          style="
            margin-top: 25px;
            width: 400px;
            height: 240px;
            border-radius: 10px;
            position: relative;
          "
        >
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
          <div style="height: 50px; position: relative">
            <div
              style="
                position: absolute;
                border: none;
                font-size: 16px;
                font-weight: bold;
                color: #fff;
                height: 55px;
                width: 200px;
                top: 0;
                background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
                background-size: 130% 100%;
              "
            >
              <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 150px"
                >最严格制度考核报告</span
              >
            </div>
            <div
              style="
                position: absolute;
                border: none;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                height: 38px;
                width: 174px;
                top: 8px;
                left: 200px;
                background-image: url(/static/img/waterEcoDiversion/waterSupervision/最严格制度考核报告-选择框.png);
                background-size: 100% 100%;
              "
            >
              <span style="position: absolute; top: 11px; left: 40px; height: 16px; width: 150px"
                >考核报告自动生成</span
              >
            </div>
          </div>
          <div
            style="
              height: 180px;
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
            <div
              v-for="(e, i) in fileList"
              :key="i"
              style="margin-top: 10px; height: 45px; width: 400px"
            >
              <div
                style="
                  float: left;
                  width: 40px;
                  height: 43px;
                  margin-left: 30px;
                  background-image: url(/static/img/waterEcoDiversion/waterSupervision/最严格制度考核报告-图标.png);
                "
              ></div>
              <div
                style="
                  float: left;
                  width: 300px;
                  height: 43px;
                  margin-left: 30px;
                  font-size: 14px;
                  color: #0dc2ff;
                  font-weight: bold;
                  line-height: 40px;
                "
              >
                {{ e.fileName }}
              </div>
            </div>
          </div>
        </div>
        <div class="m_container_border_mark_5 m_container_border_mark"></div>
      </div>
    </div>

    <div
      style="
        position: absolute;
        left: calc(50% - 400px);
        top: 120px;
        height: 140px;
        width: 805px;
        background-color: rgba(3, 22, 48, 0.7);
        border: 1px #008df9 solid;
        border-radius: 10px;
      "
    >
      <div style="float: left; height: 140px; width: 159px; border-right: 1px #008df9 dashed">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 50px"
          class="bigFont"
        >
          用水总量
        </div>
        <div style="margin-left: 20px" class="bigNumber">
          21.85<span class="smallFont">亿m³</span>
        </div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比去年同期<span style="color: #00f098; font-weight: bold">+30%</span>
        </div>
      </div>
      <div style="float: left; height: 140px; width: 159px; border-right: 1px #008df9 dashed">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 50px"
          class="bigFont"
        >
          万元工业增加值用水量降幅
        </div>
        <div style="margin-left: 20px" class="bigNumber">8.25<span class="smallFont">%</span></div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比去年<span style="color: #00f098; font-weight: bold">+30%</span>
        </div>
      </div>
      <div style="float: left; height: 140px; width: 159px; border-right: 1px #008df9 dashed">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 50px"
          class="bigFont"
        >
          农田灌溉水利用系数
        </div>
        <div style="margin-left: 20px" class="bigNumber">0.69</div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比去年<span style="color: #00f098; font-weight: bold">+30%</span>
        </div>
      </div>
      <div style="float: left; height: 140px; width: 159px; border-right: 1px #008df9 dashed">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 50px"
          class="bigFont"
        >
          水质达标率
        </div>
        <div style="margin-left: 20px" class="bigNumber">65<span class="smallFont">%</span></div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          比去年<span style="color: #00f098; font-weight: bold">+30%</span>
        </div>
      </div>
      <div style="float: left; height: 140px; width: 155px">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 120px; height: 50px"
          class="bigFont"
        >
          超控制指标省份
        </div>
        <div style="margin-left: 20px; color: #ff9600" class="bigNumber">
          1<span class="smallFont">个</span>
        </div>
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
    <div
      style="
        width: 212px;
        height: 32px;
        position: absolute;
        left: calc(100% - 250px);
        top: 900px;
        z-index: 5;
        background-image: url(/static/img/waterEcoDiversion/注：此页面为测试数据.png);
      "
    ></div>
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

const sideBarHeight = c.computed(() => {
  return {
    height: c.screen_height - 160 + 'px'
  }
})
const page0Year = c.ref('2023')

const dontShowList = ref([])
const mapToolPx = ref(430)
const showMapFlag = ref(true)
const LCName = ref('')

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
const screenWideFlag = c.ref()
const leftButtonPic = c.ref('static/img/waterEcoDiversion/buShui/right-normal.png')
const rightButtonPic = c.ref('static/img/waterEcoDiversion/buShui/left-normal.png')
const rightButton = c.ref(true)
const leftButton = c.ref(true)

c.onMounted(() => {
  fadeAnimate('leftDivId', !leftButton.value, 'left')
  fadeAnimate('rightDivId', !rightButton.value, 'right')
  drawEcharts1()
  drawLineNew1(
    [55, 60, 70, 80, 55],
    [60, 70, 80, 90, 60],
    ['北京市', '天津市', '河北省', '山西省', '内蒙古']
  )
  drawLineNew2(
    [55, 60, 70, 80, 55],
    [60, 70, 80, 90, 60],
    ['北京市', '天津市', '河北省', '山西省', '内蒙古']
  )
  drawLineNew3(
    [0.55, 0.6, 0.7, 0.8, 0.55],
    [0.6, 0.7, 0.8, 0.9, 0.6],
    ['北京市', '天津市', '河北省', '山西省', '内蒙古']
  )
  if (c.screen_width < c.wide_screen_width) {
    screenWideFlag.value = false
  } else {
    screenWideFlag.value = true
  }
  setTimeout(() => {
    emit('changeDate', '')
  }, 1000)
})

function drawEcharts1() {
  const myChart = echarts.init(document.getElementById(chartLeft1.value))
  const result = [
    { name: '内蒙古', value: 0.7, all: 1.5, content: '' },
    { name: '山西省', value: 11.0, all: 15.0, content: '' },
    { name: '河北省', value: 6.95, all: 8.0, content: '' },
    { name: '天津市', value: 0.3, all: 1.0, content: '' },
    { name: '北京市', value: 0.5, all: 1.5, content: '' }
  ]

  const option = {
    grid: {
      top: 5,
      left: 5,
      right: 5,
      bottom: 5
    },
    yAxis: {
      type: 'category',
      splitNumber: 0,
      axisTick: {
        show: false
      },

      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#fff',
        fontSize: 15,
        show: true,
        inside: true,
        margin: 0,
        lineHeight: 35, // lineHeight = 柱子高度 * 2
        align: 'left',
        verticalAlign: 'bottom', // 底部对齐。横向画的时候，axisLabel 在柱子的上面
        rich: {
          name: {
            fontSize: 15,
            fontWeight: 'bold',
            color: '#fff'
          },
          value: {
            fontSize: 15,
            padding: [0, 5, 0, 20],
            fontWeight: 'bold',
            color: '#00E1EF'
          }
        },
        formatter: (d) => {
          let a = ''
          result.forEach((item, i) => {
            if (d === item.name) {
              if (item.content) {
                a = '{name|' + item.name + '}' + '{value|' + item.content + '人}'
              } else {
                a = '{name|' + item.name + '}'
              }
            }
          })
          return a
        }
      },
      splitLine: {
        show: false
      },

      data: result.map((item) => item.name)
    },
    xAxis: {
      type: 'value',
      splitNumber: 0,
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        type: 'bar',
        barGap: '-100%',
        data: result.map((item) => 100),
        barWidth: 12,
        silent: true,
        itemStyle: {
          normal: {
            color: 'rgba(92,92,92,0.6)'
          }
        },
        label: {
          show: true,
          color: '#ff8f39',
          fontSize: 15,
          fontWeight: 'bold',
          formatter: (series) => {
            let a = ''
            result.forEach((e, i) => {
              if (series.name === e.name) {
                a = e.value + '/' + e.all + '亿m³'
              }
            })
            return a
          },
          position: 'insideRight',
          offset: [-5, -18]
        },
        animation: false
      },
      {
        data: result.map((item) => {
          return ((item.value / item.all) * 100).toFixed()
        }),
        type: 'bar',
        barWidth: 12,
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 1, color: '#1a90f9' },
          { offset: 0.7, color: '#62bbab' },
          { offset: 0.5, color: '#ffe01b' },
          { offset: 0, color: '#ff8f39' }
        ])
      },
      {
        name: '外圆',
        type: 'scatter',
        emphasis: {
          scale: false
        },
        symbol: 'rect',
        symbolSize: [3, 16], // 进度条白点
        itemStyle: {
          barBorderRadius: [30, 0, 0, 30],
          color: '#FFF',
          shadowColor: 'rgba(255, 255, 255, 0.5)',
          shadowBlur: 5,
          borderWidth: 1,
          opacity: 1
        },
        z: 2,
        data: result.map((item) => {
          return ((item.value / item.all) * 100).toFixed()
        }),
        animationDelay: 500
      }
    ]
  }
  myChart.setOption(option)
}
function drawLineNew1(data1, data2, tm) {
  const chartDom = document.getElementById(chartLeft2.value)
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
      data: ['实际值', '控制指标'],
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
        name: '单位：%',
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
        name: '实际值',
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
        name: '控制指标',
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
function drawLineNew2(data1, data2, tm) {
  const chartDom = document.getElementById(chartRight1.value)
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
      data: ['实际值', '控制指标'],
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
        name: '单位：%',
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
        name: '实际值',
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
        name: '控制指标',
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
function drawLineNew3(data1, data2, tm) {
  const chartDom = document.getElementById(chartRight2.value)
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
      data: ['实际值', '控制指标'],
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
        name: '无量纲',
        nameTextStyle: {
          color: '#fff',
          padding: [0, 0, 0, -10]
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
        name: '实际值',
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
        name: '控制指标',
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
  fadeAnimate('leftDivId', !leftButton.value, 'left')
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
<style lang="scss" scoped>
.out_div_parent_right {
  /*border: 1px solid red;*/
  position: fixed;
  top: 120px;
  z-index: 3;
  float: right;
  right: 1px;
  width: 430px;
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
.toolDiv {
  width: 50px;
  height: 400px;
  position: absolute;
  margin-top: 170px;
  right: 40px;
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
</style>
