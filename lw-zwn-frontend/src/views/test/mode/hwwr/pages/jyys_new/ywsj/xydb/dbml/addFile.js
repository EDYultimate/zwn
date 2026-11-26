const tpmap = new Map() //保存上传
const param = {}
$(function () {
  const date = new Date()
  const year = date.getFullYear()
  /* $("#yr").val(year);*/

  $('#ad_cd').change(function () {
    //改变城市
    initCity()
  })

  $('#city').change(function () {
    //改变县区
    getZd()
  })

  $('#ishwcc').change(function () {
    //改变县区
    getZd()
  })

  //初始化城市和县区
  initCity()
})

function saveDbBase() {
  const param = {}

  const jsonData = []

  const yr = $('#yr').val()
  const batch = $('#batch').val()
  const ad_cd = $('#ad_cd').val()
  const ishwcc = $('#ishwcc').val() //是否海委流域
  const districts = $('#stcds').val()

  if (districts == null || districts == '') {
    alert('县（区）不能为空')
    return
  }

  if (yr == null || yr == '') {
    alert('年份不能为空')
    return
  }

  let districtsList = []

  if (districts.indexOf(',') > -1) {
    districtsList = districts.split(',')
  } else {
    districtsList.push(districts)
  }

  for (let i = 0; i < districtsList.length; i++) {
    const jsonitem = {}
    jsonitem.yr = yr
    jsonitem.ad_cd = ad_cd
    jsonitem.batch = batch
    jsonitem.id = ad_cd + yr + ishwcc
    jsonitem.district = districtsList[i]
    jsonitem.ishwcc = ishwcc
    jsonData.push(jsonitem)
  }
  param.setList = JSON.stringify(jsonData)

  $.ajax({
    url: basePath + '/jyys/ywsj/saveDbmlInfo',
    type: 'POST',
    data: param,
    /*  contentType: "application/json; charset=utf-8",
          dataType: "json",*/
    success: function (data) {
      data = eval('(' + data + ')')
      alert(data.info)
      parent.search(1)
      parent.layer.closeAll()
    }
  })

  /*  jQuery.getJSON(basePath+"/jyys/ywsj/saveDbmlInfo",param,function(data){
        alert(data.info);
        parent.search(1);
        parent.layer.closeAll();
    });*/
}

function closediv() {
  parent.parent.parent.layer.closeAll()
}

//点击站点选择
function dj() {
  if ($('#zd').val() == '请在下方勾选') {
    $('#zd').val('')
    $('#zd').css('color', '#000')
  }
  $('#zdxz').css('display', '')
  getZd()
}

/**
 * 获得当前时间
 */
function getCurrentDate() {
  const currentDate = new Date() //当前时间
  let dayTM = currentDate.getDate()
  let monthTM = currentDate.getMonth() + 1
  const yearTM = currentDate.getFullYear()
  if (parseInt(dayTM) < 10) {
    dayTM = '0' + parseInt(dayTM)
  }
  if (parseInt(monthTM) < 10) {
    monthTM = '0' + parseInt(monthTM)
  }
  return yearTM + '-' + monthTM + '-' + dayTM
}

function initCity() {
  $('#city').empty()
  $('#zd').val('请在下方勾选')
  let cityhtml
  const param = {}
  param.ad_cd = $('#ad_cd').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getCityInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          cityhtml += "<option value='" + dataList[i].AD_CD + "'>" + dataList[i].AD_NM + '</option>'
        }
      }
    }
    $('#city').html(cityhtml)

    getZd()
  })
}

