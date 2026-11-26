let param = {}
let uid = ''
$(function () {
  buildForm(id)
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ztyj/getProXmcgEditInfo.action', param, function (result) {
    const data = result.list
    /*$("#fw").val(isNull(data[0].TYPE_CD));
        $("#nm").val(isNull(data[0].NM));
		$("#yr").val(isNull(data[0].YR));
        $("#org").val(isNull(data[0].ORG));
        $("#fund").val(isNull(data[0].FUND));
        $("#total").val(isNull(data[0].TOTAL));
        $("#btm").val(isNull(data[0].BTM));
        $("#etm").val(isNull(data[0].ETM));*/
    /*  $("#bbyr").val(isNull(data[0].BB_YR));
        $("#xdyr").val(isNull(data[0].XD_YR));*/
    console.info(data)
    uid = data[0].FILE_ID
    if (data[0].FILE_ID !== '' && data[0].FILEID != null) {
      let i = 0
      let trTable = ''
      if (data[0].FILE_ID !== '' && data[0].FILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          trTable +=
            "<tr id='fileYj" +
            i +
            "' class='fileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].FILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','" +
            id +
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
      upload1('file1', '' + data[0].FILEID + '', '' + data[0].FILE_NM + '') //
    }
    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id, uid)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, uid) {
  const param = {}

  /*   var nm=$("#nm").val();
    if (nm == null||nm =='') {
        alert("请填写项目名称");
        return;
    }

    param.nm=$("#nm").val(); //项目名称*/
  param.fileid = $('#fileuid').val()

  /* param.yr=$("#yr").val();//年份
    param.btm=$("#btm").val();//签订时间
    param.etm=$("#etm").val();//完成时间
    param.fund=$("#fund").val();//资金来源
    param.org=$("#org").val();//承担单位
    param.total=$("#total").val();//合同金额

    param.type_cd =$("#fw").val();//业务分类
    param.type =$('#fw option:selected').text();//选中的文本*/

  param.tm = getCurrentDate()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/ztyj/saveProXmcgInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
  })
}
/**
 * 获得当前时间
 */
function getCurrentDate() {
  const currentDate = new Date() //当前时间
  let dayTM = currentDate.getDate()
  let monthTM = currentDate.getMonth() + 1
  const yearTM = currentDate.getFullYear()
  if (parseInt(dayTM) < 10) {
    dayTM = '0' + parseInt(dayTM)
  }
  if (parseInt(monthTM) < 10) {
    monthTM = '0' + parseInt(monthTM)
  }
  return yearTM + '-' + monthTM + '-' + dayTM
}
