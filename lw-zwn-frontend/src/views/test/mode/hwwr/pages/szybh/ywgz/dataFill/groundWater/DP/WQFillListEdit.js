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
  param.mon = mon
  // param.st_tp=$('#maiCang').val();
  jQuery.getJSON(basePath + 'szybh/ywgz/getSaveWaterDataFillWQDetail', param, function (result) {
    layui.use(['table', 'util'], function () {
      const table = layui.table,
        util = layui.util
      table.render({
        elem: '#test',
        // ,url:basePath+'szybh/ywgz/getSaveWaterDataFillGWListDetail'
        // ,where: {year: year,
        // mon:
        // mon,st_tp:$('#maiCang').val()}
        // ,cellMinWidth: 80
        // //全局定义常规单元格的最小宽度，layui
        // 2.2.1 新增
        cols: [
          [
            // {field:'AD_CD',
            // width:80,
            // title: 'ID' }
            { field: 'year', width: 80, title: '年份' },
            { field: 'mon', title: '月份' },
            { field: 'provinec_nm', title: '省份' },
            { field: 'sws_nm', title: '水源地名称' },
            // ,{field:'goal_v',title: '目标值'}
            { field: 'wqg', edit: 'text', title: '水质类别' },
            //																,{field : 'review',title : '水质类别',templet: '#selectReview',width : 100}
            { field: 'exceed', edit: 'text', title: '超标项' }
            // ,{field:'Z_F', title:
            // '变幅类型' }
          ]
        ],
        data: result.data,
        page: {
          layout: ['count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
          //,curr: 5 //设定初始在第 5 页
          groups: 5, //只显示 5 个连续页码
          first: 1 //显示首页
        } //														done: function (res, curr, count) {
        //											                console.log("done");
        //
        ////										                    layuiRowspan(['weiduName', 'totalScore'], 1);//支持数组
        ////										                    layer.closeAll('loading');
        //										                    //layuiRowspan("Area", 1, true);
        //										                }
      })
      dataT = layui.table.cache.test
      // console.log(dataT);

      //											form.on('select(watch)', function(data){
      //								                //获取下拉框选中的值
      //								                var score = data.value;
      //								                //获取下拉框对应行的分数单元格
      //								                var scoreId =  $(data.elem).parent().parent().parent().find('[data-field="score"] div')
      //								                //将下拉框选中的值赋给对应的分数栏
      //								                scoreId.text(score);
      //								            });

      // 监听单元格编辑
      table.on('edit(test)', function (obj) {
        const selector = obj.tr.find('[data-field=' + obj.field + ']')
        const oldtext = $(selector).text()
        if (obj.field == 'wqg') {
          if (
            obj.value != 'Ⅰ' &&
            obj.value != 'Ⅱ' &&
            obj.value != 'Ⅲ' &&
            obj.value != 'Ⅳ' &&
            obj.value != 'Ⅴ' &&
            obj.value != 'Ⅵ'
          ) {
            layer.msg('请输入罗马数字')
            obj.tr.find('td[data-field=wqg] input').val(oldtext)
            obj.update({ wqg: oldtext })
          }
        }
        //													if (obj.field == 'wqg') {
        //														let reg = /^\d+$/g; // 验证数量只能输入数字
        //														if (!reg.test(obj.value)) {
        //															layer.msg('请输入数字');
        //															obj.tr.find('td[data-field=wqg] input').val(oldtext);
        //															obj.update({wqg : oldtext});
        //														}
        //													}

        // console.log(obj);
        const value = obj.value, // 得到修改后的值
          data = obj.data, // 得到所在行所有键值
          field = obj.field // 得到字段
        // layer.msg('[ID:
        // '+ data.ID
        // +'] ' + field
        // + ' 字段更改值为：'+
        // util.escape(value));

        dataT = layui.table.cache.test
      })
    })
  })
  //	 $(".layui-table-body").css('overflow','visible');
  //	  $(".layui-table-box").css('overflow','visible');
  //	  $(".layui-table-view").css('overflow','visible');
  // layer.close(index);

  // });
}

function saveGW() {
  const param2 = {}

  // param.uuid=getUid();
  // param2.YR=dataT[0].YR;
  // param2.ad_cd=dataT[0].AD_CD;
  // param2.ad_nm=dataT[0].AD_NM;
  // param2.id=dataT[0].ID;
  // param2.RANK=dataT[0].RANK;
  // param2.AD_CD=dataT[0].YR;
  // param.AD_CD=dataT[0].YR;
  // param.AD_CD=dataT[0].YR;

  console.log('dataTdataT', dataT)

  if (dataT.length > 0) {
    for (let i = 0; i < dataT.length; i++) {
      delete dataT[i].z_f
      delete dataT[i].LAY_TABLE_INDEX
      dataT[0].fillId = id // 填报记录的ID，用于更改填报记录

      switch (dataT[i].wqg) {
        case 'Ⅰ':
          dataT[i].wqg = '1'
          break
        case 'Ⅱ':
          dataT[i].wqg = '2'
          break
        case 'Ⅲ':
          dataT[i].wqg = '3'
          break
        case 'Ⅳ':
          console.log('dattaT')

          dataT[i].wqg = '4'
          break
        case 'Ⅴ':
          dataT[i].wqg = '5'
          break
        case 'Ⅵ':
          dataT[i].wqg = '6'
          break
        default:
          dataT[i].wqg = ''
      }
    }
    $.ajax({
      url: basePath + 'szybh/ywgz/dataFillWQSave',
      type: 'POST',
      data: JSON.stringify(dataT),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        alert(data.info)
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
