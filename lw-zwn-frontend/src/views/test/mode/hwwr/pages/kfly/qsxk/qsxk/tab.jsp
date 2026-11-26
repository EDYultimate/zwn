<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>取水许可</title>
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
<!--   			<li id="spff" class="liTab clickLiTab"><span>审批发放</span></li>
  			<li id="zxdx" class="liTab"><span>注销吊销</span></li> -->
  			<li id="spff" class="liTab clickLiTab"><span>数据统计</span></li>
  			<li id="nzby" class="liTab"><span>年终保有</span></li>
  		</ul>
  	</div>
  
    <center class="conent">
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath%>pages/kfly/qsxk/qsxk/spff/dfbstt.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/kfly/qsxk/qsxk/tab.js"></script>
</html>