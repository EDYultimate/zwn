$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#khtj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'gzjz': //工作进展情况
        src = basePath + 'pages/jyys_new/ywsj/jskh/jdjc/gzjz/gzjz.jsp'
        break
      case 'tczf': //突出做法
        src = basePath + 'pages/jyys_new/ywsj/jskh/jdjc/tczf/tczf.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
