<script setup lang="ts">
import { ref } from 'vue'
import WaterVolumePanel from './components/WaterVolumePanel.vue'
import WaterFlowPanel from './components/WaterFlowPanel.vue'
import StationDetailModal from './components/StationDetailModal.vue'

// 「生态流量考核详情」弹窗引用
const sdModalRef = ref<InstanceType<typeof StationDetailModal>>()

// 当前激活的 tab：volume=按水量考核，flow=按流量考核
const activeTab = ref<'volume' | 'flow'>('volume')

// 考核年份（按水量考核：按年统计，无月份）
const examYear = ref('2026')
// 考核日期（按流量考核：按日统计，年-月-日）
const examDate = ref('2025-09-30')
</script>

<template>
  <RightSide width="420px" height="calc(100vh - 100px)" :scrollable="false">
    <DivBackIn>
      <div class="eco-panel">
        <!-- 固定区域：标题 + Tab + 考核时间 -->
        <div class="eco-fixed">
          <TitleBackOut
            content="生态流量考核"
            :is-click-btn="true"
            @btn-click="sdModalRef?.show()"
          />
          <div class="eco-tabs">
            <div
              class="eco-tab"
              :class="{ active: activeTab === 'volume' }"
              @click="activeTab = 'volume'"
            >
              按水量考核
            </div>
            <div
              class="eco-tab"
              :class="{ active: activeTab === 'flow' }"
              @click="activeTab = 'flow'"
            >
              按流量考核
            </div>
          </div>
          <!-- 考核时间（按水量）/ 考核日期（按流量） -->
          <div class="filter-row">
            <template v-if="activeTab === 'volume'">
              <span class="filter-label">考核时间</span>
              <el-date-picker
                v-model="examYear"
                type="year"
                size="small"
                :clearable="false"
                :editable="false"
                value-format="YYYY"
                class="eco-el-picker is-year"
                popper-class="eco-el-popper"
              />
              <span class="unit-label">单位：万m³</span>
            </template>
            <template v-else>
              <span class="filter-label">考核日期</span>
              <el-date-picker
                v-model="examDate"
                type="date"
                size="small"
                :clearable="false"
                :editable="false"
                value-format="YYYY-MM-DD"
                class="eco-el-picker is-date"
                popper-class="eco-el-popper"
              />
            </template>
          </div>
        </div>

        <!-- 可滚动区域：站点卡片列表 -->
        <div class="eco-scroll">
          <n-scrollbar>
            <WaterVolumePanel
              v-if="activeTab === 'volume'"
              :year="examYear"
              @select="sdModalRef?.show($event)"
            />
            <WaterFlowPanel v-else :date="examDate" @select="sdModalRef?.show($event)" />
          </n-scrollbar>
        </div>
      </div>
    </DivBackIn>

    <!-- 生态流量考核详情弹窗 -->
    <StationDetailModal ref="sdModalRef" />
  </RightSide>
</template>

<style scoped lang="scss">
/* 整体面板：flex 上下布局，高度适应屏幕不超出父级 */
.eco-panel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.eco-fixed {
  flex: none;
}

.eco-scroll {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Tab 切换按钮 */
.eco-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 0;

  .eco-tab {
    flex: 1;
    padding: 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #9dc4f0;
    text-align: center;
    cursor: pointer;
    background: rgba(10, 40, 90, 0.4);
    border: 1px solid rgba(80, 170, 255, 0.25);
    border-radius: 4px;
    transition: all 0.2s;

    &.active {
      color: #fff;
      background: linear-gradient(180deg, #2f7ff0, #1c5ec8);
      border-color: rgba(140, 200, 255, 0.5);
      box-shadow: 0 0 12px rgba(47, 127, 240, 0.3);
    }

    &:hover:not(.active) {
      color: #dff0ff;
      background: rgba(20, 70, 160, 0.5);
    }
  }
}

/* 筛选行 */
.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 0 10px;

  .filter-label {
    font-size: 13px;
    color: #cfe4ff;
    flex: none;
  }

  .unit-label {
    margin-left: auto;
    font-size: 12px;
    color: #7fa5d2;
  }

  /* el-date-picker 控件：深色输入框（年份/日期共用） */
  :deep(.eco-el-picker) {
    &.is-year {
      width: 110px;
    }

    &.is-date {
      width: 140px;
    }

    .el-input__wrapper {
      background: rgba(38, 64, 123, 0.85);
      border-radius: 4px;
      box-shadow: 0 0 0 1px #4d84c4 inset;

      &:hover,
      &.is-focus {
        box-shadow: 0 0 0 1px #6f9fd4 inset;
      }
    }

    .el-input__inner {
      color: #fff;
    }

    .el-input__prefix .el-icon {
      color: #cfe3ff;
    }
  }
}
</style>

<!-- el-date-picker 下拉面板挂载到 body，scoped 无法覆盖，单独全局样式（年份/日期共用） -->
<style lang="scss">
.eco-el-popper.el-picker__popper {
  --el-color-primary: #2f7ff0;
  --el-bg-color-overlay: #0a2650;
  --el-border-color-light: rgba(80, 170, 255, 0.35);
  --el-border-color-lighter: rgba(80, 170, 255, 0.25);
  --el-fill-color-light: rgba(47, 127, 240, 0.22);
  --el-text-color-primary: #eaf5ff;
  --el-text-color-regular: #9dc4f0;
  --el-text-color-secondary: #7fa5d2;
  /* 日历面板专用变量 */
  --el-datepicker-text-color: #cfe4ff;
  --el-datepicker-off-text-color: #4a6a96;
  --el-datepicker-header-text-color: #eaf5ff;
  --el-datepicker-icon-color: #9dc4f0;
  --el-datepicker-hover-font-color: #57c7ff;
  --el-datepicker-border-color: rgba(80, 170, 255, 0.25);
  --el-datepicker-inner-border-color: rgba(80, 170, 255, 0.15);

  background: #0a2650;
  border-color: rgba(80, 170, 255, 0.4);

  .el-popper__arrow::before {
    background: #0a2650;
    border-color: rgba(80, 170, 255, 0.4);
  }
}
</style>
