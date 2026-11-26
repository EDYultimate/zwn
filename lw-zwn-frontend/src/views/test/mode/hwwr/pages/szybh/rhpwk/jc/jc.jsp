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
  	管理单位：
  		<select id="xzqselect"  class="sc_input">
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
  	<div class="sc_div"  style="width:300px">
	  	入河排污口名称：
	  	<input type="text" id="nm" name="nm" class="sc_input">
	</div>
	  	  	&nbsp;&nbsp;
	 <div class="sc_div"  >
	 	年份：<input type="text" id="btm" name="datemonth"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">  
	 </div>
	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
  <%-- <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">--%>
	<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv"><span id="tmSpan"></span>入河排污口统计信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td rowspan='2' style="width:150px">排污口名称</td>
				<td  rowspan='2'>时间</td>
				<td  rowspan='2'>行政区</td>
<!-- 				<td  rowspan='2'>排入河流</td>
				<td  rowspan='2'>排入水功能区 </td> -->
				<td  rowspan='2'>污水排放量(万吨/年) </td>
				<td  colspan='2'>COD</td>
				<td  colspan='2'>氨氮</td>
				<td  colspan='2'>总磷</td>
				<td  colspan='2'>总氮</td>
				<td  colspan='2'>挥发酚</td>
			</tr>
			<tr>
			<td style="border-top:1px solid #E1E1E1">排放量</br>(吨/年)</td>
			<td style="border-top:1px solid #E1E1E1">浓度</br>(mg/L)</td>
			<td style="border-top:1px solid #E1E1E1">排放量</br>(吨/年)</td>
			<td style="border-top:1px solid #E1E1E1">浓度</br>(mg/L)</td>
			<td style="border-top:1px solid #E1E1E1">排放量</br>(吨/年)</td>
			<td style="border-top:1px solid #E1E1E1">浓度</br>(mg/L)</td>
			<td style="border-top:1px solid #E1E1E1">排放量</br>(吨/年)</td>
			<td style="border-top:1px solid #E1E1E1">浓度</br>(mg/L)</td>
			<td style="border-top:1px solid #E1E1E1">排放量</br>(吨/年)</td>
			<td style="border-top:1px solid #E1E1E1">浓度</br>(mg/L)</td>
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
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/rhpwk/jc/jc.js"></script>
</html>
