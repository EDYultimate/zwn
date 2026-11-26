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
	<style>
	.bbTable{
	border-collapse:collapse;
	border-spacing:0;
	border-left:1px solid #E1E1E1;
	border-top:1px solid #E1E1E1;
	border-bottom:1px solid #E1E1E1;
	font-family: "Microsoft YaHei","微软雅黑","sans-serif";
	width: 100%;
	/* font: 14px Verdana, "Microsoft YaHei"; */
}
.bbTable>thead>tr>td, th{
	height:25px;
	background-color: rgba(252, 252, 252, 1);
	border-right:1px solid #E1E1E1;
	padding:5px 15px;
	text-align: center;
	font-size: 12px;
	font-weight: bold;
}
.bbTable>tbody>tr>td, th{
	height:20px;
	border:1px solid #E1E1E1;
	padding:5px 15px;
	font-size:10px;
	text-align: center;
}
	
.titleDiv{
	height: 25px;
    font: 12px Verdana, "Microsoft YaHei";
    border:1px solid #E1E1E1;
    border-bottom:none;
}
.titleDiv>span{
	line-height:25px;
}
.s_input{
	height:25px;
	padding: 0px 8px 0 10px;
    border-radius: 15px;
    border: 1px solid #E1E1E1;
    background-color: rgba(2, 194, 153, 1);
    outline:none;
    color:#FFFFFF;
}
.s_input:hover {
	cursor: pointer;
}
input{
	height:25px;
	border-radius: 15px;
	border: 1px solid #E1E1E1;
	text-align: center;
	outline:none;
	color:rgb(4, 84, 195);
	width:60px
}	
.searchDiv{
	font-size: 12px;
	height:28px;
	padding-top:2px;
	padding-bottom:0px;
}
	</style>
	
  </head>
  <script>
   var cd='<%=request.getParameter("cd")%>';
   $(function(){
   $("#cd").val(cd);
   getYr();
   });
  </script>
  <body>
  <input id="cd" style="display:none">
  	<div class="searchDiv">
	 
  		&nbsp;&nbsp;&nbsp;&nbsp;
   	 时间：<input type="text" id="year" name="year" onClick="WdatePicker({dateFmt: 'yyyy'})">  
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="ini()">
  	</div>
    <center class="conent" style="overflow:hidden;width:99%;height:500px;">
    <div class="titleDiv"><span id="t_year"></span>水量统计表（亿m3）</div>
	<table id="bbtable" class="bbTable" style="width:100%" id="oneTable">
		<thead id="theadtab">
			
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	
		<div id="chartDIV" style="background-color: #ffffff;text-align:center;width:99.5%;float:left;margin-top:5px; border: 1px solid #AAAAAA;">
         </div>
	</center>
  </body>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
   <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>pages/nsbd/tj/dialog/tjDialog.js"></script>
</html>
