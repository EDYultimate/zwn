const mothArr = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]
const mothNumArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const wrz_cdArr = ['CAA00000000S', 'CC000000000S', 'CGA00000000E', 'C13A0171', 'C13A012']
const param = {}
const theadHtmlM =
  '<tr><td>河流</td><td>控制断面</td><td>1月</td>' +
  '<td>2月</td><td>3月</td><td>4月</td><td>5月</td><td>6月</td><td>7月</td><td>8月</td>' +
  '<td>9月</td><td>10月</td><td>11月</td><td>12月</td><td>目标值</td></tr>'
const theadHtmlX =
  '<tr><td>河流</td><td>控制断面</td><td>旬</td><td>1月</td>' +
  '<td>2月</td><td>3月</td><td>4月</td><td>5月</td><td>6月</td><td>7月</td><td>8月</td>' +
  '<td>9月</td><td>10月</td><td>11月</td><td>12月</td><td>目标值</td></tr>'
//滦河测站编码
const lhstat = []
$(function () {
  getYr()
})

function getYr() {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 130

  $('.conent').css('height', tbHeight)
  const now = new Date()
  const date = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
  const year = date.getFullYear()
  $('#year').val(year)
  ini()
}

function ini() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  $('#t_year').text($('#year').val())
  param.yr = $('#year').val()
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getEveRvBasicInfo',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      console.info(result)
      let tbodyHtml = ''

      //	    	for(var x=0;x<wrz_cdArr.length;x++){
      //	    		//将河流放入数组
      //	    		var wrzcd=wrz_cdArr[x];
      //	    		var theadHtml=theadHtmlM;
      //	    		var tbodyHtml="";
      let rvcdBox = '' //中间存放河流编码的容器
      for (let i = 0; i < result.length; i++) {
        const WRZ_NM = result[i].NM
        const stcd = result[i].STCD
        const STNM = result[i].ST_NM
        const TYPE = result[i].TOTALTYPE
        const COL = result[i].TOTALCOL
        const RV_CD = result[i].RV_CD
        if (RV_CD != rvcdBox) {
          //新建表格
          tbodyHtml += '<table class="bbTable" style="width:95%;\;margin-top:18px" >'
          tbodyHtml += '<thead>'

          tbodyHtml += '<td>河流</td><td>断面名称</td>'
          if (TYPE == '2') {
            //旬上报
            tbodyHtml += '<td>旬</td>'
          }
          for (let j = 0; j < mothArr.length; j++) {
            tbodyHtml += '<td>' + mothArr[j] + '</td>' //遍历表头月份
          }
          tbodyHtml += '<td>目标值</td>'
          tbodyHtml += '</thead>'
          //上报表格体建造
          tbodyHtml += '<tr>'
          if (TYPE == '2') {
            //旬上报,每站需要三行
            tbodyHtml += "<td rowspan='3'>" + WRZ_NM + "</td><td rowspan='3'>" + STNM + '</td>'
            for (var x = 1; x <= 3; x++) {
              //三旬遍历行
              if (x > 1) {
                tbodyHtml += '<tr>'
                if (x == '2') {
                  tbodyHtml += '<td>中旬</td>'
                }
                if (x == '3') {
                  tbodyHtml += '<td>下旬</td>'
                }
              }
              if (x == 1) {
                tbodyHtml += '<td>上旬</td>'
              }
              for (var m = 0; m < mothNumArr.length; m++) {
                //遍历上报表格体的每个月
                tbodyHtml +=
                  "<td><input id='" +
                  x +
                  '_' +
                  mothNumArr[m] +
                  '_' +
                  stcd +
                  '_' +
                  COL +
                  "' class='readInput'></td>" //input中ID命名规则（旬_月_断面测站编码_上报列）上报列：AVZ/AVQ
              }
              if (x == 1) {
                tbodyHtml += "<td rowspan='3' id='" + stcd + '_' + COL + "'></td>"
              }
              tbodyHtml += '</tr>'
            }
          } else {
            //月上报每站一行
            tbodyHtml += '<td>' + WRZ_NM + '</td><td>' + STNM + '</td>'
            for (var m = 0; m < mothNumArr.length; m++) {
              //遍历上报表格体的每个月
              tbodyHtml +=
                "<td><input id='4_" +
                mothNumArr[m] +
                '_' +
                stcd +
                '_' +
                COL +
                "' class='readInput'></td>"
            }
            tbodyHtml += "<td id='" + stcd + '_' + COL + "'></td>"
            tbodyHtml += '</tr>'
          }

          tbodyHtml += '</tr>'
        } else {
          //上报表格体建造
          tbodyHtml += '<tr>'
          if (TYPE == '2') {
            //旬上报,每站需要三行
            tbodyHtml += "<td rowspan='3'>" + WRZ_NM + "</td><td rowspan='3'>" + STNM + '</td>'
            for (var x = 1; x <= 3; x++) {
              //三旬遍历行
              if (x > 1) {
                tbodyHtml += '<tr>'
                if (x == '2') {
                  tbodyHtml += '<td>中旬</td>'
                }
                if (x == '3') {
                  tbodyHtml += '<td>下旬</td>'
                }
              }
              if (i == 1) {
                tbodyHtml += '<td>上旬</td>'
              }
              for (var m = 0; m < mothNumArr.length; m++) {
                //遍历上报表格体的每个月
                tbodyHtml +=
                  "<td><input id='" +
                  x +
                  '_' +
                  mothNumArr[m] +
                  '_' +
                  stcd +
                  '_' +
                  COL +
                  "' class='readInput'></td>"
              }
              tbodyHtml += "<td id='" + stcd + '_' + COL + "'></td>"
              tbodyHtml += '</tr>'
            }
          } else {
            //月上报每站一行
            tbodyHtml += '<td>' + WRZ_NM + '</td><td>' + STNM + '</td>'
            for (var m = 0; m < mothNumArr.length; m++) {
              //遍历上报表格体的每个月
              tbodyHtml +=
                "<td><input id='4_" +
                mothNumArr[m] +
                '_' +
                stcd +
                '_' +
                COL +
                "' class='readInput'></td>"
            }
            tbodyHtml += "<td id='" + stcd + '_' + COL + "'></td>"
            tbodyHtml += '</tr>'
          }

          tbodyHtml += '</tr>'
        }
        rvcdBox = RV_CD
      }

      $('#tableDiv').html(tbodyHtml)

      //关闭遮罩层
      iniData()
      layer.close(index_load)
    }
  })
}

