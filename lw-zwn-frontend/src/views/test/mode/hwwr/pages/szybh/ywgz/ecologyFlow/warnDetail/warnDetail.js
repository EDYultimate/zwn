let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  //    pageSize = Math.floor((tbHeight)/30)-2;
  //  $(".bbTable").css("height","500px");
  const date = new Date()
  $('#nianFen').val(date.getFullYear())
  pageSize = 10

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.TAR_Y = $('#nianFen').val()
  param.PUBLIC_ORG = $('#yinFaJiGou').val()
  param.RV_NM = $('#heHuMingCheng').val()
  param.ST_TP = $('#duanPianLeiXing').val()
  param.STNM = $('#duanMianMingCheng').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  //    console.log("cccc:");

  //用于给gis地图传送数据的接口
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowGisWarnInfo',
    param,
    function (result) {
      console.log('result:', result)
    }
  )
  //    var checkResNum= 0;
  //    jQuery.getJSON(basePath+"szybh/ywgz/getSaveWaterEcologyFlowCheckResNum",param,function(result){
  //      console.log("CheckResNum:",result);
  //      checkResNum = result.CHECKRESNUM;
  //      $("#totalSectionCheckNum").text(isNull(checkResNum));
  //   });
  const totalDBNUM = 0
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowWarnDetailInfo',
    param,
    function (result) {
      const data = result.page.list
      $('#totalSectionNum').text(isNull(result.page.total))

      jQuery.getJSON(
        basePath + 'szybh/ywgz/getSaveWaterEcologyFlowCheckResNum',
        param,
        function (resultCheck) {
          console.log('getSaveWaterEcologyFlowCheckResNum:', resultCheck)

          //	    	 var CHECKRESNUM = resultCheck.CHECKRESNUM;
          //	         if(param.ST_TP==2||param.ST_TP==3||param.ST_TP==4){
          //	        	 CHECKRESNUM = 0;
          //	             $("#totalSectionCheckNum").text(0);
          //	         }else{
          //	             $("#totalSectionCheckNum").text(isNull(CHECKRESNUM));
          //	         }
          $('#totalSectionCheckNum').text(isNull3(resultCheck.CHECKRESNUM))
          $('#totalSectionManageNum').text(isNull3(resultCheck.MANAGERESNUM))
          $('#totalSectionComputeNum').text(isNull3(resultCheck.COMPUTERESNUM))
          $('#totalSectionCheckManageNum').text(isNull3(resultCheck.CHECKMANAGERESNUM))

          //            $("#totalSectionManageNum").text(isNull(result.page.total-CHECKRESNUM));

          $('#totalDBnum').text(isNull(resultCheck.dbrateNum))
        }
      )

      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          //                var dbpercent='';
          //                if(data[i].ST_TP==1||data[i].ST_TP==3){
          //                	if(data[i].DBNUM!=null&&data[i].DBNUM!='-1'){
          ////                		totalDBNUM += data[i].DBNUM;
          //                		dbpercent=(parseFloat(data[i].DBNUM)/parseFloat(data[i].REL_CHECK_TIME_NUM)*100).toFixed(1);
          //                		if(dbpercent==100.0)
          //                			totalDBNUM += 1;
          ////                    	console.log("totalDBNUM:   ",data[i].STCD);
          //                	}
          //                }
          var duanmianleixing
          switch (data[i].ST_TP) {
            case '1':
              duanmianleixing = '考核断面'
              break
            case '2':
              duanmianleixing = '管理断面'
              break
            case '3':
              duanmianleixing = '考核、管理断面'
              break
            case '4':
              duanmianleixing = '计算断面'
              break
            default:
              duanmianleixing = ''
          }
          var pingjiashichang
          switch (data[i].ASS_TP) {
            case '1':
              pingjiashichang = '日'
              break
            case '2':
              pingjiashichang = '旬均'
              break
            case '3':
              pingjiashichang = '月均'
              break
            case '4':
              pingjiashichang = '季均'
              break
            case '5':
              pingjiashichang = '年累计'
              break
            default:
              pingjiashichang = ''
          }

          const no = (CurrentPage - 1) * pageSize + (i + 1)
          tbodyStr +=
            '<tr>' +
            "<td title='" +
            no +
            "'>" +
            no +
            '</td>' +
            "<td title='" +
            isNull(data[i].STNM) +
            "'><a href='javascript:void(0)'  onclick='do_support(" +
            '"' +
            data[i].STNM +
            '","' +
            data[i].STCD +
            '",' +
            data[i].ST_TP +
            ")'>" +
            isNull(data[i].STNM) +
            '</a></td>' +
            "<td title='" +
            isNull(data[i].RV_NM) +
            "'  >" +
            isNull(data[i].RV_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].PUBLIC_ORG) +
            "'  >" +
            isNull(data[i].PUBLIC_ORG) +
            '</td>' +
            "<td title='" +
            isNull(duanmianleixing) +
            "'  >" +
            isNull(duanmianleixing) +
            '</td>' +
            "<td title='" +
            isNull(data[i].TAR_Y) +
            "'  >" +
            isNull(data[i].TAR_Y) +
            '</td>' +
            "<td title='" +
            isNull(pingjiashichang) +
            "'  >" +
            isNull(pingjiashichang) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ASS_TIME) +
            "'  >" +
            isNull(data[i].ASS_TIME) +
            '</td>' +
            "<td title='" +
            isNull(data[i].CHECK_TIME_NUM) +
            "'  >" +
            isNull(data[i].CHECK_TIME_NUM) +
            '</td>' +
            "<td title='" +
            isNull2(data[i].REL_CHECK_TIME_NUM) +
            "'  >" +
            isNull2(data[i].REL_CHECK_TIME_NUM) +
            '</td>' +
            "<td title='" +
            isNull2(data[i].DBNUM) +
            "'  >" +
            isNull2(data[i].DBNUM) +
            '</td>' +
            "<td title='" +
            isNull3(data[i].DBRATE) +
            "'  >" +
            isNull3(data[i].DBRATE) +
            '</td>' +
            //                "<td title='"+dbpercent+"'  >"+isNull(dbpercent)+"%</td>" +
            '</tr>'
        }
        for (let x = data.length; x < pageSize; x++) {
          tbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
        }
      } else {
        for (var i = 0; i < pageSize; i++) {
          tbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
        }
      }
      //    	console.log("totalDBNUM:   ",totalDBNUM);

      //        $("#totalDBnum").text(isNull(totalDBNUM));

      //        $("#totalDBrate").text("保证度:"+isNull((parseFloat(totalDBNUM)/26*100).toFixed(1))+"%");

      $('#TableData').empty().append(tbodyStr)
      //        $("#tbody2").empty().append(tbodyStr);
      $('.M-box').pagination({
        pageCount: result.page.pages, //初始化时总页数3页
        current: CurrentPage,
        callback: function (api) {
          search(api.getCurrent())
        }
      })
      $('.tolSpan').html('共' + result.page.total + '条')

      $('.M-box').show()

      layer.close(index)
    }
  )
}

