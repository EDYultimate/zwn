<template>
  <div class="topPanel" style="width: 100%; z-index: 2013">
    <div style="position: relative; width: 100%; height: 100px; border-bottom: 1px solid #14386a">
      <div style="position: absolute; left: 0; top: -10px">
        <img src="/static/img/waterEcoDiversion/buShui//tx.png" />
      </div>
      <div style="position: absolute; left: 125px">
        <div>
          <span style="font-size: 20px; font-weight: bold; color: #fff">{{ stnm }}</span>
          <span style="font-size: 14px; color: grey; margin-left: 15px"
            >{{ daterange[1] }} 08:00</span
          >
        </div>
        <div style="font-size: 15px; color: #fff; line-height: 30px; margin-top: 15px">
          <!--          <span style="font-size: 16px;color: #fff;">河道水文站  |  册田水库入库  |  干流水量控制站</span>-->
        </div>
      </div>
      <div style="width: 260px; height: 90px; position: absolute; right: 20px">
        <div style="float: left; margin-left: 30px">
          <div class="bigFont" style="font-size: 18px">日均流量</div>
          <div style="margin-top: 20px">
            <span class="bigNumber" style="font-size: 28px">{{ nowZ }}</span>
            <span class="smallFont"> m³/s</span>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 740px; height: 520px; float: left">
      <el-tabs
        v-model="activeName"
        type="border-card"
        style="background-color: transparent !important"
      >
        <el-tab-pane label="水位流量" name="1">
          <div style="display: inline-block; margin-left: 15px">
            <div style="left: 5px; width: 300px">
              <el-date-picker
                v-model="daterange"
                style="height: 25px; width: 250px"
                type="daterange"
                range-separator="-"
                value-format="YYYY-MM-DD"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="queryRVAVDateData"
              >
              </el-date-picker>
            </div>
            <div style="margin-top: 10px; width: 690px; height: 320px">
              <div class="bigFont" style="text-align: center; margin-top: 5px">
                {{ stnm }}平均流量过程线
              </div>
              <div :id="'main'" style="width: 690px; height: 295px; margin-top: 5px"></div>
            </div>
            <div style="width: 690px; height: 30px; margin-top: -10px">
              <!--              <div class="date" >-->
              <!--                <div class="strip"  :style="` background: linear-gradient(to right,#B3D8FF 0%,#B3D8FF ${dateReach + dateSchedule}%,#e6e6e6  ${dateReach + dateSchedule}%,#e6e6e6 100%);`">-->
              <!--                  <div class="dot" v-for="(i,index) in dateList" :key="index" :style="`left:${index*(100/(dateList.length - 1))-0.5}%;background:${(index*(100/(dateList.length - 1)) <= dateReach) ?'#409EFF':'white'}`">-->
              <!--                    <section class="time">{{i.date}}</section>-->
              <!--                    <section class="title">{{i.title}}</section>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
            <div style="width: 690px; height: 100px; position: relative">
              <div style="float: left; position: relative">
                <div
                  style="
                    width: 82px;
                    height: 65px;
                    float: left;
                    background-image: url(/static/img/waterEcoDiversion/buShui/MAX.png);
                  "
                ></div>
                <div style="width: 130px; height: 65px; float: left">
                  <div class="bigFont">最大流量</div>
                  <div>
                    <span class="bigNumber">{{ maxZ }}</span
                    ><span class="smallFont"> m³/s</span>
                  </div>
                  <div class="middleFont">
                    ({{ returnData(maxZDate) === '-' ? '-' : returnData(maxZDate) + ' 08:00' }})
                  </div>
                </div>
              </div>
              <div style="float: left; position: relative">
                <div
                  style="
                    width: 82px;
                    height: 65px;
                    float: left;
                    background-image: url(/static/img/waterEcoDiversion/buShui/MIN.png);
                  "
                ></div>
                <div style="width: 130px; height: 65px; float: left">
                  <div class="bigFont">最小流量</div>
                  <div>
                    <span class="bigNumber">{{ minZ }}</span
                    ><span class="smallFont"> m³/s</span>
                  </div>
                  <div class="middleFont">
                    ({{ returnData(minZDate) === '-' ? '-' : returnData(minZDate) + ' 08:00' }})
                  </div>
                </div>
              </div>
              <div style="float: left; position: relative">
                <div
                  style="
                    width: 82px;
                    height: 65px;
                    float: left;
                    background-image: url(/static/img/waterEcoDiversion/buShui/AVG.png);
                  "
                ></div>
                <div style="width: 175px; height: 65px; float: left">
                  <div class="bigFont">平均流量</div>
                  <div>
                    <span class="bigNumber">{{ returnData(avgZ) }}</span
                    ><span class="smallFont"> m³/s</span>
                  </div>
                  <div class="middleFont" style="font-size: 13px">
                    ({{ daterange[0] }}~{{ daterange[1] }})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="水量信息" name="2">
          <div style="display: inline-block; margin-left: 15px">
            <div style="left: 5px; width: 300px">
              <el-date-picker
                v-model="daterange2"
                style="height: 25px; width: 250px"
                type="daterange"
                range-separator="-"
                value-format="YYYY-MM-DD"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="queryRVAVDateData4"
              >
              </el-date-picker>
            </div>
            <div style="margin-top: 10px; width: 690px; height: 320px">
              <el-table
                :data="listData2"
                style="width: 90%; float: left; margin-left: 3%"
                height="300px"
                :cell-style="{ 'text-align': 'center', border: '1px solid #135ba0' }"
                :header-cell-style="{
                  'text-align': 'center',
                  border: '1px solid #135ba0',
                  height: '20px'
                }"
              >
                <el-table-column prop="XTM" label="时间"> </el-table-column>
                <el-table-column prop="W" label="水量(万m³)"> </el-table-column>
              </el-table>
            </div>
            <div style="width: 710px; height: 100px">
              <div style="float: left; position: relative">
                <div
                  style="
                    width: 82px;
                    height: 65px;
                    float: left;
                    background-image: url(/static/img/waterEcoDiversion/buShui/MAX.png);
                  "
                ></div>
                <div style="width: 130px; height: 65px; float: left">
                  <div class="bigFont">最大水量</div>
                  <div>
                    <span class="bigNumber">{{ returnData(maxF) }}</span
                    ><span class="smallFont"> 万m³</span>
                  </div>
                  <div class="middleFont">({{ maxT }})</div>
                </div>
              </div>
              <div style="float: left; position: relative">
                <div
                  style="
                    width: 82px;
                    height: 65px;
                    float: left;
                    background-image: url(/static/img/waterEcoDiversion/buShui/MIN.png);
                  "
                ></div>
                <div style="width: 130px; height: 65px; float: left">
                  <div class="bigFont">最小水量</div>
                  <div>
                    <span class="bigNumber">{{ minF }}</span
                    ><span class="smallFont"> 万m³</span>
                  </div>
                  <div class="middleFont">({{ minT }})</div>
                </div>
              </div>
              <div style="float: left; position: relative">
                <div
                  style="
                    width: 82px;
                    height: 65px;
                    float: left;
                    background-image: url(/static/img/waterEcoDiversion/buShui/AVG.png);
                  "
                ></div>
                <div style="width: 175px; height: 65px; float: left">
                  <div class="bigFont">累计水量</div>
                  <div>
                    <span class="bigNumber">{{ returnData(sumF) }}</span
                    ><span class="smallFont"> 万m³</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="基础信息" name="3">
          <stinfo :st-details="stDetails"></stinfo>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-show="activeName === '1' || activeName === '3'" class="rightDiv">
      <div style="width: 100%; height: 40px; line-height: 40px">
        <div class="titleText">视频信息</div>
        <div class="titleRight select_btn">
          <el-select v-model="vswCd" @change="spChange">
            <el-option
              v-for="item in vswList"
              :key="item.vswCd"
              :label="item.dvnm"
              :value="item.vswCd"
              :disabled="item.onLine === 0"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="width: 100%; height: 250px; text-align: center; margin-top: 10px">
        <el-image
          v-show="showVideoFlag"
          style="width: 100%; height: 100%"
          :src="showVideoPic"
          @click="spSrcList[0] ? (showVideoFlag = !showVideoFlag) : ''"
        >
        </el-image>
        <iframe
          v-show="!showVideoFlag"
          style="width: 100%; height: 100%"
          :src="iVideoSrc.spSrc + ';autoplay=1'"
        ></iframe>
      </div>
      <div style="width: 100%; height: 40px; line-height: 40px">
        <div class="titleText">图片信息</div>
      </div>
      <div style="width: 100%; height: 130px; margin-top: 10px">
        <el-carousel :interval="0" type="card" height="120px">
          <el-carousel-item v-for="(item, index) in spSrcList" :key="index">
            <viewer :images="picUrlList">
              <el-image
                :src="item.PICURL"
                height="100%"
                width="100%"
                @click="clickPic(item.PICURL)"
              ></el-image>
            </viewer>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div v-show="activeName === '2'" class="rightDiv">
      <div class="bigFont" style="text-align: center; margin-top: 20px; margin-left: 10px">
        旬统计水量变化
      </div>
      <div
        :id="'main2'"
        style="width: 430px; height: 450px; margin-top: 5px; margin-left: 10px"
      ></div>
    </div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { defineProps } from 'vue'
