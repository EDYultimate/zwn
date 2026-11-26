// 配置段落名称
const section = {
  1: '综述',
  2: '浅层地下水埋深',
  3: '浅层地下水水位变化',
  4: '浅层地下水蓄变量'
}
let pagedata = {}

function makeSidebar() {
  $('#listpage').empty()
  for (const i in section) {
    const title = section[i]
    const str = '<li><a onclick=\'javascript:loadpic("' + i + '")\'>' + title + '</a></li>'
    $('#listpage').append(str)
  }
}

function init() {
  $.post(
    hwwr.basePath + 'message/dxs/pdfurl',
    {
      yearNo: hwwr.option.yearNo
    },
    function (data) {
      pagedata = JSON.parse(data)
      // 初始化点击第一章
      $($('#listpage a')[0]).click()
    }
  )
}

// 加载图片
function loadpic(idx) {
  $('#rbottom').empty()
  if (pagedata == {}) {
    return
  }
  const listpic = pagedata[idx]
  for (let i = 0; i < listpic.length; ++i) {
    const str = "<img src='" + listpic[i] + "' alt='' style='width: 100%;'>"
    $('#rbottom').append(str)
  }
  $('#stitle').text(section[idx])
}

// 生成 x年x期 标题
function maketitle() {
  const yearNo = hwwr.option.yearNo
  const year = yearNo.substr(0, 4)
  const section = yearNo.substr(4, 1)
  $('#syear').text(year)
  $('#section').text(section)
}

//
$(document).ready(function () {
  makeSidebar()
  maketitle()
  init()
  $('#rbottom').perfectScrollbar()
})
