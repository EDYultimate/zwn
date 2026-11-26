function finished() {
  initstyle()
}

function initstyle() {
  //	// 标题宽度设置为和表格宽度相同
  //	var width = $('#table').width();
  //	$('.titleDiv').width(width);
}

function inittable() {
  // 查询最近有数据的年份
  $.post(
    hwwr.basePath + 'message/gb/getSzyGb_Year',
    {
      tp: '018'
    },
    function (data) {
      if (!data || (data && data.length < 1)) {
        return
      }
      const obj = JSON.parse(data)
      changeyear(obj[0].YEAR)
      maketable()
    }
  )
}

function clickRow(idx) {
  const row = ctable.data[idx]
  debugger
  layer.open({
    type: 2,
    title: row.LK_NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: hwwr.basePath + '/pages/szybh/sjdm/hpsz/hpszyzl_year_qs.jsp?lk_cd=' + row.LK_CD
  })
}

function maketable() {
  $.post(
    hwwr.basePath + 'message/gb/getHpSzyzl',
    {
      year: hwwr.option.year
    },
    function (data) {
      let results = JSON.parse(data)
      if (!results || results.length == 1) {
        const newdata = makeEmptyData()
        newdata.push(results[0])
        results = newdata
      }
      option = {
        // 真实表头
        realth: $('#realth tr th[data-field]'),
        // 需要在列中合并单元格
        mergeinrows: [4, 6],
        // 最大合并列单元格个数
        mergerowcellsize: 9,
        // 数字保留小数位数(-1为不设置保留小数位)
        numfixed: 1
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.clickRow = clickRow
      ctable.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData() {
  return [
    { LK_CD: 'C13A012', LK_NM: '白洋淀', AD_NM: '河北省', WRCS_NM: '海河南系', WR_NM: '海河区' },
    { LK_CD: 'C13A013', LK_NM: '衡水湖', AD_NM: '河北省', WRCS_NM: '海河南系', WR_NM: '海河区' },
    { LK_CD: 'C13A014', LK_NM: '昆明湖', AD_NM: '北京市', WRCS_NM: '海河北系', WR_NM: '海河区' }
  ]
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
  maketable()
}

$(document).ready(function () {
  inittable()
})
