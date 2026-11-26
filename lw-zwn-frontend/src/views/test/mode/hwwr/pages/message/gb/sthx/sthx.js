function initStyle() {}

function search() {
  $('#grid').datagrid('reload')
}

function inittable() {
  $('#grid').datagrid({
    height: 310,
    url: '',
    title: '三条红线',
    frozenColumns: [
      [
        {
          field: 'ANN_ASS_CD',
          title: '年度考核结果报告代码',
          width: 0,
          hidden: true
        },
        {
          field: 'WRCS_CD',
          title: '水资源计算分区代码',
          width: 0,
          hidden: true
        },
        {
          field: 'ASS_PT',
          title: '考核时段类型',
          width: 0,
          hidden: true
        },
        {
          field: 'AD_NM',
          title: '行政区',
          width: 100
        }
      ]
    ],
    columns: [
      [
        {
          field: 'TOTW_TAR',
          title: '用水总量年度目标值',
          width: 200
        },
        {
          field: 'TOTW_ACT',
          title: '用水总量实际值',
          width: 200
        },
        {
          field: 'TOTW_SCO',
          title: '用水总量评分',
          width: 200
        },
        {
          field: 'TOTW_DEC',
          title: '用水总量扣分原因说明',
          width: 200
        },
        {
          field: 'ADD_TAR_IND',
          title: '万元工业增加值用水量年度目标值',
          width: 200
        },
        {
          field: 'ADD_ACT_IND',
          title: '万元工业增加值用水量实际值',
          width: 200
        },
        {
          field: 'ADD_SCO_IND',
          title: '万元工业增加值用水量评分',
          width: 200
        },
        {
          field: 'ADD_DEC_IND',
          title: '万元工业增加值用水量扣分原因说明',
          width: 200
        },
        {
          field: 'TAR_IRR',
          title: '农田灌溉水有效利用系数年度目标值',
          width: 200
        },
        {
          field: 'ACT_IRR',
          title: '农田灌溉水有效利用系数实际值',
          width: 200
        },
        {
          field: 'SSCO_IRR',
          title: '农田灌溉水有效利用系数评分',
          width: 200
        },
        {
          field: 'DEC_IRR',
          title: '农田灌溉水有效利用系数扣分原因说明',
          width: 200
        },
        {
          field: 'TAR_WFUNC',
          title: '水功能区水质达标率年度目标值',
          width: 200
        },
        {
          field: 'ACT_WFUNC',
          title: '水功能区水质达标率实际值',
          width: 200
        },
        {
          field: 'SCO_WFUNC',
          title: '水功能区水质达标率评分',
          width: 200
        },
        {
          field: 'DEC_WFUNC',
          title: '水功能区水质达标率扣分原因说明',
          width: 200
        }
      ]
    ],
    toolbar: '#buttons', //
    onBeforeLoad: function () {
      $(this).datagrid('options').url =
        hwwr.basePath + 'message/gb/getSthx_table?year=' + $('#chooseyear').val()
    },
    onLoadSuccess: function (data) {
      if (data.total && data.total > 0) {
        $('#chooseyear').val(data.rows[0].ANN_ASS_CD.substr(6, 11))
      }
    }
  })
}

function addDialog() {
  $('#addDialog').dialog('open')
  //初始化弹出窗
  popDialog()
}

function popDialog() {
  if (!$('#dialogyear').val()) {
    const cyear = moment().format('YYYY')
    $('#dialogyear').val(cyear)
  }
  dialogData()
}

