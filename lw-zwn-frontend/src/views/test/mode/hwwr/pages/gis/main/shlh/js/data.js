let sym_yuliang
var ptSymbol//预警样式
var symbolPoly//默认面预警样式 不预警
var ccB//蓝色预警
var ccY//黄色预警
var sym_swllz/*水文站样式**/
var sym_sjdm55/*省界断面5类*/

//

//数据源
var dataProvider = []

/**
 * 面状要素
 */
var polyProvider = []

/***
 * 河流要素
 */
var hlProvider = []

/***
 * 查询序列
 */
var queryInx = 0;

let bFea
var qFea
var bydYj
var qlhYj

var bydData
var qlhData

/***
 * 是否已预警面
 */
var sfYjpt = false;

/*获取要素方法*/
function getSTATList() {
  ptSymbol = new GIS.PictureMarkerSymbol('../../common/img/find.gif', 20, 20)
  //sym_yuliang=new GIS.PictureMarkerSymbol("../../common/img/bz_qsh_2.png",12,12);
  symbolPoly = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([0, 255, 255]),
      1
    ),
    new dojo.Color([0, 255, 255, 0.5])
  )

  ccB = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([0, 0, 255]),
      2
    ),
    new dojo.Color([0, 0, 255, 0.8])
  ) //显示红蓝色

  ccY = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new dojo.Color([255, 165, 0]),
      2
    ),
    new dojo.Color([255, 165, 0, 0.8])
  ) //显示红黄色
  sym_swllz = new GIS.PictureMarkerSymbol('img/bz_sweiz.png', 9, 15) //默认水文站样式
  sym_sjdm55 = new GIS.PictureMarkerSymbol('img/55.png', 10, 16)

  var task = new GIS.QueryTask(GIS.hhLayer + '/' + queryInx.toString()) //测站索引为0
  var query = new GIS.Query()
  query.where = 'FID>=0'
  query.returnGeometry = true
  if (queryInx == 0) {
    query.outFields = ['*']
  } else if (queryInx == 1) {
    query.outFields = ['OBJ_NAME']
  } else if (queryInx == 2) {
    query.outFields = ['NAME']
  }
  query.outSpatialReference = { wkid: 4326 }
  task.execute(query, getSTATListHandler, getSTATListErro)
}

/***
 * 测试预警方法
 */
function getServerStatListTest() {
  sfYjpt = true
  var result =
    '{"data_byd":[{"RV_CD":"C13A012 ","WARNLEVEL":"b","ST_NM":"十方院溢流堰上","STCD":"30806201","BLUEVAL":6.6,"ORANGEVAL":6.5,"AVZ":6.6,"IDTM":"2019-11-02"}],"yj_qlh":"o","yj_byd":"b","data_qlh":[]}'
  if (typeof result == 'object') {
  } else if (typeof result == 'string') {
    //数据前处理，遍历要素数据组匹配业务数据展示
    result = $.parseJSON(result)
  }
  getYWdataHandler(result)
}

/***
 * 测试预警方法
 */
function getServerStatListPtTest() {
  var result =
    '[{"VAL":"5.59","YJ":"0","STCD":"30101201","TM":"2019-11-27 08","Z":132.06},{"VAL":"9.64","Q":7.48,"YJ":"1","STCD":"30101400","TM":"2019-11-27 08","Z":20.28},{"VAL":"1.41","Q":0.926,"YJ":"1","STCD":"30104403","TM":"2019-11-27 08","Z":138.16},{"VAL":"7","Q":0.637,"YJ":"1","STCD":"30700100","TM":"2019-11-27 08","Z":475.66},{"VAL":"8","Q":0,"YJ":"1","STCD":"30700500","TM":"2019-11-21 08"},{"VAL":"6","Q":0,"YJ":"1","STCD":"30806201","TM":"2019-11-27 08","Z":7.05},{"VAL":"5","Q":1.11,"YJ":"1","STCD":"31004300","TM":"2019-11-27 08","Z":38.31},{"YJ":"0","STCD":"99990095","TM":"2019-11-21 08","Z":3.92},{"YJ":"0","STCD":"99990176","TM":"2019-11-21 08","Z":1.59}]'
  if (typeof result == 'object') {
  } else if (typeof result == 'string') {
    //数据前处理，遍历要素数据组匹配业务数据展示
    result = $.parseJSON(result)
  }
  getYjPtdataHandler(result)
}
/*调取业务数据库数据*/
function getServerStatList() {
  //getServerStatListTest();//测试预警面
  //getServerStatListPtTest();//测试预警点
  getYjPtList() //先预警点信息
  //
}

