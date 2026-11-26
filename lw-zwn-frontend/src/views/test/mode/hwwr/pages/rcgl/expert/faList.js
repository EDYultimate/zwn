const param = {}
const uuid = ''
$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  iniFa()
})
//新建随机方案
function selectList() {
  layer.open({
    type: 2,
    title: '新建方案',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['350px', '150px'],
    content: basePath + '/pages/rcgl/expert/checkExpert.jsp'
  })
}

function setpersonmum() {
  layer.open({
    type: 2,
    title: '随机专家数',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['350px', '150px'],
    content: basePath + '/pages/rcgl/expert/personNum.jsp'
  })
}
function iniFa(val) {
  jQuery.getJSON(basePath + 'rcgl/expert/getFaBasicList', param, function (data) {
    $('#fanm').empty()
    let html = ''
    html += "<option value=''>全部</option>"
    if (data != null) {
      const dataList = data
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          html += "<option value='" + dataList[i].ID + "'>" + dataList[i].FA_NM + '</option>'
        }
      }
    }
    $('#fanm').html(html)
    getFaPersonList(val)
  })
}
//添加随机专家到方案
function newAdd(personnum) {
  //	if($("#personnum").val()==""||$("#personnum").val()<=0){
  //		alert("人数不能小于零");
  //		return ;
  //	}

  if ($('#fanm').val() == '') {
    alert('请选择方案')
    return
  }
  const text = $('#fanm').find('option:selected').text()
  const msg = '随机选择' + personnum + '个专家到方案' + text + '\n\n请确认！'
  if (confirm(msg) == true) {
    param.exptype = $('#exptype').val()
    param.units = $('#dw').val()
    param.ad = $('#ad').val()
    param.FAID = $('#fanm').val()
    param.personnum = personnum
    jQuery.getJSON(basePath + 'rcgl/expert/findFaOutPerson', param, function (result) {
      console.info(result)
      if (result.length > 0) {
        if (result.length < param.personnum) {
          const msg2 =
            '方案外符合条件的专家个数为' +
            result.length +
            '个,不足' +
            personnum +
            '个,确认添加' +
            result.length +
            '个,\n\n请确认！'
          if (confirm(msg2) == true) {
            var index1 = layer.load()
            jQuery.getJSON(basePath + 'rcgl/expert/checkExpertInfo', param, function (result) {
              console.info(result)
              getFaPersonList()
              layer.close(index1)
            })
          }
        } else {
          var index1 = layer.load()
          jQuery.getJSON(basePath + 'rcgl/expert/checkExpertInfo', param, function (result) {
            console.info(result)
            getFaPersonList()
            layer.close(index1)
          })
        }
      } else {
        alert('方案外没有满足条件的专家')
      }
    })
  }
}

function getFaPersonList(val) {
  let text = ''
  if (val == 'del') {
    text = '全部'
    param.ID = ''
  } else {
    text = $('#fanm').find('option:selected').text()
    param.ID = $('#fanm').val()
  }

  $('#fatext').text(text)
  let tbodyStr = ''

  param.exptype = $('#exptype').val()
  param.units = $('#dw').val()
  param.ad = $('#ad').val()
  const index = layer.load()

  jQuery.getJSON(basePath + 'rcgl/expert/getFaPersonList', param, function (data) {
    console.info(data)
    for (let i = 0; i < data.length; i++) {
      const no = i + 1
      tbodyStr +=
        '<tr>' +
        "<td title='" +
        no +
        "'>" +
        no +
        '</td>' +
        "<td title='" +
        isNull(data[i].EXP_NM) +
        "'  >" +
        isNull(data[i].EXP_NM) +
        '</td>' +
        "<td title='" +
        sexFormat(data[i].EXP_SEX) +
        "'  >" +
        sexFormat(data[i].EXP_SEX) +
        '</td>' +
        "<td title='" +
        isNull(data[i].SPECIALTY) +
        "'  >" +
        isNull(data[i].SPECIALTY) +
        '</td>' +
        "<td title='" +
        isNull(data[i].UNITS) +
        "'  >" +
        isNull(data[i].UNITS) +
        '</td>' +
        "<td title='" +
        data[i].EXP_TYPE +
        "'  >" +
        data[i].EXP_TYPE +
        '</td>' +
        "<td title='" +
        data[i].AD_NM +
        "'  >" +
        data[i].AD_NM +
        '</td>' +
        "<td title='" +
        isNull(data[i].JOB) +
        "'  >" +
        isNull(data[i].JOB) +
        '</td>' +
        "<td style=' width:20%;' >"
      if (param.ID == '') {
      } else {
        tbodyStr +=
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].EXP_NM) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/index/sc_13.png'></a>"
      }
      tbodyStr += '</td>' + '</tr>'
    }
    $('#tbody').empty().append(tbodyStr)
  })
  layer.close(index)
}

