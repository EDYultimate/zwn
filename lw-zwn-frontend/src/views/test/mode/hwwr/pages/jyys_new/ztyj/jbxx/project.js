let param = {}
let uid = ''
$(function () {
  buildForm(id)

  /* initYwfl();*/
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ztyj/getProjectInfo.action', param, function (result) {
    const data = result.list

    //基本信息
    //$("#fw").val(isNull(data[0].TYPE_CD));
    $('#fw').val(isNull(data[0].TYPE))
    $('#nm').val(isNull(data[0].NM))
    $('#yr').val(isNull(data[0].YR))
    $('#org').val(isNull(data[0].ORG))
    $('#fund').val(isNull(data[0].FUND))
    $('#total').val(isNull(data[0].TOTAL))
    $('#btm').val(isNull(data[0].BTM))
    $('#etm').val(isNull(data[0].ETM))

    $('#contract').val(isNull(data[0].FILE_NM))

    //支付记录
    $('#nm').val(isNullZ(data[0].NM))
    $('#firamount').val(isNullZ(data[0].FIRAMOUNT))
    $('#firtm').val(isNullZ(data[0].FIRTM))
    $('#secamount').val(isNullZ(data[0].SECAMOUNT))
    $('#sectm').val(isNullZ(data[0].SECTM))
    $('#thiamount').val(isNullZ(data[0].THIAMOUNT))
    $('#thitm').val(isNullZ(data[0].THITM))

    //评审验收
    $('#period').val(isNull(data[0].PERIOD))
    $('#reviewtm').val(isNull(data[0].REVIEWTM))
    $('#acceptm').val(isNull(data[0].ACCEPTM))

    $('#review').val(isNull(data[0].REVIEWFILE_NM))
    $('#accept').val(isNull(data[0].ACCEPTFILE_NM))

    //项目成果
    $('#achievement').val(isNull(data[0].ACHIEVEMENTFILE_NM))

    /*  $("#bbyr").val(isNull(data[0].BB_YR));
          $("#xdyr").val(isNull(data[0].XD_YR));*/
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
  })
}

function closediv() {
  parent.layer.closeAll()
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

//初始化业务分类信息
function initYwfl() {
  $('#fw').empty()
  let html = "<option value=''>全部</option>"
  const param = {}
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + '/jyys/tzwj/getYwflInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          html += "<option value='" + dataList[i].AREA_CD + "'>" + dataList[i].AREA + '</option>'
        }
      }
    }
    $('#fw').html(html)
  })
}
