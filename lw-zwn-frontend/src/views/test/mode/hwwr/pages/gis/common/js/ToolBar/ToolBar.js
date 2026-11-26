;(function ($) {
  $.fn.ToolBar = function (option) {
    this.empty()
    const lp = getJSPath('ToolBar.js')
    const defauts = {}
    const setting = $.extend({}, defauts, option)
    //添加长度测量
    const lengthM = $('<div>aaaa</div>')
    this.append(lengthM)
    //获取当前js路径
    function getJSPath(name) {
      const js = document.scripts
      let jsPath = ''
      for (let i = js.length; i > 0; i--) {
        if (js[i - 1].src.indexOf(name) > -1) {
          jsPath = js[i - 1].src.substring(0, js[i - 1].src.lastIndexOf('/') + 1)
        }
      }

      return jsPath
    }

    return this
  }
})(jQuery)
