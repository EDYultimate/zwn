/*
 * 地图图例控件
 */
;(function ($) {
  $.fn.LegendBar4 = function (option) {
    this.empty()
    let state = 'open'
    const container = this
    const lp = getJSPath('LegendBar4.js')
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
      picH: 14
    }
    const setting = $.extend({}, defaults, option) //参数集合
    this.addClass('LegendBar')
    const itemSize = setting.source.length
    if (30 + itemSize * 26 > 180) {
      setting.height = 180
    } else {
      setting.height = 30 + itemSize * 31
    }

    //设置外框
    this.css({
      width: setting.width,
      height: setting.height,
      overflow: 'hidden',
      position: 'absolute'
    })
    //添加头
    const title = $('<div class="Legend_Title">图例</div>')
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
      overflowX: 'hidden'
    })
    this.append(contentDiv)

    for (let i = 0; i < itemSize; i++) {
      //图例item
      const item = setting.source[i]
      var legendItem
      if (item.checked == 'true') {
        legendItem = $(
          '<label style="padding-left:15px;padding-top:5px;"><input name="moduleType" checked type="radio" value="' +
            item.id +
            '" style="margin-right:5px;margin-top:2px;"/>' +
            item.label +
            '</label>'
        )
      } else {
        legendItem = $(
          '<label style="padding-left:15px;padding-top:5px;"><input name="moduleType" type="radio" value="' +
            item.id +
            '" style="margin-right:5px;margin-top:2px;"/>' +
            item.label +
            '</label>'
        )
      }
      legendItem.css({
        backgroundColor: '#eeeeee',
        cursor: 'pointer',
        display: 'block',
        width: '100%',
        height: '30px',
        fontSize: '12px',
        borderBottom: 'dotted 1px #CCCCCC',
        position: 'absolute',
        top: (30 + 1) * i + 'px'
      })
      const imgItem = $('<img />').attr('src', item.img)
      imgItem.css({
        position: 'absolute',
        top: (30 + 1) * i + 8 + 'px',
        right: '25px'
      })
      contentDiv.append(legendItem)
      contentDiv.append(imgItem)
    }
    contentDiv.find('input:radio[name="moduleType"]').change(function () {
      const selectedvalue = $(this).val()
      setting.handler(selectedvalue)
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
      //			console.log(container.parent().css("position"));
      if (container.parent().css('position') == 'static') {
        container.parent().css('position', 'relative')
      }
    }

    return this
  }
})(jQuery)
