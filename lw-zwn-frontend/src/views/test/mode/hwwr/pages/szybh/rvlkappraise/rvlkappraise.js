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
      case 'appraise':
        src = basePath + '/pages/szybh/rvlkappraise/appraise/appraise.jsp'
        break
      case 'subtoappraise':
        src = basePath + '/pages/szybh/rvlkappraise/addData/addData.jsp'
        break
      case 'map':
        src = basePath + '/pages/szybh/rvlkappraise/map/map.jsp'
        break
      case 'yz':
        src = basePath + '/pages/szybh/rvlkappraise/yzUp/yzUp.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
