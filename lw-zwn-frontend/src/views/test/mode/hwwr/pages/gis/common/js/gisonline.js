var GIS = GIS || {}
//获取字节长度
GIS.getByteSize = function (str) {
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
GIS.Timer = function (handler, delay, loop, dataProvider) {
  let _delay = delay //间隔时间间
  const _handler = handler //回调函数
  let _loop = loop
  let _dataProvider = dataProvider
  let timeInt = null
  let index = 1
  this.start = _start
  function _start() {
    if (dataProvider.length <= 0) {
      return
    }
    timeInt = setInterval(timerHandler, _delay)
  }
  this.stop = _stop
  this.setDataProvider = function (data) {
    _dataProvider = data
    index = 0
  }
  this.setLoop = function (data) {
    _loop = data
  }
  this.setDelay = function (data) {
    _delay = data
  }
  function _stop() {
    clearInterval(timeInt)
  }
  this.reset = function () {
    index = 0
    _stop()
    _start()
  }
  this.setIndex = function (_index) {
    index = _index
    _stop()
    _start()
  }
  this.pause = function (_index) {
    index = _index
    _stop()
  }
  this.reStart = function () {
    _start()
  }
  /*滴答处理函数*/
  function timerHandler() {
    if (_dataProvider.length <= 0) {
      _stop()
      return
    }

    if (index < _dataProvider.length) {
    } else if (_loop) {
      index = 0
    } else {
      index = 0
      _stop()
      return
    }
    handler(index, _dataProvider[index])
    index++
  }
}
GIS.copy = function copy(source) {
  const result = {}

  for (const key in source) {
    result[key] = typeof source[key] === 'object' ? GIS.copy(source[key]) : source[key]
  }
  return result
}
GIS.null = function (str) {
  if (
    str == 'null' ||
    str == null ||
    typeof str === 'undefined' ||
    !str ||
    (str + '').trim() == 'undefined'
  ) {
    console.log('--------------------------------------------')
    console.log(str)
    console.log('***********************************************')
    str = ''
  } else {
    //str="";
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(str)
    console.log('######################################################')
  }
  return str
}
