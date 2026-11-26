let pageSize
let param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");
  pageSize = 10
  const date = new Date()
  $('#yearBeg').val(date.getFullYear() - 1)
  $('#yearEnd').val(date.getFullYear())
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

  param.yearBeg = $('#yearBeg').val()
  param.yearEnd = $('#yearEnd').val()
  //    param.mon= $("#mon").val();
  param.fillState = $('#fillState').val()
  param.tp = 4

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  //    console.log("cccc:");
  //    jQuery.getJSON(basePath+"szybh/ywgz/getSaveWaterDrinkProtectGis",param,function(result){
  //       console.log("getSaveWaterDrinkProtectGis:",result);
  //    });
  //    var totalDBNUM=0;
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDataFillList', param, function (result) {
    //        console.log("getSaveWaterDataFillList:",result);

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
          '年</td>' +
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
          "<a href=\"javascript:;\" style='text-decoration:none;' onclick=downloadBellowFile('" +
          data[i].FILE_ID +
          "')>" +
          "<img style='cursor: pointer;' title='下载' src='" +
          basePath +
          "/images/savewater/download.png'>&nbsp;<span style='vertical-align: inherit;color: black;'>下载年报</span></a>&nbsp;&nbsp;&nbsp;&nbsp;</td>"

        //                    "<img style='cursor: pointer;' title='导入' src='"+basePath+"/images/savewater/import.png'>&nbsp;" +
        //                    "<a href='javascript:void(0);'  style='width:30' class='a-upload' id='file-a'>导入  <form  method='POST' id='f"+data[i].YEAR+"'  onchange='bbb2("+data[i].YEAR+",\""+data[i].ID+"\")' enctype='multipart/form-data' action='szybh/ywgz/getSaveWaterDataFillDBImport'><input type='file' id='i"+data[i].YEAR+"' name='file'/>	</form>"+
        //                    "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
        //
        //                    "<a href=\"javascript:;\" style='text-decoration:none;' onclick=editDataFile('"+isNull(data[i].YEAR)+"')>" +
        //	                "<img style='cursor: pointer;' title='编辑' src='"+basePath+"/images/savewater/edit.png'>&nbsp;<span style='vertical-align: inherit;color: black;'>编辑</span></a>&nbsp;&nbsp;&nbsp;&nbsp;"+
        //
        //	                "<a href=\"javascript:;\" style='text-decoration:none;' onclick=delInfo('"+isNull(data[i].YEAR)+"','"+data[i].ID+"')>" +
        //	                "<img style='cursor: pointer;' title='清空' src='"+basePath+"/images/savewater/delete.png'>&nbsp;<span style='vertical-align: inherit;color: black;'>清空</span></a>&nbsp;&nbsp;&nbsp;&nbsp;</td>";

        if (data[i].FILE_NM != '' && data[i].FILE_NM != null) {
          tbodyStr +=
            "<td align='center'>" +
            "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' style='display:none' class='a-upload2' id='a" +
            data[i].YEAR +
            "'>" +
            "<img style='cursor: pointer;vertical-align: middle;' title='编辑' src='" +
            basePath +
            "/images/savewater/import2.png'>&nbsp;&nbsp;&nbsp;&nbsp;上传<input id='upload" +
            data[i].YEAR +
            "' onclick=uploadFile('" +
            data[i].ID +
            "','" +
            data[i].YEAR +
            "',4)  type='file' multiple></input></a>" +
            "<img style='cursor: pointer;vertical-align: middle;' title='' src='" +
            basePath +
            "/images/savewater/import2.png'>&nbsp;&nbsp;&nbsp;&nbsp;<span id=" +
            data[i].FILE_ID +
            '>' +
            data[i].FILE_NM +
            "&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delSingleFileDataFill('" +
            data[i].FILE_ID +
            "','" +
            data[i].FILE_NM +
            "','" +
            data[i].ID +
            "','" +
            data[i].YEAR +
            "',this)\" ><img style='cursor: pointer;'  src='" +
            basePath +
            "/images/savewater/delete_item.png'></a></span>" +
            '</td>'
        } else {
          tbodyStr +=
            "<td colspan='1'>" +
            "<a href='javascript:void(0);'  class='a-upload2' id='a" +
            data[i].YEAR +
            "'>" +
            "<img style='cursor: pointer;vertical-align: middle;' title='编辑' src='" +
            basePath +
            "/images/savewater/import2.png'>&nbsp;&nbsp;&nbsp;&nbsp;上传<input id='upload" +
            data[i].YEAR +
            "' onclick=uploadFile('" +
            data[i].ID +
            "','" +
            data[i].YEAR +
            "',4)  type='file'></input></a>" +
            '</td>'
        }
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
          '<td></td>' +
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
          '<td></td>' +
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

