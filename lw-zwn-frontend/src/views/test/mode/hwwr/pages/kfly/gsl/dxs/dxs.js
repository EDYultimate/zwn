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
      case 'sssj':
        //			src=basePath+"pages/kfly/gsl/dxs/tjTab.jsp";
        src = basePath + 'pages/kfly/gsl/dxs/sssj/sssj.jsp'
        break
      case 'gbsj':
        src = basePath + 'pages/kfly/gsl/dxs/gbsj/pydxs.jsp'
        break
      case 'ldsj':
        src = basePath + 'pages/kfly/gsl/dxs/ldsj/dxsld.jsp'
        break
      case 'dxscc':
        src = basePath + 'pages/kfly/gsl/dxs/dxscc/dxscc.jsp'
        break
      case 'pjms':
        src = basePath + 'pages/kfly/cus/pjms/pjms.jsp'
        break
      case 'qsfx':
        src = basePath + 'pages/kfly/cus/qsfx/qsfx.jsp'
        break
      case 'dxsgcxx':
        src = basePath + 'pages/kfly/cus/station/dxsgc.jsp'
        break
    }

    $('#iframe').attr('src', src)
  })
})
