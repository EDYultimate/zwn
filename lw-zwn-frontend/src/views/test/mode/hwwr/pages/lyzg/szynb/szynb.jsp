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
<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
<script>var basePath = '<%=basePath%>';</script>
</head>
  <body >
  
  
  	<center class="conent" style="width: 100%;height: 100%;">
		<div id="titleDiv" class="titleDiv"  style="width:80%">
		<span>水资源年报</span>
		</div>
		<table id="table" class="bbTable"   style="table-layout: fixed;width:80%">
			<thead>
				<tr  id="realth"  >
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="TAB_NM"  style="width: 275px;" >方案名称</th>
					<th data-field="AD_NM" >发布单位</th>
					<th data-field="FILL_YR"  >年份</th>
					<!-- <th data-field="Link" >链接</th> -->
					<th data-field="MANG" >操作</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</center>	

  </body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/lyzg/szynb/szynb.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>
