//请求省市县三级数据
function getData(urlArray, callback) {
  const dataArray = [
    {
      stcd: '1',
      stnm: '黄淮地区',
      x: 115.979,
      y: 36.526
    },
    {
      stcd: '2',
      stnm: '鄂尔多斯台地',
      x: 116.341,
      y: 42.227
    },
    {
      stcd: '3',
      stnm: '汾渭谷地',
      x: 113.847,
      y: 39.667
    }
  ]
  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i]
    addInfoGra(item, info_pop)
  }
}
function addInfoGra(item, infolayer) {
  //添加标签
  const x = parseFloat(item.x)
  const y = parseFloat(item.y)
  const point_info = new GIS.Point(x, y)
  const graphic_info = new GIS.Graphic(point_info)
  const stcd = item.stcd
  const STNM = item.stnm
  if (stcd == '1') {
    var content = '<div class="info-container">' + '<div class="info-title">'
    content =
      content +
      '<span class="info-name">' +
      STNM +
      '</span></div>' +
      '<div class="content"><span class="label1">负责流域机构：</span><span class="value1">淮委</span><span class="label2">配合流域机构：</span><span class="value1">海委</span></div>' +
      '<div class="content"><span class="label1">涉及行政区：</span><span class="value2">山东省:</span><span class="value3">德州市、聊城市</span></div>' +
      '<div class="content"><span class="label3">涉及行政区：</span><span class="value2">河南省:</span><span class="value3">安阳市、鹤壁市、新乡市、濮阳市</span></div>' +
      '</div>'
    graphic_info.setAttributes({ pos: 'top', winW: 350, winH: 110, offsetY: -10, content: content })
    infolayer.add(graphic_info)
  } else if (stcd == '2') {
    var content = '<div class="info-container">' + '<div class="info-title">'
    content =
      content +
      '<span class="info-name">' +
      STNM +
      '</span></div>' +
      '<div class="content"><span class="label1">负责流域机构：</span><span class="value1">黄委</span><span class="label2">配合流域机构：</span><span class="value1">海委</span></div>' +
      '<div class="content"><span class="label1">涉及行政区：</span><span class="value2">内蒙古自治区:</span><span class="value3">乌兰察布市、锡林郭勒盟</span></div>' +
      '</div>'
    graphic_info.setAttributes({ pos: 'top', winW: 350, winH: 90, offsetY: -10, content: content })
    infolayer.add(graphic_info)
  } else if (stcd == '3') {
    var content = '<div class="info-container">' + '<div class="info-title">'
    content =
      content +
      '<span class="info-name">' +
      STNM +
      '</span></div>' +
      '<div class="content"><span class="label1">负责流域机构：</span><span class="value1">黄委</span><span class="label2">配合流域机构：</span><span class="value1">海委</span></div>' +
      '<div class="content"><span class="label1">涉及行政区：</span><span class="value2">山西省:</span><span class="value3">太原市、大同市、长治市、晋中市</span></div>' +
      '</div>'
    graphic_info.setAttributes({ pos: 'top', winW: 350, winH: 90, offsetY: -10, content: content })
    infolayer.add(graphic_info)
  }
}
