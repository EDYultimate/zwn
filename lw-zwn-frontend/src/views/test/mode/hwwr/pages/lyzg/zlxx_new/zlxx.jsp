<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>资料信息</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
<style type="text/css">
.MTable{
	border-collapse:collapse;
	border-spacing:0;
	border-left:1px solid #E1E1E1;
	border-top:1px solid #E1E1E1;
	border-bottom:1px solid #E1E1E1;
	font-family: "Microsoft YaHei","微软雅黑","sans-serif";
	width:100%;
	/* font: 14px Verdana, "Microsoft YaHei"; */
}
.MTable>thead>tr>td, th{
	height:35px;
	background-color: rgba(252, 252, 252, 1);
	border-right:1px solid #E1E1E1;
	padding:5px 15px;
	text-align: center;
	font-size: 15px;
	font-weight: bold;	
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.MTable>tbody>tr>td, th{
	height:30px;
	border:1px solid #E1E1E1;
	padding:5px 15px;
	font-size:14px;
	text-align: center;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	word-break:keep-all;
	
}
</style>
<script>var basePath = '<%=basePath%>';</script>
</head>
<body >
  
  	<div class="searchDiv">
  	
  	<div class="sc_div" style="width: 115px;">
	  	年度：<input type="text" id="yr" name="yr" class="sc_input"  style="width: 60px;" onClick="WdatePicker({ dateFmt: 'yyyy'})">
	</div>
	 <div class="sc_div">
		一级项目: 
		<select name="group1" id="group1" value=""  class="sc_input" >
			<option value=""></option>
		</select>
	 </div>
	 <div class="sc_div">
		二级项目:
		<select name="group2" id="group2" value=""  class="sc_input"  >
			<option value=""></option>
		</select>
	</div>
	<div class="sc_div" >
		是否公开招投标:
		<select name="bid" id="bid"  class="sc_input"  style="width: 50px;">
			<option value=""></option>
			<option value="0">否</option>
			<option value="1">是</option>
		</select>
	</div>
	<div class="sc_div"  style="width: 260px;">
		对外委托任务项目名称:
		<input type="text" id="proj_nm" name="proj_nm"  class="sc_input">
	</div>	
		&nbsp;

<!-- 	   	上传时间：<input type="text" id="btm" name="datemonth" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">  
	   	--
	   	<input type="text" id="etm" name="datemonth" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">  
	   	&nbsp;&nbsp;&nbsp;&nbsp; -->
	   	
	    <input type="button" value="查询" class="s_input" onclick="search()">
	    &nbsp;
	    <input type="button" value="新建" class="sb_input" onclick="showDetail()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv"><span id="tmSpan">项目资料信息表</span></div>
	<table class="MTable" >
		<thead>
        <tr>
        <td style="width:30px;">序号</td>
        <td style="width:60px;">年度</td>
        <td>一级项目</td>
        <td>二级项目</td>
        <td>对外委托任务项目名称</td>
        <td>是否公开招投标</td>
        <td>编制单位</td>
        <td>联系人</td>
        <td>电话</td>
        <td>操作</td>
        </tr>
			
		</thead>
		<tbody id="tbody">
			
		</tbody>
	</table>
	<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
	</center>
  </body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/lyzg/zlxx_new/zlxx.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>