import c from '@/utils/common/c.js'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'viewerjs/dist/viewer.css'
import env from '../../../setting'
import stinfo from '@/views/waterEcoDiversion/ecoWater/page0/dialog/components/stinfo'
const props = defineProps({
  stcd: {
    type: String
  }
})
c.onMounted(() => {
  queryRVAVDateData()
  queryRVAVDateData4()
  querySpIdByStcd()
})
const stDetails = c.ref({
  type: 'sst',
  stcd: props.stcd
})
const stnm = ref('')
const buttonText = ref('右侧收起')
const transfer = ref({
  foo: 'bar'
})
const ssl_dialogTableVisible = ref(false) //数据率详情弹出框
const activeName = ref('1')
const daterange = ref([
  new Date(new Date().getTime() - 60 * 60 * 24 * 31 * 1000).Format('yyyy-MM-dd'),
  new Date(new Date().getTime()).Format('yyyy-MM-dd')
])
const daterange2 = ref([
  new Date(new Date().getTime()).Format('yyyy') + '-01-01',
  new Date(new Date().getTime()).Format('yyyy-MM-dd')
])
const chartLegend = ref([])
const showVideoFlag = ref(true)
const showVideoPic = ref('/static/img/waterEcoDiversion/ecoWater/tempPic2.png')

