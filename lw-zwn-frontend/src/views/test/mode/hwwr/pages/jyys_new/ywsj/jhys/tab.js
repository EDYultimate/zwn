$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#tjfx').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      /*case 'tjfx'://统计分析
                src=basePath+"pages/jyys_new/ywsj/jhys/tjfx/tjfx.jsp";
                break;*/
      case 'wtqd': //问题清单
        src = basePath + 'pages/jyys_new/ywsj/jhys/wtqd/wtqd.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
