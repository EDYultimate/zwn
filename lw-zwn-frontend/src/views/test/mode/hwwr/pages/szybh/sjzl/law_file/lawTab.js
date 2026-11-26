$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height() - 80
  $('.conent').css('overflow-y', 'hidden')
  $('#sssj').click()
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'flfg':
        src = basePath + 'pages/szybh/sjzl/law_file/flfg/flfg.jsp'
        break
      case 'bzgf':
        src = basePath + 'pages/szybh/sjzl/law_file/bzgf/bzgf.jsp'
        break
      case 'zcwj':
        src = basePath + 'pages/szybh/sjzl/law_file/zcwj/zcwj.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
