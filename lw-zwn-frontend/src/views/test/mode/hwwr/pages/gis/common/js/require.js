/*异步调用js方法*/
function _loadScript(url, callback) {
  const script = document.createElement('script')

  script.type = 'text/javaScript'
  //判断是否有回调函数
  if (callback) {
    if (script.readyState) {
      //IE
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null
          callback()
        }
      }
    } else {
      //其他浏览器
      script.onload = function (event) {
        console.log(event)
        callback()
      }
    }
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}
//加载js并回调
function loadScript(urlArray, callback) {
  for (let i = 0, len = urlArray.length; i < len; i++) {
    if (i == len - 1) {
      _loadScript(urlArray[i], callback)
    } else {
      _loadScript(urlArray[i], false)
    }
  }
}
