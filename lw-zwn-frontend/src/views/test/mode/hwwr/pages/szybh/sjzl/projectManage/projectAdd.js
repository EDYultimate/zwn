const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
const getIsFile = 'y'
$(function () {
  const uid = getUid()
  uploadFile('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)
  iniSel1()

  $('#pro_level1').change(function () {
    const val = $('#pro_level1').val()
    if (val == '') {
      $('#pro_level1text').css('display', '') //手动输入框显示
      $('#pro_level2text').css('display', '')
      $('#pro_level2').val('')
    } else {
      $('#pro_level1text').css('display', 'none') //手动输入框隐藏
      $('#pro_level2text').css('display', 'none') //手动输入框隐藏
      iniSel2()
    }
  })
  $('#pro_level2').change(function () {
    const val = $('#pro_level2').val()
    if (val == '') {
      $('#pro_level2text').css('display', '') //手动输入框显示
    } else {
      $('#pro_level2text').css('display', 'none') //手动输入框隐藏
    }
  })
})

function iniSel1() {
  jQuery.getJSON(basePath + '/szybh/sjzl/project/getProlevelList', param, function (result) {
    let sel1Html = ''
    const sel2Html = ''
    console.info(result)
    const data = result.l1
    const data2 = result.l2
    console.info(data)

    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const l1 = data[i].PRO_LEVEL1
        sel1Html += "<option value='" + l1 + "'>" + l1 + '</option>'
      }
      sel1Html += "<option value=''>手动录入</option>"
      $('#pro_level1').html(sel1Html)
    } else {
      $('#pro_level1').css('display', 'none')
      $('#pro_level1text').css('display', '') //手动输入框显示
    }

    iniSel2() //查询所属二级下拉框
  })
}
//查询所属二级下拉框
function iniSel2() {
  param.prolevel1 = $('#pro_level1').val()
  jQuery.getJSON(basePath + '/szybh/sjzl/project/getProlevelList', param, function (result) {
    let sel2Html = ''
    console.info(result)
    const data2 = result.l2

    if (data2 != null && data2.length > 0) {
      for (let i = 0; i < data2.length; i++) {
        const l2 = data2[i].PRO_LEVEL2
        sel2Html += "<option value='" + l2 + "'>" + l2 + '</option>'
      }
      sel2Html += "<option value=''>手动录入</option>"
      $('#pro_level2').html(sel2Html)
    } else {
      $('#pro_level2').css('display', 'none')
      $('#pro_level2text').css('display', '') //手动输入框显示
    }
  })
}

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
  const param = {}
  const fileinput = $('#fileuid').val()
  const nm = $('#project_nm').val()
  const pro_level1 = $('#pro_level1').val()
  const pro_level2 = $('#pro_level2').val()

  if (fileinput == null || fileinput == '') {
    alert('请上传文件')
    return
  }
  if (nm == null || nm == '') {
    alert('项目名称不能为空')
    return
  }
  if ($('#pro_unit').val() == null || $('#pro_unit').val() == '') {
    alert('承担单位不能为空')
    return
  }
  if ($('#wt_cashnum').val() == null || $('#wt_cashnum').val() == '') {
    alert('委托金额不能为空')
    return
  }
  if ($('#wt_cashnum').val() == null || $('#wt_cashnum').val() == '') {
    alert('委托金额不能为空')
    return
  }
  //	var val=$("#pro_level1").val();
  console.log('pro_level1', $('#pro_level1').val())
  console.log("pro_level1=''", $('#pro_level1').val() == '')

  console.log('pro_level1', $('#pro_level1text').val())
  console.log("pro_level1=''", $('#pro_level1text').val() == '')

  if ($('#pro_level1').val() == '' && $('#pro_level1text').val() == '') {
    alert('所属一级项目不能为空')
    return
  }

  if (pro_level1 == '') {
    param.pro_level1 = $('#pro_level1text').val()
  } else {
    param.pro_level1 = pro_level1
  }
  if (pro_level2 == '') {
    param.pro_level2 = $('#pro_level2text').val()
  } else {
    param.pro_level2 = pro_level2
  }

  const index = layer.load()
  param.id = getUid()
  param.fileid = $('#fileuid').val()
  param.project_nm = $('#project_nm').val()
  param.tm = $('#tm').val()
  param.wt_cashnum = $('#wt_cashnum').val()
  param.pro_unit = $('#pro_unit').val()
  param.wt_tp = $('#wt_tp').val()
  param.pro_stage = $('#pro_stage').val()
  param.yw_tp = $('#ywtp').val()
  param.first_term = $('#first_term').val()
  param.first_scale = $('#first_scale').val()
  param.first_cash = $('#first_cash').val()
  param.first_tm = $('#first_tm').val()
  param.second_term = $('#second_term').val()
  param.second_scale = $('#second_scale').val()
  param.second_cash = $('#second_cash').val()
  param.second_tm = $('#second_tm').val()
  param.third_term = $('#third_term').val()
  param.third_scale = $('#third_scale').val()
  param.third_cash = $('#third_cash').val()
  param.third_tm = $('#third_tm').val()

  console.info(param)

  $.ajax({
    url: basePath + 'szybh/sjzl/project/saveProjectBase',
    type: 'POST',
    data: JSON.stringify(param),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      alert(data.info)
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

function uploadFile(fileid, uid, fileNames) {
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
      $('#file_tr')
        .parent()
        .after(
          "<p><span title='" +
            data.files[0].name +
            "' " +
            "style='width:80%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;display:inline-block;'>" +
            data.files[0].name +
            "</span>&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delSingleFile('" +
            uid +
            "','" +
            name +
            '\',this)" >删除</a></p>'
        )
    })
    //上传请求结束后，不管成功，错误或者中止都会被触发
    .on('fileuploadalways', function (e, data) {})
  $('#uploadImg').click()
  //return getIsFile;
}
