let sym_yuliang
let sym_yl1 = null
let sym_yl2 = null
let sym_yl3 = null
let sym_yl4 = null
let sym_yl5 = null
const sym_yl6 = null
//

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_yuliang = new GIS.PictureMarkerSymbol('img/icon_yl2.png', 18, 18)
  sym_yuliang = new GIS.PictureMarkerSymbol('img/icon_yl0.png', 18, 18)
  sym_yl1 = new GIS.PictureMarkerSymbol('img/icon_yl1.png', 18, 18)
  sym_yl2 = new GIS.PictureMarkerSymbol('img/icon_yl2.png', 18, 18)
  sym_yl3 = new GIS.PictureMarkerSymbol('img/icon_yl3.png', 18, 18)
  sym_yl4 = new GIS.PictureMarkerSymbol('img/icon_yl4.png', 18, 18)
  sym_yl5 = new GIS.PictureMarkerSymbol('img/icon_yl5.png', 18, 18)
  const task = new GIS.QueryTask(GIS.queryLayer + '/0') //测站索引为0
  const query = new GIS.Query()
  query.where = "TYPE like '%PP%'"
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
        gra.attributes.VAL = GIS.null(item.VAL + '')
      }
    }
    let symbol = null
    const llValue = gra.attributes.VAL
    if (typeof llValue === 'undefined') {
      symbol = sym_yuliang
    }
    if (llValue <= 0) {
      symbol = sym_yuliang
    } else if (llValue <= 10) {
      symbol = sym_yl1
    } else if (llValue <= 25) {
      symbol = sym_yl2
    } else if (llValue <= 50) {
      symbol = sym_yl3
    } else if (llValue <= 100) {
      symbol = sym_yl4
    } else if (llValue <= 200) {
      symbol = sym_yl5
    } else if (llValue > 200) {
      symbol = sym_yl6
    }

    gra.setSymbol(symbol)
    gra.attributes.GRATYPE = 'gcxq'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.STNM.trim()

    graphicsLayer.add(gra)
    addGraName(gra)
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
  const gra = event.graphic
  const stcd = gra.attributes.STCD
  graphicCickHander_jsl(stcd)
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
  let textSym = null
  let llValue = gra.attributes.VAL
  const mapType = 1
  if (typeof llValue === 'undefined') {
    llValue = ''
    textSym = new GIS.TextSymbol(llValue)
      .setColor(new esri.Color([100, 149, 237]))
      .setAlign(GIS.TextSymbol.ALIGN_START)
      .setOffset(-8, 8)
      .setFont(new esri.symbol.Font('10pt'))
      .setHaloColor(new GIS.Color([0, 0, 0]))
  }
  if (llValue <= 0) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([156, 215, 7]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([156, 215, 7]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  } else if (llValue <= 10) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([12, 155, 209]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([12, 155, 209]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  } else if (llValue <= 25) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([3, 124, 217]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([3, 124, 217]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  } else if (llValue <= 50) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([252, 115, 115]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([252, 115, 115]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  } else if (llValue <= 100) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([252, 74, 74]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([252, 74, 74]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  } else if (llValue <= 200) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([224, 17, 17]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([224, 17, 17]))
        .setAlign(GIS.TextSymbol.ALIGN_START)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  } else if (llValue > 200) {
    if (mapType == 2) {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([220, 2, 2]))
        .setAlign(GIS.TextSymbol.ALIGN_END)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
        .setHaloColor(new GIS.Color([0, 0, 0]))
        .setHaloSize(1)
    } else {
      textSym = new GIS.TextSymbol(llValue)
        .setColor(new esri.Color([220, 2, 2]))
        .setAlign(GIS.TextSymbol.ALIGN_END)
        .setOffset(-8, 8)
        .setFont(new esri.symbol.Font('10pt'))
    }
  }
  graphicsLayer.add(new GIS.Graphic(gra.geometry, textSym, newAttr))
}
