<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
<script>var basePath = '<%=basePath%>';</script>
<title>取水点</title>
<style type="text/css">
	tr {
	    cursor: auto;
	}
	tbody>tr>td {
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	    /* text-align:left !important; */
	}
</style>
</head>
<body>
	<div class="searchDiv">
		<jsp:include page="search.jsp" flush="true" />
	</div>
	<center class="conent">
		<div class="titleDiv">
			<span id="t_year"></span><span>取水点监测信息表</span>
		</div>
		<table class="bbTable" id="oneTable" style="table-layout: fixed;">
			<thead>
				<tr>
					<td style="width:5%;">序号</td>
					<td style="width:20%;">取水点名称</td>
					<td style="width:10%;">水源类型</td>
				    <!-- <td >取水地点</td> -->
					<td style="width:8%;">用水类型</td>
					<td style="width:10%;">日最大取水量<br>(万m³)</td>
					<td style="width:15%;">累计取水量<br>(万m³)</td>
				</tr>
			</thead>
			<tbody id="tbody">
				
			</tbody>
		</table>

	</center>
</body>
<script type="text/javascript"
	src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript"
	src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript"
	src="<%=basePath%>pages/rcgl/wfzgl/qsd/qsd.js"></script>
</html>