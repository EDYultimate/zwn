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
  initGbTree()
  const treeWidth = $('#treeDiv').width()
  if (treeWidth < 300) {
    $('#treeDiv').css('width', '300px')
  }
  if ($('#frame').attr('src') == '') {
    $('#frame').attr('src', basePath + 'pages/message/gb/01/jsl.jsp')
  }
  //window.onresize = function () {window.location.reload();}
})
function initGbTree() {
  jQuery.getJSON(basePath + 'common/getGbTree', null, function (data) {
    $.fn.zTree.init($('#treeDemo'), setting, data)
  })
}
function onClick(event, treeId, treeNode, clickFlag) {
  const id = treeNode.id

  $('#frame').attr('src', basePath + 'pages/message/gb/dev.jsp')

  if (id == 1) {
    $('#frame').attr('src', basePath + 'pages/message/gb/01/jsl.jsp')
  } else if (id == 2) {
    $('#frame').attr('src', basePath + 'pages/message/gb/02/dbzjsl.jsp')
  } else if (id == 3) {
    //地表水
    $('#frame').attr('src', basePath + 'pages/message/gb/03/dbs.jsp')
  } else if (id == 4) {
    $('#frame').attr('src', basePath + 'pages/message/gb/04/dbzjll.jsp')
  } else if (id == 5) {
    //地下水
    $('#frame').attr('src', basePath + 'pages/message/gb/05/dxs.jsp')
  } else if (id == 6) {
    //水资源总量
    $('#frame').attr('src', basePath + 'pages/message/gb/06/szyzl.jsp')
  } else if (id == 7) {
    $('#frame').attr('src', basePath + 'pages/message/gb/07/skxsl.jsp')
  } else if (id == 8) {
    $('#frame').attr('src', basePath + 'pages/message/gb/08/pydxs.jsp')
  } else if (id == 9) {
    $('#frame').attr('src', basePath + 'pages/message/gb/09/dxsld.jsp')
  } else if (id == 10) {
    //供水量
    $('#frame').attr('src', basePath + 'pages/message/gb/10/gs.jsp')
  } else if (id == 11) {
    //用水量
    $('#frame').attr('src', basePath + 'pages/message/gb/11/ysl.jsp')
  } else if (id == 12) {
    $('#frame').attr('src', basePath + 'pages/message/gb/12/jcqgysl.jsp')
  } else if (id == 13) {
    //耗水量
    $('#frame').attr('src', basePath + 'pages/message/gb/13/hsl.jsp')
  } else if (id == 14) {
    //排污量
    $('#frame').attr('src', basePath + 'pages/message/gb/14/pwl.jsp')
  } else if (id == 15) {
    $('#frame').attr('src', basePath + 'pages/message/gb/15/hlszyzl.jsp')
  } else if (id == 16) {
    $('#frame').attr('src', basePath + 'pages/message/gb/16/hpszyzl.jsp')
  } else if (id == 17) {
    $('#frame').attr('src', basePath + 'pages/message/gb/17/skszyzl.jsp')
  } else if (id == 18) {
    $('#frame').attr('src', basePath + 'pages/message/gb/18/sjstsz.jsp')
  } else if (id == 19) {
    $('#frame').attr('src', basePath + 'pages/message/gb/19/pyqcdxs.jsp')
  } else if (id == 20) {
  } else if (id == 21) {
    $('#frame').attr('src', basePath + 'pages/message/gb/sthx/sthx.jsp')
  }
}
