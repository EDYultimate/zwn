const tpmap = new Map() //保存上传
let param = {}
const bbTpPath = null //路径

//var picturePathHeader="http://localhost:8080/hwwr";
//var picturePathHeader="http://localhost:8082/hwwrUpload/";
const picturePathHeader = 'http://10.3.250.90:8082/hwwrUpload/'

//var picturePathHeader="http://10.3.34.159:8080/hwwr";

//var picturePathHeader="http://10.3.34.196:3721/hwwr";

const getIsFile = 'y'
var filename = ''
var filename = ''
$(function () {
  ini(id)
  // 	$("#fileuid").val(fileid);
})

function ini(id) {
  const yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.id = id

  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'szybh/sjzl/getPicInfo', param, function (data) {
    console.info(data)
    $('#fileuid').val(isNull(data[0].FILEID))
    $('#NM').val(isNull(data[0].UP_PERSON))
    $('#tp').val(isNull(data[0].TP))
    $('#tm').val(isNull(data[0].TM))
    $('#detialinfo').val(isNull(data[0].DETAILINFO))

    parent.layer.close(index_)
  })
}

function save() {
  const param = {}
  const fileinput = $('#fileuid').val()
  const nm = $('#NM').val()
  const tp = $('#tp').val()
  const tm = $('#tm').val()
  const detialinfo = $('#detialinfo').val()

  if (fileinput == null || fileinput == '') {
    alert('请上传文件')
    return
  }
  if (nm == null || nm == '') {
    alert('上传人不能为空')
    return
  }

  const index = layer.load()
  param.id = id
  param.fileid = $('#fileuid').val()
  param.up_person = nm
  param.detailinfo = detialinfo
  param.tm = tm
  param.tp = tp

  console.info(param)
  $.ajax({
    url: basePath + 'szybh/sjzl/savePicBase',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      parent.layer.closeAll()
      parent.search(1)
    }
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
