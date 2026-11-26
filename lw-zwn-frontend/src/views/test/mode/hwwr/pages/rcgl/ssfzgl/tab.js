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
      case 'byxkz':
        src = basePath + 'pages/rcgl/ssfzgl/byxkz/byxkzNew.jsp'
        //			src=basePath+"pages/rcgl/ssfzgl/byxkz/byxkz.jsp";
        break
      case 'qysh':
        src = basePath + 'pages/rcgl/ssfzgl/qysh/qysh.jsp'
        break
      case 'qsh':
        src = basePath + 'pages/rcgl/ssfzgl/qsh/qsh.jsp'
        break
      case 'qsk':
        src = basePath + 'pages/rcgl/ssfzgl/qsk/qsk.jsp'
        break
      case 'qsz':
        src = basePath + 'pages/rcgl/ssfzgl/qsz/qsz.jsp'
        break
      case 'qsd':
        src = basePath + 'pages/rcgl/ssfzgl/qsd/qsd.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
