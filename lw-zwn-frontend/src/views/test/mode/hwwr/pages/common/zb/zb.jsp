<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质指标</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<style>
	.s_input{
		height:25px;
		width:70px;
		padding: 0px 10px 0 10px;
	    border-radius: 15px;
	    border: 1px solid #E1E1E1;
	    background-color: rgba(2, 194, 153, 1);
	    outline:none;
	    color:#FFFFFF;
	}
	</style>
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  </head>
  
  <body>
    <div>
    	<table id="sjdmZbTable" style="width:600px;height:300px;">
    	
    	</table>
    	<div style="width:200px;float:right;padding: 10px;">
    		<input id="checkBtn" type="button" value="全选" class="s_input" onclick="checkToggle()">
    		<input id="confirmBtn" type="button" value="确定" class="s_input" onclick="confirmBtn()">
    		<input type="hidden" id="checkFlg" value="0">
    	</div>
    </div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/common/zb/zb.js"></script>
</html>
