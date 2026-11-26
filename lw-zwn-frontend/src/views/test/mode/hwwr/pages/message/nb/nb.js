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
$(function () {
  initnbTree()
  const treeWidth = $('#treeDiv').width()
  if (treeWidth < 300) {
    $('#treeDiv').css('width', '300px')
  }
  if ($('#frame').attr('src') == '') {
    $('#frame').attr('src', basePath + 'pages/message/nb/dev.jsp')
  }
  //window.onresize = function () {window.location.reload();}
})
function initnbTree() {
  jQuery.getJSON(basePath + 'common/getNbTree', null, function (data) {
    $.fn.zTree.init($('#treeDemo'), setting, data)
  })
}
function onClick(event, treeId, treeNode, clickFlag) {
  const id = treeNode.id

  $('#frame').attr('src', basePath + 'pages/message/nb/dev.jsp')

  if (id == 1) {
    $('#frame').attr('src', basePath + 'pages/message/nb/01/jsxmlz.jsp')
  } else if (id == 2) {
    $('#frame').attr('src', basePath + 'pages/message/nb/02/dfbstt_bas.jsp')
  } else if (id == 3) {
    //地表水
    $('#frame').attr('src', basePath + 'pages/message/nb/03/dfablstt.jsp')
  } else if (id == 4) {
    $('#frame').attr('src', basePath + 'pages/message/nb/04/lcnystt.jsp')
  } else if (id == 5) {
  } else if (id == 6) {
    $('#frame').attr('src', basePath + 'pages/message/nb/06/wupstt.jsp')
  } else if (id == 7) {
    $('#frame').attr('src', basePath + 'pages/message/nb/07/ctwuem.jsp')
  } else if (id == 8) {
  } else if (id == 9) {
    $('#frame').attr('src', basePath + 'pages/message/nb/09/wfsttm.jsp')
  } else if (id == 10) {
    $('#frame').attr('src', basePath + 'pages/message/nb/10/tbm.jsp')
  } else if (id == 11) {
  } else if (id == 12) {
  } else if (id == 13) {
  }
}
