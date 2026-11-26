const param = {}
//滦河水量表头
const lhSLTheadHtml =
  '<tr>' +
  "<td rowspan='2'>河流名称</td>" +
  "<td rowspan='2'>控制断面</td>" +
  "<td colspan='2' style='border-bottom: 1px solid #cdd6e2;'>生态水量年水量(亿m³)</td>" +
  "<td rowspan='2'>评估结果</td>" +
  '</tr>' +
  '<tr>' +
  '<td>目标</td>' +
  '<td>实际</td>' +
  '</tr> '
//滦河水量和流量考核表头
const lhSLAndQTheadHtml =
  "<tr><td rowspan='2'>河流名称</td><td rowspan='2'>控制断面</td>" +
  "<td colspan='3' style='border-bottom: 1px solid #cdd6e2;'>生态水量年水量(亿m³)</td><td colspan='4' style='border-bottom: 1px solid #cdd6e2;'>生态水量月流量</td>" +
  '</tr><tr><td>目标</td><td>实际</td><td>评估结果</td><td>目标(m³/s)</td><td>评估时段(个)</td><td>达标时段(个)</td>' +
  '<td>评估结果</td></tr>'

//永定河表头
const ydhSLTheadHtml =
  '<tr>' +
  "<td rowspan='2'>河流名称</td>" +
  "<td rowspan='2'>控制断面</td>" +
  '<td>生态水量年目标(亿m³)</td><td>年实测径流量(亿m³)</td><td>评估结果</td></tr>'

//卫河
const whSLTheadHtml =
  '<tr>' +
  '<td>河流名称</td>' +
  '<td>控制断面</td>' +
  '<td>生态水量年目标(亿m³)</td>' +
  '<td>年实测径流量(亿m³)</td>' +
  '<td>评估结果</td>' +
  '</tr>'

//七里海
const QLHZTheadHtml =
  '<tr>' +
  "<td rowspan='2'>河流名称</td>" +
  "<td rowspan='2'>控制断面</td>" +
  "<td rowspan='2'>来水条件</td>" +
  "<td rowspan='2'>时间</td>" +
  "<td rowspan='2'>生态水位目标(m)</td>" +
  "<td colspan='3' style='border-bottom: 1px solid #cdd6e2;'>年度保证程度</td></tr>" +
  '<tr><td>总考核时段数</td><td>总达标时段数</td><td>保证程度(%)</td>' +
  '</tr>'

//白洋淀表头
const BYDZTheadHtml =
  '<tr>' +
  "<td rowspan='2'>河流名称</td>" +
  "<td rowspan='2'>控制断面</td>" +
  "<td rowspan='2'>来水条件</td>" +
  "<td rowspan='2'>时间</td>" +
  "<td rowspan='2'>生态水位目标(m)</td>" +
  "<td colspan='3' style='border-bottom: 1px solid #cdd6e2;'>年度保证程度</td></tr>" +
  '<tr><td>总考核时段数</td><td>总达标时段数</td><td>保证程度(%)</td>' +
  '</tr>'

$(function () {
  getYr()
})

function getYr() {
  const bodyheight = $(document.body).outerHeight(true)
  console.info('bodyheight:' + bodyheight)
  const tbHeight = bodyheight - 130
  console.info('tbHeight:' + tbHeight)
  $('.conent').css('height', tbHeight)
  const now = new Date()
  const date = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const year = date.getFullYear()
  $('#year').val(year)
  $('.t_year').text(year)
  search()
}

function search() {
  $('.t_year').text($('#year').val())
  iniLh()
  ydhini()
  whini()
  qlhini()
  bydini()
}

