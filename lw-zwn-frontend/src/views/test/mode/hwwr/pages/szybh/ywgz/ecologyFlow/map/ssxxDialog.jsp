<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String stcd = request.getParameter("stcd");
String st_tp = request.getParameter("st_tp");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>降水量年趋势统计</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<style type="text/css">
		.searchDiv {
		    font-size: 10px;
		    padding: 8px;
		    background-color: white;
		}
		.s_input {
			background-image: none;
			text-align: center;
		}
				thead th {
   			 font-size: 14px;
    		font-weight: bold;
    		color: #3067ca;
    		background-color: #f0f0f0;
			}
			tbody td {
   			 font-size: 14px;
/*     		font-weight: bold; */
/*     		color: #3067ca; */
    		background-color: white;
    		    color: #3067ca;
    /* text-align: center; */
    vertical-align: middle;
			}
			
			.titleItemDiv{    
			width: 150;
		    height: 67;
		    float: left;
/* 		    text-align: center; */
/* 		    line-height: 100px; */
			margin-top: 25px;
			font-weight: bold;
			border: 1px solid #DDDDDD;
			border-radius: 5px;
		    }
		 .infotext{    
		    display: inline-block;
/* 		    margin-left: 10px; */
		    font-size: 10px;
		    border: 1px solid #E0E0E0;
		    border-radius: 5px;
			line-height: 50px;	
			height: 50px;	    
		    background-color: #f5f5f5;
		    height: 67;
		    text-align: center;
		    width: 67;
		    }
		.infonum{
			display: inline-block;
			font-size:20px;
/* 			border: 1px solid #efefef; */
			font-weight:bold;
			margin-left: 3px;
			color: #3067ca;
			vertical-align: middle;
			text-align: center;
			}
	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script>
		var basePath = '<%=basePath%>';
		var stcd = '<%=stcd%>';
		var st_tp = '<%=st_tp%>';
// 		var stcd = window.parent.stcd;
	</script>
  </head>
  
  <body>
  
  	<div id="content_chart">
	  	<div class="searchDiv">
	  		<div id="timeRange" style="display: inline-block;margin-left: 10;">
		  		 <input type="text" id="beginTm"  name="beginTm" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" >
		  		 <span>-</span>
		  		 <input type="text" id="endTm" name="etm" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" > 
		  		 &nbsp;
	  		 </div>
	  		 <input type="button" value="查询" class="s_input" onclick="init()"  style="margin-left: 10;background-color: #3CCEB1;border: 1px solid #3CCEB1;">
	  		 
	  		 <input id="zlz_input" type="button" value="枣林庄" class="s_input" onclick="ref_section()"  style="margin-left: 10;background-color: #3CCEB1;border: 1px solid #3CCEB1;display:none">
	  		 <input id="jxz_input" type="button" value="闸(南)下" class="s_input" onclick="ref_section()"  style="margin-left: 10;background-color: #3CCEB1;border: 1px solid #3CCEB1;display:none;width:80px">
	  		 
	  		 <div  style=" height:30px; margin-left: 180;display: inline;">
							<img  id="zbtjfx_img" style="margin-top: 15;margin-left: 85;" src="images/savewater/statChange.png"> 
							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 565;margin-top: 3;text-shadow: 0 0 2px #363636;">指标统计分析</span> 	
		</div>
	  	</div>
	  	
	  	
		
		
	  	<div id="mainDiv" style="padding: 10px 0 0 0px;">
		    <div id="leftDiv" style="width:510px;max-height:300px;float:left;margin-top: 10; margin-left: 10;">
		    	<div style="overflow-y: scroll;  height: 200;">
			    	<table class="bbTable">
						<thead>
							<tr>
								<th>日期</th>
	<!-- 							<th id='titleASS_TAR'></th> -->
															<th>水位(m)</th>
															<th>流量(m³/s)</th>
															<th>水量(万m³)</th>							
	<!-- 							<th id='titleASS_TAR2' style="display: none;"></th> -->
							</tr>
						</thead>
						<tbody id="tbody">
						</tbody>
					</table>
				</div>
				
				<div class="titleItemDiv"  id="statTitle1" style="width:150;" >	    			
	    			<div class="infotext"  id="statTitleDiv1">最低水位 </div>
	    			<div class="infonum" id="statValDiv1"></div>
	    		</div>
	    		
	    		<div class="titleItemDiv"  id="statTitle2" style="margin-left: 15;">	    			
	    			<div class="infotext" id="statTitleDiv2">最低流量 </div>
	    			<div class="infonum" id="statValDiv2"></div>
	    		</div>
	    		
	    		<div class="titleItemDiv" id="statTitle3" style="margin-left: 15;width:160;">	    			
	    			<div class="infotext"  id="statTitleDiv3">累计水量 </div>
	    			<div class="infonum" id="statValDiv3"></div>
	    		</div>		
		    </div>
	  		<div id="rightDiv" style="float:right;height:400px;"></div>
	  	</div>
  	</div>
  	
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/szybh/ywgz/ecologyFlow/map/ssxxDialog.js" type="text/javascript"></script>
</html>
