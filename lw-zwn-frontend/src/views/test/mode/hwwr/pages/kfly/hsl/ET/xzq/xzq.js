const zbList = [
  { nm: '建设用地', cd: '7,18,12', dw: '农村居民地,非居住独立建设用地,城镇居民地', rownum: '3' },
  { nm: '林地', cd: '8,33,32,17,13', dw: '乔木绿地,落叶林,灌木林,园地,常绿林', rownum: '5' },
  {
    nm: '水域',
    cd: '11,23,22,24,19',
    dw: '季节性水体,河流水面,水库水面,沼泽地,坑塘水面',
    rownum: '5'
  },
  { nm: '自然裸露地', cd: '15,16', dw: '裸岩石砾地,永久性滩地', rownum: '2' },
  { nm: '草本用地', cd: '9,14,10,20', dw: '人工草坪,湿润草地,耕地,荒草地', rownum: '4' }
]

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
  $('#etm').val(year - 3)
  $('#szzb').val('全部')
  //显示地块单元选中框
  //	$("#dknm").show();
  //	$("#dkxzSpan").show();

  $('#lyfqselect').change(function () {
    $('#lynm').val('全部')
    $('#dknm').val('')
    dkcdStr = ''
    zbcdStr = ''
    const lx = $(this).val()
    if (lx == 'ly1') {
      $('#dkxzSpan').hide()
      $('#dknm').hide()
    } else {
      $('#dkxzSpan').show()
      $('#dknm').show()
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
  $('#tmSpan').text(lytext + $('#btm').val() + '-' + $('#etm').val() + '年ET值')
  //流域分区cd
  const cd = zbcdStr
  //地块多选种cd
  const dkcd = dkcdStr

  const param = {
    xzqlevel: $('#lyfqselect').val(),
    btm: $('#btm').val(),
    etm: $('#etm').val(),
    addvcddStr: cd,
    dkcdStr: dkcd
  }
  jQuery.getJSON(basePath + '/hsl/et/getXzqETData', param, function (list) {
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
      //显示行政区无类型的年表头的表格
      if (dkcdStr == '' || dkcdStr == null) {
        theadHtml += '<tr>'
        theadHtml += '<td>名称</td>'

        for (var j = 0; j < tmList.length; j++) {
          var yr = tmList[j]
          theadHtml += '<td>' + yr.YR + '</td>'
        }
        theadHtml += '</tr>'
        $('#theadtbody').append(theadHtml)

        //判断是否存在选择全部的情况，默认不选复选框或者全不选流域时，后台会查询出该行政区下的所有编码，存入titleList非空，
        if (titleList != null && titleList.length > 0) {
          for (var i = 0; i < titleList.length; i++) {
            tbodyHtml +=
              "<tr onclick=\"showDialog('0','" +
              titleList[i].ADDVCD +
              "','" +
              titleList[i].ADDNM +
              '\')">'
            tbodyHtml += '<td>' + titleList[i].ADDNM + '</td>'
            for (var j = 0; j < tmList.length; j++) {
              tbodyHtml += '<td id="' + titleList[i].ADDVCD + tmList[j].YR + '"></td>'
            }
            tbodyHtml += '</tr>'
          }
        } //选择了流域二级或者三级种复选框，titleList就为空,需要从复选框的字符串中获取流域编码和名称
        else {
          //从复选弹出框的页面中，传过来的选中的名称和编码
          var lycdStr = zbcdStr.split(',')
          var lynmStr = zbnmStr.split(',')

          for (var i = 0; i < lycdStr.length; i++) {
            tbodyHtml +=
              "<tr onclick=\"showDialog('0','" + lycdStr[i] + "','" + lynmStr[i] + '\')">'
            tbodyHtml += '<td>' + lynmStr[i] + '</td>'
            for (var j = 0; j < tmList.length; j++) {
              tbodyHtml += '<td id=' + lycdStr[i] + tmList[j].YR + '></td>'
            }
            tbodyHtml += '</tr>'
          }
          //					}
        }
        $('#tbody').append(tbodyHtml)
        //给表格赋值
        for (var i = 0; i < data.length; i++) {
          $('#' + data[i].ADDVCD + data[i].CHARTX).html(data[i].CHARTY)
        }
      } //显示有类型的表格
      else {
        theadHtml += '<tr>'
        theadHtml += '<td>名称</td>'
        theadHtml += '<td>类型</td>'
        theadHtml += '<td>类型</td>'

        for (var j = 0; j < tmList.length; j++) {
          var yr = tmList[j]
          theadHtml += '<td>' + yr.YR + '</td>'
        }
        theadHtml += '</tr>'
        $('#theadtbody').append(theadHtml)

        //判断是否存在选择全部的情况，初始化的时候不打开复选框或者全不选中行政区时，后台会查询出该行政区等级下的所有编码，存入titleList,为非空，
        if (titleList != null && titleList.length > 0) {
          //根据子页面中的复选框选中的数组，作为表头及id值
          var typenmStr = dknmStr.split(',')
          var typecdStr = dkcdStr.split(',')
          var rowNum = 0
          for (var i = 0; i < typenmStr.length; i++) {
            var typenm = typenmStr[i]
            for (var j = 0; j < zbList.length; j++) {
              if (zbList[j].nm == typenm) {
                console.info(zbList[j].rownum)
                rowNum = parseInt(rowNum) + parseInt(zbList[j].rownum)
              }
            }
          }
          console.info(rowNum)
          //行政区名称
          for (var i = 0; i < titleList.length; i++) {
            tbodyHtml += '<tr>'
            tbodyHtml += '<td rowspan=' + rowNum + '>' + titleList[i].ADDNM + '</td>'
            //一级指标表格初始化
            for (var k = 0; k < typenmStr.length; k++) {
              //自己定义的list中nm=一级指标名称 得出一级指标所占行数
              for (var j = 0; j < zbList.length; j++) {
                if (zbList[j].nm == typenmStr[k]) {
                  var zbcdList = zbList[j].cd
                  var zbnmList = zbList[j].dw
                  var zbArr = zbcdList.split(',')
                  var zbnmArr = zbnmList.split(',')
                  if (j == 0) {
                    tbodyHtml += '<td rowspan=' + zbList[j].rownum + '>' + typenmStr[k] + '</td>'
                    //二级指标表格初始化
                    for (var m = 0; m < zbArr.length; m++) {
                      if (m == 0) {
                        tbodyHtml +=
                          '<td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          titleList[i].ADDVCD +
                          "','" +
                          titleList[i].ADDNM +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' +
                              titleList[i].ADDVCD +
                              zbArr[m] +
                              tmList[q].YR +
                              '></td></tr>'
                          } else {
                            tbodyHtml +=
                              '<td id=' + titleList[i].ADDVCD + zbArr[m] + tmList[q].YR + '></td>'
                          }
                        }
                      } else {
                        tbodyHtml +=
                          '<tr><td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          titleList[i].ADDVCD +
                          "','" +
                          titleList[i].ADDNM +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' +
                              titleList[i].ADDVCD +
                              zbArr[m] +
                              tmList[q].YR +
                              '></td></tr>'
                          } else {
                            tbodyHtml +=
                              '<td id=' + titleList[i].ADDVCD + zbArr[m] + tmList[q].YR + '></td>'
                          }
                        }
                      }
                    }
                  } else {
                    tbodyHtml +=
                      '<tr><td rowspan=' + zbList[j].rownum + '>' + typenmStr[k] + '</td>'
                    //二级指标表格初始化
                    for (var m = 0; m < zbArr.length; m++) {
                      if (m == 0) {
                        tbodyHtml +=
                          '<td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          titleList[i].ADDVCD +
                          "','" +
                          titleList[i].ADDNM +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' +
                              titleList[i].ADDVCD +
                              zbArr[m] +
                              tmList[q].YR +
                              '></td></tr>'
                          } else {
                            tbodyHtml +=
                              '<td id=' + titleList[i].ADDVCD + zbArr[m] + tmList[q].YR + '></td>'
                          }
                          //													tbodyHtml+="<td id="+titleList[i].ADDVCD+zbArr[m]+tmList[q].YR+"></td></tr>";
                        }
                      } else {
                        tbodyHtml +=
                          '<tr><td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          titleList[i].ADDVCD +
                          "','" +
                          titleList[i].ADDNM +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' +
                              titleList[i].ADDVCD +
                              zbArr[m] +
                              tmList[q].YR +
                              '></td></tr>'
                          } else {
                            tbodyHtml +=
                              '<td id=' + titleList[i].ADDVCD + zbArr[m] + tmList[q].YR + '></td>'
                          }
                          //													tbodyHtml+="<td id="+titleList[i].ADDVCD+zbArr[m]+tmList[q].YR+"></td></tr>";
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } //选择了行政区复选框，titleList就为空,需要从复选框的字符串中获取流域编码和名称
        else {
          //从复选弹出框的页面中，传过来的选中的名称和编码
          var lycdStr = zbcdStr.split(',')
          var lynmStr = zbnmStr.split(',')

          //所选的地块单元类型
          var typenmStr = dknmStr.split(',')
          var typecdStr = dkcdStr.split(',')

          var rowNum = 0
          for (var i = 0; i < typenmStr.length; i++) {
            var typenm = typenmStr[i]
            for (var j = 0; j < zbList.length; j++) {
              if (zbList[j].nm == typenm) {
                console.info(zbList[j].rownum)
                rowNum = parseInt(rowNum) + parseInt(zbList[j].rownum)
              }
            }
          }

          //行政区名称
          for (var i = 0; i < lycdStr.length; i++) {
            tbodyHtml += '<tr>'
            tbodyHtml += '<td rowspan=' + rowNum + '>' + lynmStr[i] + '</td>'
            //一级指标表格初始化
            for (var k = 0; k < typenmStr.length; k++) {
              //自己定义的list中nm=一级指标名称 得出一级指标所占行数
              for (var j = 0; j < zbList.length; j++) {
                if (zbList[j].nm == typenmStr[k]) {
                  var zbcdList = zbList[j].cd
                  var zbnmList = zbList[j].dw
                  var zbArr = zbcdList.split(',')
                  var zbnmArr = zbnmList.split(',')
                  if (j == 0) {
                    tbodyHtml += '<td rowspan=' + zbList[j].rownum + '>' + typenmStr[k] + '</td>'
                    //二级指标表格初始化
                    for (var m = 0; m < zbArr.length; m++) {
                      if (m == 0) {
                        tbodyHtml +=
                          '<td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          lycdStr[i] +
                          "','" +
                          lynmStr[i] +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td></tr>'
                          } else {
                            tbodyHtml += '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td>'
                          }
                        }
                      } else {
                        tbodyHtml +=
                          '<tr><td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          lycdStr[i] +
                          "','" +
                          lynmStr[i] +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td></tr>'
                          } else {
                            tbodyHtml += '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td>'
                          }
                        }
                      }
                    }
                  } else {
                    tbodyHtml +=
                      '<tr><td rowspan=' + zbList[j].rownum + '>' + typenmStr[k] + '</td>'
                    //二级指标表格初始化
                    for (var m = 0; m < zbArr.length; m++) {
                      if (m == 0) {
                        tbodyHtml +=
                          '<td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          lycdStr[i] +
                          "','" +
                          lynmStr[i] +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td></tr>'
                          } else {
                            tbodyHtml += '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td>'
                          }
                        }
                      } else {
                        tbodyHtml +=
                          '<tr><td style="color:blue" onclick="showDialog(\'' +
                          zbArr[m] +
                          "','" +
                          lycdStr[i] +
                          "','" +
                          lynmStr[i] +
                          "','" +
                          zbnmArr[m] +
                          '\')">' +
                          zbnmArr[m] +
                          '</td>'
                        for (var q = 0; q < tmList.length; q++) {
                          if (q == tmList.length - 1) {
                            tbodyHtml +=
                              '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td></tr>'
                          } else {
                            tbodyHtml += '<td id=' + lycdStr[i] + zbArr[m] + tmList[q].YR + '></td>'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        $('#tbody').append(tbodyHtml)

        for (var i = 0; i < data.length; i++) {
          $('#' + data[i].ADDVCD + data[i].TUTYPECD + data[i].CHARTX).html(data[i].CHARTY)
        }
      }
    }
  })
}

function openLy() {
  layer.open({
    type: 2,
    title: '行政区名称',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/kfly/hsl/ET/xzqName/FlName.jsp'
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
    content: basePath + 'pages/kfly/hsl/ET/xzqType/type.jsp'
  })
}

function showDialog(type, wrcd, wrnm, tynm) {
  console.info(type + ',' + wrcd + ',' + wrnm + ',' + tynm)
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
      basePath +
      'pages/kfly/hsl/ET/xzqQstDialog/xzqQstDialog.jsp?type=' +
      type +
      '&' +
      'wrcd=' +
      wrcd
  })
}
