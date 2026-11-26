var pageSize = 6
let param = {}
//存放图片地址
//var picturePathHeader="http://localhost:8080/hwwr";
//var picturePathHeader="http://localhost:8082/hwwrUpload/";
var picturePathHeader = "http://10.3.250.90:8082/hwwrUpload/";

//var picturePathHeader="http://10.3.34.159:8080/hwwr/";
//var picturePathHeader="http://10.3.34.196:3721/hwwr";
$(function () {
  //	var bodyheight=$(document.body).outerHeight(true);
  //	var tbHeight = bodyheight-120-$(".searchDiv").height()-$(".M-box").height()-10;
  //	$(".piccontent").css("height",tbHeight+"px");
  search(1)
})

//页面初始化
function search(CurrentPage) {
  var tbodyStr = ''

  var fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  param.TM = $('#tm').val()
  param.TP = $('#pictype').val()
  param.KY = $('#keyw').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  var index = layer.load()
  jQuery.getJSON(basePath + 'szybh/sjzl/getPicList', param, function (result) {
    var data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)

      for (var i = 0; i < data.length; i++) {
        var filenm = data[i].FILE_NM
        var fileid = data[i].FILE_ID
        var id = data[i].ID
        tbodyStr +=
          '<div class="picitem_outDiv"><div class="picDiv">' +
          '<img onClick="openEdit(\'' +
          id +
          "')\" src='" +
          picturePathHeader +
          isNull(data[i].FILE_URL) +
          '\' ></div><div class="pic_bottomOutDiv" >' +
          '<div class="picitem_bottomDiv" >类型:' +
          unittpFormat(data[i].TP) +
          '</div>' +
          '<div class="picitem_bottomDiv" >描述:' +
          isNull(data[i].DETAILINFO) +
          '</div>' +
          '<div class="picitem_bottomDiv" >照片时间:' +
          isNull(data[i].TM) +
          '</div>' +
          '<div class="picitem_bottomDiv" >上传人:' +
          isNull(data[i].UP_PERSON) +
          '' +
          '<div style="color:red;float:right;cursor:pointer" onclick="delPic(\'' +
          fileid +
          "','" +
          id +
          "','" +
          filenm +
          '\')">删除</div>' +
          '</div></div></div>'
      }
    }

    $('#piccontent').empty().append(tbodyStr)
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

//
function newAdd() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + 'pages/szybh/sjzl/picture/addpic.jsp'
  })
}

//编辑页
function openEdit(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '300px'],
    content: basePath + 'pages/szybh/sjzl/picture/editpic.jsp?id=' + id
  })
}

//单位类型
function unittpFormat(val){
	if(val=='1'){return "生态流量";}
	else if(val=='2'){return "地下水超采综合治理";}
	else if(val=='3'){return "饮用水源保护";}
	return "";
	
}
}

function delPic(fileid, id, filenm) {
  var msg = '您真的确定要删除图片信息吗？\n\n请确认！'
  var pasrse = {}

  pasrse.id = id
  pasrse.fileid = fileid //文件编码
  pasrse.filenm = filenm //文件编码
  if (confirm(msg) == true) {
    var index_load = layer.load()
    $.ajax({
      url: basePath + 'szybh/sjzl/delPicInfo',
      data: pasrse,
      dataType: 'json',
      type: 'GET',
      success: function (data) {
        if (data.success) {
          alert('删除成功')
        } else {
          alert('删除失败')
          return
        }
        //关闭遮罩层
        layer.close(index_load)
        search(1)
      }
    })
  }
}
