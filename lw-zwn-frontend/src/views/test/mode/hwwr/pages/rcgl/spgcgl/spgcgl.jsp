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
	<title>审批过程管理</title>
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
	<div class="sc_div"  style="width: 155px;">
		许可证状态：<select id="cert_cond"  class="sc_input"  style="width: 60px;">
		<option value="">全部</option>
		<option value="1">新发</option>
		<option value="5">延续</option>
	</select>
	</div>
	<!-- 	  	<div class="sc_div"  class="sc_div"  style="width: 170px;">
                   取水用途：
                   <select id="int_use"  class="sc_input"  style="width: 90px;">
                      <option value="">全部</option>
                      <option value="生活">生活</option>
                      <option value="农业">农业</option>
                      <option value="工业">工业</option>
                      <option value="发电">发电</option>
                      <option value="供热">供热</option>
                      <option value="煤化工生产">煤化工生产</option>
                  </select>
              </div> -->
	<!--   		<div class="sc_div"  style="width: 240px;">
                时间：
                <input type="text"  id="int_bd"  class="sc_input sc_input_fix"  style="width: 80px;height: 38px;"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
                --
                <input type="text"  id="int_dl"  class="sc_input"  style="width: 80px;height: 38px;" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
            </div> -->
	<div class="sc_div"  style="width: 175px;">
		年份：
		<input type="text"  id="int_year"  class="sc_input"  style="width: 80px;" value="2018" onClick="WdatePicker({ dateFmt: 'yyyy'})">
	</div>

	<div class="sc_div"  style="width: 220px;">
		取水权人名称：<input type="text" id="wrp_nm"  class="sc_input" style="width: 80px;">
	</div>
	<input type="button" value="查询" class="s_input" onclick="maketable()">
	<input type="button" value="新建" class="sb_input" onclick="add()">

</div>

<div   class="conent" style="width: 100%;height: calc(100vh - 55px);">
	<!-- <div class="titleDiv" style="height:70px">
        <span id="cyear"></span><span></span>
    </div> -->
	<table id="table" class="bbTable"  style="overflow: hidden;width: 100%; table-layout: fixed;">
		<thead>
		<tr>
			<th data-field="WPC_CD" display="hide" style="display:none">取水许可证代码</th>
			<th data-field="no" >序号</th>
			<th data-field="WPC_SN"     style='width: 13%;' >取水许可证编号</th>
			<th data-field="WRP_NM">取水权人名称</th>
			<th data-field="CERT_COND"  display="hide" style="display:none">证件状态</th>
			<th data-field="CERT_NM">证件状态</th>
			<th data-field="TYEAR">年份</th>
			<th data-field="MAN_ORG_CD"  display="hide" style="display:none">监督管理单位代码</th>
			<!-- 					<th data-field="MAN_ORG_NM">监督管理单位</th> -->
			<th data-field="WIU_CD"  display="hide" style="display:none">取水户代码</th>
			<th data-field="WIU_NM">取水户</th>
			<!-- 					<th data-field="LR_NM">法人代表</th> -->
			<!-- 					<th data-field="APPR_ORG_CD"  display="hide" style="display:none">审批单位代码</th>
                                <th data-field="APPR_ORG_NM">审批单位</th> -->
			<!-- 					<th data-field="APPR_DT">审批日期</th>
                                <th data-field="INT_ADDR">审批地点</th> -->
			<th data-field="CHK_INT_MET">取水方式</th>
			<th data-field="WW">取水量(万m³)</th>
			<th data-field="INT_USE">取水用途</th>
			<th data-field="CHK_SOUR_TP">水源类型</th>
			<!-- 					<th data-field="RW_ADDR">退水地点</th>
                                <th data-field="RW_TP">退水方式</th>
                                <th data-field="RW_W">退水量</th>
                                <th data-field="RW_WQ_REQ">退水水质要求</th> -->
			<th data-field="INT_BD">取水起始日期</th>
			<th data-field="INT_DL">取水终止日期</th>
			<th data-field="control">操作</th>
			<th data-field="dlfile">附件下载</th>
		</tr>
		</thead>
		<tbody>
		</tbody>
	</table>

	<div id="echart" style="height:320px;width:400px;margin-top: 20px;margin-bottom: 20px;">

	</div>

</div>

</body>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/spgcgl.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
</html>