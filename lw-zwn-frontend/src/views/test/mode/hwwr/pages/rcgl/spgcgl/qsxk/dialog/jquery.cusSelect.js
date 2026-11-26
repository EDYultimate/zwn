;(function ($) {
  $.fn.extend({
    targetid: null,
    /**
     *	$arg options 下拉信息
     *	$arg checked_arr 选中项
     */
    cusSelect: function (options, checked_arr, onlyone, infos, ckInfo) {
      let select_box = null
      const tops = 89
      //			var tops = $(this).position().top;
      const left = $(this).position().left
      const height = $(this).height() + tops + 8

      const bottomOffset =
        $(window).height() - ($(this).height() + ($(this).offset().top - $(document).scrollTop()))

      const width = $(this).width()

      this.targetid = $(this)[0].id
      if (select_box == null) {
        if (
          $(this).next() &&
          $('#' + this.targetid).next().length > 0 &&
          $('#' + this.targetid).next()[0].id === this.targetid + '_box'
        ) {
          $(this).next().remove()
          $(this).val('')
        }
        select_box = $(
          "<div id='" +
            this.targetid +
            "_box' class='select_multi' style='position:absolute;left:" +
            left +
            'px; top:' +
            height +
            'px; z-index:999; display:none; min-width: ' +
            width +
            "px'></div>"
        ).insertAfter($(this))

        for (const i in options) {
          const n = options[i]
          let checked = ''
          if ($.inArray(n.id, checked_arr) >= 0) {
            checked = 'checked'
          }

          let str =
            "<div class='select_multi_li'><input class='area_check' name='eara[]' type='checkbox' style='width:20px;' value='" +
            n.id +
            "' " +
            checked
          if (n.hasOwnProperty('disabled') && n.disabled) {
            str += " disabled='disabled' "
          }
          str += "><span class='vspan'>" + n.name + '</span>'

          /**
           * =======================================================================
           */
          // if (infos && infos.hasOwnProperty(n.id)) {
          // 	str += "<span class='rspan' ";
          // 	if (ckInfo && ckInfo instanceof Function) {
          // 		str += " onclick='ckInfo(\""+n.id+"\", this)'";
          // 	}
          // 	str +=  ">"+infos[n.id]+"</span>";
          // }
          str += "<span class='rspan' "
          if (ckInfo && ckInfo instanceof Function) {
            str += ' onclick=\'ckInfo("' + n.id + '", this)\''
          }
          str += '>'
          if (infos && infos.hasOwnProperty(n.id)) {
            str += infos[n.id]
          }
          str += '</span>'

          /**
           * =======================================================================
           */
          str += '</div>'

          check_div = $(str).appendTo(select_box)
          check_box = check_div.children()
          check_box.click(function (e) {
            temp = ''
            const div_id = this.parentNode.parentNode.id
            // 只选择一个
            if (onlyone) {
              if (!$(this).prop('checked')) {
              } else {
                // 取消所有选择
                $('#' + div_id + ' input:checked').each(function (i) {
                  $(this).attr('checked', false)
                })
                $(this).attr('checked', true)
              }
            }

            $('#' + div_id + ' input:checked').each(function (i) {
              if (i == 0) {
                temp = $(this).next('span').html()
              } else {
                temp += '、' + $(this).next('span').html()
              }
            })
            $(this).attr('title', temp)
          })
        }
      } else {
        select_box.toggle()
      }

      if (select_box.height() > bottomOffset - 12) {
        select_box.height(bottomOffset - 12)
        select_box.attr('overflow-y', 'auto')
      }

      //点击显示
      $(this).click(function (e) {
        select_box.show()
        e.stopPropagation()

        const sels = $(this).getSelected()
        $(this).val(sels.vals.toString())
      })

      $('#' + this.targetid + '_box .area_check').click(function (e) {
        const parentId = e.target.parentNode.parentNode.id.replace('_box', '')
        const sels = $('#' + parentId).getSelected()
        $('#' + parentId).val(sels.vals.toString())
      })
    },
    getItemById: function (options, id) {
      let res = {}
      options.some(function (i) {
        if (i.hasOwnProperty('id') && i.id === id) {
          res = i
          return res
        }
      })
      return res
    },
    getInfos: function () {
      const infos = {}
      const list = $('#' + $(this)[0].id + '_box .select_multi_li')
      for (let i = 0; i < list.length; ++i) {
        const item = list[i]
        const id = $(item).children()[0].value
        const val = $($(item).children()[2]).text()
        infos[id] = val
      }
      return infos
    },
    getSelected: function () {
      const list = $('#' + $(this)[0].id + '_box .select_multi_li input')
      const sels = {
        ids: [],
        vals: []
      }
      for (let i = 0; list.length; ++i) {
        const checked = $(list[i]).attr('checked')
        const item = $(list[i])
        if (!item || item.length < 1) {
          break
        }
        if (checked === 'checked') {
          sels.ids.push(item.val())
          var l = item.parent().children()
          var s = '',
            sp = '',
            k = 0
          l.each(function (i) {
            s += sp + l[i].innerText
            ++k
            if (k > 1) {
              sp = ' '
            }
          })
          sels.vals.push(s)
        }
      }
      return sels
    },
    setCkboxDisable: function (ids) {
      if (ids === null || ids === undefined || !(ids instanceof Array) || ids.length < 1) {
        return
      }
      debugger
    }
  })

  $(this).click(function (e) {
    let status = 0
    element_show = ['click_box', 'area_check', 'select_multi_li', 'vspan', 'rspan']
    if (element_show.indexOf(e.target.className) >= 0) {
      status = 1
    }
    if (!status) {
      $('.select_multi').hide()
    }
    e.stopPropagation()
  })
})(jQuery)
