const tpmap = new Map() //保存上传
let param = {}
const bbTpPath = null //路径
const getIsFile = 'y'
$(function () {
  buildForm(uuid)
})

function buildForm(uuid) {
  const yj_fileNames = '' //用于记录原先已有的附件
  param = {}
  param.UUID = uuid

  const index_ = parent.layer.load() //getSaveWaterAddressBookInfoByID
  jQuery.getJSON(basePath + 'szybh/ywgz/getWaterPollutionDetailInfoByID', param, function (data) {
    console.log('data:', data)
    $('#CASE_NM').val(isNull(data[0].CASE_NM))
    $('#RIVER_NM').val(isNull(data[0].RIVER_NM))
    $('#ADDRESS').val(isNull(data[0].ADDRESS))
    $('#TP').val(isNull(data[0].TP))
    $('#H_DATE').val(isNull(data[0].H_DATE))
    $('#HANDLE').val(isNull(data[0].HANDLE))
    $('#REPORT').val(isNull(data[0].REPORT))
    $('#RES').val(isNull(data[0].RES))
    $('#IMP').val(isNull(data[0].IMP))

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      save(ID)
    })
  })
}

function save(uuid) {
  const param = {}
  //	var fileinput = $("#fileuid").val();
  const nm = $('#CASE_NM').val()

  if (nm == null || nm == '') {
    alert('案例名称不能为空')
    return
  }

  //	  var index = layer.load();
  param.uuid = uuid
  param.case_nm = $('#CASE_NM').val()
  param.river_nm = $('#RIVER_NM').val()
  param.address = $('#ADDRESS').val()
  param.tp = $('#TP').val()
  param.h_date = $('#H_DATE').val()
  param.handle = $('#HANDLE').val()
  param.report = $('#REPORT').val()
  param.res = $('#RES').val()

  $.ajax({
    url: basePath + 'szybh/ywgz/addWaterPollutionDetailInfo',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      alert('添加成功')

      //		    	alert(data.info);
      //		    	layer.close(index);
      parent.search(1)
      parent.layer.closeAll()
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
