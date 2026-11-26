$(function () {
  console.log(
    $('body').innerHeight() -
      $('#banner').outerHeight() -
      $('#menu').outerHeight() -
      $('#banner_gap').outerHeight()
  )
  $('#content').outerHeight(
    $('body').innerHeight() -
      $('#banner').outerHeight() -
      $('#menu').outerHeight() -
      $('#banner_gap').outerHeight()
  )
  initMenu()
})
//menu切换
function initMenu() {
  let selectItem = $('#menuItem_shouye')
  $('.menuItem').on('click', function (event) {
    if (!$(event.target).hasClass('selectItem')) {
      if (selectItem != null) {
        selectItem.removeClass('selectItem')
      }
      $(event.target).addClass('selectItem')
      selectItem = $(event.target)
    }
    const itemId = $(event.target).attr('id')
    if (itemId == 'menuItem_shouye') {
      $('#frameContent').attr('src', 'main/xxfw/xxfw.jsp')
    } else if (itemId == 'menuItem_shishi') {
      $('#frameContent').attr('src', 'main/cgdb/cgdb.jsp')
    } else if (itemId == 'menuItem_shuiwei') {
      $('#frameContent').attr('src', 'main/glsb/glsb.jsp')
    } else if (itemId == 'menuItem_lishi') {
      $('#frameContent').attr('src', 'main/glsb/glsb.jsp')
    }
  })
}
