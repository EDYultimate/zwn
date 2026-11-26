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
//调水线路测站个数
let stcdNum = 0
const cdArr = []
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  $('#year').val(year)
  $('#tm').val(GetDay())
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
  param.tm = $('#tm').val()
  param.yr = $('#year').val()
  //    param.type=$("#type").val();
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/kfly/nsbd/getDayTjList',
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
        stcdNum = base.length
        for (var i = 0; i < stcdNum; i++) {
          cdArr[i] = base[i].DECD
        }

        tabhtml += '<tr>'
        tabhtml += "<td rowspan='2'>日期</td>"
        tabhtml += "<td rowspan='2' >监测项目</td>"
        tabhtml += "<td colspan='" + stcdNum + "'>监测断面</td>"
        tabhtml += '</tr>'
        //正常遍历12个月
        tabhtml += '<tr>'
        for (var i = 0; i < stcdNum; i++) {
          tabhtml += '<td style="border-top:1px solid #E1E1E1">' + base[i].NM + '</td>'
        }
        tabhtml += '</tr>'
        $('#theadtab').html(tabhtml)
        tbodyhtml += '<tr>'
        tbodyhtml += "<td rowspan='4'>" + param.tm + '</td>'

        tbodyhtml += '<td>流量（m3/s）</td>'

        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td><input  class='" +
            base[i].DECD +
            "' flag='DAY_Q' id='" +
            base[i].DECD +
            "DAY_Q'></td>"
        }
        tbodyhtml += '</tr>'

        tbodyhtml += '<tr>'
        tbodyhtml += '<td>日均流量（m3/s）</td>'

        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td><input  class='" +
            base[i].DECD +
            "' flag='AVOTQ' id='" +
            base[i].DECD +
            "AVOTQ'></td>"
        }
        tbodyhtml += '</tr>'

        tbodyhtml += '<tr>'
        tbodyhtml += '<td>累计水量(万m3)</td>'
        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            "<td><input  class='" + base[i].DECD + "' flag='SL'   id='" + base[i].DECD + "SL'></td>"
        }
        tbodyhtml += '</tr>'

        tbodyhtml += '<tr>'
        tbodyhtml += '<td>水质类型</td>'
        for (var i = 0; i < base.length; i++) {
          tbodyhtml +=
            '<td>' +
            "<select  class='" +
            base[i].DECD +
            "' flag='WQT'  id='" +
            base[i].DECD +
            "WQT'>" +
            "<option value=''></option>" +
            "<option value='1'>Ⅰ</option>" +
            "<option value='2'>Ⅱ</option>" +
            "<option value='3'>III</option>" +
            "<option value='4'>IV</option>" +
            "<option value='5'>V</option>" +
            "<option value='6'>劣V</option>" +
            '</select>' +
            '</td>'
        }
        tbodyhtml += '</tr>'
        $('#tbody').html(tbodyhtml)
        for (let k = 0; k < data.length; k++) {
          const cd = data[k].DECD
          $('#' + cd + 'AVOTQ').val(data[k].AVOTQ)
          $('#' + cd + 'DAY_Q').val(data[k].DAY_Q)
          $('#' + cd + 'SL').val(data[k].SL)
          $('#' + cd + 'WQT').val(data[k].WQT)
          $('#' + cd + 'WQT').val(data[k].WQT)
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
  for (let i = 0; i < cdArr.length; i++) {
    const cd = cdArr[i]
    const dayQ = $('#' + cd + 'DAY_Q').val()
    const sl = $('#' + cd + 'SL').val()
    const wqt = $('#' + cd + 'WQT').val()
    const avotq = $('#' + cd + 'AVOTQ').val() //流量
    if (dayQ != null && dayQ != '') {
      const map = {
        DECD: '' + cd + '',
        DAY_Q: '' + dayQ + '',
        YM: '' + $('#tm').val() + '',
        YR: '' + $('#year').val() + '',
        SL: '' + sl + '',
        WQT: '' + wqt + '',
        AVOTQ: '' + avotq + ''
      }
      list.push(map)
    }
  }

  $.ajax({
    url: basePath + '/kfly/nsbd/saveDayDate',
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
