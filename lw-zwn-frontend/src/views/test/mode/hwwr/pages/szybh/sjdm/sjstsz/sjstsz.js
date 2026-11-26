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
      tp: '020'
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
}

function maketable() {
  $.post(
    hwwr.basePath + 'message/gb/getSjStsz',
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
      ctable.clickRow = clickRow
      ctable.genTable(results)

      //		// 生成图形
      //		makecharts(results);
    }
  )
}

function makeEmptyData() {
  return [
    { ROWNUM: '1', RV_NM: '滦河', ST_NM: '郭家屯' },
    { ROWNUM: '2', RV_NM: '滦河', ST_NM: '乌龙矶' },
    { ROWNUM: '3', RV_NM: '洒河', ST_NM: '洒河桥' },
    { ROWNUM: '4', RV_NM: '滦河', ST_NM: '大黑汀水库' },
    { ROWNUM: '5', RV_NM: '白河', ST_NM: '下堡' },
    { ROWNUM: '6', RV_NM: '潮河', ST_NM: '古北口' },
    { ROWNUM: '7', RV_NM: '潮白河', ST_NM: '赶水坝' },
    { ROWNUM: '8', RV_NM: '北运河', ST_NM: '土门楼' },
    { ROWNUM: '9', RV_NM: '泃河', ST_NM: '双村' },
    { ROWNUM: '10', RV_NM: '东洋河', ST_NM: '友谊水库' },
    { ROWNUM: '11', RV_NM: '南洋河', ST_NM: '水闸屯' },
    { ROWNUM: '12', RV_NM: '御河', ST_NM: '堡子湾' },
    { ROWNUM: '13', RV_NM: '桑干河', ST_NM: '册田水库' },
    { ROWNUM: '14', RV_NM: '壶流河', ST_NM: '壶流河水库' },
    { ROWNUM: '15', RV_NM: '永定河', ST_NM: '八号桥' },
    { ROWNUM: '16', RV_NM: '拒马河', ST_NM: '张坊' },
    { ROWNUM: '17', RV_NM: '小清河', ST_NM: '码头（东）' },
    { ROWNUM: '18', RV_NM: '琉璃河', ST_NM: '码头（西）' },
    { ROWNUM: '19', RV_NM: '唐河', ST_NM: '倒马关' },
    { ROWNUM: '20', RV_NM: '滹沱河', ST_NM: '小觉' },
    { ROWNUM: '21', RV_NM: '绵河', ST_NM: '地都' },
    { ROWNUM: '22', RV_NM: '沧浪渠', ST_NM: '窦庄子(南)' },
    { ROWNUM: '23', RV_NM: '北排水河', ST_NM: '窦庄子(北)' },
    { ROWNUM: '24', RV_NM: '清漳河', ST_NM: '刘家庄' },
    { ROWNUM: '25', RV_NM: '清漳河', ST_NM: '匡门口' },
    { ROWNUM: '26', RV_NM: '浊漳河', ST_NM: '天桥断' },
    { ROWNUM: '27', RV_NM: '漳河', ST_NM: '观台' },
    { ROWNUM: '28', RV_NM: '卫河', ST_NM: '龙王庙' },
    { ROWNUM: '29', RV_NM: '卫运河', ST_NM: '馆陶' },
    { ROWNUM: '30', RV_NM: '卫运河', ST_NM: '先锋桥' },
    { ROWNUM: '31', RV_NM: '卫运河', ST_NM: '白庄桥' },
    { ROWNUM: '32', RV_NM: '卫运河', ST_NM: '四女寺' },
    { ROWNUM: '33', RV_NM: '南运河', ST_NM: '第三店' },
    { ROWNUM: '34', RV_NM: '漳卫新河', ST_NM: '吴桥' },
    { ROWNUM: '35', RV_NM: '漳卫新河', ST_NM: '王营盘' },
    { ROWNUM: '36', RV_NM: '漳卫新河', ST_NM: '辛集闸' },
    { ROWNUM: '37', RV_NM: '马颊河', ST_NM: '南乐' },
    { ROWNUM: '38', RV_NM: '徒骇河', ST_NM: '大清集' }
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

//function test() {
//	$.post('http://10.3.34.116:8102/dataread.asmx/getWR_STAT_B',{
//		type: 'WQ'
//	},function(data) {
//
//
//	})
//}

$(document).ready(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 20
  $('.conent').css('height', height)

  inittable()
})
