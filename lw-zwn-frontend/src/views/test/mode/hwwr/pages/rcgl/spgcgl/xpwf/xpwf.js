$(document).ready(function () {
  scrollEvent()

  /*makecontent();*/
  maketable()
})

function makeEmptyData() {
  const json = []

  const tbodyheight = $('.conent').height() - $('#table thead').height()
  const N = Math.floor(tbodyheight / 41)

  for (let i = 0; i < N; ++i) {
    const row = {
      id: '',
      apply_nm: '',
      ad_nm: '',
      wrz_nm: '',
      th_level: '',
      int_nm: '',
      int_addr_d: '',
      int_addr_lgtd: '',
      int_addr_lttd: '',
      chk_int_met: '',
      wf_nm: '',
      ww: '',
      int_use: '',
      relevant_norm: '',
      max_q: '',
      irr_a: '',
      rw_addr: '',
      rw_addr_lgtd: '',
      rw_addr_lttd: '',
      rw_w: '',
      rw_wq_req: '',
      is_wr_wra: '',
      wr_wra_nm: '',
      wr_wra_org: '',
      deter_tm: '',
      reply_doc: ''
    }
    json.push(row)
  }
  return json
}

function finished() {
  $('th[data-field="type_nm"]').width('200px')

  // 操作
  const rowlength = $('tr').length
  const collength = $($('tr')[0]).children().length - 1

  for (let row = 1; row < rowlength; ++row) {
    /*var cell = $($('tr')[row]).children()[collength];
        var infos = $($('tr')[row]).children()[collength - 1];*/
    const cell = $($('tr')[row]).children()[5]
    const infos = $($('tr')[row]).children()[4]
    const id = $($($('tr')[row]).children()[0]).text()
    if (!id) {
      continue
    }
    const rdata = ctable.data[row - 1]
    var types = ''
    var spe = ''
    if (rdata.types && rdata.types.length > 0) {
      rdata.types.forEach(function (k) {
        const s = spe + k.type_nm + ' ' + k.tm
        spe = '<br>'
        types += s
      })
    }
    $(infos).empty().append(types)
    const str =
      "<div class='editdiv'  style='margin-left: calc(50% - 16px);' onclick='editRow(\"" +
      id +
      '")\'></div>'
    $(cell).append(str)

    addPositionRel(2)
    addPositionRel(3)
    addPositionRel(5)
    addPositionRel(6)
    $($('#table th')[1]).css('z-index', 2)
    $($('#table th')[2]).css('z-index', 2)
    $($('#table th')[4]).css('z-index', 2)
    $($('#table th')[5]).css('z-index', 2)
  }
}
function makecontent() {
  $.ajax({
    type: 'GET',
    url: basePath + 'spgc/getWpcWF?',
    contentType: 'application/json',
    async: true,
    success: function (data) {
      let results = data
      let isEmpty = false

      let fazhengshenqing = 0
      let gongchengheyan = 0
      let zhizheng = 0

      if (!results || results.length < 1) {
        results = makeEmptyData()
        isEmpty = true
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      if (!isEmpty && results && results.length > 0) {
        for (let i = 0; i < results.length; ++i) {
          /*  (function(results, it) {
                        results[i].no = 1 + it;
                    })(results, i);*/

          if (results[i].type_id == 8) {
            fazhengshenqing += 1
          } else if (results[i].type_id == 9) {
            gongchengheyan += 1
          } else if (results[i].type_id == 10) {
            zhizheng += 1
          }
        }
      }

      ctable.genTable(results)

      /*$('#total').html(results.length);*/
      $('#fazhengshenqing').html(fazhengshenqing)
      $('#gongchengheyan').html(gongchengheyan)
      $('#zhizheng').html(zhizheng)
    }
  })
}

function maketable() {
  const json = {
    apply_nm: $('#apply_nm').val(),
    ad_nm: $('#ad_nm').val(),
    wrz_nm: $('#wrz_nm').val(),
    year: $('#year').val(),
    type_id: $('#type_id').val(),
    int_use: $('#int_use').val()
  }

  let str = '',
    sep = ''
  for (const i in json) {
    str += sep + i + '=' + json[i]
    sep = '&'
  }

  $.ajax({
    type: 'GET',
    url: basePath + 'spgc/getWpcWF?' + str,
    contentType: 'application/json',
    async: true,
    success: function (data) {
      let results = data
      let isEmpty = false

      let fazhengshenqing = 0
      let gongchengheyan = 0
      let zhizheng = 0

      if (!results || results.length < 1) {
        results = makeEmptyData()
        isEmpty = true
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      if (!isEmpty && results && results.length > 0) {
        for (var i = 0; i < results.length; ++i) {
          ;(function (results, it) {
            results[i].no = 1 + it
          })(results, i)

          if (results[i].type_id == 8) {
            fazhengshenqing += 1
          } else if (results[i].type_id == 9) {
            gongchengheyan += 1
          } else if (results[i].type_id == 10) {
            zhizheng += 1
          }
        }
      }

      ctable.genTable(results)

      $('#fazhengshenqing').html(fazhengshenqing)
      $('#gongchengheyan').html(gongchengheyan)
      $('#zhizheng').html(zhizheng)
    }
  })
}

function add() {
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['800px', '520px'],
    content: basePath + 'pages/rcgl/spgcgl/xpwf/dialog/add.jsp'
  })
}

