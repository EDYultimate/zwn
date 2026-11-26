<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import icon_ywqj from '@/assets/img/layout/demo.png'
import ylj from '@/assets/img/logo/logo.png'
import arrow_no from '@/assets/img/layout/menu/arrow_no.png'
import arrow_active from '@/assets/img/layout/menu/arrow_active.png'
import env from '@/env'
import { userInfoStore } from '@/store/modules/userInfo'
import SysSet from '@/layout/Admin/HeaderNavbar/components/SysSet.vue'

const store = userInfoStore()
const route = useRoute()

// 使用 store 中的 Getter 替代本地手动过滤逻辑
const level1Routing = computed(() => store.level1Routing)

const projectTitle = env.APP_TITLE
const goToVis = () => {
  window.open('/ws/vis')
}

const logo = ref(ylj)

const gainTodayTimeMessage = () => {
  const now = new Date()
  const year = now.getFullYear()
  const monthStr = String(now.getMonth() + 1).padStart(2, '0')
  const dateStr = String(now.getDate()).padStart(2, '0')
  const weekdayList = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdayList[now.getDay()]
  return `${year}年${monthStr}月${dateStr} 星期${weekday}`
}

const scrollContainer = ref<HTMLDivElement>()

const scrollRef = ref(null)

// 滚轮处理

const handleWheel = (e: WheelEvent) => {
  const scrollDom = e.currentTarget as HTMLElement | null
  if (!scrollDom) {
    return
  }
  scrollDom.scrollLeft += e.deltaY * 1.5
}

const set_active = ref(false)
</script>

<template>
  <div class="header-container">
    <div class="header-left-container">
      <div class="header-title-container"></div>
    </div>
    <div class="header-mid-container">
      <n-scrollbar ref="scrollRef" x-scrollable @wheel.prevent="handleWheel">
        <div class="header-mid-menu-container">
          <div
            v-for="(routerItem, index) in level1Routing"
            :key="routerItem.path"
            style="position: relative"
          >
            <router-link class="header-router-link-normal your-div" :to="{ path: routerItem.path }">
              <div>
                <span>
                  {{ routerItem.meta?.title }}
                </span>
                <!--                <img-->
                <!--                  :src="route.path.startsWith(routerItem.path) ? arrow_active : arrow_no"-->
                <!--                  style="width: 15px; height: 15px; margin: 0 -10px -1px 8px"-->
                <!--                />-->
              </div>
            </router-link>
            <!--          <NavbarDropCard -->
            <!--            v-if=" -->
            <!--              routerItem.children -->
            <!--                && (routerItem.children).length > 0 -->
            <!--            " -->
            <!--            class="hover-container" -->
            <!--            :drop-menu="routerItem" -->
            <!--          /> -->
            <div v-if="level1Routing.length - 1 !== index" style="width: 20px"></div>
          </div>
        </div>
      </n-scrollbar>
    </div>
    <div class="header-right-container">
      <div class="setup-container">
        <div class="nav-operate">
          <!--              <div class="nav-operate-item nav-operate-item&#45;&#45;user" style="">-->
          <!--                <img src="@/assets/img/layout/logo/user_logo.png" class="nav-operate-icon" alt="" />-->
          <!--                <span>{{ store.state.username }}</span>-->
          <!--              </div>-->
          <!--          <div class="nav-operate-item nav-operate-item&#45;&#45;logout" @click="set_active = true">-->
          <!--            <img-->
          <!--              src="@/assets/img/layout/logo/set_logo.png"-->
          <!--              class="nav-operate-icon"-->
          <!--              alt="系统设置"-->
          <!--            />-->
          <!--          </div>-->
        </div>
      </div>
    </div>

    <!-- 系统设置抽屉（菜单前缀类型 + 菜单推送） -->
    <!--    <SysSet v-model:show="set_active" />-->
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  height: 80px;
  //background: url('@/assets/img/01.png') no-repeat #04316b;
  //background: url('@/assets/img/layout/logo/title_logo.png') no-repeat;
  //background-color: #eef6ff99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 24px 0 0 24px;
  position: relative;
  z-index: 1000; /* 顶部菜单层：始终位于地图分层之上 */
}
.header-left-container {
  display: flex;
  align-items: center;
  justify-content: left;
  letter-spacing: 0.05em;
}
.header-logo-container {
  width: 40px;
  height: 40px;
  background: url('@/assets/img/logo/logo.png') no-repeat center center;
  background-size: contain;
  //box-shadow: 0 0 12px rgba(53, 181, 255, 0.7);
  //border-radius: 24px;
  //background: url('@/assets/img/layout/02.png') no-repeat center center;
  //transform: translateY(2px);
}
.header-title-container {
  width: 756px;
  font-size: 30px;
  line-height: 1;
  color: #fff;
  display: flex;
  padding: 0 14px;
  align-items: center;
  letter-spacing: 0.05rem;
}
.header-title {
  position: relative;
  top: -10px;
  width: 533px;
  height: 41px;
  // background: url('@/assets/img/layout/system_logo.png') no-repeat;
  background-size: contain;
}
.header-subtitle-container {
  color: #fff;
  font-weight: bold;
  padding: 0 14px;
  font-size: 22px;
  line-height: 34px;
}
.header-mid-container {
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.05em;
  flex: 1;
  //align-items: center;
  //overflow-x: hidden;
  //overflow-y: hidden;
  //white-space: nowrap;
  display: flex;
  align-items: center;
}

