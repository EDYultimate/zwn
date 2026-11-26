<template>
  <div style="width: 100%; height: 100%">
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleTabClick"
      style="background-color: transparent !important"
    >
      <el-tab-pane label="水文年型" name="1">
        <div style="height: 600px; width: 100%; vertical-align: center; color: #fff">
          <div style="width: 1180px; height: 30px">
            <el-date-picker
              v-model="wtYear"
              size="small"
              type="year"
              placeholder="选择年份"
              value-format="YYYY"
              style="float: left;width: 90px;margin-left: 10px"
              @change="">
            </el-date-picker>
            <span style="float: right; margin-right: 20px"> 注: 采用还原天然径流进行频率分析 </span>
          </div>
          <div style="float: left; width: 550px; height: 550px; position: relative">
            <div style="width: 550px" class="titleDiv">
              <div
                style="
                  margin-left: 20px;
                  width: 110px;
                  margin-top: 8px;
                  height: 104px;
                  border-right: 1px #008df9 dashed;
                  float: left;
                "
              >
                <div class="bigNumber" style="margin-top: 5px; color: #1ee7e7">
                  1.47<span style="color: #9ed5ff; font-size: 14px">亿m³</span>
                </div>
                <div class="smallFont" style="">年天然径流量</div>
                <div class="bigNumber" style="margin-top: 5px; color: #1ee7e7">
                  48<span style="color: #9ed5ff; font-size: 14px">%</span>
                </div>
                <div class="smallFont" style="">水文频率</div>
              </div>
              <div style="position: absolute; left: calc(50% + 30px); top: 10px" class="smallFont">
                山西省
              </div>
              <div
                v-for="(item, index) in dateDataList.filter((obj) => obj.tp === '1')"
                :key="index"
                style="
                  float: left;
                  width: 90px;
                  height: 80px;
                  background: linear-gradient(to bottom, #071d42, #0a2b57);
                  margin-top: 30px;
                  margin-left: 11px;
                "
              >
                <div
                  style="
                    text-align: center;
                    margin-top: 10px;
                    width: 90px;
                    height: 30px;
                    font-size: 19px;
                  "
                  class="bigNumber"
                >
                  {{ item.nm }}<span style="color: #9ed5ff; font-size: 12px">亿m³</span>
                </div>
                <div
                  style="
                    text-align: center;
                    margin-top: 10px;
                    width: 90px;
                    height: 30px;
                    font-size: 15px;
                  "
                  class="bigFont"
                >
                  {{ item.va }}
                </div>
              </div>
            </div>
            <div class="smallFont" style="margin-top: 10px; font-size: 16px; text-align: center">
              永定河山西1956-2022年天然径流频率曲线
            </div>
            <el-image
              src="/static/img/waterEcoDiversion/waterProtect/sxChuJingJingLiuPinLv.png"
              fit="cover"
              lazy
              style="width: 550px; height: 404px"
              :preview-src-list="[
                '/static/img/waterEcoDiversion/waterProtect/sxChuJingJingLiuPinLv.png'
              ]"
            >
            </el-image>
            <!--          <div style="background-image: url();width: 550px;height: 404px;background-size: cover"></div>-->
          </div>
          <div
            style="float: left; margin-left: 40px; width: 550px; height: 550px; position: relative"
          >
            <div style="width: 550px" class="titleDiv">
              <div
                style="
                  margin-left: 20px;
                  width: 110px;
                  margin-top: 8px;
                  height: 104px;
                  border-right: 1px #008df9 dashed;
                  float: left;
                "
              >
                <div class="bigNumber" style="margin-top: 5px; color: #1ee7e7">
                  1.38<span style="color: #9ed5ff; font-size: 14px">亿m³</span>
                </div>
                <div class="smallFont" style="">年天然径流量</div>
                <div class="bigNumber" style="margin-top: 5px; color: #1ee7e7">
                  28<span style="color: #9ed5ff; font-size: 14px">%</span>
                </div>
                <div class="smallFont" style="">水文频率</div>
              </div>
              <div style="position: absolute; left: calc(50% + 30px); top: 10px" class="smallFont">
                河北省
              </div>
              <div
                v-for="(item, index) in dateDataList.filter((obj) => obj.tp === '2')"
                :key="index"
                style="
                  float: left;
                  width: 90px;
                  height: 80px;
                  background: linear-gradient(to bottom, #071d42, #0a2b57);
                  margin-top: 30px;
                  margin-left: 11px;
                "
              >
                <div
                  style="
                    text-align: center;
                    margin-top: 10px;
                    width: 90px;
                    height: 30px;
                    font-size: 19px;
                  "
                  class="bigNumber"
                >
                  {{ item.nm }}<span style="color: #9ed5ff; font-size: 12px">亿m³</span>
                </div>
                <div
                  style="
                    text-align: center;
                    margin-top: 10px;
                    width: 90px;
                    height: 30px;
                    font-size: 15px;
                  "
                  class="bigFont"
                >
                  {{ item.va }}
                </div>
              </div>
            </div>
            <div class="smallFont" style="margin-top: 10px; font-size: 16px; text-align: center">
              永定河河北1956-2022年天然径流频率曲线
            </div>
            <el-image
              src="/static/img/waterEcoDiversion/waterProtect/hbChuJingJingLiuPinLv.png"
              fit="cover"
              lazy
              style="width: 550px; height: 404px"
              :preview-src-list="[
                '/static/img/waterEcoDiversion/waterProtect/hbChuJingJingLiuPinLv.png'
              ]"
            >
            </el-image>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="出境水量完成情况" name="2">
        <div style="height: 100%; width: 100%; vertical-align: center; color: #fff">
          <div style="width: 100%; height: 30px; margin-bottom: 10px">
            <el-date-picker
              v-model="wtYear2"
              size="small"
              type="year"
              placeholder="选择年份"
              value-format="YYYY"
              style="float: left;width: 90px;margin-left: 10px"
              @change="queryRVAVYearData">
            </el-date-picker>
            <span style="float: right; margin-right: 20px">
              山西、河北断面过水量表中单位均为万m³
            </span>
          </div>
          <div style="width: 560px; float: left">
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
              <span style="margin-left: 20px">山西控制断面</span>
            </div>
            <div style="width: 420px; height: 90px; margin-left: calc(50% - 210px)">
              <div style="" class="div1ShuiLiangFenXi">
                <div style="" class="bigFont div2ShuiLiangFenXi">完成率</div>
                <div style="" class="bigNumber div3ShuiLiangFenXi">
                  {{ Number(((sxSj / 1.21) * 100).toFixed())
                  }}<span style="color: #9ed5ff; font-size: 14px">%</span>
                </div>
              </div>
              <div style="" class="div1ShuiLiangFenXi">
                <div style="" class="bigFont div2ShuiLiangFenXi">实际出境水量</div>
                <div style="" class="bigNumber div3ShuiLiangFenXi">
                  {{ sxSj }}<span style="color: #9ed5ff; font-size: 14px">亿m³</span>
                </div>
              </div>
              <div style="" class="div1ShuiLiangFenXi">
                <div style="" class="bigFont div2ShuiLiangFenXi">出境水量目标</div>
                <div style="" class="bigNumber div3ShuiLiangFenXi">
                  1.21<span style="color: #9ed5ff; font-size: 14px">亿m³</span>
                </div>
              </div>
            </div>
            <div style="width: calc(100% - 20px); margin-left: 10px; margin-top: 30px">
              <el-table
                border
                :cell-style="{ 'text-align': 'center', border: '1px solid #135ba0' }"
                :header-cell-style="{
                  'text-align': 'center',
                  border: '1px solid #135ba0',
                  height: '20px'
                }"
                :data="listData1"
                height="380px"
              >
                <el-table-column prop="IDTM" width="200" label="时间"> </el-table-column>
                <el-table-column prop="NYH" label="南洋河出境"> </el-table-column>
                <el-table-column prop="SGH" label="桑干河出境"> </el-table-column>
                <el-table-column prop="HLH" label="壶流河出境"> </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="width: 560px; margin-left: 40px; float: left">
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
              <span style="margin-left: 20px">河北控制断面</span>
            </div>
            <div style="width: 420px; height: 90px; margin-left: calc(50% - 210px)">
              <div style="" class="div1ShuiLiangFenXi">
                <div style="" class="bigFont div2ShuiLiangFenXi">完成率</div>
                <div style="" class="bigNumber div3ShuiLiangFenXi">
                  {{ Number(((hbSj / 3.09) * 100).toFixed())
                  }}<span style="color: #9ed5ff; font-size: 14px">%</span>
                </div>
              </div>
              <div style="" class="div1ShuiLiangFenXi">
                <div style="" class="bigFont div2ShuiLiangFenXi">实际出境水量</div>
                <div style="" class="bigNumber div3ShuiLiangFenXi">
                  {{ hbSj }}<span style="color: #9ed5ff; font-size: 14px">亿m³</span>
                </div>
              </div>
              <div style="" class="div1ShuiLiangFenXi">
                <div style="" class="bigFont div2ShuiLiangFenXi">出境水量目标</div>
                <div style="" class="bigNumber div3ShuiLiangFenXi">
                  3.09<span style="color: #9ed5ff; font-size: 14px">亿m³</span>
                </div>
              </div>
            </div>
            <div style="width: calc(100% - 20px); margin-left: 10px; margin-top: 30px">
              <el-table
                border
                :cell-style="{ 'text-align': 'center', border: '1px solid #135ba0' }"
                :header-cell-style="{
                  'text-align': 'center',
                  border: '1px solid #135ba0',
                  height: '20px'
                }"
                :data="listData2"
                height="380px"
              >
                <el-table-column prop="IDTM" label="时间"> </el-table-column>
                <el-table-column prop="HB" label="河北出境"> </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历年考核结果" name="3">
        <div style="height: 100%; width: 100%; vertical-align: center; color: #fff">
          <div
            style="
              cursor: pointer;
              height: 35px;
              width: 700px;
              margin-left: 10px;
              padding-top: 8px;
              position: relative;
            "
            v-for="(te, index) in khjgData"
            :key="index"
            @click="
              reviewExportDia = true
              reportReview(te.FILE_ID, 'KHJG')
            "
          >
            <div
              style="
                float: left;
                width: 25px;
                height: 32px;
                background-size: cover;
                background-image: url(/static/img/waterEcoDiversion/waterProtect/rightBottomT.png);
              "
            ></div>
            <div style="float: left; width: 670px; height: 30px; margin-left: 5px">
              <div
                style="
                  font-size: 18px;
                  font-weight: bold;
                  color: #fff;
                  line-height: 25px;
                  text-align: left;
                "
              >
                {{ te.FILE_NM }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :modal="true"
      title="报告预览"
      v-model="reviewExportDia"
      :modal-append-to-body="false"
      :append-to-body="true"
      destroy-on-close
      center
    >
      <!--                <div class="docWrap">-->
      <!--                  &lt;!&ndash; 预览文件的地方（用于渲染） &ndash;&gt;-->
      <!--                  <div ref="preload_box" id="preload_box"></div>-->
      <!--                </div>-->
      <div style="width: 100%; height: 650px">
        <div
          v-if="loading"
          style="width: 100%; height: 650px; text-align: center; line-height: 400px"
        >
          加载中...
        </div>
        <iframe v-if="!loading" :src="pdfSrc" frameborder="0" style="width: 100%; height: 650px">
        </iframe>
      </div>
      <!--                <pdf :src="pdfSrc"></pdf>-->
      <!--      <div ref="docsRef"></div>-->
    </el-dialog>
  </div>
</template>

<script setup>
import router from '@/router'
import c from '@/utils/common/c.js'
import * as echarts from 'echarts'

const { proxy } = getCurrentInstance()
const wtTime = c.ref(new Date().Format('yyyy-MM-dd'))

const wtYear = c.ref(new Date().Format('yyyy'))
const wtYear2 = c.ref(new Date().Format('yyyy'))

const activeName = c.ref('1')

const listData1 = ref([])
const listData2 = ref([])

const dateDataList = c.ref([
  { nm: '1.77', va: '25%', tp: '1' },
  { nm: '1.45', va: '50%', tp: '1' },
  { nm: '1.19', va: '75%', tp: '1' },
  { nm: '1.51', va: '多年平均', tp: '1' },

  { nm: '1.42', va: '25%', tp: '2' },
  { nm: '1.13', va: '50%', tp: '2' },
  { nm: '0.88', va: '75%', tp: '2' },
  { nm: '1.18', va: '多年平均', tp: '2' }
])

c.onMounted(() => {
  queryRVAVLatestData()
})
function queryRVAVLatestData() {
  proxy
    .$getWater('/ydr/waterEcoDiversion/rainCondition/queryRVAVLatestData', {})
    .then((response) => {
      wtYear.value = response.data.data.IDTM.substring(0, 4)
      wtYear2.value = response.data.data.IDTM.substring(0, 4)
      c.nextTick(() => {})
    })
  })
}
const khjgData = c.ref([])
function queryKaoHeJieGuo() {
  proxy.$getWater('/ydr/waterEcoDiversion/rainCondition/queryKaoHeJieGuo', {}).then((response) => {
    if (response.data.code === 200) {
      khjgData.value = response.data.data
    }
  })
}

