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
      case 'khtj': //考核统计
        src = basePath + 'pages/jyys_new/ywsj/jskh/khtj/khtj.jsp'
        break
      case 'hxzb': //红线指标
        src = basePath + 'pages/jyys_new/ywsj/jskh/hxzb/hxzb.jsp'
        break
      case 'jdjc': //监督检查
        src = basePath + 'pages/jyys_new/ywsj/jskh/jdjc/tab.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
