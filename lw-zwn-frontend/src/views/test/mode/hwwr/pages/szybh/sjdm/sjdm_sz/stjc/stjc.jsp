<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>水质测站指标监测信息</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script type="text/javascript" src="<%=basePath %>pages/szybh/sjdm/sjdm_sz/sjdm_sz_common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
      <style>
  /* 表格内容不换行 */
.fixtabSz{table-layout:fixed;}
.fixtabSz>tbody>tr>td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.fixtabSz>tbody>tr>td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
  </style>
  <body>
    <div class="searchDiv">
  		    时间：<input  readonly="readonly" type="text" id="beginTm" name="" onClick="WdatePicker({ dateFmt: 'yyyy-MM',maxDate:'#F{$dp.$D(\'endTm\')}'})">
  		 <span>-</span>
  		 <input  readonly="readonly" type="text" id="endTm" name="" onClick="WdatePicker({ dateFmt: 'yyyy-MM',minDate:'#F{$dp.$D(\'beginTm\')}'})"> 
  		 &nbsp;&nbsp;&nbsp;&nbsp;
	   	  指标：<input type="text" id="szzb" name="szzb" onClick="openZb()">
	   	 &nbsp;&nbsp;&nbsp;&nbsp;
  		 <input type="button" value="查询" class="s_input" onclick="init()">
  	</div>
  	<div id="mainDiv" style="padding: 10px 0 0 0px;">
	    <div id="tableDiv" style="width:100%;height:180px;border-bottom:1px solid #E1E1E1;overflow-y:auto;">
	    	<table class="bbTable  fixtabSz">
				<thead id="thead">
					
				</thead>
				<tbody id="tbody">
					
				</tbody>
			</table>
	    </div>
  		<div id="echartDiv1" style="display:none;width:100%;height:180px;padding: 10px 0 0 0px;"></div>
  		<div id="echartDiv2" style="display:none;width:100%;height:180px;padding: 10px 0 0 0px;"></div>
  	</div>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/szybh/sjdm/sjdm_sz/stjc/stjc.js"></script>
</html>
