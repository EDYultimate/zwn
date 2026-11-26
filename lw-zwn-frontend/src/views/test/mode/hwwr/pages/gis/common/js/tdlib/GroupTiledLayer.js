define([
  'dojo/_base/declare',
  'esri/SpatialReference',
  'esri/geometry/Extent',
  'tdlib/customTiledLyr',
  'esri/layers/TiledMapServiceLayer',
  'esri/layers/TileInfo'
], function (declare, SpatialReference, Extent, CustomTileLyr, TiledMapServiceLayer, TileInfo) {
  return declare('GroupTiledLayer', TiledMapServiceLayer, {
    constructor: function (baseUrl, initLayerName, options) {
      this.baseUrl = baseUrl
      this.url = baseUrl + '/layers/' + initLayerName
      //获取服务名
      this.serverName = baseUrl.slice(baseUrl.lastIndexOf('/') + 1)
      this.initLayerName = initLayerName
      this.tempLayers = []
      this.visibleLayers = [initLayerName]
      this.firstSetVisibleLayer = false
      loadScript([baseUrl + '/config.js'], this.initFirstLayer.bind(this))
    },
    //初始化第一个图层
    initFirstLayer: function () {
      this.config = window['config_' + this.serverName]
      this.layers = this.config.layers
      this.spatialReference = new SpatialReference(this.config.spatialReference)
      this.fullExtent = new Extent(this.config.fullExtent)
      this.initialExtent = new Extent(this.config.initialExtent)
      this.tileInfo = new TileInfo(this.config.tileInfo)
      this.loaded = true
      this.onLoad(this)
      this.configLoaded = true
      if (this.setMapEd && !this.createTileLayersEd) {
        this.createTileLayers()
      }
    },
    _setMap: function (t, i, s, n) {
      if (this.configLoaded && !this.createTileLayersEd) {
        this.createTileLayers()
      }
      this.setMapEd = true //设置完map
      return this.inherited(arguments)
    },
    createTileLayers: function () {
      this.createTileLayersEd = true
      const map = this.getMap()
      for (let i = this.layers.length - 1; i > -1; i--) {
        const layer = this.layers[i]
        const url = this.baseUrl + '/layers/' + layer.id
        this.layers[i].layer = new CustomTileLyr(url, {
          spatialReference: this.spatialReference,
          tileInfo: this.tileInfo,
          fullExtent: this.fullExtent,
          initialExtent: this.initialExtent
        })
        this.layers[i].layer.hide()
        map.addLayer(this.layers[i].layer)
      }
      this.layers.push({
        id: this.layers.length,
        layer: this
      })
      //判断是否初始化设置图层可见性
      if (this.firstSetVisibleLayer) {
        this.setVisibleLayers(this.visibleLayers)
      }
    },
    //设置可见图层
    setVisibleLayers: function (visibleLayers) {
      if (!this.createTileLayersEd) {
        //  visibleLayers=[(this.this.layers-1)];
        this.visibleLayers = visibleLayers || []
        this.firstSetVisibleLayer = true
        return
      }
      visibleLayers = visibleLayers || []
      visibleLayers = visibleLayers.join(',').split(',')
      this.visibleLayers = visibleLayers
      for (let j = 0; j < this.layers.length; j++) {
        const layerid = this.layers[j].id + ''
        if (visibleLayers.indexOf(layerid) != -1) {
          this.layers[j].layer.show()
        } else {
          this.layers[j].layer.hide()
        }
      }
    },
    showLayers: function () {
      if (this.tempLayers) {
        this.setVisibleLayers(this.tempLayers)
      }
      this.tempLayers = null
    },
    hideLayers: function () {
      this.tempLayers = this.visibleLayers
      this.setVisibleLayers([])
    },
    //获取可见图层
    getVisibleLayers: function () {
      return this.visibleLayers
    },
    getTileUrl: function (level, row, col) {
      return (
        this.url +
        '/_alllayers/' +
        'L' +
        dojo.string.pad(level, 2, '0') +
        '/' +
        'R' +
        dojo.string.pad(row.toString(16), 8, '0') +
        '/' +
        'C' +
        dojo.string.pad(col.toString(16), 8, '0') +
        '.' +
        'png'
      )
    }
  })
})
