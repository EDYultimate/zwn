//

// var mothArr = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
//var mothNumArr = ["1","2","3","4","5","6","7","8","9","10","11","12"];
//var wrz_cdArr=["CAA00000000S","CC000000000S","CGA00000000E","C13A0171","C13A012"];
const param = {}
//var theadHtmlM="<tr><td>河流</td><td>控制断面</td><td>1月</td>" +
//		"<td>2月</td><td>3月</td><td>4月</td><td>5月</td><td>6月</td><td>7月</td><td>8月</td>" +
//		"<td>9月</td><td>10月</td><td>11月</td><td>12月</td><td>目标值</td></tr>";
//var theadHtmlX="<tr><td>河流</td><td>控制断面</td><td>旬</td><td>1月</td>" +
//"<td>2月</td><td>3月</td><td>4月</td><td>5月</td><td>6月</td><td>7月</td><td>8月</td>" +
//"<td>9月</td><td>10月</td><td>11月</td><td>12月</td><td>目标值</td></tr>";
//滦河测站编码

$(function () {
  ini()
})

//function getYr(){
//	var bodyheight=$(document.body).outerHeight(true);
//	var tbHeight = bodyheight-130;
//
//	$(".conent").css("height",tbHeight);
//	var now = new Date();
//	var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
//	var year = date.getFullYear();
//	$("#year").val(year);
//	ini();
//}

function ini() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#t_year').text($('#year').val())
  param.yr = $('#year').val()
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getQYzInfo',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      let tbodyHtml = ''

      for (let i = 0; i < result.length; i++) {
        const VAL = isNull(result[i].VAL)
        const STCD = result[i].STCD
        const STNM = result[i].ST_NM
        tbodyHtml += '<tr>'
        tbodyHtml += '<td>' + STNM + '</td>' //
        tbodyHtml += "<td><input id='" + STCD + "' value='" + VAL + "' class='readInput'></td>" //
        tbodyHtml += '</tr>'
      }
      $('#lh_slqtbody').html(tbodyHtml)
      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

function saveData() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  const list = []
  $('.readInput').each(function () {
    const idStr = $(this).attr('id')
    const val = $(this).val().trim()

    if (val != '' && parseInt(val) >= 0) {
      const map = {}
      map.STCD = idStr
      map.VAL = val
      list.push(map)
    }
  })

  console.info(list)

  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/saveQStcdYzDate',
    data: 'setList=' + JSON.stringify(list), //参数
    dataType: 'json',
    type: 'post',
    success: function (result) {
      //关闭遮罩层
      layer.close(index_load)
      alert(result.info)
      ini()
    }
  })
}
