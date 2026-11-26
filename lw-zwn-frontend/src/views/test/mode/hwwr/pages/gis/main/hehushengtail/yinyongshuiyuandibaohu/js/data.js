let symbol_hedao = null
let symbol_dixiashui = null
var symbol_shuiku = null
let symbol_hedao_shan = null
let symbol_dixiashui_shan = null
var symbol_shuiku = null

let symbol_locate = null

const symbol_point = null
let symbol_line = null //线状样式
let symbol_fill = null //面状样式
let symbol_line_select = null //线状样式 选中
let symbol_fill_select = null //填充样式选中
const symbol_point_select = null //点选中样式
let selectGra = null //选中的要素
const graArray = []
let dataArray2 = []
//请求省市县三级数据
function getData(urlArray, callback) {
  //加载省
  //	$.getJSON('../../../common/js/data/query_province.json',function(result){
  //		provinceArray=result.features;
  //		i=i+1;
  //		if(i==3){
  //			callback();
  //		}
  //	});
  //	//加载市
  //	$.getJSON('../../../common/js/data/query_citynew.json',function(result){
  //		cityArray=result.features;
  //		i=i+1;
  //		if(i==3){=====
  //			callback();
  //		}
  //	});
  //	//加载县
  //	$.getJSON('../../../common/js/data/query_townnew.json',function(result){
  //		townArray=result.features;
  //		i=i+1;
  //		if(i==3){
  //			callback();
  //		}
  //	});
  dataArray2 = [
    {
      stcd: '111111111123',
      ENNM: '承德市二水厂水源地',
      TYPE: '地下水源地',
      x: 117.906,
      y: 40.9013
    },
    {
      stcd: '111111111124',
      ENNM: '承德市双滦自来水公司水源地',
      TYPE: '地下水源地',
      x: 117.768,
      y: 40.9608
    },
    {
      stcd: '111111111122',
      ENNM: '张家口市北水源水源地',
      TYPE: '地下水源地',
      x: 114.982,
      y: 40.9037
    },
    {
      stcd: '111111111121',
      ENNM: '张家口市腰站堡水源地',
      TYPE: '地下水源地',
      x: 114.818,
      y: 40.7038
    },
    { stcd: '111111111120', ENNM: '张家口市样台水源地', TYPE: '地下水源地', x: 114.97, y: 40.6205 },
    {
      stcd: '111111111119',
      ENNM: '张家口市旧李宅水源地',
      TYPE: '地下水源地',
      x: 115.027,
      y: 40.5919
    },
    { stcd: '110229000002', ENNM: '白河堡水库水源地', TYPE: '水库', x: 116.16, y: 40.6181 },
    {
      stcd: '111111111113',
      ENNM: '北京市顺义区第三水源地',
      TYPE: '地下水源地',
      x: 116.667,
      y: 40.2398
    },
    {
      stcd: '111111111110',
      ENNM: '北京市自来水集团第二水厂水源地',
      TYPE: '地下水源地',
      x: 116.438,
      y: 39.9495
    },
    {
      stcd: '111111111112',
      ENNM: '北京市自来水集团第八水厂水源地',
      TYPE: '地下水源地',
      x: 116.705,
      y: 40.2398
    },
    {
      stcd: '111111111111',
      ENNM: '北京市自来水集团第三水厂水源地',
      TYPE: '地下水源地',
      x: 116.283,
      y: 39.9424
    },
    {
      stcd: '111111111115',
      ENNM: '唐山市北郊水厂水源地',
      TYPE: '地下水源地',
      x: 118.21,
      y: 39.7068
    },
    { stcd: '120000000001', ENNM: '于桥-尔王庄水库水源地', TYPE: '水库', x: 117.37, y: 39.4213 },
    { stcd: '111111111125', ENNM: '廊坊市城区水源地', TYPE: '地下水源地', x: 116.72, y: 39.495 },
    { stcd: '111111111128', ENNM: '朔州市耿庄水源地', TYPE: '地下水源地', x: 112.513, y: 39.4403 },
    { stcd: '111111111129', ENNM: '忻州市豆罗水源地', TYPE: '地下水源地', x: 112.732, y: 38.3124 },
    { stcd: '140321000004', ENNM: '阳泉市娘子关', TYPE: '地下水源地', x: 113.862, y: 37.9793 },
    {
      stcd: '111111111114',
      ENNM: '石家庄市滹沱河地下水水源地',
      TYPE: '地下水源地',
      x: 114.555,
      y: 38.0935
    },
    {
      stcd: '111111111126',
      ENNM: '衡水市自来水公司水源地',
      TYPE: '地下水源地',
      x: 115.695,
      y: 37.6723
    },
    { stcd: '111111111138', ENNM: '三角洼水库水源地', TYPE: '水库', x: 117.74, y: 37.9885 },
    { stcd: '111111111133', ENNM: '庆云水库水源地', TYPE: '水库', x: 117.546, y: 37.9142 },
    { stcd: '111111111137', ENNM: '思源湖水库水源地', TYPE: '水库', x: 118.07, y: 37.7506 },
    { stcd: '111111111140', ENNM: '仙鹤湖水库水源地', TYPE: '水库', x: 117.647, y: 37.6614 },
    { stcd: '111111111141', ENNM: '幸福水库水源地', TYPE: '水库', x: 117.564, y: 37.6257 },
    { stcd: '111111111135', ENNM: '杨安镇水库水源地', TYPE: '水库', x: 117.148, y: 37.6227 },
    { stcd: '111111111139', ENNM: '孙武湖水库水源地', TYPE: '水库', x: 117.567, y: 37.4918 },
    { stcd: '111111111142', ENNM: '西海水库水源地', TYPE: '水库', x: 117.82, y: 37.3907 },
    { stcd: '111111111143', ENNM: '滨州市东郊水库水源地', TYPE: '水库', x: 118.094, y: 37.4175 },
    { stcd: '111111111131', ENNM: '清源湖水库水源地', TYPE: '水库', x: 117.029, y: 37.1468 },
    { stcd: '111111111134', ENNM: '丁东水库水源地', TYPE: '水库', x: 116.428, y: 37.2925 },
    { stcd: '111111111132', ENNM: '相家河水库水源地', TYPE: '水库', x: 116.297, y: 37.0724 },
    {
      stcd: '111111111136',
      ENNM: '聊城市东聊供水水源地',
      TYPE: '地下水源地',
      x: 115.97,
      y: 36.4627
    },
    {
      stcd: '111111111147',
      ENNM: '焦作市城区地下水水源地',
      TYPE: '地下水源地',
      x: 113.272,
      y: 35.2522
    },
    { stcd: '111111111146', ENNM: '盘石头水库水源地', TYPE: '水库', x: 113.95, y: 35.8411 },
    { stcd: '111111111144', ENNM: '弓上水库水源地', TYPE: '水库', x: 113.668, y: 35.9452 },
    {
      stcd: '111111111145',
      ENNM: '安阳市洹河地下水水源地',
      TYPE: '地下水源地',
      x: 114.132,
      y: 36.1415
    },
    {
      stcd: '111111111127',
      ENNM: '长冶市辛安泉水源地',
      TYPE: '地下水源地',
      x: 113.427,
      y: 36.3943
    },
    {
      stcd: '111111111116',
      ENNM: '邯郸市羊角铺水源地',
      TYPE: '地下水源地',
      x: 114.215,
      y: 36.4776
    },
    {
      stcd: '111111111117',
      ENNM: '邢台市桥西董村水厂水源地',
      TYPE: '地下水源地',
      x: 114.42,
      y: 37.0457
    },
    {
      stcd: '111111111118',
      ENNM: '保定市一亩泉水源地',
      TYPE: '地下水源地',
      x: 115.424,
      y: 38.9367
    },
    {
      stcd: '111111111130',
      ENNM: '锡林郭勒盟一棵树-东苗圃水源地',
      TYPE: '地下水源地',
      x: 116.202,
      y: 43.8772
    },
    { stcd: '0C0000000001', ENNM: '潘家口-大黑汀水库水源地', TYPE: '水库', x: 118.28, y: 40.3882 },
    { stcd: '130927000001', ENNM: '大浪淀水库水源地', TYPE: '水库', x: 116.873, y: 38.1057 },
    { stcd: '130205000002', ENNM: '陡河水库水源地', TYPE: '水库', x: 118.297, y: 39.7653 },
    { stcd: '130131000001', ENNM: '岗南水库水源地', TYPE: '水库', x: 113.952, y: 38.3329 },
    { stcd: '110116000001', ENNM: '怀柔水库水源地', TYPE: '水库', x: 116.607, y: 40.3173 },
    { stcd: '130185000001', ENNM: '黄壁庄水库水源地', TYPE: '水库', x: 114.261, y: 38.2642 },
    { stcd: '110116000004', ENNM: '密云水库水源地', TYPE: '水库', x: 116.945, y: 40.5061 },
    { stcd: '130303000001', ENNM: '石河水库水源地', TYPE: '水库', x: 119.687, y: 40.0436 },
    {
      stcd: '130321000003',
      ENNM: '桃林口水库水源地（含洋河水库水源）',
      TYPE: '水库',
      x: 119.039,
      y: 40.2437
    },
    { stcd: '130627000001', ENNM: '西大洋水库水源地', TYPE: '水库', x: 114.768, y: 38.7563 },
    { stcd: '130303000001', ENNM: '石河水库水源地', TYPE: '水库', x: 114.447, y: 38.7533 },
    { stcd: '130924000001', ENNM: '杨埕水库水源地', TYPE: '水库', x: 117.713, y: 38.1554 },
    { stcd: '130427000001', ENNM: '岳城水库水源地', TYPE: '水库', x: 114.172, y: 36.286 }
  ]
  const find = new GIS.FindTask(GIS.config.query_url)
  const findParameters = new GIS.FindParameters()
  findParameters.layerIds = [2]
  findParameters.returnGeometry = true //是否返回几何对象
  findParameters.searchFields = ['ENNM']
  //	findParameters.layerDefinitions[0]="FID > 1";
  //	findParameters.layerDefinitions[1]="FID > 1";
  //	findParameters.layerDefinitions[2]="FID > 1";
  findParameters.contains = true
  findParameters.searchText = '水源地'
  //	find.execute(findParameters, showResults,errHandler);
  $.getJSON('/hwwr/szybh/ywgz/getSaveWaterDrinkProtectGis', {}, function (res) {
    addStation(res)
  })
}
function showResults(result) {
  $.getJSON('/hwwr/szybh/ywgz/getSaveWaterDrinkProtectGis', {}, function (res) {
    const dataArray = res
    for (var i = 0, len = result.length; i < len; i++) {
      const feature = result[i].feature
      for (var j = 0, len2 = dataArray.length; j < len2; j++) {
        if (feature.attributes.ENNM == dataArray[j].SWS_NM) {
          feature.setSymbol(symbol_line)
          feature.attributes = dataArray[j]
          layer_hedao.add(feature)
          graArray.push(feature)
        }
      }

      //console.log(gra);
    }
    for (var m = 0, len = dataArray2.length; m < len; m++) {
      for (var n = 0, len2 = dataArray.length; n < len2; n++) {
        if (dataArray2[m].stcd == dataArray[n].SWS_CD) {
          dataArray[n].LGTD = dataArray2[m].x
          dataArray[n].LTTD = dataArray2[m].y
        }
      }
    }
    addStation(dataArray)
    //addStation(res);
  })

  console.log(result)
}
function errHandler(err) {
  console.log(err)
}
//添加测站
function addStation(dataArray) {
  for (let i = 0, len = dataArray.length; i < len; i++) {
    const item = dataArray[i]
    const x = parseFloat(item.LGTD)
    const y = parseFloat(item.LTTD)
    const point_icon = new GIS.Point(x, y)
    let symbol = symbol_hedao
    let layer = symbol_hedao
    let infolayer = info_hedao
    //判断类型ST_TP:断面类型:测站类型：1、考核断面；2、管理断面；3、考核、管理断面；4、计算断面
    if (item.SWS_TP == '3' && item.MAX_WQG2 > '3') {
      symbol = symbol_hedao_shan
      layer = layer_hedao
      infolayer = info_hedao
    } else if (item.SWS_TP == '3') {
      symbol = symbol_hedao
      layer = layer_hedao
      infolayer = info_hedao
    } else if (item.SWS_TP == '2' && item.MAX_WQG2 > '3') {
      symbol = symbol_dixiashui_shan
      layer = layer_dixiashui
      infolayer = info_dixiashui
    } else if (item.SWS_TP == '2') {
      symbol = symbol_dixiashui
      layer = layer_dixiashui
      infolayer = info_dixiashui
    } else if (item.SWS_TP == '1' && item.MAX_WQG2 > '3') {
      symbol = symbol_shuiku_shan
      layer = layer_shuiku
      infolayer = info_shuiku
    } else if (item.SWS_TP == '1') {
      symbol = symbol_shuiku
      layer = layer_shuiku
      infolayer = info_shuiku
    }
    if (item.SWS_CD == '110000000007') {
      continue
    }
    const graphic_icon = new GIS.Graphic(point_icon, symbol, item)
    layer.add(graphic_icon)
    graArray.push(graphic_icon)
  }
}
function addInfoGra(item, infolayer) {
  const typeArray = ['', '水库水源地', '地下水水源地', '河道水源地']
  //添加标签
  const x = parseFloat(item.LGTD)
  const y = parseFloat(item.LTTD)
  const point_info = new GIS.Point(x, y)
  const graphic_info = new GIS.Graphic(point_info)
  const STNM = item.SWS_NM
  const YR = item.YR || '-' //年份
  const ASSESS_RES = item.ASSESS_RES || '-' //抽查评估
  const MAX_WQG = item.MAX_WQG || '-' //水质类别
  const lastMon = item.LASTMON || '-' //
  const LASTYEAR = item.LASTYEAR || '-' //年份
  let content = '<div class="info-container">' + '<div class="info-title">'
  content =
    content +
    '<span class="info-name">' +
    STNM +
    '</span></div>' +
    '<div class="content"><span class="label1">水源地类型：</span><span class="value1">' +
    typeArray[item.SWS_TP] +
    '</span></div>' +
    '<div class="content"><span class="label1">水质类别：</span><span class="value1">' +
    MAX_WQG +
    '（' +
    LASTYEAR +
    '-' +
    lastMon +
    '）</span></div>' +
    '<div class="content"><span class="label1">抽查评估：</span><span class="value1">' +
    ASSESS_RES +
    '</span><span>（' +
    YR +
    '）</span></div>'
  graphic_info.setAttributes({ pos: 'top', winW: 230, winH: 110, offsetY: -10, content: content })
  infolayer.add(graphic_info)
}
function addInfoGra2(item, infolayer, point_info) {
  const typeArray = ['', '水库水源地', '地下水水源地', '河道水源地']
  const graphic_info = new GIS.Graphic(point_info)
  const STNM = item.SWS_NM
  const YR = item.YR || '-' //年份
  const ASSESS_RES = item.ASSESS_RES || '-' //抽查评估
  const MAX_WQG = item.MAX_WQG || '-' //水质类别
  const lastMon = item.LASTMON || '-' //
  const LASTYEAR = item.LASTYEAR || '-' //年份
  let content = '<div class="info-container">' + '<div class="info-title">'
  content =
    content +
    '<span class="info-name">' +
    STNM +
    '</span></div>' +
    '<div class="content"><span class="label1">水源地类型：</span><span class="value1">' +
    typeArray[item.SWS_TP] +
    '</span></div>' +
    '<div class="content"><span class="label1">水质类别：</span><span class="value1">' +
    MAX_WQG +
    '（' +
    LASTYEAR +
    '-' +
    lastMon +
    '）</span></div>' +
    '<div class="content"><span class="label1">抽查评估：</span><span class="value1">' +
    ASSESS_RES +
    '</span><span>（' +
    YR +
    '）</span></div>'
  graphic_info.setAttributes({ pos: 'top', winW: 230, winH: 110, offsetY: -10, content: content })
  infolayer.add(graphic_info)
}
function addInfor(graphics) {
  const pt = new GIS.Point(graphics.geometry.x, graphics.geometry.y)
  const graphic = new GIS.Graphic(pt)
  graphic.setAttributes({
    pos: 'rt',
    winW: 125,
    winH: 60,
    offsetY: -10,
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
//初始化样式
function initStyle() {
  symbol_hedao = new GIS.PictureMarkerSymbol('./img/hedao.png', 18, 18)
  symbol_dixiashui = new GIS.PictureMarkerSymbol('./img/dixiashui.png', 18, 18)
  symbol_shuiku = new GIS.PictureMarkerSymbol('./img/shuiku.png', 18, 18)
  symbol_hedao_shan = new GIS.PictureMarkerSymbol('./img/hedao1.gif', 18, 18)
  symbol_dixiashui_shan = new GIS.PictureMarkerSymbol('./img/dixiashui1.gif', 18, 18)
  symbol_shuiku_shan = new GIS.PictureMarkerSymbol('./img/shuiku1.gif', 18, 18)
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
  symbol_locate = new GIS.PictureMarkerSymbol('./img/find.gif', 21, 21)
}
function popGra(event) {
  console.log('mouseup')
  const gra = event.graphic
  info_pop.clear()
  //判断是否需要标签
  addInfoGra(gra.attributes, info_pop)
}
//河流和湖泊弹窗
function popGra2(event) {
  const gra = event.graphic
  const point = event.mapPoint
  info_pop.clear()
  addInfoGra2(gra.attributes, info_pop, point)
  //	if(gra.geometry.type=="polyline"){
  //		gra.setSymbol(symbol_line_select);
  //	}
  //	else{
  //		gra.setSymbol(symbol_fill_select);
  //	}
  selectGra = gra
}
function hidePop(event) {
  info_pop.clear()
  if (!selectGra) {
    return
  }
  const gra = selectGra

  //	if(gra.geometry.type=="polyline"){
  //		gra.setSymbol(symbol_line);
  //	}
  //	else if(gra.geometry.type=="polygon"){
  //		gra.setSymbol(symbol_fill);
  //	}
  //	else{
  //		gra.setSymbol(symbol_point);
  //	}
}
/**
 * 定位
 * @param stcd
 */
function locate(stcd) {
  locateLayer.clear()
  for (let i = 0; i < graArray.length; i++) {
    const gra = graArray[i]
    const cd = gra.attributes.SWS_CD || gra.attributes.STCD || gra.attributes.stcd
    if (cd + '' == stcd + '') {
      if (gra.geometry.type == 'polyline') {
        gra.setSymbol(symbol_line_select)
        map.setExtent(gra.geometry.getExtent().expand(2))
        selectGra = gra
      } else if (gra.geometry.type == 'polygon') {
        gra.setSymbol(symbol_fill_select)
        map.setExtent(gra.geometry.getExtent().expand(2))
        selectGra = gra
      } else {
        map.centerAt(gra.geometry)
        const gra0 = new GIS.Graphic(new GIS.Point(gra.geometry.x, gra.geometry.y))
        //gra.attributes.GRATYPE=type;
        gra0.setSymbol(symbol_locate)

        locateLayer.add(gra0)
      }
    }
  }
}
function clickHandler(event) {
  const gra = event.graphic
  const cd = gra.attributes.SWS_CD || gra.attributes.STCD || gra.attributes.stcd
  const nm = gra.attributes.SWS_NM || gra.attributes.stnm || gra.attributes.STNM
  parent.do_support(nm, cd)
}
