let sym_swllz
//

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_swllz = new GIS.PictureMarkerSymbol('img/bz_sweiz.png', 9, 15)
  const task = new GIS.QueryTask(GIS.queryLayer + '/0') //测站索引为0
  const query = new GIS.Query()
  query.where = "TYPE like '%ZC%'"
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}
/*调取业务数据库数据*/
function getServerStatList() {
  //获取
  $.post(basePath + '/szybh/sjdm/getSwLlForMap', {}, getYWdataHandler)
}
/*业务数据调用返回处理*/
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  //alert(result);
  result = $.parseJSON(result)
  const size = result.length

  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    gra.attributes.SW = ''
    gra.attributes.LL = ''
    gra.attributes.TM = ''
    for (let i = 0; i < size; i++) {
      const item = result[i]
      if (item.STCD == gra.attributes.STCD) {
        gra.attributes.SW = GIS.null(item.SW)
        gra.attributes.LL = GIS.null(item.LL)
        gra.attributes.TM = GIS.null(item.TM)
      }
    }
    gra.setSymbol(sym_swllz)
    gra.attributes.GRATYPE = 'swllz'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.STNM.trim()
    graphicsLayer.add(gra)
    addGraValueLabel(gra)
    addGraName(gra)
  }
  addToMarker()
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  if (result.features.length > 0) {
    for (let i = 0; i < result.features.length; i++) {
      const gra = result.features[i]
      gra.setSymbol(sym_swllz)
      gra.attributes.GRATYPE = 'swllz'
      gra.attributes.SHOWTYPE = 'marker'
      gra.attributes.stnm = gra.attributes.STNM.trim()
      //			 graphicsLayer.add(gra);
      //			 addGraValueLabel(gra);
      //			 dataProvider.push(gra);
    }
    dataProvider = result.features
  }
  getServerStatList(1) //调用测站业务数据
}
/*获取要素报错*/
function getSTATListErro(evt) {
  console.log(evt)
}
/**/
function graphicCickHander(event) {
  const gra = event.graphic
  const stcd = gra.attributes.STCD
  const stnm = gra.attributes.stnm
  graphicCickHander_swllz(stcd, stnm)
}
/*marker要素标注*/
function addToMarker() {}
/*添加名称*/
function addGraName(gra) {
  const attributes = GIS.copy(gra.attributes)
  const x = gra.geometry.x
  const y = gra.geometry.y
  const textSym = new GIS.TextSymbol(attributes.STNM)
  console.log(attributes)
  textSym.setColor(new esri.Color([78, 78, 78]))
  textSym.setAlign(GIS.TextSymbol.ALIGN_MIDDLE)
  textSym.setOffset(0, -20)
  textSym.setFont(
    new esri.symbol.Font(
      '10pt',
      esri.symbol.Font.STYLE_NORMAL,
      esri.symbol.Font.VARIANT_NORMAL,
      GIS.Font.WEIGHT_NORMAL,
      'Arial'
    )
  )
  attributes.SHOWTYPE = 'name'
  graphicsLayer.add(new esri.Graphic(new GIS.Point(x, y), textSym, attributes))
}
/*数值标注标签*/
function addGraValueLabel(gra) {
  //标注水位
  var newAttr = GIS.copy(gra.attributes)
  newAttr.SHOWTYPE = 'value'
  var textSym = new GIS.TextSymbol(gra.attributes.SW)
    .setColor(new GIS.Color([100, 149, 237]))
    .setAlign(GIS.TextSymbol.ALIGN_START)
    .setOffset(10, 5)
    .setFont(new GIS.Font('10pt'))
  graphicsLayer.add(new GIS.Graphic(gra.geometry, textSym, newAttr))
  //标注流量
  var newAttr = GIS.copy(gra.attributes)
  newAttr.SHOWTYPE = 'value'
  var textSym = new GIS.TextSymbol(gra.attributes.LL)
    .setColor(new GIS.Color([100, 149, 237]))
    .setAlign(GIS.TextSymbol.ALIGN_END)
    .setOffset(-10, 5)
    .setFont(new GIS.Font('10pt'))
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
  /**/
  const overPT = map.toMap(GIS.Point(x, y))
  const contentStr =
    '<div>' +
    '名称:' +
    gra.attributes.stnm +
    '<br/>时间:' +
    gra.attributes.TM +
    '<br/>水位:' +
    gra.attributes.SW +
    'm' +
    '<br/>流量:' +
    gra.attributes.LL +
    'm³/s' +
    '</div>'
  map.infoWindow.setContent(contentStr)
  map.infoWindow.resize(200, 200)
  map.infoWindow.show(overPT)
}
/*在要素上移开*/
function outGraphicHandler() {
  $('#nameLabel').hide()
  map.setMapCursor('default')
  map.infoWindow.hide()
}
