//输入式全局检索
const keyid = 0 //图层序列号
const sum = 0 //目录树统计和
let map
let date = [] //将参数赋予全局变量
/**
 *第一时间组装参数
 **/
function mouseStop() {
  //	var searchText = dojo.byId("searchText").value; //输入关键字,IE10不兼容
  const searchText = document.getElementById('searchText').value
  const searchUrl = shouye.backlayer //地图服务地址
  const searchIds = [0, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] //图层序列号
  const searchName = ['NAME'] //搜索字段
  const arry = [searchText, searchUrl, searchIds, searchName]
  date = arry
}
/**
 *关键字搜索地图服务
 **/
function keyFind(keyword) {
  findTask = new GIS.FindTask(date[1])
  findParams = new GIS.FindParameters()
  findParams.returnGeometry = true
  findParams.layerIds = date[2]
  findParams.searchFields = date[3]
  findParams.outSpatialReference = map.spatialReference
  findParams.searchText = keyword
  findTask.execute(findParams, keyResults)
}
function keyResults(results) {
  //	console.log(results);
  const arr = []
  let liHtml = ''
  for (let i = 0; i < results.length; i++) {
    const key = results[i].feature.attributes.STNM
    arr.push(key)
    liHtml += "<li id='li_" + i + "'>" + arr[i] + '</li>'
  }
  document.getElementById('ulItems').innerHTML = liHtml
  //iniEvent();
}
//////////////////////////遍历搜索地图数据/////////////////////////////////////////////////////////////////
function search() {
  mouseStop()
  identityResultLayer.clear()
  findTask = new esri.tasks.FindTask(date[1])
  findParams = new esri.tasks.FindParameters()
  findParams.returnGeometry = true
  findParams.layerIds = date[2]
  findParams.searchFields = date[3]
  findParams.outSpatialReference = map.spatialReference
  findParams.searchText = date[0]
  findTask.execute(findParams, enterShowResults)
}
/**
 * 关键字查询结果
 * @param {} results
 */
function enterShowResults(results) {
  const symbol = new GIS.SimpleMarkerSymbol(
    GIS.SimpleMarkerSymbol.STYLE_CIRCLE,
    12,
    new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_NULL, GIS.Color([247, 34, 101]), 1),
    new GIS.Color([207, 34, 171])
  )
  const lineSymbol = new GIS.SimpleLineSymbol(
    GIS.SimpleLineSymbol.STYLE_DASH,
    new esri.Color([247, 34, 101]),
    2
  )
  const polygonSymbol = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
      new dojo.Color([247, 34, 101]),
      2
    ),
    new dojo.Color([207, 34, 171, 0.25])
  )
  let keyGraphic
  //遍历查询结果
  for (let i = 0; i < results.length; i++) {
    const graphic = results[i].feature
    const getry = graphic.geometry
    const type = graphic.geometry.type
    switch (type) {
      case 'point':
        keyGraphic = new esri.Graphic(getry, symbol)
        break
      case 'polyline':
        keyGraphic = new esri.Graphic(getry, lineSymbol)
        break
      case 'polygon':
        keyGraphic = new esri.Graphic(getry, polygonSymbol)
        break
    }
    //添加属性信息
    keyGraphic.attributes = graphic.attributes
    identityResultLayer.add(keyGraphic)
    /*	truesqLayer.add(keyGraphic);
     */
  }
  if (results.length == 1) {
    //     var centerPoint = results[0].feature.geometry.getCentroid(); //获取多边形中心点
    const centerPoint = results[0].feature.geometry
    map.centerAndZoom(centerPoint, 11)
  }
  //查询结果添加到Tree
  mapToTree(results)
  //   console.log(results);
}
/**
 *输入关键字，按Enter事件
 **/
function keyDown() {
  mouseStop()
  if (event.keyCode == 13) {
    event.returnValue = false
    event.cancel = true
    search()
  }
  console.log('键入查询')
}
function enterClear() {
  $('#layercontrol').css('display', 'none') //点击隐藏
  trsqLayer.clear() //清除上次查询结果
  locatLayer.clear()
}
