$(document).ready(function () {
  const bodyheight = $(document.body).outerHeight(true)
  $('#tableDiv').css('height', bodyheight - 15 + 'px')
  search()
})

//页面初始化
function search() {
  let SztbodyStr = ''
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })

  jQuery.getJSON(
    basePath + '/jdjc/getProblemListByWpccd',
    { wpc_cd: wpc_cd, yr: yr, problem_cd: pid },
    function (data) {
      console.info(data)
      if (data != null && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          SztbodyStr +=
            '<tr>' +
            "<td rowspan='5'>" +
            (i + 1) +
            '</td>' +
            "<td>问题年份：</td><td title='" +
            isNull(data[i].BTM) +
            "'>" +
            isNull(data[i].BTM) +
            '</td>' +
            "<td>巡查日期：</td><td title='" +
            isNull(data[i].IDTM) +
            "'>" +
            isNull(data[i].IDTM) +
            '</td>' +
            '</tr>' +
            "<tr><td>主要问题：</td><td title='" +
            isNull(data[i].PROBLEM_NM) +
            "'>" +
            isNull(data[i].PROBLEM_NM) +
            '</td>' +
            "<td>是否完成整改：</td><td title='" +
            finishFormat(data[i].ISFINISH) +
            "'>" +
            finishFormat(data[i].ISFINISH) +
            ';' +
            isNull(data[i].ETM) +
            '</td></tr>' +
            "<tr><td>巡查人员：</td><td colspan='3' title='" +
            isNull(data[i].XC_PER) +
            "'>" +
            isNull(data[i].XC_PER) +
            '</td></tr>' +
            "<tr><td>问题说明：</td><td colspan='3' title='" +
            isNull(data[i].PROBLEM_EXPLAIN) +
            "'>" +
            isNull(data[i].PROBLEM_EXPLAIN) +
            '</td></tr>' +
            "<tr><td>整改要求：</td><td colspan='3' title='" +
            isNull(data[i].CHANGE_REQUEST) +
            "'>" +
            isNull(data[i].CHANGE_REQUEST) +
            '</td></tr>' +
            '</tr>'
        }
      }
      $('#table').empty().append(SztbodyStr)
      //关闭遮罩层
      layer.close(index_load)
    }
  )
}

function finishFormat(val) {
  if (val == '1') {
    return '是'
  } else if (val == '0') {
    return '否'
  }
  return '-'
}
