$(function () {
  Date.prototype.Format = function (fmt) {
    //author: meizz
    const o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
      'H+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }

  // 构建上传按钮
  $("input[type='file']").each(function () {
    if ($(this).attr('id') == 'iAll') {
      $(this).wrap(
        "<a href='javascript:void(0);' style='color:white' class='a-upload' id='file-a'>导入文件</a>"
      )
    } else {
      $(this).wrap("<a href='javascript:void(0);' class='a-upload' id='file-a'>导入文件</a>")
    }
  })
})

function viewYl(fileId, fileName, actionUrl) {
  //	alert(basePath +actionUrl+"?fileId="+fileId+"&fileName="+ fileName);
  window.open(basePath + actionUrl + '?fileId=' + fileId + '&fileName=' + fileName)
}

function viewYlPdf(fileId, fileName, actionUrl, filePath) {
  //	alert(basePath +actionUrl+"?file_id="+fileId+"&file_titl="+ fileName+"&file_path="+ filePath);
  window.open(
    basePath +
      actionUrl +
      '?file_id=' +
      fileId +
      '&file_titl=' +
      fileName +
      '&file_path=' +
      filePath
  )
}

//32位UUID
function UUID() {
  return genUUID(32, Math.floor(Math.random() * 32) + 10)
}

function genUUID(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

function downloadFile(fileId, fileName) {
  const form = $('<form>')
  form.attr('style', 'display:none')
  form.attr('method', 'post')
  form.attr('action', basePath + '/kfly/nsbd/downloadfile.action')
  $('body').append(form)
  const input1 = $('<input>')
  input1.attr('type', 'hidden') //设置为隐藏域
  input1.attr('name', 'fileId') //设置参数名称
  input1.attr('value', encodeURIComponent(fileId)) //设置参数值
  form.append(input1) //添加到表单中
  const input2 = $('<input>')
  input2.attr('type', 'hidden') //设置为隐藏域
  input2.attr('name', 'fileName') //设置参数名称
  input2.attr('value', encodeURIComponent(fileName)) //设置参数值
  form.append(input2) //添加到表单中
  form.submit() //表单提交
}
/*获取url参数*/
function getUrlParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') //构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg) //匹配目标参数
  if (r != null) {
    return unescape(r[2])
  }
  return null //返回参数值
}
/*处理表格空或者未定义字段*/
function isNull(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return '-'
  }
  return vad
}

function isNullZ(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return ''
  }
  return vad
}

/*处理表格空或者未定义字段*/
function isNullL(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return 0
  }
  return vad
}
/*返回规定字段长度*/
function subS(str, num) {
  const getL = str.length
  if (num >= getL) {
    return str
  }
  return str.substring(0, num) + '..'
}
/*验证是否为空或未定义*/
function validateNull(vad) {
  if (vad == undefined || vad == null || vad == '' || vad == 'undefined' || vad == 'null') {
    return true
  }
  return false
}
//水资源公报是否加粗
function ifWide(vad) {
  if (
    vad == 'C010000040000' ||
    vad == 'C020000040000' ||
    vad == 'C030000040000' ||
    vad == 'C040000040000' ||
    vad == 'C000000040000'
  ) {
    return true
  }
  return false
}

//获取前一天年月日
function GetDay() {
  const today = new Date()
  const yesterday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24
  const yesterday = new Date()
  yesterday.setTime(yesterday_milliseconds)
  const strYear = yesterday.getFullYear()
  let strDay = yesterday.getDate()
  let strMonth = yesterday.getMonth() + 1

  if (strMonth < 10) {
    strMonth = '0' + strMonth
  }
  if (strDay < 10) {
    strDay = '0' + strDay
  }
  const strYesterday = strYear + '-' + strMonth + '-' + strDay
  return strYesterday
}

//获取当前年月日
function getCurrentYMD() {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if (month.toString().length == 1) {
    month = '0' + month
  }
  if (day.toString().length == 1) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

//获取当前年月
function getCurrentYM() {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month.toString().length == 1) {
    month = '0' + month
  }
  return year + '-' + month
}

