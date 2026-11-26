<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>平均埋深</title>
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
	<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  </head>
  <body>
  	<div class="searchDiv">
	  	<div class="sc_div" >查询分类：
	 		<select id="fw"   class="sc_input" onchange="search()">
	  			<option value="1">行政分区</option>
	  			<option value="2">水资源分区</option>
	  		</select>
		</div>
		
  		&nbsp;&nbsp;&nbsp;&nbsp;
   	 <div class="sc_div" >时间：
   	 	<input type="text" id="year" name="year"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy/MM'})">  
   	 </div>
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;">
    <div class="titleDiv"><span id="t_year"></span>平均埋深</div>
	<table class="bbTable" style="width:100%" id="oneTable">
		<thead id='theadhtml1'>
			<tr>
				<td style="width:40%;border-top:1px solid #cdd6e2">行政分区</td>
				<td style="width:20%;border-top:1px solid #cdd6e2">月均埋深(m)</td>
				<td style="width:20%;border-top:1px solid #cdd6e2">最小埋深(m)</td>
				<td style="width:20%;border-top:1px solid #cdd6e2">最大埋深(m)</td>
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
  <script type="text/javascript" src="<%=basePath %>pages/kfly/cus/pjms/pjms.js"></script>
</html>
