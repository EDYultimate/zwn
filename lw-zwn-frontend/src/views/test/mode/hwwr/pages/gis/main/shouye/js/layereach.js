const layereach = function (item) {
  require(['esri/tasks/IdentifyTask', 'esri/tasks/IdentifyParameters'], function (
    IdentifyTask,
    IdentifyParameters
  ) {
    if (item.graphic != undefined) {
      return
    }
    map.graphics.clear()
    locatLayer.clear()
    map.infoWindow.hide()
    identityResultLayer.clear()
    identifyexe(item.mapPoint, IdentifyTask, IdentifyParameters)
  })
}
/*infowindow弹出框*/
function showInfowindow(screenpoint, graphic) {
  let lengthname = ''
  let nms = ''
  if (graphic.attributes.NAME) {
    nms = graphic.attributes.NAME
    lengthname = graphic.attributes.NAME.length
  } else if (graphic.attributes.RNAME) {
    nms = graphic.attributes.RNAME
    lengthname = graphic.attributes.RNAME.length
  } else if (graphic.attributes.STNM) {
    nms = graphic.attributes.STNM
    lengthname = graphic.attributes.STNM.length
  }

  console.log(lengthname)
  let lengpara = 0
  if (lengthname <= 5) {
    lengpara = 35
    lengthname = 4
  } else if (lengthname >= 5 && lengthname <= 10) {
    lengpara = 20
  } else {
    lengpara = 17
  }
  map.infoWindow.resize(lengthname * lengpara + 14, 35)
  if (graphic.attributes.NAME == undefined) {
    graphic.attributes.NAME = '-'
  }
  if (graphic.attributes.CD == undefined) {
    graphic.attributes.CD = '-'
  }
  htmlStr =
    '<div style="color: #378b00;font-size: 12px; font-weight: bold;" class="divinfo">' +
    '编码:' +
    graphic.attributes.CD +
    '<br/>名称:' +
    nms +
    '</div>'
  map.infoWindow.setContent(htmlStr)
  map.infoWindow.show(screenpoint)
}
/*执行查询*/
function identifyexe(mapPoint, IdentifyTask, IdentifyParameters) {
  const identifyTask = new IdentifyTask(shouye.backlayer)
  identifyParams = new IdentifyParameters()
  identifyParams.tolerance = 3
  identifyParams.returnGeometry = true
  identifyParams.layerIds = backall.visibleLayers //[0,1,2,3,4,8];//
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
      alert(errpr)
    }
  )
}

/**
 *identify查询结果
 **/
function identifyResultthis(identifyresults, mapPoint) {
  {
    for (let x = 0; x < 1; x++) {
      var symbol
      const linesymbol = new GIS.SimpleLineSymbol(
        GIS.SimpleLineSymbol.STYLE_SOLID,
        new GIS.Color([50, 50, 50]),
        2.5
      )
      const synfilsymbol = new GIS.SimpleFillSymbol(
        GIS.SimpleFillSymbol.STYLE_SOLID,
        new GIS.SimpleLineSymbol(GIS.SimpleLineSymbol.STYLE_SOLID, new GIS.Color([255, 0, 0]), 1),
        new GIS.Color([255, 255, 0, 0.25])
      )
      if (identifyresults.length > 0) {
        const feature = identifyresults[x].feature
        switch (feature.geometry.type) {
          case 'point':
            symbol = new GIS.SimpleMarkerSymbol(
              GIS.SimpleMarkerSymbol.STYLE_CIRCLE,
              12,
              new GIS.SimpleLineSymbol(
                GIS.SimpleLineSymbol.STYLE_NULL,
                new GIS.Color([247, 34, 101]),
                1
              ),
              new GIS.Color([207, 34, 171])
            )
            break
          case 'polyline':
            symbol = linesymbol
            break
          default:
            symbol = synfilsymbol
            break
        }
        const locationGraphic = new GIS.Graphic(feature.geometry, symbol)
        //添加属性信息
        locationGraphic.attributes = feature.attributes

        map.graphics.add(locationGraphic)
        showInfowindow(mapPoint, locationGraphic)
      } else {
        map.infoWindow.hide()
      }
    }
  }
}
