let pageSize
const param = {}
let dataT = []

$(function () {
  const bodyheight = $(document.body).outerHeight(true)
  const tbHeight = bodyheight - 120 - $('.titleDiv').height() - $('.M-box').height() - 10
  //    $(".bbTable").css("height",tbHeight*0.75+"px");
  //    pageSize = Math.floor((tbHeight)/30)-2;
  //  $(".bbTable").css("height","500px");
  //    var date = new Date();
  //	$("#nianFen").val(date.getFullYear()-1);
  //    pageSize = 10;

  search()
})

//页面初始化
function search() {
  //    if(CurrentPage==""||CurrentPage==null){CurrentPage=1;}
  //    var date = new Date();

  //    param.pageSize=pageSize;
  //    param.pageNo=CurrentPage;
  //    var index = layer.load();
  param.year = year
  param.sea = sea
  //    param.st_tp=$('#maiCang').val();
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

        table.render({
          elem: '#test',
          //  		    ,url:basePath+'szybh/ywgz/getSaveWaterDataFillGWListDetail'
          //  		    ,where: {year: year, sea: sea,st_tp:$('#maiCang').val()}
          //  		   	,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
          cols: [
            [
              //  		      {field:'AD_CD', width:80, title: 'ID' }
              { field: 'tm1', width: 80, title: '年' },
              { field: 'tm2', title: '月' },
              { field: 'tm3', title: '旬' },
              { field: 'real_val', edit: 'text', title: '实际值(m)' },
              { field: 'check_res', edit: 'text', title: '是否达标' }
              //  		      ,{field:'Z_F', title: '变幅类型' }
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
        dataT = layui.table.cache.test

        //监听单元格编辑
        table.on('edit(test)', function (obj) {
          const selector = obj.tr.find('[data-field=' + obj.field + ']')
          const oldtext = $(selector).text()
          if (obj.field == 'rank') {
            const reg = /^\d+$/g //验证数量只能输入数字
            if (!reg.test(obj.value)) {
              layer.msg('请输入数字')
              obj.tr.find('td[data-field=rank] input').val(oldtext)
              obj.update({ rank: oldtext })
            }
          }
          if (obj.field == 'zval') {
            const reg = /^\d+$/g //验证数量只能输入数字
            if (!reg.test(obj.value)) {
              layer.msg('请输入数字')
              obj.tr.find('td[data-field=zval] input').val(oldtext)
              obj.update({ zval: oldtext })
            }
          }

          //	  			console.log(obj);
          const value = obj.value, //得到修改后的值
            data = obj.data, //得到所在行所有键值
            field = obj.field //得到字段
          //	  		    layer.msg('[ID: '+ data.ID +'] ' + field + ' 字段更改值为：'+ util.escape(value));

          dataT = layui.table.cache.test
        })
      })
    }
  )

  //        layer.close(index);

  //    });
}

function saveGW() {
  const param2 = {}

  //	param.uuid=getUid();
  //	param2.YR=dataT[0].YR;
  //    param2.ad_cd=dataT[0].AD_CD;
  //    param2.ad_nm=dataT[0].AD_NM;
  //    param2.id=dataT[0].ID;
  //    param2.RANK=dataT[0].RANK;
  //    param2.AD_CD=dataT[0].YR;
  //    param.AD_CD=dataT[0].YR;
  //    param.AD_CD=dataT[0].YR;

  console.log('dataTdataT', dataT)

  if (dataT.length > 0) {
    for (let i = 0; i < dataT.length; i++) {
      delete dataT[i].z_f
      delete dataT[i].LAY_TABLE_INDEX
    }
    $.ajax({
      url: basePath + 'szybh/ywgz/dataFillGWSave',
      type: 'POST',
      data: JSON.stringify(dataT),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        alert(data.info)
        //			    	alert(data.info);
        //			    	layer.close(index);
        //					parent.search(1);
        //					parent.layer.closeAll();
      }
    })
  } else {
    alert('没有数据')
  }
}

function do_support(SWS_NM, SWS_CD) {
  top.layer.open({
    type: 2,
    title: SWS_NM + '水源地详情', //+'降水量年趋势统计',
    closeBtn: 1,
    shade: 0.3,
    // maxmin: true,
    area: ['1300px', '650px'],
    content: basePath + 'pages/szybh/ywgz/drinkProtect/map/mapDialogTab.jsp?SWS_CD=' + SWS_CD
  })
}

//打印方法
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
