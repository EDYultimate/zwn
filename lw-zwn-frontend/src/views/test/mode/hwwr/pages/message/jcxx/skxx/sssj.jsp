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
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
	<style>
	table{table-layout:fixed;}
	tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
  </head>
  <body>
  
  	<div class="searchDiv">
		&nbsp;&nbsp;&nbsp;&nbsp;
	  	&nbsp;&nbsp;&nbsp;&nbsp;
	  	水库名称：<input type="text" id="nm" name="nm">
	  	  	&nbsp;&nbsp;&nbsp;&nbsp;
	  	 时间：<input type="text" id="btm" name="datemonth" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">  
	   	--
	   	<input type="text" id="etm" name="datemonth" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">  
	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;">
    <div class="titleDiv"><span id="tmSpan"></span>水库监测信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td style="width:150px">水库名称</td>
				<td>时间</td>
				<td >总库容<br/>(百万m³)</td>
				<td >调洪库容<br/>(百万m³)</td>
				<td >正常蓄水位<br/>(m) </td>
				<td >校核洪水位 <br/>(m)</td>
				<td >兴利库容<br/>(百万m³)</td>
				<td>水位(m)</td>
				<td>蓄水量<br/>(百万m³)</td>
				<td>入库流量<br/>(m³/s)</td>
				<td >出库流量<br/>(m³/s)</td>
			</tr>
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/message/jcxx/skxx/sssj.js"></script>
</html>
