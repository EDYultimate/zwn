let problemType = {'5':'供水范围不一致','10':'取水户有关事项发生变化但未及时申请变更','3':'取水水源及配置情况不一致','4':'取水用途不一致','1':'取水规模不一致',
  9: '取水许可证有效期届满未及时申请延续',
  2: '取水设施不一致',
  13: '取用退水计量台账不规范',
  17: '因漏缴水费给供水单位造成经济损失',
  21: '地方水行政主管部门越权审批',
  15: '备用水源使用不规范',
  11: '工程停止运行但未提出注销申请',
  16: '未及时缴纳水资源税',
  14: '未按规定报送取水情况',
  8: '未经批准擅自取水',
  18: '消极对待检查',
  19: '监督检查中数据弄虚作假',
  20: '计划用水监管不规范',
  12: '计量设施不完备',
  7: '超批复计划取水',
  6: '超许可水量取水',
  22: '其他问题'
}

let selHtml = "";
let wpc_obj = {
  wpc_cd: '',
  wpc_sn: '',
  wrp_nm: '',
  conc_org: '',
  ad_nm: ''
}
var titleArr = []
var idArr = []
var newidArr = []//新问题id数据集，记录随机生成的uuid
var oldidArr = []//新增时候，会把之前为解决问题带过来，并且把文件也带过来，带过来的同时要把这个文件和新的问题捆绑存入新的数据到数据库
var form = layui.mutiselectform
var element
var id
$(document).ready(function () {
  $('#wpc_cd').val(wpc_cd)

  initData()

  layui.use('element', function () {
    var $ = layui.jquery
    element = layui.element //Tab的切换功能，切换事件监听等，需要依赖element模块
    //触发事件
    let active = {
      tabAdd: function (tab) {
        console.info(tab)
        //新增一个Tab项
        element.tabAdd('ListFilter', {
          title: '新选项' + (Math.random() * 1000 | 0) //用于演示
          content: '内容' + ((Math.random() * 1000) | 0),
          id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
        })
      }
    }
    $('.site-demo-active').on('click', function () {
      console.info($(this))
      var othis = $(this),
        type = othis.data('type')
      active[type] ? active[type].call(this, othis) : ''
    })
  })
})


//问题模板
function ProblemTrTemp(list) {
  idArr.push("'" + list.PROBLEM_ID + "'") //每个问题最小单位的主键，存入数组，最后用来查询相关文件列表一次性查出，分批查速度太慢
  var problemTrHtml = ''

  var BTM = isNull(list.BTM)
  var ETM = isNull(list.ETM)
  var PROBLEM_CD = isNullZ(list.PROBLEM_CD)
  var PROBLEM_ID = isNullZ(list.PROBLEM_ID)
  var PROBLEM_EXPLAIN = isNullZ(list.PROBLEM_EXPLAIN)
  var CHANGE_REQUEST = isNullZ(list.CHANGE_REQUEST)
  var ISFINISH = isNullZ(list.ISFINISH)
  var CONC_ID = isNullZ(list.CONC_ID)

  problemTrHtml = '<table class="bbTable problemTable">'
  problemTrHtml +=
    ' <tr>' +
    '<td>年份</td>' +
    '<td><input name="BTM" value=' +
    BTM +
    '  class="problemParam" onclick="WdatePicker({onpicking: initNM, dateFmt: \'yyyy\'})"></input>' +
    '<input name="PROBLEM_CD"  value=' +
    PROBLEM_CD +
    '  class="problemParam" style=\'display:none\'>' +
    '<input name="PROBLEM_ID"  value=' +
    PROBLEM_ID +
    ' class="problemParam" style=\'display:none\'>' +
    '<input name="CONC_ID"  value=' +
    CONC_ID +
    ' class="problemParam" style=\'display:none\'></td>' +
    '<td>是否完成：</td><td>'
  if (ISFINISH == 1) {
    problemTrHtml +=
      '<select name=\'ISFINISH\'  class="problemParam">' +
      "<option value='0'>否</option>" +
      '<option value=\'1\' selected="selected">是</option>' +
      '</select>'
  } else {
    problemTrHtml +=
      '<select name=\'ISFINISH\' class="problemParam">' +
      "<option value='0'>否</option>" +
      "<option value='1'>是</option>" +
      '</select>'
  }

  problemTrHtml +=
    '</td><td>问题处理完成年月</td>' +
    '<td><input value=' +
    ETM +
    '  name="ETM"  class="problemParam"  onclick="WdatePicker({onpicking: initNM, dateFmt: \'yyyy-MM\'})"></input></td>' +
    '</tr>'
  problemTrHtml +=
    '<tr>' +
    "<td><div style='font-weight: bold;'>问题说明：</div></td>" +
    '<td colspan="2"><textarea rows="4" cols="35" name=\'PROBLEM_EXPLAIN\' class="problemParam">' +
    PROBLEM_EXPLAIN +
    '</textarea></td>' +
    "<td><div style='font-weight: bold;'>整改要求：</div></td>" +
    '<td colspan="2"><textarea rows="4" cols="35" name=\'CHANGE_REQUEST\' class="problemParam">' +
    CHANGE_REQUEST +
    '</textarea></td>' +
    '</tr>' +
    '</table>'

  //文件上传部分
  problemTrHtml +=
    '<table id="filetable" class="bbTable"  style="height: 15%;">' +
    '<tbody><tr style="height:90px"><td style="width:102px">' +
    '<a href="javascript:;" class="a-upload">' +
    "<input onclick=\"initUpload('WPCONC','" +
    PROBLEM_ID +
    '\');" id="' +
    PROBLEM_ID +
    '" type="file" name="files" >上传文件</a><br/>' +
    '<span style="color:red">支持：doc/docx/xls/xlsx/pdf/<br/>ppt/pptx/png/gif/jpeg/bmp/jpg</span>' +
    '</td><td style="height: 75px;">' +
    '<div id="' +
    PROBLEM_ID +
    'scrollfiles"  style="height: 70px;overflow-y: auto;">' +
    '<table style="width:100%"><tbody id="' +
    PROBLEM_ID +
    'uploadfiles" >' +
    //				fileHtmlStr+
    '</tbody></table></div></td></tr></tbody>' +
    '</table>'

  return problemTrHtml
}


