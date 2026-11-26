const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#tm').val(year - 1)
  const uid = getUid() //   合同文件上传
  upload1('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)

  //中期评审意见上传
  const reviewuid = getUid()
  $('#reviewfileuid').val(reviewuid)
  //合同验收意见上传
  const acceptuid = getUid()
  $('#acceptfileuid').val(acceptuid)

  //项目成果附件上传
  const achievementuid = getUid()
  $('#achievementfileuid').val(achievementuid)

  initYwfl()

  initZjly()
})

function saveDbBase() {
  const param = {}
  /*var user = $("#user").val();
    if(user==null||user==''){
       alert("上传人不能为空");
       return;
   }*/

  /*	var nm = $("#fileuid").val();
		if(nm==null||nm==''){
			alert("请上传文件");
			return;
		}*/

  const nm = $('#nm').val()
  if (nm == null || nm == '') {
    alert('请填写项目名称')
    return
  }

  param.nm = $('#nm').val() //项目名称
  param.fileid = $('#fileuid').val()

  param.reviewfileid = $('#reviewfileuid').val()
  param.acceptfileid = $('#acceptfileuid').val()
  param.achievementfileid = $('#achievementfileuid').val()
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
  param.id = ''
  jQuery.getJSON(basePath + '/jyys/ztyj/saveProBaseInfo', param, function (data) {
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
  $('#fw').empty()
  let html = ''
  const param = {}
  param.tp = '1'
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
  param.tp = '2' //资金来源
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
    $('#fund').html(html)
    //search(1);
  })
}
