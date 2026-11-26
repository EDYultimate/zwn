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
<title>海河流域县域节水型社会达标建设统计表</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script>var basePath = '<%=basePath%>';</script>
<style type="text/css">
.bbTable > tbody > tr > td, th {
	padding: 0px;
	height:25px;
}
.titleDiv {
	height: 30px;
	line-height: 30px;
}

.titleDiv>span {
	line-height: 30px;
}

.bbTable>thead>tr>td, th {
	height: 30px;
}

.echart{
    height:280px;
    float:left;
}


</style>
</head>
<body style="overflow-y: auto;">

	<div class="searchDiv">
		<div class="sc_div">
			时间：
			<input type="text" id="yr" name="year" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
	  	</div>

		<input type="button" value="查询" class="s_input" onclick="search()">
		<input type="button" value="添加" class="a_input" onclick="newAdd()">
		<input type="button" value="打印" class="sb_input"  onclick="printpage()">
		<input type="button" value="导出" class="sb_input" onclick="dlexcel()">
	</div>
	
	<center  style="background-color: #fff;"   id="dydiv">
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>县域达标汇总统计</span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
			<thead>
			<tr>
				<td style="width:5%;" rowspan="2">年份</td>
				<td style="width:10%;" rowspan="2">行政区</td>
				<td style="width:20%;" colspan="2">计划数</td>
				<td style="width:20%;" colspan="2">实际完成数</td>
				<td style="width:20%;" rowspan="2">累计完成比例(%)</td>
				<td style="width:10%;" rowspan="2">操作</td>
			</tr>
			<tr>
				<td style="width:10%;border-top:1px solid #E1E1E1">总数</td>
				<td style="width:10%;border-top:1px solid #E1E1E1">当年</td>
				<td style="width:10%;border-top:1px solid #E1E1E1">当年</td>
				<td style="width:10%;border-top:1px solid #E1E1E1">截止目前累计</td>
			</tr>

			</thead>
			<tbody id="tbody">

			</tbody>
		</table>
		
		<%--<div id="xyChart" style="width: 1000px;height:280px;"></div>--%>
        <div id="ysChart"  class="echart"  style="width: 59%;" ></div>
        <div id="ysChart2" class="echart" style="width: 39%;"></div>

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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/xydb/hztj/hztj.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/xydb/hztj/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>