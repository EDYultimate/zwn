define('echarts/chart/funnel', [
  'require',
  './base',
  'zrender/shape/Text',
  'zrender/shape/Line',
  'zrender/shape/Polygon',
  '../config',
  '../util/ecData',
  '../util/number',
  'zrender/tool/util',
  'zrender/tool/color',
  'zrender/tool/area',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const TextShape = require('zrender/shape/Text')
  const LineShape = require('zrender/shape/Line')
  const PolygonShape = require('zrender/shape/Polygon')
  const ecConfig = require('../config')
  ecConfig.funnel = {
    zlevel: 0,
    z: 2,
    clickable: true,
    legendHoverLink: true,
    x: 80,
    y: 60,
    x2: 80,
    y2: 60,
    min: 0,
    max: 100,
    minSize: '0%',
    maxSize: '100%',
    sort: 'descending',
    gap: 0,
    funnelAlign: 'center',
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 1,
        label: {
          show: true,
          position: 'outer'
        },
        labelLine: {
          show: true,
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        }
      },
      emphasis: {
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        label: { show: true },
        labelLine: { show: true }
      }
    }
  }
  const ecData = require('../util/ecData')
  const number = require('../util/number')
  const zrUtil = require('zrender/tool/util')
  const zrColor = require('zrender/tool/color')
  const zrArea = require('zrender/tool/area')
  function Funnel(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  Funnel.prototype = {
    type: ecConfig.CHART_TYPE_FUNNEL,
    _buildShape: function () {
      const series = this.series
      const legend = this.component.legend
      this._paramsMap = {}
      this._selected = {}
      this.selectedMap = {}
      let serieName
      for (let i = 0, l = series.length; i < l; i++) {
        if (series[i].type === ecConfig.CHART_TYPE_FUNNEL) {
          series[i] = this.reformOption(series[i])
          this.legendHoverLink = series[i].legendHoverLink || this.legendHoverLink
          serieName = series[i].name || ''
          this.selectedMap[serieName] = legend ? legend.isSelected(serieName) : true
          if (!this.selectedMap[serieName]) {
            continue
          }
          this._buildSingleFunnel(i)
          this.buildMark(i)
        }
      }
      this.addShapeList()
    },
    _buildSingleFunnel: function (seriesIndex) {
      const legend = this.component.legend
      const serie = this.series[seriesIndex]
      const data = this._mapData(seriesIndex)
      const location = this._getLocation(seriesIndex)
      this._paramsMap[seriesIndex] = {
        location: location,
        data: data
      }
      let itemName
      let total = 0
      const selectedData = []
      for (var i = 0, l = data.length; i < l; i++) {
        itemName = data[i].name
        this.selectedMap[itemName] = legend ? legend.isSelected(itemName) : true
        if (this.selectedMap[itemName] && !isNaN(data[i].value)) {
          selectedData.push(data[i])
          total++
        }
      }
      if (total === 0) {
        return
      }
      const funnelCase = this._buildFunnelCase(seriesIndex)
      const align = serie.funnelAlign
      const gap = serie.gap
      const height = total > 1 ? (location.height - (total - 1) * gap) / total : location.height
      let width
      let lastY = location.y
      let lastWidth =
        serie.sort === 'descending'
          ? this._getItemWidth(seriesIndex, selectedData[0].value)
          : number.parsePercent(serie.minSize, location.width)
      const next = serie.sort === 'descending' ? 1 : 0
      const centerX = location.centerX
      const pointList = []
      let x
      let polygon
      let lastPolygon
      for (var i = 0, l = selectedData.length; i < l; i++) {
        itemName = selectedData[i].name
        if (this.selectedMap[itemName] && !isNaN(selectedData[i].value)) {
          width =
            i <= l - 2
              ? this._getItemWidth(seriesIndex, selectedData[i + next].value)
              : serie.sort === 'descending'
                ? number.parsePercent(serie.minSize, location.width)
                : number.parsePercent(serie.maxSize, location.width)
          switch (align) {
            case 'left':
              x = location.x
              break
            case 'right':
              x = location.x + location.width - lastWidth
              break
            default:
              x = centerX - lastWidth / 2
          }
          polygon = this._buildItem(
            seriesIndex,
            selectedData[i]._index,
            legend ? legend.getColor(itemName) : this.zr.getColor(selectedData[i]._index),
            x,
            lastY,
            lastWidth,
            width,
            height,
            align
          )
          lastY += height + gap
          lastPolygon = polygon.style.pointList
          pointList.unshift([lastPolygon[0][0] - 10, lastPolygon[0][1]])
          pointList.push([lastPolygon[1][0] + 10, lastPolygon[1][1]])
          if (i === 0) {
            if (lastWidth === 0) {
              lastPolygon = pointList.pop()
              align == 'center' && (pointList[0][0] += 10)
              align == 'right' && (pointList[0][0] = lastPolygon[0])
              pointList[0][1] -= align == 'center' ? 10 : 15
              if (l == 1) {
                lastPolygon = polygon.style.pointList
              }
            } else {
              pointList[pointList.length - 1][1] -= 5
              pointList[0][1] -= 5
            }
          }
          lastWidth = width
        }
      }
      if (funnelCase) {
        pointList.unshift([lastPolygon[3][0] - 10, lastPolygon[3][1]])
        pointList.push([lastPolygon[2][0] + 10, lastPolygon[2][1]])
        if (lastWidth === 0) {
          lastPolygon = pointList.pop()
          align == 'center' && (pointList[0][0] += 10)
          align == 'right' && (pointList[0][0] = lastPolygon[0])
          pointList[0][1] += align == 'center' ? 10 : 15
        } else {
          pointList[pointList.length - 1][1] += 5
          pointList[0][1] += 5
        }
        funnelCase.style.pointList = pointList
      }
    },
    _buildFunnelCase: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      if (this.deepQuery([serie, this.option], 'calculable')) {
        const location = this._paramsMap[seriesIndex].location
        const gap = 10
        let funnelCase = {
          hoverable: false,
          style: {
            pointListd: [
              [location.x - gap, location.y - gap],
              [location.x + location.width + gap, location.y - gap],
              [location.x + location.width + gap, location.y + location.height + gap],
              [location.x - gap, location.y + location.height + gap]
            ],
            brushType: 'stroke',
            lineWidth: 1,
            strokeColor:
              serie.calculableHolderColor ||
              this.ecTheme.calculableHolderColor ||
              ecConfig.calculableHolderColor
          }
        }
        ecData.pack(funnelCase, serie, seriesIndex, undefined, -1)
        this.setCalculable(funnelCase)
        funnelCase = new PolygonShape(funnelCase)
        this.shapeList.push(funnelCase)
        return funnelCase
      }
    },
    _getLocation: function (seriesIndex) {
      const gridOption = this.series[seriesIndex]
      const zrWidth = this.zr.getWidth()
      const zrHeight = this.zr.getHeight()
      const x = this.parsePercent(gridOption.x, zrWidth)
      const y = this.parsePercent(gridOption.y, zrHeight)
      const width =
        gridOption.width == null
          ? zrWidth - x - this.parsePercent(gridOption.x2, zrWidth)
          : this.parsePercent(gridOption.width, zrWidth)
      return {
        x: x,
        y: y,
        width: width,
        height:
          gridOption.height == null
            ? zrHeight - y - this.parsePercent(gridOption.y2, zrHeight)
            : this.parsePercent(gridOption.height, zrHeight),
        centerX: x + width / 2
      }
    },
    _mapData: function (seriesIndex) {
      const serie = this.series[seriesIndex]
      const funnelData = zrUtil.clone(serie.data)
      for (let i = 0, l = funnelData.length; i < l; i++) {
        funnelData[i]._index = i
      }
      function numDescending(a, b) {
        if (a.value === '-') {
          return 1
        } else if (b.value === '-') {
          return -1
        }
        return b.value - a.value
      }
      function numAscending(a, b) {
        return -numDescending(a, b)
      }
      if (serie.sort != 'none') {
        funnelData.sort(serie.sort === 'descending' ? numDescending : numAscending)
      }
      return funnelData
    },
    _buildItem: function (
      seriesIndex,
      dataIndex,
      defaultColor,
      x,
      y,
      topWidth,
      bottomWidth,
      height,
      align
    ) {
      const series = this.series
      const serie = series[seriesIndex]
      const data = serie.data[dataIndex]
      const polygon = this.getPolygon(
        seriesIndex,
        dataIndex,
        defaultColor,
        x,
        y,
        topWidth,
        bottomWidth,
        height,
        align
      )
      ecData.pack(
        polygon,
        series[seriesIndex],
        seriesIndex,
        series[seriesIndex].data[dataIndex],
        dataIndex,
        series[seriesIndex].data[dataIndex].name
      )
      this.shapeList.push(polygon)
      const label = this.getLabel(
        seriesIndex,
        dataIndex,
        defaultColor,
        x,
        y,
        topWidth,
        bottomWidth,
        height,
        align
      )
      ecData.pack(
        label,
        series[seriesIndex],
        seriesIndex,
        series[seriesIndex].data[dataIndex],
        dataIndex,
        series[seriesIndex].data[dataIndex].name
      )
      this.shapeList.push(label)
      if (!this._needLabel(serie, data, false)) {
        label.invisible = true
      }
      const labelLine = this.getLabelLine(
        seriesIndex,
        dataIndex,
        defaultColor,
        x,
        y,
        topWidth,
        bottomWidth,
        height,
        align
      )
      this.shapeList.push(labelLine)
      if (!this._needLabelLine(serie, data, false)) {
        labelLine.invisible = true
      }
      const polygonHoverConnect = []
      const labelHoverConnect = []
      if (this._needLabelLine(serie, data, true)) {
        polygonHoverConnect.push(labelLine.id)
        labelHoverConnect.push(labelLine.id)
      }
      if (this._needLabel(serie, data, true)) {
        polygonHoverConnect.push(label.id)
        labelHoverConnect.push(polygon.id)
      }
      polygon.hoverConnect = polygonHoverConnect
      label.hoverConnect = labelHoverConnect
      return polygon
    },
    _getItemWidth: function (seriesIndex, value) {
      const serie = this.series[seriesIndex]
      const location = this._paramsMap[seriesIndex].location
      const min = serie.min
      const max = serie.max
      const minSize = number.parsePercent(serie.minSize, location.width)
      const maxSize = number.parsePercent(serie.maxSize, location.width)
      return ((value - min) * (maxSize - minSize)) / (max - min) + minSize
    },
    getPolygon: function (
      seriesIndex,
      dataIndex,
      defaultColor,
      xLT,
      y,
      topWidth,
      bottomWidth,
      height,
      align
    ) {
      const serie = this.series[seriesIndex]
      const data = serie.data[dataIndex]
      const queryTarget = [data, serie]
      const normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {}
      const emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {}
      const normalColor =
        this.getItemStyleColor(normal.color, seriesIndex, dataIndex, data) || defaultColor
      const emphasisColor =
        this.getItemStyleColor(emphasis.color, seriesIndex, dataIndex, data) ||
        (typeof normalColor === 'string' ? zrColor.lift(normalColor, -0.2) : normalColor)
      let xLB
      switch (align) {
        case 'left':
          xLB = xLT
          break
        case 'right':
          xLB = xLT + (topWidth - bottomWidth)
          break
        default:
          xLB = xLT + (topWidth - bottomWidth) / 2
          break
      }
      const polygon = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        clickable: this.deepQuery(queryTarget, 'clickable'),
        style: {
          pointList: [
            [xLT, y],
            [xLT + topWidth, y],
            [xLB + bottomWidth, y + height],
            [xLB, y + height]
          ],
          brushType: 'both',
          color: normalColor,
          lineWidth: normal.borderWidth,
          strokeColor: normal.borderColor
        },
        highlightStyle: {
          color: emphasisColor,
          lineWidth: emphasis.borderWidth,
          strokeColor: emphasis.borderColor
        }
      }
      if (this.deepQuery([data, serie, this.option], 'calculable')) {
        this.setCalculable(polygon)
        polygon.draggable = true
      }
      return new PolygonShape(polygon)
    },
    getLabel: function (
      seriesIndex,
      dataIndex,
      defaultColor,
      x,
      y,
      topWidth,
      bottomWidth,
      height,
      align
    ) {
      const serie = this.series[seriesIndex]
      const data = serie.data[dataIndex]
      const location = this._paramsMap[seriesIndex].location
      const itemStyle = zrUtil.merge(zrUtil.clone(data.itemStyle) || {}, serie.itemStyle)
      let status = 'normal'
      let labelControl = itemStyle[status].label
      let textStyle = labelControl.textStyle || {}
      let lineLength = itemStyle[status].labelLine.length
      let text = this.getLabelText(seriesIndex, dataIndex, status)
      let textFont = this.getFont(textStyle)
      let textAlign
      let textColor = defaultColor
      labelControl.position = labelControl.position || itemStyle.normal.label.position
      if (
        labelControl.position === 'inner' ||
        labelControl.position === 'inside' ||
        labelControl.position === 'center'
      ) {
        textAlign = align
        textColor =
          Math.max(topWidth, bottomWidth) / 2 > zrArea.getTextWidth(text, textFont)
            ? '#fff'
            : zrColor.reverse(defaultColor)
      } else if (labelControl.position === 'left') {
        textAlign = 'right'
      } else {
        textAlign = 'left'
      }
      const textShape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase() + 1,
        style: {
          x: this._getLabelPoint(
            labelControl.position,
            x,
            location,
            topWidth,
            bottomWidth,
            lineLength,
            align
          ),
          y: y + height / 2,
          color: textStyle.color || textColor,
          text: text,
          textAlign: textStyle.align || textAlign,
          textBaseline: textStyle.baseline || 'middle',
          textFont: textFont
        }
      }
      status = 'emphasis'
      labelControl = itemStyle[status].label || labelControl
      textStyle = labelControl.textStyle || textStyle
      lineLength = itemStyle[status].labelLine.length || lineLength
      labelControl.position = labelControl.position || itemStyle.normal.label.position
      text = this.getLabelText(seriesIndex, dataIndex, status)
      textFont = this.getFont(textStyle)
      textColor = defaultColor
      if (
        labelControl.position === 'inner' ||
        labelControl.position === 'inside' ||
        labelControl.position === 'center'
      ) {
        textAlign = align
        textColor =
          Math.max(topWidth, bottomWidth) / 2 > zrArea.getTextWidth(text, textFont)
            ? '#fff'
            : zrColor.reverse(defaultColor)
      } else if (labelControl.position === 'left') {
        textAlign = 'right'
      } else {
        textAlign = 'left'
      }
      textShape.highlightStyle = {
        x: this._getLabelPoint(
          labelControl.position,
          x,
          location,
          topWidth,
          bottomWidth,
          lineLength,
          align
        ),
        color: textStyle.color || textColor,
        text: text,
        textAlign: textStyle.align || textAlign,
        textFont: textFont,
        brushType: 'fill'
      }
      return new TextShape(textShape)
    },
    getLabelText: function (seriesIndex, dataIndex, status) {
      const series = this.series
      const serie = series[seriesIndex]
      const data = serie.data[dataIndex]
      let formatter = this.deepQuery([data, serie], 'itemStyle.' + status + '.label.formatter')
      if (formatter) {
        if (typeof formatter === 'function') {
          return formatter.call(this.myChart, {
            seriesIndex: seriesIndex,
            seriesName: serie.name || '',
            series: serie,
            dataIndex: dataIndex,
            data: data,
            name: data.name,
            value: data.value
          })
        } else if (typeof formatter === 'string') {
          formatter = formatter
            .replace('{a}', '{a0}')
            .replace('{b}', '{b0}')
            .replace('{c}', '{c0}')
            .replace('{a0}', serie.name)
            .replace('{b0}', data.name)
            .replace('{c0}', data.value)
          return formatter
        }
      } else {
        return data.name
      }
    },
    getLabelLine: function (
      seriesIndex,
      dataIndex,
      defaultColor,
      x,
      y,
      topWidth,
      bottomWidth,
      height,
      align
    ) {
      const serie = this.series[seriesIndex]
      const data = serie.data[dataIndex]
      const location = this._paramsMap[seriesIndex].location
      const itemStyle = zrUtil.merge(zrUtil.clone(data.itemStyle) || {}, serie.itemStyle)
      let status = 'normal'
      let labelLineControl = itemStyle[status].labelLine
      let lineLength = itemStyle[status].labelLine.length
      let lineStyle = labelLineControl.lineStyle || {}
      let labelControl = itemStyle[status].label
      labelControl.position = labelControl.position || itemStyle.normal.label.position
      const lineShape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase() + 1,
        hoverable: false,
        style: {
          xStart: this._getLabelLineStartPoint(x, location, topWidth, bottomWidth, align),
          yStart: y + height / 2,
          xEnd: this._getLabelPoint(
            labelControl.position,
            x,
            location,
            topWidth,
            bottomWidth,
            lineLength,
            align
          ),
          yEnd: y + height / 2,
          strokeColor: lineStyle.color || defaultColor,
          lineType: lineStyle.type,
          lineWidth: lineStyle.width
        }
      }
      status = 'emphasis'
      labelLineControl = itemStyle[status].labelLine || labelLineControl
      lineLength = itemStyle[status].labelLine.length || lineLength
      lineStyle = labelLineControl.lineStyle || lineStyle
      labelControl = itemStyle[status].label || labelControl
      labelControl.position = labelControl.position
      lineShape.highlightStyle = {
        xEnd: this._getLabelPoint(
          labelControl.position,
          x,
          location,
          topWidth,
          bottomWidth,
          lineLength,
          align
        ),
        strokeColor: lineStyle.color || defaultColor,
        lineType: lineStyle.type,
        lineWidth: lineStyle.width
      }
      return new LineShape(lineShape)
    },
    _getLabelPoint: function (position, x, location, topWidth, bottomWidth, lineLength, align) {
      position = position === 'inner' || position === 'inside' ? 'center' : position
      switch (position) {
        case 'center':
          return align == 'center' ? x + topWidth / 2 : align == 'left' ? x + 10 : x + topWidth - 10
        case 'left':
          if (lineLength === 'auto') {
            return location.x - 10
          }
          return align == 'center'
            ? location.centerX - Math.max(topWidth, bottomWidth) / 2 - lineLength
            : align == 'right'
              ? x - (topWidth < bottomWidth ? bottomWidth - topWidth : 0) - lineLength
              : location.x - lineLength

          break
        default:
          if (lineLength === 'auto') {
            return location.x + location.width + 10
          }
          return align == 'center'
            ? location.centerX + Math.max(topWidth, bottomWidth) / 2 + lineLength
            : align == 'right'
              ? location.x + location.width + lineLength
              : x + Math.max(topWidth, bottomWidth) + lineLength
      }
    },
    _getLabelLineStartPoint: function (x, location, topWidth, bottomWidth, align) {
      return align == 'center'
        ? location.centerX
        : topWidth < bottomWidth
          ? x + Math.min(topWidth, bottomWidth) / 2
          : x + Math.max(topWidth, bottomWidth) / 2
    },
    _needLabel: function (serie, data, isEmphasis) {
      return this.deepQuery(
        [data, serie],
        'itemStyle.' + (isEmphasis ? 'emphasis' : 'normal') + '.label.show'
      )
    },
    _needLabelLine: function (serie, data, isEmphasis) {
      return this.deepQuery(
        [data, serie],
        'itemStyle.' + (isEmphasis ? 'emphasis' : 'normal') + '.labelLine.show'
      )
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
  zrUtil.inherits(Funnel, ChartBase)
  require('../chart').define('funnel', Funnel)
  return Funnel
})
