const pageSize = 5
$(document).ready(function () {
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let SztbodyStr = ''
  const nm = $('#nm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  //	var index = layer.load();
  jQuery.getJSON(
    basePath + '/jdjc/getWPCBasicInfo',
    { wrpnm: nm, pageSize: pageSize, pageNo: CurrentPage },
    function (result) {
      const data = result.page.list
      console.info(result)
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          SztbodyStr +=
            '<tr>' +
            '<td>' +
            ((CurrentPage - 1) * pageSize + (i + 1)) +
            '</td>' +
            "<td title='" +
            data[i].WPC_SN +
            "'>" +
            isNull(data[i].WPC_SN) +
            '</td>' +
            "<td title='" +
            data[i].WRP_NM +
            "'>" +
            isNull(data[i].WRP_NM) +
            '</td>' +
            "<td title='" +
            data[i].INT_NM +
            "'>" +
            isNull(data[i].INT_NM) +
            '</td>' +
            '<td onclick="choose(\'' +
            isNull(data[i].WPC_CD) +
            "','" +
            isNull(data[i].WPC_SN) +
            "','" +
            isNull(data[i].WRP_NM) +
            "'," +
            "'" +
            isNull(data[i].CONC_ORG) +
            "','" +
            isNull(data[i].AD_NM) +
            "','" +
            isNull(data[i].WW) +
            "'," +
            "'" +
            isNull(data[i].GW_WW) +
            "','" +
            isNull(data[i].SW_WW) +
            "','" +
            isNull(data[i].LR_NM) +
            "','" +
            isNull(data[i].DRAW_STAFF) +
            "','" +
            isNull(data[i].INT_USE) +
            "')\"'>选择</td>" +
            '</tr>'
        }
      } else {
        for (var i = 0; i < pageSize; i++) {
          SztbodyStr +=
            '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      }
      //		$("#Szthead").empty().append(SztheadStr);
      $('#Sztbody').empty().append(SztbodyStr)

      $('.M-box').pagination({
        pageCount: result.page.pages, //初始化时总页数3页
        current: CurrentPage,
        callback: function (api) {
          search(api.getCurrent())
        }
      })
      $('.tolSpan').html('共' + result.page.total + '条')
      $('.M-box').show()
      //		layer.close(index);
    }
  )
}

function choose(wpc_cd, wpc_sn, wrp_nm, conc_org, ad_nm, ww, gw, sw, lr_nm, draw_staff, int_use) {
  parent.wpc_obj.wpc_cd = wpc_cd
  parent.wpc_obj.wpc_sn = wpc_sn
  parent.wpc_obj.wrp_nm = wrp_nm
  parent.wpc_obj.conc_org = conc_org
  parent.wpc_obj.ad_nm = ad_nm
  parent.wpc_obj.ww = ww //许可水量
  parent.wpc_obj.gw = gw //地下水许可水量
  parent.wpc_obj.sw = sw //地表水许可水量
  parent.wpc_obj.draw_staff = draw_staff //联系人
  parent.wpc_obj.lr_nm = lr_nm //法人代表

  parent.setInput(wpc_cd, wpc_sn, wrp_nm, conc_org, ad_nm, ww, gw, sw, lr_nm, draw_staff, int_use)
  parent.layer.closeAll()
}
