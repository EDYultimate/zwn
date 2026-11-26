let param = {}
let uid = ''
$(function () {
  initYwfl()
  initZjly()

  buildForm(id)
})

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ztyj/getProBaseEditInfo.action', param, function (result) {
    const data = result.list
    $('#fw').val(isNull(data[0].TYPE_CD))
    $('#nm').val(isNull(data[0].NM))
    $('#yr').val(isNull(data[0].YR))
    $('#org').val(isNull(data[0].ORG))
    $('#fund').val(isNull(data[0].FUND))
    //$("#fund").text(isNull(data[0].FUND));
    $('#total').val(isNull(data[0].TOTAL))
    $('#btm').val(isNull(data[0].BTM))
    $('#etm').val(isNull(data[0].ETM))
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

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写项目名称')
    return
  }

  param.nm = $('#nm').val() //项目名称
  param.fileid = $('#fileuid').val()

  debugger

  param.yr = $('#yr').val() //年份
  param.btm = $('#btm').val() //签订时间
  param.etm = $('#etm').val() //完成时间
  //param.fund=$("#fund").val();//资金来源

  param.fund = $('#fund option:selected').text() //资金来源

  param.org = $('#org').val() //承担单位
  param.total = $('#total').val() //合同金额

  param.type_cd = $('#fw').val() //业务分类
  param.type = $('#fw option:selected').text() //选中的文本

  param.tm = getCurrentDate()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/ztyj/saveProBaseInfo', param, function (data) {
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

//初始化业务分类信息
function initYwfl() {
  $('#fw').empty()
  let html = ''
  const param = {}
  param.tp = '1' //代表业务分类
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
    //search(1);
  })
}

//初始化资金来源信息
function initZjly() {
  $('#fund').empty()
  let html = ''
  const param = {}
  param.tp = '2' //代表资金来源
  param.nowTime = Math.random() //考虑ie浏览器刷新
  jQuery.getJSON(basePath + '/jyys/tzwj/getYwflInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          html += "<option value='" + dataList[i].AREA + "'>" + dataList[i].AREA + '</option>'
        }
      }
    }
    $('#fund').html(html)
    //search(1);
  })
}
