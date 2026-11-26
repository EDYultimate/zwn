define([
  'dojo/_base/declare',
  'esri/layers/GraphicsLayer',
  'esri/geometry/Point',
  'esri/graphic'
], function (declare, GraphicsLayer, Point, Graphic) {
  return declare([GraphicsLayer], {
    layerContainer: null,
    winArr: [],
    constructor: function (options) {
      this._id = options.id || ''
    },
    //刷新
    _refresh: function (graphic) {
      const wins = this.winArr
      let len = wins.length,
        i
      for (i = 0; i < len; i++) {
        const win = wins[i]
        const spt = this._map.toScreen(win.gra.geometry)
        win.setPosition(spt.x, spt.y)
      }
      if (this.visible) {
        this.show()
      }
    },
    refresh: function () {
      this._refresh(!0)
    },
    //显示
    show: function () {
      if (this.visible) {
        this.layerContainer.show()
      }
    },
    //隐藏
    hide: function () {
      this.layerContainer.hide()
    },
    //拖拽

    _onPanStartHandler: function () {
      this.hide()
    },
    //缩放
    _onZoomStartHandler: function () {
      this.hide()
    },
    _onPanHandler: function () {
      this.hide()
    },
    _setMap: function (map, surface) {
      const div = this.inherited(arguments)
      this.layerContainer = $('<div></div>').attr('id', this._id)
      //$(map._layersDiv).append(this.layerContainer);
      $('#' + $(map._layersDiv).attr('id').split('_')[0]).append(this.layerContainer)
      return div
    },
    clear: function (a, c) {
      //	 this.inherited(a,c);
      this.winArr = []
      this.graphics = []
      this.layerContainer.empty()
    },
    _draw: function (graphic, redraw) {
      //     	if(this._params.drawMode && this._map && !this.suspended)
      //        	try{
      const c = graphic._extent
      //          if (graphic.visible && c && (d = this._intersects(this._map, c, graphic.geometry._originOnly))) {
      const spt = this._map.toScreen(graphic.geometry)
      const attr = graphic.attributes
      const infoWindow = new GIS.InfoWindowEx(
        spt.x,
        spt.y,
        graphic,
        graphic.attributes.winW,
        graphic.attributes.winH,
        graphic.attributes.pos,
        graphic.attributes.aw,
        graphic.attributes.sw,
        attr.data,
        this._map,
        attr.backcolor,
        attr.ax,
        attr.ay,
        attr.radius,
        attr.strokecolor
      )
      infoWindow.setContent(graphic.attributes.content)
      infoWindow.placeAt(this.layerContainer[0])
      infoWindow.setPosition(this._map.toScreen(graphic.geometry))
      this.winArr.push(infoWindow)
      //              }

      //        	}
      //        	catch(X) {
      //                this._errorHandler(X, graphic);
      //            }
      if (!this._map) {
        return
      }
      if (graphic instanceof Graphic) //判断graphic是否为MapChartGraphic类型
      {
        this._drawInfo(graphic, redraw)
      }
    },
    // 绘制标签
    _drawInfo: function (graphic, redraw) {
      //        	console.log(this.graphics);
    },
    //设置可见性
    setVisibility: function (visible) {
      if (visible) {
        this.show()
      } else {
        this.hide()
      }
      this.inherited(arguments)
    }
  })
})
