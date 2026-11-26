$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'sssj':
        src = basePath + 'pages/kfly/skxsl/sssj/sssj.jsp'
        break
      case 'tjxx':
        src = basePath + 'pages/kfly/skxsl/tjxx/skxsl.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
