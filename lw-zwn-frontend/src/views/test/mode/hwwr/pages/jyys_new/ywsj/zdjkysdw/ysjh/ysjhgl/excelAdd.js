const tpmap = new Map() //保存上传
const param = {}

$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)

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
    alert('无重点监控用水单位用水计划填报，请切换选择条件或在名录管理里添加用水单位')
    return
  }

  param.id = id
  param.jan = $('#jan').val()
  param.feb = $('#feb').val()
  param.mar = $('#mar').val()
  param.apr = $('#apr').val()
  param.may = $('#may').val()
  param.june = $('#june').val()
  param.july = $('#july').val()
  param.aug = $('#aug').val()
  param.sept = $('#sept').val()
  param.oct = $('#oct').val()
  param.nov = $('#nov').val()
  param.dec = $('#dec').val()

  param.total = $('#total').val()

  /*    param.industry=$("#industry").val();
    param.secindustry=$("#secindustry").val();
    param.org=$("#org").val();
    param.org_cd=$("#org_cd").val();*/

  jQuery.getJSON(basePath + 'jyys/ywsj/saveYsdwYsjhInfo', param, function (data) {
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
  jQuery.getJSON(basePath + '/jyys/ywsj/getYsdwInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          ysdwhtml += "<option value='" + dataList[i].ID + "'>" + dataList[i].ORG + '</option>'
        }
      } else {
        alert('无重点监控用水单位用水计划填报，请切换选择条件或在名录管理里添加用水单位')
      }
    }
    $('#org').html(ysdwhtml)
  })
}

function exportExcel() {
  const yr = $('#yr').val()
  param.yr = yr
  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()

  $.ajax({
    type: 'POST',
    url: basePath + 'jyys/ywsj/getYsdwExcelInfo',
    //contentType: 'application/json',
    async: true,
    data: param,
    success: function (data) {
      const results = data
      /* var titles = 'ID,ORG,TOTAL,JAN,FEB,MAR,APR,MAY,JUNE,JULY,AUG,SEPT,OCT,NOV,DEC'
            var titles_zh = '重点用水单位ID,单位名称,年计划用水量,1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月'*/

      const titles = 'ID,ORG,TOTAL'
      const titles_zh = '重点用水单位ID,单位名称,年计划用水量'

      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: yr + '年重点监控用水单位用水计划表'
      }
      // 下载表格
      $.fileDownload(basePath + 'commonExcel/download', {
        httpMethod: 'POST',
        data: json,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        successCallback: function (url) {
          debugger
        }
      })
    }
  })
}

//选择上传的excel
function chooseExcel() {
  debugger
  document.getElementById('file').click()
}

//上传excel
function importExcel() {
  debugger
  const s = $('#file')[0].files[0]
  const formData = new FormData()
  formData.append('excelFile', s)
  $.ajax({
    url: basePath + '/jyys/ywsj/importYsdwYsjh',
    type: 'POST',
    cache: false,
    data: formData,
    processData: false,
    contentType: false,
    success: function (result) {
      console.info(result)
      const a = eval('(' + result + ')')
      alert(a.STATUS)
      /*window.location.reload();*/
      parent.search()
      parent.layer.closeAll()
    },
    error: function (err) {
      alert('上传失败')
    }
  })
}
