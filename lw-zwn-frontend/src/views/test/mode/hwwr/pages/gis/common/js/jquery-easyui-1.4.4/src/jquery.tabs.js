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
 * tabs - jQuery EasyUI
 *
 * Dependencies:
 * 	 panel
 *   linkbutton
 *
 */
;(function ($) {
  function getContentWidth(c) {
    let w = 0
    $(c)
      .children()
      .each(function () {
        w += $(this).outerWidth(true)
      })
    return w
  }
  /**
   * set the tabs scrollers to show or not,
   * dependent on the tabs count and width
   */
  function setScrollers(container) {
    const opts = $.data(container, 'tabs').options
    if (opts.tabPosition == 'left' || opts.tabPosition == 'right' || !opts.showHeader) {
      return
    }

    const header = $(container).children('div.tabs-header')
    const tool = header.children('div.tabs-tool:not(.tabs-tool-hidden)')
    const sLeft = header.children('div.tabs-scroller-left')
    const sRight = header.children('div.tabs-scroller-right')
    const wrap = header.children('div.tabs-wrap')

    // set the tool height
    let tHeight = header.outerHeight()
    if (opts.plain) {
      tHeight -= tHeight - header.height()
    }
    tool._outerHeight(tHeight)

    const tabsWidth = getContentWidth(header.find('ul.tabs'))
    const cWidth = header.width() - tool._outerWidth()

    if (tabsWidth > cWidth) {
      sLeft.add(sRight).show()._outerHeight(tHeight)
      if (opts.toolPosition == 'left') {
        tool.css({
          left: sLeft.outerWidth(),
          right: ''
        })
        wrap.css({
          marginLeft: sLeft.outerWidth() + tool._outerWidth(),
          marginRight: sRight._outerWidth(),
          width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
        })
      } else {
        tool.css({
          left: '',
          right: sRight.outerWidth()
        })
        wrap.css({
          marginLeft: sLeft.outerWidth(),
          marginRight: sRight.outerWidth() + tool._outerWidth(),
          width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
        })
      }
    } else {
      sLeft.add(sRight).hide()
      if (opts.toolPosition == 'left') {
        tool.css({
          left: 0,
          right: ''
        })
        wrap.css({
          marginLeft: tool._outerWidth(),
          marginRight: 0,
          width: cWidth
        })
      } else {
        tool.css({
          left: '',
          right: 0
        })
        wrap.css({
          marginLeft: 0,
          marginRight: tool._outerWidth(),
          width: cWidth
        })
      }
    }
  }

  function addTools(container) {
    const opts = $.data(container, 'tabs').options
    const header = $(container).children('div.tabs-header')
    if (opts.tools) {
      if (typeof opts.tools === 'string') {
        $(opts.tools).addClass('tabs-tool').appendTo(header)
        $(opts.tools).show()
      } else {
        header.children('div.tabs-tool').remove()
        const tools = $(
          '<div class="tabs-tool"><table cellspacing="0" cellpadding="0" style="height:100%"><tr></tr></table></div>'
        ).appendTo(header)
        const tr = tools.find('tr')
        for (let i = 0; i < opts.tools.length; i++) {
          const td = $('<td></td>').appendTo(tr)
          const tool = $('<a href="javascript:void(0);"></a>').appendTo(td)
          tool[0].onclick = eval(opts.tools[i].handler || function () {})
          tool.linkbutton(
            $.extend({}, opts.tools[i], {
              plain: true
            })
          )
        }
      }
    } else {
      header.children('div.tabs-tool').remove()
    }
  }

  function setSize(container, param) {
    const state = $.data(container, 'tabs')
    const opts = state.options
    const cc = $(container)

    if (!opts.doSize) {
      return
    }
    if (param) {
      $.extend(opts, {
        width: param.width,
        height: param.height
      })
    }
    cc._size(opts)

    const header = cc.children('div.tabs-header')
    const panels = cc.children('div.tabs-panels')
    const wrap = header.find('div.tabs-wrap')
    const ul = wrap.find('.tabs')
    ul.children('li').removeClass('tabs-first tabs-last')
    ul.children('li:first').addClass('tabs-first')
    ul.children('li:last').addClass('tabs-last')

    if (opts.tabPosition == 'left' || opts.tabPosition == 'right') {
      header._outerWidth(opts.showHeader ? opts.headerWidth : 0)
      panels._outerWidth(cc.width() - header.outerWidth())
      header.add(panels)._size('height', isNaN(parseInt(opts.height)) ? '' : cc.height())
      wrap._outerWidth(header.width())
      ul._outerWidth(wrap.width()).css('height', '')
    } else {
      header
        .children(
          'div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool:not(.tabs-tool-hidden)'
        )
        .css('display', opts.showHeader ? 'block' : 'none')
      header._outerWidth(cc.width()).css('height', '')
      if (opts.showHeader) {
        header.css('background-color', '')
        wrap.css('height', '')
      } else {
        header.css('background-color', 'transparent')
        header._outerHeight(0)
        wrap._outerHeight(0)
      }
      ul._outerHeight(opts.tabHeight).css('width', '')
      ul._outerHeight(ul.outerHeight() - ul.height() - 1 + opts.tabHeight).css('width', '')

      panels._size('height', isNaN(parseInt(opts.height)) ? '' : cc.height() - header.outerHeight())
      panels._size('width', cc.width())
    }

    if (state.tabs.length) {
      const d1 = ul.outerWidth(true) - ul.width()
      const li = ul.children('li:first')
      const d2 = li.outerWidth(true) - li.width()
      const hwidth =
        header.width() - header.children('.tabs-tool:not(.tabs-tool-hidden)')._outerWidth()
      const justifiedWidth = Math.floor((hwidth - d1 - d2 * state.tabs.length) / state.tabs.length)

      $.map(state.tabs, function (p) {
        setTabSize(
          p,
          opts.justified && $.inArray(opts.tabPosition, ['top', 'bottom']) >= 0
            ? justifiedWidth
            : undefined
        )
      })
      if (opts.justified && $.inArray(opts.tabPosition, ['top', 'bottom']) >= 0) {
        const deltaWidth = hwidth - d1 - getContentWidth(ul)
        setTabSize(state.tabs[state.tabs.length - 1], justifiedWidth + deltaWidth)
      }
    }
    setScrollers(container)

    function setTabSize(p, width) {
      const p_opts = p.panel('options')
      const p_t = p_opts.tab.find('a.tabs-inner')
      var width = width ? width : parseInt(p_opts.tabWidth || opts.tabWidth || undefined)
      if (width) {
        p_t._outerWidth(width)
      } else {
        p_t.css('width', '')
      }
      p_t._outerHeight(opts.tabHeight)
      p_t.css('lineHeight', p_t.height() + 'px')
      p_t.find('.easyui-fluid:visible').triggerHandler('_resize')
    }
  }

  /**
   * set selected tab panel size
   */
  function setSelectedSize(container) {
    const opts = $.data(container, 'tabs').options
    const tab = getSelectedTab(container)
    if (tab) {
      const panels = $(container).children('div.tabs-panels')
      const width = opts.width == 'auto' ? 'auto' : panels.width()
      const height = opts.height == 'auto' ? 'auto' : panels.height()
      tab.panel('resize', {
        width: width,
        height: height
      })
    }
  }

  /**
   * wrap the tabs header and body
   */
  function wrapTabs(container) {
    const tabs = $.data(container, 'tabs').tabs
    const cc = $(container).addClass('tabs-container')
    const panels = $('<div class="tabs-panels"></div>').insertBefore(cc)
    cc.children('div').each(function () {
      panels[0].appendChild(this)
    })
    cc[0].appendChild(panels[0])
    $(
      '<div class="tabs-header">' +
        '<div class="tabs-scroller-left"></div>' +
        '<div class="tabs-scroller-right"></div>' +
        '<div class="tabs-wrap">' +
        '<ul class="tabs"></ul>' +
        '</div>' +
        '</div>'
    ).prependTo(container)

    cc.children('div.tabs-panels')
      .children('div')
      .each(function (i) {
        const opts = $.extend({}, $.parser.parseOptions(this), {
          disabled: $(this).attr('disabled') ? true : undefined,
          selected: $(this).attr('selected') ? true : undefined
        })
        createTab(container, opts, $(this))
      })

    cc.children('div.tabs-header')
      .find('.tabs-scroller-left, .tabs-scroller-right')
      .hover(
        function () {
          $(this).addClass('tabs-scroller-over')
        },
        function () {
          $(this).removeClass('tabs-scroller-over')
        }
      )
    cc.bind('_resize', function (e, force) {
      if ($(this).hasClass('easyui-fluid') || force) {
        setSize(container)
        setSelectedSize(container)
      }
      return false
    })
  }

  function bindEvents(container) {
    const state = $.data(container, 'tabs')
    const opts = state.options
    $(container)
      .children('div.tabs-header')
      .unbind()
      .bind('click', function (e) {
        if ($(e.target).hasClass('tabs-scroller-left')) {
          $(container).tabs('scrollBy', -opts.scrollIncrement)
        } else if ($(e.target).hasClass('tabs-scroller-right')) {
          $(container).tabs('scrollBy', opts.scrollIncrement)
        } else {
          const li = $(e.target).closest('li')
          if (li.hasClass('tabs-disabled')) {
            return false
          }
          const a = $(e.target).closest('a.tabs-close')
          if (a.length) {
            closeTab(container, getLiIndex(li))
          } else if (li.length) {
            //					selectTab(container, getLiIndex(li));
            const index = getLiIndex(li)
            const popts = state.tabs[index].panel('options')
            if (popts.collapsible) {
              popts.closed ? selectTab(container, index) : unselectTab(container, index)
            } else {
              selectTab(container, index)
            }
          }
          return false
        }
      })
      .bind('contextmenu', function (e) {
        const li = $(e.target).closest('li')
        if (li.hasClass('tabs-disabled')) {
          return
        }
        if (li.length) {
          opts.onContextMenu.call(container, e, li.find('span.tabs-title').html(), getLiIndex(li))
        }
      })

    function getLiIndex(li) {
      let index = 0
      li.parent()
        .children('li')
        .each(function (i) {
          if (li[0] == this) {
            index = i
            return false
          }
        })
      return index
    }
  }

  function setProperties(container) {
    const opts = $.data(container, 'tabs').options
    const header = $(container).children('div.tabs-header')
    const panels = $(container).children('div.tabs-panels')

    header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right')
    panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right')
    if (opts.tabPosition == 'top') {
      header.insertBefore(panels)
    } else if (opts.tabPosition == 'bottom') {
      header.insertAfter(panels)
      header.addClass('tabs-header-bottom')
      panels.addClass('tabs-panels-top')
    } else if (opts.tabPosition == 'left') {
      header.addClass('tabs-header-left')
      panels.addClass('tabs-panels-right')
    } else if (opts.tabPosition == 'right') {
      header.addClass('tabs-header-right')
      panels.addClass('tabs-panels-left')
    }

    if (opts.plain == true) {
      header.addClass('tabs-header-plain')
    } else {
      header.removeClass('tabs-header-plain')
    }
    header.removeClass('tabs-header-narrow').addClass(opts.narrow ? 'tabs-header-narrow' : '')
    const tabs = header.find('.tabs')
    tabs.removeClass('tabs-pill').addClass(opts.pill ? 'tabs-pill' : '')
    tabs.removeClass('tabs-narrow').addClass(opts.narrow ? 'tabs-narrow' : '')
    tabs.removeClass('tabs-justified').addClass(opts.justified ? 'tabs-justified' : '')
    if (opts.border == true) {
      header.removeClass('tabs-header-noborder')
      panels.removeClass('tabs-panels-noborder')
    } else {
      header.addClass('tabs-header-noborder')
      panels.addClass('tabs-panels-noborder')
    }
    opts.doSize = true
  }

  function createTab(container, options, pp) {
    options = options || {}
    const state = $.data(container, 'tabs')
    const tabs = state.tabs
    if (options.index == undefined || options.index > tabs.length) {
      options.index = tabs.length
    }
    if (options.index < 0) {
      options.index = 0
    }

    const ul = $(container).children('div.tabs-header').find('ul.tabs')
    const panels = $(container).children('div.tabs-panels')
    const tab = $(
      '<li>' +
        '<a href="javascript:void(0)" class="tabs-inner">' +
        '<span class="tabs-title"></span>' +
        '<span class="tabs-icon"></span>' +
        '</a>' +
        '</li>'
    )
    if (!pp) {
      pp = $('<div></div>')
    }
    if (options.index >= tabs.length) {
      tab.appendTo(ul)
      pp.appendTo(panels)
      tabs.push(pp)
    } else {
      tab.insertBefore(ul.children('li:eq(' + options.index + ')'))
      pp.insertBefore(panels.children('div.panel:eq(' + options.index + ')'))
      tabs.splice(options.index, 0, pp)
    }

    // create panel
    pp.panel(
      $.extend({}, options, {
        tab: tab,
        border: false,
        noheader: true,
        closed: true,
        doSize: false,
        iconCls: options.icon ? options.icon : undefined,
        onLoad: function () {
          if (options.onLoad) {
            options.onLoad.call(this, arguments)
          }
          state.options.onLoad.call(container, $(this))
        },
        onBeforeOpen: function () {
          if (options.onBeforeOpen) {
            if (options.onBeforeOpen.call(this) == false) {
              return false
            }
          }
          let p = $(container).tabs('getSelected')
          if (p) {
            if (p[0] != this) {
              $(container).tabs('unselect', getTabIndex(container, p))
              p = $(container).tabs('getSelected')
              if (p) {
                return false
              }
            } else {
              setSelectedSize(container)
              return false
            }
          }

          const popts = $(this).panel('options')
          popts.tab.addClass('tabs-selected')
          // scroll the tab to center position if required.
          const wrap = $(container).find('>div.tabs-header>div.tabs-wrap')
          const left = popts.tab.position().left
          const right = left + popts.tab.outerWidth()
          if (left < 0 || right > wrap.width()) {
            const deltaX = left - (wrap.width() - popts.tab.width()) / 2
            $(container).tabs('scrollBy', deltaX)
          } else {
            $(container).tabs('scrollBy', 0)
          }

          const panel = $(this).panel('panel')
          panel.css('display', 'block')
          setSelectedSize(container)
          panel.css('display', 'none')
        },
        onOpen: function () {
          if (options.onOpen) {
            options.onOpen.call(this)
          }
          const popts = $(this).panel('options')
          state.selectHis.push(popts.title)
          state.options.onSelect.call(container, popts.title, getTabIndex(container, this))
        },
        onBeforeClose: function () {
          if (options.onBeforeClose) {
            if (options.onBeforeClose.call(this) == false) {
              return false
            }
          }
          $(this).panel('options').tab.removeClass('tabs-selected')
        },
        onClose: function () {
          if (options.onClose) {
            options.onClose.call(this)
          }
          const popts = $(this).panel('options')
          state.options.onUnselect.call(container, popts.title, getTabIndex(container, this))
        }
      })
    )

    // only update the tab header
    $(container).tabs('update', {
      tab: pp,
      options: pp.panel('options'),
      type: 'header'
    })
  }

  function addTab(container, options) {
    const state = $.data(container, 'tabs')
    const opts = state.options
    if (options.selected == undefined) {
      options.selected = true
    }

    createTab(container, options)
    opts.onAdd.call(container, options.title, options.index)
    if (options.selected) {
      selectTab(container, options.index) // select the added tab panel
    }
  }

  /**
   * update tab panel, param has following properties:
   * tab: the tab panel to be updated
   * options: the tab panel options
   * type: the update type, possible values are: 'header','body','all'
   */
  function updateTab(container, param) {
    param.type = param.type || 'all'
    const selectHis = $.data(container, 'tabs').selectHis
    const pp = param.tab // the tab panel
    const opts = pp.panel('options') // get the tab panel options
    const oldTitle = opts.title
    $.extend(opts, param.options, {
      iconCls: param.options.icon ? param.options.icon : undefined
    })

    if (param.type == 'all' || param.type == 'body') {
      pp.panel()
    }
    if (param.type == 'all' || param.type == 'header') {
      const tab = opts.tab

      if (opts.header) {
        tab.find('.tabs-inner').html($(opts.header))
      } else {
        const s_title = tab.find('span.tabs-title')
        const s_icon = tab.find('span.tabs-icon')
        s_title.html(opts.title)
        s_icon.attr('class', 'tabs-icon')

        tab.find('a.tabs-close').remove()
        if (opts.closable) {
          s_title.addClass('tabs-closable')
          $('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab)
        } else {
          s_title.removeClass('tabs-closable')
        }
        if (opts.iconCls) {
          s_title.addClass('tabs-with-icon')
          s_icon.addClass(opts.iconCls)
        } else {
          s_title.removeClass('tabs-with-icon')
        }
        if (opts.tools) {
          var p_tool = tab.find('span.tabs-p-tool')
          if (!p_tool.length) {
            var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(
              tab.find('a.tabs-inner')
            )
          }
          if ($.isArray(opts.tools)) {
            p_tool.empty()
            for (var i = 0; i < opts.tools.length; i++) {
              const t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool)
              t.addClass(opts.tools[i].iconCls)
              if (opts.tools[i].handler) {
                t.bind('click', { handler: opts.tools[i].handler }, function (e) {
                  if ($(this).parents('li').hasClass('tabs-disabled')) {
                    return
                  }
                  e.data.handler.call(this)
                })
              }
            }
          } else {
            $(opts.tools).children().appendTo(p_tool)
          }
          let pr = p_tool.children().length * 12
          if (opts.closable) {
            pr += 8
          } else {
            pr -= 3
            p_tool.css('right', '5px')
          }
          s_title.css('padding-right', pr + 'px')
        } else {
          tab.find('span.tabs-p-tool').remove()
          s_title.css('padding-right', '')
        }
      }
      if (oldTitle != opts.title) {
        for (var i = 0; i < selectHis.length; i++) {
          if (selectHis[i] == oldTitle) {
            selectHis[i] = opts.title
          }
        }
      }
    }
    if (opts.disabled) {
      opts.tab.addClass('tabs-disabled')
    } else {
      opts.tab.removeClass('tabs-disabled')
    }

    setSize(container)

    $.data(container, 'tabs').options.onUpdate.call(
      container,
      opts.title,
      getTabIndex(container, pp)
    )
  }

  /**
   * close a tab with specified index or title
   */
  function closeTab(container, which) {
    const opts = $.data(container, 'tabs').options
    const tabs = $.data(container, 'tabs').tabs
    const selectHis = $.data(container, 'tabs').selectHis

    if (!exists(container, which)) {
      return
    }

    var tab = getTab(container, which)
    const title = tab.panel('options').title
    const index = getTabIndex(container, tab)

    if (opts.onBeforeClose.call(container, title, index) == false) {
      return
    }

    var tab = getTab(container, which, true)
    tab.panel('options').tab.remove()
    tab.panel('destroy')

    opts.onClose.call(container, title, index)

    //		setScrollers(container);
    setSize(container)

    // remove the select history item
    for (let i = 0; i < selectHis.length; i++) {
      if (selectHis[i] == title) {
        selectHis.splice(i, 1)
        i--
      }
    }

    // select the nearest tab panel
    const hisTitle = selectHis.pop()
    if (hisTitle) {
      selectTab(container, hisTitle)
    } else if (tabs.length) {
      selectTab(container, 0)
    }
  }

  /**
   * get the specified tab panel
   */
  function getTab(container, which, removeit) {
    const tabs = $.data(container, 'tabs').tabs
    if (typeof which === 'number') {
      if (which < 0 || which >= tabs.length) {
        return null
      }
      var tab = tabs[which]
      if (removeit) {
        tabs.splice(which, 1)
      }
      return tab
    }
    for (let i = 0; i < tabs.length; i++) {
      var tab = tabs[i]
      if (tab.panel('options').title == which) {
        if (removeit) {
          tabs.splice(i, 1)
        }
        return tab
      }
    }
    return null
  }

  function getTabIndex(container, tab) {
    const tabs = $.data(container, 'tabs').tabs
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i][0] == $(tab)[0]) {
        return i
      }
    }
    return -1
  }

  function getSelectedTab(container) {
    const tabs = $.data(container, 'tabs').tabs
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]
      if (tab.panel('options').tab.hasClass('tabs-selected')) {
        return tab
      }
    }
    return null
  }

  /**
   * do first select action, if no tab is setted the first tab will be selected.
   */
  function doFirstSelect(container) {
    const state = $.data(container, 'tabs')
    const tabs = state.tabs
    for (let i = 0; i < tabs.length; i++) {
      const opts = tabs[i].panel('options')
      if (opts.selected && !opts.disabled) {
        selectTab(container, i)
        return
      }
    }
    selectTab(container, state.options.selected)
  }

  function selectTab(container, which) {
    const p = getTab(container, which)
    if (p && !p.is(':visible')) {
      stopAnimate(container)
      if (!p.panel('options').disabled) {
        p.panel('open')
      }
    }
  }

  function unselectTab(container, which) {
    const p = getTab(container, which)
    if (p && p.is(':visible')) {
      stopAnimate(container)
      p.panel('close')
    }
  }

  function stopAnimate(container) {
    $(container)
      .children('div.tabs-panels')
      .each(function () {
        $(this).stop(true, true)
      })
  }

  function exists(container, which) {
    return getTab(container, which) != null
  }

  function showHeader(container, visible) {
    const opts = $.data(container, 'tabs').options
    opts.showHeader = visible
    $(container).tabs('resize')
  }

  function showTool(container, visible) {
    const tool = $(container).find('>.tabs-header>.tabs-tool')
    if (visible) {
      tool.removeClass('tabs-tool-hidden').show()
    } else {
      tool.addClass('tabs-tool-hidden').hide()
    }
    $(container).tabs('resize').tabs('scrollBy', 0)
  }

  $.fn.tabs = function (options, param) {
    if (typeof options === 'string') {
      return $.fn.tabs.methods[options](this, param)
    }

    options = options || {}
    return this.each(function () {
      const state = $.data(this, 'tabs')
      if (state) {
        $.extend(state.options, options)
      } else {
        $.data(this, 'tabs', {
          options: $.extend({}, $.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
          tabs: [],
          selectHis: []
        })
        wrapTabs(this)
      }

      addTools(this)
      setProperties(this)
      setSize(this)
      bindEvents(this)

      doFirstSelect(this)
    })
  }

  $.fn.tabs.methods = {
    options: function (jq) {
      const cc = jq[0]
      const opts = $.data(cc, 'tabs').options
      const s = getSelectedTab(cc)
      opts.selected = s ? getTabIndex(cc, s) : -1
      return opts
    },
    tabs: function (jq) {
      return $.data(jq[0], 'tabs').tabs
    },
    resize: function (jq, param) {
      return jq.each(function () {
        setSize(this, param)
        setSelectedSize(this)
      })
    },
    add: function (jq, options) {
      return jq.each(function () {
        addTab(this, options)
      })
    },
    close: function (jq, which) {
      return jq.each(function () {
        closeTab(this, which)
      })
    },
    getTab: function (jq, which) {
      return getTab(jq[0], which)
    },
    getTabIndex: function (jq, tab) {
      return getTabIndex(jq[0], tab)
    },
    getSelected: function (jq) {
      return getSelectedTab(jq[0])
    },
    select: function (jq, which) {
      return jq.each(function () {
        selectTab(this, which)
      })
    },
    unselect: function (jq, which) {
      return jq.each(function () {
        unselectTab(this, which)
      })
    },
    exists: function (jq, which) {
      return exists(jq[0], which)
    },
    update: function (jq, options) {
      return jq.each(function () {
        updateTab(this, options)
      })
    },
    enableTab: function (jq, which) {
      return jq.each(function () {
        const opts = $(this).tabs('getTab', which).panel('options')
        opts.tab.removeClass('tabs-disabled')
        opts.disabled = false
      })
    },
    disableTab: function (jq, which) {
      return jq.each(function () {
        const opts = $(this).tabs('getTab', which).panel('options')
        opts.tab.addClass('tabs-disabled')
        opts.disabled = true
      })
    },
    showHeader: function (jq) {
      return jq.each(function () {
        showHeader(this, true)
      })
    },
    hideHeader: function (jq) {
      return jq.each(function () {
        showHeader(this, false)
      })
    },
    showTool: function (jq) {
      return jq.each(function () {
        showTool(this, true)
      })
    },
    hideTool: function (jq) {
      return jq.each(function () {
        showTool(this, false)
      })
    },
    scrollBy: function (jq, deltaX) {
      // scroll the tab header by the specified amount of pixels
      return jq.each(function () {
        const opts = $(this).tabs('options')
        const wrap = $(this).find('>div.tabs-header>div.tabs-wrap')
        const pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth())
        wrap.animate({ scrollLeft: pos }, opts.scrollDuration)

        function getMaxScrollWidth() {
          let w = 0
          const ul = wrap.children('ul')
          ul.children('li').each(function () {
            w += $(this).outerWidth(true)
          })
          return w - wrap.width() + (ul.outerWidth() - ul.width())
        }
      })
    }
  }

  $.fn.tabs.parseOptions = function (target) {
    return $.extend(
      {},
      $.parser.parseOptions(target, [
        'tools',
        'toolPosition',
        'tabPosition',
        { fit: 'boolean', border: 'boolean', plain: 'boolean' },
        { headerWidth: 'number', tabWidth: 'number', tabHeight: 'number', selected: 'number' },
        { showHeader: 'boolean', justified: 'boolean', narrow: 'boolean', pill: 'boolean' }
      ])
    )
  }

  $.fn.tabs.defaults = {
    width: 'auto',
    height: 'auto',
    headerWidth: 150, // the tab header width, it is valid only when tabPosition set to 'left' or 'right'
    tabWidth: 'auto', // the tab width
    tabHeight: 27, // the tab height
    selected: 0, // the initialized selected tab index
    showHeader: true,
    plain: false,
    fit: false,
    border: true,
    justified: false,
    narrow: false,
    pill: false,
    tools: null,
    toolPosition: 'right', // left,right
    tabPosition: 'top', // possible values: top,bottom
    scrollIncrement: 100,
    scrollDuration: 400,
    onLoad: function (panel) {},
    onSelect: function (title, index) {},
    onUnselect: function (title, index) {},
    onBeforeClose: function (title, index) {},
    onClose: function (title, index) {},
    onAdd: function (title, index) {},
    onUpdate: function (title, index) {},
    onContextMenu: function (e, title, index) {}
  }
})(jQuery)
