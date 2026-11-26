<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水资源公报</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/css/ztree/demo.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/css/ztree/zTreeStyle/zTreeStyle.css" type="text/css">
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <body>
  <div style="width:100%;height:100%;">
  	<div id="treeDiv" style="width:20%;float:left;height:100%;border-right:1px solid #999;">
  		<ul id="treeDemo" class="ztree"></ul>
  	</div>
  	<div style="width:75%;float:right;height:100%;">
  		<iframe id="frame" src=""></iframe>
  	</div>
  </div>  
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/message/gb/gb.js"></script>
</html>
