let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");
  pageSize = 10

  search(1)

  //    var uid=getUid();
  // 	uploadFile("fileUpload",""+uid+"");//文件上传

  //    var uid=getUid();
  // 	upload1("file1","111");//文件上传
  // 	upload1("file2","111");//文件上传

  // 	upload1("file1",""+uid+"");//文件上传
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  const date = new Date()
  //	$("#nianFen").val(date.getFullYear());
  param.yearBeg = $('#yearBeg').val()
  param.yearEnd = $('#yearEnd').val()
  param.fillState = $('#fillState').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  //    console.log("cccc:");
  //    jQuery.getJSON(basePath+"szybh/ywgz/getSaveWaterDrinkProtectGis",param,function(result){
  //       console.log("getSaveWaterDrinkProtectGis:",result);
  //    });
  //    var totalDBNUM=0;
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDataFillList', param, function (result) {
    console.log('getSaveWaterDataFillList:', result)

    const data = result.page.list
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        let state = '-'
        if (data[i].FILL_STATE == 2) {
          state = '已填报'
        } else if (data[i].FILL_STATE == 1) {
          state = '未填报'
        }
        //            	 var no=(CurrentPage-1)*pageSize+(i+1);
        tbodyStr +=
          '<tr>' +
          //	                "<td title='"+no+"'>"+no+"</td>" +
          "<td title='" +
          isNull(data[i].YEAR) +
          "'>" +
          isNull(data[i].YEAR) +
          '年' +
          isNull(data[i].SEA) +
          '季度</td>' +
          "<td title='" +
          isNull(state) +
          "'  >" +
          isNull(state) +
          '</td>' +
          "<td title='" +
          isNull(data[i].FILL_TM) +
          "'  >" +
          isNull(data[i].FILL_TM) +
          '</td>' +
          "<td title='" +
          isNull(data[i].USER_NM) +
          "'  >" +
          isNull(data[i].USER_NM) +
          '</td>' +
          '<td>' +
          "<a href=\"javascript:;\" style='text-decoration:none;' onclick=downloadTemplate('" +
          isNull(data[i].YEAR + "','" + data[i].SEA) +
          "')>" +
          "<img style='cursor: pointer;' title='下载模板' src='" +
          basePath +
          "/images/savewater/download.png'>&nbsp;<span style='vertical-align: inherit;color: black;'>下载模板</span></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
          //                  "<a href=\"javascript:;\" onclick=importData('"+isNull(data[i].YEAR+"','"+data[i].SEA)+"')>" +
          //                  "<img style='cursor: pointer;' title='导入' src='"+basePath+"/images/savewater/download.png'>&nbsp;<span style='vertical-align: top;'>导入</span></a>&nbsp;&nbsp;&nbsp;&nbsp;" +

          //                  "<img style='cursor: pointer;' title='导入' src='"+basePath+"/images/savewater/import.png'>" +
          //                  "<a href='javascript:void(0);'  style='width:30' class='a-upload' id='file-a'>导入  <form method='POST' enctype='multipart/form-data' action='/import/import2'><input id='file1'  type='file' name='file'></input></form>"+
          ////                  "<a href=\"javascript:;\" onclick=selectFile('"+isNull(data[i].FILEID)+"')>" +
          //                  "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+

          //                  "<img style='cursor: pointer;' title='导入' src='"+basePath+"/images/savewater/import.png'>" +
          //                  "<a href='javascript:void(0);'  style='width:30' class='a-upload' id='file-a'>导入  <form method='POST' id='ft' enctype='multipart/form-data' action='szybh/ywgz/getSaveWaterDataFillGWImport'><input type='file' onchange='bbb()' name='file'/></form>"+
          ////                  "<a href=\"javascript:;\" onclick=selectFile('"+isNull(data[i].FILEID)+"')>" +
          //                  "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+

          //                  "<img style='cursor: pointer;' title='导入' src='"+basePath+"/images/savewater/import.png'> &nbsp;" +
          //                  "<a href='javascript:void(0);' style='width:30;text-decoration:none;vertical-align: sub;' class='a-upload' id='file-a'>导入  &nbsp; &nbsp;&nbsp;<input id='"+data[i].YEAR+data[i].SEA+"' onclick=importData('"+isNull(data[i].YEAR+data[i].SEA)+"',"+data[i].ID+") name='file' type='file' multiple></input></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
          ////                  "<a href=\"javascript:;\" onclick=selectFile('"+isNull(data[i].FILEID)+"')>" +
          //                  "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+

          "<a href=\"javascript:;\" style='text-decoration:none;' onclick=selectFile('" +
          isNull(data[i].FILEID) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/savewater/edit.png'>&nbsp;<span style='vertical-align: inherit;color: black;'>编辑</span></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
          "<a href=\"javascript:;\" style='text-decoration:none;' onclick=delInfo('" +
          isNull(data[i].YEAR + "','" + data[i].SEA) +
          "','" +
          data[i].ID +
          "')>" +
          "<img style='cursor: pointer;' title='清空' src='" +
          basePath +
          "/images/savewater/delete.png'>&nbsp;<span style='vertical-align: inherit;color: black;'>清空</span></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
          "<a href='javascript:void(0);' style='width:30;text-decoration:none;vertical-align: sub;' class='a-upload' id='file-a'>导入  &nbsp; &nbsp;&nbsp;<input id='" +
          data[i].YEAR +
          data[i].SEA +
          "' onclick=importData('" +
          isNull(data[i].YEAR + data[i].SEA) +
          "'," +
          data[i].ID +
          ") name='file' type='file' multiple></input></a>&nbsp;&nbsp;&nbsp;&nbsp;" +
          //                  "<a href=\"javascript:;\" onclick=selectFile('"+isNull(data[i].FILEID)+"')>" +
          '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '</td>'

        //	                if(data[i].FILE_NM!=''&&data[i].FILE_NM!=null){
        //	              	 tbodyStr+= "<td>"+
        //	                    "<span style='vertical-align: top;'>"+data[i].FILE_NM+"</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:;\" onclick=update('"+isNull(data[i].ID)+"','"+isNull(data[i].TM)+"')>" +
        //	                    "<img style='cursor: pointer;'  src='"+basePath+"/images/savewater/delete_item.png'></a>&nbsp;" +
        //		              "</td>";
        //	                }else{
        //	                	tbodyStr+= "<td colspan='1' align='center'><a href='javascript:void(0);' style='width:30' class='a-upload' id='file-aUpload'>上传<input id='fileUpload' onclick=uploadFile('"+data[i].ID+"','fileUpload')  type='file' multiple></input></a></td>";
        //	                }
        tbodyStr += '</tr>'
      }
      for (let x = data.length; x < pageSize; x++) {
        tbodyStr +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          //                    "<td></td>" +

          '</tr>'
      }
    } else {
      for (var i = 0; i < pageSize; i++) {
        tbodyStr +=
          '<tr>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          //                "<td></td>" +

          '</tr>'
      }
    }

    $('#TableData').empty().append(tbodyStr)
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

