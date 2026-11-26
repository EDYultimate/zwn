const setting = {
  data: {
    key: {
      title: 't'
    }
  },
  callback: {
    onClick: onClick
  }
}

function initGbTree() {
  jQuery.getJSON(basePath + 'common/getDxsTree', null, function (data) {
    $.fn.zTree.init($('#tree'), setting, data)
    if ($('#frame').attr('src') == '' && data[0] && data[0].children[0]) {
      $('#frame').attr(
        'src',
        basePath + 'pages/message/dxs/table/table.jsp?yearNo=' + data[0].children[0].id
      )
    }
  })
}

// 树节点点击
function onClick(event, treeId, treeNode, clickFlag) {
  const id = treeNode.id
  $('#frame').attr('src', basePath + 'pages/message/dxs/table/table.jsp?yearNo=' + id)
}

$(document).ready(function () {
  initGbTree()
  const treeWidth = $('#treeDiv').width()
  if (treeWidth < 300) {
    $('#treeDiv').css('width', '300px')
  }
})
