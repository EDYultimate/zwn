//var sym_yuliang;

let sym_G //供水方
let sym_S //收水方
let count
//

let lyrInx

let dsnm //路线名称

//数据源
let dataProvider = []
/*获取要素方法*/
function getSTATList() {
  return
  sym_G = new GIS.PictureMarkerSymbol('../../common/img/bz_qsh.png', 18, 18)
  sym_S = new GIS.PictureMarkerSymbol('../../common/img/bz_qsh_4.png', 18, 18)
  const task = new GIS.QueryTask(GIS.zhuantiUrl + '/11') ////查询供收水
  const query = new GIS.Query()
  query.where = "CD ='DSXL0001'" //"1=1";//默认输入第一条线路
  query.returnGeometry = true
  query.outFields = ['*'] // ["FID","NM","STATE"];//["*"];
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}

function getSTATListQuery(nmss) {
  infoLayer.clear()
  graphicsLayer.clear()
  sym_G = new GIS.PictureMarkerSymbol('../../common/img/bz_qsh.png', 18, 18)
  sym_S = new GIS.PictureMarkerSymbol('../../common/img/bz_qsh_4.png', 18, 18)
  const task = new GIS.QueryTask(GIS.zhuantiUrl + '/11') ////查询供收水
  const query = new GIS.Query()
  query.where = "CD ='" + nmss + "'" //"1=1";//默认输入第一条线路
  query.returnGeometry = true
  query.outFields = ['*'] // ["FID","NM","STATE"];//["*"];
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}

/*调取业务数据库数据*/
function getServerStatList() {
  //获取
  console.log(basePath + 'kfly/nsbd/getDaySlTjListTotal?tm=2019-01-03&cd=' + dsnm) //kfly/nsbd/nsbdSlHjInfoForMap");
  //$.post(basePath+"kfly/nsbd/nsbdSlHjInfoForMap",{year:2018},getYWdataHandler);
  $.post(basePath + 'kfly/nsbd/getDaySlTjListTotal?tm=2019-01-03&cd=' + dsnm, getYWdataHandler)
}
/*业务数据调用返回处理*/
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  //alert(result);
  result = $.parseJSON(result)
  console.log(result)
  result = result.data
  const size = result.length
  count = 1
  for (let j = 0; j < dataProvider.length; j++) {
    const gra = dataProvider[j]
    const state = gra.attributes.STATE
    if (state == 'G') {
      gra.setSymbol(sym_G)
    } else {
      gra.setSymbol(sym_S)
    }

    for (let i = 0; i < size; i++) {
      //var item=result[i];

      if (result[i].DECD == gra.attributes.STCD) {
        let lj = result[i].LSSL //累计流量SJ;//(result[i].SJ);
        let rj = result[i].AVOTQ //实时流量(result[i].JH);
        let bjtm = result[i].BGTM
        let tm = result[i].YM
        const sz = ''
        if (typeof lj === 'undefined') {
          lj = 0
        }
        if (typeof rj === 'undefined') {
          rj = 0
        }
        if (typeof bjtm === 'undefined') {
          bjtm = ''
        }
        if (typeof tm === 'undefined') {
          tm = ''
        }
        gra.attributes.LJ = lj
        gra.attributes.RJ = rj
        gra.attributes.SZ = sz
        gra.attributes.TM = bjtm + '至' + tm
      }
    }
    graphicsLayer.add(gra)
    addInfor(gra)
    addGraName(gra)
  }
  initLineAni(lyrInx)
  //initLineArrow(lyrInx);
  //initLineAni(lyrInx);
  //addToMarker();
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  //dataProvider.clear();
  if (result.features.length > 0) {
    dataProvider = result.features
  } else {
    dataProvider = []
    //dataProvider.clear();
    initLineAni(lyrInx)
    return
  }
  /*for(var j=0;j<dataProvider.length;j++)
	{
		
		 var gra=dataProvider[j];
		 var state=gra.attributes["STATE"];
		 if(state=="G")
			 {
			  gra.setSymbol(sym_G);
			 }
		 else
			 {
			 gra.setSymbol(sym_S);
			 }
			 graphicsLayer.add(gra);
			 //addGraValueLabel(gra);
			 
			 addInfor(gra);
			 addGraName(gra);
	}*/
  //addToMarker();graphicCickHander_jsl(cd);//调用调水路线方法
  getServerStatList(1) //调用测站业务数据
}
/*获取要素报错*/
function getSTATListErro(evt) {
  console.log(evt)
}

/*
 * 增加调水路线点击事件
 */
function graphicCickHanderDsxl(event) {
  //graphicCickHander_jsl();
  const gra = event.graphic
  const cd = gra.attributes.CD
  console.log('cdd:' + cd)
  clickDsxlFun(cd)
}

/**
 * 传递调水路线名称
 * @param cd
 */
