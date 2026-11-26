define(['dojo/_base/declare', 'dojo/_base/lang', 'esri/layers/GraphicsLayer'], function (
  declare,
  lang,
  FeatureLayer
) {
  return declare(FeatureLayer, {
    defaults: { map: null, iszoom: true, layerlevel: 0 },
    layerLevel: 0,
    isZoom: true,
    handler: {},
    constructor: function (options) {
      declare.safeMixin(this.defaults, options)
      //console.log(this.defaults.map.getLevel());
      if (this.defaults.map != null) {
        //	this.handler.extentchange=this.defaults.map.on("extent-change",lang.hitch(this,this.extentchangeHandle));
        //	this.layerLevel=this.defaults.layerlevel;
        //this.on("graphic-add",lang.hitch(this,this.graphicAddHandle));
        this.on('mouse-over', function (evt) {
          let name = evt.graphic.attributes.STNM
          if (typeof name === 'undefined' || name == null || name == '') {
            name = '名称：'
          }
          const lengthname = name.length
          console.log(lengthname)
          map.infoWindow.resize(lengthname * 15, 25)
          const divinfo = '<div class="divinfo">' + name + '</div>'
          this.defaults.map.infoWindow.setContent(divinfo)
          this.defaults.map.infoWindow.show(evt.screenPoint)
        })
        this.on('mouse-out', function () {
          this.defaults.map.infoWindow.hide()
        })
      }
      this.loaded = true
      this.onLoad(this)
    }
    //地图范围变化响应函数
    // extentchangeHandle:function(event){},
    //graphic添加响应函数
    //  graphicAddHandle:function(event){},
    //清除所有要素
    // clear:function(){}
    //显示所有要素
    //  showAll:function(){},
    /*恢复到可以缩放*/
    //toNormal:function(){},
    //改变要素显隐
    //changeGraVisible:function(){}
  })
})
