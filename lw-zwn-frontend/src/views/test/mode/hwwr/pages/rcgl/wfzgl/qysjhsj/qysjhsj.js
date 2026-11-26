let pageSize
$(document).ready(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - $('.searchDiv').height() - $('.M-box').height() - 70
  $('#stable').css('height', tbHeight + 'px')
  //	    $(".stable").css("height",tbHeight+"px");
  pageSize = Math.floor(tbHeight / 90)
  search(1)
})

function search(CurrentPage) {
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  const json = {
    year: $('#tyear').val(),
    wrp_nm: $('#wrp_nm').val(),
    pageSize: pageSize,
    pageNo: CurrentPage
  }

  let str = '',
    sep = ''
  for (const i in json) {
    str += sep + i + '=' + json[i]
    sep = '&'
  }

  $.ajax({
    type: 'GET',
    url: basePath + 'qsys/getWpcQSYS?' + str,
    //        contentType: 'application/json;charset=UTF-8',
    async: true,
    success: function (data) {
      //        	console.info(data);
      makeTable(data.page, CurrentPage)
    }
  })
}
//编辑事件添加
function finished() {
  const trow = $('#stable tbody tr')
  // 操作

  const rowlength = trow.length

  for (let row = 0; row < rowlength; ++row) {
    const cell = $(trow[row]).children()[7]
    const id = $($(trow[row]).children()[0]).text()
    const tyear = $($(trow[row]).children()[2]).text()
    const wpc_cd = $($(trow[row]).children()[1]).text()
    if (!tyear && !wpc_cd) {
      continue
    }
    const str =
      "<div class='editdiv'  style='margin-left: calc(50% - 16px);' onclick='editRow(\"" +
      tyear +
      '", "' +
      wpc_cd +
      '", "' +
      id +
      '")\'></div>'
    $(cell).append(str)
  }
}

const options = [
  { id: '01', name: '接收材料' },
  { id: '02', name: '审查' },
  { id: '03', name: '计划批复' },
  { id: '04', name: '结束' }
]

function makeTable(data, CurrentPage) {
  const results = data.list
  var option = {
    // 表格样式
    tableClass: 'bbTable',
    // 是否含勾选框
    withCheckBox: false,
    colTitle: true,
    // 表头
    head: [
      {
        'data-field': 'id',
        display: false,
        name: 'id编码'
      },
      {
        'data-field': 'wpc_cd',
        display: false,
        name: '取水许可证代码'
      },
      {
        'data-field': 'tyear',
        name: '年度',
        widthParam: '80px'
      },
      {
        'data-field': 'wpc_sn',
        name: '取水许可证编号',
        widthParam: '200px'
      },
      {
        'data-field': 'wrp_nm',
        name: '取水权人'
      },
      {
        'data-field': 'conc_org',
        name: '监管单位'
      },
      {
        'data-field': 'ww',
        name: '许可量',
        widthParam: '100px'
      },
      {
        'data-field': 'op',
        name: '操作',
        widthParam: '60px'
      },
      {
        'data-field': 'rep_ww',
        name: '批复年度计划量',
        widthParam: '100px'
      },
      {
        'data-field': 'act_ww',
        name: '累计实际用水量',
        widthParam: '100px'
      },
      //            {
      ////                'display': false,
      //                'data-field': 'files',
      //                'name': '文件上传'
      //            },
      {
        'data-field': 'main_prob',
        name: '计划用水管理动态信息'
      }
    ],

    // 最大合并列单元格个数
    mergecolcellsize: 20,
    // 表格加载完毕事件
    finished: finished
  }

  const ctable = cgrid.instance('stable', option)

  for (const i in results) {
    const item = results[i]
    if (item.hasOwnProperty('typetimes') && item.typetimes) {
      const types = item.typetimes.split(',')
      let typetimes = ''
      let sepr = ''
      for (const j in options) {
        var option = options[j]
        typetimes += sepr + option.name + ':' + types[j]
        sepr = '<br>'
      }
      item.main_prob = typetimes
    }
  }

  ctable.genTable(results)
  $('.M-box').pagination({
    pageCount: data.pages, //初始化时总页数3页
    current: CurrentPage,
    callback: function (api) {
      search(api.getCurrent())
    }
  })
  $('.tolSpan').html('共' + data.total + '条')
  $('.M-box').show()
}

function editRow(tyear, wpc_cd, id) {
  // 750 640
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1068px', '570px'],
    content:
      basePath +
      'pages/rcgl/wfzgl/qysjhsj/dialog/add.jsp?wpc_cd=' +
      wpc_cd +
      '&tyear=' +
      tyear +
      '&id=' +
      id
    //        content: basePath+"pages/rcgl/wfzgl/qysjhsj/dialog/check.jsp?wpc_cd="+wpc_cd+"&tyear="+tyear
  })
}

function add() {
  const tyear = $('#tyear').val()
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1068px', '570px'],
    content: basePath + 'pages/rcgl/wfzgl/qysjhsj/dialog/add.jsp?tyear=' + tyear
  })
}
