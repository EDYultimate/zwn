<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>省界断面</title>
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
  			<li id="tbzs" class="liTab clickLiTab"><span>图表展示</span></li>
  			<%--<li id="zxjd" class="liTab"><span>专项监督</span></li>--%>
			<li id="zxjd" class="liTab"><span>监督考核</span></li>
  			<%--<li id="glzdkh" class="liTab"><span>管理制度考核</span></li>--%>
			<li id="glzdkh" class="liTab"><span>管理依据</span></li>
			<%--<li id="khwd" class="liTab"><span>考核文档</span></li>--%>
  		</ul>
  	</div>
  
    <center class="conent">
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath%>pages/rcgl/sthx/tbzs/sthx.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/rcgl/sthx/tab.js"></script>
</html>