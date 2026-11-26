let map //地图
let graphicsLayer //要素图层
let annoLayer //标注图层
let infoLayer //信息窗图层
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
  const zhuantiLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.backLayer, { id: 'basemap' })
  map.addLayer(zhuantiLayer)

  const hhLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.hhLayer, { id: 'hhLayer' })
  map.addLayer(hhLayer)

  /*多标签图层*/
  infoLayer = new GIS.InfoLayerEx({ id: 'info', visible: true })
  infoLayer.on('mouse-over', overGraphicHandler)
  infoLayer.on('mouse-out', outGraphicHandler)
  infoLayer.on('click', graphicCickHander)
  map.addLayer(infoLayer)

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

  annoLayer = new GIS.GraphicsLayer()
  map.addLayer(annoLayer)
  annoLayer.on('mouse-over', overGraphicHandler)
  annoLayer.on('mouse-out', outGraphicHandler)
  annoLayer.on('click', graphicCickHander)

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
  graphicsLayer.on('click', graphicCickHander)

  //初始化图例
  //初始化图例
  const legendPra = {
    source: [
      { label: 'Ⅰ类', img: 'img/11.png', id: 'shuizha', checked: 'true' },
      { label: 'Ⅱ类', img: 'img/22.png', id: 'zhafang', checked: 'true' },
      { label: 'Ⅲ类', img: 'img/33.png', id: 'shushuiguandong', checked: 'false' },
      { label: 'Ⅳ类', img: 'img/44.png', id: 'fangshengongcheng', checked: 'false' },
      { label: 'Ⅴ类', img: 'img/55.png', id: 'qudi', checked: 'false' },
      { label: '劣Ⅴ类', img: 'img/66.png', id: 'yihongdao', checked: 'false' }
    ],
    width: 120,
    height: 300,
    picW: 14,
    picH: 14,
    titleStr: '建筑物分类'
  }
  //$("#legend").LegendBar(legendPra);

  //$("#legend").MapSwitch(legendPra);//查看
  getSTATList() //查询点信息
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
