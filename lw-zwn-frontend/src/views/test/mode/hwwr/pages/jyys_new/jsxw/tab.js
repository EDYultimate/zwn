$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  //var height = hh-$(".right_menu").height()-100;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'zl':
        src = basePath + 'pages/jyys_new/jsxw/zl/zl.jsp'
        break
      case 'jsyw':
        src = basePath + 'pages/jyys_new/jsxw/jsyw/jsyw.jsp'
        break
      case 'hwdt':
        src = basePath + 'pages/jyys_new/jsxw/hwdt/hwdt.jsp'
        break
      case 'lydt':
        src = basePath + 'pages/jyys_new/jsxw/lydt/lydt.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})

//切换标签页
function changeTab(bodyId) {
  let src = ''
  $('#zl').removeClass('clickLiTab')
  //$("#jsyw").addClass("clickLiTab");
  $(bodyId).addClass('clickLiTab')
  if (bodyId == '#jsyw') {
    src = basePath + 'pages/jyys_new/jsxw/jsyw/jsyw.jsp'
  } else if (bodyId == '#hwdt') {
    src = basePath + 'pages/jyys_new/jsxw/hwdt/hwdt.jsp'
  } else if (bodyId == '#lydt') {
    src = basePath + 'pages/jyys_new/jsxw/lydt/lydt.jsp'
  }
  $('#iframe').attr('src', src)
}
