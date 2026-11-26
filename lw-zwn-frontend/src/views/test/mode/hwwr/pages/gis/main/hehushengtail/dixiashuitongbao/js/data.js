let dataArray = [
  {
    level: 10,
    pnm: '山西省',
    pcd: 140000,
    cnm: '晋中市',
    ccd: 140700,
    zhi: 1.95,
    qk: '升',
    color: '蓝'
  },
  { level: 15, pnm: '', pcd: '', cnm: '大同市', ccd: 140200, zhi: 1.34, qk: '升', color: '蓝' },
  { level: 18, pnm: '', pcd: '', cnm: '太原市', ccd: 140100, zhi: 1.25, qk: '升', color: '蓝' },
  { level: 47, pnm: '', pcd: '', cnm: '沂州市', ccd: 140900, zhi: 0.11, qk: '降', color: '黄' },
  { level: 105, pnm: '', pcd: '', cnm: '朔州市', ccd: 140600, zhi: 2.59, qk: '降', color: '红' },
  {
    level: 20,
    pnm: '河北省',
    pcd: 130000,
    cnm: '沧州市',
    ccd: 130900,
    zhi: 1.19,
    qk: '升',
    color: '蓝'
  },
  { level: 52, pnm: '', pcd: '', cnm: '保定市', ccd: 130600, zhi: 0.16, qk: '降', color: '黄' },
  { level: 64, pnm: '', pcd: '', cnm: '雄安新区', ccd: '', zhi: 0.39, qk: '降', color: '黄' },
  { level: 65, pnm: '', pcd: '', cnm: '张家口市', ccd: 130700, zhi: 0.39, qk: '降', color: '黄' },
  { level: 67, pnm: '', pcd: '', cnm: '定州市', ccd: '', zhi: 0.42, qk: '降', color: '黄' },
  { level: 69, pnm: '', pcd: '', cnm: '廊坊市', ccd: 131000, zhi: 0.44, qk: '降', color: '黄' },
  { level: 57, pnm: '', pcd: '', cnm: '石家庄市', ccd: 130100, zhi: 0.23, qk: '降', color: '黄' },
  { level: 82, pnm: '', pcd: '', cnm: '衡水市', ccd: 131100, zhi: 0.7, qk: '降', color: '橙' },
  { level: 83, pnm: '', pcd: '', cnm: '邢台市', ccd: 130500, zhi: 0.72, qk: '降', color: '橙' },
  { level: 89, pnm: '', pcd: '', cnm: '邯郸市', ccd: 130400, zhi: 0.85, qk: '降', color: '橙' },
  { level: 90, pnm: '', pcd: '', cnm: '辛集市', ccd: '', zhi: 0.86, qk: '降', color: '橙' },
  { level: 98, pnm: '', pcd: '', cnm: '唐山市', ccd: 130200, zhi: 1.22, qk: '降', color: '红' },
  {
    level: 21,
    pnm: '山东省',
    pcd: 370000,
    cnm: '滨州市',
    ccd: 371600,
    zhi: 1.16,
    qk: '升',
    color: '蓝'
  },
  { level: 27, pnm: '', pcd: '', cnm: '东营市', ccd: 370500, zhi: 0.86, qk: '升', color: '蓝' },
  { level: 84, pnm: '', pcd: '', cnm: '聊城市', ccd: 371500, zhi: 0.72, qk: '降', color: '橙' },
  { level: 96, pnm: '', pcd: '', cnm: '德州市', ccd: 371400, zhi: 1.15, qk: '降', color: '红' },
  {
    level: 34,
    pnm: '辽宁省',
    pcd: 210000,
    cnm: '葫芦岛市',
    ccd: 211400,
    zhi: 0.25,
    qk: '升',
    color: '黄'
  },
  { level: 42, pnm: '', pcd: '', cnm: '朝阳市', ccd: 211300, zhi: 0.03, qk: '升', color: '黄' },
  {
    level: 50,
    pnm: '北京市',
    pcd: 110000,
    cnm: '北京市',
    ccd: 110100,
    zhi: 0.14,
    qk: '降',
    color: '黄'
  },
  {
    level: 53,
    pnm: '河南省',
    pcd: 410000,
    cnm: '鹤壁市',
    ccd: 410600,
    zhi: 0.2,
    qk: '降',
    color: '黄'
  },
  { level: 60, pnm: '', pcd: '', cnm: '濮阳市', ccd: 410900, zhi: 0.25, qk: '降', color: '黄' },
  { level: 91, pnm: '', pcd: '', cnm: '安阳市', ccd: 410500, zhi: 0.91, qk: '降', color: '橙' },
  { level: 104, pnm: '', pcd: '', cnm: '焦作市', ccd: 410800, zhi: 1.91, qk: '降', color: '红' },
  {
    level: 77,
    pnm: '内蒙古自治区',
    pcd: 150000,
    cnm: '锡林郭勒盟',
    ccd: 152900,
    zhi: 0.66,
    qk: '降',
    color: '橙'
  },
  { level: 78, pnm: '', pcd: '', cnm: '赤峰市', ccd: 150400, zhi: 0.66, qk: '降', color: '橙' },
  { level: 79, pnm: '', pcd: '', cnm: '乌兰察布市', ccd: 150900, zhi: 0.68, qk: '降', color: '橙' }
]
//function getData(urlArray,callback){
//	$.getJSON("/hwwr/szybh/ywgz/getSaveWaterEcologyFlowWarnDetailInfoGis",{},function(res){
//		dataArray=res;
//		var task=new GIS.QueryTask("http://10.3.34.221:6080/arcgis/rest/services/hehushengtai/hehushengtai/MapServer/20");//
//		var query=new GIS.Query();
//		query.where = "1=1";
//		query.returnGeometry = true;
//		query.outFields = ["*"];
//		query.outSpatialReference = {wkid:4326};
//		task.execute(query, function(result){
//			//console.log(result);
//			var features=result.features;
//			for(var i=0;i<features.length;i++){
//				addGrphic(features[i]);
//			}
//
//		},function(err){
//
//		});
//		//addStation(res);
//	});
//
//}
function getData(res) {
  //清空图层
  renderLayer.clear()
  dataArray = res
  const task = new GIS.QueryTask(
    'http://10.3.34.221:6080/arcgis/rest/services/hehushengtai/hehushengtai/MapServer/20'
  ) //
  const query = new GIS.Query()
  query.where = '1=1'
  query.returnGeometry = true
  query.outFields = ['*']
  query.outSpatialReference = { wkid: 4326 }
  task.execute(
    query,
    function (result) {
      //console.log(result);
      const features = result.features
      for (let i = 0; i < features.length; i++) {
        addGrphic(features[i])
      }
    },
    function (err) {}
  )
  //addStation(res);
}
function addGrphic(item) {
  const symbol0 = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_SOLID, new GIS.Color([81, 187, 255, 0]), 0),
    new GIS.Color([81, 187, 255, 0])
  )
  const symbol1 = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(
      GIS.SimpleLineSymbol.STYLE_SOLID,
      new GIS.Color([81, 187, 255, 1]),
      0.5
    ),
    new GIS.Color([81, 187, 255, 0.3])
  )
  const symbol2 = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(
      GIS.SimpleLineSymbol.STYLE_SOLID,
      new GIS.Color([255, 252, 0, 1]),
      0.5
    ),
    new GIS.Color([255, 252, 0, 0.3])
  )
  const symbol3 = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(
      GIS.SimpleLineSymbol.STYLE_SOLID,
      new GIS.Color([255, 196, 77, 1]),
      0.5
    ),
    new GIS.Color([255, 196, 77, 0.3])
  )
  const symbol4 = new GIS.SimpleFillSymbol(
    GIS.SimpleFillSymbol.STYLE_SOLID,
    new GIS.SimpleLineSymbol(
      GIS.SimpleLineSymbol.STYLE_SOLID,
      new GIS.Color([255, 101, 101, 1]),
      0.5
    ),
    new GIS.Color([255, 101, 101, 0.3])
  )
  let symbolo = symbol0
  for (let i = 0; i < dataArray.length; i++) {
    const obj = dataArray[i]
    if (item.attributes.DIST_CODE == obj.AD_CD) {
      console.log(obj.color)
      if (obj.TYPE == '1') {
        symbolo = symbol1
      } else if (obj.TYPE == '2') {
        symbolo = symbol2
      } else if (obj.TYPE == '3') {
        symbolo = symbol3
      } else if (obj.TYPE == '4') {
        symbolo = symbol4
      }
    }
  }
  const gra = new GIS.Graphic(item.geometry)
  gra.setSymbol(symbolo)
  renderLayer.add(gra)
}
