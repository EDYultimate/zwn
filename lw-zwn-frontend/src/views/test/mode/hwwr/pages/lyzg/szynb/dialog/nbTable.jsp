<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>水资源年报</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">

<script>var basePath = '<%=basePath%>';</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/lyzg/szynb/dialog/nbTable.js"></script>
</head>
  <body >

	<center class="conent" style="width: 100%;height: 100%;">
		<table id="table" class="bbTable"   style="table-layout: fixed;">
			<thead>
				<tr  id="realth"  >
					<th data-field="No" style="width:20%">序号</th>
					<th data-field="Type" >名称</th>
				</tr>
			</thead>
			<tbody>
				
			</tbody>
		</table>
	</center>	


  </body>
</html>