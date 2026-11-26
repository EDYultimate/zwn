const pageSize = '15'
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 110 - $('.titleDiv').height() - $('.M-box').height()
  $('.bbTable').css('height', tbHeight + 'px')
  //    pageSize = Math.floor((tbHeight)/30)-2;

  if (tp == '6') {
    $('.active').text('水利部要闻')
  }
  if (tp == 'a') {
    $('.active').text('海委要闻')
  }
  if (tp == '8') {
    $('.active').text('地方动态')
  }
  if (tp == '9') {
    $('.active').text('环保部门动态')
  }
  search(1)
})
//
//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const jsTitle = ''
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.jsType = tp
  param.jsTitle = jsTitle
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  param.nowTime = Math.random() //考虑ie浏览器刷新
  if (source_url == 'http://www.hwcc.gov.cn/wwgj/n') {
    param.source_url = source_url
  }
  const index = layer.load()
  jQuery.getJSON(basePath + 'szybh/ywgz/getNews', param, function (result) {
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<li><a href="javascript:newsView(\'' +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          '\');">' +
          '' +
          isNull(data[i].JS_TITLE) +
          '</a><span class="fr">' +
          isNull(data[i].JS_DATE) +
          '</span></li>'
      }
    } else {
      tbodyStr += '暂无数据'
    }
    $('#tbody').empty().append(tbodyStr)
    $('.M-box').pagination({
      pageCount: result.page.pages, //初始化时总页数3页
      current: CurrentPage,
      callback: function (api) {
        search(api.getCurrent())
      }
    })
    $('.tolSpan').html('共' + result.page.total + '条')
    $('.M-box').show()
    layer.close(index)
  })
}

//判断某个字符在字符串出现的次数
function countString(str, s) {
  let count = 0
  for (let i = 0; i <= str.length; i++) {
    if (str.indexOf(s) == i) {
      str = str.substring(i + 1, str.length)
      count++
    }
  }
  return count
}

function newsView(title, id) {
  parent.layer.open({
    type: 2,
    title: title,
    shadeClose: true,
    shade: 0.8,
    area: ['100%', '100%'],
    content: basePath + '/pages/jyys_new/jsxw/newsView.jsp?id=' + id
  })
}

//返回新闻页面
function tobackPage() {
  const url = 'pages/szybh/ywgz/sy/sy.jsp'
  parent.changeIframe(url)
}