/***
 * 获取预警面信息
 */
function getYjPolyList() {
  console.log(basePath + 'szybh/Rvorlkappraise/getWarningInfo')
  if (polyProvider && polyProvider.length > 0) {
    //获取
    $.post(basePath + 'szybh/Rvorlkappraise/getWarningInfo', getYWdataHandler)
  }
}

/***
 * 获取预警站点信息
 */
function getYjPtList() {
  sfYjpt = false
  console.log(basePath + 'szybh/Rvorlkappraise/getQyjByMostNewTm')
  //获取
  $.post(basePath + 'szybh/Rvorlkappraise/getQyjByMostNewTm', getYjPtdataHandler)
}

/***
 * 获取预警信息
 * @param result
 */
function getYjPtdataHandler(result) {
  console.log(result)
  if (typeof result == 'object') {
  } else if (typeof result == 'string') {
    //数据前处理，遍历要素数据组匹配业务数据展示
    result = $.parseJSON(result)
  }
  var size = result.length
  if (size == 0) {
    if (sfYjpt == false) {
      getYjPolyList() //继续预警面信息
    }
    return
  }

  var find = false
  for (
    var j = 0;
    j < dataProvider.length;
    j++ //遍历点
  ) {
    var fea = dataProvider[j]
    find = false
    fea.attributes['VAL'] = '' //获取预警值
    fea.attributes['Q'] = '' //获取时间
    fea.attributes['Z'] = '' //获取时间
    fea.attributes['TM'] = '' //获取时间
    for (var i = 0; i < size; i++) {
      //var yj=result[i].YJ;
      //if(yj=="0") continue;

      if (fea.attributes['STCD'] == result[i].STCD) //仅展示预警信息
      {
        if (result[i].VAL) {
          fea.attributes['VAL'] = result[i].VAL //获取预警值
        }
        if (result[i].Q) {
          fea.attributes['Q'] = result[i].Q //获取时间
        }
        if (result[i].TM) {
          fea.attributes['TM'] = result[i].TM //获取时间
        }
        if (result[i].Z) {
          fea.attributes['Z'] = result[i].Z //获取水位
        }

        if (result[i].YJ && result[i].YJ == '1') //确认是否预警
        {
          find = true
          var newGra1 = new GIS.Graphic(fea.geometry, ptSymbol, fea.attributes) //展示预警信息
          graphicsLayer.add(newGra1)
          addInfor(newGra1)
        }
        break
      }
    }

    if (find == false) //非预警值也显示弹框
    {
      addInfor(fea)
    }
  }

  if (sfYjpt == false) {
    sfYjpt = true
    getYjPolyList() //继续预警面信息
  }
}

/*业务数据调用返回处理*/

/***
 * 预警面信息处理展示
 */
