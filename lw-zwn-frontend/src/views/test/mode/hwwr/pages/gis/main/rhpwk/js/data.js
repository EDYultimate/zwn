let sym_rhpwk
//

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_rhpwk = new GIS.PictureMarkerSymbol('img/bz_rhpwk.png', 15, 15)
  const task = new GIS.QueryTask(GIS.queryLayer + '/3') //测站索引为0
  const query = new GIS.Query()
  query.where = '1=1'
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}
/*调取业务数据库数据*/
function getServerStatList() {
  //获取
  $.post(basePath + '/szybh/rhpwk/getRhpwkZXJcForMap', { type: 1 }, getYWdataHandler)
}
/*业务数据调用返回处理*/
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  //alert(result);
  result = $.parseJSON(result)
  console.log(result)
  const size = result.length

  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    gra.attributes.SEW_DA = ''
    gra.attributes.YR = ''
    gra.attributes.AD_NM = ''
    for (let i = 0; i < size; i++) {
      const item = result[i]
      if (item.PDO_CD == gra.attributes.STCD) {
        gra.attributes.SEW_DA = GIS.null(item.SEW_DA)
        gra.attributes.YR = GIS.null(item.YR)
        gra.attributes.AD_NM = GIS.null(item.AD_NM)
      }
    }
    gra.setSymbol(sym_rhpwk)
    gra.attributes.GRATYPE = 'rhpwk'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.STNM.trim()
    graphicsLayer.add(gra)
    addGraName(gra)
    // addGraValueLabel(gra);
  }
  addToMarker()
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  if (result.features.length > 0) {
    for (let i = 0; i < result.features.length; i++) {}
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
  graphicCickHander_rhpwk()
}
/*marker要素标注*/
function addToMarker() {}
/*添加名称*/
function addGraName(gra) {
  const attributes = GIS.copy(gra.attributes)
  const x = gra.geometry.x
  const y = gra.geometry.y
  const textSym = new GIS.TextSymbol(attributes.STNM)
  textSym.setColor(new esri.Color([78, 78, 78]))
  textSym.setAlign(GIS.TextSymbol.ALIGN_MIDDLE)
  textSym.setOffset(0, -20)
  textSym.setFont(
    new esri.symbol.Font(
      '10pt',
      esri.symbol.Font.STYLE_NORMAL,
      esri.symbol.Font.VARIANT_NORMAL,
      esri.symbol.Font.WEIGHT_NORMAL,
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
  const x = event.layerX
  const y = event.layerY
  //	  $("#nameLabel").css({
  //		  left:x+10+"px",
  //		  top:y+10+"px",
  //		  width:w*10+"px"
  //	  }).text(gra.attributes["stnm"]);
  //	  $("#nameLabel").show();
  //	  map.setMapCursor('pointer');
  /**/
  const overPT = map.toMap(GIS.Point(x, y))
  const contentStr =
    '<div>' +
    '名称:' +
    gra.attributes.stnm +
    '<br/>时间:' +
    gra.attributes.YR +
    '<br/>行政区:' +
    gra.attributes.AD_NM +
    '<br/>污水排放量:' +
    gra.attributes.SEW_DA +
    '万吨' +
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
