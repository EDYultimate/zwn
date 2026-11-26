let symbol_point = null
let symbol_line = null //线状样式
let symbol_fill = null //面状样式
let symbol_line_select = null //线状样式 选中
let symbol_fill_select = null //填充样式选中
let symbol_point_select = null //点选中样式
let selectGra = null //选中的要素
const graArray = [] //
function getByteSize(str) {
  let bytesCount = 0
  if (str != null) {
    for (let i = 0, len = str.length; i < len; i++) {
      const c = str.charAt(i)
      if (/^[\u0000-\u00ff]$/.test(c)) {
        bytesCount += 1
      } else {
        bytesCount += 2
      }
    }
  }
  return bytesCount
}
//请求省市县三级数据
function getData(urlArray, callback) {
  symbol_line = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([24, 148, 156]),
    2
  )
  symbol_line_select = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_SOLID,
    new GIS.Color([255, 0, 0]),
    4
  )
  symbol_fill = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_SOLID, new GIS.Color([24, 148, 156]), 1),
    new GIS.Color([95, 188, 204, 1])
  )
  symbol_fill_select = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_SOLID, new GIS.Color([24, 148, 156]), 4),
    new GIS.Color([95, 188, 204, 1])
  )
  symbol_point_select = new GIS.PictureMarkerSymbol('./img/kaohezhan.png', 24, 24)
  const find = new GIS.FindTask(GIS.config.query_url)
  const findParameters = new GIS.FindParameters()
  findParameters.layerIds = [0, 1]
  findParameters.returnGeometry = true //是否返回几何对象
  findParameters.searchFields = ['type']
  //	findParameters.layerDefinitions[0]="FID > 1";
  //	findParameters.layerDefinitions[1]="FID > 1";
  //	findParameters.layerDefinitions[2]="FID > 1";
  //findParameters.contains = true;
  findParameters.searchText = '0'
  find.execute(findParameters, showResults, errHandler)

  const dataArray = [
    { stcd: 1, river: '滹沱河', stnm: '中线入滹沱河', x: 114.337, y: 38.264 },
    { stcd: 2, river: '滹沱河', stnm: '再生水入滹沱河', x: 114.504, y: 38.144 },
    { stcd: 3, river: '滏阳河', stnm: '盂县补水口', x: 116.048, y: 38.132 },
    { stcd: 4, river: '南拒马河', stnm: '拒马河补水口', x: 115.754, y: 39.338 },
    { stcd: 5, river: '永定河', stnm: '1#洞补水口', x: 116.927, y: 39.371 },
    { stcd: 6, river: '永定河', stnm: '小红门补水口', x: 117.087, y: 39.243 },
    { stcd: 7, river: '七里河-顺水河', stnm: '七里海补水口', x: 116.184, y: 36.723 },
    { stcd: 8, river: '唐河', stnm: '引江补水口', x: 114.261, y: 39.424 },
    { stcd: 9, river: '沙河-潴龙河', stnm: '沙河补水口', x: 117.385, y: 37.43 },
    { stcd: 10, river: '北拒马河-白沟河', stnm: '白沟河补水口', x: 115.863, y: 39.451 },
    { stcd: 11, river: '瀑河', stnm: '瀑河补水口', x: 115.446, y: 39.167 },
    { stcd: 12, river: '泜河', stnm: '泜河补水口', x: 114.189, y: 37.461 },
    { stcd: 13, river: '南运河', stnm: '南运河补水口', x: 116.493, y: 37.862 },
    { stcd: 14, river: '七里海', stnm: '七里海补水口', x: 117.602, y: 39.291 },
    { stcd: 15, river: '大黄堡洼', stnm: '大黄堡洼补水口', x: 117.154, y: 39.524 },
    { stcd: 16, river: '北大港', stnm: '北大港补水口', x: 117.368, y: 38.735 },
    { stcd: 17, river: '团泊洼', stnm: '团泊洼补水口', x: 117.131, y: 38.907 },
    { stcd: 18, river: '白洋淀', stnm: '引江补水口', x: 115.844, y: 38.942 },
    { stcd: 19, river: '衡水湖', stnm: '衡水湖补水口', x: 115.853, y: 37.758 },
    { stcd: 20, river: '南大港', stnm: '南大港补水口', x: 117.117, y: 38.187 },
    { stcd: 21, river: '漳河', stnm: '漳河补水口', x: 114.752, y: 36.207 },
    { stcd: 22, river: '卫河', stnm: '卫河补水口', x: 114.227, y: 35.507 },
    { stcd: 23, river: '潮白河', stnm: '上游水库补水口', x: 116.773, y: 39.931 },
    { stcd: 24, river: '北运河', stnm: '北运河再生水口', x: 116.991, y: 39.563 }
  ]
  addStation(dataArray)
}
function showResults(result) {
  $.getJSON('/hwwr/szybh/ywgz/getSaveWaterGroundWaterNorthDetailInfoGIS', {}, function (res) {
    const dataArray = res.data
    for (let i = 0, len = result.length; i < len; i++) {
      const feature = result[i].feature

      for (let j = 0, len2 = dataArray.length; j < len2; j++) {
        if (feature.attributes.CD == dataArray[j].RV_CD) {
          feature.attributes.HEJI = dataArray[j].HEJI
          feature.attributes.NIANDUJIHUA = dataArray[j].NIANDUJIHUA
          if (result[i].layerId == 0) {
            feature.setSymbol(symbol_line)
            layer_river.add(feature)
          } else {
            feature.setSymbol(symbol_fill)
            layer_lake.add(feature)
          }
          graArray.push(feature)
        }
      }

      //console.log(gra);
    }
    //addStation(res.page.list);
    //addStation(res);
  })

  console.log(result)
}
function errHandler(err) {
  console.log(err)
}
//添加线图层
//添加测站
function addStation(dataArray) {
  for (let i = 0, len = dataArray.length; i < len; i++) {
    const item = dataArray[i]
    const x = parseFloat(item.x)
    const y = parseFloat(item.y)
    const point_icon = new GIS.Point(x, y)
    const symbol = symbol_point
    const layer = layer_kaoheduanmian
    const infolayer = info_kaoheduanmian
    const graphic_icon = new GIS.Graphic(point_icon, symbol, item)
    layer.add(graphic_icon)
    graArray.push(graphic_icon)
  }
}
function addInfoGra(item, infolayer) {
  //添加标签
  const x = parseFloat(item.x)
  const y = parseFloat(item.y)
  const point_info = new GIS.Point(x, y)
  const graphic_info = new GIS.Graphic(point_info)
  const STNM = item.stnm
  //水位
  let content =
    '<div class="info-container2">' + '<div class="info-title2" style="textAlign:center;">'
  content = content + '<span class="info-name" style="textAlign:center;">' + STNM + '</span></div>'
  ;+'</div>'
  graphic_info.setAttributes({
    pos: 'top',
    winW: getByteSize(STNM) * 8 + 20,
    winH: 28,
    offsetY: -10,
    content: content,
    backcolor: '#237bff',
    strokecolor: '#237bff'
  })
  infolayer.add(graphic_info)
}
function addInfoGra2(item, infolayer, point_info) {
  //添加标签
  const graphic_info = new GIS.Graphic(point_info)
  const HEJI = item.HEJI || '-'
  const NIANDUJIHUA = item.NIANDUJIHUA || '-'
  let per = '-'
  if (item.HEJI && item.NIANDUJIHUA && item.NIANDUJIHUA != 0) {
    per = parseInt((parseFloat(item.HEJI) / parseFloat(item.NIANDUJIHUA)) * 100)
  }
  const STNM = item.ENNM
  const info_content_label1 = '年累计补水: '
  const info_content_label2 = '计划补水量: '
  const info_content_label3 = '完成率: '
  const info_content_value1 = HEJI + '亿m³'
  const info_content_value2 = NIANDUJIHUA + '亿m³'
  const info_content_value3 = per + '%'

  //水位
  let content = '<div class="info-container">' + '<div class="info-title">'
  if (item.WDBNUM > 0) {
    content = content + '<img src="img/infologo.png"  class="info-logo"/>'
  }
  //		+'<img src="img/infologo.png"  class="info-logo"/>'
  content =
    content +
    '<span class="info-name">' +
    STNM +
    '</span></div>' +
    '<div class="info-content"><span>' +
    info_content_label1 +
    '<span class="info-value">' +
    info_content_value1 +
    '</span></div>' +
    '<div class="info-content">' +
    info_content_label2 +
    '<span class="info-value">' +
    info_content_value2 +
    '</span></div>'
  content =
    content +
    '<div class="info-content">' +
    info_content_label3 +
    '<span class="info-value"> ' +
    info_content_value3 +
    '</span></div>' +
    '</div>'

  graphic_info.setAttributes({ pos: 'top', winW: 210, winH: 110, offsetY: -10, content: content })
  infolayer.add(graphic_info)
}

