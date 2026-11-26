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
      case 'csgsl':
        src = basePath + 'pages/kfly/gsl/gsfx/csgsl/jcqgysl.jsp'
        break
      default:
        src = basePath + 'pages/kfly/gsl/gsfx/gsl/gs.jsp'
    }
    $('#iframe').attr('src', src)
  })
})