function downloadBellowFile(file_id) {
  if (file_id != null && file_id != 'undefined') {
    downloadFile(file_id)
  } else {
    alert('请先上传年报！')
  }
}

function bbb2(report_tm, id) {
  console.log('bbbb', id)
  //	$("#f"+id).submit();//表单提交

  const formdata = new FormData(document.getElementById('f' + report_tm))
  $.ajax({
    url: basePath + 'szybh/ywgz/getSaveWaterDataFillDBImport?id=' + id + '&report_tm=' + report_tm,
    type: 'POST',
    data: formdata,
    contentType: false,
    processData: false,
    success: function (res) {
      console.log('ds', res)
      if (res != 'success') {
        $('#f' + report_tm).submit()
        alert('格式有误，请修改！')
      } else {
        alert('提交成功！')
        search(1)
      }
      $('#i' + report_tm).replaceWith('<input name="file" type="file" id=i' + report_tm + ' />')
      //    	layer.close(index);
      //		parent.search(1);
      //		parent.layer.closeAll();
    }
  })

  //	$("#i"+id).fileupload({
  //		url : basePath + 'szybh/ywgz/getSaveWaterDataFillGWImport',
  //		Type : 'POST',
  //		dataType : 'json',//服务器返回的数据类型
  //		autoUpload : true,
  //		//acceptFileTypes : /(gif|jpe?g|png)$/i,//验证图片格式
  //		sequentialUploads: true,
  //		multipleFilesUpload: true,
  //		maxNumberOfFiles : 5,//最大上传文件数目
  //		maxFileSize : 50000000, // 文件上限1MB
  //		minFileSize : 100,//文件下限  100b
  //		messages : {//文件错误信息
  //			acceptFileTypes : '文件类型不匹配',
  //			maxFileSize : '文件过大',
  //			minFileSize : '文件过小'
  //		}
  //	})
  //
  //	//上传请求结束后，不管成功，错误或者中止都会被触发
  //	.on("fileuploadalways", function(e, data) {
  ////		alert(data.jqXHR.responseText);
  //		console.log("fileuploadalways",data.jqXHR);
  //		search(1);
  ////		console.log("fileuploadalways",data);
  //
  //		const fileName = 'aaa.xlsx';
  //		const downloadLink = window.document.createElement('a');
  //        downloadLink.href = window.URL.createObjectURL(new Blob([data.jqXHR.responseText],
  //        		{type: "application/vnd.ms-excel;charset=utf-8"}));
  //
  //        downloadLink.download = fileName;
  //        document.body.appendChild(downloadLink);
  //        downloadLink.click();
  //        document.body.removeChild(downloadLink);
  //
  //
  //	})

  //	 $("#f"+id).ajaxForm(function(data){
  ////	        if(data=="1"){
  //	            alert("提交成功！");
  ////	        }
  //	    });

  //	$("#sub").click();
  //	$("#forma").load(function(){
  //		console.log("from");
  //
  //	    var text = $(this).contents().find("body").text(); //获取到的是json的字符串
  ////	    var j = $.parseJSON(text);  //json字符串转换成json对象
  //	    console.log(text);
  //	})
  //		console.log("affas");
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
      //		alert(data.jqXHR.responseText);
      //		console.log("fileuploadalways",data.jqXHR);
      search(1)
      //		console.log("fileuploadalways",data);

      const fileName = 'aaa.xlsx'
      const downloadLink = window.document.createElement('a')
      downloadLink.href = window.URL.createObjectURL(
        new Blob([data.jqXHR.responseText], { type: 'application/vnd.ms-excel;charset=utf-8' })
      )

      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    })
  //	$("#uploadImg").click();
  //	console.log(111);

  //return getIsFile;
}

