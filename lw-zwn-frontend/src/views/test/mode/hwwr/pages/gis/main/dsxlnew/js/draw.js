/**
 * @creator fjl
 * @date 2018/4/26
 * @desp 巡查gps轨迹点
 */

let ptSymbol //点样式

let lineSymbol //线样式

let basicSymbol //带箭头线样式

let timer1 //定时器

let feaArr //存储查询结果

let feaArrLine //存储查询结果

let feaCount //数量

let feaResult //存储查询结果

let feaInx //查询索引 用于定时查找对应要素

let lineInx //查询索引 用于定时查找对应线

let lineStInx //起点id计算 便于重新开始绘制线路

let breakInx //中断点 暂时不绘制

const sfPt = true

let lyrurl

let directionalSymbols = []

/**
 * 启动计时器
 */
function start() {
  timer1 = window.setInterval(showFea, 100)
}

/**
 * 结束计时器
 */
function stop() {
  console.log('timer stop:' + timer1)
  if (timer1) {
    window.clearInterval(timer1)
  }
}

/*
 *定时演示点和线
 *线先出 后出点
 */
function showFea() {
  //console.log(feaInx);
  if (feaInx >= feaArr.length) {
    stop()
  } else {
    initGraphicLayer.clear() //默认先清空
    const graphic = new GIS.Graphic(feaArr[feaInx]) //feaArr[feaInx];
    graphic.setSymbol(ptSymbol)
    initGraphicLayer.add(graphic)
    feaInx++
    lineStInx++
    /*if(feaInx==1)
          				 {
          				   return;
          				 }*/

    if (!feaArrLine[lineInx] || lineStInx >= feaArrLine[lineInx].length) {
      console.log('changePPT')
      breakInx = 0
      lineInx++ //重新开始换一个线段重新绘制线段
      lineStInx = 1
      console.log('lineInx:' + lineInx)
      return
    }

    if (lyrInx == 0 && lineInx == feaArrLine.length - 1 && breakInx < 1) //南水北调
    {
      breakInx++
      return
    }
    if (lyrInx == 6 && lineInx == feaArrLine.length - 1 && breakInx < 3) //岳城水库日常
    {
      breakInx++
      return
    }
    const pt1 = feaArr[feaInx - 1] //.geometry;
    const pt2 = feaArr[feaInx] //.geometry;

    const firstCuttingLine = new esri.geometry.Polyline() //GIS.MAP.spatialReference);
    firstCuttingLine.addPath([pt1, pt2])

    const spatialReference = new GIS.SpatialReference({ wkid: 4326 })
    firstCuttingLine.setSpatialReference(spatialReference)
    const att = { CD: dsnm }
    const lineGra = new esri.Graphic(firstCuttingLine, basicSymbol, att) //lineSymbol);

    initLineLayer.add(lineGra)
  }
}

/*
 *
 * 初始化箭头显示
 */
function initLineArrow(time) {
  console.log('initLineArrow')
  //lyrurl=GIS.zhuantiUrl+"/"+time.toString();//获取对应图层urlGIS.AniUrl
  lyrurl = GIS.AniUrl + '/' + time.toString()
  directionalSymbols = []

  initGraphicLayer.clear()
  initLineLayer.clear()
  GetLineSymbol2()
  queryTaskXcgjArrow()
}

/**
 * 获得监测站数据 针对箭头展示
 * @param args
 */
function queryTaskXcgjArrow() {
  let queryTask
  queryTask = new esri.tasks.QueryTask(lyrurl) //shouye.backlayer+"/17");
  //查询参数
  query = new esri.tasks.Query()
  //设置查询坐标系
  query.outSpatialReference = map.spatialReference
  //query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_CONTAINS;
  //需要返回Geometry
  query.returnGeometry = true
  //需要返回的字段
  query.outFields = ['*'] //["STCD","STNM"]; //["*"]
  //查询条件
  query.where = '1=1' // ["1=1"];
  //进行查询，完成后调用showResults方法
  queryTask.execute(query, xcResultsArrow, showError)
}

/**
 * 针对箭头展示
 */
function xcResultsArrow(results) {
  for (let i = 0; i < results.features.length; i++) {
    const line = results.features[i].geometry
    const lineGra = new esri.Graphic(line, basicSymbol) //lineSymbol);
    initLineLayer.add(lineGra)
  }

  //map.centerAndZoom(centerPoint,zom);
  //basicSymbol.stopAnimation();//开始展示动画
  //basicSymbol.animateDirection(Infinity, 250);
  //directionalSymbols[i].stopAnimation();
  //directionalSymbols[i].animateDirection(repeat, this.value);
}