const vswCd = ref(null) //选中的视频编码
const vswList = ref([]) //视频list
const getSpid = ref('') //视频地址
const spSrcList = ref([]) //视频图片路径
const picUrlList = ref([]) //预览的图片路径
const videohtml = ref(null)
const player = ref(null)
const iVideoSrc = ref({})

const listData1 = ref([])
const listData2 = ref([])
const dateListTemp = ref([])

const maxZ = ref(0)
const maxZDate = ref('')
const minZ = ref(0)
const minZDate = ref('')
const avgZ = ref(0)
const nowZ = ref(0)

const wtYear = ref('')
const wtType = ref('')
const maxF = ref('')
const maxT = ref('')
const minF = ref('')
const minT = ref('')
const sumF = ref('')

const { proxy } = getCurrentInstance()

function returnData(data) {
  if (!data || data === '' || data === 0.0 || data === 0) {
    return '-'
  }
  return data
}
//日期数组
function getAllDay(start, end) {
  //返回 日期的数组 如 ['2020-07-10','2020-07-11']
  const startTime = getDate(start)
  const endTime = getDate(end)
  const dateArr = []
  while (endTime.getTime() - startTime.getTime() > 0) {
    const year = startTime.getFullYear()
    const month =
      (startTime.getMonth() + 1).toString().length === 1
        ? '0' + (parseInt(startTime.getMonth().toString(), 10) + 1)
        : startTime.getMonth() + 1
    const day =
      startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
    dateArr.push(year + '-' + month + '-' + day)
    startTime.setDate(startTime.getDate() + 1)
  }
  dateArr.push(end)
  dateListTemp.value = dateArr
}
function getDate(datestr) {
  const temp = datestr.split('-')
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1
    temp[1] = '12'
  } else {
    temp[1] = parseInt(temp[1], 10) - 1
  }
  //new Date()的月份入参实际都是当前值-1
  const date = new Date(temp[0], temp[1], temp[2])
  return date
}

