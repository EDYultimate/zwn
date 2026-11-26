<template>
  <div class="titlelItem4z">
    <div class="itemTitlew" :style="{ 'background-image': 'url(' + imageUrl + ')' }">
      <div v-if="isLong" class="midLinesL"></div>
      <div v-else-if="isLLong" class="midLinesLL"></div>
      <div v-else class="midLinesS"></div>
      <span
        :style="{
          marginLeft: props.context && props.context.length === 7 ? '-15px' : '',
          color: isSelected ? '#27FFF9' : '#FFF'
        }"
        >{{ props.context }}</span
      >
      <div style="z-index: 5">
        <slot></slot>
      </div>

      <img
        v-if="isClickBtn"
        class="btn_enter_ico"
        src="/static/img/waterEcoDeploy/icons/detailPic.png"
        @click="btnClick"
      />
    </div>
  </div>
</template>
<script setup>
const { proxy } = getCurrentInstance()

const props = defineProps({
  //标签文字
  context: {
    type: String,
    default: '',
    required: true
  },
  //是否显示按钮
  isClickBtn: {
    type: Boolean,
    default: true,
    required: false
  },

  //是否显示按钮
  isSelected: {
    type: Boolean,
    default: false,
    required: false
  }
})

//可以抛出点击事件
const emit = defineEmits(['btnClick'])

const lineLenght4 = ref('145px')
const lineLenght6 = ref('187px')
const lineLenght8 = ref('250px')

function btnClick() {
  emit('btnClick')
}

const wordCount = computed({
  get() {
    if (props.context) {
      return props.context.length
    }
    return 4
  }
})

const imageUrl = ref('/static/img/waterEcoDeploy/display/item-title-back-s.png')

const isLong = ref(false)
const isLLong = ref(false)
onMounted(() => {
  if (!props.isClickBtn) {
    lineLenght4.value = '125px'
    lineLenght6.value = '167px'
    lineLenght8.value = '245px'
  }
  proxy.$nextTick(() => {
    if (wordCount.value && wordCount.value > 4 && wordCount.value < 8) {
      imageUrl.value = '/static/img/waterEcoDeploy/display/item-title-back-l.png'
      isLong.value = true
      isLLong.value = false
    } else if (wordCount.value && wordCount.value >= 8) {
      imageUrl.value = '/static/img/waterEcoDeploy/display/item-title-back-ll.png'
      isLong.value.false = false
      isLLong.value = true
    } else {
      imageUrl.value = '/static/img/waterEcoDeploy/display/item-title-back-s.png'
      isLong.value = false
      isLLong.value = false
    }
  })
})
</script>
<style lang="scss" scoped>
.titlelItem4z {
  // padding: v-bind(padTop) v-bind(padRight) v-bind(padBottom) v-bind(padLeft);
  // margin: v-bind(marTop) v-bind(marRight) v-bind(marBottom) v-bind(marLeft);

  .itemTitlew {
    padding: 5px 8px 5px 15px;
    position: relative;
    background-image: url('/static/img/waterEcoDeploy/display/item-title-back-s.png');
    background-size: auto 100%;
    //background-position: left;
    background-repeat: no-repeat;
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    user-select: none; /* Standard */

    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 18px;
      font-family: SourceHanSansCN-Boldx;
      // font-weight: 600;
      letter-spacing: 1px;
      line-height: 42px;
      color: #fff;
    }

    .btn_enter_ico {
      cursor: pointer;
      z-index: 3;
    }

    .midLinesS {
      width: calc(100% - v-bind(lineLenght4));
      border-bottom: 1px solid #249ae9;
      position: absolute;
      margin: 0 0 0 93px;
      z-index: 2;
    }
    .midLinesL {
      width: calc(100% - v-bind(lineLenght6));
      border-bottom: 1px solid #249ae9;
      position: absolute;
      margin: 0 0 0 134px;
      z-index: 2;
    }
    .midLinesLL {
      width: calc(100% - v-bind(lineLenght8));
      border-bottom: 1px solid #249ae9;
      position: absolute;
      margin: 0 0 0 216px;
      z-index: 2;
    }
  }
}
</style>
