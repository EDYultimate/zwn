define('echarts/chart/chord', [
  'require',
  './base',
  'zrender/shape/Text',
  'zrender/shape/Line',
  'zrender/shape/Sector',
  '../util/shape/Ribbon',
  '../util/shape/Icon',
  'zrender/shape/BezierCurve',
  '../config',
  '../util/ecData',
  'zrender/tool/util',
  'zrender/tool/vector',
  '../data/Graph',
  '../layout/Chord',
  '../chart'
], function (require) {
  'use strict'
  const ChartBase = require('./base')
  const TextShape = require('zrender/shape/Text')
  const LineShape = require('zrender/shape/Line')
  const SectorShape = require('zrender/shape/Sector')
  const RibbonShape = require('../util/shape/Ribbon')
  const IconShape = require('../util/shape/Icon')
  const BezierCurveShape = require('zrender/shape/BezierCurve')
  const ecConfig = require('../config')
  ecConfig.chord = {
    zlevel: 0,
    z: 2,
    clickable: true,
    radius: ['65%', '75%'],
    center: ['50%', '50%'],
    padding: 2,
    sort: 'none',
    sortSub: 'none',
    startAngle: 90,
    clockWise: true,
    ribbonType: true,
    minRadius: 10,
    maxRadius: 20,
    symbol: 'circle',
    showScale: false,
    showScaleText: false,
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#000',
        label: {
          show: true,
          rotate: false,
          distance: 5
        },
        chordStyle: {
          width: 1,
          color: 'black',
          borderWidth: 1,
          borderColor: '#999',
          opacity: 0.5
        }
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#000',
        chordStyle: {
          width: 1,
          color: 'black',
          borderWidth: 1,
          borderColor: '#999'
        }
      }
    }
  }
  const ecData = require('../util/ecData')
  const zrUtil = require('zrender/tool/util')
  const vec2 = require('zrender/tool/vector')
  const Graph = require('../data/Graph')
  const ChordLayout = require('../layout/Chord')
  function Chord(ecTheme, messageCenter, zr, option, myChart) {
    ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart)
    this.scaleLineLength = 4
    this.scaleUnitAngle = 4
    this.refresh(option)
  }
  Chord.prototype = {
    type: ecConfig.CHART_TYPE_CHORD,
    _init: function () {
      const series = this.series
      this.selectedMap = {}
      const chordSeriesMap = {}
      const chordSeriesGroups = {}
      for (var i = 0, l = series.length; i < l; i++) {
        if (series[i].type === this.type) {
          const _isSelected = this.isSelected(series[i].name)
          this.selectedMap[series[i].name] = _isSelected
          if (_isSelected) {
            this.buildMark(i)
          }
          this.reformOption(series[i])
          chordSeriesMap[series[i].name] = series[i]
        }
      }
      for (var i = 0, l = series.length; i < l; i++) {
        if (series[i].type === this.type) {
          if (series[i].insertToSerie) {
            const referenceSerie = chordSeriesMap[series[i].insertToSerie]
            series[i]._referenceSerie = referenceSerie
          } else {
            chordSeriesGroups[series[i].name] = [series[i]]
          }
        }
      }
      for (var i = 0, l = series.length; i < l; i++) {
        if (series[i].type === this.type) {
          if (series[i].insertToSerie) {
            let mainSerie = series[i]._referenceSerie
            while (mainSerie && mainSerie._referenceSerie) {
              mainSerie = mainSerie._referenceSerie
            }
            if (chordSeriesGroups[mainSerie.name] && this.selectedMap[series[i].name]) {
              chordSeriesGroups[mainSerie.name].push(series[i])
            }
          }
        }
      }
      for (const name in chordSeriesGroups) {
        this._buildChords(chordSeriesGroups[name])
      }
      this.addShapeList()
    },
    _getNodeCategory: function (serie, group) {
      return serie.categories && serie.categories[group.category || 0]
    },
    _getNodeQueryTarget: function (serie, group) {
      const category = this._getNodeCategory(serie, group)
      return [group, category, serie]
    },
    _getEdgeQueryTarget: function (serie, edge, type) {
      type = type || 'normal'
      return [edge.itemStyle && edge.itemStyle[type], serie.itemStyle[type].chordStyle]
    },
    _buildChords: function (series) {
      const graphs = []
      const mainSerie = series[0]
      const nodeFilter = function (n) {
        return n.layout.size > 0
      }
      const createEdgeFilter = function (graph) {
        return function (e) {
          return graph.getEdge(e.node2, e.node1)
        }
      }
      for (var i = 0; i < series.length; i++) {
        const serie = series[i]
        if (this.selectedMap[serie.name]) {
          var graph
          if (serie.data && serie.matrix) {
            graph = this._getSerieGraphFromDataMatrix(serie, mainSerie)
          } else if (serie.nodes && serie.links) {
            graph = this._getSerieGraphFromNodeLinks(serie, mainSerie)
          }
          graph.filterNode(nodeFilter, this)
          if (serie.ribbonType) {
            graph.filterEdge(createEdgeFilter(graph))
          }
          graphs.push(graph)
          graph.__serie = serie
        }
      }
      if (!graphs.length) {
        return
      }
      const mainGraph = graphs[0]
      if (!mainSerie.ribbonType) {
        const minRadius = mainSerie.minRadius
        const maxRadius = mainSerie.maxRadius
        let min = Infinity,
          max = -Infinity
        mainGraph.eachNode(function (node) {
          max = Math.max(node.layout.size, max)
          min = Math.min(node.layout.size, min)
        })
        const multiplier = (maxRadius - minRadius) / (max - min)
        mainGraph.eachNode(function (node) {
          const queryTarget = this._getNodeQueryTarget(mainSerie, node)
          const symbolSize = this.query(queryTarget, 'symbolSize')
          if (max === min) {
            node.layout.size = symbolSize || min
          } else {
            node.layout.size = symbolSize || (node.layout.size - min) * multiplier + minRadius
          }
        }, this)
      }
      const layout = new ChordLayout()
      layout.clockWise = mainSerie.clockWise
      layout.startAngle = (mainSerie.startAngle * Math.PI) / 180
      if (!layout.clockWise) {
        layout.startAngle = -layout.startAngle
      }
      layout.padding = (mainSerie.padding * Math.PI) / 180
      layout.sort = mainSerie.sort
      layout.sortSub = mainSerie.sortSub
      layout.directed = mainSerie.ribbonType
      layout.run(graphs)
      const showLabel = this.query(mainSerie, 'itemStyle.normal.label.show')
      if (mainSerie.ribbonType) {
        this._buildSectors(mainSerie, 0, mainGraph, mainSerie, graphs)
        if (showLabel) {
          this._buildLabels(mainSerie, 0, mainGraph, mainSerie, graphs)
        }
        for (var i = 0, j = 0; i < series.length; i++) {
          if (this.selectedMap[series[i].name]) {
            this._buildRibbons(series, i, graphs[j++], mainSerie)
          }
        }
        if (mainSerie.showScale) {
          this._buildScales(mainSerie, 0, mainGraph)
        }
      } else {
        this._buildNodeIcons(mainSerie, 0, mainGraph, mainSerie, graphs)
        if (showLabel) {
          this._buildLabels(mainSerie, 0, mainGraph, mainSerie, graphs)
        }
        for (var i = 0, j = 0; i < series.length; i++) {
          if (this.selectedMap[series[i].name]) {
            this._buildEdgeCurves(series, i, graphs[j++], mainSerie, mainGraph)
          }
        }
      }
      this._initHoverHandler(series, graphs)
    },
    _getSerieGraphFromDataMatrix: function (serie, mainSerie) {
      const nodesData = []
      let count = 0
      const matrix = []
      for (var i = 0; i < serie.matrix.length; i++) {
        matrix[i] = serie.matrix[i].slice()
      }
      const data = serie.data || serie.nodes
      for (var i = 0; i < data.length; i++) {
        const node = {}
        const group = data[i]
        group.rawIndex = i
        for (const key in group) {
          if (key === 'name') {
            node.id = group.name
          } else {
            node[key] = group[key]
          }
        }
        const category = this._getNodeCategory(mainSerie, group)
        const name = category ? category.name : group.name
        this.selectedMap[name] = this.isSelected(name)
        if (this.selectedMap[name]) {
          nodesData.push(node)
          count++
        } else {
          matrix.splice(count, 1)
          for (let j = 0; j < matrix.length; j++) {
            matrix[j].splice(count, 1)
          }
        }
      }
      const graph = Graph.fromMatrix(nodesData, matrix, true)
      graph.eachNode(function (n, idx) {
        n.layout = { size: n.data.outValue }
        n.rawIndex = n.data.rawIndex
      })
      graph.eachEdge(function (e) {
        e.layout = { weight: e.data.weight }
      })
      return graph
    },
    _getSerieGraphFromNodeLinks: function (serie, mainSerie) {
      const graph = new Graph(true)
      const nodes = serie.data || serie.nodes
      for (var i = 0, len = nodes.length; i < len; i++) {
        const n = nodes[i]
        if (!n || n.ignore) {
          continue
        }
        const category = this._getNodeCategory(mainSerie, n)
        const name = category ? category.name : n.name
        this.selectedMap[name] = this.isSelected(name)
        if (this.selectedMap[name]) {
          const node = graph.addNode(n.name, n)
          node.rawIndex = i
        }
      }
      for (var i = 0, len = serie.links.length; i < len; i++) {
        const e = serie.links[i]
        let n1 = e.source
        let n2 = e.target
        if (typeof n1 === 'number') {
          n1 = nodes[n1]
          if (n1) {
            n1 = n1.name
          }
        }
        if (typeof n2 === 'number') {
          n2 = nodes[n2]
          if (n2) {
            n2 = n2.name
          }
        }
        const edge = graph.addEdge(n1, n2, e)
        if (edge) {
          edge.rawIndex = i
        }
      }
      graph.eachNode(function (n) {
        let value = n.data.value
        if (value == null) {
          value = 0
          if (mainSerie.ribbonType) {
            for (var i = 0; i < n.outEdges.length; i++) {
              value += n.outEdges[i].data.weight || 0
            }
          } else {
            for (var i = 0; i < n.edges.length; i++) {
              value += n.edges[i].data.weight || 0
            }
          }
        }
        n.layout = { size: value }
      })
      graph.eachEdge(function (e) {
        e.layout = { weight: e.data.weight == null ? 1 : e.data.weight }
      })
      return graph
    },
    _initHoverHandler: function (series, graphs) {
      const mainSerie = series[0]
      const mainGraph = graphs[0]
      const self = this
      mainGraph.eachNode(function (node) {
        node.shape.onmouseover = function () {
          mainGraph.eachNode(function (n) {
            n.shape.style.opacity = 0.1
            if (n.labelShape) {
              n.labelShape.style.opacity = 0.1
              n.labelShape.modSelf()
            }
            n.shape.modSelf()
          })
          for (var i = 0; i < graphs.length; i++) {
            for (var j = 0; j < graphs[i].edges.length; j++) {
              var e = graphs[i].edges[j]
              var queryTarget = self._getEdgeQueryTarget(graphs[i].__serie, e.data)
              e.shape.style.opacity = self.deepQuery(queryTarget, 'opacity') * 0.1
              e.shape.modSelf()
            }
          }
          node.shape.style.opacity = 1
          if (node.labelShape) {
            node.labelShape.style.opacity = 1
          }
          for (var i = 0; i < graphs.length; i++) {
            const n = graphs[i].getNodeById(node.id)
            if (n) {
              for (var j = 0; j < n.outEdges.length; j++) {
                var e = n.outEdges[j]
                var queryTarget = self._getEdgeQueryTarget(graphs[i].__serie, e.data)
                e.shape.style.opacity = self.deepQuery(queryTarget, 'opacity')
                const other = graphs[0].getNodeById(e.node2.id)
                if (other) {
                  if (other.shape) {
                    other.shape.style.opacity = 1
                  }
                  if (other.labelShape) {
                    other.labelShape.style.opacity = 1
                  }
                }
              }
            }
          }
          self.zr.refreshNextFrame()
        }
        node.shape.onmouseout = function () {
          mainGraph.eachNode(function (n) {
            n.shape.style.opacity = 1
            if (n.labelShape) {
              n.labelShape.style.opacity = 1
              n.labelShape.modSelf()
            }
            n.shape.modSelf()
          })
          for (let i = 0; i < graphs.length; i++) {
            for (let j = 0; j < graphs[i].edges.length; j++) {
              const e = graphs[i].edges[j]
              const queryTarget = [e.data, mainSerie]
              e.shape.style.opacity = self.deepQuery(
                queryTarget,
                'itemStyle.normal.chordStyle.opacity'
              )
              e.shape.modSelf()
            }
          }
          self.zr.refreshNextFrame()
        }
      })
    },
    _buildSectors: function (serie, serieIdx, graph, mainSerie) {
      const center = this.parseCenter(this.zr, mainSerie.center)
      const radius = this.parseRadius(this.zr, mainSerie.radius)
      const clockWise = mainSerie.clockWise
      const sign = clockWise ? 1 : -1
      graph.eachNode(function (node) {
        const category = this._getNodeCategory(mainSerie, node.data)
        const color = category ? this.getColor(category.name) : this.getColor(node.id)
        const startAngle = (node.layout.startAngle / Math.PI) * 180 * sign
        const endAngle = (node.layout.endAngle / Math.PI) * 180 * sign
        const sector = new SectorShape({
          zlevel: this.getZlevelBase(),
          z: this.getZBase(),
          style: {
            x: center[0],
            y: center[1],
            r0: radius[0],
            r: radius[1],
            startAngle: startAngle,
            endAngle: endAngle,
            brushType: 'fill',
            opacity: 1,
            color: color,
            clockWise: clockWise
          },
          clickable: mainSerie.clickable,
          highlightStyle: { brushType: 'fill' }
        })
        sector.style.lineWidth = this.deepQuery(
          [node.data, mainSerie],
          'itemStyle.normal.borderWidth'
        )
        sector.highlightStyle.lineWidth = this.deepQuery(
          [node.data, mainSerie],
          'itemStyle.emphasis.borderWidth'
        )
        sector.style.strokeColor = this.deepQuery(
          [node.data, mainSerie],
          'itemStyle.normal.borderColor'
        )
        sector.highlightStyle.strokeColor = this.deepQuery(
          [node.data, mainSerie],
          'itemStyle.emphasis.borderColor'
        )
        if (sector.style.lineWidth > 0) {
          sector.style.brushType = 'both'
        }
        if (sector.highlightStyle.lineWidth > 0) {
          sector.highlightStyle.brushType = 'both'
        }
        ecData.pack(sector, serie, serieIdx, node.data, node.rawIndex, node.id, node.category)
        this.shapeList.push(sector)
        node.shape = sector
      }, this)
    },
    _buildNodeIcons: function (serie, serieIdx, graph, mainSerie) {
      const center = this.parseCenter(this.zr, mainSerie.center)
      const radius = this.parseRadius(this.zr, mainSerie.radius)
      const r = radius[1]
      graph.eachNode(function (node) {
        const startAngle = node.layout.startAngle
        const endAngle = node.layout.endAngle
        const angle = (startAngle + endAngle) / 2
        const x = r * Math.cos(angle)
        const y = r * Math.sin(angle)
        const queryTarget = this._getNodeQueryTarget(mainSerie, node.data)
        const category = this._getNodeCategory(mainSerie, node.data)
        let color = this.deepQuery(queryTarget, 'itemStyle.normal.color')
        if (!color) {
          color = category ? this.getColor(category.name) : this.getColor(node.id)
        }
        const iconShape = new IconShape({
          zlevel: this.getZlevelBase(),
          z: this.getZBase() + 1,
          style: {
            x: -node.layout.size,
            y: -node.layout.size,
            width: node.layout.size * 2,
            height: node.layout.size * 2,
            iconType: this.deepQuery(queryTarget, 'symbol'),
            color: color,
            brushType: 'both',
            lineWidth: this.deepQuery(queryTarget, 'itemStyle.normal.borderWidth'),
            strokeColor: this.deepQuery(queryTarget, 'itemStyle.normal.borderColor')
          },
          highlightStyle: {
            color: this.deepQuery(queryTarget, 'itemStyle.emphasis.color'),
            lineWidth: this.deepQuery(queryTarget, 'itemStyle.emphasis.borderWidth'),
            strokeColor: this.deepQuery(queryTarget, 'itemStyle.emphasis.borderColor')
          },
          clickable: mainSerie.clickable,
          position: [x + center[0], y + center[1]]
        })
        ecData.pack(iconShape, serie, serieIdx, node.data, node.rawIndex, node.id, node.category)
        this.shapeList.push(iconShape)
        node.shape = iconShape
      }, this)
    },
    _buildLabels: function (serie, serieIdx, graph, mainSerie) {
      const labelColor = this.query(mainSerie, 'itemStyle.normal.label.color')
      const rotateLabel = this.query(mainSerie, 'itemStyle.normal.label.rotate')
      const labelDistance = this.query(mainSerie, 'itemStyle.normal.label.distance')
      const center = this.parseCenter(this.zr, mainSerie.center)
      const radius = this.parseRadius(this.zr, mainSerie.radius)
      const clockWise = mainSerie.clockWise
      const sign = clockWise ? 1 : -1
      graph.eachNode(function (node) {
        const startAngle = (node.layout.startAngle / Math.PI) * 180 * sign
        const endAngle = (node.layout.endAngle / Math.PI) * 180 * sign
        let angle = (startAngle * -sign + endAngle * -sign) / 2
        angle %= 360
        if (angle < 0) {
          angle += 360
        }
        const isRightSide = angle <= 90 || angle >= 270
        angle = (angle * Math.PI) / 180
        const v = [Math.cos(angle), -Math.sin(angle)]
        let distance = 0
        if (mainSerie.ribbonType) {
          distance = mainSerie.showScaleText ? 35 + labelDistance : labelDistance
        } else {
          distance = labelDistance + node.layout.size
        }
        const start = vec2.scale([], v, radius[1] + distance)
        vec2.add(start, start, center)
        let labelShape = {
          zlevel: this.getZlevelBase(),
          z: this.getZBase() + 1,
          hoverable: false,
          style: {
            text: node.data.label == null ? node.id : node.data.label,
            textAlign: isRightSide ? 'left' : 'right',
            color: labelColor || '#000000'
          }
        }
        if (rotateLabel) {
          labelShape.rotation = isRightSide ? angle : Math.PI + angle
          if (isRightSide) {
            labelShape.style.x = radius[1] + distance
          } else {
            labelShape.style.x = -radius[1] - distance
          }
          labelShape.style.y = 0
          labelShape.position = center.slice()
        } else {
          labelShape.style.x = start[0]
          labelShape.style.y = start[1]
        }
        labelShape.style.textColor =
          this.deepQuery([node.data, mainSerie], 'itemStyle.normal.label.textStyle.color') || '#fff'
        labelShape.style.textFont = this.getFont(
          this.deepQuery([node.data, mainSerie], 'itemStyle.normal.label.textStyle')
        )
        labelShape = new TextShape(labelShape)
        this.shapeList.push(labelShape)
        node.labelShape = labelShape
      }, this)
    },
    _buildRibbons: function (series, serieIdx, graph, mainSerie) {
      const serie = series[serieIdx]
      const center = this.parseCenter(this.zr, mainSerie.center)
      const radius = this.parseRadius(this.zr, mainSerie.radius)
      graph.eachEdge(function (edge, idx) {
        let color
        const other = graph.getEdge(edge.node2, edge.node1)
        if (!other || edge.shape) {
          return
        }
        if (other.shape) {
          edge.shape = other.shape
          return
        }
        const s0 = (edge.layout.startAngle / Math.PI) * 180
        const s1 = (edge.layout.endAngle / Math.PI) * 180
        const t0 = (other.layout.startAngle / Math.PI) * 180
        const t1 = (other.layout.endAngle / Math.PI) * 180
        if (series.length === 1) {
          if (edge.layout.weight <= other.layout.weight) {
            color = this.getColor(edge.node1.id)
          } else {
            color = this.getColor(edge.node2.id)
          }
        } else {
          color = this.getColor(serie.name)
        }
        const queryTarget = this._getEdgeQueryTarget(serie, edge.data)
        const queryTargetEmphasis = this._getEdgeQueryTarget(serie, edge.data, 'emphasis')
        const ribbon = new RibbonShape({
          zlevel: this.getZlevelBase(),
          z: this.getZBase(),
          style: {
            x: center[0],
            y: center[1],
            r: radius[0],
            source0: s0,
            source1: s1,
            target0: t0,
            target1: t1,
            brushType: 'both',
            opacity: this.deepQuery(queryTarget, 'opacity'),
            color: color,
            lineWidth: this.deepQuery(queryTarget, 'borderWidth'),
            strokeColor: this.deepQuery(queryTarget, 'borderColor'),
            clockWise: mainSerie.clockWise
          },
          clickable: mainSerie.clickable,
          highlightStyle: {
            brushType: 'both',
            opacity: this.deepQuery(queryTargetEmphasis, 'opacity'),
            lineWidth: this.deepQuery(queryTargetEmphasis, 'borderWidth'),
            strokeColor: this.deepQuery(queryTargetEmphasis, 'borderColor')
          }
        })
        let node1, node2
        if (edge.layout.weight <= other.layout.weight) {
          node1 = other.node1
          node2 = other.node2
        } else {
          node1 = edge.node1
          node2 = edge.node2
        }
        ecData.pack(
          ribbon,
          serie,
          serieIdx,
          edge.data,
          edge.rawIndex == null ? idx : edge.rawIndex,
          edge.data.name || node1.id + '-' + node2.id,
          node1.id,
          node2.id
        )
        this.shapeList.push(ribbon)
        edge.shape = ribbon
      }, this)
    },
    _buildEdgeCurves: function (series, serieIdx, graph, mainSerie, mainGraph) {
      const serie = series[serieIdx]
      const center = this.parseCenter(this.zr, mainSerie.center)
      graph.eachEdge(function (e, idx) {
        const node1 = mainGraph.getNodeById(e.node1.id)
        const node2 = mainGraph.getNodeById(e.node2.id)
        const shape1 = node1.shape
        const shape2 = node2.shape
        const queryTarget = this._getEdgeQueryTarget(serie, e.data)
        const queryTargetEmphasis = this._getEdgeQueryTarget(serie, e.data, 'emphasis')
        const curveShape = new BezierCurveShape({
          zlevel: this.getZlevelBase(),
          z: this.getZBase(),
          style: {
            xStart: shape1.position[0],
            yStart: shape1.position[1],
            xEnd: shape2.position[0],
            yEnd: shape2.position[1],
            cpX1: center[0],
            cpY1: center[1],
            lineWidth: this.deepQuery(queryTarget, 'width'),
            strokeColor: this.deepQuery(queryTarget, 'color'),
            opacity: this.deepQuery(queryTarget, 'opacity')
          },
          highlightStyle: {
            lineWidth: this.deepQuery(queryTargetEmphasis, 'width'),
            strokeColor: this.deepQuery(queryTargetEmphasis, 'color'),
            opacity: this.deepQuery(queryTargetEmphasis, 'opacity')
          }
        })
        ecData.pack(
          curveShape,
          serie,
          serieIdx,
          e.data,
          e.rawIndex == null ? idx : e.rawIndex,
          e.data.name || e.node1.id + '-' + e.node2.id,
          e.node1.id,
          e.node2.id
        )
        this.shapeList.push(curveShape)
        e.shape = curveShape
      }, this)
    },
    _buildScales: function (serie, serieIdx, graph) {
      const clockWise = serie.clockWise
      const center = this.parseCenter(this.zr, serie.center)
      const radius = this.parseRadius(this.zr, serie.radius)
      const sign = clockWise ? 1 : -1
      let sumValue = 0
      let maxValue = -Infinity
      let unitPostfix
      let unitScale
      if (serie.showScaleText) {
        graph.eachNode(function (node) {
          const val = node.data.value
          if (val > maxValue) {
            maxValue = val
          }
          sumValue += val
        })
        if (maxValue > 10000000000) {
          unitPostfix = 'b'
          unitScale = 1e-9
        } else if (maxValue > 10000000) {
          unitPostfix = 'm'
          unitScale = 0.000001
        } else if (maxValue > 10000) {
          unitPostfix = 'k'
          unitScale = 0.001
        } else {
          unitPostfix = ''
          unitScale = 1
        }
      }
      const unitValue = sumValue / (360 - serie.padding)
      graph.eachNode(function (node) {
        const startAngle = (node.layout.startAngle / Math.PI) * 180
        const endAngle = (node.layout.endAngle / Math.PI) * 180
        let scaleAngle = startAngle
        while (true) {
          if ((clockWise && scaleAngle > endAngle) || (!clockWise && scaleAngle < endAngle)) {
            break
          }
          var theta = (scaleAngle / 180) * Math.PI
          const v = [Math.cos(theta), Math.sin(theta)]
          const start = vec2.scale([], v, radius[1] + 1)
          vec2.add(start, start, center)
          const end = vec2.scale([], v, radius[1] + this.scaleLineLength)
          vec2.add(end, end, center)
          const scaleShape = new LineShape({
            zlevel: this.getZlevelBase(),
            z: this.getZBase() - 1,
            hoverable: false,
            style: {
              xStart: start[0],
              yStart: start[1],
              xEnd: end[0],
              yEnd: end[1],
              lineCap: 'round',
              brushType: 'stroke',
              strokeColor: '#666',
              lineWidth: 1
            }
          })
          this.shapeList.push(scaleShape)
          scaleAngle += sign * this.scaleUnitAngle
        }
        if (!serie.showScaleText) {
          return
        }
        let scaleTextAngle = startAngle
        const step = unitValue * 5 * this.scaleUnitAngle
        let scaleValue = 0
        while (true) {
          if (
            (clockWise && scaleTextAngle > endAngle) ||
            (!clockWise && scaleTextAngle < endAngle)
          ) {
            break
          }
          var theta = scaleTextAngle
          theta = theta % 360
          if (theta < 0) {
            theta += 360
          }
          const isRightSide = theta <= 90 || theta >= 270
          const textShape = new TextShape({
            zlevel: this.getZlevelBase(),
            z: this.getZBase() - 1,
            hoverable: false,
            style: {
              x: isRightSide
                ? radius[1] + this.scaleLineLength + 4
                : -radius[1] - this.scaleLineLength - 4,
              y: 0,
              text: Math.round(scaleValue * 10) / 10 + unitPostfix,
              textAlign: isRightSide ? 'left' : 'right'
            },
            position: center.slice(),
            rotation: isRightSide
              ? [(-theta / 180) * Math.PI, 0, 0]
              : [(-(theta + 180) / 180) * Math.PI, 0, 0]
          })
          this.shapeList.push(textShape)
          scaleValue += step * unitScale
          scaleTextAngle += sign * this.scaleUnitAngle * 5
        }
      }, this)
    },
    refresh: function (newOption) {
      if (newOption) {
        this.option = newOption
        this.series = newOption.series
      }
      this.legend = this.component.legend
      if (this.legend) {
        this.getColor = function (param) {
          return this.legend.getColor(param)
        }
        this.isSelected = function (param) {
          return this.legend.isSelected(param)
        }
      } else {
        const colorMap = {}
        let count = 0
        this.getColor = function (key) {
          if (colorMap[key]) {
            return colorMap[key]
          }
          if (!colorMap[key]) {
            colorMap[key] = this.zr.getColor(count++)
          }
          return colorMap[key]
        }
        this.isSelected = function () {
          return true
        }
      }
      this.backupShapeList()
      this._init()
    },
    reformOption: function (opt) {
      const _merge = zrUtil.merge
      opt = _merge(_merge(opt || {}, this.ecTheme.chord), ecConfig.chord)
      opt.itemStyle.normal.label.textStyle = this.getTextStyle(opt.itemStyle.normal.label.textStyle)
      this.z = opt.z
      this.zlevel = opt.zlevel
    }
  }
  zrUtil.inherits(Chord, ChartBase)
  require('../chart').define('chord', Chord)
  return Chord
})
define('echarts/util/shape/Ribbon', [
  'require',
  'zrender/shape/Base',
  'zrender/shape/util/PathProxy',
  'zrender/tool/util',
  'zrender/tool/area'
], function (require) {
  const Base = require('zrender/shape/Base')
  const PathProxy = require('zrender/shape/util/PathProxy')
  const zrUtil = require('zrender/tool/util')
  const area = require('zrender/tool/area')
  function RibbonShape(options) {
    Base.call(this, options)
    this._pathProxy = new PathProxy()
  }
  RibbonShape.prototype = {
    type: 'ribbon',
    buildPath: function (ctx, style) {
      const clockWise = style.clockWise || false
      const path = this._pathProxy
      path.begin(ctx)
      const cx = style.x
      const cy = style.y
      const r = style.r
      const s0 = (style.source0 / 180) * Math.PI
      const s1 = (style.source1 / 180) * Math.PI
      const t0 = (style.target0 / 180) * Math.PI
      const t1 = (style.target1 / 180) * Math.PI
      const sx0 = cx + Math.cos(s0) * r
      const sy0 = cy + Math.sin(s0) * r
      const sx1 = cx + Math.cos(s1) * r
      const sy1 = cy + Math.sin(s1) * r
      const tx0 = cx + Math.cos(t0) * r
      const ty0 = cy + Math.sin(t0) * r
      const tx1 = cx + Math.cos(t1) * r
      const ty1 = cy + Math.sin(t1) * r
      path.moveTo(sx0, sy0)
      path.arc(cx, cy, style.r, s0, s1, !clockWise)
      path.bezierCurveTo(
        (cx - sx1) * 0.7 + sx1,
        (cy - sy1) * 0.7 + sy1,
        (cx - tx0) * 0.7 + tx0,
        (cy - ty0) * 0.7 + ty0,
        tx0,
        ty0
      )
      if (style.source0 === style.target0 && style.source1 === style.target1) {
        return
      }
      path.arc(cx, cy, style.r, t0, t1, !clockWise)
      path.bezierCurveTo(
        (cx - tx1) * 0.7 + tx1,
        (cy - ty1) * 0.7 + ty1,
        (cx - sx0) * 0.7 + sx0,
        (cy - sy0) * 0.7 + sy0,
        sx0,
        sy0
      )
    },
    getRect: function (style) {
      if (style.__rect) {
        return style.__rect
      }
      if (!this._pathProxy.isEmpty()) {
        this.buildPath(null, style)
      }
      return this._pathProxy.fastBoundingRect()
    },
    isCover: function (x, y) {
      const rect = this.getRect(this.style)
      if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
        return area.isInsidePath(this._pathProxy.pathCommands, 0, 'fill', x, y)
      }
    }
  }
  zrUtil.inherits(RibbonShape, Base)
  return RibbonShape
})
define('echarts/data/Graph', ['require', 'zrender/tool/util'], function (require) {
  const util = require('zrender/tool/util')
  ;('use strict')
  const Graph = function (directed) {
    this._directed = directed || false
    this.nodes = []
    this.edges = []
    this._nodesMap = {}
    this._edgesMap = {}
  }
  Graph.prototype.isDirected = function () {
    return this._directed
  }
  Graph.prototype.addNode = function (id, data) {
    if (this._nodesMap[id]) {
      return this._nodesMap[id]
    }
    const node = new Graph.Node(id, data)
    this.nodes.push(node)
    this._nodesMap[id] = node
    return node
  }
  Graph.prototype.getNodeById = function (id) {
    return this._nodesMap[id]
  }
  Graph.prototype.addEdge = function (n1, n2, data) {
    if (typeof n1 === 'string') {
      n1 = this._nodesMap[n1]
    }
    if (typeof n2 === 'string') {
      n2 = this._nodesMap[n2]
    }
    if (!n1 || !n2) {
      return
    }
    const key = n1.id + '-' + n2.id
    if (this._edgesMap[key]) {
      return this._edgesMap[key]
    }
    const edge = new Graph.Edge(n1, n2, data)
    if (this._directed) {
      n1.outEdges.push(edge)
      n2.inEdges.push(edge)
    }
    n1.edges.push(edge)
    if (n1 !== n2) {
      n2.edges.push(edge)
    }
    this.edges.push(edge)
    this._edgesMap[key] = edge
    return edge
  }
  Graph.prototype.removeEdge = function (edge) {
    const n1 = edge.node1
    const n2 = edge.node2
    const key = n1.id + '-' + n2.id
    if (this._directed) {
      n1.outEdges.splice(util.indexOf(n1.outEdges, edge), 1)
      n2.inEdges.splice(util.indexOf(n2.inEdges, edge), 1)
    }
    n1.edges.splice(util.indexOf(n1.edges, edge), 1)
    if (n1 !== n2) {
      n2.edges.splice(util.indexOf(n2.edges, edge), 1)
    }
    delete this._edgesMap[key]
    this.edges.splice(util.indexOf(this.edges, edge), 1)
  }
  Graph.prototype.getEdge = function (n1, n2) {
    if (typeof n1 !== 'string') {
      n1 = n1.id
    }
    if (typeof n2 !== 'string') {
      n2 = n2.id
    }
    if (this._directed) {
      return this._edgesMap[n1 + '-' + n2]
    }
    return this._edgesMap[n1 + '-' + n2] || this._edgesMap[n2 + '-' + n1]
  }
  Graph.prototype.removeNode = function (node) {
    if (typeof node === 'string') {
      node = this._nodesMap[node]
      if (!node) {
        return
      }
    }
    delete this._nodesMap[node.id]
    this.nodes.splice(util.indexOf(this.nodes, node), 1)
    for (let i = 0; i < this.edges.length;) {
      const edge = this.edges[i]
      if (edge.node1 === node || edge.node2 === node) {
        this.removeEdge(edge)
      } else {
        i++
      }
    }
  }
  Graph.prototype.filterNode = function (cb, context) {
    let len = this.nodes.length
    for (let i = 0; i < len;) {
      if (cb.call(context, this.nodes[i], i)) {
        i++
      } else {
        this.removeNode(this.nodes[i])
        len--
      }
    }
  }
  Graph.prototype.filterEdge = function (cb, context) {
    let len = this.edges.length
    for (let i = 0; i < len;) {
      if (cb.call(context, this.edges[i], i)) {
        i++
      } else {
        this.removeEdge(this.edges[i])
        len--
      }
    }
  }
  Graph.prototype.eachNode = function (cb, context) {
    const len = this.nodes.length
    for (let i = 0; i < len; i++) {
      if (this.nodes[i]) {
        cb.call(context, this.nodes[i], i)
      }
    }
  }
  Graph.prototype.eachEdge = function (cb, context) {
    const len = this.edges.length
    for (let i = 0; i < len; i++) {
      if (this.edges[i]) {
        cb.call(context, this.edges[i], i)
      }
    }
  }
  Graph.prototype.clear = function () {
    this.nodes.length = 0
    this.edges.length = 0
    this._nodesMap = {}
    this._edgesMap = {}
  }
  Graph.prototype.breadthFirstTraverse = function (cb, startNode, direction, context) {
    if (typeof startNode === 'string') {
      startNode = this._nodesMap[startNode]
    }
    if (!startNode) {
      return
    }
    let edgeType = 'edges'
    if (direction === 'out') {
      edgeType = 'outEdges'
    } else if (direction === 'in') {
      edgeType = 'inEdges'
    }
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].__visited = false
    }
    if (cb.call(context, startNode, null)) {
      return
    }
    const queue = [startNode]
    while (queue.length) {
      const currentNode = queue.shift()
      const edges = currentNode[edgeType]
      for (var i = 0; i < edges.length; i++) {
        const e = edges[i]
        const otherNode = e.node1 === currentNode ? e.node2 : e.node1
        if (!otherNode.__visited) {
          if (cb.call(otherNode, otherNode, currentNode)) {
            return
          }
          queue.push(otherNode)
          otherNode.__visited = true
        }
      }
    }
  }
  Graph.prototype.clone = function () {
    const graph = new Graph(this._directed)
    for (var i = 0; i < this.nodes.length; i++) {
      graph.addNode(this.nodes[i].id, this.nodes[i].data)
    }
    for (var i = 0; i < this.edges.length; i++) {
      const e = this.edges[i]
      graph.addEdge(e.node1.id, e.node2.id, e.data)
    }
    return graph
  }
  const Node = function (id, data) {
    this.id = id
    this.data = data || null
    this.inEdges = []
    this.outEdges = []
    this.edges = []
  }
  Node.prototype.degree = function () {
    return this.edges.length
  }
  Node.prototype.inDegree = function () {
    return this.inEdges.length
  }
  Node.prototype.outDegree = function () {
    return this.outEdges.length
  }
  const Edge = function (node1, node2, data) {
    this.node1 = node1
    this.node2 = node2
    this.data = data || null
  }
  Graph.Node = Node
  Graph.Edge = Edge
  Graph.fromMatrix = function (nodesData, matrix, directed) {
    if (
      !matrix ||
      !matrix.length ||
      matrix[0].length !== matrix.length ||
      nodesData.length !== matrix.length
    ) {
      return
    }
    const size = matrix.length
    const graph = new Graph(directed)
    for (var i = 0; i < size; i++) {
      const node = graph.addNode(nodesData[i].id, nodesData[i])
      node.data.value = 0
      if (directed) {
        node.data.outValue = node.data.inValue = 0
      }
    }
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        var item = matrix[i][j]
        if (directed) {
          graph.nodes[i].data.outValue += item
          graph.nodes[j].data.inValue += item
        }
        graph.nodes[i].data.value += item
        graph.nodes[j].data.value += item
      }
    }
    for (var i = 0; i < size; i++) {
      for (var j = i; j < size; j++) {
        var item = matrix[i][j]
        if (item === 0) {
          continue
        }
        const n1 = graph.nodes[i]
        const n2 = graph.nodes[j]
        const edge = graph.addEdge(n1, n2, {})
        edge.data.weight = item
        if (i !== j) {
          if (directed && matrix[j][i]) {
            const inEdge = graph.addEdge(n2, n1, {})
            inEdge.data.weight = matrix[j][i]
          }
        }
      }
    }
    return graph
  }
  return Graph
})
define('echarts/layout/Chord', ['require'], function (require) {
  const ChordLayout = function (opts) {
    opts = opts || {}
    this.sort = opts.sort || null
    this.sortSub = opts.sortSub || null
    this.padding = 0.05
    this.startAngle = opts.startAngle || 0
    this.clockWise = opts.clockWise == null ? false : opts.clockWise
    this.center = opts.center || [0, 0]
    this.directed = true
  }
  ChordLayout.prototype.run = function (graphs) {
    if (!(graphs instanceof Array)) {
      graphs = [graphs]
    }
    const gl = graphs.length
    if (!gl) {
      return
    }
    const graph0 = graphs[0]
    const nl = graph0.nodes.length
    const groups = []
    let sumSize = 0
    for (var i = 0; i < nl; i++) {
      const g0node = graph0.nodes[i]
      var group = {
        size: 0,
        subGroups: [],
        node: g0node
      }
      groups.push(group)
      let sumWeight = 0
      for (let k = 0; k < graphs.length; k++) {
        const graph = graphs[k]
        const node = graph.getNodeById(g0node.id)
        if (!node) {
          continue
        }
        group.size += node.layout.size
        const edges = this.directed ? node.outEdges : node.edges
        for (var j = 0; j < edges.length; j++) {
          const e = edges[j]
          const w = e.layout.weight
          group.subGroups.push({
            weight: w,
            edge: e,
            graph: graph
          })
          sumWeight += w
        }
      }
      sumSize += group.size
      var multiplier = group.size / sumWeight
      for (var j = 0; j < group.subGroups.length; j++) {
        group.subGroups[j].weight *= multiplier
      }
      if (this.sortSub === 'ascending') {
        group.subGroups.sort(compareSubGroups)
      } else if (this.sort === 'descending') {
        group.subGroups.sort(compareSubGroups)
        group.subGroups.reverse()
      }
    }
    if (this.sort === 'ascending') {
      groups.sort(compareGroups)
    } else if (this.sort === 'descending') {
      groups.sort(compareGroups)
      groups.reverse()
    }
    var multiplier = (Math.PI * 2 - this.padding * nl) / sumSize
    let angle = this.startAngle
    const sign = this.clockWise ? 1 : -1
    for (var i = 0; i < nl; i++) {
      var group = groups[i]
      group.node.layout.startAngle = angle
      group.node.layout.endAngle = angle + sign * group.size * multiplier
      group.node.layout.subGroups = []
      for (var j = 0; j < group.subGroups.length; j++) {
        const subGroup = group.subGroups[j]
        subGroup.edge.layout.startAngle = angle
        angle += sign * subGroup.weight * multiplier
        subGroup.edge.layout.endAngle = angle
      }
      angle = group.node.layout.endAngle + sign * this.padding
    }
  }
  var compareSubGroups = function (a, b) {
    return a.weight - b.weight
  }
  var compareGroups = function (a, b) {
    return a.size - b.size
  }
  return ChordLayout
})