function del(EXPERT_ID, nm) {
  const msg = '确定要把' + nm + '专家从列表中删除吗？\n\n请确认！'
  param.EXPERT_ID = EXPERT_ID
  param.FAID = $('#fanm').val()
  if (confirm(msg) == true) {
    jQuery.getJSON(basePath + 'rcgl/expert/delFaExpertRel', param, function (data) {
      alert(data.info)
      getFaPersonList()
    })
  }
}
function delFaBasic() {
  const val = $('#fanm').val()
  if (val == '') {
    alert('请选择要删除的方案')
    return
  }
  const text = $('#fanm').find('option:selected').text()
  const msg = "确定删除方案'" + text + "'吗？\n\n请确认！"
  param.FAID = val
  if (confirm(msg) == true) {
    jQuery.getJSON(basePath + 'rcgl/expert/delFaBasic', param, function (data) {
      alert(data.info)
      iniFa('del')
    })
  }
}

function dc() {
  const text = $('#fanm').find('option:selected').text()
  exportExcel(text + '专家列表', $('.bbTable').html(), text + '专家列表', '9')
}

/**
 *导出excel--适用于普通表格  theadhtml   dataList
 */
function exportExcel(tableTp, tablehtml, tableTitle, colCount) {
  //tablehtml就说打印出来的东西
  if (tablehtml == '') {
    //		$("#CAA00000000S").html()
    const printTb = $(
      "<table cellpadding='0' cellspacing='0' width='100%'  style='font-family: 微软雅黑;font-size: 12px;border-bottom:1px solid #DBDBDB;border-right:1px solid #DBDBDB'></table>"
    )
    const headTr = $("<tr height='25px' bgcolor='#F6FBFF'></tr>").appendTo(printTb)
    for (var i = 0; i < $('#theadtd').children().eq(0)
.children().length; i++) {
      var td = $(
        "<th style='border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB' align='center'>" +
          $('#theadtd').children().eq(0)
.children()
.eq(i)
.text() +
          '</th>'
      ).appendTo(headTr)
    }
    for (var i = 0; i < $('#tbody').find('tr').length; i++) {
      const tr = $("<tr height='25px'></tr>").appendTo(printTb)
      for (let j = 0; j < $('#tbody').find('tr').eq(i)
.find('td').length; j++) {
        if (
          (i % 4 == 0 && j == 0) ||
          (i % 4 == 0 && j == $('#dataList').find('tr').eq(i)
.find('td').length - 1)
        ) {
          var td = $(
            "<td rowspan='4' style='border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB' align='center'>" +
              $('#tbody').find('tr').eq(i)
.find('td')
.eq(j)
.text() +
              '</td>'
          ).appendTo(tr)
        } else {
          var td = $(
            "<td style='border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB' align='center'>" +
              $('#tbody').find('tr').eq(i)
.find('td')
.eq(j)
.text() +
              '</td>'
          ).appendTo(tr)
        }
      }
    }
    tablehtml = printTb.html()
  }
  const exForm = document.createElement('form')
  $(exForm).css('z-index', '-1000')
  //修改用到的jsp路径
  $(exForm)
    .attr('action', basePath + '/common/exportexcel.jsp?title=' + tableTitle)
    .attr('method', 'POST')
  const exportContentElement = $("<input name='exportContent' type='hidden'>")
  const titleElement = $("<input name='title'  type='hidden'>")
  if (tableTp == 'comlexAndFixure') {
    alert('abc')
  } else {
    const tableContent =
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'><tr><td style='text-align:center;border-right:1px solid #DBDBDB;' colspan='" +
      colCount +
      "'><b>" +
      tableTitle +
      '</b></td></tr>' +
      tablehtml
    console.info(tableContent)
    const exportContent =
      "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'><table border='1'>" +
      tableContent +
      '</table>'
    exportContentElement.val(exportContent).appendTo($(exForm))
  }

  titleElement.val(tableTitle).appendTo($(exForm))
  document.body.appendChild(exForm)
  $(exForm).appendTo($('#exportFormDiv'))
  exForm.submit()
}
