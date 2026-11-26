$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'jbxx':
        src = basePath + 'pages/jyys_new/ztyj/jbxx/jbxx.jsp'
        break
      case 'zfjl':
        src = basePath + 'pages/jyys_new/ztyj/zfjl/zfjl.jsp'
        break
      case 'psys':
        src = basePath + 'pages/jyys_new/ztyj/psys/psys.jsp'
        break
      case 'xmcg':
        src = basePath + 'pages/jyys_new/ztyj/xmcg/xmcg.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
