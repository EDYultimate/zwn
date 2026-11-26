let pageSize
let param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /*var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;*/
  /*var tbHeight = bodyheight-180;
    $(".bbTable").css("height",tbHeight+"px");*/

  search()
})

//页面初始化
function search() {
  //获取汇总描述
  const pushData = {}
  pushData.area_cd = '02' //业务类型编码
  pushData.seachTime = Math.random()
  jQuery.getJSON(basePath + 'jyys/ywsj/getZtqkms', pushData, function (data) {
    $('#textarea').empty()
    $('#textarea').val(data[0].MS)
  })

  //获取汇总列表
  let tbodyStr = ''

  const date = new Date()
  const yr = date.getFullYear()
  param.yr = yr
  param.nowTime = Math.random() //考虑ie浏览器刷新
  //var index = layer.load();
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwZtqkInfo', param, function (result) {
    const data = result
    if (data != null && data.length > 0) {
      console.info(data)
      for (let i = 0; i < data.length; i++) {
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          isNull(data[i].NAME) +
          "'  style=' width:35%;'>" +
          isNull(data[i].NAME) +
          '</td>' +
          "<td title='" +
          isNull(data[i].BJNUM) +
          "'  style=' width:25%;'>" +
          isNull(data[i].BJNUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TJNUM) +
          "'  style=' width:15%;'>" +
          isNull(data[i].TJNUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].HBNUM) +
          "'  style=' width:10%;'>" +
          isNull(data[i].HBNUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].SXNUM) +
          "'  style=' width:10%;'>" +
          isNull(data[i].SXNUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NUM) +
          "'>" +
          isNull(data[i].NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TOTAL) +
          "'>" +
          isNull(data[i].TOTAL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].RATE) +
          "'>" +
          isNull(data[i].RATE) +
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
    param.area_cd = '02'
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
