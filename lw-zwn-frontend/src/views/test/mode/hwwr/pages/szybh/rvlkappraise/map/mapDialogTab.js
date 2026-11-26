$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  //	$("#sssj").click();

  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'ss':
        src = basePath + '/pages/szybh/rvlkappraise/map/ssZOrqDialog.jsp?stcd=' + stcd
        break
      case 'xy':
        src = basePath + '/pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd=' + stcd
        break
    }
    $('#iframe').attr('src', src)
  })
})
