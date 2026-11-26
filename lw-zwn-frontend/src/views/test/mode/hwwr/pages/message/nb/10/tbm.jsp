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
<body style="overflow: auto;">

	<div class="searchDiv">
		时间：<input type="text"  id="chooseyear"  name="year" onClick="WdatePicker({ dateFmt: 'yyyy'})">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<center>	
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>年海河流域水资源管理机构统计表 </span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
			<thead>
				<tr>
					<th rowspan="2" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="2" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="2" data-field="AD_NM" >行政区</th>
					<th colspan="2" >行政管理机构</th>
					<th colspan="2" >事业单位</th>
					<th colspan="2" >其他</th>
					<th colspan="3" >合计</th>
					<th rowspan="2"  data-field="NT"  >备注</th>
				</tr>
				<tr>
					<th data-field="ADM_NUM" >机构</th>
					<th data-field="ADM_P_PN" >人员</th>
					<th data-field="INS_NUM" >机构</th>
					<th data-field="INS_P_PN" >人员</th>
					<th data-field="OTH_NUM" >机构</th>
					<th data-field="OTH_P_PN" >人员</th>
					<th data-field="SUMNUM" >机构</th>
					<th data-field="SUMP" >人员</th>
					<th data-field="COL_EDU_PN" >大专以上<br>学历人员数</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >行政区</th>
					<th data-field="ADM_NUM" >机构</th>
					<th data-field="ADM_P_PN" >人员</th>
					<th data-field="INS_NUM" >机构</th>
					<th data-field="INS_P_PN" >人员</th>
					<th data-field="OTH_NUM" >机构</th>
					<th data-field="OTH_P_PN" >人员</th>
					<th data-field="SUMNUM" >机构</th>
					<th data-field="SUMP" >人员</th>
					<th data-field="COL_EDU_PN" >大专以上<br>学历人员数</th>
					<th data-field="NT" >备注</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/10/tbm.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>