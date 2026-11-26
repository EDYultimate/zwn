let mapwindowchange = false
//行政区图层
let renderLayer = null
//map对象
let map = null
window.onresize = function () {
  mapwindowchange = true
}
const info_pop = null
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
    'esri/tasks/query',
    'esri/tasks/QueryTask',
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
    Query,
    QueryTask,
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
    GIS.Query = GIS.Query || Query
    GIS.QueryTask = GIS.QueryTask || QueryTask
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
    renderLayer = new GIS.GraphicsLayer()
    map.addLayer(renderLayer)
    //初始化上报情况样式
    $('#navigator_div').MapNavigator({ map: map, lods: GIS.config.lods })
    $('#mapswitch').MapSwitch(GIS.config.layers)
    const legendPra = {
      width: 204,
      height: 154,
      picW: 14,
      picH: 14,
      titleStr: '图例',
      handler: null
    }
    $('#numberLegend').LegendBar7(legendPra)
    //添加map load事件
    map.on('load', function () {
      parent.readyCall()
      //getData();
    })
  })
}

loadScript([GIS.config.api_ip + '/3.15/init.js'], init)
