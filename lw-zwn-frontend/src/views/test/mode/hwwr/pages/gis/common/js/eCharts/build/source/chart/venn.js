define('echarts/chart/venn', [
  'require',
  './base',
  'zrender/shape/Text',
  'zrender/shape/Circle',
  'zrender/shape/Path',
  '../config',
  '../util/ecData',
  'zrender/tool/util',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const TextShape = require('zrender/shape/Text')
  const CircleShape = require('zrender/shape/Circle')
  const PathShape = require('zrender/shape/Path')
  const ecConfig = require('../config')
  ecConfig.venn = {
    zlevel: 0,
    z: 1,
    calculable: false
  }
  const ecData = require('../util/ecData')
  const zrUtil = require('zrender/tool/util')
  function Venn(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  Venn.prototype = {
    type: ecConfig.CHART_TYPE_VENN,
    _buildShape: function () {
      this.selectedMap = {}
      this._symbol = this.option.symbolList
      this._queryTarget
      this._dropBoxList = []
      this._vennDataCounter = 0
      const series = this.series
      this.data = series[0].data
      this._buildVenn(this.data)
      this.addShapeList()
    },
    _buildVenn: function (data) {
      let r0
      let r1
      if (data[0].value > data[1].value) {
        r0 = this.zr.getHeight() / 3
        r1 = (r0 * Math.sqrt(data[1].value)) / Math.sqrt(data[0].value)
      } else {
        r1 = this.zr.getHeight() / 3
        r0 = (r1 * Math.sqrt(data[0].value)) / Math.sqrt(data[1].value)
      }
      const x0 = this.zr.getWidth() / 2 - r0
      const coincideLengthAnchor =
        (((r0 + r1) / 2) * Math.sqrt(data[2].value)) /
        Math.sqrt((data[0].value + data[1].value) / 2)
      let coincideLength = r0 + r1
      if (data[2].value !== 0) {
        coincideLength = this._getCoincideLength(
          data[0].value,
          data[1].value,
          data[2].value,
          r0,
          r1,
          coincideLengthAnchor,
          Math.abs(r0 - r1),
          r0 + r1
        )
      }
      const x1 = x0 + coincideLength
      const y = this.zr.getHeight() / 2
      this._buildItem(0, 0, x0, y, r0)
      this._buildItem(0, 1, x1, y, r1)
      if (
        data[2].value !== 0 &&
        data[2].value !== data[0].value &&
        data[2].value !== data[1].value
      ) {
        const xLeft = (r0 * r0 - r1 * r1) / (2 * coincideLength) + coincideLength / 2
        const xRight = coincideLength / 2 - (r0 * r0 - r1 * r1) / (2 * coincideLength)
        const h = Math.sqrt(r0 * r0 - xLeft * xLeft)
        let rightLargeArcFlag = 0
        let leftLargeArcFlag = 0
        if (data[0].value > data[1].value && x1 < x0 + xLeft) {
          leftLargeArcFlag = 1
        }
        if (data[0].value < data[1].value && x1 < x0 + xRight) {
          rightLargeArcFlag = 1
        }
        this._buildCoincideItem(
          2,
          x0 + xLeft,
          y - h,
          y + h,
          r0,
          r1,
          rightLargeArcFlag,
          leftLargeArcFlag
        )
      }
    },
    _getCoincideLength: function (
      value0,
      value1,
      value2,
      r0,
      r1,
      coincideLengthAnchor,
      coincideLengthAnchorMin,
      coincideLengthAnchorMax
    ) {
      const x = (r0 * r0 - r1 * r1) / (2 * coincideLengthAnchor) + coincideLengthAnchor / 2
      const y = coincideLengthAnchor / 2 - (r0 * r0 - r1 * r1) / (2 * coincideLengthAnchor)
      const alfa = Math.acos(x / r0)
      const beta = Math.acos(y / r1)
      const area0 = r0 * r0 * Math.PI
      const area2 =
        alfa * r0 * r0 - x * r0 * Math.sin(alfa) + beta * r1 * r1 - y * r1 * Math.sin(beta)
      const scaleAnchor = area2 / area0
      const scale = value2 / value0
      const approximateValue = Math.abs(scaleAnchor / scale)
      if (approximateValue > 0.999 && approximateValue < 1.001) {
        return coincideLengthAnchor
      } else if (approximateValue <= 0.999) {
        coincideLengthAnchorMax = coincideLengthAnchor
        coincideLengthAnchor = (coincideLengthAnchor + coincideLengthAnchorMin) / 2
        return this._getCoincideLength(
          value0,
          value1,
          value2,
          r0,
          r1,
          coincideLengthAnchor,
          coincideLengthAnchorMin,
          coincideLengthAnchorMax
        )
      }
      coincideLengthAnchorMin = coincideLengthAnchor
      coincideLengthAnchor = (coincideLengthAnchor + coincideLengthAnchorMax) / 2
      return this._getCoincideLength(
        value0,
        value1,
        value2,
        r0,
        r1,
        coincideLengthAnchor,
        coincideLengthAnchorMin,
        coincideLengthAnchorMax
      )
    },
    _buildItem: function (seriesIndex, dataIndex, x, y, r) {
      const series = this.series
      const circle = this.getCircle(dataIndex, x, y, r)
      ecData.pack(
        circle,
        series[0],
        seriesIndex,
        series[0].data[dataIndex],
        dataIndex,
        series[0].data[dataIndex].name
      )
      this.shapeList.push(circle)
      if (series[0].itemStyle.normal.label.show) {
        const label = this.getLabel(dataIndex, x, y, r)
        ecData.pack(
          label,
          series[0],
          seriesIndex,
          series[0].data[dataIndex],
          dataIndex,
          series[0].data[dataIndex].name
        )
        this.shapeList.push(label)
      }
    },
    _buildCoincideItem: function (
      dataIndex,
      x,
      y0,
      y1,
      r0,
      r1,
      rightLargeArcFlag,
      leftLargeArcFlag
    ) {
      const series = this.series
      const serie = series[0]
      const data = this.data[dataIndex]
      const queryTarget = [data, serie]
      const normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {}
      const emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {}
      const normalColor = normal.color || this.zr.getColor(dataIndex)
      const emphasisColor = emphasis.color || this.zr.getColor(dataIndex)
      const path =
        'M' +
        x +
        ',' +
        y0 +
        'A' +
        r0 +
        ',' +
        r0 +
        ',0,' +
        rightLargeArcFlag +
        ',1,' +
        x +
        ',' +
        y1 +
        'A' +
        r1 +
        ',' +
        r1 +
        ',0,' +
        leftLargeArcFlag +
        ',1,' +
        x +
        ',' +
        y0
      const style = {
        color: normalColor,
        path: path
      }
      let shape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        style: style,
        highlightStyle: {
          color: emphasisColor,
          lineWidth: emphasis.borderWidth,
          strokeColor: emphasis.borderColor
        }
      }
      shape = new PathShape(shape)
      if (shape.buildPathArray) {
        shape.style.pathArray = shape.buildPathArray(style.path)
      }
      ecData.pack(
        shape,
        series[0],
        0,
        series[0].data[dataIndex],
        dataIndex,
        series[0].data[dataIndex].name
      )
      this.shapeList.push(shape)
    },
    getCircle: function (dataIndex, x, y, r) {
      const serie = this.series[0]
      const data = this.data[dataIndex]
      const queryTarget = [data, serie]
      const normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {}
      const emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {}
      const normalColor = normal.color || this.zr.getColor(dataIndex)
      const emphasisColor = emphasis.color || this.zr.getColor(dataIndex)
      const circle = {
        zlevel: this.getZlevelBase(),
        clickable: true,
        style: {
          x: x,
          y: y,
          r: r,
          brushType: 'fill',
          opacity: 1,
          color: normalColor
        },
        highlightStyle: {
          color: emphasisColor,
          lineWidth: emphasis.borderWidth,
          strokeColor: emphasis.borderColor
        }
      }
      if (this.deepQuery([data, serie, this.option], 'calculable')) {
        this.setCalculable(circle)
        circle.draggable = true
      }
      return new CircleShape(circle)
    },
    getLabel: function (dataIndex, x, y, r) {
      const serie = this.series[0]
      const itemStyle = serie.itemStyle
      const data = this.data[dataIndex]
      const queryTarget = [data, serie]
      const normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {}
      const status = 'normal'
      const labelControl = itemStyle[status].label
      const textStyle = labelControl.textStyle || {}
      const text = this.getLabelText(dataIndex, status)
      const textFont = this.getFont(textStyle)
      const textColor = normal.color || this.zr.getColor(dataIndex)
      const textSize = textStyle.fontSize || 12
      const textShape = {
        zlevel: ecConfig.venn.zlevel + 1,
        style: {
          x: x,
          y: y - r - textSize,
          color: textStyle.color || textColor,
          text: text,
          textFont: textFont,
          textAlign: 'center'
        }
      }
      return new TextShape(textShape)
    },
    getLabelText: function (dataIndex, status) {
      const series = this.series
      const serie = series[0]
      const data = serie.data[dataIndex]
      let formatter = this.deepQuery([data, serie], 'itemStyle.' + status + '.label.formatter')
      if (formatter) {
        if (typeof formatter === 'function') {
          return formatter(serie.name, data.name, data.value)
        } else if (typeof formatter === 'string') {
          formatter = formatter.replace('{a}', '{a0}').replace('{b}', '{b0}').replace('{c}', '{c0}')
          formatter = formatter
            .replace('{a0}', serie.name)
            .replace('{b0}', data.name)
            .replace('{c0}', data.value)
          return formatter
        }
      } else {
        return data.name
      }
    },
    refresh: function (newOption) {
      if (newOption) {
        this.option = newOption
        this.series = newOption.series
      }
      this._buildShape()
    }
  }
  zrUtil.inherits(Venn, ChartBase)
  require('../chart').define('venn', Venn)
  return Venn
})
define('zrender/shape/Path', ['require', './Base', './util/PathProxy', '../tool/util'], function (
  require
) {
  const Base = require('./Base')
  const PathProxy = require('./util/PathProxy')
  const PathSegment = PathProxy.PathSegment
  const vMag = function (v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  }
  const vRatio = function (u, v) {
    return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v))
  }
  const vAngle = function (u, v) {
    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v))
  }
  const Path = function (options) {
    Base.call(this, options)
  }
  Path.prototype = {
    type: 'path',
    buildPathArray: function (data, x, y) {
      if (!data) {
        return []
      }
      x = x || 0
      y = y || 0
      let cs = data
      const cc = [
        'm',
        'M',
        'l',
        'L',
        'v',
        'V',
        'h',
        'H',
        'z',
        'Z',
        'c',
        'C',
        'q',
        'Q',
        't',
        'T',
        's',
        'S',
        'a',
        'A'
      ]
      cs = cs.replace(/-/g, ' -')
      cs = cs.replace(/ {2}/g, ' ')
      cs = cs.replace(/ /g, ',')
      cs = cs.replace(/,,/g, ',')
      let n
      for (n = 0; n < cc.length; n++) {
        cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n])
      }
      const arr = cs.split('|')
      const ca = []
      let cpx = 0
      let cpy = 0
      for (n = 1; n < arr.length; n++) {
        let str = arr[n]
        let c = str.charAt(0)
        str = str.slice(1)
        str = str.replace(new RegExp('e,-', 'g'), 'e-')
        const p = str.split(',')
        if (p.length > 0 && p[0] === '') {
          p.shift()
        }
        for (let i = 0; i < p.length; i++) {
          p[i] = parseFloat(p[i])
        }
        while (p.length > 0) {
          if (isNaN(p[0])) {
            break
          }
          let cmd = null
          let points = []
          var ctlPtx
          var ctlPty
          var prevCmd
          var rx
          var ry
          var psi
          var fa
          var fs
          let x1 = cpx
          let y1 = cpy
          switch (c) {
            case 'l':
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'L'
              points.push(cpx, cpy)
              break
            case 'L':
              cpx = p.shift()
              cpy = p.shift()
              points.push(cpx, cpy)
              break
            case 'm':
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'M'
              points.push(cpx, cpy)
              c = 'l'
              break
            case 'M':
              cpx = p.shift()
              cpy = p.shift()
              cmd = 'M'
              points.push(cpx, cpy)
              c = 'L'
              break
            case 'h':
              cpx += p.shift()
              cmd = 'L'
              points.push(cpx, cpy)
              break
            case 'H':
              cpx = p.shift()
              cmd = 'L'
              points.push(cpx, cpy)
              break
            case 'v':
              cpy += p.shift()
              cmd = 'L'
              points.push(cpx, cpy)
              break
            case 'V':
              cpy = p.shift()
              cmd = 'L'
              points.push(cpx, cpy)
              break
            case 'C':
              points.push(p.shift(), p.shift(), p.shift(), p.shift())
              cpx = p.shift()
              cpy = p.shift()
              points.push(cpx, cpy)
              break
            case 'c':
              points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift())
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'C'
              points.push(cpx, cpy)
              break
            case 'S':
              ctlPtx = cpx
              ctlPty = cpy
              prevCmd = ca[ca.length - 1]
              if (prevCmd.command === 'C') {
                ctlPtx = cpx + (cpx - prevCmd.points[2])
                ctlPty = cpy + (cpy - prevCmd.points[3])
              }
              points.push(ctlPtx, ctlPty, p.shift(), p.shift())
              cpx = p.shift()
              cpy = p.shift()
              cmd = 'C'
              points.push(cpx, cpy)
              break
            case 's':
              ;((ctlPtx = cpx), (ctlPty = cpy))
              prevCmd = ca[ca.length - 1]
              if (prevCmd.command === 'C') {
                ctlPtx = cpx + (cpx - prevCmd.points[2])
                ctlPty = cpy + (cpy - prevCmd.points[3])
              }
              points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift())
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'C'
              points.push(cpx, cpy)
              break
            case 'Q':
              points.push(p.shift(), p.shift())
              cpx = p.shift()
              cpy = p.shift()
              points.push(cpx, cpy)
              break
            case 'q':
              points.push(cpx + p.shift(), cpy + p.shift())
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'Q'
              points.push(cpx, cpy)
              break
            case 'T':
              ;((ctlPtx = cpx), (ctlPty = cpy))
              prevCmd = ca[ca.length - 1]
              if (prevCmd.command === 'Q') {
                ctlPtx = cpx + (cpx - prevCmd.points[0])
                ctlPty = cpy + (cpy - prevCmd.points[1])
              }
              cpx = p.shift()
              cpy = p.shift()
              cmd = 'Q'
              points.push(ctlPtx, ctlPty, cpx, cpy)
              break
            case 't':
              ;((ctlPtx = cpx), (ctlPty = cpy))
              prevCmd = ca[ca.length - 1]
              if (prevCmd.command === 'Q') {
                ctlPtx = cpx + (cpx - prevCmd.points[0])
                ctlPty = cpy + (cpy - prevCmd.points[1])
              }
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'Q'
              points.push(ctlPtx, ctlPty, cpx, cpy)
              break
            case 'A':
              rx = p.shift()
              ry = p.shift()
              psi = p.shift()
              fa = p.shift()
              fs = p.shift()
              ;((x1 = cpx), (y1 = cpy))
              ;((cpx = p.shift()), (cpy = p.shift()))
              cmd = 'A'
              points = this._convertPoint(x1, y1, cpx, cpy, fa, fs, rx, ry, psi)
              break
            case 'a':
              rx = p.shift()
              ry = p.shift()
              psi = p.shift()
              fa = p.shift()
              fs = p.shift()
              ;((x1 = cpx), (y1 = cpy))
              cpx += p.shift()
              cpy += p.shift()
              cmd = 'A'
              points = this._convertPoint(x1, y1, cpx, cpy, fa, fs, rx, ry, psi)
              break
          }
          for (let j = 0, l = points.length; j < l; j += 2) {
            points[j] += x
            points[j + 1] += y
          }
          ca.push(new PathSegment(cmd || c, points))
        }
        if (c === 'z' || c === 'Z') {
          ca.push(new PathSegment('z', []))
        }
      }
      return ca
    },
    _convertPoint: function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
      const psi = psiDeg * (Math.PI / 180)
      const xp = (Math.cos(psi) * (x1 - x2)) / 2 + (Math.sin(psi) * (y1 - y2)) / 2
      const yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2 + (Math.cos(psi) * (y1 - y2)) / 2
      const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry)
      if (lambda > 1) {
        rx *= Math.sqrt(lambda)
        ry *= Math.sqrt(lambda)
      }
      let f = Math.sqrt(
        (rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
          (rx * rx * (yp * yp) + ry * ry * (xp * xp))
      )
      if (fa === fs) {
        f *= -1
      }
      if (isNaN(f)) {
        f = 0
      }
      const cxp = (f * rx * yp) / ry
      const cyp = (f * -ry * xp) / rx
      const cx = (x1 + x2) / 2 + Math.cos(psi) * cxp - Math.sin(psi) * cyp
      const cy = (y1 + y2) / 2 + Math.sin(psi) * cxp + Math.cos(psi) * cyp
      const theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry])
      const u = [(xp - cxp) / rx, (yp - cyp) / ry]
      const v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry]
      let dTheta = vAngle(u, v)
      if (vRatio(u, v) <= -1) {
        dTheta = Math.PI
      }
      if (vRatio(u, v) >= 1) {
        dTheta = 0
      }
      if (fs === 0 && dTheta > 0) {
        dTheta = dTheta - 2 * Math.PI
      }
      if (fs === 1 && dTheta < 0) {
        dTheta = dTheta + 2 * Math.PI
      }
      return [cx, cy, rx, ry, theta, dTheta, psi, fs]
    },
    buildPath: function (ctx, style) {
      const path = style.path
      const x = style.x || 0
      const y = style.y || 0
      style.pathArray = style.pathArray || this.buildPathArray(path, x, y)
      const pathArray = style.pathArray
      const pointList = (style.pointList = [])
      let singlePointList = []
      for (var i = 0, l = pathArray.length; i < l; i++) {
        if (pathArray[i].command.toUpperCase() == 'M') {
          singlePointList.length > 0 && pointList.push(singlePointList)
          singlePointList = []
        }
        var p = pathArray[i].points
        for (let j = 0, k = p.length; j < k; j += 2) {
          singlePointList.push([p[j], p[j + 1]])
        }
      }
      singlePointList.length > 0 && pointList.push(singlePointList)
      for (var i = 0, l = pathArray.length; i < l; i++) {
        const c = pathArray[i].command
        var p = pathArray[i].points
        switch (c) {
          case 'L':
            ctx.lineTo(p[0], p[1])
            break
          case 'M':
            ctx.moveTo(p[0], p[1])
            break
          case 'C':
            ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5])
            break
          case 'Q':
            ctx.quadraticCurveTo(p[0], p[1], p[2], p[3])
            break
          case 'A':
            var cx = p[0]
            var cy = p[1]
            var rx = p[2]
            var ry = p[3]
            var theta = p[4]
            var dTheta = p[5]
            var psi = p[6]
            var fs = p[7]
            var r = rx > ry ? rx : ry
            var scaleX = rx > ry ? 1 : rx / ry
            var scaleY = rx > ry ? ry / rx : 1
            ctx.translate(cx, cy)
            ctx.rotate(psi)
            ctx.scale(scaleX, scaleY)
            ctx.arc(0, 0, r, theta, theta + dTheta, 1 - fs)
            ctx.scale(1 / scaleX, 1 / scaleY)
            ctx.rotate(-psi)
            ctx.translate(-cx, -cy)
            break
          case 'z':
            ctx.closePath()
            break
        }
      }
    },
    getRect: function (style) {
      if (style.__rect) {
        return style.__rect
      }
      let lineWidth
      if (style.brushType == 'stroke' || style.brushType == 'fill') {
        lineWidth = style.lineWidth || 1
      } else {
        lineWidth = 0
      }
      let minX = Number.MAX_VALUE
      let maxX = Number.MIN_VALUE
      let minY = Number.MAX_VALUE
      let maxY = Number.MIN_VALUE
      const x = style.x || 0
      const y = style.y || 0
      const pathArray = style.pathArray || this.buildPathArray(style.path)
      for (let i = 0; i < pathArray.length; i++) {
        const p = pathArray[i].points
        for (let j = 0; j < p.length; j++) {
          if (j % 2 === 0) {
            if (p[j] + x < minX) {
              minX = p[j]
            }
            if (p[j] + x > maxX) {
              maxX = p[j]
            }
          } else {
            if (p[j] + y < minY) {
              minY = p[j]
            }
            if (p[j] + y > maxY) {
              maxY = p[j]
            }
          }
        }
      }
      let rect
      if (
        minX === Number.MAX_VALUE ||
        maxX === Number.MIN_VALUE ||
        minY === Number.MAX_VALUE ||
        maxY === Number.MIN_VALUE
      ) {
        rect = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      } else {
        rect = {
          x: Math.round(minX - lineWidth / 2),
          y: Math.round(minY - lineWidth / 2),
          width: maxX - minX + lineWidth,
          height: maxY - minY + lineWidth
        }
      }
      style.__rect = rect
      return rect
    }
  }
  require('../tool/util').inherits(Path, Base)
  return Path
})
