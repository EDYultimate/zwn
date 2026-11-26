<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String serverUrl=session.getServletContext().getInitParameter("serverUrl");
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>GIS</title>
<link rel="stylesheet" type="text/css"
	href="<%=serverUrl%>esri/css/esri.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>pages/gis/common/js/legendbar/style.css">
<link rel="stylesheet" type="text/css" href="./css/main.css" >
</head>
<body>
<div id="map"></div>

<script type="text/javascript"
		src="<%=basePath%>pages/gis/common/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/gis/common/js/raphael.js"></script>
<!-- layui库 -->
<script type="text/javascript" src="<%=basePath%>pages/gis/common/js/layer/layer.js"></script>
<!-- 项目通用配置文件 -->
<script type="text/javascript" src="<%=basePath%>pages/gis/common/js/config.js"></script>
<!-- 模块配置文件 -->
<script type="text/javascript" src="./js/dojoconfig.js"></script>
<script type="text/javascript" src="./js/config.js"></script>

<!-- arcgis api -->
<script type="text/javascript"
		src="<%=serverUrl%>init.js"></script>
<!-- arcgis 模块导入初始化 -->
<script type="text/javascript" src="./js/init.js"></script>
<!-- 模块主文件 -->
 <script type="text/javascript" src="./js/main.js"></script>
<!-- 导航控件 -->
<script type="text/javascript"	src='<%=basePath%>pages/gis/common/js/navigator/navigator.js'></script>
</body>
</html>