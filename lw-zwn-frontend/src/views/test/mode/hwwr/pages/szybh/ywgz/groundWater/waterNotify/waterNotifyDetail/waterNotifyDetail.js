let pageSize
const param = {}

$(function () {
  const curtDate = new Date()
  const curtYear = curtDate.Format('yyyy')
  const curtMon = curtDate.Format('MM')
  let curtSea
  if (curtMon >= 1 && curtMon < 4) {
    curtSea = 1
  } else if (curtMon >= 4 && curtMon < 7) {
    curtSea = 2
  } else if (curtMon >= 7 && curtMon < 10) {
    curtSea = 3
  } else if (curtMon >= 10 && curtMon < 13) {
    curtSea = 4
  }
  //	curtSea = curtSea-1
  // 填入时间查询
  $('#seasonId').val(curtYear + '年' + curtSea + '季度')

  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  $('.bbTable').css('height', tbHeight * 0.75 + 'px')
  pageSize = Math.floor(tbHeight / 30) - 2
  //  $(".bbTable").css("height","500px");

  pageSize = 10
  search(1)
})

//页面初始化
function search(CurrentPage) {
  let tbodyStr = ''

  //    var fw = $("#fw").val();

  if (CurrentPage == '' || CurrentPage == null) {
    CurrentPage = 1
  }

  //	var year = $('#seasonId').val().substring(0,4);
  //	var mon = $('#seasonId').val().charAt(5);
  //    var maicang =$("input[type=radio]:checked").val();

  param.year = $('#seasonId').val().substring(0, 4)
  param.season = $('#seasonId').val().charAt(5)
  param.maicang = $('input[type=radio]:checked').val()
  param.provinceCode = $('#provinceSel').val()
  param.cityCode = $('#citySel').val()

  param.pageSize = pageSize
  param.pageNo = CurrentPage
  const index = layer.load()
  console.log('cccc:' + param)
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterEcologyFlowWarnDetailInfoGis',
    param,
    function (result) {
      console.log('resultGis:', result)
    }
  )

  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterEcologyFlowQuota', param, function (result) {
    console.log('getSaveWaterEcologyFlowQuota:', result)
    $('#all').text(result[0].NUM)
    $('#up').text(result[1].NUM)
    $('#stable').text(result[2].NUM)
    $('#down').text(result[3].NUM)
    $('#downPlus').text(result[4].NUM)
  })

  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterwaterNotifyDetailInfo',
    param,
    function (result) {
      console.log('getSaveWaterwaterNotifyDetailInfo:', result)
      //        $("#up").html(result.statMap.up);
      //        $('#stable').html(result.statMap.stable);
      //        $('#down').html(result.statMap.down);
      //        $('#downPlus').html(result.statMap.downPlus);
      const data = result.page.list
      if (data != null && data.length > 0) {
        let BFtype = '-'
        for (var i = 0; i < data.length; i++) {
          switch (data[i].TYPE) {
            case '1':
              BFtype = '上升区'
              break
            case '2':
              BFtype = '相对稳定区'
              break
            case '3':
              BFtype = '相对下降区'
              break
            case '4':
              BFtype = '严重下降区'
              break
          }

          tbodyStr +=
            '<tr>' +
            "<td title='" +
            isNull(data[i].RANK) +
            "'  >" +
            isNull(data[i].RANK) +
            '</td>' +
            "<td title='" +
            isNull(data[i].AD_NM) +
            "'><a href='javascript:void(0)'  onclick='do_support(" +
            '"' +
            data[i].AD_NM +
            '"' +
            ',' +
            data[i].AD_CD +
            ")'>" +
            isNull(data[i].AD_NM) +
            '</a></td>' +
            "<td title='" +
            isNull(data[i].PROVINCE) +
            "'  >" +
            isNull(data[i].PROVINCE) +
            '</td>' +
            "<td title='" +
            isNull(data[i].Z) +
            "'  >" +
            isNull(data[i].Z) +
            '</td>' +
            "<td title='" +
            isNull(data[i].TYPE) +
            "'  >" +
            isNull(BFtype) +
            '</td>' +
            '</tr>'
        }
        for (let x = data.length; x < pageSize; x++) {
          tbodyStr +=
            '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      } else {
        for (var i = 0; i < pageSize; i++) {
          tbodyStr +=
            '<tr>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '</tr>'
        }
      }

      $('#TableData').empty().append(tbodyStr)
      //        $("#tbody2").empty().append(tbodyStr);
      $('.M-box').pagination({
        pageCount: result.page.pages, //初始化时总页数3页
        current: CurrentPage,
        callback: function (api) {
          search(api.getCurrent())
        }
      })
      $('.tolSpan').html('共' + result.page.total + '条')
      $('.M-box').show()
      layer.close(index)
    }
  )
}

function divClick(nm, stcd, st_tp) {
  layer.open({
    type: 2,
    title: nm + '地下水位变幅变化详情', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1050px', '600px'],
    content:
      basePath +
      'pages/szybh/ywgz/groundWater/waterNotify/map/swbfbhxqDialog.jsp?stcd=' +
      stcd +
      '&st_tp=' +
      st_tp //pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
  })
}

