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
<title>海河流域各省建设项目水资源论证统计表</title>
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
		&nbsp;&nbsp;&nbsp;&nbsp;范围：
		<select id="fw">
  			<option value="">全部</option>
  			<option value="0">水资源分区</option>
  			<option value="1">行政区</option>
  		</select>
		
		时间：<input type="text"  id="chooseyear"  name="year" onClick="WdatePicker({ dateFmt: 'yyyy'})">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
		
	<center>
		<div class="titleDiv">
			<span id="cyear"></span><span>年海河流域各省建设项目水资源论证统计表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:100%">
			<thead>
				<tr>
					<th rowspan="2" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="2" data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th rowspan="2" data-field="NM" >取水点流域/行政区</th>
					<th rowspan="2" data-field="PROJ_NUM"  style="">项目数量</th>
					<th colspan="9" >取水规模</th>
					<th rowspan="2" data-field="RW_W"  style="">退(排)<br>水量</th>
					<th rowspan="2" data-field="RW_DES"  style="">退(排)<br>水去向</th>
					<th rowspan="2" data-field="REP"  style="">审查单位</th>
					<th rowspan="2" data-field="REP_PASS"  style="">是否审查通过</th>
				</tr>
				<tr>
					<th data-field="SW_W" >地表水</th>
					<th data-field="LGW_W" >浅层地下水</th>
					<th data-field="DGW_W" >深层地下水</th>
					<th data-field="MS_W" >矿泉水</th>
					<th data-field="GEO_W" >地热水</th>
					<th data-field="TAP_W" >自来水</th>
					<th data-field="OTHR_W" >非常规水源</th>
					<th data-field="OTHR_W_T" >非常规水源类型</th>
					<th data-field="WSUM" >合计</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th data-field="NM" >取水点流域/行政区</th>
					<th data-field="PROJ_NUM"  style="">项目数量</th>
					<th data-field="SW_W" >地表水</th>
					<th data-field="LGW_W" >浅层地下水</th>
					<th data-field="DGW_W" >深层地下水</th>
					<th data-field="MS_W" >矿泉水</th>
					<th data-field="GEO_W" >地热水</th>
					<th data-field="TAP_W" >自来水</th>
					<th data-field="OTHR_W" >非常规水源</th>
					<th data-field="OTHR_W_T" >非常规水源类型</th>
					<th data-field="WSUM" >合计</th>
					<th data-field="RW_W"  style="">退(排)<br>水量</th>
					<th data-field="RW_DES"  style="">退(排)<br>水去向</th>
					<th data-field="REP"  style="">审查单位</th>
					<th data-field="REP_PASS"  style="">是否审查通过</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/nb/01/jsxmlz.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>