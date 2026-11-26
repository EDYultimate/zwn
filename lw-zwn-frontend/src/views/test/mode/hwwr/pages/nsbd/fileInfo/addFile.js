const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  // 构建上传按钮
  //	$("input[type='file']").each(function() {
  //		$(this).wrap("<a href='javascript:void(0);' class='a-upload' id='file-a'>导入文件</a>");
  //	});
  const date = new Date()
  const year = date.getFullYear()
  $('#tm').val(year - 1)
  getSel()
})
//function uplosdFile(){
//	var uid=getUid();
//	var filenm=$("#fileInput").val();
//	var nmArr=filenm.split("\\");
//	var fnm=nmArr[nmArr.length-1];
//	upload1("fileInput",uid,"");
//	$("#fileuid").val(uid);
//}
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

      const uid = getUid()
      upload1('file1', '' + uid + '') //文件上传
      $('#fileuid').val(uid)
    }
  })
}

function removefile() {
  $('#filenamediv').css('display', 'none')
  $('#filea').html('')
  $('#newfilediv').css('display', 'block')
}

function saveDbBase() {
  const param = {}

  const nm = $('#fileuid').val()
  if (nm == null || nm == '') {
    alert('请上传文件')
    return
  }
  param.fileid = $('#fileuid').val()
  param.nm = nm
  param.yr = $('#tm').val()
  param.cd = $('#fw').val()
  param.type = type
  jQuery.getJSON(basePath + '/kfly/nsbd/saveFileInfo', param, function (data) {
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
