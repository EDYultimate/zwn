;(function ($) {
  $.fn.mapswitch = function (option) {
    this.empty()
    const lp = getJSPath('mapswith.js')
    const thiswidth = '100px'
    const thisheight = '30px'
    let isOpen_layer = false
    const defauts = {
      data: [],
      map: '',
      top: 10,
      left: 10,
      layerSelect: function (e) {
        console.log(e)
      },
      layerClick: function (ditu, dixing, yingxiang) {
        console.log(ditu + ';' + dixing + ';' + yingxiang)
      }
    }

    const setting = $.extend({}, defauts, option)
    setting.handle = setting.data[0].clickhandle
    this.css({
      padding: '4px',
      background: '#fff',
      'box-shadow': ' 0 0 0 4px rgba(0, 0, 0, 0.1)',
      'border-radius': '5px',
      width: '275px',
      height: '24px',
      'line-height': '24px',
      top: setting.top,
      right: setting.right,
      textAlign: 'center',
      position: 'absolute',
      'font-family': '微软雅黑',
      'font-size': '14px',
      color: '#4c4c4c'
    })
    //创建容器
    const switchlayer = $("<div class='switchcss'>图层</div>")
    const switchlayer_sub = $("<div id='bar_layer_content'></div>")
    const switchline = $('<div>|</div>')
    const switchditu = $("<div class='switchcss dituchange'>地图</div>")
    const switchdixing = $("<div class='switchcss dituchange'>地形</div>")
    const switchyingxiang = $("<div class='switchcss dituchange'>影像</div>")
    switchline.css({
      width: '1px',
      height: '24px',
      'margin-right': '3px',
      float: 'left',
      color: '#d8d8d8'
    })

    switchlayer_sub.css({
      width: '115px',
      height: '0px',
      'background-color': '#FFFFFF',
      position: 'absolute',
      border: '1px solid #CCCCCC',
      top: '37px',
      left: '5px',
      'border-radius': '3px',
      'padding-top': '3px'
    })

    switchlayer.css({
      width: '50px',
      height: '24px',
      'border-radius': '20px',
      float: 'left',
      'padding-right': '15px',
      background: 'url("' + lp + 'img/xiala.png") no-repeat 45px center'
    })

    switchditu.css({
      width: '65px',
      height: '100%',
      'text-indent': '15px',
      'border-radius': '20px',

      float: 'left',
      background: ' url("' + lp + 'img/ditu.png") no-repeat 8px center',
      'background-color': '#ebebeb'
    })

    switchdixing.css({
      width: '65px',
      height: '100%',
      'border-radius': '20px',
      'text-indent': '15px',
      float: 'left',
      background: ' url("' + lp + 'img/dixing.png") no-repeat 8px center'
    })

    switchyingxiang.css({
      width: '65px',
      height: '100%',
      'border-radius': '20px',
      'text-indent': '15px',
      float: 'left',
      background: ' url("' + lp + 'img/yingxiang.png") no-repeat 8px center'
    })

    this.append(switchlayer)
    this.append(switchlayer_sub)
    this.append(switchline)
    this.append(switchditu)
    this.append(switchdixing)
    this.append(switchyingxiang)
    initLayerCheckBox()
    /*
	      添加hover样式
	      */
    $('.switchcss').hover(
      function () {
        $(this).css({
          'background-color': '#ebebeb',
          cursor: 'pointer'
        })
      },
      function () {
        if (!$(this).hasClass('dituclick')) {
          $(this).css({
            'background-color': 'transparent',
            cursor: 'default'
          })
        }
      }
    )

    //创建图层控制
    function initLayerCheckBox() {
      const rightTopBar_layer = $('#bar_layer_content')
      const len = setting.data.length
      rightTopBar_layer.height(len * 30 + 2)
      $.each(setting.data, function (index, item) {
        const boxItem = $(
          '<div class="boxLayerItem unSelected boxLayerClick" style="width:100%;height:30px;border-bottom:1px solid #FFFFFF;">' +
            '<div class="boxLayerClick" style="width:15px;height:27px;margin-top:2px;margin-left:5px;float:left;"></div>' +
            '<div class="boxLayerLabel boxLayerClick" style="float:left;margin-left:4px;margin-top:1px;">' +
            item.label +
            '</div>' +
            '</div>'
        )
        boxItem.attr('layerid', item.id)
        boxItem.attr('ifonlywmts', item.ifonlywmts)
        boxItem.attr('controlLayerid', item.controlLayerid)
        boxItem.attr('layertype', item.layertype)
        boxItem.attr('type', item.type)
        boxItem.on('click', item.clickhandle)
        if (item.visible) {
          boxItem.children('div').eq(0).addClass('boxLayerImg')
        } else {
          boxItem.children('div').eq(0).addClass('boxLayerImg_unselect')
        }
        rightTopBar_layer.append(boxItem)
      })
      $('.boxLayerItem').on('click', function (event) {
        const targetImg = $(this).children('div').eq(0)
        if (targetImg.hasClass('boxLayerImg')) {
          targetImg.css({
            background: ' url("' + lp + 'img/unchecked.png") no-repeat center'
          })
          targetImg.removeClass('boxLayerImg').addClass('boxLayerImg_unselect')
        } else {
          targetImg.css({
            background: ' url("' + lp + 'img/checkbox.png") no-repeat center'
          })
          targetImg.removeClass('boxLayerImg_unselect').addClass('boxLayerImg')
        }
        const arr = []
        $.each(rightTopBar_layer.children('.boxLayerItem'), function (index, item) {
          const layerid = $(item).attr('layerid')
          const layertype = $(item).attr('layertype')
          const layername = $(item).attr('type')
          let layerselect = false
          if ($(item).children('div').eq(0)
.hasClass('boxLayerImg')) {
            layerselect = true
          }
          const layer = {
            layerid: layerid,
            layertype: layertype,
            layername: layername,
            layerselect: layerselect
          }
          arr.push(layer)
        })
        setting.layerSelect(arr)
      })
      rightTopBar_layer.hide()
    }
    /*
     * 添加子图层样式
     */
    $('.boxLayerImg').css({
      background: ' url("' + lp + 'img/checkbox.png") no-repeat center'
    })
    $('.boxLayerImg_unselect').css({
      background: ' url("' + lp + 'img/unchecked.png") no-repeat center'
    })
    $('.boxLayerItem').hover(
      function () {
        $(this).css({
          'background-color': '#ebebeb',
          cursor: 'pointer'
        })
      },
      function () {
        $(this).css({
          'background-color': 'transparent',
          cursor: 'default'
        })
      }
    )

    $('.switchcss').click(function (event) {
      const targetclick = $(this)
      if (!isOpen_layer && event.target.innerText == '图层') {
        $('#bar_layer_content').show()
        isOpen_layer = true
      } else if (event.target.innerText == '图层') {
        $('#bar_layer_content').hide()
        isOpen_layer = false
      }
    })
    map.on('mouse-down', function () {
      $('#bar_layer_content').hide()
      isOpen_layer = false
    })
    //地图、地形、影像切换按钮
    $('.dituchange').click(function (event) {
      $('.dituchange').css({
        'background-color': 'transparent',
        cursor: 'default'
      })
      $('.dituchange').removeClass('dituclick')
      $(this).css({
        'background-color': '#ebebeb',
        cursor: 'pointer'
      })
      $(this).addClass('dituclick')
      const clicktarget = event.target.innerText
      map.getLayer('backlayer').setVisibility(clicktarget == '地图')
      //map.getLayer("bjlayer").setVisibility(true);
      map.getLayer('tdtdixing').setVisibility(clicktarget == '地形')
      map.getLayer('tdtyingxiang').setVisibility(clicktarget == '影像')
      setting.layerClick(clicktarget == '地图', clicktarget == '地形', clicktarget == '影像')
    })
    //获取js路径
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
