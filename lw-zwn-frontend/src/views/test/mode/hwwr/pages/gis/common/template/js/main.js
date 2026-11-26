/*入口函数*/
function init() {
  //初始话地图
  map = new GIS.Map('map', {
    logo: false,
    slider: false,
    center: [112.24102842283966, 30.933265978759643],
    zoom: 8
  })
  //天地图地图
  const tdtDT = GIS.TDTLayer({ id: 'tdtditu' })
  map.addLayer(tdtDT)
}
