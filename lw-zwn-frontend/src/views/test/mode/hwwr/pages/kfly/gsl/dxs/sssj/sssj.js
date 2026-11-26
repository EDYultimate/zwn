let pageSize
const param = {}

$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height()
  $('.conent').css('height', height)
  const tbHeight = $('.conent').height() - $('.titleDiv').height() - $('.M-box').height()
  $('.tableDiv').css('height', tbHeight)
  pageSize = Math.floor((tbHeight - 35) / 30) - 1

  $('#btm').val(new Date().Format('yyyy-MM') + '-01')
  $('#etm').val(new Date().Format('yyyy-MM-dd'))
  search(1)
})
//  var param={};
//
//$(function(){
//	  $("#btm").val(GetDay());
//	  $("#etm").val(getCurrentYMD());
//	  ini();
//  });
//

//页面初始化
function search(CurrentPage) {
  const tbodyStr = ''
  const btm = $('#btm').val()
  const etm = $('#etm').val()
  const type = $('#type').val()
  const stnm = $('#stnm').val()
  param.btm = btm
  param.etm = etm
  param.type = type
  param.stnm = stnm
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + '/gsl/dxs/getDxsSsjc', param, function (result) {
    let str = ''
    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        str +=
          '<tr onclick="initLayer(\'' +
          data[i].STCD +
          "','" +
          data[i].STNM +
          '\')">' +
          '<td>' +
          isNull(data[i].STNM) +
          '</td>' +
          '<td>' +
          toType(data[i].QM) +
          '</td>' +
          '<td>' +
          isNull(data[i].AD_NM) +
          '</td>' +
          '<td>' +
          isNull(data[i].WRZ_NM) +
          '</td>' +
          '<td>' +
          dateTimeHFormate1(data[i].TM) +
          '</td>' +
          '<td>' +
          isNull(data[i].BD) +
          '</td>' +
          '<td></td>' +
          '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        str +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        str +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '</tr>'
      }
    }
    $('#tbody').empty().append(str)
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

//  function ini(){
//	  var btm = $("#btm").val();
//		var etm = $("#etm").val();
//		var type = $("#type").val();
//		var stnm = $("#stnm").val();
//		param.btm=btm;
//		param.etm=etm;
//		param.type=type;
//		param.stnm=stnm;
//		jQuery.getJSON(basePath+"/gsl/dxs/getDxsSsjc",param,function(data){
//			var str = "";
//			if(data!=null && data.length>0){
//				for(var i=0;i<data.length;i++){
//				str+="<tr><td>"+isNull(data[i].STCD)+"</td>" +
//				"<td>"+isNull(data[i].STNM)+"</td>" +
//				"<td>"+toType(data[i].QM)+"</td>" +
//				"<td>"+isNull(data[i].AD_NM)+"</td>" +
//				"<td>"+isNull(data[i].WRZ_NM)+"</td>" +
//				"<td>"+dateTimeFormate(data[i].TM)+"</td>" +
//				"<td>"+isNull(data[i].BD)+"</td>" +
//				"</tr>";
//				}
//			}
//			$("#tbody").empty().append(str);
//			});
//  }

function toType(type) {
  let tp = ''
  switch (type) {
    case '0':
      tp = '孔隙水'
      break
    case '1':
      tp = '裂隙水'
      break
    case '2':
      tp = '岩溶水'
      break
    case '3':
      tp = '孔隙裂隙水'
      break
    case '4':
      tp = '孔隙岩溶水'
      break
    case '5':
      tp = '裂隙岩溶水'
      break
    case '6':
      tp = '其他'
      break
  }
  return tp
}

function initLayer(wrcs_cd, nm) {
  layer.open({
    type: 2,
    title: nm,
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '500px'],
    content: basePath + '/pages/kfly/gsl/dxs/sssj/sssjDialog.jsp?wrcs_cd=' + wrcs_cd
  })
}
