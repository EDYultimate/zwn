$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'zg':
        src = basePath + 'pages/szybh/yysyd/zg/yysyd.jsp'
        break
      case 'fzg':
        src = basePath + 'pages/szybh/yysyd/fzg/fzgsyd.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
