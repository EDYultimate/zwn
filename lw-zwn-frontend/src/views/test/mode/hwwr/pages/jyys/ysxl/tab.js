$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    debugger
    switch ($(this).attr('id')) {
      case 'tjxx':
        src = basePath + 'pages/jyys/ysxl/tjxx/ctwuem.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
