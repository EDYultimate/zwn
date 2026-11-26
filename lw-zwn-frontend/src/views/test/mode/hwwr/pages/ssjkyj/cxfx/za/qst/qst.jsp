<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质站</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<link rel="stylesheet" href ="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>
		var basePath = '<%=basePath%>';
	</script>
	  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/moment/moment-with-locales.min.js"></script>
	  <script type="text/javascript" src="<%=basePath %>pages/ssjkyj/cxfx/za/qst/qst.js"></script>
	<style>
	body{padding:0;margin:0}
	.ckrow {
		background-color: darkgray;
	    color: white;
	}
	
	</style>
  </head>
  <body>
  	<div class="searchDiv">
  	
<!--   	  	&nbsp;&nbsp;&nbsp;&nbsp;
  		<div style="float:left;width: 200px;">
  			站点类型:
	  		<select type="text" id="stcdtype" >
	  			<option value="zatype">水质站</option>
	  			<option value="autotype">水质自动站</option>
	  		</select>
  		</div> -->
  	
	  	&nbsp;&nbsp;
	  	<div class="sc_div">
	  		  	统计方式：
  		  	<select type="text" id="nm" name="nm" class="sc_input">
<!-- 	  	<option value="1" >日统计</option> -->
				<option value="2" >月统计</option>
			</select>
	  	</div>
  	  	<div  id="timediv"  class="sc_div" style="width:280px">
  	  		   	 时间：
  	  		   	 <input type="text" id="btm" name="datemonth"  class="sc_input sc_input_fix"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
			   	--
			   	<input type="text" id="etm" name="datemonth"   class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
  	  	</div>
  	  	<div class="sc_div">
		  	站点选择:   
		  	<input type="text"  id="selstcdid"  class="sc_input"  onclick="selstcdid()">
	  	</div>
	  	<div class="sc_div">
		   	指标选择:   
		   	<input type="text"  id="selcol"  class="sc_input"  onclick="selcol()">
	   	</div>
	   	&nbsp;&nbsp;
	    <input type="button" value="查询" class="s_input" onclick="initData()">
  	</div>
    <center class="conent" style="overflow:hidden;height:calc(100% - 100px);margin-top:0px">
    <div class="titleDiv" style="height:30px"><span id="t_date"></span>监测站点水质指标趋势图</div>
    <div class="tableDiv" style="width:100%">
	
	<div style="width:15%;height:95%;float:left;display:none" >
    	    <table class="bbTable fixtabSz" style="width:100%;">
	   			<thead>
	   				<tr>
						<td>选择站点</td>
					</tr>
	   			</thead>
	   		</table>
	   		<div id="stcddiv" style="position: relative;overflow:hidden;height:90%">
	    		<table id="sjdmSzTable" class="bbTable fixtabSz" style="width:100%;">
					<thead id="Szthead">
					</thead>
					<tbody id="Sztbody">
						
					</tbody>
				</table>
			</div>
    	</div>
    	<div style="width:100%;height:100%;float:left;overflow-y:auto;">
    		<div id="charts" style="width: 100%;height: 100%;position: relative;">
    		
    		</div>
    	</div>
    </div>
	</center>
	<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
  </body>

</html>
