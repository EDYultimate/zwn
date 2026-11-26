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
      case 'dbszzk':
        src =
          basePath +
          '/pages/szybh/ywgz/waterEnvQuality/aboveWaterQualityStatus/aboveWaterQualityStatus.jsp'
        break
      case 'dxszzk':
        src = basePath + '/pages/szybh/ywgz/waterEnvQuality/belowWaterQuality/belowWaterQuality.jsp'
        break
      case 'dbsjc':
        src = basePath + '/pages/szybh/ywgz/waterEnvQuality/aboveWaterQuality/aboveWaterQuality.jsp'
        break
      case 'szzdjcsj':
        src =
          basePath + '/pages/szybh/ywgz/waterEnvQuality/WaterAutoMonitor/WaterAutoMonitorDetail.jsp'
        break
      case 'dxsznb':
        src =
          basePath +
          '/pages/szybh/ywgz/waterEnvQuality/belowWaterYearFillList/belowWaterYearFillList.jsp'
        break
    }
    $('#iframeEF').attr('src', src)
  })
})
