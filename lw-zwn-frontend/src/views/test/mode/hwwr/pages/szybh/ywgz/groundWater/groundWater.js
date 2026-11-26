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
      case 'map':
        src = basePath + '/pages/szybh/ywgz/groundWater/map/map.jsp'
        break
      case 'qtzdqy':
        src = basePath + '/pages/szybh/ywgz/groundWater/otherKeyArea/map/map.jsp'
        break
      case 'dxswtb':
        src = basePath + '/pages/szybh/ywgz/groundWater/waterNotify/map/map.jsp'
        break
      case 'yz':
        src = basePath + '/pages/szybh/rvlkappraise/yzUp/yzUp.jsp'
        break
    }
    //		src="http://10.3.34.163:8282/gwnc/pages/baseinfo/replenish/stat/index.html";

    $('#iframeEF').attr('src', src)
  })
})
