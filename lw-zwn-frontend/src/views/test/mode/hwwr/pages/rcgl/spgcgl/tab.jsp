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
<%--  			<li id="xfyx" class="liTab clickLiTab"><span>新发延续</span></li>
  			<li id="xpwf1" class="liTab"><span>新批未发1</span></li>
	        <li id="ztxx" class="liTab clickLiTab"><span>总体信息</span></li> --%>
	        <li id="ztxx" class="liTab clickLiTab"><span>取水许可统计信息</span></li>
			<li id="qsxk" class="liTab "><span>取水许可审批</span></li>
			<li id="xpwf" class="liTab"><span>新批未发</span></li>
  		</ul>
  	</div>
  
    <center class="conent">
    <div class="frameDiv">
		<%--<iframe id="iframe" src="<%=basePath%>pages/rcgl/spgcgl/qsxk/qsxk.jsp"></iframe>--%>
		<iframe id="iframe" src="<%=basePath%>pages/rcgl/spgcgl/ztxx/ztxx.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/tab.js"></script>
</html>