function iniData() {
  param.yr = $('#year').val()
  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/getAllDataByYr',
    data: param,
    dataType: 'json',
    type: 'post',
    success: function (result) {
      const jcList = result.jc //实时监测数据（以实时监测数据为主）
      const selfList = result.self //人员自己上报的数据
      const goalList = result.goal //人员自己上报的数据

      for (var k = 0; k < selfList.length; k++) {
        var STCD = selfList[k].STCD
        var MNTH = selfList[k].MNTH
        var PRDTP = selfList[k].PRDTP
        var TOTALCOL = selfList[k].TOTALCOL
        //旬_月_断面测站编码_上报列
        $('#' + PRDTP + '_' + MNTH + '_' + STCD + '_' + TOTALCOL).val(selfList[k][TOTALCOL])
        //    			$("#"+PRDTP+"_"+MNTH+"_"+STCD+"_"+TOTALCOL).addClass("readInput");
      }

      for (var k = 0; k < jcList.length; k++) {
        var STCD = jcList[k].STCD
        var MNTH = jcList[k].MNTH
        var PRDTP = jcList[k].PRDTP
        var TOTALCOL = jcList[k].TOTALCOL
        //旬_月_断面测站编码_上报列
        $('#' + PRDTP + '_' + MNTH + '_' + STCD + '_' + TOTALCOL).attr('disabled', 'disabled')
        $('#' + PRDTP + '_' + MNTH + '_' + STCD + '_' + TOTALCOL).removeClass('readInput')
        $('#' + PRDTP + '_' + MNTH + '_' + STCD + '_' + TOTALCOL).val(jcList[k][TOTALCOL])
      }

      for (var k = 0; k < goalList.length; k++) {
        var STCD = goalList[k].STCD
        const q = isNull(goalList[k].AVQ)
        const s = isNull(goalList[k].S)
        const GROUPTEXT = goalList[k].GROUPTEXT
        if (s != '-' && q == '-') {
          $('#' + STCD + '_AVQ').append('年水量:' + goalList[k].S + '亿m³;')
        } else {
          $('#' + STCD + '_AVQ').append('流量:' + goalList[k].AVQ + 'm³/s;')
        }
        //断面测站编码_上报列
        $('#' + STCD + '_AVZ').append(GROUPTEXT + '水位:' + goalList[k].AVZ + 'm;')
      }
    }
  })
}

function saveData() {
  //打开遮罩层
  const index_load = layer.load(1, {
    shade: [0.6, '#fff'] //0.1透明度的白色背景
  })
  const list = []
  $('.readInput').each(function () {
    const idStr = $(this).attr('id')
    const val = $(this).val().trim()
    console.info(parseInt(val))
    if (val != '' && parseInt(val) >= 0) {
      const idArr = idStr.split('_') //id命名规则可获取相应参数，旬_月_断面测站编码_上报列
      const PRDTP = idArr[0]
      const MNTH = idArr[1]
      const STCD = idArr[2]
      const TOTALCOL = idArr[3]
      const map = {}
      map.YR = $('#year').val()
      map.STCD = STCD
      map[TOTALCOL] = val
      map.PRDTP = PRDTP
      map.MNTH = MNTH
      list.push(map)
    }
  })

  console.info(list)

  $.ajax({
    url: basePath + '/szybh/Rvorlkappraise/saveSubDate',
    data: 'setList=' + JSON.stringify(list), //参数
    dataType: 'json',
    type: 'post',
    success: function (result) {
      //关闭遮罩层
      layer.close(index_load)
      alert(result.info)
      ini()
    }
  })
}
