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
      case 'ztqk':
        src = basePath + 'pages/jyys_new/ywsj/xydb/ztqk/ztqk.jsp'
        break
      case 'hztj':
        src = basePath + 'pages/jyys_new/ywsj/xydb/hztj/hztj.jsp'
        break
      case 'dbml':
        src = basePath + 'pages/jyys_new/ywsj/xydb/dbml/dbml.jsp'
        break
      case 'jdjc':
        src = basePath + 'pages/jyys_new/ywsj/xydb/jdjc/jdjc.jsp'
        break
      case 'fytj':
        src = basePath + 'pages/jyys_new/ywsj/xydb/fytj/fytj.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