function bbb() {
  console.log('bbbb')
  $('#ft').submit() //表单提交
}
//function downloadTemplate(year,sea)
//{
//	param={};
//    param.year=year;
//    param.sea=sea;
//
//	$.ajax({
//	    url: basePath+"szybh/ywgz/dataFillGWDownload?year="+year+"&sea="+sea,
//	    type: "GET",
////		data: JSON.stringify(param),
//		contentType: "application/json; charset=utf-8",
//		dataType: "json",
//	    success: function(data) {
//	    	alert("下载成功");
//
////	    	alert(data.info);
////	    	layer.close(index);
////			parent.search(1);
////			parent.layer.closeAll();
//	    }
//	    });
//}

//function aaa(year){
//	console.log("year",year);
//}

function importData(fileid, id) {
  console.log(22222)
  $('#' + fileid)
    .fileupload({
      url: basePath + 'szybh/ywgz/getSaveWaterDataFillGWImport?id=' + id,
      Type: 'POST',
      dataType: 'json', //服务器返回的数据类型
      autoUpload: true,
      //acceptFileTypes : /(gif|jpe?g|png)$/i,//验证图片格式
      sequentialUploads: true,
      multipleFilesUpload: true,
      maxNumberOfFiles: 5, //最大上传文件数目
      maxFileSize: 50000000, // 文件上限1MB
      minFileSize: 100, //文件下限  100b
      messages: {
        //文件错误信息
        acceptFileTypes: '文件类型不匹配',
        maxFileSize: '文件过大',
        minFileSize: '文件过小'
      }
    })

    //上传请求结束后，不管成功，错误或者中止都会被触发
    .on('fileuploadalways', function (e, data) {
      alert(data.jqXHR.responseText)
      console.log('fileuploadalways', data.jqXHR)
      search(1)
      //		console.log("fileuploadalways",data);

      //		const fileName = 'aaa.xlsx';
      //		const downloadLink = window.document.createElement('a');
      //        downloadLink.href = window.URL.createObjectURL(new Blob([data.jqXHR.responseText]));
      //        downloadLink.download = fileName;
      //        document.body.appendChild(downloadLink);
      //        downloadLink.click();
      //        document.body.removeChild(downloadLink);
    })
  $('#uploadImg').click()
  console.log(111)

  //return getIsFile;
}

