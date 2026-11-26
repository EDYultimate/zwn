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
<title>海河流域水资源管理机构统计表</title>
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
	
	<center style="background-color: #fff;">	
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>年海河流域节水技改工程建设统计表</span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
			<thead>
				<tr>
					<th rowspan="2" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="2" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="3" data-field="AD_NM" >行政分区</th>
					<th colspan="2" >节水型灌区（个）</th>
					<th colspan="10" >节水型单位（个）</th>
					<th colspan="2" >节水型居民小区（个）</th>
				</tr>
				<tr>
					<th data-field="SCIA_A" rowspan="2" >新增数</th>
					<th data-field="SCIA_T" rowspan="2" >累计数</th>
					<th colspan="2" >企业</th>
					<th colspan="2" >机关</th>
					<th colspan="2" >学校</th>
					<th colspan="2" >其他</th>
					<th colspan="2" >合计</th>
					<th rowspan="2" data-field="SCLE_A">新增数</th>
					<th rowspan="2" data-field="SCLE_T">累计数</th>
				</tr>
				<tr>
					<th data-field="SCEP_A" >新增数</th>
					<th data-field="SCEP_T" >累计数</th>
					<th data-field="SCOF_A" >新增数</th>
					<th data-field="SCOF_T" >累计数</th>
					<th data-field="SCSL_A" >新增数</th>
					<th data-field="SCSL_T" >累计数</th>
					<th data-field="SCOT_A" >新增数</th>
					<th data-field="SCOT_T" >累计数</th>
					<th data-field="SCORG_A" >新增数</th>
					<th data-field="SCORG_T" >累计数</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >行政分区</th>
					<th data-field="SCIA_A" >新增数</th>
					<th data-field="SCIA_T" >累计数</th>
					<th data-field="SCEP_A" >新增数</th>
					<th data-field="SCEP_T" >累计数</th>
					<th data-field="SCOF_A" >新增数</th>
					<th data-field="SCOF_T" >累计数</th>
					<th data-field="SCSL_A" >新增数</th>
					<th data-field="SCSL_T" >累计数</th>
					<th data-field="SCOT_A" >新增数</th>
					<th data-field="SCOT_T" >累计数</th>
					<th data-field="SCORG_A" >新增数</th>
					<th data-field="SCORG_T" >累计数</th>
					<th data-field="SCLE_A">新增数</th>
					<th data-field="SCLE_T">累计数</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>

		<div id="ztChart" style="width: 1000px;height:500px;"></div>
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/13/jsztjs.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/nb/13/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>