function dialogData() {
  // 查询并赋值
  $.post(
    hwwr.basePath + 'message/gb/getSthx_table',
    {
      year: $('#dialogyear').val(),
      ad_cd: $('#dialogad').val()
    },
    function (data) {
      // 重置表格为空
      $('#ANN_ASS_CD').val('')
      $('#WRCS_CD').val('')
      $('#ASS_PT').val('')
      $('#TOTW_TAR').val('')
      $('#TOTW_ACT').val('')
      $('#TOTW_SCO').val('')
      $('#TOTW_DEC').val('')
      $('#ADD_TAR_IND').val('')
      $('#ADD_ACT_IND').val('')
      $('#ADD_SCO_IND').val('')
      $('#ADD_DEC_IND').val('')
      $('#TAR_IRR').val('')
      $('#ACT_IRR').val('')
      $('#SSCO_IRR').val('')
      $('#DEC_IRR').val('')
      $('#TAR_WFUNC').val('')
      $('#ACT_WFUNC').val('')
      $('#SCO_WFUNC').val('')
      $('#DEC_WFUNC').val('')
      if (data.length < 1) {
        return
      }
      list = data[0]
      $('#ANN_ASS_CD').val(list.ANN_ASS_CD)
      $('#WRCS_CD').val(list.WRCS_CD)
      $('#ASS_PT').val(list.ASS_PT)
      $('#TOTW_TAR').val(list.TOTW_TAR)
      $('#TOTW_ACT').val(list.TOTW_ACT)
      $('#TOTW_SCO').val(list.TOTW_SCO)
      $('#TOTW_DEC').val(list.TOTW_DEC)
      $('#ADD_TAR_IND').val(list.ADD_TAR_IND)
      $('#ADD_ACT_IND').val(list.ADD_ACT_IND)
      $('#ADD_SCO_IND').val(list.ADD_SCO_IND)
      $('#ADD_DEC_IND').val(list.ADD_DEC_IND)
      $('#TAR_IRR').val(list.TAR_IRR)
      $('#ACT_IRR').val(list.ACT_IRR)
      $('#SSCO_IRR').val(list.SSCO_IRR)
      $('#DEC_IRR').val(list.DEC_IRR)
      $('#TAR_WFUNC').val(list.TAR_WFUNC)
      $('#ACT_WFUNC').val(list.ACT_WFUNC)
      $('#SCO_WFUNC').val(list.SCO_WFUNC)
      $('#DEC_WFUNC').val(list.DEC_WFUNC)
    }
  )
}

function initDialog() {
  $('#addDialog').dialog({
    title: '年度目标完成情况考核结果',
    width: 600,
    height: 600,
    top: 40,
    closed: true,
    cache: false,
    modal: true,
    buttons: [
      {
        text: '确定',
        iconCls: 'icon-ok',
        handler: function () {
          confirm()
        }
      }
    ]
  })
  $('#chartDialog').dialog({
    title: '趋势图',
    width: 850,
    height: 700,
    top: 40,
    closed: true,
    cache: false,
    modal: true,
    buttons: [
      {
        text: '确定',
        iconCls: 'icon-ok',
        handler: function () {
          $('#chartDialog').dialog('close')
        }
      }
    ]
  })
}

// 添加
function confirm() {
  const list = {}
  list.ANN_ASS_CD = $('#ANN_ASS_CD').val()
  list.WRCS_CD = $('#WRCS_CD').val()
  list.ASS_PT = $('#ASS_PT').val()
  list.TOTW_TAR = $('#TOTW_TAR').val()
  list.TOTW_ACT = $('#TOTW_ACT').val()
  list.TOTW_SCO = $('#TOTW_SCO').val()
  list.TOTW_DEC = $('#TOTW_DEC').val()
  list.ADD_TAR_IND = $('#ADD_TAR_IND').val()
  list.ADD_ACT_IND = $('#ADD_ACT_IND').val()
  list.ADD_SCO_IND = $('#ADD_SCO_IND').val()
  list.ADD_DEC_IND = $('#ADD_DEC_IND').val()
  list.TAR_IRR = $('#TAR_IRR').val()
  list.ACT_IRR = $('#ACT_IRR').val()
  list.SSCO_IRR = $('#SSCO_IRR').val()
  list.DEC_IRR = $('#DEC_IRR').val()
  list.TAR_WFUNC = $('#TAR_WFUNC').val()
  list.ACT_WFUNC = $('#ACT_WFUNC').val()
  list.SCO_WFUNC = $('#SCO_WFUNC').val()
  list.DEC_WFUNC = $('#DEC_WFUNC').val()
  if (!$('#dialogad').val() || !$('#dialogyear').val()) {
    alert('时间和行政区不能为空')
    return
  }
  $.post(
    hwwr.basePath + 'message/gb/insertSthx_table',
    {
      json: JSON.stringify(list),
      ad_cd: $('#dialogad').val(),
      year: $('#dialogyear').val()
    },
    function (data) {
      if (data) {
        alert('添加成功')
      } else {
        alert('添加失败')
      }
    }
  )
}

/**
 * =======趋势图===========
 */
function chartDialog() {
  $('#chartDialog').dialog('open')
  //初始化弹出窗
  popChartDialog()
}

