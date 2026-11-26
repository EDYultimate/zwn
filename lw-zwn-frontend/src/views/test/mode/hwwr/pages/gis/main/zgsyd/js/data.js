let sym_syd //水源地样式

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_syd = new GIS.SimpleFillSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_SOLID, new GIS.Color([60, 166, 92, 1]), 1),
    new GIS.Color([60, 166, 92, 0.2])
  )
  const task = new GIS.QueryTask(GIS.queryLayer + '/6') //测站索引为0
  const query = new GIS.Query()
  query.where = '1=1'
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
  //定时执行，5秒后执行show()
  //	window.setInterval(changeGraStyle,800);
}
function changeGraStyle() {
  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    console.log(gra.attributes.DB)
    if (gra.attributes.DB != '达标') {
      if (gra.isShow) {
        gra.setSymbol(gra.oldStyle)
      } else {
        gra.setSymbol(sym_sngq0)
      }
      gra.isShow = !gra.isShow
      console.log(gra.isShow)
    }
  }
}
/*调取业务数据库数据*/
function getServerStatList() {
  //获取
  $.post(basePath + '/lyzg/sgnq/getZgSgnqForMap', { type: 1 }, getYWdataHandler)
}
/*业务数据调用返回处理*/
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  result = $.parseJSON(result)
  const size = result.length
  //addToMarker();
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  if (result.features.length > 0) {
    dataProvider = result.features
    for (let j = 0; j < dataProvider.length; j++) {
      const gra = dataProvider[j]
      gra.isShow = true
      // gra.attributes["STCD"]=gra.attributes["ID"];
      gra.attributes.GRATYPE = 'syd'
      gra.attributes.SHOWTYPE = 'marker'
      gra.setSymbol(sym_syd)
      gra.attributes.stnm = gra.attributes.NAME.trim()
      graphicsLayer.add(gra)
    }
  }
  //getServerStatList(1);//调用测站业务数据
}
/*获取要素报错*/
function getSTATListErro(evt) {
  console.log(evt)
}
/**/
function graphicCickHander(event) {
  const gra = event.graphic
  const stcd = gra.attributes.STCD
  console.log(gra.attributes)
  graphicCickHander_syd(stcd)
}
/*marker要素标注*/
function addToMarker() {}
/*添加名称*/
function addGraName(attr) {
  const attributes = copy(attr)
  const x = attributes.LGTD
  const y = attributes.LTTD
  const textSym = new GIS.TextSymbol(attributes.STNM)
  textSym.setColor(new esri.Color([78, 78, 78]))
  textSym.setAlign(GIS.TextSymbol.ALIGN_MIDDLE)
  textSym.setOffset(0, -20)
  textSym.setFont(
    new esri.symbol.Font(
      '10pt',
      esri.symbol.Font.STYLE_NORMAL,
      esri.symbol.Font.VARIANT_NORMAL,
      esri.symbol.Font.WEIGHT_BOLD,
      'Arial'
    )
  )
  attributes.SHOWTYPE = 'name'
  graphicsLayer.add(new esri.Graphic(new GIS.Point(x, y), textSym, attributes))
}
/*数值标注标签*/
function addGraValueLabel(gra) {
  const newAttr = GIS.copy(gra.attributes)
  newAttr.SHOWTYPE = 'value'
  const textSym = new GIS.TextSymbol(gra.attributes.VAL)
    .setColor(new esri.Color([100, 149, 237]))
    .setAlign(GIS.TextSymbol.ALIGN_START)
    .setOffset(10, 5)
    .setFont(new esri.symbol.Font('10pt'))
    .setHaloColor(new GIS.Color([0, 0, 0]))
  graphicsLayer.add(new GIS.Graphic(gra.geometry, textSym, newAttr))
}
/*移动到要素上触发*/
function overGraphicHandler(event) {
  const gra = event.graphic
  const w = GIS.getByteSize(gra.attributes.stnm)
  const x = event.pageX
  const y = event.pageY
  console.log(event)
  $('#nameLabel')
    .css({
      left: x + 10 + 'px',
      top: y + 10 + 'px',
      width: w * 10 + 'px'
    })
    .text(gra.attributes.stnm)
  $('#nameLabel').show()
  map.setMapCursor('pointer')
}
/*在要素上移开*/
function outGraphicHandler() {
  $('#nameLabel').hide()
  map.infoWindow.hide()
  map.setMapCursor('default')
}
