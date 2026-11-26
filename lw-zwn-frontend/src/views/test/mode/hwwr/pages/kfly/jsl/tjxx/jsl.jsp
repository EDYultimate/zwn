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
  <body>

  	<div class="searchDiv">
	  	<jsp:include page="../../search.jsp" flush="true"/>
  	</div>
    <center class="conent">
    <div class="titleDiv"><span id="t_year"></span>降水量统计信息表</div>
	<table class="bbTable" id="oneTable">
		<thead>
			<tr>
				<td rowspan="2">分区</td>
				<td rowspan="2">计算面积<br>(km²)</td>
				<td colspan="2">当年降水量</td>
				<td rowspan="2">上年降水量<br>(亿m³)</td>
				<td rowspan="2">多年平均降水量<br>(亿m³)</td>
				<td rowspan="2">与上年比较<br>(±%)</td>
				<td rowspan="2">与多年平均比较<br>(±%)</td>
			</tr>
			<tr>
				<td style="border-top:1px solid #E1E1E1">(mm)</td>
				<td style="border-top:1px solid #E1E1E1">(亿m³)</td>
			</tr>
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<!-- 三级区 -->
	<table class="bbTable" id="twoTable" style="display:none;">
		<thead>
			<tr>
				<td rowspan="2">省市</td>
				<td rowspan="2">Ⅲ级区</td>
				<td rowspan="2">计算面积<br>(km²)</td>
				<td colspan="2">当年降水量</td>
				<td rowspan="2">上年降水量<br>(亿m³)</td>
				<td rowspan="2">多年平均降水量<br>(亿m³)</td>
				<td rowspan="2">与上年比较<br>(±%)</td>
				<td rowspan="2">与多年平均比较<br>(±%)</td>
			</tr>
			<tr>
				<td style="border-top:1px solid #E1E1E1">(mm)</td>
				<td style="border-top:1px solid #E1E1E1">(亿m³)</td>
			</tr>
		</thead>
		<tbody id="tbody_two">
			
		</tbody>
	</table>
	<!-- 三级区 -->
	<div id="echartDiv" style="width:100%;">
		
	</div>
	<!-- <div id="echart_qs" class="echart" style="width:80%;margin-top:20px;"></div> -->
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/kfly/jsl/tjxx/jsl.js"></script>
</html>