function uploadFile(id, fileid) {
  console.log(22222)
  console.log(id)
  //	console.log(fileid);
  const uid = getUid()
  console.log(uid)

  $('#' + fileid)
    .fileupload({
      url: basePath + '/kfly/nsbd/uploadFile.action?id=' + uid,
      Type: 'POST',
      dataType: 'json', //服务器返回的数据类型
      autoUpload: true,
      //acceptFileTypes : /(gif|jpe?g|png)$/i,//验证图片格式
      sequentialUploads: true,
      multipleFilesUpload: true,
      maxNumberOfFiles: 5, //最大上传文件数目
      maxFileSize: 50000000, // 文件上限1MB
      minFileSize: 100, //文件下限  100b
      messages: {
        //文件错误信息
        acceptFileTypes: '文件类型不匹配',
        maxFileSize: '文件过大',
        minFileSize: '文件过小'
      }
    })

    //上传请求成功时触发的回调函数
    .on('fileuploaddone', function (e, data) {
      const file = data.result.files
      const uid = file.FILE_ID
      const name = file.FILE_NM
      $('#' + fileid)
        .parent()
        .after(
          '<span>' +
            data.files[0].name +
            "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delSingleFile('" +
            uid +
            "','" +
            name +
            '\',this)" >删除</a></span>'
        )
      $('#file-aUpload').css('display', 'none')
    })
}

//function importData(fileid,uid){
//    var form=$("<form>");
//    form.attr("style","display:none");
//    form.attr("method","post");
//    form.attr("enctype","multipart/form-data");
//
//    form.attr("action",basePath +"/szybh/ywgz/getSaveWaterDataFillGWImport.action");
//    $("body").append(form);
//    var input1=$("<input>");
//    input1.attr("type","hidden");//设置为隐藏域
//    input1.attr("name","id");//设置参数名称
//    input1.attr("value",111);//设置参数值
//    form.append(input1);//添加到表单中
////    var input2=$("<input>");
////    input2.attr("type","hidden");//设置为隐藏域
////    input2.attr("name","sea");//设置参数名称
////    input2.attr("value",encodeURIComponent(sea));//设置参数值
////    form.append(input2);//添加到表单中
//    form.submit();//表单提交
//}

function downloadTemplate(year, sea) {
  const form = $('<form>')
  form.attr('style', 'display:none')
  form.attr('method', 'post')
  form.attr('action', basePath + '/szybh/ywgz/dataFillGWDownload.action')
  $('body').append(form)
  const input1 = $('<input>')
  input1.attr('type', 'hidden') //设置为隐藏域
  input1.attr('name', 'year') //设置参数名称
  input1.attr('value', encodeURIComponent(year)) //设置参数值
  form.append(input1) //添加到表单中
  const input2 = $('<input>')
  input2.attr('type', 'hidden') //设置为隐藏域
  input2.attr('name', 'sea') //设置参数名称
  input2.attr('value', encodeURIComponent(sea)) //设置参数值
  form.append(input2) //添加到表单中
  form.submit() //表单提交
}

function delInfo(year, sea, id) {
  const msg = '您真的确定要删除吗？\n\n请确认！'
  const pasrse = {}

  pasrse.year = year
  pasrse.sea = sea //文件编码
  pasrse.id = id //文件编码

  if (confirm(msg) == true) {
    const index_load = layer.load()
    $.ajax({
      url: basePath + '/szybh/ywgz/dataFillGWDel',
      data: pasrse,
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        if (!data) {
          alert(data.message)
          return
        }
        //关闭遮罩层
        layer.close(index_load)
        search(1)
      }
    })
  }
}

function do_support(SWS_NM, SWS_CD) {
  top.layer.open({
    type: 2,
    title: SWS_NM + '水源地详情', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1300px', '650px'],
    content: basePath + 'pages/szybh/ywgz/drinkProtect/map/mapDialogTab.jsp?SWS_CD=' + SWS_CD
  })
}

//打印方法
function printpage() {
  printData('dydiv', 'dytable')
}

$('#waterReport_btn_generate_excel').click(function () {
  if (document.getElementById('TableData').rows.length <= 0) {
    alert('无下载数据')
  } else {
    excel = new ExcelGen({
      src_id: 'dytable',
      show_header: true
    })
    excel.generate()
  }
})

function getUid() {
  const str = Math.random().toString()
  let strs = [] //定义一数组
  strs = str.split('.') //字符分割
  let uid = strs[1] + ''
  const myDate = new Date()
  const hms = myDate.getMilliseconds() + '' //获取当前毫秒数(0-999)
  uid = uid + hms
  return uid
}
