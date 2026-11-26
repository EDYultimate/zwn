;(function ($) {
  $.fn.initialLayer = function (option) {
    this.empty()
    const lp = getJSPath('LayerCheckbox.js')
    const defauts = {
      width: '100px',
      height: '30px',
      border_radius: '5px',
      top: 10,
      right: 85,
      showSwitch: false,
      data: [
        { label: '一级河流', id: 'river1Layer', visible: true },
        { label: '二级河流', id: 'river2Layer', visible: true },
        { label: '水库', id: 'shuikuLayer', visible: true },
        { label: '水闸', id: 'shuizhaLayer', visible: true },
        { label: '泵站', id: 'benzhanLayer', visible: true }
      ]
    }
    const setting = $.extend({}, defauts, option)
    if (setting.showSwitch) {
      setting.data.push({ label: '全部显示', id: 'showAll', visible: false })
    }
    const headertitle = $('<div></div>')
    headertitle.css({
      width: setting.width,
      height: setting.height,
      position: 'absolute',
      top: setting.top,
      background: 'url("' + lp + '/img/layeritle.png") no-repeat scroll 0 0',
      right: setting.right,
      cursor: 'pointer',
      position: 'absolute'
    })
    this.append(headertitle)
    headertitle.hover(
      function () {
        itemcontainer.css({
          display: 'block'
        })
      },
      function () {
        itemcontainer.css({
          display: 'none'
        })
      }
    )
    const map = setting.map
    //创建下拉显示容器
    var itemcontainer = $('<div></div>')
    itemcontainer.css({
      position: 'relative',
      top: '28px',
      display: 'none',
      background: '#fff',
      width: '115px',
      'padding-bottom': '5px',
      height: 'aoto',
      'font-size': '12px',
      border: '2px solid #addaf6',
      'border-radius': '5px'
    })
    //添加内容、
    $.each(setting.data, function (index, subvalue) {
      const subitemcontainer = $('<div></div>').attr('class', 'plugnCheck')
      subitemcontainer.hover(
        function () {
          $(this).css({
            background: '#addaf6'
          })
        },
        function () {
          $(this).css({
            background: '#fff'
          })
        }
      )
      subitemcontainer.css({
        width: '100px',
        height: '25px',
        float: 'left',
        'padding-left': '10px',
        'margin-top': '7px',
        'padding-right': '5px'
      })
      const subentityinput = $("<input type='checkbox'>")
      subentityinput
        .attr('id', subvalue.id)
        .attr('name', subvalue.id)
        .attr('checked', subvalue.visible)
      subentityinput.css({
        'padding-left': '5px',
        'margin-top': '5px',
        'padding-right': '10px'
      })
      subentityinput.change(function () {
        const ifclick = $(this).is(':checked')
        if ($(this).attr('id') == 'showAll') {
          $.each(setting.data, function (index, subvalue) {
            const showviLayer = map.getLayer(subvalue.id)
            if (typeof showviLayer !== 'undefined') {
              if (typeof showviLayer.type !== 'undefined') {
                if (ifclick) {
                  showviLayer.showAll()
                } else {
                  showviLayer.toNormal()
                }
              }
            }
          })
        } else {
          const clickLayer = map.getLayer($(this).attr('id'))
          clickLayer.setVisibility(ifclick)
        }
      })
      const subentitylabel = $('<labe></label>')
      subentitylabel.attr('for', subvalue.id)
      subentitylabel.html('&nbsp&nbsp&nbsp&nbsp' + subvalue.label)
      subitemcontainer.append(subentityinput)
      subitemcontainer.append(subentitylabel)
      itemcontainer.append(subitemcontainer)
    })
    const clearobject = $('<div></div>')
    clearobject.css({
      clear: 'both'
    })
    itemcontainer.append(clearobject)
    headertitle.append(itemcontainer)
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
  }
})(jQuery)
