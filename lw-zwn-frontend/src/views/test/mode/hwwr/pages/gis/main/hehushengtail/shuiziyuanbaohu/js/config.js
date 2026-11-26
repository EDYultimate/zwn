const GIS = {}
GIS.config = {}
GIS.config.visibleLayers = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12] //默认图层显示索引数组
//地图分辨率
GIS.config.lods = [
  { level: 0, resolution: 0.010986328125, scale: 4617149 },
  { level: 1, resolution: 0.00549315229422961, scale: 2308570 },
  { level: 2, resolution: 0.002746588044419834, scale: 1154290 },
  { level: 3, resolution: 0.0013732916427489112, scale: 577144 },
  { level: 4, resolution: 6.866458213744556e-4, scale: 288572 },
  { level: 5, resolution: 3.433229106872278e-4, scale: 144286 }
]
GIS.config.layers = {
  data: {
    layers: [
      {
        label: '基础图层',
        icon: '',
        logo: '',
        id: '0',
        data: [
          {
            label: '县',
            id: '0_1',
            visible: true,
            layerindex: '0-0',
            checked: 'true',
            layers: ['18']
          },
          {
            label: '市',
            id: '0_1',
            visible: true,
            layerindex: '0-0',
            checked: 'true',
            layers: ['0', '13']
          },
          {
            label: '省',
            id: '0_0',
            visible: true,
            layerindex: '0-1',
            checked: 'true',
            layers: ['1', '19']
          },
          {
            label: '2021部印发河湖 ',
            id: '0_0',
            visible: false,
            layerindex: '0-2',
            checked: 'false',
            layers: ['2']
          },
          {
            label: '2021省市印发河湖 ',
            id: '0_0',
            visible: false,
            layerindex: '0-3',
            checked: 'false',
            layers: ['3']
          },
          {
            label: '2020部印发河湖 ',
            id: '0_0',
            visible: false,
            layerindex: '0-4',
            checked: 'true',
            layers: ['4']
          },
          {
            label: '2020省市印发河湖 ',
            id: '0_0',
            visible: false,
            layerindex: '0-5',
            checked: 'true',
            layers: ['5']
          },
          {
            label: '线状水源地',
            id: '0_0',
            visible: false,
            layerindex: '0-6',
            checked: 'false',
            layers: ['6']
          },
          {
            label: '点状水源地',
            id: '0_1',
            visible: false,
            layerindex: '0-7',
            checked: 'false',
            layers: ['7']
          },
          {
            label: '重点超采区域 ',
            id: '0_1',
            visible: true,
            layerindex: '0-8',
            checked: 'false',
            layers: ['8']
          },
          {
            label: '海河流域轮廓',
            id: '0_1',
            visible: true,
            layerindex: '0-9',
            checked: 'true',
            layers: ['9']
          },
          {
            label: '面状水源地',
            id: '0_1',
            visible: false,
            layerindex: '0-10',
            checked: 'false',
            layers: ['10']
          },
          {
            label: '一级河流',
            id: '0_1',
            visible: false,
            layerindex: '0-11',
            checked: 'true',
            layers: ['11']
          },
          {
            label: '二级河流',
            id: '0_1',
            visible: false,
            layerindex: '0-12',
            checked: 'true',
            layers: ['12']
          },

          {
            label: '大型水库',
            id: '0_1',
            visible: false,
            layerindex: '0-15',
            checked: 'true',
            layers: ['14']
          },
          {
            label: '中小型水库',
            id: '0_1',
            visible: false,
            layerindex: '0-16',
            checked: 'true',
            layers: ['15']
          }
        ]
      }
    ]
  },
  tool: [
    { label: '长度', logo: 'ico_ruler.png', toolid: 'length', handler: function () {} },
    { label: '面积', logo: 'ico_polygon.png', toolid: 'area', handler: function () {} },
    { label: '清除', logo: 'ico_delete.png', toolid: 'clear', handler: function () {} }
  ],
  layersHeight: 460
}
GIS.config.api_ip = 'http://10.3.34.221:3721'
GIS.config.map_ip = 'http://10.3.250.88:7001' /*图层默认ip*/
GIS.config.zhuanti_url =
  'http://10.3.34.221:6080/arcgis/rest/services/hehushengtai/hehushengtai/MapServer'
