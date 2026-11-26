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
      tp: '019'
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
    title: row.RES_NM,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: hwwr.basePath + 'pages/szybh/sjdm/sksz/sksz_year_qs.jsp?res_cd=' + row.RES_CD
  })
}

function maketable() {
  $.post(
    hwwr.basePath + 'message/gb/getSkSzyzl',
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
        realth: $('#realth tr th[data-field]'),
        // 需要在列中合并单元格
        mergeincols: [3, 4, 5]
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
    { RES_CD: '130828000002', WRZ_NM: '滦河及冀东沿海', RES_NM: '庙宫水库' },
    { RES_CD: '130724000001', WRZ_NM: '滦河及冀东沿海', RES_NM: '闪电河水库' },
    { RES_CD: '130321000018', WRZ_NM: '滦河及冀东沿海', RES_NM: '桃林口水库' },
    { RES_CD: '130523000010', WRZ_NM: '滦河及冀东沿海', RES_NM: '石河水库' },
    { RES_CD: '130721000007', WRZ_NM: '滦河及冀东沿海', RES_NM: '洋河水库' },
    { RES_CD: '130205000001', WRZ_NM: '滦河及冀东沿海', RES_NM: '陡河水库' },
    { RES_CD: '130227000074', WRZ_NM: '滦河及冀东沿海', RES_NM: '潘家口枢纽水库' },
    { RES_CD: '130227000059', WRZ_NM: '滦河及冀东沿海', RES_NM: '大黑汀枢纽水库' },
    { RES_CD: '110117000001', WRZ_NM: '海河北系', RES_NM: '海子水库' },
    { RES_CD: '110228000017', WRZ_NM: '海河北系', RES_NM: '密云水库' },
    { RES_CD: '110116000016', WRZ_NM: '海河北系', RES_NM: '怀柔水库' },
    { RES_CD: '110114000001', WRZ_NM: '海河北系', RES_NM: '十三陵水库' },
    { RES_CD: '110109000001', WRZ_NM: '海河北系', RES_NM: '斋堂水库' },
    { RES_CD: '110228000023', WRZ_NM: '海河北系', RES_NM: '遥桥峪水库' },
    { RES_CD: '110117000002', WRZ_NM: '海河北系', RES_NM: '黄松峪水库' },
    { RES_CD: '110228000010', WRZ_NM: '海河北系', RES_NM: '半城子水库' },
    { RES_CD: '110116000012', WRZ_NM: '海河北系', RES_NM: '北台上水库' },
    { RES_CD: '110228000021', WRZ_NM: '海河北系', RES_NM: '沙厂水库' },
    { RES_CD: '110116000017', WRZ_NM: '海河北系', RES_NM: '大水峪水库' },
    { RES_CD: '110117000003', WRZ_NM: '海河北系', RES_NM: '西峪水库' },
    { RES_CD: '120225000001', WRZ_NM: '海河北系', RES_NM: '于桥水库' },
    { RES_CD: '120115000001', WRZ_NM: '海河北系', RES_NM: '尔王庄水库' },
    { RES_CD: '130730000002', WRZ_NM: '海河北系', RES_NM: '官厅水库' },
    { RES_CD: '110229000001', WRZ_NM: '海河北系', RES_NM: '白河堡水库' },
    { RES_CD: '130726000001', WRZ_NM: '海河北系', RES_NM: '壶流河水库' },
    { RES_CD: '130732000001', WRZ_NM: '海河北系', RES_NM: '云州水库' },
    { RES_CD: '130208000001', WRZ_NM: '海河北系', RES_NM: '邱庄水库' },
    { RES_CD: '130725000009', WRZ_NM: '海河北系', RES_NM: '友谊水库' },
    { RES_CD: '140227000016', WRZ_NM: '海河北系', RES_NM: '册田水库' },
    { RES_CD: '110111000002', WRZ_NM: '海河南系', RES_NM: '崇青水库' },
    { RES_CD: '130582000002', WRZ_NM: '海河南系', RES_NM: '朱庄水库' },
    { RES_CD: '130634000021', WRZ_NM: '海河南系', RES_NM: '王快水库' },
    { RES_CD: '130627000011', WRZ_NM: '海河南系', RES_NM: '西大洋水库' },
    { RES_CD: '130522000001', WRZ_NM: '海河南系', RES_NM: '临城水库' },
    { RES_CD: '130131000061', WRZ_NM: '海河南系', RES_NM: '岗南水库' },
    { RES_CD: '130185000004', WRZ_NM: '海河南系', RES_NM: '黄壁庄水库' },
    { RES_CD: '130927000001', WRZ_NM: '海河南系', RES_NM: '大浪淀水库' },
    { RES_CD: '130633000013', WRZ_NM: '海河南系', RES_NM: '安格庄水库' },
    { RES_CD: '130126000053', WRZ_NM: '海河南系', RES_NM: '横山岭水库' },
    { RES_CD: '130125000014', WRZ_NM: '海河南系', RES_NM: '口头水库' },
    { RES_CD: '130427000009', WRZ_NM: '海河南系', RES_NM: '东武仕水库' },
    { RES_CD: '410782000006', WRZ_NM: '海河南系', RES_NM: '宝泉水库' },
    { RES_CD: '410506000011', WRZ_NM: '海河南系', RES_NM: '彰武水库' },
    { RES_CD: '410523000010', WRZ_NM: '海河南系', RES_NM: '汤河水库' },
    { RES_CD: '140411000001', WRZ_NM: '海河南系', RES_NM: '漳泽水库' },
    { RES_CD: '140423000010', WRZ_NM: '海河南系', RES_NM: '后湾水库' },
    { RES_CD: '140429000003', WRZ_NM: '海河南系', RES_NM: '关河水库' },
    { RES_CD: '130427000002', WRZ_NM: '海河南系', RES_NM: '岳城水库' }
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
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 20
  $('.conent').css('height', height)

  inittable()
})