function initData() {

  var url = basePath + 'jdjc/getWPCProblemListByWpc'
  //打开遮罩层
  var index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  var json = {
    wpc_cd: $('#wpc_cd').val(),
    yr: yr
  }

  jQuery.getJSON(url, json, function (result) {
    var problemData = result.page
    if (problemData.length > 0) {
      $('#wpc_sn').val(isNull(problemData[0].WPC_SN))
      $('#conc_org').val(isNull(problemData[0].CONC_ORG))
      $('#wrp_nm').val(isNull(problemData[0].WRP_NM))
    }

    for (var i = 0; i < problemData.length; i++) {
      var tabli = $('.layui-tab-title li') //查看当前标签个数
      var typeNm = problemData[i].PROBLEM_NM
      var typeCd = problemData[i].PROBLEM_CD

      var problemTable = ProblemTrTemp(problemData[i])

      midStr = typeCd
      $('#problemSel').append(typeNm + ',')
      //新增一个Tab项
      element.tabAdd('ListFilter', {
        title: typeNm, //tab名称
        content: problemTable,
        id: id //tab的id
      })
      if (tabli.length == 0) {
        //第一个标签，默认打开第一个标签页内容
        $('.layui-tab-title li').eq(0).addClass('layui-this')
.siblings()
.removeClass('layui-this')
        $('.layui-tab-content .layui-tab-item').eq(0).addClass('layui-show')
      }
    }
    //            	 getFile('',idArr);
    getFile('', idArr, newidArr, oldidArr)
    //关闭遮罩层
    layer.close(index_load)
  })
}

function cancel() {
  parent.layer.closeAll()
}

