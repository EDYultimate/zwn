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
<title>水文站月、年径流量</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
</head>
<body style="overflow: auto;">
	<center>
	
		<input id="chooseyear"  type="text"   onClick="WdatePicker({dateFmt:'yyyy',realDateFmt:'yyyy'})"/>
		<button style="margin-left:10px" onclick="querybyyear()">查询</button>
		
		<div class="titleDiv"><span id="cyear"></span>年海河流域代表站月、年径流量统计表<span id="unit" style="font-size: 14px;float: right;margin-top: 10px;">单位：mm</span></div>
		<table id="table" class="bbTable">
			<thead>
				<tr>
					<th rowspan="2" data-field="RV_CD" display="hide" style="display:none">RV_CD</th>
					<th rowspan="2" data-field="RV_NM">河名</th>
					<th rowspan="2" data-field="STCD" display="hide" style="display:none">STCD</th>
					<th rowspan="2" data-field="ST_NM">站名</th>
					<th rowspan="2" data-field="CAT_A">集水面积<br>(km²)</th>
					<th rowspan="2" data-field="PROJ">项目</th>
					<th colspan="12">各&nbsp;&nbsp;月&nbsp;&nbsp;径&nbsp;&nbsp;流&nbsp;&nbsp;量</th>
					<th rowspan="2"  data-field="YR_MR">实测年径流量</th>
					<th rowspan="2"  data-field="YR_NR">天然年径流量 </th>
				</tr>
				<tr>
					<th data-field="JAN_MR">1</th>
					<th data-field="FEB_MR">2</th>
					<th data-field="MAR_MR">3</th>
					<th data-field="APR_MR">4</th>
					<th data-field="MAY_MR">5</th>
					<th data-field="JUN_MR">6</th>
					<th data-field="JUL_MR">7</th>
					<th data-field="AUG_MR">8</th>
					<th data-field="SEP_MR">9</th>
					<th data-field="OCT_MR">10</th>
					<th data-field="NOV_MR">11</th>
					<th data-field="DEC_MR">12</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th rowspan="2" data-field="RV_CD" display="hide" style="display:none">RV_CD</th>
					<th rowspan="2" data-field="RV_NM">河名</th>
					<th rowspan="2" data-field="STCD" display="hide" style="display:none">STCD</th>
					<th rowspan="2" data-field="ST_NM">站名</th>
					<th rowspan="2" data-field="CAT_A">集水面积<br>(km²)</th>
					<th rowspan="2" data-field="PROJ">项目</th>
					<th data-field="JAN_MR">1</th>
					<th data-field="FEB_MR">2</th>
					<th data-field="MAR_MR">3</th>
					<th data-field="APR_MR">4</th>
					<th data-field="MAY_MR">5</th>
					<th data-field="JUN_MR">6</th>
					<th data-field="JUL_MR">7</th>
					<th data-field="AUG_MR">8</th>
					<th data-field="SEP_MR">9</th>
					<th data-field="OCT_MR">10</th>
					<th data-field="NOV_MR">11</th>
					<th data-field="DEC_MR">12</th>
					<th rowspan="2"  data-field="YR_MR">实测年径流量</th>
					<th rowspan="2"  data-field="YR_NR">天然年径流量 </th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
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
<script type="text/javascript" src="<%=basePath %>pages/message/gb/04/dbzjll.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>
