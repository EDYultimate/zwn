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
      case 'tbzs':
        src = basePath + 'pages/rcgl/sthx/tbzs/sthx.jsp'
        break
      case 'zxjd':
        src = basePath + 'pages/rcgl/sthx/zxjd/zxjd.jsp'
        break
      case 'glzdkh':
        src = basePath + 'pages/rcgl/sthx/glzdkh/glzd.jsp'
        break
      /* case 'khwd':
	     	src=basePath+"pages/rcgl/sthx/khwd/khwd.jsp";
			break;*/
    }
    $('#iframe').attr('src', src)
  })
})
