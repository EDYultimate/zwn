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
<title>海河流域平原区浅层地下水动态情况</title>
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
			<span id="cyear"></span><span>年海河流域平原区浅层地下水动态情况统计表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:1386px">
			<thead>
				<tr>
					<th rowspan="2" data-field="FQ" display="hide" style="display:none">FQ</th>
					<th rowspan="2" data-field="XZQ" display="hide" style="display:none">XZQ</th>
					<th rowspan="2" data-field="WRZ_NM" >流域<br>分区</th>
					<th rowspan="2" data-field="AD_NM" >行政区</th>
					<th rowspan="2" data-field="PLAIN_NM" >平原区</th>
					<th colspan="4">上&nbsp;&nbsp;升&nbsp;&nbsp;区</th>
					<th colspan="4">下&nbsp;&nbsp;降&nbsp;&nbsp;区</th>
					<th colspan="4">相&nbsp;&nbsp;对&nbsp;&nbsp;稳&nbsp;&nbsp;定&nbsp;&nbsp;区</th>
					<th rowspan="2"  data-field="SUM_WSV" >蓄水<br>变量<br>合计<br>(10⁸m³)</th>
					<th colspan="3">1980年起累计蓄变量</th>
					<th colspan="2">当年地下水<br>开采量</th>
				</tr>
				<tr>
					<th data-field="RZ_A" >面积<br>(km²)</th>
					<th data-field="UP_ZRN" >平均<br>变幅<br>(m)</th>
					<th data-field="UP_SVC" >给水度<br>μ</th>
					<th data-field="UP_WSV" >蓄水<br>变量<br>(10⁸m³)</th>
					<th data-field="DW_A" >面积<br>(km²)</th>
					<th data-field="DW_ZRN" >平均<br>变幅<br>(m)</th>
					<th data-field="DW_SVC" >给水度<br>μ</th>
					<th data-field="DW_WSV" >蓄水<br>变量<br>(10⁸m³)</th>
					<th data-field="STZ_A" >面积<br>(km²)</th>
					<th data-field="ST_ZRN" >平均<br>变幅<br>(m)</th>
					<th data-field="ST_SVC" >给水度<br>μ</th>
					<th data-field="ST_WSV" >蓄水<br>变量<br>(10⁸m³)</th>
					<th data-field="WD_1980" >1980年<br>末平均<br>水位<br>埋深<br>(m)</th>
					<th data-field="WD_CURR" >当年<br>末平均<br>水位<br>埋深<br>(m)</th>
					<th data-field="WSV1980" >累计<br>蓄变量<br>(10⁸m³)</th>
					<th data-field="SG_ACT_EW" >总量<br>(10⁸m³)</th>
					<th data-field="DG_WYL" >其中<br>深层<br>(10⁸m³)</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="FQ" display="hide" style="display:none">FQ</th>
					<th data-field="XZQ" display="hide" style="display:none">XZQ</th>
					<th data-field="WRZ_NM">流域分区</th>
					<th data-field="AD_NM">行政区</th>
					<th data-field="PLAIN_NM">平原区</th>
					<th data-field="RZ_A">面积(km²)</th>
					<th data-field="UP_ZRN">平均变幅(m)</th>
					<th data-field="UP_SVC">给水度μ</th>
					<th data-field="UP_WSV">蓄水变量(10⁸m³)</th>
					<th data-field="DW_A">面积(km²)</th>
					<th data-field="DW_ZRN">平均变幅(m)</th>
					<th data-field="DW_SVC">给水度μ</th>
					<th data-field="DW_WSV">蓄水变量(10⁸m³)</th>
					<th data-field="STZ_A">面积(km²)</th>
					<th data-field="ST_ZRN">平均变幅(m)</th>
					<th data-field="ST_SVC">给水度μ</th>
					<th data-field="ST_WSV">蓄水变量(10⁸m³)</th>
					<th data-field="SUM_WSV">蓄水变量合计(10⁸m³)</th>
					<th data-field="WD_1980">1980年末平均水位埋深(m)</th>
					<th data-field="WD_CURR">当年末平均水位埋深(m)</th>
					<th data-field="WSV1980">累计蓄水变量(10⁸m³)</th>
					<th data-field="SG_ACT_EW">总量(10⁸m³)</th>
					<th data-field="DG_WYL">其中深层(10⁸m³)</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/gb/08/pydxs.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/08/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
