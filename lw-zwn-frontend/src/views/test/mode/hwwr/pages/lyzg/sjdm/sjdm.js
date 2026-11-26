$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 16
  $('.frameDiv').css('height', height)
  $('.frameDiv').css('overflow-y', 'hidden')
  $('#sjdm_sz').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'sjdm_sz':
        src = basePath + 'pages/lyzg/sjdm/sjdm_sz/sjdm_sz.jsp'
        break
      case 'sjdm_swll':
        src = basePath + 'pages/lyzg/sjdm/sjdm_swll/sjdm_swll.jsp'
        break
      case 'sjdm_sw':
        src = basePath + 'pages/lyzg/sjdm/sjdm_sw/sjdm_sw.jsp'
        break
      case 'sjdm_szzdz':
        src = basePath + 'pages/lyzg/sjdm/sjdm_szzdz/sjdm_szzdz.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
