<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>实施监督管理的取水许可证统计表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <body>
  	<div class="searchDiv">
	  	&nbsp;&nbsp;&nbsp;&nbsp;
  	范围：<select id="fw">
  			<option value="">全部</option>
  			<option value="2">水资源分区</option>
  			<option value="1">行政区</option>
  		</select>
  		&nbsp;&nbsp;&nbsp;&nbsp;
   	 时间：<input type="text" id="year" name="year" onClick="WdatePicker({dateFmt: 'yyyy'})">  
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
  	</div>
    <center class="conent" style="overflow-y:scroll;width:100%;">
    <div class="titleDiv"><span id="t_year"></span>海河流域年终保有实施监督管理的取水许可证统计表(单位：证数：套；水量：亿立方米)</div>
	<table class="bbTable" style="width:3500px" id="oneTable">
		<thead>
			<tr>
				<td rowspan="5"  style="width:150px">分区</td>
				<td colspan="27">河道外用水取水户</td>
				<td colspan="4">河道内用水取水户</td>
				<td colspan="2" rowspan="3" style="border-top:1px solid #E1E1E1">其中：由海委委托省管理的河道内外用水取水户许可</td>
				<td rowspan="5">计量设施装置数量(个)</td>
				<td rowspan="5">水平衡测试数量(个)</td>
				<td rowspan="5">退水水质监测数量(个)</td>
				
			</tr>
			<tr>
				<td colspan="12" style="border-top:1px solid #E1E1E1">年终保有实施监督管理的许可证数和水量（按水源分类）</td>
				<td colspan="15" style="border-top:1px solid #E1E1E1">年终保有实施监督管理的许可证数和水量（按水源分类）</td>
				<td colspan="2" rowspan="2" style="border-top:1px solid #E1E1E1">年终保有实施监督管理的水力发电许可</td>
				<td colspan="2" rowspan="2" style="border-top:1px solid #E1E1E1">年终保有实施监督管理的其他许可</td>
			</tr>
			<tr>
				<td colspan="2" style="border-top:1px solid #E1E1E1">地表水</td>
				<td colspan="6" style="border-top:1px solid #E1E1E1">地下水</td>
				<td colspan="2" style="border-top:1px solid #E1E1E1">其他</td>
				<td colspan="2" style="border-top:1px solid #E1E1E1">合计</td>
				<td colspan="3" style="border-top:1px solid #E1E1E1">自来水</td>
				<td colspan="2" style="border-top:1px solid #E1E1E1">生活自备水</td>
				<td colspan="4" style="border-top:1px solid #E1E1E1">工业自备水</td>
				<td colspan="2" style="border-top:1px solid #E1E1E1">农业</td>
				<td colspan="2" style="border-top:1px solid #E1E1E1">其他</td>
				<td colspan="2" style="border-top:1px solid #E1E1E1">合计</td>
				
				
			</tr>
			<tr>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td colspan="2"   style="border-top:1px solid #E1E1E1">其中：地热水</td>
				<td colspan="2"   style="border-top:1px solid #E1E1E1">矿泉水</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">其中：生活水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td colspan="2"  style="border-top:1px solid #E1E1E1">其中：直流火核电</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">证数</td>
				<td rowspan="2"  style="border-top:1px solid #E1E1E1">水量</td>
			</tr>
			<tr>
				<td  style="border-top:1px solid #E1E1E1">证数</td>
				<td  style="border-top:1px solid #E1E1E1">水量</td>
				<td  style="border-top:1px solid #E1E1E1">证数</td>
				<td  style="border-top:1px solid #E1E1E1">水量</td>
				<td  style="border-top:1px solid #E1E1E1">证数</td>
				<td  style="border-top:1px solid #E1E1E1">水量</td>
			</tr>
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	
	
	</center>
  </body>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
   <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>pages/message/nb/05/ssjdgl.js"></script>
</html>
