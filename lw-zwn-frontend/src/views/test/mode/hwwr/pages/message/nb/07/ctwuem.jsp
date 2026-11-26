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
<title>海河流域各省用水效率情况表</title>
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
		
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>年海河流域各省用水效率情况表 </span>
		</div>
		<table id="table1" class="bbTable"   style="width:1080px">
			<thead>
				<tr>
					<th rowspan="2" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="2" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="2" data-field="AD_NM" >行政区名称</th>
					<th colspan="3" >工业用水重复利用率</th>
					<th colspan="3" >公共供水管网漏损率</th>
					<th colspan="3" >农田灌溉水有效利用系数</th>
				</tr>
				<tr>
					<th data-field="IND_WW" >工业<br>取水量</th>
					<th data-field="IND_REU_W" >工业<br>用水<br>重复量</th>
					<th data-field="IND_RRIW" >重复<br>利用率<br>（%）</th>
					<th data-field="PIPE_TOT_WS" >公共管网<br>供水总量</th>
					<th data-field="PIPE_EFF_WS" >公共管网<br>有效供总量</th>
					<th data-field="PIPE_DROP_R" >漏损率（%）</th>
					<th data-field="IRR_WU" >农田灌溉<br>取水量</th>
					<th data-field="EFF_IRR" >有效灌溉<br>水量</th>
					<th data-field="IRR_R" >利用系数</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >行政区名称</th>
					<th data-field="IND_WW" >工业<br>取水量</th>
					<th data-field="IND_REU_W" >工业<br>用水<br>重复量</th>
					<th data-field="IND_RRIW" >重复<br>利用率<br>（%）</th>
					<th data-field="PIPE_TOT_WS" >公共管网<br>供水总量</th>
					<th data-field="PIPE_EFF_WS" >公共管网<br>有效供总量</th>
					<th data-field="PIPE_DROP_R" >漏损率（%）</th>
					<th data-field="IRR_WU" >农田灌溉<br>取水量</th>
					<th data-field="EFF_IRR" >有效灌溉<br>水量</th>
					<th data-field="IRR_R" >利用系数</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/07/ctwuem.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>