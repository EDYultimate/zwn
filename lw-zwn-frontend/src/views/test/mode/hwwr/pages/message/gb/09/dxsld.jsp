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
<title>海河流域平原区地下水位降落漏斗情况</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<style type="text/css">
.bbTable > tbody > tr > td, th {
	padding: 0px
}
</style>
</head>
<body style="overflow: auto;">
	<center>
	
		<input id="chooseyear"  type="text"   onClick="WdatePicker({dateFmt:'yyyy',realDateFmt:'yyyy'})"/>
		<button style="margin-left:10px" onclick="querybyyear()">查询</button>
		
		<div class="titleDiv">
			<span id="cyear"></span><span>年海河流域平原区地下水位降落漏斗情况统计表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:950px">
			<thead>
				<tr>
					<th rowspan="2" data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th rowspan="2" data-field="FUNN_CD" display="hide" style="display:none">FUNN_CD</th>
					<th rowspan="2" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="2" data-field="FUNN_NM" >漏斗名称</th>
					<th rowspan="2" data-field="PLAIN_NM" >所属平原名称</th>
					<th rowspan="2" data-field="FUNN_CHAR" >漏斗性质</th>
					<th rowspan="2" data-field="FUNN_CENT" >漏斗中心位置</th>
					<th rowspan="2" data-field="FUNN_DEPT" > 漏斗周边埋深<br>(m)</th>
					<th colspan="3">漏 斗 面 积(km²)</th>
					<th colspan="3">漏斗中心水位埋深(m)</th>
				</tr>
				<tr>
					<th data-field="YB_FA" > 上年末</th>
					<th data-field="YE_FA" > 当年末</th>
					<th data-field="CAL_FA" >年增减值</th>
					<th data-field="YB_FD" > 上年末</th>
					<th data-field="YE_FD" > 当年末</th>
					<th data-field="CAL_FD" >年增减值</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th data-field="FUNN_CD" display="hide" style="display:none">FUNN_CD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="FUNN_NM" >漏斗名称</th>
					<th data-field="PLAIN_NM" >所属平原名称</th>
					<th data-field="FUNN_CHAR" >漏斗性质</th>
					<th data-field="FUNN_CENT" >漏斗中心位置</th>
					<th data-field="FUNN_DEPT" > 漏斗周边埋深<br>(m)</th>
					<th data-field="YB_FA" > 上年末</th>
					<th data-field="YE_FA" > 当年末</th>
					<th data-field="CAL_FA" >年增减值</th>
					<th data-field="YB_FD" > 上年末</th>
					<th data-field="YE_FD" > 当年末</th>
					<th data-field="CAL_FD" >年增减值</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</center>
	
	<center>
		<div id="chart" style="width: 700px;height:500px;"></div>
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
<script type="text/javascript" src="<%=basePath %>pages/message/gb/09/dxsld.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/09/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
