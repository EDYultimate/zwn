<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title></title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  
  <body>
  <div>
  	<div style="border:1px solid #eeefef;width:100%;">
	  	<div style="height:25px;width:100%;background-color: #e3e3e3;">
	  	<span class="tipspan"><img class="tip" src="/hwwr/common/image/tip.jpg" /></span>历史统计信息</div>
	  	<div style="width:100&;position: relative;">
	  		<div class="lefttab" style="width:110px;height:280px;position: absolute;top:10px;">
	  			<table>
	  				<tr><td id="jsl" class="tab">降水量</td></tr>
	  				<tr><td id="szyl" class="tab">水资源量</td></tr>
	  				<tr><td id="skxsl" class="tab">水库蓄水量</td></tr>
	  				<tr><td id="gsl" class="tab">供水量</td></tr>
	  				<tr><td id="ysl" class="tab">用水量</td></tr>
	  				<tr><td id="hsl" class="tab">耗水量</td></tr>
	  				<tr><td id="pwl" class="tab">排污量</td></tr>
	  			</table>
	  		</div>
	  		<div style="width:90%;height:280px;position: absolute;top:10px;right:10px;">
	  			<table class="indexTable" style="width:100%;">
	  				<thead>
	  					<tr>
	  						<td rowspan="2">年份</td>
	  						<td colspan="4" style="border-bottom:1px solid #999;">水资源分区</td>
	  						<td colspan="8" style="border-bottom:1px solid #999;">行政区</td>
	  						<td rowspan="2">流域总计</td>
	  					</tr>
	  					<tr>
	  						<td>滦河及冀东沿海</td>
	  						<td>海河北系</td>
	  						<td>海河南系</td>
	  						<td>徒骇马颊河</td>
	  						<td>北京市</td>
	  						<td>天津市</td>
	  						<td>河北省</td>
	  						<td>山西省</td>
	  						<td>河南省</td>
	  						<td>山东省</td>
	  						<td>内蒙古</td>
	  						<td>辽宁省</td>
	  					</tr>
	  				</thead>
	  				<tbody id="tbody">
	  				
	  				</tbody>
	  			</table>
	  		</div>
	  	</div>
  	</div>
  </div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/index/tjxx/tjxx.js"></script>
</html>