function getYWdataHandler(result) {
  //数据前处理，遍历要素数据组匹配业务数据展示
  //调用添加marker要素
  if (typeof result == 'object') {
  } else if (typeof result == 'string') {
    //数据前处理，遍历要素数据组匹配业务数据展示
    result = $.parseJSON(result)
  }
  console.log(result)
  var size = result.length
  if (size == 0) return
  bydData = result.data_byd //获取白洋淀预警测站数据
  qlhData = result.data_qlh
  bydYj = result.yj_byd //分别获取预警信息
  qlhYj = result.yj_qlh

  for (var j = 0; j < polyProvider.length; j++) {
    var gra = polyProvider[j]
    if (j == 0) {
      bFea = gra
      bFea.attributes['STCD'] = ' C13A012'
      bFea.attributes['NM'] = '白洋淀'
    } else {
      qFea = gra
      qFea.attributes['STCD'] = ' C13A0171'
      qFea.attributes['NM'] = '七里海'
    }
  }
  //是否进行面状预警展示
  flashFea = []
  if (polyProvider.length > 0) {
    qFea['YJ'] = qlhYj
    bFea['YJ'] = bydYj
    if (bydYj != '0' || qlhYj != '0') {
      startFlash() //开始预警
    }
  }
	
	
}
/*获取要素结果解析*/
function getSTATListHandler(result) {
  if (result.features.length > 0) {
    if (queryInx == 0) {
      for (var i = 0; i < result.features.length; i++) {
        var gra = result.features[i]

        if (gra.attributes['STCD'] == '30806201' || gra.attributes['NM'] == '十方院') {
          console.log('granew.attributes_sz')
          var attributes = GIS.copy(gra.attributes)

          var pt = new GIS.Point(gra.geometry.x + 0.01, gra.geometry.y - 0.006)
          var granew = new esri.Graphic(pt, sym_sjdm55, attributes)
          granew.attributes['SZ'] = 'V'
          graphicsLayer.add(granew) //单独显示水质站
        }
        //gra.attributes["GRATYPE"]="gcxq";
        //gra.attributes["SHOWTYPE"]="marker";
        gra.setSymbol(sym_swllz)
        addGraName(gra)
        graphicsLayer.add(gra)
      }
      dataProvider = result.features
    } else if (queryInx == 1) {
      hlProvider = result.features
    } else if (queryInx == 2) {
      polyProvider = result.features
    }
  }

  if (queryInx < 2) {
    queryInx++
    getSTATList() //继续查询要素
  } else //结束查询
  {
    getServerStatList() //获取预警信息
  }
}
/*获取要素报错*/
function getSTATListErro(evt) {
  console.log(evt)
  if (queryInx < 2) {
    queryInx++
    getSTATList() //继续查询要素
  } else {
    getServerStatList() //获取预警信息
  }
}
/*
 * 点击要素查看详情*/
function graphicCickHander(event) {
  //graphicCickHander_jsl();
  //stopFlash();
  console.log('graphicCickHander')
  var gra = event.graphic
  if (gra.attributes['SZ'] && gra.attributes['SZ'] == 'V') //判断是否为水质站
  {
    var code = gra.attributes['STCD']
    var nm = gra.attributes['NM']
    console.log(basePath + 'pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd=' + code)
    layer.open({
      type: 2,
      title: nm, //+'降水量年趋势统计',
      closeBtn: 1,
      shade: 0.3,
      // maxmin: true,
      area: ['750px', '550px'],
      content: basePath + 'pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd=' + code //pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
    })
  } else {
    var code = gra.attributes['STCD']
    var nm = gra.attributes['NM']
    console.log(basePath + 'pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd=' + code)
    layer.open({
      type: 2,
      title: nm, //+'降水量年趋势统计',
      closeBtn: 1,
      shade: 0.3,
      // maxmin: true,
      area: ['750px', '550px'],
      content: basePath + 'pages/szybh/rvlkappraise/map/mapDialogTab.jsp?stcd=' + code //pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
    })
  }

  //gra.attributes["SZ"]="V"
}

