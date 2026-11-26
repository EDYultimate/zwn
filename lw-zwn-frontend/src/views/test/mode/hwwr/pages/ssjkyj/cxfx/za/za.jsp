<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String cktype = request.getParameter("cktype")==null?"":request.getParameter("cktype");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质站</title>
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
	<script>
		var basePath = '<%=basePath%>';
		var cktype='<%=cktype%>'
	</script>
	<style>
	body{padding:0;margin:0}
	.ckrow {
		background-color: darkgray;
	    color: white;
	}
	
	</style>
  </head>
  <body>
    <div class="conent" style="overflow:hidden;height:100%">
		<table class="bbTable fixtabSz"  style="width: 500px;margin-left: 10px;height: 35px;">
			<tbody>
				<tr>
					<td id="jcxx"  onclick="cktab('jcxx')" class="ckrow" style="width:60px">监测信息</td>
					<td id="qst" onclick="cktab('qst')">趋势图</td>
					<td id="tbt" onclick="cktab('tbt')" >同比图</td>
					<td id="hbt" onclick="cktab('hbt')" >环比图</td>
					<td id="nbb" onclick="cktab('nbb')" >年报表</td>
				</tr>
			</tbody>
		</table>
		<div style="width:100%;height:calc(100% - 55px); margin-top:5px">
			<iframe id="iframe" src="<%=basePath %>pages/lyzg/sjdm/sjdm_sz/sjdm_sz.jsp"></iframe>
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
  <script type="text/javascript" src="<%=basePath %>pages/ssjkyj/cxfx/za/za.js"></script>
</html>
