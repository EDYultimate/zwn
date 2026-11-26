<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'sjdm.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  
  <body style="overflow:hidden;">
   <!--  <div class="right_menu">
  		<ul>
  			<li id="sjdm_sz" class="liTab clickLiTab"><span>水质测站</span></li>
  			<li id="sjdm_swll" class="liTab"><span>93个水位流量站</span></li>
  			<li id="sjdm_sw" class="liTab"><span>46个雷达水位站</span></li>
  			<li id="sjdm_szzdz" class="liTab"><span>水质自动站</span></li>
  		</ul>
  	</div> -->
    <div class="frameDiv">
		<iframe id="iframe" src="<%=basePath%>pages/ssjkyj/cxfx/za/za.jsp"></iframe>
		
	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>pages/lyzg/sjdm/sjdm.js"></script>
</html>
