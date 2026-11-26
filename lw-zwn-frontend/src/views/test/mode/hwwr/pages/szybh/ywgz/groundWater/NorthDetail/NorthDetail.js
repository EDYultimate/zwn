let pageSize
const param = {}

$(function () {
  const curtDate = new Date()
  const curtYear = curtDate.Format('yyyy')
  // 获取前90天日期
  //	var day = 365;
  //	starttime =  moment().add(0-day+1, 'days').format('YYYY-MM');
  // 填入时间查询
  $('#beginTm').val(curtYear)
  $('#endTm').val(curtYear)
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  //    $(".bbTable").css("height",tbHeight*0.75-80+"px");
  //    pageSize = Math.floor((tbHeight)/30)-2;
  //  $(".bbTable").css("height","500px");

  pageSize = 22

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  //    var fw = $("#fw").val();

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  param.beginTm = $('#beginTm').val()
  param.endTm = $('#endTm').val()
  //    param.PUBLIC_ORG= $("#yinFaJiGou").val();
  param.RV_CD = $('#heHuMingCheng').val()
  //    param.ST_TP=$("#duanPianLeiXing").val();
  //    param.STNM=$("#duanMianMingCheng").val();

  //    param.pageSize=pageSize;
  //    param.pageNo=CurrentPage;
  const index = layer.load()

  //    var totalDBNUM=0;

  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterGroundWaterNorthDetailInfo',
    param,
    function (result) {
      console.log('getSaveWaterGroundWaterNorthDetailInfo :', result)

      const data = result.data
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          const no = i + 1
          const donePercent = (
            (parseFloat(data[i].HEJI) / parseFloat(data[i].NIANDUJIHUA)) *
            100
          ).toFixed(1)

          tbodyStr +=
            '<tr>' +
            "<td title='" +
            no +
            "'>" +
            no +
            '</td>' +
            "<td title='" +
            isNull(data[i].RV_NM) +
            "'><a href='javascript:void(0)'  onclick='divClick(\"" +
            data[i].RV_NM +
            '","' +
            data[i].RV_CD +
            '")\'>' +
            isNull(data[i].RV_NM) +
            '</a></td>' +
            "<td title='" +
            isNull(data[i].NAISHUIZHONG) +
            "'  >" +
            isNull(data[i].NAISHUIZHONG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].NAISHUIDONG) +
            "'  >" +
            isNull(data[i].NAISHUIDONG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].YINHUANG) +
            "'  >" +
            isNull(data[i].YINHUANG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].YINLUAN) +
            "'  >" +
            isNull(data[i].YINLUAN) +
            '</td>' +
            "<td title='" +
            isNull(data[i].SHANGYOU) +
            "'  >" +
            isNull(data[i].SHANGYOU) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ZAISHENG) +
            "'  >" +
            isNull(data[i].ZAISHENG) +
            '</td>' +
            "<td title='" +
            isNull(data[i].HEJI) +
            "'  >" +
            isNull(data[i].HEJI) +
            '</td>' +
            "<td title='" +
            isNull(data[i].NIANDUJIHUA) +
            "'  >" +
            isNull(data[i].NIANDUJIHUA) +
            '</td>' +
            "<td title='" +
            isNull(donePercent) +
            "'  >" +
            isNull(donePercent) +
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
            '</tr>'
        }
      }
      $('#TableData').empty().append(tbodyStr)

      $('#HEJIsum').text(isNull(result.HEJIsum))
      $('#NIANDUJIHUAsum').text(isNull(result.NIANDUJIHUAsum))
      let donePercentSum = ''
      if (result.NIANDUJIHUAsum != 0) {
        donePercentSum = (
          (parseFloat(result.HEJIsum) / parseFloat(result.NIANDUJIHUAsum)) *
          100
        ).toFixed(1)
      }
      $('#donePercentSum').text(isNull(donePercentSum))

      //        $("#tbody2").empty().append(tbodyStr);
      //        $('.M-box').pagination({
      //            pageCount: result.page.pages, //初始化时总页数3页
      //            current:CurrentPage,
      //            callback:function(api){
      //                search(api.getCurrent());
      //            }
      //        });
      //        $(".tolSpan").html("共"+result.page.total+"条");
      //        $('.M-box').show();
      layer.close(index)
    }
  )
}

function divClick(RV_NM, RV_CD) {
  console.log('divClick:   ', RV_NM, RV_CD)
  //	var stcd='00000001' ;

  top.layer.open({
    type: 2,
    title: RV_NM + '补水详情',
    closeBtn: 1,
    shade: 0.3,
    area: ['800px', '650px'],
    content: basePath + 'pages/szybh/ywgz/groundWater/map/bsxqDialog.jsp?RV_CD=' + RV_CD
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
