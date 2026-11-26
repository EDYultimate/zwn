<template>
  <div
    v-if="lefttoplongshow"
    style="position: absolute; left: 0px; top: 0px; width: 18px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>
  <div
    v-if="lefttoplongshow"
    style="position: absolute; left: 21px; top: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>

  <div
    v-if="righttoplongshow"
    style="position: absolute; right: 0px; top: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>
  <div
    v-if="righttoplongshow"
    style="position: absolute; right: 11px; top: 0px; width: 18px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>

  <div
    v-if="leftbottomlongshow"
    style="position: absolute; left: 0px; bottom: 0px; width: 18px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>
  <div
    v-if="leftbottomlongshow"
    style="position: absolute; left: 21px; bottom: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>

  <div
    v-if="rightbottomlongshow"
    style="position: absolute; right: 0px; bottom: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>
  <div
    v-if="rightbottomlongshow"
    style="position: absolute; right: 11px; bottom: 0px; width: 18px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>

  <div
    v-if="lefttopshortshow"
    style="position: absolute; left: 0px; top: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>

  <div
    v-if="righttopshortshow"
    style="position: absolute; right: 0px; top: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>

  <div
    v-if="leftbottomshortshow"
    style="position: absolute; left: 0px; bottom: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>
  <div
    v-if="rightbottomshortshow"
    style="position: absolute; right: 0px; bottom: 0px; width: 8px; height: 2px; opacity: 1"
    :style="'background: ' + backgroundColor + ';' + 'z-index: ' + zindex + ';'"
  ></div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

export default {
  name: 'Borderline',
  props: {
    linetp: {
      type: String
    },
    backgroundColor: {
      type: String,
      default: '#00C0FF'
    },
    zindex: {
      type: String,
      default: '5'
    }
  },
  data() {
    return {
      lefttoplongshow: false,
      righttoplongshow: false,
      leftbottomlongshow: false,
      rightbottomlongshow: false,
      lefttopshortshow: false,
      righttopshortshow: false,
      leftbottomshortshow: false,
      rightbottomshortshow: false
    }
  },
  mounted() {
    this.makefuc()
  },
  methods: {
    makefuc() {
      //左上长
      if (this.linetp == 'lefttoplong') {
        this.lefttoplongshow = true
      }
      //右上长
      if (this.linetp == 'righttoplong') {
        this.righttoplongshow = true
      }
      //左下长
      if (this.linetp == 'leftbottomlong') {
        this.leftbottomlongshow = true
      }
      //右下长
      if (this.linetp == 'rightbottomlong') {
        this.rightbottomlongshow = true
      }

      //左上短
      if (this.linetp == 'lefttopshort') {
        this.lefttopshortshow = true
      }

      //右上短
      if (this.linetp == 'righttopshort') {
        this.righttopshortshow = true
      }
      //左下短
      if (this.linetp == 'leftbottomshort') {
        this.leftbottomshortshow = true
      }
      //右下短
      if (this.linetp == 'rightbottomshort') {
        this.rightbottomshortshow = true
      }
    }
  }
}
</script>

<style scoped></style>
