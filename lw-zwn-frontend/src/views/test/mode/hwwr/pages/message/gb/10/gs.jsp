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
    <div class="titleDiv"><span id="t_year"></span>供水量统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td rowspan="3">分区</td>
				<td colspan="7">地表水供水量<br>(km²)</td>
				<td colspan="4">地下水供水量<br>(亿m³)</td>
				<td colspan="4">其他水源供水量<br>(亿m³)</td>
				<td rowspan="3">总供水量<br>(亿m³)</td>
				<td rowspan="3">海水利用量<br>(亿m³)</td>
				<td rowspan="3">长距离输水损失量<br>(亿m³)</td>
			</tr>
			<tr>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">蓄水</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">引水</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">堤水</td>
				<td colspan='2' style="border-top:1px solid #cdd6e2">跨流域调水</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">地表水非工程供水量</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">合计</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">浅层水</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">深层水</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">微咸水</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">合计</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">污水处理回用量</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">雨水利用</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">海水淡化</td>
				<td rowspan="2" style="border-top:1px solid #cdd6e2">合计</td>
			</tr>
			<tr>
			<td style="border-top:1px solid #cdd6e2">调入量</td>
			<td style="border-top:1px solid #cdd6e2">调出流域名称</td>
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
  <script type="text/javascript" src="<%=basePath %>pages/message/gb/10/gs.js"></script>
</html>
