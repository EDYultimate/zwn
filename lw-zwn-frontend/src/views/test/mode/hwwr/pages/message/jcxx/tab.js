$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'jcxx':
        src = basePath + 'pages/message/jcxx/jcxx/jcxx.jsp'
        break
      case 'skxx':
        src = basePath + 'pages/message/jcxx/skxx/sssj.jsp'
        break
      case 'czxx':
        src = basePath + 'pages/message/jcxx/czxx/sjdm_swll.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
