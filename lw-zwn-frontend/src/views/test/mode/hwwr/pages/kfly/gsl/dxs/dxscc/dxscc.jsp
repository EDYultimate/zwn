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
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  </head>
	<style>
	table{table-layout:fixed;}
	td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
  <body>
  <div class="searchDiv">
  	&nbsp;&nbsp;&nbsp;&nbsp;
  			&nbsp;&nbsp;
  	<div  class="sc_div">
  		名称：
  		<input type="text" id="stnm" name="stnm"  class="sc_input">  
  	</div>
    <input type="button" value="查询" class="s_input" onclick="search()">
    </div>
      <center class="conent">
    <div class="titleDiv"><span id="t_year"></span>地下水超采区信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td style="width:280px">超采区名称</td>
				<td>划分依据</td>
				<td>超采区面积</td>
				<td>管理方式</td>
				<td>主采层</td>
				<td>地下水年<br>均开采量</td>
				<td>年均可开采量</td>
				<td>地下水位<br>最大埋深</td>
				<td>水位最大<br>埋深地点</td>
				<td>包含行政<br>区名称</td>
			</tr>
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script src="<%=basePath%>pages/kfly/gsl/dxs/dxscc/dxscc.js" type="text/javascript"></script>
 <script>
 var basePath = '<%=basePath%>';
 </script>
</html>
