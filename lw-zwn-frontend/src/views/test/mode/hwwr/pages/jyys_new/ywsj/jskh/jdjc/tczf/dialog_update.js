let flagNum = 0
const selHtml = ''

let param = {}
let uid = ''
$(function () {
  buildForm(id)
  getProblem(id)
})

let workcd

function buildForm(id) {
  let yj_fileNames = '' //用于记录原先已有的附件

  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + '/jyys/ywsj/getJskhTczfEditInfo.action', param, function (result) {
    const data = result.list
    $('#ad_cd').val(isNull(data[0].AD_CD))
    $('#yr').val(isNull(data[0].YR))
    uid = data[0].FILE_ID
    if (data[0].FILE_ID !== '' && data[0].FILEID != null) {
      let i = 0
      let trTable = ''
      if (data[0].FILE_ID !== '' && data[0].FILE_ID != null) {
        for (i = 0; i < data.length; i++) {
          trTable +=
            "<tr id='fileYj" +
            i +
            "' class='fileYj'><td class='textalign' colspan='2'>" +
            isNull(data[i].FILE_NM) +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=deleteManyFile('fileYj','" +
            id +
            "','" +
            isNull(data[i].FILE_ID) +
            "','" +
            isNull(data[i].FILE_NM) +
            "','" +
            i +
            "')>删除</a></td><tr>"
          yj_fileNames = yj_fileNames + isNull(data[i].FILE_NM) + ','
        }
        if (yj_fileNames != null) {
          yj_fileNames = yj_fileNames.substring(0, yj_fileNames.length - 1)
        }
        $('#file_tr').after(trTable)
      }
      upload1('file1', '' + data[0].FILEID + '', '' + data[0].FILE_NM + '') //
    }

    /* var problemTrHtml1="";
        for(var i=0;i<data.length;i++){

            var pid=data[i].PROBLEM_CD;

            problemTrHtml1+="<table id='"+pid+"'  class=\"bbTable problemTable\">";
//                	    problemTrHtml1+="<input class=\"problemParam\" name='PROBLEM_CD'  display=\"none\">";
            problemTrHtml1+="<tbody><tr>";
            problemTrHtml1+="<td>方面</td>";
            problemTrHtml1+="<td>"+selHtml+"" +
               /!* "<div style='font-weight: bold;'>问题说明：</div>" +*!/
                "<textarea rows=\"4\" cols=\"80\" id=\"\" name='PROBLEM' class=\"problemParam\"></textarea>"+
                "<input class=\"problemParam\" name='PROBLEM_CD'  style='display:none'>"+
                "</td>";
            problemTrHtml1+="<td rowspan='3'><div style='cursor:pointer' onclick=\"delProblemTable('"+pid+"')\">删除</div></td></tr>";
            problemTrHtml1+="<tr><td>内容</td>";
            problemTrHtml1+="<td style='width:50%'><textarea rows=\"4\" cols=\"80\" id=\"\" name='CONTENT' class=\"problemParam\"></textarea></td>";
            problemTrHtml1+="</tr>";
            problemTrHtml1+="<tr>";
            problemTrHtml1+="<td>整改落实情况</td>";
            problemTrHtml1+="<td >" +
             /!*   "<div>是否完成：<select name='ISFINISH' class=\"problemParam\">" +
                "<option value='0'>否</option><option value='1'>是</option></select></div>" +*!/
                "<textarea name='CORRECTION' class=\"problemParam\" rows=\"4\" cols=\"80\"></textarea></td>";
            problemTrHtml1+="</tr>";
            problemTrHtml1+="</tbody></table>";
        }
        $("#midDiv").before(problemTrHtml1);

        for(var i=0;i<data.length;i++){
            var pid=data[i].PROBLEM_CD;
            var problem=data[i].PROBLEM;
            var content=data[i].CONTENT;
            var correction=data[i].CORRECTION;

            $("#"+pid+"").find("[name='PROBLEM_CD']").val(pid);
            $("#"+pid+"").find("[name='PROBLEM']").val(problem);
            $("#"+pid+"").find("[name='CONTENT']").val(content);
            $("#"+pid+"").find("[name='CORRECTION']").val(correction);
        }*/

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id, uid)
    })
  })
}

