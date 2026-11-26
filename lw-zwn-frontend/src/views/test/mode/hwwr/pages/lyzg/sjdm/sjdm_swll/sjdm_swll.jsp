<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>93个水位流量站</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script type="text/javascript" src="<%=basePath %>pages/szybh/sjdm/sjdm_sz/sjdm_sz_common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
	<style>
	body{padding:0;margin:0}
	</style>
  </head>
  <body>
  	<div class="searchDiv">
	  	&nbsp;&nbsp;
		<div class="sc_div"  style="width:280px">
	   	 	时间：
	   	 	<input readonly="readonly" type="text" id="beginTm" name="beginTm"  class="sc_input sc_input_fix"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endTm\')}'})"> 
	   	 	-- 
	   	 	<input readonly="readonly" type="text" id="endTm" name="endTm"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd',minDate:'#F{$dp.$D(\'beginTm\')}'})">
	   	</div>
	   	&nbsp;&nbsp;
	   	<div class="sc_div">
	   	 	断面名称：
	   	 	<input type="text" id="nm" name="nm"  class="sc_input">
	   	 </div>	
	   	 &nbsp;&nbsp;&nbsp;&nbsp;
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;">
    <div class="titleDiv"><span id="t_date"></span><span>测站水位流量监测信息表</span></div>
    <div class="tableDiv" style="width:100%">
	   	<table id="sjdmZbTable" class="bbTable fixtab" style="width:100%;">
			<thead id="thead">
			
			</thead>
			<tbody id="tbody">
				
			</tbody>
		</table>
    </div>
	<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/lyzg/sjdm/sjdm_swll/sjdm_swll.js"></script>
</html>
