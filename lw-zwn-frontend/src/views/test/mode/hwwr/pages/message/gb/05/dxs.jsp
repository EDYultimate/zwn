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
    <div class="titleDiv"><span id="t_year"></span>地下水资源量统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td rowspan="2">分区</td>
				<td colspan="2">计算面积<br>(km²)</td>
				<td colspan="7">平原区<br>(亿m³)</td>
				<td colspan="6">山丘区<br>(亿m³)</td>
				<td rowspan="2">平原区与山丘区间地下水资源重复计算量<br>(亿m³)</td>
				<td rowspan="2">分区地下水资源量<br>(亿m³)</td>
			</tr>
			<tr>
				<td style="border-top:1px solid #cdd6e2">总面积</td>
				<td style="border-top:1px solid #cdd6e2">其中平原面积</td>
				<td style="border-top:1px solid #cdd6e2">降水入渗补给量</td>
				<td style="border-top:1px solid #cdd6e2">山前测渗补给量</td>
				<td style="border-top:1px solid #cdd6e2">地表水体入渗补给量</td>
				<td style="border-top:1px solid #cdd6e2">其中河川基流补给</td>
				<td style="border-top:1px solid #cdd6e2">井灌回归补给量</td>
				<td style="border-top:1px solid #cdd6e2">总补给量</td>
				<td style="border-top:1px solid #cdd6e2">地下水资源量</td>
				<td style="border-top:1px solid #cdd6e2">河川基流量</td>
				<td style="border-top:1px solid #cdd6e2">山前侧渗流出量</td>
				<td style="border-top:1px solid #cdd6e2">山前泉水溢出量</td>
				<td style="border-top:1px solid #cdd6e2">潜水蒸发量</td>
				<td style="border-top:1px solid #cdd6e2">开采净消耗量</td>
				<td style="border-top:1px solid #cdd6e2">地下水资源量</td>
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
  <script type="text/javascript" src="<%=basePath %>pages/message/gb/05/dxs.js"></script>
</html>
