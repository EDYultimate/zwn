var GIS = GIS || {}
GIS.backLayer = commonConfig.url + '/arcgis/rest/services/haihe/baseMap/MapServer'
GIS.queryLayer = commonConfig.url + '/arcgis/rest/services/haihe/Query/MapServer'

GIS.zhuantiUrl = commonConfig.url + '/arcgis/rest/services/haihe/dsxl/MapServer'

GIS.AniUrl = commonConfig.url + '/arcgis/rest/services/haihe/dsxlAni/MapServer' //存储动态绘制路线图地址 用于动画展示

GIS.lods = [
  { level: 0, resolution: 0.7031259683008362, scale: 295498000 },
  { level: 1, resolution: 0.3515629841504181, scale: 147749000 },
  { level: 2, resolution: 0.17578125412910844, scale: 73874400 },
  { level: 3, resolution: 0.08789062706455422, scale: 36937200 },
  { level: 4, resolution: 0.04394531353227711, scale: 18468600 },
  { level: 5, resolution: 0.021972656766138556, scale: 9234300 },
  { level: 6, resolution: 0.010986328383069278, scale: 4617150 },
  { level: 7, resolution: 0.00549315229422961, scale: 2308570 },
  { level: 8, resolution: 0.002746588044419834, scale: 1154290 },
  { level: 9, resolution: 0.0013732916427489112, scale: 577144 },
  { level: 10, resolution: 6.866458213744556e-4, scale: 288572 },
  { level: 11, resolution: 3.433229106872278e-4, scale: 144286 },
  { level: 12, resolution: 1.716614553436139e-4, scale: 72143 },
  { level: 13, resolution: 8.583072767180695e-5, scale: 36071.5 },
  { level: 14, resolution: 4.291524486285319e-5, scale: 18035.7 },
  { level: 15, resolution: 2.145767002064671e-5, scale: 9017.87 },
  { level: 16, resolution: 1.072883501032336e-5, scale: 4508.93 },
  { level: 17, resolution: 0.536441750516168e-5, scale: 2254.465 }
]
