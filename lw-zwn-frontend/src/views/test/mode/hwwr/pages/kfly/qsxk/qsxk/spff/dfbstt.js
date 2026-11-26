//
let ctable = null
//
let ctable1 = null
//
const layerdata = {}

function finished() {
  initstyle()
}

function finished1() {}

function clickRow(idx) {
  debugger
  const WRZ_CD = ctable.data[idx].WRZ_CD
  const RPCD = ctable.data[idx].RPCD
  const certtype = $('#xzqselect').val()
  const tabletype = $('#fw').val()

  layer.open({
    type: 2,
    title: ctable.data[idx].WRZ_NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '550px'],
    content:
      hwwr.basePath +
      '/pages/kfly/qsxk/qsxk/spff/dfbstt_pop.jsp?WRZ_CD=' +
      WRZ_CD +
      '&RPCD=' +
      RPCD +
      '&certtype=' +
      certtype +
      '&tabletype=' +
      tabletype
  })
}

function clickRow1(idx) {
  debugger
  const WRZ_CD = ctable.data[idx].WRZ_CD
  const RPCD = ctable.data[idx].RPCD
  const certtype = $('#xzqselect').val()
  const tabletype = $('#fw').val()

  layer.open({
    type: 2,
    title: ctable.data[idx].WRZ_NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '550px'],
    content:
      hwwr.basePath +
      '/pages/kfly/qsxk/qsxk/spff/dfbstt_pop.jsp?WRZ_CD=' +
      WRZ_CD +
      '&RPCD=' +
      RPCD +
      '&certtype=' +
      certtype +
      '&tabletype=' +
      tabletype
  })
}

function initstyle() {
  //	// 标题宽度设置为和表格宽度相同
  //	var width = $('#table').width();
  //	$('.titleDiv').width(width);
}

function inittable() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '004'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      // 2015年没有数据, 先改成2012年
      data = '2012'
      changeyear(data)
      maketable()
    }
  )
}

// 过滤流域
function filter_bas(results) {
  const res = []
  for (let i = 0; i < results.length; ++i) {
    if (results[i].WRZ_NM == '流域合计') {
      continue
    }
    res.push(results[i])
  }
  return res
}

// 过滤行政区
function filter_ad(results) {
  const res = []
  debugger
  for (let i = 0; i < results.length; ++i) {
    if (results[i].PERM_INT_NM == '' && results[i].WRZ_NM != '流域合计') {
      continue
    } else if (results[i].RLW_NM == '' && results[i].WRZ_NM != '流域合计') {
      continue
    }
    res.push(results[i])
  }
  return res
}

function getUri(seltype) {
  const types = seltype.split('_')
  const str = ''
  if (types[0] == 'spff') {
    var uri = 'getDFBSTT_BAS'
    if (hwwr.option.type == 'bas') {
    } else if (hwwr.option.type == 'ad') {
      uri = 'getDFBSTT_AD'
    }
    return uri
  } else if (types[0] == 'zxdx') {
    var uri = 'getDFABLSTT_BAS'
    if (hwwr.option.type == 'bas') {
    } else if (hwwr.option.type == 'ad') {
      uri = 'getDFABLSTT_AD'
    }
    return uri
  }
  return str
}

function maketable() {
  const seltype = $('#xzqselect').val()

  const tableType = seltype.split('_')[0]

  const uri = getUri(seltype)
  $.post(
    hwwr.basePath + 'message/nb/' + uri,
    {
      year: hwwr.option.year,
      type: seltype.split('_')[1]
    },
    function (data) {
      let results = JSON.parse(data)
      if (!results || results.length <= 1) {
        const newdata = makeEmptyData()
        results = newdata
      }
      // 所选为 新批,新发,变更,延续
      if (tableType == 'spff') {
        //
        $('#table').show()
        $('#table1').hide()
        if (hwwr.option.type == 'bas') {
          results = filter_bas(results)
        } else if (hwwr.option.type == 'ad') {
          results = filter_ad(results)
        }
        option = {
          // 真实表头
          realth: $('#realth tr th[data-field]'),
          // 数字保留小数位数(-1为不设置保留小数位)
          numfixed: 0,
          // 需要在列中合并单元格
          mergeincols: [4],
          // 最大合并的单元格个数
          mergecolcellsize: 4
        }
        ctable = cgrid.instance('table', option)
        ctable.finished = finished
        ctable.clickRow = clickRow
        ctable.genTable(results)
      }
      // 所选为 注销,吊销
      else if (tableType == 'zxdx') {
        $('#table').hide()
        $('#table1').show()
        if (hwwr.option.type == 'bas') {
          results = filter_bas(results)
        } else if (hwwr.option.type == 'ad') {
          results = filter_ad(results)
        }
        option = {
          // 真实表头
          realth: $('#realth1 tr th[data-field]'),
          // 数字保留小数位数(-1为不设置保留小数位)
          numfixed: 0,
          // 需要在列中合并单元格
          mergeincols: [4],
          // 最大合并的单元格个数
          mergecolcellsize: 4
        }
        ctable1 = cgrid.instance('table1', option)
        ctable1.finished = finished1
        ctable1.clickRow = clickRow1
        ctable1.genTable(results)
      }
    }
  )
}

