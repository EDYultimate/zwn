$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 50
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'ly':
        src = basePath + 'pages/kfly/hsl/ET/ly/ly.jsp'
        break
      case 'xzq':
        src = basePath + 'pages/kfly/hsl/ET/xzq/xzq.jsp'
        break
      case 'etPic':
        src = basePath + 'pages/kfly/hsl/ET/pic/pic.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
