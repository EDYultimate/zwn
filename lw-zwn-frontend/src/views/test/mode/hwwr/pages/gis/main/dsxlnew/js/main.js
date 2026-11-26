let map //地图
let graphicsLayer //要素图层
let infoLayer //信息窗图层

//初始化在线绘制图层
let initGraphicLayer
//初始化在线绘制图层
let initLineLayer

//添加调水路线显示
let dsxlLayer
const markerType = ['gcxq', 'shuizha', 'zhafang']
const nameType = ['gcxq', 'shuizha', 'zhafang']
const valueType = ['gcxq', 'shuizha', 'zhafang']
/*入口函数*/
function init() {
  //初始话地图
  map = new GIS.Map('map', {
    logo: false,
    slider: false,
    center: [116.20434629393344, 39.470102461206835],
    zoom: 5
  })
  //天地图地图
  const tdtDT = GIS.TDTLayer({ id: 'tdtditu' })
  map.addLayer(tdtDT)
  //天地图地形
  const tdtDX = GIS.TDTDemLayer({ id: 'tdtdixing', visible: false })
  map.addLayer(tdtDX)
  //天地图影像
  const tdtYX = new GIS.TDTimage({ id: 'tdtyingxiang', visible: false })
  map.addLayer(tdtYX)
  //海河流域底图
  const zhuantiLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.backLayer, { id: 'backLayer' })
  map.addLayer(zhuantiLayer)
  //南水北调
  //var NSBDLayer=new GIS.ArcGISDynamicMapServiceLayer(GIS.queryLayer,{id : 'nsbdLayer'});
  //NSBDLayer.setVisibleLayers([4]);
  //map.addLayer(NSBDLayer);

  //添加调水路线显示
  dsxlLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.zhuantiUrl, { id: 'dsxl' })
  //dsxlLayer.on("click",graphicCickHanderDsxl);//增加调水路线点击事件
  map.addLayer(dsxlLayer)

  //	map.centerAndZoom(new GIS.Point(116.20434629393344,39.470102461206835),5);
  //添加地图导航
  $('#navigator').MapNavigator({ map: map, lods: GIS.lods })
  //地图切换
  $('#layerSwitch').LayerSwitcher({
    map: map,
    dixing: [{ id: 'tdtdixing', name: '' }],
    yingxiang: [{ id: 'tdtyingxiang', name: '' }],
    ditu: [{ id: 'tdtditu', name: '' }]
  })
  //	getCZList();
  graphicsLayer = new GIS.Zoomgralayer({
    map: map,
    layerlevel: 8,
    isZoom: false,
    markerType: markerType,
    nameType: [],
    valueType: valueType
  })
  map.addLayer(graphicsLayer)

  graphicsLayer.on('mouse-over', overGraphicHandler)
  graphicsLayer.on('mouse-out', outGraphicHandler)
  //graphicsLayer.on("click",graphicCickHander);

  initLineLayer = new GIS.GraphicsLayer()
  initLineLayer.on('click', graphicCickHanderDsxl) //增加调水路线点击事件
  map.addLayer(initLineLayer)

  initGraphicLayer = new GIS.GraphicsLayer() //GIS.ZoomLayerAno({map:map,layerlevel:5,isZoom:true,isAno:true});
  map.addLayer(initGraphicLayer)

  /*多标签图层*/
  infoLayer = new GIS.InfoLayerEx({ id: 'info', visible: true })
  map.addLayer(infoLayer)

  map.on('click', layereach)

  //初始化图例
  const legendPra = {
    source: [
      { label: '引滦工程', img: 'img/shuizha.png', color: '#73DEFF', id: 'dsxl1', checked: 'true' },
      {
        label: '永定河干流',
        img: 'img/zhafang.png',
        color: '#0070FF',
        id: 'dsxl2',
        checked: 'true'
      },
      {
        label: '岳城应急调水',
        img: 'img/shushuiguandong.png',
        color: '#00C5FF',
        id: 'dsxl3',
        checked: 'false'
      },
      {
        label: '岳城水库日常',
        img: 'img/fangshengongcheng.png',
        color: '#BEFFE8',
        id: 'dsxl4',
        checked: 'false'
      },
      {
        label: '祝官屯枢纽日常',
        img: 'img/qudi.png',
        color: '#BEE8FF',
        id: 'dsxl5',
        checked: 'false'
      },
      {
        label: '漳河上游',
        img: 'img/yihongdao.png',
        color: '#73DFFF',
        id: 'dsxl6',
        checked: 'false'
      },
      {
        label: '南水北调中线',
        img: 'img/yihongdao.png',
        color: '#73DFFF',
        id: 'dsxl9',
        checked: 'false'
      },
      {
        label: '南水北调东线',
        img: 'img/yihongdao.png',
        color: '#73B2FF',
        id: 'dsxl10',
        checked: 'false'
      },
      {
        label: '引黄入冀补淀（渠村）',
        img: 'img/daba.png',
        color: '#BEFCE8',
        id: 'dsxl7',
        checked: 'false'
      },
      {
        label: '引黄入冀补淀（位山）',
        img: 'img/ducao.png',
        color: '#BEE8FF',
        id: 'dsxl8',
        checked: 'false'
      }
    ],
    width: 180,
    height: 260,
    picW: 20,
    picH: 5,
    titleStr: '调水线路'
  }
  $('#legend').LegendBar5(legendPra)
}
/*移动到要素上触发*/
function overGraphicHandler(event) {
  const gra = event.graphic
  const w = GIS.getByteSize(gra.attributes.stnm)
  const x = event.layerX
  const y = event.layerY
  $('#nameLabel')
    .css({
      left: x + 10 + 'px',
      top: y + 10 + 'px',
      width: w * 10 + 'px'
    })
    .text(gra.attributes.stnm)
  $('#nameLabel').show()
  map.setMapCursor('pointer')
}
/*在要素上移开*/
function outGraphicHandler() {
  $('#nameLabel').hide()
  map.setMapCursor('default')
}
/*请求测站数据*/
function getCZList() {
  const queryTask = GIS.FindTask(GIS.queryLayer)
  const params = new GIS.FindParameters()
  console.log(params)
  params.layerIds = [0, 1, 2]
  console.log(params.layerDefinitions)
  params.layerDefinitions = []
  params.layerDefinitions[0] = '1=1'
  params.searchFields = ['LAND_USE']
  params.searchText = '%%'
  queryTask.execute(params, showResults)
}

function showResults(result) {
  console.log(result)
}