function queryRVAVDateData() {
  if (props.stcd === '30722223') {
    proxy
      .$getWater('/ydr/waterEcoDiversion/diversionMonitor/queryBasicStMonitorInfo', {
        stcd: props.stcd,
        wtYear: daterange.value[0].substr(0, 4),
        wtType: '',
        btm: daterange.value[0],
        etm: daterange.value[1]
      })
      .then((res2) => {
        if (res2.data.code == 200) {
          if (res2.data.data.length > 0) {
            const temp0 = res2.data.data[0]
            stnm.value = !temp0.ST_NM || isNaN(temp0.ST_NM) ? '' : temp0.ST_NM
            let maxQ = !temp0.DAVG_FLOW || isNaN(temp0.DAVG_FLOW) ? 0 : temp0.DAVG_FLOW
            let minQ = !temp0.DAVG_FLOW || isNaN(temp0.DAVG_FLOW) ? 0 : temp0.DAVG_FLOW
            let sumQ = 0
            let maxDate = res2.data.data[0].WT_TIME
            let minDate = res2.data.data[0].WT_TIME
            res2.data.data.forEach((e, i) => {
              const qTemp = listData1.value[i].DAVG_FLOW
              const wt = listData1.value[i].WT_TIME
              e.AVQ = qTemp
              e.IDTM = wt
              if (qTemp || qTemp === 0) {
                if (qTemp > maxQ) {
                  maxQ = qTemp
                  maxDate = wt
                }
                if (qTemp < minQ) {
                  minQ = qTemp
                  minDate = wt
                }
                sumQ += qTemp
              }
              if (wt === daterange.value[1]) {
                nowZ.value = qTemp
              }
              listData1.value.push(e)
            })
            maxZDate.value = maxDate
            minZDate.value = minDate
            maxZ.value = maxQ
            minZ.value = minQ
            avgZ.value = (sumQ / listData1.value.length).toFixed(2)
          } else {
            stnm.value = '小红门再生水出口'
          }

          getAllDay(daterange.value[0], daterange.value[1])
          drawLineNew()
        }
      })
  } else {
    proxy
      .$getWater('/ydr/waterEcoDiversion/rainCondition/queryRVAVDateData', {
        stcd: props.stcd,
        btm: daterange.value[0],
        etm: daterange.value[1],
        sttdrcd: '1'
      })
      .then((res) => {
        if (res.data.code == 200) {
          listData1.value = res.data.data
          stnm.value = res.data.data[0].STNM
          let maxQ = listData1.value[0].AVQ
          let minQ = listData1.value[0].AVQ
          let sumQ = 0
          let maxDate = listData1.value[0].IDTM
          let minDate = listData1.value[0].IDTM
          for (let i = 0; i < listData1.value.length; i++) {
            const qTemp = listData1.value[i].AVQ
            const wt = listData1.value[i].IDTM
            if (qTemp || qTemp === 0) {
              if (qTemp > maxQ) {
                maxQ = qTemp
                maxDate = wt
              }
              if (qTemp < minQ) {
                minQ = qTemp
                minDate = wt
              }
              sumQ += qTemp
            }
            if (wt === daterange.value[1]) {
              nowZ.value = qTemp
            }
          }
          maxZDate.value = maxDate
          minZDate.value = minDate
          maxZ.value = maxQ
          minZ.value = minQ
          avgZ.value = (sumQ / listData1.value.length).toFixed(2)
          getAllDay(daterange.value[0], daterange.value[1])
          setTimeout(() => {
            drawLineNew()
          }, 100)
        }
      })
  }
}

