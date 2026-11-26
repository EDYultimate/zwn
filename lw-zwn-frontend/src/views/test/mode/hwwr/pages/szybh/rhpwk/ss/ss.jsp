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
	td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
  </head>
  <body>
  
  	<div class="searchDiv">
  		<div class="sc_div"  style="width:220px;">
   	 	排污口名称：<input type="text" id="pdo_nm" name="pdo_nm" 
   	 		placeholder="输入排污口名称" class="sc_input"  style="width: 107px;">
   	 	</div>
  		&nbsp;&nbsp;
  		<div class="sc_div" style="width:280px">
	   	 	时间：
	   	 	<input type="text" id="btm" name="datemonth"  class="sc_input sc_input_fix"   onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
		   	--
		   	<input type="text" id="etm" name="datemonth"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
	   	</div>
	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv"><span id="tmSpan"></span>入河排污口实时统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
			<td style="border-top:1px solid #E1E1E1">排污口名称</td>
			<td style="border-top:1px solid #E1E1E1">排污口监测站</td>
			<td style="border-top:1px solid #E1E1E1">排污口监测点</td>
			<td style="border-top:1px solid #E1E1E1">排污口地址</td>
			<td style="border-top:1px solid #E1E1E1">管理单位</td>
			<td style="border-top:1px solid #E1E1E1">累计排污量(万m³)</td>
			</tr>			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<div class="M-box"></div>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/rhpwk/ss/ss.js"></script>
</html>