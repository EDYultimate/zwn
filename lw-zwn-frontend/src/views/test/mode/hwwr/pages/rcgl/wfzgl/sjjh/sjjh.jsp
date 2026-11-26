<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>数据校核</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
<script>var basePath = '<%=basePath%>';</script>
</head>
  <body >
  <div class="searchDiv">

	  <div class="sc_div"  style="width: 200px;">
		  日期：<input type="text" id="tm"  class="sc_input" style="width: 120px;" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
	  </div>
	 <%-- <div class="sc_div"  style="width: 220px;">
		  取水点：<input type="text" id="wrp_nm"  class="sc_input" style="width: 80px;">
	  </div>--%>

	  <div class="sc_div"  style="width: 200px;">
		  监管单位：<select id="conc_org"  class="sc_input"  style="width: 100px;">
		  <option value="">全部</option>
		  <option value="zwn">漳卫南局</option>
		  <option value="syj">上游局</option>
	  </select>
	  </div>

	  <input type="button" value="查询" class="s_input" onclick="maketable()">
  </div>
  
  
  	<center class="conent" style="width: 100%;height: 100%;">
		<div id="titleDiv" class="titleDiv"  style="">
		<span>数据校核</span>
		</div>
		<table id="table" class="bbTable"   style="table-layout: fixed;">
			<thead>
				<tr  id="realth"  >
					<th data-field="MP_CD" display="hide" style="display:none">MP_CD</th>
					<th data-field="WIU_NM"  style="width: 25%;" >取水户</th>
					<th data-field="WIUST_NM"  style="width: 25%;">取水站</th>
					<th data-field="MP_NM"   style="width: 25%;">取水点</th>
					<th data-field="DAY_MAX"  style="width: 15%;">日最大取水量（m³）</th>
					<th data-field="DAY_W" style="width: 15%;" >累计取水量（m³）</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</center>	

  </body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/sjjh/sjjh.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>
