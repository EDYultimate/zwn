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
<script>
	var basePath = '<%=basePath%>';

</script>
<title>保有许可证</title>
</head>
<body>
	<div class="searchDiv">
  		&nbsp;&nbsp;
		<div class="sc_div">
  			发证年份：
  			<input type="text" id="fz_year" name="fz_year"  class="sc_input"  onClick="WdatePicker({dateFmt: 'yyyy'})">
  		</div>
  		&nbsp;&nbsp;
   		<!-- 查询 -->
    	<input type="button" value="查询" class="s_input" onclick="search()">
	</div>
	<center class="conent">
		<div class="titleDiv">
			<span id="t_year"></span><span>取水许可证信息表</span>
		</div>
		<table class="bbTable" id="oneTable">
			<thead>
				<tr>
					<td rowspan="2" style="width:15%;">行政区</td>
					<td colspan="2">新发</td>
					<td colspan="2">换证</td>
					<td colspan="2">注销</td>
					<td colspan="2">吊销</td>
				</tr>
				<tr>
					<td style="border-top:1px solid #cdd6e2">许可证数</td>
					<td style="border-top:1px solid #cdd6e2">许可水量(万m³)</td>
					<td style="border-top:1px solid #cdd6e2">许可证数</td>
					<td style="border-top:1px solid #cdd6e2">许可水量(万m³)</td>
					<td style="border-top:1px solid #cdd6e2">许可证数</td>
					<td style="border-top:1px solid #cdd6e2">许可水量(万m³)</td>
					<td style="border-top:1px solid #cdd6e2">许可证数</td>
					<td style="border-top:1px solid #cdd6e2">许可水量(万m³)</td>
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
<script 
	src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript"
	src="<%=basePath%>pages/rcgl/ssfzgl/byxkz/byxkz.js"></script>
</html>