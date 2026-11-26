const param = {}

$(function () {
  const srcFirst =
    basePath + '/pages/szybh/ywgz/ecologyFlow/map/dbpgDialog.jsp?stcd=' + stcd + '&st_tp=' + st_tp
  $('#iframe').attr('src', srcFirst)

  if (st_tp == 2 || st_tp == 4) {
    $('#dbpgSpan').html('统计信息')
  }

  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  //	$("#sssj").click();

  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'dbpg':
        src =
          basePath +
          '/pages/szybh/ywgz/ecologyFlow/map/dbpgDialog.jsp?stcd=' +
          stcd +
          '&st_tp=' +
          st_tp
        break
      case 'ssxx':
        src =
          basePath +
          '/pages/szybh/ywgz/ecologyFlow/map/ssxxDialog.jsp?stcd=' +
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
  let sectionBasicInfoStr = '暂无信息'
  const style = "<span style='font-size: 16px;font-weight:bold;'>"
  let duanmianleixing = ''
  let kaohezhibiao = ''
  param.STCD = stcd
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowSectionBasicInfo',
    param,
    function (result) {
      console.log('resultresultresultresult:', result)
      if (result != null && result.length > 0) {
        //	    	   if(result[0].ST_TP=='1'||result[0].ST_TP=='3'){
        if (
          result[0].ST_TP == '1' ||
          result[0].ST_TP == '2' ||
          result[0].ST_TP == '3' ||
          result[0].ST_TP == '4'
        ) {
          //这里暂时写2，如果是考核断面 不过去掉这个判断，也可以加入管理断面，只不过将考核内容变成-
          switch (result[0].ASS_TAR) {
            case '1':
              kaohezhibiao = '生态水位'
              break
            case '2':
              kaohezhibiao = '生态水量'
              break
            case '3':
              kaohezhibiao = '生态基流'
              break
            default:
              kaohezhibiao = ''
          }
          switch (result[0].ST_TP) {
            case '1':
              duanmianleixing = '考核'
              break
            case '2':
              duanmianleixing = '管理'
              break
            case '3':
              duanmianleixing = '考核、管理'
              break
            case '4':
              duanmianleixing = '计算'
              break
            default:
              duanmianleixing = ''
          }
          sectionBasicInfoStr =
            style +
            isNull(result[0].STNM) +
            '</span>位于' +
            style +
            isNull(result[0].STLC) +
            '</span>，所在河湖：' +
            style +
            isNull(result[0].RV_NM) +
            '</span>，为生态流量' +
            style +
            isNull(duanmianleixing) +
            '断面</span>，考核指标为：' +
            style +
            isNull(kaohezhibiao) +
            '</span>，考核目标：' +
            style +
            isNull(result[0].ASS_GOAL) +
            '</span>，目标印发年份：' +
            style +
            isNull(result[0].TAR_Y) +
            '</span>，保障责任主体：' +
            style +
            isNull(result[0].ENS_ORG) +
            '</span>，监管责任主体：' +
            style +
            isNull(result[0].SUPSUPE_ORG) +
            '</span>，预警发布单位：' +
            style +
            isNull(result[0].WARN_ORG) +
            '</span>'
        } else {
          //		    		   sectionBasicInfoStr = style+isNull(result[0].STNM)+"</span>位于"+style+isNull(result[0].STLC)+"</span>，所在河湖："+style+isNull(result[0].RV_NM)
          //	    			   +"</span>，为生态流量"+style	+isNull(duanmianleixing)+"</span>，考核指标为："+style+isNull(kaohezhibiao)
          //	    			   +"</span>，考核目标："+style	+isNull(result[0].ASS_GOAL)+"</span>，目标印发年份："+style+isNull(result[0].TAR_Y)
          //	    			   +"</span>，保障责任主体："+style+isNull(result[0].ENS_ORG)+"</span>，监管责任主体："+style+isNull(result[0].SUPSUPE_ORG)
          //	    			   +"</span>，预警发布单位："+style+isNull(result[0].WARN_ORG)+"</span>";
        }
        //    			   $("#titleBasicInfoDiv").empty().append(sectionBasicInfoStr);

        $('#sectionBasicInfoDiv').empty().append(sectionBasicInfoStr)

        $('#sectionNMspan').empty().append(result[0].STNM)
        $('#sectionTypeSpan').empty().append(duanmianleixing)
        $('#provienceSpan')
          .empty()
          .append(result[0].PUBLIC_ORG == '水利部' ? '跨省' : '省内')
      }
    }
  )
}
