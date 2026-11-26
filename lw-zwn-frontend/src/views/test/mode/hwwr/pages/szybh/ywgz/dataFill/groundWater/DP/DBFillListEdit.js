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
  //    param.st_tp=$('#maiCang').val();
  jQuery.getJSON(
    basePath + 'szybh/ywgz/getSaveWaterDataFillDBDetailEdit',
    param,
    function (result) {
      layui.use(['table', 'laydate', 'util'], function () {
        const table = layui.table,
          util = layui.util,
          laydate = layui.laydate
        table.render({
          elem: '#test',
          //  		    ,url:basePath+'szybh/ywgz/getSaveWaterDataFillGWListDetail'
          //  		    ,where: {year: year, mon: mon,st_tp:$('#maiCang').val()}
          //  		   	,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
          cols: [
            [
              //  		      {field:'AD_CD', width:80, title: 'ID' }
              { field: 'yr', width: 100, title: '抽查年份' },
              { field: 'sws_nm', width: 200, title: '水源地名称' },
              { field: 'problem', edit: 'text', title: '发现问题' },
              { field: 'reform', edit: 'text', title: '整改情况' },
              { field: 'assess_res', edit: 'text', title: '评估结果' },
              { field: 'assess_date', edit: 'text', title: '抽查日期', event: 'editStartDate' }

              //  		      ,{field:'Z_F', title: '变幅类型' }
            ]
          ],
          data: result.data,
          page: {
            layout: ['count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
            //,curr: 5 //设定初始在第 5 页
            groups: 5, //只显示 5 个连续页码
            first: 1 //显示首页
          }
        })
        dataT = layui.table.cache.test
        //		  		console.log("getSaveWaterDataFillDBDetailEdit ",dataT);

        //监听单元格编辑
        table.on('edit(test)', function (obj) {
          const selector = obj.tr.find('[data-field=' + obj.field + ']')
          const oldtext = $(selector).text()
          if (obj.field == 'wqg') {
            const reg = /^\d+$/g //验证数量只能输入数字
            if (!reg.test(obj.value)) {
              layer.msg('请输入数字')
              obj.tr.find('td[data-field=wqg] input').val(oldtext)
              obj.update({ wqg: oldtext })
            }
          }
          if (obj.field == 'db_res') {
            const reg = /^\d+$/g //验证数量只能输入数字
            if (!reg.test(obj.value)) {
              layer.msg('请输入数字')
              obj.tr.find('td[data-field=db_res] input').val(oldtext)
              obj.update({ db_res: oldtext })
            }
          }
          dataT = layui.table.cache.test
          //		  		console.log("table.on('edit(tes ",dataT);
        })

        table.on('tool(test)', function (obj) {
          const data = obj.data
          if (obj.event === 'editStartDate') {
            const field = $(this).data('field')
            laydate.render({
              elem: this.firstChild,
              show: true, //直接显示
              closeStop: this,
              done: function (value, date) {
                data[field] = value
                obj.update(data)
                console.log('obj ', obj)
                dataT = layui.table.cache.test
                for (let i = 0; i < dataT.length; i++) {
                  if (dataT[i].sws_cd == obj.data.sws_cd) {
                    dataT[i] = obj.data
                  }
                }
              }
            })
          }
        })
      })
    }
  )

  //        layer.close(index);

  //    });
}

function saveGW() {
  //	var param2={};

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
    dataT[0].fillId = id //填报记录的ID，用于更改填报记录
    $.ajax({
      url: basePath + 'szybh/ywgz/dataFillDBSave',
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
