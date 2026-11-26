let sym_yuliang
//

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_yuliang = new GIS.PictureMarkerSymbol('../../common/img/bz_qsh_2.png', 18, 18)
  const task = new GIS.QueryTask(GIS.queryLayer + '/0') //测站索引为0
  const query = new GIS.Query()
  query.where = "STTP='PP'"
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}
/*调取业务数据库数据*/
function getServerStatList() {
  //获取
  $.post(basePath + '/gis/getpptn', { type: 1 }, getYWdataHandler)
}
/*业务数据调用返回处理*/
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  //alert(result);
  //result=$.parseJSON(result);
  console.log(result)
  const size = result.length

  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    gra.attributes.VAL = ''
    for (let i = 0; i < size; i++) {
      const item = result[i]
      if (item.STCD == gra.attributes.STCD) {
        gra.attributes.VAL = '12.3'
      }
    }
    gra.setSymbol(sym_yuliang)
    gra.attributes.GRATYPE = 'gcxq'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.STNM.trim()
    graphicsLayer.add(gra)
    addGraValueLabel(gra)
  }
  addToMarker()
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  if (result.features.length > 0) {
    for (let i = 0; i < result.features.length; i++) {
      const gra = result.features[i]
      gra.setSymbol(sym_yuliang)
      gra.attributes.GRATYPE = 'gcxq'
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
  graphicCickHander_jsl()
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
