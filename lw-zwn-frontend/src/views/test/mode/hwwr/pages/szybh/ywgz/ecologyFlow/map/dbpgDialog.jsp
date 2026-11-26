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
		.titleItemDiv{    
			width: 190;
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
	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script>
		var basePath = '<%=basePath%>';
		var stcd = '<%=stcd%>';
		var st_tp = '<%=st_tp%>';
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
   				  		<div  style=" height:30px; margin-left: 440;display: inline;">
							<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/statChange.png"> 
							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 682;margin-top: 3;text-shadow: 0 0 2px #363636;">指标统计分析</span> 	
						</div>
						<div  id="sameCompareDiv" style="cursor:pointer; color:#4082FF;height:30px; width: 70;right: 60;display: inline;    position: absolute;margin-top: 4;">
							<span  style="position: absolute;font-weight:bold;font-size: 16;margin-top: 3;">同比分析</span> 	
						</div>
<!--    			<div  style=" height:30px; margin-left: 440;display: inline;"> -->
<!-- 							<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 682;margin-top: 3;text-shadow: 0 0 2px #363636;">同比分析</span> 	 -->
<!-- 						</div> -->


<!--    		   <input type="button" value="查询" class="s_input" onclick="init()"   style="padding: 0px;"> -->
   			
<!-- 	  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" > -->
<!-- 	  		 <span>-</span> -->
<!-- 	  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" >  -->
	  	</div>
	  	<div id="mainDiv" style="width:1350;">
		    <div id="leftDiv" style="width:620px; float:left;
		    				margin-top: 10; margin-left: 10;">
		    	
		    	<div style="overflow-y:scroll;height: 200;">
		    		<table class="bbTable">
					<thead>
						<tr>
							<th>日期</th>
<!-- 							<th>评价时长</th> -->
							<th id='titleReal'>-</th>
							<th id='titleAttach'>-</th>
							<th id='titleRealHan'>-</th>							
							<th id='titleTotal'>-</th>
							
<!-- 							<th id='titleGoal'>-</th> -->							
<!-- 							<th id='titleRes' style="display:none">-</th>		 -->
						</tr>
					</thead>
					<tbody id="tbody">
					</tbody>
				</table>
		    	</div>
		    	
		    	
		   
		   		<div class="titleItemDiv"  id="statTitle1" style="width:200;display:none;" >	    			
	    			<div class="infotext"  id="statTitleDiv1"></div>
	    			<div class="infonum" id="statValDiv1"></div>
	    		</div>
	    		
	    		<div class="titleItemDiv"  id="statTitle2" style="margin-left: 15;display:none;">	    			
	    			<div class="infotext" id="statTitleDiv2"></div>
	    			<div class="infonum" id="statValDiv2"></div>
	    		</div>
	    		
	    		<div class="titleItemDiv" id="statTitle3" style="margin-left: 15;display:none;">	    			
	    			<div class="infotext"  id="statTitleDiv3"></div>
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
  <script src="<%=basePath%>pages/szybh/ywgz/ecologyFlow/map/dbpgDialog.js" type="text/javascript"></script>
</html>
