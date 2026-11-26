$(function () {
  $('#tbody tr').each(function () {
    $(this).children('td:eq(0),td:eq(2)').css('background-color', 'rgb(239, 239, 239)')
  })
  init()
})
//初始化表格
function init() {
  jQuery.getJSON(
    basePath + '/szybh/sjdm/getStBaseInfo',
    { stcd: getUrlParam('stcd') },
    function (result) {
      const data = result.list
      if (data != null && data.length > 0) {
        /**
         * 此处注意事项：
         * 1.除需动态赋值外其他td不设id
         * 2.需赋值td之id（可小写）需与数据库查询字段保持一致
         */
        $('td').each(function () {
          const id = $(this).attr('id')
          if (!validateNull(id)) {
            if (id.toUpperCase() == 'EST_ST_YM') {
              const str = data[0][id.toUpperCase()]
              if (str && str.length == 6) {
                const year = str.substring(0, 4)
                let month = str.substring(4, 6)
                if (month.startsWith('0')) {
                  month = month.substring(1, 2)
                }
                data[0][id.toUpperCase()] = year + '年' + month + '月'
              }
            }

            $(this).html(isNull(data[0][id.toUpperCase()]))
            $(this).attr('title', isNull(data[0][id.toUpperCase()]))
          }
        })
      }
    }
  )
}
