/*

var pageSize;
var param={};

$(function(){

    var bodyheight=$(document.body).outerHeight(true);
    var tbHeight = bodyheight-120-$(".titleDiv").height()-$(".M-box").height()-10;
    $(".bbTable").css("height",tbHeight+"px");
    pageSize = Math.floor((tbHeight)/30)-2;


    var date = new Date();
    var year = date.getFullYear();
    $("#yr").val(year);

    search(1);

});

//页面初始化
function search(CurrentPage){
    var tbodyStr="";

    if(CurrentPage==""||CurrentPage==null){CurrentPage=1;}
   /!* param.nm= $("#nm").val();*!/
    param.ishwcc= $("#ishwcc").val();
    param.yr= $("#yr").val();

    param.pageSize=pageSize;
    param.pageNo=CurrentPage;
    var index = layer.load();
    jQuery.getJSON(basePath+"jyys/ywsj/getFytjInfo",param,function(result){
        var data = result.page.list;
        if(data!=null && data.length>0){
            for(var i=0;i<data.length;i++){
                tbodyStr += "<tr>" +
                 /!*   "<td title='"+isNull(data[i].NO)+"' >"+isNull(data[i].NO)+"</td>" +*!/

                    /!* "<td title='"+isNull(data[i].AD_CD)+"'>"+isNull(data[i].AD_CD)+"</td>" +*!/
                    "<td title='"+isNull(data[i].AD_NM)+"'>"+isNull(data[i].AD_NM)+"</td>"+
                    "<td title='"+isNull(data[i].YR)+"'>"+isNull(data[i].YR)+"</td>"+
                    "<td title='"+isNull(data[i].NUM)+"'>"+isNull(data[i].NUM)+"</td>"+
                    "<td title='"+isNull(data[i].DISTRICT)+"' >"+isNull(data[i].DISTRICT)+"</td>" +
                    "</tr>";
            }
            for(var x=data.length;x<pageSize;x++){
                tbodyStr += "<tr>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>";

            }

        }else{
            for(var i=0;i<pageSize;i++){
                tbodyStr += "<tr>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>";

            }
        }
        $("#tbody").empty().append(tbodyStr);
        $('.M-box').pagination({
            pageCount: result.page.pages, //初始化时总页数3页
            current:CurrentPage,
            callback:function(api){
                search(api.getCurrent());
            }
        });
        $(".tolSpan").html("共"+result.page.total+"条");
        $('.M-box').show();
        layer.close(index);
    });
}
*/