function uploadFile(id, year, tp) {
  const fileid = year
  //	console.log(id);
  //	console.log(fileid);
  const uid = getUid()
  //	console.log(uid);

  //    var index = layer.load();
  $('#upload' + fileid)
    .fileupload({
      url:
        basePath +
        'szybh/ywgz/dataFilluploadFile.action?fileId=' +
        uid +
        '&id=' +
        id +
        '&report_tm=' +
        year +
        '&tp=' +
        tp,
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
      },
      add: function (e, data) {
        const acceptFileTypes =
          /^application\/vnd.openxmlformats-officedocument.wordprocessingml.document$/i
        // 文件类型判断
        if (
          data.originalFiles[0].type.length &&
          !acceptFileTypes.test(data.originalFiles[0].type)
        ) {
          alert('请上传.docx格式文件')
          return
        }
        data.submit()
      }
    })

    //上传请求成功时触发的回调函数
    .on('fileuploaddone', function (e, data) {
      const file = data.result.files
      const uid = file.FILE_ID
      const name = file.FILE_NM

      $('#a' + fileid).replaceWith(
        "<a href='javascript:void(0);'  class='a-upload2' id='a" +
          fileid +
          "'><img style='cursor: pointer;vertical-align: middle;' title='编辑' src='" +
          basePath +
          "/images/savewater/import2.png'>&nbsp;&nbsp;&nbsp;&nbsp;上传<input id='upload" +
          fileid +
          "' onclick=uploadFile('" +
          id +
          "','" +
          year +
          "',4)  type='file'></input></a>"
      )

      $('#upload' + fileid)
        .parent()
        .after(
          '<span id=' +
            uid +
            '>' +
            data.files[0].name +
            "&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\"delSingleFileDataFill('" +
            uid +
            "','" +
            name +
            "','" +
            id +
            "','" +
            fileid +
            "',this)\" ><img style='cursor: pointer;'  src='" +
            basePath +
            "/images/savewater/delete_item.png'></a></span>"
        )
      $('#a' + fileid).css('display', 'none')
      //		layer.close(index);
      alert('上传成功')
      search(1)
    })
}

function delSingleFileDataFill(uid, name, id, fileid, e) {
  param = {}
  param.fileId = uid

  param.fileName = name
  jQuery.getJSON(basePath + 'kfly/nsbd/deleteFile.action', param, function (data) {
    if (data.flag == 'true') {
      //清空ATT_GW_FILL_JS_B表中的fileId
      param.id = id
      jQuery.getJSON(basePath + 'szybh/ywgz/dataFilldelBelow', param, function (data) {
        if (data.success == true) {
          console.log('fileid', fileid)

          $(e).parent('span').remove()

          $('#a' + fileid).css('display', 'inline-table')
          alert('删除成功')
          search(1)

          //    				var idObject = document.getElementById(uid);
          //    				console.log("idObject",idObject);
          //
          //    				if (idObject != null){
          //    				    idObject.parentNode.removeChild(idObject);
          //    				}

          //    				$("#"+uid).css("display","none");
        }
      })
    }
  })
}

function downloadTemplate(year) {
  const form = $('<form>')
  form.attr('style', 'display:none')
  form.attr('method', 'post')
  form.attr('action', basePath + '/szybh/ywgz/dataFillDBDownload.action')
  $('body').append(form)
  const input1 = $('<input>')
  input1.attr('type', 'hidden') //设置为隐藏域
  input1.attr('name', 'year') //设置参数名称
  input1.attr('value', encodeURIComponent(year)) //设置参数值
  form.append(input1) //添加到表单中
  //    var input2=$("<input>");
  //    input2.attr("type","hidden");//设置为隐藏域
  //    input2.attr("name","mon");//设置参数名称
  //    input2.attr("value",encodeURIComponent(mon));//设置参数值
  //    form.append(input2);//添加到表单中
  form.submit() //表单提交
}

function delInfo(year, mon, id) {
  const msg = '您真的确定要删除吗？\n\n请确认！'
  const pasrse = {}

  pasrse.year = year
  pasrse.mon = mon //文件编码
  pasrse.id = id //文件编码

  if (confirm(msg) == true) {
    const index_load = layer.load()
    $.ajax({
      url: basePath + '/szybh/ywgz/dataFillWQDel',
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

function editDataFile(year) {
  top.layer.open({
    type: 2,
    title: '达标建设数据编辑',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    //			offset: '70px',
    area: ['1300px', '650px'],
    content: basePath + '/pages/szybh/ywgz/dataFill/groundWater/DP/DBFillListEdit.jsp?year=' + year
  })
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
