/**
 * jQuery EasyUI 1.4.4
 *
 * Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
;(function ($) {
  function _1(_2) {
    const _3 = $.data(_2, 'combogrid')
    const _4 = _3.options
    let _5 = _3.grid
    $(_2)
      .addClass('combogrid-f')
      .combo(
        $.extend({}, _4, {
          onShowPanel: function () {
            const p = $(this).combogrid('panel')
            const _6 = p.outerHeight() - p.height()
            const _7 = p._size('minHeight')
            const _8 = p._size('maxHeight')
            const dg = $(this).combogrid('grid')
            dg.datagrid('resize', {
              width: '100%',
              height: isNaN(parseInt(_4.panelHeight)) ? 'auto' : '100%',
              minHeight: _7 ? _7 - _6 : '',
              maxHeight: _8 ? _8 - _6 : ''
            })
            const _9 = dg.datagrid('getSelected')
            if (_9) {
              dg.datagrid('scrollTo', dg.datagrid('getRowIndex', _9))
            }
            _4.onShowPanel.call(this)
          }
        })
      )
    const _a = $(_2).combo('panel')
    if (!_5) {
      _5 = $('<table></table>').appendTo(_a)
      _3.grid = _5
    }
    _5.datagrid(
      $.extend({}, _4, {
        border: false,
        singleSelect: !_4.multiple,
        onLoadSuccess: function (_b) {
          const _c = $(_2).combo('getValues')
          const _d = _4.onSelect
          _4.onSelect = function () {}
          _15(_2, _c, _3.remainText)
          _4.onSelect = _d
          _4.onLoadSuccess.apply(_2, arguments)
        },
        onClickRow: _e,
        onSelect: function (_f, row) {
          _10()
          _4.onSelect.call(this, _f, row)
        },
        onUnselect: function (_11, row) {
          _10()
          _4.onUnselect.call(this, _11, row)
        },
        onSelectAll: function (_12) {
          _10()
          _4.onSelectAll.call(this, _12)
        },
        onUnselectAll: function (_13) {
          if (_4.multiple) {
            _10()
          }
          _4.onUnselectAll.call(this, _13)
        }
      })
    )
    function _e(_14, row) {
      _3.remainText = false
      _10()
      if (!_4.multiple) {
        $(_2).combo('hidePanel')
      }
      _4.onClickRow.call(this, _14, row)
    }
    function _10() {
      let vv = $.map(_5.datagrid('getSelections'), function (row) {
        return row[_4.idField]
      })
      vv = vv.concat(_4.unselectedValues)
      if (!_4.multiple) {
        vv = vv.length ? [vv[0]] : ['']
      }
      _15(_2, vv, _3.remainText)
    }
  }
  function nav(_16, dir) {
    const _17 = $.data(_16, 'combogrid')
    const _18 = _17.options
    const _19 = _17.grid
    const _1a = _19.datagrid('getRows').length
    if (!_1a) {
      return
    }
    let tr = _18.finder.getTr(_19[0], null, 'highlight')
    if (!tr.length) {
      tr = _18.finder.getTr(_19[0], null, 'selected')
    }
    var _1b
    if (!tr.length) {
      _1b = dir == 'next' ? 0 : _1a - 1
    } else {
      var _1b = parseInt(tr.attr('datagrid-row-index'))
      _1b += dir == 'next' ? 1 : -1
      if (_1b < 0) {
        _1b = _1a - 1
      }
      if (_1b >= _1a) {
        _1b = 0
      }
    }
    _19.datagrid('highlightRow', _1b)
    if (_18.selectOnNavigation) {
      _17.remainText = false
      _19.datagrid('selectRow', _1b)
    }
  }
  function _15(_1c, _1d, _1e) {
    const _1f = $.data(_1c, 'combogrid')
    const _20 = _1f.options
    const _21 = _1f.grid
    const _22 = $(_1c).combo('getValues')
    const _23 = $(_1c).combo('options')
    const _24 = _23.onChange
    _23.onChange = function () {}
    const _25 = _21.datagrid('options')
    const _26 = _25.onSelect
    const _27 = _25.onUnselectAll
    _25.onSelect = _25.onUnselectAll = function () {}
    if (!$.isArray(_1d)) {
      _1d = _1d.split(_20.separator)
    }
    const _28 = []
    $.map(_21.datagrid('getSelections'), function (row) {
      if ($.inArray(row[_20.idField], _1d) >= 0) {
        _28.push(row)
      }
    })
    _21.datagrid('clearSelections')
    _21.data('datagrid').selectedRows = _28
    const ss = []
    for (let i = 0; i < _1d.length; i++) {
      const _29 = _1d[i]
      const _2a = _21.datagrid('getRowIndex', _29)
      if (_2a >= 0) {
        _21.datagrid('selectRow', _2a)
      }
      ss.push(
        _2b(_29, _21.datagrid('getRows')) ||
          _2b(_29, _21.datagrid('getSelections')) ||
          _2b(_29, _20.mappingRows) ||
          _29
      )
    }
    _20.unselectedValues = []
    const _2c = $.map(_28, function (row) {
      return row[_20.idField]
    })
    $.map(_1d, function (_2d) {
      if ($.inArray(_2d, _2c) == -1) {
        _20.unselectedValues.push(_2d)
      }
    })
    $(_1c).combo('setValues', _22)
    _23.onChange = _24
    _25.onSelect = _26
    _25.onUnselectAll = _27
    if (!_1e) {
      const s = ss.join(_20.separator)
      if ($(_1c).combo('getText') != s) {
        $(_1c).combo('setText', s)
      }
    }
    $(_1c).combo('setValues', _1d)
    function _2b(_2e, a) {
      for (let i = 0; i < a.length; i++) {
        if (_2e == a[i][_20.idField]) {
          return a[i][_20.textField]
        }
      }
      return undefined
    }
  }
  function _2f(_30, q) {
    const _31 = $.data(_30, 'combogrid')
    const _32 = _31.options
    const _33 = _31.grid
    _31.remainText = true
    if (_32.multiple && !q) {
      _15(_30, [], true)
    } else {
      _15(_30, [q], true)
    }
    if (_32.mode == 'remote') {
      _33.datagrid('clearSelections')
      _33.datagrid('load', $.extend({}, _32.queryParams, { q: q }))
    } else {
      if (!q) {
        return
      }
      _33.datagrid('clearSelections').datagrid('highlightRow', -1)
      const _34 = _33.datagrid('getRows')
      const qq = _32.multiple ? q.split(_32.separator) : [q]
      $.map(qq, function (q) {
        q = $.trim(q)
        if (q) {
          $.map(_34, function (row, i) {
            if (q == row[_32.textField]) {
              _33.datagrid('selectRow', i)
            } else if (_32.filter.call(_30, q, row)) {
              _33.datagrid('highlightRow', i)
            }
          })
        }
      })
    }
  }
  function _35(_36) {
    const _37 = $.data(_36, 'combogrid')
    const _38 = _37.options
    const _39 = _37.grid
    const tr = _38.finder.getTr(_39[0], null, 'highlight')
    _37.remainText = false
    if (tr.length) {
      const _3a = parseInt(tr.attr('datagrid-row-index'))
      if (_38.multiple) {
        if (tr.hasClass('datagrid-row-selected')) {
          _39.datagrid('unselectRow', _3a)
        } else {
          _39.datagrid('selectRow', _3a)
        }
      } else {
        _39.datagrid('selectRow', _3a)
      }
    }
    const vv = []
    $.map(_39.datagrid('getSelections'), function (row) {
      vv.push(row[_38.idField])
    })
    $(_36).combogrid('setValues', vv)
    if (!_38.multiple) {
      $(_36).combogrid('hidePanel')
    }
  }
  $.fn.combogrid = function (_3b, _3c) {
    if (typeof _3b === 'string') {
      const _3d = $.fn.combogrid.methods[_3b]
      if (_3d) {
        return _3d(this, _3c)
      }
      return this.combo(_3b, _3c)
    }
    _3b = _3b || {}
    return this.each(function () {
      let _3e = $.data(this, 'combogrid')
      if (_3e) {
        $.extend(_3e.options, _3b)
      } else {
        _3e = $.data(this, 'combogrid', {
          options: $.extend({}, $.fn.combogrid.defaults, $.fn.combogrid.parseOptions(this), _3b)
        })
      }
      _1(this)
    })
  }
  $.fn.combogrid.methods = {
    options: function (jq) {
      const _3f = jq.combo('options')
      return $.extend($.data(jq[0], 'combogrid').options, {
        width: _3f.width,
        height: _3f.height,
        originalValue: _3f.originalValue,
        disabled: _3f.disabled,
        readonly: _3f.readonly
      })
    },
    grid: function (jq) {
      return $.data(jq[0], 'combogrid').grid
    },
    setValues: function (jq, _40) {
      return jq.each(function () {
        const _41 = $(this).combogrid('options')
        if ($.isArray(_40)) {
          _40 = $.map(_40, function (_42) {
            if (typeof _42 === 'object') {
              const v = _42[_41.idField]
              ;(function () {
                for (let i = 0; i < _41.mappingRows.length; i++) {
                  if (v == _41.mappingRows[i][_41.idField]) {
                    return
                  }
                }
                _41.mappingRows.push(_42)
              })()
              return v
            }
            return _42
          })
        }
        _15(this, _40)
      })
    },
    setValue: function (jq, _43) {
      return jq.each(function () {
        $(this).combogrid('setValues', [_43])
      })
    },
    clear: function (jq) {
      return jq.each(function () {
        $(this).combogrid('grid').datagrid('clearSelections')
        $(this).combo('clear')
      })
    },
    reset: function (jq) {
      return jq.each(function () {
        const _44 = $(this).combogrid('options')
        if (_44.multiple) {
          $(this).combogrid('setValues', _44.originalValue)
        } else {
          $(this).combogrid('setValue', _44.originalValue)
        }
      })
    }
  }
  $.fn.combogrid.parseOptions = function (_45) {
    const t = $(_45)
    return $.extend(
      {},
      $.fn.combo.parseOptions(_45),
      $.fn.datagrid.parseOptions(_45),
      $.parser.parseOptions(_45, ['idField', 'textField', 'mode'])
    )
  }
  $.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults, $.fn.datagrid.defaults, {
    height: 22,
    loadMsg: null,
    idField: null,
    textField: null,
    unselectedValues: [],
    mappingRows: [],
    mode: 'local',
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
        _35(this)
      },
      query: function (q, e) {
        _2f(this, q)
      }
    },
    filter: function (q, row) {
      const _46 = $(this).combogrid('options')
      return (row[_46.textField] || '').toLowerCase().indexOf(q.toLowerCase()) == 0
    }
  })
})(jQuery)
