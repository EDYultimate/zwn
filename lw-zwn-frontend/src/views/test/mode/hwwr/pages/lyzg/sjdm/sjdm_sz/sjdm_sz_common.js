//选择指标
function openZb() {
  layer.open({
    type: 2,
    title: '指标选择',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/common/zb/zb.jsp'
  })
}
