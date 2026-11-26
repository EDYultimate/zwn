const layereach = function (item) {
  require(['esri/tasks/IdentifyTask', 'esri/tasks/IdentifyParameters'], function (
    IdentifyTask,
    IdentifyParameters
  ) {
    if (item.graphic != undefined) {
      return
    }

    console.log(map.extent)
    map.graphics.clear()
    //map.infoWindow.hide();
    //identityResultLayer.clear();
    identifyexe(item.mapPoint, IdentifyTask, IdentifyParameters)
  })
}

/*执行查询*/
function identifyexe(mapPoint, IdentifyTask, IdentifyParameters) {
  const identifyTask = new IdentifyTask(GIS.zhuantiUrl)
  identifyParams = new IdentifyParameters()
  identifyParams.tolerance = 3
  identifyParams.returnGeometry = true
  identifyParams.layerIds = dsxlLayer.visibleLayers //[0,1,2,3,4,8];//
  console.log(identifyParams.layerIds)
  identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL
  identifyParams.width = map.width
  identifyParams.height = map.height
  identifyParams.geometry = mapPoint
  identifyParams.mapExtent = map.extent
  identifyTask.execute(
    identifyParams,
    function (result) {
      identifyResultthis(result, mapPoint)
    },
    function (errpr) {
      //alert(errpr);
    }
  )
}

/**
 *identify查询结果
 **/
function identifyResultthis(identifyresults, mapPoint) {
  if (identifyresults.length == 0) {
    return
  }
  const feature = identifyresults[0].feature
  const cd = feature.attributes.CD
  console.log('cdd:' + cd)
  clickDsxlFun(cd)
}
