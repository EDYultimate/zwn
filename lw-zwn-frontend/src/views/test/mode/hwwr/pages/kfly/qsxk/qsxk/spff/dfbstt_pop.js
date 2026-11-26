// 所选择的列
let selcols = []

$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')

  $('#qsfx').click(ckqsfx)
  $('#jcxx').click(ckjcxx)
  const curtDate = new Date()
  endtime = curtDate.Format('yyyy')
  const year = 10
  starttime = moment()
    .add(0 - year, 'years')
    .format('YYYY')
  // 填入时间查询
  $('#beginTm').val(starttime)
  $('#endTm').val(endtime)

  //
  $('#riverselect').change(changeRiverSel)
  $('#certselect').change(changeCertSel)

  init()
  getAllSelCols()
})

function ckqsfx() {
  $('#content_chart').show()
  $('#content_table').hide()
  $('#qsfx').addClass('clickLiTab')
  $('#jcxx').removeClass('clickLiTab')
}

function ckjcxx() {
  $('#content_chart').hide()
  $('#content_table').show()
  $('#qsfx').removeClass('clickLiTab')
  $('#jcxx').addClass('clickLiTab')

  const data = parent.layerdata
  if (data.ST_NM) {
    $('#ST_NM').text(data.ST_NM)
  }
  if (data.STCD) {
    $('#STCD').text(data.STCD)
  }
  if (data.LOC) {
    $('#LOC').text(data.LOC)
  }
  if (data.EST_ST_YM) {
    $('#EST_ST_YM').text(data.EST_ST_YM)
  }
  if (data.ENG_MAN_CD) {
    $('#ENG_MAN_CD').text(data.ENG_MAN_CD)
  }
  if (data.NT) {
    $('#NT').text(data.NT)
  }
}

function init() {
  const ctype = certtype.split('_')[1]
  const tabletype = certtype.split('_')[0]
  const param = {
    wrz_cd: WRZ_CD,
    start: $('#beginTm').val(),
    end: $('#endTm').val(),
    type: ctype,
    tableType: tabletype
  }
  jQuery.getJSON(basePath + '/kfly/qsxk/getQsxk_Qst', param, function (result) {
    const list = result
    if (list != null && list.length > 0) {
      let str = ''
      for (var i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          '<td>' +
          isNull(list[i].TM) +
          '</td>' +
          '<td>' +
          isNull(list[i].VAL) +
          '</td>' +
          '</tr>'
      }
      $('#tbody').empty().append(str)
    }

    //
    const resMap = {}
    //		for (var i=0; i<selcols.length; ++i) {
    //			for (var j=0; j<list.length; ++j) {
    //				var col = selcols[i].col;
    //				var value = list[j][col];
    //				if (resMap.hasOwnProperty(col)) {
    //					resMap[col].push(value);
    //				}
    //				else {
    //					resMap[col] = [value];
    //				}
    //			}
    //		}

    const tms = []
    const vals = []
    const names = []

    const startt = parseInt($('#beginTm').val())
    const endt = parseInt($('#endTm').val())

    for (var i = startt; i <= endt; ++i) {
      tms.push(i)
    }
    for (var i = 0; i < selcols.length; ++i) {
      for (let k = startt; k <= endt; ++k) {
        const col = selcols[i].col
        let value = null
        for (var j = 0; j < list.length; ++j) {
          if (list[j] && list[j].TYEAR == '' + k) {
            value = list[j][col]
            break
          }
        }
        if (resMap.hasOwnProperty(col)) {
          resMap[col].push(value)
        } else {
          resMap[col] = [value]
        }
        ++j
      }
    }

    for (var i = 0; i < selcols.length; ++i) {
      const item = {
        name: selcols[i].name,
        type: 'bar',
        stack: '1',
        data: resMap[selcols[i].col]
      }
      vals.push(item)
      names.push(selcols[i].name)
    }
    debugger
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: names
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: tms
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: vals
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option, true)
  })
}

// 改变
function changeCertSel() {
  debugger
  selcols = []
  getSelCols()
  $('.zd_div').hide()
}

function changeRiverSel() {
  debugger
  if ($('#riverselect').val() == '0') {
    $('#certselect').show()
  } else {
    $('#certselect').hide()
  }
  selcols = []
  getSelCols()
  $('.zd_div').hide()
}

