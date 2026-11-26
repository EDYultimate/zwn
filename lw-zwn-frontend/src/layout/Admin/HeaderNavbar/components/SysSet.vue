<script setup lang="ts">
import { ref } from 'vue'
import { useMenuPushStore } from '@/store/modules/menuPush'

const menuPushStore = useMenuPushStore()

// 抽屉开关（父组件 v-model:show 双向绑定）
const show = defineModel<boolean>('show', { default: false })

// ==================== 系统设置：菜单前缀 / 菜单推送 ====================
// 前缀类型单选选项（value 对应后端 MenuPrefixVO 三套前缀字段）
const prefixTypeOptions = [
  { label: '功能路径', value: 'funcPrefix' },
  { label: '管理路径', value: 'managePrefix' },
  { label: '区域路径', value: 'regionPrefix' }
]

// 推送菜单 loading / 结果提示
const pushLoading = ref(false)

// 菜单推送：把前端路由推送到权限系统，成功后自动刷新前缀缓存
async function handlePushMenus() {
  pushLoading.value = true
  try {
    await menuPushStore.pushRoutes()
    window.$message?.success('菜单推送成功')
  } catch (e) {
    window.$message?.error('菜单推送失败')
  } finally {
    pushLoading.value = false
  }
}
</script>

<template>
  <n-drawer v-model:show="show" :width="250" placement="right">
    <n-drawer-content title="系统设置" closable>
      <div class="setting-panel">
        <!-- 菜单前缀类型：面包屑前置菜单选择哪一套（localStorage 持久化，立即生效） -->
        <div class="setting-section-title">菜单前缀</div>
        <n-radio-group
          :value="menuPushStore.prefixType"
          @update:value="menuPushStore.setPrefixType"
        >
          <n-space vertical>
            <n-radio v-for="opt in prefixTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </n-radio>
          </n-space>
        </n-radio-group>

        <!-- 菜单推送：把前端路由推送到权限系统，成功后自动刷新前缀缓存 -->
        <div class="setting-section-title">菜单推送</div>
        <n-button type="primary" size="small" :loading="pushLoading" @click="handlePushMenus">
          推送菜单
        </n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
/* 系统设置抽屉内容 */
.setting-panel {
  padding: 0 4px;
}

.setting-section-title {
  font-weight: 600;
  margin: 12px 0 8px;

  &:first-child {
    margin-top: 0;
  }
}
</style>
