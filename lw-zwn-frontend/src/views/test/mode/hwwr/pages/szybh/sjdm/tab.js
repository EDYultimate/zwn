$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-40;
  const height = hh - $('.right_menu').height() - 20
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'sjdm':
        src = basePath + 'pages/szybh/sjdm/sjdm_sz/sjdm_sz.jsp'
        break
      case 'szgk':
        src = basePath + 'pages/szybh/sjdm/szgk/hlszyzl.jsp'
        break
      case 'hpsz':
        src = basePath + 'pages/szybh/sjdm/hpsz/hpszyzl.jsp'
        break
      case 'sksz':
        src = basePath + 'pages/szybh/sjdm/sksz/skszyzl.jsp'
        break
      case 'sjstsz':
        src = basePath + 'pages/szybh/sjdm/sjstsz/sjstsz.jsp'
        break
      case 'pydxssz':
        src = basePath + 'pages/szybh/sjdm/pydxssz/pyqcdxs.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