/*移动到要素上触发*/
function overGraphicHandler(event) {
  console.log('overGraphicHandler')
  var gra = event.graphic
  var nm = gra.attributes['NM']

  if (nm == '十方院' && gra.attributes['SZ'] && gra.attributes['SZ'] == 'V') {
    //ShowSzTest(event);
    //return;
    nm += '_水质类别:V' //显示十方院水质类别
  }

  var w = GIS.getByteSize(nm)
  var x = event.layerX
  var y = event.layerY
  $('#nameLabel')
    .css({
      left: x + 10 + 'px',
      top: y + 10 + 'px',
      width: w * 10 + 'px'
    })
    .text(nm)
  $('#nameLabel').show()
  map.setMapCursor('pointer')
}
/*在要素上移开*/
function outGraphicHandler() {
  $('#nameLabel').hide()
  map.setMapCursor('default')
}
/*marker要素标注*/
function addToMarker() {
	
}
/*添加名称*/
function addGraName(gra) {
  //console.log("addGraName");
  var attributes = GIS.copy(gra.attributes)
  var x = gra.geometry.x
  var y = gra.geometry.y
  var textSym = new GIS.TextSymbol(attributes.NM)
  console.log(attributes)
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
  annoLayer.add(new esri.Graphic(new GIS.Point(x, y), textSym, attributes))

  /*var attributes=GIS.copy(attr.attributes);
		var x=attr.geometry.x;//.LGTD;
		var y=attr.geometry.y;//.LTTD;
		var textSym = new GIS.TextSymbol(attributes.NM);
		textSym.setColor(
			    new esri.Color([78,78,78]));
		textSym.setAlign(GIS.TextSymbol.ALIGN_MIDDLE);
		textSym.setOffset(0,-20);
		textSym.setFont( new esri.symbol.Font("14pt", esri.symbol.Font.STYLE_NORMAL,
					    		esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD,"Arial")
					    );
		attributes.SHOWTYPE="name";
		graphicsLayer.add(new esri.Graphic(new GIS.Point(x,y), textSym,attributes));*/
}
/*数值标注标签*/
function addGraValueLabel(gra) {
  console.log('addGraValueLabel')
  var newAttr = GIS.copy(gra.attributes)
  newAttr['SHOWTYPE'] = 'value'
  newAttr['STCD'] = gra.attributes['STCD']
  var textSym = new GIS.TextSymbol(gra.attributes['NM'])
    .setColor(new esri.Color([100, 149, 237]))
    .setAlign(GIS.TextSymbol.ALIGN_START)
    .setOffset(10, 5)
    .setFont(new esri.symbol.Font('10pt'))
    .setHaloColor(new GIS.Color([0, 0, 0]))
  graphicsLayer.add(new GIS.Graphic(gra.geometry, textSym, newAttr))
}

/**
 * 点击弹框进行信息展示
 * @param stnm
 */
function divClick(nm, code) {
  if (nm == '十方院') //判断是否为水质站
  {
    console.log(basePath + 'pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd=' + code)
    layer.open({
      type: 2,
      title: nm, //+'降水量年趋势统计',
      closeBtn: 1,
      shade: 0.3,
      // maxmin: true,
      area: ['750px', '550px'],
      content: basePath + 'pages/szybh/sjdm/sjdm_sz/stjc/stjc.jsp?stcd=' + code //pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
    })
  } else {
    console.log(basePath + 'pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd=' + code)
    layer.open({
      type: 2,
      title: nm, //+'降水量年趋势统计',
      closeBtn: 1,
      shade: 0.3,
      // maxmin: true,
      area: ['750px', '550px'],
      content: basePath + 'pages/szybh/rvlkappraise/map/mapDialogTab.jsp?stcd=' + code //pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
    })
  }
}

/**
 * 根据范围计算xy偏移位置
 * @param loc
 * @param x
 * @param y
 */
function ComXandY(loc, x, y) {
  var dis = 0.06
  switch (loc) {
    case 'rt':
      x = x + dis
      y = y + dis
      break
    case 'rb':
      x = x + dis
      y = y - dis
      break
    case 'lt':
      x = x - dis
      y = y + dis
      break
    case 'lb':
      x = x - dis
      y = y - dis
      break
  }
  return { x: x, y: y }
}

