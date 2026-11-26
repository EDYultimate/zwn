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
      case 'ztqk': //总体情况
        src = basePath + 'pages/jyys_new/ywsj/jspj/ztqk/ztqk.jsp'
        break
      case 'pjfw': //评价范围
        src = basePath + 'pages/jyys_new/ywsj/jspj/pjfw/pjfw.jsp'
        break
      case 'xmtz': //项目台账
        src = basePath + 'pages/jyys_new/ywsj/jspj/xmtz/xmtz.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
