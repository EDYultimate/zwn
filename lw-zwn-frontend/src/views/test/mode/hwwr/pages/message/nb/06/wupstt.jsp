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
<title>海河流域取水计划统计表</title>
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
			<span id="cyear1"></span><span>年海河流域取水计划统计表（按水资源分区统计） </span>
		</div>
		<table id="table1" class="bbTable"   style="width:1080px">
			<thead>
				<tr>
					<th rowspan="4" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="4" data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th rowspan="4" data-field="ORG_G" display="hide" style="display:none">ORG_G</th>
					<th rowspan="4" data-field="WRZ_NM" >水资源<br>分区名称</th>
					<th colspan="15" >河道外用水取水户</th>
					<th colspan="4" >河道内用水取水户</th>
				</tr>
				<tr>
					<th colspan="7">计划取水量</th>
					<th colspan="8">实际取水量</th>
					<th colspan="2">水力发电</th>
					<th colspan="2">其他</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="TAP_PL_WW" >自来水</th>
					<th rowspan="2" data-field="LF_PL_WW" >生活自备水</th>
					<th colspan="2" >工业自备水</th>
					<th rowspan="2" data-field="AGR_PL_WW" >农业</th>
					<th rowspan="2" data-field="OTH_PL_WW" >其他</th>
					<th rowspan="2" data-field="SUM1" >合计</th>
					<th colspan="2" >自来水</th>
					<th rowspan="2" data-field="LF_REAL_WW" >生活<br>自备水</th>
					<th colspan="2">工业自备水</th>
					<th rowspan="2" data-field="AGR_REAL_WW" >农业</th>
					<th rowspan="2" data-field="OTH_REAL_WW" >其他</th>
					<th rowspan="2" data-field="SUM2" >合计</th>
					<th rowspan="2" data-field="HP_PL_WW" >计划取<br>水量</th>
					<th rowspan="2" data-field="HP_REAL_WW" >实际取<br>水量</th>
					<th rowspan="2" data-field="OTHR_PL_WW" >计划取<br>水量</th>
					<th rowspan="2" data-field="OTHR_REAL_WW" >实际取<br>水量</th>
				</tr>
				<tr>
					<th data-field="IND_PL_WW" >小计</th>
					<th data-field="FNPW_PL_WW" >其中直流<br>火核电</th>
					<th data-field="TAP_REAL_WW" >小计</th>
					<th data-field="TAPLF_REAL_WW" >生活</th>
					<th data-field="IND_REAL_WW" >小计</th>
					<th data-field="FNPW_REAL_WW" >其中直流<br>火核电</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th data-field="ORG_G" display="hide" style="display:none">ORG_G</th>
					<th data-field="WRZ_NM" >水资源<br>分区名称</th>
					<th data-field="TAP_PL_WW" >自来水</th>
					<th data-field="LF_PL_WW" >生活自备水</th>
					<th data-field="IND_PL_WW" >小计</th>
					<th data-field="FNPW_PL_WW" >其中直流<br>火核电</th>
					<th data-field="AGR_PL_WW" >农业</th>
					<th data-field="OTH_PL_WW" >其他</th>
					<th data-field="SUM1" >合计</th>
					<th data-field="TAP_REAL_WW" >小计</th>
					<th data-field="TAPLF_REAL_WW" >生活</th>
					<th data-field="LF_REAL_WW" >生活自备水</th>
					<th data-field="IND_REAL_WW" >小计</th>
					<th data-field="FNPW_REAL_WW" >其中直流<br>火核电</th>
					<th data-field="AGR_REAL_WW" >农业</th>
					<th data-field="OTH_REAL_WW" >其他</th>
					<th data-field="SUM2" >合计</th>
					<th data-field="HP_PL_WW" >计划取<br>水量</th>
					<th data-field="HP_REAL_WW" >实际取<br>水量</th>
					<th data-field="OTHR_PL_WW" >计划取<br>水量</th>
					<th data-field="OTHR_REAL_WW" >实际取<br>水量</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
		<div id="titleDiv2" class="titleDiv">
			<span id="cyear2"></span><span>年海河流域取水计划统计表（按行政分区统计） </span>
		</div>
		<table id="table2" class="bbTable" style="width:1080px">
			<thead>
				<tr>
					<th rowspan="4" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="4" data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th rowspan="4" data-field="ORG_G" display="hide" style="display:none">ORG_G</th>
					<th rowspan="4" data-field="WRZ_NM" >水资源<br>分区名称</th>
					<th colspan="15" >河道外用水取水户</th>
					<th colspan="4" >河道内用水取水户</th>
				</tr>
				<tr>
					<th colspan="7">计划取水量</th>
					<th colspan="8">实际取水量</th>
					<th colspan="2">水力发电</th>
					<th colspan="2">其他</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="TAP_PL_WW" >自来水</th>
					<th rowspan="2" data-field="LF_PL_WW" >生活自备水</th>
					<th colspan="2" >工业自备水</th>
					<th rowspan="2" data-field="AGR_PL_WW" >农业</th>
					<th rowspan="2" data-field="OTH_PL_WW" >其他</th>
					<th rowspan="2" data-field="SUM1" >合计</th>
					<th colspan="2" >自来水</th>
					<th rowspan="2" data-field="LF_REAL_WW" >生活<br>自备水</th>
					<th colspan="2">工业自备水</th>
					<th rowspan="2" data-field="AGR_REAL_WW" >农业</th>
					<th rowspan="2" data-field="OTH_REAL_WW" >其他</th>
					<th rowspan="2" data-field="SUM2" >合计</th>
					<th rowspan="2" data-field="HP_PL_WW" >计划取<br>水量</th>
					<th rowspan="2" data-field="HP_REAL_WW" >实际取<br>水量</th>
					<th rowspan="2" data-field="OTHR_PL_WW" >计划取<br>水量</th>
					<th rowspan="2" data-field="OTHR_REAL_WW" >实际取<br>水量</th>
				</tr>
				<tr>
					<th data-field="IND_PL_WW" >小计</th>
					<th data-field="FNPW_PL_WW" >其中直流<br>火核电</th>
					<th data-field="TAP_REAL_WW" >小计</th>
					<th data-field="TAPLF_REAL_WW" >生活</th>
					<th data-field="IND_REAL_WW" >小计</th>
					<th data-field="FNPW_REAL_WW" >其中直流<br>火核电</th>
				</tr>
			</thead>
			<thead id="realth2"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th data-field="ORG_G" display="hide" style="display:none">ORG_G</th>
					<th data-field="WRZ_NM" >水资源<br>分区名称</th>
					<th data-field="TAP_PL_WW" >自来水</th>
					<th data-field="LF_PL_WW" >生活自备水</th>
					<th data-field="IND_PL_WW" >小计</th>
					<th data-field="FNPW_PL_WW" >其中直流<br>火核电</th>
					<th data-field="AGR_PL_WW" >农业</th>
					<th data-field="OTH_PL_WW" >其他</th>
					<th data-field="SUM1" >合计</th>
					<th data-field="TAP_REAL_WW" >小计</th>
					<th data-field="TAPLF_REAL_WW" >生活</th>
					<th data-field="LF_REAL_WW" >生活自备水</th>
					<th data-field="IND_REAL_WW" >小计</th>
					<th data-field="FNPW_REAL_WW" >其中直流<br>火核电</th>
					<th data-field="AGR_REAL_WW" >农业</th>
					<th data-field="OTH_REAL_WW" >其他</th>
					<th data-field="SUM2" >合计</th>
					<th data-field="HP_PL_WW" >计划取<br>水量</th>
					<th data-field="HP_REAL_WW" >实际取<br>水量</th>
					<th data-field="OTHR_PL_WW" >计划取<br>水量</th>
					<th data-field="OTHR_REAL_WW" >实际取<br>水量</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/06/wupstt.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>