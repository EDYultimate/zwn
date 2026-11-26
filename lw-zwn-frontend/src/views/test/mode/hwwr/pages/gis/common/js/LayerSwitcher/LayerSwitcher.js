;(function ($) {
  $.fn.LayerSwitcher = function (option) {
    this.empty()
    const lp = getJSPath('LayerSwitcher.js')
    const defauts = { dixing: [], yingxiang: [], ditu: [] }
    const setting = $.extend({}, defauts, option)
    this.css({
      textAlign: 'center',
      position: 'absolute',
      cursor: 'pointer',
      backgroundColor: '#FFFFFF'
    })
    this.addClass('mapchangeContanier')
    let curSelect = null
    let clicked = false
    let isOpen = false
    //创建三个图片div
    const dtDiv = $(
      '<div class="mapentity selected" layer="ditu"><div class="unSelected" style="color: #fff;font-size: 12px;height: 20px;left: 55px;line-height: 20px;position: relative;text-align: center;top: 42px;width: 30px;background-color: #62a3ff;">地图</div></div>'
    )
      .css({
        background: 'url("' + lp + 'img/ditu.png") no-repeat 0px 0px',
        width: '85px',
        height: '62px',
        float: 'left',
        border: '2px solid #FFFFFF',
        margin: 0
      })
      .on('click', clickHanlder)
    const dxDiv = $(
      '<div class="mapentity"  layer="dixing"><div class="unSelected" style="color: #fff;font-size: 12px;height: 20px;left: 55px;line-height: 20px;position: relative;text-align: center;top: 42px;width: 30px;background-color: #62a3ff;">地形</div></div>'
    )
      .css({
        background: 'url("' + lp + 'img/dixing.png") no-repeat 0px 0px',
        width: '0px',
        height: '62px',
        float: 'left',
        borderTop: '2px solid #FFFFFF',
        margin: 0
      })
      .on('click', clickHanlder)
    const yxDiv = $(
      '<div class="mapentity"  layer="yingxiang"><div class="unSelected" style="color: #fff;font-size: 12px;height: 20px;left: 55px;line-height: 20px;position: relative;text-align: center;top: 42px;width: 30px;background-color: #62a3ff;">影像</div></div>'
    )
      .css({
        background: 'url("' + lp + 'img/weixing.png") no-repeat 0px 0px',
        width: '0px',
        height: '62px',
        float: 'left',
        borderTop: '2px solid #FFFFFF',
        margin: 0
      })
      .on('click', clickHanlder)
    curSelect = dtDiv
    curSelect.css({
      border: '2px solid #009966'
    })
    this.append(dtDiv).append(dxDiv).append(yxDiv)
    this.hover(
      function () {
        clicked = false
        $('.mapentity').animate({ width: 85, height: 62 }, 500)
        $('.mapentity').css('margin', '1px')
        isOpen = true
      },
      function () {
        if (!clicked) {
          $('.mapentity:not(.selected)').animate({ width: 0 }, 400)
          $('.mapentity').css('margin', '0')
        }
      }
    )
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
    function clickHanlder(evt) {
      if (isOpen) {
        clicked = true
        curSelect.css({
          border: 0
        })
        curSelect.css({
          borderTop: '2px solid #FFFFFF'
        })
        curSelect.removeClass('selected')
        curSelect = $(this)
        curSelect.css({ border: '2px solid #009966' })
        curSelect.addClass('selected')
        $('.mapentity:not(.selected)').animate({ width: 0 }, 400)
        $('.mapentity').css('margin', '0')
        isOpen = false
        const layerType = curSelect.attr('layer')
        //判断是哪个图层 设置可见性
        const isditu = layerType == 'ditu'
        $.each(setting.ditu, function (index, item) {
          console.log(item)
          item.visible = isditu
          const layer = setting.map.getLayer(item.id)
          if (layer) {
            layer.setVisibility(isditu)
          }
        })
        const isdixing = layerType == 'dixing'
        $.each(setting.dixing, function (index, item) {
          item.visible = isdixing
          setting.map.getLayer(item.id).setVisibility(isdixing)
        })
        const isyingxiang = layerType == 'yingxiang'
        $.each(setting.yingxiang, function (index, item) {
          item.visible = isyingxiang
          setting.map.getLayer(item.id).setVisibility(isyingxiang)
        })
      } else {
        clicked = false
        $('.mapentity').animate({ width: 85, height: 62 }, 500)
        $('.mapentity').css('margin', '1px')
        isOpen = true
      }
    }
    return this
  }
})(jQuery)
