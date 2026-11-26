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
<title>海河流域重要城市建成区供用水量 </title>
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
			<span id="cyear"></span><span>年海河流域重要城市建成区供用水量统计表</span>
			<span id="unit" style="font-size: 14px;float: right;margin-top: 10px;">水量单位：10⁸m³	</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:950px">
			<thead>
				<tr>
					<th rowspan="3" data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th rowspan="3" data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th rowspan="3" data-field="AD_NM" >城市</th>
					<th rowspan="3" data-field="CITY_A"  style="width: 68px;">面积(km²)</th>
					<th rowspan="3" data-field="CITY_PP" >人口(万)</th>
					<th rowspan="3" data-field="CITY_IND_AV" >工业增加值(亿元)</th>
					<th colspan="5">供水量</th>
					<th rowspan="3" data-field="SEA_DIR_WU" >海水利用量</th>
					<th colspan="8">用水量</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="SW_WS" >地表水</th>
					<th rowspan="2" data-field="GW_WS" > 地下水</th>
					<th rowspan="2" data-field="SEW_REU" >污水处理回用</th>
					<th rowspan="2" data-field="OT_WS" >其他</th>
					<th rowspan="2" data-field="CAL_WS" >合计</th>
					<th rowspan="2" data-field="DT_WW" >居民生活</th>
					<th colspan="3" >城市公共</th>
					<th rowspan="2" data-field="IND_WW" >工业</th>
					<th rowspan="2" data-field="AGR_WW" > 农业</th>
					<th rowspan="2" data-field="ET_WW" >城市环境</th>
					<th rowspan="2" data-field="SUMR" >合计</th>
				</tr>
				<tr>
					<th data-field="BLD_WW" >建筑业</th>
					<th data-field="SRV_WW" >服务业</th>
					<th data-field="CAL_WW" >小计</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th data-field="AD_CD" display="hide" style="display:none">AD_CD</th>
					<th data-field="AD_NM" >城市</th>
					<th data-field="CITY_A" >面积</th>
					<th data-field="CITY_PP" >人口</th>
					<th data-field="CITY_IND_AV" >工业增加值</th>
					<th data-field="SW_WS" > 地表水</th>
					<th data-field="GW_WS" > 地下水</th>
					<th data-field="SEW_REU" > 当污水处理回用</th>
					<th data-field="OT_WS" >其他</th>
					<th data-field="CAL_WS" > 合计</th>
					<th data-field="SEA_DIR_WU" > 海水利用量</th>
					<th data-field="DT_WW" >居民生活</th>
					<th data-field="BLD_WW" > 建筑业</th>
					<th data-field="SRV_WW" >服务业</th>
					<th data-field="CAL_WW" >小计</th>
					<th data-field="IND_WW" > 工业</th>
					<th data-field="AGR_WW" >农业</th>
					<th data-field="ET_WW" >城市环境</th>
					<th data-field="SUMR" >合计</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/gb/12/jcqgysl.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/12/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
