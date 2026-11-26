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
	td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}

	.conent{
		margin-top:0px;
	}
	.searchDiv{
		padding:0px;
	}

	</style>
  <body>
  <div class="searchDiv">
  	&nbsp;&nbsp;&nbsp;&nbsp;
  	<div class="sc_div">
  	  	测站类型：
  	  	<select id="type"  class="sc_input">
  			<option value="">全部</option>
  			<option value="0">孔隙水</option>
  			<option value="1">裂隙水</option>
  			<option value="2">岩溶水</option>
  			<option value="3">孔隙裂隙水</option>
  			<option value="4">孔隙岩溶水</option>
  			<option value="5">裂隙岩溶水</option>
  			<option value="6">其他</option>
  		</select>
  	</div>
  			&nbsp;&nbsp;
  	<div  class="sc_div">
  		测站名称：
  		<input type="text" id="stnm" name="stnm"  class="sc_input">  
  	</div>
   	 &nbsp;&nbsp;
   	 <div class="sc_div"  style="width:280px">
   	 	时间：
   	 	<input type="text" id="btm" name="btm" class="sc_input sc_input_fix" onClick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})">  
   		--
   		<input type="text" id="etm" name="etm"  class="sc_input"  onClick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})">  
   	 </div>
   	 
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    </div>
      <center class="conent">
    <div class="titleDiv"><span id="t_year"></span>测站埋深监测信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td>测站名称</td>
				<td>测站类别</td>
				<td>行政区</td>
				<td>水资源分区</td>
				<td>时间</td>
				<td>埋深</td>
				<td>水质</td>
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
  <script src="<%=basePath%>pages/kfly/gsl/dxs/sssj/sssj.js" type="text/javascript"></script>
 <script>
 var basePath = '<%=basePath%>';
 </script>
</html>
