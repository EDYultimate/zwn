<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>地下水</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <style>
.info{font-weight: bold;}
  </style>
  <body>
  	<div class="searchDiv">
    <div class="sc_div" style="width:140px">
        年度：
        <input id="tyear" type="text" class="sc_input" style="width: 80px;" onfocus="WdatePicker({isShowClear:false,dateFmt:'yyyy'})" >
    </div>
    <input type="button" value="查询" class="s_input" onclick="search()">
</div>

<div style="float:left;width:90%;margin-top:15px;text-align:center;font-size:20px;font-family: cursive;" id="ms">
<span class="info" id="yr"></span>年度应检查<span class="info" id="totalT"></span>套取水许可证,已查<span class="info" id="finishT"></span>
套,检查<span class="info" id="finishTime"></span>次,
存在问题对应取水许可证<span class="info" id="problemT"></span>套，占总取水许可证数量(<span class="info" id="finishT2"></span>套)
<span class="info" id="percent"></span>%
</div>

<div style="float:left;width:90%;margin-top:15px;text-align:center;font-size:20px;font-family: cursive;" >
存在<span class="info" id="problemNum"></span>个问题，今年整改了<span class="info" id="finishProNum"></span>个问题，
未整改问题<span class="info" id="nofinishProNum"></span>个，整改率为<span class="info" id="problemRate"></span>%
</div>

<div id="tableDiv" style="float:left;width:100%;margin:auto;overflow:auto">

     <table id="table" class="bbTable"  style="table-layout: fixed;width: 90%;margin: auto;">
        <thead>
        <tr>
            <th style="width: 50px;">序号</th>
            <th>问题名称</th>
            <th>套数（个）</th>
            <th>比例（问题套数/应检查套数）</th>
        </tr>
        </thead>
        <tbody id="Sztbody">
        </tbody>
    </table>
</div>
<div id="tjxxT" style="width:70%;height:300px;float:left">
</div>
<div id="tjxxP" style="width:30%;height:300px;float:left">
</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/rcgl/jdjc/jdjcTj.js"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
</html>
