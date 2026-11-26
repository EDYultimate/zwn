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
  <style>
  .bbTable>tbody>tr>td, th{padding:0px}
  input{width:60px}
  </style>
  <body>
  	<div class="searchDiv">

<!-- <div class="sc_div">
   	上报年份：<input type="text" id="year" name="year"  class="sc_input"  onClick="WdatePicker({dateFmt: 'yyyy'})">  
</div> -->
   	 &nbsp;&nbsp;&nbsp;&nbsp;
  
    <!-- <input type="button" value="保存" class="a_input" onclick="saveData()"> -->
  
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;height:90%;">
    <div id='tableDiv'  style="width:100%">断面流量预警值设定</div>
	 <table class="bbTable" style="width:90%;" id="lhslq">
		<thead>
		<tr>
			<td>断面名称</td>
			<td>流量预警值</td>
		</tr>
		</thead>
		<tbody id="lh_slqtbody">
			
		</tbody>
	</table> 
	 <input type="button" value="保存" class="a_input" onclick="saveData()">
	 
	</center>
  </body>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
   <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>pages/szybh/rvlkappraise/yzUp/yzUp.js"></script>
</html>
