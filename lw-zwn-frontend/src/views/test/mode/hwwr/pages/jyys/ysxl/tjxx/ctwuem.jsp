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
<body>
	
	<div class="searchDiv">
		&nbsp;&nbsp;
  	<div class="sc_div">
		时间：
		<input type="text"  id="chooseyear"  name="year" class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
  	</div>
		
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	<%--<center  class="conent" style="width: 100%;height: calc(100% - 55px);">--%>
	<center  class="conent" style="width: 100%;">
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>年海河流域各省用水效率情况表 <span style="font-size: small;font-weight: 400;">(水量: 亿立方米)</span></span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
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

		<div id="ysChart" style="width: 33%;height:500px;float:left"></div>
		<div id="ysChart2" style="width: 33%;height:500px;float:left"></div>
		<div id="ysChart3" style="width: 33%;height:500px;float:left"></div>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys/ysxl/tjxx/ctwuem.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys/ysxl/tjxx/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>