//初始化样式
function initStyle() {
  symbol_point = new GIS.PictureMarkerSymbol('./img/kaohezhan.png', 18, 18)
}
function popGra(event) {
  const gra = event.graphic
  info_pop.clear()
  addInfoGra(gra.attributes, info_pop)
  selectGra = gra
}
//河流和湖泊弹窗
function popGra2(event) {
  const gra = event.graphic
  const point = event.mapPoint
  info_pop.clear()
  addInfoGra2(gra.attributes, info_pop, point)
  if (gra.geometry.type == 'polyline') {
    gra.setSymbol(symbol_line_select)
  } else {
    gra.setSymbol(symbol_fill_select)
  }
  selectGra = gra
}
function hidePop(event) {
  if (!selectGra) {
    return
  }
  const gra = selectGra
  info_pop.clear()
  if (gra.geometry.type == 'polyline') {
    gra.setSymbol(symbol_line)
  } else if (gra.geometry.type == 'polygon') {
    gra.setSymbol(symbol_fill)
  } else {
    gra.setSymbol(symbol_point)
  }
}
/**
 * 定位
 * @param stcd
 */
function locate(stcd) {
  for (let i = 0; i < graArray.length; i++) {
    const gra = graArray[i]
    const cd = gra.attributes.CD || gra.attributes.STCD || gra.attributes.stcd
    if (cd == stcd) {
      if (gra.geometry.type == 'polyline') {
        gra.setSymbol(symbol_line_select)
        map.setExtent(gra.geometry.getExtent().expand(2))
      } else if (gra.geometry.type == 'polygon') {
        gra.setSymbol(symbol_fill_select)
        map.setExtent(gra.geometry.getExtent().expand(2))
      } else {
        gra.setSymbol(symbol_point_select)
        map.centerAt(gra.geometry)
      }
      selectGra = gra
    }
  }
}
function clickHandler(event) {
  const gra = event.graphic
  const cd = gra.attributes.CD || gra.attributes.STCD || gra.attributes.stcd
  const nm = gra.attributes.ENNM || gra.attributes.stnm || gra.attributes.STNM
  parent.divClick(nm, cd)
}
