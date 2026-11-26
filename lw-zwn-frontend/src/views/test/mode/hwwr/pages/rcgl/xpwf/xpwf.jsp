<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="UTF-8">
<title>新批未发取水许可</title>
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
<style type="text/css">
	tr {
	    cursor: auto;
	}
	
	td {
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	}
	
	.deldiv  {
	    width: 30px;
	    height: 30px;
	    background-repeat: no-repeat;
	    background-image: url(./icon/del.png);
	    float: left;
	    cursor: pointer;
	    margin-left:12px;
	}
	
	.editdiv  {
	    width: 30px;
	    height: 30px;
	    background-repeat: no-repeat;
	    background-image: url(./icon/edit.png);
    	float: left;
    	cursor: pointer;
	}
</style>
</head>
<body>


<div class="searchDiv">
		<div class="sc_div"  style="width: 175px;">
			年份：
			<input type="text"  id="nyear"  class="sc_input"  style="width: 80px;" value="2018" onClick="WdatePicker({ dateFmt: 'yyyy'})">
		</div>
		
		<div class="sc_div"  style="width: 220px;">
			取水行政许可名称：<input type="text" id="wpc_nm"  class="sc_input" style="width: 80px;">
   	 	</div>
		<input type="button" value="查询" class="s_input" onclick="maketable()">
		<input type="button" value="新建" class="sb_input" onclick="add()">
	</div>
	
	<center   class="conent" style="width: 100%;height: calc(100% - 55px);">
		<table id="table" class="bbTable"  style="width: 100%;position: relative;table-layout: fixed;">
			<thead>
				<tr>
					<th data-field="no" >序号</th>
					<th data-field="wpc_cd" display="hide" style="display:none">取水许可证代码</th>
					<th data-field="wpc_nm"     style='width: 13%;' >取水行政许可名称</th>
					<th data-field="nyear"     style='width: 10%;' >申请年份</th>
					<th data-field="ww">年取用水总量</th>
					<th data-field="contact"  >联系方式</th>
					<th data-field="cert" display="hide" style="display:none" >是否已发</th>
					<th data-field="iscert"  >是否已发</th>
					<th data-field="control">操作</th>
					<th data-field="dlfile">附件下载</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>


</body>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/xpwf/xpwf.js"></script>
</html>