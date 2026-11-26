define('echarts/chart/treemap', [
  'require',
  './base',
  'zrender/tool/area',
  'zrender/shape/Rectangle',
  'zrender/shape/Text',
  '../layout/TreeMap',
  '../config',
  '../util/ecData',
  'zrender/tool/util',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const toolArea = require('zrender/tool/area')
  const RectangleShape = require('zrender/shape/Rectangle')
  const TextShape = require('zrender/shape/Text')
  const TreeMapLayout = require('../layout/TreeMap')
  const ecConfig = require('../config')
  ecConfig.treemap = {
    zlevel: 0,
    z: 1,
    calculable: false,
    clickable: true
  }
  const ecData = require('../util/ecData')
  const zrUtil = require('zrender/tool/util')
  function Treemap(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  Treemap.prototype = {
    type: ecConfig.CHART_TYPE_TREEMAP,
    _buildShape: function () {
      const series = this.series
      this.data = series[0].data
      this.x0 = 100
      this.y0 = 50
      this.width0 = 500
      this.height0 = 300
      this._buildTreemap(this.data)
      this.addShapeList()
    },
    _buildTreemap: function (data) {
      const area0 = this.width0 * this.height0
      let sum = 0
      const areaArr = []
      for (let i = 0; i < data.length; i++) {
        sum += data[i].value
      }
      for (let j = 0; j < data.length; j++) {
        areaArr.push((data[j].value * area0) / sum)
      }
      const treeMapLayout = new TreeMapLayout({
        areas: areaArr,
        x0: this.x0,
        y0: this.y0,
        width0: this.width0,
        height0: this.height0
      })
      const locationArr = treeMapLayout.rectangleList
      for (let k = 0; k < locationArr.length; k++) {
        const item = locationArr[k]
        this._buildItem(item.x, item.y, item.width, item.height, k)
      }
    },
    _buildItem: function (x, y, width, height, index) {
      const series = this.series
      const rectangle = this.getRectangle(x, y, width, height, this.data[index].name, index)
      ecData.pack(rectangle, series[0], 0, series[0].data[index], 0, series[0].data[index].name)
      this.shapeList.push(rectangle)
    },
    getRectangle: function (x, y, width, height, text, index) {
      const serie = this.series[0]
      const data = this.data[index]
      const queryTarget = [data, serie]
      const normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {}
      const emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {}
      const color = normal.color || this.zr.getColor(index)
      const emphasisColor = emphasis.color || this.zr.getColor(index)
      const borderWidth = normal.borderWidth || 0
      const borderColor = normal.borderColor || '#ccc'
      const textShape = this.getLabel(x, y, width, height, this.data[index].name, index)
      const rectangleShape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        hoverable: true,
        clickable: true,
        style: $.extend(
          {
            x: x,
            y: y,
            width: width,
            height: height,
            brushType: 'both',
            color: color,
            lineWidth: borderWidth,
            strokeColor: borderColor
          },
          textShape.style
        ),
        highlightStyle: $.extend(
          {
            color: emphasisColor,
            lineWidth: emphasis.borderWidth,
            strokeColor: emphasis.borderColor
          },
          textShape.highlightStyle
        )
      }
      return new RectangleShape(rectangleShape)
    },
    getLabel: function (rectangleX, rectangleY, rectangleWidth, rectangleHeight, text, index) {
      if (!this.series[0].itemStyle.normal.label.show) {
        return {}
      }
      const marginY = 12
      const marginX = 5
      const fontSize = 13
      const textFont = fontSize + 'px Arial'
      const textWidth = toolArea.getTextWidth(text, textFont)
      const textHeight = toolArea.getTextHeight(text, textFont)
      if (marginX + textWidth > rectangleWidth || marginY + textHeight > rectangleHeight) {
        return {}
      }
      const data = this.data[index]
      let textShape = {
        zlevel: this.getZlevelBase() + 1,
        z: this.getZBase() + 1,
        hoverable: false,
        style: {
          x: rectangleX + marginX,
          y: rectangleY + marginY,
          text: text,
          textColor: '#777',
          textFont: textFont
        },
        highlightStyle: { text: text }
      }
      textShape = {
        style: { text: text },
        highlightStyle: { text: text }
      }
      textShape = this.addLabel(textShape, this.series[0], data, text)
      textShape.style.textPosition = 'specific'
      textShape.style.textX = rectangleX + marginX
      textShape.style.textY = rectangleY + marginY
      textShape.style.textColor = textShape.style.textColor || '#000'
      textShape.highlightStyle.textPosition = 'specific'
      textShape.highlightStyle.textX = rectangleX + marginX
      textShape.highlightStyle.textY = rectangleY + marginY
      textShape.highlightStyle.textColor = textShape.highlightStyle.textColor || '#000'
      return textShape
    },
    refresh: function (newOption) {
      if (newOption) {
        this.option = newOption
        this.series = newOption.series
      }
      this._buildShape()
    }
  }
  zrUtil.inherits(Treemap, ChartBase)
  require('../chart').define('treemap', Treemap)
  return Treemap
})
define('echarts/layout/TreeMap', ['require'], function (require) {
  function TreeMapLayout(opts) {
    this.rectangleList = []
    const row = {
      x: opts.x0,
      y: opts.y0,
      width: opts.width0,
      height: opts.height0
    }
    this.squarify(opts.areas, row)
  }
  TreeMapLayout.prototype.squarify = function (areas, row) {
    let layoutDirection = 'VERTICAL'
    let width = row.width
    let height = row.height
    if (row.width < row.height) {
      layoutDirection = 'HORIZONTAL'
      width = row.height
      height = row.width
    }
    const shapeArr = this.getShapeListInAbstractRow(areas, width, height)
    for (let i = 0; i < shapeArr.length; i++) {
      shapeArr[i].x = 0
      shapeArr[i].y = 0
      for (let j = 0; j < i; j++) {
        shapeArr[i].y += shapeArr[j].height
      }
    }
    let nextRow = {}
    if (layoutDirection == 'VERTICAL') {
      for (let k = 0; k < shapeArr.length; k++) {
        this.rectangleList.push({
          x: shapeArr[k].x + row.x,
          y: shapeArr[k].y + row.y,
          width: shapeArr[k].width,
          height: shapeArr[k].height
        })
      }
      nextRow = {
        x: shapeArr[0].width + row.x,
        y: row.y,
        width: row.width - shapeArr[0].width,
        height: row.height
      }
    } else {
      for (let l = 0; l < shapeArr.length; l++) {
        this.rectangleList.push({
          x: shapeArr[l].y + row.x,
          y: shapeArr[l].x + row.y,
          width: shapeArr[l].height,
          height: shapeArr[l].width
        })
      }
      nextRow = {
        x: row.x,
        y: row.y + shapeArr[0].width,
        width: row.width,
        height: row.height - shapeArr[0].width
      }
    }
    const nextAreaArr = areas.slice(shapeArr.length)
    if (nextAreaArr.length === 0) {
    } else {
      this.squarify(nextAreaArr, nextRow)
    }
  }
  TreeMapLayout.prototype.getShapeListInAbstractRow = function (areas, width, height) {
    if (areas.length === 1) {
      return [
        {
          width: width,
          height: height
        }
      ]
    }
    for (let count = 1; count < areas.length; count++) {
      const shapeArr0 = this.placeFixedNumberRectangles(areas.slice(0, count), width, height)
      const shapeArr1 = this.placeFixedNumberRectangles(areas.slice(0, count + 1), width, height)
      if (this.isFirstBetter(shapeArr0, shapeArr1)) {
        return shapeArr0
      }
    }
  }
  TreeMapLayout.prototype.placeFixedNumberRectangles = function (areaSubArr, width, height) {
    const count = areaSubArr.length
    const shapeArr = []
    let sum = 0
    for (let i = 0; i < areaSubArr.length; i++) {
      sum += areaSubArr[i]
    }
    const cellWidth = sum / height
    for (let j = 0; j < count; j++) {
      const cellHeight = (height * areaSubArr[j]) / sum
      shapeArr.push({
        width: cellWidth,
        height: cellHeight
      })
    }
    return shapeArr
  }
  TreeMapLayout.prototype.isFirstBetter = function (shapeArr0, shapeArr1) {
    let ratio0 = shapeArr0[0].height / shapeArr0[0].width
    ratio0 = ratio0 > 1 ? 1 / ratio0 : ratio0
    let ratio1 = shapeArr1[0].height / shapeArr1[0].width
    ratio1 = ratio1 > 1 ? 1 / ratio1 : ratio1
    if (Math.abs(ratio0 - 1) <= Math.abs(ratio1 - 1)) {
      return true
    }
    return false
  }
  return TreeMapLayout
})
