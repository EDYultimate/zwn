$(function () {
  $('#tbody tr').each(function () {
    $(this).children('td:eq(0),td:eq(2)').css('background-color', 'rgb(239, 239, 239)')
  })
  init()
  loadpic(getUrlParam('stcd'))
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
            $(this).html(isNull(data[0][id.toUpperCase()]))
            $(this).attr('title', isNull(data[0][id.toUpperCase()]))
          }
        })
      }
    }
  )
}

function loadpic(stcd) {
  const url = basePath + 'common/image/stcds/images/' + stcd + '.jpg'
  imageReady(
    url,
    function () {
      // 图片已经ready，可以获取宽高
    },
    function () {
      // 图片已经下载完成
      $('#picdiv').css('background-image', 'url(' + url + ')')
      ispicloaded = true
    },
    function () {
      // 图片下载出错
      $('#picdiv').css('background-color', 'f7f7f7')
      $('#picdiv').append("<div style='padding-left: 43%;padding-top: 27%;'>暂无图片</div>")
    }
  )
  $(parent.document.getElementsByClassName('layui-layer-content')).css('overflow-y', 'hidden')
}

var ispicloaded = false
function picCk() {
  const url = basePath + 'common/image/stcds/images/' + getUrlParam('stcd') + '.jpg'

  const json = {
    title: '', //相册标题
    id: 123, //相册id
    start: 0, //初始显示的图片序号，默认0
    data: [
      //相册包含的图片，数组格式
      {
        alt: '图片',
        pid: 666, //图片id
        src: url, //原图地址
        thumb: '' //缩略图地址
      }
    ]
  }

  if (!ispicloaded) {
    alert('无图片')
    return
  }

  layer.photos({
    photos: json,
    anim: 5 // 0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
  })
}
