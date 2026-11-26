let myChart
$(document).ready(function () {
  scrollEvent()

  const options = {
    再生水矿坑排水: '再生水矿坑排水',
    地下水: '地下水',
    '地下水（矿坑排水）': '地下水（矿坑排水）',
    地表水: '地表水',
    地表水地下水: '地表水地下水',
    '地表水（再生水）': '地表水（再生水）',
    '浅层地下水（傍河取水）': '浅层地下水（傍河取水）'
  }

  $('#wf_nm').mselect(options, [])
  makecontent()
  maketable()
})

function makeEmptyData() {
  const json = []
  // var row = {
  // 		APPR_DT: "",APPR_ORG_CD: "",APP_ORG_NM: "",CERT_COND: "",CERT_NM: "",CERT_PRT_CD: "",CHK_INT_MET: "",CHK_SOUR_TP: "",
  // 		DRAW_DT: "",DRAW_STAFF: "",INT_ADDR: "",INT_BD: "",INT_DL: "",INT_USE: "",LR_NM: "",MAN_ORG_CD: "",MAN_ORG_NM: "",
  // 		RW_ADDR: "",RW_TP: "",RW_W: "",RW_WQ_REQ: "",TYEAR: "",WIU_CD: "",WIU_NM: "",WPC_CD: "",WPC_SN: "",WRP_NM: "",WW: ""
  // }
  // for (var i=0; i<8; ++i) {
  // 	json.push(row);
  // }
  return json
}

function finished() {
  $('.conent').height($(window).innerHeight() - $('.searchDiv').innerHeight() - 12 - 40)

  // 操作
  const rowlength = $('tr').length
  const collength = $($('tr')[0]).children().length - 1

  for (let row = 1; row < rowlength; ++row) {
    //var cell = $($('tr')[row]).children()[collength-1];
    const cell = $($('tr')[row]).children()[6]
    const wpc_cd = $($($('tr')[row]).children()[0]).text()
    if (!wpc_cd) {
      continue
    }
    //var str = "<div class='editdiv' onclick='editRow(\""+wpc_cd+"\")'></div><div class='deldiv' onclick='delRow(\""+wpc_cd+"\")'></div>";
    const str =
      "<div class='editdiv'  style='margin-left: calc(50% - 16px);' onclick='editRow(\"" +
      wpc_cd +
      '")\'></div>'
    $(cell).append(str)

    // 附件下载
    //var celldl = $($('tr')[row]).children()[collength];
    const celldl = $($('tr')[row]).children()[7]
    const strdl = "<div style='cursor:pointer' onclick='dlfiles(\"" + wpc_cd + '")\'>附件</div>'
    $(celldl).append(strdl)

    // // 取水权人
    // var celldr = $($('tr')[row]).children()[5];
    // var wrp_nm = '<a href="javascript:ckWRP_NM(\''+wpc_cd+'\')">'+$(celldr).text()+'</a>';
    // $(celldr).empty().append(wrp_nm);

    //		debugger;
    // 颜色
    const EXPIRED = ctable.data[row - 1].EXPIRED
    const ww = ctable.data[row - 1].WW
    const w = ctable.data[row - 1].W
    const percentW = isNullL(w) / ww

    if (EXPIRED > 0) {
      $($($('tr')[row]).children()[3]).css('color', '#f38b8b')
    } else if (EXPIRED < 0) {
      $($($('tr')[row]).children()[3]).css('color', '#ffa500')
    }

    const ISEXCEED = ctable.data[row - 1].ISEXCEED

    if (ISEXCEED > 0) {
      //过量标红
      $($($('tr')[row])).css('color', 'red')
    }

    console.info(percentW)

    if (percentW > 0.9 && percentW < 1) {
      //超过90%，标黄
      $($($('tr')[row])).css('color', '#ffa500')
    }
  }

  addPositionRel(2)
  addPositionRel(4)
  addPositionRel(5)
  addPositionRel(6)
  addPositionRel(7)
  addPositionRel(8)
  $($('#table th')[1]).css('z-index', 2)
  $($('#table th')[3]).css('z-index', 2)
  $($('#table th')[4]).css('z-index', 2)
  $($('#table th')[5]).css('z-index', 2)
  $($('#table th')[6]).css('z-index', 2)
  $($('#table th')[7]).css('z-index', 2)
}

