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
<title>技改工程统计表</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
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
		width: 33%;
		height:220px;
		float:left
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
		<input type="button" value="打印" class="a_input"  onclick="printpage()">
		<input type="button" value="导出" class="a_input" onclick="dlexcel()">
<%--		<input type="button" value="导出" class="a_input" onclick="dlexcel()">--%>
	</div>
	
	<center  style="background-color: #fff;"  id="dydiv">
		<div id="titleDiv1" class="titleDiv">
			<span id="cyear1"></span><span>技改工程统计</span>
		</div>
		<table id="table1" class="bbTable"   style="width:100%">
			<thead>
			<tr>
				<td style="width:5%;" rowspan="2">年份</td>
				<td style="width:8%;" rowspan="2">行政区</td>
				<td style="width:35%;" colspan="5">农业</td>
				<td style="width:20%;" colspan="3">工业</td>
				<td style="width:20%;" colspan="3">城镇生活和服务业</td>
				<td style="width:6%;" rowspan="3">操作</td>
			</tr>

			<tr>
				<td style="border-top:1px solid #E1E1E1" >工程数量</td>
				<td style="border-top:1px solid #E1E1E1" >节水资金投入（万元）</td>
				<td style="border-top:1px solid #E1E1E1">有效灌溉面积（万亩）</td>
				<td style="border-top:1px solid #E1E1E1" >新增灌溉面积（万亩</td>
				<td style="border-top:1px solid #E1E1E1" >新增节水灌溉面积（万亩</td>
				<td style="border-top:1px solid #E1E1E1" >工程数量</td>
				<td style="border-top:1px solid #E1E1E1">节水资金投入（万元）</td>
				<td style="border-top:1px solid #E1E1E1" >工业用水重复利用率（%）</td>
				<td style="border-top:1px solid #E1E1E1" >工程数量</td>
				<td style="border-top:1px solid #E1E1E1">节水资金投入（万元）</td>
				<td style="border-top:1px solid #E1E1E1" >城镇节水器具普及率（%）</td>
			</tr>



			</thead>
			<tbody id="tbody">

			</tbody>
		</table>
		
		<%--<div id="jsChart" style="width: 1000px;height:280px;"></div>--%>
		<div id="ysChart" class="echart"></div>
		<div id="ysChart2" class="echart"></div>
		<div id="ysChart3" class="echart"></div>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/jsztjs/jggctj/jggctj.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/jsztjs/jggctj/charts.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>