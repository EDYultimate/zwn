<script setup lang="ts">
import ywqjImg from '@/assets/img/portal/ywqj.png'
import ywqjActiveImg from '@/assets/img/portal/ywqj_active.png'
import szyczlImg from '@/assets/img/portal/szyczl.png'
import szyczlActiveImg from '@/assets/img/portal/szyczl_active.png'
import slfpImg from '@/assets/img/portal/slfp.png'
import slfpActiveImg from '@/assets/img/portal/slfp_active.png'
import dsglImg from '@/assets/img/portal/dsgl.png'
import dsglActiveImg from '@/assets/img/portal/dsgl_active.png'
import qysglImg from '@/assets/img/portal/qysgl.png'
import qysglActiveImg from '@/assets/img/portal/qysgl_active.png'
import dxsglImg from '@/assets/img/portal/dxsgl.png'
import dxsglActiveImg from '@/assets/img/portal/dxsgl_active.png'
import stslglImg from '@/assets/img/portal/stslgl.png'
import stslglActiveImg from '@/assets/img/portal/stslgl_active.png'
import hhfsImg from '@/assets/img/portal/hhfs.png'
import hhfsActiveImg from '@/assets/img/portal/hhfs_active.png'
import yyssydImg from '@/assets/img/portal/yyssyd.png'
import yyssydActiveImg from '@/assets/img/portal/yyssyd_active.png'

const leftMenuList = ref([
  {
    name: '业务全景',
    path: '/centerView',
    img: ywqjImg,
    imgActive: ywqjActiveImg
  },
  {
    name: '水资源承载力',
    path: '/waterUse',
    img: szyczlImg,
    imgActive: szyczlActiveImg
  },
  {
    name: '水量分配',
    path: '/waterAssign',
    img: slfpImg,
    imgActive: slfpActiveImg
  },
  {
    name: '调水管理',
    path: '/waterAdjust',
    img: dsglImg,
    imgActive: dsglActiveImg
  },
  {
    name: '取用水管理',
    path: '/waterUse',
    img: qysglImg,
    imgActive: qysglActiveImg
  }
])

const rightMenuList = ref([
  {
    name: '地下水管理',
    path: '/waterGround',
    img: dxsglImg,
    imgActive: dxsglActiveImg
  },
  {
    name: '生态水量管理',
    path: '/ecoFlow',
    img: stslglImg,
    imgActive: stslglActiveImg
  },
  {
    name: '河湖复苏',
    path: '/lakeRevival',
    img: hhfsImg,
    imgActive: hhfsActiveImg
  },
  {
    name: '饮用水水源地',
    path: '/waterSource',
    img: yyssydImg,
    imgActive: yyssydActiveImg
  }
])

const handleClick = (path: string) => {
  const { origin } = window.location
  window.open(`${origin}${path}`, '_blank')
}
</script>

<template>
  <div>
    <!--    <img-->
    <!--      src="@/assets/img/layout/logo/title_logo_panel.png"-->
    <!--      style="position: fixed; left: 0px; top: 0px; z-index: 5; width: 100%"-->
    <!--      alt=""-->
    <!--    />-->

    <!--    &lt;!&ndash;    <img&ndash;&gt;-->
    <!--    &lt;!&ndash;      src="@/assets/img/layout/shade/shade_panel.png"&ndash;&gt;-->
    <!--    &lt;!&ndash;      style="position: fixed; left: 0px; top: 0px; z-index: 3; width: 100%; height: 100vh"&ndash;&gt;-->
    <!--    &lt;!&ndash;      alt=""&ndash;&gt;-->
    <!--    &lt;!&ndash;    />&ndash;&gt;-->

    <!--    <img-->
    <!--      src="@/assets/img/layout/back/back_panel.png"-->
    <!--      style="position: fixed; left: 0px; top: 0px; z-index: 2; width: 100%; height: 100vh"-->
    <!--      alt=""-->
    <!--    />-->

    <div class="left-div pointer-auto">
      <div
        v-for="item in leftMenuList"
        :key="item.path"
        class="btn-wrap"
        @click="handleClick(item.path)"
      >
        <img class="img-normal" :src="item.img" alt="" />
        <img class="img-active" :src="item.imgActive" alt="" />
      </div>
    </div>
    <div class="right-div pointer-auto">
      <div
        v-for="item in rightMenuList"
        :key="item.path"
        class="btn-wrap"
        @click="handleClick(item.path)"
      >
        <img class="img-normal" :src="item.img" alt="" />
        <img class="img-active" :src="item.imgActive" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-div {
  z-index: 4;
  left: 30px;
  position: fixed;
  top: 50%;
  /* 自身宽高一半反向偏移 */
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}
.right-div {
  z-index: 4;
  right: 30px;
  position: fixed;
  top: 50%;
  /* 自身宽高一半反向偏移 */
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.btn-wrap {
  position: relative;
  cursor: pointer;
}
/* 默认隐藏激活图，显示普通图 */
.img-active {
  display: none;
}
.img-normal {
  display: block;
}
/* hover 时互换显示 */
.btn-wrap:hover .img-normal {
  display: none;
}
.btn-wrap:hover .img-active {
  display: block;
}
</style>