function editRow(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['800px', '520px'],
    content: basePath + 'pages/rcgl/spgcgl/xpwf/dialog/add.jsp?id=' + id
  })
}

function addPositionRel(num) {
  $('#table tr th:nth-child(' + num + ')').css('position', 'relative')
  // $("#table tr th:nth-child("+num+")").addClass("fixtitle");
  $('#table tr td:nth-child(' + num + ')').css('position', 'relative')
  // $("#table tr td:nth-child("+num+")").addClass("fixtitle");
  $('#table tr td:nth-child(' + num + ')').css('z-index', 1)
  // $("#table tr td:nth-child("+num+")").css('overflow-y', 'hidden');
  $('#table th').css('position', 'relative')
}

function setFixedCol(num, x) {
  $('#table tr th:nth-child(' + num + ')').css('left', x)
  $('#table tr td:nth-child(' + num + ')').css('left', x)
}

function setFixedTitle(y) {
  $('#table th').css('top', y)
}

////////
//监听页面滚动事件
function scrollEvent() {
  $('.conent').scroll(function (e) {
    // clearTimeout(timer);
    // var timer = setTimeout(function () {
    scrollFunc()
    if (scrollDirection > 0) {
      setFixedTitle(scrollAction.y)
    } else if (scrollDirection < 0) {
      setFixedCol(2, scrollAction.x)
      setFixedCol(3, scrollAction.x)
      setFixedCol(5, scrollAction.x)
      setFixedCol(6, scrollAction.x)
    }
    // }, 10)
  })
}

var scrollAction = { x: undefined, y: undefined },
  scrollDirection
function scrollFunc() {
  if (typeof scrollAction.x === undefined) {
    scrollAction.x = $('.conent').scrollLeft()
    scrollAction.y = $('.conent').scrollTop()
  }
  const diffX = scrollAction.x - $('.conent').scrollLeft()
  const diffY = scrollAction.y - $('.conent').scrollTop()
  if (diffX < 0) {
    // Scroll right
    scrollDirection = -2 //right
  } else if (diffX > 0) {
    // Scroll left
    scrollDirection = -1 // left
  } else if (diffY < 0) {
    // Scroll down
    scrollDirection = 1 //down
  } else if (diffY > 0) {
    // Scroll up
    scrollDirection = 2 //up
  } else {
    scrollDirection = 0 // First scroll event
  }
  scrollAction.x = $('.conent').scrollLeft()
  scrollAction.y = $('.conent').scrollTop()
}
