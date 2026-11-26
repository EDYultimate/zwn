//var zbList=[{"nm":"建设用地","cd":"7,18,12","dw":"农村居民地,非居住独立建设用地,城镇居民地",'rownum':'3'},
//            {"nm":"林地","cd":"8,33,32,17,13","dw":"乔木绿地,落叶林,灌木林,园地,常绿林",'rownum':'5'},
//            {"nm":"水域","cd":"11,23,22,24,19","dw":"季节性水体,河流水面,水库水面,沼泽地,坑塘水面",'rownum':'5'},
//            {"nm":"自然裸露地","cd":"15,16","dw":"裸岩石砾地,永久性滩地",'rownum':'2'},
//            {"nm":"草本用地","cd":"9,14,10,20","dw":"人工草坪,湿润草地,耕地,荒草地",'rownum':'4'}];
//

const zbnmStr = '全部'
let zbcdStr = '全部'
let dkcdStr = ''
const dknmStr = ''
function picFormat() {
  const imgs = $('#imgDiv img')
  const imgCount = imgs.length

  if (imgCount == 0) {
    return
  }

  const pageWidth = parseInt(document.body.offsetWidth * 0.95) - 100
  let width = pageWidth

  const pageHeight = document.body.offsetHeight - document.getElementById('navigate').clientHeight
  let height = parseInt(pageHeight * 0.95)

  let cols = 1 //每行的个数

  if (imgCount > 9) {
    //12幅显示
    cols = 4
    width = parseInt(width / cols)
    height = parseInt(height / 3)
  } else if (imgCount >= 7) {
    //9幅显示
    cols = 3
    width = parseInt(width / cols)
    height = parseInt(height / 3)
  } else if (imgCount >= 5) {
    //6幅显示
    cols = 3
    width = parseInt(width / cols)
    height = parseInt(height / 2)
  } else if (imgCount >= 3) {
    //4幅显示
    cols = 2
    width = parseInt(width / cols)
    height = parseInt(height / 2)
  } else if (imgCount >= 2) {
    //2幅显示
    cols = 2
    width = parseInt(width / cols)
  } else if (imgCount >= 1) {
    //1幅显示
  }

  imgs.each(function (idx, el) {
    zoom(width, height, el) //缩放
    //alert( idx + "," + cols + "," + idx%cols);
    if ((idx + 1) % cols == 0) {
      //换行
      $(el).parent().after('<br>')
    }
  })

  imgs.css('visibility', 'visible')

  //根据图片列数x每个图片宽度,调整div达到居中
  //document.getElementById('imgDiv').style.marginLeft = parseInt( (pageWidth-(imgs[0].clientWidth * imgs[0].style.zoom * cols))/2 ) + "px";

  //将图片均匀排列  图片左边距 = (页面宽 - 列数*图宽)/列数
  const imagesWidth = imgs.width() * imgs.css('zoom') * cols
  const rate = cols == 1 ? 1.8 : 1.2
  imgs.parent().css('marginLeft', parseInt((pageWidth - imagesWidth) / cols / rate) + 'px')

  //上距离 2张 和 5-6张 由于不能用margin 用相对定位
  const imagesHeight = imgs.height() * imgs.css('zoom')
  if (imgCount == 2) {
    var mar = parseInt((pageHeight - imagesHeight) / 2)
    imgs
      .parent()
      .css('position', 'relative')
      .css('top', mar + 'px')
  } else if (imgCount >= 5 && imgCount <= 6) {
    var mar = parseInt((pageHeight - imagesHeight * 2) / 4)
    imgs.parent().each(function (idx, el) {
      const mar1 = idx >= 3 ? mar * 2 : mar //第二行的需要设定两倍相对top
      el.style.position = 'relative'
      el.style.top = mar1 + 'px'
    })
  }

  //将日期label对齐图片
  imgs.each(function (idx, el) {
    document.getElementById('datediv_' + el.alt).style.left = $(el).offset().left + 'px'
    document.getElementById('datediv_' + el.alt).style.top = $(el).offset().top + 'px'
  })

  //图例定位到右下角
  const legendDiv = document.getElementById('legendDiv')
  legendDiv.style.left = document.body.clientWidth - legendDiv.clientWidth + 'px'
  legendDiv.style.top = document.body.clientHeight - legendDiv.clientHeight + 'px'
}
$(function () {
  //	picFormat();
  const bodyDivWidth = $('#mainDiv').css('width')
  const bodyleftWidth = $('#leftDiv').css('width')
  const bodyrightWidth = parseInt(bodyDivWidth) - parseInt(bodyleftWidth) - 2
  $('#rightDiv').css('width', bodyrightWidth + 'px')

  const date = new Date()
  const year = date.getFullYear()

  $('#btm').val(year - 10)
  $('#etm').val(year - 3)
  $('#szzb').val('全部')

  $('#lyfqselect').change(function () {
    $('#lynm').val('全部')
    $('#dknm').val('')
    dkcdStr = ''
    zbcdStr = ''
    const lx = $(this).val()
    if (lx == 'ly') {
      $('#lynm').hide()
      $('#fqnmSpan').hide()
    } else {
      $('#lynm').show()
      $('#fqnmSpan').show()
    }
  })
  initZbInput()
  init()
})
function initZbInput() {
  if (zbnmStr == '') {
    $('#lynm').val('全部')
  } else {
    $('#lynm').val(zbnmStr)
  }
}
function initDkInput() {
  if (dknmStr == '') {
    $('#dknm').val('')
  } else {
    $('#dknm').val(dknmStr)
  }
}
function init() {
  $('#tmSpan').empty()
  $('#imgDiv').html('')
  const lytext = $('#lyfqselect').find('option:selected').text()
  $('#tmSpan').text(lytext + $('#btm').val() + '-' + $('#etm').val() + '年ET图')
  //流域分区cd
  const cd = zbcdStr
  //地区名称
  const nm = zbnmStr
  //地块多选种cd
  const dkcd = dkcdStr

  const param = {
    xzqlevel: $('#lyfqselect').val(),
    btm: $('#btm').val(),
    etm: $('#etm').val(),
    addvcddStr: cd,
    nm: nm
  }
  jQuery.getJSON(basePath + '/hsl/et/getETImg', param, function (data) {
    $('#theadtbody').html('')
    $('#tbody').html('')
    const byr = $('#btm').val()
    const eyr = $('#etm').val()
    const theadHtml = ''
    const tbodyHtml = ''
    const tm = []
    const count = 0
    if (data != null && data.length > 0) {
      const colAndWidth = imageFormatLayout(data.length)
      const result = colAndWidth.split(',')
      //列数
      const col = result[0]
      //每个图的宽度
      const width = result[1]
      let imageHtml = ''
      //区县行政区显示区县名称
      if ($('#lyfqselect').val() == 'ly2') {
        for (var i = 0; i < data.length; i++) {
          var image = data[i]
          var imageUrl = image.imgurl
          imageHtml += '<div style="width:30%;height:50%;float:left;margin:5px">'
          imageHtml +=
            '<span style="float:left;width:50%;text-align:center">' +
            image.year +
            '&nbsp;&nbsp;' +
            image.name +
            '</span>'
          imageHtml +=
            "<img title='" +
            image.year +
            image.name +
            "' id=" +
            i +
            " onerror='errImg()' src=" +
            basePath +
            'images/et/' +
            image.imgurl +
            ' style="width:' +
            width +
            ';float:left;height:90%;">'
          imageHtml += '</div>'
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          var image = data[i]
          var imageUrl = image.imgurl
          imageHtml += '<div style="width:30%;height:50%;float:left;margin:5px">'
          imageHtml +=
            '<span style="float:left;width:50%;text-align:center">' + image.year + '</span>'
          imageHtml +=
            "<img title='" +
            image.year +
            "' id=" +
            i +
            " onerror='errImg()' src=" +
            basePath +
            'images/et/' +
            image.imgurl +
            ' style="width:' +
            width +
            ';float:left;height:90%;">'
          imageHtml += '</div>'
        }
      }

      $('#imgDiv').append(imageHtml)
    }
  })
}
//处理错误图片
function errImg() {
  const img = event.srcElement
  const id = img.id
  $('#' + id)
    .parent()
    .css('display', 'none')
  img.onerror = null //控制不要一直跳动
}

