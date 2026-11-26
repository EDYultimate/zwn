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
        .liTab {
            width:200px;
        }
  </style>
  <body style="margin-right: 0px;">
  	  <div class="right_menu">
  		<ul id="smap"  style="margin-bottom: 0px;">
  			<li id="byxkz" class="liTab  clickLiTab"><span>保有许可证查询</span></li>
  			<li id="qysh" class="liTab"><span>取用水户查询</span></li>
  			<li id="qsh" class="liTab"><span>取水户取水量监测信息</span></li>
  		<!-- 	<li id="qsk" class="liTab"><span>取水口取水量监测信息</span></li> -->
  			<li id="qsz" class="liTab"><span>取水站取水量监测信息</span></li>
  			<li id="qsd" class="liTab"><span>取水点取水量监测信息</span></li>
  		</ul>
  	</div>
  
    <center class="conent"  style="margin-top: 0px;">
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath %>pages/rcgl/ssfzgl/byxkz/byxkzNew.jsp"></iframe>
		
	</div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/rcgl/ssfzgl/tab.js"></script>
</html>