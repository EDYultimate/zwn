$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.right_menu').height()
  $('.conent').css('height', height)
  $('.conent').css('overflow-y', 'hidden')
  $('.right_menu li').click(function () {
    $('.clickLiTab').removeClass('clickLiTab')
    $(this).addClass('clickLiTab')
    let src = ''
    switch ($(this).attr('id')) {
      case 'byxkz':
        src = basePath + 'pages/rcgl/wfzgl/byxkz/byxkz.jsp'
        break
      case 'xbyxkz':
        src = basePath + 'pages/rcgl/wfzgl/xbyxkz/xbyxkz.jsp'
        break
      case 'qysh':
        src = basePath + 'pages/rcgl/wfzgl/qysh/qysh.jsp'
        break
      case 'qsh':
        src = basePath + 'pages/rcgl/wfzgl/qsh/qsh.jsp'
        break
      case 'qsk':
        src = basePath + 'pages/rcgl/wfzgl/qsk/qsk.jsp'
        break
      case 'qsz':
        src = basePath + 'pages/rcgl/wfzgl/qsz/qsz.jsp'
        break
      case 'qsd':
        src = basePath + 'pages/rcgl/wfzgl/qsd/qsd.jsp'
        break
      case 'qysjhsj':
        src = basePath + 'pages/rcgl/wfzgl/qysjhsj/qysjhsj.jsp'
        break
      case 'ztxx':
        src = basePath + 'pages/rcgl/wfzgl/ztxx/ztxx.jsp'
        break
      case 'wfztj':
        src = basePath + 'pages/rcgl/wfzgl/wfztj/wfztj.jsp'
        break
      case 'sjjh': //数据校核
        src = basePath + 'pages/rcgl/wfzgl/sjjh/sjjh.jsp'
        break
    }
    $('#iframe').attr('src', src)
  })
})
