var cgrid = {
  grids: {},
  instance: function (tableid, options) {
    const gridobj = {}
    /**
     * ==================== 自定义行为 -起始 ====================
     */
    gridobj.option = options || {
      // 不带ck框
      withCheckBox: false,
      // 带ck框时，禁止多选
      disableMutiSel: false,
      // 是否分页
      hasPage: false,
      // 默认每页条数
      rowNum: 10,
      // 真实表头(用于多行表头情况下)
      realth: null,
      // 需要合并的列索引(不包含隐藏)
      mergeincols: [],
      // 需要合并的行索引(不包含隐藏)
      mergeinrows: [],
      // 最大合并列单元格个数
      mergecolcellsize: 10,
      // 最大合并行单元格个数
      mergerowcellsize: 2,
      // 数字保留小数位数(-1为不设置保留小数位)
      numfixed: -1,
      colTitle: false
    }
    /**
     * ==================== 自定义行为 -结束 ====================
     */
    // 表格数据
    gridobj.data = []
    // 表格分页所有数据(需要生成表格时传入所有数据)
    gridobj.allPageData = []
    // 表格英文列头(不包含隐藏)
    gridobj.titles = []
    //表格中文列头(不包含隐藏)
    gridobj.titles_zh = []
    // 自定义表格
    gridobj.genTable = function (rows) {
      this.data = rows
      let $theads = $('#' + tableid + ' thead tr th[data-field]')
      if (gridobj.option.realth) {
        $theads = gridobj.option.realth
      }
      // 所有表头列名属性
      const colNames = []
      // 需要隐藏的列索引
      const hideColIdx = []
      // 需要加上链接的列
      const aColIdx = []

      for (var i = 0; i < $theads.length; ++i) {
        colNames.push($theads[i].getAttribute('data-field'))
        if ($theads[i].getAttribute('display') == 'hide') {
          hideColIdx.push(i)
        } else {
          //英文表头
          this.titles.push($theads[i].getAttribute('data-field'))
          // 中文表头
          this.titles_zh.push($theads[i].textContent)
        }
        if ($theads[i].getAttribute('link') == 'a') {
          aColIdx.push(i)
        }
      }
      // 按照列名顺序组合一行数据
      let rowsStr = '' // 拼接所有行
      for (var i = 0; i < rows.length; ++i) {
        if (this.option.hasPage && i >= this.option.rowNum) {
          break
        }

        const row = rows[i]
        let rowStr =
          '<tr ondblclick=\'cgrid.grids["' +
          tableid +
          '"].doubleClickRow(' +
          i +
          ")' data-index='" +
          i +
          "' " +
          'onClick=\'cgrid.grids["' +
          tableid +
          '"].oneClickRow(' +
          i +
          ")' data-index='" +
          i +
          "'>" // 拼接一行
        // 判断是否带勾选框
        if (this.option.withCheckBox) {
          rowStr +=
            '<td><input onclick=\'cgrid.grids["' +
            tableid +
            '"].ckCheck(' +
            i +
            ")' type='checkbox' class='ckb'></td>"
        }
        for (let j = 0; j < colNames.length; ++j) {
          if (row[colNames[j]] || row[colNames[j]] == 0) {
            // 是否增加链接
            if (aColIdx.indexOf(j) >= 0) {
              rowStr +=
                "<td style=''><a href='javascript:cgrid.grids[\"" +
                tableid +
                '"].colLinkClick(' +
                i +
                ',' +
                j +
                ")'>" +
                row[colNames[j]] +
                '</a></td>'
            } else {
              const cellVal = row[colNames[j]]
              // 判断保留小数位
              if (gridobj.option.numfixed > -1 && !isNaN(parseFloat(cellVal))) {
                // 去除小数点后的0
                const tempnum = Math.pow(10, gridobj.option.numfixed)
                if (this.option.colTitle) {
                  rowStr +=
                    "<td style='' title='" +
                    cellVal +
                    "'>" +
                    (parseFloat(cellVal).toFixed(gridobj.option.numfixed) * tempnum) / tempnum +
                    '</td>'
                } else {
                  rowStr +=
                    "<td style='' title=''>" +
                    (parseFloat(cellVal).toFixed(gridobj.option.numfixed) * tempnum) / tempnum +
                    '</td>'
                }
              } else if (this.option.colTitle) {
                rowStr += "<td style='' title='" + cellVal + "'>" + cellVal + '</td>'
              } else {
                rowStr += "<td style='' title=''>" + cellVal + '</td>'
              }
            }
          } else {
            rowStr += "<td style=''></td>"
          }
        }
        rowStr += '</tr>'
        rowsStr += rowStr
      }
      $('#' + tableid + ' tbody').empty()
      $('#' + tableid + ' tbody').append(rowsStr)

      // 合并列中的单元格
      if (gridobj.option.mergeincols && gridobj.option.mergeincols.length > 0) {
        for (var i = 0; i < gridobj.option.mergeincols.length; ++i) {
          gridobj.rowspan(gridobj.option.mergeincols[i])
        }
      }

      // 合并行中的单元格
      if (gridobj.option.mergeinrows && gridobj.option.mergeinrows.length > 0) {
        for (var i = 0; i < gridobj.option.mergeinrows.length; ++i) {
          gridobj.colspan(gridobj.option.mergeinrows[i], gridobj.option.mergerowcellsize)
        }
      }

      // 隐藏所有需要隐藏的列
      for (var i = 0; i < hideColIdx.length; ++i) {
        if (this.option.withCheckBox) {
          // 带ck选择框的需要索引加1
          $('#' + tableid + ' tr')
            .find('td:eq(' + (hideColIdx[i] + 1) + ')')
            .hide()
        } else {
          $('#' + tableid + ' tr')
            .find('td:eq(' + hideColIdx[i] + ')')
            .hide()
        }
      }
      // 表格加载完毕
      gridobj.finished()
    }

    // 合并指定列, 其中相同的单元格
    gridobj.rowspan = function (table_colnum) {
      table_firsttd = ''
      table_currenttd = ''
      table_SpanNum = 0
      colnum_Obj = $('#' + tableid + ' tr td:nth-child(' + table_colnum + ')')
      //
      let mergesize = 1
      colnum_Obj.each(function (i) {
        if (i == 0) {
          table_firsttd = $(this)
          table_SpanNum = 1
        } else {
          table_currenttd = $(this)
          if (
            table_firsttd.text() != '' && // 空单元格不合并
            mergesize < gridobj.option.mergecolcellsize && // 最大合并的列单元格个数
            table_firsttd.text() == table_currenttd.text()
          ) {
            table_SpanNum++
            table_currenttd.hide() //remove();
            table_firsttd.attr('rowSpan', table_SpanNum)
            ++mergesize
          } else {
            table_firsttd = $(this)
            table_SpanNum = 1
            mergesize = 1
          }
        }
      })
    }

    // 合并指定行, 其中相同的单元格
    gridobj.colspan = function (table_rownum, table_maxcolnum) {
      if (table_maxcolnum == void 0) {
        table_maxcolnum = 0
      }
      table_firsttd = ''
      table_currenttd = ''
      table_SpanNum = 0
      $(tableid + ' tr:nth-child(' + table_rownum + ')').each(function (i) {
        row_Obj = $(this).children()
        row_Obj.each(function (i) {
          if (i == 0) {
            table_firsttd = $(this)
            table_SpanNum = 1
          } else if (table_maxcolnum > 0 && i > table_maxcolnum) {
            return ''
          } else {
            table_currenttd = $(this)
            if (table_firsttd.text() == table_currenttd.text()) {
              table_SpanNum++
              table_currenttd.hide() //remove();
              table_firsttd.attr('colSpan', table_SpanNum)
            } else {
              table_firsttd = $(this)
              table_SpanNum = 1
            }
          }
        })
      })
    }

    // 双击行事件,需要用自定义事件覆盖
    gridobj.doubleClickRow = function (rownum) {}

    // 单击行事件,需要用自定义事件覆盖
    gridobj.clickRow = function (rownum) {}

    // 获取显示的标题map
    gridobj.getTitleMap = function () {
      const titleMap = {}
      titleMap.titles = this.titles.toString()
      titleMap.titles_zh = this.titles_zh.toString()
      return titleMap
    }

    gridobj.oneClickRow = function (rownum) {
      if (this.isCkChecked) {
        // 重置
        this.isCkChecked = false
      } else {
        this.clickRow(rownum)
      }
    }

    // 链接点击事件
    gridobj.colLinkClick = function (rownum, colnum) {
      debugger
    }

    // 表格加载完毕事件
    gridobj.finished = function () {}

    // 如果传入所有数据后分页,生成当前页数据(从第一页开始计算)
    gridobj.genPage = function (pagenum) {
      if (this.option.hasPage) {
        // 起始行
        const startRow = (pagenum - 1) * this.option.rowNum
        // 结束行
        const endRow = pagenum * this.option.rowNum
        if (startRow > this.allPageData.length) {
          console.log('该页没有数据')
          return
        }
        // 抽取该页数据
        const pagedatas = []
        for (let i = startRow; i < endRow && i < this.allPageData.length; ++i) {
          pagedatas.push(this.allPageData[i])
        }
        this.genTable(pagedatas)
      }
    }

    // 勾选表格所有checkbox
    gridobj.checkAll = function () {
      if (ctable.option.withCheckBox) {
        $('#' + tableid + ' tbody input[type="checkbox"]').prop('checked', true)
      }
    }

    // 勾选表格所有checkbox
    gridobj.uncheckAll = function () {
      if (ctable.option.withCheckBox) {
        $('#' + tableid + ' tbody input[type="checkbox"]').prop('checked', false)
      }
    }

    // 获取所有点选了checkbox的行数据
    gridobj.getChecked = function () {
      if (this.data.length < 1) {
        return []
      }
      const list = []
      const ck = $('#' + tableid + ' tbody input[type="checkbox"]')
      for (let i = 0; i < ck.length; ++i) {
        if (ck[i].checked) {
          list.push(this.data[i])
        }
      }
      return list
    }

    //  点击事件是否是checkbox,还是行单击
    gridobj.isCkChecked = false
    // ck 点击事件
    gridobj.ckCheck = function (rownum) {
      if (!this.option.withCheckBox) {
        return
      }
      this.isCkChecked = true
      // 带勾选框时，禁止多选
      if (this.option.disableMutiSel) {
        const ck = $('#' + tableid + ' tbody input[type="checkbox"]')
        for (let i = 0; i < ck.length; ++i) {
          if (rownum != i && ck[i].checked) {
            ck[i].checked = false
          }
        }
      }
    }

    cgrid.grids[tableid] = gridobj
    return gridobj
  }
}