function addInfor(graphics) {
  var nmss = graphics.attributes.NM
  var x = graphics.geometry.x
  var y = graphics.geometry.y

  /*if(nmss=="十方院")
		{
		x=x-dis;
		y=y-dis;
		}
	else
		{
		x=x+dis;
		y=y+dis;
		}*/

  var loc = 'lt'
  if (graphics.attributes.RT) {
    loc = graphics.attributes.RT //获取位置信息
  }
  var newXy = ComXandY(loc, x, y) //重新计算xy
  x = newXy.x
  y = newXy.y

  pt = new GIS.Point(x, y)
  var graphic = new GIS.Graphic(pt)
  var widthss = 165
  var hss = 75
  if (nmss.length > 8) {
    widthss = (nmss.length - 8) * 12 + 165
  }
  var stcd = graphics.attributes.STCD
  var rj = graphics.attributes.Q
  var yz = graphics.attributes.VAL
  var tm = graphics.attributes.TM
  console.log('tm：' + tm.length)
  tm = tm.substring(20, 0)

  var tt = "<div class='divInfo' onclick='divClick(\"" + nmss + '","' + stcd + '")\'>'

  if (nmss == '十方院' || nmss.indexOf('淮淀闸') != -1) {
    var z = graphics.attributes.Z
    hss = 60
    tt += nmss + '</br>水位(m)：' + z + '</br>时间： ' + tm + '</div>'
    graphic.setAttributes({ pos: loc, winW: widthss, winH: hss, content: tt })
  } else {
    tt += nmss + '</br>流量(m³/s)：' + rj + '</br>阈值(m³/s)：' + yz + '</br>时间： ' + tm //nmss+"</br>水位(m)："+z+"</br>时间： "+tm+"</div>";
    graphic.setAttributes({ pos: loc, winW: widthss, winH: hss, content: tt, NM: nmss, STCD: stcd })
  }

  infoLayer.add(graphic)
}

let timer1//定时器

/***
 * 预警面要素合集
 */
var flashFea

var flashInx = 0;


/**
 * 启动计时器
 */
function startFlash() {
  map.graphics.redraw() // 重新绘制图形
  flashInx = 0
  map.graphics.clear()

  if (bydYj != '0') //展示白洋淀预警信息
  {
    var graphic1 = new esri.Graphic(bFea.geometry, symbolPoly, bFea.attributes) //,feature.infoTemplate);
    map.graphics.add(graphic1)
  }

  if (qlhYj != '0') //展示七里海预警信息
  {
    var graphic1 = new esri.Graphic(qFea.geometry, symbolPoly, qFea.attributes) //,feature.infoTemplate);
    map.graphics.add(graphic1)
  }

  timer1 = window.setInterval(flashFeaFun, 500)
}

/**
 * 结束计时器
 */
function stopFlash() {    
  console.log('timer stop:' + timer1)
  if (timer1) {
    window.clearInterval(timer1)
  }
}
/***
 * 闪烁要素
 * @param gra
 * @returns
 */
function flashFeaFun() {
  if (flashInx > 200) {
    stopFlash()
    return
  }
  //console.log("flashFea");
  flashInx++

  map.graphics.clear()

  var symB = symbolPoly
  var symQ = symbolPoly

  if (bydYj != '0') //展示白洋淀预警信息
  {
    if (flashInx % 2 == 0) {
      if (bydYj == 'o') {
        symB = ccY
      } else if (bydYj == 'b') {
        symB = ccB
      }
    }
    var graphic1 = new esri.Graphic(bFea.geometry, symB, bFea.attributes) //,feature.infoTemplate);
    map.graphics.add(graphic1)
  }

  if (qlhYj != '0') //展示七里海预警信息
  {
    if (flashInx % 2 == 0) {
      if (qlhYj == 'o') {
        symQ = ccY
      } else if (qlhYj == 'b') {
        symQ = ccB
      }
    }
    var graphic1 = new esri.Graphic(qFea.geometry, symQ, qFea.attributes) //,feature.infoTemplate);
    map.graphics.add(graphic1)
	
	
	/*for(var i=0;i<2;i++)
	{
		var graphic = map.graphics.graphics[0];
		if(flashInx%2==0)
			{
			  if(graphic.attributes["STCD"])
			}
		else
			{
			graphic.setSymbol(symbolPoly);//显示默认颜色
			}
		
	}*/
  //map.graphics.redraw(); // 重新绘制图形
}

/***
 * 显示十方院水质数据
 */
function ShowSzTest(event) {
  var gra = event.graphic
  var nm = gra.attributes['NM']
  var x = event.pageX
  var y = event.pageY
  console.log(event)
  var sz = gra.attributes['SZ']
  /**/
  var overPT = map.toMap(GIS.Point(x, y))
  var contentStr = '<div>' + '名称:' + nm + '<br/>水质目标:II' + '<br/>水质类别:' + sz + '</div>'
  map.infoWindow.setContent(contentStr)
  map.infoWindow.resize(150, 100)
  map.infoWindow.show(overPT)
}
