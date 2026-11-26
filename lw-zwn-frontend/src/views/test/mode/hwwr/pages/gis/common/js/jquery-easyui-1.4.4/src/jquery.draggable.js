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
 * draggable - jQuery EasyUI
 *
 */
;(function ($) {
  function drag(e) {
    const state = $.data(e.data.target, 'draggable')
    const opts = state.options
    const proxy = state.proxy

    const dragData = e.data
    let left = dragData.startLeft + e.pageX - dragData.startX
    let top = dragData.startTop + e.pageY - dragData.startY

    if (proxy) {
      if (proxy.parent()[0] == document.body) {
        if (opts.deltaX != null && opts.deltaX != undefined) {
          left = e.pageX + opts.deltaX
        } else {
          left = e.pageX - e.data.offsetWidth
        }
        if (opts.deltaY != null && opts.deltaY != undefined) {
          top = e.pageY + opts.deltaY
        } else {
          top = e.pageY - e.data.offsetHeight
        }
      } else {
        if (opts.deltaX != null && opts.deltaX != undefined) {
          left += e.data.offsetWidth + opts.deltaX
        }
        if (opts.deltaY != null && opts.deltaY != undefined) {
          top += e.data.offsetHeight + opts.deltaY
        }
      }
    }

    if (e.data.parent != document.body) {
      left += $(e.data.parent).scrollLeft()
      top += $(e.data.parent).scrollTop()
    }

    if (opts.axis == 'h') {
      dragData.left = left
    } else if (opts.axis == 'v') {
      dragData.top = top
    } else {
      dragData.left = left
      dragData.top = top
    }
  }

  function applyDrag(e) {
    const state = $.data(e.data.target, 'draggable')
    const opts = state.options
    let proxy = state.proxy
    if (!proxy) {
      proxy = $(e.data.target)
    }
    proxy.css({
      left: e.data.left,
      top: e.data.top
    })
    $('body').css('cursor', opts.cursor)
  }

  function doDown(e) {
    if (!$.fn.draggable.isDragging) {
      return false
    }

    const state = $.data(e.data.target, 'draggable')
    const opts = state.options

    const droppables = $('.droppable')
      .filter(function () {
        return e.data.target != this
      })
      .filter(function () {
        const accept = $.data(this, 'droppable').options.accept
        if (accept) {
          return (
            $(accept).filter(function () {
              return this == e.data.target
            }).length > 0
          )
        }
        return true
      })
    state.droppables = droppables

    let proxy = state.proxy
    if (!proxy) {
      if (opts.proxy) {
        if (opts.proxy == 'clone') {
          proxy = $(e.data.target).clone().insertAfter(e.data.target)
        } else {
          proxy = opts.proxy.call(e.data.target, e.data.target)
        }
        state.proxy = proxy
      } else {
        proxy = $(e.data.target)
      }
    }

    proxy.css('position', 'absolute')
    drag(e)
    applyDrag(e)

    opts.onStartDrag.call(e.data.target, e)
    return false
  }

  function doMove(e) {
    if (!$.fn.draggable.isDragging) {
      return false
    }

    const state = $.data(e.data.target, 'draggable')
    drag(e)
    if (state.options.onDrag.call(e.data.target, e) != false) {
      applyDrag(e)
    }

    const source = e.data.target
    state.droppables.each(function () {
      const dropObj = $(this)
      if (dropObj.droppable('options').disabled) {
        return
      }

      const p2 = dropObj.offset()
      if (
        e.pageX > p2.left &&
        e.pageX < p2.left + dropObj.outerWidth() &&
        e.pageY > p2.top &&
        e.pageY < p2.top + dropObj.outerHeight()
      ) {
        if (!this.entered) {
          $(this).trigger('_dragenter', [source])
          this.entered = true
        }
        $(this).trigger('_dragover', [source])
      } else if (this.entered) {
        $(this).trigger('_dragleave', [source])
        this.entered = false
      }
    })

    return false
  }

  function doUp(e) {
    if (!$.fn.draggable.isDragging) {
      clearDragging()
      return false
    }

    doMove(e)

    const state = $.data(e.data.target, 'draggable')
    const proxy = state.proxy
    const opts = state.options
    if (opts.revert) {
      if (checkDrop() == true) {
        $(e.data.target).css({
          position: e.data.startPosition,
          left: e.data.startLeft,
          top: e.data.startTop
        })
      } else if (proxy) {
        let left, top
        if (proxy.parent()[0] == document.body) {
          left = e.data.startX - e.data.offsetWidth
          top = e.data.startY - e.data.offsetHeight
        } else {
          left = e.data.startLeft
          top = e.data.startTop
        }
        proxy.animate(
          {
            left: left,
            top: top
          },
          function () {
            removeProxy()
          }
        )
      } else {
        $(e.data.target).animate(
          {
            left: e.data.startLeft,
            top: e.data.startTop
          },
          function () {
            $(e.data.target).css('position', e.data.startPosition)
          }
        )
      }
    } else {
      $(e.data.target).css({
        position: 'absolute',
        left: e.data.left,
        top: e.data.top
      })
      checkDrop()
    }

    opts.onStopDrag.call(e.data.target, e)

    clearDragging()

    function removeProxy() {
      if (proxy) {
        proxy.remove()
      }
      state.proxy = null
    }

    function checkDrop() {
      let dropped = false
      state.droppables.each(function () {
        const dropObj = $(this)
        if (dropObj.droppable('options').disabled) {
          return
        }

        const p2 = dropObj.offset()
        if (
          e.pageX > p2.left &&
          e.pageX < p2.left + dropObj.outerWidth() &&
          e.pageY > p2.top &&
          e.pageY < p2.top + dropObj.outerHeight()
        ) {
          if (opts.revert) {
            $(e.data.target).css({
              position: e.data.startPosition,
              left: e.data.startLeft,
              top: e.data.startTop
            })
          }
          $(this).trigger('_drop', [e.data.target])
          removeProxy()
          dropped = true
          this.entered = false
          return false
        }
      })
      if (!dropped && !opts.revert) {
        removeProxy()
      }
      return dropped
    }

    return false
  }

  function clearDragging() {
    if ($.fn.draggable.timer) {
      clearTimeout($.fn.draggable.timer)
      $.fn.draggable.timer = undefined
    }
    $(document).unbind('.draggable')
    $.fn.draggable.isDragging = false
    setTimeout(function () {
      $('body').css('cursor', '')
    }, 100)
  }

  $.fn.draggable = function (options, param) {
    if (typeof options === 'string') {
      return $.fn.draggable.methods[options](this, param)
    }

    return this.each(function () {
      let opts
      const state = $.data(this, 'draggable')
      if (state) {
        state.handle.unbind('.draggable')
        opts = $.extend(state.options, options)
      } else {
        opts = $.extend(
          {},
          $.fn.draggable.defaults,
          $.fn.draggable.parseOptions(this),
          options || {}
        )
      }
      const handle = opts.handle
        ? typeof opts.handle === 'string'
          ? $(opts.handle, this)
          : opts.handle
        : $(this)

      $.data(this, 'draggable', {
        options: opts,
        handle: handle
      })

      if (opts.disabled) {
        $(this).css('cursor', '')
        return
      }

      handle
        .unbind('.draggable')
        .bind('mousemove.draggable', { target: this }, function (e) {
          if ($.fn.draggable.isDragging) {
            return
          }
          const opts = $.data(e.data.target, 'draggable').options
          if (checkArea(e)) {
            $(this).css('cursor', opts.cursor)
          } else {
            $(this).css('cursor', '')
          }
        })
        .bind('mouseleave.draggable', { target: this }, function (e) {
          $(this).css('cursor', '')
        })
        .bind('mousedown.draggable', { target: this }, function (e) {
          if (checkArea(e) == false) {
            return
          }
          $(this).css('cursor', '')

          const position = $(e.data.target).position()
          const offset = $(e.data.target).offset()
          const data = {
            startPosition: $(e.data.target).css('position'),
            startLeft: position.left,
            startTop: position.top,
            left: position.left,
            top: position.top,
            startX: e.pageX,
            startY: e.pageY,
            offsetWidth: e.pageX - offset.left,
            offsetHeight: e.pageY - offset.top,
            target: e.data.target,
            parent: $(e.data.target).parent()[0]
          }

          $.extend(e.data, data)
          const opts = $.data(e.data.target, 'draggable').options
          if (opts.onBeforeDrag.call(e.data.target, e) == false) {
            return
          }

          $(document).bind('mousedown.draggable', e.data, doDown)
          $(document).bind('mousemove.draggable', e.data, doMove)
          $(document).bind('mouseup.draggable', e.data, doUp)

          $.fn.draggable.timer = setTimeout(function () {
            $.fn.draggable.isDragging = true
            doDown(e)
          }, opts.delay)
          return false
        })

      // check if the handle can be dragged
      function checkArea(e) {
        const state = $.data(e.data.target, 'draggable')
        const handle = state.handle
        const offset = $(handle).offset()
        const width = $(handle).outerWidth()
        const height = $(handle).outerHeight()
        const t = e.pageY - offset.top
        const r = offset.left + width - e.pageX
        const b = offset.top + height - e.pageY
        const l = e.pageX - offset.left

        return Math.min(t, r, b, l) > state.options.edge
      }
    })
  }

  $.fn.draggable.methods = {
    options: function (jq) {
      return $.data(jq[0], 'draggable').options
    },
    proxy: function (jq) {
      return $.data(jq[0], 'draggable').proxy
    },
    enable: function (jq) {
      return jq.each(function () {
        $(this).draggable({ disabled: false })
      })
    },
    disable: function (jq) {
      return jq.each(function () {
        $(this).draggable({ disabled: true })
      })
    }
  }

  $.fn.draggable.parseOptions = function (target) {
    const t = $(target)
    return $.extend(
      {},
      $.parser.parseOptions(target, [
        'cursor',
        'handle',
        'axis',
        { revert: 'boolean', deltaX: 'number', deltaY: 'number', edge: 'number', delay: 'number' }
      ]),
      {
        disabled: t.attr('disabled') ? true : undefined
      }
    )
  }

  $.fn.draggable.defaults = {
    proxy: null, // 'clone' or a function that will create the proxy object,
    // the function has the source parameter that indicate the source object dragged.
    revert: false,
    cursor: 'move',
    deltaX: null,
    deltaY: null,
    handle: null,
    disabled: false,
    edge: 0,
    axis: null, // v or h
    delay: 100,

    onBeforeDrag: function (e) {},
    onStartDrag: function (e) {},
    onDrag: function (e) {},
    onStopDrag: function (e) {}
  }

  $.fn.draggable.isDragging = false
})(jQuery)
