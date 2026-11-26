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
    const _3 = $.data(_2, 'combotree')
    const _4 = _3.options
    let _5 = _3.tree
    $(_2).addClass('combotree-f')
    $(_2).combo(_4)
    const _6 = $(_2).combo('panel')
    if (!_5) {
      _5 = $('<ul></ul>').appendTo(_6)
      $.data(_2, 'combotree').tree = _5
    }
    _5.tree(
      $.extend({}, _4, {
        checkbox: _4.multiple,
        onLoadSuccess: function (_7, _8) {
          const _9 = $(_2).combotree('getValues')
          if (_4.multiple) {
            const _a = _5.tree('getChecked')
            for (let i = 0; i < _a.length; i++) {
              var id = _a[i].id
              ;(function () {
                for (let i = 0; i < _9.length; i++) {
                  if (id == _9[i]) {
                    return
                  }
                }
                _9.push(id)
              })()
            }
          }
          $(_2).combotree('setValues', _9)
          _4.onLoadSuccess.call(this, _7, _8)
        },
        onClick: function (_b) {
          if (_4.multiple) {
            $(this).tree(_b.checked ? 'uncheck' : 'check', _b.target)
          } else {
            $(_2).combo('hidePanel')
          }
          _e(_2)
          _4.onClick.call(this, _b)
        },
        onCheck: function (_c, _d) {
          _e(_2)
          _4.onCheck.call(this, _c, _d)
        }
      })
    )
  }
  function _e(_f) {
    const _10 = $.data(_f, 'combotree')
    const _11 = _10.options
    const _12 = _10.tree
    const vv = [],
      ss = []
    if (_11.multiple) {
      const _13 = _12.tree('getChecked')
      for (let i = 0; i < _13.length; i++) {
        vv.push(_13[i].id)
        ss.push(_13[i].text)
      }
    } else {
      const _14 = _12.tree('getSelected')
      if (_14) {
        vv.push(_14.id)
        ss.push(_14.text)
      }
    }
    $(_f)
      .combo('setText', ss.join(_11.separator))
      .combo('setValues', _11.multiple ? vv : vv.length ? vv : [''])
  }
  function _15(_16, _17) {
    const _18 = $.data(_16, 'combotree')
    const _19 = _18.options
    const _1a = _18.tree
    const _1b = _1a.tree('options')
    const _1c = _1b.onCheck
    const _1d = _1b.onSelect
    _1b.onCheck = _1b.onSelect = function () {}
    _1a
      .find('span.tree-checkbox')
      .addClass('tree-checkbox0')
      .removeClass('tree-checkbox1 tree-checkbox2')
    if (!$.isArray(_17)) {
      _17 = _17.split(_19.separator)
    }
    const vv = $.map(_17, function (_1e) {
      return String(_1e)
    })
    const ss = []
    $.map(vv, function (v) {
      const _1f = _1a.tree('find', v)
      if (_1f) {
        _1a.tree('check', _1f.target).tree('select', _1f.target)
        ss.push(_1f.text)
      } else {
        ss.push(v)
      }
    })
    if (_19.multiple) {
      const _20 = _1a.tree('getChecked')
      $.map(_20, function (_21) {
        const id = String(_21.id)
        if ($.inArray(id, vv) == -1) {
          vv.push(id)
          ss.push(_21.text)
        }
      })
    }
    _1b.onCheck = _1c
    _1b.onSelect = _1d
    $(_16)
      .combo('setText', ss.join(_19.separator))
      .combo('setValues', _19.multiple ? vv : vv.length ? vv : [''])
  }
  $.fn.combotree = function (_22, _23) {
    if (typeof _22 === 'string') {
      const _24 = $.fn.combotree.methods[_22]
      if (_24) {
        return _24(this, _23)
      }
      return this.combo(_22, _23)
    }
    _22 = _22 || {}
    return this.each(function () {
      const _25 = $.data(this, 'combotree')
      if (_25) {
        $.extend(_25.options, _22)
      } else {
        $.data(this, 'combotree', {
          options: $.extend({}, $.fn.combotree.defaults, $.fn.combotree.parseOptions(this), _22)
        })
      }
      _1(this)
    })
  }
  $.fn.combotree.methods = {
    options: function (jq) {
      const _26 = jq.combo('options')
      return $.extend($.data(jq[0], 'combotree').options, {
        width: _26.width,
        height: _26.height,
        originalValue: _26.originalValue,
        disabled: _26.disabled,
        readonly: _26.readonly
      })
    },
    clone: function (jq, _27) {
      const t = jq.combo('clone', _27)
      t.data('combotree', {
        options: $.extend(true, {}, jq.combotree('options')),
        tree: jq.combotree('tree')
      })
      return t
    },
    tree: function (jq) {
      return $.data(jq[0], 'combotree').tree
    },
    loadData: function (jq, _28) {
      return jq.each(function () {
        const _29 = $.data(this, 'combotree').options
        _29.data = _28
        const _2a = $.data(this, 'combotree').tree
        _2a.tree('loadData', _28)
      })
    },
    reload: function (jq, url) {
      return jq.each(function () {
        const _2b = $.data(this, 'combotree').options
        const _2c = $.data(this, 'combotree').tree
        if (url) {
          _2b.url = url
        }
        _2c.tree({ url: _2b.url })
      })
    },
    setValues: function (jq, _2d) {
      return jq.each(function () {
        _15(this, _2d)
      })
    },
    setValue: function (jq, _2e) {
      return jq.each(function () {
        _15(this, [_2e])
      })
    },
    clear: function (jq) {
      return jq.each(function () {
        const _2f = $.data(this, 'combotree').tree
        _2f.find('div.tree-node-selected').removeClass('tree-node-selected')
        const cc = _2f.tree('getChecked')
        for (let i = 0; i < cc.length; i++) {
          _2f.tree('uncheck', cc[i].target)
        }
        $(this).combo('clear')
      })
    },
    reset: function (jq) {
      return jq.each(function () {
        const _30 = $(this).combotree('options')
        if (_30.multiple) {
          $(this).combotree('setValues', _30.originalValue)
        } else {
          $(this).combotree('setValue', _30.originalValue)
        }
      })
    }
  }
  $.fn.combotree.parseOptions = function (_31) {
    return $.extend({}, $.fn.combo.parseOptions(_31), $.fn.tree.parseOptions(_31))
  }
  $.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, $.fn.tree.defaults, {
    editable: false
  })
})(jQuery)
