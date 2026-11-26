/**
 * Description:实现客户端测量距离和面积的功能
 * version: 1.0.0
 */
define([
  'dojo/dom',
  'dojo/query',
  'esri/geometry/Extent',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dijit/_WidgetBase',
  'dojo/on',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/toolbars/draw',
  'esri/Color',
  'esri/symbols/Font',
  'esri/geometry/Polyline',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/TextSymbol',
  'esri/geometry/geometryEngine'
], function (
  dom,
  query,
  Extent,
  declare,
  lang,
  _WidgetBase,
  on,
  Graphic,
  GraphicsLayer,
  Draw,
  Color,
  Font,
  Polyline,
  MarkerSymbol,
  LineSymbol,
  TextSymbol,
  geometryEngine
) {
  const measureTools = declare(_WidgetBase, {
    declaredClass: 'measure.measuretools',
    defaults: {
      map: null,
      lineSymbol: new LineSymbol(LineSymbol.STYLE_SOLID, new Color('#FFA500')),
      markerSymbol: new MarkerSymbol(
        MarkerSymbol.STYLE_CIRCLE,
        10,
        new LineSymbol(LineSymbol.STYLE_SOLID, new Color('#DC143C'), 2),
        new Color('#FFA500')
      )
    },
    srcRefNode: null,
    toolbar: null,
    selfitem: null,
    _stopPoints: null,
    _stopDistances: null,
    _measureLayer: null,
    _mapMousemove: null, //用于取消地图鼠标事件
    _mapClickFlag: null, // 用于取消地图click事件
    clearMap: function () {
      selfitem.clearAll()
    },
    initialMeasureLine: function () {
      selfitem._startMeasureDistance()
    }, //用于初始化测距
    initialMeasureArea: function () {
      selfitem._startMeasureArea()
    }, //用于初始化测距，
    constructor: function (options, srcRefNode) {
      declare.safeMixin(this.defaults, options)
      this.srcRefNode = srcRefNode
      this._measureLayer = new GraphicsLayer()
      this.defaults.map.addLayer(this._measureLayer)
      this._initalToolbar()
      this._initialMeasureLayer()
      selfitem = this
    },

    //初始化测量图层事件
    _initialMeasureLayer: function () {
      this._measureLayer.on(
        'mouse-over',
        lang.hitch(this, function (evt) {
          const graphic = evt.graphic
          if (graphic.symbol.isClearBtn) {
            this.defaults.map.setMapCursor('pointer')
            on.once(
              graphic.getShape(),
              'click',
              lang.hitch(this, function () {
                this._measureLayer.clear()
                this.defaults.map.setMapCursor('default')
              })
            )
          }
        })
      )
      this._measureLayer.on(
        'mouse-out',
        lang.hitch(this, function (evt) {
          const graphic = evt.graphic
          if (graphic.symbol.isClearBtn) {
            this.defaults.map.setMapCursor('default')
          }
        })
      )
    },

    //初始化绘制工具条
    _initalToolbar: function () {
      const map = this.defaults.map
      this.toolbar = new Draw(map, { showTooltips: false })
      this.toolbar.on('draw-complete', lang.hitch(this, this._drawComplete))
      //			query("#" + this.srcRefNode + " > .measure-distance").on("click", lang.hitch(this, this._startMeasureDistance));
      //			query("#" + this.srcRefNode + " > .measure-area").on("click", lang.hitch(this, this._startMeasureArea));
    },

    //结束绘制
    _drawComplete: function (evt) {
      if (evt.geometry.type == 'polygon') {
        this._endMeasureArea(evt.geometry)
      } else {
        const endPoint = this._stopPoints[this._stopPoints.length - 1]
        this._endMeasureDistance(evt.geometry, endPoint)
      }
      this._clearMapMouseClickEvent()
      this.defaults.map.setMapCursor('default')
      this.toolbar.deactivate()
    },
    //开始测量距离
    _startMeasureDistance: function () {
      this.defaults.map.setMapCursor('crosshair')
      // this._clearMapMouseClickEvent();
      this._stopPoints = []
      this._stopDistances = []
      this._measureLayer.clear()
      this.toolbar.deactivate()
      this.toolbar.activate(Draw.POLYLINE)
      const rootenode = this.srcRefNode
      const stopPoints = this._stopPoints
      const stopDistances = this._stopDistances
      const self = this
      const mousemoveLabel =
        "<div class='mousemeasureLabel' style='width:auto;background: #ffffff none repeat scroll 0 0;min-width: 125px; border: 1px solid #eb2332;position: absolute;'>" +
        "<span class='firstlabel' style=' font-size: 14px;padding-left: 5px; padding-right: 3px;'>总长:" +
        '</span>' +
        "<span class='measuretool_value' style='font-size:12px;color:#cf4626'>0" +
        '</span>' +
        /*		"<span class='measuretool_unit' style='font-size:14px;color:#000;padding-left: 3px;padding-right:3px'>km" +
					"</span>"+*/
        "<div class='secondlabel' style='color: #777777;font-size: 12px; padding-left: 5px; padding-right: 5px;'>单击确定、双击结束" +
        '</div>' +
        '</div>'

      $('body').append(mousemoveLabel)
      ;((this._mapMousemove = this.defaults.map.on('mouse-move', function (evt) {
        let distancefix = 0 //之前测好的距离
        let distancetime = 0 //鼠标移动位置与上一次单击过的距离
        let distance = 0 //总距离
        const mousemovePoint = evt.mapPoint
        const screenPoint = self.defaults.map.toScreen(mousemovePoint)
        const pagewidth = $(document).width()
        const pageheight = $(document).height()
        //				console.log(screenPoint.x+'xxxx');
        if (screenPoint.x < 10) {
          self._controlExtent('left')
          console.log('left')
        } else if (pagewidth - screenPoint.x < 158) {
          self._controlExtent('right')
          console.log('right')
        } else if (pageheight - screenPoint.y < 50) {
          self._controlExtent('bottom')
          console.log('bottom')
        } else if (screenPoint.y < 28) {
          self._controlExtent('top')
          console.log('top')
        }
        $('.mousemeasureLabel').css({
          left: screenPoint.x + 30,
          top: screenPoint.y + 10,
          width: 'auto'
        })
        if (self._stopDistances.length > 0) {
          distancefix = self._stopDistances[self._stopDistances.length - 1]
        }
        if (stopPoints.length > 0) {
          const startPoint = stopPoints[stopPoints.length - 1]
          distancetime = self._calDistance(startPoint, mousemovePoint)
        }
        distance = distancefix + distancetime
        if (distance > 0 && distance >= 1000) {
          $('.measuretool_value').text((distance / 1000).toFixed(2) + '公里')
        } else if (distance > 0 && distance < 1000) {
          $('.measuretool_value').text(distance.toFixed(2) + '米')
        }
      })),
        (this._mapClickFlag = this.defaults.map.on('click', function (evt) {
          let distance = 0
          const stopPoint = evt.mapPoint
          if (stopPoints.length > 0) {
            const startPoint = stopPoints[stopPoints.length - 1]
            distance = self._calDistance(startPoint, stopPoint)
            if (self._stopDistances.length > 0) {
              distance += self._stopDistances[self._stopDistances.length - 1]
            }
            stopDistances.push(distance)
          }
          stopPoints.push(stopPoint)
          const stopGraphic = new Graphic(stopPoint, self.defaults.markerSymbol)
          const textGraphic = self._getStopPointGraphic(stopPoint, distance)
          self._measureLayer.add(stopGraphic)
          self._measureLayer.add(textGraphic)
        })))
    },

    //测量距离结束，添加清除按钮、测量线段
    _endMeasureDistance: function (line, endPoint) {
      const lineGraphic = new Graphic(line, this.toolbar.lineSymbol)
      const clearGraphic = this._createClearBtn(endPoint)

      this._measureLayer.add(clearGraphic)
      this._measureLayer.add(lineGraphic)
      lineGraphic.getDojoShape().moveToBack()
      // this._clearMapMouseClickEvent();
    },
    //获取测量点的Graphics
    _getStopPointGraphic: function (stopPoint, distance) {
      let textSymbol = this._createTextSymbol('起点')
      if (distance > 0 && distance >= 1000) {
        textSymbol = textSymbol.setText((distance / 1000).toFixed(2) + '公里')
      } else if (distance > 0 && distance < 1000) {
        textSymbol = textSymbol.setText(distance.toFixed() + '米')
      }
      return new Graphic(stopPoint, textSymbol)
    },
    //计算距离
    _calDistance: function (point1, point2) {
      const line = new Polyline(this.defaults.map.spatialReference)
      line.addPath([point1, point2])
      if (
        this.defaults.map.spatialReference.isWebMercator() ||
        this.defaults.map.spatialReference.wkid == '4326'
      ) {
        //在web麦卡托投影和WGS84坐标系下的计算方法
        return geometryEngine.geodesicLength(line, 'meters')
      } //在其他投影坐标系下的计算方法
      return geometryEngine.planarLength(line, 'meters')
    },
    //控制地图范围变化
    _controlExtent: function (direction) {
      const mapextent = this.defaults.map.extent
      const xmin = mapextent.xmin
      const xmax = mapextent.xmax
      const ymin = mapextent.ymin
      const ymax = mapextent.ymax
      const extentnew = new Extent()
      const tolerance_measure_x = (xmax - xmin) / 20
      const tolerance_measure_y = (ymax - ymin) / 15
      switch (direction) {
        case 'top':
          extentnew.ymin = ymin + tolerance_measure_y
          extentnew.ymax = ymax + tolerance_measure_y
          extentnew.xmax = xmax
          extentnew.xmin = xmin
          break
        case 'bottom':
          extentnew.ymin = ymin - tolerance_measure_y
          extentnew.ymax = ymax - tolerance_measure_y
          extentnew.xmax = xmax
          extentnew.xmin = xmin
          break
        case 'left':
          extentnew.xmin = xmin - tolerance_measure_x
          extentnew.xmax = xmax - tolerance_measure_x
          extentnew.ymin = ymin
          extentnew.ymax = ymax
          break
        case 'right':
          extentnew.xmin = xmin + tolerance_measure_x
          extentnew.xmax = xmax + tolerance_measure_x
          extentnew.ymin = ymin
          extentnew.ymax = ymax
          break
      }
      this.defaults.map.setExtent(extentnew)
    },
    //开始测量面积
    _startMeasureArea: function () {
      // this._clearMapMouseClickEvent();
      this.defaults.map.setMapCursor('crosshair')
      this._measureLayer.clear()
      this.toolbar.deactivate()
      this.toolbar.activate(Draw.POLYGON)
      //添加鼠标事件
      this._mapMousemove = this.defaults.map.on('mouse-move', function (evt) {
        const distancefix = 0 //之前测好的距离
        const distancetime = 0 //鼠标移动位置与上一次单击过的距离
        const distance = 0 //总距离
        const mousemovePoint = evt.mapPoint
        const screenPoint = self.defaults.map.toScreen(mousemovePoint)
        const pagewidth = $(document).width()
        const pageheight = $(document).height()
        //				console.log(screenPoint.x+'xxxx');
        if (screenPoint.x < 10) {
          self._controlExtent('left')
          console.log('left')
        } else if (pagewidth - screenPoint.x < 158) {
          self._controlExtent('right')
          console.log('right')
        } else if (pageheight - screenPoint.y < 50) {
          self._controlExtent('bottom')
          console.log('bottom')
        } else if (screenPoint.y < 10) {
          self._controlExtent('top')
          console.log('top')
        }
      })
      //添加单击点
      var self = this
      this._mapClickFlag = this.defaults.map.on('click', function (evt) {
        const stopPoint = evt.mapPoint
        const stopGraphic = new Graphic(stopPoint, self.defaults.markerSymbol)
        self._measureLayer.add(stopGraphic)
      })
    },

    //测量面积结束，添加清除按钮、测量结果
    _endMeasureArea: function (polygon) {
      let area = this._calArea(polygon)
      if (area > 1000000) {
        area = (area / 1000000).toFixed(2) + '平方千米'
      } else {
        area = area.toFixed(2) + '平方米'
      }
      const center = polygon.getCentroid()
      const ploygonGraphic = new Graphic(polygon, this.toolbar.fillSymbol)
      const textSymbol = this._createTextSymbol(area)
      textSymbol.setOffset(-10, 10)
      const textGraphic = new Graphic(center, textSymbol)
      const clearBtn = this._createClearBtn(center)

      this._measureLayer.add(ploygonGraphic)
      this._measureLayer.add(textGraphic)
      this._measureLayer.add(clearBtn)
      ploygonGraphic.getDojoShape().moveToBack()
      //this._clearMapMouseClickEvent();
    },
    //计算面积
    _calArea: function (polygon) {
      const spatialReference = this.defaults.map.spatialReference
      if (spatialReference.isWebMercator() || spatialReference.wkid == '4326') {
        return geometryEngine.geodesicArea(polygon, 'square-meters')
      }
      return geometryEngine.planarArea(polygon, 'square-meters')
    },

    _createClearBtn: function (point) {
      const iconPath =
        'M13.618,2.397 C10.513,-0.708 5.482,-0.713 2.383,2.386 C-0.718,5.488 -0.715,10.517 2.392,13.622 C5.497,16.727 10.529,16.731 13.627,13.632 C16.727,10.533 16.724,5.502 13.618,2.397 L13.618,2.397 Z M9.615,11.351 L7.927,9.663 L6.239,11.351 C5.55,12.04 5.032,12.64 4.21,11.819 C3.39,10.998 3.987,10.48 4.679,9.79 L6.367,8.103 L4.679,6.415 C3.989,5.726 3.39,5.208 4.21,4.386 C5.032,3.566 5.55,4.165 6.239,4.855 L7.927,6.541 L9.615,4.855 C10.305,4.166 10.82,3.565 11.642,4.386 C12.464,5.208 11.865,5.726 11.175,6.415 L9.487,8.102 L11.175,9.789 C11.864,10.48 12.464,10.998 11.642,11.819 C10.822,12.64 10.305,12.04 9.615,11.351 L9.615,11.351 Z'
      const iconColor = '#b81b1b'
      const clearSymbol = new MarkerSymbol()
      clearSymbol.setOffset(65, 15)
      clearSymbol.setPath(iconPath)
      clearSymbol.setColor(new Color(iconColor))
      clearSymbol.setOutline(null)
      clearSymbol.isClearBtn = true
      return Graphic(point, clearSymbol)
    },

    _createTextSymbol: function (text) {
      const fontColor = new Color('#696969')
      const holoColor = new Color('#fff')
      const font = new Font(
        '10pt',
        Font.STYLE_ITALIC,
        Font.VARIANT_NORMAL,
        Font.WEIGHT_BOLD,
        'Courier'
      )
      const textSymbol = new TextSymbol(text, font, fontColor)
      textSymbol.setOffset(10, 10).setHaloColor(holoColor).setHaloSize(2)
      textSymbol.setAlign(TextSymbol.ALIGN_MIDDLE)
      return textSymbol
    },

    _clearMapMouseClickEvent: function () {
      if (this.toolbar != null) {
        this.toolbar.deactivate()
        this.defaults.map.setMapCursor('default')
      }
      //			if(this._measureLayer!=null){
      //			this.defaults.map.removeLayer(this._measureLayer);
      //			}
      if (this._mapClickFlag != null) {
        this._mapClickFlag.remove()
        if (this._mapMousemove != null) {
          this._mapMousemove.remove()
        }
        $('.mousemeasureLabel').remove()
      }
    },
    clearAll: function () {
      if (this.toolbar != null) {
        this.toolbar.deactivate()
        this.defaults.map.setMapCursor('default')
      }
      if (this._measureLayer != null) {
        this._measureLayer.clear()
      }
      if (this._mapClickFlag != null) {
        this._mapClickFlag.remove()
        if (this._mapMousemove != null) {
          this._mapMousemove.remove()
        }
        $('.mousemeasureLabel').remove()
      }
    }
  })

  return measureTools
})
