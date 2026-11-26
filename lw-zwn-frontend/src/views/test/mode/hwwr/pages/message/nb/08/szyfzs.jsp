<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>实施监督管理的取水许可证统计表</title>
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
	 
   	 时间：<input type="text" id="year" name="year" onClick="WdatePicker({dateFmt: 'yyyy'})">  
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;">
    <div class="titleDiv"  style="width:2500px"><span id="t_year"></span>海河流域各省水资源费征收标准统计表(水价：元/立方米)</div>
	<table class="bbTable" style="width:2500px" id="oneTable">
		<thead>
			<tr>
				<td rowspan="2"  style="width:150px">行政分区</td>
				<td rowspan="2">区域</td>
				<td colspan="9">地表水</td>
				<td colspan="8" >地下水</td>
			</tr>
			<tr>
				<td style="border-top:1px solid #E1E1E1">自来水</td>
				<td style="border-top:1px solid #E1E1E1">生活自备水</td>
				<td style="border-top:1px solid #E1E1E1">工业自备水</td>
				<td style="border-top:1px solid #E1E1E1">农业</td>
				<td style="border-top:1px solid #E1E1E1">火电</td>
				<td style="border-top:1px solid #E1E1E1">水电</td>
				<td style="border-top:1px solid #E1E1E1">其他1</td>
				<td style="border-top:1px solid #E1E1E1">其他2</td>
				<td style="border-top:1px solid #E1E1E1">其他3</td>
				<td style="border-top:1px solid #E1E1E1">自来水</td>
				<td style="border-top:1px solid #E1E1E1">生活自备水</td>
				<td style="border-top:1px solid #E1E1E1">工业自备水</td>
				<td style="border-top:1px solid #E1E1E1">农业</td>
				<td style="border-top:1px solid #E1E1E1">火电</td>
				<td style="border-top:1px solid #E1E1E1">其他1</td>
				<td style="border-top:1px solid #E1E1E1">其他2</td>
				<td style="border-top:1px solid #E1E1E1">其他3</td>
			</tr> 
			
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	
	
	</center>
  </body>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
   <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>pages/message/nb/08/szyfzs.js"></script>
</html>
