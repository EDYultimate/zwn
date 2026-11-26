function now() {
  const circle = document.getElementById('circle')
  if (circle) {
    //当前的屏幕坐标
    const ctm = circle.getCTM()
    const x = circle.getAttribute('cx')
    const y = circle.getAttribute('cy')
    track.nowXY[0] = x * ctm.a + y * ctm.c + ctm.e
    track.nowXY[1] = x * ctm.b + y * ctm.d + ctm.f
    //当前的经纬度坐标
    const screenPoint = new esri.geometry.ScreenPoint({
      x: track.nowXY[0],
      y: track.nowXY[1]
    })
    const point = map.toMap(screenPoint)
    track.now[0] = point.x
    track.now[1] = point.y
  }
}
