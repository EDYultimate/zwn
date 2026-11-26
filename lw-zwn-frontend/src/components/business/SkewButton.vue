<script setup lang="ts">
interface Props {
  padding?: string
  active?: boolean
  activeBgColor?: string
  activeBorderColor?: string
  activeTextColor?: string
  inactiveBgColor?: string
  inactiveBorderColor?: string
  inactiveTextColor?: string
  borderRadius?: string
  skewDeg?: number
  fontSize?: string
  fontWeight?: string | number
  margin?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: '6px 26px',
  active: false,
  activeBgColor: '#e6f7ff',
  activeBorderColor: '#1890ff',
  activeTextColor: '#0091ff',
  inactiveBgColor: '#F2F4F8',
  inactiveBorderColor: '#B6BAC3',
  inactiveTextColor: '#999EA8',
  borderRadius: '8px',
  skewDeg: -15,
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 10px 0px 10px'
})

const skewTransform = computed(() => `skewX(${props.skewDeg}deg)`)

const currentBgColor = computed(() => (props.active ? props.activeBgColor : props.inactiveBgColor))
const currentBorderColor = computed(() =>
  props.active ? props.activeBorderColor : props.inactiveBorderColor
)
const currentTextColor = computed(() =>
  props.active ? props.activeTextColor : props.inactiveTextColor
)
</script>

<template>
  <div class="skew-button" :class="{ 'is-active': active }">
    <span class="skew-button__content">
      <slot />
    </span>
  </div>
</template>

<style scoped lang="scss">
.skew-button {
  position: relative;
  display: inline-block;
  padding: v-bind(padding);
  margin: v-bind(margin);
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: v-bind(currentBgColor);
    border: 1px solid v-bind(currentBorderColor);
    border-radius: v-bind(borderRadius);
    transform: v-bind(skewTransform);
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .skew-button__content {
    position: relative;
    font-weight: v-bind(fontWeight);
    font-size: v-bind(fontSize);
    color: v-bind(currentTextColor);
    transition: color 0.2s ease;

    letter-spacing: 1px;
  }

  &:not(.is-active):hover {
    transform: translateY(-1px);

    &::before {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
  }

  &:not(.is-active):active {
    transform: translateY(0);

    &::before {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
