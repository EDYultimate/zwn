let selHtml = ''
const wpc_obj = {
  wpc_cd: '',
  wpc_sn: '',
  wrp_nm: '',
  conc_org: '',
  ad_nm: ''
}
$(document).ready(function () {
  iniSel()
  if (!hid) {
    id = UUID()
  } else {
    id = hid
  }
  initUpload('WPCONC')
  getFile('WPCONC')

  initData()
})
let flagNum = 0
function mutlsel() {
  const options = {
    再生水矿坑排水: '再生水矿坑排水',
    地下水: '地下水',
    '地下水（矿坑排水）': '地下水（矿坑排水）',
    地表水: '地表水',
    地表水地下水: '地表水地下水',
    '地表水（再生水）': '地表水（再生水）',
    '浅层地下水（傍河取水）': '浅层地下水（傍河取水）'
  }

  $('.problem_id').mselect(options, [], true)
}

function iniSel() {
  $.ajax({
    url: basePath + 'jdjc/getProblemList',
    type: 'GET',
    data: '',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      selHtml += "<select name='PROBLEM_ID' class='problemParam'>"
      for (let i = 0; i < data.length; i++) {
        selHtml += "<option value='" + data[i].PROBLEM_ID + "'>" + data[i].PROBLEM_NM + '</option>'
      }
      selHtml += '</select>'
      if (hid == '') {
        addProblemTr()
      }
    }
  })
}

//问题模块追加模板
function addProblemTr() {
  debugger
  const headid = 'prblemModelTableId' + flagNum
  flagNum++
  let problemTrHtml =
    "<table id='prblemModelTableId" + flagNum + '\'  class="bbTable problemTable">'
  problemTrHtml += '<tbody><tr>'
  problemTrHtml += '<td>主要问题</td>'
  problemTrHtml +=
    '<td>' +
    selHtml +
    '' +
    "<div style='font-weight: bold;'>问题说明：</div>" +
    '<textarea rows="4" cols="80" id="" name=\'PROBLEM_EXPLAIN\' class="problemParam"></textarea>' +
    "<input class=\"problemParam\" name='PROBLEM_CD'  style='display:none'>" +
    '</td>'
  problemTrHtml +=
    "<td rowspan='3'><div style='cursor:pointer' onclick=\"delProblemTable('prblemModelTableId" +
    flagNum +
    '\')">删除</div></td>'
  ;('</tr>')
  problemTrHtml += '<tr><td>整改要求</td>'
  problemTrHtml +=
    '<td style=\'width:50%\'><textarea rows="4" cols="80" id="" name=\'CHANGE_REQUEST\' class="problemParam"></textarea></td>'
  problemTrHtml += '</tr>'
  problemTrHtml += '<tr>'
  problemTrHtml += '<td>整改落实情况</td>'
  problemTrHtml +=
    "<td style='width:70%'>" +
    '<div>是否完成：<select name=\'ISFINISH\' class="problemParam">' +
    "<option value='0'>否</option><option value='1'>是</option></select></div>" +
    '<textarea name=\'SITUATION\' class="problemParam" rows="4" cols="80"></textarea></td>'
  problemTrHtml += '</tr>'
  problemTrHtml += '</tbody></table>'
  //	if(flagNum==1){
  //		$("#problemDiv").after(problemTrHtml);
  //	}else{
  //		$("#"+headid).after(problemTrHtml);
  //	}
  $('#midDiv').before(problemTrHtml)
}

function delProblemTable() {
  debugger
  $('#prblemModelTableId' + flagNum).remove()
  flagNum--
}

