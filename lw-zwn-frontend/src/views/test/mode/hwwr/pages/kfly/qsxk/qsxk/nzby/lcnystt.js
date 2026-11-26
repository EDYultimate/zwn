let ctable1

function finished1() {
  initstyle1()
}

function initstyle1() {
  // 标题宽度设置为和表格宽度相同
  const width = $('#table1').width()
  $('.titleDiv1').width(width)
}

function inittable1() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '006'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      changeyear1(data)
      maketable1()
    }
  )
}

function maketable1() {
  let uri = 'getLCNYSTT_BAS'
  if (hwwr.option.type == 'bas') {
  } else if (hwwr.option.type == 'ad') {
    uri = 'getLCNYSTT_AD'
  }

  $.post(
    hwwr.basePath + 'message/nb/' + uri,
    {
      year: hwwr.option.year
    },
    function (data) {
      let results = JSON.parse(data)
      if (!results || results.length <= 1) {
        const newdata = makeEmptyData()
        results = newdata
      }
      option = {
        // 真实表头
        realth: $('#realth1 tr th[data-field]'),
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 1,
        // 需要在列中合并单元格
        mergeincols: [4],
        // 最大合并的单元格个数
        mergecolcellsize: 4
      }
      ctable1 = cgrid.instance('table1', option)
      ctable1.finished = finished1
      ctable1.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData() {
  const data_bas = [
    { WRZ_NM: '滦河及冀东沿海', RPCD: '0400002011006', WRCS_CD: 'C010000040000' },
    { WRZ_NM: '海河北系', RPCD: '0400002011006', WRCS_CD: 'C020000040000' },
    { WRZ_NM: '海河南系', RPCD: '0400002011006', WRCS_CD: 'C030000040000' },
    { WRZ_NM: '徒骇马颊河', RPCD: '0400002011006', WRCS_CD: 'C040000040000' },
    { WRZ_NM: '合计', RPCD: '', WRCS_CD: '' }
  ]

  const data_ad = [
    { WRZ_NM: '北京市', RPCD: '0400002011006', WRCS_CD: 'C000000110000' },
    { WRZ_NM: '天津市', RPCD: '0400002011006', WRCS_CD: 'C000000120000' },
    { WRZ_NM: '河北省', RPCD: '0400002011006', WRCS_CD: 'C000000130000' },
    { WRZ_NM: '山西省', RPCD: '0400002011006', WRCS_CD: 'C000000140000' },
    { WRZ_NM: '河南省', RPCD: '0400002011006', WRCS_CD: 'C000000410000' },
    { WRZ_NM: '山东省', RPCD: '0400002011006', WRCS_CD: 'C000000370000' },
    { WRZ_NM: '内蒙古', RPCD: '0400002011006', WRCS_CD: 'C000000150000' },
    { WRZ_NM: '辽宁省', RPCD: '0400002011006', WRCS_CD: 'C000000210000' },
    { WRZ_NM: '海委', RPCD: '0400002011006', WRCS_CD: 'C000000040000' },
    { WRZ_NM: '合计', RPCD: '', WRCS_CD: '' }
  ]

  hwwr.option.type = $('#fw').val()
  if (hwwr.option.type == 'bas') {
    return data_bas
  }

  return data_ad
}

function changeyear1(year) {
  $('#chooseyear').val(year)
  $('#cyear1').text(year)
  hwwr.option.year = year
}

/**
 * ====================== 公用方法 =================
 */
function querybyyear() {
  const year = $('#chooseyear').val()
  $('#cyear1').text(year)
  hwwr.option.year = year
  hwwr.option.type = $('#fw').val()
  maketable1()
}

$(document).ready(function () {
  inittable1()
})
