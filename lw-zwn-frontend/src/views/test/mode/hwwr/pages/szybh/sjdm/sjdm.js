$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80 - 16
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#sjdm_sz').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'sjdm_sz':
        src = basePath + 'pages/szybh/sjdm/sjdm_sz/sjdm_sz.jsp'
        break
      case 'sjdm_swll':
        src = basePath + 'pages/szybh/sjdm/sjdm_swll/sjdm_swll.jsp'
        break
      case 'sjdm_sw':
        src = basePath + 'pages/kfly/gsl/dxs/ldsj/dxsld.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
