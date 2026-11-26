function newsView(title, id) {
  layer.open({
    type: 2,
    title: title,
    shadeClose: true,
    shade: 0.8,
    area: ['100%', '100%'],
    content: basePath + '/pages/jyys_new/jsxw/newsView.jsp?id=' + id
  })
}
function html_encode(str) {
  let s
  if (str.length === 0) {
    return ''
  }
  s = str.replace(/&/g, '&amp;')
  s = s.replace(/</g, '&lt;')
  s = s.replace(/>/g, '&gt;')
  s = s.replace(/ /g, '&nbsp;')
  s = s.replace(/\'/g, '&#39;')
  s = s.replace(/\"/g, '&quot;')
  s = s.replace(/\n/g, '<br/>')
  return s
}

function html_decode(str) {
  let s
  if (str.length === 0) {
    return ''
  }
  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&#39;/g, "\'")
  s = s.replace(/&quot;/g, '"')
  s = s.replace(/<br\/>/g, '\n')
  return s
}

//编辑信息
function update(id, title) {
  console.log(id)
  layer.open({
    btn: ['保存', '取消'], //可以无限个按钮
    type: 1,
    title: '修改标题',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '150px'],
    content:
      '<div style="margin-top: 20px; margin-left: 10px;"><label for="jsTitle">标题：</label><input id="jsTitle" autocomplete="off" value="' +
      title +
      '" style="width: 600px;"></div>',
    end: function () {
      // search(1);
    },
    yes: function (index, layero) {
      //按钮【按钮一】的回调
      const jsTitle = layero.find('#jsTitle')[0].value
      saveNews(id, jsTitle)
    }
  })
}

function del(id) {
  const msg = '您真的确定要删除这条新闻吗？\n\n请确认！'
  const pasrse = {}

  pasrse.id = id
  if (confirm(msg) === true) {
    $.ajax({
      url: basePath + 'jyys/jsxw/delNews',
      data: pasrse,
      dataType: 'json',
      type: 'post',
      success: function (data) {
        if (data != null && data.STATUS === 'Y') {
          alert('删除成功！')
        } else {
          alert('删除失败！')
        }
        search(1)
      }
    })
  }
}
function saveNews(id, jsTitle) {
  const param = {}
  param.id = id
  param.jsTitle = jsTitle
  $.ajax({
    url: basePath + 'jyys/jsxw/saveNews',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (data) {
      alert(data.info)
      search(1)
      layer.closeAll()
    }
  })
}

function openKWS() {
  layer.open({
    // btn: ['保存', '取消'], //可以无限个按钮
    type: 2,
    title: '抓取关键词定制',
    shadeClose: true,
    shade: 0.8,
    area: ['700px', '200px'],
    content: basePath + '/pages/jyys_new/jsxw/keyWords.jsp',
    end: function () {
      // search(1);
    }
    // ,yes: function(index, layero){
    //     //按钮【按钮一】的回调
    //     kws.saveKW()
    // }
  })
}
