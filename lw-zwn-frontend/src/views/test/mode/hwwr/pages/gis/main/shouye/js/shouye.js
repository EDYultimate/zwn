/**
 * @creator jvy
 * @date 2016/12/5
 * @desp 首页
 */
let map
//当前状态
let mapState = 'normal'
//初始化在线绘制图层
let initGraphicLayer
//初始化在线绘制图层
let initLineLayer
//降雨_雨量站
let rainLayer
//信息窗图层
let infoLayer
//定位图层
let locatLayer
let identityResultLayer
//当前用户编码
let ssd
//后台获取数据寄存全局变量
let jsonData
const markerType = ['vedio_show', 'station_show']
const nameType = []
//var nameType=[];
const valueType = ['hd_show']
let backall = null //新加调水路线数据
let baseLyr = null //新加底图数据
function init() {
  esriConfig.defaults.io.corsDetection = false
  //获取当前高度
  const height = $('body').height()
  $('#rightBottomBar').height(height - 110)
  $('#rightBottomBar .content').height(height - 140)

  map = new GIS.Map('mapdivshouye', {
    logo: false,
    slider: false,
    //center: [115.365,36.528],
    center: [116.09729980468751, 38.95637207031251],
    zoom: 5
  })
  //map["initialExt"]=new GIS.Extent(111.05,34.37,118.6,38.82);

  //天地图地图
  const tdtDT = GIS.TDTLayer({ id: 'tdtditu', visible: false })
  map.addLayer(tdtDT)

  //天地图地形
  const tdtDX = GIS.TDTDemLayer({ id: 'tdtdixing' })
  map.addLayer(tdtDX)

  //天地图影像
  const tdtYX = new GIS.TDTimage({ id: 'tdtyingxiang', visible: false })
  map.addLayer(tdtYX)

  //console.log("test");
  //基础底图

  baseLyr = new GIS.ArcGISDynamicMapServiceLayer(shouye.backlayer, { id: 'zhuanti' })
  map.addLayer(baseLyr)

  backall = new GIS.ArcGISDynamicMapServiceLayer(shouye.zhuantiUrl, { id: 'dsxl' })
  map.addLayer(backall)

  // backall.setImageFormat("jpeg");//设置透明度，需jpeg格式
  // backall.setVisibleLayers([0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22]);//zhuantiLayer.setVisibleLayers([0,1,2,3,4,5,6,7,9,10,11,12]);

  //降雨图层
  rainLayer = new GIS.GraphicsLayer()
  map.addLayer(rainLayer)
  rainLayer.setVisibility(false)

  initLineLayer = new GIS.GraphicsLayer()
  map.addLayer(initLineLayer)

  initGraphicLayer = new GIS.ZoomLayerAno({ map: map, layerlevel: 5, isZoom: true, isAno: true })
  map.addLayer(initGraphicLayer)

  infoLayer = new GIS.InfoLayerEx({ id: 'info', visible: true })
  map.addLayer(infoLayer)
  identityResultLayer = new GIS.GraphicsLayer()
  identityResultLayer.visible = false
  map.addLayer(identityResultLayer)
  locatLayer = new GIS.GraphicsLayer()
  map.addLayer(locatLayer)
  //map.on("extent-change",infoVis);
  map.on('click', layereach)

  //创建绘制工具
  createDrawbar()

  //地图导航工具初始化
  $('#navigator_shouye').MapNavigator({ map: map, lods: shouye.lods })

  //组织结构选择
  $('#orgSelect_suo_back').click(function (event) {
    $('#bar_duan_content').hide()
    $('#bar_suo_content').show()
  })
  $('#orgSelect_duan_back').click(function (event) {
    $('#bar_suo_content').hide()
    $('#bar_duan_content').show()
  })
  //  测量工具
  const measureTool = new GIS.Measuretool({ map: map })
  //右下角
  $('#rightBottomBar').children('.rightBottomBarClose').on('click', closeBarHandler)
  //地图切换事件
  $('#rightTopBar_map').on('click', switchMapHandler)
  $('#rightTopBar_vec').on('click', switchMapHandler)
  $('#rightTopBar_rate').on('click', switchMapHandler)

  //图层控制弹出判断
  let isOpen_layer = false
  //工具控制弹出判断
  let isOpen_tool = false
  $(document).on('click', function (event) {
    if (isOpen_layer) {
      if (!$(event.target).hasClass('boxLayerClick')) {
        $('#bar_layer_content').hide()
        isOpen_layer = false
      }
    }
    if (isOpen_tool) {
      if (!$(event.target).hasClass('boxToolClick')) {
        $('#bar_tool_content').hide()
        isOpen_tool = false
      }
    }
    //判断是否需要关闭组织机构选择窗体
    if (
      !(
        $(event.target).attr('id') == 'orgSelect_suo_back' ||
        $(event.target).attr('id') == 'orgSelect_duan_back'
      )
    ) {
      $('#bar_suo_content').hide()
      $('#bar_duan_content').hide()
      //			console.log($(event.target));
    }
  })
  $('#rightTopBar_layer_back').on('click', function (event) {
    if (!isOpen_layer) {
      $('#bar_layer_content').show()
      isOpen_layer = true
    } else {
      $('#bar_layer_content').hide()
      isOpen_layer = false
    }
  })
  $('#rightTopBar_tool_back').on('click', function (event) {
    if (!isOpen_tool) {
      $('#bar_tool_content').show()
      isOpen_tool = true
    } else {
      $('#bar_tool_content').hide()
      isOpen_tool = false
    }
  })

  initLayerCheckBox() //初始化图层控制
  initToolBox() //初始化工具栏
  /*长度测量*/
  function celiangHandler(event) {
    measureTool.clearMap()
    measureTool.initialMeasureLine()
  }
  /*面积测量*/
  function areaHandler(event) {
    measureTool.clearMap()
    measureTool.initialMeasureArea()
  }
  /**/
  function clearHandler(event) {
    measureTool.clearMap()
  }
  /*关闭按钮*/
  function closeBarHandler(event) {
    //收回
    if ($('#rightBottomBar').hasClass('isClose')) {
      $('#rightBottomBar').animate({
        width: '300px',
        height: height - 110 + 'px'
      })
      $('#rightBottomBar').children('.rightBottomBarClose').css({
        background: 'url("img/min.png") no-repeat'
      })
    } else {
      $('#rightBottomBar').animate({
        width: '140px',
        height: '30px'
      })
      $('#rightBottomBar').children('.rightBottomBarClose').css({
        background: 'url("img/normal.png") no-repeat'
      })
    }
    $('#rightBottomBar').toggleClass('isClose')
  }
  /*地图切换事件处理函数*/
  function switchMapHandler(event) {
    $('#rightTopBar_map').removeClass('mapSelected')
    $('#rightTopBar_vec').removeClass('mapSelected')
    $('#rightTopBar_rate').removeClass('mapSelected')
    $(event.currentTarget).addClass('mapSelected')
    const layerId = $(event.currentTarget).attr('id')
    //判断是否是专题图
    /*if(layerId=="rightTopBar_map"){
				 zhuantiLayer.setVisibleLayers([0,1,2,3,4,5,6,7,9,10,11,12]);
				mapType=0;
			}
			else if(layerId=="rightTopBar_vec"){
				zhuantiLayer.setVisibleLayers([0,1,2,3,4,5,6,7,9,10]);
				mapType=1;
			}
			else{
				zhuantiLayer.setVisibleLayers([0,1,2,3,4,5,6,7,9,10]);
				mapType=2;
			}*/
    map.getLayer('tdtditu').setVisibility(layerId == 'rightTopBar_map')
    map.getLayer('tdtdixing').setVisibility(layerId == 'rightTopBar_vec')
    map.getLayer('tdtyingxiang').setVisibility(layerId == 'rightTopBar_rate')
  }
  //创建图层控制
  function initLayerCheckBox() {
    const setting = {
      data: [
        { label: '南水北调', id: '2', visible: true, layertype: 'wms' }, //
        { label: '四库联调', id: '3', visible: true, layertype: 'wms' },
        { label: '岳城衡水', id: '4', visible: true, layertype: 'wms' },
        { label: '引滦入唐', id: '5', visible: true, layertype: 'wms' },
        { label: '引滦入津', id: '6', visible: true, layertype: 'wms' },
        { label: '引黄入冀', id: '7', visible: true, layertype: 'wms' },
        { label: '入冀补淀', id: '8', visible: true, layertype: 'wms' },
        { label: '引黄济津', id: '9', visible: true, layertype: 'wms' },
        { label: '永定河', id: '10', visible: true, layertype: 'wms' },
        { label: '漳河线路', id: '11', visible: true, layertype: 'wms' }
      ]
    }
    const rightTopBar_layer = $('#bar_layer_content')
    const len = setting.data.length
    rightTopBar_layer.height(len * 26 + 2)
    $.each(setting.data, function (index, item) {
      const boxItem = $(
        '<div class="boxLayerItem unSelected boxLayerClick" style="width:100%;height:25px;border-bottom:1px solid #FFFFFF;">' +
          '<div class="boxLayerClick" style="width:15px;height:15px;margin-top:2px;margin-left:5px;float:left;"></div>' +
          '<div class="boxLayerLabel boxLayerClick" style="float:left;margin-left:4px;margin-top:1px;">' +
          item.label +
          '</div>' +
          '</div>'
      )
      boxItem.attr('layerid', item.id)
      boxItem.attr('layertype', item.layertype)
      if (item.visible) {
        boxItem.children('div').eq(0).addClass('boxLayerImg')
      } else {
        boxItem.children('div').eq(0).addClass('boxLayerImg_unselect')
      }
      rightTopBar_layer.append(boxItem)
    })
    rightTopBar_layer.children('.boxLayerItem').on('click', function (event) {
      console.log('click')
      const targetItem = $(event.currentTarget)
      const targetImg = targetItem.children('div').eq(0)
      if (targetImg.hasClass('boxLayerImg')) {
        targetImg.removeClass('boxLayerImg').addClass('boxLayerImg_unselect')
      } else {
        targetImg.removeClass('boxLayerImg_unselect').addClass('boxLayerImg')
      }
      //遍历所有
      const arr = backall.visibleLayers
      $.each(rightTopBar_layer.children('.boxLayerItem'), function (index, item) {
        const layerid = $(item).attr('layerid')
        if ($(item).children('div').eq(0)
.hasClass('boxLayerImg')) {
          var indx = arr.indexOf(layerid + '')
          if (indx == -1) {
            arr.push(layerid)
          }
        } else {
          var indx = arr.indexOf(layerid + '')
          if (indx != -1) {
            arr.splice(indx, 1)
          }
        }
      })
      backall.setVisibleLayers(arr)
    })
    rightTopBar_layer.hide()
  }

  //创建工具栏
  function initToolBox() {
    const setting = {
      data: [
        { label: '长度', id: 'measureLenth', visible: true },
        { label: '面积', id: 'measureArea', visible: true },
        /*							      {label:"框选",id:"AreaSelect",visible:true},
         */ { label: '清空', id: 'clearAll', visible: true }
      ]
    }
    const rightTopBar_tool = $('#bar_tool_content')
    const len = setting.data.length
    rightTopBar_tool.height(len * 31 + 2)
    $.each(setting.data, function (index, item) {
      const boxItem = $(
        '<div class="boxToolItem unSelected boxToolClick" style="width:100%;height:30px;border-bottom:1px solid #FFFFFF;">' +
          '<div class="boxToolImg" style="width:26px;height:26px;margin-top:2px;margin-left:5px;float:left;"></div>' +
          '<div class="boxLayerLabel " style="float:left;margin-left:6px;margin-top:5px;">' +
          item.label +
          '</div>' +
          '</div>'
      ).attr('id', item.id)
      rightTopBar_tool.append(boxItem)
    })
    rightTopBar_tool.children('.boxToolItem').on('click', function (event) {
      const targetItem = $(event.currentTarget)
      if (targetItem.attr('id') == 'measureLenth') {
        mapState = 'measureLenth'
        celiangHandler()
      } else if (targetItem.attr('id') == 'measureArea') {
        mapState = 'measureArea'
        areaHandler()
      } else if (targetItem.attr('id') == 'clearAll') {
        mapState = 'measureArea'
        clearHandler()
      } else if (targetItem.attr('id') == 'AreaSelect') {
        mapState = 'AreaSelect'
        clearHandler()
        drawPolygon()
      }
      //添加全局搜索cly2017.03.10
      else if (targetItem.attr('id') == 'EnterSearch') {
        mapState = 'EnterSearch'
        clearHandler()
        searchPan()
      }
    })
    rightTopBar_tool.hide()
  }
  $.getJSON('./data/data.json', function (result) {
    console.log(result)
  })
}
