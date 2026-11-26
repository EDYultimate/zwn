$(document).ready(function () {
  initTree()

  $('#qs_xzq').change(function (data) {
    type = data.target.value
    initType()
    if (type === 'l5') {
      $('#typediv').hide()
    } else {
      $('#typediv').show()
    }
  })

  initType()
  getYear(function () {
    search()
  })
})

let zTree
function treeStyle() {
  $('#tree span').css('font-size', '14px')
  $('#tree li').css('padding-top', '5px')
}
function initTree() {
  const setting = {
    check: {
      enable: true,
      chkboxType: { Y: '', N: '' }
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    view: {
      showIcon: false,
      fontCss: {
        'font-size': '14px'
      }
    }
  }
  const zNodes = [
    { id: 1, pId: 0, name: '供水量', sid: 'GSL', checked: true },
    // { id:1, pId:0, name:"供水量", sid: "GSL", checked:true, open:true},
    // { id:11, pId:1, name:"地表水", sid: "DBSTOL", open:true},
    // { id:111, pId:11, name:"蓄水", sid: "XS", checked:true},
    // { id:112, pId:11, name:"引水", sid: "YS", checked:true},
    // { id:113, pId:11, name:"堤水", sid: "TS"},
    // { id:114, pId:11, name:"跨流域调水", sid: "DRL"},
    // { id:115, pId:11, name:"非工程供水量", sid: "LYMC"},
    // { id:12, pId:1, name:"地下水", sid: "DXSTOL", checked:true, open:true},
    // { id:121, pId:12, name:"浅层水", sid: "QC"},
    // { id:122, pId:12, name:"深层水", sid: "SC"},
    // { id:123, pId:12, name:"微咸水", sid: "WX"},
    // { id:13, pId:1, name:"其他水源", sid: "QTTOL", open:true},
    // { id:131, pId:13, name:"污水处理回用量", sid: "WSCL"},
    // { id:132, pId:13, name:"雨水利用", sid: "YSLY"},
    // { id:133, pId:13, name:"海水淡化", sid: "HS"},
    { id: 2, pId: 0, name: '用水量', sid: 'YSL', checked: true },
    { id: 3, pId: 0, name: '耗水量', sid: 'TOT_WC', checked: true },
    { id: 4, pId: 0, name: '排污量', sid: 'PWL', checked: true },
    { id: 5, pId: 0, name: '降水量', sid: 'CUR_P', checked: true },
    { id: 6, pId: 0, name: '水资源量', sid: 'WR_T', checked: true }
  ]
  $.fn.zTree.init($('#tree'), setting, zNodes)
  zTree = $.fn.zTree.getZTreeObj('tree')
  treeStyle()
}

let treeNames = {}
let treeVals = {}
let treeLevel = {}

// 生成表头
// 生成表头
function genThead() {
  let maxRowSize = parseInt(getMaxRowSize())
  maxRowSize += 2
  let str = '<tr>'
  str += '<th rowspan="' + maxRowSize + '">年份</th>'
  let size1th = 0
  for (var i = 0; i < treeLevel[0].length; ++i) {
    size1th += getColSize(treeLevel[0][i])
  }

  for (var i = 0; i < typeids.length; ++i) {
    str += '<th colspan="' + size1th + '">' + typenames[i] + '</th>'
  }
  str += '</tr>'

  // col name by order
  const colNames = getColByOrder()

  let j = 0
  while (maxRowSize - 1 > j) {
    str += '<tr>'
    for (var k = 0; k < typeids.length; ++k) {
      var items = treeLevel[j]
      for (var i = 0; i < items.length; ++i) {
        str += '<th '
        // var sname = getKeyName(items[i]);
        // if (sname && (getRowSize(items[i])>1 || maxRowSize - 2 === j)) {
        //     str += 'data-field="'+typeids[k]+'_'+sname+'" ';
        // }
        str +=
          'colspan="' +
          getColSize(items[i]) +
          '"  rowspan="' +
          getRowSize(items[i]) +
          '">' +
          items[i] +
          '</th>'
      }
    }
    str += '</tr>'
    ++j
  }
  // real table head
  str += '<tr style="display: none;">'
  str += '<th data-field="YEAR">年份</th>'
  for (var k = 0; k < typeids.length; ++k) {
    for (var i in colNames) {
      str += '<th '
      const sname = getKeyName(colNames[i])
      if (sname) {
        str += 'data-field="' + typeids[k] + '_' + sname + '" '
      }
      str +=
        'colspan="' +
        getColSize(items[i]) +
        '"  rowspan="' +
        getRowSize(items[i]) +
        '">' +
        colNames[i] +
        '</th>'
    }
  }
  str += '</tr>'
  $('#theads').empty().append(str)

  // hidden the type tr
  // $($('#table tr:nth-child(2)')[0]).css('display', 'none');
}

function getColByOrder() {
  const colNames = []

  const item = treeLevel[0]
  // 1th level
  for (const i in item) {
    if (treeNames.hasOwnProperty(item[i]) && treeNames[item[i]].length > 0) {
      const item2nd = treeNames[item[i]]
      // 2nd level
      for (const j in item2nd) {
        if (treeNames.hasOwnProperty(item2nd[j]) && treeNames[item2nd[j]].length > 0) {
          const item3ed = treeNames[item2nd[j]]
          // 3ed level
          for (const m in item3ed) {
            colNames.push(item3ed[m])
          }
        } else {
          colNames.push(item2nd[j])
        }
      }
    } else {
      colNames.push(item[i])
    }
  }

  return colNames
}

function getKeyName(key) {
  let str = ''
  if (key.indexOf('小计') >= 0 && treeVals.hasOwnProperty(key.replace('小计', ''))) {
    str = treeVals[key.replace('小计', '')]
  } else if (key.indexOf('总计') >= 0 && treeVals.hasOwnProperty(key.replace('总计', ''))) {
    str = treeVals[key.replace('总计', '')]
  } else if (treeVals.hasOwnProperty(key)) {
    str = treeVals[key]
  }
  return str
}

function loopAddNode(node) {
  treeVals[node.name] = node.sid

  if (treeLevel.hasOwnProperty(node.level) && treeLevel[node.level].indexOf(node.name) < 0) {
    treeLevel[node.level].push(node.name)
  } else if (!treeLevel.hasOwnProperty(node.level)) {
    treeLevel[node.level] = [node.name]
  }

  if (!treeNames.hasOwnProperty(node.name) && node.level < 2) {
    treeNames[node.name] = []
  }
  if (node.pId === null) {
    return
  }
  const parent = node.getParentNode()
  if (treeNames.hasOwnProperty(parent.name) && treeNames[parent.name].indexOf(node.name) < 0) {
    treeNames[parent.name].push(node.name)
  } else if (!treeNames.hasOwnProperty(parent.name)) {
    treeNames[parent.name] = [node.name]
  }

  // add 小计
  if (
    node.level === 1 &&
    node.getParentNode().checked &&
    treeNames[parent.name].indexOf(parent.name + '总计') < 0
  ) {
    treeNames[parent.name].push(parent.name + '总计')
    treeLevel[node.level].push(parent.name + '总计')
  } else if (
    node.level === 2 &&
    node.getParentNode().checked &&
    treeNames[parent.name].indexOf(parent.name + '小计') < 0
  ) {
    treeNames[parent.name].push(parent.name + '小计')
    treeLevel[node.level].push(parent.name + '小计')
  }
  loopAddNode(parent)
}

function loopColNanme(iter, nameObj) {
  if (!treeNames.hasOwnProperty(iter)) {
    return
  }
  const item = treeNames[iter]
  nameObj.num += item.length
  for (const i in item) {
    if (treeNames.hasOwnProperty(item[i]) && treeNames[item[i]].length > 0) {
      nameObj.num -= 1
    }
    loopColNanme(item[i], nameObj)
  }
}

function getMaxRowSize() {
  let num = 0
  for (const i in treeLevel) {
    if (i > num) {
      num = i
    }
  }
  return num
}

function getRowSize(name) {
  let size = 1
  for (const i in treeLevel) {
    // skip tree leaf
    if (i === '2') {
      continue
    }
    if (treeLevel[i].indexOf(name) >= 0) {
      const list = treeNames[name]
      if (list === undefined || list.length === 0) {
        size = 3 - i
        break
      }
    }
  }
  return size
}

function getColSize(name) {
  let num = 0
  const nameObj = {
    name: name,
    num: 0
  }

  loopColNanme(name, nameObj)

  if (nameObj.num === 0) {
    num = 1
  } else {
    num = nameObj.num
  }
  return num
}

function sortTreeArray(obj) {
  for (const k in obj) {
    const list = obj[k]
    if (list.length < 1) {
      continue
    }
    if (list.length > 1) {
      for (let i = 0, j = i + 1; i < list.length - 1; ++i, ++j) {
        if (list[j].indexOf('小计') >= 0 || list[j].indexOf('总计') >= 0) {
          const tmp = list[i]
          list[i] = list[j]
          list[j] = tmp
        }
      }
    }
  }
}

// get checked input
function getCkedType() {
  // init
  treeNames = {}
  treeVals = {}
  treeLevel = {}

  const ckedItems = zTree.getCheckedNodes()
  for (let i = 0; i < ckedItems.length; ++i) {
    loopAddNode(ckedItems[i])
  }

  // sort init array
  sortTreeArray(treeNames)
  sortTreeArray(treeLevel)
  return ckedItems.length
}

var type = 'l5'
var typeids = []
var typenames = []
function setTypenames() {
  $('#typename').val(typenames.toString())
}

function initType() {
  typeids = tableTypes[type].ids.split(',')
  typenames = tableTypes[type].names.split(',')
  setTypenames()
}

function finished() {}

function getYear(callback) {
  $.get(basePath + 'sgb/getIndex_Gsl_Year', {}, function (data) {
    if (data && data.length > 0) {
      $('#btm').val(data[data.length - 1].YEAR)
      $('#etm').val(data[0].YEAR)
    }

    if (callback) {
      callback()
    }
  })
}

function changeTitle() {
  if (treeLevel[0].length < 3) {
    const str = []
    for (let i = 0; i < treeLevel[0].length; ++i) {
      str.push(treeLevel[0][i])
    }
    $('#gbtitle').text('海河流域分区' + str.toString())
  } else {
    $('#gbtitle').text('海河流域分区水资源情况')
  }
}

function selTypes() {
  const res = []
  // col name by order
  const colNames = getColByOrder()
  for (const i in colNames) {
    res.push({
      k: getKeyName(colNames[i]),
      v: colNames[i]
    })
  }
  return res
}

function search() {
  const cknum = getCkedType()
  if (cknum === 0) {
    alert('请在左侧至少选择一个类型')
    return
  }

  changeTitle()

  genThead()

  $('#table tbody').empty()
  $.get(
    basePath + 'sgb/getGbsl',
    {
      btm: $('#btm').val(),
      etm: $('#etm').val()
    },
    function (data) {
      let results = data
      if (!results || results.length < 1 || !results[0].list || results[0].list.length < 1) {
        results = makeEmptyData()
      }
      option = {}
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.genTable(results[0].list.reverse())

      makechart(results)
    }
  )
}

function openDlg() {
  let area = []

  // l1 省级行政区
  if (type === 'l1') {
    area = ['292px', '150px']
  }
  // l2 水资源二级区
  else if (type === 'l2') {
    area = ['260px', '150px']
  }
  // l3 省套三级区
  else if (type === 'l3') {
    area = ['920px', '640px']
  }
  // l4 水资源三级区
  else if (type === 'l4') {
    area = ['700px', '340px']
  }
  // l6 地级市行政区
  else if (type === 'l6') {
    area = ['700px', '440px']
  }

  layer.open({
    type: 2,
    title: '分区',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: area,
    content: basePath + 'pages/rcgl/szygb/common/dl.jsp?type=' + type
  })
}

function getSeries(data, types) {
  const symbols = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']
  const seriesArr = []
  const names = tableTypes[type].names.split(',')
  const ids = tableTypes[type].ids.split(',')

  for (var i = 0; i < names.length; ++i) {
    for (var j = 0; j < types.length; ++j) {
      let tdata = data[0].vals[ids[i] + '_' + types[j].k]
      if (tdata) {
        tdata = data[0].vals[ids[i] + '_' + types[j].k].reverse()
      } else {
        tdata = []
      }
      seriesArr.push({
        sid: ids[i] + '_' + types[j].k,
        name: names[i] + ' (' + types[j].v + ')',
        type: 'line',
        symbol: symbols[j],
        data: tdata
      })
    }
  }

  const series = []
  for (var i = 0; i < typeids.length; ++i) {
    for (var j = 0; j < seriesArr.length; ++j) {
      for (let k = 0; k < types.length; ++k) {
        if (typeids[i] + '_' + types[k].k === seriesArr[j].sid) {
          series.push(seriesArr[j])
        }
      }
    }
  }

  return series
}

function genChartNames(types) {
  const labels = []
  for (let i = 0; i < typenames.length; ++i) {
    for (j = 0; j < types.length; ++j) {
      labels.push(typenames[i] + ' (' + types[j].v + ')')
    }
  }
  return labels
}

function makechart(data) {
  const types = selTypes()
  let option = {}
  const series = getSeries(data, types)
  const labels = genChartNames(types)
  // l1 行政区
  if (type === 'l1' || type === 'l6') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '行政区水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: labels,
        type: 'scroll',
        top: 30,
        x: 'center',
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }
  // l2 水资源二级区
  else if (type === 'l2') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '水资源分区水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: labels,
        type: 'scroll',
        top: 30,
        x: 'center',
        itemWidth: 15,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }
  // l3 省套三级区
  else if (type === 'l3') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '省套三级区水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: labels,
        type: 'scroll',
        top: '30px',
        itemWidth: 15,
        itemHeight: 8,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }
  // l4 水资源三级区
  else if (type === 'l4') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '水资源三级区水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: labels,
        type: 'scroll',
        top: '30px',
        itemWidth: 15,
        itemHeight: 8,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }
  // l5 全流域
  else if (type === 'l5') {
    option = {
      //color:['#b6a2de','#5ab1ef','#2ec7c9','#ea947e','#ff6666','#6ac36b','#f0ab4e','#b6a2de'],
      title: {
        text: '全流域水量趋势统计图',
        top: 4,
        x: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: labels,
        type: 'scroll',
        top: '30px',
        itemWidth: 15,
        itemHeight: 8,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data[0].year.reverse()
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}亿m³'
        }
      },
      series: series
    }
  }

  const myChart = echarts.init(document.getElementById('charts'))
  setTimeout(function () {
    myChart.setOption(option, true)
  })
}