function getProblem(id) {
  jQuery.getJSON(basePath + '/jyys/ywsj/getJskhTczfProInfo.action', param, function (result) {
    const data = result.list

    let problemTrHtml1 = ''
    for (var i = 0; i < data.length; i++) {
      var pid = data[i].WORK_CD

      problemTrHtml1 += "<table id='" + pid + '\'  class="bbTable problemTable">'
      //                	    problemTrHtml1+="<input class=\"problemParam\" name='PROBLEM_CD'  display=\"none\">";
      problemTrHtml1 += '<tbody><tr>'
      problemTrHtml1 += '<td>工作方面</td>'
      problemTrHtml1 +=
        '<td>' +
        selHtml +
        '<textarea rows="4" cols="80" id="" name=\'WORK\' class="problemParam"></textarea>' +
        "<input class=\"problemParam\" name='WORK_CD'  style='display:none'>" +
        '</td>'
      problemTrHtml1 +=
        "<td rowspan='2'><div style='cursor:pointer' onclick=\"delProblemTable('" +
        pid +
        '\')">删除</div></td></tr>'
      problemTrHtml1 += '<tr><td>突出做法</td>'
      problemTrHtml1 +=
        '<td style=\'width:50%\'><textarea rows="4" cols="80" id="" name=\'PRACTICE\' class="problemParam"></textarea></td>'
      problemTrHtml1 += '</tr>'
      problemTrHtml1 += '</tbody></table>'
    }
    $('#midDiv').before(problemTrHtml1)

    for (var i = 0; i < data.length; i++) {
      var pid = data[i].WORK_CD
      const work = data[i].WORK
      const practice = data[i].PRACTICE

      $('#' + pid + '')
        .find("[name='WORK_CD']")
        .val(pid)
      $('#' + pid + '')
        .find("[name='WORK']")
        .val(work)
      $('#' + pid + '')
        .find("[name='PRACTICE']")
        .val(practice)
    }

    workcd = data[data.length - 1].WORK_CD
    console.log(workcd)
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, uid) {
  const param = {}

  /*	var fileuid = $("#fileuid").val();
            if(fileuid==null||fileuid==''){
                alert("请上传文件");
                return;
            }*/
  const yr = $('#yr').val()
  if (yr == null || yr == '') {
    alert('请选择年份')
    return
  }

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
      $(this).find("[name='WORK_CD']").val() == '' &&
      $(this).find("[name='WORK_CD']").val() == ''
    ) {
      // jsonitem.WORK_CD = UUID();
      jsonitem.WORK_CD = getId().toString()
    }
    jsonitem.yr = $('#yr').val()
    jsonitem.ad_cd = $('#ad_cd').val()
    jsonitem.fileid = uid
    jsonitem.id = id
    jsonData.push(jsonitem)
  })

  param.setList = JSON.stringify(jsonData)

  debugger

  $.ajax({
    url: basePath + '/jyys/ywsj/saveJskhTczfFileInfo',
    type: 'POST',
    data: param,
    /*  contentType: "application/json; charset=utf-8",
          dataType: "json",*/
    success: function (data) {
      data = eval('(' + data + ')')
      alert(data.info)
      parent.search(1)
      parent.layer.closeAll()
    }
  })
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

//问题模块追加模板
function addProblemTr() {
  const headid = 'prblemModelTableId' + flagNum
  flagNum++
  let problemTrHtml =
    "<table id='prblemModelTableId" + flagNum + '\'  class="bbTable problemTable">'
  problemTrHtml += '<tbody><tr>'
  problemTrHtml += '<td>工作方面</td>'
  problemTrHtml +=
    '<td>' +
    selHtml +
    '<textarea rows="4" cols="80" id="" name=\'WORK\' class="problemParam"></textarea>' +
    "<input class=\"problemParam\" name='WORK_CD'  style='display:none'>" +
    '</td>'
  problemTrHtml +=
    "<td rowspan='2'><div style='cursor:pointer' onclick=\"delProblemTable('prblemModelTableId" +
    flagNum +
    '\')">删除</div></td>'
  ;('</tr>')
  problemTrHtml += '<tr><td>突出做法</td>'
  problemTrHtml +=
    '<td style=\'width:50%\'><textarea rows="4" cols="80" id="" name=\'PRACTICE\' class="problemParam"></textarea></td>'
  problemTrHtml += '</tr>'
  problemTrHtml += '</tbody></table>'

  $('#midDiv').before(problemTrHtml)
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

function delProblemTable(pid) {
  $('#' + pid).remove()
}

function getId() {
  let i = workcd
  return ++i
}
