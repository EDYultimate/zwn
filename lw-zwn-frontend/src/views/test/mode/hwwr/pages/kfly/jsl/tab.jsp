<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>降水量</title>
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
  			<li id="sssj" class="liTab  clickLiTab"><span>实时数据</span></li>
  			<li id="gbsj" class="liTab"><span>统计信息</span></li>
  			<li id="dbzjsl" class="liTab"><span>代表站降水量</span></li>
  		</ul>
  		<ul id="stable"  style="display:none;margin-left:10px">
  			<li id="ylxx" class="liTab  clickLiTab"><span>单站雨量信息</span></li>
  			<li id="xyb" class="liTab"><span>雨情旬月报</span></li>
  		</ul>
  	</div>
  
    <center class="conent"  style="margin-top: 0px;">
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath%>pages/kfly/jsl/sssj/tjTab.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/kfly/jsl/tab.js"></script>
</html>