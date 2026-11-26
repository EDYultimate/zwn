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
      tp: '008'
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
    hwwr.basePath + 'message/nb/getRP_CTWUE_M',
    {
      year: hwwr.option.year
    },
    function (data) {
      let results = JSON.parse(data)
      if (!results || results.length < 1) {
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
      makecharts(results)
    }
  )
}

function makeEmptyData() {
  return [
    { AD_CD: '110000', AD_NM: '北京市', RPCD: '0400002011008' },
    { AD_CD: '120000', AD_NM: '天津市', RPCD: '0400002011008' },
    { AD_CD: '130100', AD_NM: '石家庄市', RPCD: '0400002011008' },
    { AD_CD: '130200', AD_NM: '唐山市', RPCD: '0400002011008' },
    { AD_CD: '130300', AD_NM: '秦皇岛市', RPCD: '0400002011008' },
    { AD_CD: '130400', AD_NM: '邯郸市', RPCD: '0400002011008' },
    { AD_CD: '130500', AD_NM: '邢台市', RPCD: '0400002011008' },
    { AD_CD: '130600', AD_NM: '保定市', RPCD: '0400002011008' },
    { AD_CD: '130700', AD_NM: '张家口市', RPCD: '0400002011008' },
    { AD_CD: '130800', AD_NM: '承德市', RPCD: '0400002011008' },
    { AD_CD: '130900', AD_NM: '沧州市', RPCD: '0400002011008' },
    { AD_CD: '131000', AD_NM: '廊坊市', RPCD: '0400002011008' },
    { AD_CD: '131100', AD_NM: '衡水市', RPCD: '0400002011008' },
    { AD_CD: '140200', AD_NM: '大同市', RPCD: '0400002011008' },
    { AD_CD: '140300', AD_NM: '阳泉市', RPCD: '0400002011008' },
    { AD_CD: '140400', AD_NM: '长治市', RPCD: '0400002011008' },
    { AD_CD: '140500', AD_NM: '晋城市', RPCD: '0400002011008' },
    { AD_CD: '140600', AD_NM: '朔州市', RPCD: '0400002011008' },
    { AD_CD: '140700', AD_NM: '晋中市', RPCD: '0400002011008' },
    { AD_CD: '140900', AD_NM: '忻州市', RPCD: '0400002011008' },
    { AD_CD: '410700', AD_NM: '新乡市', RPCD: '0400002011008' },
    { AD_CD: '410800', AD_NM: '焦作市', RPCD: '0400002011008' },
    { AD_CD: '410900', AD_NM: '濮阳市', RPCD: '0400002011008' },
    { AD_CD: '371400', AD_NM: '德州市', RPCD: '0400002011008' },
    { AD_CD: '371500', AD_NM: '聊城市', RPCD: '0400002011008' },
    { AD_CD: '371600', AD_NM: '滨州市', RPCD: '0400002011008' },
    { AD_CD: '150900', AD_NM: '乌兰察布市', RPCD: '0400002011008' },
    { AD_CD: '152500', AD_NM: '锡林郭勒盟', RPCD: '0400002011008' }
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
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', height)

  inittable1()
})
