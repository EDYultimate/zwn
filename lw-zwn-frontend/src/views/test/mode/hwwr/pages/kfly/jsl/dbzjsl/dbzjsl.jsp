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
<title>代表站降水量</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
</head>
<body>

	
	<div class="searchDiv">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<div class="sc_div">
			时间：
			<input type="text" id="chooseyear" name="year"  class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy'})">
		</div>
		
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	<%--<center   class="conent" style="width: 100%;height: calc(100% - 100px);overflow-x: hidden;">--%>
	<center   class="conent" style="width: 100%;;overflow-x: hidden;">
		<div class="titleDiv"><span id="cyear"></span>年海河流域代表站月、年降水量统计表<span id="unit" style="font-size: 14px;float: right;margin-top: 10px;">单位：mm</span></div>
		<table id="table" class="bbTable">
			<thead>
				<tr>
					<th rowspan="2" data-field="STCD" display="hide" style="display:none">STCD</th>
					<th rowspan="2" data-field="RVNM">河名</th>
					<th rowspan="2" data-field="ST_NM">站名</th>
					<th rowspan="2" data-field="PROJ">项目</th>
					<th colspan="12">各&nbsp;&nbsp;月&nbsp;&nbsp;降&nbsp;&nbsp;水&nbsp;&nbsp;量</th>
					<th rowspan="2"  data-field="YR_P">年降水量</th>
				</tr>
				<tr>
					<th data-field="JAN_P">1</th>
					<th data-field="FEB_P">2</th>
					<th data-field="MAR_P">3</th>
					<th data-field="APR_P">4</th>
					<th data-field="MAY_P">5</th>
					<th data-field="JUN_P">6</th>
					<th data-field="JUL_P">7</th>
					<th data-field="AUG_P">8</th>
					<th data-field="SEP_P">9</th>
					<th data-field="OCT_P">10</th>
					<th data-field="NOV_P">11</th>
					<th data-field="DEC_P">12</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="STCD" display="hide" style="display:none">STCD</th>
					<th data-field="RVNM">河名</th>
					<th data-field="ST_NM">站名</th>
					<th data-field="PROJ">项目</th>
					<th data-field="JAN_P">1</th>
					<th data-field="FEB_P">2</th>
					<th data-field="MAR_P">3</th>
					<th data-field="APR_P">4</th>
					<th data-field="MAY_P">5</th>
					<th data-field="JUN_P">6</th>
					<th data-field="JUL_P">7</th>
					<th data-field="AUG_P">8</th>
					<th data-field="SEP_P">9</th>
					<th data-field="OCT_P">10</th>
					<th data-field="NOV_P">11</th>
					<th data-field="DEC_P">12</th>
					<th data-field="YR_P">年降水量</th>
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
<script type="text/javascript" src="<%=basePath %>pages/kfly/jsl/dbzjsl/dbzjsl.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>
