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
    $(_2).addClass('textbox-f').hide()
    const _3 = $(
      '<span class="textbox">' +
        '<input class="textbox-text" autocomplete="off">' +
        '<input type="hidden" class="textbox-value">' +
        '</span>'
    ).insertAfter(_2)
    const _4 = $(_2).attr('name')
    if (_4) {
      _3.find('input.textbox-value').attr('name', _4)
      $(_2).removeAttr('name').attr('textboxName', _4)
    }
    return _3
  }
  function _5(_6) {
    const _7 = $.data(_6, 'textbox')
    const _8 = _7.options
    const tb = _7.textbox
    tb.find('.textbox-text').remove()
    if (_8.multiline) {
      $('<textarea class="textbox-text" autocomplete="off"></textarea>').prependTo(tb)
    } else {
      $('<input type="' + _8.type + '" class="textbox-text" autocomplete="off">').prependTo(tb)
    }
    tb.find('.textbox-addon').remove()
    const bb = _8.icons ? $.extend(true, [], _8.icons) : []
    if (_8.iconCls) {
      bb.push({ iconCls: _8.iconCls, disabled: true })
    }
    if (bb.length) {
      const bc = $('<span class="textbox-addon"></span>').prependTo(tb)
      bc.addClass('textbox-addon-' + _8.iconAlign)
      for (let i = 0; i < bb.length; i++) {
        bc.append(
          '<a href="javascript:void(0)" class="textbox-icon ' +
            bb[i].iconCls +
            '" icon-index="' +
            i +
            '" tabindex="-1"></a>'
        )
      }
    }
    tb.find('.textbox-button').remove()
    if (_8.buttonText || _8.buttonIcon) {
      const _9 = $('<a href="javascript:void(0)" class="textbox-button"></a>').prependTo(tb)
      _9.addClass('textbox-button-' + _8.buttonAlign).linkbutton({
        text: _8.buttonText,
        iconCls: _8.buttonIcon
      })
    }
    _a(_6, _8.disabled)
    _b(_6, _8.readonly)
  }
  function _c(_d) {
    const tb = $.data(_d, 'textbox').textbox
    tb.find('.textbox-text').validatebox('destroy')
    tb.remove()
    $(_d).remove()
  }
  function _e(_f, _10) {
    const _11 = $.data(_f, 'textbox')
    const _12 = _11.options
    const tb = _11.textbox
    const _13 = tb.parent()
    if (_10) {
      _12.width = _10
    }
    if (isNaN(parseInt(_12.width))) {
      const c = $(_f).clone()
      c.css('visibility', 'hidden')
      c.insertAfter(_f)
      _12.width = c.outerWidth()
      c.remove()
    }
    const _14 = tb.is(':visible')
    if (!_14) {
      tb.appendTo('body')
    }
    const _15 = tb.find('.textbox-text')
    const btn = tb.find('.textbox-button')
    const _16 = tb.find('.textbox-addon')
    const _17 = _16.find('.textbox-icon')
    tb._size(_12, _13)
    btn.linkbutton('resize', { height: tb.height() })
    btn.css({
      left: _12.buttonAlign == 'left' ? 0 : '',
      right: _12.buttonAlign == 'right' ? 0 : ''
    })
    _16.css({
      left: _12.iconAlign == 'left' ? (_12.buttonAlign == 'left' ? btn._outerWidth() : 0) : '',
      right: _12.iconAlign == 'right' ? (_12.buttonAlign == 'right' ? btn._outerWidth() : 0) : ''
    })
    _17.css({ width: _12.iconWidth + 'px', height: tb.height() + 'px' })
    _15.css({
      paddingLeft: _f.style.paddingLeft || '',
      paddingRight: _f.style.paddingRight || '',
      marginLeft: _18('left'),
      marginRight: _18('right')
    })
    if (_12.multiline) {
      _15.css({
        paddingTop: _f.style.paddingTop || '',
        paddingBottom: _f.style.paddingBottom || ''
      })
      _15._outerHeight(tb.height())
    } else {
      const _19 = Math.floor((tb.height() - _15.height()) / 2)
      _15.css({ paddingTop: _19 + 'px', paddingBottom: _19 + 'px' })
    }
    _15._outerWidth(tb.width() - _17.length * _12.iconWidth - btn._outerWidth())
    if (!_14) {
      tb.insertAfter(_f)
    }
    _12.onResize.call(_f, _12.width, _12.height)
    function _18(_1a) {
      return (
        (_12.iconAlign == _1a ? _16._outerWidth() : 0) +
        (_12.buttonAlign == _1a ? btn._outerWidth() : 0)
      )
    }
  }
  function _1b(_1c) {
    const _1d = $(_1c).textbox('options')
    const _1e = $(_1c).textbox('textbox')
    _1e.validatebox(
      $.extend({}, _1d, {
        deltaX: $(_1c).textbox('getTipX'),
        onBeforeValidate: function () {
          const box = $(this)
          if (!box.is(':focus')) {
            _1d.oldInputValue = box.val()
            box.val(_1d.value)
          }
        },
        onValidate: function (_1f) {
          const box = $(this)
          if (_1d.oldInputValue != undefined) {
            box.val(_1d.oldInputValue)
            _1d.oldInputValue = undefined
          }
          const tb = box.parent()
          if (_1f) {
            tb.removeClass('textbox-invalid')
          } else {
            tb.addClass('textbox-invalid')
          }
        }
      })
    )
  }
  function _20(_21) {
    const _22 = $.data(_21, 'textbox')
    const _23 = _22.options
    const tb = _22.textbox
    const _24 = tb.find('.textbox-text')
    _24.attr('placeholder', _23.prompt)
    _24.unbind('.textbox')
    if (!_23.disabled && !_23.readonly) {
      _24
        .bind('blur.textbox', function (e) {
          if (!tb.hasClass('textbox-focused')) {
            return
          }
          _23.value = $(this).val()
          if (_23.value == '') {
            $(this).val(_23.prompt).addClass('textbox-prompt')
          } else {
            $(this).removeClass('textbox-prompt')
          }
          tb.removeClass('textbox-focused')
        })
        .bind('focus.textbox', function (e) {
          if (tb.hasClass('textbox-focused')) {
            return
          }
          if ($(this).val() != _23.value) {
            $(this).val(_23.value)
          }
          $(this).removeClass('textbox-prompt')
          tb.addClass('textbox-focused')
        })
      for (const _25 in _23.inputEvents) {
        _24.bind(_25 + '.textbox', { target: _21 }, _23.inputEvents[_25])
      }
    }
    const _26 = tb.find('.textbox-addon')
    _26.unbind().bind('click', { target: _21 }, function (e) {
      const _27 = $(e.target).closest('a.textbox-icon:not(.textbox-icon-disabled)')
      if (_27.length) {
        const _28 = parseInt(_27.attr('icon-index'))
        const _29 = _23.icons[_28]
        if (_29 && _29.handler) {
          _29.handler.call(_27[0], e)
          _23.onClickIcon.call(_21, _28)
        }
      }
    })
    _26.find('.textbox-icon').each(function (_2a) {
      const _2b = _23.icons[_2a]
      const _2c = $(this)
      if (!_2b || _2b.disabled || _23.disabled || _23.readonly) {
        _2c.addClass('textbox-icon-disabled')
      } else {
        _2c.removeClass('textbox-icon-disabled')
      }
    })
    const btn = tb.find('.textbox-button')
    btn.unbind('.textbox').bind('click.textbox', function () {
      if (!btn.linkbutton('options').disabled) {
        _23.onClickButton.call(_21)
      }
    })
    btn.linkbutton(_23.disabled || _23.readonly ? 'disable' : 'enable')
    tb.unbind('.textbox').bind('_resize.textbox', function (e, _2d) {
      if ($(this).hasClass('easyui-fluid') || _2d) {
        _e(_21)
      }
      return false
    })
  }
  function _a(_2e, _2f) {
    const _30 = $.data(_2e, 'textbox')
    const _31 = _30.options
    const tb = _30.textbox
    if (_2f) {
      _31.disabled = true
      $(_2e).attr('disabled', 'disabled')
      tb.addClass('textbox-disabled')
      tb.find('.textbox-text,.textbox-value').attr('disabled', 'disabled')
    } else {
      _31.disabled = false
      tb.removeClass('textbox-disabled')
      $(_2e).removeAttr('disabled')
      tb.find('.textbox-text,.textbox-value').removeAttr('disabled')
    }
  }
  function _b(_32, _33) {
    const _34 = $.data(_32, 'textbox')
    const _35 = _34.options
    _35.readonly = _33 == undefined ? true : _33
    _34.textbox.removeClass('textbox-readonly').addClass(_35.readonly ? 'textbox-readonly' : '')
    const _36 = _34.textbox.find('.textbox-text')
    _36.removeAttr('readonly')
    if (_35.readonly || !_35.editable) {
      _36.attr('readonly', 'readonly')
    }
  }
  $.fn.textbox = function (_37, _38) {
    if (typeof _37 === 'string') {
      const _39 = $.fn.textbox.methods[_37]
      if (_39) {
        return _39(this, _38)
      }
      return this.each(function () {
        const _3a = $(this).textbox('textbox')
        _3a.validatebox(_37, _38)
      })
    }
    _37 = _37 || {}
    return this.each(function () {
      let _3b = $.data(this, 'textbox')
      if (_3b) {
        $.extend(_3b.options, _37)
        if (_37.value != undefined) {
          _3b.options.originalValue = _37.value
        }
      } else {
        _3b = $.data(this, 'textbox', {
          options: $.extend({}, $.fn.textbox.defaults, $.fn.textbox.parseOptions(this), _37),
          textbox: _1(this)
        })
        _3b.options.originalValue = _3b.options.value
      }
      _5(this)
      _20(this)
      _e(this)
      _1b(this)
      $(this).textbox('initValue', _3b.options.value)
    })
  }
  $.fn.textbox.methods = {
    options: function (jq) {
      return $.data(jq[0], 'textbox').options
    },
    cloneFrom: function (jq, _3c) {
      return jq.each(function () {
        const t = $(this)
        if (t.data('textbox')) {
          return
        }
        if (!$(_3c).data('textbox')) {
          $(_3c).textbox()
        }
        const _3d = t.attr('name') || ''
        t.addClass('textbox-f').hide()
        t.removeAttr('name').attr('textboxName', _3d)
        const _3e = $(_3c).next().clone()
.insertAfter(t)
        _3e.find('input.textbox-value').attr('name', _3d)
        $.data(this, 'textbox', {
          options: $.extend(true, {}, $(_3c).textbox('options')),
          textbox: _3e
        })
        const _3f = $(_3c).textbox('button')
        if (_3f.length) {
          t.textbox('button').linkbutton($.extend(true, {}, _3f.linkbutton('options')))
        }
        _20(this)
        _1b(this)
      })
    },
    textbox: function (jq) {
      return $.data(jq[0], 'textbox').textbox.find('.textbox-text')
    },
    button: function (jq) {
      return $.data(jq[0], 'textbox').textbox.find('.textbox-button')
    },
    destroy: function (jq) {
      return jq.each(function () {
        _c(this)
      })
    },
    resize: function (jq, _40) {
      return jq.each(function () {
        _e(this, _40)
      })
    },
    disable: function (jq) {
      return jq.each(function () {
        _a(this, true)
        _20(this)
      })
    },
    enable: function (jq) {
      return jq.each(function () {
        _a(this, false)
        _20(this)
      })
    },
    readonly: function (jq, _41) {
      return jq.each(function () {
        _b(this, _41)
        _20(this)
      })
    },
    isValid: function (jq) {
      return jq.textbox('textbox').validatebox('isValid')
    },
    clear: function (jq) {
      return jq.each(function () {
        $(this).textbox('setValue', '')
      })
    },
    setText: function (jq, _42) {
      return jq.each(function () {
        const _43 = $(this).textbox('options')
        const _44 = $(this).textbox('textbox')
        _42 = _42 == undefined ? '' : String(_42)
        if ($(this).textbox('getText') != _42) {
          _44.val(_42)
        }
        _43.value = _42
        if (!_44.is(':focus')) {
          if (_42) {
            _44.removeClass('textbox-prompt')
          } else {
            _44.val(_43.prompt).addClass('textbox-prompt')
          }
        }
        $(this).textbox('validate')
      })
    },
    initValue: function (jq, _45) {
      return jq.each(function () {
        const _46 = $.data(this, 'textbox')
        _46.options.value = ''
        $(this).textbox('setText', _45)
        _46.textbox.find('.textbox-value').val(_45)
        $(this).val(_45)
      })
    },
    setValue: function (jq, _47) {
      return jq.each(function () {
        const _48 = $.data(this, 'textbox').options
        const _49 = $(this).textbox('getValue')
        $(this).textbox('initValue', _47)
        if (_49 != _47) {
          _48.onChange.call(this, _47, _49)
          $(this).closest('form').trigger('_change', [this])
        }
      })
    },
    getText: function (jq) {
      const _4a = jq.textbox('textbox')
      if (_4a.is(':focus')) {
        return _4a.val()
      }
      return jq.textbox('options').value
    },
    getValue: function (jq) {
      return jq.data('textbox').textbox.find('.textbox-value').val()
    },
    reset: function (jq) {
      return jq.each(function () {
        const _4b = $(this).textbox('options')
        $(this).textbox('setValue', _4b.originalValue)
      })
    },
    getIcon: function (jq, _4c) {
      return jq.data('textbox').textbox.find('.textbox-icon:eq(' + _4c + ')')
    },
    getTipX: function (jq) {
      const _4d = jq.data('textbox')
      const _4e = _4d.options
      const tb = _4d.textbox
      const _4f = tb.find('.textbox-text')
      const _50 = tb.find('.textbox-addon')._outerWidth()
      const _51 = tb.find('.textbox-button')._outerWidth()
      if (_4e.tipPosition == 'right') {
        return (_4e.iconAlign == 'right' ? _50 : 0) + (_4e.buttonAlign == 'right' ? _51 : 0) + 1
      }
      if (_4e.tipPosition == 'left') {
        return (_4e.iconAlign == 'left' ? -_50 : 0) + (_4e.buttonAlign == 'left' ? -_51 : 0) - 1
      }
      return (_50 / 2) * (_4e.iconAlign == 'right' ? 1 : -1)
    }
  }
  $.fn.textbox.parseOptions = function (_52) {
    const t = $(_52)
    return $.extend(
      {},
      $.fn.validatebox.parseOptions(_52),
      $.parser.parseOptions(_52, [
        'prompt',
        'iconCls',
        'iconAlign',
        'buttonText',
        'buttonIcon',
        'buttonAlign',
        { multiline: 'boolean', editable: 'boolean', iconWidth: 'number' }
      ]),
      {
        value: t.val() || undefined,
        type: t.attr('type') ? t.attr('type') : undefined,
        disabled: t.attr('disabled') ? true : undefined,
        readonly: t.attr('readonly') ? true : undefined
      }
    )
  }
  $.fn.textbox.defaults = $.extend({}, $.fn.validatebox.defaults, {
    width: 'auto',
    height: 22,
    prompt: '',
    value: '',
    type: 'text',
    multiline: false,
    editable: true,
    disabled: false,
    readonly: false,
    icons: [],
    iconCls: null,
    iconAlign: 'right',
    iconWidth: 18,
    buttonText: '',
    buttonIcon: null,
    buttonAlign: 'right',
    inputEvents: {
      blur: function (e) {
        const t = $(e.data.target)
        const _53 = t.textbox('options')
        t.textbox('setValue', _53.value)
      },
      keydown: function (e) {
        if (e.keyCode == 13) {
          const t = $(e.data.target)
          t.textbox('setValue', t.textbox('getText'))
        }
      }
    },
    onChange: function (_54, _55) {},
    onResize: function (_56, _57) {},
    onClickButton: function () {},
    onClickIcon: function (_58) {}
  })
})(jQuery)
