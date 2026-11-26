$(document).ready(function () {
  initStyle()
  initDate()

  partCharts()

  getAllZA(function () {
    //选第一个节点
    $($('#Sztbody td')[0]).click()
  })

  $('#stcdtype').change(function () {
    if ($('#stcdtype').val() == 'autotype') {
      // 自动
      parent.parent.setIframe('auto', 'nbb')
    } else if ($('#stcdtype').val() == 'zatype') {
      // 人工
      parent.parent.setIframe('za', 'nbb')
    }
  })
})

function initStyle() {
  $('#selcol').val(selcolnames)
}

function initDate() {
  const setm = moment().format('YYYY')
  $('#etm').val(setm)
}

// 所选指标
let selcolids =
  'WT,PH,DOX,CODMN,CODCR,BOD5,NH3N,TP,TN,F,CN,S2,CU,ZN,SE,ARS,HG,CD,PB,CR6,VLPH,FCG,LAS'
var selcolnames =
  '水温,PH值,溶解氧,高锰酸盐,化学需氧量,五日生化需氧量,氨氮,总磷,总氮,氟化物,氰化物,硫化物,铜,锌,硒,砷,汞,镉,铅,铬,挥发酚,粪大肠菌群,阳离子表面活性剂'
const selcolunits =
  '℃,,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,mg/L,个/L,mg/L'
let selstcd = ''
let selstcdname = ''
function setSelCol(id, name) {
  selcolids = id
  selcolnames = name
  $('#selcol').val(name)

  //  划分区域
  partCharts()
  initData()
}

function partCharts() {
  const selcolnameList = selcolnames.split(',')
  const selcolunitList = selcolunits.split(',')
  $('#Zbthead').empty()
  let str = ''
  for (let i = 0; i < selcolnameList.length; ++i) {
    let divStr = '<td>' + selcolnameList[i] + '<br>'
    if (selcolunitList[i]) {
      divStr += '(' + selcolunitList[i] + ')</td>'
    }

    str += divStr
  }
  $('#Zbtheads').empty()
  $('#Zbtheads').append('<tr>' + str + '</tr>')

  $('#sjdmZbTable').width(selcolnameList.length * 160 + 'px')
  $('#sjdmZbTableDiv').perfectScrollbar()
}

function getAllZA(callback) {
  $.ajax({
    url: basePath + 'cxfx/getAllZA',
    data: '',
    success: function (data) {
      let rows = ''
      for (let i = 0; i < data.length; ++i) {
        const str =
          '<tr onclick="ckStcd(\'' +
          data[i].STCD +
          '\')"><td  id="row_' +
          data[i].STCD +
          '" >' +
          data[i].ST_NM +
          '</td></tr>'
        rows += str
      }
      $('#Sztbody').append(rows)
      //$('#stcddiv').perfectScrollbar({suppressScrollY:true});
      $('#stcddiv').perfectScrollbar()
      callback()
    }
  })
}

function ckStcd(stcd) {
  $('.ckrow').removeClass('ckrow')
  $('#row_' + stcd).addClass('ckrow')
  selstcd = stcd
  selstcdname = $('.ckrow').text()
  selFirstStcd(selstcd, selstcdname)
  initData()
}

function selcol() {
  layer.open({
    title: '选择水质指标',
    type: 2,
    area: ['680px', '250px'],
    content: basePath + 'pages/ssjkyj/cxfx/za/zacol.jsp'
  })
}

function initData() {
  const cmonth = $('#etm').val()
  const cmonthStart = cmonth + '-01'
  const cmonthEnd = cmonth + '-12'

  const json = {
    BTM: cmonthStart,
    ETM: cmonthEnd,
    STCD: selstcd
  }
  const url = 'cxfx/getZAInfoByMonth'

  $.ajax({
    url: basePath + url,
    data: JSON.stringify(json),
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      const selcolList = selcolids.split(',')
      const selcolnameList = selcolnames.split(',')
      makeTable(data, selcolList, selcolnameList)
    }
  })
}

Array.prototype.toFixs = function () {
  let max = 0
  this.forEach(function (ele, index, arr) {
    const x = String(ele).indexOf('.') + 1 //小数点的位置
    const iter = x == 0 ? 0 : String(ele).length - x //小数的位数
    if (iter > max) {
      max = iter
    }
  })
  return max
}

