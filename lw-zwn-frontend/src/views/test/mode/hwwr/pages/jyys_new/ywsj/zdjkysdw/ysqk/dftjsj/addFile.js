const tpmap = new Map() //保存上传
const param = {}

$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)
  debugger

  initYsdw() //初始化重点监控用水单位

  $('#yr').change(function () {
    //改变重点监控用水单位
    initYsdw()
  })

  $('#ad_cd').change(function () {
    //改变重点监控用水单位
    initYsdw()
  })

  $('#levels').change(function () {
    //改变重点监控用水单位
    initYsdw()
  })

  $('#industry').change(function () {
    //改变重点监控用水单位
    initYsdw()
  })
})

function saveDbBase() {
  const param = {}

  /*    var org = $("#org").val();
    if(org==null||org==''){
        alert("单位名称不能为空");
        return;
    }*/

  const id = $('#org').val()

  if (id == null || id == '') {
    alert('无重点监控用水单位地方统计数据填报，请切换选择条件')
    return
  }

  param.id = id

  param.w = $('#w').val()

  /*    param.industry=$("#industry").val();
    param.secindustry=$("#secindustry").val();
    param.org=$("#org").val();
    param.org_cd=$("#org_cd").val();*/

  jQuery.getJSON(basePath + 'jyys/ywsj/saveYsdwDftjInfo', param, function (data) {
    alert(data.info)
    parent.search()
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

function initYsdw() {
  $('#org').empty()
  debugger
  let ysdwhtml
  const param = {}
  param.yr = $('#yr').val()
  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getDftjYsdwInfo', param, function (data) {
    debugger
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          ysdwhtml += "<option value='" + dataList[i].ID + "'>" + dataList[i].ORG + '</option>'
        }
      }
    }
    $('#org').html(ysdwhtml)
  })
}
