<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String wiu_cd = request.getParameter("wiu_cd");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>取水户取水量趋势统计</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	  <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
	  <link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
	  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	  <style type="text/css">

		/*  .sc_div{
			  height: 30px;
		  }*/

		  input {
			  height: 15px;
			  border-radius: 15px;
			  border: 1px solid #E1E1E1;
			  text-align: center;
			  outline: none;
			  color: rgb(4, 84, 195);
			  width: 100px;
		  }
	  </style>
	<script>
		var basePath = '<%=basePath%>';
		var wiu_cd = '<%=wiu_cd%>';
	</script>
  </head>
  
  <body>
  	<div class="searchDiv">
		<div class="sc_div"  style="width:280px;"  id="tjtp">
			统计方式:
			<input type="radio" name="radio" value="1" checked="checked"   style="width:40px;" >日
			<input type="radio" name="radio" value="2"   style="width:40px;" >月
		</div>

  	<%--	 时间：<input type="text" id="beginTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endTm\')}'})">
  		 <span>-</span>
  		 <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd',minDate:'#F{$dp.$D(\'beginTm\')}'})">--%>


		<div class="sc_div" style="width:280px;"  id="dy"  >
			时间：
			<input type="text" id="bdat" name="datemonth"    style="height:30px;"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
			--
			<input type="text" id="edat" name="datemonth"   style="height:30px;"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
		</div>


		<div class="sc_div" style="width:280px;display:none;"  id="mn"  >
			时间：
			<input type="text" id="bdat1" name="datemonth"   style="height:30px;"   onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
			--
			<input type="text" id="edat1" name="datemonth"  style="height:30px;"  onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
		</div>



		&nbsp;&nbsp;&nbsp;&nbsp;
  		 <input type="button" value="查询" class="s_input" onclick="init()">
  	</div>
  	<div id="mainDiv" style="padding: 10px 0 0 0px;">
	    <div id="leftDiv" style="width:250px;max-height:390px;overflow-y:auto;float:left;overflow-y:scroll">
	    	<table class="bbTable">
				<thead>
					<tr>
						<td style="width:100px">时间</td>
						<td>取水量（万m³）</td>
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
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script src="<%=basePath%>/pages/kfly/ysl/qysjc/qshjc/qshDialog.js" type="text/javascript"></script>
</html>
