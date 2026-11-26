function initA() {
  //地图的初始化省略
  //zoomin、zoomout后重新同步坐标，并且重绘动画
  //   dojo.connect(map,'onZoomEnd',function(){
  //        zoomSVG();
  //   });
  //鼠标滚动
  // SVGEvent.bindEvent("svg","mousewheel",wheel);
  //鼠标拖动
  //  SVGEvent.bindEvent("svg","mouseDrag",drag); //初始化边界坐标
  // track.limitXY=[document.body.clientWidth,docment.body.clientHeight];
  track.limitXY = [$('body').width(), $('body').height()]
  //初始化屏幕坐标
  initScreenXY()
  //初始化svg
  initSVG(track)
  //加载轨迹线
  addTrack(track)
}

function initScreenXY() {
  track.originalLon = [
    112.18794, 112.14533, 112.07623, 112.13906, 112.16644, 112.08104, 112.0419, 112.10233
  ]
  track.originalLat = [30.97, 30.96828, 30.6759, 30.54256, 30.54677, 30.95292, 30.80911, 30.59466]
  track.length = 8

  for (let i = 0; i < track.length; i++) {
    const geometry = new GIS.Point(track.originalLon[i], track.originalLat[i])
    const screenPoint = map.toScreen(geometry)
    track.x.push(screenPoint.x)
    track.y.push(screenPoint.y)
  }
}

function initSVG(track) {
  //	var motionPath=document.getElementById("animateMotion");
  //	 var pathParams="M"+parseInt(track.x[0])+" "+parseInt(track.y[0]);
  //	 for(var i=1;i<track.length;i++){
  //
  //	      //pathParams+="L"+parseInt(track.x[i]-track.x[0])+" "+parseInt(track.y[i]-track.y[0]);
  //		  pathParams+="L"+parseInt(track.x[i])+" "+parseInt(track.y[i]);
  //	  }
  //	  motionPath.setAttribute("path",pathParams);
  //	  var  path=document.getElementById("motionPath");
  //	  path.setAttribute("d",pathParams);
  //	  $("#svg").css({display:"block"});
  //
  //	return;
  //绘制起始点
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'image')
  circle.setAttribute('id', 'circle')
  circle.setAttribute('x', 0)
  circle.setAttribute('y', 0)
  circle.setAttribute('width', 24)
  circle.setAttribute('height', 24)
  circle.setAttribute(
    'xlink:href',
    'http://localhost:8080/zhia/pages/gis/main/yongshui/img/man.png'
  )

  //绘制轨迹
  const motionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  motionPath.setAttribute('id', 'motionPath')
  motionPath.setAttribute('style', 'fill:none;stroke:red;stroke-width:2')
  let pathParams = 'M' + parseInt(track.x[0]) + ' ' + parseInt(track.y[0])

  for (var i = 1; i < track.length; i++) {
    //pathParams+="L"+parseInt(track.x[i]-track.x[0])+" "+parseInt(track.y[i]-track.y[0]);
    pathParams += 'L' + parseInt(track.x[i]) + ' ' + parseInt(track.y[i])
  }
  let ptpaths = 'M0 0'
  for (var i = 1; i < track.length; i++) {
    //pathParams+="L"+parseInt(track.x[i]-track.x[0])+" "+parseInt(track.y[i]-track.y[0]);
    ptpaths += 'L' + parseInt(track.x[i] - track.x[0]) + ' ' + parseInt(track.y[i] - track.y[0])
  }
  //ptpaths="M153 334  C153 334 151 334 151 334  C151 339 153 344 156 344 C164 344 171 339 171 334 C171 322 164 314 156 31 C142 314 131 322 131 334";
  //  pathParams="M153 334  C153 334 151 334 151 334  C151 339 153 344 156 344 C164 344 171 339 171 334 C171 322 164 314 156 31 C142 314 131 322 131 334"

  motionPath.setAttribute('d', pathParams)
  document.getElementById('svg').appendChild(motionPath)
  const pathAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion')
  pathAnimate.setAttribute('id', 'animateMotion')
  pathAnimate.setAttribute('begin', '0')
  pathAnimate.setAttribute('dur', '10s')
  pathAnimate.setAttribute('path', pathParams)
  pathAnimate.setAttribute('rotate', 'auto')
  pathAnimate.setAttribute('repeatCount', 'indefinite')
  circle.appendChild(pathAnimate)
  document.getElementById('svg').appendChild(circle)

  // play();
  //  var circle2=document.createElementNS("http://www.w3.org/2000/svg","image");
  //  circle2.setAttribute("id","circle");
  //  circle2.setAttribute("x",0);
  //  circle2.setAttribute("y",0);
  //  circle2.setAttribute("width",24);
  //  circle2.setAttribute("height",24);
  //  circle2.setAttribute("xlink:href","http://localhost:8080/zhia/pages/gis/main/yongshui/img/man.png");
  //  document.getElementById("svg").appendChild(circle2);
}

function addTrack(track) {
  //通过arcgis绘制轨迹线，这样在zoomin，zoomout和漫游后不需要重绘
  const path = []
  for (let i = 0; i < track.length; i++) {
    const pos = []
    pos.push(track.lon[i])
    pos.push(track.lat[i])
    path.push(pos)
  }
  const polyLine = new esri.geometry.Polyline([path])
  const simpleLineSymbol = new esri.symbol.SimpleLineSymbol()
  const graphic = new esri.Graphic(polyLine, simpleLineSymbol)
  map.graphics.add(graphic)
}
