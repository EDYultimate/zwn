/**
 * jQuery EasyUI 1.4.4
 *
 * Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
/**
 * resizable - jQuery EasyUI
 *
 */
;(function ($) {
  //	var isResizing = false;
  $.fn.resizable = function (options, param) {
    if (typeof options === 'string') {
      return $.fn.resizable.methods[options](this, param)
    }

    function resize(e) {
      const resizeData = e.data
      const options = $.data(resizeData.target, 'resizable').options
      if (resizeData.dir.indexOf('e') != -1) {
        var width = resizeData.startWidth + e.pageX - resizeData.startX
        width = Math.min(Math.max(width, options.minWidth), options.maxWidth)
        resizeData.width = width
      }
      if (resizeData.dir.indexOf('s') != -1) {
        var height = resizeData.startHeight + e.pageY - resizeData.startY
        height = Math.min(Math.max(height, options.minHeight), options.maxHeight)
        resizeData.height = height
      }
      if (resizeData.dir.indexOf('w') != -1) {
        var width = resizeData.startWidth - e.pageX + resizeData.startX
        width = Math.min(Math.max(width, options.minWidth), options.maxWidth)
        resizeData.width = width
        resizeData.left = resizeData.startLeft + resizeData.startWidth - resizeData.width

        //				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
        //				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
        //					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
        //				}
      }
      if (resizeData.dir.indexOf('n') != -1) {
        var height = resizeData.startHeight - e.pageY + resizeData.startY
        height = Math.min(Math.max(height, options.minHeight), options.maxHeight)
        resizeData.height = height
        resizeData.top = resizeData.startTop + resizeData.startHeight - resizeData.height

        //				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
        //				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
        //					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
        //				}
      }
    }

    function applySize(e) {
      const resizeData = e.data
      const t = $(resizeData.target)
      t.css({
        left: resizeData.left,
        top: resizeData.top
      })
      if (t.outerWidth() != resizeData.width) {
        t._outerWidth(resizeData.width)
      }
      if (t.outerHeight() != resizeData.height) {
        t._outerHeight(resizeData.height)
      }
      //			t._outerWidth(resizeData.width)._outerHeight(resizeData.height);
    }

    function doDown(e) {
      //			isResizing = true;
      $.fn.resizable.isResizing = true
      $.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e)
      return false
    }

    function doMove(e) {
      resize(e)
      if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false) {
        applySize(e)
      }
      return false
    }

    function doUp(e) {
      //			isResizing = false;
      $.fn.resizable.isResizing = false
      resize(e, true)
      applySize(e)
      $.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e)
      $(document).unbind('.resizable')
      $('body').css('cursor', '')
      //			$('body').css('cursor','auto');
      return false
    }

    return this.each(function () {
      let opts = null
      const state = $.data(this, 'resizable')
      if (state) {
        $(this).unbind('.resizable')
        opts = $.extend(state.options, options || {})
      } else {
        opts = $.extend(
          {},
          $.fn.resizable.defaults,
          $.fn.resizable.parseOptions(this),
          options || {}
        )
        $.data(this, 'resizable', {
          options: opts
        })
      }

      if (opts.disabled == true) {
        return
      }

      // bind mouse event using namespace resizable
      $(this)
        .bind('mousemove.resizable', { target: this }, function (e) {
          //				if (isResizing) return;
          if ($.fn.resizable.isResizing) {
            return
          }
          const dir = getDirection(e)
          if (dir == '') {
            $(e.data.target).css('cursor', '')
          } else {
            $(e.data.target).css('cursor', dir + '-resize')
          }
        })
        .bind('mouseleave.resizable', { target: this }, function (e) {
          $(e.data.target).css('cursor', '')
        })
        .bind('mousedown.resizable', { target: this }, function (e) {
          const dir = getDirection(e)
          if (dir == '') {
            return
          }

          function getCssValue(css) {
            const val = parseInt($(e.data.target).css(css))
            if (isNaN(val)) {
              return 0
            }
            return val
          }

          const data = {
            target: e.data.target,
            dir: dir,
            startLeft: getCssValue('left'),
            startTop: getCssValue('top'),
            left: getCssValue('left'),
            top: getCssValue('top'),
            startX: e.pageX,
            startY: e.pageY,
            startWidth: $(e.data.target).outerWidth(),
            startHeight: $(e.data.target).outerHeight(),
            width: $(e.data.target).outerWidth(),
            height: $(e.data.target).outerHeight(),
            deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
            deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
          }
          $(document).bind('mousedown.resizable', data, doDown)
          $(document).bind('mousemove.resizable', data, doMove)
          $(document).bind('mouseup.resizable', data, doUp)
          $('body').css('cursor', dir + '-resize')
        })

      // get the resize direction
      function getDirection(e) {
        const tt = $(e.data.target)
        let dir = ''
        const offset = tt.offset()
        const width = tt.outerWidth()
        const height = tt.outerHeight()
        const edge = opts.edge
        if (e.pageY > offset.top && e.pageY < offset.top + edge) {
          dir += 'n'
        } else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
          dir += 's'
        }
        if (e.pageX > offset.left && e.pageX < offset.left + edge) {
          dir += 'w'
        } else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
          dir += 'e'
        }

        const handles = opts.handles.split(',')
        for (let i = 0; i < handles.length; i++) {
          const handle = handles[i].replace(/(^\s*)|(\s*$)/g, '')
          if (handle == 'all' || handle == dir) {
            return dir
          }
        }
        return ''
      }
    })
  }

  $.fn.resizable.methods = {
    options: function (jq) {
      return $.data(jq[0], 'resizable').options
    },
    enable: function (jq) {
      return jq.each(function () {
        $(this).resizable({ disabled: false })
      })
    },
    disable: function (jq) {
      return jq.each(function () {
        $(this).resizable({ disabled: true })
      })
    }
  }

  $.fn.resizable.parseOptions = function (target) {
    const t = $(target)
    return $.extend(
      {},
      $.parser.parseOptions(target, [
        'handles',
        {
          minWidth: 'number',
          minHeight: 'number',
          maxWidth: 'number',
          maxHeight: 'number',
          edge: 'number'
        }
      ]),
      {
        disabled: t.attr('disabled') ? true : undefined
      }
    )
  }

  $.fn.resizable.defaults = {
    disabled: false,
    handles: 'n, e, s, w, ne, se, sw, nw, all',
    minWidth: 10,
    minHeight: 10,
    maxWidth: 10000, //$(document).width(),
    maxHeight: 10000, //$(document).height(),
    edge: 5,
    onStartResize: function (e) {},
    onResize: function (e) {},
    onStopResize: function (e) {}
  }

  $.fn.resizable.isResizing = false
})(jQuery)
