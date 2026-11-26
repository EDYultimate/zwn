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
	

		<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
		

    <link type="text/css" href="<%=basePath %>common/js/layui/seasonSel/css/layui.css" rel="stylesheet" />
<script type="text/javascript" src="<%=basePath %>common/js/layui/seasonSel/layui.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>



	<script type="text/javascript">

	

	var basePath = '<%=basePath%>';
  	<%-- $(function(){
  	
	  		$("#rel_div").click(function(){
		  		$("#modleIframe").attr("src","<%=basePath%>pages/kfly/jsl/ylxx/ylxx.jsp");
		  			
		  		});
	  	  });
  	 --%>	
  	 
  
  	</script>
  	
  	   <style>
  	 
			tbody td {
   			 font-size: 14px;
/*     		font-weight: bold; */
/*     		color: #3067ca; */
    		    color: #3067ca;
    /* text-align: center; */
    			vertical-align: middle;
    			width: 100;
			}
			
			tbody td input{
   				 font-size: 14px;
    		    color: black;
        		width: 80;
            		background-color: #f6f6f6;
           	 border:1px solid #d1d1d1;
        
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
       </style>
  </head>
  
  <body style="padding: 0;margin: 0;overflow-x:hidden;overflow-y:hidden;">

    <input type="hidden" id="togg" value="1"></input>
    <input type="hidden" id="toggQueryDialog" value="1"></input>
    <input type="hidden" id="toggCheckSet" value="1"></input>
    
  <div id="query_dialog_div" style="display:none;height:100%;width:360px;position:absolute;
  right:0px;background:white;box-shadow: 0px 0px 13px #e3e3e3;overflow-y: auto;overflow-x: hidden;">  	  	
  		<div  style="height:40;margin-top: 20;">
  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/otherKeyAreaBG1.png"> 
			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 18;margin-left: 20;">黄淮地区</span> 	
		</div>
	    <div  style="margin-left: 10;font-size: 14;height: 30;width: 160;  display: inline-block;float: left;">
	    	<span style="font-weight: bold;">负责流域机构：</span>淮委
	    </div>
	    <div  style="height: 30;width: 170; font-size: 14; display: inline-block;">
	    	<span style="font-weight: bold;">配合流域机构：</span>黄委、海委	    	
	    </div>


		<div  style="height:140;width: 360; ">
			<div  style="height: 100%;;width: 170;  display: inline-block;float: left;">				  	
		  		<div  style="height:40;width: 140;margin-left:30;margin-top: 15;">
		  			<img  style="" src="images/savewater/otherKeyAreaLocation.png"> 
					<span style="font-weight:bold;color: #0B79FF;font-size: 16;vertical-align: bottom;">【山东省】</span> 					  		
		  		</div>
		  		<div  style="height:40;width: 140;margin-left:30;">
		  			<img  style="" src="images/savewater/otherKeyAreaLocation.png"> 
					<span style="font-weight:bold;color: #0B79FF;font-size: 16;vertical-align: bottom;">【河南省】</span> 					  		
		  		</div>				  					
			</div>
			<div  style="height: 100%;;width: 180;   display: inline-block;">
			
				<div style=" height: 30;width: 180;margin-top: 13;">
					<div style=" width: 80;display: inline-block;">
						 <input type="button" style="width: 100%;" value=" 德州市"   >
					</div>
					<div style="width: 80;display: inline-block;">
						 <input type="button" style="width: 100%;" value="聊城市"   >
					</div>
				</div>
				<div style="height: 30;width: 180;margin-top: 10;">
					<div style=" width: 80;display: inline-block;">
						 <input type="button" style="width: 100%;" value="安阳市"   >
					</div>
					<div style="width: 80;display: inline-block;">
						 <input type="button" style="width: 100%;" value="鹤壁市"   >
					</div>
				</div>
				<div style="height: 30;width: 180;margin-top: 3;">
					<div style=" width: 80;display: inline-block;">
						 <input type="button" style="width: 100%;" value="新乡市"   >
					</div>
					<div style=" width: 80;display: inline-block;">
						 <input type="button" style="width: 100%;" value="濮阳市"   >
					</div>
				</div>
			</div>
			
		</div>

		<!-- 灰线 -->
  		<div style="width:100%;height:4;background-color: #e6e6e6;"></div>


		<div  style="height:40;margin-top: 10;">
  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/otherKeyAreaBG2.png"> 
			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 20;">鄂尔多斯台地</span> 	
		</div>
		
		<div  style="margin-left: 10;font-size: 14;height: 30;width: 160;  display: inline-block;float: left;">
	    	<span style="font-weight: bold;">负责流域机构：</span>黄委
	    </div>
	    <div  style="height: 30;width: 170; font-size: 14; display: inline-block;">
	    	<span style="font-weight: bold;">配合流域机构：</span>海委	    	
	    </div>
		
			<div  style="height: 100;width: 360;">				  	
		  		<div  style="height:40;width: 100%;margin-left:30;margin-top: 15;">
		  			<img  style="" src="images/savewater/otherKeyAreaLocation.png"> 
					<span style="font-weight:bold;color: #0B79FF;font-size: 16;vertical-align: bottom;">【内蒙古自治区】</span> 					  		
		  		</div>		
		  		<div style=" height: 30;width: 100%;">
					<div style="width: 100;display: inline-block;margin-left: 40;">
						 <input type="button" style="width: 100%;" value="乌兰察布市"   >
					</div>
					<div style=" width: 100;display: inline-block;margin-left: 40;">
						 <input type="button" style="width: 100%;" value="锡林郭勒盟"   >
					</div>
				</div>	  					
			</div>


			<!-- 灰线 -->
	  		<div style="width:100%;height:4;background-color: #e6e6e6;"></div>
	
			<div  style="height:40;margin-top: 20;">
	  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/otherKeyAreaBG1.png"> 
				<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 18;margin-left: 20;">汾渭谷地</span> 	
			</div>
		    <div  style="margin-left: 10;font-size: 14;height: 30;width: 160;  display: inline-block;float: left;">
		    	<span style="font-weight: bold;">负责流域机构：</span>黄委
		    </div>
		    <div  style="height: 30;width: 170; font-size: 14; display: inline-block;">
		    	<span style="font-weight: bold;">配合流域机构：</span>海委	    	
		    </div>
				
			
			<div  style="height:100;width: 360; ">
				<div  style="height: 100%;;width: 170;  display: inline-block;float: left;">				  	
			  		<div  style="height:40;width: 140;margin-left:30;margin-top: 15;">
			  			<img  style="" src="images/savewater/otherKeyAreaLocation.png"> 
						<span style="font-weight:bold;color: #0B79FF;font-size: 16;vertical-align: bottom;">【山西省】</span> 					  		
			  		</div>		  					  					
				</div>
				<div  style=" height: 100%;;width: 180;   display: inline-block;">			
					<div style=" height: 30;width: 180;margin-top: 13;">
						<div style=" width: 80;display: inline-block;">
							 <input type="button" style="width: 100%;" value="太原市"   >
						</div>
						<div style=" width: 80;display: inline-block;">
							 <input type="button" style="width: 100%;" value="大同市"   >
						</div>
					</div>
					<div style=" height: 30;width: 180;margin-top: 10;">
						<div style=" width: 80;display: inline-block;">
							 <input type="button" style="width: 100%;" value="长治市"   >
						</div>
						<div style=" width: 80;display: inline-block;">
							 <input type="button" style="width: 100%;" value="晋中市"   >
						</div>
					</div>
					
				</div>
			
			</div>
			
			
			<!-- 灰线 -->
	  		<div style="width:100%;height:4;background-color: #e6e6e6;"></div>
	
			<div  style="height:40;margin-top: 10;">
	  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/otherKeyAreaBG1.png"> 
				<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 18;margin-left: 20;">保护方案</span> 	
			</div>
			
			<div style="width:360;height:110;">
<!-- 					<div id="hhProtectDiv" style=" border: 3px solid #e4e4e4;display: inline-block;width:90;height:80;margin-left: 20;cursor:pointer;"> -->
<!-- 						<img id="hhProtectImg" style="margin-top: 15;margin-left: 29;" src="images/savewater/otherKeyAreaBGProtect.png"><br>  -->
<!-- 						<span id="hhProtectSpan" style="font-weight:bold;color: #adadad;font-size: 10;margin-left: 20;">黄淮地区</span> 							  					 -->
<!-- 					</div> -->
					<a href="javascript:void(0)" style="cursor: pointer;" title="预览" onClick="viewYl('6344542157458519415','120221199110210027.pdf','/kfly/nsbd/tempName')">						
						<div id="hhProtectDiv" style=" border: 3px solid #e4e4e4;display: inline-block;width:90;height:80;margin-left: 20;cursor:pointer;">
						<img id="hhProtectImg" style="margin-top: 15;margin-left: 29;" src="images/savewater/otherKeyAreaBGProtect.png"><br> 
						<span id="hhProtectSpan" style="font-weight:bold;color: #adadad;font-size: 10;margin-left: 20;">黄淮地区</span> 							  					
						</div>
					</a>
					<a href="javascript:void(0)" style="cursor: pointer;" title="预览" onClick="viewYl('6344542157458519415','120221199110210027.pdf','/kfly/nsbd/tempName')">											
						<div id="eedsProtectDiv" style=" border: 3px solid #e4e4e4;display: inline-block;width:100;height:80;margin-left: 10;cursor:pointer;">
							<img id="eedsProtectImg" style="margin-top: 15;margin-left: 38;" src="images/savewater/otherKeyAreaBGProtect2.png"><br> 
							<span id="eedsProtectSpan" style="font-weight:bold;color: #adadad;font-size: 10;margin-left: 20;">鄂尔多斯台地</span> 							  					
						</div>
					</a>
					
					<a href="javascript:void(0)" style="cursor: pointer;" title="预览" onClick="viewYl('6344542157458519415','120221199110210027.pdf','/kfly/nsbd/tempName')">																
						<div id="fwProtectDiv" style=" border: 3px solid #e4e4e4;display: inline-block;width:90;height:80;margin-left: 10;cursor:pointer;">
							<img id="fwProtectImg" style="margin-top: 15;margin-left: 29;" src="images/savewater/otherKeyAreaBGProtect.png"><br> 
							<span id="fwProtectSpan" style="font-weight:bold;color: #adadad;font-size: 10;margin-left: 20;">汾渭谷地</span> 							  					
						</div>
					</a>
			</div>			
	</div>
		
		
		
		
<!-- 		<div  style="height:150;width: 355; "> -->
<!-- 			<div  style="height: 150;width: 170;  display: inline-block;"> -->
<!-- 				  		<div id="collectCityDiv" style="height:150;width: 340;margin-left:10;"></div> -->			
<!-- 			</div> -->
<!-- 		</div> -->	
<!--   	</div> -->
  	
  	<div id="query_arrow_div" style="width:30px;height:100px;position:absolute; right:-13px; float:right; margin-top:25%;padding-top:8px;cursor: pointer;
    		z-index: 100;">
    			<img src="<%=basePath %>/images/savewater/right.png">
   	</div>
  
  
    <div id="gsFrame" style="width:100%;height:98%;padding: 0;margin: 0;">    	
    	<iframe id="gismap" name="gismap"  style="z-index:1;width:100%;height:100%;border: 0px;" 
    	src="<%=basePath%>pages/gis/main/hehushengtail/zhongdianquyu/index.html" ></iframe>
    	
<!--     	<div id="checkSetDiv" style="width:30px;height:30px;position:absolute;right:70;bottom:100;"> -->
<!--     		  <img id="checkSetImg" src="<%=basePath %>/images/savewater/checkSet0.png"> -->
<!-- 		</div> -->
    	
    </div>
    
<script type="text/javascript">

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
                    if (!isNull(date) && date.month > 0 && date.month < 5) {
                        ele.attr("startDate", date.year + "年-" + date.month+ "季");
                    } else {
                        ele.attr("startDate", "");
                    }
                    if (!isNull(endDate) && endDate.month > 0 && endDate.month < 5) {
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
    }
    function isNull(quarter) {
        if (quarter == null || typeof (quarter) == "undefined" || quarter == "") return true;
        return false;
    }



	
// 	function divWarnDetailClick()
// 	{
// 		var src=basePath+"/pages/szybh/ywgz/ecologyFlow/warnDetail/warnDetail.jsp";
// 		$("#gismap").attr("src",src);
// 	}
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
<script type="text/javascript" src="<%=basePath%>pages/szybh/ywgz/groundWater/otherKeyArea/map/map.js"></script>
</html>
