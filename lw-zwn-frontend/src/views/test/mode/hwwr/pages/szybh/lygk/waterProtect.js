function openDetail(val) {
  let url = ''
  let nm = ''
  if (val == '1') {
    url = 'pages/szybh/lygk/dialog/ly_dialog.jsp'
    nm = '流域综述'
  }
  if (val == '2') {
    url = 'pages/szybh/lygk/dialog/hl_dialog.jsp'
    nm = '河流水系'
  }

  parent.layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1078px', '600px'],
    content: basePath + url
  })
}
