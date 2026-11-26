<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>出入省境水量</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <body>
  	<div class="right_menu">
  	<!-- 	<ul>
  			<li id="gbsj" class="liTab clickLiTab"><span>统计信息</span></li>
  		</ul> -->
  	</div>
  	<div class="searchDiv">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<div class="sc_div">
			时间：
			<input type="text" id="year" name="year"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
		</div>
		
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent">
    <div class="titleDiv"><span id="t_year"></span>年出入境水量统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td rowspan="2">省级行政区</td>
				<td rowspan="2">面积<br>(km²)</td>
				<td rowspan="2">统计项目</td>
				<td colspan="3">各统计年段平均出入境水量<br>(亿m³)</td>
				<td rowspan="2">出入省境水量<br>(万m³)</td>
			</tr>
			<tr>
				<td style="border-top:1px solid #E1E1E1">1956~1979年</td>
				<td style="border-top:1px solid #E1E1E1">1980~2000年</td>
				<td style="border-top:1px solid #E1E1E1">1956~2000年</td>
			</tr>
		</thead>
		<tbody id="tbody">

		</tbody>
	</table>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/kfly/crjsl/crjsl.js"></script>
</html>
