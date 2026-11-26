const mothArr = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]
const mothNumArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const param = {}
$(function () {
  //	var date = new Date();
  //	var year = date.getFullYear();
  //	$("#year").val(year);
  getYr()
})

function getYr() {
  $.ajax({
    url: basePath + '/kfly/nsbd/getRouteYr',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      if (data.length > 0) {
        $('#year').val(data[0].YR)
      }
      getSel()
    }
  })
}
function getSel() {
  $.ajax({
    url: basePath + '/kfly/nsbd/getRouteList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      let html = ''
      for (let i = 0; i < data.length; i++) {
        html += '<option value="' + data[i].CD + '">' + data[i].NM + '</option>'
      }
      $('#fw').html(html)
      ini()
    }
  })
}
//function getYr(){
//	var cd=$("#fw").val();
//	param.cd=cd;
//	$.ajax({
//	    url: basePath+"/kfly/nsbd/getYrList",
//	    data: param,
//	    dataType : "json",
//	    type: 'post',
//	    success: function(data) {
//	    	if(data.length>0){
//	    		$("#year").val(data[0].yr);
//	    	}else{
//	    		var date = new Date();
//	    		var year = date.getFullYear();
//	    		$("#year").val(year);
//	    	}
//	    	ini();
//	    }
//	    });
//}
function ini() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#t_year').text(
    $('#fw').find('option:selected').text() +
      $('#year').val() +
      $('#type').find('option:selected').text()
  )
  param.cd = $('#fw').val()
  param.yr = $('#year').val()
  param.type = $('#type').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/kfly/nsbd/getTjList',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      const data = result.data
      const base = result.base

      let tabhtml = ''
      let tbodyhtml = ''
      if (base.length > 0) {
        const startm = base[0].DDTM_STAR
        const endtm = base[0].DDTM_END
        //比较开始结束时间大小，判断时间跨度,开始时间月份小于结束时间，说明没跨年；如果起始时间大于结束时间，中间有跨年
        //未跨年,整年的1-12月
        if (parseInt(startm) < parseInt(endtm)) {
          tabhtml += '<tr>'
          tabhtml += "<td rowspan='2' colspan='2'>名称</td>"
          tabhtml += "<td colspan='12'>" + param.yr + '</td>'
          tabhtml += "<td rowspan='2'>合计</td>"
          tabhtml += '</tr>'
          //正常遍历12个月
          tabhtml += '<tr>'
          for (var i = 0; i < mothArr.length; i++) {
            tabhtml += '<td style="border-top:1px solid #E1E1E1">' + mothArr[i] + '</td>'
          }
          tabhtml += '</tr>'
        } //跨年
        else {
          const yr1col = 12 - parseInt(endtm)
          tabhtml += '<tr>'
          tabhtml += "<td rowspan='2' colspan='2'>名称</td>"
          tabhtml += "<td colspan='" + yr1col + "'>" + param.yr + '</td>'
          tabhtml += "<td colspan='" + endtm + "'>" + (parseInt(param.yr) + 1) + '</td>'
          tabhtml += "<td rowspan='2'>合计</td>"
          tabhtml += '</tr>'
          //遍历从几月开始到明年几月结束
          tabhtml += '<tr>'
          for (var i = startm - 1; i < mothArr.length; i++) {
            tabhtml += '<td style="border-top:1px solid #E1E1E1">' + mothArr[i] + '</td>'
          }
          for (var i = 0; i < endtm; i++) {
            tabhtml += '<td style="border-top:1px solid #E1E1E1">' + mothArr[i] + '</td>'
          }
          tabhtml += '</tr>'
        }
        $('#theadtab').html(tabhtml)
        for (var i = 0; i < base.length; i++) {
          const decd = base[i].DECD
          const nm = base[i].NM
          //未跨年表格html
          if (parseInt(startm) < parseInt(endtm)) {
            tbodyhtml += '<tr>'
            tbodyhtml += '<td>' + nm + '</td>'
            tbodyhtml += '<td>' + $('#type').find('option:selected').text() + '</td>'
            for (var j = 0; j < mothArr.length; j++) {
              tbodyhtml +=
                '<td >' +
                "<input yr='" +
                param.yr +
                "' id='" +
                decd +
                mothNumArr[j] +
                param.type +
                "'>" +
                '</td>'
            }
            tbodyhtml +=
              "<td><input yr='" + param.yr + "'  id='" + decd + 'hj' + param.type + "'></td>"
            tbodyhtml += '</tr>'
          } //跨年表格html
          else {
            tbodyhtml += '<tr>'
            tbodyhtml += '<td>' + nm + '</td>'
            tbodyhtml += '<td>' + $('#type').find('option:selected').text() + '</td>'
            for (var j = parseInt(startm) - 1; j < mothArr.length; j++) {
              tbodyhtml +=
                '<td>' +
                "<input yr='" +
                param.yr +
                "' id='" +
                decd +
                mothNumArr[j] +
                param.type +
                "'>" +
                '</td>'
            }
            for (var j = 0; j < endtm; j++) {
              tbodyhtml +=
                '<td>' +
                "<input yr='" +
                (parseInt(param.yr) + 1) +
                "' id='" +
                decd +
                mothNumArr[j] +
                param.type +
                "'>" +
                '</td>'
            }
            tbodyhtml += "<td ><input id='" + decd + 'hj' + $('#type').val() + "'></td>"
            tbodyhtml += '</tr>'
          }
        }
        $('#tbody').html(tbodyhtml)
        for (let k = 0; k < data.length; k++) {
          const cd = data[k].DECD
          let moth = data[k].YM
          if (moth != 'hj') {
            moth = data[k].YM.substr(5)
          }
          const type = data[k].TYPETB
          const val = data[k].VAL
          $('#' + cd + moth + type).val(val)
        }
      }
      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

function save() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  const list = []

  $('#tbody')
    .find('tr')
    .each(function () {
      let hj = 0
      let k = 0
      $(this)
        .find('td')
        .each(function (i) {
          if (i > 1) {
            const val = $(this).find('input').val()
            const id = $(this).find('input').attr('id')
            const year = $(this).find('input').attr('yr')
            const decd = id.substr(0, id.length - 3)
            const moth = id.substr(id.length - 3, 2)
            const type = id.substr(id.length - 1, 1)
            //				addArr.push(isNullL());
            let map = {}
            if (val != '') {
              k++
              if (moth != 'hj') {
                hj += parseFloat(val)
                map = {
                  DECD: '' + decd + '',
                  YM: '' + year + '-' + moth + '',
                  YR: '' + $('#year').val() + '',
                  TYPETB: '' + type + '',
                  VAL: '' + val + ''
                }
                list.push(map)
              }
            }
            if (moth == 'hj' && k > 0) {
              map = {
                DECD: '' + decd + '',
                YM: 'hj',
                YR: '' + $('#year').val() + '',
                TYPETB: '' + type + '',
                VAL: '' + hj + ''
              }
              list.push(map)
            }
          }
        })
    })

  $.ajax({
    url: basePath + '/kfly/nsbd/saveDate',
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
