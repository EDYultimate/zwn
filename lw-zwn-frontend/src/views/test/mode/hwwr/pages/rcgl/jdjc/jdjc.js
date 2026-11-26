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
  //sql排序依据：以问题编号和许可证编码为组， 根据开始年份和时间戳两个条件降序排列，取每组第一条数据集
  //sql查询条件：(未解决 and 时间<='查询年份') or (已解决 and 处理完成时间='查询年份') or (问题年份<='查询年份' and 处理完成时间>'查询年份')
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
  jQuery.getJSON(basePath + 'jdjc/getWPCTableList', json, function (result) {
    console.info(result)
    const data = result.page.list
    let tbodyHtml = ''
    let cdBox = ''
    for (let i = 0; i < data.length; i++) {
      const wpc_cd = data[i].WPC_CD
      const wpc_sn = data[i].WPC_SN
      const wrp_nm = data[i].WRP_NM
      const conc_org = data[i].CONC_ORG
      //        		var ad_nm=data[i].AD_NM;
      const tm = isNull(data[i].BTM)
      const xctm = isNull(data[i].IDTM)
      const etm = isNull(data[i].ETM)
      const problem_nm = isNull(data[i].PROBLEM_NM)
      const COLN = isNull(data[i].COLN)
      let num = data[i].NUM

      if (i == 0 && parseInt(num) > 1) {
        console.info(COLN)
        num = num - COLN + 1
      }
      const rno = parseInt((CurrentPage - 1) * pageSize) + parseInt(i + 1)
      tbodyHtml += '<tr>'
      tbodyHtml += '<td>' + rno + '</td>'
      if (wpc_cd != cdBox) {
        tbodyHtml += "<td title='" + wpc_sn + "' rowspan=" + num + '>' + wpc_sn + '</td>'
        tbodyHtml +=
          "<td title='" +
          conc_org +
          "' rowspan=" +
          num +
          '>' +
          conc_org +
          '</td>' +
          "<td title='" +
          wrp_nm +
          "' rowspan=" +
          num +
          '>' +
          wrp_nm +
          '</td>'

        tbodyHtml +=
          "<td  title='" +
          problem_nm +
          "'>" +
          problem_nm +
          '</td>' +
          "<td title='" +
          xctm +
          "'>" +
          xctm +
          '</td>' +
          "<td title='" +
          tm +
          "'>" +
          tm +
          '</td>'

        //        					"<td title='"+ad_nm+"' rowspan="+num+">"+ad_nm+"</td>";
        tbodyHtml +=
          '<td rowspan=' +
          num +
          '>' +
          "<div class='editdiv' title='编辑'  style='margin-left: 2px;' onclick='editRow(\"" +
          wpc_cd +
          '")\'></div>' +
          //        					"<div class='viewdiv' title='预览'  style='margin-left: 2px;' onclick='viewRow(\""+wpc_cd+"\")'></div>" +
          '</td>'
        tbodyHtml += '</tr>'
      } else {
        tbodyHtml += '<td>' + problem_nm + '</td>'
        tbodyHtml += "<td title='" + xctm + "'>" + xctm + '</td>'
        tbodyHtml += "<td title='" + tm + "'>" + tm + '</td>'
        tbodyHtml += '</tr>'
      }

      cdBox = wpc_cd
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

function finished() {
  const trow = $('#stable tbody tr')
  // 操作
  const rowlength = trow.length
  const collength = $(trow[0]).children().length - 1

  for (let row = 0; row < rowlength; ++row) {
    const cell = $(trow[row]).children()[collength]
    const id = $($(trow[row]).children()[0]).text()
    const c_id = $($(trow[row]).children()[1]).text()
    if (!id && !c_id) {
      continue
    }
    const str =
      "<div class='editdiv'  style='margin-left: calc(50% - 16px);' onclick='editRow(\"" +
      id +
      '")\'></div>'
    $(cell).append(str)
  }
}

function makeTable(results) {
  const option = {
    // 表格样式
    tableClass: 'bbTable',
    // 是否含勾选框
    withCheckBox: false,
    // 表头
    head: [
      {
        'data-field': 'CONC_ID',
        display: false,
        name: 'conc_id'
      },
      {
        'data-field': 'yr',
        name: '年份',
        mergeRow: true
      },
      {
        'data-field': 'WPC_SN',
        name: '取水许可证',
        mergeRow: true
      },
      {
        'data-field': 'WRP_NM',
        name: '取水权人'
      },
      {
        'data-field': 'CONC_ORG',
        name: '监管单位'
      },
      {
        'data-field': 'ad_nm',
        name: '行政区名称'
      },
      {
        'data-field': 'op',
        name: '操作'
      }
    ],

    // 最大合并列单元格个数
    mergecolcellsize: 20,
    // 表格加载完毕事件
    finished: finished
  }

  const ctable = cgrid.instance('stable', option)
  ctable.genTable(results)
}

function add() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    closeBtn: true,
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
    closeBtn: true,
    maxmin: false, //开启最大化最小化按钮
    area: ['930px', '600px'],
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
    closeBtn: true,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '550px'],
    content: basePath + 'pages/rcgl/jdjc/checktmDialog/editProblemInfo.jsp?id=' + id + '&yr=' + yr
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
