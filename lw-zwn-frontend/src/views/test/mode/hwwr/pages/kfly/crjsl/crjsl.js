const colors = ['#9ad4d4', '#35abab', '#5cf7cd', '#bbbaff']
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - $('.right_menu').height() - 80
  $('.conent').css('height', height)
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    /*var src="";
		switch($(this).attr("id")){
		case 'sjdm_sz':
			src=basePath+"pages/szybh/sjdm/sjdm_sz/sjdm_sz.jsp";
			break;
		case 'sjdm_swll':
			src=basePath+"pages/kfly/gsl/dxs/gbsj/pydxs.jsp";
			break;
		case 'sjdm_sw':
			src=basePath+"pages/kfly/gsl/dxs/ldsj/dxsld.jsp";
			break;
		}
		$("#iframe").attr("src",src);*/
  })
  search()
})
function setTrColor() {
  const item = $('#tbody tr')
  for (let i = 0; i < item.length; i++) {
    if (i % 2 != 0) {
      item[i].style.backgroundColor = 'rgba(252, 252, 252, 1)'
    }
  }
}
function search() {
  const str =
    "<tr id='r1' onclick='initLayer(\"C000000110000\",\"北京\")'><td rowspan='2'>北京</td><td rowspan='2'>16800</td>" +
    '<td>入境水量</td><td>22.4</td><td>9.2</td><td>16.3</td></tr>' +
    '<tr id=\'r2\' onclick=\'initLayer("C000000110000","北京")\'><td>出境水量</td><td>29.9</td><td>10.2</td><td>20.7</td>' +
    "<tr id='r3' onclick='initLayer(\"C000000120000\",\"天津\")'><td rowspan='2'>天津</td><td rowspan='2'>11920</td>" +
    '<td>入境水量</td><td>93.3</td><td>23.6</td><td>60.8</td></tr>' +
    '<tr id=\'r4\' onclick=\'initLayer("C000000120000","天津")\'> <td>出境水量</td> <td>1.1</td><td>0.6</td><td>0.9</td></tr>' +
    "<tr id='r5' onclick='initLayer(\"C000000130000\",\"河北\")'><td rowspan='2'>河北</td><td rowspan='2'>171624</td>" +
    '<td>入境水量</td><td>81.7</td><td>28.9</td><td>57.1</td></tr>' +
    '<tr id=\'r6\' onclick=\'initLayer("C000000130000","河北")\'><td>出境水量</td><td>102.3</td><td>25.7</td><td>66.6</td></tr>' +
    "<tr id='r7' onclick='initLayer(\"C000000140000\",\"山西\")'><td rowspan='2'>山西</td><td rowspan='2'>59133</td>" +
    '<td>入境水量</td><td>0.8</td><td>0.5</td><td>0.7</td></tr>' +
    '<tr id=\'r8\' onclick=\'initLayer("C000000140000","山西")\'><td>出境水量</td><td>41.2</td><td>19.3</td><td>31.0</td></tr>' +
    "<tr id='r9' onclick='initLayer(\"C000000410000\",\"河南\")'><td rowspan='2'>河南</td><td rowspan='2'>15336</td>" +
    '<td>入境水量</td><td>4.3</td><td>3.6</td><td>4.0</td></tr>' +
    '<tr id=\'r10\' onclick=\'initLayer("C000000410000","河南")\'><td>出境水量</td><td>28.5</td><td>8.1</td><td>19.0</td></tr>' +
    "<tr id='r11' onclick='initLayer(\"C000000370000\",\"山东\")'><td rowspan='2'>山东</td><td rowspan='2'>30942</td>" +
    '<td>入境水量</td><td>18.4</td><td>3.3</td><td>11.4</td></tr>' +
    '<tr id=\'r12\' onclick=\'initLayer("C000000370000","山东")\'><td>出境水量</td><td>11.7</td><td>1.2</td><td>6.8</td></tr>' +
    "<tr id='r13' onclick='initLayer(\"C000000150000\",\"内蒙古\")'><td rowspan='2'>内蒙古</td><td rowspan='2'>12576</td>" +
    '<td>入境水量</td><td>0.2</td><td>0.1</td><td>0.1</td></tr>' +
    '<tr id=\'r14\' onclick=\'initLayer("C000000150000","内蒙古")\'><td>出境水量</td><td>4.1</td><td>2.5</td><td>3.3</td></tr>' +
    '<tr id=\'r15\' onclick=\'initLayer("C000000210000","辽宁")\'><td>辽宁</td><td>1710</td><td>出境水量</td><td>2.4</td><td>1.6</td><td>2.0</td></tr>'
  $('#tbody').empty().append(str)
  forSearch()
}
function forSearch() {
  const year = $('#year').val()
  $('#t_year').html(year)
  jQuery.getJSON(basePath + '/kfly/crjsl/getSzyGb_crjsl', { year: year }, function (data) {
    $('#year').val(year)
    $('#t_year').html(year)
    let str = ''
    if (data != null && data.length > 0) {
      $('#year').val(data[0].TM)
      $('#t_year').html(data[0].TM)
      for (var i = 0; i < data.length; i++) {
        if (i == data.length - 1) {
          var tr1 = $('#r' + (i * 2 + 1))
          str = '<td>' + isNull(data[i].OUT_PORV_WAT) + '</td>'
          tr1.append(str)
        } else {
          var tr1 = $('#r' + (i * 2 + 1))
          str = '<td>' + isNull(data[i].IN_PROV_WAT) + '</td>'
          tr1.append(str)

          var tr2 = $('#r' + (i + 1) * 2)
          str = '<td>' + isNull(data[i].OUT_PORV_WAT) + '</td>'
          tr2.append(str)
        }
      }
    } else {
      for (var i = 0; i < 8; i++) {
        var tr1 = $('#r' + (i * 2 + 1))
        str = '<td>-</td>'
        tr1.append(str)

        var tr2 = $('#r' + (i + 1) * 2)
        str = '<td>-</td>'
        tr2.append(str)
      }
    }
    setTrColor()
  })
}
function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/crjsl/crjsl_year_qs.jsp?wrcs_cd=' + wrcs_cd
  })
}
