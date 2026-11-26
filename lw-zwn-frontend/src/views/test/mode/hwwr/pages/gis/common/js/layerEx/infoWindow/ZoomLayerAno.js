define(['dojo/_base/declare', 'dojo/_base/lang', 'esri/layers/GraphicsLayer'], function (
  declare,
  lang,
  GraphicsLayer
) {
  return declare(GraphicsLayer, {
    defaults: { map: null, isAno: true, isZoom: true, levelType: [], layerlevel: 0 },
    layerLevel: 0,
    nameType: [],
    valueType: [],
    levelType: [],
    markerType: [],
    isZoom: true,
    isAno: true,
    handler: {},
    constructor: function (options) {
      declare.safeMixin(this.defaults, options)
      console.log(this.defaults.map.getLevel())
      if (this.defaults.map != null) {
        this.handler.extentchange = this.defaults.map.on(
          'extent-change',
          lang.hitch(this, this.extentchangeHandle)
        )
        this.layerLevel = this.defaults.layerlevel
        this.markerType = this.defaults.markerType
        this.valueType = this.defaults.valueType
        this.levelType = this.defaults.levelType
        this.isZoom = this.defaults.isZoom
        this.isAno = this.defaults.isAno
        this.on('graphic-add', lang.hitch(this, this.graphicAddHandle))
        this.on('mouse-down', function (evt) {
          console.log(evt.graphic.attributes.CD)
        })
        this.on('mouse-over', lang.hitch(this, this.graphicmouseHandle))
        this.on('mouse-out', function () {})
      }
    },
    //地图范围变化响应函数
    extentchangeHandle: function (event) {
      //console.log(this.defaults.map.getLevel());
      if (event.levelChange) {
        this.layerLevel = this.defaults.map.getLevel()
        if (!this.isZoom) return
        this.changeGraVisible()
      }
    },
    setMarkerType: function (arr) {
      this.markerType = arr
      this.changeGraVisible()
    },
    setNameType: function (arr) {
      this.nameType = arr
      this.changeGraVisible()
    },
    setValueType: function (arr) {
      this.valueType = arr
      this.changeGraVisible()
    },
    setType: function (marker, name, value) {
      this.markerType = marker
      this.nameType = name
      this.valueType = value
      this.changeGraVisible()
    },
    //添加鼠标移动事件
    graphicmouseHandle: function (evt) {
      if (!this.isAno) return
      this.defaults.map.infoWindow.hide()
      var name = evt.graphic.attributes.NAME
      if (typeof name == 'undefined' || name == null || name == '') {
        name = '名称：'
      }
      var lengthname = name.length
      console.log(lengthname)
      map.infoWindow.resize(lengthname * 16 + 14, 25)
      var divinfo =
        '<div style="color: #378b00;font-size: 14px; font-weight: bold;" class="divinfo">' +
        name +
        '</div>'
      this.defaults.map.infoWindow.setContent(divinfo)
      this.defaults.map.infoWindow.show(evt.screenPoint)
    },
    //graphic添加响应函数
    graphicAddHandle: function (event) {
      //首先将要素分为 名称  数值  图标 三类  name  value  marker  SHOWTYPE
      var gra = event.graphic
      this.graphicFilter(gra)
    },
    graphicFilter: function (gra) {
      var graIsShow = true //默认可见
      //然后将要素分为雨量站  水位站 伤情站

      var graType = gra.attributes['GRATYPE']

      if (gra.attributes.hasOwnProperty('SHOWTYPE')) {
        var type = gra.attributes['SHOWTYPE']
        if (type == 'name') {
          if (this.nameType.indexOf(graType) == -1) {
            graIsShow = false
          }
        } else if (type == 'value') {
          if (this.valueType.indexOf(graType) == -1) {
            graIsShow = false
          } else if(type == "marker") {
            				
            				
          if (this.markerType.indexOf(graType) == -1) {
            graIsShow = false
          }
        }
      }
      //判断分级图层是否显示
      if (gra.attributes.hasOwnProperty('LAYERSCALE')) {
        var graLevel = 0
        try {
          graLevel = Number(gra.attributes['LAYERSCALE'])
        } catch (err) {
          graLevel = 0
        }
        //判断图层是否可见
        if (this.levelType.indexOf(graType) != -1) {
          if (graLevel > this.layerLevel) {
            graIsShow = false
          }
        }
      }
      //根据判断结构应用于要素是否显示。
      if (graIsShow) {
        gra.show()
      } else {
        gra.hide()
      }
    },
    //清除所有要素
    clear: function () {
      console.log('cleaar')
      this.inherited(arguments)
      // this.handler.extentchange.remove();
    },
    /*根据类型删除要素*/
    clearByType: function (type) {
      for (var i = 0; i < this.graphics.length; i++) {
        var item = this.graphics[i]
        //	debugger;
        if (type.indexOf(item.attributes['SHOWTYPE']) != -1) {
          this.remove(item)
        }
      }
    },
    //显示所有要素
    showAll: function () {
      this.isZoom = false
      dojo.forEach(
        this.graphics,
        lang.hitch(this, function (item, index) {
          item.show()
        })
      )
    },
    /*恢复到可以缩放*/
    toNormal: function () {
      this.isZoom = true
      this.changeGraVisible()
    },
    //改变要素显隐
    changeGraVisible: function () {
      dojo.forEach(
        this.graphics,
        lang.hitch(this, function (item, index) {
          this.graphicFilter(item)
        })
      )
    }
  })
})
