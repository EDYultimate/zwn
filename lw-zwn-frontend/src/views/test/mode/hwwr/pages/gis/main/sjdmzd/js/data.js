let sym_sjdm1 /*省界断面1类*/
let sym_sjdm2 /*省界断面2类*/
let sym_sjdm3 /*省界断面3类*/
let sym_sjdm4 /*省界断面4类*/
let sym_sjdm5 /*省界断面5类*/
let sym_sjdm6 /*省界断面6类*/
let sym_sjdm11 /*省界断面1类*/
let sym_sjdm22 /*省界断面2类*/
let sym_sjdm33 /*省界断面3类*/
let sym_sjdm44 /*省界断面4类*/
let sym_sjdm55 /*省界断面5类*/
let sym_sjdm66 /*省界断面5类*/
//

//数据源
let dataProvider = []
function moduleInit() {
  sym_sjdm1 = new GIS.PictureMarkerSymbol('img/11.png', 10, 16)
  sym_sjdm2 = new GIS.PictureMarkerSymbol('img/22.png', 10, 16)
  sym_sjdm3 = new GIS.PictureMarkerSymbol('img/33.png', 10, 16)
  sym_sjdm4 = new GIS.PictureMarkerSymbol('img/44.png', 10, 16)
  sym_sjdm5 = new GIS.PictureMarkerSymbol('img/55.png', 10, 16)
  sym_sjdm6 = new GIS.PictureMarkerSymbol('img/66.png', 10, 16)
  sym_sjdm11 = new GIS.PictureMarkerSymbol('img/11.gif', 10, 16)
  sym_sjdm22 = new GIS.PictureMarkerSymbol('img/22.gif', 10, 16)
  sym_sjdm33 = new GIS.PictureMarkerSymbol('img/33.gif', 10, 16)
  sym_sjdm44 = new GIS.PictureMarkerSymbol('img/44.gif', 10, 16)
  sym_sjdm55 = new GIS.PictureMarkerSymbol('img/55.gif', 10, 16)
  sym_sjdm66 = new GIS.PictureMarkerSymbol('img/66.gif', 10, 16)
}
/*获取要素方法*/
function getSTATList() {
  const task = new GIS.QueryTask(GIS.queryLayer + '/0') //测站索引为0
  const query = new GIS.Query()
  query.where = "TYPE like '%AUTO%'"
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}
/*调取业务数据库数据*/
function getServerStatList() {
  //获取
  $.post(
    basePath + '/szybh/szzdz/getSzZdzInfoToMap',
    { flag: 'cs', pageSize: 100, pageNo: 1, datemonth: '2017-06' },
    getYWdataHandler
  )
}
/*业务数据调用返回处理*/
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  //alert(result);
  result = $.parseJSON(result)
  console.log(result)
  console.log(result)
  const size = result.length
  console.log(dataProvider)
  console.log(result)
  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    gra.setSymbol(sym_sjdm3)
    gra.attributes.WQT = ''
    //水质类别
    gra.attributes.WQG = ''
    //主要污染物及超标倍数
    gra.attributes.DB = ''
    //是否达标
    gra.attributes.MESPEST = ''
    //时间
    gra.attributes.PCPTIME = ''
    gra.attributes.WQGNM = ''
    gra.attributes.flag = ''

    for (let i = 0; i < size; i++) {
      const item = result[i]
      if ((item.WRCD + '').trim() == (gra.attributes.STCD + '').trim()) {
        const level = item.WQG1

        switch (level) {
          case 'Ⅰ':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm1)
            } else {
              gra.setSymbol(sym_sjdm11)
            }

            break
          case 'Ⅱ':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm2)
            } else {
              gra.setSymbol(sym_sjdm22)
            }

            break
          case 'Ⅲ':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm3)
            } else {
              gra.setSymbol(sym_sjdm33)
            }

            break
          case 'Ⅳ':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm4)
            } else {
              gra.setSymbol(sym_sjdm44)
            }

            break
          case 'Ⅴ':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm5)
            } else {
              gra.setSymbol(sym_sjdm55)
            }

            break
          case '劣Ⅴ':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm6)
            } else {
              gra.setSymbol(sym_sjdm66)
            }

            break
          default:
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm3)
            } else {
              gra.setSymbol(sym_sjdm33)
            }
        }
        console.log(item)
        //水质目标
        gra.attributes.WQT = GIS.null(item.WQT1)
        //水质类别
        gra.attributes.WQG = GIS.null(item.WQG1)
        //主要污染物及超标倍数
        gra.attributes.DB = GIS.null(item.DB)
        //是否达标
        gra.attributes.MESPEST = GIS.null(item.MESPEST)
        //时间
        gra.attributes.TM = GIS.null(item.TM)
        gra.attributes.WQGNM = GIS.null(item.WQGNM)
        gra.attributes.flag = item.FLAG
        // console.log(GIS.null(item["FLAG"]));

        break
      }
    }
    gra.attributes.GRATYPE = 'gcxq'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.STNM.trim()
    graphicsLayer.add(gra)
    addGraName(gra)
    addInfor(gra)
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
/*省界断面点击*/
function graphicCickHander(event) {
  const gra = event.graphic
  const stcd = gra.attributes.STCD
  graphicCickHander_sjdm(stcd)
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
  /**/
  const overPT = map.toMap(GIS.Point(x, y))
  const contentStr =
    '<div>' +
    '名称:' +
    gra.attributes.stnm +
    '<br/>时间:' +
    gra.attributes.PCPTIME +
    '<br/>水质目标:' +
    gra.attributes.WQT +
    '<br/>水质类别:' +
    gra.attributes.WQG +
    '<br/>污染物及超标倍数:' +
    gra.attributes.MESPEST +
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
function graphicOverHandler(stcd) {
  let gra = null
  for (let j = 0; j < dataProvider.length; j++) {
    const item = dataProvider[j]
    if (item.attributes.STCD.trim() == stcd.trim()) {
      gra = item
    }
  }
  if (gra == null) {
    return
  }
  map.setMapCursor('pointer')
  /**/
  const overPT = gra.geometry
  const contentStr =
    '<div>' +
    '名称:' +
    gra.attributes.stnm +
    '<br/>时间:' +
    gra.attributes.TM +
    '<br/>水质目标:' +
    gra.attributes.WQT +
    '<br/>水质类别:' +
    gra.attributes.WQG +
    '<br/>污染物及超标倍数:' +
    gra.attributes.MESPEST +
    '</div>'
  map.infoWindow.setContent(contentStr)
  map.infoWindow.resize(200, 200)
  map.infoWindow.show(overPT)
}
function graphicOutHandler(stcd) {
  $('#nameLabel').hide()
  map.setMapCursor('default')
  map.infoWindow.hide()
}
function addInfor(graphics) {
  const pt = new GIS.Point(graphics.geometry.x, graphics.geometry.y)
  const graphic = new GIS.Graphic(pt)
  const flag = graphics.attributes.flag
  let imgurl = ''
  if (flag + '' != '0') {
    imgurl = 'img/normal.png'
  } else {
    imgurl = 'img/unnormal.png'
  }
  graphic.setAttributes({
    pos: graphics.attributes.pos,
    winW: 130,
    winH: 30,
    content:
      '<div style="cursor:point" onmouseover="graphicOverHandler(\'' +
      graphics.attributes.STCD +
      '\')" onmouseout="graphicOutHandler(\'' +
      graphics.attributes.STCD +
      '\')"><img style="display:inline-block;margin-left:10px;width:10px;" src="' +
      imgurl +
      '" />' +
      graphics.attributes.stnm
  }) + '</div>'
  infoLayer.add(graphic)
}
