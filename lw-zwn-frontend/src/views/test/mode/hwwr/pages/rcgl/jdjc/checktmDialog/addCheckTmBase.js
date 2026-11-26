const selHtml = ''
const wpc_obj = {
  wpc_cd: '',
  wpc_sn: '',
  wrp_nm: '',
  conc_org: '',
  ad_nm: ''
}
let uuid = ''

$(document).ready(function () {
  if (id == null || id == '') {
    uuid = UUID() //初始化就生成此次巡查的主键UUID
  } else {
    uuid = id
  }
  initData()
})
let flagNum = 0

//弹框里选择取水许可证的同时，生成对应的行数据
function addWpcTr(wpc_cd, wpc_sn, wrp_nm, INT_NM, conc_org, flag) {
  if ($('#' + wpc_cd).length > 0) {
    alert('证件已存在')
    return
  }
  flagNum++
  const headid = 'wpcModelTableId' + flagNum

  let problemTrHtml = "<tr id='" + wpc_cd + "' >"
  problemTrHtml += '<td>' + wpc_sn + '</td>'
  problemTrHtml += '<td>' + INT_NM + '</td>'
  problemTrHtml += '<td>' + wrp_nm + '</td>'
  if (flag == 1) {
    problemTrHtml +=
      "<td><span class='paramFlag' flag='1' style='color:green;cursor:pointer' " +
      "id='" +
      wpc_cd +
      "sub' onclick=\"problemPage(\'" +
      conc_org +
      "','" +
      wpc_sn +
      "','" +
      wpc_cd +
      "','" +
      wrp_nm +
      '\')">已填报</span>'
    problemTrHtml += '</td>'
  } else {
    problemTrHtml +=
      "<td><span class='paramFlag' flag='0' style='color:blue;cursor:pointer' " +
      "id='" +
      wpc_cd +
      "sub' onclick=\"problemPage(\'" +
      conc_org +
      "','" +
      wpc_sn +
      "','" +
      wpc_cd +
      "','" +
      wrp_nm +
      '\')">填报</span>&nbsp;&nbsp;&nbsp;&nbsp;'
    problemTrHtml +=
      "<span style='color:red;cursor:pointer' id='" +
      wpc_cd +
      "del' onclick=\"delWpcTr(\'" +
      wpc_cd +
      '\')">删除</span></td>'
  }
  problemTrHtml += '</tr>'
  $('#wpcListDiv').append(problemTrHtml)
}

//删除取水许可证行
function delWpcTr(wpc_cd) {
  $('#' + wpc_cd).remove()
}

//弹出框---取水许可证列表页
function wiuPage() {
  layer.open({
    type: 2,
    title: '取水许可证选择',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['650px', '400px'],
    content: basePath + 'pages/rcgl/jdjc/checktmDialog/wiu.jsp'
  })
}

//弹出框---问题详细页
function problemPage(conc_org, wpc_sn, wpc_cd, wrp_nm, handFlag) {
  const flag = $('#' + wpc_cd + 'sub').attr('flag')
  if (flag == 1) {
    handFlag = 'edit'
  } else {
    handFlag = 'add'
  }
  layer.open({
    type: 2,
    title: '问题填报',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['900px', '450px'],
    content:
      basePath +
      'pages/rcgl/jdjc/checktmDialog/problemInfo.jsp?pid=' +
      uuid +
      '&wpc_cd=' +
      wpc_cd +
      '&handFlag=' +
      handFlag
  })
}

//保存数据
function saveXcBase() {
  if (isStrEmpty($('#tm').val())) {
    alert('巡查时间不能为空')
    return
  }
  if (isStrEmpty($('#xc_per').val())) {
    alert('巡查人员不能为空')
    return
  }

  const wpcHtml = $('#wpcListDiv').html()
  if (wpcHtml.length < 10) {
    alert('请选择取水许可证')
    return
  }
  let b = 0
  $('.paramFlag').each(function (i, item) {
    const flag = $(this).attr('flag')
    if (flag == '0') {
      alert('还有未填报的取水许可证')
      b = 1
      return false //跳出循环
    }
  })
  if (b == 1) {
    return
  }

  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })

  const param = { idtm: $('#tm').val(), xc_per: $('#xc_per').val(), id: uuid }
  jQuery.getJSON(basePath + '/jdjc/saveProblemXcBaseInfo', param, function (result) {
    alert(result.info)
    if (result.info == '保存成功') {
      parent.search()
      parent.layer.closeAll()
    }
  })
}

function initData() {
  const url = basePath + 'jdjc/getXcBaseList'

  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  const json = {
    id: id
  }

  jQuery.getJSON(url, json, function (result) {
    console.info(result)

    if (result.length > 0) {
      $('#tm').val(isNull(result[0].IDTM))
      $('#xc_per').val(isNull(result[0].XC_PER))
      for (let i = 0; i < result.length; i++) {
        const wpc_cd = result[i].WPC_CD
        const wpc_sn = result[i].WPC_SN
        const wrp_nm = isNull(result[i].WRP_NM)
        const INT_NM = isNull(result[i].INT_NM)
        const conc_org = isNull(result[i].CONC_ORG)
        addWpcTr(wpc_cd, wpc_sn, wrp_nm, INT_NM, conc_org, 1)
      }
    }
    //关闭遮罩层
    layer.close(index_load)
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

  if (flag) {
    if ($('.problemTable').length == 0) {
      alert('请填写主要问题模块')
      return
    }

    debugger

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
