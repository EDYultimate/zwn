;(function ($) {
  $.fn.MapSwitch = function (option) {
    //var mzarray=[16,17,24,26];
    const mzarray = []
    this.empty()
    const lp = getJSPath('MapSwitch.js')
    const thiswidth = '120px'
    const thisheight = '30px'
    const isOpen_layer = false
    let layersHeight = 190 //图层容器高度
    const layerPadding = 5 //图层容器内边框
    const defauts = {
      data: {
        layers: []
      },
      tool: [
        { label: '长度', logo: 'ico_ruler.png', toolid: 'length', handler: function () {} },
        { label: '面积', logo: 'ico_polygon.png', toolid: 'area', handler: function () {} },
        { label: '清除', logo: 'ico_delete.png', toolid: 'clear', handler: function () {} },
        { label: '生成专题图', logo: 'zhuanti.png', toolid: 'print', handler: function () {} }
      ],
      maps: [
        {
          label: '地图',
          logo: 'ditu.png',
          mapid: 'ditu'
        },
        {
          label: '地形',
          logo: 'dixing.png',
          mapid: 'dixing'
        },
        {
          label: '影像',
          logo: 'yingxiang.png',
          mapid: 'yingxiang'
        }
      ],
      mapChangeHandler: function () {},
      layerChangeHandler: function (layers) {
        //console.log(layers);
        setLayerVisible(layers)
      },
      map: '',
      top: 10,
      left: 10
    }

    const setting = $.extend({}, defauts, option)
    //从属性中获取下拉框高度
    layersHeight = option.layersHeight || layersHeight
    //初始化测量工具
    const measureTool = new GIS.Measuretool({ map: map })
    //设置动态地图
    let visibleLayers = []
    for (var i = 0; i < setting.data.layers.length; i++) {
      for (let j = 0; j < setting.data.layers[i].data.length; j++) {
        if (setting.data.layers[i].data[j].checked == 'true') {
          visibleLayers = visibleLayers.concat(setting.data.layers[i].data[j].layers)
        }
      }
    }
    visibleLayers = visibleLayers.concat(mzarray)
    console.log(visibleLayers)
    if (!setting.start) {
      map.getLayer('basemap').setVisibleLayers(visibleLayers)
    }

    //	setting.handle=setting.data[0].clickhandle;
    this.css({
      padding: '4px',
      background: '#fff',
      'border-radius': '20px',
      width: '250px',
      height: '24px',
      'line-height': '24px',
      textAlign: 'center',
      position: 'absolute',
      'font-family': '微软雅黑',
      'font-size': '14px',
      color: '#4c4c4c',
      'box-shadow': 'rgb(0, 0, 0,0.5) 0px 0px 4px'
    })
    //创建容器
    //创建间隔
    //首先创建图层、工具、地图按钮
    /**创建图层**/
    const layerContainer = $('<div></div>')
    layerContainer.css({
      position: 'relative',
      marginLeft: 8,
      cursor: 'pointer',
      float: 'left',
      width: '75px',
      height: '20px'
    })
    const layer_logo = $("<div style='position: absolute;left:0px;top:2px;'></div>")
    layer_logo.css({
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/layers.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    const layer_label = $('<div>图层</div>')
    layer_label.css({
      position: 'absolute',
      left: '23px',
      top: '2px',
      height: '20px',
      width: '30px',
      lineHeight: '20px'
    })
    const layer_down = $('<div ></div>')
    layer_down.css({
      position: 'absolute',
      left: '53px',
      top: '2px',
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/xiala.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    layerContainer.append(layer_logo)
    layerContainer.append(layer_label)
    layerContainer.append(layer_down)
    //添加移上去
    layerContainer.hover(
      function () {
        layer_label.css({
          color: '#205FBD',
          fontWeight: 'bold'
        })
      },
      function () {
        layer_label.css({
          color: '#000000',
          fontWeight: 'normal'
        })
      }
    )
    //添加点击事件
    layerContainer.on('click', function () {
      if (layerContainer.hasClass('open')) {
        layerContentContainer.hide()
      } else {
        layerContentContainer.show()
      }
      layerContainer.toggleClass('open')
      hideAllContentContainer(layerContainer)
    })

    //添加间隔
    const lineInterval = $('<div></div>')
    lineInterval.css({
      width: '1px',
      height: '18px',
      float: 'left',
      marginTop: '3px',
      backgroundColor: '#D8D8D8'
    })
    this.append(layerContainer)
    this.append(lineInterval)
    /**创建图层**/
    /**创建工具**/
    const toolContainer = $('<div></div>')
    toolContainer.css({
      position: 'relative',
      marginLeft: 5,
      cursor: 'pointer',
      float: 'left',
      width: '75px',
      height: '20px'
    })
    const tool_logo = $("<div style='position: absolute;left:0px;top:2px;'></div>")
    tool_logo.css({
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/tools.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    const tool_label = $('<div>工具</div>')
    tool_label.css({
      position: 'absolute',
      left: '23px',
      top: '2px',
      height: '20px',
      width: '30px',
      lineHeight: '20px'
    })
    const tool_down = $('<div ></div>')
    tool_down.css({
      position: 'absolute',
      left: '53px',
      top: '2px',
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/xiala.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    toolContainer.append(tool_logo)
    toolContainer.append(tool_label)
    toolContainer.append(tool_down)
    //添加移上去
    toolContainer.hover(
      function () {
        tool_label.css({
          color: '#205FBD',
          fontWeight: 'bold'
        })
      },
      function () {
        tool_label.css({
          color: '#000000',
          fontWeight: 'normal'
        })
      }
    )
    //添加点击事件
    toolContainer.on('click', function () {
      if (toolContainer.hasClass('open')) {
        toolContentContainer.hide()
      } else {
        toolContentContainer.show()
      }
      toolContainer.toggleClass('open')
      hideAllContentContainer(toolContainer)
    })
    //添加间隔
    const lineInterval2 = $('<div></div>')
    lineInterval2.css({
      width: '1px',
      height: '18px',
      float: 'left',
      marginTop: '3px',
      backgroundColor: '#D8D8D8'
    })
    this.append(toolContainer)
    this.append(lineInterval2)
    /**创建工具**/
    /**创建底图**/
    const mapContainer = $('<div></div>')
    mapContainer.css({
      position: 'relative',
      marginLeft: 5,
      cursor: 'pointer',
      float: 'left',
      width: '75px',
      height: '20px'
    })
    const map_logo = $("<div style='position: absolute;left:0px;top:2px;'></div>")
    map_logo.css({
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/ditu.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    const map_label = $('<div>地图</div>')
    map_label.css({
      position: 'absolute',
      left: '23px',
      top: '2px',
      height: '20px',
      width: '30px',
      lineHeight: '20px'
    })
    const map_down = $('<div ></div>')
    map_down.css({
      position: 'absolute',
      left: '53px',
      top: '2px',
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/xiala.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    mapContainer.append(map_logo)
    mapContainer.append(map_label)
    mapContainer.append(map_down)
    //添加移上去
    mapContainer.hover(
      function () {
        map_label.css({
          color: '#205FBD',
          fontWeight: 'bold'
        })
      },
      function () {
        map_label.css({
          color: '#000000',
          fontWeight: 'normal'
        })
      }
    )
    //添加点击事件
    mapContainer.on('click', function () {
      if (mapContainer.hasClass('open')) {
        mapContentContainer.hide()
      } else {
        mapContentContainer.show()
      }
      mapContainer.toggleClass('open')
      //隐藏掉其他
      hideAllContentContainer(mapContainer)
    })
    //添加间隔
    const lineInterval3 = $('<div></div>')
    lineInterval3.css({
      width: '1px',
      height: '18px',
      float: 'left',
      marginTop: '3px',
      backgroundColor: '#D8D8D8'
    })
    this.append(mapContainer)
    //this.append(lineInterval3);
    /**创建底图**/

    //创建图层容器
    var layerContentContainer = $('<div></div>')
    layerContentContainer.css({
      display: 'none',
      width: '220px',
      height: layersHeight,
      position: 'absolute',
      left: '5px',
      top: '40px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #FCFDFD',
      borderRadius: '5px',
      'box-shadow': 'rgb(0, 0, 0,0.5) 0px 0px 4px'
    })
    this.append(layerContentContainer)

    //创建工具容器
    var toolContentContainer = $('<div></div>')
    toolContentContainer.css({
      display: 'none',
      width: '100px',
      height: '140px',
      position: 'absolute',
      left: '90px',
      top: '40px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #FCFDFD',
      borderRadius: '5px',
      'box-shadow': 'rgb(0, 0, 0,0.5) 0px 0px 4px'
    })
    this.append(toolContentContainer)

    //创建地图内容容器
    var mapContentContainer = $('<div></div>')
    mapContentContainer.css({
      display: 'none',
      width: '90px',
      height: '167px',
      position: 'absolute',
      left: '170px',
      top: '40px',

      backgroundColor: '#FFFFFF',
      border: '1px solid #FCFDFD',
      borderRadius: '5px',
      'box-shadow': 'rgb(0, 0, 0,0.5) 0px 0px 4px'
    })
    this.append(mapContentContainer)

    //图层打开面板
    //基础图层数组
    const jctcDataArray = setting.data.layers[0].data
    const jctcContainer = $('<div></div>')
    jctcContainer.css({
      width: '148px',
      height: layersHeight,
      margin: layerPadding,
      position: 'absolute'
    })
    layerContentContainer.append(jctcContainer)
    //添加基础图层头
    const jctcHeader = $("<div style='position:relative;cursor:pointer;'></div>")
    const jctcImg = $("<div class='ItemImg'></div>")
    jctcImg.css({
      position: 'absolute',
      left: '5px',
      top: '0px',
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/layerimg0.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    jctcHeader.append(jctcImg)
    const jctcLogo = $('<div></div>')
    jctcLogo.css({
      position: 'absolute',
      left: '25px',
      top: '0px',
      width: '20px',
      height: '20px',
      background: 'url("' + lp + 'img/layer.png") no-repeat center center',
      border: '1 solid #FCFDFD'
    })
    jctcHeader.append(jctcLogo)
    const jctcLabel = $('<div>基础图层</div>')
    jctcLabel.css({
      lineHeight: '14px',
      height: '14px',
      position: 'absolute',
      top: '4px',
      left: '50px'
    })
    jctcHeader.append(jctcLabel)

    for (var i = 0; i < jctcDataArray.length; i++) {
      const jctcItem = $(
        "<div class='Item' style='position: absolute;height:24px;width:100px;'></div>"
      ).attr('layerindex', jctcDataArray[i].layerindex)
      //	jctcItem.addClass("checked");
      jctcItem.css({
        left: '25px',
        top: 25 * i + 25,
        cursor: 'pointer'
      })
      const jctcItemImg = $("<div class='ItemImg'></div>")

      jctcItem.append(jctcItemImg)
      let jctcItemImgUrl = 'url("' + lp + 'img/layerimg0.png") no-repeat center center'
      //判断默认是否选中
      if (jctcDataArray[i].checked == 'true') {
        jctcItem.addClass('checked')
        jctcItemImgUrl = 'url("' + lp + 'img/layerimg2.png") no-repeat center center'
      }
      jctcItemImg.css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: '20px',
        height: '20px',
        background: jctcItemImgUrl,
        border: '1 solid #FCFDFD'
      })
      const jctcItemLabel = $('<div></div>')
      jctcItemLabel.css({
        position: 'absolute',
        left: 25,
        width: '160px',
        top: 0,
        'text-align': 'left'
      })
      jctcItemLabel.text(jctcDataArray[i].label)
      jctcItem.append(jctcItemLabel)
      jctcContainer.append(jctcItem)
      //添加监听事件
      jctcItem.on('click', jctcItemHandler)
    }
    //判断上级图标
    const jctcLength = jctcContainer.children('.Item.checked').length
    if (jctcLength == 0) {
      jctcImg.css({
        background: 'url("' + lp + 'img/layerimg0.png") no-repeat center center'
      })
      //头部去掉选中
      jctcHeader.removeClass('checked')
    } else if (jctcLength == jctcDataArray.length) {
      jctcImg.css({
        background: 'url("' + lp + 'img/layerimg2.png") no-repeat center center'
      })
      //添加选中
      jctcHeader.addClass('checked')
    } else {
      jctcImg.css({
        background: 'url("' + lp + 'img/layerimg1.png") no-repeat center center'
      })
      //头部去掉选中
      jctcHeader.removeClass('checked')
    }
    //基础图层头添加点击事件
    jctcHeader.on('click', jctcHeaderHandler)
    function jctcItemHandler(event) {
      const itemTarget = $(event.currentTarget)
      if (itemTarget.hasClass('checked')) {
        itemTarget.removeClass('checked')
        itemTarget.find('.ItemImg').css({
          background: 'url("' + lp + 'img/layerimg0.png") no-repeat center center'
        })
        getTargetLayers(itemTarget, false)
      } else {
        itemTarget.addClass('checked')
        itemTarget.find('.ItemImg').css({
          background: 'url("' + lp + 'img/layerimg2.png") no-repeat center center'
        })
        getTargetLayers(itemTarget, true)
      }
      //判断上级图标
      const jctcLength = jctcContainer.children('.Item.checked').length
      if (jctcLength == 0) {
        jctcImg.css({
          background: 'url("' + lp + 'img/layerimg0.png") no-repeat center center'
        })
        //头部去掉选中
        jctcHeader.removeClass('checked')
      } else if (jctcLength == jctcDataArray.length) {
        jctcImg.css({
          background: 'url("' + lp + 'img/layerimg2.png") no-repeat center center'
        })
        //添加选中
        jctcHeader.addClass('checked')
      } else {
        jctcImg.css({
          background: 'url("' + lp + 'img/layerimg1.png") no-repeat center center'
        })
        //头部去掉选中
        jctcHeader.removeClass('checked')
      }
    }
    function jctcHeaderHandler(event) {
      const itemTarget = $(event.currentTarget)
      if (itemTarget.hasClass('checked')) {
        itemTarget.removeClass('checked')
        itemTarget.find('.ItemImg').css({
          background: 'url("' + lp + 'img/layerimg0.png") no-repeat center center'
        })
        jctcContainer.children('.Item').removeClass('checked')
        jctcContainer
          .children('.Item')
          .find('.ItemImg')
          .css({
            background: 'url("' + lp + 'img/layerimg0.png") no-repeat center center'
          })
        //触发点击事件
        getChildLayers(jctcContainer, false)
      } else {
        itemTarget.addClass('checked')
        itemTarget.find('.ItemImg').css({
          background: 'url("' + lp + 'img/layerimg2.png") no-repeat center center'
        })
        jctcContainer.children('.Item').addClass('checked')
        jctcContainer
          .children('.Item')
          .find('.ItemImg')
          .css({
            background: 'url("' + lp + 'img/layerimg2.png") no-repeat center center'
          })
        //触发点击事件
        getChildLayers(jctcContainer, true)
      }
    }
    jctcContainer.append(jctcHeader)
    /**工具**/
    const tooldataArray = setting.tool

    for (var i = 0; i < tooldataArray.length; i++) {
      const toolItem = $("<div class='ToolItem'></div>").attr('toolid', tooldataArray[i].toolid)
      toolItem.css({
        width: '100%',
        height: '30px',
        position: 'relative',
        cursor: 'pointer'
      })
      const toolIcon = $('<div></div>')
      toolIcon.css({
        position: 'absolute',
        left: '5px',
        top: '7px',
        width: '20px',
        height: '20px',
        background: 'url("' + lp + 'img/' + tooldataArray[i].logo + '") no-repeat center center',
        border: '1 solid #FCFDFD'
      })
      toolItem.append(toolIcon)
      const toolLabel = $('<div></div>')
      toolLabel.text(tooldataArray[i].label)
      toolLabel.css({
        height: '30px',
        lineHeight: '30px',
        position: 'absolute',
        left: 40,
        top: 2
      })
      toolItem.append(toolLabel)
      toolContentContainer.append(toolItem)
      //添加点击事件
      toolItem.on('click', toolItemHandler)
    }
    //处理样式
    tooldataArray.length
    toolContentContainer.css({
      height: tooldataArray.length * 30 + 10 + 'px'
    })

    //地图
    const mapdataArray = setting.maps

    for (var i = 0; i < mapdataArray.length; i++) {
      const mapItem = $("<div class='MapItem'></div>").attr('mapid', mapdataArray[i].mapid)
      mapItem.css({
        width: '100%',
        height: '30px',
        position: 'relative',
        cursor: 'pointer'
      })
      const mapIcon = $('<div></div>')
      mapIcon.css({
        position: 'absolute',
        left: '5px',
        top: '7px',
        width: '20px',
        height: '20px',
        background: 'url("' + lp + 'img/' + mapdataArray[i].logo + '") no-repeat center center',
        border: '1 solid #FCFDFD'
      })
      mapItem.append(mapIcon)
      const mapLabel = $('<div></div>')
      mapLabel.text(mapdataArray[i].label)
      mapLabel.css({
        height: '30px',
        lineHeight: '30px',
        position: 'absolute',
        left: 40,
        top: 2
      })
      mapItem.append(mapLabel)
      mapContentContainer.append(mapItem)
      //添加点击事件
      mapItem.on('click', mapItemHandler)
    }
    //处理样式
    mapContentContainer.css({
      height: mapdataArray.length * 30 + 10 + 'px'
    })

    /**
     * 工具处理方法
     * @param event
     */
    function toolItemHandler(event) {
      const target = $(event.currentTarget)
      const toolid = target.attr('toolid')
      //关闭工具窗体
      toolContentContainer.hide()
      toolContainer.removeClass('open')
      //长度测量
      if (toolid == 'length') {
        measureTool.clearMap()
        measureTool.initialMeasureLine()
        var toolObj = getArrayByAttr(setting.tool, 'toolid', 'length')
        toolObj.handler()
      } else if (toolid == 'area') {
        measureTool.clearMap()
        measureTool.initialMeasureArea()
        var toolObj = getArrayByAttr(setting.tool, 'toolid', 'area')
        toolObj.handler()
      } else if (toolid == 'clear') {
        measureTool.clearMap()
        var toolObj = getArrayByAttr(setting.tool, 'toolid', 'clear')
        toolObj.handler()
      } else if (toolid == 'print') {
        measureTool.clearMap()
        printMap()
      }
    }

    /**地图处理函数**/
    function mapItemHandler(event) {
      const target = $(event.currentTarget)
      const mapid = target.attr('mapid')
      const mapLabel = target.text()
      //关闭工具窗体
      mapContentContainer.hide()
      mapContainer.removeClass('open')
      const mapObj = getArrayByAttr(setting.maps, 'mapid', mapid)
      map_label.text(mapObj.label)
      map_logo.css({
        background: 'url("' + lp + 'img/' + mapObj.logo + '") no-repeat center center'
      })
      /*
               xmj update  1121
             */
      //  map.getLayer("tdtlayer").setVisibility((mapLabel=="地图"));
      map.getLayer('tdtdixing').setVisibility(mapLabel == '地形')
      map.getLayer('tdtyingxiang').setVisibility(mapLabel == '影像')
      setting.mapChangeHandler(mapObj)
    }

    map.on('mouse-down', function () {
      hideAllContentContainer()
    })
    //隐藏所有容器
    function hideAllContentContainer(container) {
      if (container != mapContainer) {
        mapContentContainer.hide()
        mapContainer.removeClass('open')
      }
      if (container != toolContainer) {
        toolContentContainer.hide()
        toolContainer.removeClass('open')
      }
      if (container != layerContainer) {
        layerContentContainer.hide()
        layerContainer.removeClass('open')
      }
    }
    //获取图层数组
    function getChildLayers(node, visible) {
      const nodes = node.children('.Item')
      const layers = []
      for (let i = 0; i < nodes.length; i++) {
        const layer = {}
        layer.layerindex = $(nodes.get(i)).attr('layerindex')
        layer.visible = visible
        layers.push(layer)
      }
      setting.layerChangeHandler(layers)
    }
    //获取单个图层的点击图层数组
    function getTargetLayers(node, visible) {
      const item = {}
      item.layerindex = node.attr('layerindex')
      item.visible = visible
      setting.layerChangeHandler([item])
    }

    //获取数组对象
    function getArrayByAttr(arr, field, value) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][field] == value) {
          return arr[i]
          break
        }
      }
    }
    //图层控制
    function setLayerVisible(layers) {
      //获取目前存在的所有动态地图服务可见图层
      let visibleLayers = map.getLayer('basemap').visibleLayers
      const changeLayerArr = []
      const layerDataArr = []
      for (var i = 0; i < setting.data.layers.length; i++) {
        for (var j = 0; j < setting.data.layers[i].data.length; j++) {
          layerDataArr.push(setting.data.layers[i].data[j])
        }
      }
      for (var i = 0; i < layers.length; i++) {
        const layerArr0 = getArrayByAttr(layerDataArr, 'layerindex', layers[i].layerindex)
        for (var j = 0; j < layerArr0.layers.length; j++) {
          // var indxlayer=visibleLayers.indexOf(layerArr0.layers[j]);
          const indxlayer = visibleLayers.indexOf(layerArr0.layers[j].toString())
          if (layers[i].visible && indxlayer == -1) {
            visibleLayers.push(layerArr0.layers[j])
          } else if (!layers[i].visible && indxlayer != -1) {
            visibleLayers.splice(indxlayer, 1)
          }
        }
        try {
          UpdateLegendByItem(layers[i].layerindex, layers[i].visible) //更新图例 add by fjl20200106
        } catch (e) {}
      }
      console.log(visibleLayers)
      visibleLayers = visibleLayers.concat(mzarray)
      map.getLayer('basemap').setVisibleLayers(visibleLayers)
      //	console.log(visibleLayers);
    }
    /**打印地图**/
    function printMap() {
      require([
        'esri/tasks/PrintTask',
        'esri/tasks/PrintTemplate',
        'esri/tasks/PrintParameters'
      ], function (PrintTask, PrintTemplate, PrintParameters) {
        //创建地图打印对象"
        console.log('printMapprintMap')
        //commonConfig.url+
        //var urlprint="https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";//test
        const urlprint =
          'http://10.3.34.196:6080/arcgis/rest/services/HBPYDXS/ExportWebMap/GPServer/Export%20Web%20Map'
        const printMap = new PrintTask(urlprint)
        //创建地图打印模版
        const template = new PrintTemplate()
        //创建地图的打印参数，参数里面包括：模版和地图
        const params = new PrintParameters()
        //输出图片的空间参考
        printMap.outSpatialReference = map.SpatialReference
        //打印图片的各种参数
        template.exportOptions = {
          width: 1200,
          height: 1200,
          dpi: 96
        }
        //打印输出的格式
        //template.format = "PDF";
        //输出地图的布局
        //template.layout = "MAP_ONLY";

        let unitcontrol = 'Kilometers'
        if (map.getScale() < 72143) {
          unitcontrol = 'Meters'
        }

        let layoutTemplate
        //layoutTemplate="A4_"+setingstyle.northindex+"_"+setingstyle.scaleindex;
        //console.log(layoutTemplate);
        layoutTemplate = 'cus' //A4 Portrait";//"a4-portrait";//MAP_ONLY";//"A4 Landscape";//A4_0_0";
        //template.layout = "MAP_ONLY";
        template.format = 'PNG32'
        //template.label="label+testLAble";
        template.layout = layoutTemplate

        const layerlegendId = {}
        layerlegendId.layerId = 'basemap'
        //layerlegendId.subLayerIds = map.getLayer("basemap").visibleLayers;//[0, 5,6,7,8,9,10,11,12];
        const legendtest = []
        legendtest.push(layerlegendId)

        const layerlegendId1 = {}
        layerlegendId1.layerId = 'xzqlayer'
        legendtest.push(layerlegendId1)

        const layerlegendId2 = {}
        layerlegendId2.layerId = 'zoogralayer'
        legendtest.push(layerlegendId2)

        //template.layoutOptions={titleText:$(".maptitle").val(),legendLayers:legendtest,authorText:$(".mapunit").val(),copyrightText:"copyrightText",scalebarUnit:unitcontrol};
        template.layoutOptions = {
          titleText: '附图1 华北地区地下水超采综合管理河湖生态补水地表水水量监测站网分布图',
          legendLayers: legendtest,
          authorText: '',
          copyrightText: '',
          scalebarUnit: unitcontrol
        }
        template.preserveScale = false
        template.showAttribution = false

        //设置参数地图
        params.map = map
        //设置参数模版
        params.template = template
        //运行结果
        const index = layer.load()
        printMap.execute(
          params,
          function (result) {
            layer.close(index)
            if (result != null) {
              //网页打开生成的地图
              window.open(result.url)
            }
          },
          function (err) {
            layer.close(index)
            console.log('err：' + err)
          }
        )
      })
    }

    //
    //获取js路径
    function getJSPath(name) {
      const js = document.scripts
      let jsPath = ''
      for (let i = js.length; i > 0; i--) {
        if (js[i - 1].src.indexOf(name) > -1) {
          jsPath = js[i - 1].src.substring(0, js[i - 1].src.lastIndexOf('/') + 1)
        }
      }
      return jsPath
    }
    return this
  }
})(jQuery)
