$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'spff':
        src = basePath + 'pages/kfly/qsxk/qsxk/spff/dfbstt.jsp'
        break
      case 'zxdx':
        src = basePath + 'pages/kfly/qsxk/qsxk/zxdx/dfablstt.jsp'
        break
      case 'nzby':
        src = basePath + 'pages/kfly/qsxk/qsxk/nzby/lcnystt.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
