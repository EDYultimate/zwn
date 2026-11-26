<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'sthx.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    

	<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
	<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
   <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
   <script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
   <script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
	<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
   <script type="text/javascript" src="<%=basePath%>pages/rcgl/sthx/tbzs/sthx.js" type="text/javascript"></script>
  </head>
  <script>
  var basePath='<%=basePath%>';
  </script>
  <style  type="text/css">
 	td {
 		height: 21px;
		border: 1px #e1e1e1 solid;
 	}
 	.td_center {
 		text-align: center;
 	}
  </style>
<%--  <body>
  
 	<div class="searchDiv">
		<div class="sc_div"  style="width: 175px;">
			时间：
			<input id="sthxDate" type="text" class="sc_input"  style="width: 80px;"  onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy',maxDate:'%y'})">
		</div>
		<div class="sc_div"  style="width: 165px;">
				展示：<select id="show_chg"  class="sc_input"  style="width: 60px;">
					  			<option value="tubtn">图形</option>
					  			<option value="tablebtn">表格</option>
					  		</select>
		</div>
		
		<input type="button" value="查询" class="s_input" onclick="initSthxTable()">
		<input type="button" value="录入" class="sb_input" onclick="add()">
  	</div>
  
<div style="width:100%;height:calc(100% - 80px);overflow-y: auto;">
  	<div style="width:860px;float:left;margin-left:calc(50% - 430px); margin-top:30px">
  		<div style="height:700px;overflow:hidden;">
			<div id="sthLoadDiv" style="height:700px;text-align:center;padding:350px;">
				<img src="common/js/layer/theme/default/loading-2.gif"><br>
				<span>数据正在加载,请稍后</span>
			</div>
			<div id="sthDateDiv" style="height:700px;width:100%;">
				<div id="sthxEchartDiv" style="height:700px;width:100%;">
					<div style="height:350px;width:100%;">
						<div id="sthxyszlDiv" style="width:341px;float:left;height:300px;"></div>
						<div id="sthxgyysDiv" style="width:342px;float:right;height:300px;"></div>
					</div>
					<div style="height:350px;width:100%;">
						<div id="sthxnyblDiv" style="width:341px;float:left;height:300px;"></div>
						<div id="sthxsgnqdbDiv" style="width:342px;float:right;height:300px;"></div>
					</div>
				</div>
				<div id="sthxTableDiv" class="tableIndex" style="height:700px;display:none;">
					
				</div>
			</div>
		</div>

  	</div>
  	
 </div>
  	
  </body>--%>


<body>
<div class="searchDiv">
	<div class="sc_div"  style="width: 175px;">
		时间：
		<input id="sthxDate" type="text" class="sc_input"  style="width: 80px;"  onFocus="WdatePicker({isShowClear:false,readOnly:true,dateFmt:'yyyy',maxDate:'%y'})">
	</div>
	<%--<div class="sc_div"  style="width: 165px;">
		展示：<select id="show_chg"  class="sc_input"  style="width: 60px;">
		<option value="tubtn">图形</option>
		<option value="tablebtn">表格</option>
	</select>
	</div>--%>

	<input type="button" value="查询" class="s_input" onclick="initSthxTable()">
	<input type="button" value="录入" class="sb_input" onclick="add()">
	<div  style="width:90px; height:35px;float:right;border:1px solid #d3dbde;padding:0px 5px;border-radius:15px;margin-right:5px;margin-top:4px;">
		<div style="float:left;width:40px;height:32px;;padding:1px">
			<img class="changeBtn" id="tubtn" width='40px' height='30px' src="<%=basePath%>images/index/tu1.png">
		</div>
		<div  style="float:right;width:40px;height:32px;border-left:1px solid #d3dbde;padding:2px;">
			<img class="changeBtn" id="tablebtn" width='40px' height='30px' src="<%=basePath%>images/index/table2.png">
		</div>
	</div>
</div>

<div style="width:100%;height:100%;">
	<div style="width:100%;float:left; ">
		<div style="height:700px;overflow:hidden;">
			<div id="sthLoadDiv" style="height:700px;text-align:center;padding:350px;">
				<img src="common/js/layer/theme/default/loading-2.gif"><br>
				<span>数据正在加载,请稍后</span>
			</div>
			<div id="sthDateDiv" style="height:80%;width:100%;">
				<div id="sthxEchartDiv" style="height:100%;width:100%;">
					<div style="height:50%;width:100%;">
						<div id="sthxyszlDiv" style="width:45%;float:left;height:90%;"></div>
						<div id="sthxgyysDiv" style="width:45%;float:right;height:90%;"></div>
					</div>
					<div style="height:50%;width:100%;">
						<div id="sthxnyblDiv" style="width:45%;float:left;height:90%;"></div>
						<div id="sthxsgnqdbDiv" style="width:45%;float:right;height:90%;"></div>
					</div>
				</div>
				<div id="sthxTableDiv" class="tableIndex" style="height:90%;display:none;margin:5px 10px;" >

				</div>
			</div>
		</div>

	</div>

</div>

</body>
</html>
