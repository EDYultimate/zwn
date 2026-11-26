$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  //	$(".conent").css("height",height);
  $('.conent').css('overflow-y', 'hidden')
  //$("#sssj").click();
  $('#ss').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'jc':
        src = basePath + 'pages/szybh/rhpwk/jc/jc.jsp'
        break
      case 'tj':
        src = basePath + '/pages/szybh/rhpwk/tj/tj.jsp'
        break
      case 'ss':
        src = basePath + '/pages/szybh/rhpwk/ss/ss.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
