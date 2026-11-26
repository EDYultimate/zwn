let pageSize
let param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  /*var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;*/
  /*var tbHeight = bodyheight-200-30-50-50;*/
  /*var tbHeight = bodyheight-300;
    $(".bbTable").css("height",tbHeight+"px");*/
  /*  $(".tr").css("height",tbHeight/9+"px");*/

  const date = new Date()
  const yr = date.getFullYear()

  search()
})

//页面初始化
function search() {
  //获取汇总描述
  const pushData = {}
  pushData.area_cd = '03' //业务类型编码
  pushData.seachTime = Math.random()
  jQuery.getJSON(basePath + 'jyys/ywsj/getZtqkms', pushData, function (data) {
    $('#textarea').empty()
    $('#textarea').val(data[0].MS)
  })

  //获取汇总列表
  let tbodyStr = ''

  const date = new Date()
  const yr = date.getFullYear() //获取当年
  const lastyr = yr - 1 //获取去年
  param.yr = yr
  param.lastyr = lastyr
  param.nowTime = Math.random() //考虑ie浏览器刷新
  //var index = layer.load();
  jQuery.getJSON(basePath + 'jyys/ywsj/getJspjZtqkInfo', param, function (result) {
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
          isNull(data[i].BFTOTAL) +
          "'  style=' width:15%;'>" +
          isNull(data[i].BFTOTAL) +
          '</td>' +
          "<td title='" +
          isNull(data[i].NUM) +
          "'  style=' width:25%;'>" +
          isNull(data[i].NUM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TOTAL) +
          "'  style=' width:10%;'>" +
          isNull(data[i].TOTAL) +
          '</td>' +
          '</tr>'
      }
    }
    $('#tbody').empty().append(tbodyStr)
  })
}

//汇总情况编辑
function ztqkEdt() {
  debugger
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
    param.area_cd = '03'
    param.ms = $('#textarea').val()
    param.searchTime = Math.random()
    jQuery.getJSON(basePath + 'jyys/ywsj/updateZtqkms', param, function (data) {
      debugger
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
