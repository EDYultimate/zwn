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
 * accordion - jQuery EasyUI
 *
 * Dependencies:
 * 	 panel
 *
 */
;(function ($) {
  function setSize(container, param) {
    const state = $.data(container, 'accordion')
    const opts = state.options
    const panels = state.panels
    const cc = $(container)

    if (param) {
      $.extend(opts, {
        width: param.width,
        height: param.height
      })
    }
    cc._size(opts)
    let headerHeight = 0
    let bodyHeight = 'auto'
    const headers = cc.find('>.panel>.accordion-header')
    if (headers.length) {
      headerHeight = $(headers[0]).css('height', '')._outerHeight()
    }
    if (!isNaN(parseInt(opts.height))) {
      bodyHeight = cc.height() - headerHeight * headers.length
    }

    _resize(true, bodyHeight - _resize(false) + 1)

    function _resize(collapsible, height) {
      let totalHeight = 0
      for (let i = 0; i < panels.length; i++) {
        const p = panels[i]
        const h = p.panel('header')._outerHeight(headerHeight)
        if (p.panel('options').collapsible == collapsible) {
          const pheight = isNaN(height) ? undefined : height + headerHeight * h.length
          p.panel('resize', {
            width: cc.width(),
            height: collapsible ? pheight : undefined
          })
          totalHeight += p.panel('panel').outerHeight() - headerHeight * h.length
        }
      }
      return totalHeight
    }
  }

  /**
   * find a panel by specified property, return the panel object or panel index.
   */
  function findBy(container, property, value, all) {
    const panels = $.data(container, 'accordion').panels
    const pp = []
    for (let i = 0; i < panels.length; i++) {
      const p = panels[i]
      if (property) {
        if (p.panel('options')[property] == value) {
          pp.push(p)
        }
      } else if (p[0] == $(value)[0]) {
        return i
      }
    }
    if (property) {
      return all ? pp : pp.length ? pp[0] : null
    }
    return -1
  }

  function getSelections(container) {
    return findBy(container, 'collapsed', false, true)
  }

  function getSelected(container) {
    const pp = getSelections(container)
    return pp.length ? pp[0] : null
  }

  /**
   * get panel index, start with 0
   */
  function getPanelIndex(container, panel) {
    return findBy(container, null, panel)
  }

  /**
   * get the specified panel.
   */
  function getPanel(container, which) {
    const panels = $.data(container, 'accordion').panels
    if (typeof which === 'number') {
      if (which < 0 || which >= panels.length) {
        return null
      }
      return panels[which]
    }
    return findBy(container, 'title', which)
  }

  function setProperties(container) {
    const opts = $.data(container, 'accordion').options
    const cc = $(container)
    if (opts.border) {
      cc.removeClass('accordion-noborder')
    } else {
      cc.addClass('accordion-noborder')
    }
  }

  function init(container) {
    const state = $.data(container, 'accordion')
    const cc = $(container)
    cc.addClass('accordion')

    state.panels = []
    cc.children('div').each(function () {
      const opts = $.extend({}, $.parser.parseOptions(this), {
        selected: $(this).attr('selected') ? true : undefined
      })
      const pp = $(this)
      state.panels.push(pp)
      createPanel(container, pp, opts)
    })

    cc.bind('_resize', function (e, force) {
      if ($(this).hasClass('easyui-fluid') || force) {
        setSize(container)
      }
      return false
    })
  }

  function createPanel(container, pp, options) {
    const opts = $.data(container, 'accordion').options
    pp.panel(
      $.extend(
        {},
        {
          collapsible: true,
          minimizable: false,
          maximizable: false,
          closable: false,
          doSize: false,
          collapsed: true,
          headerCls: 'accordion-header',
          bodyCls: 'accordion-body'
        },
        options,
        {
          onBeforeExpand: function () {
            if (options.onBeforeExpand) {
              if (options.onBeforeExpand.call(this) == false) {
                return false
              }
            }
            if (!opts.multiple) {
              // get all selected panel
              const all = $.grep(getSelections(container), function (p) {
                return p.panel('options').collapsible
              })
              for (let i = 0; i < all.length; i++) {
                unselect(container, getPanelIndex(container, all[i]))
              }
            }
            const header = $(this).panel('header')
            header.addClass('accordion-header-selected')
            header.find('.accordion-collapse').removeClass('accordion-expand')
          },
          onExpand: function () {
            if (options.onExpand) {
              options.onExpand.call(this)
            }
            opts.onSelect.call(
              container,
              $(this).panel('options').title,
              getPanelIndex(container, this)
            )
          },
          onBeforeCollapse: function () {
            if (options.onBeforeCollapse) {
              if (options.onBeforeCollapse.call(this) == false) {
                return false
              }
            }
            const header = $(this).panel('header')
            header.removeClass('accordion-header-selected')
            header.find('.accordion-collapse').addClass('accordion-expand')
          },
          onCollapse: function () {
            if (options.onCollapse) {
              options.onCollapse.call(this)
            }
            opts.onUnselect.call(
              container,
              $(this).panel('options').title,
              getPanelIndex(container, this)
            )
          }
        }
      )
    )

    const header = pp.panel('header')
    const tool = header.children('div.panel-tool')
    tool.children('a.panel-tool-collapse').hide() // hide the old collapse button
    const t = $('<a href="javascript:void(0)"></a>')
      .addClass('accordion-collapse accordion-expand')
      .appendTo(tool)
    t.bind('click', function () {
      togglePanel(pp)
      return false
    })
    pp.panel('options').collapsible ? t.show() : t.hide()

    header.click(function () {
      togglePanel(pp)
      return false
    })

    function togglePanel(p) {
      const popts = p.panel('options')
      if (popts.collapsible) {
        const index = getPanelIndex(container, p)
        if (popts.collapsed) {
          select(container, index)
        } else {
          unselect(container, index)
        }
      }
    }
  }

  /**
   * select and set the specified panel active
   */
  function select(container, which) {
    const p = getPanel(container, which)
    if (!p) {
      return
    }
    stopAnimate(container)
    const opts = $.data(container, 'accordion').options
    p.panel('expand', opts.animate)
  }

  function unselect(container, which) {
    const p = getPanel(container, which)
    if (!p) {
      return
    }
    stopAnimate(container)
    const opts = $.data(container, 'accordion').options
    p.panel('collapse', opts.animate)
  }

  function doFirstSelect(container) {
    const opts = $.data(container, 'accordion').options
    const p = findBy(container, 'selected', true)
    if (p) {
      _select(getPanelIndex(container, p))
    } else {
      _select(opts.selected)
    }

    function _select(index) {
      const animate = opts.animate
      opts.animate = false
      select(container, index)
      opts.animate = animate
    }
  }

  /**
   * stop the animation of all panels
   */
  function stopAnimate(container) {
    const panels = $.data(container, 'accordion').panels
    for (let i = 0; i < panels.length; i++) {
      panels[i].stop(true, true)
    }
  }

  function add(container, options) {
    const state = $.data(container, 'accordion')
    const opts = state.options
    const panels = state.panels
    if (options.selected == undefined) {
      options.selected = true
    }

    stopAnimate(container)

    const pp = $('<div></div>').appendTo(container)
    panels.push(pp)
    createPanel(container, pp, options)
    setSize(container)

    opts.onAdd.call(container, options.title, panels.length - 1)

    if (options.selected) {
      select(container, panels.length - 1)
    }
  }

  function remove(container, which) {
    const state = $.data(container, 'accordion')
    const opts = state.options
    const panels = state.panels

    stopAnimate(container)

    const panel = getPanel(container, which)
    const title = panel.panel('options').title
    const index = getPanelIndex(container, panel)

    if (!panel) {
      return
    }
    if (opts.onBeforeRemove.call(container, title, index) == false) {
      return
    }

    panels.splice(index, 1)
    panel.panel('destroy')
    if (panels.length) {
      setSize(container)
      const curr = getSelected(container)
      if (!curr) {
        select(container, 0)
      }
    }

    opts.onRemove.call(container, title, index)
  }

  $.fn.accordion = function (options, param) {
    if (typeof options === 'string') {
      return $.fn.accordion.methods[options](this, param)
    }

    options = options || {}
    return this.each(function () {
      const state = $.data(this, 'accordion')
      if (state) {
        $.extend(state.options, options)
      } else {
        $.data(this, 'accordion', {
          options: $.extend(
            {},
            $.fn.accordion.defaults,
            $.fn.accordion.parseOptions(this),
            options
          ),
          accordion: $(this).addClass('accordion'),
          panels: []
        })
        init(this)
      }

      setProperties(this)
      setSize(this)
      doFirstSelect(this)
    })
  }

  $.fn.accordion.methods = {
    options: function (jq) {
      return $.data(jq[0], 'accordion').options
    },
    panels: function (jq) {
      return $.data(jq[0], 'accordion').panels
    },
    resize: function (jq, param) {
      return jq.each(function () {
        setSize(this, param)
      })
    },
    getSelections: function (jq) {
      return getSelections(jq[0])
    },
    getSelected: function (jq) {
      return getSelected(jq[0])
    },
    getPanel: function (jq, which) {
      return getPanel(jq[0], which)
    },
    getPanelIndex: function (jq, panel) {
      return getPanelIndex(jq[0], panel)
    },
    select: function (jq, which) {
      return jq.each(function () {
        select(this, which)
      })
    },
    unselect: function (jq, which) {
      return jq.each(function () {
        unselect(this, which)
      })
    },
    add: function (jq, options) {
      return jq.each(function () {
        add(this, options)
      })
    },
    remove: function (jq, which) {
      return jq.each(function () {
        remove(this, which)
      })
    }
  }

  $.fn.accordion.parseOptions = function (target) {
    const t = $(target)
    return $.extend(
      {},
      $.parser.parseOptions(target, [
        'width',
        'height',
        {
          fit: 'boolean',
          border: 'boolean',
          animate: 'boolean',
          multiple: 'boolean',
          selected: 'number'
        }
      ])
    )
  }

  $.fn.accordion.defaults = {
    width: 'auto',
    height: 'auto',
    fit: false,
    border: true,
    animate: true,
    multiple: false,
    selected: 0,

    onSelect: function (title, index) {},
    onUnselect: function (title, index) {},
    onAdd: function (title, index) {},
    onBeforeRemove: function (title, index) {},
    onRemove: function (title, index) {}
  }
})(jQuery)
