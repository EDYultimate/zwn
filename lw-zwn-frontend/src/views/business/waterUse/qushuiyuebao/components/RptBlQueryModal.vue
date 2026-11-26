<script setup lang="ts">
// ============================================================
// 历史通报查询弹框（与知识库日报面板的「历史通报查询」弹框内容一致）
// 期号选择 + 正式印发版式预览
// ============================================================
import { computed, ref } from 'vue'
import ProModal from '@/components/common/ProModal/ProModal.vue'
import { MON_HIST_84 } from '@/views/knowledge/QA/reportData'

const visible = ref(false)
const histNo = ref('84')
const histDoc = computed(() => (histNo.value === '84' ? MON_HIST_84 : null))

/** 数值格式化：千分位、最多两位小数 */
function n(v: number | null | undefined): string {
  if (v === null || v === undefined) {
    return '—'
  }
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

/** 蓄水量小计（保留 1 位小数） */
function sumWq(rows: [string, number, number][]): string {
  return rows.reduce((s, r) => s + r[1], 0).toFixed(1)
}

/** 调整次数小计 */
function sumG(rows: [string, number, number][]): number {
  return rows.reduce((s, r) => s + r[2], 0)
}

/** 打开弹框：默认第 84 期 */
function show() {
  histNo.value = '84'
  visible.value = true
}

defineExpose({ show })
</script>

<template>
  <pro-modal
    v-model:show="visible"
    title="历史通报查询"
    table-theme="light"
    content-mode="scroll"
    default-padding="14px 26px 6px"
    :style-params="{ width: '1000px', height: '760px' }"
  >
    <div class="hist-sel">
      <label>选择期号：</label>
      <select v-model="histNo">
        <option value="84">2025年第12期（总第84期）· 2026年1月6日</option>
        <option value="83">2025年第11期（总第83期）· 2025年12月6日</option>
      </select>
      <span class="hist-tip">版式同正式印发文档；其余期次将随数字化进度陆续收录</span>
    </div>

    <div class="hist-doc">
      <template v-if="histDoc">
        <div class="doc-title">漳卫南运河水资源信息通报</div>
        <div class="doc-sub">（{{ histDoc.no }}）</div>
        <div class="doc-by">
          <span>{{ histDoc.org }}</span>
          <span>{{ histDoc.date }}</span>
        </div>
        <div class="doc-h">一、基本情况</div>
        <p class="doc-p">{{ histDoc.s1 }}</p>
        <div class="doc-h">二、取水管理</div>
        <p class="doc-p">{{ histDoc.s2 }}</p>
        <div class="doc-h">三、重要断面过流</div>
        <p class="doc-p">{{ histDoc.s3 }}</p>
        <div class="doc-h">四、岳城水库、枢纽水闸蓄水和调度</div>
        <p class="doc-p">{{ histDoc.s4a }}</p>
        <p class="doc-p">{{ histDoc.s4b }}</p>
        <p class="doc-p">{{ histDoc.s4c }}</p>
        <div class="doc-h">五、工作动态</div>
        <p class="doc-p">（一）{{ histDoc.s5t1 }}。{{ histDoc.s5d1 }}</p>
        <p class="doc-p">（二）{{ histDoc.s5t2 }}。{{ histDoc.s5d2 }}</p>
        <p class="doc-p">（三）{{ histDoc.s5t3 }}。{{ histDoc.s5d3 }}</p>

        <div class="doc-pt">附表 1-1 漳卫南局管辖范围取水情况统计表（按河流分类）</div>
        <div class="doc-pd">2025年12月</div>
        <table class="doc-tbl">
          <thead>
            <tr>
              <th>序号</th>
              <th>所属河流</th>
              <th>取水工程<br />数量</th>
              <th>当月取水的<br />取水工程数量</th>
              <th>当月取水量<br />（万m³）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in histDoc.river" :key="r[0]">
              <td>{{ i + 1 }}</td>
              <td class="lt">{{ r[0] }}</td>
              <td>{{ r[1] }}</td>
              <td>{{ r[2] }}</td>
              <td class="m">{{ n(Number(r[3])) }}</td>
            </tr>
            <tr class="tot">
              <td></td>
              <td>合计</td>
              <td>{{ histDoc.riverSum[0] }}</td>
              <td>{{ histDoc.riverSum[1] }}</td>
              <td class="m">{{ n(Number(histDoc.riverSum[2])) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="doc-note">{{ histDoc.riverNote }}</div>

        <div class="doc-pt">附表 1-2 漳卫南局管辖范围取水情况统计表（按省份分类）</div>
        <div class="doc-pd">2025年12月</div>
        <table class="doc-tbl">
          <thead>
            <tr>
              <th>序号</th>
              <th>所属省份</th>
              <th>取水工程<br />数量</th>
              <th>当月取水的<br />取水工程数量</th>
              <th>当月取水量<br />（万m³）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in histDoc.prov" :key="r[0]">
              <td>{{ i + 1 }}</td>
              <td class="lt">{{ r[0] }}</td>
              <td>{{ r[1] }}</td>
              <td>{{ r[2] }}</td>
              <td class="m">{{ n(Number(r[3])) }}</td>
            </tr>
            <tr class="tot">
              <td></td>
              <td>合计</td>
              <td>{{ histDoc.provSum[0] }}</td>
              <td>{{ histDoc.provSum[1] }}</td>
              <td class="m">{{ n(Number(histDoc.provSum[2])) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="doc-pt">附表 2 漳卫南运河重要控制断面过流情况统计表</div>
        <div class="doc-pd">2025年12月</div>
        <table class="doc-tbl">
          <thead>
            <tr>
              <th>序号</th>
              <th>站名</th>
              <th>所在河流</th>
              <th>断面地点</th>
              <th>管理单位</th>
              <th>月均流量<br />（m³/s）</th>
              <th>月总过水量<br />（万m³）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in histDoc.sec" :key="r[0]">
              <td>{{ i + 1 }}</td>
              <td class="lt">{{ r[0] }}</td>
              <td class="lt">{{ r[1] }}</td>
              <td class="lt">{{ r[2] }}</td>
              <td class="lt">{{ r[3] }}</td>
              <td class="m">{{ n(Number(r[4])) }}</td>
              <td class="m">{{ n(Number(r[5])) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="doc-pt">附表 3 岳城水库蓄水、供水和调度情况统计表</div>
        <div class="doc-pd">2025年12月</div>
        <table class="doc-tbl">
          <thead>
            <tr>
              <th rowspan="2">水位<br />（m）</th>
              <th rowspan="2">库容<br />（万m³）</th>
              <th rowspan="2">月平均<br />入库流量<br />（m³/s）</th>
              <th rowspan="2">月入库水量<br />（万m³）</th>
              <th colspan="6">月出库水量（万m³）</th>
            </tr>
            <tr>
              <th>引岳济邯<br />管道</th>
              <th>民有渠<br />（含工业用水）</th>
              <th>引岳入安<br />管道</th>
              <th>漳南渠</th>
              <th>漳河河道</th>
              <th>合计</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="m">{{ n(histDoc.yc.wl) }}</td>
              <td class="m">{{ n(histDoc.yc.cap) }}</td>
              <td class="m">{{ n(histDoc.yc.inflow) }}</td>
              <td class="m">{{ n(histDoc.yc.inVol) }}</td>
              <td v-for="(v, i) in histDoc.yc.out" :key="i" class="m">{{ n(v) }}</td>
            </tr>
            <tr>
              <td>蓄水、供水<br />情况说明</td>
              <td colspan="9" class="lt ptext">{{ histDoc.yc.desc }}</td>
            </tr>
            <tr>
              <td>调度情况</td>
              <td colspan="9" class="lt ptext">{{ histDoc.yc.disp }}</td>
            </tr>
          </tbody>
        </table>
        <div class="doc-note">注：水位、库容为 2026 年 1 月 1 日 8 时数据</div>

        <div class="doc-pt">附表 4 直管枢纽水闸蓄水和调度情况统计表</div>
        <div class="doc-pd">2025年12月</div>
        <table class="doc-tbl doc-tbl-gate">
          <thead>
            <tr>
              <th colspan="2">直管枢纽水闸名称</th>
              <th>蓄水量（万m³）</th>
              <th>调整次数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :rowspan="histDoc.hub.length" class="grp">枢纽</td>
              <td class="lt">{{ histDoc.hub[0]?.[0] }}</td>
              <td class="m">{{ n(histDoc.hub[0]?.[1]) }}</td>
              <td>{{ histDoc.hub[0]?.[2] }}</td>
            </tr>
            <tr v-for="r in histDoc.hub.slice(1)" :key="r[0]">
              <td class="lt">{{ r[0] }}</td>
              <td class="m">{{ n(r[1]) }}</td>
              <td>{{ r[2] }}</td>
            </tr>
            <tr class="tot">
              <td></td>
              <td>小计</td>
              <td class="m">{{ sumWq(histDoc.hub) }}</td>
              <td>{{ sumG(histDoc.hub) }}</td>
            </tr>
            <tr>
              <td :rowspan="histDoc.gate.length" class="grp">水闸</td>
              <td class="lt">{{ histDoc.gate[0]?.[0] }}</td>
              <td class="m">{{ n(histDoc.gate[0]?.[1]) }}</td>
              <td>{{ histDoc.gate[0]?.[2] }}</td>
            </tr>
            <tr v-for="r in histDoc.gate.slice(1)" :key="r[0]">
              <td class="lt">{{ r[0] }}</td>
              <td class="m">{{ n(r[1]) }}</td>
              <td>{{ r[2] }}</td>
            </tr>
            <tr class="tot">
              <td></td>
              <td>小计</td>
              <td class="m">{{ sumWq(histDoc.gate) }}</td>
              <td>{{ sumG(histDoc.gate) }}</td>
            </tr>
            <tr class="tot">
              <td colspan="2" class="tc">合计</td>
              <td class="m">
                {{ (parseFloat(sumWq(histDoc.hub)) + parseFloat(sumWq(histDoc.gate))).toFixed(1) }}
              </td>
              <td>{{ sumG(histDoc.hub) + sumG(histDoc.gate) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="doc-note">注：蓄水量为 2026 年 1 月 1 日 8 时数据</div>

        <div class="doc-foot">{{ histDoc.editor }}</div>
        <div class="doc-foot">{{ histDoc.sendto }}</div>
        <div class="doc-foot right">共印 30 份</div>
      </template>
      <div v-else class="hist-empty">该期通报电子版暂未收录，可到档案室查阅纸质件。</div>
    </div>

    <template #action>
      <div class="lcm-foot">
        <button class="lcm-btn" type="button" @click="visible = false">关 闭</button>
      </div>
    </template>
  </pro-modal>
</template>

<style scoped lang="scss">
/* ===== 弹框底部按钮 ===== */
.lcm-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 4px 4px;
}

.lcm-btn {
  height: 32px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 13px;
  color: #1f7ae0;
  cursor: pointer;
  background: #f2f8ff;
  border: 1px solid #9cc3ef;
  border-radius: 4px;

  &:hover {
    color: #fff;
    background: #1f7ae0;
  }
}

/* ===== 期号选择 ===== */
.hist-sel {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 4px 0 8px;
  font-size: 13px;
  color: #5a7ba6;

  select {
    height: 30px;
    padding: 0 8px;
    font-family: inherit;
    font-size: 13px;
    color: #24466f;
    background: #fff;
    border: 1px solid #bcd7f7;
    border-radius: 4px;
  }

  .hist-tip {
    font-size: 12px;
    color: #8aa3c4;
  }
}

/* ===== 正式印发版式 ===== */
.hist-doc {
  min-height: 320px;
  padding: 20px 28px;
  font-family: SimSun, serif;
  color: #1e1e1e;
  background: #fff;
  border: 1px solid #dbe7f5;
  border-radius: 6px;

  .doc-title {
    margin-bottom: 4px;
    font-family: 'FZXiaoBiaoSong-B05S', SimSun, serif;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
  }

  .doc-sub {
    margin-bottom: 4px;
    font-family: KaiTi, serif;
    font-size: 15px;
    text-align: center;
  }

  .doc-by {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    margin-bottom: 10px;
    font-family: KaiTi, serif;
    font-size: 13px;
    border-bottom: 2px solid #000;
  }

  .doc-h {
    margin: 14px 0 2px;
    font-family: SimHei, sans-serif;
    font-size: 15px;
    font-weight: 700;
  }

  .doc-p {
    margin: 4px 0;
    font-size: 13px;
    line-height: 1.9;
    text-indent: 2em;
  }

  /* 附表标题 */
  .doc-pt {
    margin: 14px 0 2px;
    font-family: SimHei, sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    text-align: center;
  }

  .doc-pd {
    margin-bottom: 4px;
    font-family: KaiTi, serif;
    font-size: 12px;
    text-align: center;
  }

  .doc-tbl {
    width: 100%;
    margin: 2px 0 4px;
    font-family: SimSun, serif;
    font-size: 12px;
    border-collapse: collapse;

    th,
    td {
      padding: 3px 5px;
      text-align: center;
      vertical-align: middle;
      border: 1px solid #000;
    }

    th {
      font-weight: 400;
      white-space: nowrap;
    }

    td.lt {
      text-align: left;
    }

    td.m {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    td.grp {
      font-weight: 700;
    }

    td.tc {
      text-align: center;
    }

    td.ptext {
      line-height: 1.8;
      text-indent: 2em;
    }

    tr.tot td {
      font-weight: 700;
    }
  }

  /* 附表4 与正式文件一致：表宽收窄居中 */
  .doc-tbl-gate {
    max-width: 720px;
    margin: 2px auto 4px;
  }

  .doc-note {
    margin: 2px 0 6px;
    font-size: 12px;
  }

  .doc-foot {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.9;
  }

  .doc-foot.right {
    text-align: right;
  }
}

.hist-empty {
  padding: 90px 0;
  font-size: 14px;
  color: #5a7ba6;
  text-align: center;
}
</style>
