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
	td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
  </head>
  <body>
  
  	<div class="searchDiv">
  	&nbsp;
		<div class="sc_div"  style="width: 140px;">
			<!-- 管理单位： -->
			发证类型:
			<select id="fzlx"   class="sc_input"   style="width: 70px;">
				<option value="">全部</option>
				<option value="04">委发证</option>
				<option value="00">省市发证</option>
			</select>
		</div>

		&nbsp;
  	<div class="sc_div"  style="width: 140px;">
  	  	<!-- 管理单位： -->
  	  	行政区:
  		<select id="xzqselect"   class="sc_input"  style="width: 70px;">
	  		<option value="">全部</option>
	  	<%--	<option value="040000">海河水利委员会</option>
	  		<option value="110000">北京市</option>
	  		<option value="120000">天津市</option>
	  		<option value="130000">河北省</option>
	  		<option value="140000">山西省</option>
	  		<option value="410000">河南省</option>
	  		<option value="370000">山东省</option>
	  		<option value="150000">内蒙古自治区</option>
	  		<option value="210000">辽宁省</option>  --%>

			<option value="北京">北京</option>
			<option value="天津">天津</option>
			<option value="河北">河北</option>
			<option value="山西">山西</option>
			<option value="河南">河南</option>
			<option value="山东">山东</option>
			<option value="内蒙">内蒙</option>
			<option value="辽宁">辽宁</option>
  		</select>
  	</div>

  	<%--		&nbsp;&nbsp;
  	<div class="sc_div" style="width:200px">
		取水户名称：
		<input type="text" id="nm" name="nm" class="sc_input">
  	</div>--%>
	  	
	  	  	&nbsp;&nbsp;
	<%--<div class="sc_div">
		状态:
		<select id="status"   class="sc_input">
			<option value="">全部</option>
			<option value="1">启用</option>
			<option value="0">停用</option>
		</select>
	</div>--%>
		&nbsp;
  <div class="sc_div"  style="width: 140px;">
	  水资源分区：
		<select id="wrz_nm" class="sc_input" style="width: 50px;">
			<option value="">全部</option>
			<option value="滦河及冀东沿海">滦河及冀东沿海</option>
			<option value="海河北系">海河北系</option>
			<option value="海河南系">海河南系</option>
			<option value="徒骇马颊河（二级）">徒骇马颊河（二级）</option>
		</select>
  </div>

		 &nbsp;
	<div class="sc_div"  style="width: 140px;">
		监管单位：
		<select id="conc_org" class="sc_input" style="width: 50px;">
			<option value="">全部</option>
			<option value="上游局">上游局</option>
			<option value="漳卫南局">漳卫南局</option>
			<option value="引滦局">引滦局</option>
			<option value="下游局">下游局</option>
			<option value="北京">北京</option>
			<option value="天津">天津</option>
			<option value="河北">河北</option>
			<option value="山西">山西</option>
			<option value="河南">河南</option>
			<option value="山东">山东</option>
			<option value="内蒙">内蒙</option>
			<option value="辽宁">辽宁</option>
		</select>
	</div>
		&nbsp;
  	<div class="sc_div" style="width:280px">
			时间：
			<input type="text" id="btm" name="datemonth" class="sc_input sc_input_fix" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">  
		   	--
		   	<input type="text" id="etm" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">  
  	</div>

		&nbsp;&nbsp;
		<div class="sc_div" style="width:200px">
			取水户名称：
			<input type="text" id="nm" name="nm" class="sc_input"   style="width: 70px;">
		</div>

	   	&nbsp;&nbsp;&nbsp;&nbsp;
	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv"><span id="titleSpan"></span>取水户取水量监测信息表</div>
	<table class="bbTable">
		<thead>
			<tr>
				<td>取用水户名称</td>
				<td>发证类型</td>
				<td>行政区</td>
				<td>水资源分区</td>
				<td>监管单位</td>
				<td>累计取水量(万m³)</td>
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
  <script type="text/javascript" src="<%=basePath %>pages/kfly/ysl/qysjc/qshjc/qshjc.js"></script>
</html>
