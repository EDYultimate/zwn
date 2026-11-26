const param = {}

$(function () {
  //	console.log(111);
  const srcFirst =
    basePath + '/pages/szybh/ywgz/waterEnvQuality/belowWaterQuality/szpjjgDialog.jsp?ID=' + ID
  $('#iframe').attr('src', srcFirst)

  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  //	$("#sssj").click();

  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'szpjjg':
        src =
          basePath + '/pages/szybh/ywgz/waterEnvQuality/belowWaterQuality/szpjjgDialog.jsp?ID=' + ID
        break
      case 'dbjsqk':
        src =
          basePath +
          '/pages/szybh/ywgz/drinkProtect/map/dbjsqkDialog.jsp?stcd=' +
          stcd +
          '&st_tp=' +
          st_tp
        break
    }
    $('#iframe').attr('src', src)
  })

  getSectionBasicInfo()
})

function getSectionBasicInfo() {
  let stationBasicInfoDiv = '-'
  const style = "<span style='font-size: 16px;font-weight:bold;'>"
  param.ID = ID
  param.pageSize = 1
  param.pageNo = 1
  param.TP = 1
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterWaterEnvDetail', param, function (result) {
    console.log('getSaveWaterWaterEnvBelowDetail:', result.page.list)
    const data = result.page.list

    if (data != null && data.length > 0) {
      stationBasicInfoDiv =
        style +
        isNull(data[0].STNM) +
        '</span>位于' +
        style +
        isNull(data[0].ADDRESS) +
        '</span>，测站类型：' +
        style +
        isNull(data[0].CATEGORY) +
        '</span>'
    }
    $('#stationBasicInfoDiv').empty().append(stationBasicInfoDiv)
  })
}
