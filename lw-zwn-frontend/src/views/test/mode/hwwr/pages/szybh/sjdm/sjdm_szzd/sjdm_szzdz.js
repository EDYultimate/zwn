const zbList = [
  { nm: '水温', cd: 'wt', dw: '℃' },
  { nm: 'pH', cd: 'ph', dw: '' },
  { nm: '高锰酸盐指数', cd: 'codmn', dw: 'mg/L' },
  { nm: '溶解氧', cd: 'dox', dw: 'mg/L' },
  { nm: '化学需氧量', cd: 'codcr', dw: 'mg/L' },
  { nm: '五日生化需氧量', cd: 'bod5', dw: 'mg/L' },
  { nm: '氨氮', cd: 'nh3n', dw: 'mg/L' },
  { nm: '总磷', cd: 'tp', dw: 'mg/L' },
  { nm: '总氮', cd: 'tn', dw: 'mg/L' },
  { nm: '铜', cd: 'cu', dw: 'mg/L' },
  { nm: '锌', cd: 'zn', dw: 'mg/L' },
  { nm: '氟化物', cd: 'f', dw: 'mg/L' },
  { nm: '硒', cd: 'se', dw: 'mg/L' },
  { nm: '砷', cd: 'ars', dw: 'mg/L' },
  { nm: '汞', cd: 'hg', dw: 'mg/L' },
  { nm: '镉', cd: 'cd', dw: 'mg/L' },
  { nm: '六价铬', cd: 'cr6', dw: 'mg/L' },
  { nm: '铅', cd: 'pb', dw: 'mg/L' },
  { nm: '氰化物', cd: 'cn', dw: 'mg/L' },
  { nm: '挥发酚', cd: 'vlph', dw: 'mg/L' },
  { nm: '阴离子表面活性剂', cd: 'las', dw: 'mg/L' },
  { nm: '石油类', cd: 'oil', dw: 'mg/L' },
  { nm: '硫化物', cd: 's2', dw: 'mg/L' },
  { nm: '粪大肠菌群', cd: 'fcg', dw: '个/L' },
  { nm: '氯化物', cd: 'cl', dw: 'mg/L' },
  { nm: '叶绿素a', cd: 'chla', dw: 'mg/L' },
  { nm: '透明度', cd: 'clarity', dw: 'm' },
  { nm: '矿化度', cd: 'mndg', dw: 'mg/L' },
  { nm: '总硬度', cd: 'thrd', dw: 'mg/L' },
  { nm: '电导率', cd: 'cond', dw: 'μS/cm' },
  { nm: '悬浮物', cd: 'ss', dw: 'mg/L' },
  { nm: '硝酸盐', cd: 'no3', dw: 'mg/L' },
  { nm: '亚硝酸盐', cd: 'no2', dw: 'mg/L' },
  { nm: '硫酸盐', cd: 'so4', dw: 'mg/L' },
  { nm: '碳酸盐', cd: 'co3', dw: 'mg/L' },
  { nm: '重碳酸盐', cd: 'hco3', dw: 'mg/L' },
  { nm: '总有机碳', cd: 'toc', dw: 'mg/L' },
  { nm: '钾', cd: 'k', dw: 'mg/L' },
  { nm: '钠', cd: 'na', dw: 'mg/L' },
  { nm: '钙', cd: 'ca', dw: 'mg/L' },
  { nm: '镁', cd: 'mg', dw: 'mg/L' },
  { nm: '铁', cd: 'fe', dw: 'mg/L' },
  { nm: '锰', cd: 'mn', dw: 'mg/L' },
  { nm: '镍', cd: 'ni', dw: 'mg/L' }
]

var pageSize
const param = {}
const zbnmStr = '高锰酸盐指数,溶解氧,化学需氧量,氨氮,挥发酚'
const zbcdStr = 'codmn,dox,codcr,nh3n,vlph'
const zbdwStr = 'mg/L,mg/L,mg/L,mg/L,mg/L'
var pageSize
$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.tableDiv').css('height', tbHeight + 'px')
  //pageSize = Math.floor((tbHeight-35)/30)-1;
  pageSize = Math.floor((tbHeight - 35) / 30) - 3
  search(1)
})

//页面初始化
function search(CurrentPage) {
  const flag = ''
  param.nm = $('#nm').val()
  param.bdat = $('#btm').val()
  param.edat = $('#etm').val()
  param.type = $('#xzqselect').val()
  param.pageSize = pageSize
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/szybh/szzdz/getSzZdzJcInfoAll', param, function (result) {
    const bdat = result.bdat
    const edat = result.edat
    $('#btm').val(bdat)
    $('#etm').val(edat)
    let SztheadStr = ''
    let SztbodyStr = ''
    let ZbtheadStr = ''
    let ZbtbodyStr = ''
    SztheadStr += '<tr style="height:71px">' + '<td>测站</td>' + '<td>监测时间</td>' + '</tr>'

    ZbtheadStr += '<tr style="height:71px">'
    for (var i = 0; i < zbList.length; i++) {
      if (zbList[i].nm == 'pH') {
        ZbtheadStr +=
          "<td title='" + zbList[i].nm + "' style='width:100px;'><p>" + zbList[i].nm + '</p></td>'
      } else {
        ZbtheadStr +=
          "<td title='" +
          zbList[i].nm +
          '(' +
          zbList[i].dw +
          ")' style='width:100px;'><p>" +
          zbList[i].nm +
          '(' +
          zbList[i].dw +
          ')</p></td>'
      }
    }
    ZbtheadStr += '</tr>'
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        SztbodyStr +=
          '<tr onclick="clickST(\'' +
          data[i].STCD +
          '\')">' +
          "<td title='" +
          isNull(data[i].ST_NM) +
          "'>" +
          isNull(data[i].ST_NM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].TM) +
          "'>" +
          isNull(data[i].TM) +
          '</td>' +
          '</tr>'

        ZbtbodyStr += '<tr>'
        for (var j = 0; j < zbList.length; j++) {
          const zbcd = zbList[j].cd
          ZbtbodyStr +=
            "<td title='" +
            isNull(data[i][zbcd.toUpperCase()]) +
            "'>" +
            isNull(data[i][zbcd.toUpperCase()]) +
            '</td>'
        }
        ZbtbodyStr += '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        SztbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '</tr>'

        ZbtbodyStr += '<tr>'
        for (var j = 0; j < zbList.length; j++) {
          ZbtbodyStr += '<td></td>'
        }
        ZbtbodyStr += '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        SztbodyStr += '<tr>' + '<td></td>' + '<td></td>' + '</tr>'
        ZbtbodyStr += '<tr>'
        for (var j = 0; j < zbList.length; j++) {
          ZbtbodyStr += '<td></td>'
        }
        ZbtbodyStr += '</tr>'
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
  })
}

//function initLayer(wrcs_cd,nm){
//	layer.open({
//	      type: 2,
//	      title: nm,
//	      shadeClose: false,
//	      shade: 0.2,
//	      maxmin: false, //开启最大化最小化按钮
//	      area: ['850px', '500px'],
//	      content: basePath+'/pages/lyzg/szzdz/szzdzDialog.jsp?wrcs_cd='+wrcs_cd
//	    });
//}

//点击测站，弹出监测与基础信息
function clickST(stcd) {
  const jc_src = basePath + 'pages/szybh/sjdm/sjdm_szzd/sjdm_szzd_dialog/stjc.jsp?stcd=' + stcd
  //	var jc_src = basePath+"pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd="+stcd;
  const info_src = basePath + 'pages/szybh/sjdm/sjdm_sz/stinfo/stinfo.jsp?stcd=' + stcd
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
