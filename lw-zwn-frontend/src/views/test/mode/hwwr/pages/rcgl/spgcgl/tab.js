$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  //	$(".conent").css("height",height);
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'xfyx':
        src = basePath + 'pages/rcgl/spgcgl/spgcgl.jsp'
        break
      case 'xpwf1':
        src = basePath + 'pages/rcgl/xpwf/xpwf.jsp'
        break
      case 'qsxk':
        src = basePath + 'pages/rcgl/spgcgl/qsxk/qsxk.jsp'
        break
      case 'xpwf':
        src = basePath + 'pages/rcgl/spgcgl/xpwf/xpwf.jsp'
        break
      case 'ztxx':
        src = basePath + 'pages/rcgl/spgcgl/ztxx/ztxx.jsp'
    }
    $('#iframe').attr('src', src)
  })
})
