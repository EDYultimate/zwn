/*
 * 地图图例控件
 */
;(function ($) {
  $.fn.LegendBar = function (option) {
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
    if (30 + itemSize * 26 > 800) {
      setting.height = 800
    } else {
      setting.height = 30 + itemSize * 26
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
      setting.data[item.id] = item.checked
      const legendItem = $('<div></div>')
      legendItem.css({
        backgroundColor: '#eeeeee',
        width: '100%',
        height: '25px',
        fontSize: '12px',
        borderBottom: 'dotted 1px #CCCCCC',
        position: 'absolute',
        top: (25 + 1) * i + 'px'
      })
      const legendImg = $('<img />').attr('src', item.img)
      legendImg.css({
        width: setting.picW + 'px',
        height: setting.picH + 'px',
        position: 'absolute',
        left: '10px',
        top: (25 - setting.picH) / 2 + 'px'
      })
      legendItem.append(legendImg)
      const legendLabel = $('<div></div>')
        .text(item.label)
        .css({ position: 'absolute', left: '40px', top: '5px' })
      legendItem.append(legendLabel)
      //添加复选框
      const checkbox = $('<div></div>').attr('idx', item.id).attr('check', item.checked)
      checkbox.css({
        width: 15,
        height: 15,
        position: 'absolute',
        background:
          item.checked == 'true'
            ? 'url("' + lp + '/img/checkbox.png") no-repeat scroll 0 0'
            : 'url("' + lp + '/img/unchecked.png") no-repeat scroll 0 0',
        right: 15,
        cursor: 'pointer',
        top: 6
      })
      checkbox.on('click', function (event) {
        if ($(this).attr('check') == 'true') {
          $(this).css({
            background: 'url("' + lp + '/img/unchecked.png") no-repeat scroll 0 0'
          })
          $(this).attr('check', 'false')
          setting.data[$(this).attr('idx')] = 'false'
        } else {
          $(this).css({
            background: 'url("' + lp + '/img/checkbox.png") no-repeat scroll 0 0'
          })
          $(this).attr('check', 'true')
          setting.data[$(this).attr('idx')] = 'true'
        }
        setting.handler($(this).attr('idx'), $(this).attr('check'), setting.data)
      })
      legendItem.append(checkbox)

      contentDiv.append(legendItem)
    }

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
