<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String SWS_CD = request.getParameter("SWS_CD");
// String st_tp = request.getParameter("st_tp");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>达标建设情况</title>
    
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
		var SWS_CD = '<%=SWS_CD%>';
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
	  	</div>
	  	<div id="mainDiv" style="width:1350;">
  			<div style="width: 100%;text-align: center;">
		    	<span style="font-weight:bold;color: black;font-size: 14;">抽查评估日期：</span> 	
		    	<span id="ASSESS_DATE" style="font-weight:bold;color: black;font-size: 16;">2020.4.26</span> 	
		    	&nbsp;&nbsp;&nbsp;
		    	<span  style="font-weight:bold;color: black;font-size: 14;">评估结果：</span> 
		    	<span id="ASSESS_RES" style="font-weight:bold;color: black;font-size: 16;">良好</span> 			    		
	    	</div>	
	    	<div style="width: 100%;">
		    	<div  style="height:40;margin-top: 50;display: inline-block;margin-left: 50;">
  					<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/otherKeyAreaBG1.png"> 
						<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 18;margin-left: 73;">发现问题</span> 	
				</div>	
		    	&nbsp;&nbsp;&nbsp;
		    	<span id="PROBLEM" style="font-weight:bold;color: black;font-size: 14;">应急备用水源地建设存在问题</span> 
	    	</div>	
	    	
	    	<div style="width: 100%;">
		    	<div  style="height:40;margin-top: 50;display: inline-block;margin-left: 50;">
  					<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/otherKeyAreaBG1.png"> 
						<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 18;margin-left: 73;">整改情况</span> 	
				</div>	
		    	&nbsp;&nbsp;&nbsp;
		    	<span id="REFORM" style="font-weight:bold;color: black;font-size: 14;">已完成整改</span> 
	    	</div>	
	    	
	    	
	    	<div id="imgDiv" style="width: 100%;">
		    	<div  style="width:200;height:140;display: inline-block;margin-left: 50;text-align: center;">
  					<img id="reformImg1" style="margin-top: 15;" src=""> <br>
						<span id="reformSpan1" style="font-weight:bold;color: black;font-size: 10;display: block;"></span> 	
				</div>	
				
				<div  style="width:200;height:140;display: inline-block;margin-left: 50;text-align: center;">
  					<img id="reformImg2" style="margin-top: 15;" src=""> 
						<span id="reformSpan2" style="font-weight:bold;color: black;font-size: 10;display: block;"></span> 	
				</div>	
				
				<div  style="width:200;height:140;display: inline-block;margin-left: 50;text-align: center;">
  					<img id="reformImg3" style="margin-top: 15;" src=""> 
						<span id="reformSpan3" style="font-weight:bold;color: black;font-size: 10;display: block;"></span> 	
				</div>	
				<div  style="width:200;height:140;display: inline-block;margin-left: 50;text-align: center;">
  					<img id="reformImg4" style="margin-top: 15;" src=""> 
						<span id="reformSpan4" style="font-weight:bold;color: black;font-size: 10;display: block;"></span> 	
				</div>	
	    	</div>	
	    	

	  	</div>
  	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/szybh/ywgz/drinkProtect/map/dbjsqkDialog.js" type="text/javascript"></script>
</html>
