const param = {}

$(function () {
  console.log(111)
  const srcFirst = basePath + '/pages/szybh/ywgz/drinkProtect/map/szpjDialog.jsp?SWS_CD=' + SWS_CD
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
      case 'szpj':
        src = basePath + '/pages/szybh/ywgz/drinkProtect/map/szpjDialog.jsp?SWS_CD=' + SWS_CD
        break
      case 'dbjsqk':
        src = basePath + '/pages/szybh/ywgz/drinkProtect/map/dbjsqkDialog.jsp?SWS_CD=' + SWS_CD
        break
    }
    $('#iframe').attr('src', src)
  })

  getSWSBasicInfo()
})

function getSWSBasicInfo() {
  let SWSBasicInfoStr = ''
  const style = "<span style='font-size: 16px;font-weight:bold;'>"
  let SWS_TP_NAME = ''
  param.SWS_CD = SWS_CD
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterDrinkProtectKeyBasicInfo',
    param,
    function (result) {
      console.log('resultresultresultresult:', result)
      if (result != null && result.length > 0) {
        //	    	   if(result[0].ST_TP=='1'||result[0].ST_TP=='3'){
        switch (result[0].SWS_TP) {
          case '1':
            SWS_TP_NAME = '水库'
            break
          case '2':
            SWS_TP_NAME = '地下水'
            break
          case '3':
            SWS_TP_NAME = '河道'
            break
          default:
            SWS_TP_NAME = ''
        }

        SWSBasicInfoStr =
          '位于' +
          style +
          isNull(result[0].PROVINEC_NM) +
          '</span>，水源地类型：' +
          style +
          isNull(SWS_TP_NAME) +
          '</span>，供水城市' +
          style +
          isNull(result[0].SUPPLY_CITY) +
          '</span>，供水人口：' +
          style +
          isNull(result[0].POPULATION) +
          '</span>，管理单位所属行业：' +
          style +
          isNull(result[0].ORG_INDUSTRY) +
          '</span>'

        $('#sectionBasicInfoDiv').empty().append(SWSBasicInfoStr)

        //    			   $("#sectionNMspan").empty().append(result[0].STNM);
        //    			   $("#sectionTypeSpan").empty().append(duanmianleixing);
        //    			   $("#provienceSpan").empty().append(result[0].PUBLIC_ORG=="水利部"?"跨省":"省内");
      }
    }
  )
}
