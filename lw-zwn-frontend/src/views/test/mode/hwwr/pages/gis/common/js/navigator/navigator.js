;(function ($) {
  $.fn.MapNavigator = function (option) {
    this.empty()
    let dragging = false
    let currentLevel = 1 //当前层级
    const lp = getJSPath('navigator.js')

    const defauts = {
      width: '100px',
      height: '100px',
      sliderW: '5px',
      sliderH: 100,
      tickW: 5,
      levels: 17,
      tickH: '5px',
      top: 50,
      left: 30,
      initialLevel: 8,
      tickB: 1
    }

    const setting = $.extend({}, defauts, option)
    this.css({ textAlign: 'center', position: 'absolute', position: 'absolute' })

    const map = setting.map
    if (map) {
      setting.levels = setting.lods.length

      map.on('extent-change', function (event) {
        if (event.levelChange) {
          const level = event.lod.level
          setHandPosition(setting.levels - level - 1)
          console.log(map)
        }
      })
    }
    //创建头
    const headerDiv = $('<div></div>')
    headerDiv.css({
      width: '52px',
      height: '52px',
      background: 'url("' + lp + 'img/panback.png") no-repeat -1px 0px',
      cursor: 'pointer',
      'margin-left': '3px'
    })
    this.append(headerDiv)
    const bottomDiv = $('<div></div>')
    bottomDiv.css({
      'margin-left': 18
    })
    this.append(bottomDiv)
    //放大按钮
    const plusIcon = $('<div></div>')
    plusIcon.css({
      width: 20,
      height: 21,
      cursor: 'pointer',
      background: 'url("' + lp + 'img/navigator_plus.png") no-repeat center center'
    })
    bottomDiv.append(plusIcon)
    const slideDiv = $('<div></div>')
    slideDiv.css({
      width: '7px',
      height: '100px',
      'background-color': '#B6B5B1',
      position: 'relative',
      'margin-left': 7,
      'margin-top': -2
    })
    bottomDiv.append(slideDiv)
    const _tickh = setting.sliderH / setting.levels - setting.tickB
    for (let i = 0; i < setting.levels; i++) {
      const tick = $('<div></div>') //创建刻度
      tick.attr('idx', i)
      tick.on('click', tickClick)
      tick.css({
        width: '3px',
        height: _tickh - 1,
        border: '0px solid #000',
        margin: 2,
        'background-color': '#FFF',
        cursor: 'pointer'
      })

      slideDiv.append(tick)
    }
    //扩大小手活动范围
    const vitualHand = $('<div></div>')
    vitualHand.css({
      position: 'absolute',
      width: 15,
      height: _tickh * 2,
      left: -4,
      top: 5
    })
    slideDiv.append(vitualHand)
    const handTip = $('<div>1000</div>')
    handTip.css({
      position: 'absolute',
      left: 17,
      top: 0,
      width: 30,
      height: 20,
      display: 'none',
      color: '#CCC'
    })
    vitualHand.append(handTip)

    //把手
    const handSpan = $('<div></div>')
    handSpan.css({
      width: '15px',
      height: _tickh,
      background: 'url("' + lp + 'img/handIcon.png") no-repeat center center #3B3A3A',
      marginTop: _tickh / 2,
      border: '1 solid #FCFDFD',
      cursor: 'pointer'
    })
    vitualHand.append(handSpan)
    handSpan.on('mousedown', span_downHandler)
    handSpan.on('mouseover', span_overHandler)
    vitualHand.on('mouseup', span_upHandler)
    vitualHand.on('mouseleave', span_outHandler)
    const movehandler = null

    //把手鼠标按下事件
    function span_downHandler(event) {
      dragging = true
      slideDiv.on('mousemove', span_moveHandler)
    }
    //把手移动
    function span_moveHandler(event) {
      if (dragging) {
        const offH = event.pageY - slideDiv.offset().top
        const n = Math.floor(offH / (_tickh + setting.tickB))
        if (n < 0 || n > setting.levels - 1) {
          return
        }
        setHandPosition(n)
      }
    }
    function span_upHandler(event) {
      draggin = false
      slideDiv.off('mousemove', span_moveHandler)
    }
    function span_outHandler(event) {
      draggin = false
      handTip.css('display', 'none')
      slideDiv.off('mousemove', span_moveHandler)
    }
    function tickClick(event) {
      const currentLevel = $(event.target).attr('idx')
      if (map) {
        map.setLevel(setting.levels - currentLevel - 1)
      }
      setHandPosition(currentLevel)
    }
    //设置把手位置
    function setHandPosition(n) {
      if (n < 0 || n > setting.levels - 1) {
        return
      }
      currentLevel = n
      vitualHand.css({ top: n * (_tickh + setting.tickB) - _tickh / 2 })
      vitualHand.attr('idx', n)
      handTip.text(n)
    }
    function span_overHandler(event) {
      handTip.css('display', 'block')
    }
    //缩小按钮
    const minusIcon = $('<div></div>')
    minusIcon.css({
      cursor: 'pointer',
      width: 20,
      height: 21,
      background: 'url("' + lp + 'img/navigator_minus.png") no-repeat center center',
      'margin-top': -1
    })
    bottomDiv.append(minusIcon)
    plusIcon.on('click', plusHandler)
    function plusHandler(event) {
      currentLevel--
      if (currentLevel < 0 || currentLevel > setting.levels - 1) {
        currentLevel = 0
        return
      }
      if (map) {
        map.setLevel(setting.levels - currentLevel - 1)
      }
      setHandPosition(currentLevel)
    }
    minusIcon.on('click', minusHandler)
    function minusHandler(event) {
      currentLevel++
      if (currentLevel < 0 || currentLevel > setting.levels - 1) {
        currentLevel = setting.levels - 1
        return
      }
      if (map) {
        map.setLevel(setting.levels - currentLevel - 1)
      }

      setHandPosition(currentLevel)
    }
    //表盘添加移动
    headerDiv.on('mousemove', headerMove)
    headerDiv.on('mouseout', function (event) {
      headerDiv.css({
        background: 'url("' + lp + 'img/panback.png") no-repeat -1px 0px'
      })
    })
    headerDiv.on('click', headerClickHandler)
    //表头点击事件
    function headerClickHandler(event) {
      if (!map) {
        return
      }
      switch (currentRegion) {
        case 'TOP':
          map.panUp()
          break
        case 'BOTTOM':
          map.panDown()
          break
        case 'LEFT':
          map.panLeft()
          break
        case 'RIGHT':
          map.panRight()
          break
        case 'CENTER':
          toInitialExtent()
          break
      }
    }
    var currentRegion = 'null' //在表盘当前位置
    function headerMove(event) {
      const region = getRegion(event)
      if (currentRegion == region) {
        return
      }
      currentRegion = region
      switch (region) {
        case 'TOP':
          headerDiv.css({
            background: 'url("' + lp + 'img/panback.png") no-repeat -51px 0px'
          })
          break
        case 'BOTTOM':
          headerDiv.css({
            background: 'url("' + lp + 'img/panback.png") no-repeat -151px 0px'
          })
          break
        case 'LEFT':
          headerDiv.css({
            background: 'url("' + lp + 'img/panback.png") no-repeat -201px 0px'
          })
          break
        case 'RIGHT':
          headerDiv.css({
            background: 'url("' + lp + 'img/panback.png") no-repeat -101px 0px'
          })
          break
        case 'CENTER':
          headerDiv.css({
            background: 'url("' + lp + 'img/panback.png") no-repeat -251px 0px'
          })
          break
      }
    }
    //恢复到初始化状态
    function toInitialExtent() {
      if (map) {
        if (map.initialExt) {
          map.setExtent(map.initialExt)
        }
      }
    }
    //判断当前区域
    function getRegion(event) {
      const r1 = 9 //小圆半径
      const r2 = 25 //大圆半径
      const x0 = event.pageX
      const y0 = event.pageY
      const headY = headerDiv.offset().top
      const headX = headerDiv.offset().left
      const x = x0 - headX - 28
      const y = y0 - headY - 28
      const m = x * x + y * y
      const r1_2 = r1 * r1
      const r2_2 = r2 * r2
      if (m > r2_2) {
        return 'OUT'
      } else if (m < r1_2) {
        return 'CENTER'
      }

      const k = y / x
      if (k < 1 && k > -1 && x > 0) {
        return 'RIGHT'
      }
      if (k < 1 && k > -1 && x < 0) {
        return 'LEFT'
      }
      if (k > 1 || k < -1) {
        if (y < 0) {
          return 'TOP'
        }

        return 'BOTTOM'
      }
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

    handTip.text(setting.initialLevel)
    setHandPosition(setting.levels - setting.initialLevel - 1)
    return this
  }
})(jQuery)