function iniLh() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  //	$("#t_year").text($("#year").val());
  param.yr = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getLHEveStatAppraiseResult',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      const list = result[0]
      const message = list.message
      const slList = list.data
      let tableHeadHtml = ''
      let tbodyhtml = ''
      if (message == '0') {
        //水量表头
        tableHeadHtml += lhSLTheadHtml
        tbodyhtml +=
          "<tr><td rowspan='4'>滦河</td><td>大黑汀水库（底、发、溢）</td><td></td>" +
          '<td></td><td></td></tr><tr><td>桃林口水库</td><td></td><td></td>' +
          '<td></td></tr><tr><td>滦县</td><td></td><td></td><td></td></tr>'
      }
      if (message == 'SL') {
        //水量表头
        tableHeadHtml += lhSLTheadHtml
        //	    		var dbTotal=0;
        tbodyhtml += "<tr><td rowspan='4'>滦河</td>"
        for (var i = 0; i < slList.length; i++) {
          var nm = slList[i].ST_NM
          var yrsl = isNull(slList[i].YRSL)
          var s = isNull(slList[i].S)
          var flag = dbFormat(slList[i].FLAG)
          //	    			dbTotal+=isNullL(slList[i].FLAG);
          if (i > 0) {
            tbodyhtml += '<tr>'
          }
          tbodyhtml += '<td>' + nm + '</td>'
          tbodyhtml += '<td>' + s + '</td>'
          tbodyhtml += '<td>' + yrsl + '</td>'
          tbodyhtml += '<td>' + flag + '</td></tr>'
        }

        tbodyhtml +=
          "<tr><td colspan='3'>评估结果</td><td><span style='color:red'>不达标</span></td></tr>"
      }
      if (message == 'Q') {
        //流量达标
        let qdbnum = ''

        //流量统计多个站总和是否达标文字（默认未达标）
        let qdbText = "<span style=\'color:red\'>未达标</span>"
        //最终评估结果
        let finalPgResult = '0'
        //水量列，所有站总和是否达标标志位
        let slTotalDbText = 0
        //水量流量表头
        tableHeadHtml += lhSLAndQTheadHtml
        tbodyhtml += "<tr><td rowspan='5'>滦河</td>"
        for (var i = 0; i < slList.length; i++) {
          var nm = slList[i].ST_NM
          var yrsl = isNull(slList[i].YRSL)
          var s = isNull(slList[i].S)
          var flag = dbFormat(slList[i].FLAG)
          if (isNullL(slList[i].FLAG) > 0) {
            slTotalDbText++
          }
          const GOALQ = isNull(slList[i].GOALQ)
          const DBNUM = isNull(slList[i].DBNUM)
          if (i > 0) {
            tbodyhtml += '<tr>'
          }
          tbodyhtml += '<td>' + nm + '</td>'
          tbodyhtml += '<td>' + s + '</td>'
          tbodyhtml += '<td>' + yrsl + '</td>'
          tbodyhtml += '<td>' + flag + '</td>'
          tbodyhtml += '<td>' + GOALQ + '</td>'
          tbodyhtml += '<td>12</td>'
          tbodyhtml += '<td>' + DBNUM + '</td>'
          if (DBNUM == 12) {
            tbodyhtml += '<td>达标</td></tr>'
            if (qdbnum == '') {
              qdbnum = '1'
            }
          } else if (DBNUM >= 10 && DBNUM <= 11) {
            tbodyhtml += '<td>基本达标</td></tr>'
            if (qdbnum == '1' || qdbnum == '') {
              qdbnum = '2'
            }
          } else {
            if (qdbnum == '2' || qdbnum == '1' || qdbnum == '') {
              qdbnum = '0'
            }
            tbodyhtml += "<td><span style='color:red'>未达标</span></td></tr>"
          }
        }
        //数据的条数就是测站数,当达标数等于测站数,所有站全达标
        //	    		if(qdbnum=='3'){
        qdbText = dbFormat(qdbnum)
        //	    			"未达标";
        finalPgResult = qdbnum
        //	    		}
        //	    		if(qdbnum==slList.length){
        //	    			qdbText="达标";
        //	    			finalPgResult='1';
        //	    		}
        if (slTotalDbText == slList.length) {
          slTotalDbText = '达标'
        } else {
          slTotalDbText = "<span style=\'color:red\'>未达标</span>"
        }
        tbodyhtml +=
          '<tr>' +
          "<td colspan='3'>评估结果</td>" +
          '<td>' +
          slTotalDbText +
          '</td>' +
          "<td colspan='3'>评估结果</td>" +
          '<td>' +
          qdbText +
          '</td>' +
          '</tr>'
        tbodyhtml +=
          '<tr>' +
          "<td colspan='3'>评估结果</td>" +
          "<td colspan='5'>" +
          dbFormat(finalPgResult) +
          '</td>' +
          '</tr>'
      }
      $('#lh_theadtab').html(tableHeadHtml)
      $('#lh_slqtbody').html(tbodyhtml)

      //关闭遮罩层
      layer.close(index_load)
    }
  })
}

