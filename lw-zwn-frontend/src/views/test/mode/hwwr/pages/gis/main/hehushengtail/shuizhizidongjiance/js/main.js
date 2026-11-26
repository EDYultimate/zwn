let mapwindowchange = false
//行政区图层
const renderLayer = null
let layer_kaoheduanmian = null
//标签图层
let info_kaoheduanmian = null
let info_pop = null
//定位图层
let locateLayer = null
//map对象
let map = null
window.onresize = function () {
  mapwindowchange = true
}

/**
 * 业务回调函数
 * @param data
 */
function returnGisData(data) {
  console.log('11111111111')
  console.log(data)
  applayValue(data)
}

//初始化
function init() {
  require([
    'Measure/measuretools',
    'esri/graphic',
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    'tdlib/TDTLayer',
    'esri/config',
    'esri/geometry/Point',
    'esri/Color',
    'esri/symbols/PictureMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/map',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/geometry/Extent',
    'esri/SpatialReference',
    'dojo/dom',
    'dojo/on',
    'dojo/dom-class',
    'tdlib/TDTimage',
    'tdlib/TDTDemLayer',
    'tdlib/GroupTiledLayer',
    'layer/infoLayer/InfoLayer',
    'layer/infoWindow/InfoWindow',
    'dojo/domReady!'
  ], function (
    measuretools,
    Graphic,
    GraphicsLayer,
    FeatureLayer,
    TDTLayer,
    esriConfig,
    Point,
    Color,
    PictureMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Map,
    ArcGISTiledMapServiceLayer,
    ArcGISDynamicMapServiceLayer,
    Extent,
    SpatialReference,
    dom,
    on,
    domClass,
    TDTimage,
    TDTDemLayer,
    GroupTiledLayer,
    InfoLayerEx,
    InfoWindowEx
  ) {
    GIS.Measuretool = GIS.Measuretool || measuretools
    GIS.Map = GIS.Map || Map
    GIS.InfoLayerEx = GIS.InfoLayerEx || InfoLayerEx
    GIS.InfoWindowEx = GIS.InfoWindowEx || InfoWindowEx
    GIS.FeatureLayer = GIS.FeatureLayer || FeatureLayer
    GIS.TDTLayer = GIS.TDTLayer || TDTLayer
    GIS.Point = GIS.Point || Point
    GIS.Color = GIS.Color || Color
    GIS.SimpleLineSymbol = GIS.SimpleLineSymbol || SimpleLineSymbol
    GIS.SimpleFillSymbol = GIS.SimpleFillSymbol || SimpleFillSymbol
    GIS.PictureMarkerSymbol = GIS.PictureMarkerSymbol || PictureMarkerSymbol
    GIS.ArcGISTiledMapServiceLayer = GIS.ArcGISTiledMapServiceLayer || ArcGISTiledMapServiceLayer
    GIS.ArcGISDynamicMapServiceLayer =
      GIS.ArcGISDynamicMapServiceLayer || ArcGISDynamicMapServiceLayer
    GIS.Extent = GIS.Extent || Extent
    GIS.SpatialReference = GIS.SpatialReference || SpatialReference
    GIS.TDTimage = TDTimage
    GIS.TDTDemLayer = TDTDemLayer
    GIS.GraphicsLayer = GIS.GraphicsLayer || GraphicsLayer
    GIS.Graphic = GIS.Graphic || Graphic
    map = new GIS.Map('mapdiv', {
      logo: false,
      lods: GIS.config.lods,
      slider: false,
      center: [116.51483816488138, 37.52883380046371],
      spatialReference: { wkid: 4326 },
      zoom: 0
    })
    let levalmap = 2
    let point
    if (window.parent.innerHeight == 1366) {
      // 1366*768
      levalmap = 0
      point = new GIS.Point(
        [115.9655229354584, 37.99765529019865],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    } else if (window.parent.innerHeight == 1440) {
      // 1440*900
      levalmap = 0
      point = new GIS.Point(
        [117.8652766530082, 38.717680859840655],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    } else if (window.parent.innerHeight == 1600) {
      // 1600*900
      levalmap = 0
      point = new GIS.Point(
        [116.1522901134622, 38.39880617468311],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    } else {
      levalmap = 0
      point = new GIS.Point(
        [116.0424270675776, 38.742066622459916],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    }
    map.centerAndZoom(point, levalmap)
    map.centerpoint = point
    map.centerlevel = levalmap
    map.on('extent-change', function () {
      if (typeof changeSymFromextent === 'function') {
        changeSymFromextent()
      }
      if (mapwindowchange) {
        map.centerAndZoom(map.centerpoint, map.centerlevel)
        mapwindowchange = false
      }
    })
    const zhuantiLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.config.zhuanti_url, {
      id: 'basemap'
    })
    zhuantiLayer.setVisibleLayers(GIS.config.visibleLayers)
    map.addLayer(zhuantiLayer)
    //加载天地图地形
    const tdtDX = GIS.TDTDemLayer({ id: 'tdtdixing', visible: false })
    map.addLayer(tdtDX)
    //加载天地图影像
    const tdtYX = new GIS.TDTimage({ id: 'tdtyingxiang', visible: false })
    map.addLayer(tdtYX)
    //基础底图

    //			var group=new GroupTiledLayer(GIS.config.zhuanti_url,"shangbao");
    //			group.id="basemap";
    //			map.addLayer(group);
    //考核断面图层
    layer_kaoheduanmian = new GIS.GraphicsLayer()
    map.addLayer(layer_kaoheduanmian)
    //添加移上去事件
    layer_kaoheduanmian.on('mouse-over', popGra)
    layer_kaoheduanmian.on('mouse-out', hidePop)
    info_kaoheduanmian = new GIS.InfoLayerEx({ id: 'info_kaoheduanmian', visible: true, map: map })
    info_pop = new GIS.InfoLayerEx({ id: 'info_pop', visible: true })
    map.addLayer(info_kaoheduanmian)
    map.addLayer(info_pop)
    locateLayer = new GIS.GraphicsLayer()
    map.addLayer(locateLayer)

    //初始化上报情况样式
    initStyle()

    $('#navigator_div').MapNavigator({ map: map, lods: GIS.config.lods })
    $('#mapswitch').MapSwitch(GIS.config.layers)
    const legendPra = {
      source: [
        { label: '考核断面', img: 'img/kaohezhan.png', id: 'kaoheduanmian', checked: 'true' },
        { label: '管理断面', img: 'img/guanlizhan.png', id: 'guanliduanmian', checked: 'true' },
        {
          label: '考核/管理断面',
          img: 'img/kaoheguanlizhan.png',
          id: 'kaoheguanliduanmian',
          checked: 'true'
        },
        { label: '计算断面', img: 'img/jisuanzhan.png', id: 'jisuanduanmian', checked: 'true' }
      ],
      width: 150,
      height: 260,
      picW: 14,
      picH: 14,
      handler: legendHandler
    }
    //console.log(111);
    //	$("#legendDiv").LegendBar(legendPra);
    //添加map load事件
    map.on('load', function () {
      getData()
    })
    //getData();
  })
}

function legendHandler(idx, check, data) {
  if (idx == 'kaoheduanmian') {
    if (check == 'true') {
      info_kaoheduanmian.setVisibility(true)
      layer_kaoheduanmian.show()
    } else {
      info_kaoheduanmian.setVisibility(false)
      layer_kaoheduanmian.hide()
    }
  } else if (idx == 'guanliduanmian') {
    if (check == 'true') {
      info_guanliduanmian.setVisibility(true)
      layer_guanliduanmian.show()
    } else {
      info_guanliduanmian.setVisibility(false)
      layer_guanliduanmian.hide()
    }
  } else if (idx == 'kaoheguanliduanmian') {
    if (check == 'true') {
      info_kaoheguanliduanmian.setVisibility(true)
      layer_kaoheguanliduanmian.show()
    } else {
      info_kaoheguanliduanmian.setVisibility(false)
      layer_kaoheguanliduanmian.hide()
    }
  } else if (idx == 'jisuanduanmian') {
    if (check == 'true') {
      info_jisuanduanmian.setVisibility(true)
      layer_jisuanduanmian.show()
    } else {
      info_jisuanduanmian.setVisibility(false)
      layer_jisuanduanmian.hide()
    }
  }
}
loadScript([GIS.config.api_ip + '/3.15/init.js'], init)
