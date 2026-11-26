define('echarts/chart/radar', [
  'require',
  './base',
  'zrender/shape/Polygon',
  '../component/polar',
  '../config',
  '../util/ecData',
  'zrender/tool/util',
  'zrender/tool/color',
  '../util/accMath',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const PolygonShape = require('zrender/shape/Polygon')
  require('../component/polar')
  const ecConfig = require('../config')
  ecConfig.radar = {
    zlevel: 0,
    z: 2,
    clickable: true,
    legendHoverLink: true,
    polarIndex: 0,
    itemStyle: {
      normal: {
        label: { show: false },
        lineStyle: {
          width: 2,
          type: 'solid'
        }
      },
      emphasis: { label: { show: false } }
    },
    symbolSize: 2
  }
  const ecData = require('../util/ecData')
  const zrUtil = require('zrender/tool/util')
  const zrColor = require('zrender/tool/color')
  function Radar(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  Radar.prototype = {
    type: ecConfig.CHART_TYPE_RADAR,
    _buildShape: function () {
      this.selectedMap = {}
      this._symbol = this.option.symbolList
      this._queryTarget
      this._dropBoxList = []
      this._radarDataCounter = 0
      const series = this.series
      const legend = this.component.legend
      let serieName
      for (let i = 0, l = series.length; i < l; i++) {
        if (series[i].type === ecConfig.CHART_TYPE_RADAR) {
          this.serie = this.reformOption(series[i])
          this.legendHoverLink = series[i].legendHoverLink || this.legendHoverLink
          serieName = this.serie.name || ''
          this.selectedMap[serieName] = legend ? legend.isSelected(serieName) : true
          if (this.selectedMap[serieName]) {
            this._queryTarget = [this.serie, this.option]
            if (this.deepQuery(this._queryTarget, 'calculable')) {
              this._addDropBox(i)
            }
            this._buildSingleRadar(i)
            this.buildMark(i)
          }
        }
      }
      this.addShapeList()
    },
    _buildSingleRadar: function (index) {
      const legend = this.component.legend
      let iconShape
      const data = this.serie.data
      let defaultColor
      let name
      let pointList
      const calculable = this.deepQuery(this._queryTarget, 'calculable')
      for (let i = 0; i < data.length; i++) {
        name = data[i].name || ''
        this.selectedMap[name] = legend ? legend.isSelected(name) : true
        if (!this.selectedMap[name]) {
          continue
        }
        if (legend) {
          defaultColor = legend.getColor(name)
          iconShape = legend.getItemShape(name)
          if (iconShape) {
            iconShape.style.brushType = this.deepQuery(
              [data[i], this.serie],
              'itemStyle.normal.areaStyle'
            )
              ? 'both'
              : 'stroke'
            legend.setItemShape(name, iconShape)
          }
        } else {
          defaultColor = this.zr.getColor(i)
        }
        pointList = this._getPointList(this.serie.polarIndex, data[i])
        this._addSymbol(pointList, defaultColor, i, index, this.serie.polarIndex)
        this._addDataShape(pointList, defaultColor, data[i], index, i, calculable)
        this._radarDataCounter++
      }
    },
    _getPointList: function (polarIndex, dataArr) {
      const pointList = []
      let vector
      const polar = this.component.polar
      let value
      for (let i = 0, l = dataArr.value.length; i < l; i++) {
        value = this.getDataFromOption(dataArr.value[i])
        vector = value != '-' ? polar.getVector(polarIndex, i, value) : false
        if (vector) {
          pointList.push(vector)
        }
      }
      return pointList
    },
    _addSymbol: function (pointList, defaultColor, dataIndex, seriesIndex, polarIndex) {
      const series = this.series
      let itemShape
      const polar = this.component.polar
      for (let i = 0, l = pointList.length; i < l; i++) {
        itemShape = this.getSymbolShape(
          this.deepMerge([series[seriesIndex].data[dataIndex], series[seriesIndex]]),
          seriesIndex,
          series[seriesIndex].data[dataIndex].value[i],
          i,
          polar.getIndicatorText(polarIndex, i),
          pointList[i][0],
          pointList[i][1],
          this._symbol[this._radarDataCounter % this._symbol.length],
          defaultColor,
          '#fff',
          'vertical'
        )
        itemShape.zlevel = this.getZlevelBase()
        itemShape.z = this.getZBase() + 1
        ecData.set(itemShape, 'data', series[seriesIndex].data[dataIndex])
        ecData.set(itemShape, 'value', series[seriesIndex].data[dataIndex].value)
        ecData.set(itemShape, 'dataIndex', dataIndex)
        ecData.set(itemShape, 'special', i)
        this.shapeList.push(itemShape)
      }
    },
    _addDataShape: function (pointList, defaultColor, data, seriesIndex, dataIndex, calculable) {
      const series = this.series
      const queryTarget = [data, this.serie]
      const nColor = this.getItemStyleColor(
        this.deepQuery(queryTarget, 'itemStyle.normal.color'),
        seriesIndex,
        dataIndex,
        data
      )
      const nLineWidth = this.deepQuery(queryTarget, 'itemStyle.normal.lineStyle.width')
      const nLineType = this.deepQuery(queryTarget, 'itemStyle.normal.lineStyle.type')
      const nAreaColor = this.deepQuery(queryTarget, 'itemStyle.normal.areaStyle.color')
      const nIsAreaFill = this.deepQuery(queryTarget, 'itemStyle.normal.areaStyle')
      let shape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        style: {
          pointList: pointList,
          brushType: nIsAreaFill ? 'both' : 'stroke',
          color:
            nAreaColor ||
            nColor ||
            (typeof defaultColor === 'string' ? zrColor.alpha(defaultColor, 0.5) : defaultColor),
          strokeColor: nColor || defaultColor,
          lineWidth: nLineWidth,
          lineType: nLineType
        },
        highlightStyle: {
          brushType:
            this.deepQuery(queryTarget, 'itemStyle.emphasis.areaStyle') || nIsAreaFill
              ? 'both'
              : 'stroke',
          color:
            this.deepQuery(queryTarget, 'itemStyle.emphasis.areaStyle.color') ||
            nAreaColor ||
            nColor ||
            (typeof defaultColor === 'string' ? zrColor.alpha(defaultColor, 0.5) : defaultColor),
          strokeColor:
            this.getItemStyleColor(
              this.deepQuery(queryTarget, 'itemStyle.emphasis.color'),
              seriesIndex,
              dataIndex,
              data
            ) ||
            nColor ||
            defaultColor,
          lineWidth:
            this.deepQuery(queryTarget, 'itemStyle.emphasis.lineStyle.width') || nLineWidth,
          lineType: this.deepQuery(queryTarget, 'itemStyle.emphasis.lineStyle.type') || nLineType
        }
      }
      ecData.pack(
        shape,
        series[seriesIndex],
        seriesIndex,
        data,
        dataIndex,
        data.name,
        this.component.polar.getIndicator(series[seriesIndex].polarIndex)
      )
      if (calculable) {
        shape.draggable = true
        this.setCalculable(shape)
      }
      shape = new PolygonShape(shape)
      this.shapeList.push(shape)
    },
    _addDropBox: function (index) {
      const series = this.series
      const polarIndex = this.deepQuery(this._queryTarget, 'polarIndex')
      if (!this._dropBoxList[polarIndex]) {
        const shape = this.component.polar.getDropBox(polarIndex)
        shape.zlevel = this.getZlevelBase()
        shape.z = this.getZBase()
        this.setCalculable(shape)
        ecData.pack(shape, series, index, undefined, -1)
        this.shapeList.push(shape)
        this._dropBoxList[polarIndex] = true
      }
    },
    ondragend: function (param, status) {
      const series = this.series
      if (!this.isDragend || !param.target) {
        return
      }
      const target = param.target
      const seriesIndex = ecData.get(target, 'seriesIndex')
      const dataIndex = ecData.get(target, 'dataIndex')
      this.component.legend && this.component.legend.del(series[seriesIndex].data[dataIndex].name)
      series[seriesIndex].data.splice(dataIndex, 1)
      status.dragOut = true
      status.needRefresh = true
      this.isDragend = false
    },
    ondrop: function (param, status) {
      const series = this.series
      if (!this.isDrop || !param.target) {
        return
      }
      const target = param.target
      const dragged = param.dragged
      const seriesIndex = ecData.get(target, 'seriesIndex')
      const dataIndex = ecData.get(target, 'dataIndex')
      let data
      const legend = this.component.legend
      let value
      if (dataIndex === -1) {
        data = {
          value: ecData.get(dragged, 'value'),
          name: ecData.get(dragged, 'name')
        }
        series[seriesIndex].data.push(data)
        legend && legend.add(data.name, dragged.style.color || dragged.style.strokeColor)
      } else {
        const accMath = require('../util/accMath')
        data = series[seriesIndex].data[dataIndex]
        legend && legend.del(data.name)
        data.name += this.option.nameConnector + ecData.get(dragged, 'name')
        value = ecData.get(dragged, 'value')
        for (let i = 0; i < value.length; i++) {
          data.value[i] = accMath.accAdd(data.value[i], value[i])
        }
        legend && legend.add(data.name, dragged.style.color || dragged.style.strokeColor)
      }
      status.dragIn = status.dragIn || true
      this.isDrop = false
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
  zrUtil.inherits(Radar, ChartBase)
  require('../chart').define('radar', Radar)
  return Radar
})
define('echarts/component/polar', [
  'require',
  './base',
  'zrender/shape/Text',
  'zrender/shape/Line',
  'zrender/shape/Polygon',
  'zrender/shape/Circle',
  'zrender/shape/Ring',
  '../config',
  'zrender/tool/util',
  '../util/coordinates',
  '../util/accMath',
  '../util/smartSteps',
  '../component'
], function (require) {
  const Base = require('./base')
  const TextShape = require('zrender/shape/Text')
  const LineShape = require('zrender/shape/Line')
  const PolygonShape = require('zrender/shape/Polygon')
  const Circle = require('zrender/shape/Circle')
  const Ring = require('zrender/shape/Ring')
  const ecConfig = require('../config')
  ecConfig.polar = {
    zlevel: 0,
    z: 0,
    center: ['50%', '50%'],
    radius: '75%',
    startAngle: 90,
    boundaryGap: [0, 0],
    splitNumber: 5,
    name: {
      show: true,
      textStyle: { color: '#333' }
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#ccc',
        width: 1,
        type: 'solid'
      }
    },
    axisLabel: {
      show: false,
      textStyle: { color: '#333' }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        color: '#ccc'
      }
    },
    type: 'polygon'
  }
  const zrUtil = require('zrender/tool/util')
  const ecCoordinates = require('../util/coordinates')
  function Polar(ecTheme, messageCenter, zr, option, myChart) {
    Base.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  Polar.prototype = {
    type: ecConfig.COMPONENT_TYPE_POLAR,
    _buildShape: function () {
      for (var i = 0; i < this.polar.length; i++) {
        this._index = i
        this.reformOption(this.polar[i])
        this._queryTarget = [this.polar[i], this.option]
        this._createVector(i)
        this._buildSpiderWeb(i)
        this._buildText(i)
        this._adjustIndicatorValue(i)
        this._addAxisLabel(i)
      }
      for (var i = 0; i < this.shapeList.length; i++) {
        this.zr.addShape(this.shapeList[i])
      }
    },
    _createVector: function (index) {
      const item = this.polar[index]
      const indicator = this.deepQuery(this._queryTarget, 'indicator')
      const length = indicator.length
      const startAngle = item.startAngle
      const dStep = (2 * Math.PI) / length
      const radius = this._getRadius()
      const __ecIndicator = (item.__ecIndicator = [])
      let vector
      for (let i = 0; i < length; i++) {
        vector = ecCoordinates.polar2cartesian(radius, (startAngle * Math.PI) / 180 + dStep * i)
        __ecIndicator.push({
          vector: [vector[1], -vector[0]]
        })
      }
    },
    _getRadius: function () {
      const item = this.polar[this._index]
      return this.parsePercent(item.radius, Math.min(this.zr.getWidth(), this.zr.getHeight()) / 2)
    },
    _buildSpiderWeb: function (index) {
      const item = this.polar[index]
      const __ecIndicator = item.__ecIndicator
      const splitArea = item.splitArea
      const splitLine = item.splitLine
      const center = this.getCenter(index)
      const splitNumber = item.splitNumber
      const strokeColor = splitLine.lineStyle.color
      const lineWidth = splitLine.lineStyle.width
      const show = splitLine.show
      const axisLine = this.deepQuery(this._queryTarget, 'axisLine')
      this._addArea(__ecIndicator, splitNumber, center, splitArea, strokeColor, lineWidth, show)
      axisLine.show && this._addLine(__ecIndicator, center, axisLine)
    },
    _addAxisLabel: function (index) {
      const accMath = require('../util/accMath')
      const item = this.polar[index]
      const indicator = this.deepQuery(this._queryTarget, 'indicator')
      const __ecIndicator = item.__ecIndicator
      let axisLabel
      var vector
      let style
      let newStyle
      const splitNumber = this.deepQuery(this._queryTarget, 'splitNumber')
      const center = this.getCenter(index)
      var vector
      let value
      let text
      let theta
      let offset
      let interval
      for (let i = 0; i < indicator.length; i++) {
        axisLabel = this.deepQuery([indicator[i], item, this.option], 'axisLabel')
        if (axisLabel.show) {
          const textStyle = this.deepQuery([axisLabel, item, this.option], 'textStyle')
          const formatter = this.deepQuery([axisLabel, item], 'formatter')
          style = {}
          style.textFont = this.getFont(textStyle)
          style.color = textStyle.color
          style = zrUtil.merge(style, axisLabel)
          style.lineWidth = style.width
          vector = __ecIndicator[i].vector
          value = __ecIndicator[i].value
          theta = (i / indicator.length) * 2 * Math.PI
          offset = axisLabel.offset || 10
          interval = axisLabel.interval || 0
          if (!value) {
            return
          }
          for (let j = 1; j <= splitNumber; j += interval + 1) {
            newStyle = zrUtil.merge({}, style)
            text = accMath.accAdd(value.min, accMath.accMul(value.step, j))
            if (typeof formatter === 'function') {
              text = formatter(text)
            } else if (typeof formatter === 'string') {
              text = formatter.replace('{a}', '{a0}').replace('{a0}', text)
            } else {
              text = this.numAddCommas(text)
            }
            newStyle.text = text
            newStyle.x = (j * vector[0]) / splitNumber + Math.cos(theta) * offset + center[0]
            newStyle.y = (j * vector[1]) / splitNumber + Math.sin(theta) * offset + center[1]
            this.shapeList.push(
              new TextShape({
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                style: newStyle,
                draggable: false,
                hoverable: false
              })
            )
          }
        }
      }
    },
    _buildText: function (index) {
      const item = this.polar[index]
      const __ecIndicator = item.__ecIndicator
      let vector
      const indicator = this.deepQuery(this._queryTarget, 'indicator')
      const center = this.getCenter(index)
      let style
      let textAlign
      let name
      let rotation
      let x = 0
      let y = 0
      let margin
      let textStyle
      for (let i = 0; i < indicator.length; i++) {
        name = this.deepQuery([indicator[i], item, this.option], 'name')
        if (!name.show) {
          continue
        }
        textStyle = this.deepQuery([name, item, this.option], 'textStyle')
        style = {}
        style.textFont = this.getFont(textStyle)
        style.color = textStyle.color
        if (typeof name.formatter === 'function') {
          style.text = name.formatter.call(this.myChart, indicator[i].text, i)
        } else if (typeof name.formatter === 'string') {
          style.text = name.formatter.replace('{value}', indicator[i].text)
        } else {
          style.text = indicator[i].text
        }
        __ecIndicator[i].text = style.text
        vector = __ecIndicator[i].vector
        if (Math.round(vector[0]) > 0) {
          textAlign = 'left'
        } else if (Math.round(vector[0]) < 0) {
          textAlign = 'right'
        } else {
          textAlign = 'center'
        }
        if (name.margin == null) {
          vector = this._mapVector(vector, center, 1.1)
        } else {
          margin = name.margin
          x = vector[0] > 0 ? margin : -margin
          y = vector[1] > 0 ? margin : -margin
          x = vector[0] === 0 ? 0 : x
          y = vector[1] === 0 ? 0 : y
          vector = this._mapVector(vector, center, 1)
        }
        style.textAlign = textAlign
        style.x = vector[0] + x
        style.y = vector[1] + y
        if (name.rotate) {
          rotation = [(name.rotate / 180) * Math.PI, vector[0], vector[1]]
        } else {
          rotation = [0, 0, 0]
        }
        this.shapeList.push(
          new TextShape({
            zlevel: this.getZlevelBase(),
            z: this.getZBase(),
            style: style,
            draggable: false,
            hoverable: false,
            rotation: rotation
          })
        )
      }
    },
    getIndicatorText: function (polarIndex, indicatorIndex) {
      return (
        this.polar[polarIndex] &&
        this.polar[polarIndex].__ecIndicator[indicatorIndex] &&
        this.polar[polarIndex].__ecIndicator[indicatorIndex].text
      )
    },
    getDropBox: function (index) {
      var index = index || 0
      const item = this.polar[index]
      const center = this.getCenter(index)
      const __ecIndicator = item.__ecIndicator
      const len = __ecIndicator.length
      const pointList = []
      let vector
      let shape
      const type = item.type
      if (type == 'polygon') {
        for (let i = 0; i < len; i++) {
          vector = __ecIndicator[i].vector
          pointList.push(this._mapVector(vector, center, 1.2))
        }
        shape = this._getShape(pointList, 'fill', 'rgba(0,0,0,0)', '', 1)
      } else if (type == 'circle') {
        shape = this._getCircle('', 1, 1.2, center, 'fill', 'rgba(0,0,0,0)')
      }
      return shape
    },
    _addArea: function (
      __ecIndicator,
      splitNumber,
      center,
      splitArea,
      strokeColor,
      lineWidth,
      show
    ) {
      let shape
      let scale
      let scale1
      let pointList
      const type = this.deepQuery(this._queryTarget, 'type')
      for (let i = 0; i < splitNumber; i++) {
        scale = (splitNumber - i) / splitNumber
        if (show) {
          if (type == 'polygon') {
            pointList = this._getPointList(__ecIndicator, scale, center)
            shape = this._getShape(pointList, 'stroke', '', strokeColor, lineWidth)
          } else if (type == 'circle') {
            shape = this._getCircle(strokeColor, lineWidth, scale, center, 'stroke')
          }
          this.shapeList.push(shape)
        }
        if (splitArea.show) {
          scale1 = (splitNumber - i - 1) / splitNumber
          this._addSplitArea(__ecIndicator, splitArea, scale, scale1, center, i)
        }
      }
    },
    _getCircle: function (strokeColor, lineWidth, scale, center, brushType, color) {
      const radius = this._getRadius()
      return new Circle({
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        style: {
          x: center[0],
          y: center[1],
          r: radius * scale,
          brushType: brushType,
          strokeColor: strokeColor,
          lineWidth: lineWidth,
          color: color
        },
        hoverable: false,
        draggable: false
      })
    },
    _getRing: function (color, scale0, scale1, center) {
      const radius = this._getRadius()
      return new Ring({
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        style: {
          x: center[0],
          y: center[1],
          r: scale0 * radius,
          r0: scale1 * radius,
          color: color,
          brushType: 'fill'
        },
        hoverable: false,
        draggable: false
      })
    },
    _getPointList: function (__ecIndicator, scale, center) {
      const pointList = []
      const len = __ecIndicator.length
      let vector
      for (let i = 0; i < len; i++) {
        vector = __ecIndicator[i].vector
        pointList.push(this._mapVector(vector, center, scale))
      }
      return pointList
    },
    _getShape: function (pointList, brushType, color, strokeColor, lineWidth) {
      return new PolygonShape({
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        style: {
          pointList: pointList,
          brushType: brushType,
          color: color,
          strokeColor: strokeColor,
          lineWidth: lineWidth
        },
        hoverable: false,
        draggable: false
      })
    },
    _addSplitArea: function (__ecIndicator, splitArea, scale, scale1, center, colorInd) {
      var indLen = __ecIndicator.length
      let color
      let colorArr = splitArea.areaStyle.color
      let colorLen
      let vector
      let vector1
      let pointList = []
      var indLen = __ecIndicator.length
      let shape
      const type = this.deepQuery(this._queryTarget, 'type')
      if (typeof colorArr === 'string') {
        colorArr = [colorArr]
      }
      colorLen = colorArr.length
      color = colorArr[colorInd % colorLen]
      if (type == 'polygon') {
        for (let i = 0; i < indLen; i++) {
          pointList = []
          vector = __ecIndicator[i].vector
          vector1 = __ecIndicator[(i + 1) % indLen].vector
          pointList.push(this._mapVector(vector, center, scale))
          pointList.push(this._mapVector(vector, center, scale1))
          pointList.push(this._mapVector(vector1, center, scale1))
          pointList.push(this._mapVector(vector1, center, scale))
          shape = this._getShape(pointList, 'fill', color, '', 1)
          this.shapeList.push(shape)
        }
      } else if (type == 'circle') {
        shape = this._getRing(color, scale, scale1, center)
        this.shapeList.push(shape)
      }
    },
    _mapVector: function (vector, center, scale) {
      return [vector[0] * scale + center[0], vector[1] * scale + center[1]]
    },
    getCenter: function (index) {
      var index = index || 0
      return this.parseCenter(this.zr, this.polar[index].center)
    },
    _addLine: function (__ecIndicator, center, axisLine) {
      const indLen = __ecIndicator.length
      let line
      let vector
      const lineStyle = axisLine.lineStyle
      const strokeColor = lineStyle.color
      const lineWidth = lineStyle.width
      const lineType = lineStyle.type
      for (let i = 0; i < indLen; i++) {
        vector = __ecIndicator[i].vector
        line = this._getLine(
          center[0],
          center[1],
          vector[0] + center[0],
          vector[1] + center[1],
          strokeColor,
          lineWidth,
          lineType
        )
        this.shapeList.push(line)
      }
    },
    _getLine: function (xStart, yStart, xEnd, yEnd, strokeColor, lineWidth, lineType) {
      return new LineShape({
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        style: {
          xStart: xStart,
          yStart: yStart,
          xEnd: xEnd,
          yEnd: yEnd,
          strokeColor: strokeColor,
          lineWidth: lineWidth,
          lineType: lineType
        },
        hoverable: false
      })
    },
    _adjustIndicatorValue: function (index) {
      const item = this.polar[index]
      const indicator = this.deepQuery(this._queryTarget, 'indicator')
      const len = indicator.length
      const __ecIndicator = item.__ecIndicator
      let max
      let min
      const data = this._getSeriesData(index)
      const boundaryGap = item.boundaryGap
      const splitNumber = item.splitNumber
      const scale = item.scale
      let opts
      const smartSteps = require('../util/smartSteps')
      for (let i = 0; i < len; i++) {
        if (typeof indicator[i].max === 'number') {
          max = indicator[i].max
          min = indicator[i].min || 0
          opts = {
            max: max,
            min: min
          }
        } else {
          const value = this._findValue(data, i, splitNumber, boundaryGap)
          min = value.min
          max = value.max
        }
        if (!scale && min >= 0 && max >= 0) {
          min = 0
        }
        if (!scale && min <= 0 && max <= 0) {
          max = 0
        }
        const stepOpt = smartSteps(min, max, splitNumber, opts)
        __ecIndicator[i].value = {
          min: stepOpt.min,
          max: stepOpt.max,
          step: stepOpt.step
        }
      }
    },
    _getSeriesData: function (index) {
      const data = []
      let serie
      let serieData
      const legend = this.component.legend
      let polarIndex
      for (let i = 0; i < this.series.length; i++) {
        serie = this.series[i]
        if (serie.type != ecConfig.CHART_TYPE_RADAR) {
          continue
        }
        serieData = serie.data || []
        for (let j = 0; j < serieData.length; j++) {
          polarIndex = this.deepQuery([serieData[j], serie, this.option], 'polarIndex') || 0
          if (polarIndex == index && (!legend || legend.isSelected(serieData[j].name))) {
            data.push(serieData[j])
          }
        }
      }
      return data
    },
    _findValue: function (data, index, splitNumber, boundaryGap) {
      let max
      let min
      let one
      if (!data || data.length === 0) {
        return
      }
      function _compare(item) {
        ;(item > max || max === undefined) && (max = item)
        ;(item < min || min === undefined) && (min = item)
      }
      if (data.length == 1) {
        min = 0
      }
      if (data.length != 1) {
        for (var i = 0; i < data.length; i++) {
          _compare(this.getDataFromOption(data[i].value[index]))
        }
      } else {
        one = data[0]
        for (var i = 0; i < one.value.length; i++) {
          _compare(this.getDataFromOption(one.value[i]))
        }
      }
      const gap = Math.abs(max - min)
      min = min - Math.abs(gap * boundaryGap[0])
      max = max + Math.abs(gap * boundaryGap[1])
      if (min === max) {
        if (max === 0) {
          max = 1
        } else if (max > 0) {
          min = max / splitNumber
        } else {
          max = max / splitNumber
        }
      }
      return {
        max: max,
        min: min
      }
    },
    getVector: function (polarIndex, indicatorIndex, value) {
      polarIndex = polarIndex || 0
      indicatorIndex = indicatorIndex || 0
      const __ecIndicator = this.polar[polarIndex].__ecIndicator
      if (indicatorIndex >= __ecIndicator.length) {
        return
      }
      const indicator = this.polar[polarIndex].__ecIndicator[indicatorIndex]
      const center = this.getCenter(polarIndex)
      const vector = indicator.vector
      const max = indicator.value.max
      const min = indicator.value.min
      let alpha
      if (typeof value === 'undefined') {
        return center
      }
      switch (value) {
        case 'min':
          value = min
          break
        case 'max':
          value = max
          break
        case 'center':
          value = (max + min) / 2
          break
      }
      if (max != min) {
        alpha = (value - min) / (max - min)
      } else {
        alpha = 0.5
      }
      return this._mapVector(vector, center, alpha)
    },
    isInside: function (vector) {
      const polar = this.getNearestIndex(vector)
      if (polar) {
        return polar.polarIndex
      }
      return -1
    },
    getNearestIndex: function (vector) {
      let item
      let center
      let radius
      let polarVector
      let startAngle
      let indicator
      let len
      let angle
      let finalAngle
      for (let i = 0; i < this.polar.length; i++) {
        item = this.polar[i]
        center = this.getCenter(i)
        if (vector[0] == center[0] && vector[1] == center[1]) {
          return {
            polarIndex: i,
            valueIndex: 0
          }
        }
        radius = this._getRadius()
        startAngle = item.startAngle
        indicator = item.indicator
        len = indicator.length
        angle = (2 * Math.PI) / len
        polarVector = ecCoordinates.cartesian2polar(vector[0] - center[0], center[1] - vector[1])
        if (vector[0] - center[0] < 0) {
          polarVector[1] += Math.PI
        }
        if (polarVector[1] < 0) {
          polarVector[1] += 2 * Math.PI
        }
        finalAngle = polarVector[1] - (startAngle / 180) * Math.PI + Math.PI * 2
        if (Math.abs(Math.cos(finalAngle % (angle / 2))) * radius > polarVector[0]) {
          return {
            polarIndex: i,
            valueIndex: Math.floor((finalAngle + angle / 2) / angle) % len
          }
        }
      }
    },
    getIndicator: function (index) {
      var index = index || 0
      return this.polar[index].indicator
    },
    refresh: function (newOption) {
      if (newOption) {
        this.option = newOption
        this.polar = this.option.polar
        this.series = this.option.series
      }
      this.clear()
      this._buildShape()
    }
  }
  zrUtil.inherits(Polar, Base)
  require('../component').define('polar', Polar)
  return Polar
})
define('echarts/util/coordinates', ['require', 'zrender/tool/math'], function (require) {
  const zrMath = require('zrender/tool/math')
  function polar2cartesian(r, theta) {
    return [r * zrMath.sin(theta), r * zrMath.cos(theta)]
  }
  function cartesian2polar(x, y) {
    return [Math.sqrt(x * x + y * y), Math.atan(y / x)]
  }
  return {
    polar2cartesian: polar2cartesian,
    cartesian2polar: cartesian2polar
  }
})