$('#provinceSel').change(function () {
  document.getElementById('citySel').length = 0 //清空旧的记录

  const cityShanXi = ['晋中市', '大同市', '太原市', '沂州市', '朔州市']
  const cityHeBei = [
    '沧州市',
    '保定市',
    '雄安新区',
    '张家口市',
    '定州市',
    '廊坊市',
    '石家庄市',
    '衡水市',
    '邢台市',
    '邯郸市',
    '辛集市',
    '唐山市'
  ]
  const cityShanDong = ['滨州市', '东营市', '聊城市', '德州市']
  const cityLiaoNing = ['葫芦岛市', '朝阳市']
  const cityBeiJing = ['北京市']
  const cityHeNan = ['鹤壁市', '濮阳市', '安阳市', '焦作市']
  const cityNeiMeng = ['锡林郭勒盟', '赤峰市', '乌兰察布市']
  const cityTianJin = ['天津市']

  document.getElementById('citySel').options.add(new Option('全部', ''))
  switch ($('#provinceSel').val()) {
    case '14':
      document.getElementById('citySel').options.add(new Option(cityShanXi[0], '140700'))
      document.getElementById('citySel').options.add(new Option(cityShanXi[1], '140200'))
      document.getElementById('citySel').options.add(new Option(cityShanXi[2], '140100'))
      document.getElementById('citySel').options.add(new Option(cityShanXi[3], '140900'))
      document.getElementById('citySel').options.add(new Option(cityShanXi[4], '140600'))
      break
    case '13':
      document.getElementById('citySel').options.add(new Option(cityHeBei[0], '130900'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[1], '130600'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[2], '139900'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[3], '130700'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[4], '130682'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[5], '131000'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[6], '130100'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[7], '131100'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[8], '130500'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[9], '130400'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[10], '130181'))
      document.getElementById('citySel').options.add(new Option(cityHeBei[11], '130200'))
      break
    case '37':
      document.getElementById('citySel').options.add(new Option(cityShanDong[0], '371600'))
      document.getElementById('citySel').options.add(new Option(cityShanDong[1], '370500'))
      document.getElementById('citySel').options.add(new Option(cityShanDong[2], '371500'))
      document.getElementById('citySel').options.add(new Option(cityShanDong[3], '371400'))
      break
    case '21':
      document.getElementById('citySel').options.add(new Option(cityLiaoNing[0], '211400'))
      document.getElementById('citySel').options.add(new Option(cityLiaoNing[1], '211300'))
      break
    case '11':
      document.getElementById('citySel').options.add(new Option(cityBeiJing[0], '110100'))

      break
    case '41':
      document.getElementById('citySel').options.add(new Option(cityHeNan[0], '410600'))
      document.getElementById('citySel').options.add(new Option(cityHeNan[1], '410900'))
      document.getElementById('citySel').options.add(new Option(cityHeNan[2], '410500'))
      document.getElementById('citySel').options.add(new Option(cityHeNan[3], '410800'))
      break
    case '15':
      document.getElementById('citySel').options.add(new Option(cityNeiMeng[0], '152900'))
      document.getElementById('citySel').options.add(new Option(cityNeiMeng[1], '150400'))
      document.getElementById('citySel').options.add(new Option(cityNeiMeng[2], '150900'))
      break
    case '12':
      document.getElementById('citySel').options.add(new Option(cityTianJin[0], '120100'))
  }
})

function do_support(AD_NM, AD_CD) {
  //	console.log("do_support:   ",AD_NM,AD_CD);
  top.layer.open({
    type: 2,
    title: AD_NM + '地下水位变幅变化详情', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1050px', '500px'],
    content:
      basePath + 'pages/szybh/ywgz/groundWater/waterNotify/map/swbfbhxqDialog.jsp?AD_CD=' + AD_CD
  })
}

//打印方法
function printpage() {
  printData('dydiv', 'dytable')
}

$('#waterReport_btn_generate_excel').click(function () {
  if (document.getElementById('TableData').rows.length <= 0) {
    alert('无下载数据')
  } else {
    excel = new ExcelGen({
      src_id: 'dytable',
      show_header: true
    })
    excel.generate()
  }
})

layui.use(['form', 'upload', 'layer', 'laydate', 'jquery'], function () {
  const laydate = layui.laydate
  renderSeasonDate('#seasonId', '')
  // 季度
  function renderSeasonDate(ohd, sgl) {
    const ele = $(ohd)
    laydate.render({
      elem: ohd,
      type: 'month',
      format: 'yyyy年M季度',
      btns: ['clear', 'confirm'],
      ready: function (value, date, endDate) {
        const hd = $('#layui-laydate' + ele.attr('lay-key'))
        if (hd.length > 0) {
          hd.click(function () {
            quarter($(this))
          })
        }
        quarter(hd)
      },
      done: function (value, date, endDate) {
        if (!isNullSea(date) && date.month > 0 && date.month < 5) {
          ele.attr('startDate', date.year + '年-' + date.month + '季')
        } else {
          ele.attr('startDate', '')
        }
        if (!isNullSea(endDate) && endDate.month > 0 && endDate.month < 5) {
          ele.attr('endDate', endDate.year + '年-' + endDate.month)
        } else {
          ele.attr('endDate', '')
        }
      }
    })
  }
})

function quarter(thiz) {
  const mls = thiz.find('.laydate-month-list')
  mls.each(function (i, e) {
    $(this)
      .find('li')
      .each(function (inx, ele) {
        const cx = ele.innerHTML
        if (inx < 4) {
          ele.innerHTML = cx.replace(/月/g, '季度')
        } else {
          ele.style.display = 'none'
        }
      })
  })
}
function isNullSea(quarter) {
  if (quarter == null || typeof quarter === 'undefined' || quarter == '') {
    return true
  }
  return false
}
