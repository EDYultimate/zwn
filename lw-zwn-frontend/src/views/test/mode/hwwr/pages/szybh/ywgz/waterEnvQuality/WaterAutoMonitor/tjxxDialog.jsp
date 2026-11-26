<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String stnm = request.getParameter("stnm");
String addvcd = request.getParameter("addvcd");
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
    		font-weight: unset;
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
	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script>
		var basePath = '<%=basePath%>';
		var stnm = '<%=stnm%>';
		var addvcd = '<%=addvcd%>';
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
      	  指标选择: 
		      	<select id="type"   >
					<option value="1">水质类别</option>
					<option value="2">水温</option>
					<option value="3">PH</option>
					<option value="4">溶解氧</option>
					<option value="5">电导率</option>
					<option value="6">浊度</option>
					<option value="7">高锰酸盐指数</option>
					<option value="8">氨氮</option>
					<option value="9">总磷</option>
					<option value="10">总氮</option>
					<option value="11">叶绿素α</option>
					<option value="12">藻密度</option>
				</select>
	  		 <input type="button" value="查询" class="s_input" onclick="init()"  style="margin-left: 10;background-color: #3CCEB1;border: 1px solid #3CCEB1;">
<!-- 	  		 <div  style=" height:30px; margin-left: 110;display: inline;"> -->
<!-- 							<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/statChange.png">  -->
<!-- 							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 415;margin-top: 3;text-shadow: 0 0 2px #363636;">指标统计分析</span> 	 -->
<!-- 			</div> -->
	  	</div>
	  	
	  	
		
		
	  	<div id="mainDiv" style="padding: 10px 0 0 0px;">
		    <div id="leftDiv" style="width:300px;max-height:400px;overflow-y:auto;float:left;overflow-y:scroll;margin-top: 10; margin-left: 10;">
		    	<table class="bbTable">
					<thead>
						<tr>
							<th>日期</th>
							<th id='titleName' ></th>
<!-- 							<th id='titleASS_TAR2' style="display: none;"></th> -->
						</tr>
					</thead>
					<tbody id="tbody">
						<tr>
							<td></td>
							<td></td>
							
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
		    </div>
	  		<div id="rightDiv" style="float:right;height:400px;margin-top: 30"></div>
	  	</div>
  	</div>
  	
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/szybh/ywgz/waterEnvQuality/WaterAutoMonitor/tjxxDialog.js" type="text/javascript"></script>
</html>
