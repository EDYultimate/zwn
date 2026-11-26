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
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <style>

  </style>
  <body style="margin-right: 0px;">
  	  <div class="right_menu">
  		<ul id="smap"  style="margin-bottom: 0px;">
  			<li id="jcxx" class="liTab  clickLiTab"><span>基础信息</span></li>
  			<li id="skxx" class="liTab"><span>水库信息</span></li>
  			<li id="czxx" class="liTab"><span>监测信息</span></li> <!-- 测站信息 -->
  		</ul>
  	</div>
  
    <center class="conent"  style="margin-top: 0px;">
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath%>pages/message/jcxx/jcxx/jcxx.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/message/jcxx/tab.js"></script>
</html>