/**
 * =========== 点击许可分类 ============
 */
function getData() {
  // 河道内 河道外
  const riversel = $('#riverselect').val()
  // 选择水源 或 用途
  const certsel = $('#certselect').val()
  const ctype = certtype.split('_')[0]

  let data = []
  if (ctype == 'spff') {
    // 河道内
    if (riversel == '1') {
      data = [
        { col: 'HP_PERM', name: '水力发电' },
        { col: 'OTHRW_PERM', name: '其他' }
      ]
    }
    // 河道外
    else {
      // 选择水源
      if (certsel == '1') {
        data = [
          { col: 'SW_PERM', name: '地表水' },
          { col: 'GW_PERM', name: '地下水' },
          { col: 'OTH_PERM', name: '其他' }
        ]
      }
      // 选择用途
      else {
        data = [
          { col: 'TAP_PERM', name: '自来水' },
          { col: 'SLF_PERM', name: '生活自备水' },
          { col: 'IND_PERM', name: '工业自备水' },
          { col: 'AGR_PERM', name: '农业' },
          { col: 'OTHU_PERM', name: '其他' }
        ]
      }
    }
  } else if (ctype == 'zxdx') {
    // 河道内
    if (riversel == '1') {
      data = [
        { col: 'HP_RLW', name: '水力发电' },
        { col: 'OTHRW_RLW', name: '其他' }
      ]
    }
    // 河道外
    else {
      // 选择水源
      if (certsel == '1') {
        data = [
          { col: 'SW_RLW', name: '地表水' },
          { col: 'GW_RLW', name: '地下水' },
          { col: 'GW_OTH_RLW', name: '其他' }
        ]
      }
      // 选择用途
      else {
        data = [
          { col: 'TAP_RLW', name: '自来水' },
          { col: 'SLF_RLW', name: '生活自备水' },
          { col: 'IND_RLW', name: '工业自备水' },
          { col: 'AGR_RLW', name: '农业' },
          { col: 'OTH_RLW', name: '其他' }
        ]
      }
    }
  }
  return data
}

// 自动勾选
function autoCk() {
  const inputs = $("input[name='czCheck']")
  const cols = []
  for (var i = 0; i < selcols.length; ++i) {
    cols.push(selcols[i].col)
  }
  for (var i = 0; i < inputs.length; ++i) {
    const input_val = $($("input[name='czCheck']")[i]).val()
    if (cols.indexOf(input_val) >= 0) {
      $($("input[name='czCheck']")[i]).attr('checked', true)
    } else {
      $($("input[name='czCheck']")[i]).attr('checked', false)
    }
  }
}

function cktype() {
  $('.zd_div').show()
  const data = getData()
  $('#zdxx').empty()
  let czStr = ''
  for (let i = 0; i < data.length; i++) {
    const map = data[i]
    czStr +=
      "<div style='float:left;width:90px;margin-left: 20px;margin-top: 5px;line-height: 30px; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;font-size:15px'>"
    czStr +=
      "<label style='' title='" +
      map.name +
      "' ><input type='checkbox' style='width: 15px;height: 15px;' value='" +
      map.col +
      "'   name='czCheck' />" +
      map.name +
      '</label>'
    czStr += '</div>'
  }
  $('#zdxx').append(czStr)
  autoCk()
}

// 全选
function selectAll() {
  $("input[name='czCheck']").attr('checked', true)
}

// 清空
function selectNone() {
  $("input[name='czCheck']").attr('checked', false)
}

// 确定
function qd() {
  selcols = []
  for (let i = 0; i < $("input[name='czCheck']").length; ++i) {
    // 所勾选的列
    if ($($("input[name='czCheck']")[i]).attr('checked') == 'checked') {
      const coltext = $($("input[name='czCheck']")[i]).parent().text()
      const colid = $($("input[name='czCheck']")[i]).val()
      selcols.push({ col: colid, name: coltext })
    }
  }

  getSelCols()
  $('.zd_div').hide()
}

function getSelCols() {
  const str = []
  for (let i = 0; i < selcols.length; ++i) {
    str.push(selcols[i].name)
  }
  $('#zd').val(str.toString())
}

function getAllSelCols() {
  const data = getData()
  selcols = data
  getSelCols()
}
