let flagNum = 0
const selHtml = ''

let num = 0

const tpmap = new Map() //保存上传
const param = {}
const bbTpPath = null //路径
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#yr').val(year)
  const uid = getUid()
  upload1('file1', '' + uid + '') //文件上传
  $('#fileuid').val(uid)
})

function saveDbBase() {
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

  /* param.yr=$("#yr").val();
    param.ad_cd=$("#ad_cd").val();
	param.fileid=$("#fileuid").val();
    param.id="";*/

  const jsonData = []
  const id = UUID()
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
    jsonitem.yr = $('#yr').val()
    jsonitem.ad_cd = $('#ad_cd').val()
    jsonitem.fileid = $('#fileuid').val()
    jsonitem.id = id
    jsonData.push(jsonitem)
  })

  param.setList = JSON.stringify(jsonData)

  $.ajax({
    url: basePath + '/jyys/ywsj/saveYsdeWtqdFileInfo',
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

  /*  jQuery.getJSON(basePath+"/jyys/ywsj/saveYsdeWtqdFileInfo",param,function(data){
    	alert(data.info);
    	parent.search(1);
    	parent.layer.closeAll();
	});*/
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

//问题模块追加模板
function addProblemTr() {
  num++
  const headid = 'prblemModelTableId' + flagNum
  flagNum++
  let problemTrHtml =
    "<table id='prblemModelTableId" + flagNum + '\'  class="bbTable problemTable">'
  problemTrHtml += '<tbody><tr>'
  /* problemTrHtml+="<td rowspan='3'>问题"+num+"</td>";*/
  problemTrHtml += '<td>方面</td>'
  problemTrHtml +=
    '<td>' +
    selHtml +
    /* "<div style='font-weight: bold;'>问题说明：</div>" +*/
    '<textarea rows="4" cols="80" id="" name=\'PROBLEM\' class="problemParam"></textarea>' +
    "<input class=\"problemParam\" name='PROBLEM_CD'  style='display:none'>" +
    '</td>'
  problemTrHtml +=
    "<td rowspan='3'><div style='cursor:pointer' onclick=\"delProblemTable('prblemModelTableId" +
    flagNum +
    '\')">删除</div></td>'
  ;('</tr>')
  problemTrHtml += '<tr><td>内容</td>'
  problemTrHtml +=
    '<td style=\'width:50%\'><textarea rows="4" cols="80" id="" name=\'CONTENT\' class="problemParam"></textarea></td>'
  problemTrHtml += '</tr>'
  problemTrHtml += '<tr>'
  problemTrHtml += '<td>整改落实情况</td>'
  problemTrHtml +=
    "<td style='width:70%'>" +
    /* "<div>是否完成：<select name='ISFINISH' class=\"problemParam\">" +
        "<option value='0'>否</option><option value='1'>是</option></select></div>" +*/
    '<textarea name=\'CORRECTION\' class="problemParam" rows="4" cols="80"></textarea></td>'
  problemTrHtml += '</tr>'
  problemTrHtml += '</tbody></table>'

  $('#midDiv').before(problemTrHtml)
}

function delProblemTable(pid) {
  num--
  $('#' + pid).remove()
  /*$.ajax ({
        type: "GET",
        url: basePath+'jdjc/delProblemItem?pid='+pid,
        contentType: 'application/json',
        async: true,
        success: function (data) {
            $("#"+pid).remove();
            if(data.success=='true'){
                console.info("删除成功");
            }else{
                console.info("删除失败");
            }
        }
    });*/
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