function initLineAni(time) {
  if (timer1) {
    window.clearInterval(timer1)
  }
  console.log('initLineAni')
  //lyrurl=GIS.zhuantiUrl+"/"+time.toString();//获取对应图层urlGIS.AniUrl
  lyrurl = GIS.AniUrl + '/' + time.toString()
  initGraphicLayer.clear()
  initLineLayer.clear()

  ptSymbol = new GIS.PictureMarkerSymbol('img/find.gif', 18, 18)
  lineSymbol = new esri.symbol.CartographicLineSymbol(
    esri.symbol.CartographicLineSymbol.STYLE_SOLID,
    new dojo.Color('#99FF00'),
    5,
    esri.symbol.CartographicLineSymbol.CAP_ROUND,
    esri.symbol.CartographicLineSymbol.JOIN_MITER,
    5
  )
  GetLineSymbol2() //获取线样式

  /*在线绘制测站图层*/
  //initGraphicLayer.on("click",clickGraphicHandler);
  //initGraphicLayer.on("mouse-over",overGraphicHandler);
  //initGraphicLayer.on("mouse-out",outGraphicHandler);

  /*要素单击事件*/
  function clickGraphicHandler(event) {
    stationClick(event)
  }
  /*移动到要素上触发*/
  function overGraphicHandler(event) {
    map.setMapCursor('pointer')
  }
  function outGraphicHandler() {
    map.setMapCursor('default')
  }

  queryTaskXcgj()
}

/**
 * 获得监测站数据
 * @param args
 */
function queryTaskXcgj() {
  let queryTask
  queryTask = new esri.tasks.QueryTask(lyrurl) //shouye.backlayer+"/17");
  //查询参数
  query = new esri.tasks.Query()
  //设置查询坐标系
  query.outSpatialReference = map.spatialReference
  //query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_CONTAINS;
  //需要返回Geometry
  query.returnGeometry = true
  //需要返回的字段
  query.outFields = ['*'] //["STCD","STNM"]; //["*"]
  //查询条件
  query.where = '1=1' // ["1=1"];
  //进行查询，完成后调用showResults方法
  queryTask.execute(query, xcResults, showError)
}

function xcResults(results) {
  feaResult = results
  feaArr = []
  feaInx = 0
  lineInx = 0
  feaArrLine = []
  lineStInx = 0
  breakInx = feaArr.length
  console.log('xcResults')
  for (let i = 0; i < results.features.length; i++) {
    const line = results.features[i].geometry
    const path = line.paths
    for (let j = 0; j < path.length; j++) {
      const ptobj = path[j]
      feaArrLine.push(ptobj)
      for (let k = 0; k < ptobj.length; k++) {
        const ptobj1 = ptobj[k]
        const mpt = new GIS.Point(ptobj1[0], ptobj1[1], map.spatialReference)
        feaArr.push(mpt)
      }
    }
  }
  breakInx = feaArr.length
  start()

  /*for(var i=0;i<results.features.length;i++){
		var graphic=results.features[i];
		graphic.attributes.GRATYPE="station_show";
		graphic.attributes.SHOWTYPE="marker";
		graphic.attributes.STTP="6";
		graphic.attributes.NAME="巡查点"+(i+1).toString();
		graphic.setSymbol(ptSymbol);
		initGraphicLayer.add(graphic);
	}*/
}

/**
 *查询错误显示
 * */
function showError(err) {}

function GetLineSymbol() {
  const picSymbol = new GIS.PictureMarkerSymbol()
  picSymbol.setUrl('dls/filled-arrow.png')
  picSymbol.setHeight(12)
  picSymbol.setWidth(12)

  //add a basic polyline
  const basicOptions = {
    style: GIS.SimpleLineSymbol.STYLE_SOLID,
    color: new dojo.Color('#99FF00'), //dojo.Color([0, 0, 0]),
    width: 2,
    directionSymbol: picSymbol,
    directionPixelBuffer: 40,
    showStartSymbol: true
  }

  basicSymbol = new GIS.DirectionalLineSymbol(basicOptions)
  directionalSymbols.push(basicSymbol)
}

function GetLineSymbol2() {
  const advOptions = {
    style: GIS.SimpleLineSymbol.STYLE_DASH,
    color: new dojo.Color('#99FF00'), //new dojo.Color([51, 102, 255]),
    width: 3,
    directionSymbol: 'arrow1',
    directionPixelBuffer: 60,
    directionColor: new dojo.Color([204, 51, 0]),
    //showStartSymbol:true,//add
    //showEndSymbol:true,
    directionSize: 14
  }
  basicSymbol = new GIS.DirectionalLineSymbol(advOptions)
  directionalSymbols.push(basicSymbol)
}

function GetLineSymbol3() {
  const pgOptions = {
    style: GIS.SimpleLineSymbol.STYLE_SOLID,
    color: new dojo.Color([51, 102, 255]),
    width: 2,
    directionSymbol: 'arrow2',
    directionPixelBuffer: 30,
    directionColor: new dojo.Color([41, 82, 204]),
    directionScale: 0.8
  }
  basicSymbol = new GIS.DirectionalLineSymbol(pgOptions)
  directionalSymbols.push(basicSymbol)
}
