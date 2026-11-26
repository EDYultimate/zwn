/*
 * 地图图例控件
 */
;(function ($) {
  $.fn.ScaleBar = function (option) {
    const container = this
    //默认参数
    const defaults = {}
    const setting = $.extend({}, defaults, option) //参数集合
    require(['esri/dijit/Scalebar', 'dojo/domReady!'], function (Scalebar) {
      const map = setting.map
      //var scalebar =
      const scalebar = new Scalebar({
        map: map,
        // "dual" displays both miles and kilometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: 'metric'
      })
      $(scalebar.domNode).addClass(container.attr('class'))
      $(scalebar.domNode).addClass('scale_bar')
      $(scalebar.domNode).attr('style', container.attr('style'))
      $(scalebar.domNode).children('.scaleLabelDiv').css({ color: '#FF0000' })
      container.remove()
    })
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
    //设置父容器布局
    function layout() {
      console.log(container.parent().css('position'))
      if (container.parent().css('position') == 'static') {
        container.parent().css('position', 'relative')
      }
    }
    return this
  }
})(jQuery)
