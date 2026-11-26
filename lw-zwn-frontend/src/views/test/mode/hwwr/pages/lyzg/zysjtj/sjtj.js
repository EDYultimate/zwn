const param = {}

let trH
let swztrH
let sendtrH

$(document).ready(function () {
  //初始化日期
  $('#bdat').val(new Date().Format('yyyy-MM-dd'))
  $('#edat').val(new Date().Format('yyyy-MM-dd'))

  const bodyH = parseInt($(window).height()) - 60
  /*$("#topDiv").css("height",0.6*bodyH+"px");
    $("#bottomDiv").css("height",0.4*bodyH+"px");
    trH= (0.6*bodyH-30-30-2)/10;
    swztrH = (0.6*bodyH-30-30-2)/11;
    sendtrH = (0.4*bodyH-30-2)/5;*/

  /*$("#topDiv").css("height",0.65*bodyH+"px");
	$("#bottomDiv").css("height",0.35*bodyH+"px");
	trH= (0.65*(bodyH-60)-30-2)/10;
	swztrH = (0.65*(bodyH-60)-30-2)/11;
	sendtrH = (0.35*(bodyH-60)-30-2)/7;*/

  $('#topDiv').css('height', 0.6 * bodyH + 'px')
  $('#bottomDiv').css('height', 0.4 * bodyH + 'px')
  trH = (0.6 * (bodyH - 60) - 30 - 2) / 10
  swztrH = (0.6 * (bodyH - 60) - 30 - 2) / 11
  sendtrH = (0.4 * (bodyH - 60) - 30 - 2) / 7

  search()
})

function search() {
  getQysh()
  getSgnq()
  getSwz()
  getSend()
}

//获取接收取用水户数据统计
function getQysh() {
  getTm()
  jQuery.getJSON(basePath + '/sjtj/sjqk/getQyshRecv', param, function (dataList) {
    const data = dataList.list
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0
    let sum4 = 0

    let tableDiv =
      "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'   >" +
      '<thead>' +
      '<tr>' +
      "<th width='30'>行政区</th>" +
      "<th width='60'>应收取水户</th>" +
      "<th width='60'>实收取水户</th>" +
      "<th width='60'>实收取水点</th>" +
      "<th width='40'>数据条数</th>" +
      '</tr></thead><tbody>'

    for (let i = 0; i < data.length; i++) {
      const dataMap = data[i]
      sum1 += dataMap.WIUS
      sum2 += dataMap.MPS
      sum3 += dataMap.TOL
      sum4 += dataMap.WIUS_YS
      tableDiv +=
        '<tr>' +
        "<td width='30'>" +
        data[i].XZQ +
        '</td>' +
        "<td width='60'>" +
        data[i].WIUS_YS +
        '</td>' +
        "<td width='60'>" +
        data[i].WIUS +
        '</td>' +
        "<td width='60'>" +
        data[i].MPS +
        '</td>' +
        "<td width='40'>" +
        data[i].TOL +
        '</td>' +
        '</tr>'
    }
    tableDiv +=
      '<tr>' +
      "<td width='30'>合计</td>" +
      "<td width='60'>" +
      sum4 +
      '</td>' +
      "<td width='60'>" +
      sum1 +
      '</td>' +
      "<td width='60'>" +
      sum2 +
      '</td>' +
      "<td width='40'>" +
      sum3 +
      '</td>' +
      '</tr>'
    ;('</tbody></table>')
    $('#qysh').html(tableDiv)

    //var trH=0.8*chartH/10;
    $('#qysh')
      .find('tr')
      .css('height', trH + 'px')
  })
}

//获取接收水功能区数据统计
function getSgnq() {
  getTm()
  jQuery.getJSON(basePath + '/sjtj/sjqk/getSgnqRecv', param, function (dataList) {
    const data = dataList.list
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0

    let tableDiv =
      "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'   >" +
      '<thead>' +
      '<tr>' +
      "<th width='30'>行政区</th>" +
      "<th width='70'>应收水功能区</th>" +
      "<th width='70'>实收水功能区</th>" +
      "<th width='40'>数据条数</th>" +
      '</tr></thead><tbody>'

    for (let i = 0; i < data.length; i++) {
      const dataMap = data[i]
      sum1 += dataMap.STS
      sum2 += dataMap.TOL
      sum3 += dataMap.STS_YS
      tableDiv +=
        '<tr>' +
        "<td width='30'>" +
        data[i].XZQ +
        '</td>' +
        "<td width='70' >" +
        data[i].STS_YS +
        '</td>' +
        "<td width='70'>" +
        data[i].STS +
        '</td>' +
        "<td width='40'>" +
        data[i].TOL +
        '</td>' +
        '</tr>'
    }
    tableDiv +=
      '<tr>' +
      "<td width='30'>合计</td>" +
      "<td width='70' >" +
      sum3 +
      '</td>' +
      "<td width='70'>" +
      sum1 +
      '</td>' +
      "<td width='40'>" +
      sum2 +
      '</td>' +
      '</tr>'
    ;('</tbody></table>')
    $('#sgnq').html(tableDiv)

    //var trH=0.8*chartH/10;
    $('#sgnq')
      .find('tr')
      .css('height', trH + 'px')
  })
}

