//track用来存储轨迹状态，动态获得播放当前状态
var track = {
  //轨迹的初始经纬度，一旦获得则不能被改变
  originalLon: [],
  originalLat: [],
  //未播放的路径经纬度
  lon: [],
  lat: [],
  //屏幕坐标
  x: [],
  y: [],
  //当前播放点的经纬度
  now: [],
  //当前播放点的屏幕坐标
  nowXY: [],
  //轨迹长度
  length: 0,
  //当前数组偏移量
  i: 0,
  //屏幕边界点坐标
  limitXY: [],
  //设置当前数组偏移量和判断是否碰壁，碰壁则漫游
  nowTimer: setInterval(function () {
    if (!document) {
      return
    }
    //设置当前数组偏移量
    if (track.lon[track.i] - track.now[0] < 0.0001 && track.lat[track.i] - track.now[1] < 0.0001) {
      if (processManager.isStart) {
        track.i++
      }
      //判断是否碰壁，碰壁则漫游
      if (
        track.nowXY[0] >= track.limitXY[0] ||
        track.nowXY[1] >= track.limitXY[1] ||
        track.nowXY[0] <= 0 ||
        track.nowXY[1] <= 0
      ) {
        if (processManager.isStart) {
          const point = new esri.geometry.Point({
            x: track.now[0],
            y: track.now[1]
          })
          map.centerAt(point)
        }
      }
    }
  }, 50)
}

//processManager对象用来存储播放状态
var processManager = { isStart: false }

//SVGEvent类用来实现SVG的扩展事件
const SVGEvent = function () {
  //
}

//用静态方法来实现事件绑定
SVGEvent.bindEvent = function (element, eventName, fn) {
  if (!element || element == 'svg') {
    element = window
  }
  //鼠标滚动事件
  if (eventName == 'mousewheel') {
    window.onmousewheel = document.onmousewheel = fn
  }
  //鼠标拖动事件
  if (eventName == 'mouseDrag') {
    let state = false,
      original_x,
      original_y
    element.onmousedown = function (event) {
      original_x = event.clientX
      original_y = event.clientY
      state = true
    }
    element.onmousemove = function (event) {
      if (state) {
        const e = event ? event : window.event
      }
    }
    element.onmouseup = function (event) {
      if (state) {
        state = false
        const diffX = parseInt(event.clientX - original_x)
        const diffY = parseInt(event.clientY - original_y)
        let dx = 'center'
        let dy = 'center'
        let d = 'center'
        if (Math.abs(diffX) > 80) {
          dx = diffX > 0 ? 'right' : 'left'
        }
        if (Math.abs(diffY) > 80) {
          dy = diffY > 0 ? 'down' : 'up'
        }
        if (dx != 'center' && dy != 'center') {
          d = dx + dy
        }
        if (dx != 'center' && dy == 'center') {
          d = dx
        }
        if (dx == 'center' && dy != 'center') {
          d = dy
        }
        fn.call(
          element,
          event,
          dx,
          dy,
          d,
          [event, clientX, event.clientY],
          [original_x, original_y]
        )
        original_x = 0
        original_y = 0
        original_left = 0
        original_top = 0
      }
    }
  }
}
