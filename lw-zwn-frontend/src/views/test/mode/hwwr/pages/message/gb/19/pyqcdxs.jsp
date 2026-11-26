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
<title>海河流域部分平原区浅层地下水水质状况评价表</title>
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
			<span id="cyear"></span><span>年海河流域部分平原区浅层地下水水质状况评价表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:940px">
			<thead>
				<tr>
					<th rowspan="3" data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th rowspan="3" data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th rowspan="3" data-field="R3" display="hide" style="display:none">R3</th>
					<th rowspan="3" data-field="R1" display="hide" style="display:none">R1</th>
					<th rowspan="3" data-field="NM2" >平原名称</th>
					<th rowspan="3" data-field="NM1" >所属水资源<br>二级区</th>
					<th rowspan="3" data-field="WELL_NUM" >观测<br>井总数<br>(个)</th>
					<th rowspan="3" data-field="REP_A" >代表面积<br>(平方公里)</th>
					<th colspan="10">全 年 水 质 类 别</th>
					<th rowspan="3" data-field="MAIN_OPI" >主要超标项目</th>
				</tr>
				<tr>
					<th colspan="2">Ⅰ类</th>
					<th colspan="2">Ⅱ类</th>
					<th colspan="2">Ⅲ类</th>
					<th colspan="2">Ⅳ类</th>
					<th colspan="2">Ⅴ类</th>
				</tr>
				<tr>
					<th data-field="WELL_1_NUM" >观测<br>井数</th>
					<th data-field="DPT_1_A" >代表<br>面积</th>
					<th data-field="WELL_2_NUM" >观测<br>井数</th>
					<th data-field="DPT_2_A" >代表<br>面积</th>
					<th data-field="WELL_3_NUM" >观测<br>井数</th>
					<th data-field="DPT_3_A" >代表<br>面积</th>
					<th data-field="WELL_4_NUM" >观测<br>井数</th>
					<th data-field="DPT_4_A" >代表<br>面积</th>
					<th data-field="WELL_5_NUM" >观测<br>井数</th>
					<th data-field="DPT_5_A" >代表<br>面积</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th data-field="R3" display="hide" style="display:none">R3</th>
					<th data-field="R1" display="hide" style="display:none">R1</th>
					<th data-field="NM2" >平原名称</th>
					<th data-field="NM1" >所属水资源<br>二级区</th>
					<th data-field="WELL_NUM" >观测<br>井总数<br>(个)</th>
					<th data-field="REP_A" >代表面积<br>(平方公里)</th>
					<th data-field="WELL_1_NUM" >观测<br>井数</th>
					<th data-field="DPT_1_A" >代表<br>面积</th>
					<th data-field="WELL_2_NUM" >观测<br>井数</th>
					<th data-field="DPT_2_A" >代表<br>面积</th>
					<th data-field="WELL_3_NUM" >观测<br>井数</th>
					<th data-field="DPT_3_A" >代表<br>面积</th>
					<th data-field="WELL_4_NUM" >观测<br>井数</th>
					<th data-field="DPT_4_A" >代表<br>面积</th>
					<th data-field="WELL_5_NUM" >观测<br>井数</th>
					<th data-field="DPT_5_A" >代表<br>面积</th>
					<th data-field="MAIN_OPI" >主要超标项目</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/gb/19/pyqcdxs.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/19/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
