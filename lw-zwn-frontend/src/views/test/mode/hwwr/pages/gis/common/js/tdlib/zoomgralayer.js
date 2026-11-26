define(['dojo/_base/declare', 'dojo/_base/lang', 'esri/layers/GraphicsLayer'], function (
  declare,
  lang,
  GraphicsLayer
) {
  return declare(GraphicsLayer, {
    defaults: { map: null, isZoom: true, layerlevel: 0 },
    layerLevel: 0,
    isZoom: true,
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

        this.isZoom = this.defaults.isZoom
        this.on('graphic-add', lang.hitch(this, this.graphicAddHandle))
        this.on('mouse-down', function (evt) {
          console.log(evt.graphic.attributes.CD)
        })
      }
      //this.loaded = true;
      //this.onLoad(this);
    },
    //地图范围变化响应函数
    extentchangeHandle: function (event) {
      //console.log(this.defaults.map.getLevel());
      if (event.levelChange) {
        this.layerLevel = this.defaults.map.getLevel()
        if (!this.isZoom) {
          return
        }
        this.changeGraVisible()
      }
    },
    //graphic添加响应函数
    graphicAddHandle: function (event) {
      if (event.graphic.attributes.hasOwnProperty('LAYERSCALE')) {
        let graLevel = 0
        try {
          graLevel = Number(event.graphic.attributes.LAYERSCALE)
        } catch (err) {
          graLevel = 0
        }

        if (!this.isZoom) {
          event.graphic.show()
        } else {
          //alert(this.layerLevel+";"+graLevel);
          if (graLevel <= this.layerLevel) {
            event.graphic.show()
          } else {
            event.graphic.hide()
          }
        }
      }
    },
    //清除所有要素
    clear: function () {
      console.log('cleaar')
      this.inherited(arguments)
      // this.handler.extentchange.remove();
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
      //alert(this.layerLevel);
      dojo.forEach(
        this.graphics,
        lang.hitch(this, function (item, index) {
          if (item.attributes.hasOwnProperty('LAYERSCALE')) {
            let graLevel = 0
            try {
              graLevel = Number(item.attributes.LAYERSCALE)
            } catch (err) {
              graLevel = 0
            }
            if (graLevel <= this.layerLevel) {
              item.show()
            } else {
              item.hide()
            }
          }
        })
      )
    }
  })
})
