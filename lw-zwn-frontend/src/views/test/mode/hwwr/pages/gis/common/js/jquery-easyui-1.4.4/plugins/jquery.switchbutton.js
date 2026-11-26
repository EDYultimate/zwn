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
    const _3 = $(
      '<span class="switchbutton">' +
        '<span class="switchbutton-inner">' +
        '<span class="switchbutton-on"></span>' +
        '<span class="switchbutton-handle"></span>' +
        '<span class="switchbutton-off"></span>' +
        '<input class="switchbutton-value" type="checkbox">' +
        '</span>' +
        '</span>'
    ).insertAfter(_2)
    const t = $(_2)
    t.addClass('switchbutton-f').hide()
    const _4 = t.attr('name')
    if (_4) {
      t.removeAttr('name').attr('switchbuttonName', _4)
      _3.find('.switchbutton-value').attr('name', _4)
    }
    _3.bind('_resize', function (e, _5) {
      if ($(this).hasClass('easyui-fluid') || _5) {
        _6(_2)
      }
      return false
    })
    return _3
  }
  function _6(_7, _8) {
    const _9 = $.data(_7, 'switchbutton')
    const _a = _9.options
    const _b = _9.switchbutton
    if (_8) {
      $.extend(_a, _8)
    }
    const _c = _b.is(':visible')
    if (!_c) {
      _b.appendTo('body')
    }
    _b._size(_a)
    var w = _b.width()
    var h = _b.height()
    var w = _b.outerWidth()
    var h = _b.outerHeight()
    const _d = parseInt(_a.handleWidth) || _b.height()
    const _e = w * 2 - _d
    _b.find('.switchbutton-inner').css({ width: _e + 'px', height: h + 'px', lineHeight: h + 'px' })
    _b.find('.switchbutton-handle')
      ._outerWidth(_d)
      ._outerHeight(h)
      .css({ marginLeft: -_d / 2 + 'px' })
    _b.find('.switchbutton-on').css({
      width: w - _d / 2 + 'px',
      textIndent: (_a.reversed ? '' : '-') + _d / 2 + 'px'
    })
    _b.find('.switchbutton-off').css({
      width: w - _d / 2 + 'px',
      textIndent: (_a.reversed ? '-' : '') + _d / 2 + 'px'
    })
    _a.marginWidth = w - _d
    _f(_7, _a.checked, false)
    if (!_c) {
      _b.insertAfter(_7)
    }
  }
  function _10(_11) {
    const _12 = $.data(_11, 'switchbutton')
    const _13 = _12.options
    const _14 = _12.switchbutton
    const _15 = _14.find('.switchbutton-inner')
    const on = _15.find('.switchbutton-on').html(_13.onText)
    const off = _15.find('.switchbutton-off').html(_13.offText)
    const _16 = _15.find('.switchbutton-handle').html(_13.handleText)
    if (_13.reversed) {
      off.prependTo(_15)
      on.insertAfter(_16)
    } else {
      on.prependTo(_15)
      off.insertAfter(_16)
    }
    _14.find('.switchbutton-value')._propAttr('checked', _13.checked)
    _14.removeClass('switchbutton-disabled').addClass(_13.disabled ? 'switchbutton-disabled' : '')
    _14.removeClass('switchbutton-reversed').addClass(_13.reversed ? 'switchbutton-reversed' : '')
    _f(_11, _13.checked)
    _17(_11, _13.readonly)
    $(_11).switchbutton('setValue', _13.value)
  }
  function _f(_18, _19, _1a) {
    const _1b = $.data(_18, 'switchbutton')
    const _1c = _1b.options
    _1c.checked = _19
    const _1d = _1b.switchbutton.find('.switchbutton-inner')
    const _1e = _1d.find('.switchbutton-on')
    const _1f = _1c.reversed
      ? _1c.checked
        ? _1c.marginWidth
        : 0
      : _1c.checked
        ? 0
        : _1c.marginWidth
    const dir = _1e.css('float').toLowerCase()
    const css = {}
    css['margin-' + dir] = -_1f + 'px'
    _1a ? _1d.animate(css, 200) : _1d.css(css)
    const _20 = _1d.find('.switchbutton-value')
    const ck = _20.is(':checked')
    $(_18).add(_20)._propAttr('checked', _1c.checked)
    if (ck != _1c.checked) {
      _1c.onChange.call(_18, _1c.checked)
    }
  }
  function _21(_22, _23) {
    const _24 = $.data(_22, 'switchbutton')
    const _25 = _24.options
    const _26 = _24.switchbutton
    const _27 = _26.find('.switchbutton-value')
    if (_23) {
      _25.disabled = true
      $(_22).add(_27).attr('disabled', 'disabled')
      _26.addClass('switchbutton-disabled')
    } else {
      _25.disabled = false
      $(_22).add(_27).removeAttr('disabled')
      _26.removeClass('switchbutton-disabled')
    }
  }
  function _17(_28, _29) {
    const _2a = $.data(_28, 'switchbutton')
    const _2b = _2a.options
    _2b.readonly = _29 == undefined ? true : _29
    _2a.switchbutton
      .removeClass('switchbutton-readonly')
      .addClass(_2b.readonly ? 'switchbutton-readonly' : '')
  }
  function _2c(_2d) {
    const _2e = $.data(_2d, 'switchbutton')
    const _2f = _2e.options
    _2e.switchbutton.unbind('.switchbutton').bind('click.switchbutton', function () {
      if (!_2f.disabled && !_2f.readonly) {
        _f(_2d, _2f.checked ? false : true, true)
      }
    })
  }
  $.fn.switchbutton = function (_30, _31) {
    if (typeof _30 === 'string') {
      return $.fn.switchbutton.methods[_30](this, _31)
    }
    _30 = _30 || {}
    return this.each(function () {
      let _32 = $.data(this, 'switchbutton')
      if (_32) {
        $.extend(_32.options, _30)
      } else {
        _32 = $.data(this, 'switchbutton', {
          options: $.extend(
            {},
            $.fn.switchbutton.defaults,
            $.fn.switchbutton.parseOptions(this),
            _30
          ),
          switchbutton: _1(this)
        })
      }
      _32.options.originalChecked = _32.options.checked
      _10(this)
      _6(this)
      _2c(this)
    })
  }
  $.fn.switchbutton.methods = {
    options: function (jq) {
      const _33 = jq.data('switchbutton')
      return $.extend(_33.options, { value: _33.switchbutton.find('.switchbutton-value').val() })
    },
    resize: function (jq, _34) {
      return jq.each(function () {
        _6(this, _34)
      })
    },
    enable: function (jq) {
      return jq.each(function () {
        _21(this, false)
      })
    },
    disable: function (jq) {
      return jq.each(function () {
        _21(this, true)
      })
    },
    readonly: function (jq, _35) {
      return jq.each(function () {
        _17(this, _35)
      })
    },
    check: function (jq) {
      return jq.each(function () {
        _f(this, true)
      })
    },
    uncheck: function (jq) {
      return jq.each(function () {
        _f(this, false)
      })
    },
    clear: function (jq) {
      return jq.each(function () {
        _f(this, false)
      })
    },
    reset: function (jq) {
      return jq.each(function () {
        const _36 = $(this).switchbutton('options')
        _f(this, _36.originalChecked)
      })
    },
    setValue: function (jq, _37) {
      return jq.each(function () {
        $(this).val(_37)
        $.data(this, 'switchbutton').switchbutton.find('.switchbutton-value').val(_37)
      })
    }
  }
  $.fn.switchbutton.parseOptions = function (_38) {
    const t = $(_38)
    return $.extend(
      {},
      $.parser.parseOptions(_38, [
        'onText',
        'offText',
        'handleText',
        { handleWidth: 'number', reversed: 'boolean' }
      ]),
      {
        value: t.val() || undefined,
        checked: t.attr('checked') ? true : undefined,
        disabled: t.attr('disabled') ? true : undefined,
        readonly: t.attr('readonly') ? true : undefined
      }
    )
  }
  $.fn.switchbutton.defaults = {
    handleWidth: 'auto',
    width: 60,
    height: 26,
    checked: false,
    disabled: false,
    readonly: false,
    reversed: false,
    onText: 'ON',
    offText: 'OFF',
    handleText: '',
    value: 'on',
    onChange: function (_39) {}
  }
})(jQuery)
