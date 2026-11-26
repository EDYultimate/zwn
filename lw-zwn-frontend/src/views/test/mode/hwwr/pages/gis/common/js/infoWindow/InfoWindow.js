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
  alert('fff')
  return declare([_WidgetBase, _TemplatedMixin], {
    direction: 'lt', //方向八个方向
    ah: 5, //垂直方向高度
    aw: 5, //水平方向宽度
    ax: 10, //水平方向偏移
    ay: 10, //垂直方向偏移
    winWidth: 50, //div宽度
    winHeight: 50, //div高度
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
    backgroundBorderColor: '#a6aab3',
    backgroundBorderWidth: '1',
    paper: null,
    txtX: 0,
    txtY: 0,
    constructor: function (
      x,
      y,
      data,
      gra,
      direction,
      backcolor,
      winWidth,
      winHeight,
      aw,
      ax,
      ay,
      radius,
      sw,
      strokecolor
    ) {
      alert('ddd')
      this.gra = gra
      this.point = new SuperMap.LonLat(x, y)
      this.data = data
      this.winWidth = winWidth || 140
      this.winHeight = winHeight || 45
      this.aw = aw || 10
      this.ax = ax || 17
      this.ay = ay || 13
      this.sw = sw || 20
      this.direction = direction || 'rt'
      this.radius = radius || 5
      this.pointX = 0
      this.pointY = 0
      this.backcolor = backcolor || '#26AA5B'
      this.strokecolor = strokecolor || this.backcolor
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

      Global.map.events.on({ moveend: lang.hitch(this, this.setPosition) })
    },
    setInfo: function () {
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
      $(this.content).css({ width: w, height: h, top: sw, left: sw, overflow: 'clip', padding: 5 })

      this.txtX = sw + 15
      this.txtY = sw

      switch (this.direction) {
        case 'rt': {
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
        case 'lt': {
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
        case 'lb': {
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
        case 'rb': {
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
        case 'r': {
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
        case 'b': {
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
        case 'l': {
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
        case 't': {
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
        this.paper = new Raphael(this.background, w + sw + 30, h + sw + 30)
      } else {
        this.paper.clear()
      }

      const back = this.paper.path(path)
      back.attr('fill', this.backcolor)
      back.attr('stroke-width', 2)
      back.attr('stroke', this.strokecolor)
      back.attr('opacity', 0.8)
    },
    startup: function () {
      this.inherited(arguments)
    },
    setContent: function (contentStr) {
      //        	console.log(contentStr);
      this.setInfo()
      this.content.innerHTML = contentStr
    },
    //设置窗口位置
    setPosition: function () {
      const layerPx = Global.infoLayer.getLayerPxFromLonLat(this.point)
      domStyle.set(this.domNode, 'width', this.winWidth)
      domStyle.set(this.domNode, 'height', this.winHeight)
      //domStyle.set(this.domNode,"background-color","#ff0000");
      //  alert("字体大小:"+domStyle.get(this.content,"fontSize"));
      //alert("宽度:"+domGeometry.position(this.domNode,false).w);
      //     this.left=layerPx.x-domGeometry.position(this.domNode,false).w/2;
      //     this.top=layerPx.y-domGeometry.position(this.domNode,false).h-25;
      this.left = layerPx.x - this.pointX
      this.top = layerPx.y - this.pointY

      domStyle.set(this.domNode, 'left', this.left + 'px')
      domStyle.set(this.domNode, 'top', this.top + 'px')

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
