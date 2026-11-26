$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 50
  //	$(".conent").css("height",height);
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'sgnqtable':
        src = basePath + 'pages/szybh/sgnq/sgnqTable/sgnqTable.jsp'
        break
      case 'sgnqecharts':
        src = basePath + '/pages/szybh/sgnq/sgnqEchart/sgnqEchart.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
