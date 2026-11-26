$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  //	$(".conent").css("height",height);
  $('.conent').css('overflow-y', 'hidden')
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'gbsj':
        src = basePath + 'pages/kfly/jsl/tjxx/jsl.jsp'
        break
      case 'sssj':
        src = basePath + 'pages/kfly/jsl/sssj/tjTab.jsp'
        break
      case 'dbzjsl':
        src = basePath + 'pages/kfly/jsl/dbzjsl/dbzjsl.jsp'
        break
      case 'ylxx':
        src = basePath + 'pages/kfly/jsl/ylxx/ylxx.jsp'
        var modleIframe = $('#iframe')[0].contentDocument.getElementById('modleIframe')
        $(modleIframe).attr('src', src)
        return
      case 'xyb':
        src = basePath + 'pages/kfly/jsl/xyb/xyb.jsp'
        var modleIframe = $('#iframe')[0].contentDocument.getElementById('modleIframe')
        $(modleIframe).attr('src', src)
        return
    }
    $('#iframe').attr('src', src)
  })
})

function changeTag(flag) {
  if (flag == '1') {
    // 表格
    $('#smap').show()
    $('#stable').hide()
    $('.clickLiTab').removeClass('clickLiTab')
    $('#ylxx').addClass('clickLiTab')
  } else if (flag == '0') {
    // 地图
    $('#smap').hide()
    $('#stable').show()
  }
}
