<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String cd = request.getParameter("cd");
%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'tjYearDialog.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
		<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>
		var basePath = '<%=basePath%>';
		var cd = '<%=cd%>';
	</script>
  </head>
  
  <body>
   <div class="searchDiv">
  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy',maxDate:'#F{$dp.$D(\'endTm\')}'})">
  		 <span>-</span>
  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy',minDate:'#F{$dp.$D(\'beginTm\')}'})"> 
  		 &nbsp;&nbsp;&nbsp;&nbsp;
  		 <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
  	 <center class="conent" style="overflow:auto;padding-bottom:10px;">
    <div class="titleDiv"><span id="tmSpan"></span>入河排污口统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td >名称</td>
				<td >年份</td>
				<td >入河排污口数</td>
				<td>污水量排放量(吨/年)</td>
				<td>COD排放量(吨/年)</td>
				<td>氨氮排放量(吨/年)</td>
				<td>总磷排放量(吨/年)</td>
				<td>总氮排放量(吨/年)</td>
				<td>挥发酚排放量(吨/年)</td>
			</tr>
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	
	</center>
  </body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script src="<%=basePath%>pages/szybh/rhpwk/tj/tjYearDialog.js" type="text/javascript"></script>
</html>
