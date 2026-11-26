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
<title>水库蓄量表</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</head>
<body>
	
	<div class="searchDiv">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<div class="sc_div">
			时间：
			<input type="text"  id="chooseyear"  name="year"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
		</div>
		
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<center   class="conent" style="width: 100%;height: calc(100% - 55px);">
		<div class="titleDiv" style="height:70px">
			<span id="cyear"></span><span>年海河流域大中型水库蓄水情况统计表</span>
			<span id="unit" style="font-size: 14px;float: right;margin-top: 10px;">水位单位：m       水量单位：10⁸m³</span>
		</div>
		<table id="table" class="bbTable">
			<thead>
				<tr>
					<th data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th data-field="STYPE" >水库类型</th>
					<th data-field="WRCS_NM">流域Ⅱ级区名称</th>
					<th data-field="RES_NUM">水库个数</th>
					<th data-field="RES_YSW">上年末蓄水量</th>
					<th data-field="RES_YEW">当年末蓄水量</th>
					<th data-field="RES_CAL">年蓄水变量</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>

		<!-- <div id="snmChart" style="width:60%;height:550px"></div> -->
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
<script type="text/javascript" src="<%=basePath %>pages/kfly/skxsl/tjxx/skxsl.js"></script>
<%-- <script type="text/javascript" src="<%=basePath %>pages/kfly/skxsl/tjxx/charts.js"></script> --%>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>
