$(document).ready(function () {
  maketable()
})

function makeEmptyData() {
  const json = []

  for (let i = 0; i < pagesize; ++i) {
    const row = {
      wiu_cd: '',
      rn: '',
      wiu_nm: ''
    }
    json.push(row)
  }
  return json
}

function finished() {
  // 操作
  const rowlength = $('tr').length
  const collength = $($('tr')[0]).children().length - 1

  for (let row = 1; row < rowlength; ++row) {
    const cell = $($('tr')[row]).children()[collength]
    const id = $($($('tr')[row]).children()[0]).text()
    if (!id) {
      continue
    }
    const wiu_nm = $($($('tr')[row]).children()[2]).text()
    //var str = "<a onclick='choose(\""+id+"\", \""+wiu_nm+"\")'>选择</a>";
    const str =
      '<a onclick=\'update("' +
      id +
      '", "' +
      wiu_nm +
      '")\'>修改</a> &nbsp;&nbsp;<a onclick=\'choose("' +
      id +
      '", "' +
      wiu_nm +
      '")\'>选择</a>'
    $(cell).append(str)
  }

  // 页码
  $('.M-box').pagination({
    pageCount: Math.ceil(tsum / pagesize), //初始化时总页数3页
    current: page,
    callback: function (api) {
      maketable(api.getCurrent())
    }
  })
  $('.tolSpan').html('共' + tsum + '条')
  $('.M-box').show()
}

var page = 1
var pagesize = 5

var tsum = 1

function maketable(p) {
  if (p) {
    page = p
  }

  const json = {
    wiu_nm: $('#wiu_nm').val(),
    start: pagesize * (page - 1) + 1,
    end: pagesize * page + 1
  }

  let str = '',
    sep = ''
  for (const i in json) {
    str += sep + i + '=' + json[i]
    sep = '&'
  }

  $.ajax({
    type: 'GET',
    url: basePath + 'spgc/getWiu?' + str,
    contentType: 'application/json',
    async: true,
    success: function (data) {
      let results = data
      let isEmpty = false
      if (!results || results.length < 1) {
        results = makeEmptyData()
        isEmpty = true
      }
      option = {
        colTitle: true
      }
      ctable = cgrid.instance('table', option)
      ctable.finished = finished

      if (results && results.length > 0) {
        for (var i = 0; i < results.length; ++i) {
          ;(function (results, it) {
            if (!results[i].rn) {
              results[i].rn = 1 + it
            }
          })(results, i)

          if (i === 0) {
            tsum = results[0].tsum
          }
        }
      }

      ctable.genTable(results)
    }
  })
}

function choose(wiu_cd, wiu_nm) {
  parent.wiu_obj.wiu_cd = wiu_cd
  parent.wiu_obj.wiu_nm = wiu_nm
  parent.setWrp_nm(wiu_nm)
  parent.layer.closeAll()
}

function update(wiu_cd, wiu_nm) {
  debugger
  layer.open({
    type: 2,
    title: '取水户',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['400px', '150px'],
    content:
      basePath +
      'pages/rcgl/spgcgl/xpwf/dialog/wiu_update.jsp?wiu_cd=' +
      wiu_cd +
      '&wiu_nm=' +
      wiu_nm
  })
}
