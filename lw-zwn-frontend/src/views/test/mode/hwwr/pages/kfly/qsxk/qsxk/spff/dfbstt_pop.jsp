<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String WRZ_CD = request.getParameter("WRZ_CD");
String RPCD = request.getParameter("RPCD");
String certtype = request.getParameter("certtype");
String tabletype = request.getParameter("tabletype");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>年取水许可统计</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<style type="text/css">
	.zd_div{
   		position:absolute;    left: 482px;top: 60px;width: 350px;border:1px solid #999;background-color: #ffffff;border-radius: 5px; border-collapse:collapse;
	       border-spacing:0;
   }
	</style>
	<script>
		var basePath = '<%=basePath%>';
		var WRZ_CD = '<%=WRZ_CD%>';
		var RPCD = '<%=RPCD%>';
		var certtype = '<%=certtype%>';
		var tabletype = '<%=tabletype%>';
	</script>
  </head>
  
  <body>
  
  	<div class="searchDiv">
  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy'})" >
  		 <span>-</span>
  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy'})" > 
  		 &nbsp;&nbsp;
  		<select id="riverselect"   style="width: 70px;text-align-last: center;">
	  		<option value="0">河道外</option>
	  		<option value="1">河道内</option>
  		</select>
  		&nbsp;&nbsp;
  		<select id="certselect"   style="width: 70px;text-align-last: center;">
	  		<option value="1">水源</option>
	  		<option value="0">用途</option>
  		</select>
  		&nbsp;&nbsp;
  		<span onClick="cktype()" >
  		<input id="zd" value="点击选择"  
  			style="width: 200px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgb(4, 84, 195);" 
  			title="">
  		</span>
  		
  		 &nbsp;&nbsp;&nbsp;&nbsp;
  		 <input type="button" value="查询" class="s_input" onclick="init()"   style="padding: 0px;cursor: pointer;">
  	</div>
  	
  	<div class='zd_div' style='display:none;z-index:2' id='zdxz'>
	    <div  style='height:40px;border-bottom:1px solid #999;font-size:15px;width: 100%;' >
	            <span style='margin-left:10px;float:left;	line-height: 40px;'>许可类型</span> 
	            <div  onclick="selectAll()" class="s_input" style='margin-left: 70px;float: left;margin-top: 8px;height: 25px;width: 48px;padding: 0px;text-align-last: center;cursor: pointer;'>全选</div>
	            <div  onclick="selectNone()" class="s_input" style='margin-left: 20px;float: left;margin-top: 8px;height: 25px;width: 48px;padding: 0px;text-align-last: center;cursor: pointer;'>清空</div>
	            <div  onclick="qd()" class="s_input" style='margin-left: 20px;float: left;margin-top: 8px;height: 25px;width: 48px;padding: 0px;text-align-last: center;cursor: pointer;'>确定</div>
	     </div>
     	<div id='zdxx' style='width:100%;border:0px solid #999;'></div>	
  	</div>
  	
  	<div id="mainDiv" style="padding: 10px 0 0 0px;z-index:1">
	    <div id="leftDiv" style="width:0px;max-height:400px;overflow-y:auto;float:left;overflow-y:scroll">
	    	
	    </div>
  		<div id="rightDiv" style="float:right;height:400px;"></div>
  	</div>
  	
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/kfly/qsxk/qsxk/spff/dfbstt_pop.js" type="text/javascript"></script>
</html>
