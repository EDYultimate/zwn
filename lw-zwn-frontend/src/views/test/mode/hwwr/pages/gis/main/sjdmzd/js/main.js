let map //地图
let graphicsLayer //要素图层
const markerType = ['gcxq']
const nameType = ['gcxq']
const valueType = ['gcxq']
/*入口函数*/
function init() {
  //初始话地图
  map = new GIS.Map('map', {
    logo: false,
    slider: false,
    center: [116.11645566893344, 38.865854414331835],
    zoom: 5
  })
  map.initialExt = new GIS.Extent(
    108.20629941893344,
    34.702036054956835,
    124.02661191893344,
    43.029672773706835
  )
  //天地图地形
  const tdtDX = GIS.TDTDemLayer({ id: 'tdtdixing', visible: false })
  map.addLayer(tdtDX)
  //天地图影像
  const tdtYX = new GIS.TDTimage({ id: 'tdtyingxiang', visible: false })
  map.addLayer(tdtYX)
  //海河流域底图
  const zhuantiLayer = new GIS.ArcGISDynamicMapServiceLayer(GIS.backLayer, { id: 'backlayer' })
  map.addLayer(zhuantiLayer)
  //	map.centerAndZoom(new GIS.Point(116.20434629393344,39.470102461206835),5);
  //添加地图导航
  $('#navigator').MapNavigator({ map: map, lods: GIS.lods })
  //地图切换
  //	getCZList();
  /*多标签图层*/
  infoLayer = new GIS.InfoLayerEx({ id: 'info', visible: true })
  map.addLayer(infoLayer)
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
      { label: 'Ⅰ类', img: 'img/11.png', id: 'shuizha', checked: 'true' },
      { label: 'Ⅱ类', img: 'img/22.png', id: 'zhafang', checked: 'true' },
      { label: 'Ⅲ类', img: 'img/33.png', id: 'shushuiguandong', checked: 'false' },
      { label: 'Ⅳ类', img: 'img/44.png', id: 'fangshengongcheng', checked: 'false' },
      { label: 'Ⅴ类', img: 'img/55.png', id: 'qudi', checked: 'false' },
      { label: '劣Ⅴ类', img: 'img/66.png', id: 'yihongdao', checked: 'false' },
      { label: '设备正常', img: 'img/normal.png', id: 'yihongdao', checked: 'false' },
      { label: '设备异常', img: 'img/unnormal.png', id: 'yihongdao', checked: 'false' }
    ],
    width: 150,
    height: 300,
    picW: 14,
    picH: 14,
    titleStr: '建筑物分类'
  }
  $('#legend').LegendBar(legendPra)
  $('#mapswitch').mapswitch({
    data: [
      {
        label: '名称',
        type: 'name',
        id: '0',
        visible: false,
        layertype: 'wmts',
        controlLayerid: 'name'
      },
      {
        label: '监测值',
        type: 'value',
        id: '1',
        visible: true,
        layertype: 'wmts',
        controlLayerid: 'value'
      }
    ],
    layerSelect: function (arr) {
      $.each(arr, function (index, item) {
        if (item.layername === 'name') {
          console.log(item)
          if (item.layerselect) {
            graphicsLayer.setNameType(markerType)
          } else {
            graphicsLayer.setNameType([])
          }
        }
        if (item.layername === 'value') {
          if (item.layerselect) {
            graphicsLayer.setValueType(markerType)
          } else {
            graphicsLayer.setValueType([])
          }
        }
      })
    }
  })
  //模块初始化
  moduleInit()
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
