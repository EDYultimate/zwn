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
      /*case 'qsh':
			src=basePath+"pages/kfly/ysl/qysjc/qsh/qsh.jsp";
			break;*/
      case 'qsd':
        src = basePath + 'pages/kfly/ysl/qysjc/qsd/qsd.jsp'
        break
      case 'qshjc':
        src = basePath + 'pages/kfly/ysl/qysjc/qshjc/qshjc.jsp' //取水证关联的取水户
        break
      case 'qsdjc':
        src = basePath + 'pages/kfly/ysl/qysjc/qsdjc/qsdjc.jsp'
        break
      case 'ztxx':
        src = basePath + 'pages/kfly/ysl/qysjc/ztxx/ztxx.jsp'
        break
      case 'qskjc':
        src = basePath + 'pages/kfly/ysl/qysjc/qskjc/qskjc.jsp'
        break
      case 'qszjc':
        src = basePath + 'pages/kfly/ysl/qysjc/qszjc/qszjc.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
