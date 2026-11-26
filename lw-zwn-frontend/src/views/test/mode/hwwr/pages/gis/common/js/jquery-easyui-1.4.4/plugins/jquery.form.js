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
  function _1(_2, _3) {
    const _4 = $.data(_2, 'form').options
    $.extend(_4, _3 || {})
    const _5 = $.extend({}, _4.queryParams)
    if (_4.onSubmit.call(_2, _5) == false) {
      return
    }
    $(_2).find('.textbox-text:focus').blur()
    const _6 = 'easyui_frame_' + new Date().getTime()
    const _7 = $('<iframe id=' + _6 + ' name=' + _6 + '></iframe>').appendTo('body')
    _7.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank')
    _7.css({ position: 'absolute', top: -1000, left: -1000 })
    _7.bind('load', cb)
    _8(_5)
    function _8(_9) {
      const _a = $(_2)
      if (_4.url) {
        _a.attr('action', _4.url)
      }
      const t = _a.attr('target'),
        a = _a.attr('action')
      _a.attr('target', _6)
      let _b = $()
      try {
        for (const n in _9) {
          const _c = $('<input type="hidden" name="' + n + '">')
            .val(_9[n])
            .appendTo(_a)
          _b = _b.add(_c)
        }
        _d()
        _a[0].submit()
      } finally {
        _a.attr('action', a)
        t ? _a.attr('target', t) : _a.removeAttr('target')
        _b.remove()
      }
    }
    function _d() {
      const f = $('#' + _6)
      if (!f.length) {
        return
      }
      try {
        const s = f.contents()[0].readyState
        if (s && s.toLowerCase() == 'uninitialized') {
          setTimeout(_d, 100)
        }
      } catch (e) {
        cb()
      }
    }
    let _e = 10
    function cb() {
      const f = $('#' + _6)
      if (!f.length) {
        return
      }
      f.unbind()
      let _f = ''
      try {
        const _10 = f.contents().find('body')
        _f = _10.html()
        if (_f == '') {
          if (--_e) {
            setTimeout(cb, 100)
            return
          }
        }
        const ta = _10.find('>textarea')
        if (ta.length) {
          _f = ta.val()
        } else {
          const pre = _10.find('>pre')
          if (pre.length) {
            _f = pre.html()
          }
        }
      } catch (e) {}
      _4.success(_f)
      setTimeout(function () {
        f.unbind()
        f.remove()
      }, 100)
    }
  }
  function _11(_12, _13) {
    const _14 = $.data(_12, 'form').options
    if (typeof _13 === 'string') {
      const _15 = {}
      if (_14.onBeforeLoad.call(_12, _15) == false) {
        return
      }
      $.ajax({
        url: _13,
        data: _15,
        dataType: 'json',
        success: function (_16) {
          _17(_16)
        },
        error: function () {
          _14.onLoadError.apply(_12, arguments)
        }
      })
    } else {
      _17(_13)
    }
    function _17(_18) {
      const _19 = $(_12)
      for (const _1a in _18) {
        const val = _18[_1a]
        if (!_1b(_1a, val)) {
          if (!_1c(_1a, val)) {
            _19.find('input[name="' + _1a + '"]').val(val)
            _19.find('textarea[name="' + _1a + '"]').val(val)
            _19.find('select[name="' + _1a + '"]').val(val)
          }
        }
      }
      _14.onLoadSuccess.call(_12, _18)
      _19.form('validate')
    }
    function _1b(_1d, val) {
      let cc = $(_12).find('[switchbuttonName="' + _1d + '"]')
      if (cc.length) {
        cc.switchbutton('uncheck')
        cc.each(function () {
          if (_1e($(this).switchbutton('options').value, val)) {
            $(this).switchbutton('check')
          }
        })
        return true
      }
      cc = $(_12).find(
        'input[name="' + _1d + '"][type=radio], input[name="' + _1d + '"][type=checkbox]'
      )
      if (cc.length) {
        cc._propAttr('checked', false)
        cc.each(function () {
          if (_1e($(this).val(), val)) {
            $(this)._propAttr('checked', true)
          }
        })
        return true
      }
      return false
    }
    function _1e(v, val) {
      if (v == String(val) || $.inArray(v, $.isArray(val) ? val : [val]) >= 0) {
        return true
      }
      return false
    }
    function _1c(_1f, val) {
      const _20 = $(_12).find('[textboxName="' + _1f + '"],[sliderName="' + _1f + '"]')
      if (_20.length) {
        for (let i = 0; i < _14.fieldTypes.length; i++) {
          const _21 = _14.fieldTypes[i]
          const _22 = _20.data(_21)
          if (_22) {
            if (_22.options.multiple || _22.options.range) {
              _20[_21]('setValues', val)
            } else {
              _20[_21]('setValue', val)
            }
            return true
          }
        }
      }
      return false
    }
  }
  function _23(_24) {
    $('input,select,textarea', _24).each(function () {
      const t = this.type,
        tag = this.tagName.toLowerCase()
      if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea') {
        this.value = ''
      } else if (t == 'file') {
        const _25 = $(this)
        if (!_25.hasClass('textbox-value')) {
          const _26 = _25.clone().val('')
          _26.insertAfter(_25)
          if (_25.data('validatebox')) {
            _25.validatebox('destroy')
            _26.validatebox()
          } else {
            _25.remove()
          }
        }
      } else if (t == 'checkbox' || t == 'radio') {
        this.checked = false
      } else if (tag == 'select') {
        this.selectedIndex = -1
      }
    })
    const _27 = $(_24)
    const _28 = $.data(_24, 'form').options
    for (let i = _28.fieldTypes.length - 1; i >= 0; i--) {
      const _29 = _28.fieldTypes[i]
      const _2a = _27.find('.' + _29 + '-f')
      if (_2a.length && _2a[_29]) {
        _2a[_29]('clear')
      }
    }
    _27.form('validate')
  }
  function _2b(_2c) {
    _2c.reset()
    const _2d = $(_2c)
    const _2e = $.data(_2c, 'form').options
    for (let i = _2e.fieldTypes.length - 1; i >= 0; i--) {
      const _2f = _2e.fieldTypes[i]
      const _30 = _2d.find('.' + _2f + '-f')
      if (_30.length && _30[_2f]) {
        _30[_2f]('reset')
      }
    }
    _2d.form('validate')
  }
  function _31(_32) {
    const _33 = $.data(_32, 'form').options
    $(_32).unbind('.form')
    if (_33.ajax) {
      $(_32).bind('submit.form', function () {
        setTimeout(function () {
          _1(_32, _33)
        }, 0)
        return false
      })
    }
    $(_32)
      .bind('_change.form', function (e, t) {
        _33.onChange.call(this, t)
      })
      .bind('change.form', function (e) {
        const t = e.target
        if (!$(t).hasClass('textbox-text')) {
          _33.onChange.call(this, t)
        }
      })
    _34(_32, _33.novalidate)
  }
  function _35(_36, _37) {
    _37 = _37 || {}
    const _38 = $.data(_36, 'form')
    if (_38) {
      $.extend(_38.options, _37)
    } else {
      $.data(_36, 'form', {
        options: $.extend({}, $.fn.form.defaults, $.fn.form.parseOptions(_36), _37)
      })
    }
  }
  function _39(_3a) {
    if ($.fn.validatebox) {
      const t = $(_3a)
      t.find('.validatebox-text:not(:disabled)').validatebox('validate')
      const _3b = t.find('.validatebox-invalid')
      _3b.filter(':not(:disabled):first').focus()
      return _3b.length == 0
    }
    return true
  }
  function _34(_3c, _3d) {
    const _3e = $.data(_3c, 'form').options
    _3e.novalidate = _3d
    $(_3c)
      .find('.validatebox-text:not(:disabled)')
      .validatebox(_3d ? 'disableValidation' : 'enableValidation')
  }
  $.fn.form = function (_3f, _40) {
    if (typeof _3f === 'string') {
      this.each(function () {
        _35(this)
      })
      return $.fn.form.methods[_3f](this, _40)
    }
    return this.each(function () {
      _35(this, _3f)
      _31(this)
    })
  }
  $.fn.form.methods = {
    options: function (jq) {
      return $.data(jq[0], 'form').options
    },
    submit: function (jq, _41) {
      return jq.each(function () {
        _1(this, _41)
      })
    },
    load: function (jq, _42) {
      return jq.each(function () {
        _11(this, _42)
      })
    },
    clear: function (jq) {
      return jq.each(function () {
        _23(this)
      })
    },
    reset: function (jq) {
      return jq.each(function () {
        _2b(this)
      })
    },
    validate: function (jq) {
      return _39(jq[0])
    },
    disableValidation: function (jq) {
      return jq.each(function () {
        _34(this, true)
      })
    },
    enableValidation: function (jq) {
      return jq.each(function () {
        _34(this, false)
      })
    }
  }
  $.fn.form.parseOptions = function (_43) {
    const t = $(_43)
    return $.extend({}, $.parser.parseOptions(_43, [{ ajax: 'boolean' }]), {
      url: t.attr('action') ? t.attr('action') : undefined
    })
  }
  $.fn.form.defaults = {
    fieldTypes: [
      'combobox',
      'combotree',
      'combogrid',
      'datetimebox',
      'datebox',
      'combo',
      'datetimespinner',
      'timespinner',
      'numberspinner',
      'spinner',
      'slider',
      'searchbox',
      'numberbox',
      'textbox',
      'switchbutton'
    ],
    novalidate: false,
    ajax: true,
    url: null,
    queryParams: {},
    onSubmit: function (_44) {
      return $(this).form('validate')
    },
    success: function (_45) {},
    onBeforeLoad: function (_46) {},
    onLoadSuccess: function (_47) {},
    onLoadError: function () {},
    onChange: function (_48) {}
  }
})(jQuery)
