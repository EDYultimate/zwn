let param = {}
let uid = ''
$(function () {
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

      buildForm(cd)
    }
  })
}
function buildForm(cd) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.cd = cd
  param.type = type
  param.yr = yr
  param.tableNm = 'WR_WATER_FILE'
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/kfly/nsbd/findTableAndFileInfo.action', param, function (result) {
    const data = result.list
    $('#fw').val(isNull(data[0].CD))
    $('#tm').val(isNull(data[0].YR))

    uid = data[0].FILE_ID
    if (data[0].FILE_ID != '' && data[0].URL != null) {
      let i = 0
      let trTable = ''
      if (data[0].FILE_ID != '' && data[0].FILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          trTable +=
            "<tr id='fileYj" +
            i +
            "' class='fileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].FILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','" +
            cd +
            "','" +
            isNull(data[i].FILE_ID) +
            "','" +
            isNull(data[i].FILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          yj_fileNames = yj_fileNames + isNull(data[i].FILE_NM) + ','
        }
        if (yj_fileNames != null) {
          yj_fileNames = yj_fileNames.substring(0, yj_fileNames.length - 1)
        }
        $('#file_tr').after(trTable)
      }
      upload1('file1', '' + data[0].URL + '', '' + data[0].FILE_NM + '') //
    }
    parent.layer.close(index_)
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase() {
  param = {}
  param.id = cd
  param.yr = $('#tm').val()
  param.cd = $('#fw').val()
  param.type = type
  param.fileid = uid
  jQuery.getJSON(basePath + '/kfly/nsbd/saveFileInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
  })
}

//function check_Content(){
//	var phone=$("#dh").val();
//	var telephone=$("#sj").val();
//    var flag=false;
//	var html_flag=/<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
//	//办公室电话
//	if(phone!=""){
//		 if(!IsTelephone(phone)){alert("办公电话不符合规则，请输入正确的办公电话号码!例如：010-12345678");return false;}
//		 else {flag=true;}
//	}else{flag=true;}
//	//手机
//	if(telephone!=""){
//		 if(!IsMobilePhone(telephone)){alert("手机号码不符合规则，请输入正确的手机号码!");return false;}
//		 else {flag=true;}
//	}else{flag=true;}
//	return flag;
//}
