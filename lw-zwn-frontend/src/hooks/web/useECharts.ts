import { tryOnUnmounted, useDebounceFn } from '@vueuse/core'
// @ts-ignore
import elementResize from 'element-resize-detector'
import { computed, nextTick, ref, unref, watch } from 'vue'

import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'

import { useDesignSetting } from '@/config/theme/useDesignSetting'
import { useTimeoutFn } from '@/hooks/core/useTimeout'
import { useBreakpoint } from '@/hooks/event/useBreakpoint'
import echarts from '@/plugins/echarts'

export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'default',
  fontFamily = 'Source Han Sans CN'
) {
  const { getDarkTheme: getSysDarkTheme } = useDesignSetting()

  const getDarkTheme = computed(() => {
    const sysTheme: string = getSysDarkTheme.value ? 'dark' : 'light'
    return theme === 'default' ? sysTheme : theme
  })
  const chartResizeListen = elementResize({
    strategy: 'scroll',
    callOnAdd: true
  })
  let chartInstance: echarts.ECharts | null = null
  // resize 监听只注册一次，避免多次 setOptions 叠加回调
  let resizeListening = false
  const cacheOptions = ref({})
  const resizeFn = useDebounceFn(resize, 200)

  const getOptions = computed((): EChartsOption => {
    if (getDarkTheme.value !== 'dark') {
      return {
        textStyle: {
          fontFamily
        },
        ...cacheOptions.value
      }
    }
    return {
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily
      },
      ...cacheOptions.value
    }
  })

  function initCharts(t = theme) {
    const el = unref(elRef)
    if (!el || !unref(el)) {
      return
    }

    chartInstance = echarts.init(el, t)
    const { widthRef, screenEnum } = useBreakpoint()
    if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn()
      }, 30)
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    // 容器因 v-if 被销毁重建时，旧实例绑定的 DOM 已脱离文档，需重新初始化
    if (chartInstance && !document.body.contains(chartInstance.getDom())) {
      chartInstance.dispose()
      chartInstance = null
      resizeListening = false
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts(getDarkTheme.value as 'default')
          if (!chartInstance) {
            return
          }
        }
        clear && chartInstance?.clear()
        chartInstance?.setOption(unref(getOptions))
      }, 30)
      if (!resizeListening && elRef.value) {
        chartResizeListen.listenTo(elRef.value, resizeFn)
        resizeListening = true
      }
    })
  }

  function resize() {
    chartInstance?.resize()
  }

  watch(
    () => getDarkTheme.value,
    (theme) => {
      if (chartInstance) {
        chartInstance.dispose()
        initCharts(theme as 'default')
        setOptions(cacheOptions.value)
      }
    }
  )

  tryOnUnmounted(disposeInstance)

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkTheme.value as 'default')
    }
    return chartInstance
  }

  function disposeInstance() {
    if (resizeListening && elRef.value) {
      chartResizeListen.removeListener(elRef.value, resizeFn)
      resizeListening = false
    }
    chartInstance?.dispose()
    chartInstance = null
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
    disposeInstance
  }
}