//json日期格式化 年-月-日
function dateTimeFormate(tm) {
  if (tm == undefined || tm == null || tm == '' || tm == 'undefined' || tm == 'null') {
    return ''
  }
  const d = new Date(tm)
  const year = d.getYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ms = d.getMilliseconds()
  let curDateTime = d.getFullYear()
  if (month > 9) {
    curDateTime = curDateTime + '-' + month
  } else {
    curDateTime = curDateTime + '-0' + month
  }
  if (date > 9) {
    curDateTime = curDateTime + '-' + date
  } else {
    curDateTime = curDateTime + '-0' + date
  }

  return curDateTime
}

//json日期精确到小时
function dateTimeHFormate1(tm) {
  if (tm == undefined || tm == null || tm == '' || tm == 'undefined' || tm == 'null') {
    return ''
  }
  const d = new Date(tm)
  const year = d.getYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ms = d.getMilliseconds()
  let curDateTime = d.getFullYear()
  if (month > 9) {
    curDateTime = curDateTime + '-' + month
  } else {
    curDateTime = curDateTime + '-0' + month
  }
  if (date > 9) {
    curDateTime = curDateTime + '-' + date
  } else {
    curDateTime = curDateTime + '-0' + date
  }
  if (hours > 9) {
    curDateTime = curDateTime + ' ' + hours
  } else {
    curDateTime = curDateTime + ' 0' + hours
  }
  //	if(minutes>9)
  //	curDateTime = curDateTime +":"+minutes;
  //	else
  //	curDateTime = curDateTime +":0"+minutes;

  return curDateTime
}

//json日期精确到秒
function dateTimeSSFormate2(tm) {
  if (tm == undefined || tm == null || tm == '' || tm == 'undefined' || tm == 'null') {
    return ''
  }
  const d = new Date(tm)
  const year = d.getYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ms = d.getMilliseconds()
  let curDateTime = d.getFullYear()
  if (month > 9) {
    curDateTime = curDateTime + '-' + month
  } else {
    curDateTime = curDateTime + '-0' + month
  }
  if (date > 9) {
    curDateTime = curDateTime + '-' + date
  } else {
    curDateTime = curDateTime + '-0' + date
  }
  if (hours > 9) {
    curDateTime = curDateTime + ' ' + hours
  } else {
    curDateTime = curDateTime + ' 0' + hours
  }
  if (minutes > 9) {
    curDateTime = curDateTime + ':' + minutes
  } else {
    curDateTime = curDateTime + ':0' + minutes
  }
  if (seconds > 9) {
    curDateTime = curDateTime + ':' + seconds
  } else {
    curDateTime = curDateTime + ':0' + seconds
  }

  return curDateTime
}

//计算每个月天数yyyy-mm
function mothDayNum(YM) {
  const year = YM.substring(0, 4)
  const moth = YM.substring(5, 7)
  if (moth == '04' || moth == '06' || moth == '09' || moth == '11') {
    return 30
  }
  if (moth == '02') {
    if (isLeapYear(year)) {
      return 29
    }
    return 28
  }
  return 31
}

//获取去年当前月
function getLastYM() {
  const date = new Date()
  const year = date.getFullYear() - 1
  let month = date.getMonth() + 1
  const day = date.getDate()
  if (month.toString().length == 1) {
    month = '0' + month
  }
  return year + '-' + month
}

//获取上个月（年-月）
function getLastMYM() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  if (month.toString().length == 1) {
    if (month == '0') {
      return year - 1 + '-12'
    }
    return year + '-0' + month
  }
  return year + '-' + month
}
//对挥发酚(mg/L)负值数据进行处理
function toFormatVlph(str) {
  if (str == undefined || str == null || str == '' || str == 'undefined' || str == 'null') {
    return '-'
  }
  //	    	var s = str.indexOf("-");

  if (str < 0) {
    const num = Math.abs(str) * 2
    const text = '<' + num
    return text
  }
  return str
}
/**
 * 获取当前时间前一周的日期
 * @returns {String}
 */
