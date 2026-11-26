const zbnmStr = '高锰酸盐指数,溶解氧,化学需氧量,氨氮,挥发酚'
const zbcdStr = 'codmn,dox,codcr,nh3n,vlph'
const zbdwStr = 'mg/L,mg/L,mg/L,mg/L,mg/L'
let pageSize
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - $('.right_menu').height() - 80 + 10
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight)
  pageSize = Math.floor((tbHeight - 35) / 30) - 1
  $('.right_menu li').click(function () {
    $('.right_menu li').css('border-bottom', '1px solid #E1E1E1')
    $('.right_menu li').css('color', 'black')
    $('.right_menu li').css('font-weight', '500')
    $(this).css('border-bottom', '3px solid rgba(2, 194, 153, 1)')
    $(this).css('color', 'rgb(0, 86, 192)')
    $(this).css('font-weight', 'bold')
  })
  initZbInput()
  $('#datemonth').val(new Date().Format('yyyy-MM'))
  search(1)
})
function initZbInput() {
  $('#szzb').val(zbnmStr)
}
//页面初始化
function search(CurrentPage) {
  const nm = $('#nm').val()
  const datemonth = $('#datemonth').val()
  $('#t_date').html(datemonth)
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  const index = layer.load()
  jQuery.getJSON(
    basePath + '/szybh/sjdm/getSjdmSzJcxx',
    { nm: nm, datemonth: datemonth, pageSize: pageSize, pageNo: CurrentPage },
    function (result) {
      console.info(result.page)
      const zbnm = zbnmStr.split(',')
      const zbcd = zbcdStr.split(',')
      const zbdw = zbdwStr.split(',')
      let SztheadStr = ''
      let SztbodyStr = ''
      let ZbtheadStr = ''
      let ZbtbodyStr = ''
      SztheadStr +=
        '<tr>' +
        '<td>省界断面</td>' +
        '<td>测站</td>' +
        '<td>河流</td>' +
        '<td>监测时间</td>' +
        '<td>水质类别</td>' +
        '<td>主要污染物及超标倍数</td>' +
        '</tr>'
      if (zbcd[0] != '') {
        ZbtheadStr += '<tr>'
        for (var i = 0; i < zbcd.length; i++) {
          ZbtheadStr +=
            "<td title='" +
            zbnm[i] +
            '(' +
            zbdw[i] +
            ")' style='width:80px;'><p>" +
            zbnm[i] +
            '(' +
            zbdw[i] +
            ')</p></td>'
        }
        ZbtheadStr += '</tr>'
      }
      const data = result.page.list
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          SztbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].RB_NM) +
            "'>" +
            isNull(data[i].RB_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].ST_NM) +
            "'>" +
            isNull(data[i].ST_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].RV_NM) +
            "'>" +
            isNull(data[i].RV_NM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].PCPTIME) +
            "'>" +
            isNull(data[i].PCPTIME) +
            '</td>' +
            "<td title='" +
            isNull(data[i].WQGNM) +
            "'>" +
            isNull(data[i].WQGNM) +
            '</td>' +
            "<td title='" +
            isNull(data[i].MESPEST) +
            "'>" +
            isNull(data[i].MESPEST) +
            '</td>' +
            '</tr>'
          if (zbcd[0] != '') {
            ZbtbodyStr += '<tr>'
            for (var j = 0; j < zbcd.length; j++) {
              ZbtbodyStr +=
                "<td title='" +
                isNull(data[i][zbcd[j].toUpperCase()]) +
                "'>" +
                isNull(data[i][zbcd[j].toUpperCase()]) +
                '</td>'
            }
            ZbtbodyStr += '</tr>'
          }
        }
        for (let x = data.length; x < pageSize; x++) {
          SztbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
          if (zbcd[0] != '') {
            ZbtbodyStr += '<tr>'
            for (var j = 0; j < zbcd.length; j++) {
              ZbtbodyStr += '<td></td>'
            }
            ZbtbodyStr += '</tr>'
          }
        }
      } else {
        for (var i = 0; i < pageSize; i++) {
          SztbodyStr +=
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
          if (zbcd[0] != '') {
            ZbtbodyStr += '<tr>'
            for (var j = 0; j < zbcd.length; j++) {
              ZbtbodyStr += '<td></td>'
            }
            ZbtbodyStr += '</tr>'
          }
        }
      }
      $('#Szthead').empty().append(SztheadStr)
      $('#Sztbody').empty().append(SztbodyStr)
      $('#Zbthead').empty().append(ZbtheadStr)
      $('#Zbtbody').empty().append(ZbtbodyStr)
      $('.M-box').pagination({
        pageCount: result.page.pages, //初始化时总页数3页
        current: CurrentPage,
        callback: function (api) {
          search(api.getCurrent())
        }
      })
      $('.M-box').show()
      layer.close(index)
    }
  )
}

function openZb() {
  layer.open({
    type: 2,
    title: '指标选择',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/common/zb/zb.jsp'
  })
}
