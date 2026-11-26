let pageSize
const param = {}
$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 180 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  initOption()
  search(1)
})

function isnull(str) {
  if (str === null || str === undefined) {
    return ''
  }
  return str
}

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''
  const bdat = $('#btm').val()
  const edat = $('#etm').val()
  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  const STARTNUM = (CurrentPage - 1) * pageSize
  const ENDNUM = CurrentPage * pageSize
  param.PROJ_NM = $('#proj_nm').val()
  param.YR = $('#yr').val()
  param.GROUP1 = $('#group1').val()
  param.GROUP2 = $('#group2').val()
  param.BID = $('#bid').val()
  param.BTM = bdat
  param.ETM = edat
  param.STARTNUM = STARTNUM
  param.ENDNUM = ENDNUM
  const index = layer.load()
  $.ajax({
    url: basePath + '/sjtj/sjqk_new/getProject',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(param),
    dataType: 'json',
    success: function (data) {
      $('#tbody').empty()
      if (data != null && data.length > 0) {
        var sumnum = data[0].sumnum
        for (var i = 0; i < data.length; i++) {
          let divStr = ''
          divStr += '<tr>'
          /*	divStr += "<td title='"+data[i].rownum+"'>"+data[i].rownum+"</td>";*/
          divStr += "<td title='" + data[i].no + "'>" + data[i].no + '</td>'
          divStr += "<td title='" + data[i].yr + '年度' + "'>" + data[i].yr + '年度' + '</td>'
          divStr += "<td title='" + data[i].g1name + "'>" + data[i].g1name + '</td>'
          divStr += "<td title='" + data[i].g2name + "'>" + data[i].g2name + '</td>'
          divStr +=
            "<td title='" +
            data[i].proj_nm +
            "'><a href='javascript:openUpload(\"" +
            data[i].proj_cd +
            '")\'>' +
            data[i].proj_nm +
            '</a></td>'
          if (data[i].bid && data[i].bid == '1') {
            divStr += "<td title='是'>是</td>"
          } else {
            divStr += "<td title='否'>否</td>"
          }

          divStr +=
            "<td title='" + isnull(data[i].cons_org) + "'>" + isnull(data[i].cons_org) + '</td>'
          divStr +=
            "<td title='" + isnull(data[i].cont_nm) + "'>" + isnull(data[i].cont_nm) + '</td>'
          divStr += "<td title='" + isnull(data[i].tel) + "'>" + isnull(data[i].tel) + '</td>'
          divStr +=
            '<td><a onclick="showDetail(\'' +
            data[i].proj_cd +
            '\')">修改</a>&nbsp;<a onclick="deletefile(\'' +
            data[i].proj_cd +
            '\')">删除</a></td>'
          divStr += '</tr>'
          tbodyStr += divStr
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
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>'
        }
      }
      $('#tbody').append(tbodyStr)
      $('.M-box').pagination({
        pageCount: Math.floor(sumnum / pageSize) + 1,
        current: CurrentPage,
        callback: function (api) {
          search(api.getCurrent())
        }
      })
      $('.tolSpan').html('共' + sumnum + '条')
      $('.M-box').show()
      layer.close(index)
    }
  })
}

function showDetail(proj_cd) {
  let url = 'pages/lyzg/zlxx_new/detail.jsp'
  if (proj_cd) {
    url += '?proj_cd=' + proj_cd
  }
  layer.open({
    type: 2,
    title: ['成果修改', true],
    area: ['500px', '365px'], //宽高
    content: url
  })
}

function openUpload(proj_cd) {
  let url = 'pages/lyzg/zlxx_new/upload.jsp'
  if (proj_cd) {
    url += '?proj_cd=' + proj_cd
  }
  layer.open({
    type: 2,
    title: ['成果上传', true],
    area: ['820px', '560px'], //宽高
    content: url
  })
}

function deletefile(file_cd) {
  const msg = '您真的确定要删除该成果吗？\n\n请确认！'
  if (confirm(msg) == true) {
    jQuery.getJSON(basePath + 'sjtj/sjqk_new/delProject', { PROJ_CD: file_cd }, function (data) {
      search(1)
    })
  }
}

function getGroup1(callback) {
  $.post(basePath + 'sjtj/sjqk_new/getGroup1', {}, function (data) {
    let str = ''
    for (let i = 0; i < data.length; ++i) {
      const row = data[i]
      str += "<option value='" + row.id + "'>" + row.name + '</option>'
    }
    $('#group1').append(str)
    if (callback) {
      callback()
    }
  })
}

function getGroup2(callback) {
  $.post(basePath + 'sjtj/sjqk_new/getGroup2', {}, function (data) {
    let str = ''
    for (let i = 0; i < data.length; ++i) {
      const row = data[i]
      str += "<option value='" + row.id + "'>" + row.name + '</option>'
    }
    $('#group2').append(str)
    if (callback) {
      callback()
    }
  })
}

function initOption() {
  getGroup1()
  getGroup2()
}