function queryRVAVDateData4() {
  if (props.stcd === '30722223') {
    proxy
      .$getWater('/ydr/waterEcoDiversion/diversionMonitor/queryStXunInfo', {
        stcd: props.stcd,
        wtYear: daterange2.value[0].substr(0, 4),
        btm: daterange2.value[0],
        etm: daterange2.value[1]
      })
      .then((res2) => {
        if (res2.data.code == 200) {
          listData2.value = res2.data.data
          listData2.value.reverse()
          let mxf = res2.data.data[0].W
          let mxt = res2.data.data[0].XTM
          let mnf = res2.data.data[0].W
          let mnt = res2.data.data[0].XTM
          let smf = 0
          res2.data.data.forEach((e, i) => {
            if (mxf < e.W) {
              mxf = e.W
              mxt = e.XTM
            }
            if (mnf > e.W) {
              mnf = e.W
              mnt = e.XTM
            }
            smf += e.W
          })
          maxF.value = mxf
          maxT.value = mxt
          minF.value = mnf
          minT.value = mnt
          sumF.value = Number(smf).toFixed(2)
          setTimeout(() => {
            drawLineNew2()
          }, 100)
        }
      })
  } else {
    proxy
      .$getWater('/ydr/waterEcoDiversion/rainCondition/queryRVAVDateData', {
        stcd: props.stcd,
        btm: daterange2.value[0],
        etm: daterange2.value[1],
        sttdrcd: '4'
      })
      .then((res) => {
        if (res.data.code == 200) {
          listData2.value = res.data.data

          let mxf = res.data.data[0].W
          let mxt = res.data.data[0].XTM
          let mnf = res.data.data[0].W
          let mnt = res.data.data[0].XTM
          let smf = 0
          res.data.data.forEach((e, i) => {
            if (mxf < e.W) {
              mxf = e.W
              mxt = e.XTM
            }
            if (mnf > e.W) {
              mnf = e.W
              mnt = e.XTM
            }
            smf += e.W
          })
          maxF.value = mxf
          maxT.value = mxt
          minF.value = mnf
          minT.value = mnt
          sumF.value = Number(smf).toFixed(2)
          setTimeout(() => {
            drawLineNew2()
          }, 100)
        }
      })
  }
}

function drawLineNew2() {
  const charts = echarts.init(document.getElementById('main2'))
  charts.clear()
  const W = []
  const dateListTemp2 = []
  for (let i = 0; i < listData2.value.length; i++) {
    W.push(listData2.value[i].W)
    dateListTemp2.push(listData2.value[i].XTM)
  }
  W.reverse()
  charts.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 30,
      bottom: 50,
      right: 25,
      left: 45
    },
    legend: {
      orient: 'horizontal', //布局方式：  horizontal/vertical
      x: 300, // 水平安放位置，默认为全图居中，可选： 'center' ¦ 'left' ¦ 'right'  或 {number}（x坐标，单位px）
      y: 'top', //垂直安放位置，默认为全图顶端，可选： 'top' ¦ 'bottom' ¦ 'center' 或 {number}（y坐标，单位px）
      itemGap: 5,
      textStyle: {
        // 图例文字大小颜色
        fontSize: 13,
        color: '#ffffff'
      },
      data: '水量'
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateListTemp2,
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: [
      {
        name: '水量 万m³',
        nameTextStyle: {
          color: '#008df9',
          padding: [0, 0, 0, 20]
        },
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#008df9'
          }
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        }
      }
    ],
    series: {
      name: '水量',
      type: 'line',
      data: W,
      smooth: true,
      showSymbol: false,
      color: 'rgb(32, 151, 237)',
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(32, 151, 237, 0.7)' },
            { offset: 1, color: 'rgba(1, 15, 41, 0.9)' }
          ])
        }
      }
    }
  })
}

