<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WarnDetailModal from './components/WarnDetailModal.vue'
import { exposeAgentContext } from '@/agent/page'
import { getCertList, getCertStat, type CertStat } from '@/api/cert'
// 类型专用导入：编译后擦除，业务页不产生对能力声明的运行时依赖
import type { ShuiliangjiankongPageContract } from './shuiliangjiankong'

// Vite 下不支持 require，用 import.meta.glob 预加载目录下全部图标，按 icon 名取用
const iconModules = import.meta.glob('@/assets/img/business/waterUse/*.png', {
  eager: true,
  import: 'default'
})
const iconMap = Object.fromEntries(
  Object.entries(iconModules).map(([path, url]) => [
    path
      .split('/')
      .pop()!
      .replace(/\.png$/, ''),
    url as string
  ])
)
const getIcon = (icon: string) => iconMap[icon]

// 预警日期（原型默认 2026-09-03，本地 mock，不调后端）
const warnDate = ref('2026-09-03')

// 预警明细弹框引用（点击预警卡数量打开对应类别明细）
const warnModalRef = ref<InstanceType<typeof WarnDetailModal>>()

// 智能体接入：只暴露页面能力；声明在同目录 shuiliangjiankong.ts，事件注册由公共层自动完成
exposeAgentContext({
  showWarnDetail: (category?: string, date?: string) =>
    warnModalRef.value?.show(category ?? '超许可', date || warnDate.value),
  setWarnDate: (date?: string) => {
    if (date) {
      warnDate.value = date
      window.$message?.info(`预警日期已切换到 ${date}`)
    }
  }
} satisfies ShuiliangjiankongPageContract)

// 四类预警卡数据（临界许可为普通色，其余为告警红；计数为各分类预警套数）
const warnCards = [
  { name: '临界许可', count: 10, alert: false, icon: 'linJie' },
  { name: '超许可', count: 10, alert: false, icon: 'chaoXu' },
  { name: '超计划', count: 10, alert: false, icon: 'chaoJi' },
  { name: '计量异常', count: 10, alert: true, icon: 'jiLiang' }
]

// 高亮锚点：卡片名称 → 同目录 shuiliangjiankong.ts 中 anchors 的 target 键
const warnAnchorKey: Record<string, string> = {
  临界许可: 'linJieXuKe',
  超许可: 'chaoXuKe',
  超计划: 'chaoJiHua',
  计量异常: 'jiLiangYiChang'
}
const tileAnchorKey: Record<string, string> = {
  取水户数: 'quShuiHuShu',
  取水口: 'quShuiKou',
  证照总数: 'zhengZhaoZongShu',
  许可水量: 'xuKeShuiLiang',
  '许可水量·河道外': 'xuKeShuiLiangHeDaoWai',
  '许可水量·河道内': 'xuKeShuiLiangHeDaoNei'
}

/* ---------------- 「保有取水许可证（含准予）」统计瓦片（数据同证照管理页） ---------------- */

// 汇总数：证件数 / 取水口数 / 许可水量（/api/ecCert/stat，与证照管理页顶部三张卡片同源）
const certStat = ref<Partial<CertStat>>({})
// 证照列表：按取水权人去重得到取水户数，并按河道内外拆分许可水量
const certRows = ref<Array<{ owner?: string; inpos?: string; amt?: number }>>([])

// 保留两位小数（与证照管理页许可水量的展示精度一致）
const round2 = (n: unknown) => Math.round((Number(n) || 0) * 100) / 100

// 取水户数：取水权人去重
const ownerCount = computed(() => new Set(certRows.value.map((r) => r.owner).filter(Boolean)).size)

// 许可水量·河道内（RIVER_INNER = 1）
const permitIn = computed(() =>
  round2(
    certRows.value
      .filter((r) => r.inpos === '河道内')
      .reduce((sum, r) => sum + (Number(r.amt) || 0), 0)
  )
)

// 许可水量·河道外（未标记河道内的证照，与证照管理页展示口径一致）
const permitOut = computed(() =>
  round2(
    certRows.value
      .filter((r) => r.inpos !== '河道内')
      .reduce((sum, r) => sum + (Number(r.amt) || 0), 0)
  )
)

const certCount = computed(() => Number(certStat.value.certCount) || certRows.value.length)
const intakeCount = computed(() => Number(certStat.value.intakeCount) || 0)
const permitQty = computed(
  () => round2(certStat.value.permitQty) || round2(permitIn.value + permitOut.value)
)

/** 拉取证照统计（与证照管理页共用接口） */
async function loadLicenseStat() {
  try {
    const [statRes, listRes] = await Promise.all([getCertStat(), getCertList()])
    certStat.value = (statRes?.data || {}) as CertStat
    certRows.value = (listRes?.data || []) as typeof certRows.value
  } catch (e) {
    console.error('取水许可证统计加载失败', e)
  }
}