function initData() {
  const url = basePath + 'jdjc/getConcBasicInfoByid'
  if (hid) {
    //打开遮罩层
    const index_load = layer.load(1, {
      shade: [0.6, '#fff'] //0.1透明度的白色背景
    })
    const json = {
      conc_id: id
    }

    jQuery.getJSON(url, json, function (result) {
      console.info(result)
      const basicData = result.basic
      const problemData = result.problem
      $('#yr').val(isNull(basicData[0].YR))
      $('#wpc_sn').val(isNull(basicData[0].WPC_SN))
      $('#conc_org').val(isNull(basicData[0].CONC_ORG))
      $('#wrp_nm').val(isNull(basicData[0].WRP_NM))
      $('#tm').val(isNull(basicData[0].TM))
      $('#ad_nm').val(isNull(basicData[0].AD_NM))
      wpc_obj.wpc_cd = basicData[0].WPC_CD
      let problemTrHtml1 = ''
      if (problemData && problemData.length > 0) {
        for (var i = 0; i < problemData.length; i++) {
          var pid = problemData[i].PROBLEM_CD

          problemTrHtml1 += "<table id='" + pid + '\'  class="bbTable problemTable">'
          //                	    problemTrHtml1+="<input class=\"problemParam\" name='PROBLEM_CD'  display=\"none\">";
          problemTrHtml1 += '<tbody><tr>'
          problemTrHtml1 += '<td>主要问题</td>'
          problemTrHtml1 +=
            '<td>' +
            selHtml +
            '' +
            "<div style='font-weight: bold;'>问题说明：</div>" +
            '<textarea rows="4" cols="80" id="" name=\'PROBLEM_EXPLAIN\' class="problemParam"></textarea>' +
            "<input class=\"problemParam\" name='PROBLEM_CD'  style='display:none'>" +
            '</td>'
          problemTrHtml1 +=
            "<td rowspan='3'><div style='cursor:pointer' onclick=\"delProblemTable('" +
            pid +
            '\')">删除</div></td></tr>'
          problemTrHtml1 += '<tr><td>整改要求</td>'
          problemTrHtml1 +=
            '<td style=\'width:50%\'><textarea rows="4" cols="80" id="" name=\'CHANGE_REQUEST\' class="problemParam"></textarea></td>'
          problemTrHtml1 += '</tr>'
          problemTrHtml1 += '<tr>'
          problemTrHtml1 += '<td>整改落实情况</td>'
          problemTrHtml1 +=
            '<td >' +
            '<div>是否完成：<select name=\'ISFINISH\' class="problemParam">' +
            "<option value='0'>否</option><option value='1'>是</option></select></div>" +
            '<textarea name=\'SITUATION\' class="problemParam" rows="4" cols="80"></textarea></td>'
          problemTrHtml1 += '</tr>'
          problemTrHtml1 += '</tbody></table>'
        }

        $('#midDiv').before(problemTrHtml1)

        for (var i = 0; i < problemData.length; i++) {
          var pid = problemData[i].PROBLEM_CD
          const change_request = problemData[i].CHANGE_REQUEST
          const situation = problemData[i].SITUATION
          const isfinish = problemData[i].ISFINISH
          const problem_id = problemData[i].PROBLEM_ID
          const PROBLEM_EXPLAIN = problemData[i].PROBLEM_EXPLAIN
          $('#' + pid + '')
            .find("[name='PROBLEM_CD']")
            .val(pid)
          $('#' + pid + '')
            .find("[name='PROBLEM_ID']")
            .val(problem_id)
          $('#' + pid + '')
            .find("[name='CHANGE_REQUEST']")
            .val(change_request)
          $('#' + pid + '')
            .find("[name='SITUATION']")
            .val(situation)
          $('#' + pid + '')
            .find("[name='ISFINISH']")
            .val(isfinish)
          $('#' + pid + '')
            .find("[name='PROBLEM_EXPLAIN']")
            .val(PROBLEM_EXPLAIN)
        }
      }
      //关闭遮罩层
      layer.close(index_load)
    })
  }
}

function delProblemTable(pid) {
  $.ajax({
    type: 'GET',
    url: basePath + 'jdjc/delProblemItem?pid=' + pid,
    contentType: 'application/json',
    async: true,
    success: function (data) {
      $('#' + pid).remove()
      if (data.success == 'true') {
        console.info('删除成功')
      } else {
        console.info('删除失败')
      }
    }
  })
}

function initNM(dp) {
  $.ajax({
    type: 'GET',
    url: basePath + 'jdjc/getCONC?tyear=' + dp.cal.getNewDateStr(),
    contentType: 'application/json',
    async: true,
    success: function (data) {
      const options = {}
      if (data && data.length > 0) {
        data.forEach(function (i) {
          options[i.nm] = i.nm
        })
        $('#nm').mselect(options, [], true)
      }
    }
  })
}

function cancel() {
  parent.layer.closeAll()
}

