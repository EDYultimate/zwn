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
      case 'sssj':
        src = basePath + 'pages/kfly/gsl/nsbd/jcxx/jcxx.jsp'
        break
      case 'tjxx':
        src = basePath + 'pages/kfly/gsl/nsbd/tjxx/tjxx.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
