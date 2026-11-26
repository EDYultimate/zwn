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
<title>雨情旬月报</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">

	<style>
		.conent{
			margin-top:0px;
		}
		.searchDiv{
			padding:4px;
		}
	</style>
</head>
<body>
    
	<div class="searchDiv">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<div class="sc_div">
			开始：
			<input type="text" id="start" name="time" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" class="sc_input">
		</div>
		
		&nbsp;&nbsp;
		<div class="sc_div">
			结束：<input type="text" id="end" name="time" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})" class="sc_input">
		</div>
		&nbsp;&nbsp;
		<div class="sc_div">
			测站名称：
			<input type="text" id="stnm" name="stnm"  class="sc_input">
		</div>
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="query()">
	</div>
	
	<%--<center   class="conent" style="width: 100%;height: calc(100% - 100px);overflow-x: hidden;">--%>
	<center   class="conent" style="width: 100%;;overflow-x: hidden;">
		<div class="titleDiv">雨情旬月报</div>
		<table id="table" class="bbTable">
			<thead>
				<tr>
					<th data-field="STCD" >站码</th>
					<th data-field="STNM" >站名</th>
					<th data-field="RVNM">河名</th>
					<th data-field="TMONTH">时间</th>
					<th data-field="VAL01">上旬(mm)</th>
					<th data-field="VAL02">中旬(mm)</th>
					<th data-field="VAL03">下旬(mm)</th>
					<th data-field="VAL">月雨量(mm)</th>
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
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/customdate.js"></script>
 <script type="text/javascript"  src="<%=basePath %>pages/kfly/jsl/xyb/xyb.js"></script>
</html>
