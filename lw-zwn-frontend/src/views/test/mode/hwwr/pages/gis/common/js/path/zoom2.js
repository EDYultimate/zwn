//事件的绑定在init中，这里是绑定的function
function wheel(evt) {
  alert('ddd')
  if (evt.deltaY > 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

function zoomIn() {
  const extent = map.extent
  map.setExtent(extent.expand(0.5))
}

function zoomOut() {
  const extent = map.extent
  map.setExtent(extent.expand(2))
}

function drag(event, dx, dy, d, point, originalPoint) {
  if (d == 'right') {
    map.panLeft()
  }
  if (d == 'left') {
    map.panRight()
  }
  if (d == 'up') {
    map.panDown()
  }
  if (d == 'down') {
    map.panUp()
  }
  if (d == 'leftup') {
    map.panLowerRight()
  }
  if (d == 'leftdown') {
    map.panUpperRight()
  }
  if (d == 'rightup') {
    map.panLowerLeft()
  }
  if (d == 'rightdown') {
    map.panUpperLeft()
  }
}
