let pageSize
const param = {}
let dataT = []

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  // $(".bbTable").css("height",tbHeight*0.75+"px");
  // pageSize = Math.floor((tbHeight)/30)-2;
  // $(".bbTable").css("height","500px");
  // var date = new Date();
  // $("#nianFen").val(date.getFullYear()-1);
  // pageSize = 10;

  search()
})

// 页面初始化
function search() {
  // if(CurrentPage==""||CurrentPage==null){CurrentPage=1;}
  // var date = new Date();

  // param.pageSize=pageSize;
  // param.pageNo=CurrentPage;
  // var index = layer.load();

  param.year = year
  param.sea = sea
  // param.st_tp=$('#maiCang').val();
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterDataFillEFListDetail',
    param,
    function (result) {
      for (let i = 0; i < result.data.length; i++) {
        //去掉月字
        result.data[i].tm2 = result.data[i].tm2.substr(0, 2)
      }
      layui.use(['table', 'util'], function () {
        const table = layui.table,
          util = layui.util

        if (
          sea == '十方院' ||
          sea == '淮淀闸（津塘运河）' ||
          sea == '昆明湖-颐和闸' ||
          sea == '七里海东海-苇海区闸下'
        ) {
          table.render({
            elem: '#test',
            // ,url:basePath+'szybh/ywgz/getSaveWaterDataFillGWListDetail'
            // ,where: {year: year, sea:
            // sea,st_tp:$('#maiCang').val()}
            // ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'tm3',
                  title: '旬'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '实际值(m)'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: {
              layout: ['count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
              //,curr: 5 //设定初始在第 5 页
              groups: 5, //只显示 5 个连续页码
              first: true //显示首页
            }
          })
        } else if (sea == '三家店') {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '径流量（万m3）'
                },
                {
                  field: 'attach_val',
                  edit: 'text',
                  title: '小红门再生水补水量（万m3）'
                },
                {
                  field: 'total_val',
                  edit: 'text',
                  title: '累计生态水量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (sea == '洋河-响水堡') {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '径流量（万m3）'
                },
                {
                  field: 'attach_val',
                  edit: 'text',
                  title: '下游灌区取水量（万m3）'
                },
                {
                  field: 'total_val',
                  edit: 'text',
                  title: '累计生态水量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (sea == '滦县') {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '径流量（万m3）'
                },
                {
                  field: 'attach_val',
                  edit: 'text',
                  title: '岩山渠首取水量（万m3）'
                },
                {
                  field: 'total_val',
                  edit: 'text',
                  title: '累计生态水量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (sea == '桑干河-册田水库') {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '径流量（万m3）'
                },
                {
                  field: 'attach_val',
                  edit: 'text',
                  title: '下游灌区取水量（万m3）'
                },
                {
                  field: 'total_val',
                  edit: 'text',
                  title: '累计生态水量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标（水利部）'
                },
                {
                  field: 'check_resShanXi',
                  edit: 'text',
                  title: '是否达标（山西省）'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (
          sea == '北护城河-松林闸' ||
          sea == '洪泥河首闸' ||
          sea == '洪泥河首闸' ||
          sea == '洪泥河首闸' ||
          sea == '龙凤河故道-老龙凤河闸上' ||
          sea == '衡水湖-千顷洼' ||
          sea == '南庄' ||
          sea == '省界（小觉）' ||
          sea == '关河水库' ||
          sea == '侯壁' ||
          sea == '漳泽水库' ||
          sea == '后湾水库'
        ) {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '径流量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标（水利部）'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (sea == '清河-3个闸') {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'tm3',
                  title: '旬'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '肖家河水位（m）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                },
                {
                  field: 'real_valXQH',
                  edit: 'text',
                  title: '下清河水位（m）'
                },
                {
                  field: 'check_resXQH',
                  edit: 'text',
                  title: '是否达标'
                },
                {
                  field: 'real_valSJF',
                  edit: 'text',
                  title: '沈家坟水位（m）'
                },
                {
                  field: 'check_resSJF',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (sea == '十三陵水库') {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'tm3',
                  title: '旬'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '库水位（m）'
                },
                {
                  field: 'total_val',
                  edit: 'text',
                  title: '上下库蓄水总量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        } else if (
          sea == '桃林口水库（河道二）' ||
          sea == '岗南水库（坝下）' ||
          sea == '黄壁庄水库（坝下）'
        ) {
          table.render({
            elem: '#test',
            cols: [
              [
                {
                  field: 'tm1',
                  width: 80,
                  title: '年'
                },
                {
                  field: 'tm2',
                  title: '月'
                },
                {
                  field: 'tm3',
                  title: '旬'
                },
                {
                  field: 'real_val',
                  edit: 'text',
                  title: '径流量（万m3）'
                },
                {
                  field: 'total_val',
                  edit: 'text',
                  title: '累计生态水量（万m3）'
                },
                {
                  field: 'check_res',
                  edit: 'text',
                  title: '是否达标'
                }
              ]
            ],
            data: result.data,
            page: true
          })
        }

        dataT = layui.table.cache.test
        console.log('aaa', dataT)

        // 监听单元格编辑
        table.on('edit(test)', function (obj) {
          const selector = obj.tr.find('[data-field=' + obj.field + ']')
          const oldtext = $(selector).text()
          if (obj.field == 'rank') {
            const reg = /^\d+$/g // 验证数量只能输入数字
            if (!reg.test(obj.value)) {
              layer.msg('请输入数字')
              obj.tr.find('td[data-field=rank] input').val(oldtext)
              obj.update({
                rank: oldtext
              })
            }
          }
          if (obj.field == 'zval') {
            const reg = /^\d+$/g // 验证数量只能输入数字
            if (!reg.test(obj.value)) {
              layer.msg('请输入数字')
              obj.tr.find('td[data-field=zval] input').val(oldtext)
              obj.update({
                zval: oldtext
              })
            }
          }

          const value = obj.value, // 得到修改后的值
            data = obj.data, // 得到所在行所有键值
            field = obj.field // 得到字段
          // layer.msg('[ID: '+ data.ID +'] ' + field + '
          // 字段更改值为：'+ util.escape(value));
          dataT = layui.table.cache.test
          console.log("table.on('edit(tes ", dataT)
        })
      })
    }
  )

  // layer.close(index);

  // });
}

function saveGW() {
  //	dataT = layui.table.cache["test"];

  console.log('dataTdataT', dataT)
  if (dataT.length > 0) {
    for (let i = 0; i < dataT.length; i++) {
      delete dataT[i].z_f
      delete dataT[i].LAY_TABLE_INDEX
      switch (dataT[i].check_res) {
        case '否':
          dataT[i].check_res = '0'
          break
        case '是':
          dataT[i].check_res = '1'
          break
        case '非考核期':
          dataT[i].check_res = '2'
          break
        case '录入数据不合规':
          dataT[i].check_res = '3'
          break
        case '不参与考核':
          dataT[i].check_res = '5'
          break
        default:
          dataT[i].check_res = ''
      }
    }
    dataT[0].fillId = id // 填报记录的ID，用于更改填报记录

    $.ajax({
      url: basePath + 'szybh/ywgz/dataFillEFSave',
      type: 'POST',
      data: JSON.stringify(dataT),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        alert(data.info)
        // alert(data.info);
        // layer.close(index);
        // parent.search(1);
        // parent.layer.closeAll();
      }
    })
  } else {
    alert('没有数据')
  }
}

function do_support(SWS_NM, SWS_CD) {
  top.layer.open({
    type: 2,
    title: SWS_NM + '水源地详情', // +'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1300px', '650px'],
    content: basePath + 'pages/szybh/ywgz/drinkProtect/map/mapDialogTab.jsp?SWS_CD=' + SWS_CD
  })
}

// 打印方法
function printpage() {
  printData('dydiv', 'dytable')
}

$('#waterReport_btn_generate_excel').click(function () {
  if (document.getElementById('TableData').rows.length <= 0) {
    alert('无下载数据')
  } else {
    excel = new ExcelGen({
      src_id: 'dytable',
      show_header: true
    })
    excel.generate()
  }
})
