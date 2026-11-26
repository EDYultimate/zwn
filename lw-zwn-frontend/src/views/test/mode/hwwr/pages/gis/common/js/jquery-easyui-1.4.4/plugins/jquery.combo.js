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
  $(function () {
    $(document)
      .unbind('.combo')
      .bind('mousedown.combo mousewheel.combo', function (e) {
        const p = $(e.target).closest('span.combo,div.combo-p,div.menu')
        if (p.length) {
          _1(p)
          return
        }
        $('body>div.combo-p>div.combo-panel:visible').panel('close')
      })
  })
  function _2(_3) {
    const _4 = $.data(_3, 'combo')
    const _5 = _4.options
    if (!_4.panel) {
      _4.panel = $('<div class="combo-panel"></div>').appendTo('body')
      _4.panel.panel({
        minWidth: _5.panelMinWidth,
        maxWidth: _5.panelMaxWidth,
        minHeight: _5.panelMinHeight,
        maxHeight: _5.panelMaxHeight,
        doSize: false,
        closed: true,
        cls: 'combo-p',
        style: { position: 'absolute', zIndex: 10 },
        onOpen: function () {
          const _6 = $(this).panel('options').comboTarget
          const _7 = $.data(_6, 'combo')
          if (_7) {
            _7.options.onShowPanel.call(_6)
          }
        },
        onBeforeClose: function () {
          _1(this)
        },
        onClose: function () {
          const _8 = $(this).panel('options').comboTarget
          const _9 = $(_8).data('combo')
          if (_9) {
            _9.options.onHidePanel.call(_8)
          }
        }
      })
    }
    const _a = $.extend(true, [], _5.icons)
    if (_5.hasDownArrow) {
      _a.push({
        iconCls: 'combo-arrow',
        handler: function (e) {
          _f(e.data.target)
        }
      })
    }
    $(_3)
      .addClass('combo-f')
      .textbox($.extend({}, _5, { icons: _a, onChange: function () {} }))
    $(_3).attr('comboName', $(_3).attr('textboxName'))
    _4.combo = $(_3).next()
    _4.combo.addClass('combo')
  }
  function _b(_c) {
    const _d = $.data(_c, 'combo')
    const _e = _d.options
    const p = _d.panel
    if (p.is(':visible')) {
      p.panel('close')
    }
    if (!_e.cloned) {
      p.panel('destroy')
    }
    $(_c).textbox('destroy')
  }
  function _f(_10) {
    const _11 = $.data(_10, 'combo').panel
    if (_11.is(':visible')) {
      _12(_10)
    } else {
      const p = $(_10).closest('div.combo-panel')
      $('div.combo-panel:visible').not(_11).not(p).panel('close')
      $(_10).combo('showPanel')
    }
    $(_10).combo('textbox').focus()
  }
  function _1(_13) {
    $(_13)
      .find('.combo-f')
      .each(function () {
        const p = $(this).combo('panel')
        if (p.is(':visible')) {
          p.panel('close')
        }
      })
  }
  function _14(e) {
    const _15 = e.data.target
    const _16 = $.data(_15, 'combo')
    const _17 = _16.options
    const _18 = _16.panel
    if (!_17.editable) {
      _f(_15)
    } else {
      const p = $(_15).closest('div.combo-panel')
      $('div.combo-panel:visible').not(_18).not(p).panel('close')
    }
  }
  function _19(e) {
    const _1a = e.data.target
    const t = $(_1a)
    const _1b = t.data('combo')
    const _1c = t.combo('options')
    switch (e.keyCode) {
      case 38:
        _1c.keyHandler.up.call(_1a, e)
        break
      case 40:
        _1c.keyHandler.down.call(_1a, e)
        break
      case 37:
        _1c.keyHandler.left.call(_1a, e)
        break
      case 39:
        _1c.keyHandler.right.call(_1a, e)
        break
      case 13:
        e.preventDefault()
        _1c.keyHandler.enter.call(_1a, e)
        return false
      case 9:
      case 27:
        _12(_1a)
        break
      default:
        if (_1c.editable) {
          if (_1b.timer) {
            clearTimeout(_1b.timer)
          }
          _1b.timer = setTimeout(function () {
            const q = t.combo('getText')
            if (_1b.previousText != q) {
              _1b.previousText = q
              t.combo('showPanel')
              _1c.keyHandler.query.call(_1a, q, e)
              t.combo('validate')
            }
          }, _1c.delay)
        }
    }
  }
  function _1d(_1e) {
    const _1f = $.data(_1e, 'combo')
    const _20 = _1f.combo
    const _21 = _1f.panel
    const _22 = $(_1e).combo('options')
    const _23 = _21.panel('options')
    _23.comboTarget = _1e
    if (_23.closed) {
      _21
        .panel('panel')
        .show()
        .css({
          zIndex: $.fn.menu
            ? $.fn.menu.defaults.zIndex++
            : $.fn.window
              ? $.fn.window.defaults.zIndex++
              : 99,
          left: -999999
        })
      _21.panel('resize', {
        width: _22.panelWidth ? _22.panelWidth : _20._outerWidth(),
        height: _22.panelHeight
      })
      _21.panel('panel').hide()
      _21.panel('open')
    }
    ;(function () {
      if (_21.is(':visible')) {
        _21.panel('move', { left: _24(), top: _25() })
        setTimeout(arguments.callee, 200)
      }
    })()
    function _24() {
      let _26 = _20.offset().left
      if (_22.panelAlign == 'right') {
        _26 += _20._outerWidth() - _21._outerWidth()
      }
      if (_26 + _21._outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()) {
        _26 = $(window)._outerWidth() + $(document).scrollLeft() - _21._outerWidth()
      }
      if (_26 < 0) {
        _26 = 0
      }
      return _26
    }
    function _25() {
      let top = _20.offset().top + _20._outerHeight()
      if (top + _21._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
        top = _20.offset().top - _21._outerHeight()
      }
      if (top < $(document).scrollTop()) {
        top = _20.offset().top + _20._outerHeight()
      }
      return top
    }
  }
  function _12(_27) {
    const _28 = $.data(_27, 'combo').panel
    _28.panel('close')
  }
  function _29(_2a, _2b) {
    const _2c = $.data(_2a, 'combo')
    const _2d = $(_2a).textbox('getText')
    if (_2d != _2b) {
      $(_2a).textbox('setText', _2b)
      _2c.previousText = _2b
    }
  }
  function _2e(_2f) {
    const _30 = []
    const _31 = $.data(_2f, 'combo').combo
    _31.find('.textbox-value').each(function () {
      _30.push($(this).val())
    })
    return _30
  }
  function _32(_33, _34) {
    const _35 = $.data(_33, 'combo')
    const _36 = _35.options
    const _37 = _35.combo
    if (!$.isArray(_34)) {
      _34 = _34.split(_36.separator)
    }
    const _38 = _2e(_33)
    _37.find('.textbox-value').remove()
    const _39 = $(_33).attr('textboxName') || ''
    for (let i = 0; i < _34.length; i++) {
      const _3a = $('<input type="hidden" class="textbox-value">').appendTo(_37)
      _3a.attr('name', _39)
      if (_36.disabled) {
        _3a.attr('disabled', 'disabled')
      }
      _3a.val(_34[i])
    }
    const _3b = (function () {
      if (_38.length != _34.length) {
        return true
      }
      const a1 = $.extend(true, [], _38)
      const a2 = $.extend(true, [], _34)
      a1.sort()
      a2.sort()
      for (let i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i]) {
          return true
        }
      }
      return false
    })()
    if (_3b) {
      if (_36.multiple) {
        _36.onChange.call(_33, _34, _38)
      } else {
        _36.onChange.call(_33, _34[0], _38[0])
      }
      $(_33).closest('form').trigger('_change', [_33])
    }
  }
  function _3c(_3d) {
    const _3e = _2e(_3d)
    return _3e[0]
  }
  function _3f(_40, _41) {
    _32(_40, [_41])
  }
  function _42(_43) {
    const _44 = $.data(_43, 'combo').options
    const _45 = _44.onChange
    _44.onChange = function () {}
    if (_44.multiple) {
      _32(_43, _44.value ? _44.value : [])
    } else {
      _3f(_43, _44.value)
    }
    _44.onChange = _45
  }
  $.fn.combo = function (_46, _47) {
    if (typeof _46 === 'string') {
      const _48 = $.fn.combo.methods[_46]
      if (_48) {
        return _48(this, _47)
      }
      return this.textbox(_46, _47)
    }
    _46 = _46 || {}
    return this.each(function () {
      let _49 = $.data(this, 'combo')
      if (_49) {
        $.extend(_49.options, _46)
        if (_46.value != undefined) {
          _49.options.originalValue = _46.value
        }
      } else {
        _49 = $.data(this, 'combo', {
          options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), _46),
          previousText: ''
        })
        _49.options.originalValue = _49.options.value
      }
      _2(this)
      _42(this)
    })
  }
  $.fn.combo.methods = {
    options: function (jq) {
      const _4a = jq.textbox('options')
      return $.extend($.data(jq[0], 'combo').options, {
        width: _4a.width,
        height: _4a.height,
        disabled: _4a.disabled,
        readonly: _4a.readonly
      })
    },
    cloneFrom: function (jq, _4b) {
      return jq.each(function () {
        $(this).textbox('cloneFrom', _4b)
        $.data(this, 'combo', {
          options: $.extend(true, { cloned: true }, $(_4b).combo('options')),
          combo: $(this).next(),
          panel: $(_4b).combo('panel')
        })
        $(this).addClass('combo-f').attr('comboName', $(this).attr('textboxName'))
      })
    },
    panel: function (jq) {
      return $.data(jq[0], 'combo').panel
    },
    destroy: function (jq) {
      return jq.each(function () {
        _b(this)
      })
    },
    showPanel: function (jq) {
      return jq.each(function () {
        _1d(this)
      })
    },
    hidePanel: function (jq) {
      return jq.each(function () {
        _12(this)
      })
    },
    clear: function (jq) {
      return jq.each(function () {
        $(this).textbox('setText', '')
        const _4c = $.data(this, 'combo').options
        if (_4c.multiple) {
          $(this).combo('setValues', [])
        } else {
          $(this).combo('setValue', '')
        }
      })
    },
    reset: function (jq) {
      return jq.each(function () {
        const _4d = $.data(this, 'combo').options
        if (_4d.multiple) {
          $(this).combo('setValues', _4d.originalValue)
        } else {
          $(this).combo('setValue', _4d.originalValue)
        }
      })
    },
    setText: function (jq, _4e) {
      return jq.each(function () {
        _29(this, _4e)
      })
    },
    getValues: function (jq) {
      return _2e(jq[0])
    },
    setValues: function (jq, _4f) {
      return jq.each(function () {
        _32(this, _4f)
      })
    },
    getValue: function (jq) {
      return _3c(jq[0])
    },
    setValue: function (jq, _50) {
      return jq.each(function () {
        _3f(this, _50)
      })
    }
  }
  $.fn.combo.parseOptions = function (_51) {
    const t = $(_51)
    return $.extend(
      {},
      $.fn.textbox.parseOptions(_51),
      $.parser.parseOptions(_51, [
        'separator',
        'panelAlign',
        {
          panelWidth: 'number',
          hasDownArrow: 'boolean',
          delay: 'number',
          selectOnNavigation: 'boolean'
        },
        {
          panelMinWidth: 'number',
          panelMaxWidth: 'number',
          panelMinHeight: 'number',
          panelMaxHeight: 'number'
        }
      ]),
      {
        panelHeight:
          t.attr('panelHeight') == 'auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined,
        multiple: t.attr('multiple') ? true : undefined
      }
    )
  }
  $.fn.combo.defaults = $.extend({}, $.fn.textbox.defaults, {
    inputEvents: { click: _14, keydown: _19, paste: _19, drop: _19 },
    panelWidth: null,
    panelHeight: 200,
    panelMinWidth: null,
    panelMaxWidth: null,
    panelMinHeight: null,
    panelMaxHeight: null,
    panelAlign: 'left',
    multiple: false,
    selectOnNavigation: true,
    separator: ',',
    hasDownArrow: true,
    delay: 200,
    keyHandler: {
      up: function (e) {},
      down: function (e) {},
      left: function (e) {},
      right: function (e) {},
      enter: function (e) {},
      query: function (q, e) {}
    },
    onShowPanel: function () {},
    onHidePanel: function () {},
    onChange: function (_52, _53) {}
  })
})(jQuery)
