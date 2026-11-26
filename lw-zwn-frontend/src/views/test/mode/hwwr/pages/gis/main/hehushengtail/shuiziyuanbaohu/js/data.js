let symbol_kaohezhan = null
let symbol_kaohezhan_shan = null
let symbol_guanlizhan = null
let symbol_kaoheguanlizhan = null
let symbol_jisuanzhan = null
let symbol_locate = null //定位图标
let dataArray = [] //接收后台传过来的数据
//请求省市县三级数据
function getData(urlArray, callback) {
  //加载省
  //	$.getJSON('../../../common/js/data/query_province.json',function(result){
  //		provinceArray=result.features;
  //		i=i+1;
  //		if(i==3){
  //			callback();
  //		}
  //	});
  //	//加载市
  //	$.getJSON('../../../common/js/data/query_citynew.json',function(result){
  //		cityArray=result.features;
  //		i=i+1;
  //		if(i==3){
  //			callback();
  //		}
  //	});
  //	//加载县
  //	$.getJSON('../../../common/js/data/query_townnew.json',function(result){
  //		townArray=result.features;
  //		i=i+1;
  //		if(i==3){
  //			callback();
  //		}
  //	});
  $.getJSON('/hwwr/szybh/ywgz/getSaveWaterEcologyFlowGisWarnInfo', {}, function (res) {
    addStation(res)
  })

  //dataArray=
  //		[
  //{"river":"白洋淀","STNM":"十方院（白）（堰上）","duanmian":"考核断面","ST_TP":1,"CD":30806201,"LGTD":116.1111111,"LTTD":38.86125556,"zhibiao":"生态水位","ASS_TAR":1,"ASS_TP":"旬均","ASS_TP":2,"WDBNUM":1,"CHECK_TIME_NUM":22,"ASS_REAL":6.6,"GOAL_V":6.5},
  //{"river":"七里海（西海）","STNM":"淮淀闸（津唐运河）","duanmian":"考核断面","ST_TP":1,"CD":99990176,"LGTD":117.5551667,"LTTD":39.27675,"zhibiao":"生态水位","ASS_TAR":1,"ASS_TP":"旬均","ASS_TP":2,"WDBNUM":0,"CHECK_TIME_NUM":22,"ASS_REAL":1.8,"GOAL_V":1.5},
  //{"river":"七里海（西海）","STNM":"淮淀闸（潮白新河）","duanmian":"管理断面","ST_TP":2,"CD":99990095,"LGTD":117.555,"LTTD":39.27666667,"zhibiao":"","ASS_TAR":1,"ASS_TP":"","ASS_TP":2,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":2.1,"GOAL_V":""},
  //{"river":"滦河","STNM":"滦县站","duanmian":"考核断面","ST_TP":1,"CD":"00000001","LGTD":118.7681667,"LTTD":39.7585,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"年累计","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":11000,"GOAL_V":12200},
  //{"river":"","STNM":"大黑汀水库（底发溢）","duanmian":"管理断面","ST_TP":2,"CD":30101202,"LGTD":118.3149444,"LTTD":40.17786111,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":9800,"GOAL_V":""},
  //{"river":"","STNM":"桃林口水库（河道二）","duanmian":"管理断面","ST_TP":2,"CD":"00000002","LGTD":119.0525556,"LTTD":40.14338889,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":5400,"GOAL_V":""},
  //{"river":"永定河","STNM":"三家店","duanmian":"考核断面","ST_TP":1,"CD":30700500,"LGTD":116.09625,"LTTD":39.95772222,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"年累计","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":2100,"GOAL_V":2300},
  //{"river":"","STNM":"八号桥","duanmian":"管理断面","ST_TP":2,"CD":30700050,"LGTD":115.5475556,"LTTD":40.34108333,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":800,"GOAL_V":""},
  //{"river":"","STNM":"官厅水库（入永定河）","duanmian":"管理断面","ST_TP":2,"CD":30700100,"LGTD":115.6125556,"LTTD":40.21783333,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":900,"GOAL_V":""},
  //{"river":"","STNM":"卢沟桥","duanmian":"管理断面","ST_TP":2,"CD":30700700,"LGTD":116.2133889,"LTTD":39.85425,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":900,"GOAL_V":""},
  //{"river":"桑干河","STNM":"册田水库","duanmian":"考核断面","ST_TP":1,"CD":30702400,"LGTD":113.8058333,"LTTD":39.98044444,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1200,"GOAL_V":1300},
  //{"river":"","STNM":"石匣里","duanmian":"管理断面","ST_TP":2,"CD":30702700,"LGTD":114.6203611,"LTTD":40.22069444,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1100,"GOAL_V":""},
  //{"river":"洋河","STNM":"响水堡","duanmian":"考核断面","ST_TP":1,"CD":30705550,"LGTD":115.18075,"LTTD":40.50783333,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":500,"GOAL_V":700},
  //{"river":"北护城河","STNM":"松林闸","duanmian":"考核断面","ST_TP":1,"CD":30523800,"LGTD":116.35,"LTTD":39.95,"zhibiao":"生态基流","ASS_TAR":3,"ASS_TP":"月均","ASS_TP":3,"WDBNUM":0,"CHECK_TIME_NUM":7,"ASS_REAL":0.3,"GOAL_V":0.2},
  //{"river":"十三陵水库","STNM":"库水位","duanmian":"考核断面","ST_TP":1,"CD":30503400,"LGTD":116.2635833,"LTTD":40.24822222,"zhibiao":"生态水位","ASS_TAR":1,"ASS_TP":"日均","ASS_TP":1,"WDBNUM":0,"CHECK_TIME_NUM":230,"ASS_REAL":86,"GOAL_V":85},
  //{"river":"","STNM":"东七里海水库站","duanmian":"管理断面","ST_TP":2,"CD":30301050,"LGTD":117.5519444,"LTTD":39.30666667,"zhibiao":"","ASS_TAR":1,"ASS_TP":"","ASS_TP":1,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":76,"GOAL_V":""},
  //{"river":"","STNM":"淮淀闸（潮白新河）","duanmian":"管理断面","ST_TP":2,"CD":99990095,"LGTD":117.555,"LTTD":39.27666667,"zhibiao":"","ASS_TAR":1,"ASS_TP":"","ASS_TP":1,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":57,"GOAL_V":""},
  //{"river":"洪泥河","STNM":"洪泥河首闸","duanmian":"考核断面","ST_TP":1,"CD":31003250,"LGTD":117.3382778,"LTTD":38.82902778,"zhibiao":"生态水位","ASS_TAR":1,"ASS_TP":"月均","ASS_TP":3,"WDBNUM":0,"CHECK_TIME_NUM":7,"ASS_REAL":2.5,"GOAL_V":2.43},
  //{"river":"洪泥河","STNM":"洪泥河防洪闸","duanmian":"管理断面","ST_TP":2,"CD":30600651,"LGTD":117.3330833,"LTTD":38.0535,"zhibiao":"","ASS_TAR":1,"ASS_TP":"","ASS_TP":3,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1.8,"GOAL_V":""},
  //{"river":"","STNM":"南三孔节制闸上","duanmian":"管理断面","ST_TP":2,"CD":99990077,"LGTD":117.0546944,"LTTD":39.33136111,"zhibiao":"","ASS_TAR":1,"ASS_TP":"","ASS_TP":3,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1.9,"GOAL_V":""},
  //{"river":"","STNM":"筐儿港上（北运河）","duanmian":"管理断面","ST_TP":2,"CD":30502200,"LGTD":117.0711111,"LTTD":39.43194444,"zhibiao":"生态水位","ASS_TAR":1,"ASS_TP":"","ASS_TP":3,"WDBNUM":0,"CHECK_TIME_NUM":"","ASS_REAL":1.9,"GOAL_V":1.8},
  //{"river":"滹沱河（河北段）","STNM":"岗南水库（坝下）","duanmian":"考核断面","ST_TP":1,"CD":30909200,"LGTD":114.0091389,"LTTD":38.32788889,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"年累计","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":650,"GOAL_V":800},
  //{"river":"滹沱河（河北段）","STNM":"黄壁庄水库（坝下）","duanmian":"考核断面","ST_TP":1,"CD":30909303,"LGTD":114.3122778,"LTTD":38.24630556,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"年累计","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1200,"GOAL_V":1500},
  //{"river":"滹沱河（河北段）","STNM":"小觉（滹沱河）","duanmian":"管理断面","ST_TP":2,"CD":30909100,"LGTD":113.71075,"LTTD":38.39105556,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1000,"GOAL_V":""},
  //{"river":"滹沱河（河北段）","STNM":"平山（冶河）","duanmian":"管理断面","ST_TP":2,"CD":30912400,"LGTD":114.1886389,"LTTD":38.25669444,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":800,"GOAL_V":""},
  //{"river":"青龙河（河北段）","STNM":"桃林口水库（河道二）","duanmian":"考核断面","ST_TP":1,"CD":00000013,"LGTD":119.0525556,"LTTD":40.14338889,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"年累计","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":2500,"GOAL_V":2700},
  //{"river":"衡水湖","STNM":"衡水湖千顷洼（洼内）","duanmian":"考核断面","ST_TP":1,"CD":"00000014","LGTD":115.6440278,"LTTD":37.65772222,"zhibiao":"生态水位","ASS_TAR":1,"ASS_TP":"季均","ASS_TP":4,"WDBNUM":0,"CHECK_TIME_NUM":2,"ASS_REAL":21.1,"GOAL_V":19.5},
  //{"river":"桑干河（山西段）","STNM":"册田水库","duanmian":"考核断面、管理断面","ST_TP":3,"CD":"00000015","LGTD":113.8058333,"LTTD":39.98044444,"zhibiao":"生态水量","ASS_TAR":2,"ASS_TP":"年累计","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":1000,"GOAL_V":1315},
  //{"river":"桑干河（山西段）","STNM":"东榆林水库","duanmian":"管理断面","ST_TP":2,"CD":"00000016","LGTD":112.7275,"LTTD":39.39713889,"zhibiao":"","ASS_TAR":2,"ASS_TP":"","ASS_TP":"","WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":800,"GOAL_V":""},
  //{"river":"滹沱河","STNM":"南庄","duanmian":"考核断面、管理断面","ST_TP":3,"CD":30909000,"LGTD":113.2283611,"LTTD":38.46433333,"zhibiao":"生态基流","ASS_TAR":3,"ASS_TP":"评价时长为：日，设置两年过渡期，过渡期内按月水量考核","ASS_TP":1,"WDBNUM":0,"CHECK_TIME_NUM":220,"ASS_REAL":2.1,"GOAL_V":1.93},
  //{"river":"","STNM":"界河铺","duanmian":"管理断面","ST_TP":2,"CD":30908800,"LGTD":112.7301111,"LTTD":38.62880556,"zhibiao":"","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":"","GOAL_V":""},
  //{"river":"浊漳河","STNM":"关河水库","duanmian":"考核断面、管理断面","ST_TP":3,"CD":31008402,"LGTD":112.88,"LTTD":36.83166667,"zhibiao":"生态基流","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":0,"CHECK_TIME_NUM":220,"ASS_REAL":0.6,"GOAL_V":0.54},
  //{"river":"","STNM":"候壁","duanmian":"考核断面","ST_TP":1,"CD":"00000018","LGTD":113.6182222,"LTTD":36.35555556,"zhibiao":"生态基流","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":0,"CHECK_TIME_NUM":220,"ASS_REAL":3.7,"GOAL_V":3.55},
  //{"river":"浊漳南源","STNM":"漳泽水库","duanmian":"考核断面、管理断面","ST_TP":3,"CD":31007800,"LGTD":113.0594722,"LTTD":36.32291667,"zhibiao":"生态基流","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":0,"CHECK_TIME_NUM":220,"ASS_REAL":0.8,"GOAL_V":0.7},
  //{"river":"浊漳南源","STNM":"屯绛水库","duanmian":"管理断面","ST_TP":2,"CD":31008000,"LGTD":112.7163889,"LTTD":36.31638889,"zhibiao":"","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":0.6,"GOAL_V":""},
  //{"river":"浊漳西源","STNM":"后湾水库","duanmian":"考核断面、管理断面","ST_TP":3,"CD":31008100,"LGTD":112.8206389,"LTTD":36.55591667,"zhibiao":"生态基流","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":1,"CHECK_TIME_NUM":220,"ASS_REAL":0.5,"GOAL_V":0.42},
  //{"river":"浊漳西源","STNM":"圪芦河水库","duanmian":"管理断面","ST_TP":2,"CD":31008070,"LGTD":112.6830556,"LTTD":36.7,"zhibiao":"","ASS_TAR":3,"ASS_TP":"","ASS_TP":1,"WDBNUM":"","CHECK_TIME_NUM":"","ASS_REAL":0.3,"GOAL_V":""},
  //
  //];
  //	addStation(dataArray);
}
//添加测站
function addStation(arr) {
  dataArray = arr

  for (let i = 0, len = dataArray.length; i < len; i++) {
    const item = dataArray[i]

    const x = parseFloat(item.LGTD)
    const y = parseFloat(item.LTTD)
    //判断经纬度是否存在
    if (isNaN(x) || x == null || x == undefined || x == 0) {
      continue
    }
    const point_icon = new GIS.Point(x, y)
    let symbol = symbol_kaohezhan
    let layer = layer_kaoheduanmian
    let infolayer = info_kaoheduanmian
    item.ST_TP = item.ST_TP + ''
    //判断类型ST_TP:断面类型:测站类型：1、考核断面；2、管理断面；3、考核、管理断面；4、计算断面
    switch (item.ST_TP + '') {
      case '1':
        if (item.WDBNUM && item.WDBNUM > 0) {
          symbol = symbol_kaohezhan_shan
        } else {
          symbol = symbol_kaohezhan
        }

        layer = layer_kaoheduanmian
        infolayer = info_kaoheduanmian
        break
      case '2':
        symbol = symbol_guanlizhan
        layer = layer_guanliduanmian
        infolayer = info_guanliduanmian
        break
      case '3':
        symbol = symbol_kaoheguanlizhan
        layer = layer_kaoheguanliduanmian
        infolayer = info_kaoheguanliduanmian
        break
      case '4':
        symbol = symbol_jisuanzhan
        layer = layer_jisuanduanmian
        infolayer = info_jisuanduanmian
        break
    }
    const graphic_icon = new GIS.Graphic(point_icon, symbol, item)
    layer.add(graphic_icon)
    //判断默认是否显示标签
    if (!item.WDBNUM || item.WDBNUM < 1) {
      continue
    }
    addInfoGra(item, infolayer)
  }
}
function addInfoGra(item, infolayer) {
  //添加标签
  const x = parseFloat(item.LGTD)
  const y = parseFloat(item.LTTD)
  const point_info = new GIS.Point(x, y)
  const graphic_info = new GIS.Graphic(point_info)
  const STNM = item.STNM
  let info_content_label1 = ''
  let info_content_label2 = ''
  let info_content_label3 = ''
  let info_content_value1 = ''
  let info_content_value2 = ''
  let info_content_value3 = ''
  let danwei1 = 'm³'
  let danwei2 = 'm³/s'
  info_content_value1 = item.GOAL_V
  info_content_value2 = item.ASS_REAL
  item.ASS_TAR = item.ASS_TAR + ''
  item.ASS_TP = item.ASS_TP + ''
  let winH = 60
  //
  //ASS_TAR == "2" 保留第二行 其中ST_TP4  为计算断面
  //2021年10月28日通知去掉第二行 只保留年的。
  if (item.ST_TP == '1' || item.ST_TP == '3' || item.ST_TP == '4') {
    //水位
    if (item.ASS_TAR == '1') {
      //默认为年
      danwei1 = 'm'
      danwei2 = 'm'
      //日
      if (item.ASS_TP == '1') {
        info_content_label1 = '日均水位目标：'
        info_content_label2 = '今日水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //旬均
      else if (item.ASS_TP == '2') {
        info_content_label1 = '旬均水位目标：'
        info_content_label2 = '本旬水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //月均
      else if (item.ASS_TP == '3') {
        info_content_label1 = '月均水位目标：'
        info_content_label2 = '本月水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //季均
      else if (item.ASS_TP == '4') {
        info_content_label1 = '季均水位目标：'
        info_content_label2 = '本季水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      } else if (item.ASS_TP == '5') {
        info_content_label1 = '年均水位目标：'
        info_content_label2 = '本年水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //判断是否为空
      if (item.REL_CHECK_TIME_NUM == undefined) {
        item.REL_CHECK_TIME_NUM = ''
      }
      info_content_value3 = item.REL_CHECK_TIME_NUM + '/' + item.WDBNUM
    }
    //生态水量
    else if (item.ASS_TAR == '2') {
      if (item.ST_TP == '4') {
        //只显示info_content_label2  计算断面
        winH = 110
        danwei1 = '万m³'
        danwei2 = '万m³'
        //只有年
        info_content_label1 = '生态水量目标：：'
        info_content_label2 = '今年累计：'
        info_content_label3 = '完成百分比：'
        info_content_value3 = parseFloat((item.ASS_REAL / item.GOAL_V).toFixed(2) * 100) + '%'
      } else {
        winH = 110
        danwei1 = '万m³'
        danwei2 = '万m³'
        //只有年
        info_content_label1 = '生态水量目标：：'
        info_content_label2 = '今年累计：'
        info_content_label3 = '完成百分比：'
        info_content_value3 = parseFloat((item.ASS_REAL / item.GOAL_V).toFixed(2) * 100) + '%'
      }
    }
    //生态基流
    else if (item.ASS_TAR == '3') {
      danwei1 = 'm³/s'
      danwei2 = 'm³/s'
      //日
      if (item.ASS_TP == '1') {
        info_content_label1 = '日均生态基流目标：'
        info_content_label2 = '今日实际：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //月均
      else if (item.ASS_TP == '3') {
        info_content_label1 = '月均生态基流目标：'
        info_content_label2 = '本月实际：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //判断是否为空
      if (item.REL_CHECK_TIME_NUM == undefined) {
        item.REL_CHECK_TIME_NUM = ''
      }
      info_content_value3 = item.REL_CHECK_TIME_NUM + '/' + item.WDBNUM
    }
    var content = '<div class="info-container">' + '<div class="info-title">'
    if (item.WDBNUM > 0) {
      content = content + '<img src="img/infologo.png"  class="info-logo"/>'
    }
    //			+'<img src="img/infologo.png"  class="info-logo"/>'
    content = content + '<span class="info-name">' + STNM + '</span></div>'
    if (item.ASS_TAR == '2' && (item.ST_TP == '1' || item.ST_TP == '3')) {
      content =
        content +
        '<div class="info-content"><span>' +
        info_content_label1 +
        '<span class="info-value">' +
        info_content_value1 +
        '</span><span>' +
        danwei1 +
        '</span></div>'
    }

    if (item.ASS_TAR == '2') {
      content =
        content +
        '<div class="info-content">' +
        info_content_label2 +
        '<span class="info-value">' +
        info_content_value2 +
        '</span>' +
        danwei2 +
        '</div>'
    }
    if (item.ST_TP != '4') {
      if (item.WDBNUM > 0) {
        content =
          content +
          '<div class="info-content" style="color:#FF3434;">' +
          info_content_label3 +
          '<span class="info-value"> ' +
          info_content_value3 +
          '</span></div>' +
          '</div>'
      } else {
        content =
          content +
          '<div class="info-content">' +
          info_content_label3 +
          '<span class="info-value"> ' +
          info_content_value3 +
          '</span></div>' +
          '</div>'
      }
    }
    graphic_info.setAttributes({
      pos: 'top',
      winW: 240,
      winH: winH,
      offsetY: -10,
      content: content
    })
    infolayer.add(graphic_info)
  } else {
    //水位
    if (item.ASS_TAR == '1') {
      //默认为年
      danwei1 = 'm'
      danwei2 = 'm'
      //日
      if (item.ASS_TP == '1') {
        info_content_label1 = '日均水位目标：'
        info_content_label2 = '今日水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //旬均
      else if (item.ASS_TP == '2') {
        info_content_label1 = '旬均水位目标：'
        info_content_label2 = '本旬水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //月均
      else if (item.ASS_TP == '3') {
        info_content_label1 = '月均水位目标：'
        info_content_label2 = '本月水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //季均
      else if (item.ASS_TP == '4') {
        info_content_label1 = '季均水位目标：'
        info_content_label2 = '本季水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      } else if (item.ASS_TP == '5') {
        info_content_label1 = '年均水位目标：'
        info_content_label2 = '本年水位：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      info_content_value3 = item.REL_CHECK_TIME_NUM + '/' + item.WDBNUM
    }
    //生态水量
    else if (item.ASS_TAR == '2') {
      danwei1 = '万m³'
      danwei2 = '万m³'
      //只有年
      info_content_label1 = '生态水量目标：：'
      info_content_label2 = '今年累计：'
      info_content_label3 = '完成百分比：'
      info_content_value3 = item.ASS_REAL / item.GOAL_V
    }
    //生态基流
    else if (item.ASS_TAR == '3') {
      danwei1 = 'm³/s'
      danwei2 = 'm³/s'
      //日
      if (item.ASS_TP == '1') {
        info_content_label1 = '日均生态基流目标：'
        info_content_label2 = '今日实际：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      //月均
      else if (item.ASS_TP == '3') {
        info_content_label1 = '月均生态基流目标：'
        info_content_label2 = '本月实际：'
        info_content_label3 = '今年评价时段数/未达标：'
      }
      info_content_value3 = item.REL_CHECK_TIME_NUM + '/' + item.WDBNUM
    }
    var content = '<div class="info-container">' + '<div class="info-title">'
    if (item.WDBNUM > 0) {
      content = content + '<img src="img/infologo.png"  class="info-logo"/>'
    }
    //			+'<img src="img/infologo.png"  class="info-logo"/>'
    content =
      content +
      '<span class="info-name">' +
      STNM +
      '</span></div>' +
      '<div class="info-content">' +
      info_content_label2 +
      '<span class="info-value">' +
      info_content_value2 +
      '</span>' +
      danwei2 +
      '</div>'
    graphic_info.setAttributes({ pos: 'top', winW: 190, winH: 60, offsetY: -10, content: content })
    infolayer.add(graphic_info)
  }
}
function addInfor(graphics) {
  const pt = new GIS.Point(graphics.geometry.x, graphics.geometry.y)
  const graphic = new GIS.Graphic(pt)
  graphic.setAttributes({
    pos: 'rt',
    winW: 125,
    winH: 60,
    content:
      '时间：' +
      graphics.attributes.TM +
      '年</br>入境：' +
      graphics.attributes.IN_PROV_WAT +
      '</br>出境：' +
      graphics.attributes.OUT_PORV_WAT
  })
  infoLayer.add(graphic)
}
//初始化样式
function initStyle() {
  symbol_kaohezhan = new GIS.PictureMarkerSymbol('./img/kaohezhan.png', 18, 18)
  symbol_kaohezhan_shan = new GIS.PictureMarkerSymbol('./img/kaohezhan1.gif', 18, 18)
  symbol_guanlizhan = new GIS.PictureMarkerSymbol('./img/guanlizhan.png', 18, 18)
  symbol_kaoheguanlizhan = new GIS.PictureMarkerSymbol('./img/kaoheguanlizhan.png', 18, 18)
  symbol_jisuanzhan = new GIS.PictureMarkerSymbol('./img/jisuanzhan.png', 18, 18)
  symbol_locate = new GIS.PictureMarkerSymbol('./img/find.gif', 21, 21)
}
/**
 * 定位
 * @param stcd
 */
function locate(stcd) {
  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i]
    if (item.CD == stcd) {
      map.centerAt([item.LGTD, item.LTTD])
      const gra = new GIS.Graphic(new GIS.Point(item.LGTD, item.LTTD))
      //gra.attributes.GRATYPE=type;
      gra.setSymbol(symbol_locate)
      locateLayer.clear()
      locateLayer.add(gra)
    }
  }
}

function initArea(type, stcd) {
  let gra = null
  // 1 省  2 市 3 线
  if (type == 1) {
    for (var i = 0, len = provinceArray.length; i < len; i++) {
      var obj = provinceArray[i]
      if (obj.attributes.CD == stcd) {
        gra = new GIS.Graphic(obj)
        break
      }
    }
  } else if (type == 2) {
    for (var i = 0, len = cityArray.length; i < len; i++) {
      var obj = cityArray[i]
      if (obj.attributes.CD == stcd) {
        gra = new GIS.Graphic(obj)
        break
      }
    }
  } else if (type == 3) {
    for (var i = 0, len = townArray.length; i < len; i++) {
      var obj = townArray[i]
      if (obj.attributes.CD == stcd) {
        gra = new GIS.Graphic(obj)
        break
      }
    }
  }
  if (gra) {
    map.setExtent(gra.geometry.getExtent().expand(1.4))
  }
}
//行政区鼠标移上事件
function xzqlayerHover(evt) {
  map.setMapCursor('pointer')
  const graphicover = evt.graphic
  let name = evt.graphic.attributes.NAME
  //var name="白洋淀";
  if (typeof name === 'undefined' || name == null || name == '') {
    name = '名称：'
  }
  $('#search_label').html(name)
  $('#search_label').css({
    left: evt.pageX + 5,
    top: evt.pageY - 15
  })
}
//行政区鼠标移出事件
function xzqlayerOut(evt) {
  $('#search_label').css({
    left: -5000,
    top: 5000
  })
}
function popGra(event) {
  console.log('mouseup')
  const gra = event.graphic
  info_pop.clear()
  //判断是否需要标签
  if (!gra.attributes.WDBNUM || gra.attributes.WDBNUM < 1) {
    addInfoGra(gra.attributes, info_pop)
  }
}
function hidePop(event) {
  console.log('mouseout')
  info_pop.clear()
}