function do_support(nm, stcd, st_tp) {
  console.log('do_support:   ', nm, stcd, st_tp)
  //	nm="官厅水库" ;
  //	stcd='00000003' ;
  //	st_tp=1 ;

  top.layer.open({
    type: 2,
    title: nm + '断面信息统计', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1300px', '650px'],
    content:
      basePath +
      'pages/szybh/ywgz/ecologyFlow/map/mapDialogTab.jsp?stcd=' +
      stcd +
      '&st_tp=' +
      st_tp //pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
  })
}

/*处理表格空或者未定义字段*/
function isNull2(vad) {
  console.log(vad)

  if (
    vad === undefined ||
    vad === null ||
    vad === '' ||
    vad === 'undefined' ||
    vad === 'null' ||
    vad === -1
  ) {
    return '-'
  }
  return vad
}

function isNull3(vad) {
  console.log(vad)

  if (vad === -100) {
    return '-'
  }
  return vad + '%'
}

//打印方法
function printpage() {
  printData('dydiv', 'dytable')
}

$('#waterReport_btn_generate_excel').click(function () {
  if (document.getElementById('TableData').rows.length <= 0) {
    alert('无下载数据')
  } else {
    excel = new ExcelGen({
      src_id: 'dytable',
      show_header: true
    })
    excel.generate()
  }
})

function isNull3(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return '0'
  }
  return vad
}
