let symbol_kaohezhan = null
let symbol_locate = null
let dataArray = []
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
  $.getJSON('/hwwr/szybh/ywgz/getSaveWaterWaterEnvBelowDetailGis', {}, function (res) {
    console.log(res)

    addStation(res.page.list)
    dataArray = res.page.list //赋值给全局变量用于定位
    //addStation(res);
  })
  //	var dataArray=[
  //{"stcd":1,"stnm":"南仁孚村","loc":"大口屯镇南仁孚村南100米","x":117.1896,"y":39.62563333,"city":"天津市"},
  //{"stcd":2,"stnm":"马家店","loc":"原马家店乡政府院内","x":117.2708,"y":39.65918333,"city":"天津市"},
  //{"stcd":3,"stnm":"新开口村","loc":"新开口镇新开口村南100米","x":117.1852333,"y":39.6865,"city":"天津市"},
  //{"stcd":4,"stnm":"西郝村","loc":"郝各庄镇西郝村西南500米","x":117.3101333,"y":39.63161667,"city":"天津市"},
  //{"stcd":5,"stnm":"吴家牌村","loc":"牛家牌乡吴家牌村中","x":117.4905667,"y":39.87876667,"city":"天津市"},
  //{"stcd":363,"stnm":"长店","loc":"朝阳区长店","x":116.5264,"y":39.9982,"city":"北京市"},
  //{"stcd":364,"stnm":"试验场","loc":"朝阳区试验场","x":116.5199,"y":39.8739,"city":"北京市"},
  //{"stcd":365,"stnm":"西坝","loc":"朝阳区西坝","x":116.5239,"y":39.9712,"city":"北京市"},
  //{"stcd":366,"stnm":"黄港","loc":"朝阳区黄港","x":116.4897,"y":40.0595,"city":"北京市"},
  //{"stcd":367,"stnm":"马泉营","loc":"朝阳区马泉营","x":116.5057,"y":40.0384,"city":"北京市"},
  //
  //];
  //addStation(dataArray);
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
  const x = parseFloat(item.LGTD)
  const y = parseFloat(item.LTTD)
  const point_info = new GIS.Point(x, y)
  const graphic_info = new GIS.Graphic(point_info)
  const STNM = item.STNM
  const info_content_label1 = '监测站类型'
  const info_content_label2 = '所在行政区'
  const info_content_label3 = '水质类别'
  const info_content_value1 = '专用监测井'
  const info_content_value2 = item.ADDVCD
  const info_content_value3 = item.WQ_VAL + '（' + item.M_DATE + '）'

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
    '：<span class="info-value">' +
    info_content_value1 +
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

  graphic_info.setAttributes({ pos: 'top', winW: 210, winH: 110, offsetY: -10, content: content })
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
