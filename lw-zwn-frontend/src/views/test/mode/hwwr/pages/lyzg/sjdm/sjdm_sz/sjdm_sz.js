const zbnmStr = '高锰酸盐指数,溶解氧,化学需氧量,氨氮,挥发酚'
const zbcdStr = 'codmn,dox,codcr,nh3n,vlph'
const zbdwStr = 'mg/L,mg/L,mg/L,mg/L,mg/L'
let pageSize
$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 30
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.tableDiv').css('height', tbHeight)
  //pageSize = Math.floor((tbHeight-53)/30)-1;
  pageSize = Math.floor((tbHeight - 53) / 30) - 3
  initZbInput()
  search(1)
})
//初始化指标选择
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
      $('#datemonth').val(result.datemonth)
      const zbnm = zbnmStr.split(',')
      const zbcd = zbcdStr.split(',')
      const zbdw = zbdwStr.split(',')
      let SztheadStr = ''
      let SztbodyStr = ''
      let ZbtheadStr = ''
      let ZbtbodyStr = ''
      SztheadStr +=
        '<tr  style="height:71px">' +
        '<td>省界断面</td>' +
        '<td>测站</td>' +
        '<td>河流</td>' +
        '<td>监测时间</td>' +
        '<td>水质类别</td>' +
        '<td>主要污染物及超标倍数</td>' +
        '</tr>'
      if (zbcd[0] != '') {
        ZbtheadStr += '<tr  style="height:71px">'
        for (var i = 0; i < zbcd.length; i++) {
          if (zbnm[i] == 'pH') {
            ZbtheadStr +=
              "<td title='" + zbnm[i] + "' style='width:80px;'><p>" + zbnm[i] + '</p></td>'
          } else {
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
            '<td onclick="clickST(\'' +
            data[i].STCD +
            "')\" title='" +
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
            isNull(data[i].WQG) +
            "'>" +
            isNull(data[i].WQG) +
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
              const tx = toFormatVlph(data[i][zbcd[j].toUpperCase()])
              ZbtbodyStr += "<td title='" + tx + "'>" + tx + '</td>'
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
      $('.tolSpan').html('共' + result.page.total + '条')
      $('.M-box').show()
      layer.close(index)
    }
  )
}
//点击测站，弹出监测与基础信息
function clickST(stcd) {
  const jc_src = basePath + 'pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd=' + stcd
  const info_src = basePath + 'pages/lyzg/sjdm/sjdm_sw/stinfo/stinfo.jsp?stcd=' + stcd
  layer.tab({
    area: ['850px', '500px'],
    tab: [
      {
        title: '监测信息',
        content: '<iframe src="' + jc_src + '"></iframe>'
      },
      {
        title: '基础信息',
        content: '<iframe src="' + info_src + '"></iframe>'
      }
    ]
  })
}
