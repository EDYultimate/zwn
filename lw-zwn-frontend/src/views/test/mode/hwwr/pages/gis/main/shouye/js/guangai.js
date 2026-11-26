/*初始化灌溉模块*/
//名称样式
let nmSymbol
let sym_shuiwei
let sms
let rainSys
const mapType = 0 //当前选择的地图  行政区划0 地形 1 影像2
/**/
let moduleName
let sym_liuliang
let sym_yuliang = null
let sym_yl1 = null
let sym_yl2 = null
let sym_yl3 = null
let sym_yl4 = null
let sym_yl5 = null
const sym_yl6 = null
let sym_skswz = null
let sym_jj = null
function initGuanGai() {
  //名称样式
  const nmSymbol = new GIS.TextSymbol()
  sym_yuliang = new GIS.PictureMarkerSymbol('img/icon_yl0.png', 18, 18)
  sym_yl1 = new GIS.PictureMarkerSymbol('img/icon_yl1.png', 18, 18)
  sym_yl2 = new GIS.PictureMarkerSymbol('img/icon_yl2.png', 18, 18)
  sym_yl3 = new GIS.PictureMarkerSymbol('img/icon_yl3.png', 18, 18)
  sym_yl4 = new GIS.PictureMarkerSymbol('img/icon_yl4.png', 18, 18)
  sym_yl5 = new GIS.PictureMarkerSymbol('img/icon_yl5.png', 18, 18)
  spsys = new GIS.PictureMarkerSymbol('img/sp.png', 16, 23)
  sym_skswz = new GIS.PictureMarkerSymbol('img/legend_sw.png', 18, 18)
  sym_hdswz = new GIS.PictureMarkerSymbol('img/legend_hd.png', 15, 15)
  sym_jj = new GIS.PictureMarkerSymbol('img/find.gif', 21, 21)

  //初始化renderer
  /*水文站*/
  sms = new esri.symbol.SimpleMarkerSymbol(
    esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
    16,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([255, 255, 0]),
      1
    ),
    new dojo.Color([255, 255, 0, 0.25])
  )
  rainSys = new esri.symbol.SimpleMarkerSymbol(
    esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
    10,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([255, 0, 0]),
      1
    ),
    new dojo.Color([255, 0, 0, 1])
  )

  /*在线绘制测站图层*/
  initGraphicLayer.on('click', clickGraphicHandler)
  initGraphicLayer.on('mouse-over', overGraphicHandler)
  initGraphicLayer.on('mouse-out', outGraphicHandler)

  /*要素单击事件*/
  function clickGraphicHandler(event) {
    stationClick(event)
  }
  /*移动到要素上触发*/
  function overGraphicHandler(event) {
    map.setMapCursor('pointer')
  }
  function outGraphicHandler() {
    map.setMapCursor('default')
  }
  queryTaskVedio('1=1')
  queryTaskStation('1=1')
}
/**
 * 初始化加载数据
 */
function initData() {}
/*模块切换时控制图层*/
function layerControl(moduleName) {}

////////////////切换模块json结束////////////////////////////////////
///////////////////initQuery遍历开始//////////////////////////////
/**
 * 获得视频监控点数据
 * @param args
 */
function queryTaskVedio(args) {
  let queryTask
  queryTask = new esri.tasks.QueryTask(shouye.backlayer + '/15')
  //查询参数
  query = new esri.tasks.Query()
  //设置查询坐标系
  query.outSpatialReference = map.spatialReference
  query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_CONTAINS
  //需要返回Geometry
  query.returnGeometry = true
  //需要返回的字段
  query.outFields = ['*'] //["STCD","STNM"]; //["*"]
  //查询条件
  query.where = args
  //进行查询，完成后调用showResults方法
  queryTask.execute(query, showResultVedio, showError)
}
/**
 * 获得监测站数据
 * @param args
 */
function queryTaskStation(args) {
  let queryTask
  queryTask = new esri.tasks.QueryTask(shouye.backlayer + '/16')
  //查询参数
  query = new esri.tasks.Query()
  //设置查询坐标系
  query.outSpatialReference = map.spatialReference
  query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_CONTAINS
  //需要返回Geometry
  query.returnGeometry = true
  //需要返回的字段
  query.outFields = ['*'] //["STCD","STNM"]; //["*"]
  //查询条件
  query.where = args
  //进行查询，完成后调用showResults方法
  queryTask.execute(query, showResultStation, showError)
}
//视频点结果处理
function showResultVedio(results) {
  //    console.log(results);
  for (i = 0; i < results.features.length; i++) {
    const graphic = results.features[i]
    graphic.attributes.GRATYPE = 'vedio_show'
    graphic.attributes.SHOWTYPE = 'marker'
    graphic.setSymbol(spsys)
    initGraphicLayer.add(graphic)
  }
}
//监测站结果处理
function showResultStation(results) {
  //    console.log(results);
  for (i = 0; i < results.features.length; i++) {
    const graphic = results.features[i]
    graphic.attributes.GRATYPE = 'station_show'
    graphic.attributes.SHOWTYPE = 'marker'
    graphic.setSymbol(sym_hdswz)
    initGraphicLayer.add(graphic)
  }
}
/**
 *查询错误显示
 * */