//保存问题
function saveProblem() {
  var jsonData = new Array()
  var itemFlag = 0
  $('.problemTable').each(function (i, item) {
    var jsonitem = {}
    var flag = 0
    $(this)
      .find('.problemParam')
      .each(function (i, item) {
        jsonitem[this.name] = $(this).val()
      })
    //问题解决必须填写问题处理完成年份
    if (
      ($(this).find("[name='ETM']").val() == '' || $(this).find("[name='ETM']").val() == '-') &&
      $(this).find("[name='ISFINISH']").val() == 1
    ) {
      alert('如果问题已解决，请填写结束年份')
      itemFlag = 1
      return
    }
    //		alert($(this).find("[name='PROBLEM_ID']").val());
    //空说明之前没有数据
    if ($(this).find("[name='PROBLEM_ID']").val() == '') {
      jsonitem.PROBLEM_ID = UUID()
    }
    //		jsonitem.CONC_ID=pid;//巡查编码
    jsonitem.STATE_FLAG = '1' //如果数据已经到了修改这步，说明之前已经跟巡查挂钩保存过了，所以默认为1
    jsonitem.WPC_CD = $('#wpc_cd').val() //取水许可证编码

    jsonData.push(jsonitem)
  })
  if (itemFlag == 1) {
    return
  }
  console.info(jsonData)
  if (jsonData.length == 0) {
    var jsonitem = {}
    jsonitem.CONC_ID = pid //巡查编码
    jsonitem.WPC_CD = $('#wpc_cd').val() //取水许可证编码
    jsonitem.PROBLEM_ID = UUID() //问题id
    jsonitem.PROBLEM_CD = 'N' //问题类型:无
    jsonitem.CHANGE_REQUEST = '' //
    jsonitem.PROBLEM_EXPLAIN = '' //
    jsonitem.ISFINISH = '' //
    jsonitem.BTM = '' //
    jsonitem.ETM = '' //
    jsonitem.STATE_FLAG = '1'

    jsonData.push(jsonitem)
  }
  console.info(jsonData)

  //打开遮罩层
  var index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $.ajax({
    url: basePath + '/jdjc/saveProblemDate',
    data: 'setList=' + JSON.stringify(jsonData), //参数
    dataType: 'json',
    type: 'post',
    success: function (result) {
      //关闭遮罩层
      alert(result.info)
      if (result.info == '保存成功') {
        //	    		var wpc_cd=$("#wpc_cd").val();
        //		    	$('#'+wpc_cd+'sub',parent.document).text("已填报");
        //		    	$('#'+wpc_cd+'sub',parent.document).css("color","green");
        //		    	$('#'+wpc_cd+'del',parent.document).css("display","none");
        //		    	$('#'+wpc_cd+'sub',parent.document).attr("flag","1");//改变填报后的状态，父页面用来判断是否填报成功
        parent.search()
        parent.layer.closeAll()
      }
    }
  })
}

/**
 * =======================================
 *  文件上传
 * =======================================
 */