const reviewExportDia = c.ref(false)
const exportDiaYear = c.ref(false)
const loading = c.ref(true)
const pdfSrc = c.ref()
const docsRef = c.ref()
function reportReview(fileId, mangCd) {
  pdfSrc.value = null
  loading.value = true
  proxy.$postWaterBlob("/ydr/waterEcoDiversion/waterProtect/downloadReport",
      fileId: fileId,
      mangCd: mangCd
    })
    .then((res) => {
      let url = null
      const blob = new Blob([res.data], { type: 'application/pdf' })
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(blob)
      } else if (window.webkitURL != undefined) {
        // 兼容谷歌
        try {
          url = window.webkitURL.createObjectURL(blob)
        } catch (error) {}
      } else if (window.URL != undefined) {
        // 兼容其他
        try {
          url = window.URL.createObjectURL(blob)
        } catch (error) {}
      }
      pdfSrc.value = url
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
}

const sxSj = ref(0.0)
const hbSj = ref(0.0)
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
      listData1.value = response.data.data.sxData
      listData1.value.forEach((e) => {
        sumD1 = sumD1 + e.NYH + e.SGH + e.HLH
      })
      listData2.value = response.data.data.hbData
      listData2.value.forEach((e) => {
        sumD2 = sumD2 + e.HB
      })
      sxSj.value = Number(sumD1 / 10000).toFixed(2)
      hbSj.value = Number(sumD2 / 10000).toFixed(2)
    })
}