function ydhini() {
  //打开遮罩层
  //	var index_load = layer.load(1, {
  //		  shade: [0.6,'#fff'] //0.1透明度的白色背景
  //		});
  //
  param.yr = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getYDHEveStatYrSl',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      let tableHeadHtml = ''
      //水量表头
      tableHeadHtml += ydhSLTheadHtml
      let tbodyhtml = "<tr><td rowspan='3'>永定河</td>"
      for (let i = 0; i < result.length; i++) {
        const nm = result[i].ST_NM
        const yrsl = isNull(result[i].YRSL)
        const s = isNull(result[i].S)
        const flag = dbFormat(result[i].FLAG)
        var dbsum = isNullL(result[i].FLAG)
        if (i > 0) {
          tbodyhtml += '<tr>'
        }
        tbodyhtml += '<td>' + nm + '</td>'
        tbodyhtml += '<td>' + s + '</td>'
        tbodyhtml += '<td>' + yrsl + '</td>'
        tbodyhtml += '<td>' + flag + '</td></tr>'
        dbsum += dbsum
      }
      if (dbsum == 2) {
        tbodyhtml += "<tr><td colspan='3'>评估结果</td><td>达标</td></tr>"
      } else {
        tbodyhtml +=
          "<tr><td colspan='3'>评估结果</td><td><span style='color:red'>未达标</span></td></tr>"
      }
      $('#ydh_theadtab').html(tableHeadHtml)
      $('#ydh_slqtbody').html(tbodyhtml)
    }
  })
}

function whini() {
  param.yr = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getWHEveStatYrSl',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      let tableHeadHtml = ''
      //水量表头
      tableHeadHtml += ydhSLTheadHtml
      let tbodyhtml = "<tr><td rowspan='2'>卫河</td>"
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const nm = result[i].ST_NM
          const yrsl = isNull(result[i].YRSL)
          const s = isNull(result[i].S)
          var flag = dbFormat(result[i].FLAG)
          //					var dbsum=isNullL(result[i].FLAG);
          if (i > 0) {
            tbodyhtml += '<tr>'
          }
          tbodyhtml += '<td>' + nm + '</td>'
          tbodyhtml += '<td>' + s + '</td>'
          tbodyhtml += '<td>' + yrsl + '</td>'
          tbodyhtml += '<td>' + flag + '</td></tr>'
        }
        tbodyhtml += "<tr><td colspan='3'>评估结果</td><td>" + flag + '</td></tr>'
      } else {
        tbodyhtml += '<td>元村集</td>'
        tbodyhtml += '<td></td>'
        tbodyhtml += '<td></td>'
        tbodyhtml += '<td></td>'
        tbodyhtml += '<td></td></tr>'
        tbodyhtml += "<tr><td colspan='3'>评估结果</td><td>非丰水年不进行评估</td></tr>"
      }

      $('#wh_theadtab').html(tableHeadHtml)
      $('#wh_slqtbody').html(tbodyhtml)
    }
  })
}

