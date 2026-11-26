<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>引用水源保护</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <style>
li.clickLiTab {
	    color: white;
/* 	    border-radius: 5px; */
	}
	.liTab {
	    color: #393939;
	    float: left;
	    list-style: none;
	    width: 110px;
	    text-align: center;
	    height: 30px;
	    cursor: pointer;
	    font-size: 16px;
	    font-family: "微软雅黑";
	    background-color: #fff;
/* 	    border-radius: 5px; */
/* 	    margin-left: 30; */
    	margin-top: 16;
	}
  </style>
  <body>
 
  	<div class="right_menu" style="margin-left:10px;position: absolute;">
  	
  		<ul>  		
  			<li id="map" class="liTab clickLiTab" style="margin-left:30;border-top-left-radius:5px;border-bottom-left-radius:5px;" ><span>水质信息</span></li>
  			<li id="dbpg" class="liTab" style="border-top-right-radius: 5px;border-bottom-right-radius: 5px;" ><span>达标建设</span></li>
  		</ul>
  	</div>
  
  
    <center class="conent" style="margin-top: 0px;">
    <div class="frameDiv" style="margin-top: 50;">

		<iframe id="iframeEF" src="<%=basePath%>/pages/szybh/ywgz/dataFill/groundWater/DP/WQFillList.jsp"></iframe> 
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/ywgz/dataFill/groundWater/DP/DP.js"></script>
</html>