function makecontent() {
  const json = {
    cert_conds: ['1', '2', '5']
  }
  $.ajax({
    type: 'POST',
    url: basePath + 'rcgl/spgcgl/getSpgcglM',
    contentType: 'application/json',
    async: true,
    data: JSON.stringify(json),
    success: function (data) {
      let results = data
      let isEmpty = false
      if (!results || results.length < 1) {
        results = makeEmptyData()
        isEmpty = true
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      // 统计新发证和延续证的个数
      const cert_num = {}
      // 计算合计
      let sum_ww = 0
      let sum_w = 0
      let count = 0 //超许可个数
      if (results && results.length > 0) {
        for (const idx in results) {
          const row = results[idx]
          row.no = 1 + parseInt(idx)
          if (row.WW) {
            sum_ww += row.WW
          }
          if (row.W) {
            sum_w += row.W
          }
          if (row.WW && row.W) {
            if (row.W - row.WW > 0) {
              //							debugger;
              count += 1
            }
          }

          row.WPC_CD = row.WPC_CD.replace(/\s+/g, '')

          //
          if (row.EXPIRED > 0) {
            row.EXPIRED_NM = '过期'
          } else {
            row.EXPIRED_NM = '有效'
          }

          if (row.EXPIRED_NM) {
            if (cert_num.hasOwnProperty(row.EXPIRED_NM)) {
              cert_num[row.EXPIRED_NM] += 1
            } else {
              cert_num[row.EXPIRED_NM] = 1
            }
          }
        }
      }
      results.push({
        no: '合计',
        EXPIRED_NM: '共' + (isEmpty ? 0 : results.length) + '条',
        WW: (new Number(sum_ww).toFixed(2) * 100) / 100, // 保留两位小数
        W: (new Number(sum_w).toFixed(2) * 100) / 100 // 保留两位小数
      })
      ctable.genTable(results)

      $('.conent').scrollLeft(0)

      /*$('#total').html(results.length-1);
			$('#valid').html(cert_num["有效"]);
			$('#expire').html(results.length-1-cert_num["有效"]);
			$('#totalw').html(new Number(sum_ww).toFixed(2)*100/100);
			$('#count').html(count);*/

      // 当许可证状态为全部的时候显示饼图
      /*	if (!$('#expired').val()) {
				makechart(cert_num);
			}*/
    }
  })
}

function maketable() {
  const json = {
    expired: $('#expired').val(),
    wrp_nm: $('#wrp_nm').val(),
    wpc_sn: $('#wpc_sn').val(),
    conc_org: $('#conc_org').val(),
    ad_nm: $('#ad_nm').val(),
    wrz_nm: $('#wrz_nm').val(),
    cert_conds: ['1', '2', '5'],
    tyear: $('#tyear').val(),
    wf_nms: $('#wf_nm').getSelected().ids,
    isexceed: $('#isexceed').val()
  }

  $.ajax({
    type: 'POST',
    url: basePath + 'rcgl/spgcgl/getSpgcglM',
    contentType: 'application/json',
    async: true,
    data: JSON.stringify(json),
    success: function (data) {
      let results = data
      let isEmpty = false
      if (!results || results.length < 1) {
        results = makeEmptyData()
        isEmpty = true
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      // 统计新发证和延续证的个数
      const cert_num = {}
      // 计算合计
      let sum_ww = 0
      let sum_w = 0

      let count = 0 //超许可个数
      if (results && results.length > 0) {
        for (const idx in results) {
          const row = results[idx]
          row.no = 1 + parseInt(idx)
          if (row.WW) {
            sum_ww += row.WW
          }
          if (row.W) {
            sum_w += row.W
          }

          if (row.WW && row.W) {
            if (row.W - row.WW > 0) {
              count += 1
            }
          }

          row.WPC_CD = row.WPC_CD.replace(/\s+/g, '')

          //
          if (row.EXPIRED > 0) {
            row.EXPIRED_NM = '过期'
          } else {
            row.EXPIRED_NM = '有效'
          }

          if (row.EXPIRED_NM) {
            if (cert_num.hasOwnProperty(row.EXPIRED_NM)) {
              cert_num[row.EXPIRED_NM] += 1
            } else {
              cert_num[row.EXPIRED_NM] = 1
            }
          }
        }
      }
      results.push({
        no: '合计',
        EXPIRED_NM: '共' + (isEmpty ? 0 : results.length) + '条',
        WW: (new Number(sum_ww).toFixed(2) * 100) / 100, // 保留两位小数
        W: (new Number(sum_w).toFixed(2) * 100) / 100 // 保留两位小数
      })
      ctable.genTable(results)

      $('.conent').scrollLeft(0)

      /* $('#total').html(isEmpty ? 0 : results.length);
			$('#valid').html();
			$('#expire').html();
			$('#totalw').html(new Number(sum_ww).toFixed(2)*100/100);*/

      $('#total').html(results.length - 1)
      if (cert_num.hasOwnProperty('有效')) {
        $('#valid').html(cert_num['有效'])
        $('#expire').html(results.length - 1 - cert_num['有效'])
      } else {
        $('#valid').html(0)
        $('#expire').html(0)
      }

      $('#totalw').html((new Number(sum_ww).toFixed(2) * 100) / 100)
      $('#count').html(count)

      // 当许可证状态为全部的时候显示饼图
      /*if (!$('#expired').val()) {
				makechart(cert_num);
			}*/
    }
  })
}

function makechart(data) {
  const xdata = []
  const ydata = []
  for (const k in data) {
    xdata.push('' + k)
    const row = { value: data[k], name: '' + k }
    ydata.push(row)
  }
  const option = {
    title: {
      text: '证件状态统计',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: xdata
    },
    series: [
      {
        name: '证件状态',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: ydata,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  const myChart = echarts.init(document.getElementById('echart'))
  myChart.setOption(option, true)
}

function editRow(id) {
  // 750 640
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1068px', '610px'],
    content: basePath + 'pages/rcgl/wfzgl/byxkz/dialog/add.jsp?wpc_cd=' + id
  })
}

function add() {
  layer.open({
    type: 2,
    title: '新建',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1068px', '610px'],
    content: basePath + 'pages/rcgl/wfzgl/byxkz/dialog/add.jsp'
  })
}

function delRow(id) {
  //	debugger;
}

function dlfiles(wpc_cd) {
  layer.open({
    type: 2,
    title: '附件下载',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['550px', '400px'],
    content: basePath + 'pages/rcgl/wfzgl/byxkz/dialog/dlfiles.jsp?wpc_cd=' + wpc_cd
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
      setFixedCol(4, scrollAction.x)
      setFixedCol(5, scrollAction.x)
      setFixedCol(6, scrollAction.x)
      setFixedCol(7, scrollAction.x)
      setFixedCol(8, scrollAction.x)
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

// 取水权人点击
function ckWRP_NM(WPC_CD) {
  layer.open({
    type: 2,
    title: '填报',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['1300px', '600px'],
    content: basePath + 'pages/rcgl/wfzgl/byxkz/dialog/check.jsp?wpc_cd=' + WPC_CD
  })
}

function dlexcel() {
  const json = {
    expired: $('#expired').val(),
    wrp_nm: $('#wrp_nm').val(),
    wpc_sn: $('#wpc_sn').val(),
    conc_org: $('#conc_org').val(),
    ad_nm: $('#ad_nm').val(),
    wrz_nm: $('#wrz_nm').val(),
    cert_conds: ['1', '2', '5'],
    tyear: $('#tyear').val(),
    wf_nms: $('#wf_nm').getSelected().ids
  }

  $.ajax({
    type: 'POST',
    url: basePath + 'rcgl/spgcgl/getSpgcglM',
    contentType: 'application/json',
    async: true,
    data: JSON.stringify(json),
    success: function (data) {
      const results = data
      let isEmpty = false
      if (!results || results.length < 1) {
        isEmpty = true
        return
      }
      // 计算合计
      let sum_ww = 0
      if (results && results.length > 0) {
        for (const idx in results) {
          const row = results[idx]
          row.no = 1 + parseInt(idx)
          if (row.WW) {
            sum_ww += row.WW
          }
          //
          if (row.EXPIRED > 0) {
            row.EXPIRED_NM = '过期'
          } else {
            row.EXPIRED_NM = '有效'
          }
        }
      }
      results.push({
        no: '合计',
        EXPIRED_NM: '共' + (isEmpty ? 0 : results.length) + '条',
        WW: (new Number(sum_ww).toFixed(2) * 100) / 100 // 保留两位小数
      })

      const titles =
        'no,EXPIRED_NM,WPC_SN,WRP_NM,HW_CTRL,CONC_ORG,AD_NM,WRZ_NM,TH_LEVEL,INT_NM,INT_ADDR_D,INT_ADDR_MAP,' +
        'CHK_INT_MET,WF_NM,WW,INT_USE,MAX_Q,IRR_A,RW_ADDR,RW_ADDR_MAP,RW_W,RW_WQ_REQ,IS_WR_WRA,WR_WRA_NM,WR_WRA_ORG,' +
        'WR_WRA_TM,INT_BD,INT_DL'
      const titles_zh =
        '序号,证件状态,取水许可证编号,取水权人,海委托省管理,监管单位,行政区,水资源分区,三级分区,取水口,取水口所在地,' +
        '取水口经纬度,取水方式,取水水源,年许可水量,取水用途,最大流量(m3/秒),灌溉面积及用水规模(万亩),退水地点,退水点经纬度,退水量(t/d),' +
        '退水水质要求,是否开展水资源论证,水资源论证报告名称,水资源论证报告编制单位,水资源论证审查时间,有效期起始时间,有效期结束时间'
      const json = {
        titles: titles,
        titles_zh: titles_zh,
        results: JSON.stringify(results),
        excelname: '保有许可证'
      }
      // 下载表格
      $.fileDownload(basePath + 'commonExcel/download', {
        httpMethod: 'POST',
        data: json,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        successCallback: function (url) {
          //					debugger;
        }
      })
    }
  })
}
