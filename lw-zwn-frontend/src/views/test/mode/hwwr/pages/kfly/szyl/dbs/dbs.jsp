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
	<link rel="stylesheet" href="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <body>
  	<div class="searchDiv">
	  	<jsp:include page="../../search.jsp" flush="true"/>
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;">
    <div class="titleDiv"><span id="t_year"></span>地表水统计信息表</div>
	<table class="bbTable" id="oneTable">
		<thead>
			<tr>
				<td >分区</td>
				<td>计算面积<br>(km²)</td>
				<td>年水量<br>(亿m³)</td>
				<td>年径流深<br>(mm)</td>
				<td>上年水量<br>(亿m³)</td>
				<td>多年平均水量<br>(亿m³)</td>
				<td>与上年比较<br>(±%)</td>
				<td>与多年平均比较<br>(±%)</td>
				<td>入境水量<br>(亿m³)</td>
				<td>出境水量<br>(亿m³)</td>
				<td>入海水量<br>(亿m³)</td>
			</tr>
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<!-- 三级区 start-->
	<table class="bbTable" id="twoTable">
		<thead>
			<tr>
				<td>省市</td>
				<td>Ⅲ级区</td>
				<td>计算面积<br>(km²)</td>
				<td>年水量<br>(亿m³)</td>
				<td>年径流深<br>(mm)</td>
				<td>上年水量<br>(亿m³)</td>
				<td>多年平均水量<br>(亿m³)</td>
				<td>与上年比较<br>(±%)</td>
				<td>与多年平均比较<br>(±%)</td>
				<td>入境水量<br>(亿m³)</td>
				<td>出境水量<br>(亿m³)</td>
				<td>入海水量<br>(亿m³)</td>
			</tr>
			
		</thead>
		<tbody id="tbody_two">
			
		</tbody>
	</table>
	<!-- 三级区 end-->
	<div id="echartDiv" style="width:100%;">
		<!-- <div id="echart_db" class="echart" style="width:80%;margin-top:20px;"></div> -->
	</div>
	<div id="echart_qs" class="echart" style="width:80%;margin-top:20px;"></div>
	</center>
  </body>
   <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/kfly/szyl/dbs/dbs.js"></script>
</html>
