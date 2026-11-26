let pageSize = ''
$(document).ready(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - $('.searchDiv').height() - $('.M-box').height() - 150
  $('.conent').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  const date = new Date()
  const year = date.getFullYear() - 1
  $('#tyear').val(year)
  search()
})

function search(CurrentPage) {
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  const json = {
    yr: $('#tyear').val(),
    conc_org: $('#nm').val(),
    pageSize: pageSize,
    pageNo: CurrentPage
  }
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  jQuery.getJSON(basePath + 'jdjc/getXcTableList', json, function (result) {
    console.info(result)
    const data = result.page.list
    let tbodyHtml = ''
    const cdBox = ''
    for (let i = 0; i < data.length; i++) {
      const id = data[i].ID
      const IDTM = data[i].IDTM
      const XC_PER = data[i].XC_PER

      const rno = parseInt((CurrentPage - 1) * pageSize) + parseInt(i + 1)
      tbodyHtml += '<tr>'
      tbodyHtml += '<td>' + rno + '</td>'
      tbodyHtml +=
        "<td title='" +
        XC_PER +
        "' >" +
        XC_PER +
        '</td>' +
        "<td title='" +
        IDTM +
        "' >" +
        IDTM +
        '</td>'
      tbodyHtml +=
        '<td>' +
        "<div class='editdiv' title='编辑'  style='margin-left: 2px;' onclick='editRow(\"" +
        id +
        '")\'></div>' +
        "<div class='viewdiv' title='预览'  style='margin-left: 2px;' onclick='viewRow(\"" +
        id +
        '")\'></div>' +
        '</td>'
      tbodyHtml += '</tr>'
    }

    $('#Sztbody').html(tbodyHtml)
    $('.M-box').pagination({
      pageCount: result.page.pages, //初始化时总页数3页
      current: CurrentPage,
      callback: function (api) {
        search(api.getCurrent())
      }
    })
    $('.tolSpan').html('共' + result.page.total + '条')
    $('.M-box').show()
    //关闭遮罩层
    layer.close(index_load)
  })
}

function add() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '450px'],
    content: basePath + 'pages/rcgl/jdjc/dialog/add2.jsp'
  })
}
function addCheck() {
  layer.open({
    type: 2,
    title: '添加巡查',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['950px', '550px'],
    content: basePath + 'pages/rcgl/jdjc/checktmDialog/addCheckTmBase.jsp'
  })
}

function editRow(id) {
  const yr = $('#tyear').val()
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['950px', '550px'],
    content: basePath + 'pages/rcgl/jdjc/checktmDialog/addCheckTmBase.jsp?id=' + id + '&yr=' + yr
  })
}
function viewRow(id) {
  layer.open({
    type: 2,
    title: '文件',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '450px'],
    content: basePath + 'pages/rcgl/jdjc/dialog/openFile.jsp?id=' + id
  })
}