function getLastWeekDate() {
  const now = new Date()
  const date = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (parseInt(month) < 10) {
    month = '0' + month
  }
  let day = date.getDate()
  if (parseInt(day) < 10) {
    day = '0' + day
  }

  return year + '-' + month + '-' + day
}
//水质类别
function formatSz(index) {
  let texts = ''
  if (
    index == undefined ||
    index == null ||
    index == '' ||
    index == 'undefined' ||
    index == 'null'
  ) {
    return ''
  }
  if (index == '1') {
    texts = 'Ⅰ类'
  }
  if (index == '2') {
    texts = 'Ⅱ类'
  }
  if (index == '3') {
    texts = 'Ⅲ类'
  }
  if (index == '4') {
    texts = 'Ⅳ类'
  }
  if (index == '5') {
    texts = 'Ⅴ类'
  }
  if (index == '6') {
    texts = '劣Ⅴ类'
  }
  return texts
}

let index
function upload1(fileid, uid, fileNames) {
  console.log(22222)
  $('#' + fileid)
    .fileupload({
      url: basePath + '/kfly/nsbd/uploadFile.action?id=' + uid,
      Type: 'POST',
      dataType: 'json', //服务器返回的数据类型
      autoUpload: true,
      //acceptFileTypes : /(gif|jpe?g|png)$/i,//验证图片格式
      sequentialUploads: true,
      multipleFilesUpload: true,
      maxNumberOfFiles: 5, //最大上传文件数目
      maxFileSize: 50000000, // 文件上限1MB
      minFileSize: 100, //文件下限  100b
      messages: {
        //文件错误信息
        acceptFileTypes: '文件类型不匹配',
        maxFileSize: '文件过大',
        minFileSize: '文件过小'
      }
    })

    //当一个单独的文件处理队列结束触发(验证文件格式和大小)
    .on('fileuploadprocessalways', function (e, data) {
      /*!//获取文件
		file = data.files[0];
		//获取错误信息
		if (file.error) {
			console.log(file.error);
			$("#uploadFile").hide();
		}*/
    })
    //显示上传进度条
    .on('fileuploadprogressall', function (e, data) {
      //		$('#progress').show();
      //		 var progress = parseInt(data.loaded / data.total * 100, 10);
      //		  $('#progress').css(
      //		   'width','15%'
      //		  );
      //		  $('#progress .bar').css(
      //		   'width',progress + '%'
      //		  );
    })
    //上传请求失败时触发的回调函数
    .on('fileuploadfail', function (e, data) {
      //getIsFile='n';
      //alert("文件后缀不合要求");
      console.log(data.errorThrown)
      //return getIsFile;
    })
    //上传请求成功时触发的回调函数
    .on('fileuploaddone', function (e, data) {
      const file = data.result.files
      const uid = file.FILE_ID
      const name = file.FILE_NM
      $('#' + fileid)
        .parent()
        .after(
          '<p>' +
            data.files[0].name +
            "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delSingleFile('" +
            uid +
            "','" +
            name +
            '\',this)" >删除</a></p>'
        )
    })
    //上传请求结束后，不管成功，错误或者中止都会被触发
    .on('fileuploadalways', function (e, data) {})
  $('#uploadImg').click()
  console.log(111)

  //return getIsFile;
}

