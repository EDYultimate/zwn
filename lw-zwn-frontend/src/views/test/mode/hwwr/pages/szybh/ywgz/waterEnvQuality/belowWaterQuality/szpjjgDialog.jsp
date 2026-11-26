<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String ID = request.getParameter("ID");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>水质评价结果</title>
    
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
	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script>
		var basePath = '<%=basePath%>';
		var ID = '<%=ID%>';
	</script>
  </head>
  
  <body>
      <input type="hidden" id="sameCompareTogg" value="1"></input>
  
  	<div id="content_chart">
	  	<div class="searchDiv">
	  		<div style="width:190px;display: inline-block;margin-left: 10;">
       			<input id='nianFen' style="height: 30;border-radius:18px;border-color:#cccccc;background-color:#fafafa;font-size:15;" type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
					&nbsp;
       			<input type="button" value="查询" class="s_input" onclick="init()" style="background-color: #3CCEB1;border: 1px solid #3CCEB1;">
   			</div>
   				  		<div  style=" height:30px; margin-left: 270;display: inline;">
							<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/statChange.png"> 
							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 510;margin-top: 3;text-shadow: 0 0 2px #363636;">水质变化统计</span> 	
						</div>
						<div  style=" height:30px; margin-left: 400;display: inline;">
							<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/statChange.png"> 
							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 1050;margin-top: 3;text-shadow: 0 0 2px #363636;">各类水质占比</span> 	
						</div>
<!-- 						<div  id="sameCompareDiv" style="cursor:pointer; color:#4082FF;height:30px; width: 70;right: 60;display: inline;    position: absolute;margin-top: 4;"> -->
<!-- 							<span  style="position: absolute;font-weight:bold;font-size: 16;margin-top: 3;">同比分析</span> 	 -->
<!-- 						</div> -->
<!--    			<div  style=" height:30px; margin-left: 440;display: inline;"> -->
<!-- 							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 682;margin-top: 3;text-shadow: 0 0 2px #363636;">同比分析</span> 	 -->
<!-- 						</div> -->


<!--    		   <input type="button" value="查询" class="s_input" onclick="init()"   style="padding: 0px;"> -->
   			
<!-- 	  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" > -->
<!-- 	  		 <span>-</span> -->
<!-- 	  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" >  -->
	  	</div>
	  	<div id="mainDiv" style="width:1350;">
		    <div id="leftDiv" style="width:450;max-height:400px;float:left;
		    				margin-top: 10; margin-left: 10;">
		    	
		    	<div style="overflow-y:scroll;">
		    		<table class="bbTable">
					<thead>
						<tr>
							<th>时间</th>
							<th>水质类别</th>
							<th>超标项</th>
								
						</tr>
					</thead>
					<tbody id="tbody">
<!-- 						<tr> -->
<!-- 							<td>2020.06</td> -->
<!-- 							<td>V</td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2020.06</td> -->
<!-- 							<td>III</td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2020.07</td> -->
<!-- 							<td>V</td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2020.07</td> -->
<!-- 							<td>II</td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2020.10</td> -->
<!-- 							<td>V</td> -->
<!-- 							<td>COD、氨氮</td> -->
							
<!-- 						</tr> -->
						
					</tbody>
				</table>
		    	</div>		    			  	   		
		    </div>
	  		
	  		<div id="middleDiv" style="float:left;height:400px;width:600"></div>
	  		
	  		<div style="width:195;height:190;display:inline-block;margin-top: 50;">
  	  		 <div id="waterQualityTypeDiv" style="height:190;width: 195;"></div>  	  	
  	  		   	
  	  		</div>
	  	</div>
  	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<!--   <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script> -->
<script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script>

  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/szybh/ywgz/waterEnvQuality/belowWaterQuality/szpjjgDialog.js" type="text/javascript"></script>
</html>