//查询通过测站编码视频id
function querySpIdByStcd() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/videoIntegration/querySpIdByStcd', { stcd: props.stcd })
    .then((response) => {
      vswList.value = response.data.data
      if (vswList.value.length > 0) {
        vswCd.value = vswList.value[0].vswCd
        spChange()
        querySpPicUrl()
      } else {
        showVideoPic.value = '/static/img/waterEcoDiversion/ecoWater/tempPic.png'
      }
    })
}
function getVideosUrl(val) {
  iVideoSrc.value.vswCd = val
  iVideoSrc.value.comtp = true
  iVideoSrc.value.sh = '0' //右上角默认图片
  proxy.$getEvaluation('/spjk-api/spjk/spd/getApibyCode', { spdcode: val }).then((response) => {
    iVideoSrc.value.spSrc =
      env.evaluationURL +
      '/spjk-api' +
      '/' +
      response.data.url +
      '&ifxh=' +
      vswList.value.indexOf(val)
  })
}
//播放视频
function playFunction() {
  videohtml.value = ''
  if (player.value) {
    player.value.reset()
  }
  proxy
    .$getWater('/ydr/waterEcoDiversion/videoIntegration/previewURLs', {
      mathR: Math.random(),
      cameraIndexCode: vswCd.value
    })
    .then((response) => {
      const getResult = response.data
      const vid = 'v' + vswCd.value + Math.floor(Math.random() * 1000000)
      videohtml.value =
        '<video id="' + vid + '" class="video-js" style="width: 100%;height: 100%;"></video>'
      c.nextTick(() => {
        player.value = videojs(vid, videoOptions(getResult.url), () => {
          player.value.play()
        })
      })
    })
}
function videoOptions(src) {
  return {
    autoplay: true, // true,浏览器准备好时开始播放。
    muted: true, // 默认情况下将会消除音频。
    loop: true, // 导致视频一结束就重新开始。
    controls: true, //视频中的进度条
    preload: 'auto', // auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: 'zh-CN', //汉化
    fluid: true, // 当true时，将按比例缩放以适应其容器。
    sources: [
      {
        type: 'application/x-mpegURL',
        src //视频播放地址
      }
    ],
    notSupportedMessage: '此视频暂无法播放，请稍后再试', // 无法播放媒体源时显示的默认信息。
    textTrackDisplay: false
  }
}
//查询视频点的图片
function querySpPicUrl() {
  showVideoPic.value = '/static/img/waterEcoDiversion/ecoWater/tempPic2.png'
  proxy
    .$getWater('/ydr/waterEcoDiversion/videoIntegration/searchCamerasPicByVswCd', {
      vswCd: vswCd.value
    })
    .then((response) => {
      spSrcList.value = response.data.data
      showVideoPic.value = '/static/img/waterEcoDiversion/ecoWater/tempPic.png'
      if (spSrcList.value[0].PICURL) {
        showVideoPic.value = spSrcList.value[0].PICURL
      }
      if (spSrcList.value[0]) {
        showVideoFlag.value = true
      }
    })
}
//点击图片开始图片预览
function clickPic(v) {
  picUrlList.value = []
  picUrlList.value.push(v)
}
//视频点改变方法
function spChange() {
  querySpPicUrl()
  getVideosUrl(vswCd.value)
}

function drawLineNew() {
  const charts = echarts.init(document.getElementById('main'))
  charts.clear()
  const AVQ = []
  for (let i = 0; i < listData1.value.length; i++) {
    AVQ.push(listData1.value[i].AVQ)
  }
  AVQ.reverse()
  charts.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 30,
      bottom: 50,
      right: 25,
      left: 45
    },
    legend: {
      orient: 'horizontal', //布局方式：  horizontal/vertical
      x: 300, // 水平安放位置，默认为全图居中，可选： 'center' ¦ 'left' ¦ 'right'  或 {number}（x坐标，单位px）
      y: 'top', //垂直安放位置，默认为全图顶端，可选： 'top' ¦ 'bottom' ¦ 'center' 或 {number}（y坐标，单位px）
      itemGap: 5,
      textStyle: {
        // 图例文字大小颜色
        fontSize: 13,
        color: '#ffffff'
      },
      data: '平均流量'
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateListTemp.value,
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: [
      {
        name: '流量 m³/s',
        nameTextStyle: {
          color: '#008df9',
          padding: [0, 0, 0, 20]
        },
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#008df9'
          }
        },
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        }
      }
    ],
    dataZoom: [
      {
        show: true,
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        borderColor: 'transparent',
        width: 500,
        height: 12,
        xAxisIndex: [0],
        bottom: 10,
        left: 100,
        handleIcon: 'image:///static/img/waterEcoDiversion/buShui/datazoom_icon.png',

        handleSize: '110%',
        handleStyle: {
          shadowBlur: 6,
          shadowOffsetX: 1,
          shadowOffsetY: 2,
          shadowColor: '#aaa'
        },
        textStyle: {
          color: 'rgba(204,187,225,0.5)'
        },
        backgroundColor: '#aaa',
        fillerColor: '#00c0ff'
      },
      {
        type: 'inside',
        filterMode: 'weakFilter'
      }
    ],
    series: {
      name: '平均流量',
      type: 'line',
      data: AVQ,
      smooth: true,
      showSymbol: false,
      color: 'rgb(32, 151, 237)',
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(32, 151, 237, 0.7)' },
            { offset: 1, color: 'rgba(1, 15, 41, 0.9)' }
          ])
        }
      }
    }
  })
}
</script>

