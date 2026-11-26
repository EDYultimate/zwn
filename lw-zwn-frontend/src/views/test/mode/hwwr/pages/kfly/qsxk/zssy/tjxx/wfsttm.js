let ctable1

function finished1() {
  initstyle1()
}

function initstyle1() {
  //	// 标题宽度设置为和表格宽度相同
  //	var width = $('#table1').width();
  //	$('.titleDiv1').width(width);
}

function inittable1() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/nb/getSzyNb_Year',
    {
      tp: '007'
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
  $.post(
    hwwr.basePath + 'message/nb/getWFSTT_M',
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
        numfixed: 2,
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
  return [
    { AD_CD: '110000', AD_NM: '北京市', RPCD: '0400002011009' },
    { AD_CD: '120000', AD_NM: '天津市', RPCD: '0400002011009' },
    { AD_CD: '130000', AD_NM: '河北省', RPCD: '0400002011009' },
    { AD_CD: '140000', AD_NM: '山西省', RPCD: '0400002011009' },
    { AD_CD: '410000', AD_NM: '河南省', RPCD: '0400002011009' },
    { AD_CD: '370000', AD_NM: '山东省', RPCD: '0400002011009' },
    { AD_CD: '150000', AD_NM: '内蒙古自治区', RPCD: '0400002011009' },
    { AD_CD: '210000', AD_NM: '辽宁省', RPCD: '0400002011009' },
    { AD_CD: '', AD_NM: '合计', RPCD: '' }
  ]
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
  maketable1()
}

$(document).ready(function () {
  inittable1()
})
