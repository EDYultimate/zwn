<template>
  <div style="">
    <div v-show="rightButton" class="sideBar" style="width: 400px; height: 800px; left: 38px">
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
              >用水量统计</span
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
            >按行政区统计</span
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
            margin-top: 20px;
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
            >按用水行业统计</span
          >
        </div>
        <div
          style="
            position: relative;
            margin-top: 30px;
            height: 230px;
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
    </div>
    <div v-show="leftButton" class="sideBar" style="width: 400px; height: 800px; right: 38px">
      <div style="width: 400px; height: 400px; border-radius: 10px; position: relative">
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
              width: 190px;
              top: 0;
              background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
              background-size: 120% 100%;
            "
          >
            <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 140px"
              >管控指标完成情况</span
            >
          </div>
        </div>
        <div
          style="
            position: relative;
            border-top: 1px solid rgb(14, 93, 158);
            border-bottom: 1px solid rgb(14, 93, 158);
            height: 88px;
            width: 388px;
            background: linear-gradient(
              to top,
              rgba(12, 82, 141, 0.5),
              rgba(1, 15, 41, 0.5),
              rgba(1, 15, 41, 0.5)
            ) !important;
          "
        >
          <divline :linetp="'lefttoplong'"></divline>
          <divline :linetp="'righttopshort'"></divline>
          <divline :linetp="'leftbottomshort'"></divline>
          <divline :linetp="'rightbottomlong'"></divline>
          <div
            style="
              float: left;
              height: 68px;
              margin-top: 10px;
              width: 138px;
              border-right: 1px #0a67c5 dashed;
            "
          >
            <div
              style="width: 138px; height: 20px; margin-top: 10px; text-align: center"
              class="bigFont"
            >
              用水总量
            </div>
            <div
              style="width: 138px; height: 20px; margin-top: 5px; text-align: center"
              class="bigNumber"
            >
              19.00<span class="smallFont2">亿m³</span>
            </div>
          </div>
          <div
            style="
              float: left;
              height: 68px;
              margin-top: 10px;
              width: 110px;
              border-right: 1px #0a67c5 dashed;
            "
          >
            <div
              style="width: 110px; height: 20px; margin-top: 10px; text-align: center"
              class="bigFont"
            >
              比多年平均
            </div>
            <div
              style="
                width: 110px;
                height: 20px;
                margin-top: 5px;
                text-align: center;
                color: #ff9600;
              "
              class="bigNumber"
            >
              +30%
            </div>
          </div>
          <div style="float: left; height: 68px; margin-top: 10px; width: 138px">
            <div
              style="width: 138px; height: 20px; margin-top: 10px; text-align: center"
              class="bigFont"
            >
              管控指标
            </div>
            <div
              style="width: 138px; height: 20px; margin-top: 5px; text-align: center"
              class="bigNumber"
            >
              22.00<span class="smallFont2">亿m³</span>
            </div>
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            height: 240px;
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
          <div :id="chartRight3" style="width: 380px; height: 240px; margin-left: 10px"></div>
        </div>
      </div>
      <div
        style="
          margin-top: 25px;
          width: 400px;
          height: 260px;
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
              width: 190px;
              top: 0;
              background-image: url(/static/img/waterEcoDiversion/buShui/tlbk.png);
              background-size: 120% 100%;
            "
          >
            <span style="position: absolute; top: 19px; left: 10px; height: 16px; width: 140px"
              >用水总量评估报告</span
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
              >评估报告自动生成</span
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
    </div>
    <div
      style="
        position: absolute;
        left: calc(50% - 160px);
        top: 120px;
        height: 120px;
        width: 335px;
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
          用水总量
        </div>
        <div style="margin-left: 20px" class="bigNumber">
          19.00<span class="smallFont">亿m³</span>
        </div>
        <div style="margin-left: 20px; margin-top: 5px" class="smallFont">
          控制指标<span style="color: #00f098; font-weight: bold">22.0亿</span>
        </div>
      </div>
      <div style="float: left; height: 140px; width: 165px">
        <div
          style="margin-left: 20px; margin-top: 20px; width: 170px; height: 50px"
          class="bigFont"
        >
          超管控指标区域
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

const dontShowList = ref([])
const mapToolPx = ref(430)
const showMapFlag = ref(true)
const LCName = ref('')
const emit = defineEmits(['changeDate'])

const fileList = c.ref([
  { fileName: '2022年用水总量评估报告', fileUrl: '' },
  { fileName: '2021年用水总量评估报告', fileUrl: '' },
  { fileName: '2020年用水总量评估报告', fileUrl: '' }
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

c.onMounted(() => {
  if (c.screen_width < c.wide_screen_width) {
    screenWideFlag.value = false
  } else {
    screenWideFlag.value = true
  }
  setTimeout(() => {
    emit('changeDate', '')
  }, 1000)
  drawEcharts1()
  drawEcharts2()
  drawEcharts3(
    [0.45, 0.35, 10.7, 6.8, 0.7],
    [0.8, 0.7, 12, 7.5, 1],
    ['北京市', '天津市', '河北省', '山西省', '内蒙古']
  )
})

function drawEcharts1() {
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
    { name: '工业', value: 3 },
    { name: '农业', value: 12 },
    { name: '生活', value: 3 },
    { name: '生态', value: 1 }
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
        x: '17%',
        y: '32%',
        textStyle: {
          fontSize: 20,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '亿m³',
        x: '24%',
        y: '33%',
        textStyle: {
          fontSize: 12,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '总数',
        x: '19%',
        y: '48%',
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
            padding: [0, 0, 0, 20]
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
function drawEcharts2() {
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
    { name: '地表水', value: 8 },
    { name: '地下水', value: 10 },
    { name: '其他', value: 1 }
  ]
  let sum = 0
  data.forEach((e, i) => {
    sum += e.value
  })
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartRight2.value))
  myChart.clear()
  const option = {
    // 标题设置
    title: [
      {
        text: sum,
        x: '17%',
        y: '32%',
        textStyle: {
          fontSize: 20,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '亿m³',
        x: '24%',
        y: '33%',
        textStyle: {
          fontSize: 12,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 30
        }
      },
      {
        text: '总数',
        x: '19%',
        y: '48%',
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
            fontWeight: 'bold',
            width: 40
          },
          value: {
            fontSize: 14,
            fontWeight: 'bold',
            padding: [0, 0, 0, 20]
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
    tooltip: {
      trigger: 'item',
      formatter: '{b}{a}: {c}亿m³'
    },
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
        name: '单位：亿m³',
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

function clickButton1() {
  leftButton.value = !leftButton.value
  c.nextTick(() => {})
}
function clickButton2() {
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
.buttonSide {
  position: absolute;
  z-index: 2;
  top: 222px;
  width: 40px;
  height: 560px;
}
.sideBar {
  position: absolute;
  z-index: 2;
  top: 100px;
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
.toolDiv {
  width: 50px;
  height: 400px;
  position: absolute;
  margin-top: 170px;
  right: 40px;
}
</style>
