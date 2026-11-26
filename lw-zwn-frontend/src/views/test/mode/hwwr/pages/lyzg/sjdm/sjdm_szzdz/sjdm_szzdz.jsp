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
	<script type="text/javascript" src="<%=basePath %>pages/lyzg/sjdm/sjdm_sz/sjdm_sz_common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
	<style>
	body{padding:0;margin:0}

	tr {
		height:31px;
	}
	</style>
  </head>
  <body>
  	<div class="searchDiv">
  	
  			&nbsp;&nbsp;
		<div class="sc_div">
		  	名称：
		  	<input type="text" id="nm" name="nm"  class="sc_input">
		 </div>
	  	  	&nbsp;&nbsp;
	  	 <div class="sc_div"  style="width:280px">
		   	 时间：
		   	 <input type="text" id="btm" name="datemonth" class="sc_input sc_input_fix"  onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">  
		   	 --
		   	 <input type="text" id="etm" name="datemonth" class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">  
	   	  </div>
	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="searchM()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv"><span id="t_date"></span>水质自动站监测信息表</div>
    <div class="tableDiv" style="width:100%">
    	<div style="width:60%;height:100%;float:left;overflow:hidden;">
    		<table id="sjdmSzTable" class="bbTable fixtabSz" style="width:100%;">
				<thead id="Szthead">
				
				</thead>
				<tbody id="Sztbody">
					
				</tbody>
			</table>
    	</div>
    	<div style="width:40%;height:100%;float:left;overflow-y:hidden;">
    		<table id="sjdmZbTable" class="bbTable fixtabSz" style="width:100%;">
				<thead id="Zbthead">
				
				</thead>
				<tbody id="Zbtbody">
					
				</tbody>
			</table>
    	</div>
    </div>
	<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/lyzg/sjdm/sjdm_szzdz/sjdm_szzdz.js"></script>
</html>
