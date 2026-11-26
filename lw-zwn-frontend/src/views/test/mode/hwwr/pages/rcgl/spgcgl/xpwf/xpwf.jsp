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
	<title>取水许可审批</title>
	<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
	<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
	<style type="text/css">
		tr {
			cursor: auto;
		}
		th {
			/*background-clip: padding-box*/
			background-color: white;
		}

		td {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			background-color: white;
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

		::-webkit-scrollbar {
			width: 10px;
			height: 10px;
		}

		::-webkit-scrollbar-thumb {
			background-color: #cacdce;
		}

		.conent {
			overflow: auto;
		}

		.bbTable {
			border-collapse: separate;
		}

	</style>
</head>
<body>

<div class="searchDiv">

	<div class="sc_div"  style="width: 205px;">
		发证申请时间: <input type="text" id="year" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
	</div>

	<div class="sc_div"  style="width: 135px;">
		类型:<select id="type_id"  class="sc_input"  style="width: 60px;">
			<option value="">全部</option>
<%--			<option value="01">申请</option>--%>
<%--			<option value="02">补正</option>--%>
<%--			<option value="03">材料接收</option>--%>
<%--			<option value="04">受理</option>--%>
<%--			<option value="05">技术审查</option>--%>
<%--			<option value="06">修改报告接收</option>--%>
<%--			<option value="07">许可决定</option>--%>
			<option value="08">发证申请</option>
			<option value="09">工程核验</option>
			<option value="10">制证</option>
		</select>
	</div>

	<div class="sc_div"  style="width: 220px;">
		申请人：<input type="text" id="apply_nm"  class="sc_input" style="width: 150px;">
	</div>

	<div class="sc_div"  style="width: 155px;">
		行政区：<select id="ad_nm"  class="sc_input"  style="width: 60px;">
		<option value="">全部</option>
		<option value="北京">北京</option>
		<option value="天津">天津</option>
		<option value="河北">河北</option>
		<option value="山西">山西</option>
		<option value="河南">河南</option>
		<option value="山东">山东</option>
		<option value="内蒙">内蒙</option>
		<option value="辽宁">辽宁</option>
	</select>
	</div>

	<div class="sc_div"  style="width: 220px;">
		水资源分区：<select id="wrz_nm"  class="sc_input"  style="width: 120px;">
		<option value="">全部</option>
		<option value="滦河及冀东沿海">滦河及冀东沿海</option>
		<option value="海河北系">海河北系</option>
		<option value="海河南系">海河南系</option>
		<option value="徒骇马颊河（二级）">徒骇马颊河（二级）</option>
	</select>
	</div>

	<div class="sc_div"  style="width: 160px;">
		取水用途：<input type="text" id="int_use"  class="sc_input" style="width: 60px;">
	</div>

	<input type="button" value="查询" class="s_input" onclick="maketable()">
	<input type="button" value="新建" class="sb_input" onclick="add()">

</div>

<div  class ='induction' style="width: 100%;height:30px;">
<%--	取水许可申请新批未发共计 <span id="total">0</span>个。--%>
	取水许可发证申请了<span id="fazhengshenqing">0</span>个，
	工程核验了<span id="gongchengheyan">0</span>个，
	制证了<span id="zhizheng">0</span>个。
</div>


<%--<div class="conent" style="width: 100%;height: calc(100vh - 110px);">--%>
<div class="conent" style="width: 100%;height: calc(100vh - 150px);">
	<table id="table" class="bbTable"  style="overflow: hidden;table-layout: fixed;width: 2000px;">
		<thead>
		<tr>
			<th data-field="id" display="hide" style="display:none">id</th>
			<th data-field="no"  style="width: 50px;" >序号</th>
			<th data-field="apply_nm"  style="width: 230px;">申请人</th>
			<th data-field="type_id" display="hide" style="display:none">取水许可管理动态信息id</th>
			<th data-field="type_nm" style="width: 200px;" >取水许可管理动态信息</th>
			<th data-field="control" style="width: 80px;" >操作</th>
			<th data-field="ad_nm" style="width: 80px;" >行政区</th>
			<th data-field="wrz_nm" style="width: 100px;" >水资源<br>二级分区</th>
			<th data-field="th_level" style="width: 100px;" >水资源<br>三级分区</th>
			<th data-field="int_nm" style="width: 230px;" >取水口</th>
			<th data-field="int_addr_d" style="width: 230px;" >取水口所在地</th>
			<th data-field="int_addr_map" style="width: 130px;" >取水口经纬度</th>
			<th data-field="chk_int_met" style="width: 80px;" >取水方式</th>
			<th data-field="wf_nm" style="width: 100px;" >取水水源</th>
			<th data-field="ww" style="width: 100px;" >申请水量（万m3）</th>
			<th data-field="int_use" style="width: 100px;" >取水用途</th>
			<th data-field="max_q" style="width: 130px;" >取水工程最大流量(m3/秒)</th>
			<th data-field="irr_a" style="width: 130px;" >灌溉面积及用水规模（万亩）</th>
			<th data-field="rw_addr" style="width: 230px;" >退水地点</th>
			<th data-field="rw_addr_map" style="width: 100px;" >退水口经纬度</th>
			<th data-field="rw_w" style="width: 100px;" >退水量（t/d)</th>
			<th data-field="rw_wq_req" style="width: 100px;" >退水水质要求</th>
			<th data-field="deter_tm" style="width: 130px;">取水许可决定时间</th>
			<th data-field="verf_tm"  style="width: 100px;">核验时间</th>
			<th data-field="check_merb"  style="width: 100px;">核验组成员</th>
			<th data-field="check_grop" style="width: 100px;">核验组</th>
			<%--<th data-field="type_id" display="hide" style="display:none">取水许可管理动态信息id</th>
			<th data-field="type_nm">取水许可管理动态信息</th>
			<th data-field="control">操作</th>--%>
		</tr>
		</thead>
		<tbody>
		</tbody>
	</table>

</div>

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
<script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/xpwf/xpwf.js"></script>
</html>