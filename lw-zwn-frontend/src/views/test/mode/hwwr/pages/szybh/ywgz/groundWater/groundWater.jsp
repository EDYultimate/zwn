<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>地下水超采区综合治理</title>
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
  			<li id="map" class="liTab clickLiTab" style=" margin-left: 30;border-top-left-radius: 5px;border-bottom-left-radius: 5px;" ><span>华北地下水</span></li>
  			<li id="qtzdqy" class="liTab" ><span>其他重点区域</span></li>
  			<li id="dxswtb" class="liTab" style="border-top-right-radius: 5px;border-bottom-right-radius: 5px;"><span>地下水位通报</span></li>
  		</ul>
  	</div>
  
    <center class="conent" style="margin-top: 0px;">
    <div class="frameDiv">
		<iframe id="iframeEF" src="<%=basePath%>/pages/szybh/ywgz/groundWater/map/map.jsp"></iframe> 		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/ywgz/groundWater/groundWater.js"></script>
</html>
