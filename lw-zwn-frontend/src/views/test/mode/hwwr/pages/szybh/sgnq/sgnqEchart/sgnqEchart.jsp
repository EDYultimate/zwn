<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'sgnqEchart.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	
  </head>
  
  <body>
  <div class="searchDiv">
  	&nbsp;&nbsp;
	<div class="sc_div">
  	管理单位：
  		<select id="xzqselect" class="sc_input">
  		<option value="">全部</option>
  		<option value="040000">海河水利委员会</option>
  		<option value="110000">北京市</option>
  		<option value="120000">天津市</option>
  		<option value="130000">河北省</option>
  		<option value="140000">山西省</option>
  		<option value="410000">河南省</option>
  		<option value="370000">山东省</option>
  		<option value="150000">内蒙古自治区</option>
  		<option value="210000">辽宁省</option>
  		</select>
  	</div>
  			&nbsp;&nbsp;
	<div class="sc_div"  style="width:220px">
	  	水功能区名称：
	  		<input type="text" id="nm" name="nm" class="sc_input">
	 </div>
	  	  	&nbsp;&nbsp;
	 <div class="sc_div" style="width:280px">
	   	 时间：
	   	<input type="text" id="btm" name="datemonth"  class="sc_input  sc_input_fix"  onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">  
	   	--
	   	<input type="text" id="etm" name="datemonth" class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">  
	  </div>
	   	&nbsp;&nbsp;

	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
  	 <center class="conent" style="overflow:hidden;padding-bottom:10px;">
    <div id="tableDiv" class="tableDiv" style="float: left;width: 98%;">
    	
    		
    </div>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
    </center>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
	 <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/szybh/sgnq/sgnqEchart/sgnqEchart.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
</html>
