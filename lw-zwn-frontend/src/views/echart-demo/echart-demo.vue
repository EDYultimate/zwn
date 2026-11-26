<script setup lang="ts">
import { Ref } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'
const echartsRef = ref<HTMLDivElement | null>(null)
const { setOptions, echarts } = useECharts(echartsRef as Ref<HTMLDivElement>)
onMounted(() => {
  nextTick(() => {
    let base = +new Date(1968, 9, 3)
    const oneDay = 24 * 3600 * 1000
    const date = []
    const data = [Math.random() * 300]
    for (let i = 1; i < 20000; i++) {
      const now = new Date((base += oneDay))
      date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
      data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]))
    }
    setOptions({
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%']
        }
      },
      title: {
        left: 'center',
        text: 'Large Area Chart'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 70, 131)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 158, 68)'
              },
              {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }
            ])
          },
          data: data
        }
      ]
    })
  })
})
</script>

<template>
  <div ref="echartsRef" style="width: 100%; height: 100%"></div>
</template>

<style scoped></style>
