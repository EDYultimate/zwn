/*要素样式辅助类*/
/*symInterval  时间间隔*/
define([
  'dojo/_base/declare',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/Color'
], function (declare, SimpleFillSymbol, SimpleLineSymbol, Color) {
  return declare(
    /*不继承任何类*/
    null,
    {
      /*初始化*/
      /*执行次数*/
      runNum: true,
      runId: 0,
      color: null,
      timer: null,
      constructor: function (map) {
        this.map = map
        window.symInterval = this.symInterval
        window.symrunNum = 0
      },
      symInterval: function () {
        window.symrunNum++
        if (window.symrunNum <= window.symNum) {
          const sym = window.symGra.symbol
          sym.color.a = window.symrunNum % 2 == 0 ? 1 : 0.5
          window.symGra.setSymbol(sym)
        } else {
          //停止
          alert('ddd111')
          window.symrunNum = 0
          clearInterval(window.runId)
          window.runId = 0
          //恢复样式
          window.gra.setSymbol(window.sym)
          map.graphics.clear()
          console.log(map)
          alert('ddd112')
        }

        //	this.color.a=!this.color.a;
      },
      /**/
      blink: function (gra, inter, num, isClear) {
        window.isClear = isClear
        //恢复样式
        if (window.gra && window.sym) {
          window.gra.setSymbol(window.sym)
        }

        window.symGra = gra
        window.symNum = num
        window.sym = gra.symbol
        if (window.runId != 0) {
          clearInterval(window.runId)
          window.runId = 0
        }
        window.runId = setInterval('symInterval()', inter) //1000为1秒钟
        const sym = gra.symbol
        switch (sym.type) {
          case 'simplefillsymbol':
            console.log(sym)
            break
        }
      }
    }
  )
})
