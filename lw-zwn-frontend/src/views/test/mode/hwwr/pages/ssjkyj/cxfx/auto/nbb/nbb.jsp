<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质自动站年报表</title>
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
	<script>var basePath = '<%=basePath%>';</script>
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
	  			<option value="autotype">水质自动站</option>
	  			<option value="zatype">水质站</option>
	  		</select>
  		</div> -->
  		
	  	&nbsp;&nbsp;
  	  	<div  id="timediv"  class="sc_div">
  	  		   	 时间：
			   	<input type="text" id="etm" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy'})">
  	  	</div>
  	  	<div class="sc_div">
	  		站点选择:   <input type="text"  id="selstcdid"  class="sc_input"  onclick="selstcdid()">
	  	</div>
	   	&nbsp;&nbsp;
	   	<div class="sc_div">
	   		指标选择:   <input type="text"  id="selcol"  class="sc_input"  onclick="selcol()">
	   	</div>
	   	&nbsp;&nbsp;
	    <input type="button" value="查询" class="s_input" onclick="initData()">
  	</div>
    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%">
    <%--<div class="titleDiv" style="height:30px"><span id="t_date" style="line-height: 28px;"></span>监测站点水质年报表</div>--%>
	<div class="titleDiv" ><span id="t_date" style="line-height: 28px;"></span>监测站点水质年报表</div>
    <div class="tableDiv" style="width:100%">

    	<div style="width:210px;height:calc(100% - 95px);left:0px;position: absolute;display:none;">
    	    <table class="bbTable fixtabSz" style="width:100%;">
	   			<thead>
	   				<tr>
						<td>选择站点</td>
					</tr>
	   			</thead>
	   		</table>
	   		<div id="stcddiv" style="position: absolute;overflow:hidden;height:90%;">
	    		<table id="sjdmSzTable0" class="bbTable fixtabSz" style="">
					<thead id="Szthead">
					</thead>
					<tbody id="Sztbody">
						
					</tbody>
				</table>
			</div>
    	</div>
    	<!-- <div id="stables" style="width:calc(100% - 220px);height:calc(100% - 105px);left:210px;position: absolute;">    	 -->
    	<div id="stables" style="width:100%;height:calc(100% - 105px);position: absolute;">    	
    			<div id="sjdmSzTableDiv" style="width:224px;height:100%;position: absolute;">
		    		<table id="sjdmSzTable" class="bbTable fixtabSz" style="width:224px;">
						<thead id="Sztheads" >
							<tr>
								<td>
									时间<br>
								</td>
								<td>
									水质<br>类别
								</td>
							</tr>
						</thead>
						<tbody id="Sztbodys">
							
						</tbody>
					</table>
		    	</div>
		    	<div id="sjdmZbTableDiv" style="width:calc(100% - 224px);;height:100%;left:224px;position: absolute;">
		    		<table id="sjdmZbTable" class="bbTable fixtabSz" style="width:2600px;left: 0px;position: absolute;">
						<thead id="Zbtheads" >
						
						</thead>
						<tbody id="Zbtbodys">
							
						</tbody>
					</table>
		    	</div>
    	</div>
    </div>
	</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/moment/moment-with-locales.min.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/ssjkyj/cxfx/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>pages/ssjkyj/cxfx/auto/nbb/nbb.js"></script>
</html>