function handleTabClick(tab, event) {
  if (tab.props.name === '1') {
  } else if (tab.props.name === '2') {
    queryRVAVYearData()
  } else if (tab.props.name === '3') {
    queryKaoHeJieGuo()
  }
}
</script>

<style scoped>
/*.normalFont{*/
/*  margin-left: 70px;font-weight: bold;*/
/*  color: #fff;*/
/*}*/
:deep(.el-table--enable-row-hover .el-table__body tr) {
  background-color: #09254e;
  color: #fff;
  font-weight: bold;
}
:deep(.el-table--enable-row-hover .el-table__body tr:hover td) {
  background-color: #064d84;
  color: #00f098;
  font-weight: bold;
}
:deep(.el-table__header .el-table__cell) {
  background-color: #09254e;
  color: #fff;
  font-weight: bold;
  text-align: center;
}
:deep(.el-table__empty-block) {
  background-color: #09254e;
}
:deep(.el-table) {
  border: 1px solid #135ba0;
  --el-table-border-color: none;
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

.bigFont {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}
.smallFont {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}
.bigNumber {
  color: #00f098;
  font-size: 26px;
  font-weight: bold;
}
.div1ShuiLiangFenXi {
  float: left;
  width: 120px;
  height: 80px;
  background: linear-gradient(to bottom, #071d42, #0a2b57);
  margin-top: 20px;
  margin-left: 20px;
}
.div2ShuiLiangFenXi {
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
  width: 100px;
  height: 30px;
  font-size: 15px;
}
.div3ShuiLiangFenXi {
  margin-left: 10px;
  text-align: center;
  width: 100px;
  height: 30px;
}
.titleDiv {
  border: 1px #008df9 solid;
  width: 300px;
  height: 120px;
  background: linear-gradient(
    to top,
    rgba(13, 86, 147, 0.5),
    rgba(13, 86, 147, 0.3),
    rgba(1, 15, 41, 0.1),
    rgba(1, 15, 41, 0),
    rgba(1, 15, 41, 0)
  ) !important;
}
</style>
