let symbol_kaohezhan = null
let symbol_locate = null
let dataArray = []
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
  //		if(i==3){
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
  $.getJSON('/hwwr/szybh/ywgz/getSaveWaterWaterEnvAboveDetailGis', {}, function (res) {
    console.log(res)

    addStation(res.page.list)
    dataArray = res.page.list //赋值给全局变量用于定位
    //addStation(res);
  })
  //	var dataArray=[
  //{"stnm":"库心","symc":"岳城水库","loc":"岳城水库2号断面水流区","x":114.2166667,"y":36.35,"city":"天津市"},
  //{"stnm":"乌龙矶","symc":"潘家口水库","loc":"河北承德乌龙矶","x":118.1333333,"y":40.7,"city":"承德市"},
  //{"stnm":"燕子峪","symc":"潘家口水库","loc":"河北省宽城潘家口水库燕子峪","x":118.3,"y":40.46666667,"city":"承德市"},
  //{"stnm":"洒河桥","symc":"大黑汀水库","loc":"河北迁西汉儿庄","x":118.2333333,"y":40.38333333,"city":"唐山市"},
  //{"stnm":"密云水库【白河主坝】","symc":"密云水库","loc":"北京市密云县密云水库白河主坝（坝上）","x":116.8,"y":40.46666667,"city":"北京市"},
  //{"stnm":"官厅水库【永1000表】","symc":"官厅水库","loc":"北京市官厅水库主坝上","x":115.55,"y":40.25,"city":"北京市"},
  //{"stnm":"陡河水库","symc":"陡河水库","loc":"河北省唐山市双桥乡冶里","x":118.3,"y":39.71666667,"city":"唐山市"},
  //{"stnm":"洋河水库","symc":"洋河水库","loc":"河北省抚宁县田各庄大湾子","x":119.2166667,"y":39.98333333,"city":"秦皇岛市"},
  //{"stnm":"邱庄水库","symc":"邱庄水库","loc":"河北省丰润县左家坞才庄","x":118.2,"y":40,"city":"唐山市"},
  //{"stnm":"桃林口","symc":"桃林口水库","loc":"河北省卢龙县桃林口","x":119.0333333,"y":40.13333333,"city":"秦皇岛市"},
  //{"stnm":"大浪淀","symc":"大浪淀","loc":"河北省沧州南皮县","x":116.7833333,"y":38.06666667,"city":"沧州市"},
  //{"stnm":"于桥水库【坝上】","symc":"于桥水库","loc":"蓟县于桥水库","x":117.4333333,"y":40.03333333,"city":"天津市"},
  //{"stnm":"于桥水库【库心】","symc":"于桥水库","loc":"蓟县于桥水库","x":117.5333333,"y":40.03333333,"city":"天津市"},
  //{"stnm":"尔王庄水库【库心】","symc":"尔王庄水库","loc":"宝坻县尔王庄水库","x":117.3666667,"y":39.41666667,"city":"天津市"},
  //
  //]
}
//添加测站
function addStation(dataArray) {
  for (let i = 0, len = dataArray.length; i < len; i++) {
    const item = dataArray[i]
    const x = parseFloat(item.LGTD)
    const y = parseFloat(item.LTTD)
    const point_icon = new GIS.Point(x, y)
    const symbol = symbol_kaohezhan
    const layer = layer_kaoheduanmian
    const infolayer = info_kaoheduanmian
    const graphic_icon = new GIS.Graphic(point_icon, symbol, item)
    layer.add(graphic_icon)
  }
}
function addInfoGra(item, infolayer) {
  //添加标签
  const x = parseFloat(item.x)
  const y = parseFloat(item.y)
  const point_info = new GIS.Point(x, y)
  const graphic_info = new GIS.Graphic(point_info)
  const STNM = item.stnm
  const info_content_label1 = '监测站类型'
  const info_content_label2 = '所在行政区'
  const info_content_label3 = '水质类别'
  const info_content_value1 = '专用监测井'
  const info_content_value2 = item.ADDVCD
  const info_content_value3 = item.WQ_VAL

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
    '<div class="info-content">' +
    info_content_label2 +
    '：<span class="info-value">' +
    info_content_value2 +
    '</span></div>'
  content =
    content +
    '<div class="info-content">' +
    info_content_label3 +
    '：<span class="info-value"> ' +
    info_content_value3 +
    '</span></div>' +
    '</div>'

  graphic_info.setAttributes({ pos: 'top', winW: 210, winH: 80, offsetY: -10, content: content })
  infolayer.add(graphic_info)
}

//初始化样式
function initStyle() {
  symbol_kaohezhan = new GIS.PictureMarkerSymbol('./img/kaohezhan.png', 18, 18)
  symbol_locate = new GIS.PictureMarkerSymbol('./img/find.gif', 21, 21)
}
function popGra(event) {
  console.log('mouseup')
  const gra = event.graphic
  info_pop.clear()
  addInfoGra(gra.attributes, info_pop)
}
function hidePop(event) {
  console.log('mouseout')
  info_pop.clear()
}
/**
 * 定位
 * @param stcd
 */
function locate(stcd) {
  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i]
    const cd = item.ID || item.stcd || item.STCD
    if (cd == stcd) {
      map.centerAt([item.LGTD, item.LTTD])
      const gra = new GIS.Graphic(new GIS.Point(item.LGTD, item.LTTD))
      //gra.attributes.GRATYPE=type;
      gra.setSymbol(symbol_locate)
      locateLayer.clear()
      locateLayer.add(gra)
    }
  }
}
