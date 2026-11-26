let pageSize
let param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /*var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;*/
  /*    var tbHeight = bodyheight-300;
    $(".bbTable").css("height",tbHeight+"px");*/

  const date = new Date()
  const year = date.getFullYear()
  const lastyr = year - 1
  const bfyr = year - 2

  $('#yr').text(year) //今年
  $('#lastyr').text(lastyr) //去年
  $('#bfyr').text(bfyr) //前年

  search()
})

//页面初始化
function search() {
  //获取汇总描述
  const pushData = {}
  pushData.area_cd = '01' //业务类型编码
  pushData.seachTime = Math.random()
  jQuery.getJSON(basePath + 'jyys/ywsj/getZtqkms', pushData, function (data) {
    $('#textarea').empty()
    $('#textarea').val(data[0].MS)
  })

  //获取汇总列表
  let tbodyStr = ''
  param.yr = $('#yr').text()
  param.lastyr = $('#lastyr').text()
  param.bfyr = $('#bfyr').text()
  param.nowTime = Math.random() //考虑ie浏览器刷新
  //var index = layer.load();
  jQuery.getJSON(basePath + 'jyys/ywsj/getXydbZtqkInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      console.info(data)
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNullZ(data[i].AD_NM) +
          "'  style=' width:35%;'>" +
          isNullZ(data[i].AD_NM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].NUM) +
          "'  style=' width:25%;'>" +
          isNullZ(data[i].NUM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].BFTOTAL) +
          "'  style=' width:15%;'>" +
          isNullZ(data[i].BFTOTAL) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].LASTYR) +
          "'  style=' width:10%;'>" +
          isNullZ(data[i].LASTYR) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].CURYR) +
          "'  style=' width:10%;'>" +
          isNullZ(data[i].CURYR) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].TOTAL) +
          "'>" +
          isNullZ(data[i].TOTAL) +
          '</td>' +
          /*  "<td title='"+isNullZ(data[i].RATE)+"'>"+isNullZ(data[i].RATE)+"</td>" +*/
          "<td title='" +
          toPercent(data[i].RATE) +
          "'>" +
          toPercent(data[i].RATE) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].HWCCNUM) +
          "'>" +
          isNullZ(data[i].HWCCNUM) +
          '</td>' +
          "<td title='" +
          isNullZ(data[i].HWCCTOTAL) +
          "'>" +
          isNullZ(data[i].HWCCTOTAL) +
          '</td>' +
          /* "<td title='"+isNullZ(data[i].HWCCRATE)+"'  style=' border-right:1px solid #e1e1e1;'>"+isNullZ(data[i].HWCCRATE)+"</td>" +*/
          "<td title='" +
          toPercent(data[i].HWCCRATE) +
          "'  style=' border-right:1px solid #e1e1e1;'>" +
          toPercent(data[i].HWCCRATE) +
          '</td>' +
          '</tr>'
      }
    }
    $('#tbody').empty().append(tbodyStr)
  })
}

//汇总情况编辑
function ztqkEdt() {
  const ztqkValue = $('#ztqkEdit').attr('title')
  if (ztqkValue == '编辑') {
    $('#ztqkEdit').attr('title', '保存')
    $('#ztqkEdit').attr('src', '/hwwr/images/index/ztqkbc-01.png')
    $('#textarea').attr('readonly', false)
    $('#textarea').css('background-color', '#E0EEE0')
    $('#textarea').css('border', '')
  }
  if (ztqkValue == '保存') {
    param = {}
    param.area_cd = '01'
    param.ms = $('#textarea').val()
    param.searchTime = Math.random()
    jQuery.getJSON(basePath + 'jyys/ywsj/updateZtqkms', param, function (data) {
      if (data == true) {
        $('#ztqkEdit').attr('title', '编辑')
        $('#textarea').attr('readonly', true)
        $('#textarea').css('background-color', '#EEF3F6')
        $('#textarea').css('border', 'none')
        $('#ztqkEdit').attr('src', '/hwwr/images/index/ztqkbj-01.png')
        alert('保存成功')
      } else {
        alert('保存失败')
      }
    })
  }
}
