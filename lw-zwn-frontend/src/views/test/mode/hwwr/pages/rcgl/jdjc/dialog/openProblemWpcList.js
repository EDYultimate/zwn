$(document).ready(function () {
  const bodyheight = $(document.body).outerHeight(true)
  //	var tbHeight = bodyheight-$(".searchDiv").height();
  $('#tableDiv').css('height', bodyheight + 'px')
  search()
})

//页面初始化
function search() {
  let SztbodyStr = ''
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  jQuery.getJSON(basePath + '/jdjc/getHaveProblemWpcList', { pid: pid, yr: yr }, function (data) {
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        SztbodyStr +=
          '<tr>' +
          '<td>' +
          (i + 1) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WPC_SN) +
          "'>" +
          isNull(data[i].WPC_SN) +
          '</td>' +
          "<td title='" +
          isNull(data[i].WRP_NM) +
          "'>" +
          isNull(data[i].WRP_NM) +
          '</td>' +
          //						"<td title='"+data[i].WPC_SN+"'>"+data[i].CONC_ORG+"</td>" +
          //						"<td title='"+data[i].WPC_SN+"'>"+data[i].AD_NM+"</td>" +
          "<td style='color:blue' onclick=\"openDetial('" +
          data[i].WPC_CD +
          "')\"'>详情</td>" +
          '</tr>'
      }
    }
    $('#Sztbody').empty().append(SztbodyStr)
    //关闭遮罩层
    layer.close(index_load)
  })
}

function openDetial(wpc_cd) {
  parent.layer.open({
    type: 2,
    title: '问题详情',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['700px', '500px'],
    content:
      basePath +
      'pages/rcgl/jdjc/dialog/detialProblemByWpc.js.jsp?wpc_cd=' +
      wpc_cd +
      '&yr=' +
      yr +
      '&pid=' +
      pid
  })
}
