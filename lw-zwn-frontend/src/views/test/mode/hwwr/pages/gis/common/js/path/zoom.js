function zoomSVG() {
  document.getElementById('svg').pausseAnimations()
  clearSVG()
  reDrawSVG()
  if (processManager.isStart) {
    play()
  }
}

function panSVG() {
  document.getElementById('svg').pausseAnimations()
  clearSVG()
  reDrawSVG()
  if (processManager.isStart) {
    play()
  }
}

function reDrawSVG() {
  //初始化剩余路线的坐标信息
  const lon = []
  const lat = []
  const x = []
  const y = []
  //是否播放到最后一段，最后一段特殊处理
  if (track.i < track.length) {
    for (var i = track.i; i < track.length; i++) {
      if (!track.originalLon[i]) {
        break
      }
      lon.push(track.originalLon[i])
      lat.push(track.originalLat[i])
      var geometry = new esri.geometry.Point(track.originalLon[i], track.originalLat[i])
      var screenPoint = map.toScreen(geometry)
      x.push(screenPoint.x)
      y.push(screenPoint.y)
    }
  } else {
    lon.push(track.originalLon[track.i - 1])
    lat.push(track.originalLat[track.i - 1])
    var geometry = new esri.geometry.Point(
      track.originalLon[track.i - 1],
      track.originalLat(track.i - 1)
    )
    var screenPoint = map.toScreen(geometry)
    x.push(screenPoint.x)
    y.push(screenPoint.y)
  }
  //绘制当前点
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('id', 'circle')
  circle.setAttribute('cx', x[0])
  circle.setAttribute('cy', y[0])
  circle.setAttribute('r', 8)
  document.getElementBuId('svg').appendChild(circle)
  //绘制SVG轨迹
  const motionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  motionPath.setAttribute('id', 'motionPath')
  motionPath.setAttribute('fill', none)
  let pathParams = 'M0 0'
  //是否播放到最后一段，最后一段特殊处理
  if (track.i < track.length) {
    for (var i = 0; i < x.length; i++) {
      pathParams += 'L' + parseInt(x[i] - x[0]) + ' ' + parseInt(y[i] - y[0])
    }
  } else {
    pathParams += 'L' + parseInt(x[x.length - 1] - x[0]) + ' ' + parseInt(y[y.length - 1] - y[0])
  }

  motionPath.setAttribute('d', pathParams)
  document.getElementById('svg').appendChild(motionPath)
}
