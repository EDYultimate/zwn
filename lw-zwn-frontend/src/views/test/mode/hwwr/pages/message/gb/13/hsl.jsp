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
	  	<jsp:include page="../search.jsp" flush="true"/>
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;">
    <div class="titleDiv"><span id="t_year"></span>耗水量统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td rowspan="3">分区</td>
				<td colspan="6">农田灌溉耗水量<br>(km²)</td>
				<td colspan="4">林牧渔畜耗水量<br>(亿m³)</td>
				<td colspan="6">工业耗水量<br>(亿m³)</td>
				<td colspan="4">城镇公共耗水量<br>(亿m³)</td>
				<td colspan="4">居民生活耗水量<br>(亿m³)</td>
				<td colspan="4">生态环境耗水量<br>(亿m³)</td>
				<td colspan="2">总计<br>(亿m³)</td>
			</tr>
			<tr>
				<td colspan="2" style="border-top:1px solid #cdd6e2">水田</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">水浇地</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">菜田</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">林牧渔灌溉及补水</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">牲畜</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">直流式火（核）电工业</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">循环式火（核）电工业</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">一般工业</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">建筑业</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">服务业</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">城镇</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">农村</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">城镇环境</td>
				<td colspan="2" style="border-top:1px solid #cdd6e2">农村生态</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">耗水率</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">耗水量</td>
			</tr>
			<tr>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			<td style="border-top:1px solid #cdd6e2">耗水率</td>
			<td style="border-top:1px solid #cdd6e2">耗水量</td>
			</tr>
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<div id="echartDiv" style="width:100%;">
		<!-- <div id="echart_db" class="echart" style="width:80%;margin-top:20px;"></div> -->
	</div>
	<div id="echart_qs" class="echart" style="width:80%;margin-top:20px;"></div>
	</center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/message/gb/13/hsl.js"></script>
</html>