function orgMap(str) {
  const map = {}
  map['北京市'] = '京'
  map['天津市'] = '津'
  map['河北省'] = '冀'
  map['山西省'] = '晋'
  map['河南省'] = '豫'
  map['山东省'] = '鲁'
  map['内蒙古自治区'] = '蒙'
  map['辽宁省'] = '辽'
  if (str) {
    return map[str]
  }
  return map
}

function parse(num) {
  if (num === null) {
    return null
  }
  return parseInt(num) / 10000
}

function transData(data) {
  const map = {}
  //x 轴
  map.xzq = []
  // 用水总量目标',
  map.yszlmb = []
  // 用水总量实际',
  map.yszlsj = []
  // 万元工业目标',
  map.gyysmb = []
  //万元工业实际',
  map.gyyssj = []
  // 农业灌溉目标',
  map.nymb = []
  // 农业灌溉实际',
  map.nysj = []
  // 水功能区达标率目标',
  map.sgnqmb = []
  //水功能区达标率实际',
  map.sgnqsj = []
  for (let i = 0; i < data.length; ++i) {
    const row = data[i]
    const nm = orgMap(row.AD_NM)
    map.xzq.push(nm)
    // 用水总量目标
    map.yszlmb.push(parse(row.TOTW_TAR))
    // 用水总量实际',
    map.yszlsj.push(parse(row.TOTW_ACT))
    // 万元工业目标',
    map.gyysmb.push(parse(row.ADD_TAR_IND))
    //万元工业实际',
    map.gyyssj.push(parse(row.ADD_ACT_IND))
    // 农业灌溉目标',
    map.nymb.push(row.TAR_IRR)
    // 农业灌溉实际',
    map.nysj.push(row.ACT_IRR)
    // 水功能区达标率目标',
    map.sgnqmb.push(row.TAR_WFUNC)
    //水功能区达标率实际',
    map.sgnqsj.push(row.ACT_WFUNC)
  }

  return map
}

function popChartDialog() {
  const zlChart = echarts.init(document.getElementById('sthxyszlDiv'))
  const gyChart = echarts.init(document.getElementById('sthxgyysDiv'))
  const nyChart = echarts.init(document.getElementById('sthxnyblDiv'))
  const sgnqChart = echarts.init(document.getElementById('sthxsgnqdbDiv'))

  $.post(
    hwwr.basePath + 'message/gb/getSthx_table?year=' + $('#chooseyear').val(),
    {},
    function (data) {
      debugger
      const map = transData(data)
      option = {
        legend: {
          data: ['用水总量目标', '用水总量实际']
        },
        color: ['#DBBAFF', '#31A0CC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        grid: {
          top: '22%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: map.xzq
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}亿m³'
            }
          }
        ],
        series: [
          {
            name: '用水总量目标',
            type: 'line',
            data: map.yszlmb
          },
          {
            name: '用水总量实际',
            type: 'bar',
            barMaxWidth: 18,
            data: map.yszlsj
          }
        ]
      }
      option2 = {
        legend: {
          data: ['万元工业目标', '万元工业实际']
        },
        color: ['#DBBAFF', '#31A0CC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        grid: {
          top: '22%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: map.xzq
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}亿m³'
            }
          }
        ],
        series: [
          {
            name: '万元工业目标',
            type: 'line',
            data: map.gyysmb
          },
          {
            name: '万元工业实际',
            type: 'bar',
            barMaxWidth: 18,
            data: map.gyyssj
          }
        ]
      }
      option3 = {
        legend: {
          data: ['农业灌溉目标', '农业灌溉实际']
        },
        color: ['#DBBAFF', '#31A0CC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        grid: {
          top: '22%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: map.xzq
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '农业灌溉目标',
            type: 'line',
            data: map.nymb
          },
          {
            name: '农业灌溉实际',
            type: 'bar',
            barMaxWidth: 18,
            data: map.nysj
          }
        ]
      }
      option4 = {
        legend: {
          data: ['水功能区达标率目标', '水功能区达标率实际']
        },
        color: ['#DBBAFF', '#31A0CC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        grid: {
          top: '22%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: map.xzq
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '水功能区达标率目标',
            type: 'line',
            data: map.sgnqmb
          },
          {
            name: '水功能区达标率实际',
            type: 'bar',
            barMaxWidth: 18,
            data: map.sgnqsj
          }
        ]
      }
      zlChart.setOption(option)
      gyChart.setOption(option2)
      nyChart.setOption(option3)
      sgnqChart.setOption(option4)
    }
  )
}

$(document).ready(function () {
  inittable()
  initDialog()
})
