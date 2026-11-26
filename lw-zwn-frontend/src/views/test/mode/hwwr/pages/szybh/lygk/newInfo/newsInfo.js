const slbnewsList = [
  { nm: '国务院安全生产考核组第六组考核水利部安全生产工作', tm: '2021-03-08' },
  { nm: '水利部专题部署2021年山洪灾害防御工作', tm: '2021-03-08' },
  { nm: '水利人才发展基金正式成立运行', tm: '2021-03-08' },
  { nm: '水利部全面部署推进巩固拓展水利扶贫成果和乡村振兴水利保障工作', tm: '2021-03-08' },
  { nm: '弘扬五四精神 传承红色基因 水利部青年干部举行“学党史、强信念、跟党走”', tm: '2021-03-08' },
  { nm: '水利部召开加强农村供水和灌排工程管护工作视频会', tm: '2021-03-08' }
]

const newsnum = 7
$(function () {
  init('6', '#slb_news') //水利部
  init('a', '#hw_news') //海委要闻
  init('8', '#df_news') //地方动态
  init('9', '#hb_news') //环保部门动态

  //	iniSlbnews();
  //	inihwnews();
  //	inidfnews();
  //	inihbnews();
})

//水利部
function iniSlbnews() {
  let html = ''
  for (let i = 0; i < slbnewsList.length; i++) {
    const nm = slbnewsList[i].nm
    const tm = slbnewsList[i].tm
    html +=
      '	<li><div class="linews_titleDiv">' +
      nm +
      '</div><div class="linews_tmDiv">' +
      tm +
      '</div></li>'
  }
  $('#slb_news').html(html)
}
//海委
function inihwnews() {
  let html = ''
  for (let i = 0; i < slbnewsList.length; i++) {
    const nm = slbnewsList[i].nm
    const tm = slbnewsList[i].tm
    html +=
      '	<li><div class="linews_titleDiv">' +
      nm +
      '</div><div class="linews_tmDiv">' +
      tm +
      '</div></li>'
  }
  $('#hw_news').html(html)
}
//地方
function inidfnews() {
  let html = ''
  for (let i = 0; i < slbnewsList.length; i++) {
    const nm = slbnewsList[i].nm
    const tm = slbnewsList[i].tm
    html +=
      '	<li><div class="linews_titleDiv">' +
      nm +
      '</div><div class="linews_tmDiv">' +
      tm +
      '</div></li>'
  }
  $('#df_news').html(html)
}
//环保
function inihbnews() {
  let html = ''
  for (let i = 0; i < slbnewsList.length; i++) {
    const nm = slbnewsList[i].nm
    const tm = slbnewsList[i].tm
    html +=
      '	<li><div class="linews_titleDiv">' +
      nm +
      '</div><div class="linews_tmDiv">' +
      tm +
      '</div></li>'
  }
  $('#hb_news').html(html)
}

function init(jsType, bodyId) {
  const param = {}
  param.jsType = jsType
  param.jsTitle = $('#jsTitle').val()
  param.newsnum = newsnum //新闻条数
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + 'jyys/jsxw/getTopFive', param, function (result) {
    const data = result
    let tbodyStr = ''
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const nm = isNull(data[i].JS_TITLE)
        const tm = isNull(data[i].JS_DATE)
        tbodyStr +=
          '<li onclick="newsView(\'' +
          data[i].JS_TITLE +
          "','" +
          data[i].ID +
          '\');"><div class="linews_titleDiv">' +
          nm +
          '</div><div class="linews_tmDiv">' +
          tm +
          '</div></li>'
      }

      $(bodyId).html(tbodyStr)
    } else {
      $(bodyId).html('未找到相关新闻内容')
    }
  })
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

function openlink(url) {
  window.open(url)
}

function changeTab(id) {
  $('.linkBtnDivClick').removeClass('linkBtnDivClick')
  $('#' + id + '_btn').addClass('linkBtnDivClick')
  $('.tabClassContent').hide()
  $('#' + id).show()
}

//打开更多页面
function morePage(val) {
  const url = 'pages/szybh/lygk/newInfo/moreNew.jsp?tp=' + val
  parent.changeIframe(url)
}
