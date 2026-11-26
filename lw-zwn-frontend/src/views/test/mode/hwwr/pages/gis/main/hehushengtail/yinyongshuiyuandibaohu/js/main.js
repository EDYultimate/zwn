let mapwindowchange = false
//行政区图层
const renderLayer = null
let layer_dixiashui = null
let layer_hedao = null
let layer_shuiku = null
//标签图层
let info_dixiashui = null
let info_hedao = null
let info_shuiku = null
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
    'esri/tasks/FindTask',
    'esri/tasks/FindParameters',
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
    FindTask,
    FindParameters,
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
    GIS.FindTask = GIS.FindTask || FindTask
    GIS.FindParameters = GIS.FindParameters || FindParameters
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
    map.on('click', function (event) {
      if (!event.graphic) {
        locateLayer.clear()
      }
    })
    //map添加点击事件用于清除选中
    //map.on("click",hidePop);
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
    layer_dixiashui = new GIS.GraphicsLayer()
    map.addLayer(layer_dixiashui)
    //管理断面
    layer_hedao = new GIS.GraphicsLayer()
    map.addLayer(layer_hedao)
    //考核管理断面
    layer_shuiku = new GIS.GraphicsLayer()
    map.addLayer(layer_shuiku)
    //计算断面
    layer_jisuanduanmian = new GIS.GraphicsLayer()
    map.addLayer(layer_jisuanduanmian)
    //添加移上去事件
    layer_dixiashui.on('mouse-over', popGra)
    layer_dixiashui.on('mouse-out', hidePop)
    layer_dixiashui.on('click', clickHandler)
    layer_hedao.on('mouse-over', popGra2)
    layer_hedao.on('mouse-out', hidePop)
    layer_hedao.on('click', clickHandler)
    layer_shuiku.on('mouse-over', popGra)
    layer_shuiku.on('mouse-out', hidePop)
    layer_shuiku.on('click', clickHandler)
    info_dixiashui = new GIS.InfoLayerEx({ id: 'info_dixiashui', visible: true, map: map })
    info_hedao = new GIS.InfoLayerEx({ id: 'info_hedao', visible: true })
    info_shuiku = new GIS.InfoLayerEx({ id: 'info_shuiku', visible: true })
    info_pop = new GIS.InfoLayerEx({ id: 'info_pop', visible: true })
    map.addLayer(info_dixiashui)
    map.addLayer(info_hedao)
    map.addLayer(info_shuiku)
    map.addLayer(info_pop)
    locateLayer = new GIS.GraphicsLayer()
    map.addLayer(locateLayer)

    //初始化上报情况样式
    initStyle()

    $('#navigator_div').MapNavigator({ map: map, lods: GIS.config.lods })
    $('#mapswitch').MapSwitch(GIS.config.layers)
    const legendPra = {
      source: [
        { label: '水库水源地', img: 'img/shuiku.png', id: 'shuiku', checked: 'true' },
        { label: '地下水源地', img: 'img/dixiashui.png', id: 'dixiashui', checked: 'true' },
        { label: '河道水源地', img: 'img/hedao.png', id: 'hedao', checked: 'true' }
      ],
      width: 150,
      height: 260,
      picW: 14,
      picH: 14,
      handler: legendHandler
    }
    //console.log(111);
    $('#legendDiv').LegendBar(legendPra)
    //添加map load事件
    map.on('load', function () {
      getData()
    })
    //getData();
  })
}

function legendHandler(idx, check, data) {
  if (idx == 'dixiashui') {
    if (check == 'true') {
      info_dixiashui.setVisibility(true)
      layer_dixiashui.show()
    } else {
      info_dixiashui.setVisibility(false)
      layer_dixiashui.hide()
    }
  } else if (idx == 'hedao') {
    if (check == 'true') {
      info_hedao.setVisibility(true)
      layer_hedao.show()
    } else {
      info_hedao.setVisibility(false)
      layer_hedao.hide()
    }
  } else if (idx == 'shuiku') {
    if (check == 'true') {
      info_shuiku.setVisibility(true)
      layer_shuiku.show()
    } else {
      info_shuiku.setVisibility(false)
      layer_shuiku.hide()
    }
  }
}
loadScript([GIS.config.api_ip + '/3.15/init.js'], init)