onMounted(loadLicenseStat)

// 六个统计瓦片（tip 为悬浮提示，数值全部来自上述接口）
const licenseTiles = computed(() => [
  {
    name: '取水户数',
    value: ownerCount.value,
    unit: '户',
    tip: `取水户数：${ownerCount.value} 户`
  },
  {
    name: '取水口',
    value: intakeCount.value,
    unit: '个',
    tip: `取水口：${intakeCount.value} 个`
  },
  {
    name: '证照总数',
    value: certCount.value,
    unit: '套',
    tip: `证照总数：${certCount.value} 套`
  },
  {
    name: '许可水量',
    value: permitQty.value,
    unit: '万m³',
    tip: `许可水量：${permitQty.value} 万m³（河道外 ${permitOut.value} + 河道内 ${permitIn.value}）`
  },
  {
    name: '许可水量·河道外',
    value: permitOut.value,
    unit: '万m³',
    tip: `许可水量·河道外：${permitOut.value} 万m³`
  },
  {
    name: '许可水量·河道内',
    value: permitIn.value,
    unit: '万m³',
    tip: `许可水量·河道内：${permitIn.value} 万m³`
  }
])
</script>

<template>
  <div>
    <RightSide width="420px">
      <!-- 预警信息标题行：标题 + 日期选择 -->
      <TitleBackOut content="预警信息" :is-click-btn="true">
        <DatePicker
          v-model="warnDate"
          type="date"
          size="small"
          width="120px"
          table-theme="blue"
          :clearable="false"
        />
      </TitleBackOut>

      <!-- 预警卡片网格：4 类预警各一张卡 -->
      <div style="margin: 10px 0; padding: 10px">
        <div class="grid-2">
          <div
            v-for="card in warnCards"
            :key="card.name"
            class="warn-card"
            :data-anchor="'warn-card.' + warnAnchorKey[card.name]"
          >
            <img :src="getIcon(card.icon)" alt="" class="warn-icon" />
            <div>
              <div class="warn-name">{{ card.name }}</div>
              <!-- 点击数量打开该类别预警明细弹框 -->
              <div
                class="warn-num"
                :class="{ alert: card.alert }"
                title="查看预警明细"
                @click="warnModalRef?.show(card.name, warnDate)"
              >
                <span class="alert-badge">{{ card.count }}</span>

                <span class="unit">套</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TitleBackOut content="保有取水许可证（含准予）" is-click-btn></TitleBackOut>
      <div style="margin: 10px 0; padding: 10px">
        <div class="grid-2">
          <div
            v-for="tile in licenseTiles"
            :key="tile.name"
            class="tile"
            :title="tile.tip"
            :data-anchor="'tile.' + tileAnchorKey[tile.name]"
          >
            <div class="tile-name">{{ tile.name }}</div>
            <div class="tile-value">
              {{ tile.value }}<span class="unit">{{ tile.unit }}</span>
            </div>

            <img src="@/assets/img/business/waterUse/val_huan_back.png" style="margin-top: -60px" />
          </div>
        </div>
      </div>
    </RightSide>

    <!-- 预警明细弹框（点击预警卡数量打开） -->
    <WarnDetailModal ref="warnModalRef" />
  </div>
</template>

<style scoped lang="scss">
/* 两列网格：预警卡与统计瓦片通用 */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 预警卡：图标 + 数量 + 名称 */
.warn-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;

  border-radius: 8px;
  cursor: pointer;
}

.warn-icon {
  flex-shrink: 0;
}

.warn-num {
  font-size: 1.25rem;
  font-weight: bold;

  color: #48e0ff;
  line-height: 1.2;

  /* 可点击：悬浮高亮提示打开明细弹框 */
  cursor: pointer;
  transition: text-shadow 0.2s;

  &:hover {
    text-shadow: 0 0 8px rgba(72, 224, 255, 0.8);
  }

  ///* 告警类（超许可/超计划/计量异常）数值标红 */
  &.alert {
    color: #fed800;

    &:hover {
      text-shadow: 0 0 8px rgba(254, 216, 0, 0.8);
    }
  }
}

.warn-name {
  color: #ffffff;
  margin-top: 2px;
}

/* 统计瓦片：名称在上、数值在下 */
.tile {
  padding: 10px;
  //background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  text-align: center;
}

.tile-name {
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: bold;
  padding: 3px 0;
  margin: 0 5px 4px 5px;
  background-color: #153478;

  border-radius: 16px;
  box-shadow:
    0 0 5px 0px #40b8ff,
    0 0 4px #40b8ff;
}

.tile-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #03febb;
  margin-top: 20px;
}

.unit {
  font-size: 0.8rem;
  font-weight: normal;
  font-style: normal;
  color: #ffffff;
  margin-left: 2px;
}
.alert-badge {
  text-decoration: underline;
  margin-right: 2px;
}
</style>
