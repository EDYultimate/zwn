const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
//var picturePathHeader="http://localhost:8082/hwwrUpload";
const picturePathHeader = 'http://10.3.250.90:8082/hwwrUpload'

const getIsFile = 'y'
var filename = ''
var filename = ''
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  const uid = getUid()
  uploadForImgdivShow('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)
})

function saveDbBase() {
  if ('n' == getIsFile) {
    const msg = '附件不合规，是否继续保存？\n\n请确认！'

    if (confirm(msg) == true) {
      save()
    }
  } else {
    save()
  }
}

function save() {
  const val = $('#NM').val()

  if (val == '' || val == undefined) {
    alert('请上传文档')
    return
  }

  const param = {}
  const fileinput = $('#fileuid').val()
  const nm = $('#NM').val()
  const dept = $('#DEPT').val()
  const tm = $('#TM').val()
  const upperson = $('#UP_PERSON').val()

  if (fileinput == null || fileinput == '') {
    alert('请上传文件')
    return
  }
  if (nm == null || nm == '') {
    alert('文件名不能为空')
    return
  }
  if (upperson == '' || upperson == undefined) {
    alert('上传人不能为空')
    return
  }

  const index = layer.load()
  param.id = getUid()
  param.fileid = $('#fileuid').val()
  param.nm = $('#NM').val()
  param.up_person = upperson
  param.dept = dept
  param.tm = tm
  param.tp = '2' //标准规范

  console.info(param)
  $.ajax({
    url: basePath + 'szybh/sjzl/flfg/saveLawBase',
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

function uploadForImgdivShow(fileid, uid, fileNames) {
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
      },
      success: function (json) {
        console.info(json)
        const data = json.files

        $('#NM').val(data.FILE_NM)

        $('#file-a').css('display', 'none') //上传成功后，隐藏上传按钮
      }
    })
    //当一个单独的文件处理队列结束触发(验证文件格式和大小)
    .on('fileuploadprocessalways', function (e, data) {})
    //显示上传进度条
    .on('fileuploadprogressall', function (e, data) {})
    //上传请求失败时触发的回调函数
    .on('fileuploadfail', function (e, data) {})
    //上传请求成功时触发的回调函数
    .on('fileuploaddone', function (e, data) {
      console.info(data)
      const file = data.result.files
      const uid = file.FILE_ID
      const name = file.FILE_NM
      $('#imgNm').html(
        '<p>' +
          data.files[0].name +
          "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delpic('" +
          uid +
          "','" +
          name +
          '\',this)" >删除</a></p>'
      )
    })
    //上传请求结束后，不管成功，错误或者中止都会被触发
    .on('fileuploadalways', function (e, data) {
      console.info(data)
    })
}

function delpic(uid, name, e) {
  $('#file-a').css('display', '') //删除后，上传按钮重新显示
  //	$("#pic").attr("src","");
  $('#NM').val('')
  delSingleFile(uid, name, e)
}
