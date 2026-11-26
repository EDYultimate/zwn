<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String stcd = request.getParameter("stcd");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>降水量年趋势统计</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<style type="text/css">
		.searchDiv {
		    font-size: 15px;
		    padding: 8px;
		    background-color: rgba(225, 232, 240, 1);
		}
		.s_input {
			background-image: none;
			text-align: center;
		}
	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script>
		var basePath = '<%=basePath%>';
		var stcd = '<%=stcd%>';
	</script>
  </head>
  
  <body>
  
  	 <div class="right_menu">
  		<ul>
  			<li id="qsfx" class="liTab  clickLiTab"><span>趋势分析</span></li>
  			<li id="jcxx" class="liTab"><span>基础信息</span></li>
  		</ul>
  	</div>
  
  	<div id="content_chart">
	  	<div class="searchDiv">
	  		 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" >
	  		 <span>-</span>
	  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" > 
	  		 &nbsp;&nbsp;&nbsp;&nbsp;
	  		 <input type="button" value="查询" class="s_input" onclick="init()"   style="padding: 0px;">
	  	</div>
	  	<div id="mainDiv" style="padding: 10px 0 0 0px;">
		    <div id="leftDiv" style="width:250px;max-height:400px;overflow-y:auto;float:left;overflow-y:scroll">
		    	<table class="bbTable">
					<thead>
						<tr>
							<td>日期</td>
							<td>降水量(mm)</td>
						</tr>
					</thead>
					<tbody id="tbody">
						<tr>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
		    </div>
	  		<div id="rightDiv" style="float:right;height:400px;"></div>
	  	</div>
  	</div>
  	<div id="content_table" style="display:none">
  		<table>
  			<tr>
  				<td style="width: 150px;">测站名称</td><td id="ST_NM"></td><td style="width: 150px;">测站编号</td><td id="STCD"></td>
  			</tr>
  			<tr>
  				<td style="width: 150px;">测站位置</td><td id="LOC"></td><td style="width: 150px;">建站年月</td><td id="EST_ST_YM"></td>
  			</tr>
			<tr>
				<td style="width: 150px;">管理单位代码</td><td id="ENG_MAN_CD"></td><td style="width: 150px;">备注</td><td id="NT"></td>
			</tr>  			
  		</table>
  	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/kfly/jsl/sssj/jsl_stcd.js" type="text/javascript"></script>
</html>
