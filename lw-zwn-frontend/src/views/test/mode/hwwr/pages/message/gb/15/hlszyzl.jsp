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
<title>海河流域河流水资源质量概况</title>
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
			<span id="cyear"></span><span>年海河流域河流水资源质量概况评价表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:950px">
			<thead>
				<tr>
					<th rowspan="2" data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th rowspan="2" data-field="RV_CD" display="hide" style="display:none">RV_CD</th>
					<th rowspan="2" data-field="STYPE" >分期</th>
					<th rowspan="2" data-field="RV_NM" >河系</th>
					<th rowspan="2" data-field="YR_EVAL_RL" >评价河长(km)</th>
					<th colspan="6">分类河长(km)</th>
				</tr>
				<tr>
					<th data-field="YR_1_RL" >Ⅰ类</th>
					<th data-field="YR_2_RL" >Ⅱ类</th>
					<th data-field="YR_3_RL" >Ⅲ类</th>
					<th data-field="YR_4_RL" >Ⅳ类</th>
					<th data-field="YR_5_RL" >Ⅴ类</th>
					<th data-field="YR_9_RL" >劣Ⅴ类</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th data-field="RV_CD" display="hide" style="display:none">RV_CD</th>
					<th data-field="STYPE" >分期</th>
					<th data-field="RV_NM" >河系</th>
					<th data-field="YR_EVAL_RL" >评价河长(km)</th>
					<th data-field="YR_1_RL" >Ⅰ类</th>
					<th data-field="YR_2_RL" >Ⅱ类</th>
					<th data-field="YR_3_RL" >Ⅲ类</th>
					<th data-field="YR_4_RL" >Ⅳ类</th>
					<th data-field="YR_5_RL" >Ⅴ类</th>
					<th data-field="YR_9_RL" >劣Ⅴ类</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/gb/15/hlszyzl.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/15/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