/*function  upload1(fileid,uid,fileNames){

	$("#"+fileid).fileupload({
		url : basePath + '/kfly/nsbd/uploadFile.action?id='+uid,
		Type : 'POST',
		dataType : 'json',//服务器返回的数据类型
		autoUpload : true,
		//acceptFileTypes : /(gif|jpe?g|png)$/i,//验证图片格式
		sequentialUploads: true,
		multipleFilesUpload: true,
		maxNumberOfFiles : 5,//最大上传文件数目
		maxFileSize : 50000000, // 文件上限1MB
		minFileSize : 100,//文件下限  100b
		messages : {//文件错误信息
			acceptFileTypes : '文件类型不匹配',
			maxFileSize : '文件过大',
			minFileSize : '文件过小'
		}
	})
	//当一个单独的文件处理队列结束触发(验证文件格式和大小)
		.on("fileuploadprocessalways", function(e, data) {
			/!*!//获取文件
            file = data.files[0];
            //获取错误信息
            if (file.error) {
                console.log(file.error);
                $("#uploadFile").hide();
            }*!/
		})
		//显示上传进度条
		.on("fileuploadprogressall", function(e, data) {
			/!*$('#progress').show();
             var progress = parseInt(data.loaded / data.total * 100, 10);
              $('#progress').css(
               'width','15%'
              );
              $('#progress .bar').css(
               'width',progress + '%'
              ); *!/
		})
		//上传请求失败时触发的回调函数
		.on("fileuploadfail", function(e, data) {
			getIsFile='n';
			alert("文件后缀不合要求");
			//return getIsFile;
			//console.log(data.errorThrown);
			return getIsFile;
		})
		//上传请求成功时触发的回调函数
		.on("fileuploaddone", function(e, data) {

			var file = data.result.files;
			var uid = file.FILE_ID;
			var name = file.FILE_NM;
			$("#"+fileid).parent().after("<p>"+ data.files[0].name +"&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delSingleFile('"+uid+"','"+name+"',this)\" >删除</a></p>");
		})
		//上传请求结束后，不管成功，错误或者中止都会被触发
		.on("fileuploadalways", function(e, data) {

		})
	$("#uploadImg").click();
	return getIsFile;
}*/

/**
 * 通过ID和名称删除文件
 * @param uid
 * @param name
 * @param e
 * @returns
 */
function delSingleFile(uid, name, e) {
  $(e).parent('p').remove()
  param = {}
  param.fileId = uid
  param.fileName = name
  jQuery.getJSON(basePath + 'kfly/nsbd/deleteFile.action', param, function (data) {})
}

//多文件下删除
function deleteManyFile(className, cd, fileId, fileName, i, mk) {
  param.fileId = fileId
  param.fileName = fileName
  let allDelete = false
  if ($('.' + className + '').length == 1) {
    allDelete = true
  }
  if (allDelete) {
    param.filePath = fileId
    jQuery.getJSON(basePath + '/kfly/nsbd/deleteALLFile.action', param, function (data) {
      const message = data.flag
      if (message.indexOf('true') != -1) {
        $('#' + className + i + '').remove()
      }
    })
  } else {
    param.filePath = fileId + '\\' + fileName
    jQuery.getJSON(basePath + '/kfly/nsbd/deleteFile.action', param, function (data) {
      const message = data.flag
      if (message.indexOf('true') != -1) {
        $('#' + className + i + '').remove()
      }
    })
  }
}

//预览pdf(判断附件中是否只含有一个pdf的文件，若是预览，否则弹出下载框
function preview(fileid, filenm, suffix) {
  if (suffix.indexOf('f') > 0 && countString(suffix, 'f') == 1) {
    //只有一个PDF 直接预览
    if (filenm.indexOf(',')) {
      const filenmArr = filenm.split(',')
      for (let i = 0; i < filenmArr.length; i++) {
        if (filenmArr[i].indexOf('.pdf') > 0) {
          //viewYl( fileid,filenm+".pdf",'/kfly/nsbd/tempName');
          viewYl(fileid, filenmArr[i], '/kfly/nsbd/tempName')
        }
      }
    } else {
      selectFile(fileid)
    }
  } else {
    //多个pdf弹出下载框
    selectFile(fileid)
  }
}
//判断某个字符在字符串出现的次数
function countString(str, s) {
  let index = str.indexOf('f') // 字符出现的位置
  let num = 0 // 这个字符出现的次数
  while (index !== -1) {
    num++ // 每出现一次 次数加一
    index = str.indexOf('f', index + 1) // 从字符串出现的位置的下一位置开始继续查找
  }
  return num
}