function save() {
  let flag = true

  if (isStrEmpty($('#yr').val())) {
    flag = false
    alert('年份不能为空')
    return
  }

  if (isStrEmpty($('#wpc_sn').val())) {
    flag = false
    alert('取水许可证不能为空')
    return
  }
  if (isStrEmpty($('#wrp_nm').val())) {
    flag = false
    alert('取水权人不能为空')
    return
  }

  if (isStrEmpty($('#tm').val())) {
    flag = false
    alert('时间不能为空')
    return
  }

  if (flag) {
    if ($('.problemTable').length == 0) {
      alert('请填写主要问题模块')
      return
    }

    const json = {}
    $('#table [name="pram"]').each(function () {
      json[this.id] = $(this).val()
    })

    json.wpc_cd = wpc_obj.wpc_cd

    json.conc_id = id

    console.info(json)

    $.ajax({
      url: basePath + 'jdjc/save',
      type: 'POST',
      data: JSON.stringify(json),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        if (data && data.success) {
          saveProblem()
        } else {
          alert('保存失败')
        }
      }
    })
  }
}
function saveProblem() {
  const jsonData = []
  $('.problemTable').each(function (i, item) {
    const jsonitem = {}
    $(this)
      .find('.problemParam')
      .each(function (i, item) {
        jsonitem[this.name] = $(this).val()
      })
    //空说明之前没有数据
    if (
      $(this).find("[name='PROBLEM_CD']").val() == '' &&
      $(this).find("[name='PROBLEM_CD']").val() == ''
    ) {
      jsonitem.PROBLEM_CD = UUID()
    }
    jsonitem.CONC_ID = id

    jsonData.push(jsonitem)
  })

  $.ajax({
    url: basePath + '/jdjc/saveProblemDate',
    data: 'setList=' + JSON.stringify(jsonData), //参数
    dataType: 'json',
    type: 'post',
    success: function (result) {
      //关闭遮罩层
      //	 	   layer.close(index_load);
      alert(result.info)
      parent.search()
      parent.layer.closeAll()
    }
  })
}

function setInput(wpc_cd, wpc_sn, wrp_nm, conc_org, ad_nm) {
  $('#wrp_nm').val(wrp_nm)
  $('#conc_org').val(conc_org)
  $('#wpc_sn').val(wpc_sn)
  $('#ad_nm').val(ad_nm)
}

function wiuPage() {
  layer.open({
    type: 2,
    title: '取水许可证',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['650px', '400px'],
    content: basePath + 'pages/rcgl/jdjc/dialog/wiu.jsp'
  })
}

/**
 * =======================================
 *  文件上传
 * =======================================
 */

// 信息传递中所保存的所有文件名称
const fileNames = []
const fileIds = []
// 从保存的数组中删除对应文件
const deleteFIleFromArray = function (fileid) {
  if (fileid) {
    if (fileIds.indexOf(fileid) < 0) {
      return
    }
    fileNames.splice(fileIds.indexOf(fileid), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
  }
}

// 添加文件名称
const addFileName = function (filename, fileid) {
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
const rmFileName = function (filename, fileid) {
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
const getFileDiv = function (filename, fileid, filesize, mang_cd) {
  const filediv =
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
const removeFileDiv = function (fileid) {
  const element = document.getElementById('file' + fileid)
  element.parentNode.removeChild(element)
}

// 控制进度条
const progressctrl = function (fileid, proc) {
  $('#progress' + fileid).text(' (' + proc + ')')
}

/* 校验文件
 * 判断文件大小及是否已上传
 */
const validfile = function (filename, filesize) {
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

//32位UUID
function UUID() {
  return genUUID(32, Math.floor(Math.random() * 32) + 10)
}

function getFile(mang_cd) {
  pdata = {
    conc_id: id
  }

  const url = convertJsonToUrl(pdata)
  if (id != null && id != '') {
    $.ajax({
      url: basePath + 'jdjc/getConcProblemFile' + url,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; ++i) {
            $('#uploadfiles').append(
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
}

// 上传文件
var initUpload = function (mang_cd) {
  const FileController = basePath + 'jdjc/upload'

  $('#uploadfile').fileupload({
    url: FileController,
    add: function (e, data) {
      // 生成文件uuid
      const uuid = UUID()
      const filename = data.files[0].name
      const filesize = Math.ceil(data.files[0].size / 1024)

      $('#uploadfiles').append(getFileDiv(filename, uuid, filesize + 'KB', mang_cd))
      const scrollheight = $('#uploadfiles').height()
      $('#scrollfiles').scrollTop(scrollheight)
      data.fileUUID = uuid

      // 添加文件uuid到request
      data.formData = {
        file_id: uuid,
        conc_id: id,
        c_id: '',
        file_size: filesize,
        mang_cd: mang_cd
      }
      data.submit()
    },
    done: function (e, data) {
      const fileid = data.fileUUID
      progressctrl(fileid, '100%')
      const res = data.result
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
      let progress = parseInt((data.loaded / data.total) * 100, 10)
      if (progress == 100) {
        // 前台传递100%之后，后台需要消耗存储时间
        progress = 98
      }
      const fileid = data.fileUUID
      progressctrl(fileid, progress + '%')
    }
  })
}

// 删除文件
const deletefile = function (fileid, mang_cd) {
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
    }
  })
}

// 获取文件后缀名
const getFileExt = function (filename) {
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
