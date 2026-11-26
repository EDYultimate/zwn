<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title></title>    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	
<!-- 	<link rel="stylesheet" href="<%=basePath%>common/js/elementUI/index.css" type="text/css"> -->
	
	
<!-- 		<link rel="stylesheet" href="<%=basePath %>pages/szybh/ywgz/ecologyFlow/map/ztree/css/demo.css" type="text/css"> -->
<!-- 		    <link rel="stylesheet" href="<%=basePath%>common/css/ztree/zTreeStyle/zTreeStyleCustom.css" type="text/css"> -->
		<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
		    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
		
<!-- 	<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script> -->


<!-- <script type="text/javascript"  src="<%=basePath %>/pages/szybh/rvlkappraise/map/map.js"></script> -->
<!-- <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script> -->
<!-- <script type="text/javascript" src="<%=basePath %>common/js/elementUI/vue.js"></script> -->
<!-- <script type="text/javascript" src="<%=basePath %>common/js/elementUI/index.js"></script> -->
    <link type="text/css" href="<%=basePath %>common/js/layui/seasonSel/css/layui.css" rel="stylesheet" />
<script type="text/javascript" src="<%=basePath %>common/js/layui/seasonSel/layui.js"></script>


	<script type="text/javascript">

	
// 	$(document).ready(function(){
// 		$.fn.zTree.init($("#treeDemo"), setting, zNodes);
// 	});
	var basePath = '<%=basePath%>';
  	<%-- $(function(){
  	
	  		$("#rel_div").click(function(){
		  		$("#modleIframe").attr("src","<%=basePath%>pages/kfly/jsl/ylxx/ylxx.jsp");
		  			
		  		});
	  	  });
  	 --%>	
  	</script>
  	
  	   <style>
  	  thead th {
   			 font-size: 14px;
    		font-weight: bold;
    		color: #333333;
    		background-color: #f5f5f5;
			}
			tbody td {
   			 font-size: 14px;
/*     		font-weight: bold; */
/*     		color: #3067ca; */
/*     		background-color: white; */
    		    color: #3067ca;
    /* text-align: center; */
    vertical-align: middle;
			}
			
			tbody tr:nth-child(2n){
                 background:#f8fbff;
             }
			
       ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #ced5d6;
        }
        .check {
            height: 15px;
            width: 20px;
        }
        .ckin {
            width: 20px;
        }
        .ztree li span.button.chk.checkbox_true_part {
            background-position:-14px 0
        }
        .ztree li span.button.chk.checkbox_false_part {
            background-position: 0 0;
        }

        /*为了适配国产系统火狐浏览器*/
        .bbTable {
/*             border-collapse: separate; */
			border: #cccccc;
        }
        
        ul.ztree {
        overflow: auto scroll;
        }
        
        .el-input__inner{
        	height: 30px;
    		border-radius: 0;
    		border: 1px  white;
    		    width: 310;
       }
      .choose {
	    position: relative;
	    margin-left: 33;
    	}
 
.choose .radio {
    position: relative;
    display: inline-block;
    font-weight: 400;
    color: #0c4757;
    padding-left: 25px;
    cursor: pointer;
}
 
.choose .radio input {
    position: absolute;
    left: -9999px;
} 
.choose .radio i {
    display: block;
    position: absolute;
    top: 3px;
    left: 0;
    width: 12;
    height: 12;
    outline: 0;
    border: 1px solid #D0D0D0;
    background: #FAFAFA;
    border-radius: 50%;
    transition: border-color .3s;
    -webkit-transition: border-color .3s;
}
 
.choose .radio input + i:after {
    position: absolute;
    content: '';
    top: 3px;
    left: 3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff8a00;
    opacity: 0;
    transition: opacity .1s;
    -webkit-transition: opacity .1s;
}
 
.choose .radio input:checked + i:after {
    opacity: 1;
    background-color: #ff8a00;    
}
.choose .radio input:checked +i {   
    border: 1px solid #ff8a00;
    border-radius: 50%;   
}     

.tableClass tr td{
	height:38;
}

.layui-laydate-footer span:first-child.layui-laydate-preview {
	display: none;
}
       </style>
  </head>
  
  <body style="padding: 0;margin: 0;overflow-x:hidden;overflow-y:hidden;">

    <input type="hidden" id="togg" value="1"></input>
    <input type="hidden" id="toggQueryDialog" value="1"></input>
    <input type="hidden" id="toggCheckSet" value="1"></input>
    
  	<div id="query_dialog_div" style="display:none;height:100%;width:360px;position:absolute;right:0px;background:white;box-shadow: 0px 0px 13px #e3e3e3;overflow: hidden auto;">
  	  	<div  style="height:100;">  	  		
			<div id="searchTop" style="margin-top:15;height:40;">
				<img  style="margin-left:-7;" src="images/savewater/searchBG.png"> 
				<span style="position: absolute; left: 0;font-weight:bold;color:white;font-size: 16;font-family: emoji; margin-left: 11;">筛选条件</span> 	
			</div>  
			
			<div id="dateSelDiv" style="height:30;
						margin-top:10;margin-left: 13;margin-right: 13;">
						
				<div id="rectLeftDiv" style=" height: 30;width: 30;border-radius: 3px;display: inline;">		
					<input type="button" value="<" style="border-radius: 3px; height: 30;width: 30;color: gray;" onclick=""> 		 
				</div>
				<div id="leftLine" style="width:30;height:1px;background-color:#8aabe5;overflow:hidden;margin-left: 30;
					 		position:absolute;top:80;background-color: gray;"></div>
					 		
					 		
				<div style="display: inline;">
