const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  /*$("#tm").val(year-1);*/
  const uid = getUid()
  upload1('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)

  initYwfl()
})

function saveDbBase() {
  const param = {}
  const tm = $('#tm').val()
  if (tm == null || tm == '') {
    alert('时间不能为空')
    return
  }

  const nm = $('#fileuid').val()
  if (nm == null || nm == '') {
    alert('请上传文件')
    return
  }

  /* var filenm=$("#filenm").val();
    if (filenm == null||filenm =='') {
        alert("请填写文件名称");
        return;
    }*/
  const title = $('#title').val()
  if (title == null || title == '') {
    alert('请填写工作总结计划')
    return
  }

  param.title = $('#title').val()
  param.fileid = $('#fileuid').val()
  /*	param.docnum=$("#docnum").val();


    param.area_cd =$("#area").val();//业务分类
    param.area =$('#area option:selected').text();//选中的文本*/

  param.tm = $('#tm').val()
  param.id = ''
  debugger
  jQuery.getJSON(basePath + '/jyys/tzwj/saveTzwjFileInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
    parent.layer.closeAll()
  })
}

function closediv() {
  parent.parent.parent.layer.closeAll()
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
  $('#area').empty()
  let html = ''
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
    $('#area').html(html)
  })
}
