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
	  	&nbsp;&nbsp;
<div class="sc_div"> 
  	路线：<select id="fw"  class="sc_input">
  			<!-- <option value="">全部</option>
  			<option value="2">水资源分区</option>
  			<option value="1">行政区</option> -->
  		</select>
 </div> 
  		&nbsp;&nbsp;
 <div class="sc_div"> 
   	 时间：<input type="text" id="year" name="year"  class="sc_input"  onClick="WdatePicker({dateFmt: 'yyyy'})">  
 </div> 
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="ini()">
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;height:90%;">
    <div class="titleDiv"><span id="t_year"></span>水量统计表（万m3）</div>
	<table class="bbTable" style="width:100%" id="oneTable">
		<thead id="theadtab">
			
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	
		<div id="chartDIV" style="background-color: #ffffff;text-align:center;height:400px;width:99%;float:left;margin-top:20px; border: 1px solid #AAAAAA;">
         </div>
	</center>
  </body>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
   <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>pages/nsbd/tj/nsbdTj.js"></script>
</html>
