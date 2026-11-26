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
	
	<center  style="background-color: #fff;">	
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>年海河流域节水技改工程建设统计表</span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
			<thead>
				<tr>
					<th rowspan="2" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="2" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="2" data-field="AD_NM" >行政分区</th>
					<th colspan="4" >农业</th>
					<th colspan="2" >工业</th>
					<th colspan="2" >城镇生活和服务业</th>
				</tr>
				<tr>
					<th data-field="AGR_WSI_AD" >节水资金投入（万元）</th>
					<th data-field="AGR_EIA" >有效灌溉面积（万亩）</th>
					<th data-field="AGR_NIA" >新增灌溉面积（万亩）</th>
					<th data-field="AGR_WSIA" >新增节水灌溉面积（万亩）</th>
					<th data-field="IND_WSI_AD" >节水资金投入（万元）</th>
					<th data-field="IND_RRIW" >工业用水重复利用率（%）</th>
					<th data-field="ULSI_WSI_AD" >节水资金投入（万元）</th>
					<th data-field="ULSI_CCWSD" >城镇节水器具普及率（%）</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >行政分区</th>
					<th data-field="AGR_WSI_AD" >节水资金投入（万元）</th>
					<th data-field="AGR_EIA" >有效灌溉面积（万亩）</th>
					<th data-field="AGR_NIA" >新增灌溉面积（万亩）</th>
					<th data-field="AGR_WSIA" >新增节水灌溉面积（万亩）</th>
					<th data-field="IND_WSI_AD" >节水资金投入（万元）</th>
					<th data-field="IND_RRIW" >工业用水重复利用率（%）</th>
					<th data-field="ULSI_WSI_AD" >节水资金投入（万元）</th>
					<th data-field="ULSI_CCWSD" >城镇节水器具普及率（%）</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
		<div id="jsChart" style="width: 1000px;height:500px;"></div>
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/11/jsjg.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/nb/11/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>