//打印方法
//非普通打印，表格中涉及到纵向滚动条会只打印出部分显示内容，第一个参数“hdiv”就是将又Y向滚动条的div高度释放打印
//第二个参数“dydiv”是要打印的div
function dyfucntion(hdiv, dydiv) {
  $('#' + hdiv).css('height', '')
  const headstr = '<html><head><title></title></head><body>'
  const footstr = '</body>'
  const printData = document.getElementById(dydiv).innerHTML
  const oldstr = document.body.innerHTML
  document.body.innerHTML = headstr + printData + footstr
  window.print()
  document.body.innerHTML = oldstr
  window.location.reload()
  return false
}

//打印方法(去掉最后一列 操作列）
function printData(dydiv, dytable) {
  const headstr = '<html><head><title></title></head><body>'
  const footstr = '</body>'

  const table = document.getElementById(dytable)
  const trs = table.rows
  const cells = trs.item(0).cells.length
  for (let i = 0, len = trs.length; i < len; i++) {
    const cell = trs[i].cells[cells - 1]
    cell.style.display = 'none'
  }
  const printData = document.getElementById(dydiv).innerHTML
  const oldstr = document.body.innerHTML
  document.body.innerHTML = headstr + printData + footstr
  window.print()
  document.body.innerHTML = oldstr
  window.location.reload()
  return false
}

//打印方法(正常打印所有列）
function printData1(dydiv) {
  const headstr = '<html><head><title></title></head><body>'
  const footstr = '</body>'

  const printData = document.getElementById(dydiv).innerHTML
  const oldstr = document.body.innerHTML
  document.body.innerHTML = headstr + printData + footstr
  window.print()
  document.body.innerHTML = oldstr
  window.location.reload()
  return false
}

//小数转化为百分数
function toPercent(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return ''
  }
  let str = Number(vad * 100).toFixed(0)
  str += '%'
  return str
}

//转换为百分比格式
function numToPercent(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return ''
  }
  let str = Number(vad).toFixed(2)
  str += '%'
  return str
}

//判断浏览器类型
function userBrowser() {
  const browserName = navigator.userAgent.toLowerCase()
  if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
    return 'IE'
  } else if (/firefox/i.test(browserName)) {
    return 'Firefox'
  } else if (
    /chrome/i.test(browserName) &&
    /webkit/i.test(browserName) &&
    /mozilla/i.test(browserName)
  ) {
    return 'Chrome'
  } else if (/opera/i.test(browserName)) {
    return 'Opera'
  } else if (
    /webkit/i.test(browserName) &&
    !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))
  ) {
    return 'Safari'
  }
  return 'unKnow'
}

//利用原生Js获取操作系统版本
function getOS() {
  const sUserAgent = navigator.userAgent
  const isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows'
  const isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel'
  if (isMac) {
    return 'Mac'
  }
  const isUnix = navigator.platform == 'X11' && !isWin && !isMac
  if (isUnix) {
    return 'Unix'
  }
  const isLinux = String(navigator.platform).indexOf('Linux') > -1
  if (isLinux) {
    return 'Linux'
  }
  if (isWin) {
    const isWin2K =
      sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
    if (isWin2K) {
      return 'Win2000'
    }
    const isWinXP =
      sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
    if (isWinXP) {
      return 'WinXP'
    }
    const isWin2003 =
      sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
    if (isWin2003) {
      return 'Win2003'
    }
    const isWinVista =
      sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
    if (isWinVista) {
      return 'WinVista'
    }
    const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
    if (isWin7) {
      return 'Win7'
    }
    const isWin10 =
      sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1
    if (isWin10) {
      return 'Win10'
    }
  }
  return 'other'
}

function sexFormat(val) {
  if (val == '1') {
    return '男'
  }
  if (val == '2') {
    return '女'
  }
  if (val == '3') {
    return '其他'
  }
}

//手机号正则
function checkMobile(str) {
  const re = /^1\d{10}$/
  if (re.test(str)) {
    return true
  }
  return false
}
