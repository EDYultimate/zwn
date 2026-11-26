let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");

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

  param.RIVER_NM = $('#riverName').val()
  param.CASE_NM = $('#caseName').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  //    jQuery.getJSON(basePath+"szybh/ywgz/getSaveWaterEcologyFlowGisWarnInfo",param,function(result){
  ////       console.log("result:",result);
  //    });
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterWaterPollutionDetailInfo',
    param,
    function (result) {
      console.log('getSaveWaterWaterPollutionDetailInfo:', result)

      const data = result.page.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var TP
          switch (data[i].ST_TP) {
            case '1':
              TP = '蓝藻爆发'
              break
            case '2':
              TP = '人为泄露'
              break
            case '3':
              TP = '日常排污'
              break
            case '4':
              TP = '其它'
              break
            default:
              TP = '-'
          }
          var REPORT
          switch (data[i].ASS_TP) {
            case '1':
              REPORT = '是'
              break
            case '0':
              REPORT = '否'
              break

            default:
              REPORT = '-'
          }
          var imp
          switch (data[i].IMP) {
            case '1':
              imp = '是'
              break
            case '0':
              imp = '否'
              break

            default:
              imp = '-'
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
            isNull(data[i].CASE_NM) +
            "'>" +
            isNull(data[i].CASE_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].RIVER_NM) +
            "'  >" +
            isNull(data[i].RIVER_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ADDRESS) +
            "'  >" +
            isNull(data[i].ADDRESS) +
            '</td>' +
            "<td title='" +
            TP +
            "'>" +
            TP +
            '</td>' +
            "<td title='" +
            imp +
            "'>" +
            imp +
            '</td>' +
            "<td title='" +
            isNull(data[i].H_DATE) +
            "'  >" +
            isNull(data[i].H_DATE) +
            '</td>' +
            "<td title='" +
            isNull(data[i].HANDLE) +
            "'  >" +
            isNull(data[i].HANDLE) +
            '</td>' +
            "<td title='" +
            REPORT +
            "'>" +
            REPORT +
            '</td>' +
            "<td title='" +
            isNull(data[i].RES) +
            "'  >" +
            isNull(data[i].RES) +
            '</td>' +
            "<td style=' width:20%;' >" +
            '<a href="javascript:;" onclick=update(\'' +
            isNull(data[i].UUID) +
            "')>" +
            "<img style='cursor: pointer;' title='编辑' src='" +
            basePath +
            "/images/savewater/editbtn.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            '<a href="javascript:;" onclick="del(\'' +
            isNull(data[i].UUID) +
            "','" +
            isNull(data[i].CASE_NM) +
            '\')">' +
            "<img style='cursor: pointer;' title='删除' src='" +
            basePath +
            "/images/savewater/delbtn.png'></a></td>" +
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
            '</tr>'
        }
      }
      //    	console.log("totalDBNUM:   ",totalDBNUM);

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

//新建
function newAdd() {
  top.layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content:
      basePath +
      'pages/szybh/ywgz/suddenlyWaterPollution/suddenlyWaterPollutionDetail/addSuddenlyWaterPollutionDetail.jsp'
  })
}

//编辑信息
function update(uuid) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.2,
    area: ['700px', '500px'],
    content:
      basePath +
      '/pages/szybh/ywgz/suddenlyWaterPollution/suddenlyWaterPollutionDetail/editSuddenlyWaterPollutionDetail.jsp?uuid=' +
      uuid,
    end: function () {
      search(1)
    }
  })
}

function del(UUID, nm) {
  const msg = '您真的确定要删除' + nm + '吗？\n\n请确认！'
  const pasrse = {}

  pasrse.UUID = UUID
  if (confirm(msg) == true) {
    const index_load = layer.load()
    $.ajax({
      url: basePath + 'szybh/ywgz/delSuddenlyWaterPollutionDetail',
      data: pasrse,
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        if (!data) {
          alert(data.message)
          return
        }
        //关闭遮罩层
        layer.close(index_load)
        search(1)
      }
    })
  }
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
