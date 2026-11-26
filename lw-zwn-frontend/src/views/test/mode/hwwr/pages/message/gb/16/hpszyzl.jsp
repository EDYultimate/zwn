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
<title>海河流域河流水资源质量概况</title>
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
			<span id="cyear"></span><span>年海河流域河流水资源质量概况评价表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:1520px">
			<thead>
				<tr>
					<th rowspan="2" data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th rowspan="2" data-field="AD" display="hide" style="display:none">AD</th>
					<th rowspan="2" data-field="WR" display="hide" style="display:none">WR</th>
					<th rowspan="2" data-field="WRCS" display="hide" style="display:none">WRCS</th>
					<th rowspan="2" data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th colspan="3">水资源分区</th>
					<th rowspan="2" data-field="LK_NM" >湖泊名称</th>
					<th rowspan="2" data-field="LK_A" >湖泊面积(km²)</th>
					<th colspan="8">全年水质分类面积(km²)</th>
					<th colspan="8">汛期水质分类面积(km²)</th>
					<th colspan="8">非汛期水质分类面积(km²)</th>
					<th colspan="2">4~9月营养化评价</th>
				</tr>
				<tr>
					<th data-field="AD_NM" >行政区</th>
					<th data-field="WR_NM" >一级区</th>
					<th data-field="WRCS_NM" >二级区</th>
					<th data-field="YR_LK_A" >评价面积</th>
					<th data-field="YR_1_A" >Ⅰ类</th>
					<th data-field="YR_2_A" >Ⅱ类</th>
					<th data-field="YR_3_A" >Ⅲ类</th>
					<th data-field="YR_4_A" >Ⅳ类</th>
					<th data-field="YR_5_A" >Ⅴ类</th>
					<th data-field="YR_9_A" >劣Ⅴ类</th>
					<th data-field="YR_MN_WI" >主要超标项目</th>
					<th data-field="FS_LK_A" >评价面积</th>
					<th data-field="FS_1_A" >Ⅰ类</th>
					<th data-field="FS_2_A" >Ⅱ类</th>
					<th data-field="FS_3_A" >Ⅲ类</th>
					<th data-field="FS_4_A" >Ⅳ类</th>
					<th data-field="FS_5_A" >Ⅴ类</th>
					<th data-field="FS_9_A" >劣Ⅴ类</th>
					<th data-field="FS_MN_WI" >主要超标项目</th>
					<th data-field="NFS_LK_A" >评价面积</th>
					<th data-field="NFS_1_A" >Ⅰ类</th>
					<th data-field="NFS_2_A" >Ⅱ类</th>
					<th data-field="NFS_3_A" >Ⅲ类</th>
					<th data-field="NFS_4_A" >Ⅳ类</th>
					<th data-field="NFS_5_A" >Ⅴ类</th>
					<th data-field="NFS_9_A" >劣Ⅴ类</th>
					<th data-field="NFS_MN_WI" >主要超标项目</th>
					<th data-field="LK_WQ_GR" >评分值</th>
					<th data-field="LK_WQ_CN" >营养化程度</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="WRB_CD" display="hide" style="display:none">WRB_CD</th>
					<th data-field="AD" display="hide" style="display:none">AD</th>
					<th data-field="WR" display="hide" style="display:none">WR</th>
					<th data-field="WRCS" display="hide" style="display:none">WRCS</th>
					<th data-field="WRCS_CD" display="hide" style="display:none">WRCS_CD</th>
					<th data-field="AD_NM" >行政区</th>
					<th data-field="WR_NM" >一级区</th>
					<th data-field="WRCS_NM" >二级区</th>
					<th data-field="LK_NM" >湖泊名称</th>
					<th data-field="LK_A" >湖泊面积(km²)</th>
					<th data-field="YR_LK_A" >评价面积</th>
					<th data-field="YR_1_A" >Ⅰ类</th>
					<th data-field="YR_2_A" >Ⅱ类</th>
					<th data-field="YR_3_A" >Ⅲ类</th>
					<th data-field="YR_4_A" >Ⅳ类</th>
					<th data-field="YR_5_A" >Ⅴ类</th>
					<th data-field="YR_9_A" >劣Ⅴ类</th>
					<th data-field="YR_MN_WI" >主要超标项目</th>
					<th data-field="FS_LK_A" >评价面积</th>
					<th data-field="FS_1_A" >Ⅰ类</th>
					<th data-field="FS_2_A" >Ⅱ类</th>
					<th data-field="FS_3_A" >Ⅲ类</th>
					<th data-field="FS_4_A" >Ⅳ类</th>
					<th data-field="FS_5_A" >Ⅴ类</th>
					<th data-field="FS_9_A" >劣Ⅴ类</th>
					<th data-field="FS_MN_WI" >主要超标项目</th>
					<th data-field="NFS_LK_A" >评价面积</th>
					<th data-field="NFS_1_A" >Ⅰ类</th>
					<th data-field="NFS_2_A" >Ⅱ类</th>
					<th data-field="NFS_3_A" >Ⅲ类</th>
					<th data-field="NFS_4_A" >Ⅳ类</th>
					<th data-field="NFS_5_A" >Ⅴ类</th>
					<th data-field="NFS_9_A" >劣Ⅴ类</th>
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
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/16/hpszyzl.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/16/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
