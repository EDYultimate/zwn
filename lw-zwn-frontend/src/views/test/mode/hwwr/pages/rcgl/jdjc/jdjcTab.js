$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'jdtj':
        src = basePath + 'pages/rcgl/jdjc/jdjcTj.jsp'
        break
      case 'jdjc':
        src = basePath + 'pages/rcgl/jdjc/jdjc.jsp'
        break
      case 'xcgl':
        src = basePath + 'pages/rcgl/jdjc/xcTab.jsp'
        break
      case 'xgwd':
        src = basePath + 'pages/rcgl/sthx/khwd/khwd.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
