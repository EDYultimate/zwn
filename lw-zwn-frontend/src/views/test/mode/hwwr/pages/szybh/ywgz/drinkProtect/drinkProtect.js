$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  //	$(".conent").css("overflow-y","hidden");
  //	$("#sssj").click();
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'map':
        src = basePath + '/pages/szybh/ywgz/drinkProtect/map/map.jsp'
        break
      case 'zgsyd':
        src = basePath + '/pages/szybh/ywgz/drinkProtect/directWaterSource/directWaterSource.jsp'
        break
      case 'khsz':
        src = basePath + '/pages/szybh/ywgz/ecologyFlow/checkSet/checkSet.jsp'
        break
      case 'yz':
        src = basePath + '/pages/szybh/rvlkappraise/yzUp/yzUp.jsp'
        break
    }
    $('#iframeEF').attr('src', src)
  })
})