//获取县区
function getZd() {
  const cd = $('#stcdCheck').val()
  //查询全部站点
  const param = {}
  param.ad_cd = $('#city').val()
  param.ishwcc = $('#ishwcc').val()
  let data2
  jQuery.getJSON(basePath + 'jyys/ywsj/getDistrictInfo', param, function (data1) {
    /* var data = data1.rows;
         data2 = data1.rows;*/
    $('#zdxx').empty()

    if (data1.list != '' && data1.list.length > 0) {
      const data = data1.list
      data2 = data1.list
      /*var data=[{"stcd":"30600200","ad_nm":"市区","ad_cd":"120100","st_nm":"耳闸(闸上)"},
                                 {"stcd":"30600950","ad_nm":"市区","ad_cd":"120100","st_nm":"二道闸"}]*/
      let czStr = ''
      czStr += "<div style='width: 100%;font-size: 12px;margin-top: 5px;line-height: 30px;'>"
      for (var i = 0; i < data.length; i++) {
        const map = data[i]
        czStr +=
          "<div style='float:left;width:110px;margin-left: 5px; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;>"
        czStr +=
          "<label style=''><input type='checkbox'  style='width:16px;height:14px;'  value='" +
          map.AD_CD +
          "'   class='" +
          map.AD_NM +
          "'    name='czCheck'   /><span style='cursor: pointer' id='" +
          map.AD_CD +
          "' title='" +
          map.AD_NM +
          "'>" +
          map.AD_NM +
          '</span></label>'
        czStr += '</div>'
      }
      czStr += '</div>'
      $('' + czStr).appendTo($('#zdxx'))

      if (cd == '') {
      } else {
        let cds = []
        cds = cd.split(',')
        for (var i = 0; i < cds.length; i++) {
          $("input[value='" + cds[i] + "']:checkbox").each(function () {
            $(this).attr('checked', 'true')
          })
        }
      }
    } else {
      alert('所选县（区）不存在，请切换选择条件！')
    }
  })

  $('#qd').click(function () {
    const inputCheck = $("input[name='czCheck']")
    let stcd1s = ''
    let stnm = ''
    let stcdCheck = ''
    const stcd2s = ''
    inputCheck.each(function () {
      if ($(this).attr('checked') == 'checked') {
        stcd1s += "'" + $(this).val() + "',"

        stcdCheck += $(this).val() + ','

        stnm += $(this).attr('class') + ','
      }
    })
    if (stcd1s != '') {
      stcd1s = stcd1s.substring(0, stcd1s.length - 1)
      stcdCheck = stcdCheck.substring(0, stcdCheck.length - 1)
      stnm = stnm.substring(0, stnm.length - 1)
    } else {
      stcd1s = "''"
    }
    stcd1s = '(' + stcd1s + ')'

    $('#zd').val(stnm)
    $('#zd').attr('title', stnm)
    //$("#stcds").val(stcd1s);
    $('#stcds').val(stnm)
    $('#stcdCheck').val(stcdCheck)

    $('#zdxz').css('display', 'none')
    if ($('#zd').val() == '' && data2.length > 0) {
      $('#zd').val('请在下方勾选')
      $('#zd').css('color', '#999999')
    }
  })
  $('#selectAll').click(function () {
    const obj = $("input[name='czCheck']")
    obj.attr('checked', 'checked')
  })
  $('#selectNone').click(function () {
    $("input[name='czCheck']").removeAttr('checked')
  })
}

/*
//模糊查询
$('#zd').bind('keypress',function(event){
    var cd=$("#stcdCheck").val();
    if(event.keyCode == 13) {
        var data2;
        jQuery.getJSON(basePath+"swjc/sqxx/getZd_mh",{"zdlx":$("#zdlx").val(),"ly":"1","stnm":$('#zd').val()}, function (data1) {//模糊查询显示站点
            data2 = data1.rows;
            var data = data1.rows
            $("#zdxx").empty();
            var czStr="";
            czStr+=	"<div style='width: 100%;font-size: 12px;margin-top: 5px;line-height: 30px;'>";
            for(var i=0;i<data.length;i++){
                var map=data[i];
                czStr+=	"<div style='float:left;width:110px;margin-left: 20px; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;>";
                czStr+="<label style=''><input type='checkbox'  value='"+map.stcd+"'   class='"+map.st_nm+"'    name='czCheck'   /><span style='cursor: pointer' id='"+map.stcd+"' title='"+map.st_nm+"'>"+map.st_nm+"</span></label>"
                czStr+="</div>";
            }
            czStr+="</div>";
            $(""+czStr).appendTo($("#zdxx"));

            if(cd==""){

            }else{
                var cds=new Array();
                cds=cd.split(',');
                for(var i=0;i<cds.length;i++){
                    $("input[value='"+cds[i]+"']:checkbox").each(function(){
                        $(this).attr("checked","true");
                    });
                }
            }


        });
        $("#qd").click(function(){
            var inputCheck=$("input[name='czCheck']");
            var stcd1s="";
            var stnm="";
            var stcdCheck="";
            var stcd2s="";
            inputCheck.each(function(){
                if($(this).attr("checked")=="checked"){
                    stcd1s+="'"+$(this).val()+"',";

                    stcdCheck+= $(this).val()+","

                    stnm+=$(this).attr("class")+ ",";
                }
            });
            if(stcd1s!=""){
                stcd1s=stcd1s.substring(0, stcd1s.length-1);
                stcdCheck=stcdCheck.substring(0, stcdCheck.length-1);
                stnm=stnm.substring(0, stnm.length-1);
            } else {
                stcd1s="''";
            }
            stcd1s="("+stcd1s+")";
            $("#zd").val(stnm);
            $("#zd").attr("title",stnm);
            $("#stcds").val(stcd1s);
            $("#stcdCheck").val(stcdCheck);
            $('#zdxz').css("display","none");
            if($('#zd').val()==""&&data2.length>0){
                $('#zd').val("点击选择");
                $('#zd').css("color","#999999");
            }

        });

        $("#selectAll").click(function(){
            var obj=$("input[name='czCheck']");
            obj.attr("checked","checked");

        });
        $("#selectNone").click(function(){
            $("input[name='czCheck']").removeAttr("checked");
        });
    }
});*/