function makeTable(data, selcolList, selcolnameList) {
  let SztbodyStr = ''
  let ZbtbodyStr = ''

  if (data.length < 1) {
    // 8行空行
    for (var i = 0; i < 8; ++i) {
      SztbodyStr += '<tr><td></td><td></td></tr>'

      ZbtbodyStr += '<tr>'
      for (var j = 0; j < selcolList.length; ++j) {
        ZbtbodyStr += '<td></td>'
      }
      ZbtbodyStr += '</tr>'
    }
  } else {
    const valMap = {}
    for (var i = data.length - 1; i >= 0; --i) {
      const row = data[i]

      SztbodyStr += '<tr><td>' + row.tm + '</td><td>' + getWqType(row.wqg) + '</td></tr>'

      ZbtbodyStr += '<tr>'
      for (var j = 0; j < selcolList.length; ++j) {
        const valstr = isNulls(row[selcolList[j].toLowerCase()])
        if (valstr) {
          if (valMap.hasOwnProperty(selcolList[j].toLowerCase())) {
            valMap[selcolList[j].toLowerCase()].push(parseFloat(valstr))
          } else {
            valMap[selcolList[j].toLowerCase()] = []
          }
        }
        ZbtbodyStr += '<td>' + valstr + '</td>'
      }
      ZbtbodyStr += '</tr>'
    }

    SztbodyStr += '<tr><td>最大值</td><td></td></tr>'
    SztbodyStr += '<tr><td>最小值</td><td></td></tr>'
    SztbodyStr += '<tr><td>平均值</td><td></td></tr>'

    let ZbtbodyMax = '<tr>'
    let ZbtbodyMin = '<tr>'
    let ZbtbodyAvg = '<tr>'

    for (var j = 0; j < selcolList.length; ++j) {
      const key = selcolList[j].toLowerCase()
      let maxVal = ''
      let minVal = ''
      let avgVal = ''
      if (valMap.hasOwnProperty(key)) {
        maxVal = '' + Math.max.apply(null, valMap[key])
        minVal = '' + Math.min.apply(null, valMap[key])
        let sumVal = 0
        for (var i = 0; i < valMap[key].length; ++i) {
          sumVal += valMap[key][i]
        }
        avgVal = '' + (sumVal / valMap[key].length).toFixed(valMap[key].toFixs())
      }
      ZbtbodyMax += '<td>' + maxVal + '</td>'
      ZbtbodyMin += '<td>' + minVal + '</td>'
      ZbtbodyAvg += '<td>' + avgVal + '</td>'
    }
    ZbtbodyMax += '</tr>'
    ZbtbodyMin += '</tr>'
    ZbtbodyAvg += '</tr>'

    ZbtbodyStr += ZbtbodyMax
    ZbtbodyStr += ZbtbodyMin
    ZbtbodyStr += ZbtbodyAvg
  }

  $('#Sztbodys').empty()
  $('#Zbtbodys').empty()
  $('#Sztbodys').append(SztbodyStr)
  $('#Zbtbodys').append(ZbtbodyStr)

  $('#sjdmZbTableDiv').height($('#sjdmZbTable').height() + 5 + 'px')
  $('#stables').perfectScrollbar()
  $('#stables').scrollTop(0)

  const sjdmZbTableDivHeight = $('#sjdmZbTableDiv').height()
  const sheight = $('#sjdmSzTableDiv').height()
  if (sjdmZbTableDivHeight < sheight) {
    $($('.ps-scrollbar-x-rail')[0]).css('top', '')
    return
  }
  //
  //	if (xscrollTop+scrollLength-10 > $('#sjdmSzTable').height()) {
  //
  //	}

  $($('.ps-scrollbar-x-rail')[0]).css('position', 'absolute')
  $($('.ps-scrollbar-x-rail')[0]).css('top', sheight - 10 + 'px')

  $('#stables').scroll(function (data, e) {
    const scrollLength = $('#stables').scrollTop()

    // 固定表头

    // 固定x滚动
    const xscrollTop = $('#sjdmSzTableDiv').height()
    $($('.ps-scrollbar-x-rail')[0]).css('top', xscrollTop + scrollLength - 10 + 'px')
  })
}

//站点选择
function selstcdid() {
  layer.open({
    title: '选择水质指标',
    type: 2,
    area: ['1110px', '400px'],
    content: basePath + 'pages/ssjkyj/cxfx/za/zaStcd.jsp'
  })
}

function setSelStcdId(id, name) {
  selstcd = id
  selstcdname = name
  $('#selstcdid').val(name)
  $('#t_date').text(selstcdname)
  //  划分区域
  curPage = 1
  partCharts()
}

function selFirstStcd(id, name) {
  $('#selstcdid').val(name)
  $('#t_date').text(name)
}
