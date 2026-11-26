let pageSize
const param = {}

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2

  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  const fw = $('#fw').val()

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }
  //    param.NM= $("#expertnm").val();
  param.exptype = $('#exptype').val()
  param.units = $('#dw').val()
  param.ad = $('#ad').val()
  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  jQuery.getJSON(basePath + 'rcgl/expert/getExpertInfo', param, function (result) {
    if (result.errors != null && result.errors.length > 0) {
      alert(result.errors)
      layer.close(index)
      return
    }
    const data = result.page.list
    if (data != null && data.length > 0) {
      console.info(data)

      for (var i = 0; i < data.length; i++) {
        const no = (CurrentPage - 1) * pageSize + (i + 1)
        tbodyStr +=
          '<tr>' +
          "<td title='" +
          no +
          "'>" +
          no +
          '</td>' +
          "<td title='" +
          isNull(data[i].EXP_NM) +
          "'  >" +
          isNull(data[i].EXP_NM) +
          '</td>' +
          "<td title='" +
          sexFormat(data[i].EXP_SEX) +
          "'  >" +
          sexFormat(data[i].EXP_SEX) +
          '</td>' +
          //                    "<td title='"+isNull(data[i].BRITHDAY)+"'  >"+isNull(data[i].BRITHDAY)+"</td>" +
          //                    "<td title='"+isNull(data[i].POLICITAL_STATUS)+"'  >"+isNull(data[i].POLICITAL_STATUS)+"</td>" +
          "<td title='" +
          isNull(data[i].SPECIALTY) +
          "'  >" +
          isNull(data[i].SPECIALTY) +
          '</td>' +
          "<td title='" +
          isNull(data[i].UNITS) +
          "'  >" +
          isNull(data[i].UNITS) +
          '</td>' +
          /*"<td title='"+exptypeFormat(data[i].EXP_TYPE)+"'  >"+exptypeFormat(data[i].EXP_TYPE)+"</td>" +*/
          "<td title='" +
          data[i].EXP_TYPE +
          "'  >" +
          data[i].EXP_TYPE +
          '</td>' +
          /*"<td title='"+unitsFormat(data[i].AD_NM)+"'  >"+unitsFormat(data[i].AD_NM)+"</td>" +*/
          "<td title='" +
          data[i].AD_NM +
          "'  >" +
          data[i].AD_NM +
          '</td>' +
          "<td title='" +
          isNull(data[i].JOB) +
          "'  >" +
          isNull(data[i].JOB) +
          '</td>' +
          /*"<td title='"+isNull(data[i].PHONE_NUMBER)+"'  >"+isNull(data[i].PHONE_NUMBER)+"</td>" +
                    "<td title='"+isNull(data[i].ADDRESS)+"'  >"+isNull(data[i].ADDRESS)+"</td>" +
                    "<td title='"+isNull(data[i].E_MAIL)+"'  >"+isNull(data[i].E_MAIL)+"</td>" +*/
          /* "<td title='"+isNull(data[i].NT)+"'  >"+isNull(data[i].NT)+"</td>" +*/
          "<td style=' width:20%;' >" +
          '<a href="javascript:;" onclick=update(\'' +
          isNull(data[i].ID) +
          "')>" +
          "<img style='cursor: pointer;' title='编辑' src='" +
          basePath +
          "/images/index/bj_07.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick=selectFile(\'' +
          isNull(data[i].FILEID) +
          "')>" +
          "<img style='cursor: pointer;' title='下载' src='" +
          basePath +
          "/images/index/xz_11.png'></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          '<a href="javascript:;" onclick="del(\'' +
          isNull(data[i].ID) +
          "','" +
          isNull(data[i].EXP_NM) +
          "','" +
          isNull(data[i].FILEID) +
          '\')">' +
          "<img style='cursor: pointer;' title='删除' src='" +
          basePath +
          "/images/index/sc_13.png'></a></td>" +
          '</tr>'
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
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          //                    "<td></td>" +
          //                    "<td></td>" +
          //                    "<td></td>" +
          //                    "<td></td>" +
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
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          /*"<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +*/
          '</tr>'
      }
    }
    $('#tbody').empty().append(tbodyStr)
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

//删除专家
function del(id, nm, fileid) {
  const msg = '您真的确定要删除' + nm + '专家信息吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  pasrse.fileid = fileid //文件编码
  if (confirm(msg) == true) {
    const index_load = layer.load()
    $.ajax({
      url: basePath + 'rcgl/expert/delExpertInfo',
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
//新建
function newAdd() {
  layer.open({
    type: 2,
    title: '添加',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + '/pages/rcgl/expert/addExpert.jsp'
  })
}
////新建随机方案
//function selectList(){
//    layer.open({
//        type: 2,
//        title: '新建方案',
//        shadeClose: false,
//        shade: 0.2,
//        maxmin: false, //开启最大化最小化按钮
//        area: ['80%', '90%'],
//        content: basePath+'/pages/rcgl/expert/checkExpert.jsp'
//    });
//}
//查询方案
function searchFaList() {
  layer.open({
    type: 2,
    title: '管理方案',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['90%', '90%'],
    content: basePath + '/pages/rcgl/expert/faList.jsp'
  })
}

//文件列表
function selectFile(fileid) {
  layer.open({
    type: 2,
    title: '文件列表',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['750px', '500px'],
    content: basePath + '/pages/jyys/ysFile/download.jsp?id=' + fileid
  })
}

//编辑信息
function update(id) {
  layer.open({
    type: 2,
    title: '修改',
    shadeClose: true,
    shade: 0.2,
    area: ['700px', '500px'],
    content: basePath + '/pages/rcgl/expert/dialogEdit.jsp?id=' + id,
    end: function () {
      search(1)
    }
  })
}

//预览pdf
function preview(fileid, filenm, suffix) {
  //debugger;
  if (suffix.indexOf('f') > 0 && countString(suffix, 'f') == 1) {
    //只有一个PDF 直接预览
    if (filenm.indexOf(',')) {
      const filenmArr = filenm.split(',')
      for (let i = 0; i < filenmArr.length; i++) {
        if (filenmArr[i].indexOf('.pdf') > 0) {
          //viewYl( fileid,filenm+".pdf",'/kfly/nsbd/tempName');
          viewYl(fileid, filenmArr[i], '/kfly/nsbd/tempName')
        }
      }
    } else {
      selectFile(fileid)
    }
  } else {
    //多个pdf弹出下载框
    selectFile(fileid)
  }
}
//判断某个字符在字符串出现的次数
function countString(str, s) {
  let count = 0
  for (let i = 0; i <= str.length; i++) {
    if (str.indexOf(s) == i) {
      str = str.substring(i + 1, str.length)
      count++
    }
  }
  return count
}

//单位字段格式化:1:漳河上游管理局  2:海河下游管理局  3:漳卫南运河管理局  4:引滦工程管理局;5:北京；6：天津；7：河北；8：山西；9：内蒙；10：辽宁；11：山东；12：河南
function unitsFormat(val) {
  if (val == '1') {
    return '漳河上游管理局'
  } else if (val == '2') {
    return '海河下游管理局'
  } else if (val == '0') {
    return '海河流域'
  } else if (val == '3') {
    return '漳卫南运河管理局'
  } else if (val == '4') {
    return '引滦工程管理局'
  } else if (val == '5') {
    return '北京'
  } else if (val == '6') {
    return '天津'
  } else if (val == '7') {
    return '河北'
  } else if (val == '8') {
    return '山西'
  } else if (val == '9') {
    return '内蒙'
  } else if (val == '10') {
    return '辽宁'
  } else if (val == '11') {
    return '山东'
  } else if (val == '12') {
    return '河南'
  } else if (val == '13') {
    return '其他'
  }

  return '-'
}

//专家类型格式化
function exptypeFormat(val) {
  if (val == '1') {
    return '水利专业专家'
  } else if (val == '2') {
    return '生产行业专家'
  } else if (val == '3') {
    return '环境保护'
  }

  return '-'
}
