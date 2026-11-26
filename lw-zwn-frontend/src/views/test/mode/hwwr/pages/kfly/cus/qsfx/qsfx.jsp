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
	<script>var basePath = '<%=basePath%>';
	</script>
<%-- 	<link rel="stylesheet" href="<%=basePath %>common/css/bootstrap-multiselect.css" type="text/css"> --%>
<%-- 	<script src="<%=basePath%>common/js/bootstrap.min.js" type="text/javascript"></script> --%>
<%-- 	<script src="<%=basePath%>common/js/bootstrap-multiselect.js" type="text/javascript"></script> --%>
	<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/jquery.multiselect.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/css/jquery-ui.css" type="text/css">
	<script src="<%=basePath%>common/js/jquery-ui.min.js" type="text/javascript"></script>
	<script src="<%=basePath%>common/js/jquery.multiselect.js" type="text/javascript"></script>
  <style type="text/css">
  input{
	height:15px;
	border-radius: 15px;
	border: 1px solid #E1E1E1;
	text-align: center;
	outline:none;
	color:rgb(4, 84, 195);
	width:32px
}
  </style>
  </head>
  <body>
  	<div class="searchDiv">
	  	 <div class="sc_div">查询分类：
	 		<select id="fw"  class="sc_input" onchange="changemulList()">
	  			<option value="1">行政分区</option>
	  			<option value="2">水资源分区</option>
	  		</select>
		</div> 
		<div class="sc_div" style="width:300px">地区：
	 		<select id="fwwf"  class="sc_input" multiple="multiple">
	  			
	  		</select>
		</div> 
		<div class="sc_div">开始时间：
   	 	<input type="text" id="begin" name="begin"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy/MM'})">  
   	 	</div>
   	 	<div class="sc_div">结束时间：
   	 	<input type="text" id="end" name="end"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy/MM'})"> 
   	 </div>
   	 <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="width:100%;">
    <!-- 三级区 -->
	<div id="echartDiv" style="overflow-y:hidden;width:100%;height:300px">
		<!-- <div id="echart_db" class="echart" style="width:80%;margin-top:20px;"></div> -->
	</div>
    <div id="datadiv" style="overflow-y:scroll;width:100%;height:calc(100% - 300px)">
	<table class="bbTable" style="width:100%" id="oneTable">
		<thead id="thead1">
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	</div>
	
	</center>
  </body>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/kfly/cus/qsfx/qsfx.js"></script>
</html>
