const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
const getIsFile = 'y'

$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#tm').val(year - 1)
  const uid = getUid()
  upload1('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)
})

function removefile() {
  $('#filenamediv').css('display', 'none')
  $('#filea').html('')
  $('#newfilediv').css('display', 'block')
}

function saveDbBase() {
  if ('n' == getIsFile) {
    const msg = '附件不合规，是否继续保存？\n\n请确认！'
    if (confirm(msg) == true) {
      save()
    }
  } else {
    save()
  }
}

function save() {
  const param = {}

  const nm = $('#fileuid').val()
  if (nm == null || nm == '') {
    alert('请上传文件')
    return
  }
  param.fileid = $('#fileuid').val()
  param.nm = $('#fw option:selected').text() //选中的文本
  param.yr = $('#tm').val()
  param.cd = $('#fw').val()
  jQuery.getJSON(basePath + '/kfly/nsbd/saveJyysFileInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
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
