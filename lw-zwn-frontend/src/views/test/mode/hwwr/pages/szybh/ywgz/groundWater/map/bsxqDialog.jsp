<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String RV_CD = request.getParameter("RV_CD");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>补水详情统计</title>
    
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
			
			
	.dateInput{
		height: 30;
		border-radius:18px;
		border-color:#cccccc;
		background-color:#fafafa;
		font-size:15;
	}
	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script>
		var basePath = '<%=basePath%>';
		var RV_CD = '<%=RV_CD%>';
	</script>
  </head>
  
  <body>
      <input type="hidden" id="sameCompareTogg" value="1"></input>
  
  	<div id="content_chart">
	  	<div class="searchDiv">
	  		<div style="width:250px;display: inline-block;margin-left: 10;">
<!--        			<input id='nianFen' style="height: 30;border-radius:18px;border-color:#cccccc;background-color:#fafafa;font-size:15;" type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>       			 -->
       			<input type="text" class="dateInput" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" > 
	  		 	<span>-</span>
	  		 <input type="text" class="dateInput" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" > 
					&nbsp;
       			<input type="button" value="查询" class="s_input" onclick="init()" style="background-color: #3CCEB1;border: 1px solid #3CCEB1;">
   			</div>
<!--    				  		<div  style=" height:30px; margin-left: 440;display: inline;"> -->
<!-- 							<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/statChange.png">  -->
<!-- 							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 682;margin-top: 3;text-shadow: 0 0 2px #363636;">指标统计分析</span> 	 -->
<!-- 						</div> -->
						<div  id="sameCompareDiv" style="cursor:pointer; color:#4082FF;height:30px; width: 70;right: 60;display: inline;    position: absolute;margin-top: 4;">
							<span  style="position: absolute;font-weight:bold;font-size: 16;margin-top: 3;">同比分析</span> 	
						</div>



<!--    		   <input type="button" value="查询" class="s_input" onclick="init()"   style="padding: 0px;"> -->
   			
<!-- 	  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" > -->
<!-- 	  		 <span>-</span> -->
<!-- 	  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" >  -->
	  	</div>

	  	<div id="mainDiv" style="width:100%;">
		    <div id="leftDiv" style="width:750;max-height:400px;
		    				margin-top: 10; margin-left: 10;">
		    	
		    	<div style="overflow-y:auto;height: 250;">  
		    	<span style="float: right;font-size: 1;">单位：亿m³</span>
		    		<table class="bbTable">
					<thead>
						<tr>
							<th>时间</th>
							<th>南水北调中线</th>
							<th >南水北调东线</th>
							<th >引黄</th>
							<th >引滦</th>	
							<th >上游水库</th>		
							<th >再生水及其他</th>		
							<th >合计 </th>		
							
<!-- 							<th id='titleReal'>南水北调东线</th> -->
<!-- 							<th id='titleGoal'>引黄</th> -->
<!-- 							<th id='titleRes'>引滦</th>	 -->
<!-- 							<th id='titleRes'>上游水库</th>		 -->
<!-- 							<th id='titleRes'>再生水及其他</th>		 -->
<!-- 							<th id='titleRes'>合计</th> -->
								
						</tr>
					</thead>
					<tbody id="tbody">
					<tr>
						<td ></td><td></td><td></td><td> </td><td></td><td> </td><td></td><td></td>
					</tr>
					
					<tr>
						<td ></td><td></td><td></td><td> </td><td></td><td> </td><td></td><td></td>
					</tr>
			<tr>
						<td ></td><td></td><td></td><td> </td><td></td><td> </td><td></td><td></td>
					</tr>
			<tr>
						<td ></td><td></td><td></td><td> </td><td></td><td> </td><td></td><td></td>
					</tr>
			<tr>
						<td ></td><td></td><td></td><td> </td><td></td><td> </td><td></td><td></td>
					</tr>
			<tr>
						<td ></td><td></td><td></td><td> </td><td></td><td> </td><td></td><td></td>
					</tr>
			
						
					</tbody>
				</table>
		    	</div>
		    	
		    	

		    </div>
	  		
	  		<div id="rightDiv" style="margin-top: 10;height:80%;width: 100%;"></div>
	  	</div>
  	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<!--   <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script> -->
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/szybh/ywgz/groundWater/map/bsxqDialog.js" type="text/javascript"></script>
<!--           <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script> -->
             <script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script> 
          
  
</html>
