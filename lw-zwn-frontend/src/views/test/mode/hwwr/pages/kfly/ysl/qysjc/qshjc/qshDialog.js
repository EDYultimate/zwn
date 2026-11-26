const param = {}

$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')
  /* $("#beginTm").val(getLastMYM()+"-01");
    $("#endTm").val(getCurrentYMD());*/

  $('#bdat').val(getLastMYM() + '-01')
  $('#edat').val(new Date().Format('yyyy-MM-dd'))
  init()
})

function init() {
  getTm()
  /*  var param = {"cd":wiu_cd,"beginTm":$("#beginTm").val(),"endTm":$("#endTm").val()};*/
  param.cd = wiu_cd
  jQuery.getJSON(basePath + '/kfly/ysl/getQshQslQst', param, function (list) {
    const x = []
    const dat = []
    if (list != null && list.length > 0) {
      let str = ''
      for (let i = list.length - 1; i >= 0; i--) {
        str +=
          '<tr>' +
          /*"<td>"+dateTimeHFormate1(list[i].TM)+"</td>" +*/
          '<td>' +
          list[i].TM +
          '</td>' +
          '<td>' +
          isNull(list[i].W) +
          '</td>' +
          '</tr>'
      }
      for (let j = 0; j < list.length; j++) {
        x[j] = dateTimeHFormate1(list[j].TM)
        dat[j] = isNull(list[j].W)
      }
      $('#tbody').empty().append(str)
    }
    const option = {
      title: {
        text: '取水户取水量趋势分析图',
        x: 'center'
      },
      tooltip: {},
      legend: {
        data: ['取水量'],
        x: 'right'
      },
      xAxis: {
        data: x
      },
      yAxis: {
        name: '万m³'
      },
      series: [
        {
          name: '取水量',
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#9ad4d4'
              }
            }
          },
          data: dat
        }
      ]
    }
    const myChart_qs = echarts.init(document.getElementById('rightDiv'))
    myChart_qs.setOption(option)
  })
}

//获取时间参数
function getTm() {
  const tjtp = $('input:radio[name=radio]:checked').val()
  let bdat
  let edat
  if (tjtp == '1') {
    bdat = $('#bdat').val()
    edat = $('#edat').val()
  } else if (tjtp == '2') {
    bdat = $('#bdat1').val()
    edat = $('#edat1').val()
  }
  param.bdat = bdat
  param.edat = edat
  param.tjtp = tjtp
  return param
}

//切换时间
$('input:radio[name=radio]').change(function () {
  if ($('input:radio[name=radio]:checked').val() == '1') {
    //日
    $('#dy').css('display', '')
    $('#mn').css('display', 'none')
    $('#bdat').val(getLastMYM() + '-01')
    $('#edat').val(new Date().Format('yyyy-MM-dd'))
  } else if ($('input:radio[name=radio]:checked').val() == '2') {
    //月
    $('#mn').css('display', '')
    $('#dy').css('display', 'none')
    $('#bdat1').val(getLastYM())
    $('#edat1').val(new Date().Format('yyyy-MM'))
  }
})
