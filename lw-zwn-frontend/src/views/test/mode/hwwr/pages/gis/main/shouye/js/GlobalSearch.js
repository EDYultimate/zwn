//全局圈选搜索功能
//drawBar工具条绘制功能
/*绘制工具*/
let draw
function createDrawbar() {
  draw = new GIS.Draw(map)
  draw.on('draw-end', drawToMap)
}
//添加到map
function drawToMap(evt) {
  let symbol
  //清除上一次的画图内容
  map.graphics.clear()
  draw.deactivate()
  map.showZoomSlider()
  const geometry = evt.geometry
  switch (evt.geometry.type) {
    case 'point':
    case 'multipoint':
      symbol = new GIS.SimpleMarkerSymbol()
      break
    case 'polyline':
      symbol = new GIS.SimpleLineSymbol()
      break
    default:
      symbol = new GIS.SimpleFillSymbol()
      break
  }
  const graphic = new GIS.Graphic(evt.geometry, symbol)
  // map.graphics.add(graphic);
  //进行投影转换，完成后调用projectComplete
  IdentfyTask(geometry)
  //     sqlTask(geometry);  //临时注掉，暂用identify
}

/**
 *identify查询
 **/
function IdentfyTask(geometry) {
  identifyTask = new GIS.IdentifyTask(shouye.queryUrl)
  identifyParams = new GIS.IdentifyParameters()
  identifyParams.tolerance = 3
  identifyParams.returnGeometry = true
  //根据业务需求，周边搜索字段调控，格式:ags.gn.data[] geometry属性值之一
  identifyParams.layerIds = [0, 1] //泵站不用查询2016.08.17
  identifyParams.layerOption = GIS.IdentifyParameters.LAYER_OPTION_ALL
  identifyParams.width = map.width
  identifyParams.height = map.height
  identifyParams.geometry = geometry
  identifyParams.mapExtent = map.extent
  identifyTask.execute(identifyParams, identifyResults)
}
/**
 *identify查询结果
 *数组
 **/
function identifyResults(results) {
  $('#tree_Children').empty()
  identityResultLayer.clear() //清除上次查询结果
  const symbol = new GIS.SimpleMarkerSymbol(
    GIS.SimpleMarkerSymbol.STYLE_CIRCLE,
    12,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_NULL,
      new dojo.Color([247, 34, 101, 0.9]),
      1
    ),
    new dojo.Color([207, 34, 171, 0.5])
  )
  const lineSymbol = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_DASH,
    new esri.Color([247, 34, 101]),
    2
  )
  const polygonSymbol = new esri.symbol.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([247, 34, 101]), 2),
    new dojo.Color([207, 34, 171, 0.25])
  )
  for (let i = 0; i < results.length; i++) {
    const graphic = results[i].feature
    const type = graphic.geometry.type
    var locationGraphic
    switch (type) {
      case 'point':
        locationGraphic = new GIS.Graphic(GIS.geometry, symbol)
        break
      case 'polyline':
        locationGraphic = new GIS.Graphic(graphic.geometry, lineSymbol)
        break
      case 'polygon':
        locationGraphic = new GIS.Graphic(graphic.geometry, polygonSymbol)
        break
    }
    locationGraphic.attributes = graphic.attributes
    identityResultLayer.add(locationGraphic)
  }
  //查询结果添加到Tree
  mapToTree(results)
  //    console.log(results);
}
/**
 *identify查询结果
 **/
function identifyResult(result) {
  const symbol = new esri.symbol.SimpleMarkerSymbol(
    esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
    12,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_NULL,
      new dojo.Color([247, 34, 101, 0.9]),
      1
    ),
    new dojo.Color([207, 34, 171, 0.5])
  )
  const lineSymbol = new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_DASH,
    new esri.Color([247, 34, 101]),
    2
  )
  const polygonSymbol = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
      new dojo.Color([247, 34, 101]),
      2
    ),
    new dojo.Color([207, 34, 171, 0.25])
  )
  const feature = result.feature
  const layerName = result.layerName
  feature.attributes.layerName = layerName
  const type = result.feature.geometry.type
  let locationGraphic
  switch (type) {
    case 'point':
      locationGraphic = new esri.Graphic(result.feature.geometry, symbol)
      break
    case 'polyline':
      locationGraphic = new esri.Graphic(result.feature.geometry, lineSymbol)
      break
    case 'polygon':
      locationGraphic = new esri.Graphic(result.feature.geometry, polygonSymbol)
      break
  }
  locationGraphic.attributes = feature.attributes
  identityResultLayer.add(locationGraphic)
}
/**
 * 查询结果添加到Tree
 * @param evt
 */
