let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");
  const date = new Date()
  $('#nianFen').val(date.getFullYear() - 1)
  pageSize = 10

  search(1)
})

//页面初始化
function search(CurrentPage) {
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDrinkProtectGisAlarm', function (result) {
    console.log('getSaveWaterDrinkProtectGisAlarm ', result)
  })

  let tbodyStr = ''

  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  const date = new Date()
  //	$("#nianFen").val(date.getFullYear());
  param.YR = $('#nianFen').val()
  param.PROVINEC_NM = $('#xingZhengQu').val()
  const nm = $('#shuiYuanDiMingCheng').val()
  console.log('aaa ', nm)
  param.SWS_NM = nm

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  //    console.log("cccc:");
  //    jQuery.getJSON(basePath+"szybh/ywgz/getSaveWaterDrinkProtectGis",param,function(result){
  //       console.log("getSaveWaterDrinkProtectGis:",result);
  //    });
  //    var totalDBNUM=0;
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterDrinkProtectKeyDetailInfo',
    param,
    function (result) {
      console.log('getSaveWaterDrinkProtectKeyDetailInfo:', result)

      const data = result.page.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var SWS_TP_NAME
          switch (data[i].SWS_TP) {
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

          //            	 var no=(CurrentPage-1)*pageSize+(i+1);
          tbodyStr +=
            '<tr>' +
            //	                "<td title='"+no+"'>"+no+"</td>" +
            "<td title='" +
            isNull(data[i].STNM) +
            "'><a href='javascript:void(0)'  onclick='do_support(" +
            '"' +
            data[i].SWS_NM +
            '","' +
            data[i].SWS_CD +
            '")\'>' +
            isNull(data[i].SWS_NM) +
            '</a></td>' +
            "<td title='" +
            isNull(data[i].RV_NM) +
            "'  >" +
            isNull(data[i].PROVINEC_NM) +
            '</td>' +
            "<td title='" +
            isNull(SWS_TP_NAME) +
            "'  >" +
            isNull(SWS_TP_NAME) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SUPPLY_CITY) +
            "'  >" +
            isNull(data[i].SUPPLY_CITY) +
            '</td>' +
            "<td title='" +
            isNull(data[i].POPULATION) +
            "'  >" +
            isNull(data[i].POPULATION) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ORG_INDUSTRY) +
            "'  >" +
            isNull(data[i].ORG_INDUSTRY) +
            '</td>' +
            "<td title='" +
            isNull(data[i].DBRATE) +
            "'  >" +
            isNull(data[i].DBRATE) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ASSESS_RES) +
            "'  >" +
            isNull(data[i].ASSESS_RES) +
            '</td>' +
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
            '</tr>'
        }
      }
      //    	console.log("totalDBNUM:   ",totalDBNUM);

      //        $("#totalDBnum").text(isNull(totalDBNUM));

      //        $("#totalDBrate").text("保证度:"+isNull((parseFloat(totalDBNUM)/26*100).toFixed(1))+"%");

      $('#TableData').empty().append(tbodyStr)
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

function do_support(SWS_NM, SWS_CD) {
  top.layer.open({
    type: 2,
    title: SWS_NM + '水源地详情', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1300px', '650px'],
    content: basePath + 'pages/szybh/ywgz/drinkProtect/map/mapDialogTab.jsp?SWS_CD=' + SWS_CD
  })
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
