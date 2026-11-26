let sym_sj
//

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_sj = new GIS.PictureMarkerSymbol('img/xzq_point_sj.png', 0, 0)
  const task = new GIS.QueryTask(GIS.queryLayer + '/1') //省中心点索引为1
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
  $.post(basePath + '/kfly/crjsl/getSzyGb_crjsl', { year: 2016 }, getYWdataHandler)
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
    gra.setSymbol(sym_sj)
    gra.attributes.GRATYPE = 'XZQSJ'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.NAME.trim()
    gra.attributes.IN_PROV_WAT = ''
    gra.attributes.OUT_PORV_WAT = ''
    gra.attributes.TM = '' //时间
    for (let i = 0; i < size; i++) {
      const item = result[i]
      if (item.BM == gra.attributes.CD) {
        gra.attributes.IN_PROV_WAT = GIS.null(item.IN_PROV_WAT) + '万m³'
        gra.attributes.OUT_PORV_WAT = GIS.null(item.OUT_PORV_WAT) + '万m³'
        gra.attributes.TM = item.TM //时间
      }
    }
    graphicsLayer.add(gra)
    // addGraValueLabel(gra);
    addInfor(gra)
    addGraName(gra)
  }
  addToMarker()
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  if (result.features.length > 0) {
    for (let i = 0; i < result.features.length; i++) {
      const gra = result.features[i]
      gra.setSymbol(sym_sj)
      gra.attributes.GRATYPE = 'XZQSJ'
      gra.attributes.SHOWTYPE = 'marker'
      gra.attributes.stnm = gra.attributes.NAME.trim()
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
  graphicCickHander_crjsl()
}
/*marker要素标注*/
function addToMarker() {}
/*添加名称*/
function addGraName(gra) {
  const attributes = GIS.copy(gra.attributes)
  const x = gra.geometry.x
  const y = gra.geometry.y
  const textSym = new GIS.TextSymbol(attributes.NAME)
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
function addInfor(graphics) {
  const pt = new GIS.Point(graphics.geometry.x, graphics.geometry.y)
  const graphic = new GIS.Graphic(pt)
  graphic.setAttributes({
    pos: 'rt',
    winW: 125,
    winH: 60,
    content:
      '时间：' +
      graphics.attributes.TM +
      '年</br>入境：' +
      graphics.attributes.IN_PROV_WAT +
      '</br>出境：' +
      graphics.attributes.OUT_PORV_WAT
  })
  infoLayer.add(graphic)
}