function mapToTree(arrs) {
  const layerNamearr = []
  const paraags = []
  //获取所以根节点
  $.each(arrs, function (index, item) {
    const layername = item.layerName
    let ifequeal = false //meiyou layername
    $.each(layerNamearr, function (indexlayername, itemlayer) {
      if (itemlayer == layername) {
        ifequeal = true //已有layername
      }
    })
    if (!ifequeal) {
      layerNamearr.push(layername)
      ifequeal = false
    }
  })
  //	console.log(layerNamearr);
  //实例化所有子节点
  $.each(layerNamearr, function (indexl, iteml) {
    //遍历图层名称
    const rootnode = {}
    const rootchildren = []
    $.each(arrs, function (indexarr, itemarr) {
      rootnode.text = iteml
      //	rootnode.icon="../../main/shouye/img/layers.png";
      rootnode.state = { opened: true, selected: false }
      if (itemarr.layerName == iteml) {
        const childrensub = {}
        const feature = itemarr.feature
        childrensub.id = itemarr.layerId + '_' + feature.attributes.CD
        childrensub.text = feature.attributes.NAME
        rootchildren.push(childrensub)
      }
    })
    rootnode.children = rootchildren
    paraags.push(rootnode)
  })
  //	console.log(paraags);
  initialTree(paraags)
}
/**
 * 圈选
 */
function drawPolygon() {
  draw.activate(esri.toolbars.Draw.RECTANGLE)
  map.hideZoomSlider()
}
/**
 * 圈选搜索结果树关闭按钮
 */
$(function () {
  $('#layercontrol .close').click(function () {
    $('#layercontrol').css('display', 'none') //点击隐藏
    identityResultLayer.clear() //清除上次查询结果
  })
})
/**
 * 左侧列表单击定位
 * @param ags
 */
function locatPointd(ags) {
  identityResultLayer.clear()
  console.log('单击左侧列表定位')
  alert('ddd')
  console.log(ags)
  const stcd = 'STCD = ' + ags
  let queryTask
  /*    var startExtent = esri.geometry.Extent({"xmin":111.81288146862657,"ymin":35.6821341321215,"xmax":122.00672188129587,"ymax":42.859047510894186,
        "spatialReference":{"wkid":4214}});*/
  queryTask = new esri.tasks.QueryTask(shouye.zhuantiUrl + '/0')
  query = new esri.tasks.Query()
  query.outSpatialReference = map.spatialReference
  query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_CONTAINS
  query.returnGeometry = true
  query.outFields = ['*'] //["STCD","STNM"]; //["*"]
  query.where = stcd
  queryTask.execute(query, titResults)
}
function titResults(results) {
  const geometry = results.features[0].geometry
  findMarSym = new esri.symbol.PictureMarkerSymbol('img/find.gif', 20, 20)
  const locationGraphic = new esri.Graphic(geometry, findMarSym)
  identityResultLayer.add(locationGraphic)
  map.centerAndZoom(geometry, 10)
}
/**
 * 点击业务列表行定位
 * @param stcd
 */

function locatPoint(stcd) {
  locatLayer.clear()
  findMarSym = new esri.symbol.PictureMarkerSymbol('img/find.gif', 20, 20)
  const arr = identityResultLayer.graphics
  for (let i = 0; i < arr.length; i++) {
    if (stcd == arr[i].attributes.NAME) {
      locatLayer.clear()
      const graph = new GIS.Graphic(arr[i].geometry, findMarSym)
      graph.attributes = arr[i].attributes
      graph.setSymbol(findMarSym)
      locatLayer.add(graph)
      map.centerAndZoom(graph.geometry, 10).then(function () {
        //这个回调函数会在centerAndZoom方法执行后执行
        //showInfow(graph);
      })
      //			showInfow(graph);
    }
  }
}
/**
 * 点击业务表行弹窗
 * @param graphic
 */
function showInfow(graphic) {
  const evt = new Object()
  evt.graphic = graphic
  evt.mapPoint = graphic.geometry
  evt.screenPoint = map.toScreen(graphic.geometry)
  evt.mapPoint = graphic.geometry
  clickGraphicHandler(evt)
}
