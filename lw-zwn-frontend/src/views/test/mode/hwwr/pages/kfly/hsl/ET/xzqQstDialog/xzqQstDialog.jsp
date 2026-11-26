<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String wrcd = request.getParameter("wrcd");
String type = request.getParameter("type");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>降水量年趋势统计</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>
		var basePath = '<%=basePath%>';
		var wrcd = '<%=wrcd%>';
		var type = '<%=type%>';
	</script>
  </head>
  
  <body>
  	<div class="searchDiv">
  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy',maxDate:'#F{$dp.$D(\'endTm\')}'})">
  		 <span>-</span>
  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy',minDate:'#F{$dp.$D(\'beginTm\')}'})"> 
  		 &nbsp;&nbsp;&nbsp;&nbsp;
  		 <input type="button" value="查询" class="s_input" onclick="init()">
  	</div>
  	<div id="mainDiv" style="padding: 10px 0 0 0px;">
	    
  		<div id="rightDiv" style="float:right;height:400px;width:100%"></div>
  	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script src="<%=basePath%>pages/kfly/hsl/ET/xzqQstDialog/xzqQstDialog.js" type="text/javascript"></script>
</html>
