$(function () {
  const hh = document.body.clientHeight
  //var height = hh-$(".right_menu").height()-80;
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('#cjjzytj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'cjjzytj': //创建进展与统计
        src = basePath + 'pages/jyys_new/ywsj/jsztjs/cjjzytj/cjjzytj.jsp'
        break
      case 'jggctj': //技改工程统计
        src = basePath + 'pages/jyys_new/ywsj/jsztjs/jggctj/jggctj.jsp'
        break
      case 'jzjzf': //进展及主要做法
        src = basePath + 'pages/jyys_new/ywsj/jsztjs/jzjzf/jzjzf.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
