const zbnmStr = '全部'
let zbcdStr = '全部'
let dkcdStr = ''
const dknmStr = ''

$(function () {
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')

  const date = new Date()
  const year = date.getFullYear()

  $('#btm').val(year - 10)
  $('#etm').val(year - 5)
  $('#szzb').val('全部')
  //显示地块单元选中框
  $('#dknm').show()
  $('#dkxzSpan').show()

  $('#lyfqselect').change(function () {
    $('#lynm').val('全部')
    $('#dknm').val('')
    dkcdStr = ''
    zbcdStr = ''
    const lx = $(this).val()
    if (lx == 'ly1') {
      $('#lynm').hide()
      $('#fqnmSpan').hide()
    } else {
      $('#lynm').show()
      $('#fqnmSpan').show()
    }
  })
  initZbInput()
  init()
})
function initZbInput() {
  if (zbnmStr == '') {
    $('#lynm').val('全部')
  } else {
    $('#lynm').val(zbnmStr)
  }
}
function initDkInput() {
  if (dknmStr == '') {
    $('#dknm').val('')
  } else {
    $('#dknm').val(dknmStr)
  }
}
function init() {
  $('#tmSpan').empty()
  const lytext = $('#lyfqselect').find('option:selected').text()
  $('#tmSpan').text(lytext + $('#btm').val() + '-' + $('#etm').val() + '年ET值 (mm)')
  //流域分区cd
  const cd = zbcdStr
  //地块多选种cd
  const dkcd = dkcdStr

  const param = {
    lylevel: $('#lyfqselect').val(),
    btm: $('#btm').val(),
    etm: $('#etm').val(),
    fqcdStr: cd,
    dkcdStr: dkcd
  }
  jQuery.getJSON(basePath + '/hsl/et/getHhlyETData', param, function (list) {
    $('#theadtbody').html('')
    $('#tbody').html('')
    const data = list.data
    const titleList = list.titleList
    const tmList = list.tmList
    const byr = $('#btm').val()
    const eyr = $('#etm').val()
    let theadHtml = ''
    let tbodyHtml = ''
    const tm = []
    if (data != null && data.length > 0) {
      //显示流域无类型的年表头的表格
      if (dkcdStr == '' || dkcdStr == null) {
        theadHtml += '<tr>'
        theadHtml += '<td>名称</td>'

        for (var j = 0; j < tmList.length; j++) {
          var yr = tmList[j]
          theadHtml += '<td>' + yr.YR + '</td>'
        }
        theadHtml += '</tr>'
        $('#theadtbody').append(theadHtml)

        //判断是否存在选择全部的情况，默认不选复选框或者全不选流域时，后台会查询出该流域下的所有二级或者三级分区编码，存入titleList非空，
        if (titleList != null && titleList.length > 0) {
          for (var i = 0; i < titleList.length; i++) {
            tbodyHtml +=
              "<tr onclick=\"showDialog('0','" +
              titleList[i].WRRCD +
              "','" +
              titleList[i].WRRNM +
              '\')">'
            tbodyHtml += '<td>' + titleList[i].WRRNM + '</td>'
            for (var j = 0; j < tmList.length; j++) {
              tbodyHtml += '<td id="' + titleList[i].WRRCD + tmList[j].YR + '"></td>'
            }
            tbodyHtml += '</tr>'
          }
        } //选择了流域二级或者三级种复选框，titleList就为空,需要葱复选框的字符串中获取流域编码和名称
        else {
          //从复选弹出框的页面中，传过来的选中的名称和编码
          var lycdStr = zbcdStr.split(',')
          var lynmStr = zbnmStr.split(',')
          //（一级流域）海河流域无子分区所以不带编码，直接用年份作为id
          if ($('#lyfqselect').val() == 'ly1') {
            for (var i = 0; i < lycdStr.length; i++) {
              tbodyHtml += "<tr  onclick=\"showDialog('0','00','海河流域')\">"
              tbodyHtml += '<td>海河流域</td>'
              for (var j = 0; j < tmList.length; j++) {
                tbodyHtml += '<td id=' + tmList[j].YR + '></td>'
              }
              tbodyHtml += '</tr>'
            }
          } //二三级流域分区赋id值创建表格
          else {
            for (var i = 0; i < lycdStr.length; i++) {
              tbodyHtml +=
                "<tr onclick=\"showDialog('0','" + lycdStr[i] + "','" + lynmStr[i] + '\')">'
              tbodyHtml += '<td>' + lynmStr[i] + '</td>'
              for (var j = 0; j < tmList.length; j++) {
                tbodyHtml += '<td id=' + lycdStr[i] + tmList[j].YR + '></td>'
              }
              tbodyHtml += '</tr>'
            }
          }
        }
        $('#tbody').append(tbodyHtml)
        //（一级流域）海河流域无子分区所以不带编码，直接用年份作为id
        if ($('#lyfqselect').val() == 'ly1') {
          for (var i = 0; i < data.length; i++) {
            $('#' + data[i].YR).html(data[i].ET)
          }
        } //二三级流域分区赋值
        else {
          for (var i = 0; i < data.length; i++) {
            $('#' + data[i].WRRCD + data[i].YR).html(data[i].ET)
          }
        }
      } //显示有类型的表格
      else {
        theadHtml += '<tr>'
        theadHtml += '<td>名称</td>'
        theadHtml += '<td>类型</td>'

        for (var j = 0; j < tmList.length; j++) {
          var yr = tmList[j]
          theadHtml += '<td>' + yr.YR + '</td>'
        }
        theadHtml += '</tr>'
        $('#theadtbody').append(theadHtml)

        //判断是否存在选择全部的情况，默认不选复选框或者全不选流域时，后台会查询出该流域下的所有二级或者三级分区编码，存入titleList,为非空，
        if (titleList != null && titleList.length > 0) {
          //根据子页面中的复选框选中的数组，作为表头及id值
          var typenmStr = dknmStr.split(',')
          var typecdStr = dkcdStr.split(',')
          for (var i = 0; i < titleList.length; i++) {
            tbodyHtml += '<tr >'
            tbodyHtml += '<td rowspan=' + typenmStr.length + '>' + titleList[i].WRRNM + '</td>'

            for (var k = 0; k < typenmStr.length; k++) {
              if (k == 0) {
                tbodyHtml +=
                  '<td style="color:blue" onclick="showDialog(\'' +
                  typecdStr[k] +
                  "','" +
                  titleList[i].WRRCD +
                  "','" +
                  titleList[i].WRRNM +
                  "','" +
                  typenmStr[k] +
                  '\')">' +
                  typenmStr[k] +
                  '</td>'
              } else {
                tbodyHtml +=
                  '<tr><td style="color:blue" onclick="showDialog(\'' +
                  typecdStr[k] +
                  "','" +
                  titleList[i].WRRCD +
                  "','" +
                  titleList[i].WRRNM +
                  "','" +
                  typenmStr[k] +
                  '\')">' +
                  typenmStr[k] +
                  '</td>'
              }
              for (var j = 0; j < tmList.length; j++) {
                tbodyHtml +=
                  '<td id="' + titleList[i].WRRCD + typecdStr[k] + tmList[j].YR + '"></td>'
                if (j == tmList.length - 1) {
                  tbodyHtml += '</tr>'
                }
              }
            }
          }
        } //选择了流域二级或者三级种复选框，titleList就为空,需要葱复选框的字符串中获取流域编码和名称
        else {
          //从复选弹出框的页面中，传过来的选中的名称和编码
          var lycdStr = zbcdStr.split(',')
          var lynmStr = zbnmStr.split(',')

          //所选的地块单元类型
          var typenmStr = dknmStr.split(',')
          var typecdStr = dkcdStr.split(',')
          //（一级流域）海河流域无子分区所以不带编码，直接用年份类型作为id
          if ($('#lyfqselect').val() == 'ly1') {
            for (var i = 0; i < lycdStr.length; i++) {
              tbodyHtml += '<tr>'
              tbodyHtml += '<td  rowspan=' + typenmStr.length + '>海河流域</td>'
              for (var k = 0; k < typenmStr.length; k++) {
                if (k == 0) {
                  tbodyHtml +=
                    '<td style="color:blue" onclick="showDialog(\'' +
                    typecdStr[k] +
                    "','00','海河流域','" +
                    typenmStr[k] +
                    '\')">' +
                    typenmStr[k] +
                    '</td>'
                } else {
                  tbodyHtml +=
                    '<tr><td style="color:blue" onclick="showDialog(\'' +
                    typecdStr[k] +
                    "','00','海河流域','" +
                    typenmStr[k] +
                    '\')">' +
                    typenmStr[k] +
                    '</td>'
                }
                for (var j = 0; j < tmList.length; j++) {
                  tbodyHtml += '<td id=' + typecdStr[k] + tmList[j].YR + '></td>'
                  if (j == tmList.length - 1) {
                    tbodyHtml += '</tr>'
                  }
                }
              }
            }
          } //二三级流域分区赋id值创建表格
          else {
            for (var i = 0; i < lycdStr.length; i++) {
              tbodyHtml += '<tr>'
              tbodyHtml += '<td rowspan=' + typenmStr.length + '>' + lynmStr[i] + '</td>'
              for (var k = 0; k < typenmStr.length; k++) {
                if (k == 0) {
                  tbodyHtml +=
                    '<td style="color:blue" onclick="showDialog(\'' +
                    typecdStr[k] +
                    "','" +
                    lycdStr[i] +
                    "','" +
                    lynmStr[i] +
                    "','" +
                    typenmStr[k] +
                    '\')">' +
                    typenmStr[k] +
                    '</td>'
                } else {
                  tbodyHtml +=
                    '<tr><td style="color:blue" onclick="showDialog(\'' +
                    typecdStr[k] +
                    "','" +
                    lycdStr[i] +
                    "','" +
                    lynmStr[i] +
                    "','" +
                    typenmStr[k] +
                    '\')">' +
                    typenmStr[k] +
                    '</td>'
                }
                for (var j = 0; j < tmList.length; j++) {
                  tbodyHtml += '<td id=' + lycdStr[i] + typecdStr[k] + tmList[j].YR + '></td>'
                  if (j == tmList.length - 1) {
                    tbodyHtml += '</tr>'
                  }
                }
              }
            }
          }
        }
        $('#tbody').append(tbodyHtml)
        //（一级流域）海河流域无子分区所以不带编码，直接用年份作为id
        if ($('#lyfqselect').val() == 'ly1') {
          for (var i = 0; i < data.length; i++) {
            $('#' + data[i].TCD + data[i].YR).html(data[i].ET)
          }
        } //二三级流域分区赋值
        else {
          for (var i = 0; i < data.length; i++) {
            $('#' + data[i].WRRCD + data[i].TUTYPECD + data[i].YR).html(data[i].ET)
          }
        }
      }
    }
  })
}

function openLy() {
  layer.open({
    type: 2,
    title: '流域名称',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/kfly/hsl/ET/FlName/FlName.jsp'
  })
}
function openDyxz() {
  layer.open({
    type: 2,
    title: '地块单元选择',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/kfly/hsl/ET/type/type.jsp'
  })
}

//计算两个年份之间的年份（如：2006-2009   返回：2006，2007,2008,2009）
function getYrQValue(byr, eyr) {
  const tm = []
  tm[0] = byr
  //计算出年差值
  const cz = eyr - byr
  if (cz > 0) {
    for (let i = 1; i <= cz; i++) {
      tm[i] = parseInt(byr) + parseInt(i)
    }
  }
  return tm
}

function showDialog(type, wrcd, wrnm, tynm) {
  let nm = ''
  if (type == '0') {
    nm = wrnm + 'ET值'
  } else {
    nm = wrnm + '-' + tynm + 'ET值'
  }
  layer.open({
    type: 2,
    title: nm + '趋势图',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '500px'],
    content:
      basePath + 'pages/kfly/hsl/ET/lyQstDialog/lyQstDialog.jsp?type=' + type + '&' + 'wrcd=' + wrcd
  })
}
