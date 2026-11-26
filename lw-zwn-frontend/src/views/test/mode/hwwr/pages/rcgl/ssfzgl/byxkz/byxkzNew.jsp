<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>降水量</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
	<style>
	table{table-layout:fixed;}
	tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
  </head>
  <body >
  
  	<div class="searchDiv">
  	&nbsp;&nbsp;
  	<div class="sc_div">
		许可证状态：<select id="expired"  class="sc_input"  style="width: 60px;">
		<option value="">全部</option>
		<option value="1">过期</option>
		<option value="2">有效</option>
		</select>
  	</div>
  	&nbsp;&nbsp;
  	<div class="sc_div">
		管理单位：<select id="wpc_cd"  class="sc_input"  style="width: 60px;">
			<option value="all">全部</option>
			<option value="11">北京</option>
			<option value="12">天津</option>
			<option value="13">河北</option>
			<option value="14">山西</option>
			<option value="41">河南</option>
			<option value="37">山东</option>
			<option value="15">内蒙</option>
			<option value="21">辽宁</option>
		</select>
  	</div>
  	
  			&nbsp;&nbsp;
		<div class="sc_div"  style="width:220px">
	  		取水权人名称：
	  		<input type="text" id="wrp_nm"    class="sc_input">
	  	</div>
	  	  	&nbsp;&nbsp;
	  	  	
	  	  	<div class="sc_div"  style="width:220px">
	  		取水许可证：<input type="text" id="wpc_sn"   class="sc_input">
	  	</div>
	  	  	&nbsp;&nbsp;
		<div class="sc_div" style="width:180px">
	   	 	年份：
	   	 	<input type="text"  id="tyear" name="datemonth"   class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">  
	   	</div>
	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
   
	<table class="bbTable">
		<thead>
			<tr>
				<td>序号</td>
				<!-- <td style="width:200px">取水许可证代码</td> -->
				<td>证件状态</td>
				<td>取水许可证编号</td>
				<td>取水权人</td>
				<td>取水方式</td>
				<td>年许可水量</td>
				<td>取水用途</td>
				<td>有效期<br>起始时间</td>
				<td>有效期<br>结束时间</td>
			
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
<script type="text/javascript" src="<%=basePath %>pages/rcgl/ssfzgl/byxkz/byxkzNew.js"></script>
</html>