function clickDsxlFun(cd) {
  if (cd == undefined || cd == null || cd == '') {
    return
  }
  graphicCickHander_dsxl(cd) //调用调水路线方法
}

/*marker要素标注*/
function addToMarker() {}
/*添加名称*/
function addGraName(gra) {
  const attributes = GIS.copy(gra.attributes)
  const x = gra.geometry.x
  const y = gra.geometry.y
  const textSym = new GIS.TextSymbol(attributes.NM)
  textSym.setColor(new esri.Color([78, 78, 78]))
  textSym.setAlign(GIS.TextSymbol.ALIGN_MIDDLE)
  textSym.setOffset(0, -20)
  textSym.setFont(
    new esri.symbol.Font(
      '10pt',
      esri.symbol.Font.STYLE_NORMAL,
      esri.symbol.Font.VARIANT_NORMAL,
      esri.symbol.Font.WEIGHT_BOLD,
      'Arial'
    )
  )
  attributes.SHOWTYPE = 'name'
  graphicsLayer.add(new esri.Graphic(new GIS.Point(x, y), textSym, attributes))
}
/*数值标注标签*/
function addGraValueLabel(gra) {
  const newAttr = GIS.copy(gra.attributes)
  newAttr.SHOWTYPE = 'value'
  const textSym = new GIS.TextSymbol(gra.attributes.VAL)
    .setColor(new esri.Color([100, 149, 237]))
    .setAlign(GIS.TextSymbol.ALIGN_START)
    .setOffset(10, 5)
    .setFont(new esri.symbol.Font('10pt'))
    .setHaloColor(new GIS.Color([0, 0, 0]))
  graphicsLayer.add(new GIS.Graphic(gra.geometry, textSym, newAttr))
}
function addInfor(graphics) {
  const pt = new GIS.Point(graphics.geometry.x, graphics.geometry.y)
  const graphic = new GIS.Graphic(pt)
  let ste = '收'
  if (graphics.attributes.STATE == 'G') {
    ste = '供'
  }

  let lj = graphics.attributes.LJ //||12.89;
  let rj = graphics.attributes.RJ //||29.87;
  let sz = graphics.attributes.TM
  if (lj && lj > 0) {
    lj = lj.toString()
  } else {
    lj = '0'
  }

  if (rj && rj > 0) {
    rj = rj.toString()
  } else {
    rj = '0'
  }
  if (sz) {
  } else {
    sz = ''
  }

  const nmss = graphics.attributes.NM + '(' + ste + ')' //获取名字
  const idinfo = graphics.attributes.STCD //获取编号
  let widthss = 165
  const hss = 80
  if (nmss.length > 8) {
    widthss = (nmss.length - 8) * 12 + 165
  }

  if (lj.length > 6) {
    var w1 = widthss + 5 * (lj.length - 6)
    if (w1 > widthss) {
      widthss = w1
    }
  }
  if (rj.length > 6) {
    var w1 = widthss + 5 * (rj.length - 6)
    if (w1 > widthss) {
      widthss = w1
    }
  }
  if (sz.length > 6) {
    var w1 = widthss + 5 * (sz.length - 6)
    if (w1 > widthss) {
      widthss = w1
    }
  }
  //count++;
  console.log(idinfo)
  let loc = 'lt'
  if (graphics.attributes.RT) {
    loc = graphics.attributes.RT //获取位置信息
  }

  graphic.setAttributes({
    pos: loc,
    winW: widthss,
    winH: hss,
    content:
      nmss +
      '</br>日均流量(m³/s)：' +
      rj +
      '</br>累计水量(万m³)：' +
      lj +
      '</br>累计起始时间： ' +
      sz
  })
  //content:nmss+"</br>日均流量(m³/s)："+rj+"</br>累计水量(万m³)："+lj});
  //content:"<div class='chartInfo' id='"+idinfo+"'style='height:100%;width:100%'></div>"});
  infoLayer.add(graphic)
  //addChart(nmss,jh,sj,idinfo);//实例化chart图表
  //content:"名称："+graphics.attributes.NM+"("+ste+")</br>计划水量："+jh+"</br>实际水量："+sj});
}

