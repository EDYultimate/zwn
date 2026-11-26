/*
 * 地图图例控件
 */
;(function ($) {
  $.fn.LegendBar7 = function (option) {
    const content = this.children('.Content')
    this.empty()
    let state = 'open'
    const container = this
    const lp = getJSPath('LegendBar.js')
    layout()
    //默认参数
    const defaults = {
      source: [
        { label: '水文站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' },
        { label: '水质站', img: lp + 'img/fuqiao.png' }
      ], //[]
      width: 120,
      height: 360,
      picW: 14,
      picH: 14,
      handler: null,
      data: {}
    }
    const setting = $.extend({}, defaults, option) //参数集合
    this.addClass('LegendBar')
    const itemSize = setting.source.length

    //设置外框
    this.css({
      width: setting.width,
      height: setting.height,
      overflow: 'hidden',
      position: 'absolute'
    })
    //添加头
    const title = $(
      '<div class="Legend_Title"><lable id="legendTitle">' + setting.titleStr + '</lable></div>'
    )
    const titleH = 30
    this.append(title)
    //添加关闭  复原按钮
    const closeIcon = $('<img />')
    closeIcon.attr({ src: lp + 'img/min.png' })
    closeIcon.on('click', function (evt) {
      if (state == 'open') {
        state = 'close'
        closeIcon.attr('src', lp + 'img/normal.png')
        container.animate({
          height: '30px',
          width: '120px'
        })
      } else {
        state = 'open'
        closeIcon.attr('src', lp + 'img/min.png')
        container.animate({
          height: setting.height,
          width: setting.width
        })
      }
    })
    closeIcon.css({ right: '10px', top: '15px', position: 'absolute', cursor: 'pointer' })
    title.append(closeIcon)
    //主体容器
    const contentDiv = $('<div class="Legend_Content"></div>')
    contentDiv.css({
      width: '100%',
      height: setting.height - titleH + 'px',
      position: 'relative',
      overflowY: 'hidden',
      overflowX: 'hidden',
      marginTop: '5px'
    })
    this.append(contentDiv)
    console.log(this.children('.Content'))
    contentDiv.append(content)
    //
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
      //			console.log(container.parent().css("position"));
      if (container.parent().css('position') == 'static') {
        container.parent().css('position', 'relative')
      }
    }

    return this
  }
})(jQuery)
