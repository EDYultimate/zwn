/*
 * 地图图例控件
 */
;(function ($) {
  $.fn.TwoDropDown = function (option) {
    const state = 'open'
    const container = this
    const lp = getJSPath('TwoDropDown.js')
    //默认参数
    const defaults = {
      firstdiv: '',
      seconddiv: ''
    }
    const setting = $.extend({}, defaults, option) //参数集合
    //第一个下拉框
    const firstDown = $('<div></div>')
    firstDown.css({
      width: 170,
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      marginLeft: 5,
      marginTop: 35,
      border: '1px solid #CCCCCC'
    })
    const firstItemArr = [
      { label: '枢纽工程管理处', id: '1' },
      { label: '二干渠管理处', id: '1' },
      { label: '总干渠管理处', id: '1' },
      { label: '三干渠管理处', id: '1' },
      { label: '四干渠管理处', id: '1' },
      { label: '团林灌溉试验站', id: '1' }
    ]
    this.children('div').eq(0).children('.content')
.append(firstDown)
    const len = firstItemArr.length
    $.each(firstItemArr, function (index, item) {
      const firstItem = $(
        '<div class="orgItem unSelected">' + '&nbsp&nbsp&nbsp&nbsp' + item.label + '</div>'
      ).attr('lb', item.label)
      firstDown.append(firstItem)
    })
    firstDown.height(30 * len + 2)
    firstDown.children('.orgItem').on('click', firstDownHandler)

    //第二个下拉框
    const SecondItemArr = [
      { label: '枢纽工程管理处', id: '1' },
      { label: '二干渠管理处', id: '1' },
      { label: '总干渠管理处', id: '1' },
      { label: '三干渠管理处', id: '1' },
      { label: '四干渠管理处', id: '1' },
      { label: '团林灌溉试验站', id: '1' }
    ]
    const secondDown = $('<div></div>')
    secondDown.css({
      width: 170,
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      marginLeft: 5,
      marginTop: 35,
      border: '1px solid #CCCCCC'
    })
    this.children('div').eq(1).children('.content')
.append(secondDown)
    console.log(secondDown)
    const len2 = SecondItemArr.length
    $.each(SecondItemArr, function (index, item) {
      const secondItem = $(
        '<div class="orgItem unSelected">' + '&nbsp&nbsp&nbsp&nbsp' + item.label + '</div>'
      ).attr('lb', item.label)
      secondDown.append(secondItem)
    })
    secondDown.height(30 * len2 + 2)
    secondDown.children('.orgItem').on('click', firstDownHandler)

    //管理所点击
    function firstDownHandler(event) {
      //	alert($(event.target).attr("lb"));
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

    return this
  }
})(jQuery)
