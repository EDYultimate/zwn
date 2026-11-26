<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String yearNo=request.getParameter("yearNo");
if (yearNo==null) {
	yearNo = "";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title></title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet" href ="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" type="text/css">
<style type="text/css">
body ul {
	list-style: none;
	margin-top: 10px;
}
#content {
	width: 98%; 
	margin-left: 5%;
}
#leftcontent {
	width: 25%; 
	height: 97%;
}
#rightcontent {
	width: 67%;
	position: absolute;
	overflow: hidden;
	right: 5%;
	height: 95%;
	top: 8px;
}
#ltop {
	height:20%;
	width: 100%;
}
#rtop {
	height:20%;
	width: 100%;
}
#rbottom {
	height:80%;
	position: absolute;
	overflow-y:hidden;
	width: 100%;
}
#title1 {
	font-size: 27px;
	color:#3399FF;
}
#listpage {
	font-size:18px;
	font-weight: bold;
	color:#006633;
}
#listpage li:hover {
	cursor: pointer;
}
</style>
</head>
<body style="overflow: hidden;">
	<div id="content" >
		<div id="leftcontent"  style="text-align:center;">
			<div id="ltop" >
			</div>
			<ul id="listpage">

			</ul>
		</div>
		<div id="rightcontent"  style="text-align:center;">
			<div id="rtop" >
				<span id="title1">海&nbsp;&nbsp;河&nbsp;&nbsp;流&nbsp;&nbsp;域&nbsp;&nbsp;地&nbsp;&nbsp;下&nbsp;&nbsp;水&nbsp;&nbsp;通&nbsp;&nbsp;报</span>
				<br>
				<span style="font-size:26px;color:#3399FF;"><span id="syear"></span> 年第 <span id="section"></span> 期</span>
				<br>
				<br>
				<span id="stitle" style="    font-size: 18px;color: #006633;font-weight: bold;">标题</span>
			</div>
			<div id="rbottom" >
			</div>
		</div>
	</div>
</body>
<script type="text/javascript">
var hwwr = {};
hwwr.basePath = "<%=basePath%>";
hwwr.option={};
hwwr.option.yearNo = "<%=yearNo%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/dxs/pdf/pdf.js"></script>
</html>
