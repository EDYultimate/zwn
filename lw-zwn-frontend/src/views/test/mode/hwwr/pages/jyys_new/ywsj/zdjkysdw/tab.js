$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#hztj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'ztqk':
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/ztqk/ztqk.jsp'
        break
      case 'mlgl':
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/mlgl/mlgl.jsp'
        break
      case 'dwsltj':
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/dwsltj/dwsltj.jsp'
        break
      case 'ysjh':
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysjh/ysjh.jsp'
        break
      case 'ysqk':
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysqk/tab.jsp'
        break
      case 'wtqd':
        src = basePath + 'pages/jyys_new/ywsj/zdjkysdw/wtqd/wtqd.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
