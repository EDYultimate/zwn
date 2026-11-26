let param = {}
let uid = ''
/*var caseuid="";*/
$(function () {
  buildForm(id)
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  /*var caseyj_fileNames=""  //用于记录原先已有的典型案例*/

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getJdjcEditInfo.action', param, function (result) {
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#tm').val(isNull(data[0].TM))
    $('#progress').val(isNull(data[0].PROGRESS))
    $('#problem').val(isNull(data[0].PROBLEM))
    $('#tpcase').val(isNull(data[0].TPCASE))
    $('#isdirector').val(isNull(data[0].ISDIRECTOR))
    $('#district').val(isNull(data[0].DISTRICT))
    $('#ad_cd').val(isNull(data[0].AD_CD))
    $('#etm').val(isNull(data[0].ETM))
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
    /*   caseuid=data[0].CASEFILE_ID;
        if(data[0].CASEFILE_ID!==""&&data[0].CASEFILEID!=null){
            var i=0;
            var casetrTable="";
            if(data[0].CASEFILE_ID!==""&&data[0].CASEFILE_ID!=null){

                for(i=0;i<data.length;i++){
                    casetrTable+="<tr id='casefileYj"+i+"' class='fileYj'><td class='textalign' colspan='2'>"+isNull(data[i].CASEFILE_NM)+"&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('casefileYj','"+id+"','"+isNull(data[i].CASEFILE_ID)+"','"+isNull(data[i].CASEFILE_NM)+"','"+i+"')>删除</a></td><tr>"
                    caseyj_fileNames=caseyj_fileNames+isNull(data[i].CASEFILE_NM)+",";
                }
                if(yj_fileNames!=null){
                    caseyj_fileNames=caseyj_fileNames.substring(0,caseyj_fileNames.length-1);
                }
                $("#casefile_tr").after(casetrTable);
            }
            upload1("file2",""+data[0].CASEFILEID+"",""+data[0].CASEFILE_NM+"");//
        }*/
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

  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('请填写年份')
    return
  }

  const tm = $('#tm').val()
  const etm = $('#etm').val()
  if (tm == null || tm == '' || etm == null || etm == '') {
    alert('请填写检查时间')
    return
  }

  param.fileid = $('#fileuid').val()
  /*param.casefileid=$("#casefileuid").val();*/

  param.yr = $('#yr').val() //年份
  param.ad_cd = $('#ad_cd').val() //行政区
  param.tm = $('#tm').val() //检查时间
  param.district = $('#district').val() //县（区）
  param.progress = $('#progress').val() //进展情况
  param.problem = $('#problem').val() //进展情况
  param.tpcase = $('#tpcase').val() //典型案例
  param.isdirector = $('#isdirector').val() //是否有主任参加

  param.etm = $('#etm').val() //检查时间

  param.dt = getCurrentDate()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/ywsj/saveJdjcInfo', param, function (data) {
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
