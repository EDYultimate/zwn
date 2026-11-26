define('echarts/chart/gauge', [
  'require',
  './base',
  '../util/shape/GaugePointer',
  'zrender/shape/Text',
  'zrender/shape/Line',
  'zrender/shape/Rectangle',
  'zrender/shape/Circle',
  'zrender/shape/Sector',
  '../config',
  '../util/ecData',
  '../util/accMath',
  'zrender/tool/util',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const GaugePointerShape = require('../util/shape/GaugePointer')
  const TextShape = require('zrender/shape/Text')
  const LineShape = require('zrender/shape/Line')
  const RectangleShape = require('zrender/shape/Rectangle')
  const CircleShape = require('zrender/shape/Circle')
  const SectorShape = require('zrender/shape/Sector')
  const ecConfig = require('../config')
  ecConfig.gauge = {
    zlevel: 0,
    z: 2,
    center: ['50%', '50%'],
    clickable: true,
    legendHoverLink: true,
    radius: '75%',
    startAngle: 225,
    endAngle: -45,
    min: 0,
    max: 100,
    splitNumber: 10,
    axisLine: {
      show: true,
      lineStyle: {
        color: [
          [0.2, '#228b22'],
          [0.8, '#48b'],
          [1, '#ff4500']
        ],
        width: 30
      }
    },
    axisTick: {
      show: true,
      splitNumber: 5,
      length: 8,
      lineStyle: {
        color: '#eee',
        width: 1,
        type: 'solid'
      }
    },
    axisLabel: {
      show: true,
      textStyle: { color: 'auto' }
    },
    splitLine: {
      show: true,
      length: 30,
      lineStyle: {
        color: '#eee',
        width: 2,
        type: 'solid'
      }
    },
    pointer: {
      show: true,
      length: '80%',
      width: 8,
      color: 'auto'
    },
    title: {
      show: true,
      offsetCenter: [0, '-40%'],
      textStyle: {
        color: '#333',
        fontSize: 15
      }
    },
    detail: {
      show: true,
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
      borderColor: '#ccc',
      width: 100,
      height: 40,
      offsetCenter: [0, '40%'],
      textStyle: {
        color: 'auto',
        fontSize: 30
      }
    }
  }
  const ecData = require('../util/ecData')
  const accMath = require('../util/accMath')
  const zrUtil = require('zrender/tool/util')
  function Gauge(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  Gauge.prototype = {
    type: ecConfig.CHART_TYPE_GAUGE,
    _buildShape: function () {
      const series = this.series
      this._paramsMap = {}
      for (let i = 0, l = series.length; i < l; i++) {
        if (series[i].type === ecConfig.CHART_TYPE_GAUGE) {
          series[i] = this.reformOption(series[i])
          this.legendHoverLink = series[i].legendHoverLink || this.legendHoverLink
          this._buildSingleGauge(i)
          this.buildMark(i)
        }
      }
      this.addShapeList()
    },
    _buildSingleGauge: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      this._paramsMap[seriesIndex] = {
        center: this.parseCenter(this.zr, serie.center),
        radius: this.parseRadius(this.zr, serie.radius),
        startAngle: serie.startAngle.toFixed(2) - 0,
        endAngle: serie.endAngle.toFixed(2) - 0
      }
      this._paramsMap[seriesIndex].totalAngle =
        this._paramsMap[seriesIndex].startAngle - this._paramsMap[seriesIndex].endAngle
      this._colorMap(seriesIndex)
      this._buildAxisLine(seriesIndex)
      this._buildSplitLine(seriesIndex)
      this._buildAxisTick(seriesIndex)
      this._buildAxisLabel(seriesIndex)
      this._buildPointer(seriesIndex)
      this._buildTitle(seriesIndex)
      this._buildDetail(seriesIndex)
    },
    _buildAxisLine: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.axisLine.show) {
        return
      }
      const min = serie.min
      const total = serie.max - min
      const params = this._paramsMap[seriesIndex]
      const center = params.center
      const startAngle = params.startAngle
      const totalAngle = params.totalAngle
      const colorArray = params.colorArray
      const lineStyle = serie.axisLine.lineStyle
      const lineWidth = this.parsePercent(lineStyle.width, params.radius[1])
      const r = params.radius[1]
      const r0 = r - lineWidth
      let sectorShape
      let lastAngle = startAngle
      let newAngle
      for (let i = 0, l = colorArray.length; i < l; i++) {
        newAngle = startAngle - (totalAngle * (colorArray[i][0] - min)) / total
        sectorShape = this._getSector(
          center,
          r0,
          r,
          newAngle,
          lastAngle,
          colorArray[i][1],
          lineStyle
        )
        lastAngle = newAngle
        sectorShape._animationAdd = 'r'
        ecData.set(sectorShape, 'seriesIndex', seriesIndex)
        ecData.set(sectorShape, 'dataIndex', i)
        this.shapeList.push(sectorShape)
      }
    },
    _buildSplitLine: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.splitLine.show) {
        return
      }
      const params = this._paramsMap[seriesIndex]
      const splitNumber = serie.splitNumber
      const min = serie.min
      const total = serie.max - min
      const splitLine = serie.splitLine
      const length = this.parsePercent(splitLine.length, params.radius[1])
      const lineStyle = splitLine.lineStyle
      const color = lineStyle.color
      const center = params.center
      const startAngle = (params.startAngle * Math.PI) / 180
      const totalAngle = (params.totalAngle * Math.PI) / 180
      const r = params.radius[1]
      const r0 = r - length
      let angle
      let sinAngle
      let cosAngle
      for (let i = 0; i <= splitNumber; i++) {
        angle = startAngle - (totalAngle / splitNumber) * i
        sinAngle = Math.sin(angle)
        cosAngle = Math.cos(angle)
        this.shapeList.push(
          new LineShape({
            zlevel: this.getZlevelBase(),
            z: this.getZBase() + 1,
            hoverable: false,
            style: {
              xStart: center[0] + cosAngle * r,
              yStart: center[1] - sinAngle * r,
              xEnd: center[0] + cosAngle * r0,
              yEnd: center[1] - sinAngle * r0,
              strokeColor:
                color === 'auto'
                  ? this._getColor(seriesIndex, min + (total / splitNumber) * i)
                  : color,
              lineType: lineStyle.type,
              lineWidth: lineStyle.width,
              shadowColor: lineStyle.shadowColor,
              shadowBlur: lineStyle.shadowBlur,
              shadowOffsetX: lineStyle.shadowOffsetX,
              shadowOffsetY: lineStyle.shadowOffsetY
            }
          })
        )
      }
    },
    _buildAxisTick: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.axisTick.show) {
        return
      }
      const params = this._paramsMap[seriesIndex]
      const splitNumber = serie.splitNumber
      const min = serie.min
      const total = serie.max - min
      const axisTick = serie.axisTick
      const tickSplit = axisTick.splitNumber
      const length = this.parsePercent(axisTick.length, params.radius[1])
      const lineStyle = axisTick.lineStyle
      const color = lineStyle.color
      const center = params.center
      const startAngle = (params.startAngle * Math.PI) / 180
      const totalAngle = (params.totalAngle * Math.PI) / 180
      const r = params.radius[1]
      const r0 = r - length
      let angle
      let sinAngle
      let cosAngle
      for (let i = 0, l = splitNumber * tickSplit; i <= l; i++) {
        if (i % tickSplit === 0) {
          continue
        }
        angle = startAngle - (totalAngle / l) * i
        sinAngle = Math.sin(angle)
        cosAngle = Math.cos(angle)
        this.shapeList.push(
          new LineShape({
            zlevel: this.getZlevelBase(),
            z: this.getZBase() + 1,
            hoverable: false,
            style: {
              xStart: center[0] + cosAngle * r,
              yStart: center[1] - sinAngle * r,
              xEnd: center[0] + cosAngle * r0,
              yEnd: center[1] - sinAngle * r0,
              strokeColor:
                color === 'auto' ? this._getColor(seriesIndex, min + (total / l) * i) : color,
              lineType: lineStyle.type,
              lineWidth: lineStyle.width,
              shadowColor: lineStyle.shadowColor,
              shadowBlur: lineStyle.shadowBlur,
              shadowOffsetX: lineStyle.shadowOffsetX,
              shadowOffsetY: lineStyle.shadowOffsetY
            }
          })
        )
      }
    },
    _buildAxisLabel: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.axisLabel.show) {
        return
      }
      const splitNumber = serie.splitNumber
      const min = serie.min
      const total = serie.max - min
      const textStyle = serie.axisLabel.textStyle
      const textFont = this.getFont(textStyle)
      const color = textStyle.color
      const params = this._paramsMap[seriesIndex]
      const center = params.center
      const startAngle = params.startAngle
      const totalAngle = params.totalAngle
      const r0 = params.radius[1] - this.parsePercent(serie.splitLine.length, params.radius[1]) - 5
      let angle
      let sinAngle
      let cosAngle
      let value
      for (let i = 0; i <= splitNumber; i++) {
        value = accMath.accAdd(min, accMath.accMul(accMath.accDiv(total, splitNumber), i))
        angle = startAngle - (totalAngle / splitNumber) * i
        sinAngle = Math.sin((angle * Math.PI) / 180)
        cosAngle = Math.cos((angle * Math.PI) / 180)
        angle = (angle + 360) % 360
        this.shapeList.push(
          new TextShape({
            zlevel: this.getZlevelBase(),
            z: this.getZBase() + 1,
            hoverable: false,
            style: {
              x: center[0] + cosAngle * r0,
              y: center[1] - sinAngle * r0,
              color: color === 'auto' ? this._getColor(seriesIndex, value) : color,
              text: this._getLabelText(serie.axisLabel.formatter, value),
              textAlign:
                angle >= 110 && angle <= 250
                  ? 'left'
                  : angle <= 70 || angle >= 290
                    ? 'right'
                    : 'center',
              textBaseline:
                angle >= 10 && angle <= 170
                  ? 'top'
                  : angle >= 190 && angle <= 350
                    ? 'bottom'
                    : 'middle',
              textFont: textFont,
              shadowColor: textStyle.shadowColor,
              shadowBlur: textStyle.shadowBlur,
              shadowOffsetX: textStyle.shadowOffsetX,
              shadowOffsetY: textStyle.shadowOffsetY
            }
          })
        )
      }
    },
    _buildPointer: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.pointer.show) {
        return
      }
      const total = serie.max - serie.min
      const pointer = serie.pointer
      const params = this._paramsMap[seriesIndex]
      const length = this.parsePercent(pointer.length, params.radius[1])
      const width = this.parsePercent(pointer.width, params.radius[1])
      const center = params.center
      let value = this._getValue(seriesIndex)
      value = value < serie.max ? value : serie.max
      const angle =
        ((params.startAngle - (params.totalAngle / total) * (value - serie.min)) * Math.PI) / 180
      const color = pointer.color === 'auto' ? this._getColor(seriesIndex, value) : pointer.color
      const pointShape = new GaugePointerShape({
        zlevel: this.getZlevelBase(),
        z: this.getZBase() + 1,
        clickable: this.query(serie, 'clickable'),
        style: {
          x: center[0],
          y: center[1],
          r: length,
          startAngle: (params.startAngle * Math.PI) / 180,
          angle: angle,
          color: color,
          width: width,
          shadowColor: pointer.shadowColor,
          shadowBlur: pointer.shadowBlur,
          shadowOffsetX: pointer.shadowOffsetX,
          shadowOffsetY: pointer.shadowOffsetY
        },
        highlightStyle: {
          brushType: 'fill',
          width: width > 2 ? 2 : width / 2,
          color: '#fff'
        }
      })
      ecData.pack(
        pointShape,
        this.series[seriesIndex],
        seriesIndex,
        this.series[seriesIndex].data[0],
        0,
        this.series[seriesIndex].data[0].name,
        value
      )
      this.shapeList.push(pointShape)
      this.shapeList.push(
        new CircleShape({
          zlevel: this.getZlevelBase(),
          z: this.getZBase() + 2,
          hoverable: false,
          style: {
            x: center[0],
            y: center[1],
            r: pointer.width / 2.5,
            color: '#fff'
          }
        })
      )
    },
    _buildTitle: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.title.show) {
        return
      }
      const data = serie.data[0]
      const name = data.name != null ? data.name : ''
      if (name !== '') {
        const title = serie.title
        const offsetCenter = title.offsetCenter
        const textStyle = title.textStyle
        const textColor = textStyle.color
        const params = this._paramsMap[seriesIndex]
        const x = params.center[0] + this.parsePercent(offsetCenter[0], params.radius[1])
        const y = params.center[1] + this.parsePercent(offsetCenter[1], params.radius[1])
        this.shapeList.push(
          new TextShape({
            zlevel: this.getZlevelBase(),
            z:
              this.getZBase() +
              (Math.abs(x - params.center[0]) + Math.abs(y - params.center[1]) <
              textStyle.fontSize * 2
                ? 2
                : 1),
            hoverable: false,
            style: {
              x: x,
              y: y,
              color: textColor === 'auto' ? this._getColor(seriesIndex) : textColor,
              text: name,
              textAlign: 'center',
              textFont: this.getFont(textStyle),
              shadowColor: textStyle.shadowColor,
              shadowBlur: textStyle.shadowBlur,
              shadowOffsetX: textStyle.shadowOffsetX,
              shadowOffsetY: textStyle.shadowOffsetY
            }
          })
        )
      }
    },
    _buildDetail: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (!serie.detail.show) {
        return
      }
      const detail = serie.detail
      const offsetCenter = detail.offsetCenter
      const color = detail.backgroundColor
      const textStyle = detail.textStyle
      const textColor = textStyle.color
      const params = this._paramsMap[seriesIndex]
      const value = this._getValue(seriesIndex)
      const x =
        params.center[0] - detail.width / 2 + this.parsePercent(offsetCenter[0], params.radius[1])
      const y = params.center[1] + this.parsePercent(offsetCenter[1], params.radius[1])
      this.shapeList.push(
        new RectangleShape({
          zlevel: this.getZlevelBase(),
          z:
            this.getZBase() +
            (Math.abs(x + detail.width / 2 - params.center[0]) +
              Math.abs(y + detail.height / 2 - params.center[1]) <
            textStyle.fontSize
              ? 2
              : 1),
          hoverable: false,
          style: {
            x: x,
            y: y,
            width: detail.width,
            height: detail.height,
            brushType: 'both',
            color: color === 'auto' ? this._getColor(seriesIndex, value) : color,
            lineWidth: detail.borderWidth,
            strokeColor: detail.borderColor,
            shadowColor: detail.shadowColor,
            shadowBlur: detail.shadowBlur,
            shadowOffsetX: detail.shadowOffsetX,
            shadowOffsetY: detail.shadowOffsetY,
            text: this._getLabelText(detail.formatter, value),
            textFont: this.getFont(textStyle),
            textPosition: 'inside',
            textColor: textColor === 'auto' ? this._getColor(seriesIndex, value) : textColor
          }
        })
      )
    },
    _getValue: function (seriesIndex) {
      return this.getDataFromOption(this.series[seriesIndex].data[0])
    },
    _colorMap: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      const min = serie.min
      const total = serie.max - min
      let color = serie.axisLine.lineStyle.color
      if (!(color instanceof Array)) {
        color = [[1, color]]
      }
      const colorArray = []
      for (let i = 0, l = color.length; i < l; i++) {
        colorArray.push([color[i][0] * total + min, color[i][1]])
      }
      this._paramsMap[seriesIndex].colorArray = colorArray
    },
    _getColor: function (seriesIndex, value) {
      if (value == null) {
        value = this._getValue(seriesIndex)
      }
      const colorArray = this._paramsMap[seriesIndex].colorArray
      for (let i = 0, l = colorArray.length; i < l; i++) {
        if (colorArray[i][0] >= value) {
          return colorArray[i][1]
        }
      }
      return colorArray[colorArray.length - 1][1]
    },
    _getSector: function (center, r0, r, startAngle, endAngle, color, lineStyle) {
      return new SectorShape({
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        hoverable: false,
        style: {
          x: center[0],
          y: center[1],
          r0: r0,
          r: r,
          startAngle: startAngle,
          endAngle: endAngle,
          brushType: 'fill',
          color: color,
          shadowColor: lineStyle.shadowColor,
          shadowBlur: lineStyle.shadowBlur,
          shadowOffsetX: lineStyle.shadowOffsetX,
          shadowOffsetY: lineStyle.shadowOffsetY
        }
      })
    },
    _getLabelText: function (formatter, value) {
      if (formatter) {
        if (typeof formatter === 'function') {
          return formatter.call(this.myChart, value)
        } else if (typeof formatter === 'string') {
          return formatter.replace('{value}', value)
        }
      }
      return value
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
  zrUtil.inherits(Gauge, ChartBase)
  require('../chart').define('gauge', Gauge)
  return Gauge
})
define('echarts/util/shape/GaugePointer', [
  'require',
  'zrender/shape/Base',
  'zrender/tool/util',
  './normalIsCover'
], function (require) {
  const Base = require('zrender/shape/Base')
  const zrUtil = require('zrender/tool/util')
  function GaugePointer(options) {
    Base.call(this, options)
  }
  GaugePointer.prototype = {
    type: 'gauge-pointer',
    buildPath: function (ctx, style) {
      const r = style.r
      const width = style.width
      let angle = style.angle
      const x = style.x - Math.cos(angle) * width * (width >= r / 3 ? 1 : 2)
      const y = style.y + Math.sin(angle) * width * (width >= r / 3 ? 1 : 2)
      angle = style.angle - Math.PI / 2
      ctx.moveTo(x, y)
      ctx.lineTo(style.x + Math.cos(angle) * width, style.y - Math.sin(angle) * width)
      ctx.lineTo(style.x + Math.cos(style.angle) * r, style.y - Math.sin(style.angle) * r)
      ctx.lineTo(style.x - Math.cos(angle) * width, style.y + Math.sin(angle) * width)
      ctx.lineTo(x, y)
    },
    getRect: function (style) {
      if (style.__rect) {
        return style.__rect
      }
      const width = style.width * 2
      const xStart = style.x
      const yStart = style.y
      const xEnd = xStart + Math.cos(style.angle) * style.r
      const yEnd = yStart - Math.sin(style.angle) * style.r
      style.__rect = {
        x: Math.min(xStart, xEnd) - width,
        y: Math.min(yStart, yEnd) - width,
        width: Math.abs(xStart - xEnd) + width,
        height: Math.abs(yStart - yEnd) + width
      }
      return style.__rect
    },
    isCover: require('./normalIsCover')
  }
  zrUtil.inherits(GaugePointer, Base)
  return GaugePointer
})
