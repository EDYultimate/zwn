function finished() {
  initstyle()
}

function initstyle() {
  // 标题宽度设置为和表格宽度相同
  const width = $('#table').width()
  $('.titleDiv').width(width)
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
        realth: $('#realth tr th[data-field]')
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished
      ctable.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData() {
  return [
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '闪电河' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '庙宫' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '桃林口' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '石河' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '洋河' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '陡河' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '潘家口' },
    { WRZ_NM: '滦河及冀东沿海', RES_NM: '大黑汀' },
    { WRZ_NM: '海河北系', RES_NM: '密云' },
    { WRZ_NM: '海河北系', RES_NM: '怀柔' },
    { WRZ_NM: '海河北系', RES_NM: '海子' },
    { WRZ_NM: '海河北系', RES_NM: '白河堡' },
    { WRZ_NM: '海河北系', RES_NM: '十三陵' },
    { WRZ_NM: '海河北系', RES_NM: '北台上' },
    { WRZ_NM: '海河北系', RES_NM: '沙厂' },
    { WRZ_NM: '海河北系', RES_NM: '遥桥峪' },
    { WRZ_NM: '海河北系', RES_NM: '大水峪' },
    { WRZ_NM: '海河北系', RES_NM: '西峪' },
    { WRZ_NM: '海河北系', RES_NM: '黄松峪' },
    { WRZ_NM: '海河北系', RES_NM: '半城子' },
    { WRZ_NM: '海河北系', RES_NM: '官厅' },
    { WRZ_NM: '海河北系', RES_NM: '斋堂' },
    { WRZ_NM: '海河北系', RES_NM: '珠窝' },
    { WRZ_NM: '海河北系', RES_NM: '云州' },
    { WRZ_NM: '海河北系', RES_NM: '邱庄' },
    { WRZ_NM: '海河北系', RES_NM: ' 壶流河' },
    { WRZ_NM: '海河北系', RES_NM: '友谊' },
    { WRZ_NM: '海河北系', RES_NM: '册田' },
    { WRZ_NM: '海河北系', RES_NM: '于桥' },
    { WRZ_NM: '海河北系', RES_NM: '尔王庄' },
    { WRZ_NM: '海河南系', RES_NM: '崇青' },
    { WRZ_NM: '海河南系', RES_NM: '安各庄' },
    { WRZ_NM: '海河南系', RES_NM: '横山岭' },
    { WRZ_NM: '海河南系', RES_NM: '王快水库' },
    { WRZ_NM: '海河南系', RES_NM: '口头' },
    { WRZ_NM: '海河南系', RES_NM: '西大洋' },
    { WRZ_NM: '海河南系', RES_NM: '龙门' },
    { WRZ_NM: '海河南系', RES_NM: '东武仕' },
    { WRZ_NM: '海河南系', RES_NM: '野沟门' },
    { WRZ_NM: '海河南系', RES_NM: '朱庄' },
    { WRZ_NM: '海河南系', RES_NM: '临城' },
    { WRZ_NM: '海河南系', RES_NM: '岗南' },
    { WRZ_NM: '海河南系', RES_NM: '黄壁庄' },
    { WRZ_NM: '海河南系', RES_NM: '大浪淀' },
    { WRZ_NM: '海河南系', RES_NM: '岳城' },
    { WRZ_NM: '海河南系', RES_NM: '漳泽' },
    { WRZ_NM: '海河南系', RES_NM: '后湾' },
    { WRZ_NM: '海河南系', RES_NM: '关河' },
    { WRZ_NM: '海河南系', RES_NM: '宝泉' },
    { WRZ_NM: '海河南系', RES_NM: '汤河' },
    { WRZ_NM: '海河南系', RES_NM: '彰武' }
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
