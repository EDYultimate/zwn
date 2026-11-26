const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#year').val(year - 1)
  getSel()
})

function getSel() {
  $.ajax({
    url: basePath + '/kfly/nsbd/getRouteList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      let html = ''
      for (let i = 0; i < data.length; i++) {
        html += '<option value="' + data[i].CD + '">' + data[i].NM + '</option>'
      }
      $('#fw').html(html)
    }
  })
}

function saveDbBase() {
  const param = {}

  const stcd = $('#stcd').val()
  const nm = $('#stnm').val()
  const year = $('#year').val()
  if (stcd == null || stcd == '' || nm == null || nm == '' || year == null || year == '') {
    alert('必填项不能为空')
    return
  }
  param.nm = nm
  param.stcd = $('#stcd').val()
  param.addvnm = $('#addvnm').val()
  param.year = $('#year').val()
  param.cd = $('#fw').val()
  param.state = $('#state').val()
  param.bgtm = $('#bgtm').val()
  jQuery.getJSON(basePath + '/kfly/nsbd/saveStcd', param, function (data) {
    alert(data.info)
    parent.ini()
    parent.layer.closeAll()
  })
}

function closediv() {
  parent.parent.parent.layer.closeAll()
}

function uploadBbTp() {
  const form = $('form[name=uploadForm]')
  console.info(form)
  const options = {
    url: basePath + '/kfly/nsbd/uploadBbFile',
    dataType: 'json',
    type: 'post',
    success: function (data) {
      uploadNm = data.nm
      $('#filePathInput').empty().val(uploadNm)
      alert('上传成功')
      console.info(uploadNm)
    }
  }
  form.ajaxSubmit(options)
}

function getUid() {
  const str = Math.random().toString()
  let strs = [] //定义一数组
  strs = str.split('.') //字符分割
  let uid = strs[1] + ''
  const myDate = new Date()
  const hms = myDate.getMilliseconds() + '' //获取当前毫秒数(0-999)
  uid = uid + hms
  return uid
}