:deep(.n-scrollbar) {
  /* 滚动条滑块透明度：最后一位越小越透明 0.1=10%透明 */
  --n-scrollbar-color: rgba(0, 0, 0, 0.08) !important;
  /* hover悬浮加深 */
  --n-scrollbar-color-hover: rgba(0, 0, 0, 0.18) !important;
}

.header-mid-menu-container {
  //padding-bottom: 20px;

  display: inline-flex;
  align-items: center;
  padding-left: 14px;
  margin-top: 0px;
  margin-bottom: -14px;
}
.gradient-left {
  width: 49px;
  height: 100%;
  // background: url('@/assets/img/admin/06.png') no-repeat center center;
}
.gradient-right {
  width: 49px;
  height: 100%;
  // background: url('@/assets/img/admin/06.png') no-repeat center center;
  transform: scaleX(-1);
}
.mid-line {
  width: 30px;
  height: 41px;
  flex-shrink: 1;
  // background: url('@/assets/img/admin/07.png') no-repeat center center;
}
.header-router-link-normal {
  display: flex;
  justify-content: center;
  padding: 15px 0px 20px 14px;
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
  z-index: 99;
  transition: all 0.3s;
  position: relative;
  margin: 0 0px 0 -6px;

  //&:after {
  //  content: '';
  //  width: 100px;
  //  height: 121px;
  //  position: absolute;
  //  display: block;
  //  // background: url('@/assets/img/layout/router_link.png') no-repeat center center;
  //  z-index: -1;
  //  transition: background 0.3s;
  //}
  &:hover {
    //background: url('@/assets/img/layout/menu/menu-no.png') no-repeat center center;
    //background-size: cover;
    //filter: drop-shadow(0 2px 6px rgba(23, 67, 144, 0.6));

    span {
      /* 悬浮时白色偏多的下灰上白渐变 */
      background: linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #dadada 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  span {
    position: relative;
    font-size: 1.1rem;
    /* 未选中：下灰上白渐变文字（白色占比更多） */
    background: linear-gradient(to bottom, #ffffff 0%, #ffffff 30%, #8c8c8c 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    white-space: nowrap;
  }
}
.header-router-link-normal.router-link-active {
  color: #fad999;

  border-image-source: url('@/assets/img/layout/menu/btn-bg-active.png');

  //&:after {
  //  content: '';
  //  width: 237px;
  //  height: 121px;
  //  position: absolute;
  //  display: block;
  //
  //  z-index: -1;
  //  transition: background 0.3s;
  //}
  span {
    /* 选中时白色偏多的下灰上白渐变 */
    background: linear-gradient(to bottom, #ffffff 0%, #ffffff 50%, #c5c5c5 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.header-right-container {
  //height: 100%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  position: relative;
  //bottom: -12px;
  justify-content: center;
  margin-top: 12px;
}
.header-right-datetime {
  font-size: 15px;
  color: #174390;
}
.header-router-link-normal:hover ~ .hover-container,
.header-router-link-normal ~ .hover-container:hover {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.4s;
  display: flex;
}

.setup-container {
  position: relative;
  display: flex;
  flex-direction: column;
  color: #1c4893;
}
.nav-operate {
  width: 80px;
  height: 30px;
  display: flex;
  align-items: center;

  text-align: center;
}
.nav-operate-item {
  //width: 87px;
  //height: 30px;
  //line-height: 30px;
  overflow-y: hidden;
  //padding: 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.nav-operate-icon {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.nav-operate-item--user {
  flex: 1;

  &:hover {
    filter: brightness(1.2);
  }
}

.nav-operate-item--logout {
  //flex: 0 0 20px;
  &:hover {
    filter: brightness(1.2);
  }
}

.icon-my-user {
  display: inline-block;
  width: 19px;
  height: 19px;
  margin-right: 10px;
  //background-image: url('@/assets/img/index/ren.png') ;
  //background-repeat: no-repeat;
  //background-attachment: scroll;
  //right: 108px;
  //top: 4px;
  position: relative;
}
.timediv {
  height: 30px;
  text-align: center;
  font-size: 14px;
  //font-style: italic;
  display: flex;
  align-items: center;
}
.timestrdiv {
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
  //font-size: 27px;
  //font-weight: bold;
  //letter-spacing: 3px;;
}
.datestrdiv {
  letter-spacing: 1px;
}
.timeshu {
  border-right-width: 1px;
  border-right-color: #3f5182;
  border-right-style: solid;
  position: absolute;
  right: 143px;
  top: 8px;
  width: 2px;
  height: 34px;
  margin-top: 1rem;
}

.your-div {
  width: fit-content;
  border-width: 2px 51px 3px 30px;
  border-style: solid;
  border-color: transparent;
  border-image-slice: 2 54 0 32 fill;
  border-image-repeat: stretch;
  border-image-source: url('@/assets/img/layout/menu/btn-bg-normal.png');
}
</style>