<!-- 					 <input id='nianFenInput' type='text'  style="width:213;border-radius: 5px;margin-left: 25;" onClick="WdatePicker({dateFmt:'yyyy年MM季度'})"/> -->
					 <input id="seasonId" type="text" style="width:213;border-radius: 5px;margin-left: 25;" data-type="date" autocomplete="off">
					 
				</div>	 		
					 		
					 		
				
				<div id="rightLine" style="width:24;height:1px;background-color:#8aabe5;overflow:hidden;right: 43;
					 		position:absolute;top:80;background-color: gray;"></div>
				
				<div id="rectRightDiv" style="height: 30;width: 30;border-radius: 3px;right:0;display: inline;float: right;">		
					<input type="button" value=">" style="border-radius: 3px; height: 30;width: 30;color: gray;" onclick=""> 		 
				</div>

			</div>  
			<div id="searchBottom" style="height:30;
						border-radius: 5px;margin-top:10;margin-left: 13;margin-right: 13;width: 330;">
				
				<div id="app" style="display: inline;">				
			    	<input type="button" value="埋藏条件"  style="background-color: #d0e6ff;color: black;font-weight: bold;font-size: 15;">			    		
				</div>
				
				
<!-- 				<div  style="display: inline;">				 -->
<!-- 					<input type="radio" style="width: 20;height: 13;" value="0">浅水层 -->
<!-- 					<input type="radio" style="width: 20;height: 13;" value="1">深水层				 -->
<!-- 				</div> -->
				
				     <div class="choose"  style="display: inline;">
						 <label class="radio">浅水层<input type="radio" style="width: 20;height: 10;" name="radio" value="1" checked><i></i></label>
						 <label class="radio">深水层<input type="radio" style="width: 20;height: 10;" name="radio" value="2" ><i></i></label>
					 </div>
			</div>  	  	
	  	  	
  	  	
  	  	</div>
  		<div style="width:100%;height:4;background-color: #e6e6e6;margin-top: 40;"></div>
  		<div  style="height:40;margin-top: 20;">
  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/waterNotify1.png"> 
			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 20;">按变幅统计</span>
			<span id="totalNum" style=" left: 0;font-weight:bold;color: red;font-size: 15;float: right;margin-right: 20;">
			</span> 	
			
			 	
		</div>
  		
<!--   		年 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('官厅水库','00000003','1')">    -->
<!--   		    非年 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('永定河','00000001','1')">     		     -->
<!--   		    管理 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('官厅水库','00000002','2')">    -->
		<div  style=";height:150;width: 360; ">
			<div  style=";height: 150;width: 170;  display: inline-block;">
				 <div id="waterLevelDiv" style="height:150;width: 160;"></div>
				 <span style="display:none;position: absolute; margin-left: 50;margin-top: -100;font-weight:bold;color: red;font-size: 16;" id='waterLevelSpan'></span>		
			</div>
			<div  style="; height: 150;width: 180;   display: inline-block;">
				<table class="tableClass" width="100%" style="font-size: 14;font-weight: bold;">
	  
				  <tr >
				    <td >	
				        <img style="margin-left: 30;" src="images/savewater/waterNotifyUp.png">上升区 
					</td>
				    <td><span id="up" style="color: #51bbff;font-size: 18;">-</span><span style="color: #C4C2C2;font-size: 13;">个</span></td>
				    				    
				  </tr>
				  <tr style="background: white;">
				     <td >	
				        <img style="margin-left: 30;" src="images/savewater/waterNotifyStable.png">相对稳定区 
					</td>
				    <td><span id="stable" style="color: #fffc00;font-size: 18;">-</span><span style="color: #C4C2C2;font-size: 13;">个</span></td>
				    	
				  </tr>
				   <tr>
				    <td >	
				        <img style=";margin-left: 30;" src="images/savewater/waterNotifyDown.png">相对下降区 
					</td>
				    <td><span id="down" style="color: #ffc44d;font-size: 18;">-</span><span style="color: #C4C2C2;font-size: 13;">个</span></td>
				    	
				    				    
				  </tr>
				  <tr style="background: white;">
				     <td >	
				        <img style="margin-left: 30;" src="images/savewater/waterNotifyDown2.png">严重下降区
					</td>
				    <td><span id="downPlus" style="color: #ee6666;font-size: 18;">-</span><span style="color: #C4C2C2;font-size: 13;">个</span></td>
				    				    				    
				  </tr>
				</table>
			</div>
			
		</div>


		<div  style="height:40;margin-top: 20;">
  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/waterNotify1.png"> 
			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 20;">按行政区统计</span> 	
		</div>
		<div  style=";height:150;width: 355; ">