//获取接收水文站数据统计
function getSwz() {
  getTm()
  jQuery.getJSON(basePath + '/sjtj/sjqk/getSwzRecv', param, function (dataList) {
    const data = dataList.list

    let sum1 = 0
    let sum2 = 0

    let tableDiv =
      "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'   >" +
      '<thead>' +
      '<tr>' +
      "<th width='60'>行政区</th>" +
      "<th width='60'>实收水文站数</th>" +
      "<th width='40'>数据条数</th>" +
      '</tr></thead><tbody>'

    for (let i = 0; i < data.length; i++) {
      const dataMap = data[i]
      sum1 += dataMap.STS
      sum2 += dataMap.TOL
      tableDiv +=
        '<tr>' +
        "<td width='60'>" +
        data[i].XZQ +
        '</td>' +
        "<td width='60'>" +
        data[i].STS +
        '</td>' +
        "<td width='40'>" +
        data[i].TOL +
        '</td>' +
        '</tr>'
    }
    tableDiv +=
      '<tr>' + '<td>合计</td>' + '<td>' + sum1 + '</td>' + '<td>' + sum2 + '</td>' + '</tr>'
    ;('</tbody></table>')
    $('#swz').html(tableDiv)

    //var trH=0.8*chartH/10;
    $('#swz')
      .find('tr')
      .css('height', swztrH + 'px')
  })
}

//获取海委上报中央数据统计情况
function getSend() {
  getTm()
  jQuery.getJSON(basePath + '/sjtj/sjqk/getSend', param, function (dataList) {
    const data = dataList.list
    let tableDiv =
      "<table width='100%' border='0' cellpadding='0' cellspacing='0'    class='bbTable'    style='border-left:0px;border-bottom:0px;'   >" +
      '<thead>' +
      '<tr>' +
      '<th >类型</th>' +
      '<th >应报个数</th>' +
      '<th >实报个数</th>' +
      '<th >数据条数</th>' +
      '</tr></thead><tbody>'

    for (let i = 0; i < data.length; i++) {
      const dataMap = data[i]
      tableDiv +=
        '<tr>' +
        '<td ><a onclick= "getSbzxsj(\'' +
        data[i].TYPE +
        "','" +
        data[i].TPNM +
        '\')"  href="javascript:(0);">' +
        data[i].TPNM +
        '</a></td>' +
        '<td >' +
        data[i].STS_YB +
        '</td>' +
        '<td>' +
        data[i].STS +
        '</td>' +
        '<td>' +
        data[i].TOL +
        '</td>' +
        '</tr>'
    }
    tableDiv += '</tbody></table>'
    $('#send').html(tableDiv)

    //var trH=0.8*chartH/10;
    $('#send')
      .find('tr')
      .css('height', sendtrH + 'px')
  })
}

//获取时间参数
function getTm() {
  const tjtp = $('input:radio[name=radio]:checked').val()
  let bdat
  let edat
  if (tjtp == '1') {
    bdat = $('#bdat').val()
    edat = $('#edat').val()
  } else if (tjtp == '2') {
    bdat = $('#bdat1').val()
    edat = $('#edat1').val()
  } else if (tjtp == '3') {
    bdat = $('#bdat2').val()
    edat = $('#edat2').val()
  }
  param.bdat = bdat
  param.edat = edat
  param.tjtp = tjtp
  return param
}

//切换时间
$('input:radio[name=radio]').change(function () {
  if ($('input:radio[name=radio]:checked').val() == '1') {
    //日
    $('#dy').css('display', '')
    $('#mn').css('display', 'none')
    $('#yr').css('display', 'none')
    $('#bdat').val(new Date().Format('yyyy-MM-dd'))
    $('#edat').val(new Date().Format('yyyy-MM-dd'))
  } else if ($('input:radio[name=radio]:checked').val() == '2') {
    //月
    $('#mn').css('display', '')
    $('#dy').css('display', 'none')
    $('#yr').css('display', 'none')
    $('#bdat1').val(new Date().Format('yyyy-MM'))
    $('#edat1').val(new Date().Format('yyyy-MM'))
  } else if ($('input:radio[name=radio]:checked').val() == '3') {
    //年
    $('#yr').css('display', '')
    $('#mn').css('display', 'none')
    $('#dy').css('display', 'none')
    $('#bdat2').val(new Date().Format('yyyy'))
    $('#edat2').val(new Date().Format('yyyy'))
  }
})

//取用水户列表
function openList() {
  layer.open({
    type: 2,
    title: ['取水户监测信息', true],
    area: ['1200px', '600px'], //宽高
    content: basePath + 'pages/kfly/ysl/qysjc/qsh/qsh.jsp'
  })
}

//获取海委上报最新数据
function getSbzxsj(type, tpnm) {
  debugger
  if (type == 'swz') {
    layer.open({
      type: 2,
      title: tpnm,
      area: ['800px', '500px'], //宽高
      content: basePath + 'pages/lyzg/zysjtj/sbzxsj/swzzxsj.jsp?type=' + type
    })
  } else {
    layer.open({
      type: 2,
      title: tpnm,
      area: ['800px', '500px'], //宽高
      content: basePath + 'pages/lyzg/zysjtj/sbzxsj/sbzxsj.jsp?type=' + type
    })
  }
}
