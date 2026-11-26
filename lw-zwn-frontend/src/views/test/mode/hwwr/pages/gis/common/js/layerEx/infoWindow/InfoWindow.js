/**
 * Created by Administrator on 2015/5/17.
 */
define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/_base/lang',
  'dojo/dom-style',
  'dojo/on',
  'dojo/dom-construct',
  'dojo/dom-geometry',
  'dojo/sniff',
  'dojox/gfx',
  'dojo/text!./templates/Template.html'
], function (
  declare,
  _WidgetBase,
  _TemplatedMixin,
  lang,
  domStyle,
  on,
  domConstruct,
  domGeometry,
  has,
  gfx,
  template
) {
  return declare([_WidgetBase, _TemplatedMixin], {
    direction: 'lt', //方向八个方向
    ah: 5, //垂直方向高度
    aw: 5, //水平方向宽度
    ax: 10, //水平方向偏移
    ay: 10, //垂直方向偏移
    winWidth: 50, //div宽度
    winHeight: 100, //div高度
    path: '', //路径
    radium: 2,
    templateString: template,
    left: null,
    top: null,
    point: null,
    data: null,
    gra: null,
    arrWidth: 10,
    arrHeight: 20,
    arrLength: 20,
    backgroundColor: '#F1FEFA',
    backgroundBorderColor: '#378b00',
    backgroundBorderWidth: '1',
    paper: null,
    txtX: 0,
    txtY: 0,
    constructor: function (
      x,
      y,
      gra,
      winWidth,
      winHeight,
      direction,
      aw,
      sw,
      data,
      map,
      backcolor,
      ax,
      ay,
      radius,
      strokecolor
    ) {
      if (!window.inlayerIndex) {
        window.inlayerIndex = 1
      } else {
        window.inlayerIndex++
      }
      this.gra = gra
      this.point = new GIS.Point(x, y)
      this.data = data
      this.winWidth = winWidth || 140
      this.winHeight = winHeight || 60
      this.aw = aw || 10
      this.ax = ax || 17
      this.ay = ay || 13
      this.sw = sw || 20
      console.log(this.sw)
      this.direction = direction || 'rt'
      this.radius = radius || 5 //圆角大小
      this.pointX = 0
      this.pointY = 0
      this.backcolor = backcolor || '#FFFFFF' //背景色
      //   this.strokecolor=strokecolor||this.backcolor;
      this.strokecolor = strokecolor || '#b4b4b4' //边框描边
      this.map = map
    },
    buildRendering: function () {
      this.inherited(arguments)
      //   var row =domConstruct.toDom("<div id='"+this.data.Name+"_div_pw'></div>");
      //  this.domNode.appendChild(row);
    },

    postCreate: function () {
      this.inherited(arguments)

      //   this.setContent();
      //   var arrCall=lang.hitch(this,this. createArrow);
      //	arrCall();

      //    Global.map.events.on({moveend:lang.hitch(this,this.setPosition)});
    },
    setInfo: function () {
      this.content.id = 'grainfo_' + this.gra.attributes.STCD
      const r = this.radius,
        w = this.winWidth,
        h = this.winHeight,
        sw = this.sw,
        aw = this.aw,
        ax = this.ax,
        ay = this.ay
      // w=w+sw;
      // h=h+sw
      const a1 = sw + ',' + (r + sw),
        a2 = sw + ',' + sw,
        a3 = r + sw + ',' + sw,
        a4 = w - r + sw + ',' + sw,
        a5 = w + sw + ',' + sw,
        a6 = w + sw + ',' + (r + sw),
        a7 = w + sw + ',' + (h - r + sw),
        a8 = w + sw + ',' + (h + sw),
        a9 = w - r + sw + ',' + (h + sw),
        a10 = r + sw + ',' + (h + sw),
        a11 = sw + ',' + (h + sw),
        a12 = sw + ',' + (h - r + sw),
        b1 = sw + ',' + (aw + sw),
        b2 = sw + aw + ',' + sw,
        b3 = w - aw + sw + ',' + sw,
        b4 = w + sw + ',' + (sw + aw),
        b5 = w + sw + ',' + (h - aw + sw),
        b6 = w - aw + sw + ',' + (h + sw),
        b7 = aw + sw + ',' + (h + sw),
        b8 = sw + ',' + (h - aw + sw),
        c1 = sw - ax + ',' + (sw - ay),
        c2 = sw + w + ax + ',' + (sw - ay),
        c3 = sw + w + ax + ',' + (sw + h + ay),
        c4 = sw - ax + ',' + (h + ay + sw),
        e1 = sw + ',' + ((h - aw) / 2 + sw),
        e2 = (w - aw) / 2 + sw + ',' + sw,
        e3 = (w + aw) / 2 + sw + ',' + sw,
        e4 = sw + w + ',' + ((h - aw) / 2 + sw),
        e5 = sw + w + ',' + ((h + aw) / 2 + sw),
        e6 = (w + aw) / 2 + sw + ',' + (h + sw),
        e7 = (w - aw) / 2 + sw + ',' + (h + sw),
        e8 = sw + ',' + ((h + aw) / 2 + sw),
        d1 = sw - ax + ',' + (h / 2 + sw),
        d2 = w / 2 + sw + ',' + (sw - ax),
        d3 = w + sw + ax + ',' + (h / 2 + sw),
        d4 = w / 2 + sw + ',' + (h + sw + ay)
      $(this.domNode).css('width', w + sw)
      $(this.domNode).css('height', h + sw)
      //	aler(h+sw+100);
      $(this.domNode).css('padding', 0)
      $(this.domNode).css('margin', 0)
      $(this.domNode).css('background', 'none')
      $(this.domNode).css('border', 'none')
      $(this.domNode).css('box-shadow', 'rgba(41, 90, 72, 0) 0px 0px 0px')
      $(this.content).css({ width: w, height: h, top: sw, left: sw, overflow: 'clip', padding: 5 })

      this.txtX = sw + 15
      this.txtY = sw

      switch (this.direction) {
        case 'upperRight': {
          path =
            'M' +
            b8 +
            'L' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            b7 +
            'L' +
            c4 +
            'z'
          this.pointY = h + ay + sw
          this.pointX = sw - ax
          break
        }
        case 'upperLeft': {
          path =
            'M' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            b5 +
            'L' +
            c3 +
            'L' +
            b6 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = sw + h + ay
          this.pointX = sw + w + ax
          break
        }
        case 'lowerLeft': {
          path =
            'M' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            b3 +
            'L' +
            c2 +
            'L' +
            b4 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = sw - ay
          this.pointX = sw + w + ax
          break
        }
        case 'bottomright': {
          path =
            'M' +
            b1 +
            'L' +
            c1 +
            'L' +
            b2 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = sw - ay
          this.pointX = sw - ax
          break
        }
        case 'right': {
          path =
            'M' +
            e8 +
            'L' +
            d1 +
            'L' +
            e1 +
            'L' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = h / 2 + sw
          this.pointX = sw - ax
          break
        }
        case 'bottom': {
          path =
            'M' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            e2 +
            'L' +
            d2 +
            'L' +
            e3 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = sw - ax
          this.pointX = w / 2 + sw
          break
        }
        case 'left': {
          path =
            'M' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            e4 +
            'L' +
            d3 +
            'L' +
            e5 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = h / 2 + sw
          this.pointX = w + sw + ax
          break
        }
        case 'top': {
          path =
            'M' +
            a1 +
            'Q' +
            a2 +
            ' ' +
            a3 +
            'L' +
            a4 +
            'Q' +
            a5 +
            ' ' +
            a6 +
            'L' +
            a7 +
            'Q' +
            a8 +
            ' ' +
            a9 +
            'L' +
            e6 +
            'L' +
            d4 +
            'L' +
            e7 +
            'L' +
            a10 +
            'Q' +
            a11 +
            ' ' +
            a12 +
            'z'
          this.pointY = h + sw + ay
          this.pointX = w / 2 + sw
          break
        }
      }
      if (this.paper == null) {
        console.log(w + sw + 30, h + sw + 30, sw, aw, h, w)
        this.paper = new Raphael(this.background, w + sw + ax, h + sw + ay)
      } else {
        this.paper.clear()
      }

      const back = this.paper.path(path)
      back.attr('fill', this.backcolor)
      back.attr('stroke-width', 1)
      back.attr('stroke', this.strokecolor)
      //back.attr("opacity",1);
    },
    startup: function () {
      this.inherited(arguments)
    },
    /* 设置模版内容*/
    setContent: function (contentStr) {
      //        	console.log(contentStr);
      this.setInfo()
      this.content.innerHTML = contentStr
      $(this.content).attr('STCD', this.gra.attributes.STCD)
      $(this.content).attr('TYPE', this.gra.attributes.TYPE)
      $(this.content).attr('STNM', this.gra.attributes.STNM)
      $(this.content).on('click', this.gra.attributes.handler)
      $(this.content).hover(
        function () {
          $(this).parent().css({
            zIndex: ++window.inlayerIndex
          })
          $(this).css({
            strokecolor: '#005FCE'
          })
        },
        function () {
          $(this).css({
            strokecolor: '#005FCE'
          })
        }
      )
    },
    //设置窗口位置
    setPosition: function (x, y) {
      //  var layerPx=Global.infoLayer.getLayerPxFromLonLat(this.point);
      const layerPx = new GIS.Point(x, y)
      //      var layerPx=this.map.toScreen(this.point);
      domStyle.set(this.domNode, 'width', this.winWidth)
      domStyle.set(this.domNode, 'height', this.winHeight)
      //domStyle.set(this.domNode,"background-color","#ff0000");
      //  alert("字体大小:"+domStyle.get(this.content,"fontSize"));
      //alert("宽度:"+domGeometry.position(this.domNode,false).w);
      //     this.left=layerPx.x-domGeometry.position(this.domNode,false).w/2;
      //     this.top=layerPx.y-domGeometry.position(this.domNode,false).h-25;
      this.left = layerPx.x - this.pointX
      this.top = layerPx.y - this.pointY
      const offsetX = this.gra.attributes.offsetX || 0
      const offsetY = this.gra.attributes.offsetY || 0

      domStyle.set(this.domNode, 'left', this.left + offsetX + 'px')
      domStyle.set(this.domNode, 'top', this.top + offsetY + 'px')

      domStyle.set(this.domNode, 'display', 'block')
      domStyle.set(this.domNode, 'position', 'absolute')
      return
      domStyle.set(this.domNode, 'backgroundColor', this.backgroundColor)
      domStyle.set(this.arrowDiv, 'position', 'absolute')
      domStyle.set(this.arrowDiv, 'z-index', '100')
      domStyle.set(this.arrowDiv, 'top', $(this.domNode).outerHeight() - 3 + 'px')
      domStyle.set(
        this.arrowDiv,
        'left',
        $(this.domNode).outerWidth() / 2 - (this.arrWidth + this.arrLength) / 2 + 'px'
      )
    }
  })
})