function imageFormatLayout(imgCount) {
  if (imgCount == 0) {
    return
  }
  const pageWidth = parseInt(document.body.offsetWidth * 0.95) - 100
  let width = pageWidth

  const pageHeight = document.body.offsetHeight - document.getElementById('searchDiv').clientHeight
  let height = parseInt(pageHeight * 0.95)

  let cols = 1 //每行的个数

  if (imgCount > 9) {
    //12幅显示
    cols = 4
    width = parseInt(width / cols)
    height = parseInt(height / 3)
  } else if (imgCount >= 7) {
    //9幅显示
    cols = 3
    width = parseInt(width / cols)
    height = parseInt(height / 3)
  } else if (imgCount >= 5) {
    //6幅显示
    cols = 3
    width = parseInt(width / cols)
    height = parseInt(height / 2)
  } else if (imgCount >= 3) {
    //4幅显示
    cols = 2
    width = parseInt(width / cols)
    height = parseInt(height / 2)
  } else if (imgCount >= 2) {
    //2幅显示
    cols = 2
    width = parseInt(width / cols)
  } else if (imgCount >= 1) {
    //1幅显示
  }
  const result = cols + ',' + width
  return result
}

function openLy() {
  layer.open({
    type: 2,
    title: '行政区名称',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/kfly/hsl/ET/xzqName/FlName.jsp'
  })
}
function openDyxz() {
  layer.open({
    type: 2,
    title: '地块单元选择',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '400px'],
    content: basePath + 'pages/kfly/hsl/ET/xzqType/type.jsp'
  })
}

function showDialog(type, wrcd, wrnm, tynm) {
  console.info(type + ',' + wrcd + ',' + wrnm + ',' + tynm)
  let nm = ''
  if (type == '0') {
    nm = wrnm + 'ET值'
  } else {
    nm = wrnm + '-' + tynm + 'ET值'
  }
  layer.open({
    type: 2,
    title: nm + '趋势图',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['620px', '500px'],
    content:
      basePath +
      'pages/kfly/hsl/ET/xzqQstDialog/xzqQstDialog.jsp?type=' +
      type +
      '&' +
      'wrcd=' +
      wrcd
  })
}
//判断图片是否存在
function CheckImgExists(imgurl) {
  console.info(imgurl)
  const ImgObj = new Image() //判断图片是否存在
  ImgObj.src = imgurl
  //没有图片，则返回-1
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return true
  }
  return false
}
