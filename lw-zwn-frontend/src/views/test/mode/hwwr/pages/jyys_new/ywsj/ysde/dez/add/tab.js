$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#hztj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'gy':
        src = basePath + 'pages/jyys_new/ywsj/ysde/dez/add/add_gy.jsp'
        break
      case 'ny':
        src = basePath + 'pages/jyys_new/ywsj/ysde/dez/add/add_ny.jsp'
        break
      case 'sh':
        src = basePath + 'pages/jyys_new/ywsj/ysde/dez/add/add_sh.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
