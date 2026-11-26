let param = {}
let uid = ''
let acceptuid = ''

$(function () {
  buildForm(id)
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件
  let acceptyj_fileNames = '' //用于记录原先已有的合同验收意见附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ztyj/getProPsysEditInfo.action', param, function (result) {
    const data = result.list
    $('#period').val(isNull(data[0].PERIOD))
    $('#reviewtm').val(isNull(data[0].REVIEWTM))
    $('#acceptm').val(isNull(data[0].ACCEPTM))
    /*  uid=data[0].FILE_ID;
        if(data[0].FILE_ID!==""&&data[0].FILEID!=null){
            var i=0;
            var trTable="";
            if(data[0].FILE_ID!==""&&data[0].FILE_ID!=null){

                for(i=0;i<data.length;i++){
                    trTable+="<tr id='fileYj"+i+"' class='fileYj'><td class='textalign' colspan='2'>"+isNull(data[i].FILE_NM)+"&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','"+id+"','"+isNull(data[i].FILE_ID)+"','"+isNull(data[i].FILE_NM)+"','"+i+"')>删除</a></td><tr>"
                    yj_fileNames=yj_fileNames+isNull(data[i].FILE_NM)+",";
                }
                if(yj_fileNames!=null){
                    yj_fileNames=yj_fileNames.substring(0,yj_fileNames.length-1);
                }
                $("#file_tr").after(trTable);
            }
            upload1("file1",""+data[0].FILEID+"",""+data[0].FILE_NM+"");//
        }*/

    uid = data[0].FILE_ID
    if (data[0].FILE_ID !== '' && data[0].REVIEWFILEID != null) {
      var i = 0
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
      upload1('file1', '' + data[0].REVIEWFILEID + '', '' + data[0].FILE_NM + '') //
    }

    acceptuid = data[0].ACCEPTFILE_ID
    if (data[0].ACCEPTFILE_ID !== '' && data[0].ACCEPTFILEID != null) {
      var i = 0
      let acceptrTable = ''
      if (data[0].ACCEPTFILE_ID !== '' && data[0].ACCEPTFILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          acceptrTable +=
            "<tr id='acceptfileYj" +
            i +
            "' class='fileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].ACCEPTFILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('acceptfileYj','" +
            id +
            "','" +
            isNull(data[i].ACCEPTFILE_ID) +
            "','" +
            isNull(data[i].ACCEPTFILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          acceptyj_fileNames = acceptyj_fileNames + isNull(data[i].ACCEPTFILE_NM) + ','
        }
        if (yj_fileNames != null) {
          acceptyj_fileNames = acceptyj_fileNames.substring(0, acceptyj_fileNames.length - 1)
        }
        $('#acceptfile_tr').after(acceptrTable)
      }
      upload1('file2', '' + data[0].ACCEPTFILEID + '', '' + data[0].ACCEPTFILE_NM + '') //
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

  const period = $('#period').val()
  if (period == null || period == '') {
    alert('请填写已完成阶段')
    return
  }

  /* param.nm=$("#nm").val(); //项目名称*/
  param.fileid = $('#fileuid').val()

  param.period = $('#period').val() //已完成阶段
  param.reviewtm = $('#reviewtm').val() //中期评审时间
  param.acceptm = $('#acceptm').val() //合同验收成时间

  param.tm = getCurrentDate()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/ztyj/saveProPsysInfo', param, function (data) {
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