function showError(err) {}

/**
 * 绘制point至地图中
 * @param x
 * @param y
 * @param p
 */
function addPoint(x, y, p) {
  const attr_yl = copy(p)
  //addTxtSymbol(x,y,p);
  //if(p.LX=="1"||p.LX=="4")
  //	{	//只是河道站  LX '1'
  const hdPoint = new GIS.Point([x, y], new esri.SpatialReference({ wkid: 4326 }))
  const attr = copy(p)
  attr.GRATYPE = 'hd_show'
  attr.SHOWTYPE = 'marker'
  const hdGra = new GIS.Graphic(hdPoint, sym_hdswz, attr)
  initGraphicLayer.add(hdGra)
  //addTxtSymbol(x, y,p);
  const attributes = {}
  attributes.q1 = p.q1
  attributes.qs1 = p.qs1
  attributes.tm = p.tm
  attributes.pos = p.POS
  attributes.winW = 165
  attributes.aw = p.AW
  attributes.sw = p.SW
  attributes.STCD = p.stcd
  attributes.STNM = p.stnm
  attributes.winH = 70
  const graItem = new GIS.Graphic(hdPoint)
  graItem.attributes = attributes
  infoLayerCity.add(graItem)
}
/**
 * 限定小数位置
 */
function fomatXmj(data, numbercount) {
  if (
    typeof data === 'undefined' ||
    data === ' ' ||
    data == 'NaN' ||
    data == '-' ||
    data === '' ||
    data == null
  ) {
    data = ''
  } else if (parseFloat(data).toString() != 'NaN' && parseFloat(data) != '') {
    data = parseFloat(data)
    data = data.toFixed(numbercount)
  }
  return data
}
/**
 * 添加text标注
 */
function addTxtSymbol(x, y, attr) {
  const attributes = copy(attr)
  let textSym
  textSym = new GIS.TextSymbol(attributes.stnm)
    .setColor(new esri.Color([186, 85, 91]))
    .setAlign(GIS.TextSymbol.ALIGN_START)
    .setOffset(-50, 10)
    .setFont(
      new esri.symbol.Font(
        '10pt',
        esri.symbol.Font.STYLE_NORMAL,
        esri.symbol.Font.VARIANT_NORMAL,
        esri.symbol.Font.WEIGHT_BOLD,
        '微软雅黑'
      )
    )
  attributes.SHOWTYPE = 'value'
  attributes.GRATYPE = 'hd_show'

  initGraphicLayer.add(new esri.Graphic(new GIS.Point(x, y), textSym, attributes))
}

/*infoLayer显隐控制*/
function infoVis() {
  if (map.getScale() < 3000000) {
    //initGraphicLayer.setType(["station_show","vedio_show"]);
  } else {
    //initGraphicLayer.setType(["station_hide","vedio_hide"]);
  }
}

