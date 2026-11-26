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
 * combobox - jQuery EasyUI
 *
 * Dependencies:
 *   combo
 *
 */
;(function ($) {
  let COMBOBOX_SERNO = 0

  function getRowIndex(target, value) {
    const state = $.data(target, 'combobox')
    const opts = state.options
    const data = state.data
    for (let i = 0; i < data.length; i++) {
      if (data[i][opts.valueField] == value) {
        return i
      }
    }
    return -1
  }

  /**
   * scroll panel to display the specified item
   */
  function scrollTo(target, value) {
    const opts = $.data(target, 'combobox').options
    const panel = $(target).combo('panel')
    const item = opts.finder.getEl(target, value)
    if (item.length) {
      if (item.position().top <= 0) {
        var h = panel.scrollTop() + item.position().top
        panel.scrollTop(h)
      } else if (item.position().top + item.outerHeight() > panel.height()) {
        var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height()
        panel.scrollTop(h)
      }
    }
  }

  function nav(target, dir) {
    const opts = $.data(target, 'combobox').options
    const panel = $(target).combobox('panel')
    let item = panel.children('div.combobox-item-hover')
    if (!item.length) {
      item = panel.children('div.combobox-item-selected')
    }
    item.removeClass('combobox-item-hover')
    const firstSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):first'
    const lastSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):last'
    if (!item.length) {
      item = panel.children(dir == 'next' ? firstSelector : lastSelector)
      //			item = panel.children('div.combobox-item:visible:' + (dir=='next'?'first':'last'));
    } else if (dir == 'next') {
      item = item.nextAll(firstSelector)
      //				item = item.nextAll('div.combobox-item:visible:first');
      if (!item.length) {
        item = panel.children(firstSelector)
        //					item = panel.children('div.combobox-item:visible:first');
      }
    } else {
      item = item.prevAll(firstSelector)
      //				item = item.prevAll('div.combobox-item:visible:first');
      if (!item.length) {
        item = panel.children(lastSelector)
        //					item = panel.children('div.combobox-item:visible:last');
      }
    }
    if (item.length) {
      item.addClass('combobox-item-hover')
      const row = opts.finder.getRow(target, item)
      if (row) {
        scrollTo(target, row[opts.valueField])
        if (opts.selectOnNavigation) {
          select(target, row[opts.valueField])
        }
      }
    }
  }

  /**
   * select the specified value
   */
  function select(target, value) {
    const opts = $.data(target, 'combobox').options
    let values = $(target).combo('getValues')
    if ($.inArray(value + '', values) == -1) {
      if (opts.multiple) {
        values.push(value)
      } else {
        values = [value]
      }
      setValues(target, values)
      opts.onSelect.call(target, opts.finder.getRow(target, value))
    }
  }

  /**
   * unselect the specified value
   */
  function unselect(target, value) {
    const opts = $.data(target, 'combobox').options
    const values = $(target).combo('getValues')
    const index = $.inArray(value + '', values)
    if (index >= 0) {
      values.splice(index, 1)
      setValues(target, values)
      opts.onUnselect.call(target, opts.finder.getRow(target, value))
    }
  }

  /**
   * set values
   */
  function setValues(target, values, remainText) {
    const opts = $.data(target, 'combobox').options
    const panel = $(target).combo('panel')

    if (!$.isArray(values)) {
      values = values.split(opts.separator)
    }
    panel.find('div.combobox-item-selected').removeClass('combobox-item-selected')
    const vv = [],
      ss = []
    for (let i = 0; i < values.length; i++) {
      const v = values[i]
      let s = v
      opts.finder.getEl(target, v).addClass('combobox-item-selected')
      const row = opts.finder.getRow(target, v)
      if (row) {
        s = row[opts.textField]
      }
      vv.push(v)
      ss.push(s)
    }

    if (!remainText) {
      $(target).combo('setText', ss.join(opts.separator))
    }
    $(target).combo('setValues', vv)
  }

  /**
   * load data, the old list items will be removed.
   */
  function loadData(target, data, remainText) {
    const state = $.data(target, 'combobox')
    const opts = state.options
    state.data = opts.loadFilter.call(target, data)
    state.groups = []
    data = state.data

    const selected = $(target).combobox('getValues')
    const dd = []
    let group = undefined
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const v = row[opts.valueField] + ''
      const s = row[opts.textField]
      const g = row[opts.groupField]

      if (g) {
        if (group != g) {
          group = g
          state.groups.push(g)
          dd.push(
            '<div id="' +
              (state.groupIdPrefix + '_' + (state.groups.length - 1)) +
              '" class="combobox-group">'
          )
          dd.push(opts.groupFormatter ? opts.groupFormatter.call(target, g) : g)
          dd.push('</div>')
        }
      } else {
        group = undefined
      }

      const cls =
        'combobox-item' +
        (row.disabled ? ' combobox-item-disabled' : '') +
        (g ? ' combobox-gitem' : '')
      dd.push('<div id="' + (state.itemIdPrefix + '_' + i) + '" class="' + cls + '">')
      dd.push(opts.formatter ? opts.formatter.call(target, row) : s)
      dd.push('</div>')

      //			if (item['selected']){
      //				(function(){
      //					for(var i=0; i<selected.length; i++){
      //						if (v == selected[i]) return;
      //					}
      //					selected.push(v);
      //				})();
      //			}
      if (row.selected && $.inArray(v, selected) == -1) {
        selected.push(v)
      }
    }
    $(target).combo('panel').html(dd.join(''))

    if (opts.multiple) {
      setValues(target, selected, remainText)
    } else {
      setValues(target, selected.length ? [selected[selected.length - 1]] : [], remainText)
    }

    opts.onLoadSuccess.call(target, data)
  }

  /**
   * request remote data if the url property is setted.
   */
  function request(target, url, param, remainText) {
    const opts = $.data(target, 'combobox').options
    if (url) {
      opts.url = url
    }
    param = $.extend({}, opts.queryParams, param || {})
    //		param = param || {};

    if (opts.onBeforeLoad.call(target, param) == false) {
      return
    }

    opts.loader.call(
      target,
      param,
      function (data) {
        loadData(target, data, remainText)
      },
      function () {
        opts.onLoadError.apply(this, arguments)
      }
    )
  }

  /**
   * do the query action
   */
  function doQuery(target, q) {
    const state = $.data(target, 'combobox')
    const opts = state.options

    const qq = opts.multiple ? q.split(opts.separator) : [q]
    if (opts.mode == 'remote') {
      _setValues(qq)
      request(target, null, { q: q }, true)
    } else {
      const panel = $(target).combo('panel')
      panel
        .find('div.combobox-item-selected,div.combobox-item-hover')
        .removeClass('combobox-item-selected combobox-item-hover')
      panel.find('div.combobox-item,div.combobox-group').hide()
      const data = state.data
      const vv = []
      $.map(qq, function (q) {
        q = $.trim(q)
        let value = q
        let group = undefined
        for (let i = 0; i < data.length; i++) {
          const row = data[i]
          if (opts.filter.call(target, q, row)) {
            const v = row[opts.valueField]
            const s = row[opts.textField]
            const g = row[opts.groupField]
            const item = opts.finder.getEl(target, v).show()
            if (s.toLowerCase() == q.toLowerCase()) {
              value = v
              item.addClass('combobox-item-selected')
              opts.onSelect.call(target, row)
            }
            if (opts.groupField && group != g) {
              $('#' + state.groupIdPrefix + '_' + $.inArray(g, state.groups)).show()
              group = g
            }
          }
        }
        vv.push(value)
      })
      _setValues(vv)
    }
    function _setValues(vv) {
      setValues(target, opts.multiple ? (q ? vv : []) : vv, true)
    }
  }

  function doEnter(target) {
    const t = $(target)
    const opts = t.combobox('options')
    const panel = t.combobox('panel')
    const item = panel.children('div.combobox-item-hover')
    if (item.length) {
      const row = opts.finder.getRow(target, item)
      const value = row[opts.valueField]
      if (opts.multiple) {
        if (item.hasClass('combobox-item-selected')) {
          t.combobox('unselect', value)
        } else {
          t.combobox('select', value)
        }
      } else {
        t.combobox('select', value)
      }
    }
    const vv = []
    $.map(t.combobox('getValues'), function (v) {
      if (getRowIndex(target, v) >= 0) {
        vv.push(v)
      }
    })
    t.combobox('setValues', vv)
    if (!opts.multiple) {
      t.combobox('hidePanel')
    }
  }

  /**
   * create the component
   */
  function create(target) {
    const state = $.data(target, 'combobox')
    const opts = state.options

    COMBOBOX_SERNO++
    state.itemIdPrefix = '_easyui_combobox_i' + COMBOBOX_SERNO
    state.groupIdPrefix = '_easyui_combobox_g' + COMBOBOX_SERNO

    $(target).addClass('combobox-f')
    $(target).combo(
      $.extend({}, opts, {
        onShowPanel: function () {
          $(target).combo('panel').find('div.combobox-item:hidden,div.combobox-group:hidden')
.show()
          scrollTo(target, $(target).combobox('getValue'))
          opts.onShowPanel.call(target)
        }
      })
    )

    $(target)
      .combo('panel')
      .unbind()
      .bind('mouseover', function (e) {
        $(this).children('div.combobox-item-hover').removeClass('combobox-item-hover')
        const item = $(e.target).closest('div.combobox-item')
        if (!item.hasClass('combobox-item-disabled')) {
          item.addClass('combobox-item-hover')
        }
        e.stopPropagation()
      })
      .bind('mouseout', function (e) {
        $(e.target).closest('div.combobox-item').removeClass('combobox-item-hover')
        e.stopPropagation()
      })
      .bind('click', function (e) {
        const item = $(e.target).closest('div.combobox-item')
        if (!item.length || item.hasClass('combobox-item-disabled')) {
          return
        }
        const row = opts.finder.getRow(target, item)
        if (!row) {
          return
        }
        const value = row[opts.valueField]
        if (opts.multiple) {
          if (item.hasClass('combobox-item-selected')) {
            unselect(target, value)
          } else {
            select(target, value)
          }
        } else {
          select(target, value)
          $(target).combo('hidePanel')
        }
        e.stopPropagation()
      })
  }

  $.fn.combobox = function (options, param) {
    if (typeof options === 'string') {
      const method = $.fn.combobox.methods[options]
      if (method) {
        return method(this, param)
      }
      return this.combo(options, param)
    }

    options = options || {}
    return this.each(function () {
      let state = $.data(this, 'combobox')
      if (state) {
        $.extend(state.options, options)
      } else {
        state = $.data(this, 'combobox', {
          options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options),
          data: []
        })
      }
      create(this)
      if (state.options.data) {
        loadData(this, state.options.data)
      } else {
        const data = $.fn.combobox.parseData(this)
        if (data.length) {
          loadData(this, data)
        }
      }
      request(this)
    })
  }

  $.fn.combobox.methods = {
    options: function (jq) {
      const copts = jq.combo('options')
      return $.extend($.data(jq[0], 'combobox').options, {
        width: copts.width,
        height: copts.height,
        originalValue: copts.originalValue,
        disabled: copts.disabled,
        readonly: copts.readonly
      })
    },
    getData: function (jq) {
      return $.data(jq[0], 'combobox').data
    },
    setValues: function (jq, values) {
      return jq.each(function () {
        setValues(this, values)
      })
    },
    setValue: function (jq, value) {
      return jq.each(function () {
        setValues(this, [value])
      })
    },
    clear: function (jq) {
      return jq.each(function () {
        $(this).combo('clear')
        const panel = $(this).combo('panel')
        panel.find('div.combobox-item-selected').removeClass('combobox-item-selected')
      })
    },
    reset: function (jq) {
      return jq.each(function () {
        const opts = $(this).combobox('options')
        if (opts.multiple) {
          $(this).combobox('setValues', opts.originalValue)
        } else {
          $(this).combobox('setValue', opts.originalValue)
        }
      })
    },
    loadData: function (jq, data) {
      return jq.each(function () {
        loadData(this, data)
      })
    },
    reload: function (jq, url) {
      return jq.each(function () {
        if (typeof url === 'string') {
          request(this, url)
        } else {
          if (url) {
            const opts = $(this).combobox('options')
            opts.queryParams = url
          }
          request(this)
        }
      })
    },
    select: function (jq, value) {
      return jq.each(function () {
        select(this, value)
      })
    },
    unselect: function (jq, value) {
      return jq.each(function () {
        unselect(this, value)
      })
    }
  }

  $.fn.combobox.parseOptions = function (target) {
    const t = $(target)
    return $.extend(
      {},
      $.fn.combo.parseOptions(target),
      $.parser.parseOptions(target, [
        'valueField',
        'textField',
        'groupField',
        'mode',
        'method',
        'url'
      ])
    )
  }

  $.fn.combobox.parseData = function (target) {
    const data = []
    const opts = $(target).combobox('options')
    $(target)
      .children()
      .each(function () {
        if (this.tagName.toLowerCase() == 'optgroup') {
          const group = $(this).attr('label')
          $(this)
            .children()
            .each(function () {
              _parseItem(this, group)
            })
        } else {
          _parseItem(this)
        }
      })
    return data

    function _parseItem(el, group) {
      const t = $(el)
      const row = {}
      row[opts.valueField] = t.attr('value') != undefined ? t.attr('value') : t.text()
      row[opts.textField] = t.text()
      row.selected = t.is(':selected')
      row.disabled = t.is(':disabled')
      if (group) {
        opts.groupField = opts.groupField || 'group'
        row[opts.groupField] = group
      }
      data.push(row)
    }
  }

  $.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
    valueField: 'value',
    textField: 'text',
    groupField: null,
    groupFormatter: function (group) {
      return group
    },
    mode: 'local', // or 'remote'
    method: 'post',
    url: null,
    data: null,
    queryParams: {},

    keyHandler: {
      up: function (e) {
        nav(this, 'prev')
        e.preventDefault()
      },
      down: function (e) {
        nav(this, 'next')
        e.preventDefault()
      },
      left: function (e) {},
      right: function (e) {},
      enter: function (e) {
        doEnter(this)
      },
      query: function (q, e) {
        doQuery(this, q)
      }
    },
    filter: function (q, row) {
      const opts = $(this).combobox('options')
      return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) == 0
    },
    formatter: function (row) {
      const opts = $(this).combobox('options')
      return row[opts.textField]
    },
    loader: function (param, success, error) {
      const opts = $(this).combobox('options')
      if (!opts.url) {
        return false
      }
      $.ajax({
        type: opts.method,
        url: opts.url,
        data: param,
        dataType: 'json',
        success: function (data) {
          success(data)
        },
        error: function () {
          error.apply(this, arguments)
        }
      })
    },
    loadFilter: function (data) {
      return data
    },
    finder: {
      getEl: function (target, value) {
        const index = getRowIndex(target, value)
        const id = $.data(target, 'combobox').itemIdPrefix + '_' + index
        return $('#' + id)
      },
      getRow: function (target, p) {
        const state = $.data(target, 'combobox')
        const index =
          p instanceof jQuery
            ? p.attr('id').substr(state.itemIdPrefix.length + 1)
            : getRowIndex(target, p)
        return state.data[parseInt(index)]
      }
    },

    onBeforeLoad: function (param) {},
    onLoadSuccess: function () {},
    onLoadError: function () {},
    onSelect: function (record) {},
    onUnselect: function (record) {}
  })
})(jQuery)
