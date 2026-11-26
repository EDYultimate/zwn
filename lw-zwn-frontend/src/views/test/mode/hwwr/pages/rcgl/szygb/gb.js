$(document).ready(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'l0':
        src = basePath + 'pages/lyzg/szygb/szygb.jsp'
        break
      case 'l1':
        src = basePath + 'pages/rcgl/szygb/gsl/gsl.jsp'
        break
      case 'l2':
        src = basePath + 'pages/rcgl/szygb/ysl/ysl.jsp'
        break
      case 'l3':
        src = basePath + 'pages/rcgl/szygb/hsl/hsl.jsp'
        break
      case 'l4':
        src = basePath + 'pages/rcgl/szygb/pwl/pwl.jsp'
        break
      case 'l5':
        src = basePath + 'pages/rcgl/szygb/jsl/jsl.jsp'
        break
      case 'l6':
        src = basePath + 'pages/rcgl/szygb/szyl/szyl.jsp'
        break
      case 'l7':
        src = basePath + 'pages/rcgl/szygb/gbsl/gbsl.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
