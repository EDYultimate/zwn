function play() {
  if (!processManager.isStart) {
    document.getElementById('animateMotion').beginElement()
    processManager.isStart = true
  } else {
    document.getElementById('svg').unpauseAnimations()
  }
}

function pause() {
  document.getElementById('svg').pauseAnimations()
  processManager.isStart = false
}

function stop() {
  track.i = 0
  processManager.isStart = false
  pause()
  clearSVG()
  initScreenXY()
  initSVG(track)
}

function clearSVG() {
  const circle = document.getElementById('circle')
  circle.parentNode.removeChild(circle)
  const motionPath = document.getElementById('motionPath')
  motionPath.parentNode.removeChild(motionPath)
}
