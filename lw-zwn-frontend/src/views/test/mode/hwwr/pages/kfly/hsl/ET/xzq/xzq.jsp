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
  	
  			&nbsp;&nbsp;
		<div class="sc_div">
			  	行政区：
	  		<select id="lyfqselect"  class="sc_input">
		  		<option value="ly1">省市分区</option>
		  		<option value="ly2">区县分区</option>
	  		</select>
		</div>

	  	  	&nbsp;&nbsp;
  	<div class="sc_div">
	  	  	<span id="fqnmSpan">分区名称：</span>
  		<input type="text" id="lynm" name="lynm"  class="sc_input"  onClick="openLy()" >
  	</div>

	  	  	&nbsp;&nbsp;
  	<div class="sc_div"  id="dkxzSpan" style="width:215px;display:none">
		<span>地块单元选择：</span>	
  		<input type="text" id="dknm" name="dknm" onClick="openDyxz()" class="sc_input"  style="display:none">
  	</div>
	  	  
	  	  	&nbsp;&nbsp;
  	<div class="sc_div" style="width:240px">
		时间：
		<input type="text" id="btm" name="datemonth" onClick="WdatePicker({ dateFmt: 'yyyy'})" class="sc_input  sc_input_fix"  style="width:80px">  
	   	--
	   	<input type="text" id="etm" name="datemonth" onClick="WdatePicker({ dateFmt: 'yyyy'})" class="sc_input"  style="width:80px">  
  	</div>
	   	 
	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="init()">
  	</div>
    <center class="conent" style="padding-bottom:10px;height:90%">
    <div class="titleDiv"><span id="tmSpan"></span></div>
	<table class="bbTable">
		<thead id="theadtbody">
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/kfly/hsl/ET/xzq/xzq.js"></script>
</html>
