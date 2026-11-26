<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质自动站/人工站</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<link rel="stylesheet" href ="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
	<style>
	body{padding:0;margin:0}
	.ckrow {
		background-color: darkgray;
	    color: white;
	}
	</style>
	<script type="text/javascript">
			
		function setIframe(type, cktype) {
			
			if (type=="auto") {
				$('#iframe').attr('src', basePath+'pages/ssjkyj/cxfx/auto/auto.jsp?cktype='+cktype);
			}
			else if (type=="za"){
				$('#iframe').attr('src',basePath+'pages/ssjkyj/cxfx/za/za.jsp?cktype='+cktype);
			}
			
		}
	
	</script>
  </head>
  <body>
    <div class="conent" style="overflow:hidden;height: 100%;margin: 0px;padding: 0px;">
		<div style="width:100%;height:100% ;">
			<iframe id="iframe" src="<%=basePath %>pages/ssjkyj/cxfx/za/za.jsp"></iframe>
		</div>
	</div>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/moment/moment-with-locales.min.js"></script>
</html>
