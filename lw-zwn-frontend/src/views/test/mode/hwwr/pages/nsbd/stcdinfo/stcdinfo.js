const param = {}
$(function () {
  //	var date = new Date();
  //	var year = date.getFullYear();
  //	$("#year").val(year);
  getYr()
})

function getYr() {
  $.ajax({
    url: basePath + '/kfly/nsbd/getRouteYr',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      if (data.length > 0) {
        $('#year').val(data[0].YR)
      }
      getSel()
    }
  })
}
function getSel() {
  $.ajax({
    url: basePath + '/kfly/nsbd/getRouteList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      let html = ''
      for (let i = 0; i < data.length; i++) {
        html += '<option value="' + data[i].CD + '">' + data[i].NM + '</option>'
      }
      $('#fw').html(html)
      ini()
    }
  })
}

function ini() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#t_year').text(
    $('#fw').find('option:selected').text() +
      $('#year').val() +
      $('#type').find('option:selected').text()
  )
  param.cd = $('#fw').val()
  param.year = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/kfly/nsbd/getStcdInfo',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      const data = result.list

      let tbodyhtml = ''
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          tbodyhtml += '<tr><td>' + data[i].DECD + '</td>'
          tbodyhtml += '<td>' + isNull(data[i].NM) + '</td>'
          tbodyhtml += '<td>' + isNull(data[i].ADDVNM) + '</td>'
          tbodyhtml += '<td>' + isNull(data[i].YEAR) + '</td>'
          tbodyhtml += '<td>' + gsFormat(data[i].STATE) + '</td>'
          tbodyhtml += '<td>' + isNull(data[i].BGTM) + '</td>'
          tbodyhtml +=
            '<td>' +
            '<a href="javascript:;" onclick=editInfo(\'' +
            isNull(data[i].DECD) +
            "','" +
            isNull(data[i].YEAR) +
            "')>修改</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            '<a href="javascript:;" onclick="del(\'' +
            isNull(data[i].DECD) +
            "','" +
            isNull(data[i].YEAR) +
            '\')">删除</a></td></tr>'
        }
      } else {
        for (var i = 0; i < 8; i++) {
          tbodyhtml += '<tr><td></td>'
          tbodyhtml += '<td></td>'
          tbodyhtml += '<td></td>'
          tbodyhtml += '<td></td>'
          tbodyhtml += '<td></td>'
          tbodyhtml += '<td></td>'
          tbodyhtml += '<td></td></tr>'
        }
      }
      $('#tbody').html(tbodyhtml)

      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

function gsFormat(val) {
  switch (val) {
    case 'S':
      return '收水'
    case 'G':
      return '收水'
    default:
      return '-'
  }
}

function newS() {
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '400px'],
    content: basePath + '/pages/nsbd/stcdinfo/newStcd.jsp'
  })
}
function editInfo(decd, yr) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '400px'],
    content: basePath + '/pages/nsbd/stcdinfo/editStcd.jsp?decd=' + decd + '&yr=' + yr
  })
}

function del(cd, yr) {
  const msg = '您真的确定要删除该信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.yr = yr
  pasrse.cd = cd
  console.info(pasrse)
  if (confirm(msg) == true) {
    $.ajax({
      url: basePath + '/kfly/nsbd/deleteStcdInfo',
      data: pasrse,
      dataType: 'json',
      type: 'post',
      success: function (data) {
        if (data != null && data.STATUS == 'Y') {
          alert('删除成功！')
        } else {
          alert('删除失败！')
        }
        ini()
      }
    })
  }
}
