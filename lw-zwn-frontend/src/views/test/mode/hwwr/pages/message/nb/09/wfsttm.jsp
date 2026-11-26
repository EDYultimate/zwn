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
<title>海河流域水资源费征收使用情况</title>
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
			<span id="cyear1"></span><span>年海河流域水资源费征收使用情况表 </span>
		</div>
		<table id="table1" class="bbTable"   style="width:1080px">
			<thead>
				<tr>
					<th rowspan="3" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="3" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="3" data-field="AD_NM" >行政分区</th>
					<th colspan="11" >水资源费征收</th>
					<th colspan="7" >水资源费使用</th>
					<th rowspan="2"  data-field="TO_CEN_WF"  >上交中央<br>水资源费</th>
					<th rowspan="2"  data-field="NT"  >备注</th>
				</tr>
				<tr>
					<th colspan="7" >按取水用途分类</th>
					<th data-field="CALS0" >合计</th>
					<th colspan="3" >按取水水源分类</th>
					<th data-field="WF_MAN" >管理</th>
					<th data-field="WF_BAS_WORK" >基础工作</th>
					<th data-field="WF_WR_PROT" >水资源保护</th>
					<th data-field="WF_SAVE" >节约用水</th>
					<th data-field="WF_DEV_USE" >开发利用</th>
					<th data-field="WF_OTH_USE" >其他</th>
					<th data-field="CALS" >合计</th>
				</tr>
				<tr>
					<th rowspan="2"  data-field="LEVY_TAP"  >自来水</th>
					<th colspan="2" >自备水</th>
					<th rowspan="2"  data-field="LEVY_AGR"  >农业</th>
					<th rowspan="2"  data-field="LEVY_TP"  >火电</th>
					<th rowspan="2"  data-field="LEVY_HP"  >水力发电</th>
					<th rowspan="2"  data-field="LEVY_OTH"  >其他</th>
					<th rowspan="2"  data-field="LEYP_WS"  >地表水</th>
					<th rowspan="2"  data-field="LEYP_GW"  >地下水</th>
					<th rowspan="2"  data-field="LEYP_OTH"  >其他</th>
				</tr>
				<tr>
					<th data-field="LEVY_SLF" >生活</th>
					<th data-field="LEVY_IND" >工业<br>(不含火电)</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >行政分区</th>
					
					<th data-field="LEVY_TAP" >自来水</th>
					<th data-field="LEVY_SLF" >生活</th>
					<th data-field="LEVY_IND" >工业<br>(不含火电)</th>
					<th data-field="LEVY_AGR"  >农业</th>
					<th data-field="LEVY_TP"  >火电</th>
					<th data-field="LEVY_HP"  >水力发电</th>
					<th data-field="LEVY_OTH"  >其他</th>
					<th data-field="CALS0" >合计</th>
					<th data-field="LEYP_WS"  >地表水</th>
					<th data-field="LEYP_GW"  >地下水</th>
					<th data-field="LEYP_OTH"  >其他</th>
					
					<th data-field="WF_MAN" >管理</th>
					<th data-field="WF_BAS_WORK" >基础工作</th>
					<th data-field="WF_WR_PROT" >水资源保护</th>
					<th data-field="WF_SAVE" >节约用水</th>
					<th data-field="WF_DEV_USE" >开发利用</th>
					<th data-field="WF_OTH_USE" >其他</th>
					<th data-field="CALS" >合计</th>
					<th data-field="TO_CEN_WF"  >上交中央<br>水资源费</th>
					<th data-field="NT"  >备注</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/09/wfsttm.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>