<style scoped>
.rightDiv {
  width: calc(100% - 740px);
  height: 520px;
  float: left;
}

:deep(.el-tabs--border-card) {
  border: none;
}

:deep(.el-tabs--border-card .el-tabs__header) {
  border-bottom: 1px solid #14386a;
  background-color: transparent !important;
}

:deep(.el-tabs--border-card .el-tabs__header .el-tabs__item.is-active) {
  color: #eef1f3;
  background-color: transparent !important;
  border-bottom-color: #1a89f2;
  border-right-color: #08072a;
  border-left-color: #08072a;
}

:deep(.el-input__icon) {
  line-height: 25px;
}

.select_btn {
  :deep(.el-input.is-focus .el-input__wrapper) {
    box-shadow: none !important;
  }

  :deep(.el-input__inner) {
    border: none !important;
  }
  :deep(.el-input__wrapper) {
    width: 150px;

    background-color: #041627;
    border-radius: 100px;
    border: 1px solid #14598e !important;
    box-shadow: none !important;

    font-weight: 600;

    .el-icon {
      color: #00aaff;
    }

    .el-input__inner {
      color: #fff;
      font-weight: 600;
      height: 24px;
      border: none !important;
    }
  }
}
.titleText {
  float: left;
  font-size: 15px;
  color: #fff;
  margin-left: 15px;
}

.titleRight {
  float: right;
  text-align: center;
  margin-right: 10px;
}

:deep(.el-date-editor.el-input) {
  width: 130px;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #fff;
}
/*日期控件样式重定义*/
:deep(.el-input__wrapper) {
  border-radius: 15px;
  height: 25px;
  background-color: transparent;
  border: 1px solid #1b4c93 !important;
  box-shadow: none;
  color: #fff;
  cursor: pointer;
}

:deep(.el-input__inner) {
  cursor: pointer;
  text-align: center;
  height: 25px;
  border-radius: 15px;
  color: #fff;
  font-size: 12px;
  background-color: transparent;
  border: none !important;
}

:deep(.el-range-input) {
  cursor: pointer;
  border: none;
  border-radius: 15px;
  height: 20px;
  color: #fff;
  font-size: 12px;
}

/*日期控件结束*/

.date {
  margin: 0 auto;
  margin-top: 50%;
  height: 50px;
  display: flex;
  align-items: center;
  overflow: hidden;
  .strip {
    width: 100%;
    margin: 0 40px;
    height: 5px;
    background: rgb(245, 244, 244);
    position: relative;
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3676c0;
      box-shadow: 1px 1px 5px rgb(165, 164, 164);
      position: absolute;
      top: -2px;
      section {
        width: 100%;
        font-size: 0.75rem;
        color: #808080;
        min-width: 100px;
        position: relative;
        left: -45px;
      }
      .time {
        top: -20px;
      }
    }
  }
}

.bigFont {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
}
.bigNumber {
  color: #00f098;
  font-size: 24px;
  font-weight: bold;
}
.smallFont {
  color: #008df9;
  font-size: 12px;
}
.middleFont {
  color: grey;
  font-size: 14px;
}
</style>