function makeEmptyData() {
  //	var data_bas =[{"WRZ_CD":"C010000040000","WRZ_NM":"滦河及冀东沿海","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"滦河及冀东沿海","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"滦河及冀东沿海","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"滦河及冀东沿海","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C020000040000","WRZ_NM":"海河北系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C020000040000","WRZ_NM":"海河北系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C020000040000","WRZ_NM":"海河北系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C020000040000","WRZ_NM":"海河北系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C030000040000","WRZ_NM":"海河南系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C030000040000","WRZ_NM":"海河南系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C030000040000","WRZ_NM":"海河南系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C030000040000","WRZ_NM":"海河南系","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C040000040000","WRZ_NM":"徒骇马颊河","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C040000040000","WRZ_NM":"徒骇马颊河","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C040000040000","WRZ_NM":"徒骇马颊河","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C040000040000","WRZ_NM":"徒骇马颊河","RPCD":"0400002011004"},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"流域合计","RPCD":""},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"流域合计","RPCD":""},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"流域合计","RPCD":""},
  //				{"WRZ_CD":"C010000040000","WRZ_NM":"流域合计","RPCD":""},
  //				{"WRZ_CD":"","WRZ_NM":"合计","RPCD":""}] ;
  //
  //	var data_ad = [{"WRZ_CD":"C000000110000","WRZ_NM":"北京市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000110000","WRZ_NM":"北京市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000110000","WRZ_NM":"北京市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000110000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000120000","WRZ_NM":"天津市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000120000","WRZ_NM":"天津市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000120000","WRZ_NM":"天津市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000120000","WRZ_NM":"天津市","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000120000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000130000","WRZ_NM":"河北省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000130000","WRZ_NM":"河北省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000130000","WRZ_NM":"河北省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000130000","WRZ_NM":"河北省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000130000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000140000","WRZ_NM":"山西省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000140000","WRZ_NM":"山西省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000140000","WRZ_NM":"山西省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000140000","WRZ_NM":"山西省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000140000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000410000","WRZ_NM":"河南省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000410000","WRZ_NM":"河南省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000410000","WRZ_NM":"河南省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000410000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000370000","WRZ_NM":"山东省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000370000","WRZ_NM":"山东省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000370000","WRZ_NM":"山东省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000370000","WRZ_NM":"山东省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000370000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000150000","WRZ_NM":"内蒙古","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000150000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"C000000210000","WRZ_NM":"辽宁省","RPCD":"0400002011004"},
  //	               {"WRZ_CD":"C000000210000","WRZ_NM":"小计","RPCD":""},
  //	               {"WRZ_CD":"","WRZ_NM":"流域合计","RPCD":""}];

  const data_bas = [
    { WRZ_CD: 'C010000040000', WRZ_NM: '滦河及冀东沿海', RPCD: '0400002011004' },
    { WRZ_CD: 'C020000040000', WRZ_NM: '海河北系', RPCD: '0400002011004' },
    { WRZ_CD: 'C030000040000', WRZ_NM: '海河南系', RPCD: '0400002011004' },
    { WRZ_CD: 'C040000040000', WRZ_NM: '徒骇马颊河', RPCD: '0400002011004' },
    { WRZ_CD: '', WRZ_NM: '合计', RPCD: '' }
  ]

  const data_ad = [
    { WRZ_CD: 'C000000110000', WRZ_NM: '北京市', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000120000', WRZ_NM: '天津市', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000130000', WRZ_NM: '河北省', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000140000', WRZ_NM: '山西省', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000410000', WRZ_NM: '河南省', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000370000', WRZ_NM: '山东省', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000150000', WRZ_NM: '内蒙古', RPCD: '0400002011004' },
    { WRZ_CD: 'C000000210000', WRZ_NM: '辽宁省', RPCD: '0400002011004' },
    { WRZ_CD: '', WRZ_NM: '流域合计', RPCD: '' }
  ]

  if (hwwr.option.type == 'bas') {
    return data_bas
  }

  return data_ad
}

function changeyear(year) {
  $('#chooseyear').val(year)
  $('#cyear').text(year)
  hwwr.option.year = year
}

function querybyyear() {
  const year = $('#chooseyear').val()
  $('#cyear').text(year)
  hwwr.option.year = year
  hwwr.option.type = $('#fw').val()
  maketable()
}

$(document).ready(function () {
  inittable()
})
