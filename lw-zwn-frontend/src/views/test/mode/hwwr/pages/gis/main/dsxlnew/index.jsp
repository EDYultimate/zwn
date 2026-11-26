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
<title>南水北调块</title>
<link rel="stylesheet" type="text/css"
	href="<%=serverUrl%>esri/css/esri.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>pages/gis/common/js/legendbar/style.css">
<link rel="stylesheet" type="text/css" href="./css/main.css" >
<script>
	var basePath='<%=basePath%>';
</script>
</head>
<body>
<div id="map"></div>
<div id="navigator"></div>
<div id="layerSwitch"></div>
<div id="nameLabel"></div>
<div id="legend"></div>
<!-- 全局搜索div开始 -->
     <div id="searchbtn" style="float: left;position: absolute;top: 10px;left:10px;height:30px;">
	     <!--  <input id="searchText" style="float: left;width: 200px;height: 24px;" placeholder="请输入测站名" onkeydown="keyDown()"/>
	     <div class="searchbar" title="搜索" onclick="search()">
	     	 <img style="width:16px;height:16px;margin-top:3px;" title="搜索"  src="img/ico_search.png"/>
	     </div>
        
	 <ul id="ulItems" style="position: absolute;top:24px; display: none; border:1px solid #cecece; border-top:none; width:150px; padding:2px; margin:0px;cursor:pointer"></ul> -->  
	  <select id="selectSM" name="inv_payee"  onchange="initDsxl(this.options.selectedIndex-1);" style="float: left;width: 160px;height:24px;border:1px solid #ccc;">
　　　　       <option></option>
       <option value="引滦工程">引滦工程</option>
　　　　      <option value="永定河干流">永定河干流</option>
　　　　       <option value="岳城应急调水">岳城应急调水</option>
       <option value="岳城水库日常">岳城水库日常</option>
　　　　       <option value="祝官屯枢纽日常">祝官屯枢纽日常</option>
       <option value="漳河上游">漳河上游</option>
　　　　       <option value="南水北调中线">南水北调中线</option>
        <option value="南水北调东线">南水北调东线</option>
       <option value="引黄入冀补淀（渠村）">引黄入冀补淀（渠村）</option>
　　　　       <option value="引黄入冀补淀（位山）">引黄入冀补淀（位山）</option>
　　          </select>
         <div class="searchbar" title="全部线路" onclick="ShowFull()">
	     	 <img style="width:16px;height:16px;margin-top:3px;" title="全图"  src="img/map.png"/>
	     </div>
	</div>
    <!-- 全局搜索div结束 -->

<script type="text/javascript"
		src="<%=basePath%>pages/gis/common/js/jquery-1.11.1.min.js"></script>
		
<!-- 引入echart add by fjl-->
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts.js"></script>

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
  <script type="text/javascript" src="./js/data.js"></script>
  <script type="text/javascript" src="./js/draw.js"></script>
  <script type="text/javascript" src="./js/layereach.js"></script>
<!-- 图例控件 -->
<script type="text/javascript"	src='<%=basePath%>pages/gis/common/js/legendbar5/LegendBar.js'></script>
<!-- 导航控件 -->
<script type="text/javascript" src="<%=basePath%>pages/gis/common/js/gisonline.js"></script>
<script type="text/javascript"	src='<%=basePath%>pages/gis/common/js/navigator/navigator.js'></script>
<!-- 导航控件 -->
<script type="text/javascript"	src='<%=basePath%>pages/gis/common/js/LayerSwitcher/LayerSwitcher.js'></script>


</body>
</html>