function copy(source) {
  const result = {}

  for (const key in source) {
    result[key] = typeof source[key] === 'object' ? deepCoyp(source[key]) : source[key]
  }
  return result
}
function stationClick(event) {
  console.log('222')
  //打开新界面
  //window.open("result.jsp");
  const gra = event.graphic
  if (gra.attributes.GRATYPE == 'vedio_show') {
    parent.parent.showVideo('SP000005')
    return
  }
  //判断模块和图层
  let htmlStr = ''
  let sttp = '1'
  if (gra.attributes.STTP) {
    sttp = gra.attributes.STTP
  }
  popupUrl = '../../../xxfw/sq/sqDialog/sq.jsp'
  switch (sttp) {
    case '1':
      //河道水文站
      htmlStr =
        "<div class='infoTitle'>" +
        gra.attributes.NAME +
        '</div>' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '最新水位:20m' +
        '<br/>最新流量:10.5m³/s' +
        '<br/>采集时间:2015年3月10号' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        "<div class='moreTitle' onclick='moreClickHandler(this)'>" +
        '详情' +
        '</div>' +
        "<div class='shipinTitle' onclick='spClickHandler(this)'>" +
        '模型' +
        '</div>' +
        '</div>'
      break
    case '2':
      //水库水文站
      htmlStr =
        "<div class='infoTitle'>" +
        gra.attributes.STNM +
        '</div>' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '最新水位:' +
        fomatXmj(graphic.RZ, 2) +
        'm' +
        '<br/>蓄水量:' +
        fomatXmj(graphic.W, 3) +
        '百万m³' +
        '<br/>采集时间:' +
        graphic.TM +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        "<div class='moreTitle' onclick='moreClickHandler(this)'>" +
        '详情' +
        '</div>' +
        "<div class='shipinTitle' onclick='spClickHandler(this)'>" +
        '视频' +
        '</div>' +
        '</div>'
      break
    case '3':
      //雨量站
      htmlStr =
        "<div class='infoTitle'>" +
        gra.attributes.STNM +
        '</div>' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '降雨量:' +
        fomatXmj(graphic.DRP, 1) +
        'mm' +
        '<br/>时间段:' +
        graphic.TM +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        "<div class='moreTitle' onclick='moreClickHandler(this)'>" +
        '详情' +
        '</div>' +
        "<div class='shipinTitle' onclick='spClickHandler(this)'>" +
        '视频' +
        '</div>' +
        '</div>'
      break
    case '4':
      //雨量站、河道水文站
      htmlStr =
        "<div class='infoTitle'>" +
        graphic.STNM +
        '</div>' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '最新水位:' +
        fomatXmj(graphic.SW, 2) +
        'm' +
        '<br/>最新流量:' +
        fomatXmj(graphic.LL, 3) +
        'm³/s' +
        '<br/>采集时间:' +
        graphic.SQTM +
        '<br/>降雨量:' +
        fomatXmj(graphic.DRP, 1) +
        'mm' +
        '<br/>时间段:' +
        graphic.YQTM +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        "<div class='moreTitle' onclick='moreClickHandler(this)'>" +
        '详情' +
        '</div>' +
        "<div class='shipinTitle' onclick='spClickHandler(this)'>" +
        '视频' +
        '</div>' +
        '</div>'
      break
    case '5':
      //雨量站、水库水文站
      htmlStr =
        "<div class='infoTitle'>" +
        gra.attributes.STNM +
        '</div>' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '最新水位:' +
        fomatXmj(graphic.RZ, 2) +
        'm' +
        '<br/>蓄水量:' +
        fomatXmj(graphic.W, 3) +
        '百万m³' +
        '<br/>采集时间:' +
        graphic.SQTM +
        '<br/>降雨量:' +
        fomatXmj(graphic.DRP, 1) +
        'mm' +
        '<br/>时间段:' +
        graphic.YQTM +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        "<div class='moreTitle' onclick='moreClickHandler(this)'>" +
        '详情' +
        '</div>' +
        "<div class='shipinTitle' onclick='spClickHandler(this)'>" +
        '视频' +
        '</div>' +
        '</div>'
      break
    case '6':
      //巡查轨迹点
      htmlStr =
        "<div class='infoTitle'>" +
        gra.attributes.NAME +
        '</div>' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '巡查时间:' +
        gra.attributes.time +
        '   14:45' +
        '<br/>发现险情:' +
        "<a href='" +
        popupUrl +
        "'>2处</a>" +
        '' +
        '<br/>上传图片:' +
        "<a href='" +
        popupUrl +
        "'>5张</a>" +
        '' +
        '<br/>巡查人员:张师傅' +
        "<hr style='height:1px;border:none;border-top:2px solid #E8E8E8;' />" +
        '</div>'
      break
  }

  wh = ['760px', '400px']

  map.infoWindow.setContent(htmlStr)
  map.infoWindow.resize(210, 180)
  //	map.infoWindow.show(event.screenPoint,event.mapPoint);
  map.infoWindow.show(event.mapPoint)
}

function spClickHandler(event) {
  popupUrl =
    'pages/gis/main/3d/data/flashmodule/fp/FlashPlay.html?ur=226.98@2.45@200@0.5@1:5.32|2:4.95|3:4.95|4:4.95|@../ZhangJiaGang.swf'
  parent.parent.layer.open({
    content: popupUrl,
    type: 2,
    area: ['900px', '600px'],
    title: '模型详细信息',
    shade: [0.8, '#fff'],
    skin: 'map_layui_win'
  })
}
function moreClickHandler(event) {
  parent.parent.stcdInfo('61004810', '高坝洲')
}
