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
<title>海河流域水库水资源质量状况</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<style type="text/css">
.bbTable > tbody > tr > td, th {
	padding: 0px
}

.conent{
	margin-top:0px;
}

.searchDiv{
	padding:4px;
}
</style>
</head>
<body>
	
	<div class="searchDiv">
		&nbsp;&nbsp;
		<div class="sc_div">
			时间：
			<input id="chooseyear"   type="text" id="year" name="year" class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
		</div>
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<%--<center   class="conent" style="width: 100%;height: calc(100% - 55px);">--%>
	<center   class="conent" style="width: 100%;">
		<div class="titleDiv">
			<span id="cyear"></span><span>年海河流域水库水资源质量状况评价表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:100%">
			<thead>
				<tr>
					<th rowspan="2" data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th rowspan="2" data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th rowspan="2" data-field="RES_CD" display="hide" style="display:none">RES_CD</th>
					<th rowspan="2" data-field="WRZ_NM" >二级水资源分区</th>
					<th rowspan="2" data-field="RES_NM" >水库名称</th>
					<th rowspan="2" data-field="RES_AVGW" >年平均蓄水量(亿m³)</th>
					
					<th colspan="2">全年</th>
					<th colspan="2">汛期</th>
					<th colspan="2">非汛期</th>
					<th colspan="2">4～9月营养化评价</th>
				</tr>
				<tr>
					<th data-field="YR_WQ_TP" >水质<br>类别</th>
					<th data-field="YR_MN_WI" >主要超标项目</th>
					<th data-field="FS_WQ_TP" >水质<br>类别</th>
					<th data-field="FS_MN_WI" >主要超标项目</th>
					<th data-field="NFS_WQ_TP" >水质<br>类别</th>
					<th data-field="NFS_MN_WI" >主要超标项目</th>
					<th data-field="LK_WQ_GR" >评分值</th>
					<th data-field="LK_WQ_CN" >营养化程度</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th data-field="RES_CD" display="hide" style="display:none">RES_CD</th>
					<th data-field="WRZ_NM" >二级水资源分区</th>
					<th data-field="RES_NM" >水库名称</th>
					<th data-field="RES_AVGW" >年平均蓄水量(亿m³)</th>
					<th data-field="YR_WQ_TP" >水质<br>类别</th>
					<th data-field="YR_MN_WI" >主要超标项目</th>
					<th data-field="FS_WQ_TP" >水质<br>类别</th>
					<th data-field="FS_MN_WI" >主要超标项目</th>
					<th data-field="NFS_WQ_TP" >水质<br>类别</th>
					<th data-field="NFS_MN_WI" >主要超标项目</th>
					<th data-field="LK_WQ_GR" >评分值</th>
					<th data-field="LK_WQ_CN" >营养化程度</th>
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
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/sjdm/sksz/skszyzl.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/sjdm/sksz/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