// 信息传递中所保存的所有文件名称
let fileNames = []
var fileIds = []
// 从保存的数组中删除对应文件
var deleteFIleFromArray = function (fileid) {
  if (fileid) {
    if (fileIds.indexOf(fileid) < 0) {
      return
    }
    fileNames.splice(fileIds.indexOf(fileid), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
  }
}

// 添加文件名称
let addFileName = function (filename, fileid) {
  if (filename) {
    if (fileNames.indexOf(filename) >= 0) {
      return false
    }
    fileNames.push(filename)
    fileIds.push(fileid)
    return true
  }
  return false
}
//删除文件名称
let rmFileName = function (filename, fileid) {
  if (filename) {
    if (fileNames.indexOf(filename) < 0) {
      return false
    }
    fileNames.splice(fileNames.indexOf(filename), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
    return true
  }
  return false
}

// 生成文件上传div
let getFileDiv = function (filename, fileid, filesize, mang_cd) {
  var filediv =
    "<tr id='file" +
    fileid +
    "' ><td><a onclick='javascript:viewfile(\"" +
    fileid +
    '")\'>' +
    filename +
    "</a></td><td><span id='filesize" +
    fileid +
    "' >" +
    filesize +
    '</span>' +
    "<span id='progress" +
    fileid +
    "' ></span></td><td><a onclick=\"deletefile('" +
    fileid +
    "', '" +
    mang_cd +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>删除</a>" +
    '</td><td><a onclick="dlfile(\'' +
    fileid +
    "', '" +
    filename +
    "', '" +
    mang_cd +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>下载</a></td></tr>"
  addFileName(filename, fileid)
  return filediv
}

// 删除文件上传对应div
let removeFileDiv = function (fileid) {
  var element = document.getElementById('file' + fileid)
  element.parentNode.removeChild(element)
}

// 控制进度条
let progressctrl = function (fileid, proc) {
  $('#progress' + fileid).text(' (' + proc + ')')
}

/* 校验文件
 * 判断文件大小及是否已上传
 */
let validfile = function (filename, filesize) {
  if (fileNames.indexOf(filename) >= 0) {
    alert(filename + ' 已上传，请选择其他文件')
    return false
  }

  if (filesize > 6291456) {
    alert(filename + ' 大于5M，请选择小于5M的文件')
    return false
  }

  if (filesize == 0) {
    alert(filename + ' 是空文件，请重新选择上传文件')
    return false
  }

  return true
}

function genUUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

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

//32位UUID
function UUID() {
  return genUUID(32, Math.floor(Math.random() * 32) + 10)
}

function getFile(mang_cd, conc_id, new_concidArr, old_concidArr) {
  pdata = {
    conc_id: conc_id,
    wpc_cd: wpc_cd,
    new_concid: new_concidArr, //带过的数据新生成的问题id数组
    old_concid: old_concidArr //带过的数据老的问题id数组
  }

  var url = convertJsonToUrl(pdata)

  $.ajax({
    url: basePath + 'jdjc/getConcProblemFile' + url,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; ++i) {
          $('#' + data[i].CONC_ID + 'uploadfiles').append(
            getFileDiv(
              data[i].FILE_TITL + data[i].FILE_EXT,
              data[i].FILE_ID,
              data[i].FILE_SIZE + 'KB',
              data[i].MANG_CD
            )
          )
        }
      }
    }
  })
}
/*function getFile(mang_cd) {
    pdata = {
        conc_id: id,
    };

    var url = convertJsonToUrl(pdata);
  if(id!=null&&id!=""){
	  $.ajax({
	        url: basePath + 'jdjc/getConcProblemFile'+url,
	        type: "GET",
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function (data) {
	            if (data && data.length>0) {
	                for (var i=0; i<data.length; ++i) {
	                    $("#uploadfiles").append(getFileDiv(data[i].FILE_TITL+data[i].FILE_EXT,data[i].FILE_ID,data[i].FILE_SIZE+"KB", data[i].MANG_CD));
	                }
	            }
	        }
	    });
  }
  

}
*/
// 上传文件
let initUpload = function (mang_cd, id) {
  var FileController = basePath + 'jdjc/upload'
  //打开遮罩层
  var index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#' + id).fileupload({
    //    	$('#uploadfile').fileupload({
    url: FileController,
    add: function (e, data) {
      console.info(e, data)
      // 生成文件uuid
      var uuid = UUID()
      var filename = data.files[0].name
      var filesize = Math.ceil(data.files[0].size / 1024)

      $('#' + id + 'uploadfiles').append(getFileDiv(filename, uuid, filesize + 'KB', mang_cd))
      var scrollheight = $('#' + id + 'uploadfiles').height()
      $('#' + id + 'scrollfiles').scrollTop(scrollheight)
      data.fileUUID = uuid

      // 添加文件uuid到request
      data.formData = {
        file_id: uuid,
        conc_id: id,
        c_id: wpc_cd,
        file_size: filesize,
        mang_cd: mang_cd
      }
      data.submit()
    },
    done: function (e, data) {
      var fileid = data.fileUUID
      progressctrl(fileid, '100%')
      var res = data.result
      if (!res) {
        // 上传错误，则删除文件上传div
        removeFileDiv(fileid)
        deleteFIleFromArray(fileid)
        alert('上传失败')
      } else if (fileIds.indexOf(fileid) < 0) {
        fileIds.push(fileid)
      }
    },
    progress: function (e, data) {
      var progress = parseInt((data.loaded / data.total) * 100, 10)
      if (progress == 100) {
        // 前台传递100%之后，后台需要消耗存储时间
        progress = '失败'
      }
      var fileid = data.fileUUID
      progressctrl(fileid, progress + '%')
    }
  })
  //关闭遮罩层
  layer.close(index_load)
}
// 删除文件
let deletefile = function (fileid, mang_cd) {
  //打开遮罩层
  var index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  pdata = {
    id: id,
    file_id: fileid,
    mang_cd: mang_cd
  }
  $.ajax({
    url: basePath + 'jdjc/delConcFile',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (!data) {
        alert(data.message)
        return
      }
      removeFileDiv(fileid)
      deleteFIleFromArray(fileid)
      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

// 获取文件后缀名
let getFileExt = function (filename) {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename
}

function dlfile(file_id, filename, mang_cd) {
  $.fileDownload(basePath + 'spgc/downloadfileProblem', {
    httpMethod: 'POST',
    data: {
      id: id,
      file_id: file_id,
      mang_cd: mang_cd
    },
    successCallback: function (url) {
      debugger
    }
  })
}


function initNM(dp) {
	
}