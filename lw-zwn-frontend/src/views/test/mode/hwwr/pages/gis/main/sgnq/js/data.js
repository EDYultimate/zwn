let sym_sngq
let sym_sjdm1 /*省界断面1类*/
let sym_sjdm2 /*省界断面2类*/
let sym_sjdm3 /*省界断面3类*/
let sym_sjdm4 /*省界断面4类*/
let sym_sjdm5 /*省界断面5类*/
let sym_sjdm6 /*省界断面6类*/
let sym_sjdm0 /*省界断面6类*/

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  sym_sngq0 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([255, 255, 255]),
    3
  )
  sym_sngq = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([255, 0, 0]),
    3
  )
  sym_sjdm1 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([0, 153, 255]),
    3
  )
  sym_sjdm2 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([44, 222, 44]),
    3
  )
  sym_sjdm3 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([255, 153, 51]),
    3
  )
  sym_sjdm4 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([245, 50, 50]),
    3
  )
  sym_sjdm5 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([171, 64, 233]),
    3
  )
  sym_sjdm6 = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([48, 48, 48]),
    3
  )
  const task = new GIS.QueryTask(GIS.queryLayer + '/2') //测站索引为0
  const query = new GIS.Query()
  query.where = '1=1'
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
  //定时执行，5秒后执行show()
  window.setInterval(changeGraStyle, 800)
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
  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    gra.isShow = true
    gra.attributes.STCD = gra.attributes.ID
    for (let i = 0; i < size; i++) {
      const item = result[i]
      if (item.WFZ_CD == gra.attributes.STCD) {
        gra.attributes.DB = item.DB
        //水质目标
        gra.attributes.WFZ_WQT1 = GIS.null(item.WFZ_WQT1)
        //水质类别
        gra.attributes.WQG = GIS.null(item.WQG1)
        //是否达标
        gra.attributes.DB = GIS.null(item.DB)
        //主要污染物及超标倍数
        gra.attributes.MESPEST = GIS.null(item.MESPEST)
        //时间
        gra.attributes.TM = GIS.null(item.ASOT)
        gra.attributes.flag = GIS.null(item.flag)
        const level = item.WQG + ''
        switch (level) {
          case '1':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm1)
            } else {
              gra.setSymbol(sym_sjdm1)
            }
            gra.oldStyle = sym_sjdm1
            break
          case '2':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm2)
            } else {
              gra.setSymbol(sym_sjdm2)
            }
            gra.oldStyle = sym_sjdm2
            break
          case '3':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm3)
            } else {
              gra.setSymbol(sym_sjdm3)
            }
            gra.oldStyle = sym_sjdm3
            break
          case '4':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm4)
            } else {
              gra.setSymbol(sym_sjdm4)
            }
            gra.oldStyle = sym_sjdm4
            break
          case '5':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm5)
            } else {
              gra.setSymbol(sym_sjdm5)
            }
            gra.oldStyle = sym_sjdm5
            break
          case '6':
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm6)
            } else {
              gra.setSymbol(sym_sjdm6)
            }
            gra.oldStyle = sym_sjdm6
            break
          default:
            if (item.DB == '达标') {
              gra.setSymbol(sym_sjdm3)
            } else {
              gra.setSymbol(sym_sjdm3)
            }
        }
      }
    }

    gra.attributes.GRATYPE = 'gcxq'
    gra.attributes.SHOWTYPE = 'marker'
    gra.attributes.stnm = gra.attributes.ALIASNAME.trim()
    graphicsLayer.add(gra)
    console.log(gra.attributes.DB)
  }
  //addToMarker();
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  console.log(result)
  if (result.features.length > 0) {
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
    '<br/>目标:' +
    gra.attributes.WFZ_WQT1 +
    '<br/>类别:' +
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
  map.infoWindow.hide()
  map.setMapCursor('default')
}
