let map //地图
let graphicsLayer //要素图层
const markerType = ['gcxq', 'shuizha', 'zhafang']
const nameType = ['gcxq', 'shuizha', 'zhafang']
const valueType = ['gcxq', 'shuizha', 'zhafang']
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
  //	$("#layerSwitch").LayerSwitcher({map:map,dixing:[{id:"tdtdixing",name:""}],yingxiang:[{id:"tdtyingxiang",name:""}],ditu:[{id:"tdtditu",name:""}]});
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
  const legendPra3 = {
    source: [
      { label: '无雨', img: 'img/icon_yl0.png', id: 'wuyu', checked: 'true' },
      { label: '小雨(0-10)', img: 'img/icon_yl1.png', id: 'mrz', checked: 'true' },
      { label: '中雨(10-25)', img: 'img/icon_yl2.png', id: 'sqz', checked: 'false' },
      { label: '大雨(25-50)', img: 'img/icon_yl3.png', id: 'skswz', checked: 'false' },
      { label: '暴雨(50-100)', img: 'img/icon_yl4.png', id: 'hdswz', checked: 'false' },
      { label: '大暴雨(100-200)', img: 'img/icon_yl5.png', id: 'ylz', checked: 'false' },
      { label: '特大暴雨(>200)', img: 'img/icon_yl6.png', id: 'gsz', checked: 'false' }
    ],
    width: 150,
    height: 260,
    picW: 14,
    picH: 14,
    titleStr: '降雨分级图例',
    handler: null
  }
  $('#legendYL').LegendBar3(legendPra3)
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
  //$("#legend").LegendBar(legendPra);
  getSTATList()
}
/*移动到要素上触发*/
function overGraphicHandler(event) {
  const gra = event.graphic
  const w = GIS.getByteSize(gra.attributes.stnm)
  const x = event.pageX
  const y = event.pageY
  console.log(event)
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