function qlhini() {
  param.yr = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getQLHEveStatYrZ',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      let tableHeadHtml = ''
      //表头
      tableHeadHtml += QLHZTheadHtml
      let tbodyhtml = "<tr><td rowspan='3'>七里海</td>"
      tbodyhtml += "<td rowspan='3'>淮淀闸（津唐运河）</td>"
      //总考核时段数
      let timeNum = 0
      //总考核结果
      let rate = 0
      let flag = "<span style='color:red'>未达标</span>"
      for (let i = 0; i < result.length; i++) {
        const monthNm = result[i].GROUPID
        const DBNUM = isNull(result[i].DBNUM)
        const Z = isNull(result[i].Z)
        const STATEFLAG = typeFormate(result[i].STATEFLAG)
        if (i == 0) {
          tbodyhtml += "<td rowspan='2'>" + STATEFLAG + '</td>'
        }
        if (i > 0) {
          tbodyhtml += '<tr>'
        } //总考核时段数
        if (monthNm == '4月') {
          timeNum = 3
        } else {
          timeNum = 18
        }
        //达标率
        const dbpercent = ((parseFloat(DBNUM) / parseFloat(timeNum)) * 100).toFixed(1)
        tbodyhtml += '<td>' + monthNm + '</td>'
        tbodyhtml += '<td>' + Z + '</td>'
        tbodyhtml +=
          '<td>' +
          timeNum +
          '</td>' +
          '<td>' +
          DBNUM +
          '</td>' +
          '<td>' +
          dbpercent +
          '%</td>' +
          '</tr>'
        if (dbpercent == 100) {
          rate++
        }
      }
      if (rate == 2) {
        flag = '达标'
      }
      tbodyhtml += "<tr><td colspan='4'>评估结果</td><td colspan='2'>" + flag + '</td></tr>'

      $('#qlh_theadtab').html(tableHeadHtml)
      $('#qlh_slqtbody').html(tbodyhtml)
    }
  })
}

function bydini() {
  param.yr = $('#year').val()
  $('#tbody').html('')
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getBYDEveStatYrZ',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      let tableHeadHtml = ''
      //表头
      tableHeadHtml += QLHZTheadHtml
      let tbodyhtml = "<tr><td rowspan='3'>白洋淀</td>"
      tbodyhtml += "<td rowspan='3'>十方院</td>"
      //总考核时段数
      const timeNum = 30
      //总考核结果
      let rate = 0
      let flag = "<span style='color:red'>未达标<span>"
      for (let i = 0; i < result.length; i++) {
        const monthNm = result[i].GROUPTEXT
        const DBNUM = isNull(result[i].DBNUM)
        const Z = isNull(result[i].Z)
        const STATEFLAG = typeFormate(result[i].STATEFLAG)
        if (i == 0) {
          tbodyhtml += "<td rowspan='2'>" + STATEFLAG + '</td>'
        }
        if (i > 0) {
          tbodyhtml += '<tr>'
        }
        //达标率
        const dbpercent = ((parseFloat(DBNUM) / parseFloat(timeNum)) * 100).toFixed(1)
        tbodyhtml += '<td>' + monthNm + '</td>'
        tbodyhtml += '<td>' + Z + '</td>'
        tbodyhtml +=
          '<td>' +
          timeNum +
          '</td>' +
          '<td>' +
          DBNUM +
          '</td>' +
          '<td>' +
          dbpercent +
          '%</td>' +
          '</tr>'
        if (dbpercent == 100) {
          rate++
        }
      }
      if (rate == 1) {
        flag = '达标'
      }
      tbodyhtml += "<tr><td colspan='4'>评估结果</td><td colspan='2'>" + flag + '</td></tr>'

      $('#byd_theadtab').html(tableHeadHtml)
      $('#byd_slqtbody').html(tbodyhtml)
    }
  })
}

function dbFormat(val) {
  switch (val) {
    case '0':
      return "<span style='color:red'>未达标</span>"
    case '1':
      return '达标'
    case '2':
      return '基本达标'
    default:
      return '-'
  }
}
//评价类型
function typeFormate(val) {
  switch (val) {
    case 'l':
      return '劣于设计保证率'
    case 'y':
      return '优于设计保证率'
    case 'zo':
      return '各水源来水充足'
    case 'nzo':
      return '引黄或上游水库来水不足需启动引江水'
    default:
      return '-'
  }
}
