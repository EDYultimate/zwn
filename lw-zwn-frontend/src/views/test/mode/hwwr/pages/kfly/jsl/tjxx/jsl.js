const echart_db_str = "<div id='echart_db' class='echart' style='width:80%;margin-top:20px;'></div>"
//var myChart_qs = echarts.init(document.getElementById('echart_qs'));
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
  // 设置三级区的行样式
  if ($('#oneTable').css('display') == 'none') {
    var item = $('#tbody_two tr')
    for (var i = 0; i < item.length; i++) {
      if (i % 2 != 0) {
        //	            item[i].style.backgroundColor="rgba(252, 252, 252, 1)";
      }
    }
    return
  }
  // 默认
  var item = $('#tbody tr')
  for (var i = 0; i < item.length; i++) {
    if (i % 2 != 0) {
      //            item[i].style.backgroundColor="rgba(252, 252, 252, 1)";
    }
  }
}
function search() {
  const year = $('#year').val()
  const fw = $('#fw').val()
  if (fw == 'A000000') {
    // 三级区
    $('#oneTable').hide()
    $('#twoTable').show()
  } else {
    $('#oneTable').show()
    $('#twoTable').hide()
  }
  $('#t_year').html(year) // 改变年份
  jQuery.getJSON(basePath + '/kfly/jsl/getSzyGb_Jsl', { year: year, fw: fw }, function (result) {
    let str = ''
    const data = result.list
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (fw == 'A000000') {
          // 三级区
          if (ifWide(data[i].WRCS_CD)) {
            str +=
              "<tr class='wide'  onclick=\"initLayer('" +
              data[i].WRCS_CD +
              "','" +
              data[i].NM +
              '\')">'
            //str+="<tr class='wide'>" ;
          } else {
            str += '<tr onclick="initLayer(\'' + data[i].WRCS_CD + "','" + data[i].NM + '\')">'
            //str+="<tr>" ;
          }

          str += '<td>' + isNull(data[i].AD_NM) + '</td>' + '<td>' + isNull(data[i].NM) + '</td>'
        } else {
          if (ifWide(data[i].WRCS_CD)) {
            str +=
              "<tr class='wide'  onclick=\"initLayer('" +
              data[i].WRCS_CD +
              "','" +
              data[i].NM +
              '\')">'
          } else {
            str += '<tr onclick="initLayer(\'' + data[i].WRCS_CD + "','" + data[i].NM + '\')">'
          }
          str += '<td>' + isNull(data[i].NM) + '</td>'
        }

        str +=
          '<td>' +
          isNull(data[i].WRCS_AREA) +
          '</td>' +
          '<td>' +
          isNull(data[i].CUR_PD) +
          '</td>' +
          '<td>' +
          isNull(data[i].CUR_P) +
          '</td>' +
          '<td>' +
          isNull(data[i].LY_P) +
          '</td>' +
          '<td>' +
          isNull(data[i].ANN_P) +
          '</td>' +
          '<td>' +
          isNull(data[i].LY_RT) +
          '</td>' +
          '<td>' +
          isNull(data[i].ANN_RT) +
          '</td>' +
          '</tr>'
      }
    }
    if (fw == 'A000000') {
      // 三级区
      $('#tbody_two').empty().append(str)
    } else {
      $('#tbody').empty().append(str)
    }
    setTrColor()
    if (fw != '' && fw != 'A000000') {
      // 三级区没有图
      $('#echartDiv').empty().append(echart_db_str)
      const myChart_db = echarts.init(document.getElementById('echart_db'))
      let title = ''
      if (fw == '040000') {
        title = year + '年水资源分区降水量对比分析图'
      } else {
        title = year + '年行政区降水量对比分析图'
      }
      const option = {
        title: {
          text: title
        },
        tooltip: {},
        legend: {
          data: ['当年降水量', '去年降水量', '多年平均降水量']
        },
        xAxis: {
          data: result.x
        },
        yAxis: {
          name: '亿m³'
        },
        series: [
          {
            name: '当年降水量',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: colors[0]
              }
            },
            data: result.jsl
          },
          {
            name: '去年降水量',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: colors[1]
              }
            },
            data: result.ly_jsl
          },
          {
            name: '多年平均降水量',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: colors[2]
              }
            },
            data: result.avg_jsl
          }
        ]
      }
      myChart_db.setOption(option)
    } else {
      $('#echartDiv').empty()
    }
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
    content: basePath + '/pages/kfly/jsl/tjxx/jsl_year_qs.jsp?wrcs_cd=' + wrcs_cd
  })
}
