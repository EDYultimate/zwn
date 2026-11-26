$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#khtj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'qysjksj': //取用水监控数据
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysqk/qysjksj/qysjksj_new.jsp'
        break
      case 'dftjsj': //地方统计数据
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysqk/dftjsj/dftjsj.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
