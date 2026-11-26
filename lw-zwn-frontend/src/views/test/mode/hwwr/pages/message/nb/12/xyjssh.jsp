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
<title>海河流域县域节水型社会达标建设统计表</title>
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
<body style="overflow-y: auto;">

	<div class="searchDiv">
		<div class="sc_div">
			时间：
			<input type="text" id="chooseyear" name="year" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
	  	</div>
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<center  style="background-color: #fff;">	
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>年海河流域节水技改工程建设统计表</span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
			<thead id="realth1" >
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >行政区名称</th>
					<th data-field="TFYP" >十三五目标完成数(个)</th>
					<th data-field="YPC" >年度计划完成数(个)</th>
					<th data-field="YRC" >年度实际完成数(个)</th>
					<th data-field="TOL_NUM" >累计完成数(个)</th>
					<th data-field="TOL_RATE" >累计完成比例(%)</th>
					<th data-field="NT" >备注</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
		<div id="xyChart" style="width: 1000px;height:500px;"></div>
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/12/xyjssh.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/nb/12/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>