function addChart(nm, jh, sj, chartid) {
  // 基于准备好的dom，初始化echarts图表
  //var myChart = echarts.init(document.getElementById(chartid));

  /* var option = {
		            title: {
		                text: nm
		            },
		            tooltip: {
		                show: true
		            },
		            xAxis: [
	                        {
	                            type: 'category',
	                            data: ["计划","实际"]
	                        }
	                    ],
		            yAxis: [
	                        {
	                            type: 'value', name: '（m³）'
	                        }
	                    ],
		            series: [
	                        {
	                            "name": "水量",
	                            "type": "bar",
	                            "data": [{value:jh, name:'计划'},
	                                     {value:sj, name:'实际'}]
	                        }
	                    ]
		        };
*/

  //指定图标的配置和数据
  const option = {
    title: {
      text: nm,
      x: 'left',
      y: 'top',
      textAlign: 'left',
      textStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}:{c0} 亿m³' //'{a0}:{c0}亿m³'
    },
    xAxis: {
      type: 'category',
      data: ['实际'] //["计划","实际"]
      //show:false,
      //splitLine:{show:false}
    },
    yAxis: {
      show: false,
      splitLine: { show: false }
    },
    series: [
      {
        name: '计划/实际水量',
        type: 'bar',
        barWidth: 15,
        data: [{ value: sj, name: '实际(亿m³)' }]
        //"data": [{value:jh, name:'计划(亿m³)'},
        //        {value:sj, name:'实际(亿m³)'}]
      }
    ],
    itemStyle: {
      normal: {
        color: function (params) {
          const colorList = [
            '#C33531',
            '#EFE42A',
            '#64BD3D',
            '#EE9201',
            '#29AAE3', //首先定义一个数组
            '#B74AE5',
            '#0AAF9F',
            '#E89589'
          ]
          return colorList[params.dataIndex]
        },
        label: {
          show: false
        }
      }
    }
  }

  //初始化echarts实例
  const myChart = echarts.init(document.getElementById(chartid))
  //使用制定的配置项和数据显示图表
  myChart.setOption(option)
  return myChart
}

/**
 * 恢复全图
 */
function ShowFull() {
  stop()
  let centerPoint
  const zom = 5
  centerPoint = [116.20434629393344, 39.470102461206835]

  const lyrArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13]
  dsxlLayer.setVisibleLayers(lyrArr) //设置图层可见
  map.centerAndZoom(centerPoint, zom)
  infoLayer.clear()
  graphicsLayer.clear()
  initGraphicLayer.clear()
  initLineLayer.clear()
}

/*
 * 初始化调水线路
 */
function initDsxl(inx) {
  if (inx == -1) {
    ShowFull()
    return
  }
  dsnm = 'DSXL0001'
  let lyrArr //=[0,1,2,3,4,5,6,7,8,9,10,11,13,14];
  let centerPoint
  let zom = 5
  lyrInx = 5
  switch (inx) {
    case 0:
      dsnm = 'DSXL0001'
      lyrArr = [0, 1, 5]
      lyrInx = 2 //引滦工程
      centerPoint = [117.81, 40.01]
      zom = 7
      break
    case 1:
      dsnm = 'DSXL0002'
      lyrArr = [0, 1, 9]
      lyrInx = 5 //永定河线路
      centerPoint = [114.14, 39.97]
      zom = 7
      break
    case 2:
      dsnm = 'DSXL0003'
      lyrArr = [0, 1, 4]
      centerPoint = [115.83, 37.31]
      lyrInx = 1 //岳成衡水沧州段 改为岳成应急调水
      zom = 6
      break
    case 3:
      dsnm = 'DSXL0004'
      lyrArr = [0, 1, 10]
      lyrInx = 6 //岳城日常
      centerPoint = [114.3, 36.19]
      zom = 8
      break
    case 4:
      dsnm = 'DSXL0005'
      lyrArr = [0, 1, 12]
      lyrInx = 7 //朱官屯
      centerPoint = [115.89, 37.26]
      zom = 8
      break
    case 5:
      dsnm = 'DSXL0006'
      lyrArr = [0, 1, 13]
      lyrInx = 8 //漳河上游
      centerPoint = [114.61, 36.14]
      zom = 7
      break
    case 6:
      dsnm = 'DSXL0007'
      lyrArr = [0, 1, 2]
      lyrInx = 0 //南水北调
      centerPoint = [116.20434629393344, 39.470102461206835]
      break
    case 7:
      dsnm = 'DSXL0010'
      lyrArr = [0, 1, 14]
      lyrInx = 9 //南水北调
      centerPoint = [116.20434629393344, 39.470102461206835]
      break
    case 8:
      dsnm = 'DSXL0008'
      lyrArr = [0, 1, 7]
      lyrInx = 4 //渠村线
      centerPoint = [116.20434629393344, 39.470102461206835]
      break
    case 9:
      dsnm = 'DSXL0009'
      lyrArr = [0, 1, 6]
      lyrInx = 3 //位山线
      centerPoint = [116.20434629393344, 39.470102461206835]
      break
    default:
      dsnm = 'DSXL0001'
      lyrArr = [0, 1, 6]
      lyrInx = 6
      centerPoint = [116.20434629393344, 39.470102461206835]
      break
  }

  dsxlLayer.setVisibleLayers(lyrArr) //设置图层可见
  getSTATListQuery(dsnm)

  //var centerPoint = results[0].feature.geometry;
  map.centerAndZoom(centerPoint, zom)
}