<!-- 			<div  style=";height: 150;width: 170;  display: inline-block;"> -->
				  		<div id="collectCityDiv" style="height:150;width: 340;margin-left:10;"></div>
			
<!-- 			</div> -->
		</div>
		
		<div  style="height:40;margin-top: 20;">
  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/waterNotify2.png"> 			 
			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 20;">市（地）超采区水位变化情况</span>
<!-- 			<img  id="waterNotifyDetail" style="margin-left: 60;" src="images/savewater/waterNotifyDetail.png">  -->
			 	
		</div>
		
		<div style="overflow-y:scroll;height: 190;   margin-left: 5;">
		    		<table class="bbTable">
					<thead>
						<tr>
							<th>排名</th>
							<th>市（地）</th>
							<th id='titleReal'>省（直辖市）</th>
							<th id='titleGoal'>水位同比变幅（m）</th>
						</tr>
					</thead>
					<tbody id="tbody">
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>						
						<tr>
							
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
		</div>
		    	
		
  	</div>
  	
  	<div id="query_arrow_div" name="query_arrow_div" style="width:30px;height:100px;position:absolute; right:-13px; float:right; margin-top:25%;padding-top:8px;cursor: pointer;
    		z-index: 100;">
    			<img src="<%=basePath %>/images/savewater/right.png">
   	</div>
  
  
    <div id="gsFrame" style="width:100%;height:98%;padding: 0;margin: 0;">    	
    	<iframe id="gismap" name="gismap"  style="z-index:1;width:100%;height:100%;border: 0px;" 
    	src="<%=basePath%>pages/gis/main/hehushengtail/dixiashuitongbao/index.html" ></iframe>
    	
<!--     	<div id="checkSetDiv" style="width:30px;height:30px;position:absolute;right:70;bottom:100;"> -->
<!--     		  <img id="checkSetImg" src="<%=basePath %>/images/savewater/checkSet0.png"> -->
<!-- 		</div> -->
    	
    </div>
    
<script type="text/javascript">

function divClick(nm,stcd,st_tp)
{
   top.layer.open({
        type: 2,
        title: nm+"地下水位变幅变化详情",//+'降水量年趋势统计',
        closeBtn: 1,
        shade: 0.3,
        // maxmin: true,
        area: ['1050px', '500px'],    
        content: basePath+'pages/szybh/ywgz/groundWater/waterNotify/map/swbfbhxqDialog.jsp?stcd='+stcd+'&st_tp='+st_tp//pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
    });	
}

layui.use(['form', 'upload', 'layer', 'laydate', 'jquery'], function () {    
    let laydate = layui.laydate;       
	renderSeasonDate('#seasonId', '');        
    // 季度
    function renderSeasonDate(ohd, sgl) {
        let ele = $(ohd);
        laydate.render({
            elem: ohd,
            type: 'month',
            format: 'yyyy年M季度',
            btns: ['clear', 'confirm'],
            ready: function (value, date, endDate) {
                let hd = $("#layui-laydate" + ele.attr("lay-key"));
                if (hd.length > 0) {
                    hd.click(function () {
                        quarter($(this));
                    });
                }
                quarter(hd);
            },
            done: function (value, date, endDate) {
// 					console.log("aaa");
                if (!isNullSea(date) && date.month > 0 && date.month < 5) {
                    ele.attr("startDate", date.year + "年-" + date.month+ "季");
                    var  maicang=$("input[type=radio]:checked").val();
                    var year = date.year;
                    var season =date.month;

//                     console.log();
                    getWaterLevel(year,season,maicang);
                    getCollectCity(year,season,maicang);
                    search(year,season,maicang);
                    readyCall();

                } else {
                    ele.attr("startDate", "");
                }
                if (!isNullSea(endDate) && endDate.month > 0 && endDate.month < 5) {
                    ele.attr("endDate", endDate.year + "年-" + endDate.month)
                } else {
                    ele.attr("endDate", "");
                }
            }
        });
    }
});

function quarter(thiz) {
    let mls = thiz.find(".laydate-month-list");
    mls.each(function (i, e) {
        $(this).find("li").each(function (inx, ele) {
            let cx = ele.innerHTML;
            if (inx < 4) {
                ele.innerHTML = cx.replace(/月/g, "季度");
            } else {
                ele.style.display = "none";
            }
        });
    });
};
function isNullSea(quarter) {
    if (quarter == null || typeof (quarter) == "undefined" || quarter == "") return true;
    return false;
};


    </script>
  </body>
  <script type="text/javascript" src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script>
<!-- <script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script> -->
<!-- <script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.excheck.js"></script> -->
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/common/types.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/szybh/ywgz/groundWater/waterNotify/map/map.js"></script>
</html>
