define('echarts/chart/k', [
  'require',
  './base',
  '../util/shape/Candle',
  '../component/axis',
  '../component/grid',
  '../component/dataZoom',
  '../config',
  '../util/ecData',
  'zrender/tool/util',
  '../chart'
], function (require) {
  const ChartBase = require('./base')
  const CandleShape = require('../util/shape/Candle')
  require('../component/axis')
  require('../component/grid')
  require('../component/dataZoom')
  const ecConfig = require('../config')
  ecConfig.k = {
    zlevel: 0,
    z: 2,
    clickable: true,
    hoverable: true,
    legendHoverLink: false,
    xAxisIndex: 0,
    yAxisIndex: 0,
    itemStyle: {
      normal: {
        color: '#fff',
        color0: '#00aa11',
        lineStyle: {
          width: 1,
          color: '#ff3200',
          color0: '#00aa11'
        },
        label: { show: false }
      },
      emphasis: { label: { show: false } }
    }
  }
  const ecData = require('../util/ecData')
  const zrUtil = require('zrender/tool/util')
  function K(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.refresh(option)
  }
  K.prototype = {
    type: ecConfig.CHART_TYPE_K,
    _buildShape: function () {
      const series = this.series
      this.selectedMap = {}
      const _position2sIndexMap = {
        top: [],
        bottom: []
      }
      let xAxis
      for (let i = 0, l = series.length; i < l; i++) {
        if (series[i].type === ecConfig.CHART_TYPE_K) {
          series[i] = this.reformOption(series[i])
          this.legendHoverLink = series[i].legendHoverLink || this.legendHoverLink
          xAxis = this.component.xAxis.getAxis(series[i].xAxisIndex)
          if (xAxis.type === ecConfig.COMPONENT_TYPE_AXIS_CATEGORY) {
            _position2sIndexMap[xAxis.getPosition()].push(i)
          }
        }
      }
      for (const position in _position2sIndexMap) {
        if (_position2sIndexMap[position].length > 0) {
          this._buildSinglePosition(position, _position2sIndexMap[position])
        }
      }
      this.addShapeList()
    },
    _buildSinglePosition: function (position, seriesArray) {
      const mapData = this._mapData(seriesArray)
      const locationMap = mapData.locationMap
      const maxDataLength = mapData.maxDataLength
      if (maxDataLength === 0 || locationMap.length === 0) {
        return
      }
      this._buildHorizontal(seriesArray, maxDataLength, locationMap)
      for (let i = 0, l = seriesArray.length; i < l; i++) {
        this.buildMark(seriesArray[i])
      }
    },
    _mapData: function (seriesArray) {
      const series = this.series
      let serie
      let serieName
      const legend = this.component.legend
      const locationMap = []
      let maxDataLength = 0
      for (let i = 0, l = seriesArray.length; i < l; i++) {
        serie = series[seriesArray[i]]
        serieName = serie.name
        this.selectedMap[serieName] = legend ? legend.isSelected(serieName) : true
        if (this.selectedMap[serieName]) {
          locationMap.push(seriesArray[i])
        }
        maxDataLength = Math.max(maxDataLength, serie.data.length)
      }
      return {
        locationMap: locationMap,
        maxDataLength: maxDataLength
      }
    },
    _buildHorizontal: function (seriesArray, maxDataLength, locationMap) {
      const series = this.series
      let seriesIndex
      let serie
      let xAxisIndex
      let categoryAxis
      let yAxisIndex
      let valueAxis
      const pointList = {}
      let candleWidth
      let data
      let value
      let barMaxWidth
      for (let j = 0, k = locationMap.length; j < k; j++) {
        seriesIndex = locationMap[j]
        serie = series[seriesIndex]
        xAxisIndex = serie.xAxisIndex || 0
        categoryAxis = this.component.xAxis.getAxis(xAxisIndex)
        candleWidth = serie.barWidth || Math.floor(categoryAxis.getGap() / 2)
        barMaxWidth = serie.barMaxWidth
        if (barMaxWidth && barMaxWidth < candleWidth) {
          candleWidth = barMaxWidth
        }
        yAxisIndex = serie.yAxisIndex || 0
        valueAxis = this.component.yAxis.getAxis(yAxisIndex)
        pointList[seriesIndex] = []
        for (let i = 0, l = maxDataLength; i < l; i++) {
          if (categoryAxis.getNameByIndex(i) == null) {
            break
          }
          data = serie.data[i]
          value = this.getDataFromOption(data, '-')
          if (value === '-' || value.length != 4) {
            continue
          }
          pointList[seriesIndex].push([
            categoryAxis.getCoordByIndex(i),
            candleWidth,
            valueAxis.getCoord(value[0]),
            valueAxis.getCoord(value[1]),
            valueAxis.getCoord(value[2]),
            valueAxis.getCoord(value[3]),
            i,
            categoryAxis.getNameByIndex(i)
          ])
        }
      }
      this._buildKLine(seriesArray, pointList)
    },
    _buildKLine: function (seriesArray, pointList) {
      const series = this.series
      let nLineWidth
      let nLineColor
      let nLineColor0
      let nColor
      let nColor0
      let eLineWidth
      let eLineColor
      let eLineColor0
      let eColor
      let eColor0
      let serie
      let queryTarget
      let data
      let seriesPL
      let singlePoint
      let candleType
      let seriesIndex
      for (let sIdx = 0, len = seriesArray.length; sIdx < len; sIdx++) {
        seriesIndex = seriesArray[sIdx]
        serie = series[seriesIndex]
        seriesPL = pointList[seriesIndex]
        if (this._isLarge(seriesPL)) {
          seriesPL = this._getLargePointList(seriesPL)
        }
        if (serie.type === ecConfig.CHART_TYPE_K && seriesPL != null) {
          queryTarget = serie
          nLineWidth = this.query(queryTarget, 'itemStyle.normal.lineStyle.width')
          nLineColor = this.query(queryTarget, 'itemStyle.normal.lineStyle.color')
          nLineColor0 = this.query(queryTarget, 'itemStyle.normal.lineStyle.color0')
          nColor = this.query(queryTarget, 'itemStyle.normal.color')
          nColor0 = this.query(queryTarget, 'itemStyle.normal.color0')
          eLineWidth = this.query(queryTarget, 'itemStyle.emphasis.lineStyle.width')
          eLineColor = this.query(queryTarget, 'itemStyle.emphasis.lineStyle.color')
          eLineColor0 = this.query(queryTarget, 'itemStyle.emphasis.lineStyle.color0')
          eColor = this.query(queryTarget, 'itemStyle.emphasis.color')
          eColor0 = this.query(queryTarget, 'itemStyle.emphasis.color0')
          for (let i = 0, l = seriesPL.length; i < l; i++) {
            singlePoint = seriesPL[i]
            data = serie.data[singlePoint[6]]
            queryTarget = data
            candleType = singlePoint[3] < singlePoint[2]
            this.shapeList.push(
              this._getCandle(
                seriesIndex,
                singlePoint[6],
                singlePoint[7],
                singlePoint[0],
                singlePoint[1],
                singlePoint[2],
                singlePoint[3],
                singlePoint[4],
                singlePoint[5],
                candleType
                  ? this.query(queryTarget, 'itemStyle.normal.color') || nColor
                  : this.query(queryTarget, 'itemStyle.normal.color0') || nColor0,
                this.query(queryTarget, 'itemStyle.normal.lineStyle.width') || nLineWidth,
                candleType
                  ? this.query(queryTarget, 'itemStyle.normal.lineStyle.color') || nLineColor
                  : this.query(queryTarget, 'itemStyle.normal.lineStyle.color0') || nLineColor0,
                candleType
                  ? this.query(queryTarget, 'itemStyle.emphasis.color') || eColor || nColor
                  : this.query(queryTarget, 'itemStyle.emphasis.color0') || eColor0 || nColor0,
                this.query(queryTarget, 'itemStyle.emphasis.lineStyle.width') ||
                  eLineWidth ||
                  nLineWidth,
                candleType
                  ? this.query(queryTarget, 'itemStyle.emphasis.lineStyle.color') ||
                      eLineColor ||
                      nLineColor
                  : this.query(queryTarget, 'itemStyle.emphasis.lineStyle.color0') ||
                      eLineColor0 ||
                      nLineColor0
              )
            )
          }
        }
      }
    },
    _isLarge: function (singlePL) {
      return singlePL[0][1] < 0.5
    },
    _getLargePointList: function (singlePL) {
      const total = this.component.grid.getWidth()
      const len = singlePL.length
      const newList = []
      for (let i = 0; i < total; i++) {
        newList[i] = singlePL[Math.floor((len / total) * i)]
      }
      return newList
    },
    _getCandle: function (
      seriesIndex,
      dataIndex,
      name,
      x,
      width,
      y0,
      y1,
      y2,
      y3,
      nColor,
      nLinewidth,
      nLineColor,
      eColor,
      eLinewidth,
      eLineColor
    ) {
      const series = this.series
      const serie = series[seriesIndex]
      const data = serie.data[dataIndex]
      const queryTarget = [data, serie]
      let itemShape = {
        zlevel: this.getZlevelBase(),
        z: this.getZBase(),
        clickable: this.deepQuery(queryTarget, 'clickable'),
        hoverable: this.deepQuery(queryTarget, 'hoverable'),
        style: {
          x: x,
          y: [y0, y1, y2, y3],
          width: width,
          color: nColor,
          strokeColor: nLineColor,
          lineWidth: nLinewidth,
          brushType: 'both'
        },
        highlightStyle: {
          color: eColor,
          strokeColor: eLineColor,
          lineWidth: eLinewidth
        },
        _seriesIndex: seriesIndex
      }
      itemShape = this.addLabel(itemShape, serie, data, name)
      ecData.pack(itemShape, serie, seriesIndex, data, dataIndex, name)
      itemShape = new CandleShape(itemShape)
      return itemShape
    },
    getMarkCoord: function (seriesIndex, mpData) {
      const serie = this.series[seriesIndex]
      const xAxis = this.component.xAxis.getAxis(serie.xAxisIndex)
      const yAxis = this.component.yAxis.getAxis(serie.yAxisIndex)
      return [
        typeof mpData.xAxis !== 'string' && xAxis.getCoordByIndex
          ? xAxis.getCoordByIndex(mpData.xAxis || 0)
          : xAxis.getCoord(mpData.xAxis || 0),
        typeof mpData.yAxis !== 'string' && yAxis.getCoordByIndex
          ? yAxis.getCoordByIndex(mpData.yAxis || 0)
          : yAxis.getCoord(mpData.yAxis || 0)
      ]
    },
    refresh: function (newOption) {
      if (newOption) {
        this.option = newOption
        this.series = newOption.series
      }
      this.backupShapeList()
      this._buildShape()
    },
    addDataAnimation: function (params, done) {
      const series = this.series
      const aniMap = {}
      for (var i = 0, l = params.length; i < l; i++) {
        aniMap[params[i][0]] = params[i]
      }
      let x
      let dx
      let y
      let serie
      let seriesIndex
      let dataIndex
      let aniCount = 0
      function animationDone() {
        aniCount--
        if (aniCount === 0) {
          done && done()
        }
      }
      for (var i = 0, l = this.shapeList.length; i < l; i++) {
        seriesIndex = this.shapeList[i]._seriesIndex
        if (aniMap[seriesIndex] && !aniMap[seriesIndex][3]) {
          if (this.shapeList[i].type === 'candle') {
            dataIndex = ecData.get(this.shapeList[i], 'dataIndex')
            serie = series[seriesIndex]
            if (aniMap[seriesIndex][2] && dataIndex === serie.data.length - 1) {
              this.zr.delShape(this.shapeList[i].id)
              continue
            } else if (!aniMap[seriesIndex][2] && dataIndex === 0) {
              this.zr.delShape(this.shapeList[i].id)
              continue
            }
            dx = this.component.xAxis.getAxis(serie.xAxisIndex || 0).getGap()
            x = aniMap[seriesIndex][2] ? dx : -dx
            y = 0
            aniCount++
            this.zr
              .animate(this.shapeList[i].id, '')
              .when(this.query(this.option, 'animationDurationUpdate'), {
                position: [x, y]
              })
              .done(animationDone)
              .start()
          }
        }
      }
      if (!aniCount) {
        animationDone()
      }
    }
  }
  zrUtil.inherits(K, ChartBase)
  require('../chart').define('k', K)
  return K
})
