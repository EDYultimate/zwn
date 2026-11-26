;(function ($) {
  $.fn.TimeSlider = function (option) {
    const defaults = {
      width: 270,
      height: 6,
      contentW: 200,
      background: '#ddd none repeat scroll 0 0',
      nodes: [{}, {}, {}],
      callback: function (index, obj) {},
      clickHandler: function (index, obj) {},
      delay: 1000,
      left: 10,
      bottom: 20,
      overflow: 'visible'
    }
    const settings = $.extend({}, defaults, option)

    this.css({
      width: settings.width,
      height: 32,
      borderRadius: 5,
      position: 'absolute',
      bottom: settings.bottom
    })
    //制空所有要素
    this.empty()
    let isRun = true //正在运行
    let curNode = null
    const nodeArr = []
    const backgroundDiv = $('<div></div>').css({
      width: settings.width,
      height: 32,
      backgroundColor: '#000',
      opacity: 0.7,
      position: 'absolute',
      left: 0,
      top: 7,
      borderRadius: 5,
      overflow: 'visible'
    })
    this.append(backgroundDiv)
    const container = $('<div></div>').css({
      width: settings.contentW,
      height: settings.height,
      background: settings.background,
      position: 'relative',
      marginLeft: 20,
      marginTop: 20,
      overflow: 'visible'
    })
    this.append(container)
    const timedisplay = $('<div>0:00</div>').css({
      bottom: 13,
      left: -10,
      color: '#777',
      position: 'absolute',
      bottom: 13,
      display: 'none'
    })
    container.append(timedisplay)
    const innertimeline = $('<div></div>').css({
      background: '#cf3300 none repeat scroll 0 0',
      height: settings.height,
      width: 0,
      bottom: 0,
      position: 'absolute',
      overflow: 'visible'
    })
    container.append(innertimeline)

    const timer = new GIS.Timer(aniHandler, settings.delay, true, settings.nodes)

    //添加暂停按钮
    const startBtn = $('<div ></div>').css({
      background:
        'rgba(0, 0, 0, 0) url("./img/gnome_media_playback_pause.png") no-repeat scroll center center',
      height: 30,
      width: 30,
      position: 'absolute',
      right: -37,
      top: -12,
      cursor: 'pointer'
    })

    //添加点击事件
    startBtn.on('click', function (evt) {
      if (isRun) {
        pause()
      } else {
        start()
      }
      isRun = !isRun
    })
    function pause() {
      timer.pause()
      startBtn.css({
        background:
          'rgba(0, 0, 0, 0) url("./img/gnome_media_playback_start.png") no-repeat scroll center center'
      })
    }
    function start() {
      timer.reStart()
      startBtn.css({
        background:
          'rgba(0, 0, 0, 0) url("./img/gnome_media_playback_pause.png") no-repeat scroll center center'
      })
    }
    container.append(startBtn)
    const num = settings.nodes.length
    let len = settings.contentW / (num - 1)
    if (num == 1) {
      len = settings.contentW
    }

    for (let i = 0; i < num; i++) {
      let node1 = null
      if (i == 0) {
        node1 = $('<div class="node node2" style="left: 347px; top: -9px;">').css({
          background:
            'rgba(0, 0, 0, 0) url("./img/node_active.png") no-repeat scroll center center',
          height: 26,
          width: 26,
          left: -13 + len * i,
          top: -10,
          position: 'absolute',
          cursor: 'pointer',
          overflow: 'visible'
        })

        curNode = node1
      } else {
        node1 = $('<div class="node node2" style="left: 347px; top: -9px;">').css({
          background: 'rgba(0, 0, 0, 0) url("./img/node.png") no-repeat scroll center center',
          height: 26,
          width: 26,
          left: -13 + len * i,
          top: -10,
          position: 'absolute',
          cursor: 'pointer',
          overflow: 'visible'
        })
      }
      node1.attr('idx', i)
      container.append(node1)
      nodeArr.push(node1)
      const tooltip1 = $('<div>Slide two</div>').css({
        position: 'absolute',
        bottom: 25,
        left: -13,
        background: '#fff none repeat scroll 0 0',
        borderRadius: 6,
        height: 20,
        opacity: 0.8,
        padding: '0px 8px 2px 8px',
        whiteSpace: 'nowrap',
        overflow: 'visible'
      })
      tooltip1.html(settings.nodes[i].label).addClass('toolTip')
      node1.append(tooltip1)
      node1.addClass('node')
      //添加点击事件
      node1.on('click', function (event) {
        if (curNode) {
          curNode.css({
            background: 'rgba(0, 0, 0, 0) url("./img/node.png") no-repeat scroll center center'
          })
        }
        if ($(event.target).hasClass('toolTip')) {
          curNode = $(event.target).parent()
        } else {
          curNode = $(event.target)
        }

        //	console.log(curNode);
        curNode.css({
          background: 'rgba(0, 0, 0, 0) url("./img/node_active.png") no-repeat scroll center center'
        })
        innertimeline.css({ width: len * curNode.attr('idx') })
        timer.pause(curNode.attr('idx'))
        isRun = false
        startBtn.css({
          background:
            'rgba(0, 0, 0, 0) url("./img/gnome_media_playback_start.png") no-repeat scroll center center'
        })
        settings.clickHandler(curNode.attr('idx'))
      })
    }

    timer.start()
    function aniHandler(index, obj) {
      curNode.css({
        background: 'rgba(0, 0, 0, 0) url("./img/node.png") no-repeat scroll center center'
      })
      curNode = nodeArr[index]
      curNode.css({
        background: 'rgba(0, 0, 0, 0) url("./img/node_active.png") no-repeat scroll center center'
      })
      innertimeline.css({ width: index * len })
      settings.callback(index, obj)
    }
    return { timer: timer, start: start, pause: pause }
  }
})(jQuery)
