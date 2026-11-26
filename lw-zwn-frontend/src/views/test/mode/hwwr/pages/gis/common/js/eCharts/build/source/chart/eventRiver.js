define('echarts/chart/eventRiver', [
  'require',
  './base',
  '../layout/eventRiver',
  'zrender/shape/Polygon',
  '../component/axis',
  '../component/grid',
  '../component/dataZoom',
  '../config',
  '../util/ecData',
  '../util/date',
  'zrender/tool/util',
  'zrender/tool/color',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const eventRiverLayout = require('../layout/eventRiver')
  const PolygonShape = require('zrender/shape/Polygon')
  require('../component/axis')
  require('../component/grid')
  require('../component/dataZoom')
  const ecConfig = require('../config')
  ecConfig.eventRiver = {
    zlevel: 0,
    z: 2,
    clickable: true,
    legendHoverLink: true,
    itemStyle: {
      normal: {
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}'
        }
      },
      emphasis: {
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        label: { show: true }
      }
    }
  }
  const ecData = require('../util/ecData')
  const ecDate = require('../util/date')
  const zrUtil = require('zrender/tool/util')
  const zrColor = require('zrender/tool/color')
  function EventRiver(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    const self = this
    self._ondragend = function () {
      self.isDragend = true
    }
    this.refresh(option)
  }
  EventRiver.prototype = {
    type: ecConfig.CHART_TYPE_EVENTRIVER,
    _buildShape: function () {
      const series = this.series
      this.selectedMap = {}
      this._dataPreprocessing()
      const legend = this.component.legend
      const eventRiverSeries = []
      for (let i = 0; i < series.length; i++) {
        if (series[i].type === this.type) {
          series[i] = this.reformOption(series[i])
          this.legendHoverLink = series[i].legendHoverLink || this.legendHoverLink
          const serieName = series[i].name || ''
          this.selectedMap[serieName] = legend ? legend.isSelected(serieName) : true
          if (!this.selectedMap[serieName]) {
            continue
          }
          this.buildMark(i)
          eventRiverSeries.push(this.series[i])
        }
      }
      eventRiverLayout(eventRiverSeries, this._intervalX, this.component.grid.getArea())
      this._drawEventRiver()
      this.addShapeList()
    },
    _dataPreprocessing: function () {
      const series = this.series
      let xAxis
      let evolutionList
      for (let i = 0, iLen = series.length; i < iLen; i++) {
        if (series[i].type === this.type) {
          xAxis = this.component.xAxis.getAxis(series[i].xAxisIndex || 0)
          for (let j = 0, jLen = series[i].data.length; j < jLen; j++) {
            evolutionList = series[i].data[j].evolution
            for (let k = 0, kLen = evolutionList.length; k < kLen; k++) {
              evolutionList[k].timeScale = xAxis.getCoord(
                ecDate.getNewDate(evolutionList[k].time) - 0
              )
              evolutionList[k].valueScale = Math.pow(evolutionList[k].value, 0.8)
            }
          }
        }
      }
      this._intervalX = Math.round(this.component.grid.getWidth() / 40)
    },
    _drawEventRiver: function () {
      const series = this.series
      for (let i = 0; i < series.length; i++) {
        const serieName = series[i].name || ''
        if (series[i].type === this.type && this.selectedMap[serieName]) {
          for (let j = 0; j < series[i].data.length; j++) {
            this._drawEventBubble(series[i].data[j], i, j)
          }
        }
      }
    },
    _drawEventBubble: function (oneEvent, seriesIndex, dataIndex) {
      const series = this.series
      const serie = series[seriesIndex]
      const serieName = serie.name || ''
      const data = serie.data[dataIndex]
      const queryTarget = [data, serie]
      const legend = this.component.legend
      const defaultColor = legend ? legend.getColor(serieName) : this.zr.getColor(seriesIndex)
      const normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {}
      const emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {}
      const normalColor =
        this.getItemStyleColor(normal.color, seriesIndex, dataIndex, data) || defaultColor
      const emphasisColor =
        this.getItemStyleColor(emphasis.color, seriesIndex, dataIndex, data) ||
        (typeof normalColor === 'string' ? zrColor.lift(normalColor, -0.2) : normalColor)
      const pts = this._calculateControlPoints(oneEvent)
      let eventBubbleShape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        clickable: this.deepQuery(queryTarget, 'clickable'),
        style: {
          pointList: pts,
          smooth: 'spline',
          brushType: 'both',
          lineJoin: 'round',
          color: normalColor,
          lineWidth: normal.borderWidth,
          strokeColor: normal.borderColor
        },
        highlightStyle: {
          color: emphasisColor,
          lineWidth: emphasis.borderWidth,
          strokeColor: emphasis.borderColor
        },
        draggable: 'vertical',
        ondragend: this._ondragend
      }
      eventBubbleShape = new PolygonShape(eventBubbleShape)
      this.addLabel(eventBubbleShape, serie, data, oneEvent.name)
      ecData.pack(
        eventBubbleShape,
        series[seriesIndex],
        seriesIndex,
        series[seriesIndex].data[dataIndex],
        dataIndex,
        series[seriesIndex].data[dataIndex].name
      )
      this.shapeList.push(eventBubbleShape)
    },
    _calculateControlPoints: function (oneEvent) {
      const intervalX = this._intervalX
      const posY = oneEvent.y
      const evolution = oneEvent.evolution
      const n = evolution.length
      if (n < 1) {
        return
      }
      const time = []
      const value = []
      for (var i = 0; i < n; i++) {
        time.push(evolution[i].timeScale)
        value.push(evolution[i].valueScale)
      }
      const pts = []
      pts.push([time[0], posY])
      var i = 0
      for (i = 0; i < n - 1; i++) {
        pts.push([(time[i] + time[i + 1]) / 2, value[i] / -2 + posY])
      }
      pts.push([(time[i] + (time[i] + intervalX)) / 2, value[i] / -2 + posY])
      pts.push([time[i] + intervalX, posY])
      pts.push([(time[i] + (time[i] + intervalX)) / 2, value[i] / 2 + posY])
      for (i = n - 1; i > 0; i--) {
        pts.push([(time[i] + time[i - 1]) / 2, value[i - 1] / 2 + posY])
      }
      return pts
    },
    ondragend: function (param, status) {
      if (!this.isDragend || !param.target) {
        return
      }
      status.dragOut = true
      status.dragIn = true
      status.needRefresh = false
      this.isDragend = false
    },
    refresh: function (newOption) {
      if (newOption) {
        this.option = newOption
        this.series = newOption.series
      }
      this.backupShapeList()
      this._buildShape()
    }
  }
  zrUtil.inherits(EventRiver, ChartBase)
  require('../chart').define('eventRiver', EventRiver)
  return EventRiver
})
define('echarts/layout/eventRiver', ['require'], function (require) {
  function eventRiverLayout(series, intervalX, area) {
    const space = 5
    const scale = intervalX
    function importanceSort(a, b) {
      const x = a.importance
      const y = b.importance
      return x > y ? -1 : x < y ? 1 : 0
    }
    function indexOf(array, value) {
      if (array.indexOf) {
        return array.indexOf(value)
      }
      for (let i = 0, len = array.length; i < len; i++) {
        if (array[i] === value) {
          return i
        }
      }
      return -1
    }
    for (var i = 0; i < series.length; i++) {
      for (var j = 0; j < series[i].data.length; j++) {
        if (series[i].data[j].weight == null) {
          series[i].data[j].weight = 1
        }
        var importance = 0
        for (var k = 0; k < series[i].data[j].evolution.length; k++) {
          importance += series[i].data[j].evolution[k].valueScale
        }
        series[i].data[j].importance = importance * series[i].data[j].weight
      }
      series[i].data.sort(importanceSort)
    }
    for (var i = 0; i < series.length; i++) {
      if (series[i].weight == null) {
        series[i].weight = 1
      }
      var importance = 0
      for (var j = 0; j < series[i].data.length; j++) {
        importance += series[i].data[j].weight
      }
      series[i].importance = importance * series[i].weight
    }
    series.sort(importanceSort)
    let minTime = Number.MAX_VALUE
    let maxTime = 0
    for (var i = 0; i < series.length; i++) {
      for (var j = 0; j < series[i].data.length; j++) {
        for (var k = 0; k < series[i].data[j].evolution.length; k++) {
          const time = series[i].data[j].evolution[k].timeScale
          minTime = Math.min(minTime, time)
          maxTime = Math.max(maxTime, time)
        }
      }
    }
    const root = segmentTreeBuild(Math.floor(minTime), Math.ceil(maxTime))
    let totalMaxY = 0
    for (var i = 0; i < series.length; i++) {
      for (var j = 0; j < series[i].data.length; j++) {
        const e = series[i].data[j]
        e.time = []
        e.value = []
        for (var k = 0; k < series[i].data[j].evolution.length; k++) {
          e.time.push(series[i].data[j].evolution[k].timeScale)
          e.value.push(series[i].data[j].evolution[k].valueScale)
        }
        const mxIndex = indexOf(e.value, Math.max.apply(Math, e.value))
        const maxY = segmentTreeQuery(root, e.time[mxIndex], e.time[mxIndex + 1])
        var k = 0
        e.y = maxY + e.value[mxIndex] / 2 + space
        for (k = 0; k < e.time.length - 1; k++) {
          var curMaxY = segmentTreeQuery(root, e.time[k], e.time[k + 1])
          if (e.y - e.value[k] / 2 - space < curMaxY) {
            e.y = curMaxY + e.value[k] / 2 + space
          }
        }
        var curMaxY = segmentTreeQuery(root, e.time[k], e.time[k] + scale)
        if (e.y - e.value[k] / 2 - space < curMaxY) {
          e.y = curMaxY + e.value[k] / 2 + space
        }
        series[i].y = e.y
        totalMaxY = Math.max(totalMaxY, e.y + e.value[mxIndex] / 2)
        for (k = 0; k < e.time.length - 1; k++) {
          segmentTreeInsert(root, e.time[k], e.time[k + 1], e.y + e.value[k] / 2)
        }
        segmentTreeInsert(root, e.time[k], e.time[k] + scale, e.y + e.value[k] / 2)
      }
    }
    scaleY(series, area, totalMaxY, space)
  }
  function scaleY(series, area, maxY, space) {
    const yBase = area.y
    const yScale = (area.height - space) / maxY
    for (let i = 0; i < series.length; i++) {
      series[i].y = series[i].y * yScale + yBase
      const eventList = series[i].data
      for (let j = 0; j < eventList.length; j++) {
        eventList[j].y = eventList[j].y * yScale + yBase
        const evolutionList = eventList[j].evolution
        for (let k = 0; k < evolutionList.length; k++) {
          evolutionList[k].valueScale *= yScale * 1
        }
      }
    }
  }
  function segmentTreeBuild(left, right) {
    const root = {
      left: left,
      right: right,
      leftChild: null,
      rightChild: null,
      maxValue: 0
    }
    if (left + 1 < right) {
      const mid = Math.round((left + right) / 2)
      root.leftChild = segmentTreeBuild(left, mid)
      root.rightChild = segmentTreeBuild(mid, right)
    }
    return root
  }
  function segmentTreeQuery(root, left, right) {
    if (right - left < 1) {
      return 0
    }
    const mid = Math.round((root.left + root.right) / 2)
    let result = 0
    if (left == root.left && right == root.right) {
      result = root.maxValue
    } else if (right <= mid && root.leftChild != null) {
      result = segmentTreeQuery(root.leftChild, left, right)
    } else if (left >= mid && root.rightChild != null) {
      result = segmentTreeQuery(root.rightChild, left, right)
    } else {
      let leftValue = 0
      let rightValue = 0
      if (root.leftChild != null) {
        leftValue = segmentTreeQuery(root.leftChild, left, mid)
      }
      if (root.rightChild != null) {
        rightValue = segmentTreeQuery(root.rightChild, mid, right)
      }
      result = leftValue > rightValue ? leftValue : rightValue
    }
    return result
  }
  function segmentTreeInsert(root, left, right, value) {
    if (root == null) {
      return
    }
    const mid = Math.round((root.left + root.right) / 2)
    root.maxValue = root.maxValue > value ? root.maxValue : value
    if (
      Math.floor(left * 10) == Math.floor(root.left * 10) &&
      Math.floor(right * 10) == Math.floor(root.right * 10)
    ) {
    } else if (right <= mid) {
      segmentTreeInsert(root.leftChild, left, right, value)
    } else if (left >= mid) {
      segmentTreeInsert(root.rightChild, left, right, value)
    } else {
      segmentTreeInsert(root.leftChild, left, mid, value)
      segmentTreeInsert(root.rightChild, mid, right, value)
    }
  }
  return eventRiverLayout
})
