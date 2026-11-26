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
//全局变量类型
let type1 = { dibiaoshui: 'true', dixiashui: 'true' }
let type2 = {
  0: 'true',
  1: 'true',
  2: 'true',
  3: 'true',
  4: 'true',
  5: 'true',
  6: 'true',
  7: 'true',
  8: 'true'
}
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
      center: [115.9087838803818, 40.8227142330573],
      spatialReference: { wkid: 4326 },
      zoom: 1
    })
    let levalmap = 2
    let point
    if (window.parent.innerHeight == 1366) {
      // 1366*768
      levalmap = 1
      point = new GIS.Point(
        [115.9655229354584, 37.99765529019865],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    } else if (window.parent.innerHeight == 1440) {
      // 1440*900
      levalmap = 1
      point = new GIS.Point(
        [117.8652766530082, 38.717680859840655],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    } else if (window.parent.innerHeight == 1600) {
      // 1600*900
      levalmap = 1
      point = new GIS.Point(
        [116.1522901134622, 38.39880617468311],
        new GIS.SpatialReference({ wkid: 4326 })
      )
    } else {
      levalmap = 1
      point = new GIS.Point(
        [115.9087838803818, 40.8227142330573],
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
    const zhuantiLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.config.zhuanti_url, {
      id: 'basemap'
    })
    //	zhuantiLayer.setVisibleLayers(GIS.config.visibleLayers);
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
    layer_kaoheduanmian.on('mouse-over', overGraphicHandler)
    layer_kaoheduanmian.on('mouse-out', outGraphicHandler)
    layer_kaoheduanmian.on('click', clickHandler)
    info_kaoheduanmian = new GIS.InfoLayerEx({ id: 'info_kaoheduanmian', visible: true, map: map })
    info_pop = new GIS.InfoLayerEx({ id: 'info_pop', visible: true })
    map.addLayer(info_kaoheduanmian)
    map.addLayer(info_pop)
    locateLayer = new GIS.GraphicsLayer()
    map.addLayer(locateLayer)
    //初始化上报情况样式
    initStyle()
    $('#navigator_div').MapNavigator({ map: map, lods: GIS.config.lods })
    //	$("#mapswitch").MapSwitch(GIS.config.layers);
    const legendPra1 = {
      source: [
        { label: '地表水', img: 'img/blank.png', id: 'dibiaoshui', checked: 'true' },
        { label: '地下水', img: 'img/blank.png', id: 'dixiashui', checked: 'true' }
      ],
      width: 150,
      height: 260,
      picW: 14,
      picH: 14,
      title: '水源类型',
      handler: legendHandler1
    }
    const legendPra2 = {
      source: [
        { label: '生活用水', img: 'img/blank.png', id: '1', checked: 'true' },
        { label: '工业用水', img: 'img/blank.png', id: '2', checked: 'true' },
        { label: '电力生产用水', img: 'img/blank.png', id: '3', checked: 'true' },
        { label: '河道内-水力发电', img: 'img/blank.png', id: '4', checked: 'true' },
        { label: '原水供水', img: 'img/blank.png', id: '5', checked: 'true' },
        { label: '水力发电', img: 'img/blank.png', id: '6', checked: 'true' },
        { label: '农业生产', img: 'img/blank.png', id: '7', checked: 'true' },
        { label: '农田灌溉用水', img: 'img/blank.png', id: '8', checked: 'true' },
        { label: '制水供水', img: 'img/blank.png', id: '0', checked: 'true' }
      ],
      width: 180,
      height: 260,
      picW: 14,
      picH: 14,
      title: '取水用途',
      handler: legendHandler2
    }
    //console.log(111);
    $('#legendDiv1').LegendBar(legendPra1)
    $('#legendDiv2').LegendBar(legendPra2)
    //添加map load事件
    map.on('load', function () {
      getData(type1, type2)
    })
    //getData(type1,type2);
  })
}

function legendHandler1(idx, check, data) {
  type1 = data
  getData(type1, type2)
  console.log(idx)
  console.log(check)
  console.log(data)
}
function legendHandler2(idx, check, data) {
  type2 = data
  getData(type1, type2)
  console.log(idx)
  console.log(check)
  console.log(data)
}
/**
 * 给个图层添加移上去显示名称
 */
function overGraphicHandler(event) {
  const gra = event.graphic
  const name = gra.attributes.STNM
  const w = GIS.getByteSize(name)
  const x = event.layerX
  const y = event.layerY
  $('#nameLabel')
    .css({
      left: x + 10 + 'px',
      top: y + 10 + 'px',
      width: w * 8 + 'px'
    })
    .text(name)
  $('#nameLabel').show()
  map.setMapCursor('pointer')
}
function outGraphicHandler() {
  $('#nameLabel').hide()
  map.setMapCursor('default')
}
function clickHandler(event) {
  const gra = event.graphic
  //	var attr=JSON.stringify(gra.attributes);
  //alert(attr);
  console.log(gra.attributes)
  parent.openMapFun(gra.attributes)
}
loadScript([GIS.config.api_ip + '/3.15/init.js'], init)
