/*查询定位*/
define(['dojo/_base/declare', 'esri/tasks/query', 'esri/tasks/QueryTask'], function (
  declare,
  Query,
  QueryTask
) {
  return declare(
    /*不继承任何类*/
    null,
    {
      map: null,
      constructor: function (map) {
        this.map = map
      },
      queryToLocate: function (index, cd) {
        const query = new Query()
        const queryTask = new QueryTask(shouye.queryUrl + '/' + index)
        console.log(shouye.queryUrl + '/' + index)
        query.where = "STCD = '" + cd + "'"
        //  query.outSpatialReference = {wkid:4326};
        query.returnGeometry = true
        query.outFields = ['*']
        queryTask.execute(query, this.addGraphicToMap)
      },
      /*根据返回要素定位*/
      addGraphicToMap: function (result) {
        if (result.features.length > 0) {
          const gra = result.features[0]
          const type = gra.geometry.type
          switch (type) {
            case 'point':
              map.centerAndZoom(gra.geometry, 12)
              break
            case 'polyline':
              var ext = gra.geometry.getExtent()
              map.setExtent(ext.expand(1.5))
            case 'polygon':
              var ext = gra.geometry.getExtent()
              var sfs = new GIS.SimpleFillSymbol(
                GIS.SimpleFillSymbol.STYLE_SOLID,
                new GIS.SimpleLineSymbol(
                  GIS.SimpleLineSymbol.STYLE_DASHDOT,
                  new GIS.Color([255, 0, 0]),
                  2
                ),
                new GIS.Color([255, 255, 0, 0.25])
              )
              gra.setSymbol(sfs)
              map.setExtent(ext.expand(1.5))
              map.graphics.clear()
              map.graphics.add(gra)
              symbolTool.blink(gra, 500, 5, true)
              console.log(ext)
          }
          if (!map.initialExt) {
            //	map.initialExt=ext.expand(1.2);
          }
        }
      }
      /*添加要素到底图*/
    }
  )
})
