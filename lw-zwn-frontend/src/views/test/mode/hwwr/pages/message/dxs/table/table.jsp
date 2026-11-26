<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String yearNo=request.getParameter("yearNo");
if (yearNo==null) {
	yearNo = "";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>平原和山间盆地地下水蓄变量统计表</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</head>
<body style="overflow: auto;">
	<center>
		<div class="titleDiv">平原和山间盆地地下水蓄变量统计表<span id="cdate1"></span></div>
		<table id="table" class="bbTable" >
			<thead>
				<tr>
					<th rowspan="3" data-field="GWB_CD" display="hide" style="display:none"></th>
					<th rowspan="3" data-field="WRZ_CD" display="hide" style="display:none"></th>
					<th rowspan="3" data-field="WRZ_NM" >分区名称</th>
					<th rowspan="3" data-field="WRZ_A">计算面积（㎡）</th>
					<th colspan="5" >与<span id="lastyear"></span>相比</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="PY_T_WSV">总蓄变量（10⁴m³）</th>
					<th colspan="2" >其中增加</th>
					<th colspan="2" >其中减少</th>
				</tr>
				<tr>
					<th data-field="PY_AV_A">面积（㎡）</th>
					<th data-field="PY_AV_WSV">蓄变量（10⁴m³）</th>
					<th data-field="PY_RV_A">面积（㎡）</th>
					<th data-field="PY_RV_WSV">蓄变量（10⁴m³）</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="GWB_CD" display="hide" style="display:none"></th>
					<th data-field="WRZ_CD" display="hide" style="display:none"></th>
					<th data-field="WRZ_NM" >分区名称</th>
					<th data-field="WRZ_A">计算面积（㎡）</th>
					<th data-field="PY_T_WSV">总蓄变量（10⁴m³）</th>
					<th data-field="PY_AV_A">面积（㎡）</th>
					<th data-field="PY_AV_WSV">蓄变量（10⁴m³）</th>
					<th data-field="PY_RV_A">面积（㎡）</th>
					<th data-field="PY_RV_WSV">蓄变量（10⁴m³）</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</center>
	
	<center>
		<div id="chartYear1" style="width: 700px;height:500px;"></div>
		<div id="chartYear2" style="width: 700px;height:500px;"></div>
	</center>
	
	<center>
		<div class="titleDiv">平原和山间盆地地下水蓄变量统计表<span id="cdate2"></span></div>
		<table id="table2" class="bbTable" >
			<thead>
				<tr>
					<th rowspan="3" data-field="GWB_CD" display="hide" style="display:none"></th>
					<th rowspan="3" data-field="WRZ_CD" display="hide" style="display:none"></th>
					<th rowspan="3" data-field="WRZ_NM" >分区名称</th>
					<th rowspan="3" data-field="WRZ_A">计算面积（㎡）</th>
					<th colspan="5" >与<span id="lastquarter"></span>相比</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="PQ_T_WSV">总蓄变量（10⁴m³）</th>
					<th colspan="2" >其中增加</th>
					<th colspan="2" >其中减少</th>
				</tr>
				<tr>
					<th data-field="PY_AV_A">面积（㎡）</th>
					<th data-field="PY_AV_WSV">蓄变量（10⁴m³）</th>
					<th data-field="PY_RV_A">面积（㎡）</th>
					<th data-field="PY_RV_WSV">蓄变量（10⁴m³）</th>
				</tr>
			</thead>
			<thead id="realth2"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="GWB_CD" display="hide" style="display:none"></th>
					<th data-field="WRZ_CD" display="hide" style="display:none"></th>
					<th data-field="WRZ_NM" >分区名称</th>
					<th data-field="WRZ_A">计算面积（㎡）</th>
					<th data-field="PQ_T_WSV">总蓄变量（10⁴m³）</th>
					<th data-field="PQ_AV_A">面积（㎡）</th>
					<th data-field="PQ_AV_WSV">蓄变量（10⁴m³）</th>
					<th data-field="PQ_RV_A">面积（㎡）</th>
					<th data-field="PQ_RV_WSV">蓄变量（10⁴m³）</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</center>
	
	<center>
		<div id="chartQuarter1" style="width: 700px;height:500px;"></div>
		<div id="chartQuarter2" style="width: 700px;height:500px;"></div>
	</center>
	
</body>
<script type="text/javascript">
var hwwr = {};
hwwr.basePath = "<%=basePath%>";
hwwr.option={};
hwwr.option.yearNo = "<%=yearNo%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/dxs/table/table.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/dxs/table/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>

</html>
