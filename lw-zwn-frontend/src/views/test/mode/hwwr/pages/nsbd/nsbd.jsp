<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>地下水</title>
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

  </style>
  <body>
  	<div class="right_menu" style="margin-left:10px">
  		<ul>
  			<li id="daytj" class="liTab clickLiTab" ><span>日监测成果</span></li>
  			<li id="tj" class="liTab" ><span>调水统计</span></li>
  			<li id="up" class="liTab"><span>调水信息月上报</span></li>
  			<li id="dayup" class="liTab"><span>调水信息日上报</span></li>
  			<li id="fa" class="liTab"><span>方案管理</span></li>
  			<li id="jd" class="liTab" ><span>监督检查</span></li>
  			<li id="zl" class="liTab"><span>调水总结</span></li>
  			<li id="stcdinfo" class="liTab"><span>调水测站维护</span></li>
  		</ul>
  	</div>
  
    <center class="conent">
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath%>/pages/nsbd/dayTj/dayUp.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/nsbd/nsbd.js"></script>
</html>
