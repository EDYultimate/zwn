<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String year=request.getParameter("year");
if (year==null) {
	year = "";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>中央数据统计</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
</head>
<body>

	
	<div class="searchDiv">
		&nbsp;&nbsp;
<div class="sc_div">
		时间：
		<input type="text" id="chooseyear" name="year" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
</div>
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<center   class="conent" style="width: 100%;height: calc(100% - 100px);overflow-x: hidden;">
		<div class="titleDiv">海委上报中央数据情况 (<span class="cyear"></span>年<span class="cmonth"></span>月)</div>
		<table id="table1" class="bbTable">
			<thead>
				<tr>
					<th data-field="TYPE" display="hide" style="display:none">TYPE</th>
					<th data-field="NM">类型</th>
					<th data-field="TM">时间</th>
					<th data-field="HASNUM">有数据测站数</th>
					<th data-field="NONUM">无数据测站数</th>
					<th data-field="STNUM">上报数据总数</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<br>
		
		<div class="titleDiv">海委接收中央数据情况 (<span class="cyear"></span>年<span class="cmonth"></span>月)</div>
		<table id="table2" class="bbTable">
			<thead>
				<tr>
					<th data-field="TYPE" display="hide" style="display:none">TYPE</th>
					<th data-field="NM">类型</th>
					<th data-field="TM">时间</th>
					<th data-field="HASNUM">接收测站数</th>
					<th data-field="STNUM">接收数据总条数</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
	</center>
</body>
<script type="text/javascript">
var hwwr = {};
hwwr.basePath = "<%=basePath%>";
hwwr.option = {};
hwwr.option.year = "<%=year%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/lyzg/zysjtj/zysjtj.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>
