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
<title>基础信息</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
</head>
<body>

<!-- 	
	<div class="searchDiv">
	</div>
 -->
 
	<center   class="conent" style="width: 100%;height: calc(100% - 100px);overflow-x: hidden;">
		<div class="titleDiv">基础信息</div>
		<table id="table" class="bbTable">
			<thead>
				<tr>
					<th data-field="RV_NM" >河名</th>
					<th data-field="STNM" >主要控制断面名称</th>
					<th data-field="RV">所在河流</th>
					<th data-field="CC">建设状况</th>
					<th data-field="MAN_ORG_NM">管理单位名称</th>
					<th data-field="TP">是否省界断面</th>
					<th data-field="NEC">建站必要性</th>
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
<script type="text/javascript" src="<%=basePath %>pages/message/jcxx/jcxx/jcxx.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/customdate.js"></script>
</html>
