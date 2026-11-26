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
      case 'tj':
        src = basePath + 'pages/nsbd/tj/nsbdTj.jsp'
        break
      case 'up':
        src = basePath + 'pages/nsbd/up/up.jsp'
        break
      case 'dayup':
        src = basePath + 'pages/nsbd/dayUp/dayUp.jsp'
        break
      case 'zl':
        src = basePath + 'pages/nsbd/fileInfo/fileInfo.jsp'
        break
      case 'fa':
        src = basePath + 'pages/nsbd/fafile/fafile.jsp'
        break
      case 'jd':
        src = basePath + 'pages/nsbd/jdfile/jdfile.jsp'
        break
      case 'daytj':
        src = basePath + 'pages/nsbd/dayTj/dayUp.jsp'
        break
      case 'stcdinfo':
        src = basePath + 'pages/nsbd/stcdinfo/stcdinfo.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
