let map //地图
let graphicsLayer //要素图层
const markerType = ['rhpwk']
const nameType = ['rhpwk']
const valueType = ['rhpwk']
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
    nameType: nameType,
    valueType: valueType
  })
  map.addLayer(graphicsLayer)
  graphicsLayer.on('mouse-over', overGraphicHandler)
  graphicsLayer.on('mouse-out', outGraphicHandler)
  graphicsLayer.on('click', graphicCickHander)
  //初始化图例
  const legendPra = {
    source: [
      { label: '水闸', img: 'img/shuizha.png', id: 'shuizha', checked: 'true' },
      { label: '闸房', img: 'img/zhafang.png', id: 'zhafang', checked: 'true' },
      {
        label: '输水管洞',
        img: 'img/shushuiguandong.png',
        id: 'shushuiguandong',
        checked: 'false'
      },
      {
        label: '防渗工程',
        img: 'img/fangshengongcheng.png',
        id: 'fangshengongcheng',
        checked: 'false'
      },
      { label: '渠堤', img: 'img/qudi.png', id: 'qudi', checked: 'false' },
      { label: '溢洪道', img: 'img/yihongdao.png', id: 'yihongdao', checked: 'false' },
      { label: '大坝', img: 'img/daba.png', id: 'daba', checked: 'false' },
      { label: '渡槽', img: 'img/ducao.png', id: 'ducao', checked: 'false' },
      { label: '隧洞', img: 'img/suidong.png', id: 'suidong', checked: 'false' },
      { label: '渠下涵', img: 'img/quxiahan.png', id: 'quxiahan', checked: 'false' },
      { label: '涵闸', img: 'img/hanzha.png', id: 'hanzha', checked: 'false' },
      { label: '桥梁', img: 'img/qiaoliang.png', id: 'qiaoliang', checked: 'false' },
      { label: '量水堰', img: 'img/liangshuiyan.png', id: 'liangshuiyan', checked: 'false' },
      { label: '倒吸虹', img: 'img/daohongxi.png', id: 'daohongxi', checked: 'false' },
      { label: '陡坡', img: 'img/doupodieshui.png', id: 'doupodieshui', checked: 'false' },
      { label: '测流站', img: 'img/celiuzhan.png', id: 'celiuzhan', checked: 'false' },
      { label: '泵站', img: 'img/bengzhan.png', id: 'bengzhan', checked: 'false' }
    ],
    width: 150,
    height: 260,
    picW: 14,
    picH: 14,
    titleStr: '建筑物分类'
  }
  //	$("#legend").LegendBar(legendPra);
  getSTATList()
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
